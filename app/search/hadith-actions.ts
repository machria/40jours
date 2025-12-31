
'use server';

import fs from 'fs';
import path from 'path';

// Types
interface HadithIndexItem {
    id: string; // "collection:number"
    c: string; // collection
    n: string; // number
    fn: string; // french normalized
    // Removed 'an' (Arabic normalized) as per user request to reduce index size
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
const DATA_DIR = path.join(process.cwd(), 'data', 'hadith');

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
    // We can use a global cache for the simplified JSONs
    const globalKey = `hadith_v2_${collection}`;

    if (!(global as any)[globalKey]) {
        const p = path.join(DATA_DIR, `fra-${collection}.json`);
        if (fs.existsSync(p)) {
            const data = JSON.parse(fs.readFileSync(p, 'utf-8'));
            const map = new Map();
            data.hadiths.forEach((h: any) => {
                map.set(String(h.hadithnumber), h);
            });

            // Also store metadata for section lookup
            const sectionDetails = data.metadata?.section_details || {};

            (global as any)[globalKey] = { map, sectionDetails };
        }
    }

    const cache = (global as any)[globalKey];
    if (cache) {
        const hadith = cache.map.get(number);
        if (!hadith) return null;

        // Find section ID
        let sectionId = "";
        const numericHadithNumber = parseFloat(number); // Handle "12a" potentially? usually hadithnumber is number in JSON

        // Iterate through section details to find the range
        // section_details is { "0": { hadithnumber_first: ..., hadithnumber_last: ... } }
        for (const [key, details] of Object.entries(cache.sectionDetails as Record<string, any>)) {
            if (numericHadithNumber >= details.hadithnumber_first && numericHadithNumber <= details.hadithnumber_last) {
                sectionId = key;
                break;
            }
        }

        return {
            ...hadith,
            sectionId
        };
    }
    return null;
}

export async function searchHadith(query: string) {
    if (!query || query.length < 2) return [];

    const index = getIndex();
    // No Arabic search supported in this version of the index

    // Multi-word support
    const rawTerms = query.split(/\s+/).filter(t => t.length > 0);
    const terms = rawTerms.map(t => normalizeFrench(t));

    const results = index.filter(item => {
        // Check if ALL terms are present
        return terms.every(term => item.fn.includes(term));
    });

    const topResults = results.slice(0, 100); // Limit to 100 to avoid overload

    // Hydrate
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
