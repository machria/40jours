'use server';

import fs from 'fs/promises';
import path from 'path';

interface TafsirEntry {
    surah: number;
    ayah: number;
    tafsir: string;
}

// Use public directory for reliable Vercel deployment access
const DATA_DIR = path.join(process.cwd(), 'public', 'tafsir');

export async function getLocalTafsir(surah: number, ayah: number): Promise<string | null> {
    try {
        let currentAyah = ayah;
        // Search backwards until we find a Tafsir file or reach the start of the Surah
        while (currentAyah > 0) {
            const filePath = path.join(DATA_DIR, `${surah}_${currentAyah}.json`);
            try {
                const content = await fs.readFile(filePath, 'utf-8');
                const entry = JSON.parse(content);
                return entry.tafsir;
            } catch (e) {
                // File not found, try previous ayah
                currentAyah--;
            }
        }
        return null;
    } catch (error) {
        return null;
    }
}

export async function getSurahTafsir(surah: number): Promise<TafsirEntry[]> {
    const entries: TafsirEntry[] = [];
    // Read files sequentially until we hit a missing one (assuming sequential ayahs)
    // Max ayahs in a surah is 286 (Al-Baqarah)
    let ayah = 1;
    const MAX_AYAHS = 300;

    while (ayah <= MAX_AYAHS) {
        const tafsir = await getLocalTafsir(surah, ayah);
        if (tafsir) {
            entries.push({ surah, ayah, tafsir });
        } else {
            // Check if we really ended or just missing one? 
            // Usually sequential. If ayah 1 exists, and 2 misses, maybe just missing.
            // But we typically stop.
            // Let's rely on checking file existence more efficiently if possible?
            // For now, this is okay for a server action.

            // Optimization: Double check if next one exists to be sure it's end of surah vs missing ayah.
            // If current is missing, and next is missing, likely end.
            const next = await getLocalTafsir(surah, ayah + 1);
            if (!next) break;
        }
        ayah++;
    }
    return entries;
}

export async function getTafsirBatch(ayahs: { surah: number; ayah: number }[]): Promise<{ surah: number; ayah: number; tafsir: string }[]> {
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
