'use client';

import { plan40jours } from '@/data/plan40jours';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, Play, Pause, CheckCircle, BookOpen, Search } from 'lucide-react';
import { useQueries } from '@tanstack/react-query';
import { getQuranPage, QuranPageData } from '@/lib/quranApi';
import TafsirModal from '@/components/reading/TafsirModal';
import { TajwidText } from '@/components/TajwidText';
import confetti from 'canvas-confetti';

interface ReadingClientProps {
    dayId: number;
}

export default function ReadingClient({ dayId }: ReadingClientProps) {
    const dayPlan = plan40jours.find(d => d.jour === dayId);

    const [isPlaying, setIsPlaying] = useState(false);

    // Audio State handled via Refs for mutable operations
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentAudioIndex, setCurrentAudioIndex] = useState<number>(-1);
    const [audioQueue, setAudioQueue] = useState<string[]>([]);
    const [isCompleted, setIsCompleted] = useState(false);

    // Tafsir State
    const [tafsirState, setTafsirState] = useState<{
        isOpen: boolean;
        surahNumber: number;
        ayahNumber: number;
        text: string;
        translation?: string;
    }>({ isOpen: false, surahNumber: 0, ayahNumber: 0, text: '' });

    const startPage = dayPlan?.startPage || 1;
    // ... (skip unchanged lines if possible, but replace_file_content needs contiguous block. Accessing separate chunks efficiently via multi_replace might be better or just 2 edits).
    // Let's use multi_replace for unrelated chunks if possible, or sequential replace.
    // The file is small enough for 3 disjoint edits via multi_replace.

    const endPage = dayPlan?.endPage || 1;
    const pagesToFetch = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    // Progressive Loading: Queries run in parallel but can render independently
    const results = useQueries({
        queries: pagesToFetch.map(page => ({
            queryKey: ['quran-page', page],
            queryFn: () => getQuranPage(page),
            staleTime: Infinity,
        }))
    });

    const allPagesLoaded = results.every(r => r.isSuccess);

    // Build Queue once all data is available
    useEffect(() => {
        // We only build audio queue from successfully loaded pages to ensure continuity
        const urls: string[] = [];
        results.forEach(res => {
            if (res.data) {
                res.data.ayahs.forEach(ayah => {
                    const surahPad = ayah.surahNumber.toString().padStart(3, '0');
                    const ayahPad = ayah.numberInSurah.toString().padStart(3, '0');
                    // Use local audio files
                    urls.push(`/audio/${surahPad}${ayahPad}.mp3`);
                });
            }
        });
        if (urls.length !== audioQueue.length) {
            setAudioQueue(urls);
        }
    }, [results]);

    // Handle Playback Effect
    useEffect(() => {
        if (isPlaying && audioQueue.length > 0) {
            if (!audioRef.current) {
                const startIdx = currentAudioIndex === -1 ? 0 : currentAudioIndex;
                playAudioAtIndex(startIdx);
            } else {
                audioRef.current.play().catch(e => console.error(e));
            }
        } else if (!isPlaying && audioRef.current) {
            audioRef.current.pause();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlaying, audioQueue]);

    const playAudioAtIndex = (index: number, autoContinue = true) => {
        if (index >= audioQueue.length) {
            setIsPlaying(false);
            setCurrentAudioIndex(-1);
            audioRef.current = null;
            return;
        }

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }

        const audio = new Audio(audioQueue[index]);
        audioRef.current = audio;
        setCurrentAudioIndex(index);
        setIsPlaying(true); // Ensure play state is active visually

        audio.play().catch(e => console.error("Audio play error", e));
        audio.onended = () => {
            if (autoContinue) {
                playAudioAtIndex(index + 1);
            } else {
                setIsPlaying(false);
            }
        };
    };

    const togglePlay = () => {
        if (!allPagesLoaded && audioQueue.length === 0) {
            alert("Veuillez attendre le chargement de l'audio.");
            return;
        }
        setIsPlaying(!isPlaying);
    };

    const handleCompletion = async () => {
        try {
            const res = await fetch('/api/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dayId, completed: true }),
            });
            if (res.ok) {
                setIsCompleted(true);
                triggerGamification();
            }
        } catch (e) {
            console.error("Failed to mark complete", e);
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

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    if (!dayPlan) {
        return <div className="p-8 text-center">Plan non trouvé pour le jour {dayId}</div>;
    }

    const openTafsir = (surah: number, ayah: number, text: string, translation: string) => {
        setTafsirState({ isOpen: true, surahNumber: surah, ayahNumber: ayah, text, translation });
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
                    </div>
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
                                {page.ayahs.map((ayah) => (
                                    <div key={`${ayah.surahNumber}:${ayah.numberInSurah}`} className="group p-4 hover:bg-muted/5 transition-colors grid gap-4">
                                        {/* Arabic */}
                                        <div className="w-full">
                                            <p className="font-kufi text-2xl md:text-3xl leading-[2.5] text-foreground" dir="rtl">
                                                <TajwidText text={ayah.text} className="inline" />
                                                <span className="mr-2 inline-flex items-center justify-center w-8 h-8 text-xs border rounded-full font-sans text-muted-foreground align-middle">
                                                    {ayah.numberInSurah}
                                                </span>
                                            </p>
                                        </div>

                                        {/* French Translation & Actions */}
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pt-2 dir-ltr text-left">
                                            <p className="text-muted-foreground/90 text-base md:text-lg leading-relaxed font-sans flex-1">
                                                {ayah.translation}
                                            </p>

                                            <div className="self-end md:self-start flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => {
                                                        const idx = audioQueue.findIndex(u => u.includes(`${ayah.surahNumber.toString().padStart(3, '0')}${ayah.numberInSurah.toString().padStart(3, '0')}.mp3`));
                                                        if (idx !== -1) playAudioAtIndex(idx, false);
                                                        else alert("Audio non disponible");
                                                    }}
                                                    className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 border border-primary/20 hover:bg-primary/5 px-3 py-1.5 rounded-full"
                                                >
                                                    <Play className="w-3 h-3" />
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
                                ))}
                            </div>
                        </div>
                    )
                })}

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
            {/* Audio Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur border-t z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                <div className="container mx-auto p-3 md:p-4 flex items-center justify-between md:rounded-none">
                    <div className="flex items-center gap-4 w-full justify-center md:justify-start">
                        <button
                            onClick={togglePlay}
                            className={`size-12 rounded-full flex items-center justify-center transition-transform shadow-md ${!allPagesLoaded ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-primary text-primary-foreground hover:scale-105'}`}
                        >
                            {!allPagesLoaded ?
                                <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" /> :
                                (isPlaying ? <Pause className="fill-current w-5 h-5" /> : <Play className="fill-current ml-1 w-5 h-5" />)
                            }
                        </button>
                        <div className="block">
                            <p className="text-sm font-semibold">Mishary Rashid</p>
                            <p className="text-xs text-muted-foreground">
                                {allPagesLoaded ? (isPlaying ? "Lecture en cours..." : "Lecture continue") : "Chargement audio..."}
                            </p>
                        </div>
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
        </div>
    );
}
