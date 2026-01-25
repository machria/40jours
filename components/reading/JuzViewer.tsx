'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, BookOpen, Pause, ArrowLeft, ArrowRight, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { TajwidText } from '@/components/TajwidText';
import TafsirModal from '@/components/reading/TafsirModal';
import { useQuranAudio } from '@/hooks/useQuranAudio';
import { useScrollPersistence } from '@/hooks/useScrollPersistence';

interface Ayah {
    id: number;
    surahNumber: number;
    numberInSurah: number;
    text: string;
    translation: string;
    page: number;
    surahName?: string;
    phonetic?: string;
}

interface JuzViewerProps {
    ayahs: Ayah[];
    juzId: number;
    theme?: string;
    description?: string;
    isCompleted?: boolean;
    userEmail?: string | null;
}

export default function JuzViewer({ ayahs, juzId, theme, description, isCompleted = false, userEmail }: JuzViewerProps) {
    const [completed, setCompleted] = useState(isCompleted);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleToggleComplete = async () => {
        if (!userEmail) return; // Should show login prompt strictly speaking, but keeping simple for now

        setIsSubmitting(true);
        // Optimistic update
        const newState = !completed;
        setCompleted(newState);

        try {
            await fetch('/api/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ juzId, completed: newState }),
            });
        } catch (error) {
            console.error('Failed to update juz progress', error);
            setCompleted(!newState); // Revert
        } finally {
            setIsSubmitting(false);
        }
    };

    // Tafsir State
    const [tafsirState, setTafsirState] = useState<{
        isOpen: boolean;
        surahNumber: number;
        ayahNumber: number;
        text: string;
        translation?: string;
    }>({ isOpen: false, surahNumber: 0, ayahNumber: 0, text: '' });

    // Audio State - Unified via Hook
    // Prepare playlist
    // We create a stable playlist from the ayahs prop
    // Note: ayahs prop changes when juzId changes, which is what we want.
    const playlist = ayahs.map(a => ({
        surah: a.surahNumber,
        ayah: a.numberInSurah,
        url: `/audio/${a.surahNumber.toString().padStart(3, '0')}${a.numberInSurah.toString().padStart(3, '0')}.mp3`,
        metadata: { surahName: `Sourate ${a.surahNumber}`, text: a.text }
    }));

    const audioRef = useRef<HTMLAudioElement | null>(null);

    const {
        isPlaying,
        currentAyah,
        play,
        pause,
        togglePlay,
        repeatMode,
        toggleRepeat
    } = useQuranAudio({
        playlist,
        onAyahChange: (ayah) => {
            // Auto-scroll
            const element = document.getElementById(`ayah-${ayah.surah}-${ayah.ayah}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        },
        audioRef
    });


    // Scroll Persistence
    useScrollPersistence({
        storageKey: `juz_scroll_${juzId}`,
        selector: '[id^="ayah-"]',
        enabled: true
    });

    const isPlayingSequence = isPlaying && !!currentAyah; // Simplification

    // Helper to check if specific ayah is playing
    const isAyahPlaying = (surah: number, ayah: number) => {
        return currentAyah?.surah === surah && currentAyah?.ayah === ayah;
    };

    const playAudio = (surah: number, ayah: number) => {
        if (isAyahPlaying(surah, ayah) && isPlaying) {
            pause();
        } else {
            play({ surah, ayah, url: '' });
        }
    };

    const toggleAutoPlay = () => {
        if (isPlaying) {
            pause();
        } else {
            // Resume or Start from beginning
            togglePlay();
        }
    };

    // Save last read juz
    useEffect(() => {
        localStorage.setItem('lastJuz', juzId.toString());
    }, [juzId]);


    const openTafsir = (surah: number, ayah: number, text: string, translation: string) => {
        setTafsirState({ isOpen: true, surahNumber: surah, ayahNumber: ayah, text, translation });
    };

    const [viewMode, setViewMode] = useState<'list' | 'mushaf'>('list');
    const [showPhonetic, setShowPhonetic] = useState(false);

    return (
        <div className="pb-24">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl gap-4 border border-emerald-100 dark:border-emerald-800">
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                    {juzId > 1 ? (
                        <Link href={`/juz/${juzId - 1}`} className="flex items-center gap-1 text-sm text-emerald-700 dark:text-emerald-400 hover:underline">
                            <ArrowLeft size={16} /> Juz {juzId - 1}
                        </Link>
                    ) : <div />}

                    <div className="flex flex-col items-center">
                        <h1 className="text-xl font-bold text-center text-emerald-800 dark:text-emerald-300">Juz {juzId}</h1>
                        {theme && (
                            <h2 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mt-1">{theme}</h2>
                        )}
                        <div className="flex items-center gap-1 text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-1">
                            <Clock size={12} />
                            <span>~45-55 min</span>
                        </div>
                    </div>

                    {juzId < 30 ? (
                        <Link href={`/juz/${juzId + 1}`} className="flex items-center gap-1 text-sm text-emerald-700 dark:text-emerald-400 hover:underline">
                            Juz {juzId + 1} <ArrowRight size={16} />
                        </Link>
                    ) : <div />}
                </div>

                <div className="flex bg-background rounded-md p-1 shadow-sm w-full sm:w-auto">
                    <button
                        onClick={() => setShowPhonetic(!showPhonetic)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all mr-2 border ${showPhonetic ? 'bg-accent/10 text-accent border-accent/20' : 'bg-background text-muted-foreground border-transparent hover:text-foreground'}`}
                    >
                        Phonétique
                    </button>

                    <button
                        onClick={toggleRepeat}
                        className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-all mr-2 border ${repeatMode !== 'off' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-background text-muted-foreground border-transparent'}`}
                        title="Mode Loop"
                    >
                        {repeatMode === 'single' ? '1x' : (repeatMode === 'all' ? 'Tout' : 'Loop')}
                    </button>

                    <button
                        onClick={toggleAutoPlay}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all mr-2 ${isPlaying ? 'bg-amber-600 text-white shadow' : 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400'}`}
                    >
                        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                        {isPlaying ? 'Pause' : 'Tout Écouter'}
                    </button>

                    <button
                        onClick={() => setViewMode('list')}
                        className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-emerald-600 text-white shadow' : 'text-gray-600 hover:text-gray-900 dark:text-gray-400'}`}
                    >
                        Liste
                    </button>
                    <button
                        onClick={() => setViewMode('mushaf')}
                        className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'mushaf' ? 'bg-emerald-600 text-white shadow' : 'text-gray-600 hover:text-gray-900 dark:text-gray-400'}`}
                    >
                        Mushaf
                    </button>
                </div>
            </div>

            {description && (
                <div className="mb-6 p-4 bg-white dark:bg-gray-800 border border-emerald-100 dark:border-emerald-900 rounded-xl shadow-sm text-center">
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed max-w-3xl mx-auto italic">
                        &quot;{description}&quot;
                    </p>
                </div>
            )}

            <div className="mb-6">
                <Link
                    href={`/juz/${juzId}/tafsir`}
                    className="block w-full text-center py-3 bg-white dark:bg-gray-800 border-2 border-emerald-100 dark:border-emerald-900 rounded-xl hover:border-emerald-500 hover:shadow-md transition-all text-emerald-700 dark:text-emerald-400 font-semibold"
                >
                    <BookOpen className="inline-block w-5 h-5 mr-2" />
                    Lire le Tafsir complet du Juz
                </Link>
            </div>




            {
                viewMode === 'mushaf' ? (
                    <div className="bg-white dark:bg-gray-900 border rounded-xl p-6 md:p-10 shadow-sm">
                        <div className="text-justify font-kufi text-2xl md:text-3xl leading-[2.8] dir-rtl" dir="rtl">
                            {ayahs.map((ayah, i) => {
                                // Check if this ayah starts a new Surah (simple heuristic: if surah num changed from prev)
                                const prev = i > 0 ? ayahs[i - 1] : null;
                                const isNewSurah = prev && prev.surahNumber !== ayah.surahNumber;

                                return (
                                    <span key={`${ayah.surahNumber}:${ayah.numberInSurah}`}>
                                        {isNewSurah && (
                                            <div className="w-full my-8 text-center text-emerald-600 dark:text-emerald-400 font-sans text-lg border-y border-emerald-100 dark:border-emerald-800 py-2">
                                                Sourate {ayah.surahNumber}
                                            </div>
                                        )}
                                        <span
                                            className={`cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded transition-colors ${isAyahPlaying(ayah.surahNumber, ayah.numberInSurah) ? 'bg-emerald-100 dark:bg-emerald-900/40' : ''}`}
                                            onClick={() => {
                                                playAudio(ayah.surahNumber, ayah.numberInSurah);
                                            }}
                                        >
                                            <TajwidText text={ayah.text} className="inline" />
                                            <span className="inline-flex items-center justify-center w-8 h-8 text-xs border rounded-full font-sans text-gray-400 align-middle mx-1 bg-gray-50 dark:bg-gray-800 select-none">
                                                {ayah.numberInSurah}
                                            </span>
                                        </span>
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {ayahs.map((ayah) => {
                            const isPlaying = isAyahPlaying(ayah.surahNumber, ayah.numberInSurah);

                            return (
                                <div
                                    key={`${ayah.surahNumber}:${ayah.numberInSurah}`}
                                    id={`ayah-${ayah.surahNumber}-${ayah.numberInSurah}`}
                                    className={`scroll-mt-24 bg-white dark:bg-gray-800 border rounded-xl p-6 transition-all hover:shadow-md ${isPlaying ? 'ring-2 ring-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-900/10' : ''}`}
                                >
                                    <div className="flex items-center justify-between mb-4 border-b pb-4 border-gray-100 dark:border-gray-700">
                                        <span className="text-xs font-mono text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                            Sourate {ayah.surahNumber} : Verset {ayah.numberInSurah}
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => playAudio(ayah.surahNumber, ayah.numberInSurah)}
                                                className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${isPlaying
                                                    ? 'text-emerald-600 bg-emerald-100'
                                                    : 'text-emerald-600 hover:text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
                                                    }`}
                                            >
                                                {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                                                {isPlaying ? 'Pause' : 'Écouter'}
                                            </button>

                                            <button
                                                onClick={() => openTafsir(ayah.surahNumber, ayah.numberInSurah, ayah.text, ayah.translation)}
                                                className="flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700 border border-amber-200 hover:bg-amber-50 px-3 py-1.5 rounded-full"
                                            >
                                                <BookOpen className="w-3 h-3" />
                                                Tafsir
                                            </button>
                                        </div>
                                    </div>

                                    <div className="text-right mb-6" dir="rtl">
                                        <TajwidText
                                            text={ayah.text}
                                            className="font-kufi text-2xl md:text-3xl leading-[2.2] text-gray-900 dark:text-gray-100"
                                        />
                                    </div>

                                    {showPhonetic && ayah.phonetic && (
                                        <div className="mb-4 text-gray-600 dark:text-gray-400 text-sm italic border-l-2 pl-4 border-primary/20 text-right md:text-left dir-ltr">
                                            {ayah.phonetic}
                                        </div>
                                    )}

                                    <div className="text-left dir-ltr">
                                        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                                            {ayah.translation}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )
            }

            {userEmail && (
                <div className="my-8 flex justify-center">
                    <button
                        onClick={handleToggleComplete}
                        disabled={isSubmitting}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all shadow-md transform hover:scale-105 ${completed
                            ? 'bg-green-100 text-green-700 border-2 border-green-200 hover:bg-green-200'
                            : 'bg-white text-gray-500 border-2 border-gray-200 hover:border-emerald-500 hover:text-emerald-600'
                            }`}
                    >
                        {completed ? (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                Juz Validé
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5 opacity-50" />
                                Marquer comme Lu
                            </>
                        )}
                    </button>
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
            <audio ref={audioRef} className="hidden" />
        </div>
    );
}
