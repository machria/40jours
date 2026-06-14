import fs from 'fs';
import path from 'path';
import { QURAN_THEMES_TAXONOMY } from '../data/quran-themes-taxonomy';

// Génère data/quran-themes.json à partir de la traduction française (signal principal)
// avec fallback sur le Tafsir pour les ayahs sans correspondance.
// Exécuter avant scripts/indexer.ts si les thèmes ont changé.

const QURAN_FILE = path.join(process.cwd(), 'data', 'quran-data.json');
const TAFSIR_DIR = path.join(process.cwd(), 'data', 'tafsir');
const OUTPUT_FILE = path.join(process.cwd(), 'data', 'quran-themes.json');
const MAX_THEMES_PER_AYAH = 5;

function normalizeFrench(text: string): string {
    if (!text) return "";
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "");
}

interface ThemeMatcher {
    id: string;
    regexes: RegExp[];
}

function buildMatchers(): ThemeMatcher[] {
    return QURAN_THEMES_TAXONOMY.map(theme => ({
        id: theme.id,
        regexes: theme.keywords.map(k => new RegExp(`\\b${k}`, 'g')),
    }));
}

function matchThemes(text: string, matchers: ThemeMatcher[]): { id: string; hits: number }[] {
    const matches: { id: string; hits: number }[] = [];
    for (const matcher of matchers) {
        let hits = 0;
        for (const regex of matcher.regexes) {
            const found = text.match(regex);
            if (found) hits += found.length;
        }
        if (hits > 0) matches.push({ id: matcher.id, hits });
    }
    return matches;
}

function generate() {
    console.log('Generating Quran themes...');

    if (!fs.existsSync(QURAN_FILE)) {
        console.error('Quran data not found!');
        process.exit(1);
    }
    const quranPages = JSON.parse(fs.readFileSync(QURAN_FILE, 'utf-8'));
    const matchers = buildMatchers();
    const result: Record<string, string[]> = {};

    let total = 0;
    let tafsirFallbackCount = 0;

    Object.values(quranPages).forEach((page: any) => {
        page.forEach((ayah: any) => {
            total++;
            const key = `${ayah.surah}:${ayah.ayah}`;
            let matches = matchThemes(normalizeFrench(ayah.translation), matchers);

            if (matches.length === 0) {
                const tafsirPath = path.join(TAFSIR_DIR, `${ayah.surah}_${ayah.ayah}.json`);
                if (fs.existsSync(tafsirPath)) {
                    const tafsir = JSON.parse(fs.readFileSync(tafsirPath, 'utf-8'));
                    matches = matchThemes(normalizeFrench(tafsir.tafsir || ''), matchers);
                    if (matches.length > 0) tafsirFallbackCount++;
                }
            }

            if (matches.length > 0) {
                matches.sort((a, b) => b.hits - a.hits);
                result[key] = matches.slice(0, MAX_THEMES_PER_AYAH).map(m => m.id);
            }
        });
    });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result));

    const tagged = Object.keys(result).length;
    console.log(`Tagged ${tagged} / ${total} ayahs (${tafsirFallbackCount} via tafsir fallback).`);
    console.log(`Untagged: ${total - tagged}.`);

    const distribution: Record<string, number> = {};
    Object.values(result).forEach(themes => {
        themes.forEach(t => { distribution[t] = (distribution[t] || 0) + 1; });
    });
    console.log('Distribution par theme:');
    Object.entries(distribution)
        .sort((a, b) => b[1] - a[1])
        .forEach(([id, count]) => console.log(`  ${id}: ${count}`));

    console.log(`Saved to ${OUTPUT_FILE}`);
    console.log(`Size: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1)} KB`);
}

generate();
