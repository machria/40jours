
import fs from 'fs';
import path from 'path';
import https from 'https';

// --- Configuration ---
const SOURCES = {
    'al-jalalayn': {
        input: '../data/temp_tafsir/tafsir/en-al-jalalayn',
        output: '../data/tafsir/fr-al-jalalayn'
    },
    'asbab-al-nuzul': {
        input: '../data/temp_tafsir/tafsir/en-asbab-al-nuzul-by-al-wahidi',
        output: '../data/tafsir/fr-asbab-al-nuzul'
    },
    'ibn-kathir-en': {
        input: '../data/temp_tafsir/tafsir/en-tafisr-ibn-kathir',
        output: '../data/tafsir/fr-ibn-kathir-en'
    },
    'maarif-ul-quran': {
        input: '../data/temp_tafsir/tafsir/en-tafsir-maarif-ul-quran',
        output: '../data/tafsir/fr-maarif-ul-quran'
    }
};

type SourceKey = keyof typeof SOURCES;

// Parse CLI args
const args = process.argv.slice(2);
let selectedSource: SourceKey = 'al-jalalayn';
let limit = 0;
let overwrite = false;

for (let i = 0; i < args.length; i++) {
    if (args[i] === '--source') {
        const val = args[i + 1];
        if (SOURCES[val as SourceKey]) {
            selectedSource = val as SourceKey;
        } else {
            console.error(`Unknown source: ${val}. Available: ${Object.keys(SOURCES).join(', ')}`);
            process.exit(1);
        }
        i++; // skip next
    } else if (args[i] === '--limit') {
        limit = parseInt(args[i + 1], 10);
        i++;
    } else if (args[i] === '--overwrite') {
        overwrite = true;
    }
}

const config = SOURCES[selectedSource];
const sourceDir = path.resolve(__dirname, config.input);
const targetDir = path.resolve(__dirname, config.output);

console.log(`Source: ${selectedSource}`);
console.log(`Input:  ${sourceDir}`);
console.log(`Output: ${targetDir}`);
if (limit > 0) console.log(`Limit:  ${limit} files`);
if (overwrite) console.log(`Overwrite: true`);

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// Simple sleep function to respect rate limits
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Output full response on error for debugging
function translateRequest(text: string): Promise<string> {
    return new Promise((resolve, reject) => {
        // Use random user agents to avoid some blocking? (Optional, but stick to simple for now)
        // Rate limiting is handled by the caller sleep.

        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fr&dt=t&q=${encodeURIComponent(text)}`;

        const req = https.get(url, (res) => {
            const chunks: Buffer[] = [];

            if (res.statusCode !== 200) {
                // consume data to clear buffer
                res.resume();
                reject(new Error(`HTTP ${res.statusCode}`));
                return;
            }

            res.on('data', (chunk) => {
                chunks.push(Buffer.from(chunk));
            });
            res.on('end', () => {
                try {
                    const buffer = Buffer.concat(chunks);
                    const data = buffer.toString('utf-8');

                    // Check if response starts with < (HTML error)
                    if (data.trim().startsWith('<')) {
                        reject(new Error(`Received HTML instead of JSON: ${data.substring(0, 100)}...`));
                        return;
                    }

                    const json = JSON.parse(data);
                    if (json && json[0]) {
                        // Combine all parts
                        const translated = json[0].map((item: any) => item[0]).join('');
                        resolve(translated);
                    } else {
                        reject(new Error('Invalid response format'));
                    }
                } catch (e) {
                    reject(new Error(`JSON Parse Error: ${e instanceof Error ? e.message : String(e)}.`));
                }
            });
        });

        req.on('error', (err) => {
            reject(err);
        });
    });
}

// Split text into chunks < 2000 chars
async function translateText(text: string): Promise<string> {
    const MAX_CHUNK = 2000;
    if (text.length <= MAX_CHUNK) {
        return translateRequest(text);
    }

    // Split by newlines first to preserve paragraph structure
    const lines = text.split('\n');
    const chunks: string[] = [];
    let currentChunk = '';

    for (const line of lines) {
        // If adding this line exceeds max, push current and start new
        // Note: encodeURIComponent adds size, so we be conservative (2000 is safe for URL ~4-8k limits usually)
        if ((currentChunk.length + line.length) > MAX_CHUNK) {
            if (currentChunk) chunks.push(currentChunk);
            currentChunk = line;

            // If a single line is huge, we must split it further (e.g. by sentences)
            if (currentChunk.length > MAX_CHUNK) {
                const sentences = currentChunk.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [currentChunk];
                // Pop the huge line we just set
                currentChunk = '';

                for (const sentence of sentences) {
                    if ((currentChunk.length + sentence.length) > MAX_CHUNK) {
                        if (currentChunk) chunks.push(currentChunk);
                        currentChunk = sentence;
                    } else {
                        currentChunk += (currentChunk ? ' ' : '') + sentence;
                    }
                }
            }
        } else {
            currentChunk += (currentChunk ? '\n' : '') + line;
        }
    }
    if (currentChunk) chunks.push(currentChunk);

    // Translate chunks
    const results: string[] = [];
    for (const chunk of chunks) {
        if (!chunk.trim()) {
            results.push(chunk);
            continue;
        }

        try {
            const res = await translateRequest(chunk);
            results.push(res);
            await sleep(300); // Wait between chunks
        } catch (e) {
            console.error(`Error translating chunk: ${e instanceof Error ? e.message : String(e)}`);
            // Keep original if failed? Or throw?
            // Throwing stops the file. Keeping original is safer-ish?
            // Let's throw to indicate failure.
            throw e;
        }
    }

    return results.join(' '); // Join with space or newline?
    // Since we split by newline, we should probably check if we need to rejoin with newline.
    // Our chunking added newlines *inside* the chunk.
    // But between chunks, we lost the connection.
    // Actually, `translated` usually skips whitespace.
    // Simpler approach: results.join(' ') is often okay but might lose paragraph breaks.
    // Refinement: The google translate output usually returns text without the original whitespace formatting if not careful.
    // But we are concatenating results.
    return results.join(' ');
}

function getFiles(dir: string, fileList: string[] = []) {
    if (!fs.existsSync(dir)) {
        console.warn(`Directory not found: ${dir}`);
        return [];
    }
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            getFiles(filePath, fileList);
        } else {
            if (file.endsWith('.json')) {
                fileList.push(filePath);
            }
        }
    });
    return fileList;
}

async function main() {
    const allFiles = getFiles(sourceDir);
    console.log(`Found ${allFiles.length} files.`);

    // Sort files to process in order (1_1, 1_2, ...)
    // This helps in tracking progress.
    allFiles.sort((a, b) => {
        const getNum = (p: string) => {
            const base = path.basename(p, '.json');
            const [s, ay] = base.split('_').map(Number);
            return s * 10000 + ay;
        };
        // The paths might be .../1/1.json which is not s_a format in SOURCE.
        // Source files are .../en-tafsir-maarif-ul-quran/1/1.json (nested folders)
        // Our target is flat s_a.json or nested?
        // Script logic: read `data` content which has surah/ayah.
        // We can't sort easily without reading.
        // Let's just rely on default walk order but maybe randomized?
        // readdir is usually OS dependent.
        return a.localeCompare(b);
    });

    let filesToProcess = allFiles;

    if (limit > 0) {
        filesToProcess = filesToProcess.slice(0, limit);
    }

    console.log(`Processing ${filesToProcess.length} files.`);
    let processedCount = 0;
    let errorCount = 0;

    for (const filePath of filesToProcess) {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const data = JSON.parse(content);

            // Output filename: [surah]_[ayah].json
            const outName = `${data.surah}_${data.ayah}.json`;
            const outPath = path.join(targetDir, outName);

            // Skip if exists?
            if (!overwrite && fs.existsSync(outPath) && limit === 0) {
                // If checking all files, skip existing to save time/bandwidth
                // Only skip if file strictly exists and is valid (not empty)
                const stat = fs.statSync(outPath);
                if (stat.size > 0) {
                    process.stdout.write('.'); // progress indicator
                    continue;
                }
            }

            if (data.text) {
                console.log(` Translating ${data.surah}:${data.ayah} ...`);
                const translated = await translateText(data.text);

                const newData = {
                    ...data,
                    text: translated
                };

                fs.writeFileSync(outPath, JSON.stringify(newData, null, 2));
                processedCount++;
            }

            // Delay to avoid 429
            await sleep(500); // Increased delay
        } catch (error) {
            console.error(`\nError processing ${filePath}:`, error instanceof Error ? error.message : error);
            errorCount++;
        }
    }
    console.log(`\nTranslation complete. Processed: ${processedCount}. Errors: ${errorCount}.`);
}

main();
