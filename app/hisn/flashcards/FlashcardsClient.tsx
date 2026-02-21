'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shuffle, ChevronLeft, ChevronRight, Copy, Share2, Play, Pause } from 'lucide-react';
import { TajwidText } from '@/components/TajwidText';
import { cn } from '@/components/layout/Navigation';

type Hadith = {
    id: number;
    arabic: string;
    french: string;
    source: string;
    audio?: string;
};

type FlashcardItem = Hadith & {
    categoryTitle: string;
};

interface FlashcardsClientProps {
    initialPlaylist: FlashcardItem[];
}

export default function FlashcardsClient({ initialPlaylist }: FlashcardsClientProps) {
    const [playlist, setPlaylist] = useState<FlashcardItem[]>(initialPlaylist);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRandom, setIsRandom] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

    // Original ordered list to restore if random is toggled off
    const [originalPlaylist] = useState<FlashcardItem[]>(initialPlaylist);

    useEffect(() => {
        // Stop audio when changing cards or unmounting
        return () => {
            if (audioElement) {
                audioElement.pause();
                setIsPlaying(false);
            }
        };
    }, [currentIndex, audioElement]);

    const toggleAudio = (url?: string) => {
        if (!url) return;

        if (isPlaying) {
            audioElement?.pause();
            setIsPlaying(false);
        } else {
            const audio = new Audio(url);
            audio.onended = () => setIsPlaying(false);
            audio.play().catch(e => console.error("Audio play error:", e));
            setAudioElement(audio);
            setIsPlaying(true);
        }
    };

    const toggleRandom = () => {
        if (!isRandom) {
            // Shuffle
            const shuffled = [...playlist].sort(() => Math.random() - 0.5);
            setPlaylist(shuffled);
            setCurrentIndex(0);
        } else {
            // Restore order
            setPlaylist(originalPlaylist);
            setCurrentIndex(0);
        }
        setIsRandom(!isRandom);
    };

    const nextCard = () => {
        if (currentIndex < playlist.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prevCard = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const currentItem = playlist[currentIndex];

    // If there is no item, show a placeholder or empty state
    if (!currentItem) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <p className="text-muted-foreground">Aucune invocation disponible.</p>
            </div>
        );
    }

    return (
        <div className="container max-w-2xl mx-auto py-6 px-4 flex flex-col min-h-[calc(100vh-4rem)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Link href="/hisn" className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Retour</span>
                </Link>

                <button
                    onClick={toggleRandom}
                    className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
                        isRandom
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
                    )}
                >
                    <Shuffle className="w-4 h-4" />
                    {isRandom ? 'Aléatoire' : 'Ordonné'}
                </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-6">
                <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / playlist.length) * 100}%` }}
                ></div>
            </div>

            {/* Main Card */}
            <div className="flex-1 flex flex-col relative">
                <div className="flex-1 bg-card border rounded-2xl shadow-sm flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 key-[currentindex]">
                    {/* Card Header */}
                    <div className="bg-muted/30 px-4 py-3 border-b flex justify-between items-center">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider line-clamp-1 flex-1 mr-4">
                            {currentItem.categoryTitle}
                        </span>
                        <span className="text-xs bg-background px-2 py-1 rounded-md border text-muted-foreground">
                            {currentIndex + 1} / {playlist.length}
                        </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 md:p-8 flex flex-col justify-center space-y-8">
                        {/* Arabic */}
                        <div className="text-right" dir="rtl">
                            <p className="text-2xl md:text-4xl leading-relaxed md:leading-[2.5] font-arabic text-primary/90">
                                <TajwidText text={currentItem.arabic} />
                            </p>
                        </div>

                        {/* Source */}
                        {currentItem.source && (
                            <div className="text-center">
                                <p className="text-sm italic text-muted-foreground">
                                    {currentItem.source}
                                </p>
                            </div>
                        )}

                        {/* French */}
                        <div>
                            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed font-serif text-center">
                                {currentItem.french}
                            </p>
                        </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="p-4 border-t flex justify-between items-center bg-muted/10">
                        <div>
                            {currentItem.audio && (
                                <button
                                    onClick={() => toggleAudio(currentItem.audio)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border",
                                        isPlaying
                                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                            : "bg-background text-primary border-primary/20 hover:bg-primary/5"
                                    )}
                                >
                                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                    {isPlaying ? "Pause" : "Écouter"}
                                </button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground" title="Copier">
                                <Copy className="w-5 h-5" />
                            </button>
                            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground" title="Partager">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Footer */}
            <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                    onClick={prevCard}
                    disabled={currentIndex === 0}
                    className="flex items-center justify-center gap-2 py-4 rounded-xl font-medium transition-all bg-card border hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed text-muted-foreground hover:text-foreground"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Précédent
                </button>

                <button
                    onClick={nextCard}
                    disabled={currentIndex === playlist.length - 1}
                    className="flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    Suivant
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
