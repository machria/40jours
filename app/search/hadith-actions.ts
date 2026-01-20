
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
const SPLIT_DIR = path.join(DATA_DIR, 'split');
const META_PATH = path.join(DATA_DIR, 'hadith-metadata.json');

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
    if (!global.hadithMetadata) {
        if (fs.existsSync(META_PATH)) {
            global.hadithMetadata = JSON.parse(fs.readFileSync(META_PATH, 'utf-8'));
        } else {
            return null;
        }
    }

    // 1. Find Section
    const meta = global.hadithMetadata![collection];
    if (!meta) return null;

    const numericHadithNumber = parseFloat(number);
    let sectionId = "unknown";

    for (const [key, details] of Object.entries(meta as Record<string, any>)) {
        if (numericHadithNumber >= details.hadithnumber_first && numericHadithNumber <= details.hadithnumber_last) {
            sectionId = key;
            break;
        }
    }

    // 2. Load Section File
    // We can cache section files in memory separately if needed, but FS is fast enough for now compared to 15MB parse
    const sectionPath = path.join(SPLIT_DIR, collection, `section-${sectionId}.json`);

    if (fs.existsSync(sectionPath)) {
        const raw = fs.readFileSync(sectionPath, 'utf-8');
        const hadiths = JSON.parse(raw);
        const hadith = hadiths.find((h: any) => h.hadithnumber == number || parseFloat(h.hadithnumber) == numericHadithNumber);

        if (hadith) {
            return {
                ...hadith,
                sectionId
            };
        }
    }

    // Fallback? No, if not in section, it's missing.
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

declare global {
    var hadithMetadata: Record<string, any> | undefined;
}
