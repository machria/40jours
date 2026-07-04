'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, Copy, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AllahName } from '@/data/names';

// 9 gradients radiaux — effet "lumière divine" au centre
const GRADIENTS = [
    { bg: 'radial-gradient(ellipse at 50% 38%, #001a3d 0%, #000820 60%, #07090d 100%)', accent: '#93c5fd' },
    { bg: 'radial-gradient(ellipse at 50% 38%, #001a10 0%, #000a08 60%, #07090d 100%)', accent: '#6ee7b7' },
    { bg: 'radial-gradient(ellipse at 50% 38%, #1a0028 0%, #0a0015 60%, #09070d 100%)', accent: '#d8b4fe' },
    { bg: 'radial-gradient(ellipse at 50% 38%, #2a1200 0%, #140900 60%, #0d0a07 100%)', accent: '#fcd34d' },
    { bg: 'radial-gradient(ellipse at 50% 38%, #00201e 0%, #001010 60%, #070d0c 100%)', accent: '#5eead4' },
    { bg: 'radial-gradient(ellipse at 50% 38%, #280010 0%, #140008 60%, #0d0709 100%)', accent: '#fda4af' },
    { bg: 'radial-gradient(ellipse at 50% 38%, #0a0028 0%, #050014 60%, #09070d 100%)', accent: '#818cf8' },
    { bg: 'radial-gradient(ellipse at 50% 38%, #0a1e00 0%, #050f00 60%, #0a0d07 100%)', accent: '#bef264' },
    { bg: 'radial-gradient(ellipse at 50% 38%, #1e0a00 0%, #0f0500 60%, #0d0a07 100%)', accent: '#fb923c' },
];

function shuffleArray<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

interface NomsFeedClientProps {
    names: AllahName[];
}

export default function NomsFeedClient({ names }: NomsFeedClientProps) {
    const containerRef                    = useRef<HTMLDivElement>(null);
    const [feed, setFeed]                 = useState(names);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [copied, setCopied]             = useState<number | null>(null);
    const [showHint, setShowHint]         = useState(true);

    // Shuffle côté client après hydration
    useEffect(() => {
        setFeed(shuffleArray(names));
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

    const handleCopy = useCallback((idx: number, name: AllahName) => {
        const text = `${name.arabe} — ${name.transliteration}\n${name.francais}\n\n${name.signification}`;
        navigator.clipboard?.writeText(text).catch(() => {});
        setCopied(idx);
        setTimeout(() => setCopied(null), 1800);
    }, []);

    const handleShare = useCallback((name: AllahName) => {
        if (typeof navigator !== 'undefined' && navigator.share) {
            navigator.share({
                title: `${name.transliteration} — ${name.francais}`,
                text: `${name.arabe}\n\n${name.francais}\n${name.signification}`,
            }).catch(() => {});
        }
    }, []);

    return (
        <>
            {/* HUD fixe */}
            <div className="fixed top-0 left-0 right-0 md:left-64 z-[60] flex items-center justify-between px-4 pt-3 pb-2 pointer-events-none">
                <Link
                    href="/99-noms"
                    className="pointer-events-auto flex items-center gap-1.5 text-white/90 hover:text-white bg-black/40 backdrop-blur-md rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    99 Noms
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
                {feed.map((name, index) => {
                    const { bg, accent } = GRADIENTS[index % GRADIENTS.length];
                    const isCopied = copied === index;

                    return (
                        <div
                            key={`${name.Number}-${index}`}
                            className="relative w-full flex flex-col overflow-hidden"
                            style={{ height: '100%', scrollSnapAlign: 'start', scrollSnapStop: 'always', background: bg }}
                        >
                            {/* Numéro discret en haut à gauche (vrai numéro, pas position dans le feed) */}
                            <div className="absolute top-14 left-5 z-20">
                                <span
                                    className="text-xs font-bold font-mono px-2 py-0.5 rounded-full border"
                                    style={{ color: accent, borderColor: `${accent}30`, background: `${accent}12` }}
                                >
                                    № {name.Number}
                                </span>
                            </div>

                            {/* Vignette haut */}
                            <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10" />

                            {/* Contenu central */}
                            <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-8 pt-20 pb-4 gap-6 text-center">

                                {/* Nom arabe — étoile de la carte */}
                                <h1
                                    className="font-kufi text-white drop-shadow-lg leading-tight"
                                    style={{ fontSize: 'clamp(3.5rem, 16vw, 7rem)' }}
                                >
                                    {name.arabe}
                                </h1>

                                {/* Séparateur lumineux */}
                                <div
                                    className="w-16 h-px rounded-full"
                                    style={{ background: `linear-gradient(to right, transparent, ${accent}, transparent)` }}
                                />

                                {/* Translitération */}
                                <p
                                    className="font-semibold tracking-widest uppercase text-sm"
                                    style={{ color: accent }}
                                >
                                    {name.transliteration}
                                </p>

                                {/* Traduction française */}
                                <p className="text-white font-bold text-2xl md:text-3xl leading-snug">
                                    {name.francais}
                                </p>

                                {/* Signification */}
                                <p className="text-white/65 italic leading-relaxed max-w-sm" style={{ fontSize: 'clamp(0.85rem, 2.5vw, 1rem)' }}>
                                    &laquo; {name.signification} &raquo;
                                </p>
                            </div>

                            {/* Overlay bas */}
                            <div
                                className="relative z-20 px-5 pb-6 pr-20"
                                style={{
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                                    paddingTop: '3rem',
                                }}
                            >
                                {/* Barre de progression */}
                                <div className="h-0.5 rounded-full bg-white/10 overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-300"
                                        style={{ width: `${((index + 1) / feed.length) * 100}%`, background: accent }}
                                    />
                                </div>
                            </div>

                            {/* Sidebar droite */}
                            <div className="absolute right-4 bottom-28 z-30 flex flex-col items-center gap-5">
                                {/* Copy */}
                                <button
                                    onClick={() => handleCopy(index, name)}
                                    className="flex flex-col items-center gap-1 group"
                                    aria-label="Copier"
                                >
                                    <div
                                        className={cn(
                                            'w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200',
                                            isCopied ? 'scale-110' : 'bg-white/10 group-hover:bg-white/20 group-hover:scale-105'
                                        )}
                                        style={isCopied ? { background: `${accent}30` } : {}}
                                    >
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
                                    onClick={() => handleShare(name)}
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
                                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 animate-bounce">
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
