import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import type { ISavedArticle } from '@/models/User';
import Link from 'next/link';
import { ArrowLeft, Bookmark, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Mes articles sauvegardés',
    description: 'Vos articles conseils sauvegardés.',
};

const ACCENT: Record<string, string> = {
    "Sagesse d'Al-Ghazali":        '#fbbf24',
    'Méthodologie Coranique':       '#60a5fa',
    'Spiritualité & Guérison':      '#c084fc',
    "Vivre l'Islam & Productivité": '#34d399',
    'Sciences & Compréhension':     '#2dd4bf',
};

const BG: Record<string, string> = {
    "Sagesse d'Al-Ghazali":        'linear-gradient(135deg, #3d2000 0%, #1f1000 100%)',
    'Méthodologie Coranique':       'linear-gradient(135deg, #001840 0%, #000e22 100%)',
    'Spiritualité & Guérison':      'linear-gradient(135deg, #1e0040 0%, #100022 100%)',
    "Vivre l'Islam & Productivité": 'linear-gradient(135deg, #00280f 0%, #001508 100%)',
    'Sciences & Compréhension':     'linear-gradient(135deg, #00201e 0%, #001110 100%)',
};

export default async function ConseilsFavorisPage() {
    const session = await auth();
    if (!session?.user?.email) redirect('/login');

    await dbConnect();
    const user = await User.findOne({ email: session.user.email }).select('savedArticles');

    const saved: ISavedArticle[] = user?.savedArticles ?? [];

    return (
        <div className="min-h-dvh bg-background">
            {/* Header */}
            <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
                    <Link
                        href="/conseils"
                        className="p-2 rounded-full hover:bg-accent transition-colors"
                        aria-label="Retour"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="font-bold text-lg leading-none">Mes articles sauvegardés</h1>
                        <p className="text-muted-foreground text-sm mt-0.5">
                            {saved.length} article{saved.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-6">
                {saved.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                            <Bookmark className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="font-semibold text-lg">Aucun article sauvegardé</p>
                            <p className="text-muted-foreground text-sm mt-1">
                                Sauvegarde des articles depuis le feed Découvrir pour les retrouver ici.
                            </p>
                        </div>
                        <Link
                            href="/conseils/decouvrir"
                            className="mt-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                        >
                            Découvrir des articles
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {[...saved].reverse().map((item, i) => {
                            const accent = ACCENT[item.category] ?? '#94a3b8';
                            const bg     = BG[item.category]     ?? 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)';
                            return (
                                <Link
                                    key={`${item.slug}-${i}`}
                                    href={`/conseils/${item.slug}`}
                                    className="block rounded-2xl overflow-hidden group transition-all hover:scale-[1.01] active:scale-[0.99]"
                                    style={{ background: bg }}
                                >
                                    <div className="p-4">
                                        {/* Méta */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <Bookmark
                                                className="w-3.5 h-3.5 shrink-0"
                                                style={{ color: accent }}
                                                fill="currentColor"
                                            />
                                            <span className="text-xs font-bold truncate" style={{ color: accent }}>
                                                {item.category}
                                            </span>
                                            <span className="text-white/30 text-xs ml-auto shrink-0">
                                                {new Date(item.savedAt).toLocaleDateString('fr-FR', {
                                                    day: 'numeric', month: 'short'
                                                })}
                                            </span>
                                        </div>

                                        {/* Titre */}
                                        <h2 className="font-black text-white text-base leading-snug mb-2 line-clamp-2">
                                            {item.title}
                                        </h2>

                                        {/* Excerpt */}
                                        <p className="text-white/60 text-sm leading-relaxed line-clamp-2">
                                            {item.excerpt}
                                        </p>

                                        {/* Lire */}
                                        <div
                                            className="mt-3 pt-3 flex items-center justify-end gap-1"
                                            style={{ borderTop: `1px solid ${accent}20` }}
                                        >
                                            <span className="text-xs font-semibold group-hover:underline" style={{ color: accent }}>
                                                Lire l'article
                                            </span>
                                            <ArrowRight className="w-3.5 h-3.5" style={{ color: accent }} />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
