'use server';

import fs from 'fs/promises';
import path from 'path';

export type TafsirSource = 'ibn-kathir' | 'al-jalalayn' | 'asbab-al-nuzul' | 'ibn-kathir-en' | 'maarif-ul-quran';

interface TafsirEntry {
    surah: number;
    ayah: number;
    tafsir: string;
}

function getDataDir(source: TafsirSource = 'ibn-kathir'): string {
    if (source === 'al-jalalayn') {
        return path.join(process.cwd(), 'data', 'tafsir', 'fr-al-jalalayn');
    }
    if (source === 'asbab-al-nuzul') {
        return path.join(process.cwd(), 'data', 'tafsir', 'fr-asbab-al-nuzul');
    }
    if (source === 'ibn-kathir-en') {
        return path.join(process.cwd(), 'data', 'tafsir', 'fr-ibn-kathir-en');
    }
    if (source === 'maarif-ul-quran') {
        return path.join(process.cwd(), 'data', 'tafsir', 'fr-maarif-ul-quran');
    }
    return path.join(process.cwd(), 'public', 'tafsir');
}

// Optimized helper to get all available Tafsir files for a Surah
async function getAvailableTafsirAyahs(surah: number, source: TafsirSource = 'ibn-kathir'): Promise<number[]> {
    try {
        const dataDir = getDataDir(source);
        const files = await fs.readdir(dataDir);
        // entries like "95_1.json"
        const prefix = `${surah}_`;
        const ayahs = files
            .filter(f => f.startsWith(prefix) && f.endsWith('.json'))
            .map(f => {
                const part = f.replace(prefix, '').replace('.json', '');
                return parseInt(part, 10);
            })
            .filter(n => !isNaN(n))
            .sort((a, b) => a - b);

        return ayahs;
    } catch (e) {
        console.error(`Error reading tafsir directory for ${source}`, e);
        return [];
    }
}

export async function getLocalTafsir(surah: number, ayah: number, source: TafsirSource = 'ibn-kathir'): Promise<string | null> {
    // This function is kept for backward compatibility or single-fetch if needed,
    // but relies on direct file access which is fast if we know it exists.
    // For single fetch, we might fallback to the old logic or just check exact match?
    // User complaint was about the page load (batch).
    // Let's implement smart check: try exact file, if not, find previous available in dir?
    // Scanning dir for ONE ayah is expensive. 
    // But page load uses getSurahTafsir.

    // Simplistic legacy behavior (search backwards) but usually only called by `getSurahTafsir` which we optimize next.
    // If called isolated, we try exact match first.
    try {
        const dataDir = getDataDir(source);
        const filePath = path.join(dataDir, `${surah}_${ayah}.json`);
        // Check exact match
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            return JSON.parse(content).tafsir || JSON.parse(content).text; // Support both tafsir and text fields
        } catch {
            // If not found, we shouldn't scan 300 files.
            // But if we want to support "range", we'd need to know the previous file.
            // Let's rely on `getAvailableTafsirAyahs` even here:
            const available = await getAvailableTafsirAyahs(surah, source);
            const meaningful = available.filter(a => a <= ayah).pop();
            if (meaningful) {
                const fallbackPath = path.join(dataDir, `${surah}_${meaningful}.json`);
                const content = await fs.readFile(fallbackPath, 'utf-8');
                const json = JSON.parse(content);
                return json.tafsir || json.text;
            }
        }
        return null;
    } catch (error) {
        return null;
    }
}

export async function getSurahTafsir(surah: number, source: TafsirSource = 'ibn-kathir'): Promise<TafsirEntry[]> {
    const entries: TafsirEntry[] = [];

    try {
        const availableAyahs = await getAvailableTafsirAyahs(surah, source);

        if (availableAyahs.length === 0) {
            return [];
        }

        // We scan at least until the last start-ayah. 
        // We'll extend if the last file has an ayah_end greater than its start.
        // But for the loop limit, we can start with maxAyahStr and extend dynamically if needed, 
        // OR just loop until a safe upper bound (e.g. 300) since we break when no files left?
        // Actually, "availableAyahs" gives us the start points.
        // We can just iterate through availableAyahs and fill the gaps.

        const dataDir = getDataDir(source);

        // Cache content to avoid re-reading files
        const contentCache = new Map<number, { tafsir: string, ayah_end?: number }>();

        // Helper to get content
        const getContent = async (a: number) => {
            if (contentCache.has(a)) return contentCache.get(a)!;
            const p = path.join(dataDir, `${surah}_${a}.json`);
            try {
                const txt = await fs.readFile(p, 'utf-8');
                const json = JSON.parse(txt);
                const data = { tafsir: json.tafsir || json.text, ayah_end: json.ayah_end };
                contentCache.set(a, data);
                return data;
            } catch (e) {
                return null;
            }
        }

        // Better approach: Iterate over available files, determining the range for each.
        for (let i = 0; i < availableAyahs.length; i++) {
            const startAyah = availableAyahs[i];
            const nextStartAyah = availableAyahs[i + 1] || 9999; // 9999 effectively means "end of surah known files"

            const content = await getContent(startAyah);
            if (!content) continue;

            const { tafsir, ayah_end } = content;

            // Determine the range this file *should* cover.
            // Priority 1: Explicit 'ayah_end' from JSON.
            // Priority 2: Until the next file starts (implicit grouping).

            let endAyah: number;

            if (ayah_end) {
                endAyah = ayah_end;
            } else {
                // Determine implicit end.
                // If next file is at 5, and we are at 1. Implicitly covers 1,2,3,4.
                endAyah = nextStartAyah - 1;
            }

            // Safety: Don't overlap into the next file's territory if ayah_end is wildly wrong (unlikely but safe).
            if (endAyah >= nextStartAyah) {
                endAyah = nextStartAyah - 1;
            }

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

export async function getTafsirBatch(ayahs: { surah: number; ayah: number }[], source: TafsirSource = 'ibn-kathir'): Promise<{ surah: number; ayah: number; tafsir: string }[]> {
    // This function is less commonly used for full page, but we can optimize it too if needed.
    // For now, map simple load.
    const results = await Promise.all(ayahs.map(async (a) => {
        const tafsir = await getLocalTafsir(a.surah, a.ayah, source);
        return {
            surah: a.surah,
            ayah: a.ayah,
            tafsir: tafsir || "Tafsir non disponible."
        };
    }));
    return results;
}
