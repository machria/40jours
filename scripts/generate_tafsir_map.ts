import fs from 'fs';
import path from 'path';

const TAFSIR_DIR = path.join(process.cwd(), 'public/tafsir');
const OUTPUT_FILE = path.join(process.cwd(), 'public/tafsir/index.json');

function generateTafsirIndex() {
    console.log(`Scanning ${TAFSIR_DIR}...`);

    if (!fs.existsSync(TAFSIR_DIR)) {
        console.error(`Directory not found: ${TAFSIR_DIR}`);
        process.exit(1);
    }

    const files = fs.readdirSync(TAFSIR_DIR);

    // Filter for {surah}_{ayah}.json pattern
    const tafsirKeys = files
        .filter(f => /^\d+_\d+\.json$/.test(f))
        .map(f => f.replace('.json', ''));

    // Sort logically: Surah then Ayah
    tafsirKeys.sort((a, b) => {
        const [s1, a1] = a.split('_').map(Number);
        const [s2, a2] = b.split('_').map(Number);
        if (s1 !== s2) return s1 - s2;
        return a1 - a2;
    });

    console.log(`Found ${tafsirKeys.length} tafsir files.`);

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(tafsirKeys, null, 0)); // Minified
    console.log(`Wrote index to ${OUTPUT_FILE}`);
}

generateTafsirIndex();
