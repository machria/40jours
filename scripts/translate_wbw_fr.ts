/**
 * Translate Quran Word-by-Word translations from English to French using DeepL.
 *
 * Usage:
 *   DEEPL_API_KEY=your_key npx ts-node scripts/translate_wbw_fr.ts
 *
 * Get a free API key (500K chars/month) at: https://www.deepl.com/pro#developer
 * Free keys end with ":fx"
 */

import fs from 'fs';
import path from 'path';
import https from 'https';

// Load .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx === -1) continue;
        const key = trimmed.slice(0, eqIdx).trim();
        const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) process.env[key] = value;
    }
}

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
if (!DEEPL_API_KEY) {
    console.error('❌ DEEPL_API_KEY manquant.');
    console.error('   → Obtenez une clé gratuite (500K chars/mois) sur https://www.deepl.com/pro#developer');
    console.error('   → Puis lancez : DEEPL_API_KEY=xxxxx:fx npx ts-node scripts/translate_wbw_fr.ts');
    process.exit(1);
}

const DATA_WBW_DIR = path.join(process.cwd(), 'data', 'quran', 'word_by_word');
const PUBLIC_WBW_DIR = path.join(process.cwd(), 'public', 'quran', 'word_by_word');
const MAPPING_FILE = path.join(process.cwd(), 'data', 'wbw-fr-mapping.json');

const BATCH_SIZE = 50; // DeepL max texts per request
const DELAY_MS = 300;  // Pause between batches (rate limiting)

// DeepL free tier uses api-free.deepl.com, paid uses api.deepl.com
const DEEPL_HOST = DEEPL_API_KEY.endsWith(':fx') ? 'api-free.deepl.com' : 'api.deepl.com';

function loadMapping(): Record<string, string> {
    if (fs.existsSync(MAPPING_FILE)) {
        return JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'));
    }
    return {};
}

function saveMapping(mapping: Record<string, string>) {
    fs.writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2), 'utf-8');
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function translateBatch(texts: string[]): Promise<string[]> {
    return new Promise((resolve, reject) => {
        const body = texts
            .map(t => `text=${encodeURIComponent(t)}`)
            .join('&') + '&source_lang=EN&target_lang=FR';

        const req = https.request({
            host: DEEPL_HOST,
            path: '/v2/translate',
            method: 'POST',
            headers: {
                'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(body),
            },
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.message) {
                        reject(new Error(`DeepL error: ${json.message}`));
                        return;
                    }
                    resolve(json.translations.map((t: any) => t.text));
                } catch (e) {
                    reject(new Error(`Failed to parse DeepL response: ${data}`));
                }
            });
        });

        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

async function main() {
    console.log('🔍 Lecture des fichiers WBW...');

    // 1. Collect all unique English translations
    const unique = new Set<string>();
    for (let i = 1; i <= 114; i++) {
        const filePath = path.join(DATA_WBW_DIR, `${i}.json`);
        if (!fs.existsSync(filePath)) continue;
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        data.forEach((v: any) =>
            v.words?.forEach((w: any) => {
                if (w.char_type === 'word' && w.translation) unique.add(w.translation);
            })
        );
    }
    console.log(`📊 ${unique.size} traductions uniques trouvées (${[...unique].join('').length} chars)`);

    // 2. Load existing mapping (for resumability)
    const mapping = loadMapping();
    const toTranslate = [...unique].filter(t => !mapping[t]);
    const cached = unique.size - toTranslate.length;
    if (cached > 0) console.log(`⚡ ${cached} déjà en cache, ${toTranslate.length} à traduire`);

    // 3. Translate in batches
    if (toTranslate.length > 0) {
        const totalBatches = Math.ceil(toTranslate.length / BATCH_SIZE);
        const totalChars = toTranslate.join('').length;
        console.log(`🌐 Traduction via DeepL (${totalBatches} batches, ~${totalChars} chars)...`);

        for (let i = 0; i < toTranslate.length; i += BATCH_SIZE) {
            const batch = toTranslate.slice(i, i + BATCH_SIZE);
            const batchNum = Math.floor(i / BATCH_SIZE) + 1;
            process.stdout.write(`  Batch ${batchNum}/${totalBatches}...`);

            try {
                const translations = await translateBatch(batch);
                batch.forEach((original, idx) => {
                    mapping[original] = translations[idx];
                });
                saveMapping(mapping); // Save after each batch (resumable if interrupted)
                console.log(` ✓ (ex: "${batch[0]}" → "${mapping[batch[0]]}")`);
            } catch (err) {
                console.error(`\n❌ Erreur batch ${batchNum}:`, err);
                console.log('   → Mapping sauvegardé jusqu\'ici. Relancez le script pour reprendre.');
                process.exit(1);
            }

            if (i + BATCH_SIZE < toTranslate.length) await sleep(DELAY_MS);
        }

        console.log(`✅ Traduction terminée. Mapping sauvegardé: ${MAPPING_FILE}`);
    } else {
        console.log('✅ Tout est déjà traduit (cache complet).');
    }

    // 4. Apply translations to data/ files
    console.log('📝 Application des traductions sur data/quran/word_by_word/...');
    for (let i = 1; i <= 114; i++) {
        const filePath = path.join(DATA_WBW_DIR, `${i}.json`);
        if (!fs.existsSync(filePath)) continue;

        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        data.forEach((v: any) =>
            v.words?.forEach((w: any) => {
                if (w.char_type === 'word' && w.translation && mapping[w.translation]) {
                    w.translation = mapping[w.translation];
                }
            })
        );
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    }

    // 5. Apply translations to public/ files (direct update, no need to run copy_to_public)
    if (fs.existsSync(PUBLIC_WBW_DIR)) {
        console.log('📝 Application des traductions sur public/quran/word_by_word/...');
        for (let i = 1; i <= 114; i++) {
            const filePath = path.join(PUBLIC_WBW_DIR, `${i}.json`);
            if (!fs.existsSync(filePath)) continue;

            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            data.forEach((v: any) =>
                v.words?.forEach((w: any) => {
                    if (w.char_type === 'word' && w.translation && mapping[w.translation]) {
                        w.translation = mapping[w.translation];
                    }
                })
            );
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        }
    }

    console.log('\n🎉 Terminé ! 114 fichiers WBW mis à jour en français.');
    console.log('   → Déployez pour que les changements soient en production.');
}

main().catch(err => {
    console.error('❌ Erreur fatale:', err);
    process.exit(1);
});
