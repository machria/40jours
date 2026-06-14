'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { Bookmark, BookOpen } from 'lucide-react';
import { TajwidText } from '@/components/TajwidText';
import { useBookmarks } from '@/hooks/useBookmarks';

export interface HydratedBookmark {
    surah: number;
    ayah: number;
    text: string;
    translation: string;
    surahName?: string;
    addedAt: string;
}

interface FavorisClientProps {
    initialBookmarks: HydratedBookmark[];
}

export default function FavorisClient({ initialBookmarks }: FavorisClientProps) {
    const queryClient = useQueryClient();
    const { isBookmarked, toggleBookmark } = useBookmarks();

    useEffect(() => {
        queryClient.setQueryData(
            ['bookmarks'],
            initialBookmarks.map(b => ({ surah: b.surah, ayah: b.ayah, addedAt: b.addedAt }))
        );
    }, [initialBookmarks, queryClient]);

    const visible = initialBookmarks.filter(b => isBookmarked(b.surah, b.ayah));

    if (visible.length === 0) {
        return (
            <div className="text-center py-16 text-muted-foreground space-y-4">
                <Bookmark className="w-10 h-10 mx-auto opacity-30" />
                <p>Aucun favori pour le moment.</p>
                <Link href="/coran" className="text-primary hover:underline text-sm font-medium">
                    Parcourir le Coran
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {visible.map(b => (
                <div key={`${b.surah}-${b.ayah}`} className="bg-card border rounded-lg p-4 space-y-3">
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
                            className="text-amber-600 hover:text-amber-700 transition-colors"
                        >
                            <Bookmark className="w-4 h-4 fill-current" />
                        </button>
                    </div>
                    <div className="text-right font-arabic text-xl text-foreground/80" dir="rtl">
                        <TajwidText text={b.text} />
                    </div>
                    <p className="text-muted-foreground text-sm">{b.translation}</p>
                </div>
            ))}
        </div>
    );
}
