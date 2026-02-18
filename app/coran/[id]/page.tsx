
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Play, Info } from 'lucide-react';
import { getQuranPage } from '@/lib/quranApi';
import { TajwidText } from '@/components/TajwidText';
import SurahViewer from '@/components/reading/SurahViewer';
import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';

// Generate Metadata
// Generate Static Params for all 114 Surahs
export async function generateStaticParams() {
    return Array.from({ length: 114 }, (_, i) => ({
        id: (i + 1).toString(),
    }));
}

// Generate Metadata
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const surahId = parseInt(id);
    const meta = getSurahMeta(surahId);

    if (!meta) {
        return {
            title: `Sourate ${id} - Coran 40 Jours`,
        };
    }

    return {
        title: `Sourate ${meta.englishName} (${meta.name}) - Lire et Écouter`,
        description: `Lire la Sourate ${meta.englishName} (${meta.englishNameTranslation}) en ligne avec traduction française, phonétique et récitation audio. Chapitre ${surahId} du Saint Coran.`,
        openGraph: {
            title: `Sourate ${meta.englishName} - Coran 40 Jours`,
            description: `Lire la Sourate ${meta.englishName} en arabe et français.`,
            type: 'article',
        }
    };
}

// Optimization: We could pre-generate paths, but for 114 surahs dynamic is fine.
// The data is in `quran-data.json`.
// IMPORTANT: `quran-data.json` is organized by PAGE, not Surah.
// This makes fetching a whole Surah tricky without iterating EVERYTHING or having a Surah Index.
// However, `data/surahs.json` tells us which page a Surah starts/ends? No, we didn't save that.
// BUT `getQuranPage` returns Ayahs which have `surahNumber`.
// We can fetch all pages? No, that's heavy.
// WORKAROUND: For the MVP, we iterate specific pages if we knew them.
// OR we load the whole `quran-data.json` in memory (only ~5MB) and filter.
// Server Components can handle 5MB comfortably.



function getSurahData(surahId: number) {
    try {
        // 1. Load Index (ayah-location)
        const indexPath = path.join(process.cwd(), 'public', 'ayah-location.json');

        let indexData;
        try {
            indexData = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
        } catch (e) {
            console.error("Index not found or invalid", indexPath);
            return [];
        }

        // 2. Identify relevant pages
        const pagesToLoad = new Set<number>();
        // Iterate all keys "surah:ayah"
        for (const key in indexData) {
            if (key.startsWith(`${surahId}:`)) {
                pagesToLoad.add(indexData[key]);
            }
        }

        const sortedPages = Array.from(pagesToLoad).sort((a, b) => a - b);
        let ayahs: any[] = [];

        // 3. Load Pages and Filter
        sortedPages.forEach(page => {
            try {
                const pagePath = path.join(process.cwd(), 'public', 'quran', 'pages', `${page}.json`);
                const pageContent = fs.readFileSync(pagePath, 'utf-8');
                const pageAyahs = JSON.parse(pageContent);

                // Filter for this surah only (pages may contain multiple surahs)
                const matches = pageAyahs.filter((a: any) => a.surah === surahId);
                ayahs.push(...matches);
            } catch (pageError) {
                console.error(`Error loading page ${page}:`, pageError);
            }
        });

        // Deduplicate based on ayah number (handle verses spanning pages)
        const uniqueAyahsMap = new Map();
        ayahs.forEach((a) => {
            if (!uniqueAyahsMap.has(a.ayah)) {
                // Ensure numberInSurah exists for components that need it
                if (!a.numberInSurah) a.numberInSurah = a.ayah;
                uniqueAyahsMap.set(a.ayah, a);
            }
        });

        const uniqueAyahs = Array.from(uniqueAyahsMap.values());

        // Sort by ayah number
        uniqueAyahs.sort((a, b) => a.ayah - b.ayah);

        return uniqueAyahs;
    } catch (e) {
        console.error("Error in getSurahData:", e);
        return [];
    }
}

function getPhoneticData(surahId: number) {
    try {
        const p = path.join(process.cwd(), 'public', 'quran-transliteration.json');
        if (!fs.existsSync(p)) return [];
        const file = fs.readFileSync(p, 'utf-8');
        const data = JSON.parse(file);
        // data.quran is the array
        return data.quran.filter((a: any) => a.chapter === surahId);
    } catch (e) {
        console.error(e);
        return [];
    }
}

function getSurahMeta(surahId: number) {
    try {
        const p = path.join(process.cwd(), 'public', 'surahs.json');
        const file = fs.readFileSync(p, 'utf-8');
        const surahs = JSON.parse(file);
        return surahs.find((s: any) => s.number === surahId);
    } catch (e) {
        return null;
    }
}



// ... (keep getSurahData etc)

// We need to make this a Client Component to manage state (Quiz Open/Close)
// But currently it's a Server Component (`export default async function`).
// To use state, we normally need "use client".
// OPTION: Keep the page Server, and make a wrapper "SurahClientPage" that has the state.
// OR: Just make the whole page "use client" and fetch data via useEffect or passed Props?
// Valid pattern: Server Page passes data to Client Component.
// Let's refactor: Move the main UI to a `SurahPageClient.tsx` and call it from here.

// Wait, re-reading the file... it is `export default async function`.
// I will create a Client Wrapper component that takes `ayahs` and `meta` as props.
// That wrapper will handle the Quiz toggle.

import SurahPageClient from '../../../components/reading/SurahPageClient';

export default async function SurahPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const surahId = parseInt(id);

    if (isNaN(surahId) || surahId < 1 || surahId > 114) {
        notFound();
    }

    const ayahs = getSurahData(surahId);
    const meta = getSurahMeta(surahId);
    const phonetics = getPhoneticData(surahId);

    // Merge phonetic data
    if (phonetics.length > 0) {
        ayahs.forEach(ayah => {
            // Find matching phonetic verse
            // Note: ayah.ayah is the verse number in surah
            const p = phonetics.find((ph: any) => ph.verse === ayah.ayah);
            if (p) {
                ayah.phonetic = p.text;
            }
        });
    }

    if (!ayahs.length) notFound();

    return (
        <SurahPageClient ayahs={ayahs} meta={meta} surahId={surahId} />
    );
}

