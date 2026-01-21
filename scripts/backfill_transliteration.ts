import fs from 'fs';
import path from 'path';

const HISN_PATH = path.join(process.cwd(), 'data', 'hisn', 'fra-hisn.json');

// Basic Arabic to Latin mapping
const MAPPING: Record<string, string> = {
    'ا': 'a', 'أ': 'a', 'إ': 'i', 'آ': 'aa', 'ء': '\'',
    'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': '7', 'خ': 'kh',
    'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh',
    'ص': 'S', 'ض': 'D', 'ط': 'T', 'ظ': 'Z', 'ع': '3', 'غ': 'gh',
    'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'm': 'm', 'م': 'm', 'ن': 'n',
    'ه': 'h', 'و': 'w', 'ي': 'y', 'ى': 'a', 'ة': 'h',
    'َ': 'a', 'ُ': 'u', 'ِ': 'i', 'ً': 'an', 'ٌ': 'un', 'ٍ': 'in',
    'ّ': '', // Shadda - handled by doubling previous char logic if possible, or ignored for simplicity
    'ْ': '', // Sukun
    '،': ',', '؟': '?', '.': '.', '؛': ';'
};

function transliterate(arabic: string): string {
    let result = '';
    const chars = Array.from(arabic);

    for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        const nextChar = chars[i + 1];

        // Handle Al- (Definite article) - simplified
        // if (char === 'ا' && nextChar === 'ل') { ... }

        // Handle Shadda manually if simple doubling
        if (nextChar === 'ّ') {
            // If we have a mapping for the current char, double it
            const mapped = MAPPING[char];
            if (mapped) {
                result += mapped + mapped;
                i++; // Skip shadda
                continue;
            }
        }

        if (MAPPING[char] !== undefined) {
            result += MAPPING[char];
        } else {
            // Keep original if not Arabic (e.g. numbers, brackets, spaces)
            result += char;
        }
    }

    return result;
}

// Function to clean up common formatting issues from simple mapping
function cleanTransliteration(text: string): string {
    return text
        .replace(/\s+/g, ' ')
        .trim();
}

async function main() {
    if (!fs.existsSync(HISN_PATH)) {
        console.error('File not found:', HISN_PATH);
        process.exit(1);
    }

    const content = fs.readFileSync(HISN_PATH, 'utf-8');
    const data = JSON.parse(content);
    let modifiedCount = 0;

    data.forEach((category: any) => {
        category.hadiths.forEach((hadith: any) => {
            if (!hadith.source || hadith.source.trim() === '') {
                console.log(`Generating transliteration for ID ${hadith.id}...`);
                const trans = transliterate(hadith.arabic);
                hadith.source = `(${cleanTransliteration(trans)})`;
                modifiedCount++;
            }
        });
    });

    if (modifiedCount > 0) {
        fs.writeFileSync(HISN_PATH, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`Successfully updated ${modifiedCount} entries with transliteration.`);
    } else {
        console.log('No empty source fields found.');
    }
}

main();
