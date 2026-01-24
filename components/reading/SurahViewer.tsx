'use client';

import { useState, useRef } from 'react';
import { Play, BookOpen, Pause } from 'lucide-react';
import Link from 'next/link';
import { TajwidText } from '@/components/TajwidText';
import TafsirModal from '@/components/reading/TafsirModal';
import { useQuranAudio } from '@/hooks/useQuranAudio';
import { useSettings } from '@/context/SettingsContext';

interface Ayah {
    id: number;
    surah: number;
    ayah: number;
    text: string;
    translation: string;
    page: number;
    phonetic?: string;
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

    // Tafsir State - Keep as is

    // Settings
    const { fontSize, fontSizes } = useSettings();
    const currentFontSize = fontSizes[fontSize];

    // View State (Moved up to avoid TDZ)
    const [viewMode, setViewMode] = useState<'list' | 'mushaf'>('list');
    const [showPhonetic, setShowPhonetic] = useState(false);

    // Helper functions
    const scrollToAyah = (ayahNum: number) => {
        const element = document.getElementById(`ayah-${ayahNum}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    // Audio State
    // Prepare playlist
    const playlist = ayahs.map(a => ({
        surah: a.surah,
        ayah: a.ayah,
        url: `/audio/${a.surah.toString().padStart(3, '0')}${a.ayah.toString().padStart(3, '0')}.mp3`,
        metadata: { surahName: `Sourate ${a.surah}`, text: a.text }
    }));

    // Audio Hook
    const {
        isPlaying,
        currentAyah,
        repeatMode,
        play,
        pause,
        togglePlay,
        toggleRepeat
    } = useQuranAudio({
        playlist,
        onAyahChange: (ayah) => {
            // Auto-scroll
            if (viewMode === 'list') {
                scrollToAyah(ayah.ayah);
            }
        }
    });

    const isPlayingSequence = isPlaying && !!currentAyah;

    // Helper to check if specific ayah is playing
    const isAyahPlaying = (surah: number, ayah: number) => {
        return currentAyah?.surah === surah && currentAyah?.ayah === ayah;
    };

    const handlePlayClick = (surah: number, ayah: number) => {
        if (isAyahPlaying(surah, ayah) && isPlaying) {
            pause();
        } else {
            // When clicking a specific ayah, we want to play it.
            // If it's already the current one but paused, resume?
            // "play" from hook handles "play this specific item".
            play({ surah, ayah, url: '' });
        }
    };

    const togglePlaySequence = () => {
        if (isPlaying) {
            pause();
        } else {
            // Resume or Start from beginning
            togglePlay();
        }
    };


    const openTafsir = (surah: number, ayah: number, text: string, translation: string) => {
        setTafsirState({ isOpen: true, surahNumber: surah, ayahNumber: ayah, text, translation });
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-muted/30 p-2 rounded-lg gap-2 sticky top-[73px] z-10 backdrop-blur-md">
                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={togglePlaySequence}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all shadow-sm ${isPlaying ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
                    >
                        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                        {isPlaying ? "Pause" : "Tout écouter"}
                    </button>

                    <button
                        onClick={toggleRepeat}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-all border ${repeatMode !== 'off' ? 'bg-accent/10 text-accent border-accent/20' : 'bg-background text-muted-foreground border-transparent hover:text-foreground'}`}
                        title="Mode de répétition : Verset (1x) ou Tout (Loop)"
                    >
                        <span className="flex items-center gap-1">
                            {repeatMode === 'single' && '1x'}
                            {repeatMode === 'all' && 'Tout'}
                            {repeatMode === 'off' && 'Loop'}
                        </span>
                    </button>

                    <button
                        onClick={() => setShowPhonetic(!showPhonetic)}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-all border ${showPhonetic ? 'bg-accent/10 text-accent border-accent/20' : 'bg-background text-muted-foreground border-transparent hover:text-foreground'}`}
                    >
                        Phonétique
                    </button>
                </div>

                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
                    <Link
                        href={`/coran/${surahId}/tafsir`}
                        className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-accent hover:bg-accent/10 transition-colors whitespace-nowrap"
                    >
                        <BookOpen className="w-4 h-4" />
                        Tafsir Complet
                    </Link>

                    <div className="flex bg-background rounded-md p-1 shadow-sm shrink-0">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Liste
                        </button>
                        <button
                            onClick={() => setViewMode('mushaf')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'mushaf' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Mushaf
                        </button>
                    </div>
                </div>
            </div>

            {viewMode === 'mushaf' ? (
                <div className="bg-card border rounded-xl p-8 shadow-sm">
                    <div className="text-justify font-kufi text-2xl md:text-3xl leading-[2.8] dir-rtl" dir="rtl">
                        {ayahs.map((ayah, i) => (
                            <span key={ayah.id}
                                className={`cursor-pointer hover:bg-primary/5 rounded transition-colors ${isAyahPlaying(ayah.surah, ayah.ayah) ? 'bg-primary/20 text-primary' : ''}`}
                                onClick={() => handlePlayClick(ayah.surah, ayah.ayah)}
                            >
                                <TajwidText text={ayah.text} className="inline" style={{ fontSize: currentFontSize }} />
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
                        const playing = isAyahPlaying(ayah.surah, ayah.ayah);

                        return (
                            <div
                                key={ayah.id}
                                id={`ayah-${ayah.ayah}`}
                                className={`scroll-mt-32 bg-card border rounded-xl p-6 transition-all duration-500 ${playing ? 'ring-2 ring-primary shadow-lg scale-[1.01]' : 'hover:shadow-md'}`}
                            >
                                <div className="flex items-center justify-between mb-4 border-b pb-4 border-border/50">
                                    <span className={`text-xs font-mono px-2 py-1 rounded transition-colors ${playing ? 'bg-primary text-primary-foreground' : 'text-muted-foreground bg-muted'}`}>
                                        {ayah.surah}:{ayah.ayah}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handlePlayClick(ayah.surah, ayah.ayah)}
                                            className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${playing
                                                ? 'text-primary bg-primary/10'
                                                : 'text-primary hover:text-primary/80 border border-primary/20 hover:bg-primary/5'
                                                }`}
                                        >
                                            {playing ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                                            {playing ? 'Pause' : 'Écouter'}
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
                                    <div
                                        onClick={() => handlePlayClick(ayah.surah, ayah.ayah)}
                                        className="cursor-pointer hover:opacity-80 transition-opacity inline-block"
                                        title="Écouter ce verset"
                                    >
                                        <TajwidText
                                            text={ayah.text}
                                            className="font-kufi leading-[2.2] text-foreground"
                                            style={{ fontSize: currentFontSize }}
                                        />
                                    </div>
                                </div>

                                {showPhonetic && ayah.phonetic && (
                                    <div className="mb-4 text-gray-600 dark:text-gray-400 text-sm italic border-l-2 pl-4 border-primary/20">
                                        {ayah.phonetic}
                                    </div>
                                )}

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

