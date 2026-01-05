
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ALPHABET = [
    { id: 'alif', arabic: 'ا' },
    { id: 'ba', arabic: 'ب' },
    { id: 'ta', arabic: 'ت' },
    { id: 'tha', arabic: 'ث' },
    { id: 'jim', arabic: 'ج' },
    { id: 'ha', arabic: 'ح' },
    { id: 'kha', arabic: 'خ' },
    { id: 'dal', arabic: 'د' },
    { id: 'dhal', arabic: 'ذ' },
    { id: 'ra', arabic: 'ر' },
    { id: 'zay', arabic: 'ز' },
    { id: 'sin', arabic: 'س' },
    { id: 'shin', arabic: 'ش' },
    { id: 'sad', arabic: 'ص' },
    { id: 'dad', arabic: 'ض' },
    { id: 'ta_emph', arabic: 'ط' },
    { id: 'dha_emph', arabic: 'ظ' },
    { id: 'ayn', arabic: 'ع' },
    { id: 'ghayn', arabic: 'غ' },
    { id: 'fa', arabic: 'ف' },
    { id: 'qaf', arabic: 'ق' },
    { id: 'kaf', arabic: 'ك' },
    { id: 'lam', arabic: 'ل' },
    { id: 'mim', arabic: 'م' },
    { id: 'nun', arabic: 'ن' },
    { id: 'ha_mem', arabic: 'ه' },
    { id: 'waw', arabic: 'و' },
    { id: 'ya', arabic: 'ي' },
];

const DOWNLOAD_DIR = path.join(__dirname, '../public/audio/letters');

if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function downloadAudio(letter) {
    const url = `https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=ar&q=${encodeURIComponent(letter.arabic)}`;
    const filePath = path.join(DOWNLOAD_DIR, `${letter.id}.mp3`);

    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${letter.id}: Status code ${response.statusCode}`));
                return;
            }

            const file = fs.createWriteStream(filePath);
            response.pipe(file);

            file.on('finish', () => {
                file.close();
                console.log(`Downloaded ${letter.id}.mp3`);
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
    console.log('Starting download of audio files...');
    for (const letter of ALPHABET) {
        try {
            await downloadAudio(letter);
            await sleep(500); // Be rate-limit friendly
        } catch (error) {
            console.error(`Error downloading ${letter.id}:`, error);
        }
    }
    console.log('Download complete.');
}

main();
