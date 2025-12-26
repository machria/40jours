
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Play, Info } from 'lucide-react';
import { getQuranPage } from '@/lib/quranApi';
import { TajwidText } from '@/components/TajwidText';
import SurahViewer from '@/components/reading/SurahViewer';
import { Metadata } from 'next';

// Generate Metadata
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    return {
        title: `Sourate ${id} - Coran 40 Jours`,
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

import fs from 'fs';
import path from 'path';

function getSurahData(surahId: number) {
    try {
        const p = path.join(process.cwd(), 'data', 'quran-data.json');
        const file = fs.readFileSync(p, 'utf-8');
        const allPages = JSON.parse(file);

        let ayahs: any[] = [];

        // Iterate all pages (Object.values)
        Object.values(allPages).forEach((pageAyahs: any) => {
            const matches = pageAyahs.filter((a: any) => a.surah === surahId);
            ayahs.push(...matches);
        });

        // Sort by ayah number just in case
        ayahs.sort((a, b) => a.ayah - b.ayah);

        return ayahs;
    } catch (e) {
        console.error(e);
        return [];
    }
}

function getSurahMeta(surahId: number) {
    try {
        const p = path.join(process.cwd(), 'data', 'surahs.json');
        const file = fs.readFileSync(p, 'utf-8');
        const surahs = JSON.parse(file);
        return surahs.find((s: any) => s.number === surahId);
    } catch (e) {
        return null;
    }
}

export default async function SurahPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const surahId = parseInt(id);

    if (isNaN(surahId) || surahId < 1 || surahId > 114) {
        notFound();
    }

    const ayahs = getSurahData(surahId);
    const meta = getSurahMeta(surahId);

    if (!ayahs.length) notFound();

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b p-4 shadow-sm">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/coran" className="p-2 hover:bg-muted rounded-full">
                            <ChevronLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-lg font-bold">Sourate {meta?.englishName}</h1>
                            <p className="text-xs text-muted-foreground">{meta?.englishNameTranslation} • {meta?.revelationType === 'Meccan' ? 'Mecquoise' : 'Médinoise'}</p>
                        </div>
                    </div>
                    <div className="font-kufi text-xl font-bold text-primary">
                        {meta?.name}
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
                {/* Bismillah (skip for Surah 1 and 9 usually, but checking text) */}
                {surahId !== 1 && surahId !== 9 && (
                    <div className="text-center py-8 font-kufi text-2xl text-primary/80">
                        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                    </div>
                )}

                <SurahViewer ayahs={ayahs} surahId={surahId} />
            </main>
        </div>
    );
}
