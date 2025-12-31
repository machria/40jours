
import fs from 'fs';
import path from 'path';

const COLLECTIONS = [
    'fra-bukhari.json',
    'fra-muslim.json',
    'fra-nasai.json',
    'fra-abudawud.json',
    'fra-tirmidhi.json',
    'fra-ibnmajah.json',
    'fra-malik.json',
];

const DATA_DIR = path.join(process.cwd(), 'data', 'hadith');
const OUTPUT_INDEX = path.join(process.cwd(), 'data', 'hadith-search-index.json');

// Types
interface HadithIndexItem {
    id: string; // "collection:hadithNumber"
    c: string; // collection name (e.g., 'bukhari')
    n: string; // hadith number (string to handle '12a', etc.)
    fn: string; // french normalized
}

function normalizeFrench(text: string): string {
    if (!text) return "";
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

async function buildHadithIndex() {
    console.log('Building Hadith Search Index (French Only)...');
    const index: HadithIndexItem[] = [];

    for (const filename of COLLECTIONS) {
        const collectionName = filename.replace('fra-', '').replace('.json', '');
        const filePath = path.join(DATA_DIR, filename);

        if (!fs.existsSync(filePath)) {
            console.warn(`File not found: ${filePath}`);
            continue;
        }

        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            const hadiths = data.hadiths;

            if (Array.isArray(hadiths)) {
                hadiths.forEach((hadith: any) => {
                    // User specified: "in each json the french is in text"
                    const frText = hadith.text || hadith.body || "";

                    if (!frText) return;

                    index.push({
                        id: `${collectionName}:${hadith.hadithnumber}`,
                        c: collectionName,
                        n: String(hadith.hadithnumber),
                        fn: normalizeFrench(frText),
                    });
                });
            }
        } catch (error) {
            console.error(`Error processing ${filename}:`, error);
        }
    }

    fs.writeFileSync(OUTPUT_INDEX, JSON.stringify(index));
    console.log(`Hadith Index built with ${index.length} items.`);
    console.log(`Saved to ${OUTPUT_INDEX}`);
    console.log(`Size: ${(fs.statSync(OUTPUT_INDEX).size / 1024 / 1024).toFixed(2)} MB`);
}

buildHadithIndex();
