const fs = require('fs');
const path = require('path');

const col = 'ibnmajah';
const p = path.join(process.cwd(), 'public/hadith', col, 'metadata.json');
if (fs.existsSync(p)) {
    const meta = JSON.parse(fs.readFileSync(p, 'utf8'));
    const keys = Object.keys(meta.section_details || {});
    if (keys.includes('unknown')) {
        console.log(`YES: ibnmajah has unknown section`);
    } else {
        console.log(`NO: ibnmajah does NOT have unknown section`);
    }
} else {
    console.log(`${col} metadata not found.`);
}
