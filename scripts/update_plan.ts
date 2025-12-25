
import fs from 'fs';
import path from 'path';

const quranPath = path.join(process.cwd(), 'data', 'quran-data.json');
const outputPath = path.join(process.cwd(), 'data', 'plan40jours.ts');

if (!fs.existsSync(quranPath)) {
    console.error(`Quran data not found at ${quranPath}`);
    process.exit(1);
}

const quranData = JSON.parse(fs.readFileSync(quranPath, 'utf-8'));

const totalPages = 604;
const days = 40;
const pagesPerDay = totalPages / days;

const plan = [];
let currentPage = 1;

for (let i = 1; i <= days; i++) {
    let endPage = Math.round(i * pagesPerDay);
    if (i === days) endPage = totalPages;
    if (endPage > totalPages) endPage = totalPages;

    const startPage = currentPage;

    // Get Surah names
    const startPageData = quranData[startPage];
    const endPageData = quranData[endPage];

    // Fallback if data missing (should be there)
    const startSurah = startPageData?.[0]?.surahName || "Inconnu";
    const endSurah = endPageData?.[endPageData.length - 1]?.surahName || "Inconnu";

    let label = "";
    if (startSurah === endSurah) {
        label = startSurah;
    } else {
        label = `${startSurah} - ${endSurah}`;
    }

    plan.push({
        jour: i,
        pages: `${startPage}-${endPage}`,
        startPage,
        endPage,
        sourates: label,
        juz: Math.ceil(startPage / 20),
    });

    currentPage = endPage + 1;
}

const fileContent = `export type ReadingDay = {
    jour: number;
    pages: string;
    startPage: number;
    endPage: number;
    sourates: string;
    juz: number;
};

export const plan40jours: ReadingDay[] = ${JSON.stringify(plan, null, 4)};
`;

fs.writeFileSync(outputPath, fileContent);
console.log(`Updated plan40jours.ts with ${days} days.`);
