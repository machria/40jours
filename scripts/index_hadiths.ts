
import fs from 'fs';
import path from 'path';

// Order is critical for search result priority
const COLLECTIONS = [
    'bukhari',
    'muslim',
    'nasai',
    'tirmidhi',
    'malik',
    'ibnmajah',
    'abudawud',
];

const PUBLIC_DIR = path.join(process.cwd(), 'public', 'hadith');
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
    console.log('Building Hadith Search Index from Public Split Files (French Only)...');
    const index: HadithIndexItem[] = [];

    for (const collectionName of COLLECTIONS) {
        const colDir = path.join(PUBLIC_DIR, collectionName);

        if (!fs.existsSync(colDir)) {
            console.warn(`Directory not found: ${colDir}`);
            continue;
        }

        console.log(`Processing ${collectionName}...`);

        // Read all section files
        const files = fs.readdirSync(colDir);
        const sectionFiles = files.filter(f => f.startsWith('section-') && f.endsWith('.json'));

        for (const file of sectionFiles) {
            try {
                const filePath = path.join(colDir, file);
                const hadiths = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

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
                console.error(`Error processing ${file} in ${collectionName}:`, error);
            }
        }
    }

    // Ensure output directory exists (it should, but safety first)
    const outDir = path.dirname(OUTPUT_INDEX);
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_INDEX, JSON.stringify(index));
    console.log(`Hadith Index built with ${index.length} items.`);
    console.log(`Saved to ${OUTPUT_INDEX}`);
    console.log(`Size: ${(fs.statSync(OUTPUT_INDEX).size / 1024 / 1024).toFixed(2)} MB`);
}

buildHadithIndex();
