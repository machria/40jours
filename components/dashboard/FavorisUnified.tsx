'use client';

import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { Bookmark, BookOpen, ArrowLeft, ArrowRight, ScrollText, Newspaper } from 'lucide-react';
import { TajwidText } from '@/components/TajwidText';
import { useBookmarks } from '@/hooks/useBookmarks';
import { cn } from '@/lib/utils';
import type { HydratedBookmark } from './FavorisClient';
import type { ISavedHadith, ISavedArticle } from '@/models/User';

const HADITH_ACCENT: Record<string, string> = {
    bukhari:  '#f59e0b', muslim:   '#34d399', abudawud: '#38bdf8',
    tirmidhi: '#c084fc', nasai:    '#2dd4bf', ibnmajah: '#f87171',
    malik:    '#818cf8', default:  '#94a3b8',
};

const ARTICLE_ACCENT: Record<string, string> = {
    "Sagesse d'Al-Ghazali":        '#fbbf24',
    'Méthodologie Coranique':       '#60a5fa',
    'Spiritualité & Guérison':      '#c084fc',
    "Vivre l'Islam & Productivité": '#34d399',
    'Sciences & Compréhension':     '#2dd4bf',
};

type Tab = 'versets' | 'hadiths' | 'articles';

interface Props {
    initialVerses:   HydratedBookmark[];
    initialHadiths:  ISavedHadith[];
    initialArticles: ISavedArticle[];
}

export default function FavorisUnified({ initialVerses, initialHadiths, initialArticles }: Props) {
    const queryClient = useQueryClient();
    const { isBookmarked, toggleBookmark } = useBookmarks();
    const [tab, setTab] = useState<Tab>('versets');

    useEffect(() => {
        queryClient.setQueryData(
            ['bookmarks'],
            initialVerses.map(b => ({ surah: b.surah, ayah: b.ayah, addedAt: b.addedAt }))
        );
    }, [initialVerses, queryClient]);

    const visibleVerses = initialVerses.filter(b => isBookmarked(b.surah, b.ayah));
    const hadiths  = [...initialHadiths].reverse();
    const articles = [...initialArticles].reverse();

    const tabs: { id: Tab; label: string; icon: React.ReactNode; count: number }[] = [
        { id: 'versets',  label: 'Versets',  icon: <BookOpen   className="w-4 h-4" />, count: visibleVerses.length },
        { id: 'hadiths',  label: 'Hadiths',  icon: <ScrollText className="w-4 h-4" />, count: hadiths.length },
        { id: 'articles', label: 'Articles', icon: <Newspaper  className="w-4 h-4" />, count: articles.length },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-muted rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-xl font-bold">Mes favoris</h1>
                </div>

                {/* Tabs */}
                <div className="max-w-2xl mx-auto px-4 pb-0 flex gap-1">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={cn(
                                'flex items-center gap-1.5 px-3 py-2.5 text-sm font-semibold border-b-2 transition-colors',
                                tab === t.id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            )}
                        >
                            {t.icon}
                            {t.label}
                            {t.count > 0 && (
                                <span className={cn(
                                    'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                                    tab === t.id ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
                                )}>
                                    {t.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </header>

            <main className="max-w-2xl mx-auto p-4 space-y-4">

                {/* ── Versets ── */}
                {tab === 'versets' && (
                    visibleVerses.length === 0 ? (
                        <Empty
                            icon={<BookOpen className="w-8 h-8" />}
                            label="Aucun verset sauvegardé"
                            sub="Ajoute des versets depuis le lecteur Coran."
                            cta="Parcourir le Coran"
                            href="/coran"
                        />
                    ) : (
                        visibleVerses.map(b => (
                            <div key={`${b.surah}-${b.ayah}`} className="bg-card border rounded-xl p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <Link
                                        href={`/coran/${b.surah}#ayah-${b.ayah}`}
                                        className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                                    >
                                        <BookOpen className="w-4 h-4" />
                                        Sourate {b.surah}{b.surahName ? ` (${b.surahName})` : ''}, Verset {b.ayah}
                                    </Link>
                                    <button
                                        onClick={() => toggleBookmark(b.surah, b.ayah)}
                                        title="Retirer des favoris"
                                        className="text-amber-500 hover:text-amber-600 transition-colors"
                                    >
                                        <Bookmark className="w-4 h-4 fill-current" />
                                    </button>
                                </div>
                                <div className="text-right font-arabic text-xl text-foreground/80" dir="rtl">
                                    <TajwidText text={b.text} />
                                </div>
                                <p className="text-muted-foreground text-sm">{b.translation}</p>
                            </div>
                        ))
                    )
                )}

                {/* ── Hadiths ── */}
                {tab === 'hadiths' && (
                    hadiths.length === 0 ? (
                        <Empty
                            icon={<ScrollText className="w-8 h-8" />}
                            label="Aucun hadith sauvegardé"
                            sub="Sauvegarde des hadiths depuis le feed aléatoire."
                            cta="Découvrir les hadiths"
                            href="/hadith/flashcards"
                        />
                    ) : (
                        hadiths.map((h, i) => {
                            const accent = HADITH_ACCENT[h.collectionId] ?? HADITH_ACCENT.default;
                            return (
                                <Link
                                    key={`${h.key}-${i}`}
                                    href={`/hadith/${h.collectionId}/hadith/${h.hadithnumber}`}
                                    className="block bg-card border rounded-xl p-4 space-y-2 hover:border-primary/40 transition-colors group"
                                >
                                    <div className="flex items-center gap-2">
                                        <Bookmark className="w-3.5 h-3.5 shrink-0" style={{ color: accent }} fill="currentColor" />
                                        <span className="text-xs font-bold" style={{ color: accent }}>
                                            {h.bookName || h.collectionId}
                                        </span>
                                        <span className="text-muted-foreground text-xs ml-auto font-mono">#{h.hadithnumber}</span>
                                    </div>
                                    <p className="text-foreground/85 text-sm leading-relaxed line-clamp-4">
                                        {h.text}{h.text.length >= 300 && '…'}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-muted-foreground/60 text-[11px]">
                                            {new Date(h.savedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                        <span className="text-xs font-semibold flex items-center gap-1 group-hover:underline" style={{ color: accent }}>
                                            Lire le hadith <ArrowRight className="w-3 h-3" />
                                        </span>
                                    </div>
                                </Link>
                            );
                        })
                    )
                )}

                {/* ── Articles ── */}
                {tab === 'articles' && (
                    articles.length === 0 ? (
                        <Empty
                            icon={<Newspaper className="w-8 h-8" />}
                            label="Aucun article sauvegardé"
                            sub="Sauvegarde des articles depuis le feed Découvrir."
                            cta="Découvrir des articles"
                            href="/conseils/decouvrir"
                        />
                    ) : (
                        articles.map((a, i) => {
                            const accent = ARTICLE_ACCENT[a.category] ?? '#94a3b8';
                            return (
                                <Link
                                    key={`${a.slug}-${i}`}
                                    href={`/conseils/${a.slug}`}
                                    className="block bg-card border rounded-xl p-4 space-y-2 hover:border-primary/40 transition-colors group"
                                >
                                    <div className="flex items-center gap-2">
                                        <Bookmark className="w-3.5 h-3.5 shrink-0" style={{ color: accent }} fill="currentColor" />
                                        <span className="text-xs font-bold truncate" style={{ color: accent }}>{a.category}</span>
                                        <span className="text-muted-foreground/60 text-[11px] ml-auto shrink-0">
                                            {new Date(a.savedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-foreground text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                                        {a.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm line-clamp-2">{a.excerpt}</p>
                                    <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: accent }}>
                                        Lire l'article <ArrowRight className="w-3 h-3" />
                                    </div>
                                </Link>
                            );
                        })
                    )
                )}
            </main>
        </div>
    );
}

function Empty({ icon, label, sub, cta, href }: {
    icon: React.ReactNode; label: string; sub: string; cta: string; href: string;
}) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                {icon}
            </div>
            <div>
                <p className="font-semibold text-lg">{label}</p>
                <p className="text-muted-foreground text-sm mt-1">{sub}</p>
            </div>
            <Link
                href={href}
                className="mt-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            >
                {cta}
            </Link>
        </div>
    );
}
