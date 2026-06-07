'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { articles, type Article } from '@/data/advice';
import { ArrowRight, Clock, Scroll, Users, LayoutGrid, LayoutList, Sparkles, Search, X, Filter } from 'lucide-react';
import { cn } from "@/lib/utils";

// ─── Catégories ──────────────────────────────────────────────────────────────

const CATEGORIES = [
    "Sagesse d'Al-Ghazali",
    "Méthodologie Coranique",
    "Spiritualité & Guérison",
    "Vivre l'Islam & Productivité",
    "Sciences & Compréhension",
] as const;

const CATEGORY_EMOJI: Record<string, string> = {
    "Sagesse d'Al-Ghazali": '📚',
    'Méthodologie Coranique': '📖',
    'Spiritualité & Guérison': '💫',
    "Vivre l'Islam & Productivité": '⚡',
    'Sciences & Compréhension': '🔬',
};

const SHORT_LABELS: Record<string, string> = {
    "Sagesse d'Al-Ghazali": 'Savant',
    'Méthodologie Coranique': 'Coran',
    'Spiritualité & Guérison': 'Spiritualité',
    "Vivre l'Islam & Productivité": 'Productivité',
    'Sciences & Compréhension': 'Sciences',
};

const CATEGORY_ACCENT: Record<string, { badge: string; border: string }> = {
    "Sagesse d'Al-Ghazali":        { badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400', border: 'border-l-amber-400' },
    'Méthodologie Coranique':       { badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',   border: 'border-l-blue-400' },
    'Spiritualité & Guérison':      { badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400', border: 'border-l-violet-400' },
    "Vivre l'Islam & Productivité": { badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400', border: 'border-l-emerald-400' },
    'Sciences & Compréhension':     { badge: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400',   border: 'border-l-teal-400' },
};

// ─── Tags émotionnels ─────────────────────────────────────────────────────────

type EmotionalTag = 'motivant' | 'apaisant' | 'profond' | 'pratique' | 'savant' | 'surprenant' | 'touchant';

const TAG_CONFIG: Record<EmotionalTag, { label: string; emoji: string; active: string; inactive: string }> = {
    motivant:   { label: 'Motivant',    emoji: '🔥', active: 'bg-orange-500 text-white border-orange-500 shadow-sm', inactive: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800' },
    apaisant:   { label: 'Apaisant',   emoji: '😌', active: 'bg-sky-500 text-white border-sky-500 shadow-sm',    inactive: 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800' },
    profond:    { label: 'Profond',    emoji: '🌌', active: 'bg-violet-600 text-white border-violet-600 shadow-sm', inactive: 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800' },
    pratique:   { label: 'Pratique',   emoji: '⚡', active: 'bg-emerald-500 text-white border-emerald-500 shadow-sm', inactive: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' },
    savant:     { label: 'Savant',     emoji: '📚', active: 'bg-amber-500 text-white border-amber-500 shadow-sm',  inactive: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' },
    surprenant: { label: 'Surprenant', emoji: '🤯', active: 'bg-yellow-500 text-white border-yellow-500 shadow-sm', inactive: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800' },
    touchant:   { label: 'Touchant',   emoji: '❤️', active: 'bg-rose-500 text-white border-rose-500 shadow-sm',   inactive: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800' },
};

const CATEGORY_DEFAULT_TAGS: Record<string, EmotionalTag[]> = {
    "Sagesse d'Al-Ghazali":        ['savant', 'profond'],
    'Méthodologie Coranique':       ['pratique'],
    'Spiritualité & Guérison':      ['apaisant'],
    "Vivre l'Islam & Productivité": ['pratique', 'motivant'],
    'Sciences & Compréhension':     ['savant', 'surprenant'],
};

const ARTICLE_TAGS: Record<string, EmotionalTag[]> = {
    'ghazali-ihya-quart-adorations':    ['savant', 'profond'],
    'ghazali-ihya-quart-habitudes':     ['savant', 'pratique'],
    'ghazali-ihya-quart-perils':        ['savant', 'profond'],
    'ghazali-ihya-quart-sauvrices':     ['savant', 'motivant'],
    'devenir-hafiz-methododes':         ['pratique', 'motivant'],
    'importance-langue-arabe':          ['motivant', 'pratique'],
    'memoriser-premier-juz':            ['pratique', 'motivant'],
    'art-du-tadabbur':                  ['pratique', 'apaisant'],
    'tajwid-obligation-ou-excellence':  ['pratique', 'surprenant'],
    'citadelle-musulman-protection':    ['pratique', 'apaisant'],
    'reussir-defi-40-jours':            ['pratique', 'motivant'],
    '99-noms-cle-invocation':           ['apaisant', 'pratique'],
    '99-noms-guide-invocation':         ['pratique', 'apaisant'],
    'plan-40-jours-transformation':     ['motivant', 'profond'],
    'grammaire-vocabulaire-duo-gagnant':['pratique', 'motivant'],
    'science-tafsir-comprendre-allah':  ['savant', 'profond'],
    'guide-lecture-hadith':             ['savant', 'pratique'],
    'sira-chronologie-revelation':      ['savant', 'surprenant'],
    'importance-etude-sira':            ['motivant', 'savant'],
    'importance-sunnah-hadith':         ['savant', 'profond'],
    'baraka-temps-organisation':        ['pratique', 'motivant'],
    'deep-work-spirituel':              ['pratique', 'motivant'],
    'routine-fajr-succes':              ['pratique', 'motivant'],
    'anxiete-tristesse-remedes':        ['apaisant', 'touchant'],
    'secrets-istijaba-invocation':      ['profond', 'pratique'],
    '5-histoires-echec-coran':          ['motivant', 'touchant'],
    '3-moments-dua-rejetee':            ['surprenant', 'profond'],
    'destin-qadar-pour-les-nuls':       ['profond', 'surprenant'],
    'hasad-maladie-invisible':          ['profond', 'surprenant'],
    'ijaz-coran-miracle-inimitabilite': ['surprenant', 'savant'],
    'ghazali-alchimie-bonheur-connaissance-soi': ['profond', 'savant'],
    'puissance-istighfar-debloquer-destin':      ['apaisant', 'motivant'],
    'riya-ostentation-ennemi-invisible':         ['profond', 'surprenant'],
    'isra-miraj-voyage-nocturne-prophete':       ['surprenant', 'profond'],
    'barzakh-vie-tombe-resurrection':            ['profond', 'surprenant'],
    'ibn-khaldun-muqaddimah-pere-sociologie':    ['surprenant', 'savant'],
    'mort-preparatifs-manuel-croyant':           ['profond', 'touchant'],
    'dhikr-neurosciences-science-confirme-rappel-allah': ['surprenant', 'savant'],
    'les-6-livres-hadith-sunnisme':              ['savant'],
    'tawakkul-lacher-prise':                     ['apaisant', 'pratique'],
    '10-sourates-protectrices':                  ['pratique', 'apaisant'],
    'coran-enfants-amour':                       ['touchant', 'pratique'],
    'maison-qibla-environnement':                ['pratique', 'apaisant'],
    'histoire-compilation-coran':                ['savant', 'surprenant'],
    'comprendre-4-madhabs-misericorde':          ['savant', 'surprenant'],
    'femmes-savantes-islam-modeles':             ['surprenant', 'touchant'],
    'makki-madani-comprendre-ambiance':          ['savant'],
    'murajaah-art-ne-pas-oublier':               ['pratique'],
    'gerer-colere-sunnah-methode':               ['pratique', 'apaisant'],
    'waswas-identifier-ignorer-liberer':         ['pratique', 'apaisant'],
    'sieste-qaylula-productivite':               ['pratique', 'surprenant'],
    'alimentation-prophetique-conscience':       ['pratique', 'surprenant'],
    '7-habitudes-sante-prophete':                ['pratique', 'motivant'],
    'secrets-sujud-prosternation':               ['profond', 'apaisant'],
    'khushu-concentration-secours':              ['pratique', 'profond'],
    'isnad-transmission-unique-islam':           ['savant', 'surprenant'],
    'aqeedah-6-piliers-foi-debutants':           ['savant'],
    'argent-halal-rizq-benediction':             ['pratique', 'profond'],
    'famille-islamique-fondation-ummah':         ['touchant', 'profond'],
    'shukr-gratitude-cle-abondance':             ['apaisant', 'motivant'],
    'tawba-repentir-porte-toujours-ouverte':     ['apaisant', 'touchant'],
    'ibn-qayyim-niveaux-sabr':                   ['profond', 'savant'],
    'ibn-rajab-espoir-crainte-rajaa-khawf':      ['profond', 'savant'],
    'asbab-nuzul-contexte-revelation-coran':     ['savant'],
    'nasikh-mansukh-abrogation-coran':           ['savant'],
    'comprendre-qiraat-variantes-recitation':    ['savant', 'surprenant'],
    'secret-waqf-ibtida-pauses-recitation':      ['pratique', 'savant'],
    'ghazali-lettre-disciple-science-action':    ['savant', 'profond'],
    'comprendre-epreuve-sagesse-souffrance':     ['profond', 'touchant'],
    'minimalisme-numerique-foi-attention':       ['pratique', 'profond'],
    'economie-halal-gestion-finances-ethiques':  ['pratique'],
    'ecologie-islam-croyant-gardien-terre':      ['surprenant', 'profond'],
    'foi-science-age-dor-islam':                 ['surprenant', 'savant'],
    'muhasaba-bilan-ame-al-muhasibi':            ['profond', 'pratique'],
    'ulum-quran-12-sciences-livre-sacre':        ['savant'],
    'fiqh-minorites-musulman-occident':          ['pratique', 'profond'],
    'jarh-tadil-critique-transmetteurs-hadith':  ['savant'],
    'usul-fiqh-fondements-jurisprudence-islamique': ['savant'],
    'amthal-paraboles-coran-pedagogie-divine':   ['savant', 'profond'],
    'mahabba-amour-allah-plus-haute-station':    ['profond', 'apaisant'],
    'silat-rahim-liens-familiaux-obligation-barakah': ['touchant', 'pratique'],
};

function getArticleTags(article: Article): EmotionalTag[] {
    return ARTICLE_TAGS[article.slug] ?? CATEGORY_DEFAULT_TAGS[article.category] ?? ['pratique'];
}

// ─── Articles à la une (pool provocateur) ─────────────────────────────────────

const PROVOCATEUR_SLUGS = [
    'deep-work-spirituel',
    'anxiete-tristesse-remedes',
    'secrets-istijaba-invocation',
    '5-histoires-echec-coran',
    '3-moments-dua-rejetee',
    'destin-qadar-pour-les-nuls',
    'hasad-maladie-invisible',
    'ijaz-coran-miracle-inimitabilite',
    'ghazali-alchimie-bonheur-connaissance-soi',
    'puissance-istighfar-debloquer-destin',
    'riya-ostentation-ennemi-invisible',
    'isra-miraj-voyage-nocturne-prophete',
    'barzakh-vie-tombe-resurrection',
    'ibn-khaldun-muqaddimah-pere-sociologie',
    'mort-preparatifs-manuel-croyant',
    'dhikr-neurosciences-science-confirme-rappel-allah',
];

const SEARCH_SUGGESTIONS = ['Coran', 'Prière', 'Pardon', 'Cœur', 'Mort', 'Foi', 'Ghazali', 'Hadith'];

// ─── Sous-composants stateless ─────────────────────────────────────────────────

function AuthorChip({ author }: { author: string }) {
    const isGhazali = author === 'Imam Al-Ghazali';
    return (
        <span className={cn(
            "inline-flex items-center gap-1 text-xs font-medium",
            isGhazali ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'
        )}>
            {isGhazali ? <Scroll className="w-3 h-3 shrink-0" /> : <Users className="w-3 h-3 shrink-0" />}
            {isGhazali ? 'Imam Al-Ghazali' : 'Équipe 40 Jours'}
        </span>
    );
}

function TagPills({ article, max = 2 }: { article: Article; max?: number }) {
    const tags = getArticleTags(article).slice(0, max);
    return (
        <div className="flex items-center gap-1 flex-wrap">
            {tags.map(tag => (
                <span key={tag} className={cn(
                    "inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border",
                    TAG_CONFIG[tag].inactive
                )}>
                    {TAG_CONFIG[tag].emoji} {TAG_CONFIG[tag].label}
                </span>
            ))}
        </div>
    );
}

// ─── Composant principal ───────────────────────────────────────────────────────

export default function ConseilsContent() {
    const searchParams = useSearchParams();
    const initialCat = searchParams.get('cat') ?? 'Tout';

    const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
    const [selectedTag, setSelectedTag] = useState<EmotionalTag | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [spotlightPicks, setSpotlightPicks] = useState<Article[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        const cat = searchParams.get('cat');
        if (cat && CATEGORIES.includes(cat as typeof CATEGORIES[number])) {
            setSelectedCategory(cat);
        }
    }, [searchParams]);

    useEffect(() => {
        const pool = articles.filter(a => PROVOCATEUR_SLUGS.includes(a.slug));
        const shuffled = [...pool].sort(() => Math.random() - 0.5);
        setSpotlightPicks(shuffled.slice(0, 4));
    }, []);

    const isFiltered = !!searchQuery || !!selectedTag || selectedCategory !== 'Tout';

    const filteredArticles = useMemo(() => {
        return articles.filter(a => {
            const q = searchQuery.toLowerCase();
            const matchesSearch = !q ||
                a.title.toLowerCase().includes(q) ||
                a.excerpt.toLowerCase().includes(q);
            const matchesCategory = selectedCategory === 'Tout' || a.category === selectedCategory;
            const matchesTag = !selectedTag || getArticleTags(a).includes(selectedTag);
            return matchesSearch && matchesCategory && matchesTag;
        });
    }, [searchQuery, selectedCategory, selectedTag]);

    const groupedArticles = useMemo(() => CATEGORIES.reduce((acc, cat) => {
        acc[cat] = filteredArticles.filter(a => a.category === cat);
        return acc;
    }, {} as Record<typeof CATEGORIES[number], Article[]>), [filteredArticles]);

    const handleReset = () => {
        setSearchQuery('');
        setSelectedTag(null);
        setSelectedCategory('Tout');
    };

    return (
        <div className="space-y-6">

            {/* ── Barre de recherche ── */}
            <div className="space-y-3">
                <div className="relative max-w-full">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-muted-foreground/60" />
                    </div>
                    <input
                        type="text"
                        placeholder="Rechercher un article... (ex: pardon, mort, cœur, Ghazali)"
                        className="w-full pl-11 pr-10 py-3 rounded-2xl border bg-card focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-sm shadow-sm"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Suggestions rapides */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="flex items-center gap-1 text-muted-foreground font-medium">
                        <Filter className="w-3 h-3" />
                        Suggestions :
                    </span>
                    {SEARCH_SUGGESTIONS.map(s => (
                        <button
                            key={s}
                            onClick={() => setSearchQuery(q => q === s ? '' : s)}
                            className={cn(
                                "px-3 py-1 rounded-xl border font-medium transition-all",
                                searchQuery === s
                                    ? 'bg-primary/10 border-primary/30 text-primary'
                                    : 'bg-card border-border text-muted-foreground hover:bg-muted'
                            )}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Tags émotionnels ── */}
            <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Ce que vous cherchez à ressentir
                </p>
                <div className="flex flex-wrap gap-2">
                    {(Object.entries(TAG_CONFIG) as [EmotionalTag, typeof TAG_CONFIG[EmotionalTag]][]).map(([key, cfg]) => (
                        <button
                            key={key}
                            onClick={() => setSelectedTag(t => t === key ? null : key)}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all",
                                selectedTag === key ? cfg.active : cfg.inactive
                            )}
                        >
                            <span>{cfg.emoji}</span>
                            {cfg.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Tabs catégories + toggle vue ── */}
            <div className="flex items-end gap-2 border-b pb-2">
                <div className="flex overflow-x-auto no-scrollbar gap-1.5 flex-1 pb-1">
                    <button
                        onClick={() => setSelectedCategory('Tout')}
                        className={cn(
                            "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border shrink-0",
                            selectedCategory === 'Tout'
                                ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                                : "bg-card border-border text-muted-foreground hover:bg-muted"
                        )}
                    >
                        <LayoutGrid className="w-3.5 h-3.5" />
                        Tout
                        <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-bold",
                            selectedCategory === 'Tout' ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                        )}>
                            {articles.length}
                        </span>
                    </button>

                    {CATEGORIES.map(cat => {
                        const active = selectedCategory === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={cn(
                                    "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border shrink-0",
                                    active
                                        ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                                        : "bg-card border-border text-muted-foreground hover:bg-muted"
                                )}
                            >
                                <span>{CATEGORY_EMOJI[cat]}</span>
                                {SHORT_LABELS[cat]}
                                <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-bold",
                                    active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                                )}>
                                    {articles.filter(a => a.category === cat).length}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')}
                    className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full border border-border hover:bg-muted transition-colors mb-1"
                    title={viewMode === 'grid' ? 'Vue liste compacte' : 'Vue cartes'}
                >
                    {viewMode === 'grid' ? <LayoutList className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
                </button>
            </div>

            {/* ── Spotlight (seulement si aucun filtre actif) ── */}
            {!isFiltered && spotlightPicks.length > 0 && (
                <section>
                    <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                        <Sparkles className="w-3.5 h-3.5" />
                        À lire aujourd'hui
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {spotlightPicks.map(a => <SpotlightCard key={a.slug} article={a} />)}
                    </div>
                </section>
            )}

            {/* ── Résumé filtres actifs ── */}
            {isFiltered && (
                <div className="flex items-center gap-3 text-sm">
                    <span className="text-muted-foreground">
                        <span className="font-bold text-foreground">{filteredArticles.length}</span> article{filteredArticles.length > 1 ? 's' : ''} trouvé{filteredArticles.length > 1 ? 's' : ''}
                    </span>
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                        <X className="w-3 h-3" />
                        Tout effacer
                    </button>
                </div>
            )}

            {/* ── Contenu principal ── */}
            <div className="min-h-[30vh]">
                {filteredArticles.length === 0 ? (
                    <div className="text-center py-16 bg-card border rounded-3xl p-8 max-w-md mx-auto space-y-4 animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto text-3xl">🔎</div>
                        <div>
                            <h3 className="font-bold text-lg">Aucun article trouvé</h3>
                            <p className="text-muted-foreground text-sm mt-1">
                                Essayez d'autres mots-clés ou changez les filtres.
                            </p>
                        </div>
                        <button
                            onClick={handleReset}
                            className="bg-primary text-primary-foreground text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:bg-primary/90"
                        >
                            Réinitialiser
                        </button>
                    </div>
                ) : isFiltered ? (
                    /* Vue filtrée — liste plate toutes catégories */
                    viewMode === 'grid' ? (
                        <div className="grid gap-3 animate-in fade-in duration-200">
                            {filteredArticles.map((a, i) => (
                                <ArticleCard key={a.slug} article={a} index={i} total={filteredArticles.length} showCategory />
                            ))}
                        </div>
                    ) : (
                        <div className="border border-border rounded-xl overflow-hidden divide-y divide-border/60 animate-in fade-in duration-200">
                            {filteredArticles.map((a, i) => <ArticleListRow key={a.slug} article={a} index={i} />)}
                        </div>
                    )
                ) : (
                    /* Vue normale — groupée par catégorie */
                    <div className="space-y-16">
                        {CATEGORIES.map(cat => {
                            const catArticles = groupedArticles[cat];
                            if (!catArticles.length) return null;
                            return (
                                <section key={cat} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-border/40 flex items-center gap-2">
                                        <span>{CATEGORY_EMOJI[cat]}</span>
                                        {cat}
                                        <span className="text-sm font-normal text-muted-foreground ml-auto bg-muted px-2 py-0.5 rounded-full">
                                            {catArticles.length}
                                        </span>
                                    </h2>
                                    {viewMode === 'grid' ? (
                                        <div className="grid gap-3">
                                            {catArticles.map((a, i) => (
                                                <ArticleCard key={a.slug} article={a} index={i} total={catArticles.length} showCategory={false} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="border border-border rounded-xl overflow-hidden divide-y divide-border/60">
                                            {catArticles.map((a, i) => <ArticleListRow key={a.slug} article={a} index={i} />)}
                                        </div>
                                    )}
                                </section>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Carte spotlight ───────────────────────────────────────────────────────────

function SpotlightCard({ article }: { article: Article }) {
    const emoji = CATEGORY_EMOJI[article.category] ?? '✨';
    const accent = CATEGORY_ACCENT[article.category];
    return (
        <Link href={`/conseils/${article.slug}`} className="group block h-full">
            <article className="relative h-full flex flex-col overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-xl transition-all duration-300">
                <div className={cn(
                    "h-1 w-full",
                    article.category === "Sagesse d'Al-Ghazali"        && 'bg-gradient-to-r from-amber-400 to-amber-300',
                    article.category === 'Méthodologie Coranique'       && 'bg-gradient-to-r from-blue-500 to-blue-400',
                    article.category === 'Spiritualité & Guérison'      && 'bg-gradient-to-r from-violet-500 to-violet-400',
                    article.category === "Vivre l'Islam & Productivité" && 'bg-gradient-to-r from-emerald-500 to-emerald-400',
                    article.category === 'Sciences & Compréhension'     && 'bg-gradient-to-r from-teal-500 to-teal-400',
                )} />
                <div className="flex flex-col gap-3 p-5 flex-1">
                    <div className="flex items-center justify-between gap-2">
                        <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full", accent?.badge)}>
                            <span>{emoji}</span>{article.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground/70 shrink-0">
                            <Clock className="w-3 h-3" />{article.readTime}
                        </span>
                    </div>
                    <h3 className="font-extrabold text-base leading-tight group-hover:text-primary transition-colors flex-1">
                        {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-1 mt-auto gap-2">
                        <TagPills article={article} max={2} />
                        <span className="flex items-center gap-1 text-xs font-semibold text-primary shrink-0 group-hover:translate-x-1 transition-transform">
                            Lire <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}

// ─── Carte article (mode grille) ───────────────────────────────────────────────

function ArticleCard({ article, index, total, showCategory }: {
    article: Article; index: number; total: number; showCategory: boolean;
}) {
    const accent = CATEGORY_ACCENT[article.category];
    return (
        <article className={cn(
            "group bg-card hover:bg-muted/20 border border-l-4 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300",
            accent?.border ?? 'border-l-primary'
        )}>
            <Link href={`/conseils/${article.slug}`} className="block p-5">
                <div className="flex gap-4 items-start">
                    {total > 1 && (
                        <div className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-muted text-muted-foreground text-xs font-bold mt-0.5">
                            {index + 1}
                        </div>
                    )}
                    <div className="space-y-2 flex-1 min-w-0">
                        {showCategory && (
                            <span className={cn("inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full", accent?.badge)}>
                                <span>{CATEGORY_EMOJI[article.category]}</span>
                                {article.category}
                            </span>
                        )}
                        <h3 className="text-base font-bold group-hover:text-primary transition-colors leading-snug">
                            {article.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                            {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between gap-2 pt-1">
                            <div className="flex items-center gap-3">
                                <AuthorChip author={article.author} />
                                <span className="flex items-center gap-1 text-xs text-muted-foreground/70">
                                    <Clock className="w-3 h-3" />{article.readTime}
                                </span>
                            </div>
                            <TagPills article={article} max={2} />
                        </div>
                    </div>
                    <div className="flex items-center justify-center shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:translate-x-0.5 mt-0.5">
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
            </Link>
        </article>
    );
}

// ─── Ligne article (mode liste) ────────────────────────────────────────────────

function ArticleListRow({ article, index }: { article: Article; index: number }) {
    const accent = CATEGORY_ACCENT[article.category];
    const tags = getArticleTags(article).slice(0, 2);
    return (
        <Link
            href={`/conseils/${article.slug}`}
            className="group flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors"
        >
            <span className="text-xs text-muted-foreground/40 font-mono w-5 shrink-0 text-right">{index + 1}</span>
            <span className="text-base shrink-0">{CATEGORY_EMOJI[article.category]}</span>
            <span className="flex-1 min-w-0 text-sm font-medium leading-snug truncate group-hover:text-primary transition-colors">
                {article.title}
            </span>
            <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                {tags.map(tag => (
                    <span key={tag} className={cn(
                        "text-[10px] font-semibold px-1.5 py-0.5 rounded-full border",
                        TAG_CONFIG[tag].inactive
                    )}>
                        {TAG_CONFIG[tag].emoji}
                    </span>
                ))}
            </div>
            <span className={cn(
                "hidden sm:inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full shrink-0",
                accent?.badge ?? 'bg-primary/10 text-primary'
            )}>
                {SHORT_LABELS[article.category]}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground/60 shrink-0">
                <Clock className="w-3 h-3" />{article.readTime}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
        </Link>
    );
}
