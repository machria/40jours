'use server';

import fs from 'fs/promises';
import path from 'path';

interface TafsirEntry {
    surah: number;
    ayah: number;
    ayah_end?: number; // Optional end of range
    tafsir: string;
}

async function getTafsirData(): Promise<TafsirEntry[]> {
    try {
        const filePath = path.join(process.cwd(), 'data', 'tafsir-fr.json');
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent) as TafsirEntry[];
    } catch (error) {
        console.error("Error reading tafsir file:", error);
        return [];
    }
}

export async function getLocalTafsir(surah: number, ayah: number): Promise<string | null> {
    const data = await getTafsirData();
    const entry = data.find(item => {
        if (item.surah !== surah) return false;
        const end = item.ayah_end || item.ayah;
        return ayah >= item.ayah && ayah <= end;
    });
    return entry ? entry.tafsir : null;
}

export async function getSurahTafsir(surah: number): Promise<TafsirEntry[]> {
    const data = await getTafsirData();
    const surahEntries = data.filter(item => item.surah === surah);

    // Expand ranges to ensure every verse has an entry if covered
    const expanded: TafsirEntry[] = [];
    surahEntries.forEach(entry => {
        const end = entry.ayah_end || entry.ayah;
        for (let a = entry.ayah; a <= end; a++) {
            expanded.push({
                surah: entry.surah,
                ayah: a,
                tafsir: entry.tafsir
            });
        }
    });

    return expanded.sort((a, b) => a.ayah - b.ayah);
}

export async function getTafsirBatch(ayahs: { surah: number; ayah: number }[]): Promise<{ surah: number; ayah: number; tafsir: string }[]> {
    const data = await getTafsirData();

    // Create a robust lookup map that handles ranges
    const map = new Map<string, string>();
    data.forEach(item => {
        const end = item.ayah_end || item.ayah;
        for (let a = item.ayah; a <= end; a++) {
            map.set(`${item.surah}:${a}`, item.tafsir);
        }
    });

    return ayahs.map(a => ({
        surah: a.surah,
        ayah: a.ayah,
        tafsir: map.get(`${a.surah}:${a.ayah}`) || "Tafsir bientôt disponible (veuillez exécuter le script de récupération)."
    }));
}
