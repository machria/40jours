'use client';

import Link from 'next/link';
import { articles } from '@/data/advice';
import { ArrowRight, BookOpen, Clock, User } from 'lucide-react';

export default function ConseilsPage() {
    return (
        <div className="container max-w-4xl mx-auto py-8 mb-20 md:mb-8 md:pl-72 px-4">
            <h1 className="text-3xl font-bold mb-2">Conseils & Sagesse</h1>
            <p className="text-muted-foreground mb-8">
                Articles, méthodes et réflexions pour vous accompagner dans votre cheminement spirituel.
            </p>

            <div className="grid gap-6">
                {articles.map((article) => (
                    <article
                        key={article.slug}
                        className="group bg-card hover:bg-muted/30 border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                    >
                        <Link href={`/conseils/${article.slug}`} className="block p-6">
                            <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-2 text-xs text-primary font-medium tracking-wider uppercase">
                                        <BookOpen className="w-3 h-3" />
                                        <span>Article</span>
                                    </div>

                                    <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">
                                        {article.title}
                                    </h2>

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
                ))}
            </div>
        </div>
    );
}
