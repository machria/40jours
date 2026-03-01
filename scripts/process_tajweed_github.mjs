/**
 * process_tajweed_github.mjs
 *
 * Télécharge le dataset Tajwid Hafs depuis le dépôt GitHub ascorbic-acid/quran_data
 * (accessible depuis ce sandbox) et génère les fichiers par sourate dans
 * data/quran/tajweed/{surah}.json.
 *
 * Alternative à fetch_tajweed_annotations.mjs (qui requiert api.quran.com).
 *
 * Source : https://raw.githubusercontent.com/ascorbic-acid/quran_data/master/quran_data.json
 * Format source : qpc_tajweed_text — texte QPC avec balises <rule class=...> et </rule>
 *
 * Format de sortie par sourate :
 *   { "2:1": "<rule class=madda_necessary>لٓ</rule>...", ... }
 *
 * Usage : node scripts/process_tajweed_github.mjs
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const OUT_DIR  = path.join(__dirname, '../data/quran/tajweed');
const DATA_URL = 'https://raw.githubusercontent.com/ascorbic-acid/quran_data/master/quran_data.json';

if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
}

function fetchRaw(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Node.js' } }, res => {
            if (res.statusCode !== 200) {
                res.resume();
                return reject(new Error(`HTTP ${res.statusCode}`));
            }
            const chunks = [];
            res.on('data', c => chunks.push(c));
            res.on('end',  () => resolve(Buffer.concat(chunks).toString('utf8')));
            res.on('error', reject);
        }).on('error', reject);
    });
}

/**
 * Supprime le numéro de verset arabe en fin de texte.
 * Ex : "...نَ ٢"  →  "...نَ"
 */
function stripVerseNumber(text) {
    // Chiffres arabes-indics (٠-٩ U+0660-U+0669) + espacess + marque fin-verset (۝ U+06DD)
    return text.replace(/[\s\u06DD\u0660-\u0669]+$/, '');
}

async function main() {
    console.log('=== Traitement Tajwid Hafs depuis GitHub ===');
    console.log(`Source  : ${DATA_URL}`);
    console.log(`Dest    : ${OUT_DIR}`);
    console.log('');

    console.log('Téléchargement du dataset (~5 MB)...');
    const raw  = await fetchRaw(DATA_URL);
    const data = JSON.parse(raw);
    console.log(`✓ ${data.length} sourates chargées\n`);

    let total = 0;
    let skipped = 0;

    for (const surah of data) {
        const surahNum = surah.number;
        const outFile  = path.join(OUT_DIR, `${surahNum}.json`);

        if (fs.existsSync(outFile)) {
            console.log(`[${String(surahNum).padStart(3,'0')}/114] ✓ Déjà présent — ${surah.englishName}`);
            skipped++;
            continue;
        }

        const result = {};
        let count = 0;

        for (const ayah of (surah.ayahs || [])) {
            const rawText = ayah.qpc_tajweed_text;
            if (!rawText) continue;

            const verseKey  = `${surahNum}:${ayah.numberInSurah}`;
            result[verseKey] = stripVerseNumber(rawText);
            count++;
        }

        fs.writeFileSync(outFile, JSON.stringify(result), 'utf-8');
        console.log(`[${String(surahNum).padStart(3,'0')}/114] ✓ ${surah.englishName} — ${count} versets`);
        total += count;
    }

    console.log('');
    console.log(`=== Terminé : ${total} versets traités, ${skipped} fichiers ignorés ===`);
    console.log('Lancez maintenant : npm run build  (ou npm run dev)');
}

main().catch(err => {
    console.error('Erreur fatale :', err);
    process.exit(1);
});
