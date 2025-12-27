'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, BookOpen, Pause, ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import { TajwidText } from '@/components/TajwidText';
import TafsirModal from '@/components/reading/TafsirModal';

interface Ayah {
    id: number;
    surahNumber: number;
    numberInSurah: number;
    text: string;
    translation: string;
    page: number;
    surahName?: string;
}

interface JuzViewerProps {
    ayahs: Ayah[];
    juzId: number;
}

export default function JuzViewer({ ayahs, juzId }: JuzViewerProps) {
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
    const [isAutoPlaying, setIsAutoPlaying] = useState(false);

    // Auto-scroll to playing verse
    useEffect(() => {
        if (playingAyah) {
            const [s, a] = playingAyah.split(':');
            const element = document.getElementById(`ayah-${a}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [playingAyah]);

    // Save last read juz
    useEffect(() => {
        localStorage.setItem('lastJuz', juzId.toString());
    }, [juzId]);

    // Handle audio playback
    useEffect(() => {
        if (!playingAyah) return;

        const [surah, ayah] = playingAyah.split(':').map(Number);
        const surahPad = surah.toString().padStart(3, '0');
        const ayahPad = ayah.toString().padStart(3, '0');
        const url = `/audio/${surahPad}${ayahPad}.mp3`;

        if (audioRef.current) {
            audioRef.current.pause();
        }

        const audio = new Audio(url);
        audioRef.current = audio;

        audio.play().catch(e => {
            console.error("Audio error", e);
            setPlayingAyah(null);
            setIsAutoPlaying(false);
        });

        audio.onended = () => {
            if (isAutoPlaying) {
                const currentIndex = ayahs.findIndex(item => item.surahNumber === surah && item.numberInSurah === ayah);
                if (currentIndex !== -1 && currentIndex < ayahs.length - 1) {
                    const next = ayahs[currentIndex + 1];
                    setPlayingAyah(`${next.surahNumber}:${next.numberInSurah}`);
                } else {
                    setPlayingAyah(null);
                    setIsAutoPlaying(false);
                }
            } else {
                setPlayingAyah(null);
            }
        };

        return () => {
            audio.pause();
        };
    }, [playingAyah, isAutoPlaying, ayahs]);

    const playAudio = (surah: number, ayah: number) => {
        const key = `${surah}:${ayah}`;
        if (playingAyah === key) {
            setPlayingAyah(null);
            setIsAutoPlaying(false);
        } else {
            setPlayingAyah(key);
            // If user manually clicks, we don't necessarily enable auto-play unless they want to?
            // Usually manual click = play single. explicit "Play All" = auto.
            // Let's keep isAutoPlaying as is (false by default) unless manually enabled via Play All button.
            // But if they are ALREADY auto-playing and click another verse, maybe they want to continue from there?
            // For now, manual click stops auto-play to be safe, unless we decide otherwise.
            setIsAutoPlaying(false);
        }
    };

    const toggleAutoPlay = () => {
        if (isAutoPlaying) {
            setIsAutoPlaying(false);
            setPlayingAyah(null);
        } else {
            setIsAutoPlaying(true);
            if (!playingAyah) {
                // Start from first ayah
                if (ayahs.length > 0) {
                    setPlayingAyah(`${ayahs[0].surahNumber}:${ayahs[0].numberInSurah}`);
                }
            }
            // If already playing, just setting isAutoPlaying to true will be picked up by the Effect?
            // No, the effect depends on `isAutoPlaying`, so it will re-run and restart the audio 
            // which handles the "continue after this one ends" logic. 
            // It might cause a slight skip but ensures the closure has the new `isAutoPlaying` value.
        }
    };

    const openTafsir = (surah: number, ayah: number, text: string, translation: string) => {
        setTafsirState({ isOpen: true, surahNumber: surah, ayahNumber: ayah, text, translation });
    };

    const [viewMode, setViewMode] = useState<'list' | 'mushaf'>('list');

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
                        <div className="flex items-center gap-1 text-xs text-emerald-600/70 dark:text-emerald-400/70">
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
                        onClick={toggleAutoPlay}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all mr-2 ${isAutoPlaying ? 'bg-amber-600 text-white shadow' : 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400'}`}
                    >
                        {isAutoPlaying ? <Pause size={16} /> : <Play size={16} />}
                        {isAutoPlaying ? 'Pause Juz' : 'Écouter Juz'}
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

            <div className="mb-6">
                <Link
                    href={`/juz/${juzId}/tafsir`}
                    className="block w-full text-center py-3 bg-white dark:bg-gray-800 border-2 border-emerald-100 dark:border-emerald-900 rounded-xl hover:border-emerald-500 hover:shadow-md transition-all text-emerald-700 dark:text-emerald-400 font-semibold"
                >
                    <BookOpen className="inline-block w-5 h-5 mr-2" />
                    Lire le Tafsir complet du Juz
                </Link>
            </div>

            {viewMode === 'mushaf' ? (
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
                                        className={`cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded transition-colors ${playingAyah === `${ayah.surahNumber}:${ayah.numberInSurah}` ? 'bg-emerald-100 dark:bg-emerald-900/40' : ''}`}
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
                        const isPlaying = playingAyah === `${ayah.surahNumber}:${ayah.numberInSurah}`;

                        return (
                            <div
                                key={`${ayah.surahNumber}:${ayah.numberInSurah}`}
                                id={`ayah-${ayah.numberInSurah}`}
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

                                <div className="text-left dir-ltr">
                                    <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
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
        </div>
    );
}
