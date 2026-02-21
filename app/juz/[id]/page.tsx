
import { getJuz } from '@/lib/juzData';
import { getQuranPage } from '@/lib/quranApi';
import JuzViewer from '@/components/reading/JuzViewer';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';


interface PageProps {
    params: Promise<{
        id: string;
    }>
}

// Generate static params for all 30 Juz
export async function generateStaticParams() {
    return Array.from({ length: 30 }, (_, i) => ({
        id: (i + 1).toString(),
    }));
}

function getPhoneticData() {
    try {
        const p = path.join(process.cwd(), 'public', 'quran-transliteration.json');
        if (!fs.existsSync(p)) return [];
        const file = fs.readFileSync(p, 'utf-8');
        const data = JSON.parse(file);
        return data.quran;
    } catch (e) {
        console.error(e);
        return [];
    }
}



export default async function JuzPage({ params }: PageProps) {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    const juz = getJuz(id);

    if (!juz) {
        notFound();
    }

    if (!juz) {
        notFound();
    }

    // Auth check moved to client component to allow Static Generation (ISR)
    // The page skeleton and content is static, user state is fetched on client.

    // Fetch all verses for this Juz
    let allAyahs: any[] = [];
    const promises = [];

    for (let p = juz.startPage; p <= juz.endPage; p++) {
        promises.push(getQuranPage(p));
    }

    const pages = await Promise.all(promises);

    pages.forEach(page => {
        // Filter only ayahs belonging to this Juz
        // (Some pages might be split between two Juz)
        const juzAyahs = page.ayahs.filter(a => a.juz === id);
        allAyahs = [...allAyahs, ...juzAyahs];
    });

    // Merge phonetic data
    const phonetics = getPhoneticData();
    if (phonetics.length > 0) {
        allAyahs.forEach(ayah => {
            const p = phonetics.find((ph: any) => ph.chapter === ayah.surahNumber && ph.verse === ayah.numberInSurah);
            if (p) {
                ayah.phonetic = p.text;
            }
        });
    }

    // --- Load Word By Word Data for this Juz ---
    const wbwData: any[] = [];
    const uniqueSurahs = Array.from(new Set(allAyahs.map(a => a.surahNumber)));

    uniqueSurahs.forEach(surahNum => {
        try {
            const wbwPath = path.join(process.cwd(), 'data', 'quran', 'word_by_word', `${surahNum}.json`);
            if (fs.existsSync(wbwPath)) {
                const surahWbwData = JSON.parse(fs.readFileSync(wbwPath, 'utf-8'));
                // Filter only the ayahs that are in this juz
                const ayahsInJuzForThisSurah = allAyahs.filter(a => a.surahNumber === surahNum).map(a => a.numberInSurah);

                // Add surah and ayah numbers to wbw objects for easy matching in JuzViewer
                const relevantWbw = surahWbwData
                    .filter((w: any) => ayahsInJuzForThisSurah.includes(parseInt(w.verse_key.split(':')[1])))
                    .map((w: any) => ({
                        ...w,
                        surah: surahNum,
                        ayah: parseInt(w.verse_key.split(':')[1])
                    }));

                wbwData.push(...relevantWbw);
            }
        } catch (e) {
            console.error(`Failed to load wbw relative to surah ${surahNum}`, e);
        }
    });

    return (
        <main className="container mx-auto px-4 py-8">
            <JuzViewer
                ayahs={allAyahs}
                juzId={id}
                theme={juz.theme}
                description={juz.description}
                wbwData={wbwData.length > 0 ? wbwData : undefined}
            />
        </main>
    );
}
