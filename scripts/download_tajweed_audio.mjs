
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXAMPLES = [
    { id: 'hamza_gorge', arabic: 'ء' },
    { id: 'qaf_langue', arabic: 'ق' },
    { id: 'mim_levres', arabic: 'م' },
    { id: 'fa_hams', arabic: 'ف' },
    { id: 'sad_tafkhim', arabic: 'ص' },
    { id: 'qaf_qalqala', arabic: 'قْ' },
    { id: 'man_amana', arabic: 'مَنْ آمَنَ' },
    { id: 'may_yaqoulu', arabic: 'مَنْ يَقُولُ' },
    { id: 'mim_badi', arabic: 'مِنْ بَعْدِ' },
];

const DOWNLOAD_DIR = path.join(__dirname, '../public/audio/examples');

if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function downloadAudio(example) {
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
    console.log('Starting download of Tajweed audio files...');
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
