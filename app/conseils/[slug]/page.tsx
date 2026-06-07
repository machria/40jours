import { articles } from '@/data/advice';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, Clock, Scroll, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
    return articles.map((a) => ({ slug: a.slug }));
}

const CATEGORY_EMOJI: Record<string, string> = {
    "Sagesse d'Al-Ghazali": '📚',
    'Méthodologie Coranique': '📖',
    'Spiritualité & Guérison': '💫',
    "Vivre l'Islam & Productivité": '⚡',
    'Sciences & Compréhension': '🔬',
};

export default async function ArticlePage({ params }: PageProps) {
    const { slug } = await params;
    const currentIndex = articles.findIndex((a) => a.slug === slug);

    if (currentIndex === -1) {
        notFound();
    }

    const article = articles[currentIndex];
    const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
    const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;
    const relatedArticles = articles
        .filter((a) => a.category === article.category && a.slug !== slug)
        .slice(0, 2);

    const emoji = CATEGORY_EMOJI[article.category] ?? '✨';

    return (
        <div className="container max-w-3xl mx-auto py-8 mb-20 md:mb-12 md:pl-72 px-4">
            {/* Back Link */}
            <Link
                href="/conseils"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
                <ArrowLeft className="w-4 h-4" />
                Retour aux conseils
            </Link>

            <article className="prose prose-slate dark:prose-invert max-w-none">
                {/* Header */}
                <header className="mb-10 not-prose">
                    {/* Category badge */}
                    <div className="mb-4">
                        <Link
                            href={`/conseils?cat=${encodeURIComponent(article.category)}`}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                            <span>{emoji}</span>
                            {article.category}
                        </Link>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                        {article.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-b pb-6">
                        <div className={`flex items-center gap-1.5 font-medium ${article.author === 'Imam Al-Ghazali' ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'}`}>
                            {article.author === 'Imam Al-Ghazali'
                                ? <Scroll className="w-4 h-4" />
                                : <Users className="w-4 h-4" />
                            }
                            <span>{article.author}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>{article.readTime} de lecture</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <time dateTime={article.date}>
                                {new Date(article.date).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </time>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="markdown-content">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4 text-primary" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-10 mb-6 text-foreground border-b pb-2" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-xl font-semibold mt-8 mb-4 text-foreground/90" {...props} />,
                            p: ({ node, ...props }) => <p className="leading-8 text-lg text-muted-foreground mb-6" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-muted-foreground" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal list-outside ml-6 mb-6 space-y-2 text-muted-foreground" {...props} />,
                            li: ({ node, ...props }) => <li className="leading-7 pl-2" {...props} />,
                            strong: ({ node, ...props }) => <strong className="font-bold text-foreground" {...props} />,
                            blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-primary/30 pl-4 italic my-8 text-lg text-muted-foreground/80 bg-muted/20 py-4 rounded-r-lg" {...props} />,
                            table: ({ node, ...props }) => (
                                <div className="overflow-x-auto my-8 rounded-xl border border-border shadow-sm">
                                    <table className="w-full text-sm border-collapse" {...props} />
                                </div>
                            ),
                            thead: ({ node, ...props }) => <thead className="bg-muted/60" {...props} />,
                            tbody: ({ node, ...props }) => <tbody className="divide-y divide-border" {...props} />,
                            tr: ({ node, ...props }) => <tr className="even:bg-muted/20 hover:bg-muted/40 transition-colors" {...props} />,
                            th: ({ node, ...props }) => <th className="text-left font-semibold text-foreground px-4 py-3 border-b border-border" {...props} />,
                            td: ({ node, ...props }) => <td className="px-4 py-3 text-muted-foreground align-top" {...props} />,
                        }}
                    >
                        {article.content}
                    </ReactMarkdown>
                </div>
            </article>

            {/* Prev / Next navigation */}
            <hr className="my-12 border-muted" />
            <nav className="grid grid-cols-2 gap-4" aria-label="Navigation entre articles">
                {prevArticle ? (
                    <Link
                        href={`/conseils/${prevArticle.slug}`}
                        className="group flex flex-col gap-1 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/30 transition-all"
                    >
                        <span className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                            <ChevronLeft className="w-3.5 h-3.5" />
                            Article précédent
                        </span>
                        <span className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                            {prevArticle.title}
                        </span>
                        <span className="text-xs text-muted-foreground/60 mt-1">{prevArticle.readTime}</span>
                    </Link>
                ) : (
                    <div />
                )}

                {nextArticle ? (
                    <Link
                        href={`/conseils/${nextArticle.slug}`}
                        className="group flex flex-col gap-1 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/30 transition-all text-right"
                    >
                        <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                            Article suivant
                            <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                            {nextArticle.title}
                        </span>
                        <span className="text-xs text-muted-foreground/60 mt-1">{nextArticle.readTime}</span>
                    </Link>
                ) : (
                    <div />
                )}
            </nav>

            {/* Related articles */}
            {relatedArticles.length > 0 && (
                <section className="mt-12">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <span>{emoji}</span>
                        Dans la même catégorie
                    </h2>
                    <div className="grid gap-3">
                        {relatedArticles.map((related) => (
                            <Link
                                key={related.slug}
                                href={`/conseils/${related.slug}`}
                                className="group flex justify-between items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/30 transition-all"
                            >
                                <div className="space-y-1 min-w-0">
                                    <p className="text-sm font-semibold leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                                        {related.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground/70 flex items-center gap-2">
                                        <Clock className="w-3 h-3" />
                                        {related.readTime}
                                    </p>
                                </div>
                                <ArrowRight className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <div className="mt-8 text-center">
                <Link
                    href="/conseils"
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Tous les articles
                </Link>
            </div>
        </div>
    );
}
