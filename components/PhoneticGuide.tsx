import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PHONETIC_SYMBOLS } from '@/data/phonetique';

interface PhoneticGuideProps {
    className?: string;
}

/** Encadré repliable expliquant la convention de translittération du site. */
export default function PhoneticGuide({ className }: PhoneticGuideProps) {
    return (
        <details className={cn('group w-full rounded-2xl border bg-card text-left', className)}>
            <summary className="flex items-center justify-between gap-2 cursor-pointer list-none p-4 font-semibold text-sm [&::-webkit-details-marker]:hidden">
                Comment lire la phonétique
                <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-4 pb-4 space-y-3">
                <p className="text-xs text-muted-foreground">
                    Les lettres qui n&apos;existent pas en français sont notées par un signe précis, pour ne pas dénaturer le mot arabe.
                </p>
                <ul className="divide-y">
                    {PHONETIC_SYMBOLS.map(s => (
                        <li key={s.signe} className="grid grid-cols-[4.5rem_1fr] gap-3 py-2.5">
                            <div className="flex flex-col items-center justify-center rounded-lg bg-muted/50 py-1.5">
                                <span className="font-bold text-primary text-sm text-center leading-tight">{s.signe}</span>
                                <span className="font-kufi text-lg text-muted-foreground" dir="rtl">{s.arabe}</span>
                            </div>
                            <div className="text-sm space-y-0.5">
                                <p>{s.prononciation}</p>
                                <p className="text-xs text-muted-foreground">Ex. : {s.exemples}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </details>
    );
}
