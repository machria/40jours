'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, BookOpen, Check, X } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type SeerahEvent = {
    title: string;
    commentary: string[];
    notes: string;
    'hijri-date': string;
    start: string;
};

type QuizQuestion = {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
    category: string;
};

type EraConfig = {
    key: string;
    label: string;
    subtitle: string;
    bg: string;
    accent: string;
    range: [number, number];
};

type FeedItem =
    | { type: 'story'; event: SeerahEvent; era: EraConfig; storyIdx: number }
    | { type: 'chapter'; era: EraConfig }
    | { type: 'quiz'; question: QuizQuestion; quizIdx: number };

// ─── Era Config ───────────────────────────────────────────────────────────────
const ERAS: EraConfig[] = [
    {
        key: 'ancients',
        label: 'Les Prophètes Anciens',
        subtitle: '2000 av. J.-C. – 570 ap. J.-C.',
        bg: 'linear-gradient(160deg, #2d1a02 0%, #150d01 50%, #090806 100%)',
        accent: '#f59e0b',
        range: [-9999, 570],
    },
    {
        key: 'pre-revelation',
        label: 'La Naissance du Prophète ﷺ',
        subtitle: '570 – 609 ap. J.-C.',
        bg: 'linear-gradient(160deg, #2d1202 0%, #150901 50%, #09080a 100%)',
        accent: '#fb923c',
        range: [570, 610],
    },
    {
        key: 'mecca',
        label: 'La Mecque — La Révélation',
        subtitle: '610 – 621 ap. J.-C.',
        bg: 'linear-gradient(160deg, #2d0212 0%, #150109 50%, #0b0909 100%)',
        accent: '#f43f5e',
        range: [610, 622],
    },
    {
        key: 'hijra',
        label: 'La Hijra',
        subtitle: '622 ap. J.-C.',
        bg: 'linear-gradient(160deg, #14023d 0%, #0a0120 50%, #09090d 100%)',
        accent: '#a855f7',
        range: [622, 623],
    },
    {
        key: 'medina',
        label: "Médine — L'État Islamique",
        subtitle: '623 – 632 ap. J.-C.',
        bg: 'linear-gradient(160deg, #02301a 0%, #011a0f 50%, #090d09 100%)',
        accent: '#10b981',
        range: [623, 633],
    },
    {
        key: 'companions',
        label: 'Les Compagnons du Prophète ﷺ',
        subtitle: '632 – 700 ap. J.-C.',
        bg: 'linear-gradient(160deg, #01203d 0%, #011020 50%, #090a0d 100%)',
        accent: '#38bdf8',
        range: [633, 700],
    },
    {
        key: 'scholars',
        label: "L'Âge d'Or du Hadith",
        subtitle: '700 – 915 ap. J.-C.',
        bg: 'linear-gradient(160deg, #020a3d 0%, #010520 50%, #09090d 100%)',
        accent: '#818cf8',
        range: [700, 9999],
    },
];

// ─── Utilities ────────────────────────────────────────────────────────────────
function getYear(dateStr: string): number {
    if (!dateStr) return 9999;
    const isBC = dateStr.startsWith('-');
    const year = parseInt(dateStr.replace(/^-/, '').split('-')[0], 10);
    return isBC ? -year : year;
}

function getEraForYear(year: number): EraConfig {
    return ERAS.find(e => year >= e.range[0] && year < e.range[1]) ?? ERAS[ERAS.length - 1];
}

function formatYear(dateStr: string): string {
    if (!dateStr) return '';
    const isBC = dateStr.startsWith('-');
    const year = parseInt(dateStr.replace(/^-/, '').split('-')[0], 10);
    return isBC ? `~${year} av. J.-C.` : `${year} ap. J.-C.`;
}

// Keywords per era for quiz filtering
const ERA_KEYWORDS: Record<string, string[]> = {
    ancients:         ['ibrahim', "ka'bah", 'kaaba', 'musa', 'moïse', 'isa', 'jésus', 'zamzam', 'prophète ancien', 'isma'],
    'pre-revelation': ['naissance', 'aminah', 'halima', 'abdul-muttalib', 'abdullah', 'enfant', 'khadijah', 'bahira', 'hilf', 'reconstruction'],
    mecca:            ['révélation', 'hira', 'iqra', 'prédication', 'bilal', 'abyssinie', 'boycott', "ta'if", 'isra', "mi'raj", 'sumayyah', 'umar accepte', 'banu hashim', 'chagrin'],
    hijra:            ['hijra', 'migration', 'thawr', 'quba', "al-aqabah", 'aqabah', 'ansars', 'médinois'],
    medina:           ['badr', 'uhud', 'khandaq', 'ramadan', 'qibla', 'hudaybiyyah', 'khaybar', 'mecque', 'conquête', "mu'tah", 'tabuk', 'hunayn', 'constitution de médine', 'fraternité', 'ansar', 'muhajirun', 'zakat', "bay'at"],
    companions:       ['abu bakr', 'umar ibn', 'uthman', 'ali ibn', 'compagnon', 'calife', 'aishah', 'abu hurayrah', 'ibn umar'],
    scholars:         ['bukhari', 'muslim', 'malik', 'hadith', 'isnad', 'savant', 'sunan', 'abu dawud', 'tirmidhi', 'nasai', 'ibn majah', 'compilation'],
};

function getEraQuestions(
    questions: QuizQuestion[],
    eraKey: string,
    usedSet: Set<number>
): QuizQuestion[] {
    const keywords = ERA_KEYWORDS[eraKey] ?? [];
    const matched = questions
        .map((q, i) => ({ q, i }))
        .filter(({ i }) => !usedSet.has(i))
        .filter(({ q }) => {
            const text = (q.question + ' ' + q.explanation).toLowerCase();
            return keywords.some(kw => text.includes(kw));
        });

    // shuffle and take up to 3
    for (let i = matched.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [matched[i], matched[j]] = [matched[j], matched[i]];
    }

    const picked = matched.slice(0, 3);
    picked.forEach(({ i }) => usedSet.add(i));
    return picked.map(({ q }) => q);
}

function buildFeedItems(events: SeerahEvent[], questions: QuizQuestion[]): FeedItem[] {
    const sorted = [...events].sort((a, b) => getYear(a.start) - getYear(b.start));

    // Group events by era (preserving order)
    type EraGroup = { era: EraConfig; events: SeerahEvent[] };
    const eraGroups: EraGroup[] = [];
    for (const event of sorted) {
        const era = getEraForYear(getYear(event.start));
        const last = eraGroups[eraGroups.length - 1];
        if (!last || last.era.key !== era.key) {
            eraGroups.push({ era, events: [event] });
        } else {
            last.events.push(event);
        }
    }

    const items: FeedItem[] = [];
    let storyIdx = 0;
    let globalQuizIdx = 0;
    const usedQuizSet = new Set<number>();

    for (const { era, events: eraEvents } of eraGroups) {
        // Chapter break card
        items.push({ type: 'chapter', era });

        // Story cards
        for (const event of eraEvents) {
            items.push({ type: 'story', event, era, storyIdx });
            storyIdx++;
        }

        // Quiz cards at end of era (filtered by era keywords)
        const eraQs = getEraQuestions(questions, era.key, usedQuizSet);
        for (const q of eraQs) {
            items.push({ type: 'quiz', question: q, quizIdx: globalQuizIdx++ });
        }
    }

    return items;
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface Props {
    events: SeerahEvent[];
    quizQuestions: QuizQuestion[];
}

export default function SiraFeed({ events, quizQuestions }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
    const [showHint, setShowHint] = useState(true);

    const shuffledQuiz = useMemo(
        () => [...quizQuestions].sort(() => Math.random() - 0.5).slice(0, 25),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const feedItems = useMemo(
        () => buildFeedItems(events, shuffledQuiz),
        [events, shuffledQuiz]
    );

    const totalStories = events.length;

    // Track visible card
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

    // Persist position
    useEffect(() => {
        if (currentIndex > 0) localStorage.setItem('sira-feed-position', currentIndex.toString());
    }, [currentIndex]);

    // Restore position on mount
    useEffect(() => {
        const saved = localStorage.getItem('sira-feed-position');
        if (!saved) return;
        const idx = parseInt(saved, 10);
        if (!isNaN(idx) && idx > 0) {
            setTimeout(() => {
                const el = containerRef.current;
                if (el) el.scrollTop = idx * el.clientHeight;
            }, 50);
        }
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const el = containerRef.current;
            if (!el) return;
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                el.scrollTo({ top: (currentIndex + 1) * el.clientHeight, behavior: 'smooth' });
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                el.scrollTo({ top: (currentIndex - 1) * el.clientHeight, behavior: 'smooth' });
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [currentIndex]);

    const scrollTo = useCallback((idx: number) => {
        const el = containerRef.current;
        if (el) el.scrollTo({ top: idx * el.clientHeight, behavior: 'smooth' });
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed top-0 left-0 right-0 bottom-16 md:left-64 md:bottom-0 overflow-y-scroll"
            style={{
                scrollSnapType: 'y mandatory',
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
            }}
        >
            {feedItems.map((item, feedIdx) => {
                if (item.type === 'chapter') {
                    return (
                        <ChapterCard
                            key={`chapter-${item.era.key}`}
                            era={item.era}
                        />
                    );
                }
                if (item.type === 'quiz') {
                    return (
                        <QuizCard
                            key={`quiz-${item.quizIdx}`}
                            question={item.question}
                            selectedAnswer={quizAnswers[feedIdx]}
                            onAnswer={(ans) => setQuizAnswers(prev => ({ ...prev, [feedIdx]: ans }))}
                            onContinue={() => scrollTo(feedIdx + 1)}
                        />
                    );
                }
                return (
                    <StoryCard
                        key={`story-${item.storyIdx}`}
                        event={item.event}
                        era={item.era}
                        storyIdx={item.storyIdx}
                        totalStories={totalStories}
                        showHint={showHint && feedIdx === 0}
                        onNext={() => scrollTo(feedIdx + 1)}
                    />
                );
            })}
        </div>
    );
}

// ─── Story Card ───────────────────────────────────────────────────────────────
function StoryCard({
    event, era, storyIdx, totalStories, showHint, onNext,
}: {
    event: SeerahEvent;
    era: EraConfig;
    storyIdx: number;
    totalStories: number;
    showHint: boolean;
    onNext: () => void;
}) {
    const text = event.commentary.join(' ');
    const year = formatYear(event.start);
    const progress = (storyIdx + 1) / totalStories;

    return (
        <div
            className="relative w-full flex flex-col overflow-hidden"
            style={{
                height: '100%',
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
                background: era.bg,
            }}
        >
            {/* Radial glow */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${era.accent}12 0%, transparent 70%)` }}
            />

            {/* Progress bar */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10 z-20">
                <div
                    className="h-full transition-all duration-700"
                    style={{ width: `${progress * 100}%`, background: era.accent }}
                />
            </div>

            {/* HUD */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-4">
                <Link
                    href="/sira"
                    className="flex items-center gap-1.5 text-white/50 hover:text-white/80 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-xs font-medium">Sira</span>
                </Link>
                <div className="flex items-center gap-2">
                    <span
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                        style={{ background: `${era.accent}20`, color: era.accent, border: `1px solid ${era.accent}40` }}
                    >
                        {era.label}
                    </span>
                    <span className="text-[11px] text-white/35 font-mono tabular-nums">
                        {storyIdx + 1}/{totalStories}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-center flex-1 px-6 pt-20 pb-20 max-w-2xl mx-auto w-full">
                {/* Year */}
                <p
                    className="text-5xl font-black tabular-nums leading-none mb-2 select-none"
                    style={{ color: `${era.accent}50` }}
                >
                    {year}
                </p>

                {/* Accent line */}
                <div className="w-10 h-0.5 mb-5" style={{ background: era.accent }} />

                {/* Title */}
                <h2 className="text-2xl font-bold text-white/95 mb-4 leading-snug">{event.title}</h2>

                {/* Commentary */}
                <p className="text-white/70 text-[15px] leading-relaxed mb-5">{text}</p>

                {/* Notes callout */}
                {event.notes && (
                    <div
                        className="flex items-start gap-3 rounded-xl p-4 text-sm"
                        style={{
                            background: `${era.accent}12`,
                            border: `1px solid ${era.accent}28`,
                        }}
                    >
                        <BookOpen className="w-4 h-4 mt-0.5 shrink-0" style={{ color: era.accent }} />
                        <p style={{ color: `${era.accent}cc` }}>{event.notes}</p>
                    </div>
                )}
            </div>

            {/* Bottom */}
            <div className="absolute bottom-5 left-0 right-0 z-20 flex flex-col items-center gap-1">
                {showHint && (
                    <p className="text-white/25 text-[11px] font-medium tracking-wide">Swipe pour continuer</p>
                )}
                <button onClick={onNext} className="text-white/20 hover:text-white/50 transition-colors">
                    <ChevronDown className="w-5 h-5 animate-bounce" />
                </button>
            </div>
        </div>
    );
}

// ─── Chapter Card ─────────────────────────────────────────────────────────────
function ChapterCard({ era }: { era: EraConfig }) {
    return (
        <div
            className="relative w-full flex flex-col items-center justify-center overflow-hidden"
            style={{
                height: '100%',
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
                background: era.bg,
            }}
        >
            {/* Radial glow */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(ellipse 70% 50% at 50% 50%, ${era.accent}25 0%, transparent 70%)` }}
            />

            {/* Back button */}
            <Link
                href="/sira"
                className="absolute top-4 left-4 z-20 flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-xs">Sira</span>
            </Link>

            {/* Center content */}
            <div className="relative z-10 flex flex-col items-center text-center px-8 gap-4">
                <div className="w-16 h-px" style={{ background: `${era.accent}60` }} />

                <p
                    className="text-[11px] font-bold tracking-[0.25em] uppercase"
                    style={{ color: `${era.accent}90` }}
                >
                    Nouveau Chapitre
                </p>

                <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">{era.label}</h2>

                <p className="text-white/40 text-sm">{era.subtitle}</p>

                <div className="w-16 h-px mt-2" style={{ background: `${era.accent}60` }} />
            </div>

            {/* Swipe hint */}
            <div className="absolute bottom-5 flex flex-col items-center gap-1 text-white/20">
                <ChevronDown className="w-5 h-5 animate-bounce" />
            </div>
        </div>
    );
}

// ─── Quiz Card ────────────────────────────────────────────────────────────────
function QuizCard({
    question,
    selectedAnswer,
    onAnswer,
    onContinue,
}: {
    question: QuizQuestion;
    selectedAnswer: number | undefined;
    onAnswer: (idx: number) => void;
    onContinue: () => void;
}) {
    const answered = selectedAnswer !== undefined;
    const isCorrect = selectedAnswer === question.correct;
    const accent = '#a855f7';
    const bg = 'linear-gradient(160deg, #14023d 0%, #0a0120 50%, #09090d 100%)';

    return (
        <div
            className="relative w-full flex flex-col overflow-hidden"
            style={{
                height: '100%',
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
                background: bg,
            }}
        >
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(ellipse 70% 50% at 50% 30%, ${accent}15 0%, transparent 70%)` }}
            />

            {/* HUD */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-4">
                <Link href="/sira" className="flex items-center gap-1.5 text-white/50 hover:text-white/80 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-xs font-medium">Sira</span>
                </Link>
                <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}40` }}
                >
                    📝 Quiz Rapide
                </span>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-center flex-1 px-5 pt-16 pb-16 max-w-xl mx-auto w-full gap-5">
                <p className="text-white/90 text-lg font-bold leading-snug">{question.question}</p>

                <div className="space-y-2.5">
                    {question.options.map((opt, i) => {
                        const isSelected = selectedAnswer === i;
                        const isCorrectOpt = i === question.correct;
                        const showResult = answered;

                        let style: React.CSSProperties = {
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.10)',
                        };
                        if (showResult && isCorrectOpt) {
                            style = { background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.40)' };
                        } else if (showResult && isSelected && !isCorrectOpt) {
                            style = { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.40)' };
                        } else if (showResult) {
                            style = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', opacity: 0.5 };
                        }

                        return (
                            <button
                                key={i}
                                onClick={() => !answered && onAnswer(i)}
                                disabled={answered}
                                className="w-full text-left px-4 py-3.5 rounded-xl text-[14px] text-white/85 flex items-center justify-between transition-all active:scale-[0.98]"
                                style={style}
                            >
                                <span>{opt}</span>
                                {showResult && isCorrectOpt && <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
                                {showResult && isSelected && !isCorrectOpt && <X className="w-4 h-4 text-red-400 shrink-0 ml-2" />}
                            </button>
                        );
                    })}
                </div>

                {answered && (
                    <div
                        className="rounded-xl p-4 text-sm"
                        style={{
                            background: isCorrect ? 'rgba(16,185,129,0.10)' : 'rgba(239,68,68,0.10)',
                            border: isCorrect ? '1px solid rgba(16,185,129,0.30)' : '1px solid rgba(239,68,68,0.30)',
                        }}
                    >
                        <p className="font-bold mb-1.5 text-white/90">
                            {isCorrect ? '✅ Correct !' : '❌ Incorrect'}
                        </p>
                        <p className="text-white/60 leading-relaxed">{question.explanation}</p>
                    </div>
                )}

                {answered && (
                    <button
                        onClick={onContinue}
                        className="w-full py-3.5 rounded-full font-bold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98]"
                        style={{ background: accent }}
                    >
                        Continuer →
                    </button>
                )}
            </div>
        </div>
    );
}
