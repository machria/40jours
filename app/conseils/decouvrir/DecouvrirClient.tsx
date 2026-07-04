'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bookmark, Share2, ChevronDown, ArrowRight, Clock, ChevronRight, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import type { Article } from '@/data/advice';

// ─── Config visuelle par catégorie ────────────────────────────────────────────

const CATEGORY_CONFIG: Record<string, {
    bg: string;
    accent: string;
    emoji: string;
}> = {
    "Sagesse d'Al-Ghazali": {
        bg: 'linear-gradient(160deg, #3d2000 0%, #1f1000 50%, #0d0a07 100%)',
        accent: '#fbbf24',
        emoji: '📚',
    },
    'Méthodologie Coranique': {
        bg: 'linear-gradient(160deg, #001840 0%, #000e22 50%, #07090d 100%)',
        accent: '#60a5fa',
        emoji: '📖',
    },
    'Spiritualité & Guérison': {
        bg: 'linear-gradient(160deg, #1e0040 0%, #100022 50%, #09070d 100%)',
        accent: '#c084fc',
        emoji: '💫',
    },
    "Vivre l'Islam & Productivité": {
        bg: 'linear-gradient(160deg, #00280f 0%, #001508 50%, #070d09 100%)',
        accent: '#34d399',
        emoji: '⚡',
    },
    'Sciences & Compréhension': {
        bg: 'linear-gradient(160deg, #00201e 0%, #001110 50%, #070d0c 100%)',
        accent: '#2dd4bf',
        emoji: '🔬',
    },
};

// ─── Tags émotionnels ─────────────────────────────────────────────────────────

type EmotionalTag = 'motivant' | 'apaisant' | 'profond' | 'pratique' | 'savant' | 'surprenant' | 'touchant';

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
};

const CATEGORY_DEFAULT_TAGS: Record<string, EmotionalTag[]> = {
    "Sagesse d'Al-Ghazali":        ['savant', 'profond'],
    'Méthodologie Coranique':       ['pratique'],
    'Spiritualité & Guérison':      ['apaisant'],
    "Vivre l'Islam & Productivité": ['pratique', 'motivant'],
    'Sciences & Compréhension':     ['savant', 'surprenant'],
};

function getArticleTags(article: Article): EmotionalTag[] {
    return ARTICLE_TAGS[article.slug] ?? CATEGORY_DEFAULT_TAGS[article.category] ?? ['pratique'];
}

const TAG_HOOKS: Record<EmotionalTag, string> = {
    surprenant: '🤯 Ce que vous ne saviez pas encore',
    profond:    '🌌 Une réflexion qui change tout',
    motivant:   '🔥 Retrouvez votre élan',
    touchant:   '❤️ Un article qui touche le cœur',
    apaisant:   '😌 Pour apaiser l\'âme',
    pratique:   '⚡ Appliquez dès aujourd\'hui',
    savant:     '📚 Ce que les savants nous enseignent',
};

const TAG_STYLE: Record<EmotionalTag, string> = {
    surprenant: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    profond:    'bg-violet-500/20 text-violet-300 border-violet-500/30',
    motivant:   'bg-orange-500/20 text-orange-300 border-orange-500/30',
    touchant:   'bg-rose-500/20 text-rose-300 border-rose-500/30',
    apaisant:   'bg-sky-500/20 text-sky-300 border-sky-500/30',
    pratique:   'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    savant:     'bg-amber-500/20 text-amber-300 border-amber-500/30',
};

// ─── Parsing markdown en blocs structurés ─────────────────────────────────────

type TextNode = { bold: boolean; text: string };

type ContentBlock =
    | { type: 'paragraph'; nodes: TextNode[] }
    | { type: 'bullet';    nodes: TextNode[] }
    | { type: 'h2';        text: string }
    | { type: 'h3';        text: string };

interface ArticlePreview {
    introBlocks: ContentBlock[];
    sectionTitle: string;
    sectionBlocks: ContentBlock[];
}

function parseInline(raw: string): TextNode[] {
    const nodes: TextNode[] = [];
    // Clean links and code spans first
    const text = raw
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/`([^`]+)`/g, '$1');

    const re = /\*\*(.*?)\*\*/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
        if (m.index > last) {
            const plain = text.slice(last, m.index).replace(/\*(.*?)\*/g, '$1');
            if (plain) nodes.push({ bold: false, text: plain });
        }
        if (m[1]) nodes.push({ bold: true, text: m[1] });
        last = m.index + m[0].length;
    }
    const tail = text.slice(last).replace(/\*(.*?)\*/g, '$1');
    if (tail) nodes.push({ bold: false, text: tail });
    return nodes.filter(n => n.text.length > 0);
}

function parseMarkdownBlocks(content: string): ContentBlock[] {
    const lines = content.split('\n').map(l => l.trim());
    const blocks: ContentBlock[] = [];
    let paraLines: string[] = [];

    const flushPara = () => {
        const text = paraLines.join(' ').trim();
        if (text) blocks.push({ type: 'paragraph', nodes: parseInline(text) });
        paraLines = [];
    };

    for (const line of lines) {
        if (!line) {
            flushPara();
        } else if (line.startsWith('## ')) {
            flushPara();
            blocks.push({ type: 'h2', text: line.slice(3).trim() });
        } else if (line.startsWith('### ')) {
            flushPara();
            blocks.push({ type: 'h3', text: line.slice(4).trim() });
        } else if (line.startsWith('# ')) {
            flushPara(); // skip h1 (it's the article title)
        } else if (/^[-*•]\s+/.test(line)) {
            flushPara();
            blocks.push({ type: 'bullet', nodes: parseInline(line.replace(/^[-*•]\s+/, '')) });
        } else if (/^\d+\.\s+/.test(line)) {
            flushPara();
            blocks.push({ type: 'bullet', nodes: parseInline(line.replace(/^\d+\.\s+/, '')) });
        } else if (line.startsWith('>')) {
            paraLines.push(line.replace(/^>\s*/, ''));
        } else {
            paraLines.push(line);
        }
    }
    flushPara();
    return blocks;
}

function blockWordCount(nodes: TextNode[]): number {
    return nodes.reduce((sum, n) => sum + n.text.trim().split(/\s+/).filter(Boolean).length, 0);
}

function trimBlockToWords(nodes: TextNode[], remaining: number): TextNode[] {
    const result: TextNode[] = [];
    let count = 0;
    for (const node of nodes) {
        const words = node.text.trim().split(/\s+/).filter(Boolean);
        if (count + words.length <= remaining) {
            result.push(node);
            count += words.length;
        } else {
            const take = remaining - count;
            if (take > 0) result.push({ bold: node.bold, text: words.slice(0, take).join(' ') + '…' });
            break;
        }
    }
    return result;
}

function parseArticlePreview(content: string): ArticlePreview {
    const all = parseMarkdownBlocks(content);
    const h2Idx = all.findIndex(b => b.type === 'h2');

    if (h2Idx < 0) {
        return { introBlocks: all.slice(0, 3), sectionTitle: '', sectionBlocks: [] };
    }

    // Intro : jusqu'à 250 mots avant le premier ##
    const MAX_WORDS = 250;
    const introBlocks: ContentBlock[] = [];
    let wordsUsed = 0;
    for (const block of all.slice(0, h2Idx)) {
        if (block.type !== 'paragraph' && block.type !== 'bullet') continue;
        if (wordsUsed >= MAX_WORDS) break;
        const wc = blockWordCount(block.nodes);
        if (wordsUsed + wc <= MAX_WORDS) {
            introBlocks.push(block);
            wordsUsed += wc;
        } else {
            const trimmed = trimBlockToWords(block.nodes, MAX_WORDS - wordsUsed);
            if (trimmed.length) introBlocks.push({ ...block, nodes: trimmed });
            break;
        }
    }

    const h2 = all[h2Idx] as { type: 'h2'; text: string };

    const afterH2   = all.slice(h2Idx + 1);
    const nextH2Idx = afterH2.findIndex(b => b.type === 'h2');
    const sectionBlocks = (nextH2Idx >= 0 ? afterH2.slice(0, nextH2Idx) : afterH2)
        .filter(b => b.type !== 'h2')
        .slice(0, 5);

    return { introBlocks, sectionTitle: h2.text, sectionBlocks };
}

// ─── Rendu des blocs ──────────────────────────────────────────────────────────

function renderNodes(nodes: TextNode[]) {
    return nodes.map((n, i) =>
        n.bold
            ? <strong key={i} className="text-white font-semibold">{n.text}</strong>
            : <span key={i}>{n.text}</span>
    );
}

function RenderBlock({ block, accent }: { block: ContentBlock; accent: string }) {
    if (block.type === 'paragraph') {
        return (
            <p className="text-white/75 leading-relaxed text-sm">
                {renderNodes(block.nodes)}
            </p>
        );
    }
    if (block.type === 'bullet') {
        return (
            <div className="flex gap-2 text-sm leading-relaxed">
                <span className="shrink-0 font-bold mt-0.5" style={{ color: accent }}>•</span>
                <span className="text-white/75">{renderNodes(block.nodes)}</span>
            </div>
        );
    }
    if (block.type === 'h3') {
        return (
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: accent }}>
                {block.text}
            </p>
        );
    }
    return null;
}

// ─── Composant principal ──────────────────────────────────────────────────────

interface DecouvrirClientProps {
    articles: Article[];
}

function shuffleArray<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export default function DecouvrirClient({ articles }: DecouvrirClientProps) {
    const containerRef                    = useRef<HTMLDivElement>(null);
    const { data: session }               = useSession();
    const isLoggedIn                      = !!session?.user?.email;
    const [feed, setFeed]                 = useState(articles);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [detailIndex, setDetailIndex]   = useState<number | null>(null);
    const [bookmarked, setBookmarked]     = useState<Set<string>>(new Set());
    const [showHint, setShowHint]         = useState(true);

    useEffect(() => {
        setFeed(shuffleArray(articles));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Charger les articles sauvegardés
    useEffect(() => {
        if (!isLoggedIn) return;
        fetch('/api/favorites')
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (!data) return;
                setBookmarked(new Set<string>((data.savedArticles ?? []).map((a: { slug: string }) => a.slug)));
            })
            .catch(() => {});
    }, [isLoggedIn]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const onScroll = () => {
            const idx = Math.round(el.scrollTop / el.clientHeight);
            setCurrentIndex(idx);
            if (idx > 0) setShowHint(false);
        };
        el.addEventListener('scroll', onScroll, { passive: true });
        return () => el.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        setDetailIndex(null);
    }, [currentIndex]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                const next = Math.min(feed.length - 1, currentIndex + 1);
                el.scrollTo({ top: next * el.clientHeight, behavior: 'smooth' });
            }
            if (e.key === 'ArrowUp') {
                const prev = Math.max(0, currentIndex - 1);
                el.scrollTo({ top: prev * el.clientHeight, behavior: 'smooth' });
            }
            if (e.key === 'ArrowRight' && detailIndex === null) setDetailIndex(currentIndex);
            if ((e.key === 'ArrowLeft' || e.key === 'Escape') && detailIndex !== null) setDetailIndex(null);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [currentIndex, detailIndex, feed.length]);

    const toggleBookmark = useCallback((article: Article) => {
        const slug = article.slug;
        setBookmarked(prev => {
            const next = new Set(prev);
            next.has(slug) ? next.delete(slug) : next.add(slug);
            return next;
        });
        if (isLoggedIn) {
            fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'article',
                    slug,
                    snapshot: {
                        title:    article.title,
                        category: article.category,
                        excerpt:  article.excerpt,
                    },
                }),
            }).catch(() => {});
        }
    }, [isLoggedIn]);

    const handleShare = useCallback((article: Article) => {
        if (typeof navigator !== 'undefined' && navigator.share) {
            navigator.share({
                title: article.title,
                text: article.excerpt,
                url: `/conseils/${article.slug}`,
            }).catch(() => {});
        }
    }, []);

    return (
        <>
            {/* Top HUD */}
            <div className="fixed top-0 left-0 right-0 md:left-64 z-[60] flex items-center justify-between px-4 pt-3 pb-2 pointer-events-none">
                <Link
                    href="/conseils"
                    className="pointer-events-auto flex items-center gap-1.5 text-white/90 hover:text-white bg-black/40 backdrop-blur-md rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Conseils
                </Link>
                <span className="text-white/50 bg-black/30 backdrop-blur-md rounded-full px-2.5 py-1 text-xs font-mono">
                    {currentIndex + 1} / {feed.length}
                </span>
            </div>

            {/* Conteneur scroll principal */}
            <div
                ref={containerRef}
                className="fixed top-0 left-0 right-0 bottom-16 md:left-64 md:bottom-0 overflow-y-scroll"
                style={{
                    scrollSnapType: detailIndex !== null ? 'none' : 'y mandatory',
                    scrollbarWidth: 'none',
                    WebkitOverflowScrolling: 'touch',
                }}
            >
                {feed.map((article, index) => {
                    const cfg          = CATEGORY_CONFIG[article.category] ?? CATEGORY_CONFIG["Sagesse d'Al-Ghazali"];
                    const tags         = getArticleTags(article);
                    const primaryTag   = tags[0];
                    const hook         = TAG_HOOKS[primaryTag];
                    const isBookmarked = bookmarked.has(article.slug);
                    const isDetail     = detailIndex === index;
                    const preview      = parseArticlePreview(article.content);

                    return (
                        <ArticleCard
                            key={article.slug}
                            article={article}
                            index={index}
                            cfg={cfg}
                            hook={hook}
                            tags={tags}
                            isBookmarked={isBookmarked}
                            isDetail={isDetail}
                            preview={preview}
                            showHint={index === 0 && showHint}
                            onOpenDetail={() => setDetailIndex(index)}
                            onCloseDetail={() => setDetailIndex(null)}
                            onToggleBookmark={() => toggleBookmark(article)}
                            onShare={() => handleShare(article)}
                            total={feed.length}
                        />
                    );
                })}
            </div>
        </>
    );
}

// ─── Carte article ────────────────────────────────────────────────────────────

interface CardProps {
    article: Article;
    index: number;
    total: number;
    cfg: { bg: string; accent: string; emoji: string };
    hook: string;
    tags: EmotionalTag[];
    isBookmarked: boolean;
    isDetail: boolean;
    preview: ArticlePreview;
    showHint: boolean;
    onOpenDetail: () => void;
    onCloseDetail: () => void;
    onToggleBookmark: () => void;
    onShare: () => void;
}

function ArticleCard({
    article, index, total, cfg, hook, tags, isBookmarked,
    isDetail, preview, showHint,
    onOpenDetail, onCloseDetail, onToggleBookmark, onShare,
}: CardProps) {
    const teaserRef  = useRef<HTMLDivElement>(null);
    const detailRef  = useRef<HTMLDivElement>(null);
    const touchStart = useRef<{ x: number; y: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const TRANSITION = 'transform 340ms cubic-bezier(0.4, 0, 0.2, 1)';

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!touchStart.current) return;
        const dx = e.touches[0].clientX - touchStart.current.x;
        const dy = Math.abs(e.touches[0].clientY - touchStart.current.y);

        // Ignore if more vertical than horizontal
        if (dy > Math.abs(dx) && dy > 20) return;

        const width = e.currentTarget.clientWidth;

        if (!isDetail && dx > 0) {
            // Dragging right → slide teaser left, slide detail in from right
            const offset = Math.min(dx, width);
            if (teaserRef.current) teaserRef.current.style.transform = `translateX(-${offset}px)`;
            if (detailRef.current) detailRef.current.style.transform = `translateX(calc(100% - ${offset}px))`;
        } else if (isDetail && dx < 0) {
            // Dragging left → slide detail right (close)
            const offset = Math.min(-dx, width);
            if (detailRef.current) detailRef.current.style.transform = `translateX(${offset}px)`;
            if (teaserRef.current) teaserRef.current.style.transform = `translateX(calc(-100% + ${offset}px))`;
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!touchStart.current) return;
        const dx = e.changedTouches[0].clientX - touchStart.current.x;
        const dy = Math.abs(e.changedTouches[0].clientY - touchStart.current.y);
        touchStart.current = null;

        // Clear inline styles → CSS transition snaps to final state
        if (teaserRef.current) teaserRef.current.style.transform = '';
        if (detailRef.current) detailRef.current.style.transform = '';
        setIsDragging(false);

        // Reject if too vertical or too short
        if (dy > Math.abs(dx) || Math.abs(dx) < 30) return;

        const threshold = e.currentTarget.clientWidth * 0.22;
        if (dx > threshold && !isDetail) onOpenDetail();
        if (dx < -threshold && isDetail) onCloseDetail();
    };

    return (
        <div
            className="relative w-full overflow-hidden"
            style={{ height: '100%', scrollSnapAlign: 'start', scrollSnapStop: 'always', background: cfg.bg }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Emoji déco géant */}
            <div
                aria-hidden
                className="absolute inset-0 flex items-end justify-end pr-4 pb-24 select-none pointer-events-none overflow-hidden"
                style={{ opacity: 0.055 }}
            >
                <span style={{ fontSize: 'clamp(8rem, 30vw, 18rem)', lineHeight: 1 }}>{cfg.emoji}</span>
            </div>

            {/* Vignette haut */}
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 to-transparent pointer-events-none z-10" />

            {/* ── PANNEAU TEASER ── */}
            <div
                ref={teaserRef}
                className="absolute inset-0 flex flex-col z-20"
                style={{
                    transform: isDetail ? 'translateX(-100%)' : 'translateX(0)',
                    transition: isDragging ? 'none' : TRANSITION,
                    willChange: 'transform',
                }}
            >
                {/* Contenu principal */}
                <div className="flex-1 flex flex-col justify-center px-6 pt-20 pb-4 gap-5">
                    <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: cfg.accent }}>
                        {hook}
                    </p>
                    <h2
                        className="font-black text-white leading-tight"
                        style={{ fontSize: 'clamp(1.4rem, 5vw, 2.2rem)' }}
                    >
                        {article.title}
                    </h2>
                    <div className="w-10 h-0.5 rounded-full" style={{ background: cfg.accent }} />
                    <p className="text-white/75 leading-relaxed line-clamp-4" style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)' }}>
                        {article.excerpt}
                    </p>
                </div>

                {/* Overlay bas */}
                <div
                    className="px-6 pb-6 pr-20 flex flex-col gap-4"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)', paddingTop: '3rem' }}
                >
                    <div className="flex flex-wrap items-center gap-2">
                        {tags.slice(0, 2).map(tag => (
                            <span key={tag} className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', TAG_STYLE[tag])}>
                                {tag.charAt(0).toUpperCase() + tag.slice(1)}
                            </span>
                        ))}
                        <span className="flex items-center gap-1 text-white/40 text-xs ml-auto">
                            <Clock className="w-3 h-3" />{article.readTime}
                        </span>
                    </div>

                    <div>
                        <p className="text-xs font-bold" style={{ color: cfg.accent }}>{cfg.emoji} {article.category}</p>
                        <p className="text-white/40 text-xs mt-0.5">{article.author}</p>
                    </div>

                    <Link
                        href={`/conseils/${article.slug}`}
                        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95"
                        style={{ background: cfg.accent, color: '#000' }}
                    >
                        Lire l'article
                        <ArrowRight className="w-4 h-4" />
                    </Link>

                    <div className="h-0.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{ width: `${((index + 1) / total) * 100}%`, background: cfg.accent }}
                        />
                    </div>
                </div>

                {/* Pull tab "Aperçu →" */}
                <button
                    onClick={onOpenDetail}
                    className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 py-4 px-1.5 rounded-l-xl z-30"
                    style={{ background: `${cfg.accent}18`, borderLeft: `2px solid ${cfg.accent}35` }}
                    aria-label="Voir l'aperçu de l'article"
                >
                    <ChevronRight className="w-4 h-4" style={{ color: cfg.accent }} />
                    <span
                        className="text-[9px] font-bold"
                        style={{ color: cfg.accent, writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                    >
                        Aperçu
                    </span>
                </button>
            </div>

            {/* ── PANNEAU DETAIL ── */}
            <div
                ref={detailRef}
                className="absolute inset-0 z-30 flex flex-col overflow-hidden"
                style={{
                    transform: isDetail ? 'translateX(0)' : 'translateX(100%)',
                    transition: isDragging ? 'none' : TRANSITION,
                    background: cfg.bg,
                    willChange: 'transform',
                }}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-5 pt-14 pb-4 border-b shrink-0"
                    style={{ borderColor: `${cfg.accent}25` }}
                >
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xl shrink-0">{cfg.emoji}</span>
                        <span className="text-xs font-bold truncate" style={{ color: cfg.accent }}>
                            {article.category}
                        </span>
                    </div>
                    <button
                        onClick={onCloseDetail}
                        className="flex items-center gap-1.5 text-white/60 hover:text-white/90 transition-colors shrink-0 ml-3"
                        aria-label="Fermer l'aperçu"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Contenu scrollable */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                    <h2 className="font-black text-white text-xl leading-snug">{article.title}</h2>

                    {/* Intro */}
                    {preview.introBlocks.length > 0 && (
                        <div className="space-y-3">
                            {preview.introBlocks.map((b, i) => (
                                <RenderBlock key={i} block={b} accent={cfg.accent} />
                            ))}
                        </div>
                    )}

                    {/* Première section */}
                    {preview.sectionTitle && (
                        <>
                            <div className="flex items-center gap-3 pt-1">
                                <div className="h-px flex-1" style={{ background: `${cfg.accent}40` }} />
                                <h3
                                    className="text-[11px] font-bold uppercase tracking-wider shrink-0 text-center max-w-[60%]"
                                    style={{ color: cfg.accent }}
                                >
                                    {preview.sectionTitle}
                                </h3>
                                <div className="h-px flex-1" style={{ background: `${cfg.accent}40` }} />
                            </div>

                            {preview.sectionBlocks.length > 0 && (
                                <div className="space-y-3">
                                    {preview.sectionBlocks.map((b, i) => (
                                        <RenderBlock key={i} block={b} accent={cfg.accent} />
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {/* Aucune structure détectée */}
                    {!preview.sectionTitle && preview.introBlocks.length === 0 && (
                        <p className="text-white/70 leading-relaxed text-sm">{article.excerpt}</p>
                    )}

                    <p className="text-white/25 text-xs text-center pt-2 pb-1">— La suite dans l'article complet —</p>
                </div>

                {/* Footer */}
                <div
                    className="px-6 pb-6 pt-4 shrink-0"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)' }}
                >
                    <Link
                        href={`/conseils/${article.slug}`}
                        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95"
                        style={{ background: cfg.accent, color: '#000' }}
                    >
                        Lire l'article complet
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Sidebar (mode teaser uniquement) */}
            {!isDetail && (
                <div className="absolute right-4 bottom-36 z-20 flex flex-col items-center gap-5">
                    <button
                        onClick={onToggleBookmark}
                        className="flex flex-col items-center gap-1 group"
                        aria-label={isBookmarked ? 'Retirer le signet' : 'Sauvegarder'}
                    >
                        <div className={cn(
                            'w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200',
                            isBookmarked ? 'bg-yellow-500/30 scale-110' : 'bg-white/10 group-hover:bg-white/20 group-hover:scale-105'
                        )}>
                            <Bookmark className={cn('w-5 h-5 transition-all', isBookmarked ? 'fill-yellow-300 text-yellow-300' : 'text-white')} />
                        </div>
                        <span className="text-white/60 text-[10px] font-medium">{isBookmarked ? 'Sauvé' : 'Sauver'}</span>
                    </button>

                    <button
                        onClick={onShare}
                        className="flex flex-col items-center gap-1 group"
                        aria-label="Partager cet article"
                    >
                        <div className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center backdrop-blur-sm transition-all group-hover:scale-105">
                            <Share2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white/60 text-[10px] font-medium">Partager</span>
                    </button>
                </div>
            )}

            {/* Swipe hint */}
            {showHint && !isDetail && (
                <div className="absolute bottom-36 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 animate-bounce">
                    <ChevronDown className="w-5 h-5 text-white/60" />
                    <span className="text-white/50 text-xs">Swiper pour découvrir</span>
                </div>
            )}
        </div>
    );
}
