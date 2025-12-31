'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import HisnCard from '@/components/hisn/HisnCard';

type HisnCategorySummary = {
    id: number;
    title: string;
    hadithCount: number;
};

export default function HisnPage() {
    const [categories, setCategories] = useState<HisnCategorySummary[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<HisnCategorySummary[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await fetch('/api/hisn');
                if (!response.ok) throw new Error('Failed to fetch data');
                const data = await response.json();
                setCategories(data);
                setFilteredCategories(data);
            } catch (error) {
                console.error('Error fetching Hisn data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchCategories();
    }, []);

    useEffect(() => {
        const output = categories.filter((cat) =>
            cat.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredCategories(output);
    }, [searchQuery, categories]);

    if (loading) {
        return (
            <div className="container py-8 px-4 md:px-6">
                <div className="flex flex-col gap-4 mb-8">
                    <div className="h-10 w-48 bg-muted animate-pulse rounded-md"></div>
                    <div className="h-10 w-full max-w-md bg-muted animate-pulse rounded-md"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-48 bg-muted animate-pulse rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container py-8 px-4 md:px-6 space-y-8">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Citadelle du Musulman</h1>
                <p className="text-muted-foreground text-lg">
                    Recueil d&apos;invocations et d&apos;évocations tirées du Coran et de la Sunna
                </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                    type="text"
                    placeholder="Rechercher une invocation..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((category) => (
                    <HisnCard key={category.id} category={category} />
                ))}
            </div>

            {filteredCategories.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">Aucune invocation trouvée pour "{searchQuery}"</p>
                </div>
            )}
        </div>
    );
}
