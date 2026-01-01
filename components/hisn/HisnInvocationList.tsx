'use client';

import { useState } from 'react';
import { TajwidText } from '@/components/TajwidText';
import { Copy, Share2, Eye, EyeOff, Brain, Sparkles } from 'lucide-react';
import { cn } from '@/components/layout/Navigation';

type Hadith = {
    id: number;
    arabic: string;
    french: string;
    source: string;
    repeat: number;
};

interface HisnInvocationListProps {
    hadiths: Hadith[];
    categoryTitle: string;
}

export default function HisnInvocationList({ hadiths, categoryTitle }: HisnInvocationListProps) {
    const [blurArabic, setBlurArabic] = useState(false);
    const [blurFrench, setBlurFrench] = useState(false);
    const [revealedItems, setRevealedItems] = useState<Record<string, boolean>>({});

    const toggleReveal = (id: string, type: 'arabic' | 'french') => {
        const key = `${id}-${type}`;
        setRevealedItems(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const isBlurred = (id: number, type: 'arabic' | 'french') => {
        if (type === 'arabic' && !blurArabic) return false;
        if (type === 'french' && !blurFrench) return false;

        // If global blur is on, check if specifically revealed
        const key = `${id}-${type}`;
        return !revealedItems[key];
    };

    return (
        <div className="space-y-6">
            {/* Learning Controls */}
            <div className="sticky top-4 z-10 bg-background/95 backdrop-blur-md border rounded-xl p-4 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold">
                    <Brain className="w-5 h-5" />
                    <span>Mode Apprentissage</span>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setBlurArabic(!blurArabic)}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border",
                            blurArabic
                                ? "bg-primary text-primary-foreground border-primary shadow-md"
                                : "bg-card hover:bg-accent/50 text-muted-foreground border-border"
                        )}
                    >
                        {blurArabic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {blurArabic ? "Arabe Masqué" : "Masquer Arabe"}
                    </button>
                    <button
                        onClick={() => setBlurFrench(!blurFrench)}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border",
                            blurFrench
                                ? "bg-primary text-primary-foreground border-primary shadow-md"
                                : "bg-card hover:bg-accent/50 text-muted-foreground border-border"
                        )}
                    >
                        {blurFrench ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {blurFrench ? "Français Masqué" : "Masquer Français"}
                    </button>
                </div>
                {(blurArabic || blurFrench) && (
                    <p className="text-xs text-center text-muted-foreground animate-in fade-in">
                        <Sparkles className="w-3 h-3 inline mr-1 text-yellow-500" />
                        Cliquez sur le texte flouté pour le révéler
                    </p>
                )}
            </div>

            <div className="space-y-8">
                {hadiths.map((hadith, index) => (
                    <div
                        key={hadith.id}
                        className="flex flex-col bg-card border rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md"
                    >
                        {/* Header/Counter */}
                        <div className="bg-muted/30 px-4 py-3 border-b flex justify-between items-center">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider bg-background px-2 py-1 rounded-md border">
                                Invocation {index + 1}/{hadiths.length}
                            </span>
                            <div className="flex gap-2">
                                <button className="p-1.5 hover:bg-background rounded-md transition-colors border border-transparent hover:border-border" title="Copier">
                                    <Copy className="w-4 h-4 text-muted-foreground" />
                                </button>
                                <button className="p-1.5 hover:bg-background rounded-md transition-colors border border-transparent hover:border-border" title="Partager">
                                    <Share2 className="w-4 h-4 text-muted-foreground" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 md:p-8 space-y-8">
                            {/* Arabic Text */}
                            <div
                                className="relative text-right group cursor-pointer"
                                dir="rtl"
                                onClick={() => blurArabic && toggleReveal(hadith.id.toString(), 'arabic')}
                            >
                                <div className={cn(
                                    "transition-all duration-500",
                                    isBlurred(hadith.id, 'arabic') ? "blur-md opacity-30 select-none grayscale" : "blur-0 opacity-100"
                                )}>
                                    <p className="text-2xl md:text-4xl leading-relaxed md:leading-[2.5] font-arabic text-primary/90">
                                        <TajwidText text={hadith.arabic} />
                                    </p>
                                </div>
                                {isBlurred(hadith.id, 'arabic') && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium shadow-sm border flex items-center gap-2">
                                            <Eye className="w-4 h-4" />
                                            Révéler
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Transliteration / Source */}
                            {hadith.source && (
                                <div className="p-4 bg-accent/20 rounded-lg border border-accent/20">
                                    <p className="text-sm md:text-base italic text-muted-foreground/90 leading-relaxed text-center">
                                        {hadith.source}
                                    </p>
                                </div>
                            )}

                            {/* French Translation */}
                            <div
                                className="relative cursor-pointer group"
                                onClick={() => blurFrench && toggleReveal(hadith.id.toString(), 'french')}
                            >
                                <div className={cn(
                                    "transition-all duration-500",
                                    isBlurred(hadith.id, 'french') ? "blur-md opacity-30 select-none" : "blur-0 opacity-100"
                                )}>
                                    <p className="text-base md:text-xl text-foreground/90 leading-relaxed font-serif">
                                        {hadith.french}
                                    </p>
                                </div>
                                {isBlurred(hadith.id, 'french') && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium shadow-sm border flex items-center gap-2">
                                            <Eye className="w-4 h-4" />
                                            Révéler
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Repeat Count */}
                            {hadith.repeat > 1 && (
                                <div className="flex justify-center pt-2">
                                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-primary text-primary-foreground shadow-sm">
                                        <RefreshCwIcon className="w-3 h-3" />
                                        Répéter {hadith.repeat} fois
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function RefreshCwIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></svg>
    )
}
