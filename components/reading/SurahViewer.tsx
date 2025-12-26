'use client';

import { useState, useRef } from 'react';
import { Play, BookOpen, Pause } from 'lucide-react';
import Link from 'next/link';
import { TajwidText } from '@/components/TajwidText';
import TafsirModal from '@/components/reading/TafsirModal';

interface Ayah {
    id: number;
    surah: number;
    ayah: number;
    text: string;
    translation: string;
    page: number;
}

interface SurahViewerProps {
    ayahs: Ayah[];
    surahId: number;
}

export default function SurahViewer({ ayahs, surahId }: SurahViewerProps) {
    // Tafsir State
    const [tafsirState, setTafsirState] = useState<{
        isOpen: boolean;
        surahNumber: number;
        ayahNumber: number;
        text: string;
        translation?: string;
    }>({ isOpen: false, surahNumber: 0, ayahNumber: 0, text: '' });

    // Audio State
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [playingAyah, setPlayingAyah] = useState<string | null>(null); // "surah:ayah"

    const playAudio = (surah: number, ayah: number) => {
        const key = `${surah}:${ayah}`;

        if (playingAyah === key && audioRef.current) {
            audioRef.current.pause();
            setPlayingAyah(null);
            return;
        }

        if (audioRef.current) {
            audioRef.current.pause();
        }

        const surahPad = surah.toString().padStart(3, '0');
        const ayahPad = ayah.toString().padStart(3, '0');
        const url = `/audio/${surahPad}${ayahPad}.mp3`;

        const audio = new Audio(url);
        audioRef.current = audio;

        audio.play().catch(e => {
            console.error("Audio error", e);
            alert("Audio non disponible pour ce verset.");
            setPlayingAyah(null);
        });

        setPlayingAyah(key);

        audio.onended = () => {
            setPlayingAyah(null);
        };
    };

    const openTafsir = (surah: number, ayah: number, text: string, translation: string) => {
        setTafsirState({ isOpen: true, surahNumber: surah, ayahNumber: ayah, text, translation });
    };

    const [viewMode, setViewMode] = useState<'list' | 'mushaf'>('list');

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-muted/30 p-2 rounded-lg gap-2">
                <Link
                    href={`/coran/${surahId}/tafsir`}
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-accent hover:bg-accent/10 transition-colors w-full sm:w-auto justification-center"
                >
                    <BookOpen className="w-4 h-4" />
                    Voir Tafsir Complet
                </Link>

                <div className="flex bg-background rounded-md p-1 shadow-sm w-full sm:w-auto">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Liste
                    </button>
                    <button
                        onClick={() => setViewMode('mushaf')}
                        className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'mushaf' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Mushaf
                    </button>
                </div>
            </div>

            {viewMode === 'mushaf' ? (
                <div className="bg-card border rounded-xl p-8 shadow-sm">
                    <div className="text-justify font-kufi text-2xl md:text-3xl leading-[2.8] dir-rtl" dir="rtl">
                        {ayahs.map((ayah, i) => (
                            <span key={ayah.id}
                                className={`cursor-pointer hover:bg-primary/5 rounded transition-colors ${playingAyah === `${ayah.surah}:${ayah.ayah}` ? 'bg-primary/10' : ''}`}
                                onClick={() => {
                                    playAudio(ayah.surah, ayah.ayah);
                                }}
                            >
                                <TajwidText text={ayah.text} className="inline" />
                                <span className="inline-flex items-center justify-center w-8 h-8 text-xs border rounded-full font-sans text-muted-foreground align-middle mx-1 bg-background select-none">
                                    {ayah.ayah}
                                </span>
                            </span>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {ayahs.map((ayah) => {
                        const isPlaying = playingAyah === `${ayah.surah}:${ayah.ayah}`;

                        return (
                            <div
                                key={ayah.id}
                                id={`ayah-${ayah.ayah}`}
                                className={`scroll-mt-24 bg-card border rounded-xl p-6 transition-all hover:shadow-md ${isPlaying ? 'ring-2 ring-primary/20 bg-primary/5' : ''}`}
                            >
                                <div className="flex items-center justify-between mb-4 border-b pb-4 border-border/50">
                                    <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                                        {ayah.surah}:{ayah.ayah}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => playAudio(ayah.surah, ayah.ayah)}
                                            className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${isPlaying
                                                ? 'text-primary bg-primary/10'
                                                : 'text-primary hover:text-primary/80 border border-primary/20 hover:bg-primary/5'
                                                }`}
                                        >
                                            {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                                            {isPlaying ? 'Pause' : 'Écouter'}
                                        </button>

                                        <button
                                            onClick={() => openTafsir(ayah.surah, ayah.ayah, ayah.text, ayah.translation)}
                                            className="flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent/80 border border-accent/20 hover:bg-accent/5 px-3 py-1.5 rounded-full"
                                        >
                                            <BookOpen className="w-3 h-3" />
                                            Tafsir
                                        </button>
                                    </div>
                                </div>

                                <div className="text-right mb-6" dir="rtl">
                                    <TajwidText
                                        text={ayah.text}
                                        className="font-kufi text-2xl md:text-3xl leading-[2.2] text-foreground"
                                    />
                                </div>

                                <div className="text-left dir-ltr">
                                    <p className="text-foreground/80 text-lg leading-relaxed">
                                        {ayah.translation}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <TafsirModal
                isOpen={tafsirState.isOpen}
                onClose={() => setTafsirState({ ...tafsirState, isOpen: false })}
                surahNumber={tafsirState.surahNumber}
                ayahNumber={tafsirState.ayahNumber}
                ayahText={tafsirState.text}
                translation={tafsirState.translation}
            />
        </>
    );
}
