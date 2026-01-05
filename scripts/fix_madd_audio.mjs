
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// We use slightly modified Arabic text to force the TTS to prolong the vowel
const REPAIR_EXAMPLES = [
    { id: 'bab', arabic: 'بَااب' }, // Double Alif for length
    // { id: 'hout', arabic: 'حُوووووووووت' },
    // { id: 'tin', arabic: 'تِيييييييييين' },
];

const DOWNLOAD_DIR = path.join(__dirname, '../public/audio/examples');

if (!fs.existsSync(DOWNLOAD_DIR)) {
    console.log(`Creating directory ${DOWNLOAD_DIR}`);
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function downloadAudio(example) {
    // user requested ar-SA and slow speed (ttsspeed=0.24 is approx 0.75x or slower)
    // switching client to tw-ob which usually honors ttsspeed better, or stick to gtx
    const url = `https://translate.googleapis.com/translate_tts?client=tw-ob&ie=UTF-8&tl=ar-SA&ttsspeed=0.24&q=${encodeURIComponent(example.arabic)}`;
    const filePath = path.join(DOWNLOAD_DIR, `${example.id}.mp3`);

    console.log(`Downloading ${example.id} with query "${example.arabic}"...`);

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
                console.log(`Successfully updated ${example.id}.mp3`);
                resolve();
            });

            file.on('error', (err) => {
                fs.unlink(filePath, () => { });
                reject(err);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

async function main() {
    console.log('Starting repair of Al-Madd audio files...');
    for (const example of REPAIR_EXAMPLES) {
        try {
            await downloadAudio(example);
            await sleep(500);
        } catch (error) {
            console.error(`Error processing ${example.id}:`, error);
        }
    }
    console.log('Repair complete.');
}

main();
