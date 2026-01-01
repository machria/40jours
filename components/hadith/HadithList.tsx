'use client';

import { useState } from 'react';
import { Hadith } from '@/types/hadith';

import Link from 'next/link';

interface HadithListProps {
    hadiths: Hadith[];
    book: string;
    prevSection?: { id: string; url: string };
    nextSection?: { id: string; url: string };
}

export default function HadithList({ hadiths, book, prevSection, nextSection }: HadithListProps) {
    const [showArabic, setShowArabic] = useState(true);
    const [showFrench, setShowFrench] = useState(true);

    return (
        <div className="space-y-6">
            <div className="sticky top-4 z-10 flex flex-wrap gap-2 md:gap-4 justify-center bg-background/80 backdrop-blur-md border rounded-xl p-2 md:p-4 shadow-sm transition-all">
                <button
                    onClick={() => setShowArabic(!showArabic)}
                    className={`flex-1 md:flex-none px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors border ${showArabic
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                >
                    {showArabic ? 'Masquer Arabe' : 'Afficher Arabe'}
                </button>
                <button
                    onClick={() => setShowFrench(!showFrench)}
                    className={`flex-1 md:flex-none px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors border ${showFrench
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                >
                    {showFrench ? 'Masquer Français' : 'Afficher Français'}
                </button>
            </div>

            {hadiths.map((hadith) => (
                <div key={hadith.hadithnumber} id={`h${hadith.hadithnumber}`} className="bg-card border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4 border-b pb-4">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
                            Hadith {hadith.hadithnumber}
                        </span>
                        {hadith.arabicnumber && (
                            <span className="text-muted-foreground text-xs">
                                Arabe: {hadith.arabicnumber}
                            </span>
                        )}
                    </div>
                    <div className="space-y-6">
                        {showArabic && hadith.arabic && (
                            <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-6 md:p-8 border border-primary/10">
                                <p className="text-2xl md:text-3xl leading-loose font-kufi text-right text-foreground dir-rtl" dir="rtl">
                                    {hadith.arabic}
                                </p>
                            </div>
                        )}
                        {showFrench && (
                            <div className="prose dark:prose-invert max-w-none px-2">
                                <p className="text-lg md:text-xl leading-relaxed whitespace-pre-wrap font-serif text-foreground/90">
                                    {hadith.text}
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="mt-6 pt-6 border-t border-border/50 text-sm text-muted-foreground space-y-4">
                        {hadith.english?.narrator && (
                            <div className="flex items-center gap-2 text-foreground/80 font-medium italic">
                                <span className="text-primary text-lg">👤</span>
                                <span>{hadith.english.narrator}</span>
                            </div>
                        )}
                        <div className="flex flex-wrap gap-2">
                            {hadith.tags && hadith.tags.length > 0 && hadith.tags.map((tag, i) => (
                                <span key={`tag-${i}`} className={`px-2 py-1 rounded border border-border/50 text-xs font-bold ${tag === 'Qudsi' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                                    tag === 'Marfou' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                        'bg-muted text-muted-foreground'
                                    }`}>
                                    {tag}
                                </span>
                            ))}
                            {hadith.grades && hadith.grades.length > 0 ? (
                                hadith.grades.map((g, i) => (
                                    <span key={i} className="bg-muted px-2 py-1 rounded border border-border/50">
                                        {g.name}: <span className={
                                            g.grade.toLowerCase().includes('sahih') ? 'text-green-600 font-bold' :
                                                g.grade.toLowerCase().includes('hasan') ? 'text-emerald-500 font-bold' :
                                                    g.grade.toLowerCase().includes('daif') || g.grade.toLowerCase().includes('weak') ? 'text-orange-500 font-bold' :
                                                        ''
                                        }>{g.grade}</span>
                                    </span>
                                ))
                            ) : (
                                (book === 'bukhari' || book === 'muslim') && (
                                    <span className="bg-muted px-2 py-1 rounded border border-border/50">
                                        Degré: <span className="text-green-600 font-bold">Sahih</span>
                                    </span>
                                )
                            )}
                        </div>
                    </div>
                </div>
            ))}
            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4 pt-8 pb-12">
                {prevSection ? (
                    <Link
                        href={prevSection.url}
                        className="flex-1 bg-muted hover:bg-muted/80 text-foreground/80 text-center py-4 rounded-xl transition-all border hover:border-primary/30 flex items-center justify-center gap-2 font-medium"
                    >
                        <span>&larr;</span>
                        <span>Précédent</span>
                    </Link>
                ) : <div className="flex-1"></div>}

                {nextSection ? (
                    <Link
                        href={nextSection.url}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-center py-4 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center justify-center gap-2 font-bold"
                    >
                        <span>Suivant</span>
                        <span>&rarr;</span>
                    </Link>
                ) : <div className="flex-1"></div>}
            </div>
        </div>
    );
}
