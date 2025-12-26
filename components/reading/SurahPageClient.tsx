'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, BrainCircuit } from 'lucide-react';
import SurahViewer from '@/components/reading/SurahViewer';
import MemorizationQuiz from '@/components/surah/MemorizationQuiz';

interface SurahPageClientProps {
    ayahs: any[];
    meta: any;
    surahId: number;
}

export default function SurahPageClient({ ayahs, meta, surahId }: SurahPageClientProps) {
    const [isQuizOpen, setIsQuizOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            {isQuizOpen && (
                <MemorizationQuiz
                    ayahs={ayahs}
                    surahName={meta?.name || ''}
                    onClose={() => setIsQuizOpen(false)}
                />
            )}

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

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsQuizOpen(true)}
                            className="bg-primary/10 hover:bg-primary/20 text-primary px-3 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors"
                        >
                            <BrainCircuit className="w-4 h-4" />
                            <span className="hidden sm:inline">Mémorisation</span>
                        </button>
                        <div className="font-kufi text-xl font-bold text-primary hidden sm:block">
                            {meta?.name}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
                {/* Bismillah (skip for Surah 1 and 9 usually) */}
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
