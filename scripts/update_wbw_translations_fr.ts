/**
 * Script de migration : traductions WBW anglais → français
 *
 * Ce script met à jour le champ `translation` de chaque mot dans les
 * 114 fichiers data/quran/word_by_word/{n}.json en utilisant les
 * traductions françaises de l'API quran.com (langue : "fr").
 *
 * Les timestamps audio et toutes les autres données sont préservés.
 *
 * Usage :
 *   npx ts-node scripts/update_wbw_translations_fr.ts
 *
 * Prérequis : accès internet (à lancer en local, pas en sandbox CI)
 */

import fs from 'fs';
import path from 'path';
import https from 'https';

const WBW_DIR = path.join(__dirname, '../data/quran/word_by_word');
const DELAY_MS = 300; // Délai entre chaque sourate pour ne pas surcharger l'API
const PER_PAGE = 50;

function fetchJson(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Node.js/quran-fr-migration' } }, (res) => {
            if (res.statusCode === 429) {
                reject(new Error(`Rate limited on ${url}`));
                return;
            }
            const chunks: Buffer[] = [];
            res.on('data', (chunk) => chunks.push(chunk));
            res.on('end', () => {
                try {
                    resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Récupère toutes les traductions françaises mot-à-mot d'une sourate.
 * Retourne une Map<wordId, frenchTranslation>.
 */
async function fetchFrenchWordTranslations(surah: number): Promise<Map<number, string>> {
    const map = new Map<number, string>();
    let page = 1;

    while (true) {
        const url = `https://api.quran.com/api/v4/verses/by_chapter/${surah}?words=true&language=fr&per_page=${PER_PAGE}&page=${page}`;
        const data = await fetchJson(url);

        if (!data.verses || data.verses.length === 0) break;

        for (const verse of data.verses) {
            for (const word of verse.words || []) {
                const frText = word.translation?.text;
                if (word.id && frText) {
                    map.set(word.id, frText);
                }
            }
        }

        if (page >= (data.pagination?.total_pages ?? 1)) break;
        page++;
        await sleep(100);
    }

    return map;
}

async function processSurah(surah: number): Promise<void> {
    const filePath = path.join(WBW_DIR, `${surah}.json`);
    if (!fs.existsSync(filePath)) {
        console.warn(`  [SKIP] ${filePath} introuvable`);
        return;
    }

    const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    let frMap: Map<number, string>;
    try {
        frMap = await fetchFrenchWordTranslations(surah);
    } catch (err) {
        console.error(`  [ERROR] Sourate ${surah} :`, err);
        return;
    }

    if (frMap.size === 0) {
        console.warn(`  [WARN] Aucune traduction FR reçue pour la sourate ${surah}`);
        return;
    }

    let updatedCount = 0;
    const updated = existing.map((verse: any) => ({
        ...verse,
        words: verse.words.map((word: any) => {
            const fr = frMap.get(word.id);
            if (fr) {
                updatedCount++;
                return { ...word, translation: fr };
            }
            return word;
        }),
    }));

    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf-8');
    console.log(`  [OK] Sourate ${surah} : ${updatedCount} mots mis à jour`);
}

async function main() {
    console.log('=== Mise à jour des traductions WBW vers le français ===\n');

    const files = fs.readdirSync(WBW_DIR)
        .filter(f => f.endsWith('.json'))
        .map(f => parseInt(f.replace('.json', '')))
        .filter(n => !isNaN(n))
        .sort((a, b) => a - b);

    console.log(`${files.length} fichiers détectés.\n`);

    for (const surah of files) {
        process.stdout.write(`Sourate ${surah}/${files[files.length - 1]}... `);
        await processSurah(surah);
        await sleep(DELAY_MS);
    }

    console.log('\n=== Terminé ! ===');
    console.log('Commitez les changements dans data/quran/word_by_word/ quand vous avez vérifié.');
}

main().catch(err => {
    console.error('Erreur fatale :', err);
    process.exit(1);
});
