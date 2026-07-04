'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, Copy, ChevronDown, Play, Pause, Check } from 'lucide-react';
import { TajwidText } from '@/components/TajwidText';
import { cn } from '@/lib/utils';

type HisnItem = {
    id: number;
    arabic: string;
    french: string;
    source: string;
    repeat?: number;
    audio?: string;
    categoryTitle: string;
};

// 6 gradients sombres qui tournent — accent clair pour lisibilité
const GRADIENTS = [
    { bg: 'linear-gradient(160deg, #001a2e 0%, #000c18 50%, #07090d 100%)', accent: '#5eead4' },
    { bg: 'linear-gradient(160deg, #1a0028 0%, #0c0015 50%, #09070d 100%)', accent: '#c084fc' },
    { bg: 'linear-gradient(160deg, #002018 0%, #001008 50%, #07090c 100%)', accent: '#6ee7b7' },
    { bg: 'linear-gradient(160deg, #1e1400 0%, #100900 50%, #0d0a07 100%)', accent: '#fcd34d' },
    { bg: 'linear-gradient(160deg, #001828 0%, #000e18 50%, #07090d 100%)', accent: '#7dd3fc' },
    { bg: 'linear-gradient(160deg, #1e0014 0%, #10000c 50%, #0d070b 100%)', accent: '#f9a8d4' },
];

function shuffleArray<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

interface FlashcardsClientProps {
    initialPlaylist: HisnItem[];
}

export default function FlashcardsClient({ initialPlaylist }: FlashcardsClientProps) {
    const containerRef                      = useRef<HTMLDivElement>(null);
    const audioRef                          = useRef<HTMLAudioElement | null>(null);
    const touchStartRef                     = useRef<{ x: number; y: number } | null>(null);

    const [feed, setFeed]                   = useState(initialPlaylist);
    const [currentIndex, setCurrentIndex]   = useState(0);
    const [playingIndex, setPlayingIndex]   = useState<number | null>(null);
    const [showHint, setShowHint]           = useState(true);
    const [copied, setCopied]               = useState<number | null>(null);

    // Shuffle au montage côté client
    useEffect(() => {
        setFeed(shuffleArray(initialPlaylist));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Suivi du scroll
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const onScroll = () => {
            const idx = Math.round(el.scrollTop / el.clientHeight);
            setCurrentIndex(idx);
            if (idx > 0) setShowHint(false);
        };
        el.addEventListener('scroll', onScroll, { passive: true });
        return () => el.removeEventListener('scroll', onScroll);
    }, []);

    // Stopper l'audio quand on change de carte
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setPlayingIndex(null);
    }, [currentIndex]);

    // Navigation clavier
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                const next = Math.min(feed.length - 1, currentIndex + 1);
                el.scrollTo({ top: next * el.clientHeight, behavior: 'smooth' });
            }
            if (e.key === 'ArrowUp') {
                const prev = Math.max(0, currentIndex - 1);
                el.scrollTo({ top: prev * el.clientHeight, behavior: 'smooth' });
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [currentIndex, feed.length]);

    // Nettoyage audio au démontage
    useEffect(() => {
        return () => { audioRef.current?.pause(); };
    }, []);

    const toggleAudio = useCallback((idx: number, url?: string) => {
        if (!url) return;

        if (playingIndex === idx) {
            audioRef.current?.pause();
            audioRef.current = null;
            setPlayingIndex(null);
        } else {
            audioRef.current?.pause();
            const audio = new Audio(url);
            audio.onended  = () => setPlayingIndex(null);
            audio.onerror  = () => setPlayingIndex(null);
            audio.play().catch(() => setPlayingIndex(null));
            audioRef.current = audio;
            setPlayingIndex(idx);
        }
    }, [playingIndex]);

    const handleCopy = useCallback((idx: number, item: HisnItem) => {
        const text = `${item.arabic}\n\n${item.french}\n\n${item.source}`;
        navigator.clipboard?.writeText(text).catch(() => {});
        setCopied(idx);
        setTimeout(() => setCopied(null), 1800);
    }, []);

    const handleShare = useCallback((item: HisnItem) => {
        if (typeof navigator !== 'undefined' && navigator.share) {
            navigator.share({
                title: item.categoryTitle,
                text: `${item.french}\n\n${item.source}`,
            }).catch(() => {});
        }
    }, []);

    if (!feed.length) {
        return (
            <div className="flex items-center justify-center min-h-dvh">
                <p className="text-muted-foreground">Aucune invocation disponible.</p>
            </div>
        );
    }

    return (
        <>
            {/* HUD fixe */}
            <div className="fixed top-0 left-0 right-0 md:left-64 z-[60] flex items-center justify-between px-4 pt-3 pb-2 pointer-events-none">
                <Link
                    href="/hisn"
                    className="pointer-events-auto flex items-center gap-1.5 text-white/90 hover:text-white bg-black/40 backdrop-blur-md rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Hisn
                </Link>
                <span className="text-white/50 bg-black/30 backdrop-blur-md rounded-full px-2.5 py-1 text-xs font-mono">
                    {currentIndex + 1} / {feed.length}
                </span>
            </div>

            {/* Conteneur scroll */}
            <div
                ref={containerRef}
                className="fixed top-0 left-0 right-0 bottom-16 md:left-64 md:bottom-0 overflow-y-scroll"
                style={{
                    scrollSnapType: 'y mandatory',
                    scrollbarWidth: 'none',
                    WebkitOverflowScrolling: 'touch',
                }}
            >
                {feed.map((item, index) => {
                    const { bg, accent } = GRADIENTS[index % GRADIENTS.length];
                    const isPlaying = playingIndex === index;
                    const isCopied  = copied === index;
                    const hasAudio  = !!item.audio;

                    return (
                        <div
                            key={`${item.id}-${index}`}
                            className="relative w-full flex flex-col overflow-hidden"
                            style={{ height: '100%', scrollSnapAlign: 'start', scrollSnapStop: 'always', background: bg }}
                        >
                            {/* Vignette haut */}
                            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/70 to-transparent pointer-events-none z-10" />

                            {/* Catégorie */}
                            <div className="absolute top-14 left-0 right-16 px-5 z-20">
                                <p
                                    className="text-xs font-bold uppercase tracking-wider truncate"
                                    style={{ color: accent }}
                                >
                                    {item.categoryTitle}
                                </p>
                            </div>

                            {/* Contenu central */}
                            <div className="relative z-20 flex-1 flex flex-col justify-center px-5 pt-28 pb-4 gap-6">
                                {/* Texte arabe */}
                                <div className="text-right" dir="rtl">
                                    <p
                                        className="font-kufi leading-loose text-white/95 drop-shadow"
                                        style={{ fontSize: 'clamp(1.3rem, 4.5vw, 2rem)' }}
                                    >
                                        <TajwidText text={item.arabic} />
                                    </p>
                                </div>

                                {/* Séparateur accent */}
                                <div className="flex justify-center">
                                    <div className="h-px w-12 rounded-full" style={{ background: accent }} />
                                </div>

                                {/* Traduction française */}
                                <p
                                    className="font-serif leading-relaxed text-white/80 text-center"
                                    style={{ fontSize: 'clamp(0.9rem, 2.8vw, 1.1rem)' }}
                                >
                                    {item.french}
                                </p>

                                {/* Badge répétition */}
                                {item.repeat && item.repeat > 1 && (
                                    <div className="flex justify-center">
                                        <span
                                            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border"
                                            style={{ color: accent, borderColor: `${accent}40`, background: `${accent}15` }}
                                        >
                                            🔁 × {item.repeat}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Overlay bas */}
                            <div
                                className="relative z-20 px-5 pb-6 flex flex-col gap-4"
                                style={{
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                                    paddingTop: '4rem',
                                }}
                            >
                                {/* Source */}
                                {item.source && (
                                    <p className="text-white/40 text-xs italic text-center line-clamp-2">
                                        {item.source}
                                    </p>
                                )}

                                {/* Bouton audio central */}
                                {hasAudio && (
                                    <button
                                        onClick={() => toggleAudio(index, item.audio)}
                                        className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95"
                                        style={{
                                            background: isPlaying ? `${accent}30` : accent,
                                            color: isPlaying ? accent : '#000',
                                            border: isPlaying ? `2px solid ${accent}` : 'none',
                                        }}
                                    >
                                        {isPlaying
                                            ? <><Pause className="w-5 h-5" /> En cours…</>
                                            : <><Play  className="w-5 h-5" /> Écouter</>
                                        }
                                    </button>
                                )}

                                {/* Barre de progression */}
                                <div className="h-0.5 rounded-full bg-white/10 overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-300"
                                        style={{ width: `${((index + 1) / feed.length) * 100}%`, background: accent }}
                                    />
                                </div>
                            </div>

                            {/* Sidebar droite */}
                            <div className="absolute right-4 bottom-36 z-30 flex flex-col items-center gap-5">
                                {/* Copy */}
                                <button
                                    onClick={() => handleCopy(index, item)}
                                    className="flex flex-col items-center gap-1 group"
                                    aria-label="Copier l'invocation"
                                >
                                    <div className={cn(
                                        'w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200',
                                        isCopied ? 'scale-110' : 'bg-white/10 group-hover:bg-white/20 group-hover:scale-105'
                                    )} style={isCopied ? { background: `${accent}30` } : {}}>
                                        {isCopied
                                            ? <Check className="w-5 h-5" style={{ color: accent }} />
                                            : <Copy className="w-5 h-5 text-white" />
                                        }
                                    </div>
                                    <span className="text-white/60 text-[10px] font-medium">
                                        {isCopied ? 'Copié' : 'Copier'}
                                    </span>
                                </button>

                                {/* Share */}
                                <button
                                    onClick={() => handleShare(item)}
                                    className="flex flex-col items-center gap-1 group"
                                    aria-label="Partager"
                                >
                                    <div className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center backdrop-blur-sm transition-all group-hover:scale-105">
                                        <Share2 className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-white/60 text-[10px] font-medium">Partager</span>
                                </button>
                            </div>

                            {/* Swipe hint — première carte */}
                            {index === 0 && showHint && (
                                <div className="absolute bottom-36 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 animate-bounce">
                                    <ChevronDown className="w-5 h-5 text-white/60" />
                                    <span className="text-white/50 text-xs">Swiper pour continuer</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
}
