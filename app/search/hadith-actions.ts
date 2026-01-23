
'use server';

import fs from 'fs';
import path from 'path';

// Types
interface HadithIndexItem {
    id: string; // "collection:number"
    c: string; // collection
    n: string; // number
    fn: string; // french normalized
}

interface HadithSearchResult {
    collection: string;
    number: string;
    text: string; // French snippet or full text
    arabic: string; // Arabic snippet or full text
    sectionId?: string; // The section/chapter ID
    highlight?: boolean;
}

let hadithIndex: HadithIndexItem[] | null = null;
const INDEX_PATH = path.join(process.cwd(), 'data', 'hadith-search-index.json');
// Use public directory as the source of truth, matching hadith-api.ts
const PUBLIC_DATA_DIR = path.join(process.cwd(), 'public', 'hadith');

// Priority order for results
const COLLECTION_ORDER = ['bukhari', 'muslim', 'nasai', 'tirmidhi', 'malik', 'ibnmajah', 'abudawud'];

function getIndex(): HadithIndexItem[] {
    if (hadithIndex) return hadithIndex;
    try {
        if (fs.existsSync(INDEX_PATH)) {
            const raw = fs.readFileSync(INDEX_PATH, 'utf-8');
            hadithIndex = JSON.parse(raw);
            return hadithIndex!;
        }
    } catch (e) {
        console.error("Failed to load hadith index", e);
    }
    return [];
}

function normalizeFrench(text: string): string {
    if (!text) return "";
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

// Helper to get full Hadith data including section info
async function getHadithData(collection: string, number: string) {
    // Load collection metadata to find the section
    // We read specific collection metadata from public/hadith/[collection]/metadata.json
    const metadataPath = path.join(PUBLIC_DATA_DIR, collection, 'metadata.json');

    if (!fs.existsSync(metadataPath)) return null;

    let meta: any;
    try {
        meta = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
    } catch (e) {
        console.error(`Failed to read metadata for ${collection}`, e);
        return null;
    }

    if (!meta || !meta.section_details) return null;

    const numericHadithNumber = parseFloat(number);
    let sectionId = "unknown";

    for (const [key, details] of Object.entries(meta.section_details as Record<string, any>)) {
        if (numericHadithNumber >= details.hadithnumber_first && numericHadithNumber <= details.hadithnumber_last) {
            sectionId = key;
            break;
        }
    }

    // Load Section File from public/hadith/[collection]/section-[id].json
    const sectionPath = path.join(PUBLIC_DATA_DIR, collection, `section-${sectionId}.json`);

    if (fs.existsSync(sectionPath)) {
        try {
            const raw = fs.readFileSync(sectionPath, 'utf-8');
            const hadiths = JSON.parse(raw);
            const hadith = hadiths.find((h: any) => h.hadithnumber == number || parseFloat(h.hadithnumber) == numericHadithNumber);

            if (hadith) {
                return {
                    ...hadith,
                    sectionId
                };
            }
        } catch (e) {
            console.error(`Failed to read section ${sectionId} for ${collection}`, e);
        }
    }

    return null;
}

export async function searchHadith(query: string) {
    if (!query || query.length < 2) return [];

    const index = getIndex();

    // Multi-word support
    const rawTerms = query.split(/\s+/).filter(t => t.length > 0);
    const terms = rawTerms.map(t => normalizeFrench(t));

    // 1. Filter
    const results = index.filter(item => {
        return terms.every(term => item.fn.includes(term));
    });

    // 2. Sort by Collection Priority
    results.sort((a, b) => {
        const indexA = COLLECTION_ORDER.indexOf(a.c);
        const indexB = COLLECTION_ORDER.indexOf(b.c);
        // If both are in the list, sort by index
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        // If only A is in list, A comes first
        if (indexA !== -1) return -1;
        // If only B is in list, B comes first
        if (indexB !== -1) return 1;
        // Otherwise keep original order (or alphabetical)
        return a.c.localeCompare(b.c);
    });

    // 3. Limit to 60 as requested
    const topResults = results.slice(0, 60);

    // 4. Hydrate
    const hydrated = await Promise.all(topResults.map(async (item) => {
        const data = await getHadithData(item.c, item.n);
        if (!data) return null;
        return {
            collection: item.c,
            number: item.n,
            text: data.text || data.body, // Prioritize 'text'
            arabic: data.arabic,
            sectionId: data.sectionId
        };
    }));

    return hydrated.filter(Boolean) as HadithSearchResult[];
}
