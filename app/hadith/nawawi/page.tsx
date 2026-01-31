'use client';

import { useState, useEffect } from 'react';
import hadithsData from '@/data/hadith/nawawi.json';
import HadithCard from '@/components/hadith/HadithCard';
import ThemeFilter from '@/components/hadith/ThemeFilter';
import ProgressTracker from '@/components/hadith/ProgressTracker';
import { BookOpen, Settings2 } from 'lucide-react';
import { cn } from "@/lib/utils";

// Define Hadith type locally if needed or reuse
interface Hadith {
    id: number;
    title: string;
    arabic: string;
    french: string;
    theme: string;
    narrator?: string;
    grade?: string;
}

export default function NawawiPage() {
    const [filter, setFilter] = useState('all');
    const [showArabic, setShowArabic] = useState(false);
    const [showFrench, setShowFrench] = useState(true);
    const [readIds, setReadIds] = useState<number[]>([]);
    const [mounted, setMounted] = useState(false);

    // Initialize from LocalStorage
    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('nawawi_progress');
        if (saved) {
            try {
                setReadIds(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load progress", e);
            }
        }
    }, []);

    // Save to LocalStorage
    useEffect(() => {
        if (mounted) {
            localStorage.setItem('nawawi_progress', JSON.stringify(readIds));
        }
    }, [readIds, mounted]);

    const handleToggleRead = (id: number) => {
        setReadIds(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    };

    const filteredHadiths = hadithsData.filter((h: Hadith) => {
        if (filter === 'all') return true;
        return h.theme === filter;
    });

    if (!mounted) return null; // Prevent hydration mismatch

    return (
        <main className="min-h-screen p-4 md:p-8 space-y-8 pb-24">
            {/* Header */}
            <header className="text-center space-y-4 max-w-2xl mx-auto">
                <div className="flex items-center justify-center gap-3 text-primary mb-2">
                    <BookOpen className="w-8 h-8 md:w-10 md:h-10" />
                    <h1 className="text-3xl font-bold mb-2">Les 40 Hadiths Nawawi</h1>
                </div>
                <p className="text-muted-foreground">
                    L'essentiel de la sagesse prophétique 🌿
                </p>
            </header>

            {/* Preamble / Introduction */}
            <div className="bg-card border rounded-xl p-6 md:p-8 mb-10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <BookOpen className="w-32 h-32" />
                </div>
                <div className="relative z-10 max-w-3xl">
                    <h2 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
                        <span>💡</span> Pourquoi étudier cette œuvre ?
                    </h2>
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                        <p>
                            Les <span className="font-medium text-foreground">40 Hadiths de l'Imam An-Nawawi</span> sont une compilation bénie qui résume les principes fondamentaux de l'Islam. Les savants disent que toute la religion tourne autour de ces quelques paroles prophétiques.
                        </p>
                        <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg my-4">
                            <h3 className="font-medium text-foreground mb-1 block">Conseil Spirituel :</h3>
                            <p className="italic text-sm">
                                "Ne vous contentez pas de lire ces hadiths comme de simples informations. Prenez-en un seul, méditez dessus longuement, et demandez-vous : <span className="font-semibold text-primary">'Quelle action concrète puis-je accomplir aujourd'hui pour mettre en pratique cet enseignement ?'</span> Que ce soit une parole, un geste ou une rectification de l'intention, faites vivre la Sunnah à travers vous."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls & Progress */}
            <div className="max-w-4xl mx-auto space-y-6">
                <ProgressTracker total={42} completed={readIds.length} />

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-muted/50 rounded-xl border">

                    {/* Theme Filter */}
                    <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <ThemeFilter currentTheme={filter} onThemeChange={setFilter} />
                    </div>

                    {/* Display Toggles */}
                    <div className="flex items-center gap-3 text-sm font-medium whitespace-nowrap">
                        <span className="flex items-center gap-1 text-muted-foreground">
                            <Settings2 className="w-4 h-4" />
                            Affichage :
                        </span>
                        <button
                            onClick={() => setShowArabic(!showArabic)}
                            className={cn(
                                "px-3 py-1.5 rounded-md transition-colors border",
                                showArabic ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground hover:bg-muted"
                            )}
                        >
                            {showArabic ? 'Masquer l\'arabe' : 'Voir l\'arabe'}
                        </button>
                        <button
                            onClick={() => setShowFrench(!showFrench)}
                            className={cn(
                                "px-3 py-1.5 rounded-md transition-colors border",
                                showFrench ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground hover:bg-muted"
                            )}
                        >
                            Français
                        </button>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                {filteredHadiths.map((hadith: Hadith) => (
                    <HadithCard
                        key={hadith.id}
                        hadith={hadith}
                        showArabic={showArabic}
                        showFrench={showFrench}
                        isRead={readIds.includes(hadith.id)}
                        onToggleRead={() => handleToggleRead(hadith.id)}
                    />
                ))}
            </div>

            {filteredHadiths.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    Aucun hadith trouvé pour ce thème.
                </div>
            )}
        </main>
    );
}
