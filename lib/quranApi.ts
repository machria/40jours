// lib/quranApi.ts

export interface Ayah {
    number: number;
    text: string;
    numberInSurah: number;
    juz: number;
    manzil: number;
    page: number;
    ruku: number;
    hizbQuarter: number;
    sajda: boolean;
    surahNumber: number;
    translation?: string; // French translation
    surah: {
        number: number;
        name: string;
        englishName: string;
        englishNameTranslation: string;
        revelationType: string;
    };
    surahName?: string; // Flattened for convenience
    surahNameAr?: string;
}

export interface QuranPageData {
    pageNumber: number;
    ayahs: Ayah[];
    surahs: string[]; // List of surah names on this page
}

// Cache to avoid refetching
const quranCache: { [key: number]: QuranPageData } = {};
// Using unknown for safe casting
const tafsirCache: { [key: string]: unknown } = {};

const API_BASE_URL = '/api/quran';

export async function getQuranPage(pageNumber: number): Promise<QuranPageData> {
    if (quranCache[pageNumber]) {
        return quranCache[pageNumber];
    }

    try {
        let json;
        if (typeof window === 'undefined') {
            // Server-side: Read directly from filesystem to avoid HTTP loopback issues on Vercel
            const path = (await import('path')).default;
            const fs = (await import('fs')).default;

            const filePath = path.join(process.cwd(), 'data', 'quran-data.json');

            // Allow this to throw if file missing, caught by catch block
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const allPagesData = JSON.parse(fileContent);
            const rawPageData = allPagesData[pageNumber];

            if (!rawPageData) {
                throw new Error(`Page ${pageNumber} not found in local data`);
            }

            // Construct JSON to match API response structure expected by processing logic
            json = {
                data: {
                    ayahs: rawPageData,
                    number: pageNumber
                }
            };
        } else {
            // Client-side: Fetch via API
            let url = `${API_BASE_URL}/page/${pageNumber}`;
            const response = await fetch(url, {
                cache: 'no-store'
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch Quran page from local API: ${response.status} ${errorText}`);
            }

            json = await response.json();
        }

        // Process JSON (Common Logic)
        const ayahs: Ayah[] = json.data.ayahs.map((raw: any) => {
            const isBismillah = (text: string) => text.startsWith("بِسْمِ ٱللَّهِ");

            // Clean text (remove Bismillah from start of verse 1, except Surah 1)
            let cleanText = raw.text;
            if (raw.surah !== 1 && raw.ayah === 1 && isBismillah(cleanText)) {
                const bismillah = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";
                cleanText = cleanText.replace(bismillah, "").trim();
            }

            return {
                number: raw.id,
                text: cleanText, // Arabic
                translation: raw.translation, // French
                surahNumber: raw.surah, // The downloaded file has 'surah' as number
                numberInSurah: raw.ayah,
                juz: raw.juz,
                manzil: raw.manzil || 0,
                page: raw.page,
                ruku: raw.ruku || 0,
                hizbQuarter: raw.hizbQuarter || 0,
                sajda: raw.sajda || false,
                // Reconstruct the nested surah object used by some components
                surah: {
                    number: raw.surah,
                    name: raw.surahNameAr || "",
                    englishName: raw.surahName || "",
                    englishNameTranslation: "",
                    revelationType: "Meccan" // Placeholder or add to download script if needed
                }
            };
        });

        const pageData: QuranPageData = {
            pageNumber,
            ayahs: ayahs,
            surahs: Array.from(new Set(ayahs.map(a => a.surah.englishName)))
        };

        quranCache[pageNumber] = pageData;
        return pageData;

    } catch (error) {
        console.error("Error fetching Quran page:", error);
        throw error;
    }
}

export async function getTafsir(surah: number, ayah: number): Promise<string | null> {
    const key = `${surah}:${ayah}`;
    if (tafsirCache[key]) return tafsirCache[key] as string;

    try {
        // 1. Fetch exhaustif English Tafsir
        const res = await fetch(`https://quranapi.pages.dev/api/tafsir/${surah}_${ayah}.json`);

        if (!res.ok) return null;

        const json = await res.json();
        const englishContent = json.tafsirs?.[0]?.content;

        if (!englishContent) return "Tafsir non disponible en anglais.";

        // 2. Preserve Arabic Text (Regex for Arabic range)
        // We replace Arabic segments with a placeholder pattern.
        // CRITICAL: We use a nonsense code 'PH' instead of 'ARABIC' because Google Translate 
        // tends to translate '__ARABIC_0__' to '__ARABE_0__', breaking valid restoration.
        const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+/g;
        const placeholders: string[] = [];
        const textToTranslate = englishContent.replace(arabicRegex, (match: string) => {
            placeholders.push(match);
            // using __PH_index__
            return `__PH_${placeholders.length - 1}__`;
        });

        // 3. Translate to French
        let frenchContent = "";

        if (typeof window === 'undefined') {
            // Server-side: Direct Call
            const { translateText } = await import('./translator');
            frenchContent = await translateText(textToTranslate, 'en', 'fr');
        } else {
            // Client-side: API Call
            const translationRes = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: textToTranslate,
                    sourceLang: 'en',
                    targetLang: 'fr'
                })
            });

            if (!translationRes.ok) {
                console.error("Translation proxy failed");
                return `(Traduction indisponible) ${englishContent}`;
            }

            const translationData = await translationRes.json();
            frenchContent = translationData.translation;
        }

        // 4. Restore Arabic Text
        placeholders.forEach((arabic, index) => {
            // Restore __PH_index__ (and robustly handle spaces GT might add: __ PH _ 0 __)
            // Also optionally catch __ARABE_ if it somehow persists or matches old cache
            const pattern = new RegExp(`__\\s*(?:PH|ARABE|ARABIC)\\s*_\\s*${index}\\s*__`, 'gi');
            frenchContent = frenchContent.replace(pattern, arabic);
        });

        tafsirCache[key] = frenchContent;
        return frenchContent;

    } catch (e) {
        console.error("Error fetching tafsir:", e);
        return null;
    }
}
