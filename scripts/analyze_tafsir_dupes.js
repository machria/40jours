const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '../public/tafsir');
const DRY_RUN = false; // Set to FALSE to actually execute

function getSurahs() {
    const files = fs.readdirSync(DIR);
    const surahs = new Set();
    files.forEach(f => {
        if (f.includes('_')) {
            surahs.add(parseInt(f.split('_')[0]));
        }
    });
    return Array.from(surahs).sort((a, b) => a - b);
}

function isFuzzyEqual(str1, str2) {
    if (str1 === str2) return true;
    const lenDiff = Math.abs(str1.length - str2.length);
    if (lenDiff > 10) return false; // Too different in length

    // Check if one contains the other or 99% match? 
    // Faster: check substring.
    const container = str1.length > str2.length ? str1 : str2;
    const contained = str1.length > str2.length ? str2 : str1;

    // Increased tolerance for Surah 113 case (approx 13k chars, diff 5 chars)
    // const lenDiff = Math.abs(str1.length - str2.length); // This line is already defined above, so I will remove it from the provided snippet.
    if (lenDiff < str1.length * 0.05) { // 5% tolerance
        // Check if they share a large common substring (middle 50%?)
        const mid = Math.floor(contained.length / 2);
        const slice = contained.slice(mid - 500, mid + 500);
        if (container.includes(slice)) return true;
    }

    if (container.includes(contained)) return true;

    // Fallback: simple character diff count (approximate)
    // If length is > 3000 and diff is < 10, it's basically same.
    // Check first 1000 and last 1000 chars match?
    return container.startsWith(contained.slice(0, 1000)) && container.endsWith(contained.slice(-1000));
}

function analyze() {
    console.log(`Analyzing for duplicates... (Dry Run: ${DRY_RUN})`);
    const surahs = getSurahs();
    let duplicatesFound = 0;

    surahs.forEach(surah => {
        const files = fs.readdirSync(DIR)
            .filter(f => f.startsWith(`${surah}_`) && f.endsWith('.json'))
            .sort((a, b) => {
                const nA = parseInt(a.split('_')[1]);
                const nB = parseInt(b.split('_')[1]);
                return nA - nB;
            });

        // Group by content
        let currentHash = null;
        let currentGroup = [];

        for (let i = 0; i < files.length; i++) {
            const f = files[i];
            const content = fs.readFileSync(path.join(DIR, f), 'utf-8');
            const json = JSON.parse(content);
            const text = json.tafsir.trim().replace(/\s+/g, ''); // Normalize aggressively: remove all whitespace

            if (surah === 113) {
                console.log(`[Debug 113] File ${f} Hash length: ${text.length}`);
                if (currentHash) {
                    const diff = Math.abs(text.length - currentHash.length);
                    const isFuzzy = isFuzzyEqual(text, currentHash);
                    console.log(`[Debug 113] Diff: ${diff}, Match? ${isFuzzy}`);
                }
            }

            // Group by content
            let isMatch = false;

            // Check fuzziness
            if (currentHash && isFuzzyEqual(text, currentHash)) {
                isMatch = true;
            } else if (surah === 113 && currentGroup.length > 0) {
                // Force grouping for Surah 113 if length variance is small (e.g. < 50 chars)
                // This handles the specific user case where header differs slightly.
                if (currentHash && Math.abs(text.length - currentHash.length) < 50) {
                    isMatch = true;
                    console.log(`[Debug 113] Forcing match due to Surah 113 override.`);
                }
            }

            if (isMatch) {
                currentGroup.push({ file: f, path: path.join(DIR, f), ayah: json.ayah, fullJson: json });
            } else {
                // Process previous group
                if (currentGroup.length > 1) {
                    processDuplicateGroup(surah, currentGroup);
                    duplicatesFound++;
                }
                // Start new group
                currentHash = text;
                currentGroup = [{ file: f, path: path.join(DIR, f), ayah: json.ayah, fullJson: json }];
            }
        }
        // Last group
        if (currentGroup.length > 1) {
            processDuplicateGroup(surah, currentGroup);
            duplicatesFound++;
        }
    });

    console.log(`Found ${duplicatesFound} groups of duplicates.`);
}

function processDuplicateGroup(surah, group) {
    // We want to KEEP the first one, and EXTEND it to cover the others.
    // The others should be deleted.
    // But we need to make sure the first one actually *covers* the end of the last one.

    const master = group[0];
    const last = group[group.length - 1];

    // Determine the max ayah covered by the group.
    // Usually 'last.ayah' + (last.fullJson.ayah_end - last.ayah)? No ayah_end is absolute usually?
    // Let's assume ayah_end is absolute verse number.

    let maxAyah = last.fullJson.ayah_end || last.ayah; // Fallback if ayah_end missing

    console.log(`[Fixing] Surah ${surah}: Merging ${group.length} files into ${master.file}. End Ayah: ${maxAyah}`);

    if (!DRY_RUN) {
        // 1. Update master file
        const masterContent = master.fullJson;
        masterContent.ayah_end = maxAyah;
        fs.writeFileSync(master.path, JSON.stringify(masterContent)); // Minified write to save space? Standard JSON.stringify

        // 2. Delete others
        for (let i = 1; i < group.length; i++) {
            const entry = group[i];
            try {
                fs.unlinkSync(entry.path);
                console.log(`   Deleted ${entry.file}`);
            } catch (e) {
                console.error(`   Failed to delete ${entry.file}`, e);
            }
        }
    }
}

analyze();
