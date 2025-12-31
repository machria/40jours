'use client';

import { useState, useTransition, FormEvent } from 'react';
import { Search, BookOpen, ScrollText } from 'lucide-react';
import Link from 'next/link';
import { searchQuran, searchTafsir, getAyahsData } from '@/app/search/actions';
import { searchHadith } from '@/app/search/hadith-actions';
import { TajwidText } from './TajwidText';

type SearchScope = 'quran' | 'hadith' | 'tafsir'; // Added 'tafsir'

export default function SearchInterface() {
    const [query, setQuery] = useState('');
    const [scope, setScope] = useState<SearchScope>('quran');
    const [isPending, startTransition] = useTransition();

    // Results
    const [quranResults, setQuranResults] = useState<any[]>([]);
    const [hadithResults, setHadithResults] = useState<any[]>([]);
    const [tafsirResults, setTafsirResults] = useState<any[]>([]); // New state for tafsir results

    const [hasSearched, setHasSearched] = useState(false);

    // Hydrated Quran/Tafsir Data (Ayah text, translation)
    const [ayahsData, setAyahsData] = useState<Record<string, any>>({});

    const handleSearch = (e: FormEvent) => { // Changed function signature
        e.preventDefault(); // Prevent default form submission
        if (!query.trim()) return; // Don't search if query is empty or just whitespace

        setHasSearched(true);
        startTransition(async () => {
            // Clear previous results for all scopes
            setQuranResults([]);
            setHadithResults([]);
            setTafsirResults([]);
            setAyahsData({});

            if (scope === 'quran') {
                const results = await searchQuran(query);
                setQuranResults(results);

                // Fetch full data for these results
                const data = await getAyahsData(results.map(r => ({ surah: r.surah, ayah: r.ayah })));
                const map: Record<string, any> = {};
                data.forEach((item: any) => {
                    map[`${item.surah}:${item.ayah}`] = item;
                });
                setAyahsData(map);
            } else if (scope === 'hadith') {
                const results = await searchHadith(query);
                setHadithResults(results);
            } else if (scope === 'tafsir') { // New Tafsir search logic
                const results = await searchTafsir(query);
                setTafsirResults(results);

                // Fetch full data for these results (same as Quran for now to show context)
                const data = await getAyahsData(results.map(r => ({ surah: r.surah, ayah: r.ayah })));
                const map: Record<string, any> = {};
                data.forEach((item: any) => {
                    map[`${item.surah}:${item.ayah}`] = item;
                });
                setAyahsData(map);
            }
        });
    };

    const cleanCollectionName = (name: string) => {
        return name.replace('fra-', '').replace('.json', '');
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
            <div className="flex flex-col gap-4 text-center">
                <h1 className="text-3xl font-bold tracking-tight">Recherche</h1>
                <p className="text-muted-foreground">
                    Recherchez dans le Coran, les Hadiths et le Tafsir
                </p>
            </div>

            {/* Search Box */}
            <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={
                        scope === 'quran' ? "Rechercher dans le Coran..." :
                            scope === 'hadith' ? "Rechercher dans les Hadiths..." :
                                "Rechercher dans le Tafsir..."
                    }
                    className="w-full pl-10 pr-4 py-3 rounded-lg border bg-card shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
                <button
                    type="submit"
                    disabled={isPending}
                    className="absolute right-2 top-2 px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    {isPending ? 'Recherche...' : 'Rechercher'}
                </button>
            </form>

            {/* Scope Toggles */}
            <div className="flex p-1 bg-muted rounded-lg w-fit mx-auto">
                <button
                    onClick={() => { setScope('quran'); setHasSearched(false); }}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${scope === 'quran' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    Coran
                </button>
                <button
                    onClick={() => { setScope('hadith'); setHasSearched(false); }}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${scope === 'hadith' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    Hadith
                </button>
                <button
                    onClick={() => { setScope('tafsir'); setHasSearched(false); }}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${scope === 'tafsir' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    Tafsir
                </button>
            </div>

            {/* Results */}
            {hasSearched && !isPending && (
                <div className="space-y-4">
                    {/* QURAN RESULTS */}
                    {scope === 'quran' && quranResults.map((res) => {
                        const ayah = ayahsData[`${res.surah}:${res.ayah}`]; // Use res.surah and res.ayah for key
                        if (!ayah) return null; // Loading or missing

                        return (
                            <Link
                                key={`${res.surah}-${res.ayah}`} // Use surah-ayah for key
                                href={`/coran/${res.surah}#ayah-${res.ayah}`}
                                className="block bg-card border rounded-lg p-4 hover:shadow-md transition-shadow hover:border-primary/50"
                            >
                                <div className="flex justify-between items-center mb-2 border-b pb-2">
                                    <span className="text-sm font-semibold text-primary">
                                        Sourate {res.surah}, Verset {res.ayah}
                                    </span>
                                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div className="space-y-2">
                                    <div className="text-right font-arabic text-xl text-foreground/80" dir="rtl">
                                        <TajwidText text={ayah.text} />
                                    </div>
                                    <p className="text-muted-foreground text-sm line-clamp-2">
                                        {ayah.translation}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}

                    {/* TAFSIR RESULTS */}
                    {scope === 'tafsir' && tafsirResults.map((res) => {
                        const ayah = ayahsData[`${res.surah}:${res.ayah}`]; // Use res.surah and res.ayah for key
                        if (!ayah) return null;

                        return (
                            <Link
                                key={`${res.surah}-${res.ayah}`} // Use surah-ayah for key
                                href={`/coran/${res.surah}/tafsir#ayah-${res.ayah}`} // Link to Tafsir page
                                className="block bg-card border rounded-lg p-4 hover:shadow-md transition-shadow hover:border-accent/50 group"
                            >
                                <div className="flex justify-between items-center mb-2 border-b pb-2">
                                    <span className="text-sm font-semibold text-accent group-hover:underline">
                                        Tafsir - Sourate {res.surah}, Verset {res.ayah}
                                    </span>
                                    <ScrollText className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-muted-foreground text-sm italic">
                                        Verse: {ayah.translation}
                                    </p>
                                    <div className="bg-accent/5 p-2 rounded text-xs text-foreground/70">
                                        Résultat trouvé dans le Tafsir (cliquez pour lire)
                                    </div>
                                </div>
                            </Link>
                        );
                    })}

                    {/* HADITH RESULTS */}
                    {scope === 'hadith' && hadithResults.map((hadith) => (
                        <Link
                            key={`${hadith.collection}-${hadith.number}`}
                            href={`/hadith/${hadith.collection}/section/${hadith.sectionId || '1'}`}
                            className="block bg-card border rounded-lg p-4 hover:shadow-md transition-shadow hover:border-emerald-500/50"
                        >
                            <div className="flex justify-between items-center mb-2 border-b pb-2">
                                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-1 rounded">
                                    {cleanCollectionName(hadith.collection)} {hadith.sectionId ? `- Section ${hadith.sectionId}` : ''}
                                </span>
                                <span className="text-xs text-muted-foreground">Hadith #{hadith.number}</span>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-foreground/90 line-clamp-3">
                                    {hadith.text}
                                </p>
                                {hadith.arabic && (
                                    <p className="text-right font-arabic text-lg text-muted-foreground/60 line-clamp-1 truncate" dir="rtl">
                                        {hadith.arabic}
                                    </p>
                                )}
                            </div>
                        </Link>
                    ))}

                    {/* NO RESULTS */}
                    {((scope === 'quran' && quranResults.length === 0) ||
                        (scope === 'hadith' && hadithResults.length === 0) ||
                        (scope === 'tafsir' && tafsirResults.length === 0)) && (
                            <div className="text-center py-12 text-muted-foreground">
                                <p>Aucun résultat trouvé pour "{query}"</p>
                            </div>
                        )}
                </div>
            )}
        </div>
    );
}
