'use server';


import path from 'path';

interface TafsirEntry {
    surah: number;
    ayah: number;
    tafsir: string;
}

// Helper to get app URL
function getAppUrl() {
    if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return 'http://localhost:3000';
}

// Helper to get number of ayahs in a surah to cap the range
async function getSurahAyahCount(surah: number): Promise<number> {
    try {
        const appUrl = getAppUrl();
        const res = await fetch(`${appUrl}/surahs.json`, { next: { revalidate: 3600 } });
        if (res.ok) {
            const surahs = await res.json();
            const s = surahs.find((x: any) => x.number === surah);
            return s ? s.numberOfAyahs : 300;
        }
    } catch (e) { }

    // Fallback FS
    try {
        const p = path.join(process.cwd(), 'public', 'surahs.json');
        const fs = (await import('fs')).default;
        const file = await fs.promises.readFile(p, 'utf-8');
        const surahs = JSON.parse(file);
        const s = surahs.find((x: any) => x.number === surah);
        return s ? s.numberOfAyahs : 300;
    } catch (e) { return 300; }
}

// Optimized helper to get all available Tafsir files for a Surah
async function getAvailableTafsirAyahs(surah: number): Promise<number[]> {
    // Strategy:
    // 1. Try to fetch from index.json (Runtime / Vercel)
    // 2. Fallback to fs (Build time / Local Dev if fetch fails)
    try {
        // Try Fetch (Runtime)
        const appUrl = getAppUrl();
        const res = await fetch(`${appUrl}/tafsir/index.json`, { next: { revalidate: 3600 } });
        if (res.ok) {
            const index = await res.json();
            return index[surah] || [];
        }
    } catch (e) {
        // Fallback to FS
    }

    try {
        // Build Time / FS Fallback
        const indexPath = path.join(process.cwd(), 'public', 'tafsir', 'index.json');
        const fs = (await import('fs')).default;
        const indexContent = await fs.promises.readFile(indexPath, 'utf-8');
        const index = JSON.parse(indexContent);
        return index[surah] || [];
    } catch (e) {
        console.error("Error reading tafsir index", e);
        return [];
    }
}

export async function getLocalTafsir(surah: number, ayah: number): Promise<string | null> {
    try {
        // Try exact match first via fetch if possible, effectively reusing shared cache logic
        // But for consistency with legacy, we try FS or fallback.
        const fs = (await import('fs')).default;
        // Avoid using a top-level constant for DATA_DIR to prevent "Overly broad patterns" build warning
        const filePath = path.join(process.cwd(), 'public', 'tafsir', `${surah}_${ayah}.json`);

        try {
            const content = await fs.promises.readFile(filePath, 'utf-8');
            return JSON.parse(content).tafsir;
        } catch {
            const available = await getAvailableTafsirAyahs(surah);
            const meaningful = available.filter(a => a <= ayah).pop();
            if (meaningful) {
                const fallbackPath = path.join(process.cwd(), 'public', 'tafsir', `${surah}_${meaningful}.json`);
                const content = await fs.promises.readFile(fallbackPath, 'utf-8');
                return JSON.parse(content).tafsir;
            }
        }
        return null;
    } catch (error) {
        return null;
    }
}


export async function getSurahTafsir(surah: number): Promise<TafsirEntry[]> {
    const entries: TafsirEntry[] = [];

    try {
        const availableAyahs = await getAvailableTafsirAyahs(surah);
        const totalAyahs = await getSurahAyahCount(surah);

        if (availableAyahs.length === 0) {
            return [];
        }

        // Cache content to avoid re-reading files
        const contentCache = new Map<number, { tafsir: string, ayah_end?: number }>();

        // Helper to get content
        const getContent = async (a: number) => {
            if (contentCache.has(a)) return contentCache.get(a)!;

            // Try Fetch First
            try {
                const appUrl = getAppUrl();
                const res = await fetch(`${appUrl}/tafsir/${surah}_${a}.json`, {
                    next: { revalidate: 3600 }
                });
                if (res.ok) {
                    const json = await res.json();
                    const data = { tafsir: json.tafsir, ayah_end: json.ayah_end };
                    contentCache.set(a, data);
                    return data;
                }
            } catch (e) { }

            // Fallback to FS (for Build time or if fetch fails)
            try {
                // Inline path construction to avoid build warnings
                const p = path.join(process.cwd(), 'public', 'tafsir', `${surah}_${a}.json`);
                const fs = (await import('fs')).default;
                const txt = await fs.promises.readFile(p, 'utf-8');
                const json = JSON.parse(txt);
                const data = { tafsir: json.tafsir, ayah_end: json.ayah_end };
                contentCache.set(a, data);
                return data;
            } catch (e) {
                return null;
            }
        }

        // Iterate over available files
        for (let i = 0; i < availableAyahs.length; i++) {
            const startAyah = availableAyahs[i];
            const nextFileStart = availableAyahs[i + 1]; // undefined if last

            const content = await getContent(startAyah);
            if (!content) continue;

            const { tafsir, ayah_end } = content;

            let endAyah: number;

            if (ayah_end) {
                endAyah = ayah_end;
            } else {
                if (nextFileStart) {
                    endAyah = nextFileStart - 1;
                } else {
                    // Last file - extend to end of Surah
                    endAyah = totalAyahs;
                }
            }

            // Safety clamp
            if (nextFileStart && endAyah >= nextFileStart) {
                endAyah = nextFileStart - 1;
            }
            if (endAyah > totalAyahs) endAyah = totalAyahs;

            // Loop through the range for THIS file
            for (let a = startAyah; a <= endAyah; a++) {
                entries.push({ surah, ayah: a, tafsir });
            }
        }

        return entries;

    } catch (e) {
        console.error("Error generating Surah Tafsir", e);
        return [];
    }
}

export async function getTafsirBatch(ayahs: { surah: number; ayah: number }[]): Promise<{ surah: number; ayah: number; tafsir: string }[]> {
    // This function is less commonly used for full page, but we can optimize it too if needed.
    // For now, map simple load.
    const results = await Promise.all(ayahs.map(async (a) => {
        const tafsir = await getLocalTafsir(a.surah, a.ayah);
        return {
            surah: a.surah,
            ayah: a.ayah,
            tafsir: tafsir || "Tafsir non disponible."
        };
    }));
    return results;
}
