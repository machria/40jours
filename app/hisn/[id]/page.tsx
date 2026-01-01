'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import HisnInvocationList from '@/components/hisn/HisnInvocationList';

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

            <HisnInvocationList hadiths={category.hadiths} categoryTitle={category.title} />
        </div>
    );
}
