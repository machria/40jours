'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, BookOpen, Pause, EyeOff, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { TajwidText } from '@/components/TajwidText';
import TafsirModal from '@/components/reading/TafsirModal';
import { useQuranAudio } from '@/hooks/useQuranAudio';
import { useSettings } from '@/context/SettingsContext';
import { useSession } from 'next-auth/react';
import { useBookmarks } from '@/hooks/useBookmarks';
import AyahWordByWord from './AyahWordByWord';
import { getAyahAudioUrl } from '@/lib/audioUrls';

interface Ayah {
    id: number;
    surah: number;
    ayah: number;
    text: string;
    translation: string;
    page: number;
    phonetic?: string;
}

interface SurahViewerProps {
    ayahs: Ayah[];
    surahId: number;
    wbwData?: any[];
    isWordByWordMode?: boolean;
    isMaskMode?: boolean;
}

export default function SurahViewer({
    ayahs,
    surahId,
    wbwData,
    isWordByWordMode = false,
    isMaskMode = false
}: SurahViewerProps) {
    // Tafsir State
    const [tafsirState, setTafsirState] = useState<{
        isOpen: boolean;
        surahNumber: number;
        ayahNumber: number;
        text: string;
        translation?: string;
    }>({ isOpen: false, surahNumber: 0, ayahNumber: 0, text: '' });

    // Settings
    const { fontSize, fontSizes, reversePhonetics, setReversePhonetics } = useSettings();
    const currentFontSize = fontSizes[fontSize];

    // Bookmarks
    const { data: session } = useSession();
    const { isBookmarked, toggleBookmark } = useBookmarks();

    // View State
    const [viewMode, setViewMode] = useState<'list' | 'mushaf'>('list');
    const [showPhonetic, setShowPhonetic] = useState(false);

    // Masking State
    const [maskTarget, setMaskTarget] = useState<'arabe' | 'phonetic' | 'translation'>('arabe');
    const [revealedSet, setRevealedSet] = useState<Set<string>>(new Set());

    // Loop & Pause States
    const [startAyah, setStartAyah] = useState(1);
    const [endAyah, setEndAyah] = useState(ayahs.length);
    const [activePause, setActivePause] = useState(0); // 0: none, -1: match verse, >0: seconds

    // Reset range when surah changes
    useEffect(() => {
        setStartAyah(1);
        setEndAyah(ayahs.length);
        setRevealedSet(new Set());
    }, [surahId, ayahs.length]);

    // Force phonetic display if masking phonetics
    useEffect(() => {
        if (isMaskMode && maskTarget === 'phonetic') {
            setShowPhonetic(true);
        }
    }, [isMaskMode, maskTarget]);

    const isMasked = (ayahNum: number, target: 'arabe' | 'phonetic' | 'translation') => {
        if (!isMaskMode) return false;
        if (maskTarget !== target) return false;
        return !revealedSet.has(`${ayahNum}:${target}`);
    };

    const toggleReveal = (ayahNum: number, target: 'arabe' | 'phonetic' | 'translation', e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        const key = `${ayahNum}:${target}`;
        setRevealedSet(prev => {
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    };

    const scrollToAyah = (ayahNum: number) => {
        const element = document.getElementById(`ayah-${ayahNum}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    // Audio State - Playlist preparation
    const playlist = ayahs.map(a => ({
        surah: a.surah,
        ayah: a.ayah,
        url: getAyahAudioUrl(a.surah, a.ayah),
        metadata: { surahName: `Sourate ${a.surah}`, text: a.text }
    }));

    // Audio Hook
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const {
        isPlaying,
        isWaiting,
        currentAyah,
        repeatMode,
        play,
        pause,
        togglePlay,
        toggleRepeat
    } = useQuranAudio({
        playlist,
        onAyahChange: (ayah) => {
            if (viewMode === 'list') {
                scrollToAyah(ayah.ayah);
            }
        },
        audioRef,
        startIndex: startAyah - 1,
        endIndex: endAyah - 1,
        pauseDuration: activePause
    });

    const isAyahPlaying = (surah: number, ayah: number) => {
        return currentAyah?.surah === surah && currentAyah?.ayah === ayah;
    };

    const handlePlayClick = (surah: number, ayah: number) => {
        if (isAyahPlaying(surah, ayah) && isPlaying) {
            pause();
        } else {
            play({ surah, ayah, url: '' });
        }
    };

    const togglePlaySequence = () => {
        if (isPlaying) {
            pause();
        } else {
            togglePlay();
        }
    };

    const openTafsir = (surah: number, ayah: number, text: string, translation: string) => {
        setTafsirState({ isOpen: true, surahNumber: surah, ayahNumber: ayah, text, translation });
    };

    // Render helper for Arabic text block in list mode
    const renderArabicText = (ayah: Ayah, playing: boolean) => {
        const masked = isMasked(ayah.ayah, 'arabe');
        if (masked) {
            return (
                <div 
                    onClick={(e) => toggleReveal(ayah.ayah, 'arabe', e)}
                    className="inline-flex items-center justify-center bg-orange-50 hover:bg-orange-100/80 dark:bg-orange-950/20 dark:hover:bg-orange-950/30 border-2 border-dashed border-orange-300 dark:border-orange-900/50 rounded-2xl p-6 cursor-pointer min-w-full min-h-[80px] transition-all hover:scale-[1.005] select-none"
                    title="Cliquez pour révéler le verset"
                >
                    <span className="text-orange-500 dark:text-orange-400 font-semibold text-sm flex items-center gap-2">
                        <EyeOff className="w-4 h-4 animate-pulse" /> Verset arabe masqué (Cliquer pour révéler)
                    </span>
                </div>
            );
        }

        return (
            <div
                onClick={() => handlePlayClick(ayah.surah, ayah.ayah)}
                className={`cursor-pointer hover:opacity-80 transition-opacity inline-block w-full bg-primary/5 dark:bg-primary/10 rounded-2xl p-6 md:p-8 border border-primary/10 relative ${isMaskMode && maskTarget === 'arabe' ? 'ring-2 ring-orange-400 border-orange-400' : ''}`}
                title="Écouter ce verset"
            >
                <TajwidText
                    text={ayah.text}
                    className="font-kufi leading-[2.2] text-foreground"
                    style={{ fontSize: currentFontSize }}
                />
                {isMaskMode && maskTarget === 'arabe' && (
                    <button 
                        onClick={(e) => toggleReveal(ayah.ayah, 'arabe', e)}
                        className="absolute top-2 right-2 text-[10px] uppercase font-bold tracking-wider bg-orange-500 text-white rounded px-2 py-0.5 hover:bg-orange-600 transition-colors shadow-sm"
                        title="Masquer à nouveau"
                    >
                        Masquer
                    </button>
                )}
            </div>
        );
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-muted/30 p-2 rounded-lg gap-2 sticky top-[73px] z-10 backdrop-blur-md">
                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={togglePlaySequence}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all shadow-sm ${isPlaying ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
                    >
                        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                        {isPlaying ? "Pause" : "Tout écouter"}
                    </button>

                    <button
                        onClick={toggleRepeat}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-all border ${repeatMode !== 'off' ? 'bg-accent/10 text-accent border-accent/20' : 'bg-background text-muted-foreground border-transparent hover:text-foreground'}`}
                        title="Mode de répétition : Verset (1x) ou Tout (Loop)"
                    >
                        <span className="flex items-center gap-1">
                            {repeatMode === 'single' && '1x'}
                            {repeatMode === 'all' && 'Tout'}
                            {repeatMode === 'off' && 'Loop'}
                        </span>
                    </button>

                    <button
                        onClick={() => setShowPhonetic(!showPhonetic)}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-all border ${showPhonetic ? 'bg-accent/10 text-accent border-accent/20' : 'bg-background text-muted-foreground border-transparent hover:text-foreground'}`}
                    >
                        Phonétique
                    </button>

                    {isWordByWordMode && (
                        <button
                            onClick={() => setReversePhonetics(!reversePhonetics)}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-all border ${reversePhonetics ? 'bg-accent text-accent-foreground border-accent' : 'bg-background text-accent border-accent/20 hover:text-foreground'}`}
                            title="Inverser les lettres de la phonétique"
                        >
                            <span className="hidden sm:inline">Phonétique RTL</span>
                            <span className="sm:hidden">RTL</span>
                        </button>
                    )}
                </div>

                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
                    <Link
                        href={`/coran/${surahId}/tafsir`}
                        className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-accent hover:bg-accent/10 transition-colors whitespace-nowrap"
                    >
                        <BookOpen className="w-4 h-4" />
                        Tafsir Complet
                    </Link>

                    <div className="flex bg-background rounded-md p-1 shadow-sm shrink-0">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Liste
                        </button>
                        <button
                            onClick={() => setViewMode('mushaf')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'mushaf' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Mushaf
                        </button>
                    </div>
                </div>
            </div>

            {/* Memorization Settings Panel */}
            {isMaskMode && (
                <div className="bg-orange-50/50 dark:bg-orange-950/10 border border-orange-200/60 dark:border-orange-900/30 rounded-2xl p-5 mb-6 space-y-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-0.5">
                            <h3 className="font-bold text-sm text-orange-800 dark:text-orange-400 flex items-center gap-2">
                                <EyeOff className="w-4 h-4" /> Assistant de Mémorisation Actif
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                Cachez les textes pour tester votre mémoire, définissez des boucles de récitation et répétez.
                            </p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                            <button
                                onClick={() => setRevealedSet(new Set())}
                                className="bg-background hover:bg-muted border text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all shadow-sm"
                            >
                                Tout masquer
                            </button>
                            <button
                                onClick={() => setRevealedSet(new Set(ayahs.map(a => `${a.ayah}:${maskTarget}`)))}
                                className="bg-background hover:bg-muted border text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all shadow-sm"
                            >
                                Tout révéler
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-orange-200/50 dark:border-orange-900/20">
                        {/* Target Selection */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Élément à masquer</label>
                            <div className="flex bg-muted/60 dark:bg-muted/30 rounded-lg p-1 w-full border">
                                <button
                                    onClick={() => { setMaskTarget('arabe'); setRevealedSet(new Set()); }}
                                    className={`flex-1 text-center py-1.5 rounded-md text-xs font-bold transition-all ${maskTarget === 'arabe' ? 'bg-background shadow text-orange-600 dark:text-orange-400' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Arabe
                                </button>
                                <button
                                    onClick={() => { setMaskTarget('phonetic'); setRevealedSet(new Set()); }}
                                    className={`flex-1 text-center py-1.5 rounded-md text-xs font-bold transition-all ${maskTarget === 'phonetic' ? 'bg-background shadow text-orange-600 dark:text-orange-400' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Phonétique
                                </button>
                                <button
                                    onClick={() => { setMaskTarget('translation'); setRevealedSet(new Set()); }}
                                    className={`flex-1 text-center py-1.5 rounded-md text-xs font-bold transition-all ${maskTarget === 'translation' ? 'bg-background shadow text-orange-600 dark:text-orange-400' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Traduction
                                </button>
                            </div>
                        </div>

                        {/* Interval Selection */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Boucle de mémorisation</label>
                            <div className="flex items-center gap-2">
                                <select
                                    value={startAyah}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        setStartAyah(val);
                                        if (val > endAyah) setEndAyah(val);
                                    }}
                                    className="bg-background border rounded-lg px-2 py-2 text-xs w-full font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                >
                                    {ayahs.map(a => (
                                        <option key={a.ayah} value={a.ayah}>Verset {a.ayah}</option>
                                    ))}
                                </select>
                                <span className="text-xs text-muted-foreground">à</span>
                                <select
                                    value={endAyah}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        setEndAyah(val);
                                        if (val < startAyah) setStartAyah(val);
                                    }}
                                    className="bg-background border rounded-lg px-2 py-2 text-xs w-full font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                >
                                    {ayahs.map(a => (
                                        <option key={a.ayah} value={a.ayah} disabled={a.ayah < startAyah}>Verset {a.ayah}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Active Pause */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Intervalle de répétition</label>
                            <select
                                value={activePause}
                                onChange={(e) => setActivePause(parseInt(e.target.value))}
                                className="bg-background border rounded-lg px-2 py-2 text-xs w-full font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                            >
                                <option value={0}>Aucun silence (en continu)</option>
                                <option value={-1}>Durée du verset (Écouter ➔ Répéter)</option>
                                <option value={3}>3 secondes de silence</option>
                                <option value={5}>5 secondes de silence</option>
                                <option value={10}>10 secondes de silence</option>
                            </select>
                        </div>
                    </div>

                    {isWaiting && (
                        <div className="p-3 bg-orange-100/60 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 rounded-xl text-center text-xs font-bold animate-pulse flex items-center justify-center gap-2 border border-orange-200/40">
                            📢 À vous de répéter le verset de mémoire...
                        </div>
                    )}
                </div>
            )}

            {viewMode === 'mushaf' ? (
                <div className="bg-card border rounded-xl p-8 shadow-sm">
                    <div className="text-justify font-kufi text-2xl md:text-3xl leading-[2.8] dir-rtl" dir="rtl">
                        {ayahs.map((ayah, i) => {
                            const masked = isMasked(ayah.ayah, 'arabe');
                            return (
                                <span key={ayah.id}
                                    className={`cursor-pointer rounded transition-all px-1 mx-0.5 select-none ${masked ? 'bg-orange-200/50 dark:bg-orange-950/50 text-transparent blur-[4px]' : isAyahPlaying(ayah.surah, ayah.ayah) ? 'bg-primary/20 text-primary' : 'hover:bg-primary/5'}`}
                                    onClick={(e) => masked ? toggleReveal(ayah.ayah, 'arabe', e) : handlePlayClick(ayah.surah, ayah.ayah)}
                                    title={masked ? "Cliquer pour révéler" : "Écouter ce verset"}
                                >
                                    <TajwidText text={ayah.text} className="inline" style={{ fontSize: currentFontSize }} />
                                    <span className={`inline-flex items-center justify-center w-8 h-8 text-xs border rounded-full font-sans text-muted-foreground align-middle mx-1 bg-background select-none ${masked ? 'blur-none text-foreground' : ''}`}>
                                        {ayah.ayah}
                                    </span>
                                </span>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {ayahs.map((ayah, index) => {
                        const playing = isAyahPlaying(ayah.surah, ayah.ayah);
                        const wbwAyah = wbwData ? wbwData.find(w => w.id === ayah.id) : null;

                        if (isWordByWordMode && wbwAyah && wbwAyah.words && wbwAyah.words.length > 0) {
                            return (
                                <AyahWordByWord
                                    key={ayah.id}
                                    surah={ayah.surah}
                                    ayah={ayah.ayah}
                                    words={wbwAyah.words}
                                    translation={ayah.translation}
                                    isPlaying={playing}
                                    onPlayClick={() => handlePlayClick(ayah.surah, ayah.ayah)}
                                    onTafsirClick={() => openTafsir(ayah.surah, ayah.ayah, ayah.text, ayah.translation)}
                                    audioRef={audioRef}
                                    showPhonetic={showPhonetic}
                                    reversePhonetics={reversePhonetics}
                                    isMaskMode={isMaskMode}
                                    maskTarget={maskTarget}
                                    isMasked={isMasked}
                                    toggleReveal={toggleReveal}
                                />
                            );
                        }

                        return (
                            <div
                                key={ayah.id}
                                id={`ayah-${ayah.ayah}`}
                                className={`scroll-mt-32 bg-card border rounded-xl p-6 transition-all duration-500 ${playing ? 'ring-2 ring-primary shadow-lg scale-[1.01]' : 'hover:shadow-md'}`}
                            >
                                <div className="flex items-center justify-between mb-4 border-b pb-4 border-border/50">
                                    <span className={`text-xs font-mono px-2 py-1 rounded transition-colors ${playing ? 'bg-primary text-primary-foreground' : 'text-muted-foreground bg-muted'}`}>
                                        {ayah.surah}:{ayah.ayah}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handlePlayClick(ayah.surah, ayah.ayah)}
                                            className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${playing
                                                ? 'text-primary bg-primary/10'
                                                : 'text-primary hover:text-primary/80 border border-primary/20 hover:bg-primary/5'
                                                }`}
                                        >
                                            {playing ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                                            {playing ? 'Pause' : 'Écouter'}
                                        </button>

                                        <button
                                            onClick={() => openTafsir(ayah.surah, ayah.ayah, ayah.text, ayah.translation)}
                                            className="flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent/80 border border-accent/20 hover:bg-accent/5 px-3 py-1.5 rounded-full"
                                        >
                                            <BookOpen className="w-3 h-3" />
                                            Tafsir
                                        </button>

                                        <button
                                            onClick={() => toggleBookmark(ayah.surah, ayah.ayah)}
                                            disabled={!session?.user?.email}
                                            title={!session?.user?.email
                                                ? 'Connectez-vous pour ajouter aux favoris'
                                                : (isBookmarked(ayah.surah, ayah.ayah) ? 'Retirer des favoris' : 'Ajouter aux favoris')}
                                            className={`flex items-center justify-center text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${isBookmarked(ayah.surah, ayah.ayah)
                                                ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/30'
                                                : 'text-muted-foreground border border-border hover:bg-muted/50'
                                                } ${!session?.user?.email ? 'opacity-40 cursor-not-allowed' : ''}`}
                                        >
                                            <Bookmark className={`w-3 h-3 ${isBookmarked(ayah.surah, ayah.ayah) ? 'fill-current' : ''}`} />
                                        </button>
                                    </div>
                                </div>

                                <div className="text-right mb-6" dir="rtl">
                                    {renderArabicText(ayah, playing)}
                                </div>

                                {showPhonetic && ayah.phonetic && (
                                    <div className="mb-4 text-gray-600 dark:text-gray-400 text-sm italic border-l-2 pl-4 border-primary/20 flex justify-between items-center group/phonetic">
                                        {isMasked(ayah.ayah, 'phonetic') ? (
                                            <span 
                                                onClick={() => toggleReveal(ayah.ayah, 'phonetic')}
                                                className="bg-orange-50 hover:bg-orange-100/60 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-colors border border-dashed border-orange-300"
                                            >
                                                👁️ Phonétique masquée (Cliquer pour révéler)
                                            </span>
                                        ) : (
                                            <>
                                                <span>{ayah.phonetic}</span>
                                                {isMaskMode && maskTarget === 'phonetic' && (
                                                    <button 
                                                        onClick={() => toggleReveal(ayah.ayah, 'phonetic')}
                                                        className="text-xs text-orange-500 hover:underline opacity-0 group-hover/phonetic:opacity-100 transition-opacity ml-2"
                                                    >
                                                        Masquer
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}

                                <div className="text-left dir-ltr flex justify-between items-start group/translation">
                                    {isMasked(ayah.ayah, 'translation') ? (
                                        <span 
                                            onClick={() => toggleReveal(ayah.ayah, 'translation')}
                                            className="bg-orange-50 hover:bg-orange-100/60 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 text-sm px-4 py-2.5 rounded-xl cursor-pointer transition-colors border border-dashed border-orange-300 w-full text-center"
                                        >
                                            👁️ Traduction masquée (Cliquer pour révéler)
                                        </span>
                                    ) : (
                                        <>
                                            <p className="text-foreground/80 text-lg leading-relaxed flex-1">
                                                {ayah.translation}
                                            </p>
                                            {isMaskMode && maskTarget === 'translation' && (
                                                <button 
                                                    onClick={() => toggleReveal(ayah.ayah, 'translation')}
                                                    className="text-xs text-orange-500 hover:underline opacity-0 group-hover/translation:opacity-100 transition-opacity ml-4 shrink-0"
                                                >
                                                    Masquer
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div >
            )}

            <TafsirModal
                isOpen={tafsirState.isOpen}
                onClose={() => setTafsirState({ ...tafsirState, isOpen: false })}
                surahNumber={tafsirState.surahNumber}
                ayahNumber={tafsirState.ayahNumber}
                ayahText={tafsirState.text}
                translation={tafsirState.translation}
                onNavigate={(dir) => {
                    const currentIdx = ayahs.findIndex(a => a.ayah === tafsirState.ayahNumber);
                    if (currentIdx === -1) return;
                    const nextIdx = dir === 'next' ? currentIdx + 1 : currentIdx - 1;
                    const targetAyah = ayahs[nextIdx];
                    if (targetAyah) {
                        setTafsirState({
                            ...tafsirState,
                            ayahNumber: targetAyah.ayah,
                            text: targetAyah.text,
                            translation: targetAyah.translation
                        });
                    }
                }}
                hasNext={ayahs.findIndex(a => a.ayah === tafsirState.ayahNumber) !== -1 && ayahs.findIndex(a => a.ayah === tafsirState.ayahNumber) < ayahs.length - 1}
                hasPrev={ayahs.findIndex(a => a.ayah === tafsirState.ayahNumber) > 0}
            />
            <audio ref={audioRef} className="hidden" preload="none" playsInline />
        </>
    );
}
