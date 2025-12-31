'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Copy, Share2 } from 'lucide-react';

type Hadith = {
    id: number;
    arabic: string;
    french: string;
    source: string;
    repeat: number;
};

type HisnCategory = {
    id: number;
    title: string;
    hadiths: Hadith[];
};

export default function HisnDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params using React.use()
    const { id } = use(params);

    const [category, setCategory] = useState<HisnCategory | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCategory() {
            try {
                const response = await fetch(`/api/hisn/${id}`);
                if (!response.ok) throw new Error('Failed to fetch category');
                const data = await response.json();
                setCategory(data);
            } catch (error) {
                console.error('Error fetching Hisn category:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchCategory();
    }, [id]);

    if (loading) {
        return (
            <div className="container py-8 px-4 max-w-4xl mx-auto space-y-6">
                <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
                <div className="h-12 w-3/4 bg-muted animate-pulse rounded"></div>
                <div className="space-y-8 mt-8">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-64 bg-muted animate-pulse rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="container py-12 text-center">
                <h2 className="text-2xl font-bold mb-4">Catégorie non trouvée</h2>
                <Link href="/hisn" className="text-primary hover:underline">
                    Retour à la liste
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-8 px-4 max-w-4xl mx-auto">
            <div className="mb-6">
                <Link
                    href="/hisn"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Retour aux invocations
                </Link>
                <h1 className="text-2xl md:text-3xl font-bold leading-tight text-primary">
                    {category.title}
                </h1>
            </div>

            <div className="space-y-8">
                {category.hadiths.map((hadith, index) => (
                    <div
                        key={hadith.id}
                        className="flex flex-col bg-card border rounded-xl overflow-hidden shadow-sm"
                    >
                        {/* Header/Counter */}
                        <div className="bg-muted/30 px-4 py-2 border-b flex justify-between items-center">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Invocation {index + 1}/{category.hadiths.length}
                            </span>
                            <div className="flex gap-2">
                                {/* Placeholder buttons for future functionality */}
                                <button className="p-1.5 hover:bg-muted rounded-md transition-colors" title="Copier">
                                    <Copy className="w-4 h-4 text-muted-foreground" />
                                </button>
                                <button className="p-1.5 hover:bg-muted rounded-md transition-colors" title="Partager">
                                    <Share2 className="w-4 h-4 text-muted-foreground" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 md:p-8 space-y-6">
                            {/* Arabic Text */}
                            <div className="text-right" dir="rtl">
                                <p className="text-2xl md:text-3xl leading-relaxed md:leading-loose font-arabic text-primary/90">
                                    {hadith.arabic}
                                </p>
                            </div>

                            {/* Transliteration / Source */}
                            {hadith.source && (
                                <div className="p-4 bg-accent/30 rounded-lg">
                                    <p className="text-sm md:text-base italic text-muted-foreground/90 leading-relaxed">
                                        {hadith.source}
                                    </p>
                                </div>
                            )}

                            {/* French Translation */}
                            <div>
                                <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
                                    {hadith.french}
                                </p>
                            </div>

                            {/* Repeat Count */}
                            {hadith.repeat > 1 && (
                                <div className="flex justify-end pt-2">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                                        À répéter {hadith.repeat} fois
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
