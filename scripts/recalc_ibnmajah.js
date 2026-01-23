const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'data/hadith/fra-ibnmajah.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const hadiths = data.hadiths;
const metadata = data.metadata;

// Group by book
const bookRanges = {};

hadiths.forEach(h => {
    let book = h.reference.book;
    const num = parseFloat(h.hadithnumber);

    // Some books might be string "0" or int 0
    book = String(book);

    if (!bookRanges[book]) {
        bookRanges[book] = {
            min: num,
            max: num,
            count: 0
        };
    }

    if (num < bookRanges[book].min) bookRanges[book].min = num;
    if (num > bookRanges[book].max) bookRanges[book].max = num;
    bookRanges[book].count++;
});

console.log('Calculated Ranges from reference.book:');
for (const [book, range] of Object.entries(bookRanges)) {
    console.log(`Book ${book}: ${range.min} - ${range.max} (Count: ${range.count})`);
}

// Compare with existing
console.log('\nExisting Metadata:');
const existing = metadata.section_details;
for (const [key, details] of Object.entries(existing)) {
    if (!bookRanges[key]) {
        console.log(`Section ${key} has NO hadiths in reference.book! (Existing range: ${details.hadithnumber_first}-${details.hadithnumber_last})`);
    } else {
        const r = bookRanges[key];
        if (r.min !== details.hadithnumber_first || r.max !== details.hadithnumber_last) {
            console.log(`Section ${key} mismatch. Real: ${r.min}-${r.max}, Meta: ${details.hadithnumber_first}-${details.hadithnumber_last}`);
        }
    }
}

// Update metadata
console.log('\nUpdating metadata...');
for (const [book, range] of Object.entries(bookRanges)) {
    // If section exists in metadata (even if empty range), update it
    // If it doesn't exist, we might need to add it or it's a new book?
    // Ibn Majah usuall bas books 0-37

    if (!metadata.section_details[book]) {
        metadata.section_details[book] = {};
    }

    metadata.section_details[book].hadithnumber_first = range.min;
    metadata.section_details[book].hadithnumber_last = range.max;
    metadata.section_details[book].arabicnumber_first = range.min; // Approx
    metadata.section_details[book].arabicnumber_last = range.max; // Approx
}

// Check for sections in metadata that have no hadiths
for (const key of Object.keys(metadata.section_details)) {
    if (!bookRanges[key]) {
        console.log(`Removing empty section from metadata: ${key}`);
        delete metadata.section_details[key];
        delete metadata.sections[key]; // Also remove title? Maybe keep title but set range to 0? User said "7 sections were empty", better to remove or fix.
        // Actually if reference.book is correct, then those sections imply no hadiths exist for them.
    }
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
console.log('Saved fra-ibnmajah.json with updated ranges.');
