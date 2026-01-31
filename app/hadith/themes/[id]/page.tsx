'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { TajwidText } from '@/components/TajwidText';
import { Hadith } from '@/types/hadith';
import { HADITH_THEMES } from '@/lib/hadith-themes';

type FlashcardHadith = Hadith & {
    collectionName?: string;
    bookName?: string;
    chapterTitle?: string;
};

export default function ThematicFlashcardPage() {
    const params = useParams();
    const themeId = params.id as string;
    const theme = HADITH_THEMES.find(t => t.id === themeId);

    const [playlist, setPlaylist] = useState<FlashcardHadith[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [showArabic, setShowArabic] = useState(true);
    const [showFrench, setShowFrench] = useState(true);

    // Fetch data from thematic API
    const fetchData = async (count = 10) => {
        if (!themeId) return [];
        try {
            const res = await fetch(`/api/hadith/theme?id=${themeId}&count=${count}`);
            if (!res.ok) throw new Error('Failed');
            const newItems = await res.json();
            return newItems;
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    useEffect(() => {
        if (themeId) {
            setLoading(true);
            fetchData(10).then(items => {
                setPlaylist(items);
                setLoading(false);
            });
        }
    }, [themeId]);

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

    if (loading || !theme) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 md:pl-64">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-muted-foreground animate-pulse">
                    {loading ? `Recherche de hadiths sur "${theme?.title || 'le thème'}"...` : 'Thème introuvable'}
                </p>
            </div>
        );
    }

    const currentItem = playlist[currentIndex];

    // Helper to format collection name
    const formatCollection = (c?: string) => {
        if (!c) return 'Hadith';
        const map: Record<string, string> = {
            bukhari: 'Bukhari', muslim: 'Muslim', nasai: 'An-Nasa\'i',
            abudawud: 'Abu Dawud', tirmidhi: 'At-Tirmidhi', ibnmajah: 'Ibn Majah', malik: 'Muwatta Malik'
        };
        return map[c] || c;
    };

    return (
        <div className="container max-w-3xl mx-auto py-6 px-4 flex flex-col min-h-[calc(100vh-4rem)] md:pl-64">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Link href="/hadith/themes" className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Univers Hadith</span>
                </Link>

                <div className="flex items-center gap-2 text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                    <span>{theme.emoji}</span>
                    <span>{theme.title}</span>
                </div>
            </div>

            {/* Main Card */}
            <div className="flex-1 flex flex-col relative">
                {currentItem ? (
                    <div className="flex-1 bg-card border rounded-3xl shadow-sm flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 key-[currentindex]">
                        {/* Card Header */}
                        <div className="bg-muted/30 px-6 py-4 border-b">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex flex-col gap-1">
                                    <span className="font-bold text-primary flex items-center gap-2">
                                        <span className="text-lg">📚</span>
                                        {formatCollection(currentItem.collectionName) || currentItem.bookName}
                                        <span className="text-xs bg-background px-2 py-0.5 rounded-full border text-muted-foreground font-medium ml-2">
                                            Hadith {currentItem.hadithnumber}
                                        </span>
                                    </span>
                                    {currentItem.chapterTitle ? (
                                        <p className="text-xs md:text-sm text-muted-foreground line-clamp-1">
                                            {currentItem.chapterTitle}
                                        </p>
                                    ) : (
                                        <p className="text-xs text-muted-foreground">{theme.title}</p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setShowArabic(!showArabic)}
                                        className={`p-2 rounded-lg border transition-colors ${showArabic ? 'bg-primary/10 text-primary border-primary/20' : 'bg-background text-muted-foreground hover:bg-muted'}`}
                                        title={showArabic ? "Masquer l'arabe" : "Afficher l'arabe"}
                                    >
                                        <span className="text-xs font-bold mr-1">AR</span>
                                        {showArabic ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </button>
                                    <button
                                        onClick={() => setShowFrench(!showFrench)}
                                        className={`p-2 rounded-lg border transition-colors ${showFrench ? 'bg-primary/10 text-primary border-primary/20' : 'bg-background text-muted-foreground hover:bg-muted'}`}
                                        title={showFrench ? "Masquer le français" : "Afficher le français"}
                                    >
                                        <span className="text-xs font-bold mr-1">FR</span>
                                        {showFrench ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6 md:p-10 flex flex-col space-y-8 overflow-y-auto">
                            {/* Arabic */}
                            {currentItem.arabic && (
                                <div className={`transition-opacity duration-300 ${showArabic ? 'opacity-100' : 'opacity-0 hidden'} text-right`} dir="rtl">
                                    <div className="text-2xl md:text-3xl leading-loose font-arabic text-foreground/90 font-kufi">
                                        <TajwidText text={currentItem.arabic} />
                                    </div>
                                </div>
                            )}

                            {/* French */}
                            <div className={`flex-1 transition-opacity duration-300 ${showFrench ? 'opacity-100' : 'opacity-0 hidden'}`}>
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
                ) : (
                    <div className="flex-1 bg-card border rounded-3xl shadow-sm flex items-center justify-center p-8 text-muted-foreground">
                        Aucun hadith trouvé pour ce thème.
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
