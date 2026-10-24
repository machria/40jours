import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NameVerse as NameVerseData, NameVerseSource } from '@/data/names';

export const VERSE_SOURCE_LABELS: Record<NameVerseSource, { label: string; title: string }> = {
    nom: {
        label: 'Nom cité dans le Coran',
        title: 'Le nom figure dans ce verset.',
    },
    racine: {
        label: 'Racine coranique · nom tiré du hadith',
        title: "Le verset contient la racine ou la forme verbale du nom ; le nom lui-même provient de la liste du hadith d'at-Tirmidhī.",
    },
    sens: {
        label: 'Sens proche · nom tiré du hadith',
        title: "Le nom ne figure pas dans le Coran ; ce verset en illustre le sens. Le nom provient de la liste du hadith d'at-Tirmidhī.",
    },
};

interface NameVerseProps {
    verset: NameVerseData;
    className?: string;
}

/** Extrait coranique associé à un nom d'Allah (texte arabe + traduction Hamidullah). */
export default function NameVerse({ verset, className }: NameVerseProps) {
    const source = VERSE_SOURCE_LABELS[verset.source];
    const ref = `${verset.sourate}:${verset.ayah}`;

    return (
        <figure className={cn('rounded-xl border bg-card p-4 space-y-3 text-left', className)}>
            <div className="flex flex-wrap items-center justify-between gap-2">
                <span
                    title={source.title}
                    className={cn(
                        'text-[11px] font-medium px-2 py-0.5 rounded-full border',
                        verset.source === 'nom'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/40'
                            : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/40'
                    )}
                >
                    {source.label}
                </span>
                <Link
                    href={`/coran/${verset.sourate}#ayah-${verset.ayah}`}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                >
                    <BookOpen className="w-3.5 h-3.5" />
                    {verset.sourateNom ? `${verset.sourateNom} · ` : ''}{ref}
                </Link>
            </div>

            {verset.arabe && (
                <p dir="rtl" lang="ar" className="font-kufi text-xl leading-loose text-primary text-right">
                    {verset.arabe}
                </p>
            )}
            {verset.francais && (
                <blockquote className="text-sm text-muted-foreground italic leading-relaxed">
                    « {verset.francais} »
                </blockquote>
            )}
            {verset.note && (
                <figcaption className="text-xs text-muted-foreground/80 border-t pt-2">
                    {verset.note}
                </figcaption>
            )}
        </figure>
    );
}
