import fs from 'fs';
import path from 'path';
import https from 'https';

const SURAH = 1;
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

interface VerseAudio {
    verse_key: string;
    url: string;
    duration: number;
    // For QDC API it's verse_timings which has an array of objects or segments
    // actually let's type it loosely
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
    console.log(`Fetching audio segments for Surah ${surah}...`);
    const url = `https://api.quran.com/api/qdc/audio/reciters/${RECITER_ID}/audio_files?chapter=${surah}&segments=true`;
    const data = await fetchJson(url);
    const audioMap = new Map<string, any>();

    if (data.audio_files) {
        // Here audio_files is an array, but wait, usually QDC audio API returns one object per chapter.
        // Let's iterate if it's an array of chapters or just one chapter with verse_timings.
        // For QDC reciters audio_files endpoint, it often returns an array of chapter files or verse files.
        // Actually, let's just log and process it. The test showed:
        // audio_url: ..., verse_timings: [{ verse_key, segments: [[1, 0, 580], ...] }]
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
    console.log(`Fetching verses with words for Surah ${surah}...`);
    const perPage = 50;
    let page = 1;
    let allVerses: VerseInfo[] = [];

    while (true) {
        const url = `https://api.quran.com/api/v4/verses/by_chapter/${surah}?words=true&word_fields=text_uthmani,text_indopak,location&page=${page}&per_page=${perPage}`;
        const data = await fetchJson(url);

        if (data.verses && data.verses.length > 0) {
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

async function main() {
    try {
        const audioMap = await fetchAudioSegments(SURAH);
        const verses = await fetchVersesWords(SURAH);

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
                words: verse.words.map(w => {
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

        const outFile = path.join(outDir, `${SURAH}.json`);
        fs.writeFileSync(outFile, JSON.stringify(finalData, null, 2), 'utf-8');
        console.log(`Saved ${finalData.length} verses to ${outFile}`);

    } catch (err) {
        console.error("Error:", err);
    }
}

main();
