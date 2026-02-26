import { articles } from '@/data/advice';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
    return articles.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({ params }: PageProps) {
    const { slug } = await params;
    const article = articles.find((a) => a.slug === slug);

    if (!article) {
        notFound();
    }

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
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                        {article.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-b pb-6">
                        <div className="flex items-center gap-1.5">
                            <User className="w-4 h-4" />
                            <span className="font-medium text-foreground">{article.author}</span>
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
                        }}
                    >
                        {article.content}
                    </ReactMarkdown>
                </div>
            </article>

            {/* Footer / Sharing (Optional in future) */}
            <hr className="my-12 border-muted" />
            <div className="text-center">
                <Link
                    href="/conseils"
                    className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
                >
                    Lire d'autres articles
                </Link>
            </div>
        </div>
    );
}
