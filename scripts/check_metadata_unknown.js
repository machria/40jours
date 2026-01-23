const fs = require('fs');
const path = require('path');

const collections = ['ibnmajah', 'nasai'];
collections.forEach(col => {
    const p = path.join(process.cwd(), 'public/hadith', col, 'metadata.json');
    if (fs.existsSync(p)) {
        const meta = JSON.parse(fs.readFileSync(p, 'utf8'));
        const keys = Object.keys(meta.section_details || {});
        console.log(`Collection: ${col}`);
        console.log('Sections:', keys.join(', '));
        if (keys.includes('unknown')) {
            console.log(`FOUND unknown section in ${col}!`);
        } else {
            console.log(`No unknown section in ${col}.`);
        }
    } else {
        console.log(`${col} metadata not found.`);
    }
});
