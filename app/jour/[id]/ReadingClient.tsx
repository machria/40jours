'use client';

import { plan40jours } from '@/data/plan40jours';
import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, Play, Pause, CheckCircle, BookOpen, Search, Repeat, Repeat1 } from 'lucide-react';
import { useQueries } from '@tanstack/react-query';
import { useSession, signIn } from 'next-auth/react';
import { getQuranPage, QuranPageData } from '@/lib/quranApi';
import TafsirModal from '@/components/reading/TafsirModal';
import { TajwidText } from '@/components/TajwidText';
import confetti from 'canvas-confetti';
import { useQuranAudio } from '@/hooks/useQuranAudio';
import { useScrollPersistence } from '@/hooks/useScrollPersistence';
import AyahWordByWord from '@/components/reading/AyahWordByWord';

interface ReadingClientProps {
    dayId: number;
}

export default function ReadingClient({ dayId }: ReadingClientProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const dayPlan = plan40jours.find(d => d.jour === dayId);

    // Tafsir State
    const [tafsirState, setTafsirState] = useState<{
        isOpen: boolean;
        surahNumber: number;
        ayahNumber: number;
        text: string;
        translation?: string;
    }>({ isOpen: false, surahNumber: 0, ayahNumber: 0, text: '' });

    // Phonetics State
    const [phoneticsData, setPhoneticsData] = useState<any[]>([]);
    const [showPhonetic, setShowPhonetic] = useState(false);

    useEffect(() => {
        // Load phonetics data once
        fetch('/quran-transliteration.json')
            .then(res => res.json())
            .then(data => setPhoneticsData(data.quran))
            .catch(err => console.error("Error loading phonetics", err));
    }, []);

    const getPhonetic = (surah: number, ayah: number) => {
        if (!phoneticsData.length) return null;
        return phoneticsData.find(p => p.chapter === surah && p.verse === ayah)?.text;
    };

    const startPage = dayPlan?.startPage || 1;
    const endPage = dayPlan?.endPage || 1;
    const pagesToFetch = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    // Progressive Loading
    const results = useQueries({
        queries: pagesToFetch.map(page => ({
            queryKey: ['quran-page', page],
            queryFn: () => getQuranPage(page),
            staleTime: Infinity,
            keepPreviousData: true
        }))
    });

    const allPagesLoaded = results.every(r => r.isSuccess);

    // Build Playlist
    const playlist = useMemo(() => {
        const list: any[] = [];
        results.forEach(res => {
            if (res.data) {
                res.data.ayahs.forEach(ayah => {
                    list.push({
                        surah: ayah.surahNumber,
                        ayah: ayah.numberInSurah,
                        url: `/audio/${ayah.surahNumber.toString().padStart(3, '0')}${ayah.numberInSurah.toString().padStart(3, '0')}.mp3`,
                        metadata: {
                            surahName: `Sourate ${ayah.surahNumber}`,
                            text: ayah.text
                        }
                    });
                });
            }
        });
        return list;
    }, [results]); // Dependency on results array structure

    // Fetch WBW
    const [wbwData, setWbwData] = useState<any[]>([]);
    const [isWordByWordMode, setIsWordByWordMode] = useState(false);

    useEffect(() => {
        if (!allPagesLoaded) return;

        const uniqueSurahs = Array.from(new Set(playlist.map(item => item.surah)));
        if (uniqueSurahs.length > 0) {
            const params = new URLSearchParams();
            uniqueSurahs.forEach(s => params.append('surah', s.toString()));

            fetch(`/api/wbw?${params.toString()}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data) && data.length > 0) {
                        setWbwData(data);
                    }
                })
                .catch(err => console.error("Failed to load WbW data", err));
        }
    }, [allPagesLoaded, playlist]);

    const hasWbw = wbwData.length > 0;

    // Audio Hook
    const {
        isPlaying,
        currentAyah,
        play,
        pause,
        togglePlay,
        toggleRepeat,
        repeatMode
    } = useQuranAudio({
        playlist,
        audioRef,
        onAyahChange: (ayah) => {
            const element = document.getElementById(`ayah-${ayah.surah}-${ayah.ayah}`);
            if (element) {
                const y = element.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }
    });

    // Scroll Persistence
    useScrollPersistence({
        storageKey: `day_scroll_${dayId}`,
        selector: '[id^="ayah-"]',
        enabled: allPagesLoaded // Only start tracking/restoring when full layout is ready to avoid jumping
    });

    const [isCompleted, setIsCompleted] = useState(false);
    const { data: session } = useSession();

    const handleCompletion = async () => {
        if (!session) {
            signIn();
            return;
        }

        try {
            const res = await fetch('/api/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dayId, completed: true }),
            });
            if (res.ok) {
                setIsCompleted(true);
                triggerGamification();
            } else {
                alert("Erreur lors de la sauvegarde. Veuillez réessayer.");
            }
        } catch (e) {
            console.error("Failed to mark complete", e);
            alert("Erreur de connexion.");
        }
    };

    const triggerGamification = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10B981', '#F59E0B', '#34D399']
        });

        const successSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3');
        successSound.volume = 0.5;
        successSound.play().catch(() => { });
    };

    if (!dayPlan) {
        return <div className="p-8 text-center">Plan non trouvé pour le jour {dayId}</div>;
    }

    const openTafsir = (surah: number, ayah: number, text: string, translation: string) => {
        setTafsirState({ isOpen: true, surahNumber: surah, ayahNumber: ayah, text, translation });
    };

    const isAyahPlaying = (surah: number, ayah: number) => {
        return currentAyah?.surah === surah && currentAyah?.ayah === ayah;
    };

    const handlePlayAyah = (surah: number, ayah: number) => {
        if (isAyahPlaying(surah, ayah) && isPlaying) {
            pause();
        } else {
            play({ surah, ayah, url: '' }); // Hook finds the URL from playlist
        }
    };

    const SkeletonPage = ({ idx }: { idx: number }) => (
        <div key={`skel-${idx}`} className="bg-card border rounded-xl shadow-sm overflow-hidden mb-8 h-[500px] animate-pulse relative">
            <div className="absolute inset-x-0 top-0 h-10 bg-muted/40 border-b flex items-center justify-center">
                <span className="w-20 h-3 bg-muted/50 rounded"></span>
            </div>
            <div className="p-8 space-y-8 mt-12 opacity-50">
                <div className="h-4 bg-muted/40 w-full ml-auto rounded" />
                <div className="h-4 bg-muted/40 w-5/6 ml-auto rounded" />
                <div className="h-4 bg-muted/40 w-4/6 ml-auto rounded" />
                <div className="h-4 bg-muted/40 w-full ml-auto rounded" />
                <div className="h-4 bg-muted/40 w-3/4 ml-auto rounded" />
                <div className="h-4 bg-muted/40 w-5/6 ml-auto rounded" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-background/80 p-3 rounded-full shadow-sm backdrop-blur">
                    <p className="text-muted-foreground text-xs font-semibold animate-bounce">Chargement Page {idx + 1}...</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Sticky Header */}
            <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <Link href="/" className="p-2 hover:bg-muted rounded-full">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <Link href="/search" className="p-2 hover:bg-muted rounded-full" title="Recherche">
                        <Search className="w-5 h-5 text-muted-foreground" />
                    </Link>
                </div>
                <div className="text-center">
                    <h1 className="text-lg font-bold font-kufi text-primary">Jour {dayId}</h1>
                    <div className="flex items-center gap-2 justify-center">
                        <p className="text-xs text-muted-foreground">{dayPlan.sourates}</p>
                        <span className="text-muted-foreground">•</span>
                        <Link href={`/jour/${dayId}/tafsir`} className="text-xs text-accent hover:underline font-semibold flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            Tafsir Complet
                        </Link>
                        <span className="text-muted-foreground">•</span>
                        <button
                            onClick={() => setShowPhonetic(!showPhonetic)}
                            className={`text-xs font-semibold px-2 py-0.5 rounded border transition-colors ${showPhonetic ? 'bg-primary/10 text-primary border-primary/20' : 'text-muted-foreground border-border hover:text-foreground'}`}
                        >
                            Phonétique
                        </button>
                    </div>

                    {hasWbw && (
                        <div className="mt-2 flex justify-center">
                            <button
                                onClick={() => setIsWordByWordMode(!isWordByWordMode)}
                                className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${isWordByWordMode ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent text-primary border-primary/20 hover:bg-primary/5'}`}
                            >
                                {isWordByWordMode ? "Vue Normale" : "Mot par Mot"}
                            </button>
                        </div>
                    )}
                </div>
                <button
                    className={`p-2 rounded-full transition-colors ${isCompleted ? 'text-green-600 bg-green-100' : 'text-primary hover:bg-primary/10'}`}
                    onClick={handleCompletion}
                    disabled={isCompleted}
                >
                    <CheckCircle className={`w-6 h-6 ${isCompleted ? 'fill-current' : ''}`} />
                </button>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto p-4 space-y-8">
                {/* Description Block */}
                <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-xl p-6 text-center shadow-sm">
                    <h2 className="text-xl font-bold text-emerald-800 dark:text-emerald-300 mb-2 font-kufi">
                        {dayPlan.theme}
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed italic max-w-2xl mx-auto">
                        &quot;{dayPlan.description}&quot;
                    </p>
                </div>

                {results.map((result, idx) => {
                    const pageNum = pagesToFetch[idx];

                    if (result.isLoading) return <SkeletonPage key={pageNum} idx={idx} />;
                    if (result.error) return (
                        <div key={pageNum} className="p-8 text-center text-red-500 bg-red-50 rounded-xl border border-red-100 flex flex-col items-center gap-2">
                            <p>Erreur lors du chargement de la page.</p>
                            <button onClick={() => result.refetch()} className="text-xs px-3 py-1 bg-red-100 rounded-full hover:bg-red-200">Réessayer</button>
                        </div>
                    );
                    const page = result.data as QuranPageData;
                    if (!page) return null;

                    return (
                        <div key={pageNum} className="bg-card border rounded-none md:rounded-xl shadow-sm overflow-hidden mb-8">
                            <div className="bg-muted/30 px-4 py-2 text-center border-b text-xs text-muted-foreground font-mono">
                                Page {page.pageNumber}
                            </div>

                            <div className="divide-y text-right">
                                {page.ayahs.map((ayah) => {
                                    const isPlaying = isAyahPlaying(ayah.surahNumber, ayah.numberInSurah);

                                    const wbwAyah = wbwData.find(w => w.surah === ayah.surahNumber && w.ayah === ayah.numberInSurah);

                                    if (isWordByWordMode && wbwAyah && wbwAyah.words && wbwAyah.words.length > 0) {
                                        return (
                                            <div key={`${ayah.surahNumber}:${ayah.numberInSurah}`} className="p-4">
                                                <AyahWordByWord
                                                    surah={ayah.surahNumber}
                                                    ayah={ayah.numberInSurah}
                                                    words={wbwAyah.words}
                                                    translation={ayah.translation || ''}
                                                    isPlaying={isPlaying}
                                                    onPlayClick={() => handlePlayAyah(ayah.surahNumber, ayah.numberInSurah)}
                                                    onTafsirClick={() => openTafsir(ayah.surahNumber, ayah.numberInSurah, ayah.text, ayah.translation!)}
                                                    audioRef={audioRef}
                                                    showPhonetic={showPhonetic}
                                                />
                                            </div>
                                        );
                                    }

                                    return (
                                        <div
                                            key={`${ayah.surahNumber}:${ayah.numberInSurah}`}
                                            id={`ayah-${ayah.surahNumber}-${ayah.numberInSurah}`}
                                            className={`group p-4 transition-all duration-300 grid gap-4 ${isPlaying
                                                ? 'bg-primary/5 ring-1 ring-primary/20 shadow-sm z-10'
                                                : 'hover:bg-muted/5'
                                                }`}
                                        >
                                            {/* Arabic */}
                                            <div className="w-full">
                                                <p className="font-kufi text-2xl md:text-3xl leading-[2.5] text-foreground" dir="rtl">
                                                    <TajwidText text={ayah.text} className="inline" />
                                                    <span className="mr-2 inline-flex items-center justify-center w-8 h-8 text-xs border rounded-full font-sans text-muted-foreground align-middle">
                                                        {ayah.numberInSurah}
                                                    </span>
                                                </p>
                                            </div>

                                            {/* Phonetic */}
                                            {showPhonetic && (
                                                <div className="w-full text-gray-600 dark:text-gray-400 text-sm italic border-l-2 pl-4 border-primary/20 text-left dir-ltr">
                                                    {getPhonetic(ayah.surahNumber, ayah.numberInSurah)}
                                                </div>
                                            )}

                                            {/* French Translation & Actions */}
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pt-2 dir-ltr text-left">
                                                <p className="text-muted-foreground/90 text-base md:text-lg leading-relaxed font-sans flex-1">
                                                    {ayah.translation}
                                                </p>

                                                <div className="self-end md:self-start flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handlePlayAyah(ayah.surahNumber, ayah.numberInSurah)}
                                                        className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${isPlaying
                                                            ? 'text-primary bg-primary/10'
                                                            : 'text-primary hover:text-primary/80 border border-primary/20 hover:bg-primary/5'
                                                            }`}
                                                    >
                                                        {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                                                        Écouter
                                                    </button>

                                                    <button
                                                        onClick={() => openTafsir(ayah.surahNumber, ayah.numberInSurah, ayah.text, ayah.translation!)}
                                                        className="flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent/80 border border-accent/20 hover:bg-accent/5 px-3 py-1.5 rounded-full"
                                                    >
                                                        <BookOpen className="w-3 h-3" />
                                                        Tafsir
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}

                {/* Surah Links Section */}
                {allPagesLoaded && (
                    <div className="bg-card/50 border rounded-2xl p-6 mb-8 space-y-4">
                        <h3 className="font-bold flex items-center gap-2 text-primary">
                            <BookOpen className="w-5 h-5" />
                            Lire la sourate complète
                        </h3>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {Array.from(new Set(results.flatMap(r => r.data?.ayahs.map(a => JSON.stringify({ number: a.surahNumber, name: a.surah.englishName })) || [])))
                                .map(s => JSON.parse(s) as { number: number, name: string })
                                .sort((a, b) => a.number - b.number)
                                .map(surah => (
                                    <Link
                                        key={surah.number}
                                        href={`/coran/${surah.number}`}
                                        className="flex items-center justify-between p-4 bg-background border rounded-xl hover:bg-accent/5 hover:border-accent/20 transition-all group"
                                    >
                                        <span className="font-medium text-sm">Sourate {surah.name}</span>
                                        <span className="text-xs text-muted-foreground group-hover:text-accent flex items-center gap-1">
                                            Lire <ChevronLeft className="w-4 h-4 rotate-180" />
                                        </span>
                                    </Link>
                                ))}
                        </div>
                    </div>
                )}

                {/* Validation Button (Bottom) */}
                {allPagesLoaded && (
                    <div className="flex justify-center my-8">
                        <button
                            onClick={handleCompletion}
                            disabled={isCompleted}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all shadow-md transform hover:scale-105 ${isCompleted
                                ? 'bg-green-100 text-green-700 border-2 border-green-200 hover:bg-green-200'
                                : 'bg-white text-gray-500 border-2 border-gray-200 hover:border-emerald-500 hover:text-emerald-600'
                                }`}
                        >
                            {isCompleted ? (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    Jour Validé
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5 opacity-50" />
                                    Marquer comme Terminé
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* End of Day Navigation */}
                {allPagesLoaded && (
                    <div className="flex justify-center py-8">
                        {dayId < 40 ? (
                            <Link href={`/jour/${dayId + 1}`} className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold shadow-lg hover:bg-primary/90 transition-transform active:scale-95">
                                Passer au Jour {dayId + 1}
                            </Link>
                        ) : (
                            <div className="text-center space-y-2">
                                <h2 className="text-2xl font-bold text-accent">Al-Hamdulillah !</h2>
                                <p>Vous avez terminé le défi.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Audio Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur border-t z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                <div className="container mx-auto p-3 md:p-4 flex items-center justify-between md:rounded-none">
                    <div className="flex items-center gap-4 w-full justify-center md:justify-start">
                        <button
                            onClick={togglePlay}
                            className={`size-12 rounded-full flex items-center justify-center transition-transform shadow-md ${!allPagesLoaded && playlist.length === 0 ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-primary text-primary-foreground hover:scale-105'}`}
                        >
                            {(!allPagesLoaded && playlist.length === 0) ?
                                <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" /> :
                                (isPlaying ? <Pause className="fill-current w-5 h-5" /> : <Play className="fill-current ml-1 w-5 h-5" />)
                            }
                        </button>

                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">
                                {currentAyah ? `Sourate ${currentAyah.surah} : Verset ${currentAyah.ayah}` : 'Mishary Rashid'}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                {isPlaying ? "Lecture en cours..." : "Lecture audio"}
                            </p>
                        </div>

                        <button
                            onClick={toggleRepeat}
                            className={`p-2 rounded-full transition-all ${repeatMode !== 'off' ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:bg-muted'}`}
                            title="Répéter (Verset / Tout / Off)"
                        >
                            {repeatMode === 'single' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

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
