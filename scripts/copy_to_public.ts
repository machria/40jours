
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

    // Generate Tafsir Index (Surah -> List of Files)
    // This allows us to use fetch() instead of fs.readdir() at runtime
    console.log('Generating Tafsir Index...');
    const tafsirDir = path.join(PUBLIC_DIR, 'tafsir');
    if (fs.existsSync(tafsirDir)) {
        const files = fs.readdirSync(tafsirDir);
        const index: Record<number, number[]> = {};

        files.forEach(file => {
            if (!file.endsWith('.json')) return;
            const parts = file.replace('.json', '').split('_');
            if (parts.length === 2) {
                const surah = parseInt(parts[0]);
                const ayah = parseInt(parts[1]);
                if (!isNaN(surah) && !isNaN(ayah)) {
                    if (!index[surah]) index[surah] = [];
                    index[surah].push(ayah);
                }
            }
        });

        // Sort ayahs
        Object.keys(index).forEach(key => {
            const k = parseInt(key);
            index[k].sort((a, b) => a - b);
        });

        fs.writeFileSync(path.join(tafsirDir, 'index.json'), JSON.stringify(index));
        console.log('Generated tafsir/index.json');
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

    // Handle Asbab Nuzul Data
    console.log('Processing Asbab Nuzul data...');
    const asbabFile = path.join(DATA_DIR, 'asbab_nuzul_fr.json');
    const asbabPublicDir = path.join(PUBLIC_DIR, 'asbab');
    
    if (fs.existsSync(asbabFile)) {
        if (!fs.existsSync(asbabPublicDir)) {
            fs.mkdirSync(asbabPublicDir, { recursive: true });
        }
        try {
            const asbabData = JSON.parse(fs.readFileSync(asbabFile, 'utf-8'));
            let asbabCount = 0;
            for (const [key, text] of Object.entries(asbabData)) {
                fs.writeFileSync(
                    path.join(asbabPublicDir, `${key}.json`),
                    JSON.stringify({ text })
                );
                asbabCount++;
            }
            console.log(`Generated ${asbabCount} Asbab files in public/asbab`);
        } catch (e) {
            console.error('Error processing Asbab Nuzul:', e);
        }
    } else {
        console.warn('Asbab Nuzul source file not found:', asbabFile);
    }

    console.log('Copy complete.');
}

main().catch(console.error);
