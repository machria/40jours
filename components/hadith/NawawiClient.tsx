'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, BookOpen, Filter, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TajwidText } from '@/components/TajwidText';

interface HadithNawawi {
    id: number;
    title: string;
    arabic: string;
    french: string;
    theme: string;
    commentaryUrl?: string;
}

interface NawawiClientProps {
    hadiths: HadithNawawi[];
}

export default function NawawiClient({ hadiths }: NawawiClientProps) {
    // State
    const [selectedTheme, setSelectedTheme] = useState<string>('all');
    const [showArabic, setShowArabic] = useState(true);
    const [showFrench, setShowFrench] = useState(true);
    const [completedHadiths, setCompletedHadiths] = useState<number[]>([]);
    const [expandedHadith, setExpandedHadith] = useState<number | null>(null);

    // Initial load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('nawawi_progress');
        if (saved) {
            setCompletedHadiths(JSON.parse(saved));
        }
    }, []);

    // Save to localStorage
    const toggleComplete = (id: number) => {
        const isCompleted = completedHadiths.includes(id);
        let newCompleted;

        if (isCompleted) {
            newCompleted = completedHadiths.filter(h => h !== id);
        } else {
            newCompleted = [...completedHadiths, id];
            // Trigger confetti if significant milestone or just satisfying click
            if (newCompleted.length % 10 === 0 || newCompleted.length === 42) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        }

        setCompletedHadiths(newCompleted);
        localStorage.setItem('nawawi_progress', JSON.stringify(newCompleted));
    };

    // Filter Logic
    const filteredHadiths = selectedTheme === 'all'
        ? hadiths
        : hadiths.filter(h => h.theme === selectedTheme);

    const progressPercentage = Math.round((completedHadiths.length / hadiths.length) * 100);

    const themes = [
        { id: 'all', label: 'Tout', icon: '📚' },
        { id: 'aqida', label: 'Croyance', icon: '☁️' },
        { id: 'ibadat', label: 'Adoration', icon: '🕌' },
        { id: 'muamalat', label: 'Relations', icon: '🤝' },
        { id: 'adab', label: 'Comportement', icon: '🧡' },
        { id: 'tazkiya', label: 'Purification', icon: '✨' },
    ];

    return (
        <div className="space-y-8">
            {/* Progress Section */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-bold font-kufi">Votre Progression</h2>
                        <p className="text-sm text-muted-foreground">{completedHadiths.length} sur {hadiths.length} hadiths lus</p>
                    </div>
                    <div className="text-2xl font-bold text-primary font-mono">{progressPercentage}%</div>
                </div>
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div
                        className="bg-primary h-full transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>

            {/* Controls & Filters */}
            <div className="sticky top-[140px] md:top-[80px] z-10 space-y-4 bg-background/95 backdrop-blur pb-4 border-b">
                {/* Toggles */}
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Filtres</span>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowArabic(!showArabic)}
                            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${showArabic ? 'bg-primary/10 text-primary border-primary/20' : 'text-muted-foreground'}`}
                        >
                            Arabe
                        </button>
                        <button
                            onClick={() => setShowFrench(!showFrench)}
                            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${showFrench ? 'bg-primary/10 text-primary border-primary/20' : 'text-muted-foreground'}`}
                        >
                            Français
                        </button>
                    </div>
                </div>

                {/* Theme Chips */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {themes.map(theme => (
                        <button
                            key={theme.id}
                            onClick={() => setSelectedTheme(theme.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedTheme === theme.id
                                ? 'bg-primary text-primary-foreground shadow-md scale-105'
                                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                        >
                            <span>{theme.icon}</span>
                            {theme.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Hadiths Grid */}
            <div className="grid grid-cols-1 gap-6">
                {filteredHadiths.map(hadith => (
                    <div
                        key={hadith.id}
                        id={`hadith-${hadith.id}`}
                        className={`bg-card border rounded-2xl overflow-hidden transition-all duration-300 ${completedHadiths.includes(hadith.id) ? 'opacity-75 hover:opacity-100 border-green-200 dark:border-green-900' : 'hover:shadow-md'}`}
                    >
                        {/* Header */}
                        <div className="p-4 border-b bg-muted/10 flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                                    {hadith.id}
                                </span>
                                <div>
                                    <h3 className="font-bold text-base md:text-lg">{hadith.title}</h3>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
                                        {themes.find(t => t.id === hadith.theme)?.label}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => toggleComplete(hadith.id)}
                                className={`shrink-0 p-2 rounded-full transition-colors ${completedHadiths.includes(hadith.id)
                                    ? 'text-green-600 bg-green-100 hover:bg-green-200'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                                title={completedHadiths.includes(hadith.id) ? "Marquer comme non lu" : "Marquer comme lu"}
                            >
                                <CheckCircle className={`w-6 h-6 ${completedHadiths.includes(hadith.id) ? 'fill-current' : ''}`} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {showArabic && (
                                <div className="text-right" dir="rtl">
                                    <p className="font-kufi text-xl md:text-2xl leading-[2.2] text-foreground/90">
                                        <TajwidText text={hadith.arabic} />
                                    </p>
                                </div>
                            )}

                            {showArabic && showFrench && <hr className="border-border/50" />}

                            {showFrench && (
                                <div className="text-left">
                                    <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                                        {hadith.french}
                                    </p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex justify-end pt-2">
                                {/* Placeholder for potential commentary link */}
                                <button className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 opacity-50 cursor-not-allowed" title="Bientôt disponible">
                                    <BookOpen className="w-3 h-3" />
                                    Commentaire
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredHadiths.length === 0 && (
                <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-2xl">
                    <p>Aucun hadith ne correspond à ce filtre.</p>
                </div>
            )}
        </div>
    );
}
