/**
 * fetch_tajweed_annotations.mjs
 *
 * Télécharge les annotations Tajwid Hafs depuis l'API Quran.com (api.quran.com/api/v4)
 * pour les 114 sourates et les sauvegarde en JSON statique dans data/quran/tajweed/.
 *
 * Format du fichier de sortie par sourate (ex: data/quran/tajweed/1.json) :
 *   { "1:1": "<tajweed class=ham_wasl>ٱ</tajweed>للَّهِ ...", "1:2": "...", ... }
 *
 * Les 15 classes retournées par l'API (Hafs 'an Asim, rivayat Hafs) :
 *   madda_necessary    – مد لازم        (6 harakat)  → rouge foncé
 *   madda_obligatory   – مد واجب متصل  (4-5 harakat) → rouge
 *   madda_permissible  – مد جائز منفصل (2/4/6 harakat) → orange
 *   madda_normal       – مد طبيعي      (2 harakat)   → orange
 *   ghunnah            – غنة            → vert
 *   idgham_ghunnah     – إدغام بغنة     → vert
 *   idgham_shafawi     – إدغام شفوي     → vert
 *   ikhafa             – إخفاء حقيقي    → vert
 *   ikhafa_shafawi     – إخفاء شفوي     → vert
 *   iqlab              – إقلاب          → vert
 *   ham_wasl           – همزة الوصل     → gris
 *   idgham_wo_ghunnah  – إدغام بلا غنة  → gris
 *   laam_shamsiyah     – لام شمسية      → gris
 *   slnt               – حرف لا يُلفظ   → gris
 *   qalaqah            – قلقلة          → bleu
 *
 * Usage : node scripts/fetch_tajweed_annotations.mjs
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT_DIR = path.join(__dirname, '../data/quran/tajweed');

if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
}

/** Retries an HTTP GET request up to maxRetries times with exponential backoff. */
function fetchJson(url, retries = 3) {
    return new Promise((resolve, reject) => {
        const attempt = (remaining) => {
            https.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; QuranApp/1.0)',
                    'Accept': 'application/json',
                }
            }, (res) => {
                if (res.statusCode === 429 && remaining > 0) {
                    // Rate limited — wait and retry
                    const wait = (4 - remaining) * 2000;
                    console.warn(`  Rate limited, retrying in ${wait}ms...`);
                    setTimeout(() => attempt(remaining - 1), wait);
                    res.resume();
                    return;
                }
                if (res.statusCode !== 200) {
                    res.resume();
                    return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
                }
                const chunks = [];
                res.on('data', chunk => chunks.push(chunk));
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
                    } catch (e) {
                        reject(new Error(`JSON parse error: ${e.message}`));
                    }
                });
                res.on('error', reject);
            }).on('error', (err) => {
                if (remaining > 0) {
                    const wait = (4 - remaining) * 2000;
                    console.warn(`  Network error, retrying in ${wait}ms...`);
                    setTimeout(() => attempt(remaining - 1), wait);
                } else {
                    reject(err);
                }
            });
        };
        attempt(retries);
    });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchSurahTajweed(surahNum) {
    const url = `https://api.quran.com/api/v4/quran/verses/uthmani_tajweed?chapter_number=${surahNum}`;
    const data = await fetchJson(url);

    const result = {};
    for (const verse of (data.verses || [])) {
        if (verse.verse_key && verse.text_uthmani_tajweed) {
            result[verse.verse_key] = verse.text_uthmani_tajweed;
        }
    }
    return result;
}

async function main() {
    console.log('=== Téléchargement des annotations Tajwid Hafs (Quran.com API) ===');
    console.log(`Destination : ${OUT_DIR}`);
    console.log('');

    let downloaded = 0;
    let skipped = 0;
    let errors = 0;

    for (let surah = 1; surah <= 114; surah++) {
        const outFile = path.join(OUT_DIR, `${surah}.json`);

        if (fs.existsSync(outFile)) {
            console.log(`[${surah.toString().padStart(3, '0')}/114] ✓ Déjà présent — sourate ${surah}`);
            skipped++;
            continue;
        }

        try {
            process.stdout.write(`[${surah.toString().padStart(3, '0')}/114] Téléchargement sourate ${surah}... `);
            const data = await fetchSurahTajweed(surah);
            const count = Object.keys(data).length;
            fs.writeFileSync(outFile, JSON.stringify(data), 'utf-8');
            console.log(`✓ ${count} versets`);
            downloaded++;
        } catch (err) {
            console.error(`✗ Erreur : ${err.message}`);
            errors++;
        }

        // Politesse vis-à-vis de l'API (300ms entre requêtes)
        await sleep(300);
    }

    console.log('');
    console.log(`=== Terminé : ${downloaded} téléchargés, ${skipped} ignorés, ${errors} erreurs ===`);

    if (errors > 0) {
        console.log('Relancez le script pour reprendre les fichiers manquants.');
        process.exit(1);
    }
}

main().catch(err => {
    console.error('Erreur fatale :', err);
    process.exit(1);
});
