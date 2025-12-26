
'use server';

import fs from 'fs';
import path from 'path';

// Types (Mirrors indexer output)
interface SearchIndexItem {
    id: string; // "s:a"
    an: string; // ar_norm
    fn: string; // fr_norm
    tn: string; // tafsir_norm
    s: number;
    a: number;
}

// Cache the index in memory in production?
// Next.js server actions are stateless, but module scope vars might persist in warm lambdas/containers.
let searchIndex: SearchIndexItem[] | null = null;

const INDEX_PATH = path.join(process.cwd(), 'data', 'search-index.json');

function normalizeArabic(text: string): string {
    if (!text) return "";
    let norm = text;
    norm = norm.replace(/[\u064B-\u065F\u0670]/g, "");
    norm = norm.replace(/[آإأٱ]/g, "ا");
    norm = norm.replace(/\u0640/g, "");
    return norm;
}

function normalizeFrench(text: string): string {
    if (!text) return "";
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function getIndex(): SearchIndexItem[] {
    if (searchIndex) return searchIndex;

    try {
        if (fs.existsSync(INDEX_PATH)) {
            const raw = fs.readFileSync(INDEX_PATH, 'utf-8');
            searchIndex = JSON.parse(raw);
            return searchIndex!;
        }
    } catch (e) {
        console.error("Failed to load search index", e);
    }
    return [];
}

export interface SearchResult {
    surah: number;
    ayah: number;
    matchType: 'arabic' | 'translation' | 'tafsir';
    snippet?: string; // We don't have snippets in index, we only have refs.
    // The client will have to fetch the text or we fetch it here?
    // Ideally we fetch the text here so client can display it.
    // But our index doesn't have the full text.
    // We can load quran-data.json here too?
}

// We need the full text to display results.
// Let's load quran-data as well?
let quranData: any = null;
function getQuranData() {
    if (quranData) return quranData;
    const p = path.join(process.cwd(), 'data', 'quran-data.json');
    if (fs.existsSync(p)) {
        quranData = JSON.parse(fs.readFileSync(p, 'utf-8'));
    }
    return quranData;
}

export async function searchQuran(query: string) {
    if (!query || query.length < 2) return [];

    const index = getIndex();
    const isArabic = /[\u0600-\u06FF]/.test(query);
    const normalizedQuery = isArabic ? normalizeArabic(query) : normalizeFrench(query);

    const results = index.filter(item => {
        if (isArabic) {
            return item.an.includes(normalizedQuery);
        } else {
            return item.fn.includes(normalizedQuery) || item.tn.includes(normalizedQuery);
        }
    });

    // Limit results
    const topResults = results.slice(0, 50);

    // Hydrate with real text
    const fullData = getQuranData();
    // quran-data is organized by page... this is painful for random access.
    // We need a map.
    // Optimization: Build a Map once.
    // For now, iterate pages is O(604). Fine-ish.

    // Actually, creating a map once is better.
    // But for MVP, let's just find them.

    const hydratedResults = topResults.map(item => {
        // Find existing text
        // Optimization: We know S:A.
        // We can't easily find it in quran-data without iterating.
        // But we can filter quickly.
        let foundAyah: any = null;

        // This is slow O(N*M).
        // Better: quranData should be flattened or indexed by S:A.
        // Let's lazy load a lookup map.

        // MVP: Just return the metadata, let Client fetch the text or use its own cache?
        // Client has no cache usually.
        // Server side lookup map is best.

        // For now, assume we find it.
        // Let's build a static Map in module scope if possible.
        // (Skipping for brevity implementation, will just return basic info)

        return {
            surah: item.s,
            ayah: item.a,
            key: `${item.s}:${item.a}`
        };
    });

    return hydratedResults;
}

// Helper to get text for specific results (Batch fetch)
export async function getAyahsData(refs: { surah: number, ayah: number }[]) {
    const data = getQuranData();
    const result = [];

    // Optimized lookup map (Lazy init)
    // using a global map
    // Optimized lookup map (Lazy init)
    // using a global map
    if (!global.quranLookup) {
        const lookup = new Map<string, any>();
        Object.values(data).forEach((page: any) => {
            page.forEach((a: any) => {
                lookup.set(`${a.surah}:${a.ayah}`, a);
            });
        });
        global.quranLookup = lookup;
    }

    // Ensure we have a reference to the map
    const lookup = global.quranLookup!;

    for (const ref of refs) {
        const key = `${ref.surah}:${ref.ayah}`;
        const ayah = lookup.get(key);
        if (ayah) result.push(ayah);
    }
    return result;
}

// Augment global type for the cache
declare global {
    var quranLookup: Map<string, any> | undefined;
}
