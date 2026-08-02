'use server';

import { getLocalTafsirData, getSurahTafsirData, TafsirSourceId } from '@/lib/tafsir-data';
import path from 'path';
import fs from 'fs/promises';
export interface TafsirEntry {
    surah: number;
    ayah: number;
    tafsir: string;
    sourceId?: TafsirSourceId;
}

/**
 * Get Tafsir for a specific Ayah with optional source selection.
 */
export async function getLocalTafsir(
    surah: number, 
    ayah: number, 
    tafsirId: TafsirSourceId = 'ibn_kathir'
): Promise<string | null> {
    return getLocalTafsirData(surah, ayah, tafsirId);
}

/**
 * Get full Tafsir for a Surah with optional source selection.
 */
export async function getSurahTafsir(
    surah: number, 
    tafsirId: TafsirSourceId = 'ibn_kathir'
) {
    return getSurahTafsirData(surah, tafsirId);
}

/**
 * Get batch Tafsir for multiple Ayahs.
 */
export async function getTafsirBatch(
    ayahs: { surah: number; ayah: number }[], 
    tafsirId: TafsirSourceId = 'ibn_kathir'
): Promise<{ surah: number; ayah: number; tafsir: string }[]> {
    const results = await Promise.all(ayahs.map(async (a) => {
        const tafsir = await getLocalTafsirData(a.surah, a.ayah, tafsirId);
        return {
            surah: a.surah,
            ayah: a.ayah,
            tafsir: tafsir || "Tafsir non disponible."
        };
    }));
    return results;
}

