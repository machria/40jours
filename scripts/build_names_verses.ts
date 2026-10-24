// Génère data/names-verses.json : texte arabe + traduction française (Hamidullah)
// des versets référencés dans data/names.ts, extraits de data/quran/pages.
// À relancer après toute modification des références : npx tsx scripts/build_names_verses.ts
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PAGES_DIR = path.join(DATA_DIR, 'quran', 'pages');
const NAMES_FILE = path.join(DATA_DIR, 'names.ts');
const OUTPUT_FILE = path.join(DATA_DIR, 'names-verses.json');

interface PageAyah {
    surah: number;
    ayah: number;
    text: string;
    translation: string;
    surahName: string;
}

// Références de la forme v(sourate, ayah, ...)
const refs = new Set<string>();
for (const m of fs.readFileSync(NAMES_FILE, 'utf8').matchAll(/\bv\((\d+), (\d+),/g)) {
    refs.add(`${m[1]}:${m[2]}`);
}

const ayahs = new Map<string, PageAyah>();
for (const file of fs.readdirSync(PAGES_DIR)) {
    const page: PageAyah[] = JSON.parse(fs.readFileSync(path.join(PAGES_DIR, file), 'utf8'));
    for (const a of page) ayahs.set(`${a.surah}:${a.ayah}`, a);
}

const output: Record<string, { arabe: string; francais: string; sourateNom: string }> = {};
const missing: string[] = [];
for (const ref of [...refs].sort((a, b) => {
    const [sa, aa] = a.split(':').map(Number);
    const [sb, ab] = b.split(':').map(Number);
    return sa - sb || aa - ab;
})) {
    const a = ayahs.get(ref);
    if (!a) {
        missing.push(ref);
        continue;
    }
    // Les données préfixent le 1er verset de chaque sourate par la basmala
    let arabe = a.text.replace(/^﻿/, '');
    // (l'ordre des diacritiques varie : on retire les 4 premiers mots)
    if (a.ayah === 1 && a.surah !== 1 && arabe.startsWith('بِسْمِ')) arabe = arabe.split(' ').slice(4).join(' ');
    output[ref] = { arabe, francais: a.translation, sourateNom: a.surahName };
}

if (missing.length) {
    console.error(`Versets introuvables : ${missing.join(', ')}`);
    process.exit(1);
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2) + '\n');
console.log(`${Object.keys(output).length} versets écrits dans ${path.relative(process.cwd(), OUTPUT_FILE)}`);
