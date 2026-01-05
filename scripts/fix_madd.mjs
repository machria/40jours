
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXAMPLES = [
    { id: 'baa', arabic: 'بَا' },
    { id: 'bouu', arabic: 'بُو' },
    { id: 'bii', arabic: 'بِي' },
];

const DOWNLOAD_DIR = path.join(__dirname, '../public/audio/examples');

if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function downloadAudio(example) {
    // Adding a slight pause/context might help TTS trigger elongation properly? 
    // Actually, just standard single word request should work if previous one failed randomly.
    const url = `https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=ar&q=${encodeURIComponent(example.arabic)}`;
    const filePath = path.join(DOWNLOAD_DIR, `${example.id}.mp3`);

    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${example.id}: Status code ${response.statusCode}`));
                return;
            }

            const file = fs.createWriteStream(filePath);
            response.pipe(file);

            file.on('finish', () => {
                file.close();
                console.log(`Downloaded ${example.id}.mp3`);
                resolve();
            });

            file.on('error', (err) => {
                fs.unlink(filePath, () => { }); // Delete failed file
                reject(err);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

async function main() {
    console.log('Starting re-download of Madd audio files...');
    for (const example of EXAMPLES) {
        try {
            await downloadAudio(example);
            await sleep(500); // Be rate-limit friendly
        } catch (error) {
            console.error(`Error downloading ${example.id}:`, error);
        }
    }
    console.log('Download complete.');
}

main();
