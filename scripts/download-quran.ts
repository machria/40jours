import fs from 'fs';
import path from 'path';

async function downloadQuran() {
    console.log('Fetching Arabic Quran...');
    const arResponse = await fetch('http://api.alquran.cloud/v1/quran/quran-uthmani');
    const arData = await arResponse.json();

    console.log('Fetching French QuranTranslation...');
    const frResponse = await fetch('http://api.alquran.cloud/v1/quran/fr.hamidullah');
    const frData = await frResponse.json();

    if (arData.code !== 200 || frData.code !== 200) {
        console.error('Failed to fetch data');
        process.exit(1);
    }

    const arSurahs = arData.data.surahs;
    const frSurahs = frData.data.surahs;

    const pages: Record<number, any[]> = {};

    // Initialize pages 1-604
    for (let i = 1; i <= 604; i++) {
        pages[i] = [];
    }

    // Iterate and merge
    arSurahs.forEach((surah: any, sIndex: number) => {
        const frSurah = frSurahs[sIndex];

        surah.ayahs.forEach((ayah: any, aIndex: number) => {
            const frAyah = frSurah.ayahs[aIndex];
            const pageNum = ayah.page;

            if (!pages[pageNum]) {
                pages[pageNum] = []; // Should not happen if initialized, but safety
            }

            pages[pageNum].push({
                id: ayah.number, // Global verse number
                surah: surah.number,
                ayah: ayah.numberInSurah,
                text: ayah.text,
                translation: frAyah.text,
                juz: ayah.juz,
                page: pageNum,
                surahName: surah.englishName, // or name
                surahNameAr: surah.name
            });
        });
    });

    const outputPath = path.join(process.cwd(), 'data', 'quran-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(pages, null, 2));
    console.log(`Successfully saved Quran data to ${outputPath}`);
}

downloadQuran();
