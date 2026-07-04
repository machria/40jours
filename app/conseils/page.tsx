import { Suspense } from 'react';
import ConseilsContent from './ConseilsContent';
import { BookOpen, Sparkles, Zap, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { articles } from '@/data/advice';

export const revalidate = false;

export default function ConseilsPage() {
    return (
        <div className="mb-20 md:mb-8 md:pl-72">
            {/* Gradient Hero — inspired by /hisn */}
            <header className="relative overflow-hidden bg-gradient-to-br from-primary/8 via-background to-background border-b px-4 py-10">
                <div className="absolute -left-20 -top-20 w-72 h-72 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
                <div className="absolute right-0 bottom-0 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

                <div className="container max-w-4xl mx-auto relative z-10 space-y-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                        <Sparkles className="w-3 h-3" />
                        Bibliothèque spirituelle
                    </span>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight">Conseils & Sagesse</h1>
                    <p className="text-muted-foreground max-w-xl">
                        Articles, méthodes et réflexions pour accompagner votre cheminement spirituel.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1 text-xs font-semibold text-muted-foreground">
                        <div className="flex items-center gap-1.5 bg-card/80 border px-3 py-1.5 rounded-full">
                            <BookOpen className="w-3.5 h-3.5 text-primary" />
                            {articles.length} articles
                        </div>
                        <div className="flex items-center gap-1.5 bg-card/80 border px-3 py-1.5 rounded-full">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            5 catégories
                        </div>
                        <Link
                            href="/conseils/decouvrir"
                            className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded-full hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-sm shadow-primary/30"
                        >
                            <Zap className="w-3.5 h-3.5" />
                            Découvrir
                        </Link>
                        <Link
                            href="/dashboard/favoris"
                            className="flex items-center gap-1.5 bg-card/80 border px-3 py-1.5 rounded-full hover:bg-card transition-all hover:scale-105 active:scale-95"
                        >
                            <Bookmark className="w-3.5 h-3.5" />
                            Mes favoris
                        </Link>
                    </div>
                </div>
            </header>

            <div className="container max-w-4xl mx-auto py-8 px-4">
                <Suspense fallback={
                    <div className="flex flex-col gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
                        ))}
                    </div>
                }>
                    <ConseilsContent />
                </Suspense>
            </div>
        </div>
    );
}
