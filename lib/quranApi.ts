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

// Cache to avoid refetching (Touched to force refresh)
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

            const filePath = path.join(process.cwd(), 'data', 'quran', 'pages', `${pageNumber}.json`);

            // Allow this to throw if file missing, caught by catch block
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const pageAyahs = JSON.parse(fileContent);

            // Construct JSON to match API response structure expected by processing logic
            json = {
                data: {
                    ayahs: pageAyahs,
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
        let tafsirContent = "";

        if (typeof window === 'undefined') {
            // Server-side: Read directly from filesystem
            const path = (await import('path')).default;
            const fs = (await import('fs')).default;

            const filePath = path.join(process.cwd(), 'data', 'tafsir', `${surah}_${ayah}.json`);

            if (fs.existsSync(filePath)) {
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                const json = JSON.parse(fileContent);
                tafsirContent = json.tafsir;
            } else {
                return "Tafsir non disponible.";
            }
        } else {
            // Client-side: Fetch from static files in public/tafsir
            const res = await fetch(`/tafsir/${surah}_${ayah}.json`);
            if (!res.ok) {
                return "Tafsir non disponible.";
            }
            const json = await res.json();
            tafsirContent = json.tafsir;
        }

        tafsirCache[key] = tafsirContent;
        return tafsirContent;

    } catch (e) {
        console.error("Error fetching tafsir:", e);
        return null;
    }
}
