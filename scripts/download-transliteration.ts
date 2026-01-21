
import fs from 'fs';
import path from 'path';

async function downloadTransliteration() {
    console.log('Fetching Quran Transliteration...');
    try {
        const response = await fetch('http://api.alquran.cloud/v1/quran/en.transliteration');
        const data = await response.json();

        if (data.code !== 200) {
            console.error('Failed to fetch transliteration data:', data.status);
            process.exit(1);
        }

        const surahs = data.data.surahs;
        const flattenedQuran: any[] = [];

        surahs.forEach((surah: any) => {
            surah.ayahs.forEach((ayah: any) => {
                flattenedQuran.push({
                    chapter: surah.number,
                    verse: ayah.numberInSurah,
                    text: ayah.text
                });
            });
        });

        const outputData = {
            quran: flattenedQuran
        };

        const outputPath = path.join(process.cwd(), 'data', 'quran-transliteration.json');
        fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));
        console.log(`Successfully saved transliteration data to ${outputPath} (${flattenedQuran.length} verses)`);

    } catch (error) {
        console.error('Error downloading transliteration:', error);
        process.exit(1);
    }
}

downloadTransliteration();
