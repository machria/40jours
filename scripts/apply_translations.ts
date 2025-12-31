
import fs from 'fs';
import path from 'path';

const FILES_TO_UPDATE = [
    'fra-abudawud.json',
    'fra-bukhari.json',
    'fra-malik.json',
    'fra-nasai.json',
    'fra-muslim.json',
    'fra-ibnmajah.json',
];

const DATA_DIR = path.join(process.cwd(), 'data', 'hadith');
const TRANSLATIONS_FILE = path.join(process.cwd(), 'scripts', 'translated_titles.json');

async function applyTranslations() {
    if (!fs.existsSync(TRANSLATIONS_FILE)) {
        console.error(`Translations file not found: ${TRANSLATIONS_FILE}`);
        return;
    }

    const translations = JSON.parse(fs.readFileSync(TRANSLATIONS_FILE, 'utf-8'));

    for (const filename of FILES_TO_UPDATE) {
        const filePath = path.join(DATA_DIR, filename);
        if (!fs.existsSync(filePath)) {
            console.warn(`File not found: ${filePath}`);
            continue;
        }

        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            let updates = 0;

            if (data.metadata && data.metadata.sections) {
                Object.keys(data.metadata.sections).forEach((key) => {
                    const originalTitle = data.metadata.sections[key];
                    if (typeof originalTitle === 'string' && translations[originalTitle.trim()]) {
                        data.metadata.sections[key] = translations[originalTitle.trim()];
                        updates++;
                    }
                });
            }

            if (updates > 0) {
                fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
                console.log(`Updated ${updates} titles in ${filename}`);
            } else {
                console.log(`No updates needed for ${filename}`);
            }
        } catch (error) {
            console.error(`Error updating ${filename}:`, error);
        }
    }
}

applyTranslations();
