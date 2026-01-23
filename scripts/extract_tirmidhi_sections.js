const fs = require('fs');
const path = require('path');

const tirmidhiPath = path.join(process.cwd(), 'data/hadith/fra-tirmidhi.json');
const data = JSON.parse(fs.readFileSync(tirmidhiPath, 'utf8'));

const sections = data.metadata.sections;
console.log('    tirmidhi: {');
for (const [key, value] of Object.entries(sections)) {
    if (value) {
        console.log(`        "${key}": "${value}",`);
    }
}
console.log('    }');
