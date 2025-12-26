
import fs from 'fs';
import path from 'path';

async function fetchSurahs() {
    console.log('Fetching Surah Metadata...');
    // Only need one locale to get the metadata structure
    const res = await fetch('http://api.alquran.cloud/v1/surah');
    const data = await res.json();

    if (data.code !== 200) {
        console.error('Failed to fetch surahs');
        process.exit(1);
    }

    const surahs = data.data.map((s: any) => ({
        number: s.number,
        name: s.name,
        englishName: s.englishName,
        englishNameTranslation: s.englishNameTranslation,
        numberOfAyahs: s.numberOfAyahs,
        revelationType: s.revelationType // "Meccan" or "Medinan"
    }));

    const outputPath = path.join(process.cwd(), 'data', 'surahs.json');
    fs.writeFileSync(outputPath, JSON.stringify(surahs, null, 2));
    console.log(`Saved ${surahs.length} surahs to ${outputPath}`);
}

fetchSurahs();
