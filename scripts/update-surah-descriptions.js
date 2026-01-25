const fs = require('fs');
const path = require('path');

const surahsPath = path.join(__dirname, '../data/surahs.json');
const detailsPath = path.join(__dirname, '../data/surah-details.json');

try {
    const surahs = JSON.parse(fs.readFileSync(surahsPath, 'utf8'));
    const details = JSON.parse(fs.readFileSync(detailsPath, 'utf8'));

    let updatedCount = 0;

    const updatedSurahs = surahs.map(surah => {
        const detail = details[surah.number.toString()];
        if (detail && detail.sections) {
            // Find section with Maqsad
            const maqsadSection = detail.sections.find(s =>
                s.title.toLowerCase().includes('maqṣad') ||
                s.title.toLowerCase().includes('maqsad') ||
                s.title.toLowerCase().includes('objectif')
            );

            if (maqsadSection) {
                // Clean up content
                let desc = maqsadSection.content.split('\n\n')[0]; // Get first paragraph

                // Remove markdown bolding
                desc = desc.replace(/\*\*/g, '').replace(/\n/g, ' ').trim();

                // Regex patterns to strip common introductions
                const patternsToRemove = [
                    /^Le maqṣad de .*? est souvent décrit comme /i,
                    /^Le maqṣad de cette sourate est (de |d')?/i,
                    /^Le maqṣad de .*? est (de |d')?/i,
                    /^Le maqṣad d’.*? est (de |d')?/i,
                    /^Le maqṣad d'.*? est (de |d')?/i,
                    /^Le maqṣad .*? peut se résumer ainsi\s*[:]\s*/i,
                    /^Le maqṣad .*? est\s*/i,
                    /^Le maqṣad central est (de |d')?/i,
                    /^Son but est (de |d')?/i,
                    /^L'objectif .*? est (de |d')?/i,
                    /^Il s'agit (de |d')?/i,
                    /^Maqṣad (de |d')?/i,
                    /^Le maqṣad (de |d')?/i
                ];

                for (const pattern of patternsToRemove) {
                    desc = desc.replace(pattern, '');
                }

                // If it starts with "de " or "d'", remove it (often left over)
                if (desc.startsWith('de ')) desc = desc.substring(3);
                if (desc.startsWith("d'")) desc = desc.substring(2);

                // Clean up initial punctuation often left (colons, dashes)
                desc = desc.replace(/^[:\-\s]+/, '');

                // Capitalize first letter
                if (desc.length > 0) {
                    desc = desc.charAt(0).toUpperCase() + desc.slice(1);
                }

                surah.description = desc;
                updatedCount++;
            }
        }
        return surah;
    });

    fs.writeFileSync(surahsPath, JSON.stringify(updatedSurahs, null, 2), 'utf8');
    console.log(`Successfully updated ${updatedCount} surahs with descriptions.`);

} catch (e) {
    console.error('Error updating surahs:', e);
}
