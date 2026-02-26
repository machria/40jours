import path from 'path';
import fs from 'fs/promises';

export interface TafsirEntry {
    surah: number;
    ayah: number;
    tafsir: string;
}

// Module-level caches : chargés une seule fois par instance Lambda
let surahsCache: any[] | null = null;
let tafsirIndexCache: Record<string, number[]> | null = null;

// Helper to get number of ayahs in a surah
async function getSurahAyahCount(surah: number): Promise<number> {
    try {
        if (!surahsCache) {
            const p = path.join(process.cwd(), 'public', 'surahs.json');
            const file = await fs.readFile(p, 'utf-8');
            surahsCache = JSON.parse(file);
        }
        const s = surahsCache!.find((x: any) => x.number === surah);
        return s ? s.numberOfAyahs : 300;
    } catch (e) {
        return 300;
    }
}

// Helper to get all available Tafsir files for a Surah
async function getAvailableTafsirAyahs(surah: number): Promise<number[]> {
    try {
        if (!tafsirIndexCache) {
            const indexPath = path.join(process.cwd(), 'public', 'tafsir', 'index.json');
            const indexContent = await fs.readFile(indexPath, 'utf-8');
            tafsirIndexCache = JSON.parse(indexContent);
        }
        return tafsirIndexCache![surah] || [];
    } catch (e) {
        console.error("Error reading tafsir index", e);
        return [];
    }
}

// Get Tafsir for a single Ayah
export async function getLocalTafsirData(surah: number, ayah: number): Promise<string | null> {
    try {
        // Direct file access
        const filePath = path.join(process.cwd(), 'public', 'tafsir', `${surah}_${ayah}.json`);

        try {
            const content = await fs.readFile(filePath, 'utf-8');
            return JSON.parse(content).tafsir;
        } catch {
            // Fallback strategy: find the previous available Tafsir file
            const available = await getAvailableTafsirAyahs(surah);
            const meaningful = available.filter(a => a <= ayah).pop();
            if (meaningful) {
                const fallbackPath = path.join(process.cwd(), 'public', 'tafsir', `${surah}_${meaningful}.json`);
                const content = await fs.readFile(fallbackPath, 'utf-8');
                return JSON.parse(content).tafsir;
            }
        }
        return null;
    } catch (error) {
        return null;
    }
}

// Get Tafsir for a whole Surah
export async function getSurahTafsirData(surah: number): Promise<TafsirEntry[]> {
    const entries: TafsirEntry[] = [];

    try {
        const availableAyahs = await getAvailableTafsirAyahs(surah);
        const totalAyahs = await getSurahAyahCount(surah);

        if (availableAyahs.length === 0) {
            return [];
        }

        // Cache content to avoid re-reading files in the same request loop if deemed necessary,
        // though here we are iterating sequentially.
        // We actually need to read each unique file only once.

        for (let i = 0; i < availableAyahs.length; i++) {
            const startAyah = availableAyahs[i];
            const nextFileStart = availableAyahs[i + 1];

            // Read the file
            let content: { tafsir: string, ayah_end?: number } | null = null;
            try {
                const p = path.join(process.cwd(), 'public', 'tafsir', `${surah}_${startAyah}.json`);
                const txt = await fs.readFile(p, 'utf-8');
                const json = JSON.parse(txt);
                content = { tafsir: json.tafsir, ayah_end: json.ayah_end };
            } catch (e) {
                continue; // Skip if file read fails
            }

            if (!content) continue;

            const { tafsir, ayah_end } = content;

            let endAyah: number;

            if (ayah_end) {
                endAyah = ayah_end;
            } else {
                if (nextFileStart) {
                    endAyah = nextFileStart - 1;
                } else {
                    endAyah = totalAyahs;
                }
            }

            // Safety clamp
            if (nextFileStart && endAyah >= nextFileStart) {
                endAyah = nextFileStart - 1;
            }
            if (endAyah > totalAyahs) endAyah = totalAyahs;

            // Expand range
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
