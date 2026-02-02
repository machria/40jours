'use client';

import { useState } from 'react';
import Link from 'next/link';
import { articles } from '@/data/advice';
import { ArrowRight, BookOpen, Clock, User, LayoutGrid } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function ConseilsPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('Tout');

    // Definir l'ordre des categories
    const categories = [
        "Sagesse d'Al-Ghazali",
        "Méthodologie Coranique",
        "Spiritualité & Guérison",
        "Vivre l'Islam & Productivité",
        "Sciences & Compréhension"
    ] as const;

    // Filter logic
    const filteredArticles = selectedCategory === 'Tout'
        ? articles
        : articles.filter(a => a.category === selectedCategory);

    // Grouping helper (only used when 'Tout' is selected)
    const groupedArticles = categories.reduce((acc, category) => {
        acc[category] = articles.filter(a => a.category === category);
        return acc;
    }, {} as Record<typeof categories[number], typeof articles>);

    return (
        <div className="container max-w-4xl mx-auto py-8 mb-20 md:mb-8 md:pl-72 px-4">
            <h1 className="text-3xl font-bold mb-2">Conseils & Sagesse</h1>
            <p className="text-muted-foreground mb-8">
                Articles, méthodes et réflexions pour vous accompagner dans votre cheminement spirituel.
            </p>

            {/* Category Filter Tabs */}
            <div className="flex overflow-x-auto pb-4 mb-8 gap-2 no-scrollbar">
                <button
                    onClick={() => setSelectedCategory('Tout')}
                    className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border",
                        selectedCategory === 'Tout'
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background hover:bg-muted border-border"
                    )}
                >
                    <span className="flex items-center gap-2">
                        <LayoutGrid className="w-4 h-4" />
                        Tout voir
                    </span>
                </button>
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border",
                            selectedCategory === category
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background hover:bg-muted border-border"
                        )}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Content Display */}
            <div className="min-h-[50vh]">
                {selectedCategory === 'Tout' ? (
                    // VIEW: ALL (Grouped by Sections)
                    <div className="space-y-16">
                        {categories.map((category) => {
                            const categoryArticles = groupedArticles[category];
                            if (categoryArticles.length === 0) return null;

                            return (
                                <section key={category} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-border/40 flex items-center gap-2">
                                        {category}
                                        <span className="text-sm font-normal text-muted-foreground ml-auto bg-muted px-2 py-0.5 rounded-full">
                                            {categoryArticles.length}
                                        </span>
                                    </h2>

                                    <div className="grid gap-6">
                                        {categoryArticles.map((article) => (
                                            <ArticleCard key={article.slug} article={article} />
                                        ))}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                ) : (
                    // VIEW: FILTERED (Simple Grid)
                    <div className="grid gap-6 animate-in fade-in duration-300">
                        {filteredArticles.length > 0 ? (
                            filteredArticles.map((article) => (
                                <ArticleCard key={article.slug} article={article} />
                            ))
                        ) : (
                            <div className="text-center py-20 text-muted-foreground">
                                Aucun article dans cette catégorie pour le moment.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// Sub-component for cleaner render
function ArticleCard({ article }: { article: any }) {
    return (
        <article className="group bg-card hover:bg-muted/30 border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            <Link href={`/conseils/${article.slug}`} className="block p-6">
                <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                    <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-2 text-xs text-primary font-medium tracking-wider uppercase">
                            <BookOpen className="w-3 h-3" />
                            <span>Article</span>
                        </div>

                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                            {article.title}
                        </h3>

                        <p className="text-muted-foreground leading-relaxed line-clamp-3 md:line-clamp-2">
                            {article.excerpt}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground/70 pt-2">
                            <div className="flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5" />
                                {article.author}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                {article.readTime || '5 min'}
                            </div>
                            <div>
                                {new Date(article.date).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 transform group-hover:translate-x-1">
                        <ArrowRight className="w-5 h-5" />
                    </div>
                </div>
            </Link>
        </article>
    );
}
