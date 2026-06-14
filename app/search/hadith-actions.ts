
'use server';

import fs from 'fs';
import path from 'path';

// Types (Mirrors indexer output)
interface HadithIndexItem {
    id: string; // "collection:number"
    c: string; // collection
    n: string; // number
    fn: string; // french normalized (recherche)
    t: string; // extrait texte français (affichage)
    ar: string; // extrait texte arabe (affichage)
    sec: string; // id de section
}

interface HadithSearchResult {
    collection: string;
    number: string;
    text: string; // French snippet
    arabic: string; // Arabic snippet
    sectionId?: string; // The section/chapter ID
}

let hadithIndex: HadithIndexItem[] | null = null;
const INDEX_PATH = path.join(process.cwd(), 'data', 'hadith-search-index.json');

// Priority order for results — l'index ne couvre que Bukhari et Muslim
const COLLECTION_ORDER = ['bukhari', 'muslim'];

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
        .replace(/[̀-ͯ]/g, "");
}

export async function searchHadith(query: string, limit: number = 60) {
    if (!query || query.length < 2) return [];

    const index = getIndex();

    // Multi-word support
    const rawTerms = query.split(/\s+/).filter(t => t.length > 0);
    const terms = rawTerms.map(t => normalizeFrench(t));

    // 1. Filter
    const results = index.filter(item => {
        return terms.every(term => item.fn.includes(term));
    });

    // 2. Group by collection (some queries match thousands of hadiths in Bukhari
    // alone, which would otherwise crowd out every other collection from the
    // limited result set)
    const byCollection = new Map<string, HadithIndexItem[]>();
    for (const item of results) {
        const bucket = byCollection.get(item.c);
        if (bucket) bucket.push(item);
        else byCollection.set(item.c, [item]);
    }

    const orderedCollections = [
        ...COLLECTION_ORDER.filter(c => byCollection.has(c)),
        ...[...byCollection.keys()].filter(c => !COLLECTION_ORDER.includes(c)),
    ];

    // 3. Round-robin across collections (in priority order) so the result set
    // covers every collection that has matches, not just the largest ones.
    const picked: HadithIndexItem[] = [];
    for (let cursor = 0; picked.length < limit; cursor++) {
        let addedAny = false;
        for (const c of orderedCollections) {
            const bucket = byCollection.get(c)!;
            if (cursor < bucket.length) {
                picked.push(bucket[cursor]);
                addedAny = true;
                if (picked.length >= limit) break;
            }
        }
        if (!addedAny) break;
    }

    return picked.map((item): HadithSearchResult => ({
        collection: item.c,
        number: item.n,
        text: item.t,
        arabic: item.ar,
        sectionId: item.sec,
    }));
}
