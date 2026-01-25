
const TAFSIR_INDEX_URL = '/tafsir/index.json';

// Singleton promise to cache the index fetch
let indexPromise: Promise<string[]> | null = null;

export const getTafsirIndex = (): Promise<string[]> => {
    if (indexPromise) return indexPromise;

    indexPromise = fetch(TAFSIR_INDEX_URL)
        .then(res => {
            if (!res.ok) throw new Error('Failed to load Tafsir index');
            return res.json();
        })
        .catch(err => {
            console.error(err);
            indexPromise = null; // Reset on failure
            return [];
        });

    return indexPromise;
};

/**
 * Finds the Tafsir file key (e.g., "2_255") for a given verse.
 * If exact match doesn't exist, finds the nearest previous verse in the same Surah.
 */
export const resolveTafsirKey = (index: string[], surah: number, ayah: number): string | null => {
    const targetKey = `${surah}_${ayah}`;
    const targetValue = surah * 1000 + ayah; // Simple numeric value for comparison

    // Optimization: Since keys are sorted "Surah_Ayah", we can filter by Surah first or just iterate.
    // But string comparison "10_..." vs "2_..." sort order might be tricky in pure string sort if not padded.
    // The generation script does: s1 !== s2 ? s1 - s2 : a1 - a2. So it's logically sorted by value, NOT string.
    // BUT the index.json is just an array of strings.
    // "2_255" comes after "2_254".
    // We assume the index array IS sorted correctly by the script.

    // We can iterate backwards or binary search. 
    // Given 6000 items, simple findLast is fast enough.

    // Logic: Find the entry where entry_surah == surah AND entry_ayah <= ayah
    // The "closest" one (largest ayah) wins.

    // Let's do a reverse linear search, allowing us to stop early.
    for (let i = index.length - 1; i >= 0; i--) {
        const key = index[i];
        const [sStr, aStr] = key.split('_');
        const s = parseInt(sStr);
        const a = parseInt(aStr);

        if (s === surah) {
            if (a === ayah) return key; // Exact match
            if (a < ayah) return key;   // Previous match (Grouped)
        } else if (s < surah) {
            // We've gone past the surah, so no match found in that surah
            return null;
        }
    }

    return null;
};

export interface TafsirContent {
    surah: number;
    ayah: number;
    tafsir: string;
}

export const fetchTafsirContent = async (surah: number, ayah: number): Promise<string | null> => {
    const index = await getTafsirIndex();
    const key = resolveTafsirKey(index, surah, ayah);

    if (!key) return null;

    try {
        const res = await fetch(`/tafsir/${key}.json`);
        if (!res.ok) return null;
        const data = await res.json() as TafsirContent;
        return data.tafsir;
    } catch (e) {
        console.error("Error fetching tafsir file", e);
        return null;
    }
};
