
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

    // Sort just in case, though pages should be ordered
    // allAyahs.sort((a, b) => (a.surahNumber - b.surahNumber) || (a.numberInSurah - b.numberInSurah));

    return (
        <main className="container mx-auto px-4 py-8">
            <JuzViewer
                ayahs={allAyahs}
                juzId={id}
                theme={juz.theme}
                description={juz.description}
            />
        </main>
    );
}
