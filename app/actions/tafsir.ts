'use server';

import fs from 'fs/promises';
import path from 'path';

interface TafsirEntry {
    surah: number;
    ayah: number;
    tafsir: string;
}

// Point to public directory for static assets (better for Vercel/Publishing)
const DATA_DIR = path.join(process.cwd(), 'public', 'tafsir');

// Optimized helper to get all available Tafsir files for a Surah
async function getAvailableTafsirAyahs(surah: number): Promise<number[]> {
    try {
        const files = await fs.readdir(DATA_DIR);
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
        console.error("Error reading tafsir directory", e);
        return [];
    }
}

export async function getLocalTafsir(surah: number, ayah: number): Promise<string | null> {
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
        const filePath = path.join(DATA_DIR, `${surah}_${ayah}.json`);
        // Check exact match
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            return JSON.parse(content).tafsir;
        } catch {
            // If not found, we shouldn't scan 300 files.
            // But if we want to support "range", we'd need to know the previous file.
            // Let's rely on `getAvailableTafsirAyahs` even here:
            const available = await getAvailableTafsirAyahs(surah);
            const meaningful = available.filter(a => a <= ayah).pop();
            if (meaningful) {
                const fallbackPath = path.join(DATA_DIR, `${surah}_${meaningful}.json`);
                const content = await fs.readFile(fallbackPath, 'utf-8');
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

        if (availableAyahs.length === 0) {
            return [];
        }

        const maxAyahStr = availableAyahs[availableAyahs.length - 1]; // e.g. 8
        // We only generate entries up to the last available Tafsir file. 
        // We don't know the real end of Surah here, but going beyond the last tafsir file 
        // would just repeat the last tafsir (if we kept the logic) or be empty. 
        // Safest is to stop at the last file's index.
        // Actually, normally the last tafsir file covers the rest. 
        // E.g. 95_8 covers 8. 
        // If we stop at 8, we are fine.

        // Cache content to avoid re-reading files
        const contentCache = new Map<number, string>();

        // Helper to get content
        const getContent = async (a: number) => {
            if (contentCache.has(a)) return contentCache.get(a)!;
            const p = path.join(DATA_DIR, `${surah}_${a}.json`);
            const txt = await fs.readFile(p, 'utf-8');
            const json = JSON.parse(txt);
            contentCache.set(a, json.tafsir);
            return json.tafsir;
        }

        let currentTafsirAyahIndex = 0;

        // Loop from 1 to the last available ayah file
        for (let i = 1; i <= maxAyahStr; i++) {
            // Do we have a new file for this ayah?
            // availableAyahs is sorted e.g. [1, 4, 8]
            // i=1: match 1. Use 1.
            // i=2: no match. Use 1.
            // i=3: no match. Use 1.
            // i=4: match 4. Use 4.

            // Check if 'i' is in availableAyahs
            // Since it's sorted, we can check if i >= availableAyahs[nextIndex]

            // Actually, we want: "Find largest number in availableAyahs that is <= i"
            // Since we iterate i upward, we can just track current pointer.

            if (currentTafsirAyahIndex + 1 < availableAyahs.length) {
                if (i >= availableAyahs[currentTafsirAyahIndex + 1]) {
                    currentTafsirAyahIndex++;
                }
            }

            const fileAyah = availableAyahs[currentTafsirAyahIndex];

            // If i < fileAyah (e.g. i=1, first file is 5), then we have no tafsir yet?
            // But usually 1 starts at 1.
            if (i >= fileAyah) {
                const tafsir = await getContent(fileAyah);
                entries.push({ surah, ayah: i, tafsir });
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
