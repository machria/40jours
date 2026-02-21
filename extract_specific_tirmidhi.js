const fs = require('fs');
const path = require('path');

const fullPath = path.join(__dirname, 'full_tirmidhi.json');
const targetDir = path.join(__dirname, 'public', 'hadith', 'tirmidhi');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

const sectionsToExtract = ['33', '34', '40', '41', '48'];

// Group hadiths by section
const hadithsBySection = {};
for (const section of sectionsToExtract) {
    hadithsBySection[section] = [];
}

const hadiths = data.hadiths || [];
for (const hadith of hadiths) {
    const section = hadith.reference?.book?.toString();
    if (sectionsToExtract.includes(section)) {
        hadithsBySection[section].push(hadith);
    }
}

for (const section of sectionsToExtract) {
    const list = hadithsBySection[section];
    if (list && list.length > 0) {
        const outPath = path.join(targetDir, `section-${section}.json`);
        fs.writeFileSync(outPath, JSON.stringify(list, null, 2), 'utf8');
        console.log(`Extracted section-${section}.json (${list.length} hadiths)`);
    } else {
        console.warn(`Warning: Section ${section} had no hadiths in full_tirmidhi.json`);
    }
}
