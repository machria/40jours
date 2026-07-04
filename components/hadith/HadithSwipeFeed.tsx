'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bookmark, Share2, ChevronDown } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

export type FeedHadith = {
  hadithnumber: number;
  arabic?: string;
  text: string;
  grades?: { name: string; grade: string }[];
  collectionId?: string;
  bookName?: string;
  chapterTitle?: string;
};

interface HadithSwipeFeedProps {
  hadiths: FeedHadith[];
  backHref: string;
  backLabel: string;
  badgeLabel?: string;
  badgeEmoji?: string;
}

const COLLECTION_CONFIG: Record<string, { bg: string; accent: string; label: string }> = {
  bukhari:  { bg: 'linear-gradient(160deg, #3d1a02 0%, #1c0e01 50%, #0c0a09 100%)', accent: '#f59e0b', label: 'Bukhari' },
  muslim:   { bg: 'linear-gradient(160deg, #022c1a 0%, #011a0f 50%, #090d0b 100%)', accent: '#34d399', label: 'Muslim' },
  abudawud: { bg: 'linear-gradient(160deg, #012040 0%, #010f20 50%, #090c0f 100%)', accent: '#38bdf8', label: 'Abu Dawud' },
  tirmidhi: { bg: 'linear-gradient(160deg, #2d0a3d 0%, #1a0524 50%, #0b090d 100%)', accent: '#c084fc', label: 'Tirmidhi' },
  nasai:    { bg: 'linear-gradient(160deg, #022d2a 0%, #011a18 50%, #090d0c 100%)', accent: '#2dd4bf', label: "An-Nasa'i" },
  ibnmajah: { bg: 'linear-gradient(160deg, #3d0a0a 0%, #210505 50%, #0d0909 100%)', accent: '#f87171', label: 'Ibn Majah' },
  malik:    { bg: 'linear-gradient(160deg, #0a0f3d 0%, #060921 50%, #09090d 100%)', accent: '#818cf8', label: 'Muwatta' },
  default:  { bg: 'linear-gradient(160deg, #1a1a2e 0%, #0f0f1a 50%, #09090b 100%)', accent: '#94a3b8', label: 'Hadith' },
};

function gradeChip(grade: string) {
  const g = grade.toLowerCase();
  if (g.includes('sahih'))  return { label: grade, cls: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
  if (g.includes('hasan'))  return { label: grade, cls: 'bg-sky-500/20 text-sky-300 border-sky-500/30' };
  if (g.includes('da\'if') || g.includes('daif') || g.includes('weak'))
    return { label: grade, cls: 'bg-orange-500/20 text-orange-300 border-orange-500/30' };
  return { label: grade, cls: 'bg-white/10 text-white/60 border-white/10' };
}

function hadithKey(h: FeedHadith) {
  return `${h.collectionId ?? 'default'}:${h.hadithnumber}`;
}

export default function HadithSwipeFeed({ hadiths, backHref, backLabel, badgeLabel, badgeEmoji }: HadithSwipeFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user?.email;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [showHint, setShowHint]   = useState(true);
  const [showArabic, setShowArabic] = useState(true);
  const [showFrench, setShowFrench] = useState(true);

  // Charger les favoris depuis l'API quand l'utilisateur est connecté
  useEffect(() => {
    if (!isLoggedIn) return;
    fetch('/api/favorites')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        setBookmarked(new Set<string>((data.saved ?? []).map((s: { key: string }) => s.key)));
      })
      .catch(() => {});
  }, [isLoggedIn]);

  // Track visible card via scroll position
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

  // Keyboard navigation
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        const next = Math.min(hadiths.length - 1, currentIndex + 1);
        el.scrollTo({ top: next * el.clientHeight, behavior: 'smooth' });
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        const prev = Math.max(0, currentIndex - 1);
        el.scrollTo({ top: prev * el.clientHeight, behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentIndex, hadiths.length]);

  const toggleBookmark = useCallback((hadith: FeedHadith) => {
    const key = hadithKey(hadith);
    setBookmarked(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
    if (isLoggedIn) {
      fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'save',
          key,
          snapshot: {
            text:         hadith.text.slice(0, 300),
            bookName:     hadith.bookName ?? '',
            hadithnumber: hadith.hadithnumber,
            collectionId: hadith.collectionId ?? 'default',
          },
        }),
      }).catch(() => {});
    }
  }, [isLoggedIn]);

  const handleShare = useCallback((hadith: FeedHadith) => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: `Hadith ${hadith.hadithnumber} — ${hadith.bookName ?? ''}`,
        text: hadith.text,
      }).catch(() => {});
    }
  }, []);

  if (!hadiths.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh gap-4">
        <p className="text-muted-foreground">Aucun hadith disponible.</p>
        <Link href={backHref} className="text-primary hover:underline">&larr; {backLabel}</Link>
      </div>
    );
  }

  return (
    <>
      {/* Fixed top HUD — above the scroll container */}
      <div className="fixed top-0 left-0 right-0 md:left-64 z-[60] flex items-center justify-between px-4 pt-safe-top pt-3 pb-2 pointer-events-none">
        <Link
          href={backHref}
          className="pointer-events-auto flex items-center gap-1.5 text-white/90 hover:text-white bg-black/40 backdrop-blur-md rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {backLabel}
        </Link>

        <div className="flex items-center gap-3">
          {badgeLabel && (
            <span className="pointer-events-none flex items-center gap-1 text-white/80 bg-black/40 backdrop-blur-md rounded-full px-3 py-1.5 text-xs font-semibold">
              {badgeEmoji && <span>{badgeEmoji}</span>}
              {badgeLabel}
            </span>
          )}
          <span className="pointer-events-none text-white/50 bg-black/30 backdrop-blur-md rounded-full px-2.5 py-1 text-xs font-mono">
            {currentIndex + 1} / {hadiths.length}
          </span>
        </div>
      </div>

      {/* Scroll feed container */}
      <div
        ref={containerRef}
        className="fixed top-0 left-0 right-0 bottom-16 md:left-64 md:bottom-0 overflow-y-scroll"
        style={{
          scrollSnapType: 'y mandatory',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>

        {hadiths.map((hadith, index) => {
          const cfg    = COLLECTION_CONFIG[hadith.collectionId ?? 'default'] ?? COLLECTION_CONFIG.default;
          const key          = hadithKey(hadith);
          const isBookmarked = bookmarked.has(key);
          const firstChar    = hadith.arabic?.trimStart().slice(0, 1) ?? '';

          return (
            <div
              key={index}
              className="relative w-full flex flex-col overflow-hidden"
              style={{
                height: '100%',
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
                background: cfg.bg,
              }}
            >
              {/* Giant decorative letter */}
              {firstChar && (
                <div
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden"
                  style={{ opacity: 0.045 }}
                >
                  <span className="font-kufi text-white leading-none" style={{ fontSize: 'clamp(12rem, 40vw, 28rem)' }}>
                    {firstChar}
                  </span>
                </div>
              )}

              {/* Subtle top vignette */}
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10" />

              {/* Main content — vertically centered */}
              <div className="relative z-20 flex-1 flex flex-col justify-center px-6 pt-20 pb-4">
                {/* Arabic */}
                {hadith.arabic && showArabic && (
                  <div className="mb-6 text-right" dir="rtl">
                    <p
                      className="font-kufi leading-loose text-white/95 drop-shadow"
                      style={{ fontSize: 'clamp(1.25rem, 4vw, 2rem)' }}
                    >
                      {hadith.arabic}
                    </p>
                  </div>
                )}

                {/* Accent divider */}
                {hadith.arabic && showArabic && showFrench && (
                  <div className="flex justify-center mb-6">
                    <div className="h-px w-16 rounded-full" style={{ background: cfg.accent }} />
                  </div>
                )}

                {/* French */}
                {showFrench && (
                  <div className="text-left">
                    <p
                      className="font-serif leading-relaxed"
                      style={{
                        color: 'rgba(255,255,255,0.88)',
                        fontSize: hadith.arabic && showArabic ? 'clamp(1rem, 2.5vw, 1.2rem)' : 'clamp(1.2rem, 3vw, 1.6rem)',
                      }}
                    >
                      {hadith.text}
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom metadata overlay */}
              <div
                className="relative z-20 px-6 pb-6 pr-20"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)', paddingTop: '3rem' }}
              >
                {/* Grade chips */}
                {hadith.grades && hadith.grades.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {hadith.grades.slice(0, 2).map((g, i) => {
                      const chip = gradeChip(g.grade);
                      return (
                        <span key={i} className={cn('text-[10px] px-2 py-0.5 rounded-full border font-medium', chip.cls)}>
                          {chip.label}
                        </span>
                      );
                    })}
                  </div>
                )}

                <p className="text-sm font-bold mb-0.5" style={{ color: cfg.accent }}>
                  📚 {hadith.bookName ?? cfg.label}
                  <span className="text-white/40 font-normal"> · #{hadith.hadithnumber}</span>
                </p>
                {hadith.chapterTitle && (
                  <p className="text-xs text-white/45 line-clamp-1">{hadith.chapterTitle}</p>
                )}

                {/* Progress bar */}
                <div className="mt-3 h-0.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${((index + 1) / hadiths.length) * 100}%`,
                      background: cfg.accent,
                    }}
                  />
                </div>
              </div>

              {/* Language toggles — top right */}
              <div className="absolute right-3 top-[4.5rem] z-30 flex flex-col gap-2">
                <button
                  onClick={() => setShowArabic(v => !v)}
                  className="flex flex-col items-center gap-0.5 group"
                  aria-label="Afficher/masquer l'arabe"
                >
                  <div className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center font-kufi text-base font-bold transition-all',
                    showArabic ? 'bg-white/15 text-white' : 'bg-white/5 text-white/25'
                  )}>
                    ع
                  </div>
                </button>
                <button
                  onClick={() => setShowFrench(v => !v)}
                  className="flex flex-col items-center gap-0.5 group"
                  aria-label="Afficher/masquer le français"
                >
                  <div className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                    showFrench ? 'bg-white/15 text-white' : 'bg-white/5 text-white/25'
                  )}>
                    FR
                  </div>
                </button>
              </div>

              {/* Right action bar */}
              <div className="absolute right-4 bottom-24 z-30 flex flex-col items-center gap-5">
                {/* Bookmark → favoris */}
                <button
                  onClick={() => toggleBookmark(hadith)}
                  className="flex flex-col items-center gap-1 group"
                  aria-label={isBookmarked ? 'Retirer des favoris' : 'Sauvegarder dans les favoris'}
                >
                  <div
                    className={cn(
                      'w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200',
                      isBookmarked ? 'bg-yellow-500/30 scale-110' : 'bg-white/10 group-hover:bg-white/20 group-hover:scale-105'
                    )}
                  >
                    <Bookmark className={cn('w-5 h-5 transition-all', isBookmarked ? 'fill-yellow-300 text-yellow-300 scale-110' : 'text-white')} />
                  </div>
                  <span className="text-white/60 text-[10px] font-medium">{isBookmarked ? 'Sauvé' : 'Sauver'}</span>
                </button>

                {/* Lien vers favoris */}
                <Link
                  href="/hadith/favoris"
                  className="flex flex-col items-center gap-1 group"
                  aria-label="Voir mes favoris"
                >
                  <div className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center backdrop-blur-sm transition-all group-hover:scale-105">
                    <Bookmark className="w-5 h-5 text-white/50" strokeWidth={1.5} />
                  </div>
                  <span className="text-white/60 text-[10px] font-medium">Favoris</span>
                </Link>

                {/* Share */}
                <button
                  onClick={() => handleShare(hadith)}
                  className="flex flex-col items-center gap-1 group"
                  aria-label="Partager ce hadith"
                >
                  <div className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center backdrop-blur-sm transition-all group-hover:scale-105">
                    <Share2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white/60 text-[10px] font-medium">Partager</span>
                </button>
              </div>

              {/* Swipe hint — first card only */}
              {index === 0 && showHint && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 animate-bounce">
                  <ChevronDown className="w-5 h-5 text-white/60" />
                  <span className="text-white/50 text-xs">Swiper vers le haut</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
