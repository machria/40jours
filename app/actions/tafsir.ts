'use server';

import { getLocalTafsirData, getSurahTafsirData } from '@/lib/tafsir-data';
import { unstable_cache } from 'next/cache';

// Re-export type if needed by consumers
export interface TafsirEntry {
    surah: number;
    ayah: number;
    tafsir: string;
}

/**
 * Get Tafsir for a specific Ayah.
 * Wraps the direct fetch logic in a cache for better performance if reused.
 * Although for simple files, direct read is fast.
 */
export async function getLocalTafsir(surah: number, ayah: number): Promise<string | null> {
    return getLocalTafsirData(surah, ayah);
}

/**
 * Get full Tafsir for a Surah.
 * Uncached because Next.js static generation handles the page caching itself,
 * and unstable_cache has a 2MB limit which fails for long Surahs like Surah 2.
 */
export async function getSurahTafsir(surah: number) {
    return getSurahTafsirData(surah);
}

/**
 * Get batch Tafsir for multiple Ayahs.
 */
export async function getTafsirBatch(ayahs: { surah: number; ayah: number }[]): Promise<{ surah: number; ayah: number; tafsir: string }[]> {
    const results = await Promise.all(ayahs.map(async (a) => {
        const tafsir = await getLocalTafsirData(a.surah, a.ayah);
        return {
            surah: a.surah,
            ayah: a.ayah,
            tafsir: tafsir || "Tafsir non disponible."
        };
    }));
    return results;
}

