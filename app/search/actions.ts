
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

const QURAN_INDEX_PATH = path.join(process.cwd(), 'data', 'search', 'quran-index.json');
const TAFSIR_INDEX_PATH = path.join(process.cwd(), 'data', 'search', 'tafsir-index.json');
const AYAH_LOCATION_PATH = path.join(process.cwd(), 'data', 'ayah-location.json');

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

function getQuranIndex(): SearchIndexItem[] {
    if (global.quranSearchIndex) return global.quranSearchIndex;
    try {
        if (fs.existsSync(QURAN_INDEX_PATH)) {
            const raw = fs.readFileSync(QURAN_INDEX_PATH, 'utf-8');
            global.quranSearchIndex = JSON.parse(raw);
            return global.quranSearchIndex!;
        }
    } catch (e) {
        console.error("Failed to load quran search index", e);
    }
    return [];
}

function getTafsirIndex(): SearchIndexItem[] {
    if (global.tafsirSearchIndex) return global.tafsirSearchIndex;
    try {
        if (fs.existsSync(TAFSIR_INDEX_PATH)) {
            // Tafsir index might be large, be careful.
            const raw = fs.readFileSync(TAFSIR_INDEX_PATH, 'utf-8');
            global.tafsirSearchIndex = JSON.parse(raw);
            return global.tafsirSearchIndex!;
        }
    } catch (e) {
        console.error("Failed to load tafsir search index", e);
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

export async function searchQuran(query: string, limit: number = 50) {
    if (!query || query.length < 2) return [];

    const index = getQuranIndex();
    const isArabic = /[\u0600-\u06FF]/.test(query); // Determine language based on first char usually, or regex match

    // Multi-word support: Split query into terms
    const rawTerms = query.split(/\s+/).filter(t => t.length > 0);
    const terms = rawTerms.map(t => isArabic ? normalizeArabic(t) : normalizeFrench(t));

    const results = index.filter(item => {
        if (isArabic) {
            // Check if ALL terms are present in Arabic text
            return terms.every(term => item.an.includes(term));
        } else {
            // Exclude Tafsir from main Quran search
            // Check if ALL terms are present in French text
            return terms.every(term => item.fn.includes(term));
        }
    });

    // Limit results
    const topResults = results.slice(0, limit);

    const hydratedResults = topResults.map(item => {
        return {
            surah: item.s,
            ayah: item.a,
            key: `${item.s}:${item.a}`
        };
    });

    return hydratedResults;
}

export async function searchTafsir(query: string, limit: number = 50) {
    if (!query || query.length < 2) return [];

    const index = getTafsirIndex();

    // Multi-word support
    const rawTerms = query.split(/\s+/).filter(t => t.length > 0);
    const terms = rawTerms.map(t => normalizeFrench(t));

    const results = index.filter(item => {
        if (!item.tn) return false;
        // Check if ALL terms are present in Tafsir text
        return terms.every(term => item.tn.includes(term));
    });

    // Limit results
    const topResults = results.slice(0, limit);

    // Hydrate with Tafsir Snippet (requires loading Tafsir data)
    // For now, we return metadata, client might need to fetch text?
    // Or we load Tafsir data here.
    return topResults.map(item => ({
        surah: item.s,
        ayah: item.a,
        key: `${item.s}:${item.a}`
    }));
}

// Helper to get text for specific results (Batch fetch)
// Reads strictly necessary pages
export async function getAyahsData(refs: { surah: number, ayah: number }[]) {
    // 1. Load Ayah Map
    if (!global.ayahLocationMap) {
        if (fs.existsSync(AYAH_LOCATION_PATH)) {
            global.ayahLocationMap = JSON.parse(fs.readFileSync(AYAH_LOCATION_PATH, 'utf-8'));
        } else {
            return [];
        }
    }
    const ayahMap = global.ayahLocationMap!;

    // 2. Identify required pages
    const pagesToLoad = new Set<number>();
    const neededIds = new Set<string>();

    refs.forEach(r => {
        const key = `${r.surah}:${r.ayah}`;
        neededIds.add(key);
        const page = ayahMap[key];
        if (page) pagesToLoad.add(page);
    });

    // 3. Load Pages and Extract Ayahs
    const result = [];

    for (const page of pagesToLoad) {
        const pPath = path.join(process.cwd(), 'data', 'quran', 'pages', `${page}.json`);
        if (fs.existsSync(pPath)) {
            const pageAyahs = JSON.parse(fs.readFileSync(pPath, 'utf-8'));
            // pageAyahs is [] of ayahs on that page
            const matches = pageAyahs.filter((a: any) => neededIds.has(`${a.surah}:${a.ayah}`));
            result.push(...matches);
        }
    }

    return result;
}

// Augment global type for the cache
declare global {
    var quranSearchIndex: SearchIndexItem[] | undefined;
    var tafsirSearchIndex: SearchIndexItem[] | undefined;
    var ayahLocationMap: Record<string, number> | undefined;
}
