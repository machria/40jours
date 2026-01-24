'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen, Shuffle, MapPin, Calendar } from 'lucide-react';
import { cn } from '@/components/layout/Navigation';

type SurahSection = {
    title: string;
    content: string;
};

type SurahDetails = {
    title: string;
    sections: SurahSection[];
};

type SurahData = {
    [key: string]: SurahDetails;
};

export default function SurahFlashcardsPage() {
    const [surahData, setSurahData] = useState<SurahData>({});
    const [currentSurahId, setCurrentSurahId] = useState<number>(1);
    const [history, setHistory] = useState<number[]>([1]);
    const [historyIndex, setHistoryIndex] = useState<number>(0);
    const [isRandom, setIsRandom] = useState(true);
    const [loading, setLoading] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);

    // Load surah data
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/surah-details');
                if (!res.ok) throw new Error('Failed to load data');
                const data = await res.json();
                setSurahData(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const currentSurah = surahData[currentSurahId.toString()];

    // Extract key information from sections
    const getSection = (title: string) => {
        return currentSurah?.sections.find(s => s.title.includes(title))?.content || '';
    };

    const generalInfo = getSection('Nom, statut');
    const context = getSection('Contexte général');
    const themes = getSection('Thèmes principaux');
    const maqsad = getSection('Maqṣad');

    // Parse general info
    const parseInfo = (info: string) => {
        const verses = info.match(/Versets\*\* : (\d+)/)?.[1] || '';
        const classification = info.match(/Classification\*\* : (\w+)/)?.[1] || '';
        return { verses, classification };
    };

    const { verses, classification } = parseInfo(generalInfo);

    // Simple markdown parser for bold text and lists
    const parseMarkdown = (text: string) => {
        if (!text) return null;

        // Split by newlines to handle lists
        const lines = text.split('\n');

        return lines.map((line, idx) => {
            // Handle list items
            if (line.trim().startsWith('-')) {
                const content = line.replace(/^-\s*/, '');
                return (
                    <li key={idx} className="ml-4">
                        {parseBold(content)}
                    </li>
                );
            }

            // Regular paragraph
            return line.trim() ? (
                <p key={idx} className="mb-2 last:mb-0">
                    {parseBold(line)}
                </p>
            ) : null;
        });
    };

    // Parse bold markdown (**text**)
    const parseBold = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, idx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={idx} className="font-bold text-foreground">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    const goToNext = () => {
        if (isAnimating) return;

        setIsAnimating(true);
        setTimeout(() => {
            if (isRandom) {
                // Random surah
                const randomId = Math.floor(Math.random() * 114) + 1;
                setCurrentSurahId(randomId);
                setHistory([...history.slice(0, historyIndex + 1), randomId]);
                setHistoryIndex(historyIndex + 1);
            } else {
                // Sequential
                const nextId = currentSurahId < 114 ? currentSurahId + 1 : 1;
                setCurrentSurahId(nextId);
                setHistory([...history.slice(0, historyIndex + 1), nextId]);
                setHistoryIndex(historyIndex + 1);
            }
            setIsAnimating(false);
        }, 300);
    };

    const goToPrevious = () => {
        if (historyIndex > 0 && !isAnimating) {
            setIsAnimating(true);
            setTimeout(() => {
                setHistoryIndex(historyIndex - 1);
                setCurrentSurahId(history[historyIndex - 1]);
                setIsAnimating(false);
            }, 300);
        }
    };

    const toggleRandomMode = () => {
        setIsRandom(!isRandom);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-muted-foreground animate-pulse">Chargement des sourates...</p>
            </div>
        );
    }

    return (
        <div className="container max-w-4xl mx-auto py-6 px-4 flex flex-col min-h-[calc(100vh-4rem)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Link href="/coran" className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Retour</span>
                </Link>

                <button
                    onClick={toggleRandomMode}
                    className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
                        isRandom
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
                    )}
                >
                    <Shuffle className="w-4 h-4" />
                    {isRandom ? 'Aléatoire' : 'Séquentiel'}
                </button>
            </div>

            {/* Progress */}
            <div className="mb-6 text-center">
                <p className="text-sm text-muted-foreground">
                    Sourate <span className="font-bold text-foreground">{currentSurahId}</span> / 114
                </p>
            </div>

            {/* Main Card */}
            <div className="flex-1 flex flex-col">
                {currentSurah && (
                    <div
                        className={cn(
                            "flex-1 bg-gradient-to-br from-card to-card/50 border rounded-2xl shadow-lg flex flex-col overflow-hidden transition-all duration-300",
                            isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
                        )}
                    >
                        {/* Card Header */}
                        <div className={cn(
                            "px-6 py-4 border-b",
                            classification === 'mecquoise'
                                ? "bg-gradient-to-r from-amber-500/10 to-orange-500/10"
                                : "bg-gradient-to-r from-emerald-500/10 to-teal-500/10"
                        )}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold text-foreground mb-2">
                                        {currentSurah.title}
                                    </h1>
                                    <div className="flex flex-wrap gap-3 text-sm">
                                        {verses && (
                                            <span className="flex items-center gap-1.5 text-muted-foreground">
                                                <BookOpen className="w-4 h-4" />
                                                {verses} versets
                                            </span>
                                        )}
                                        {classification && (
                                            <span className={cn(
                                                "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium",
                                                classification === 'mecquoise'
                                                    ? "bg-amber-500/20 text-amber-700 dark:text-amber-400"
                                                    : "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                                            )}>
                                                <MapPin className="w-3 h-3" />
                                                {classification.charAt(0).toUpperCase() + classification.slice(1)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
                            {/* Context */}
                            {context && (
                                <div className="space-y-2">
                                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Contexte</h3>
                                    <div className="text-foreground/90 leading-relaxed">
                                        {parseMarkdown(context)}
                                    </div>
                                </div>
                            )}

                            {/* Themes */}
                            {themes && (
                                <div className="space-y-2">
                                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Thèmes Principaux</h3>
                                    <ul className="text-foreground/90 leading-relaxed list-none">
                                        {parseMarkdown(themes)}
                                    </ul>
                                </div>
                            )}

                            {/* Maqsad */}
                            {maqsad && (
                                <div className="space-y-2 p-4 bg-primary/5 rounded-xl border border-primary/10">
                                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Objectif (Maqṣad)
                                    </h3>
                                    <div className="text-foreground/90 leading-relaxed italic">
                                        {parseMarkdown(maqsad)}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Button */}
                        <div className="p-6 border-t bg-muted/30">
                            <Link
                                href={`/coran/${currentSurahId}`}
                                className="w-full py-4 px-6 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
                            >
                                <BookOpen className="w-5 h-5" />
                                Lire cette Sourate
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Footer */}
            <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                    onClick={goToPrevious}
                    disabled={historyIndex === 0}
                    className="flex items-center justify-center gap-2 py-4 rounded-xl font-medium transition-all bg-card border hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed text-muted-foreground hover:text-foreground"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Précédent
                </button>

                <button
                    onClick={goToNext}
                    className="flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 active:scale-95"
                >
                    Suivant
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
