'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Trophy, Sparkles, X, Filter, BookOpen } from 'lucide-react';
import HisnCard from '@/components/hisn/HisnCard';

type HisnCategorySummary = {
    id: number;
    title: string;
    hadithCount: number;
};

interface HisnClientProps {
    categories: HisnCategorySummary[];
}

type TabType = 'all' | 'daily' | 'prayer' | 'protection' | 'travel' | 'hajj' | 'social';

const TABS: { value: TabType; label: string; icon: string }[] = [
    { value: 'all', label: 'Tout', icon: '📚' },
    { value: 'daily', label: 'Quotidien', icon: '🌅' },
    { value: 'prayer', label: 'Prière & Rituels', icon: '🕌' },
    { value: 'protection', label: 'Protection & Épreuves', icon: '🛡️' },
    { value: 'travel', label: 'Voyage & Nature', icon: '🚗' },
    { value: 'hajj', label: 'Hajj & Omra', icon: '🕋' },
    { value: 'social', label: 'Relations & Social', icon: '🤝' },
];

const getCategoryGroup = (id: number): TabType => {
    // 1. Hajj & Omra
    if (id >= 115 && id <= 121) return 'hajj';

    // 2. Prière & Rituels
    if ((id >= 12 && id <= 26) || id === 42 || id === 107) return 'prayer';

    // 3. Voyage & Nature
    if ((id >= 61 && id <= 67) || (id >= 95 && id <= 105)) return 'travel';

    // 4. Protection & Épreuves
    if (
        (id >= 34 && id <= 41) || 
        (id >= 43 && id <= 60) || 
        id === 82 || 
        id === 83 || 
        id === 88 || 
        id === 91 || 
        id === 92 || 
        id === 94 || 
        id === 124 || 
        id === 125 || 
        id === 128
    ) return 'protection';

    // 5. Relations & Social
    if (
        id === 47 || 
        id === 48 || 
        (id >= 79 && id <= 81) || 
        (id >= 84 && id <= 87) || 
        id === 89 || 
        id === 90 || 
        id === 93 || 
        id === 108 || 
        id === 109 || 
        (id >= 112 && id <= 114) || 
        id === 132
    ) return 'social';

    // 6. Quotidien (Sommeil, Repas, Réveil, etc. et divers)
    return 'daily';
};

const SUGGESTIONS = ['Matin', 'Soir', 'Prière', 'Voyage', 'Pardon', 'Tristesse'];

export default function HisnClient({ categories }: HisnClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<TabType>('all');

    // Calculate overall statistics
    const totalInvocations = useMemo(() => {
        return categories.reduce((sum, cat) => sum + cat.hadithCount, 0);
    }, [categories]);

    // Filtering categories based on tab and search query
    const filteredCategories = useMemo(() => {
        return categories.filter((cat) => {
            const matchesSearch = cat.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTab = activeTab === 'all' || getCategoryGroup(cat.id) === activeTab;
            return matchesSearch && matchesTab;
        });
    }, [searchQuery, activeTab, categories]);

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    const handleResetAll = () => {
        setSearchQuery('');
        setActiveTab('all');
    };

    return (
        <div className="min-h-screen bg-background pb-24">
            
            {/* Rich Hero Header Area */}
            <header className="relative overflow-hidden bg-gradient-to-br from-emerald-500/15 via-primary/5 to-transparent border-b py-12 md:py-16 px-4 md:px-8">
                {/* Visual decorative circles */}
                <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />

                <div className="container max-w-6xl mx-auto relative z-10 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Citadelle Authentique</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black font-kufi text-foreground tracking-tight">
                                Citadelle du Musulman
                            </h1>
                            <p className="text-muted-foreground text-base md:text-lg max-w-xl">
                                Le recueil complet d'invocations (Du'a) et de rappels (Adhkar) pour accompagner chaque moment de votre journée.
                            </p>
                        </div>
                        
                        {/* Interactive action cards */}
                        <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
                            <Link
                                href="/hisn/flashcards"
                                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2.5 px-5 py-3 bg-card border rounded-2xl hover:border-primary/30 shadow-sm transition-all hover:scale-[1.02] font-semibold text-sm hover:shadow-md"
                            >
                                <span className="text-xl">📇</span>
                                <div className="text-left leading-tight">
                                    <div className="font-bold text-foreground">Flashcards</div>
                                    <div className="text-[10px] text-muted-foreground font-normal">Mémoriser par cartes</div>
                                </div>
                            </Link>
                            <Link
                                href="/hisn/quiz"
                                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2.5 px-5 py-3 bg-primary text-primary-foreground rounded-2xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] font-semibold text-sm hover:bg-primary/95"
                            >
                                <Trophy className="w-5 h-5 text-primary-foreground/90" />
                                <div className="text-left leading-tight">
                                    <div className="font-bold">Quiz Infini</div>
                                    <div className="text-[10px] text-primary-foreground/75 font-normal">Tester ses connaissances</div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Stats pills */}
                    <div className="flex flex-wrap gap-3 pt-2 text-xs font-semibold text-muted-foreground">
                        <div className="bg-card/80 border px-3 py-1.5 rounded-full flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-primary" />
                            <span>{categories.length} Chapitres</span>
                        </div>
                        <div className="bg-card/80 border px-3 py-1.5 rounded-full flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>{totalInvocations} Invocations au total</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Interactive controls container */}
            <main className="container max-w-6xl mx-auto px-4 md:px-8 mt-10 space-y-8">
                
                {/* Search and Suggestions */}
                <div className="space-y-4">
                    <div className="relative max-w-2xl">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-muted-foreground/70" />
                        </div>
                        <input
                            type="text"
                            placeholder="Rechercher une invocation par mot-clé (ex: matin, sommeil, maladie...)"
                            className="w-full pl-11 pr-12 py-3.5 rounded-2xl border bg-card focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-[15px] shadow-sm font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                onClick={handleClearSearch}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-foreground text-muted-foreground transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>

                    {/* Search suggestion tags */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-muted-foreground font-medium flex items-center gap-1">
                            <Filter className="w-3 h-3" />
                            Suggestions :
                        </span>
                        {SUGGESTIONS.map((sug) => (
                            <button
                                key={sug}
                                onClick={() => setSearchQuery(sug)}
                                className={`px-3 py-1.5 rounded-xl border font-medium transition-all ${
                                    searchQuery.toLowerCase() === sug.toLowerCase()
                                        ? 'bg-primary/10 border-primary/30 text-primary'
                                        : 'bg-card border-border text-muted-foreground hover:bg-muted'
                                }`}
                            >
                                {sug}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="border-b pb-2">
                    <div className="flex overflow-x-auto no-scrollbar gap-1.5 pb-2 -mb-2 text-sm">
                        {TABS.map((tab) => {
                            const isActive = activeTab === tab.value;
                            return (
                                <button
                                    key={tab.value}
                                    onClick={() => setActiveTab(tab.value)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold transition-all whitespace-nowrap border ${
                                        isActive
                                            ? 'bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/15'
                                            : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted/30'
                                    }`}
                                >
                                    <span>{tab.icon}</span>
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Category Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCategories.map((category) => (
                        <HisnCard key={category.id} category={category} />
                    ))}
                </div>

                {/* No results placeholder */}
                {filteredCategories.length === 0 && (
                    <div className="text-center py-16 bg-card border rounded-3xl p-8 max-w-md mx-auto space-y-4 shadow-sm animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto text-2xl">
                            🔎
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-bold text-lg">Aucun résultat trouvé</h3>
                            <p className="text-muted-foreground text-sm text-balance">
                                Nous n'avons trouvé aucune invocation correspondant à vos critères actuels.
                            </p>
                        </div>
                        <button
                            onClick={handleResetAll}
                            className="bg-primary hover:bg-primary/95 text-primary-foreground text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow"
                        >
                            Réinitialiser la recherche
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
