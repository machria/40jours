'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, List, Grid, BookOpen, Play } from 'lucide-react';
import { ReadingDay } from '@/data/plan40jours';
import { Ayah } from '@/lib/quranApi';
import { motion } from 'framer-motion';
import { TajwidText } from '@/components/TajwidText';

export interface TafsirGroup {
    ayahs: Ayah[];
    tafsirContent: string;
    id: string; // unique hash or index
}

export default function TafsirFullClient({ day, initialGroups }: { day: ReadingDay, initialGroups: TafsirGroup[] }) {
    const [viewMode, setViewMode] = useState<'detailed' | 'aggregated'>('aggregated');

    return (
        <div className="flex flex-col min-h-screen">
            <header className="fixed top-0 inset-x-0 z-20 bg-background/95 backdrop-blur border-b p-4 flex items-center justify-between shadow-sm">
                <Link href={`/jour/${day.jour}`} className="p-2 hover:bg-muted rounded-full">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <div className="text-center">
                    <h1 className="text-lg font-bold font-kufi">Tafsir Jour {day.jour}</h1>
                    <p className="text-xs text-muted-foreground">{day.sourates}</p>
                </div>
                <button
                    onClick={() => setViewMode(viewMode === 'aggregated' ? 'detailed' : 'aggregated')}
                    className="p-2 hover:bg-muted rounded-full flex items-center gap-2"
                >
                    {viewMode === 'aggregated' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
                </button>
            </header>

            <div className="pt-20 pb-10 px-4 max-w-4xl mx-auto w-full space-y-8">
                {initialGroups.map((group, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-card border rounded-2xl shadow-sm overflow-hidden"
                    >
                        {/* Header: Verses included */}
                        <div className="bg-muted/30 p-4 border-b flex flex-wrap gap-2 items-center">
                            <BookOpen className="w-4 h-4 text-primary" />
                            <span className="text-sm font-semibold">
                                {group.ayahs.length > 1
                                    ? `Sourate ${group.ayahs[0].surah.name} : Versets ${group.ayahs[0].numberInSurah} à ${group.ayahs[group.ayahs.length - 1].numberInSurah}`
                                    : `Sourate ${group.ayahs[0].surah.name} : Verset ${group.ayahs[0].numberInSurah}`
                                }
                            </span>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Verses Section */}
                            <div className="space-y-4">
                                {group.ayahs.map(ayah => (
                                    <div key={ayah.number} className="border-b border-dashed last:border-0 pb-4 last:pb-0">
                                        <div className="flex flex-col gap-2 items-end">
                                            <div className="flex gap-2 items-center">
                                                <span className="text-xs font-mono text-muted-foreground pt-1">{ayah.numberInSurah}</span>
                                                <button
                                                    onClick={() => {
                                                        const surahPad = ayah.surahNumber.toString().padStart(3, '0');
                                                        const ayahPad = ayah.numberInSurah.toString().padStart(3, '0');
                                                        const audio = new Audio(`/audio/${surahPad}${ayahPad}.mp3`);
                                                        audio.play().catch(e => alert("Audio non disponible (téléchargement en cours...)"));
                                                    }}
                                                    className="p-1 hover:bg-primary/10 rounded-full text-primary transition-colors"
                                                    title="Écouter ce verset"
                                                >
                                                    <Play className="w-4 h-4 fill-current" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-right w-full">
                                            <TajwidText text={ayah.text} className="text-2xl font-kufi leading-loose text-foreground" />
                                        </div>
                                        {ayah.translation && (
                                            <div className="text-left w-full mt-2">
                                                <p className="text-muted-foreground/90 font-serif text-lg leading-relaxed">{ayah.translation}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {viewMode === 'aggregated' && group.ayahs.length > 1 && (
                                    <div className="text-center text-sm text-muted-foreground italic">
                                        (Les {group.ayahs.length} versets sont groupés pour ce commentaire)
                                    </div>
                                )}
                            </div>

                            {/* Divider */}
                            <hr className="border-border" />

                            {/* Tafsir Content */}
                            <div className="prose dark:prose-invert max-w-none text-justify leading-relaxed">
                                <p className="whitespace-pre-line">{group.tafsirContent}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div >
    );
}
