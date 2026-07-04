import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import type { ISavedHadith } from '@/models/User';
import Link from 'next/link';
import { ArrowLeft, Bookmark, Heart } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Mes favoris — Hadiths',
    description: 'Vos hadiths sauvegardés.',
};

const ACCENT: Record<string, string> = {
    bukhari:  '#f59e0b',
    muslim:   '#34d399',
    abudawud: '#38bdf8',
    tirmidhi: '#c084fc',
    nasai:    '#2dd4bf',
    ibnmajah: '#f87171',
    malik:    '#818cf8',
    default:  '#94a3b8',
};

const BG: Record<string, string> = {
    bukhari:  'linear-gradient(135deg, #3d1a02 0%, #1c0e01 100%)',
    muslim:   'linear-gradient(135deg, #022c1a 0%, #011a0f 100%)',
    abudawud: 'linear-gradient(135deg, #012040 0%, #010f20 100%)',
    tirmidhi: 'linear-gradient(135deg, #2d0a3d 0%, #1a0524 100%)',
    nasai:    'linear-gradient(135deg, #022d2a 0%, #011a18 100%)',
    ibnmajah: 'linear-gradient(135deg, #3d0a0a 0%, #210505 100%)',
    malik:    'linear-gradient(135deg, #0a0f3d 0%, #060921 100%)',
    default:  'linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)',
};

export default async function FavorisPage() {
    const session = await auth();
    if (!session?.user?.email) redirect('/login');

    await dbConnect();
    const user = await User.findOne({ email: session.user.email })
        .select('savedHadiths likedHadiths');

    const saved: ISavedHadith[] = user?.savedHadiths ?? [];
    const likedCount: number    = user?.likedHadiths?.length ?? 0;

    return (
        <div className="min-h-dvh bg-background">
            {/* Header */}
            <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
                    <Link
                        href="/hadith"
                        className="p-2 rounded-full hover:bg-accent transition-colors"
                        aria-label="Retour"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="font-bold text-lg leading-none">Mes favoris</h1>
                        <p className="text-muted-foreground text-sm mt-0.5">
                            {saved.length} signet{saved.length !== 1 ? 's' : ''}
                            {likedCount > 0 && ` · ${likedCount} aimé${likedCount !== 1 ? 's' : ''}`}
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
                            <p className="font-semibold text-lg">Aucun signet</p>
                            <p className="text-muted-foreground text-sm mt-1">
                                Sauvegarde des hadiths depuis le feed pour les retrouver ici.
                            </p>
                        </div>
                        <Link
                            href="/hadith/flashcards"
                            className="mt-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                        >
                            Découvrir les hadiths
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {[...saved].reverse().map((item, i) => {
                            const accent = ACCENT[item.collectionId] ?? ACCENT.default;
                            const bg     = BG[item.collectionId]     ?? BG.default;
                            return (
                                <div
                                    key={`${item.key}-${i}`}
                                    className="rounded-2xl overflow-hidden"
                                    style={{ background: bg }}
                                >
                                    <div className="p-4">
                                        {/* Méta */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <Bookmark
                                                className="w-3.5 h-3.5 shrink-0"
                                                style={{ color: accent }}
                                                fill="currentColor"
                                            />
                                            <span className="text-xs font-bold" style={{ color: accent }}>
                                                {item.bookName || item.collectionId}
                                            </span>
                                            <span className="text-white/30 text-xs">·</span>
                                            <span className="text-white/40 text-xs font-mono">
                                                #{item.hadithnumber}
                                            </span>
                                        </div>

                                        {/* Texte */}
                                        <p className="text-white/85 leading-relaxed text-sm line-clamp-4">
                                            {item.text}
                                            {item.text.length >= 300 && '…'}
                                        </p>

                                        {/* Séparateur + lien */}
                                        <div
                                            className="mt-3 pt-3 flex justify-end"
                                            style={{ borderTop: `1px solid ${accent}20` }}
                                        >
                                            <span className="text-xs" style={{ color: `${accent}80` }}>
                                                {new Date(item.savedAt).toLocaleDateString('fr-FR', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {likedCount > 0 && (
                    <div className="mt-8 flex items-center gap-2 text-muted-foreground text-sm">
                        <Heart className="w-4 h-4 fill-red-400 text-red-400" />
                        <span>
                            Tu as aimé {likedCount} hadith{likedCount !== 1 ? 's' : ''} — les likes ne sont pas affichés ici mais sont bien enregistrés.
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
