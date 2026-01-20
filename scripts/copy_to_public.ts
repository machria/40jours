
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

function copyRecursive(src: string, dest: string) {
    if (!fs.existsSync(src)) {
        console.warn(`Source not found: ${src}`);
        return;
    }
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        const entries = fs.readdirSync(src);
        for (const entry of entries) {
            copyRecursive(path.join(src, entry), path.join(dest, entry));
        }
    } else {
        // Ensure parent dir exists
        const parentDir = path.dirname(dest);
        if (!fs.existsSync(parentDir)) {
            fs.mkdirSync(parentDir, { recursive: true });
        }
        fs.copyFileSync(src, dest);
    }
}

const ITEMS_TO_COPY = [
    'tafsir', // Directory
    'quran',  // Directory
    'surahs.json',
    'ayah-location.json',
    'quran-transliteration.json'
];

async function main() {
    console.log('Copying basic data files to public directory...');

    for (const item of ITEMS_TO_COPY) {
        const src = path.join(DATA_DIR, item);
        const dest = path.join(PUBLIC_DIR, item);
        copyRecursive(src, dest);
        console.log(`Copied ${item}`);
    }

    // Handle Hadith Data
    console.log('Processing Hadith data...');
    const hadithSplitDir = path.join(DATA_DIR, 'hadith', 'split');
    const hadithPublicDir = path.join(PUBLIC_DIR, 'hadith');

    // 1. Copy split files
    if (fs.existsSync(hadithSplitDir)) {
        copyRecursive(hadithSplitDir, hadithPublicDir);

        // 2. Generate metadata.json for each collection
        console.log('Generating Hadith metadata...');
        const collections = fs.readdirSync(hadithPublicDir);

        for (const collectionName of collections) {
            const colDir = path.join(hadithPublicDir, collectionName);
            // Skip if not a directory
            if (!fs.existsSync(colDir) || !fs.statSync(colDir).isDirectory()) continue;

            const metadata: any = { section_details: {} };
            const files = fs.readdirSync(colDir).filter(f => f.startsWith('section-') && f.endsWith('.json'));

            for (const file of files) {
                try {
                    const content = JSON.parse(fs.readFileSync(path.join(colDir, file), 'utf-8'));
                    if (Array.isArray(content) && content.length > 0) {
                        const first = content[0];
                        const last = content[content.length - 1];
                        // Extract section ID from filename section-1.json -> 1
                        const sectionId = file.replace('section-', '').replace('.json', '');

                        metadata.section_details[sectionId] = {
                            hadithnumber_first: first.hadithnumber,
                            hadithnumber_last: last.hadithnumber,
                            arabicnumber_first: first.arabicnumber,
                            arabicnumber_last: last.arabicnumber
                        };
                    }
                } catch (e) {
                    console.error(`Error processing ${collectionName}/${file}:`, e);
                }
            }

            fs.writeFileSync(path.join(colDir, 'metadata.json'), JSON.stringify(metadata, null, 2));
            console.log(`Generated metadata for ${collectionName}`);
        }
    } else {
        console.warn('Hadith split directory not found:', hadithSplitDir);
    }

    console.log('Copy complete.');
}

main().catch(console.error);
