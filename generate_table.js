
const fs = require('fs');
const path = require('path');

// Read the file content
const namesContent = fs.readFileSync('data/names.ts', 'utf8');

// Extract the array using regex since it's a TS file
const match = namesContent.match(/export const namesOfAllah: AllahName\[\] = (\[[\s\S]*?\])\.map/);
if (!match) {
    console.error("Could not find names array");
    process.exit(1);
}

// Parse the array (it's essentially JSON frame)
// We need to be careful with the parsing as it is valid JS/TS but might not be strict JSON (keys might not be quoted)
// The file content in step 67 shows keys are not quoted (e.g. { Number: 1, ... })
// So we can eval it or use a safer regex approach. Given this is a local script controlled by me, eval is acceptable for this temporary task.
const names = eval(match[1]);

console.log("| N° | Arabe | Translittération | Français | Signification |");
console.log("|---:|:---:|---|---|---|");

names.forEach(n => {
    console.log(`| ${n.Number} | ${n.arabe} | **${n.transliteration}** | ${n.francais} | ${n.signification} |`);
});
