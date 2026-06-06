import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

type HisnCategorySummary = {
    id: number;
    title: string;
    hadithCount: number;
};

interface HisnCardProps {
    category: HisnCategorySummary;
}

const getCategoryTheme = (title: string, id: number) => {
    const t = title.toLowerCase();
    if (t.includes('matin') || t.includes('réveil') || t.includes('lever')) {
        return { emoji: '🌅', bg: 'hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.02]', iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' };
    }
    if (t.includes('soir') || t.includes('sommeil') || t.includes('nuit') || t.includes('coucher')) {
        return { emoji: '🌌', bg: 'hover:bg-indigo-500/[0.03] dark:hover:bg-indigo-500/[0.02]', iconBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' };
    }
    if (t.includes('prière') || t.includes('mosquée') || t.includes('ablution') || t.includes('adhan') || t.includes('tashahhud') || t.includes('prosternation') || t.includes('inclinaison')) {
        return { emoji: '🕌', bg: 'hover:bg-emerald-500/[0.03] dark:hover:bg-emerald-500/[0.02]', iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' };
    }
    if (t.includes('voyage') || t.includes('monture') || t.includes('ville') || t.includes('sortir') || t.includes('entrer') || t.includes('chemin')) {
        return { emoji: '🚗', bg: 'hover:bg-blue-500/[0.03] dark:hover:bg-blue-500/[0.02]', iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' };
    }
    if (t.includes('tristesse') || t.includes('souci') || t.includes('peur') || t.includes('colère') || t.includes('chaitan') || t.includes('ennemi') || t.includes('malheur') || t.includes('dette') || t.includes('épreuve')) {
        return { emoji: '🛡️', bg: 'hover:bg-rose-500/[0.03] dark:hover:bg-rose-500/[0.02]', iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' };
    }
    if (t.includes('manger') || t.includes('boire') || t.includes('repas') || t.includes('invité') || t.includes('rupture')) {
        return { emoji: '🍲', bg: 'hover:bg-yellow-500/[0.03] dark:hover:bg-yellow-500/[0.02]', iconBg: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20' };
    }
    if (t.includes('hajj') || t.includes('omra') || t.includes('talbiya') || t.includes('pierre noire') || t.includes('safa') || t.includes('marwah') || t.includes('arafat') || t.includes('muzdalifa') || t.includes('jamarat')) {
        return { emoji: '🕋', bg: 'hover:bg-emerald-500/[0.03] dark:hover:bg-emerald-500/[0.02]', iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' };
    }
    return { emoji: '✨', bg: 'hover:bg-primary/[0.02]', iconBg: 'bg-primary/10 text-primary border-primary/20' };
};

export default function HisnCard({ category }: HisnCardProps) {
    const theme = getCategoryTheme(category.title, category.id);

    return (
        <Link
            href={`/hisn/${category.id}`}
            className={`group relative flex flex-col p-6 h-full bg-card hover:border-primary/30 border rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/[0.02] hover:-translate-y-1 overflow-hidden ${theme.bg}`}
        >
            {/* Visual glow on hover */}
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors duration-300" />

            <div className="flex items-start justify-between mb-4 relative z-10">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl border font-bold transition-transform group-hover:scale-110 duration-300 ${theme.iconBg}`}>
                    {theme.emoji}
                </div>
                <span className="flex items-center text-xs font-semibold text-muted-foreground bg-muted/70 dark:bg-muted/30 px-3 py-1 rounded-full border border-border/50">
                    {category.hadithCount} {category.hadithCount > 1 ? 'invocations' : 'invocation'}
                </span>
            </div>

            <h3 className="text-base font-bold leading-relaxed mb-4 line-clamp-2 text-foreground group-hover:text-primary transition-colors duration-200 relative z-10 flex-grow font-sans">
                {category.title}
            </h3>

            <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors duration-200 relative z-10">
                <span>Consulter</span>
                <div className="flex items-center text-primary transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-1 text-[10px]">Découvrir</span>
                    <ChevronRight className="w-4 h-4" />
                </div>
            </div>
            
            {/* Animated accent line at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </Link>
    );
}
