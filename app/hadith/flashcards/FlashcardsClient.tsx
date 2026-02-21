'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { TajwidText } from '@/components/TajwidText';
import { Hadith } from '@/types/hadith';

type FlashcardHadith = Hadith & {
    book: string;
    bookName: string;
    chapterTitle?: string;
};

interface FlashcardsClientProps {
    initialPlaylist: FlashcardHadith[];
}

export default function FlashcardsClient({ initialPlaylist }: FlashcardsClientProps) {
    const [playlist, setPlaylist] = useState<FlashcardHadith[]>(initialPlaylist);
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextCard = () => {
        if (currentIndex < playlist.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prevCard = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const currentItem = playlist[currentIndex];

    if (!currentItem) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <p className="text-muted-foreground animate-pulse">Aucun hadith disponible...</p>
            </div>
        );
    }

    return (
        <div className="container max-w-3xl mx-auto py-6 px-4 flex flex-col min-h-[calc(100vh-4rem)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Link href="/hadith" className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Retour aux Hadiths</span>
                </Link>

                <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                    Aléatoire
                </span>
            </div>

            {/* Main Card */}
            <div className="flex-1 flex flex-col relative">
                <div className="flex-1 bg-card border rounded-3xl shadow-sm flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 key-[currentindex]">
                    {/* Card Header */}
                    <div className="bg-muted/30 px-6 py-4 border-b">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <span className="font-bold text-primary flex items-center gap-2">
                                <span className="text-lg">📚</span>
                                {currentItem.bookName}
                            </span>
                            <span className="text-xs bg-background px-2.5 py-1 rounded-full border text-muted-foreground font-medium">
                                Hadith {currentItem.hadithnumber}
                            </span>
                        </div>
                        {currentItem.chapterTitle && (
                            <p className="text-xs md:text-sm text-muted-foreground mt-2 line-clamp-1">
                                {currentItem.chapterTitle}
                            </p>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 md:p-10 flex flex-col space-y-8 overflow-y-auto">
                        {/* Arabic */}
                        {currentItem.arabic && (
                            <div className="text-right" dir="rtl">
                                <p className="text-2xl md:text-3xl leading-loose font-arabic text-foreground/90">
                                    <TajwidText text={currentItem.arabic} />
                                </p>
                            </div>
                        )}

                        {/* French */}
                        <div className="flex-1">
                            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-serif">
                                {currentItem.text}
                            </p>
                        </div>

                        {/* Grades */}
                        {currentItem.grades && currentItem.grades.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {currentItem.grades.map((g, i) => (
                                    <span key={i} className="text-xs px-2 py-1 bg-muted rounded border">
                                        {g.name}: <span className="font-bold">{g.grade}</span>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation Footer */}
            <div className="mt-8 flex items-center justify-between gap-4">
                <button
                    onClick={prevCard}
                    disabled={currentIndex === 0}
                    className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-medium transition-all bg-card border hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed text-muted-foreground hover:text-foreground"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Précédent
                </button>

                <button
                    onClick={nextCard}
                    disabled={currentIndex === playlist.length - 1}
                    className="flex-[2] flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Suivant
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
