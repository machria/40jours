// Run after scripts/generate-quran-themes.ts if the themes (data/quran-themes.json) have changed.
import fs from 'fs';
import path from 'path';

// Paths
const DATA_DIR = path.join(process.cwd(), 'data');
const SEARCH_DIR = path.join(DATA_DIR, 'search');
const QURAN_FILE = path.join(DATA_DIR, 'quran-data.json');
const TAFSIR_FILE = path.join(DATA_DIR, 'tafsir-fr.json');
const THEMES_FILE = path.join(DATA_DIR, 'quran-themes.json');
const QURAN_INDEX_OUTPUT = path.join(SEARCH_DIR, 'quran-index.json');
const TAFSIR_INDEX_OUTPUT = path.join(SEARCH_DIR, 'tafsir-index.json');

// Types
interface SearchIndexItem {
    id: string; // "s:a" (Surah:Ayah)
    // content to search
    ar_norm: string;
    fr_norm: string;
    tafsir_norm: string;
    themes: string[];

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

    // Load thematic tags (generated via scripts/generate-quran-themes.ts)
    const themesMap: Record<string, string[]> = fs.existsSync(THEMES_FILE)
        ? JSON.parse(fs.readFileSync(THEMES_FILE, 'utf-8'))
        : {};

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
                tafsir_norm: normalizeFrench(tafsirText),
                themes: themesMap[key] || []
            });
        });
    });

    // Write Optimized Index
    // We can minimize keys to save space: "s", "a", "an" (ar_norm), "fn" (fr_norm), "tn" (tafsir_norm), "th" (themes)
    const minimizedIndex = index.map(item => ({
        id: item.id,
        s: item.s,
        a: item.a,
        an: item.ar_norm,
        fn: item.fr_norm,
        tn: item.tafsir_norm,
        th: item.themes
    }));

    if (!fs.existsSync(SEARCH_DIR)) {
        fs.mkdirSync(SEARCH_DIR, { recursive: true });
    }

    // Write Quran Index (Contains everything for now, or split?)
    // actions.ts reads quran-index.json for searchQuran (uses an, fn)
    // actions.ts reads tafsir-index.json for searchTafsir (uses tn)
    // We can just write the same full index to both, or split to save space.
    // For simplicity and to ensure data availability, let's write the full index to quran-index.json.
    // For tafsir-index.json, we can check if we want to include only verses with tafsir?
    // But since current tafsir logic is "tafsir for every verse" (conceptually), let's write full index to both or just use one?
    // The app expects two files. Let's write the full index to both to be safe, or optimize tafsir one later.

    fs.writeFileSync(QURAN_INDEX_OUTPUT, JSON.stringify(minimizedIndex));
    console.log(`Quran Index built with ${minimizedIndex.length} items. Saved to ${QURAN_INDEX_OUTPUT}`);
    console.log(`Size: ${(fs.statSync(QURAN_INDEX_OUTPUT).size / 1024 / 1024).toFixed(2)} MB`);

    // Write Tafsir Index
    const tafsirIndex = minimizedIndex.filter(i => i.tn && i.tn.length > 0);
    fs.writeFileSync(TAFSIR_INDEX_OUTPUT, JSON.stringify(tafsirIndex));
    console.log(`Tafsir Index built with ${tafsirIndex.length} items. Saved to ${TAFSIR_INDEX_OUTPUT}`);
    console.log(`Size: ${(fs.statSync(TAFSIR_INDEX_OUTPUT).size / 1024 / 1024).toFixed(2)} MB`);
}

buildIndex();
