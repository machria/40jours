
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const QURAN_PAGES_DIR = path.join(DATA_DIR, 'quran', 'pages');
const SEARCH_DIR = path.join(DATA_DIR, 'search');
const HADITH_SPLIT_DIR = path.join(DATA_DIR, 'hadith', 'split');

// Ensure directories exist
[QURAN_PAGES_DIR, SEARCH_DIR, HADITH_SPLIT_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

async function splitQuran() {
    console.log('Splitting Quran data...');
    const quranPath = path.join(DATA_DIR, 'quran-data.json');
    if (!fs.existsSync(quranPath)) {
        console.error('quran-data.json not found');
        return;
    }

    const raw = fs.readFileSync(quranPath, 'utf-8');
    const allPages = JSON.parse(raw);

    // allPages is { "1": [ayahs], "2": [ayahs] }
    const ayahMap: Record<string, number> = {};

    for (const [page, ayahs] of Object.entries(allPages)) {
        const pageFile = path.join(QURAN_PAGES_DIR, `${page}.json`);
        fs.writeFileSync(pageFile, JSON.stringify(ayahs));

        // Build map
        (ayahs as any[]).forEach(ayah => {
            ayahMap[`${ayah.surah}:${ayah.ayah}`] = parseInt(page);
        });
    }
    fs.writeFileSync(path.join(DATA_DIR, 'ayah-location.json'), JSON.stringify(ayahMap));
    console.log(`Split Quran into ${Object.keys(allPages).length} page files and generated ayah map.`);
}

async function splitSearchIndex() {
    console.log('Splitting Search Index...');
    const indexPath = path.join(DATA_DIR, 'search-index.json');
    if (!fs.existsSync(indexPath)) {
        console.error('search-index.json not found');
        return;
    }

    const raw = fs.readFileSync(indexPath, 'utf-8');
    const index = JSON.parse(raw); // Array of items

    // Split into Quran and Tafsir
    // Quran items don't have 'tn' (tafsir_norm) usually? Or we filter based on properties.
    // Looking at actions.ts:
    // Quran search checks 'an' and 'fn'.
    // Tafsir search checks 'tn'.

    // Let's check structure more closely from actions.ts or by assuming 'tn' presence.
    // Type SearchIndexItem { id, an, fn, tn, s, a }

    const quranIndex = index.filter((item: any) => !item.tn);
    const tafsirIndex = index.filter((item: any) => !!item.tn);

    fs.writeFileSync(path.join(SEARCH_DIR, 'quran-index.json'), JSON.stringify(quranIndex));
    // Tafsir index might still be huge.
    fs.writeFileSync(path.join(SEARCH_DIR, 'tafsir-index.json'), JSON.stringify(tafsirIndex));

    console.log(`Split index: Quran (${quranIndex.length}), Tafsir (${tafsirIndex.length})`);
}

async function splitHadithIndex() {
    console.log('Splitting Hadith Index...');
    // The hadith index handles multiple collections.
    // We can keep it one file if it's not too huge (18MB).
    // Or split by collection.

    const indexPath = path.join(DATA_DIR, 'hadith-search-index.json');
    if (!fs.existsSync(indexPath)) {
        console.error('hadith-search-index.json not found');
        return;
    }

    const raw = fs.readFileSync(indexPath, 'utf-8');
    const index = JSON.parse(raw);

    // Group by collection 'c'
    const byCollection: Record<string, any[]> = {};
    index.forEach((item: any) => {
        if (!byCollection[item.c]) byCollection[item.c] = [];
        byCollection[item.c].push(item);
    });

    for (const [col, items] of Object.entries(byCollection)) {
        fs.writeFileSync(path.join(SEARCH_DIR, `hadith-index-${col}.json`), JSON.stringify(items));
    }
    console.log('Split Hadith index by collection.');
}


async function splitHadithContent() {
    console.log('Splitting Hadith content...');
    const collections = ['bukhari', 'muslim', 'nasai', 'abudawud', 'tirmidhi', 'ibnmajah', 'malik'];

    const meta: Record<string, any> = {};

    for (const col of collections) {
        const p = path.join(DATA_DIR, 'hadith', `fra-${col}.json`);
        if (!fs.existsSync(p)) continue;

        console.log(`Processing ${col}...`);
        const raw = fs.readFileSync(p, 'utf-8');
        const data = JSON.parse(raw); // { hadiths: [], metadata: { section_details: {} } }

        // Save metadata
        meta[col] = data.metadata?.section_details || {};

        // Ensure output dir
        const outDir = path.join(DATA_DIR, 'hadith', 'split', col);
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

        // Group by section
        const bySection: Record<string, any[]> = {};

        // Helper to find section
        const findSection = (num: number) => {
            if (!data.metadata?.section_details) return "unknown";
            for (const [secKey, details] of Object.entries(data.metadata.section_details as Record<string, any>)) {
                if (num >= details.hadithnumber_first && num <= details.hadithnumber_last) {
                    return secKey;
                }
            }
            return "unknown";
        };

        data.hadiths.forEach((h: any) => {
            let sec;
            // Prioritize reference.book if available (fixes Ibn Majah overlap issues)
            if (h.reference && h.reference.book !== undefined) {
                const bookId = String(h.reference.book);
                if (data.metadata?.section_details && data.metadata.section_details[bookId]) {
                    sec = bookId;
                }
            }

            if (!sec) {
                const num = parseFloat(h.hadithnumber);
                sec = findSection(num);
            }

            if (!bySection[sec]) bySection[sec] = [];
            bySection[sec].push(h);
        });

        // Write sections
        for (const [sec, items] of Object.entries(bySection)) {
            fs.writeFileSync(path.join(outDir, `section-${sec}.json`), JSON.stringify(items));
        }
    }

    fs.writeFileSync(path.join(DATA_DIR, 'hadith', 'hadith-metadata.json'), JSON.stringify(meta));
    console.log('Split Hadith content.');
}


async function splitTafsir() {
    console.log('Splitting Tafsir data...');
    const tafsirPath = path.join(DATA_DIR, 'tafsir-fr.json');

    if (!fs.existsSync(tafsirPath)) {
        console.error('Tafsir file not found at:', tafsirPath);
        return;
    }

    const fileContent = fs.readFileSync(tafsirPath, 'utf-8');
    const tafsirData = JSON.parse(fileContent); // Array of {surah, ayah, tafsir}

    const TAFSIR_OUT_DIR = path.join(DATA_DIR, 'tafsir');
    if (!fs.existsSync(TAFSIR_OUT_DIR)) {
        fs.mkdirSync(TAFSIR_OUT_DIR, { recursive: true });
    }

    let count = 0;
    for (const item of tafsirData) {
        // Create filename: data/tafsir/surah_ayah.json
        // e.g., data/tafsir/1_1.json
        const filename = `${item.surah}_${item.ayah}.json`;
        const filePath = path.join(TAFSIR_OUT_DIR, filename);

        fs.writeFileSync(filePath, JSON.stringify(item));
        count++;
    }

    console.log(`Split Tafsir into ${count} files.`);
}

async function main() {
    await splitQuran();
    await splitSearchIndex();
    await splitHadithIndex();
    await splitHadithContent();
    await splitTafsir();
    console.log('Done splitting data.');
}

main().catch(console.error);

