'use client';

import { useState, useTransition } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { searchQuran, getAyahsData } from '@/app/search/actions';
import { TajwidText } from './TajwidText';

export default function SearchInterface() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [isPending, startTransition] = useTransition();
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = (term: string) => {
        setQuery(term);
        if (term.length < 2) {
            setResults([]);
            return;
        }

        startTransition(async () => {
            // 1. Get Matching Refs
            const matches = await searchQuran(term);

            // 2. Hydrate with Data (Text, Translate)
            const data = await getAyahsData(matches.map(m => ({ surah: m.surah, ayah: m.ayah })));

            setResults(data);
            setHasSearched(true);
        });
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                    type="text"
                    placeholder="Rechercher (ex: 'Moussa', 'موسى', 'Paradis')..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border bg-card shadow-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                {isPending && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                {hasSearched && results.length === 0 && !isPending && (
                    <div className="text-center text-muted-foreground py-8">
                        Aucun résultat trouvé pour "{query}"
                    </div>
                )}

                {results.map((ayah) => (
                    <Link
                        key={ayah.id}
                        href={`/coran/${ayah.surah}#ayah-${ayah.ayah}`}
                        className="block bg-card border rounded-lg p-4 hover:shadow-md transition-shadow hover:border-primary/50"
                    >
                        <div className="flex justify-between items-center mb-2 border-b pb-2">
                            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                                {ayah.surahName} (S{ayah.surah}:V{ayah.ayah})
                            </span>
                            <span className="text-xs text-muted-foreground">Page {ayah.page}</span>
                        </div>

                        <div className="text-right mb-3" dir="rtl">
                            <TajwidText
                                text={ayah.text}
                                className="font-kufi text-xl leading-loose"
                            />
                        </div>

                        <div className="text-sm text-foreground/80 leading-relaxed">
                            {ayah.translation}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
