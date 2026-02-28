'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { articles } from '@/data/advice';
import { ArrowRight, BookOpen, Clock, User, LayoutGrid } from 'lucide-react';
import { cn } from "@/lib/utils";

const CATEGORIES = [
    "Sagesse d'Al-Ghazali",
    "Méthodologie Coranique",
    "Spiritualité & Guérison",
    "Vivre l'Islam & Productivité",
    "Sciences & Compréhension",
] as const;

const CATEGORY_EMOJI: Record<string, string> = {
    "Sagesse d'Al-Ghazali": '📚',
    'Méthodologie Coranique': '📖',
    'Spiritualité & Guérison': '💫',
    "Vivre l'Islam & Productivité": '⚡',
    'Sciences & Compréhension': '🔬',
};

const SHORT_LABELS: Record<string, string> = {
    "Sagesse d'Al-Ghazali": 'Savant',
    'Méthodologie Coranique': 'Coran',
    'Spiritualité & Guérison': 'Spiritualité',
    "Vivre l'Islam & Productivité": 'Productivité',
    'Sciences & Compréhension': 'Sciences',
};

export default function ConseilsContent() {
    const searchParams = useSearchParams();
    const initialCat = searchParams.get('cat') ?? 'Tout';
    const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);

    useEffect(() => {
        const cat = searchParams.get('cat');
        if (cat && CATEGORIES.includes(cat as typeof CATEGORIES[number])) {
            setSelectedCategory(cat);
        }
    }, [searchParams]);

    const filteredArticles = selectedCategory === 'Tout'
        ? articles
        : articles.filter(a => a.category === selectedCategory);

    const groupedArticles = CATEGORIES.reduce((acc, category) => {
        acc[category] = articles.filter(a => a.category === category);
        return acc;
    }, {} as Record<typeof CATEGORIES[number], typeof articles>);

    const countFor = (cat: string) =>
        articles.filter(a => a.category === cat).length;

    return (
        <>
            {/* Category Filter Tabs */}
            <div className="flex overflow-x-auto pb-3 mb-8 gap-2 no-scrollbar">
                <button
                    onClick={() => setSelectedCategory('Tout')}
                    className={cn(
                        "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border shrink-0",
                        selectedCategory === 'Tout'
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background hover:bg-muted border-border"
                    )}
                >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    Tout
                    <span className={cn(
                        "text-xs px-1.5 py-0.5 rounded-full font-semibold",
                        selectedCategory === 'Tout'
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                    )}>
                        {articles.length}
                    </span>
                </button>

                {CATEGORIES.map((category) => {
                    const count = countFor(category);
                    const active = selectedCategory === category;
                    return (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={cn(
                                "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border shrink-0",
                                active
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background hover:bg-muted border-border"
                            )}
                        >
                            <span>{CATEGORY_EMOJI[category]}</span>
                            {SHORT_LABELS[category]}
                            <span className={cn(
                                "text-xs px-1.5 py-0.5 rounded-full font-semibold",
                                active
                                    ? "bg-primary-foreground/20 text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                            )}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <div className="min-h-[50vh]">
                {selectedCategory === 'Tout' ? (
                    <div className="space-y-16">
                        {CATEGORIES.map((category) => {
                            const categoryArticles = groupedArticles[category];
                            if (categoryArticles.length === 0) return null;

                            return (
                                <section key={category} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-border/40 flex items-center gap-2">
                                        <span>{CATEGORY_EMOJI[category]}</span>
                                        {category}
                                        <span className="text-sm font-normal text-muted-foreground ml-auto bg-muted px-2 py-0.5 rounded-full">
                                            {categoryArticles.length}
                                        </span>
                                    </h2>

                                    <div className="grid gap-4">
                                        {categoryArticles.map((article, idx) => (
                                            <ArticleCard
                                                key={article.slug}
                                                article={article}
                                                index={idx}
                                                total={categoryArticles.length}
                                            />
                                        ))}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                ) : (
                    <div className="animate-in fade-in duration-300">
                        <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-muted/40 border border-border/60">
                            <span className="text-2xl">{CATEGORY_EMOJI[selectedCategory]}</span>
                            <div>
                                <p className="font-semibold">{selectedCategory}</p>
                                <p className="text-sm text-muted-foreground">
                                    {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            {filteredArticles.length > 0 ? (
                                filteredArticles.map((article, idx) => (
                                    <ArticleCard
                                        key={article.slug}
                                        article={article}
                                        index={idx}
                                        total={filteredArticles.length}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-20 text-muted-foreground">
                                    Aucun article dans cette catégorie pour le moment.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

function ArticleCard({ article, index, total }: { article: any; index: number; total: number }) {
    return (
        <article className="group bg-card hover:bg-muted/30 border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            <Link href={`/conseils/${article.slug}`} className="block p-5">
                <div className="flex gap-5 justify-between items-start">
                    {total > 1 && (
                        <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground text-xs font-bold mt-1">
                            {index + 1}
                        </div>
                    )}

                    <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs text-primary font-medium tracking-wider uppercase">
                            <BookOpen className="w-3 h-3" />
                            <span>Article</span>
                        </div>

                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors leading-snug">
                            {article.title}
                        </h3>

                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                            {article.excerpt}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground/70 pt-1">
                            <div className="flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5" />
                                {article.author}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                {article.readTime || '5 min'}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center shrink-0 w-9 h-9 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:translate-x-0.5 mt-1">
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
            </Link>
        </article>
    );
}
