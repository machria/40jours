
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- 1. Load Vocabulary ---
const VOCAB_FILE = path.join(__dirname, '../data/vocabulary.ts');
const vocabContent = fs.readFileSync(VOCAB_FILE, 'utf8');

// Regex to extract arabic: "..."
const vocabMatches = [...vocabContent.matchAll(/arabic:\s*"([^"]+)"/g)];
let vocabWords = vocabMatches.map(m => m[1]);

console.log(`Loaded ${vocabWords.length} vocabulary words.`);

// --- 2. Load Quran ---
const QURAN_FILE = path.join(__dirname, '../data/quran-data.json');
const quranData = JSON.parse(fs.readFileSync(QURAN_FILE, 'utf8'));

// Extract all text
let allText = "";
for (const page in quranData) {
    if (Array.isArray(quranData[page])) {
        quranData[page].forEach(ayah => {
            allText += ayah.text + " ";
        });
    }
}

// --- 3. Normalization Helper ---
function removeTashkeel(text) {
    return text
        .replace(/[\u0617-\u061A\u064B-\u0652]/g, "") // Remove Tashkeel
        .replace(/[أإآٱ]/g, "ا"); // Normalize Alephs to simple Alif
}

// Pre-process vocabulary
// We might have duplicates if we just strip tashkeel, but for coverage checking "is this root in list", Set is good.
const vocabSet = new Set(vocabWords.map(w => removeTashkeel(w)));

// Add some known variations if needed, but for now stick to the list.
// The list has "Wa" (And) as "وَ". Stripped: "و".
console.log("Vocabulary examples (stripped):", [...vocabSet].slice(0, 10));

// --- 4. Count Coverage ---
const quranTokens = allText.split(/\s+/).filter(t => t.trim().length > 0);
let totalCoveredCount = 0;
let totalTokens = quranTokens.length;

console.log(`Total Quran Tokens (approx): ${totalTokens}`);

// Prefixes to strip if direct match fails
// Common particles that attach: Wa, Fa, Bi, Li, Ka, Sa (future), La (emphasis)
// Al (The) is usually attached but often considered part of the word in simple tokenization unless split.
// Note: "Al" (The) is NOT in the vocab list explicitly as a particle usually, but nouns might have it.
// Actually, check vocab list for "Al".
// "Al-Kitab"? List has "Kitab".
// So we must strip "Al-" (Alif Lam) too.

const PREFIXES = [
    'و', // Wa
    'ف', // Fa
    'ب', // Bi
    'ل', // Li / La
    'ك', // Ka
    'س', // Sa (future)
    'ال', // Al
    'وال', // Wa-Al
    'فال', // Fa-Al
    'بال', // Bi-Al
    'كال', // Ka-Al
    'لِل', // Lil (Li+Al)
];

const SUFFIXES = [
    'هم', 'kum', 'na', 'hu', 'ha', // Pronouns attached.
    // Simplifying: just check "Starts with" for now or strict set membership?
    // If I see "Wakitabun":
    // 1. Strip tashkeel -> "wktab" (incorrect, kitAb has Alif). "wktAb".
    // 2. Check "wktAb" in dict using prefixes.
    //    - Try removing "w" -> "ktAb". Is "ktAb" in dict? Yes. -> Count 2 (Wa + Kitab).
    // This looks like the best approach.
];

// Let's refine the counting logic.
// We want "Total hits of vocabulary items".
// If a token matches a vocab word, count +1.
// If a token is composed of VocabPrefix + VocabWord, count +2 ?
// THE USER asks: "Nombre de mot exact couvert".
// This phrasing usually refers to "How many words in the Quran correspond to this list".
// i.e. The SUM of frequencies of these words.
// If "Wa" appears 9000 times, and "Allah" 2000 times.
// "Wallahu" is 1 token. But typically counts as 2 words in frequency lists.
// I will try to count "Identified Vocabulary Instances".

let recognizedInstances = 0;

for (const rawToken of quranTokens) {
    const token = removeTashkeel(rawToken);

    if (vocabSet.has(token)) {
        recognizedInstances++;
        continue;
    }

    // 2. Try stripping prefixes and suffixes
    // We try all combinations of Prefix + Stem + Suffix
    // Or just Prefix + Stem
    // Or Stem + Suffix

    // We already have PREFIXES. Let's define SUFFIXES.
    const SUFFIXES = [
        'هم', 'كم', 'نا', 'ه', 'ها', 'ك', 'كم', 'ي', 'ني', // Pronouns
        'ون', 'ين', 'ان', // Plurals / Duals
        'ت', 'ة' // Feminine / Ta marbuta (often changes to T)
    ];

    let bestMatchPoints = 0;

    // Helper to check if a string is a vocab word (or prefix/suffix in vocab)
    const checkWord = (w) => vocabSet.has(w);

    // Try purely exact first
    if (checkWord(token)) {
        recognizedInstances++;
        continue;
    }

    // Try finding a valid Stem in the token
    // We can iterate through all valid words and check if token contains them? 
    // No, too slow (250 * 80000).
    // Better: strip prefixes/suffixes and check remainder.

    // Possible structures: [Prefix] + Stem + [Suffix]
    // We iterate prefixes (including empty) and suffixes (including empty).

    const possiblePrefixes = ['', ...PREFIXES];
    const possibleSuffixes = ['', ...SUFFIXES];

    let foundMatch = false;

    // Optimization: Don't nest too deep if not needed.
    // Try Prefix stripping first (common)
    for (const p of possiblePrefixes) {
        if (p && !token.startsWith(p)) continue;

        const afterPrefix = p ? token.slice(p.length) : token;

        // Try direct stem match
        if (checkWord(afterPrefix)) {
            let points = 1; // Stem
            if (p && checkWord(p)) points++;
            recognizedInstances += points;
            foundMatch = true;
            break;
        }

        // Try Suffix stripping
        for (const s of possibleSuffixes) {
            if (s && !afterPrefix.endsWith(s)) continue;
            // distinct from p
            if (!s && !p) continue; // Already checked exact

            const stem = s ? afterPrefix.slice(0, -s.length) : afterPrefix;

            if (stem.length < 2) continue; // Avoid single letter false positives

            if (checkWord(stem)) {
                let points = 1; // Stem
                if (p && checkWord(p)) points++;
                // Suffixes usually aren't in the list as full words (except maybe Hum/Hiya but attached forms differ)
                // If the user lists "Hum" (They), and we find "Rabbuhum", "hum" is the attached form of "Hum".
                // We'll count it as covered if the suffix essentially maps to a known pronoun.
                // For simplicity, just count the STEM and PREFIX. Suffix is "grammar".

                recognizedInstances += points;

                // Maybe add bonus for suffix if it maps to a known vocab word?
                // 'hum' -> 'hum' (They) - Yes.
                // 'ka' -> 'anta' (You) - No direct map in set, but conceptually covered.
                // 'i' -> 'ana' (Me) - No.

                foundMatch = true;
                break;
            }
        }
        if (foundMatch) break;
    }
}

console.log(`Recognized Instances (approx): ${recognizedInstances}`);
console.log(`Coverage % of tokens: ${(recognizedInstances / totalTokens * 100).toFixed(2)}%`);
