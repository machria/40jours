
import fs from 'fs';
import path from 'path';

const FILES_TO_PROCESS = [
    'fra-abudawud.json',
    'fra-bukhari.json',
    'fra-malik.json',
    'fra-nasai.json',
    'fra-muslim.json',
    'fra-ibnmajah.json',
];

const DATA_DIR = path.join(process.cwd(), 'data', 'hadith');
const OUTPUT_FILE = path.join(process.cwd(), 'scripts', 'english_titles.json');

async function extractTitles() {
    const allTitles = new Set<string>();

    for (const filename of FILES_TO_PROCESS) {
        const filePath = path.join(DATA_DIR, filename);
        if (!fs.existsSync(filePath)) {
            console.warn(`File not found: ${filePath}`);
            continue;
        }

        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            if (data.metadata && data.metadata.sections) {
                Object.values(data.metadata.sections).forEach((title: any) => {
                    if (typeof title === 'string' && title.trim() !== '') {
                        allTitles.add(title.trim());
                    }
                });
            }
        } catch (error) {
            console.error(`Error processing ${filename}:`, error);
        }
    }

    const sortedTitles = Array.from(allTitles).sort();
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(sortedTitles, null, 2));
    console.log(`Extracted ${sortedTitles.length} unique titles to ${OUTPUT_FILE}`);
}

extractTitles();
