
import fs from 'fs';
import path from 'path';
import https from 'https';
import { promisify } from 'util';

const audioDir = path.join(process.cwd(), 'public', 'audio');

if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
}

// Quran Structure (Surah: Total Ayahs)
const surahAyahs = [
    7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 98, 135,
    112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85,
    54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13,
    14, 11, 11, 18, 12, 12, 30, 52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42,
    29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11,
    11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6
];

const BASE_URL = "https://verses.quran.com/Alafasy/mp3/";

async function downloadFile(url: string, dest: string) {
    if (fs.existsSync(dest)) return; // Skip if exists

    return new Promise<void>((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                file.close();
                fs.unlink(dest, () => { }); // Delete partial
                reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            reject(err);
        });
    });
}

async function main() {
    console.log("Starting Audio Download for 114 Surahs...");

    let totalFiles = 0;
    const queue: { url: string, dest: string }[] = [];

    // prepare queue
    for (let s = 1; s <= 114; s++) {
        const ayahCount = surahAyahs[s - 1];
        for (let a = 1; a <= ayahCount; a++) {
            const surahPad = s.toString().padStart(3, '0');
            const ayahPad = a.toString().padStart(3, '0');
            const fileName = `${surahPad}${ayahPad}.mp3`;

            queue.push({
                url: `${BASE_URL}${fileName}`,
                dest: path.join(audioDir, fileName)
            });
        }
    }

    totalFiles = queue.length;
    console.log(`Total files to download: ${totalFiles}`);

    // Process with concurrency limit
    const CONCURRENCY = 20;
    let completed = 0;

    for (let i = 0; i < queue.length; i += CONCURRENCY) {
        const batch = queue.slice(i, i + CONCURRENCY);
        await Promise.all(batch.map(async (item) => {
            try {
                await downloadFile(item.url, item.dest);
            } catch (e: any) {
                console.error(`Error downloading ${item.url}: ${e.message}`);
            }
        }));

        completed += batch.length;
        if (completed % 100 === 0 || completed >= totalFiles) {
            console.log(`Progress: ${completed}/${totalFiles} (${Math.round(completed / totalFiles * 100)}%)`);
        }
    }

    console.log("Download Complete!");
}

main();
