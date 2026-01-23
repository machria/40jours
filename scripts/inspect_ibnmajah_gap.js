const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'data/hadith/fra-ibnmajah.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const sectionsToCheck = ["11", "12", "13", "14", "16", "17", "18"];

console.log("Checking metadata for missing sections:");
sectionsToCheck.forEach(sec => {
    const details = data.metadata.section_details[sec];
    if (details) {
        console.log(`Section ${sec}: ${details.hadithnumber_first} - ${details.hadithnumber_last}`);
    } else {
        console.log(`Section ${sec}: MISSING in metadata!`);
    }
});
