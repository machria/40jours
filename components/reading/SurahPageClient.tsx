'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, BrainCircuit, Info, EyeOff } from 'lucide-react';
import SurahViewer from '@/components/reading/SurahViewer';
import MemorizationQuiz from '@/components/surah/MemorizationQuiz';
import SurahInfoModal from '@/components/reading/SurahInfoModal';

interface SurahPageClientProps {
    ayahs: any[];
    meta: any;
    surahId: number;
}

export default function SurahPageClient({ ayahs, meta, surahId }: SurahPageClientProps) {
    const [isQuizOpen, setIsQuizOpen] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [isWordByWordMode, setIsWordByWordMode] = useState(false);
    const [isMaskMode, setIsMaskMode] = useState(false);
    const [wbwData, setWbwData] = useState<any[] | null>(null);
    const wbwLoaded = useRef(false);

    useEffect(() => {
        if (!isWordByWordMode || wbwLoaded.current) return;
        wbwLoaded.current = true;
        fetch(`/quran/word_by_word/${surahId}.json`)
            .then(res => res.json())
            .then(data => setWbwData(Array.isArray(data) ? data : null))
            .catch(() => setWbwData(null));
    }, [isWordByWordMode, surahId]);

    return (
        <div className="min-h-screen bg-background">
            {isQuizOpen && (
                <MemorizationQuiz
                    ayahs={ayahs}
                    surahName={meta?.name || ''}
                    onClose={() => setIsQuizOpen(false)}
                />
            )}

            <SurahInfoModal
                isOpen={isInfoOpen}
                onClose={() => setIsInfoOpen(false)}
                surahId={surahId}
                surahName={`Sourate ${meta?.englishName} (${meta?.name})`}
            />

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

                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            onClick={() => setIsInfoOpen(true)}
                            className="bg-accent/10 hover:bg-accent/20 text-accent p-2 md:px-3 md:py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors"
                            title="Contexte et Explication"
                        >
                            <Info className="w-4 h-4" />
                            <span className="hidden lg:inline">Contexte</span>
                        </button>

                        <button
                            onClick={() => setIsQuizOpen(true)}
                            className="bg-primary/10 hover:bg-primary/20 text-primary px-3 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors"
                        >
                            <BrainCircuit className="w-4 h-4" />
                            <span className="hidden lg:inline">Mémorisation</span>
                        </button>

                        <button
                            onClick={() => setIsMaskMode(!isMaskMode)}
                            className={`px-3 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors border ${isMaskMode ? 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500' : 'bg-transparent text-orange-500 border-orange-500/20 hover:bg-orange-500/5'}`}
                            title={isMaskMode ? "Désactiver le mode masquage" : "Activer le mode masquage"}
                        >
                            <EyeOff className="w-4 h-4" />
                            <span className="hidden lg:inline">{isMaskMode ? "Lecture" : "Masquage"}</span>
                            {!isMaskMode && <span className="lg:hidden">Masquage</span>}
                        </button>

                        <button
                            onClick={() => setIsWordByWordMode(!isWordByWordMode)}
                            className={`px-3 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors border ${isWordByWordMode ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent text-primary border-primary/20 hover:bg-primary/5'}`}
                            title={isWordByWordMode ? "Désactiver le mode mot par mot" : "Activer le mode mot par mot"}
                        >
                            <span className="hidden lg:inline">{isWordByWordMode ? "Vue Normale" : "Mot par Mot"}</span>
                            {!isWordByWordMode && <span className="lg:hidden">Mots</span>}
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
                        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                    </div>
                )}

                <SurahViewer 
                    ayahs={ayahs} 
                    surahId={surahId} 
                    wbwData={wbwData ?? undefined} 
                    isWordByWordMode={isWordByWordMode} 
                    isMaskMode={isMaskMode} 
                />
            </main>
        </div>
    );
}
