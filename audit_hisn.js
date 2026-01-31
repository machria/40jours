const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data/hisn/fra-hisn.json', 'utf8'));
let report = '# Audit des Sources Hisn (Texte Français)\n\nVoici les entrées où le champ `source` semble contenir du texte français :\n\n| ID | Titre | Hadith ID | Source Actuelle |\n|---|---|---|---|\n';

let foundCount = 0;

// Regex for common French words and chars
// Avoiding overlaps with transliteration (which uses a lot of 'a', 'i', 'u')
// Transliteration usually looks like: "Alhamdu lillah..."
// French text looks like: "Des versets...", "Il est recommandé...", "Sourate..."
const frenchRegex = /[éèàçùîïôûë]|\b(le|la|les|un|une|des|et|est|pour|dans|sur|par|avec|ce|ces|cette|qui|que|quoi|dont|ou|où|c'est|d'|l'|qu')\b/i;

data.forEach(chapter => {
    chapter.hadiths.forEach(hadith => {
        if (hadith.source && frenchRegex.test(hadith.source)) {
            // Escape pipe characters for markdown table
            const safeSource = hadith.source.replace(/\|/g, '\\|').replace(/\n/g, ' ');
            report += `| ${chapter.id} | ${chapter.title} | ${hadith.id} | ${safeSource} |\n`;
            foundCount++;
        }
    });
});

console.log(`Found ${foundCount} potential French matches.`);
fs.writeFileSync('hisn_sources_audit.md', report);
