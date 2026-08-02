import path from 'path';
import fs from 'fs/promises';

export type TafsirSourceId = 'ibn_kathir' | 'al_mukhtasar' | 'as_sadi' | 'al_jalalayn';

export interface TafsirEntry {
    surah: number;
    ayah: number;
    tafsir: string;
    sourceId?: TafsirSourceId;
}

let surahsCache: any[] | null = null;
let tafsirIndexCache: Record<string, Record<string, number[]>> = {};

// Helper to get number of ayahs in a surah
async function getSurahAyahCount(surah: number): Promise<number> {
    try {
        if (!surahsCache) {
            const p = path.join(process.cwd(), 'data', 'surahs.json');
            try {
                const file = await fs.readFile(p, 'utf-8');
                surahsCache = JSON.parse(file);
            } catch {
                const altP = path.join(process.cwd(), 'public', 'surahs.json');
                const file = await fs.readFile(altP, 'utf-8');
                surahsCache = JSON.parse(file);
            }
        }
        const s = surahsCache!.find((x: any) => x.number === surah);
        return s ? s.numberOfAyahs : 300;
    } catch (e) {
        return 300;
    }
}

// Get available Tafsir files for a Surah and specific Tafsir source
async function getAvailableTafsirAyahs(surah: number, tafsirId: TafsirSourceId = 'ibn_kathir'): Promise<number[]> {
    try {
        if (!tafsirIndexCache[tafsirId]) {
            const indexPath = path.join(process.cwd(), 'data', 'tafsir', tafsirId, 'index.json');
            try {
                const indexContent = await fs.readFile(indexPath, 'utf-8');
                tafsirIndexCache[tafsirId] = JSON.parse(indexContent);
            } catch {
                const rootIndexPath = path.join(process.cwd(), 'data', 'tafsir', 'index.json');
                const rootIndexContent = await fs.readFile(rootIndexPath, 'utf-8');
                tafsirIndexCache[tafsirId] = JSON.parse(rootIndexContent);
            }
        }
        return tafsirIndexCache[tafsirId][surah] || [];
    } catch (e) {
        return [];
    }
}

// Get Tafsir for a single Ayah with source support in data/ (Vercel CI/CD Compatible)
export async function getLocalTafsirData(
    surah: number, 
    ayah: number, 
    tafsirId: TafsirSourceId = 'ibn_kathir'
): Promise<string | null> {
    try {
        // 1. Try path in data/tafsir/<tafsirId>/<surah>_<ayah>.json
        const subfolderPath = path.join(process.cwd(), 'data', 'tafsir', tafsirId, `${surah}_${ayah}.json`);

        try {
            const content = await fs.readFile(subfolderPath, 'utf-8');
            return JSON.parse(content).tafsir;
        } catch {
            // 2. Fallback to root data/tafsir/<surah>_<ayah>.json
            if (tafsirId === 'ibn_kathir') {
                const rootPath = path.join(process.cwd(), 'data', 'tafsir', `${surah}_${ayah}.json`);
                try {
                    const rootContent = await fs.readFile(rootPath, 'utf-8');
                    return JSON.parse(rootContent).tafsir;
                } catch {
                    // Fallback strategy for range
                }
            }

            // 3. Fallback strategy: find the previous available Tafsir file
            const available = await getAvailableTafsirAyahs(surah, tafsirId);
            const meaningful = available.filter(a => a <= ayah).pop();
            if (meaningful) {
                const fallbackPath = path.join(process.cwd(), 'data', 'tafsir', tafsirId, `${surah}_${meaningful}.json`);
                try {
                    const content = await fs.readFile(fallbackPath, 'utf-8');
                    return JSON.parse(content).tafsir;
                } catch {
                    const rootFallback = path.join(process.cwd(), 'data', 'tafsir', `${surah}_${meaningful}.json`);
                    const content = await fs.readFile(rootFallback, 'utf-8');
                    return JSON.parse(content).tafsir;
                }
            }
        }
        return null;
    } catch (error) {
        return null;
    }
}

// Get Tafsir for a whole Surah with selected source
export async function getSurahTafsirData(
    surah: number, 
    tafsirId: TafsirSourceId = 'ibn_kathir'
): Promise<TafsirEntry[]> {
    const entries: TafsirEntry[] = [];

    try {
        const availableAyahs = await getAvailableTafsirAyahs(surah, tafsirId);
        const totalAyahs = await getSurahAyahCount(surah);

        if (availableAyahs.length === 0) {
            return [];
        }

        for (let i = 0; i < availableAyahs.length; i++) {
            const startAyah = availableAyahs[i];
            const nextFileStart = availableAyahs[i + 1];

            let content: { tafsir: string, ayah_end?: number } | null = null;
            try {
                const p = path.join(process.cwd(), 'data', 'tafsir', tafsirId, `${surah}_${startAyah}.json`);
                const txt = await fs.readFile(p, 'utf-8');
                const json = JSON.parse(txt);
                content = { tafsir: json.tafsir, ayah_end: json.ayah_end };
            } catch (e) {
                try {
                    const p = path.join(process.cwd(), 'data', 'tafsir', `${surah}_${startAyah}.json`);
                    const txt = await fs.readFile(p, 'utf-8');
                    const json = JSON.parse(txt);
                    content = { tafsir: json.tafsir, ayah_end: json.ayah_end };
                } catch {
                    continue;
                }
            }

            if (!content) continue;

            const { tafsir, ayah_end } = content;
            let endAyah: number;

            if (ayah_end) {
                endAyah = ayah_end;
            } else if (nextFileStart) {
                endAyah = nextFileStart - 1;
            } else {
                endAyah = totalAyahs;
            }

            if (nextFileStart && endAyah >= nextFileStart) {
                endAyah = nextFileStart - 1;
            }
            if (endAyah > totalAyahs) endAyah = totalAyahs;

            for (let a = startAyah; a <= endAyah; a++) {
                entries.push({ surah, ayah: a, tafsir, sourceId: tafsirId });
            }
        }

        return entries;

    } catch (e) {
        console.error("Error generating Surah Tafsir", e);
        return [];
    }
}
