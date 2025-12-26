
import fs from 'fs';
import path from 'path';

// Paths
const DATA_DIR = path.join(process.cwd(), 'data');
const QURAN_FILE = path.join(DATA_DIR, 'quran-data.json');
const TAFSIR_FILE = path.join(DATA_DIR, 'tafsir-fr.json');
const OUTPUT_INDEX = path.join(DATA_DIR, 'search-index.json');

// Types
interface SearchIndexItem {
    id: string; // "s:a" (Surah:Ayah)
    // content to search
    ar_norm: string;
    fr_norm: string;
    tafsir_norm: string;

    // Display metadata
    s: number; // Surah
    a: number; // Ayah
}

// Normalization Functions
function normalizeArabic(text: string): string {
    if (!text) return "";
    let norm = text;

    // Remove Tashkeel (Diacritics)
    // Range includes Fatha, Damma, Kasra, Sukun, Shadda, Tanwin, etc.
    norm = norm.replace(/[\u064B-\u065F\u0670]/g, "");

    // Normalize Alifs
    // آ (Madda) -> ا
    // إ (Hamza below) -> ا
    // أ (Hamza above) -> ا
    // ٱ (Wasla) -> ا
    norm = norm.replace(/[آإأٱ]/g, "ا");

    // Normalize Ya/Alif Maqsura
    // ى -> ي (Common in loose search) or keep distinct?
    // User asked "ignorer les voyelles et normaliser les Alif".
    // Usually normalization unifies ى and ي but Hafs writing distinguishes them clearly.
    // Let's stick to Alif normalization requested.

    // Remove Tatweel (Kashida) ـ
    norm = norm.replace(/\u0640/g, "");

    return norm;
}

function normalizeFrench(text: string): string {
    if (!text) return "";
    return text
        .toLowerCase()
        .normalize("NFD") // Decompose accents
        .replace(/[\u0300-\u036f]/g, ""); // Remove diacritics
}

async function buildIndex() {
    console.log('Building Search Index...');

    // 1. Load Quran Data
    if (!fs.existsSync(QURAN_FILE)) {
        console.error('Quran data not found!');
        process.exit(1);
    }
    const quranPages = JSON.parse(fs.readFileSync(QURAN_FILE, 'utf-8'));

    // 2. Load Tafsir Data (Optional if not ready yet)
    let tafsirData: any[] = [];
    if (fs.existsSync(TAFSIR_FILE)) {
        tafsirData = JSON.parse(fs.readFileSync(TAFSIR_FILE, 'utf-8'));
    } else {
        console.warn('Tafsir data not found, skipping Tafsir indexing.');
    }

    // Map Tafsir by key "s:a"
    const tafsirMap = new Map<string, string>();
    tafsirData.forEach((t: any) => {
        tafsirMap.set(`${t.surah}:${t.ayah}`, t.tafsir);
    });

    const index: SearchIndexItem[] = [];

    // Iterate through pages -> ayahs
    Object.values(quranPages).forEach((page: any) => {
        page.forEach((ayah: any) => {
            const key = `${ayah.surah}:${ayah.ayah}`;
            const tafsirText = tafsirMap.get(key) || "";

            index.push({
                id: key,
                s: ayah.surah,
                a: ayah.ayah,
                ar_norm: normalizeArabic(ayah.text),
                fr_norm: normalizeFrench(ayah.translation),
                tafsir_norm: normalizeFrench(tafsirText)
            });
        });
    });

    // Write Optimized Index
    // We can minimize keys to save space: "s", "a", "an" (ar_norm), "fn" (fr_norm), "tn" (tafsir_norm)
    const minimizedIndex = index.map(item => ({
        s: item.s,
        a: item.a,
        an: item.ar_norm,
        fn: item.fr_norm,
        tn: item.tafsir_norm
    }));

    fs.writeFileSync(OUTPUT_INDEX, JSON.stringify(minimizedIndex));
    console.log(`Index built with ${minimizedIndex.length} items. Saved to ${OUTPUT_INDEX}`);
    console.log(`Size: ${(fs.statSync(OUTPUT_INDEX).size / 1024 / 1024).toFixed(2)} MB`);
}

buildIndex();
