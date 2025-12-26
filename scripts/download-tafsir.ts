
import fs from 'fs';
import path from 'path';
import { translateText } from '../lib/translator';

const OUTPUT_FILE = path.join(process.cwd(), 'data', 'tafsir-fr.json');
// Default to 2 Surahs for testing unless FULL_DOWNLOAD is set
const SURAH_COUNT = process.env.FULL_DOWNLOAD ? 114 : 2;

// Simple delay to avoid rate limits
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface TafsirEntry {
    surah: number;
    ayah: number;
    tafsir: string;
}

// Arabic Unicode Range for regex
const ARABIC_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+/g;

async function fetchAndTranslateTafsir() {
    console.log('Starting Tafsir download and translation...');
    const allTafsirs: TafsirEntry[] = [];

    // Check if file exists to resume?
    // For now, simpler to just run. Ideally we'd implement resume logic.

    for (let s = 1; s <= SURAH_COUNT; s++) {
        // Fetch surah meta to know ayah count? 
        // Or just fetch individual ayahs until 404?
        // Or better: use quran-data.json to know how many ayahs per surah.

        // Let's load quran-data first to know structure
        // Assuming we can just iterate.
        // Actually, for speed, let's just fetch by (Surah, Ayah).
        // But we need to know how many Ayahs.
        // Let's read quran-data.json
        const quranDataPath = path.join(process.cwd(), 'data', 'quran-data.json');
        const quranData = JSON.parse(fs.readFileSync(quranDataPath, 'utf-8'));

        // quranData is indexed by page number... that's annoying for this.
        // Let's flatten it first to get Ayah counts per Surah.
        const surahAyahCounts: { [key: number]: number } = {};
        Object.values(quranData).forEach((page: any) => {
            page.forEach((ayah: any) => {
                const currentMax = surahAyahCounts[ayah.surah] || 0;
                if (ayah.ayah > currentMax) {
                    surahAyahCounts[ayah.surah] = ayah.ayah;
                }
            });
        });

        const ayahCount = surahAyahCounts[s];
        console.log(`Processing Surah ${s} (${ayahCount} ayahs)...`);

        for (let a = 1; a <= ayahCount; a++) {
            try {
                // Try fetching english Tafsir
                const url = `https://quranapi.pages.dev/api/tafsir/${s}_${a}.json`;
                const res = await fetch(url);
                if (!res.ok) {
                    console.error(`Failed to fetch Tafsir for ${s}:${a}`);
                    continue;
                }
                const json = await res.json(); // Type: any
                const englishContent = json.tafsirs?.[0]?.content; // Type: string

                if (!englishContent) {
                    console.warn(`No content for ${s}:${a}`);
                    continue;
                }

                // --- TRANSLATION LOGIC (Duplicated from quranApi.ts but purely script-side) ---

                // 1. Preserve Arabic
                const placeholders: string[] = [];
                const textToTranslate = englishContent.replace(ARABIC_REGEX, (match: string) => {
                    placeholders.push(match);
                    return `__PH_${placeholders.length - 1}__`;
                });

                // 2. Translate
                // Add retry logic for translation
                let frenchContent = "";
                let retries = 3;
                while (retries > 0) {
                    try {
                        frenchContent = await translateText(textToTranslate, 'en', 'fr');
                        break;
                    } catch (err) {
                        retries--;
                        console.log(`Translation failed for ${s}:${a}, retrying...`);
                        await delay(2000);
                    }
                }

                if (!frenchContent) {
                    console.error(`Failed to translate ${s}:${a} after retries.`);
                    frenchContent = englishContent; // Fallback
                }

                // 3. Restore Arabic
                placeholders.forEach((arabic, index) => {
                    const pattern = new RegExp(`__\\s*(?:PH|ARABE|ARABIC)\\s*_\\s*${index}\\s*__`, 'gi');
                    frenchContent = frenchContent.replace(pattern, arabic);
                });

                allTafsirs.push({
                    surah: s,
                    ayah: a,
                    tafsir: frenchContent
                });

                // Progress log every 10 ayahs
                if (a % 10 === 0) process.stdout.write('.');

                // Rate limit protection
                await delay(200);

            } catch (error) {
                console.error(`Error processing ${s}:${a}`, error);
            }
        }
        console.log('\n'); // Newline after dots

        // Save intermediate results?
        // Useful if it crashes.
        if (s % 5 === 0) {
            fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allTafsirs, null, 2));
            console.log(`Saved progress up to Surah ${s}`);
        }
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allTafsirs, null, 2));
    console.log('Done! Saved to ' + OUTPUT_FILE);
}

fetchAndTranslateTafsir();
