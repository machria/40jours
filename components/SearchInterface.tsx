'use client';

import { useState, useTransition, FormEvent, useEffect, useRef } from 'react';
import { Search, BookOpen, ScrollText, Loader2, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { searchQuran, searchTafsir, getAyahsData } from '@/app/search/actions';
import { searchHadith } from '@/app/search/hadith-actions';
import { TajwidText } from './TajwidText';
import { useDebounce } from '@/hooks/useDebounce';

type SearchScope = 'quran' | 'hadith' | 'tafsir';

export default function SearchInterface() {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 300);
    const [scope, setScope] = useState<SearchScope>('quran');
    const [isPending, startTransition] = useTransition();

    // Results (Full Search)
    const [quranResults, setQuranResults] = useState<any[]>([]);
    const [hadithResults, setHadithResults] = useState<any[]>([]);
    const [tafsirResults, setTafsirResults] = useState<any[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [ayahsData, setAyahsData] = useState<Record<string, any>>({});

    // Autocomplete Suggestions
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // Handle clicks outside to close suggestions
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Effect for Autocomplete
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!debouncedQuery.trim() || debouncedQuery.length < 3) {
                setSuggestions([]);
                return;
            }

            setIsSearchingSuggestions(true);
            try {
                if (scope === 'quran') {
                    const results = await searchQuran(debouncedQuery, 5);
                    if (results.length > 0) {
                        const data = await getAyahsData(results.map(r => ({ surah: r.surah, ayah: r.ayah })));
                        const hydrated = results.map(r => {
                            const details = data.find((d: any) => d.surah == r.surah && d.ayah == r.ayah);
                            return { ...r, ...details };
                        });
                        setSuggestions(hydrated);
                    } else {
                        setSuggestions([]);
                    }

                } else if (scope === 'hadith') {
                    const results = await searchHadith(debouncedQuery, 5);
                    setSuggestions(results);

                } else if (scope === 'tafsir') {
                    const results = await searchTafsir(debouncedQuery, 5);
                    if (results.length > 0) {
                        const data = await getAyahsData(results.map(r => ({ surah: r.surah, ayah: r.ayah })));
                        const hydrated = results.map(r => {
                            const details = data.find((d: any) => d.surah == r.surah && d.ayah == r.ayah);
                            return { ...r, ...details };
                        });
                        setSuggestions(hydrated);
                    } else {
                        setSuggestions([]);
                    }
                }
                setShowSuggestions(true);
            } catch (error) {
                console.error("Autosuggest error", error);
            } finally {
                setIsSearchingSuggestions(false);
            }
        };

        // Don't trigger if user just hit enter (hasSearched might be a proxy, but let's just use debouncedQuery)
        // Actually if we just searched, we might not want to re-open suggestions immediately unless user types again.
        // For now, simple logic.
        fetchSuggestions();

    }, [debouncedQuery, scope]);


    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setShowSuggestions(false);
        setHasSearched(true);
        startTransition(async () => {
            // Clear previous results
            setQuranResults([]);
            setHadithResults([]);
            setTafsirResults([]);
            setAyahsData({});

            if (scope === 'quran') {
                const results = await searchQuran(query, 50);
                setQuranResults(results);
                const data = await getAyahsData(results.map(r => ({ surah: r.surah, ayah: r.ayah })));
                const map: Record<string, any> = {};
                data.forEach((item: any) => { map[`${item.surah}:${item.ayah}`] = item; });
                setAyahsData(map);
            } else if (scope === 'hadith') {
                const results = await searchHadith(query, 60);
                setHadithResults(results);
            } else if (scope === 'tafsir') {
                const results = await searchTafsir(query, 50);
                setTafsirResults(results);
                const data = await getAyahsData(results.map(r => ({ surah: r.surah, ayah: r.ayah })));
                const map: Record<string, any> = {};
                data.forEach((item: any) => { map[`${item.surah}:${item.ayah}`] = item; });
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

            {/* Scope Toggles */}
            <div className="flex p-1 bg-muted rounded-lg w-fit mx-auto mb-6">
                {(['quran', 'hadith', 'tafsir'] as SearchScope[]).map((s) => (
                    <button
                        key={s}
                        onClick={() => {
                            setScope(s);
                            setHasSearched(false);
                            setQuery('');
                            setSuggestions([]);
                        }}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all capitalize ${scope === s ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        {s === 'quran' ? 'Coran' : s}
                    </button>
                ))}
            </div>

            {/* Search Box Container */}
            <div className="relative z-20" ref={searchContainerRef}>
                <form onSubmit={handleSearch} className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {isSearchingSuggestions ? (
                            <Loader2 className="h-5 w-5 text-primary animate-spin" />
                        ) : (
                            <Search className="h-5 w-5 text-muted-foreground" />
                        )}
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => {
                            if (suggestions.length > 0) setShowSuggestions(true);
                        }}
                        placeholder={`Rechercher dans ${scope === 'quran' ? 'le Coran' : scope === 'hadith' ? 'les Hadiths' : 'le Tafsir'}...`}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border bg-card shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    />
                    <button
                        type="submit"
                        disabled={isPending}
                        className="absolute right-2 top-2 px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {isPending ? 'Search...' : 'Rechercher'}
                    </button>
                </form>

                {/* Autocomplete Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full mt-2 w-full bg-popover border rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                        <div className="max-h-[60vh] overflow-y-auto max-w-full">
                            {suggestions.map((item, idx) => {
                                // QURAN & TAFSIR SUGGESTION
                                if (scope === 'quran' || scope === 'tafsir') {
                                    return (
                                        <Link
                                            key={`${item.surah}-${item.ayah}-${idx}`}
                                            href={scope === 'quran'
                                                ? `/coran/${item.surah}#ayah-${item.ayah}`
                                                : `/coran/${item.surah}/tafsir#ayah-${item.ayah}`
                                            }
                                            onClick={() => setShowSuggestions(false)}
                                            className="flex flex-col gap-1 p-3 border-b last:border-0 hover:bg-accent/50 transition-colors cursor-pointer"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-semibold text-primary flex items-center gap-2">
                                                    {scope === 'tafsir' ? <ScrollText className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                                                    Sourate {item.surah}, Verset {item.ayah}
                                                </span>
                                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                            </div>
                                            {item.text && (
                                                <div className="text-right font-arabic text-lg text-foreground/70 truncate" dir="rtl">
                                                    <TajwidText text={item.text} />
                                                </div>
                                            )}
                                            {item.translation && (
                                                <p className="text-xs text-muted-foreground line-clamp-1">{item.translation}</p>
                                            )}
                                        </Link>
                                    );
                                }
                                // HADITH SUGGESTION
                                else if (scope === 'hadith') {
                                    return (
                                        <Link
                                            key={`${item.collection}-${item.number}-${idx}`}
                                            href={`/hadith/${item.collection}/section/${item.sectionId || '1'}#h${item.number}`}
                                            onClick={() => setShowSuggestions(false)}
                                            className="flex flex-col gap-1 p-3 border-b last:border-0 hover:bg-accent/50 transition-colors cursor-pointer"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold uppercase text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                                    {cleanCollectionName(item.collection)} #{item.number}
                                                </span>
                                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                            </div>
                                            <p className="text-sm text-foreground/80 line-clamp-2">
                                                {item.text}
                                            </p>
                                        </Link>
                                    );
                                }
                                return null;
                            })}
                        </div>
                        <div className="p-2 bg-muted/30 text-center border-t">
                            <button
                                onClick={handleSearch}
                                className="text-xs text-primary hover:underline font-medium"
                            >
                                Voir tous les résultats
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Results List (Original Logic) */}
            {hasSearched && !isPending && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* QURAN RESULTS */}
                    {scope === 'quran' && quranResults.map((res) => {
                        const ayah = ayahsData[`${res.surah}:${res.ayah}`];
                        if (!ayah) return null;

                        return (
                            <Link
                                key={`${res.surah}-${res.ayah}`}
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
                        const ayah = ayahsData[`${res.surah}:${res.ayah}`];
                        if (!ayah) return null;

                        return (
                            <Link
                                key={`${res.surah}-${res.ayah}`}
                                href={`/coran/${res.surah}/tafsir#ayah-${res.ayah}`}
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
                            href={`/hadith/${hadith.collection}/section/${hadith.sectionId || '1'}#h${hadith.number}`}
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
