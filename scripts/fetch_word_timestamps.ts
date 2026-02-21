import fs from 'fs';
import path from 'path';
import https from 'https';

const RECITER_ID = 7; // Mishary Al-Afasy

interface Word {
    id: number;
    position: number;
    audio_url: string;
    char_type_name: string;
    text_uthmani: string;
    text_indopak?: string;
    translation: {
        text: string;
        language_name: string;
    };
    transliteration: {
        text: string;
        language_name: string;
    };
}

interface VerseInfo {
    id: number;
    verse_key: string;
    text_uthmani: string;
    words: Word[];
}

function fetchJson(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Node.js' } }, (res) => {
            const chunks: Buffer[] = [];
            res.on('data', (chunk) => {
                chunks.push(chunk);
            });
            res.on('end', () => {
                // Return null on 404 to avoid parsing HTML as JSON
                if (res.statusCode === 404) {
                    return resolve(null);
                }
                try {
                    const data = Buffer.concat(chunks).toString('utf8');
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function fetchAudioSegments(surah: number): Promise<Map<string, any>> {
    console.log(`[Surah ${surah}] Fetching audio segments...`);
    const url = `https://api.quran.com/api/qdc/audio/reciters/${RECITER_ID}/audio_files?chapter=${surah}&segments=true`;
    const data = await fetchJson(url);
    const audioMap = new Map<string, any>();

    if (data && data.audio_files) {
        for (const file of data.audio_files) {
            if (file.verse_timings) {
                for (const timing of file.verse_timings) {
                    audioMap.set(timing.verse_key, timing);
                }
            } else if (file.verse_key && file.segments) {
                audioMap.set(file.verse_key, file);
            }
        }
    }
    return audioMap;
}

async function fetchVersesWords(surah: number): Promise<VerseInfo[]> {
    console.log(`[Surah ${surah}] Fetching verses with words...`);
    const perPage = 50;
    let page = 1;
    let allVerses: VerseInfo[] = [];

    while (true) {
        const url = `https://api.quran.com/api/v4/verses/by_chapter/${surah}?words=true&word_fields=text_uthmani,text_indopak,location&page=${page}&per_page=${perPage}`;
        const data = await fetchJson(url);

        if (data && data.verses && data.verses.length > 0) {
            allVerses = allVerses.concat(data.verses);

            if (page >= data.pagination.total_pages) {
                break;
            }
            page++;
        } else {
            break;
        }
    }
    return allVerses;
}

async function processSurah(surah: number) {
    const audioMap = await fetchAudioSegments(surah);
    const verses = await fetchVersesWords(surah);

    if (verses.length === 0) {
        console.warn(`[Surah ${surah}] No verses found. Skipping.`);
        return;
    }

    const finalData = verses.map(verse => {
        const timingInfo = audioMap.get(verse.verse_key);

        const segmentsMap = new Map<number, [number, number, number]>();
        if (timingInfo && timingInfo.segments) {
            const verseStart = timingInfo.timestamp_from || 0;
            timingInfo.segments.forEach((seg: any, idx: number) => {
                const wordPos = seg.length === 3 ? seg[0] : idx + 1; // Sometimes seg[0] is word_index
                if (seg.length === 3) {
                    const relativeFrom = Math.max(0, seg[1] - verseStart);
                    const relativeTo = Math.max(0, seg[2] - verseStart);
                    segmentsMap.set(wordPos, [wordPos, relativeFrom, relativeTo]);
                } else if (seg.length === 1) {
                    const parentPos = seg[0];
                    const parent = segmentsMap.get(parentPos);
                    if (parent) {
                        segmentsMap.set(wordPos, parent);
                    }
                }
            });
        }

        return {
            id: verse.id,
            verse_key: verse.verse_key,
            text_uthmani: verse.text_uthmani,
            words: verse.words.map((w: Word) => {
                const seg = segmentsMap.get(w.position);
                return {
                    id: w.id,
                    position: w.position,
                    char_type: w.char_type_name,
                    text: w.text_uthmani,
                    text_indopak: w.text_indopak,
                    translation: w.translation?.text,
                    transliteration: w.transliteration?.text,
                    timestamp: seg ? {
                        from: seg[1],
                        to: seg[2]
                    } : null
                };
            })
        };
    });

    const outDir = path.join(__dirname, '../data/quran/word_by_word');
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    const outFile = path.join(outDir, `${surah}.json`);
    fs.writeFileSync(outFile, JSON.stringify(finalData, null, 2), 'utf-8');
    console.log(`[Surah ${surah}] Saved ${finalData.length} verses to ${outFile}`);
}

async function main() {
    console.log("Starting Word-by-Word data download for all 114 Surahs...");
    for (let surah = 1; surah <= 114; surah++) {
        try {
            // Check if file already exists to resume
            const outFile = path.join(__dirname, '../data/quran/word_by_word', `${surah}.json`);
            if (fs.existsSync(outFile)) {
                console.log(`[Surah ${surah}] JSON already exists. Skipping.`);
                continue;
            }

            await processSurah(surah);
            // Wait 200ms to avoid rate limiting
            await new Promise(r => setTimeout(r, 200));
        } catch (err) {
            console.error(`[Surah ${surah}] Error:`, err);
        }
    }
    console.log("Download complete!");
}

main();
