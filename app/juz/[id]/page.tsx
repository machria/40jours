
import { getJuz } from '@/lib/juzData';
import { getQuranPage } from '@/lib/quranApi';
import JuzViewer from '@/components/reading/JuzViewer';
import { notFound } from 'next/navigation';


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
