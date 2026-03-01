'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, BookOpen, Pause, ArrowLeft, ArrowRight, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { TajwidText } from '@/components/TajwidText';
import TafsirModal from '@/components/reading/TafsirModal';
import { useQuranAudio } from '@/hooks/useQuranAudio';
import { useScrollPersistence } from '@/hooks/useScrollPersistence';
import AyahWordByWord from '@/components/reading/AyahWordByWord';
import { useSettings } from '@/context/SettingsContext';
import { getAyahAudioUrl } from '@/lib/audioUrls';

interface Ayah {
    id: number;
    surahNumber: number;
    numberInSurah: number;
    text: string;
    translation: string;
    page: number;
    surahName?: string;
}

import { useSession } from 'next-auth/react';

// ... imports

interface JuzViewerProps {
    ayahs: Ayah[];
    juzId: number;
    theme?: string;
    description?: string;
}

export default function JuzViewer({ ayahs, juzId, theme, description }: JuzViewerProps) {
    const { data: session } = useSession();
    const userEmail = session?.user?.email;

    // Annotations Tajwid pré-validées (Hafs) — chargées au montage pour toutes les sourates du Juz
    const [tajweedData, setTajweedData] = useState<Record<string, string>>({});
    useEffect(() => {
        const uniqueSurahs = Array.from(new Set(ayahs.map(a => a.surahNumber)));
        Promise.all(
            uniqueSurahs.map(surahNum =>
                fetch(`/quran/tajweed/${surahNum}.json`)
                    .then(r => r.ok ? r.json() : Promise.reject())
                    .catch(() => ({} as Record<string, string>))
            )
        ).then(results => {
            const merged = Object.assign({}, ...results) as Record<string, string>;
            setTajweedData(merged);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [wbwData, setWbwData] = useState<any[]>([]);
    const wbwLoaded = useRef(false);
    const [isWordByWordMode, setIsWordByWordMode] = useState(false);

    const [phoneticsMap, setPhoneticsMap] = useState<Map<string, string>>(new Map());
    const phoneticsLoaded = useRef(false);
    const [showPhonetic, setShowPhonetic] = useState(false);

    useEffect(() => {
        if (!isWordByWordMode || wbwLoaded.current) return;
        wbwLoaded.current = true;
        const uniqueSurahs = Array.from(new Set(ayahs.map(a => a.surahNumber)));
        Promise.all(
            uniqueSurahs.map(surahNum =>
                fetch(`/quran/word_by_word/${surahNum}.json`)
                    .then(res => res.json())
                    .then((data: any[]) => {
                        const ayahsInJuz = new Set(
                            ayahs.filter(a => a.surahNumber === surahNum).map(a => a.numberInSurah)
                        );
                        return data
                            .filter(w => ayahsInJuz.has(parseInt(w.verse_key.split(':')[1])))
                            .map(w => ({ ...w, surah: surahNum, ayah: parseInt(w.verse_key.split(':')[1]) }));
                    })
                    .catch(() => [] as any[])
            )
        ).then(results => setWbwData(results.flat()));
    }, [isWordByWordMode, ayahs]);

    useEffect(() => {
        if (!showPhonetic || phoneticsLoaded.current) return;
        phoneticsLoaded.current = true;
        fetch('/quran-transliteration.json')
            .then(res => res.json())
            .then(data => {
                const map = new Map<string, string>();
                (data.quran || []).forEach((p: any) => map.set(`${p.chapter}:${p.verse}`, p.text));
                setPhoneticsMap(map);
            })
            .catch(err => console.error('Failed to load phonetics', err));
    }, [showPhonetic]);

    const getPhonetic = (surahNumber: number, numberInSurah: number) =>
        phoneticsMap.get(`${surahNumber}:${numberInSurah}`) ?? null;

    const { reversePhonetics, setReversePhonetics } = useSettings();

    const [completed, setCompleted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingStatus, setIsLoadingStatus] = useState(false);

    // Fetch initial completion status
    useEffect(() => {
        if (userEmail) {
            setIsLoadingStatus(true);
            fetch(`/api/progress?juzId=${juzId}`) // We might need to adjust the API to allow GET or just check user profile
                .then(res => res.json())
                .then(data => {
                    if (data.completedJuzs && Array.isArray(data.completedJuzs)) {
                        setCompleted(data.completedJuzs.includes(juzId));
                    }
                })
                .catch(err => console.error("Failed to fetch progress", err))
                .finally(() => setIsLoadingStatus(false));
        }
    }, [userEmail, juzId]);


    const handleToggleComplete = async () => {
        if (!userEmail) return;

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
        url: getAyahAudioUrl(a.surahNumber, a.numberInSurah),
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

            // Adjust scroll position for fixed header on mobile
            if (element) {
                const y = element.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({ top: y, behavior: 'smooth' });
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

    return (
        <div className="pb-24">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-card border rounded-xl p-4 shadow-sm gap-4">
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

                <div className="flex flex-wrap justify-center sm:justify-end gap-2 bg-background rounded-md p-1 sm:shadow-sm w-full sm:w-auto mt-2 sm:mt-0">
                    <button
                        onClick={() => setShowPhonetic(!showPhonetic)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all border ${showPhonetic ? 'bg-accent/10 text-accent border-accent/20' : 'bg-background text-muted-foreground border-transparent hover:text-foreground'}`}
                    >
                        Phonétique
                    </button>

                    <button
                        onClick={toggleRepeat}
                        className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-all border ${repeatMode !== 'off' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-background text-muted-foreground border-transparent'}`}
                        title="Mode Loop"
                    >
                        {repeatMode === 'single' ? '1x' : (repeatMode === 'all' ? 'Tout' : 'Loop')}
                    </button>

                    <button
                        onClick={toggleAutoPlay}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${isPlaying ? 'bg-amber-600 text-white shadow' : 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400'}`}
                    >
                        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                        <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Tout Écouter'}</span>
                    </button>

                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-emerald-600 text-white shadow' : 'text-gray-600 hover:text-gray-900 dark:text-gray-400'}`}
                    >
                        Liste
                    </button>
                    <button
                        onClick={() => setViewMode('mushaf')}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'mushaf' ? 'bg-emerald-600 text-white shadow' : 'text-gray-600 hover:text-gray-900 dark:text-gray-400'}`}
                    >
                        Mushaf
                    </button>

                    {viewMode === 'list' && (
                        <>
                            <button
                                onClick={() => setIsWordByWordMode(!isWordByWordMode)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all border ${isWordByWordMode ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent text-primary border-primary/20 hover:bg-primary/5'}`}
                                title={isWordByWordMode ? "Désactiver le mode mot par mot" : "Activer le mode mot par mot"}
                            >
                                <span className="hidden sm:inline">{isWordByWordMode ? "Vue Normale" : "Mot par Mot"}</span>
                                {!isWordByWordMode && <span className="sm:hidden">Mots</span>}
                            </button>

                            {isWordByWordMode && (
                                <button
                                    onClick={() => setReversePhonetics(!reversePhonetics)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all border ${reversePhonetics ? 'bg-accent text-accent-foreground border-accent' : 'bg-transparent text-accent border-accent/20 hover:bg-accent/10'}`}
                                    title="Inverser les lettres de la phonétique"
                                >
                                    <span className="hidden sm:inline">Phonétique RTL</span>
                                    <span className="sm:hidden">RTL</span>
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {description && (
                <div className="mb-6 p-4 bg-card border rounded-xl shadow-sm text-center">
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed max-w-3xl mx-auto italic">
                        &quot;{description}&quot;
                    </p>
                </div>
            )}

            <div className="mb-6">
                <Link
                    href={`/juz/${juzId}/tafsir`}
                    className="block w-full text-center py-3 bg-card border rounded-xl hover:border-primary hover:shadow-md transition-all text-primary font-semibold"
                >
                    <BookOpen className="inline-block w-5 h-5 mr-2" />
                    Lire le Tafsir complet du Juz
                </Link>
            </div>




            {
                viewMode === 'mushaf' ? (
                    <div className="bg-card border rounded-xl p-6 md:p-10 shadow-sm">
                        <div className="text-justify font-quran text-2xl md:text-3xl leading-[2.8] dir-rtl" dir="rtl">
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
                                            <TajwidText text={ayah.text} tajweedText={tajweedData[`${ayah.surahNumber}:${ayah.numberInSurah}`]} className="inline" />
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

                            const wbwAyah = wbwData ? wbwData.find(w => w.surah === ayah.surahNumber && w.ayah === ayah.numberInSurah) : null;

                            if (isWordByWordMode && wbwAyah && wbwAyah.words && wbwAyah.words.length > 0) {
                                return (
                                    <AyahWordByWord
                                        key={`${ayah.surahNumber}:${ayah.numberInSurah}`}
                                        surah={ayah.surahNumber}
                                        ayah={ayah.numberInSurah}
                                        words={wbwAyah.words}
                                        translation={ayah.translation}
                                        isPlaying={isPlaying}
                                        onPlayClick={() => playAudio(ayah.surahNumber, ayah.numberInSurah)}
                                        onTafsirClick={() => openTafsir(ayah.surahNumber, ayah.numberInSurah, ayah.text, ayah.translation)}
                                        audioRef={audioRef}
                                        showPhonetic={showPhonetic}
                                        reversePhonetics={reversePhonetics}
                                    />
                                );
                            }

                            return (
                                <div
                                    key={`${ayah.surahNumber}:${ayah.numberInSurah}`}
                                    id={`ayah-${ayah.surahNumber}-${ayah.numberInSurah}`}
                                    className={`scroll-mt-24 bg-card border rounded-xl p-4 md:p-6 transition-all hover:shadow-md ${isPlaying ? 'ring-2 ring-primary shadow-lg scale-[1.01]' : ''}`}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 border-b pb-4 border-gray-100 dark:border-gray-700">
                                        <span className="text-xs font-mono text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded w-fit">
                                            Sourate {ayah.surahNumber} : Verset {ayah.numberInSurah}
                                        </span>
                                        <div className="flex gap-2 self-end sm:self-auto">
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
                                        <div className="w-full bg-primary/5 dark:bg-primary/10 rounded-2xl p-4 md:p-8 border border-primary/10">
                                            <TajwidText
                                                text={ayah.text}
                                                tajweedText={tajweedData[`${ayah.surahNumber}:${ayah.numberInSurah}`]}
                                                className="font-quran text-2xl md:text-3xl leading-[2.2] text-foreground"
                                            />
                                        </div>
                                    </div>

                                    {showPhonetic && getPhonetic(ayah.surahNumber, ayah.numberInSurah) && (
                                        <div className="mb-4 text-gray-600 dark:text-gray-400 text-sm italic border-l-2 pl-4 border-primary/20 text-right md:text-left dir-ltr">
                                            {getPhonetic(ayah.surahNumber, ayah.numberInSurah)}
                                        </div>
                                    )}

                                    <div className="text-left dir-ltr">
                                        <p className="text-foreground/90 text-[15px] md:text-lg leading-relaxed">
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
                            : 'bg-card text-muted-foreground border hover:border-primary hover:text-primary'
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
            <audio ref={audioRef} className="hidden" preload="none" playsInline />
        </div>
    );
}
