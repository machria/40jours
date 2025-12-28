
import { getCollection } from '../lib/hadith-api';

async function verifyTirmidhi() {
    console.log("Verifying Jami At Tirmidhi integration...");
    try {
        const collection = await getCollection('tirmidhi');
        console.log(`Collection Loaded: ${collection.metadata.name}`);

        const hadithCount = collection.hadiths.length;
        console.log(`Total Hadiths: ${hadithCount}`);

        if (hadithCount === 0) {
            console.error("Error: No hadiths found!");
            process.exit(1);
        }

        // Check sections
        const sections = collection.metadata.sections;
        console.log(`Total Sections: ${Object.keys(sections).length}`);
        console.log(`Sample Section (1): ${sections['1']}`);

        // Check sample hadith
        const sample = collection.hadiths[0];
        console.log(`Sample Hadith 1 Text: ${sample.text.substring(0, 100)}...`);

        // Basic language check (naive)
        if (sample.text.includes("the") && !sample.text.includes("le")) {
            console.warn("Warning: Text seems to be English. Translation might have failed or not happened.");
        } else {
            console.log("Text seems to be French (or at least not obviously English).");
        }

        console.log("Verification Successful.");
    } catch (error) {
        console.error("Verification Failed:", error);
        process.exit(1);
    }
}

verifyTirmidhi();
