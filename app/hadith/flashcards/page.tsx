'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Copy, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { TajwidText } from '@/components/TajwidText';
import { Hadith } from '@/types/hadith';

type FlashcardHadith = Hadith & {
    book: string;
    bookName: string;
    chapterTitle?: string;
};

export default function HadithFlashcardsPage() {
    const [playlist, setPlaylist] = useState<FlashcardHadith[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [fetchingMore, setFetchingMore] = useState(false);

    // Track if we need to fetch more
    const fetchData = async (count = 10) => {
        try {
            const res = await fetch(`/api/hadith/random?count=${count}`);
            if (!res.ok) throw new Error('Failed');
            const newItems = await res.json();
            return newItems;
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    useEffect(() => {
        // Initial load
        setLoading(true);
        fetchData(10).then(items => {
            setPlaylist(items);
            setLoading(false);
        });
    }, []);

    const nextCard = () => {
        if (currentIndex < playlist.length - 1) {
            setCurrentIndex(currentIndex + 1);

            // Prefetch if we are near the end
            if (currentIndex > playlist.length - 4 && !fetchingMore) {
                setFetchingMore(true);
                fetchData(10).then(items => {
                    setPlaylist(prev => [...prev, ...items]);
                    setFetchingMore(false);
                });
            }
        }
    };

    const prevCard = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-muted-foreground animate-pulse">Recherche de hadiths aléatoires...</p>
            </div>
        );
    }

    const currentItem = playlist[currentIndex];

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
                {currentItem && (
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
                )}
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
                    className="flex-[2] flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 active:scale-95"
                >
                    {fetchingMore ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                        <>
                            Suivant
                            <ChevronRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
