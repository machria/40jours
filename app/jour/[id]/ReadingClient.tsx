'use client';

import { plan40jours } from '@/data/plan40jours';
import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Play, Pause, CheckCircle, BookOpen, Search, Repeat, Repeat1, SlidersHorizontal, X } from 'lucide-react';
import { useQueries } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useProgress, useSetDayCompleted } from '@/hooks/useProgress';
import ShareAppButton from '@/components/ShareAppButton';
import { getQuranPage, QuranPageData } from '@/lib/quranApi';
import TafsirModal from '@/components/reading/TafsirModal';
import { TajwidText } from '@/components/TajwidText';
import confetti from 'canvas-confetti';
import { useQuranAudio } from '@/hooks/useQuranAudio';
import { useScrollPersistence } from '@/hooks/useScrollPersistence';
import AyahWordByWord from '@/components/reading/AyahWordByWord';
import { useSettings } from '@/context/SettingsContext';
import { getAyahAudioUrl } from '@/lib/audioUrls';

interface ReadingClientProps {
    dayId: number;
}

// Jours où l'on propose d'inviter un proche après validation (éviter la lassitude)
const SHARE_PROMPT_DAYS = [1, 7, 20, 40];

// Petit carillon de réussite généré localement (pas de fichier audio tiers)
function playSuccessChime() {
    try {
        const ctx = new AudioContext();
        [523.25, 783.99].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const start = ctx.currentTime + i * 0.12;
            osc.frequency.value = freq;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.0001, start);
            gain.gain.exponentialRampToValueAtTime(0.2, start + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.4);
            osc.connect(gain).connect(ctx.destination);
            osc.start(start);
            osc.stop(start + 0.45);
        });
        setTimeout(() => ctx.close(), 1000);
    } catch { /* Web Audio indisponible */ }
}

export default function ReadingClient({ dayId }: ReadingClientProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const dayPlan = plan40jours.find(d => d.jour === dayId);

    // Tafsir State
    const [tafsirState, setTafsirState] = useState<{
        isOpen: boolean;
        surahNumber: number;
        ayahNumber: number;
        text: string;
        translation?: string;
    }>({ isOpen: false, surahNumber: 0, ayahNumber: 0, text: '' });

    // Phonetics State
    const [phoneticsData, setPhoneticsData] = useState<any[]>([]);
    const [showPhonetic, setShowPhonetic] = useState(false);
    const phoneticsLoaded = useRef(false);

    useEffect(() => {
        if (!showPhonetic || phoneticsLoaded.current) return;
        phoneticsLoaded.current = true;
        fetch('/quran-transliteration.json')
            .then(res => res.json())
            .then(data => setPhoneticsData(data.quran))
            .catch(err => console.error("Error loading phonetics", err));
    }, [showPhonetic]);

    const getPhonetic = (surah: number, ayah: number) => {
        if (!phoneticsData.length) return null;
        return phoneticsData.find(p => p.chapter === surah && p.verse === ayah)?.text;
    };

    const startPage = dayPlan?.startPage || 1;
    const endPage = dayPlan?.endPage || 1;
    const pagesToFetch = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    // Progressive Loading
    const results = useQueries({
        queries: pagesToFetch.map(page => ({
            queryKey: ['quran-page', page],
            queryFn: () => getQuranPage(page),
            staleTime: Infinity,
            keepPreviousData: true
        }))
    });

    const allPagesLoaded = results.every(r => r.isSuccess);

    // Build Playlist
    const playlist = useMemo(() => {
        const list: any[] = [];
        results.forEach(res => {
            if (res.data) {
                res.data.ayahs.forEach(ayah => {
                    list.push({
                        surah: ayah.surahNumber,
                        ayah: ayah.numberInSurah,
                        url: getAyahAudioUrl(ayah.surahNumber, ayah.numberInSurah),
                        metadata: {
                            surahName: `Sourate ${ayah.surahNumber}`,
                            text: ayah.text
                        }
                    });
                });
            }
        });
        return list;
    }, [results]); // Dependency on results array structure

    // Fetch WBW
    const [wbwData, setWbwData] = useState<any[]>([]);
    const [isWordByWordMode, setIsWordByWordMode] = useState(false);
    const { reversePhonetics, setReversePhonetics, fontSize, setFontSize, fontSizes } = useSettings();
    const baseFontSize = fontSizes[fontSize];
    const wbwLoaded = useRef(false);

    useEffect(() => {
        if (!allPagesLoaded || !isWordByWordMode || wbwLoaded.current) return;
        wbwLoaded.current = true;

        const uniqueSurahs = Array.from(new Set(playlist.map(item => item.surah)));
        if (uniqueSurahs.length > 0) {
            Promise.all(
                uniqueSurahs.map(s =>
                    fetch(`/quran/word_by_word/${s}.json`)
                        .then(res => res.json())
                        .then((data: any[]) => data.map(v => ({
                            ...v,
                            surah: s,
                            ayah: parseInt(v.verse_key.split(':')[1])
                        })))
                        .catch(() => [] as any[])
                )
            )
                .then(results => {
                    const flat = results.flat();
                    if (flat.length > 0) setWbwData(flat);
                })
                .catch(err => console.error("Failed to load WbW data", err));
        }
    }, [allPagesLoaded, isWordByWordMode, playlist]);

    // Audio Hook
    const {
        isPlaying,
        currentAyah,
        play,
        pause,
        togglePlay,
        toggleRepeat,
        repeatMode
    } = useQuranAudio({
        playlist,
        audioRef,
        onAyahChange: (ayah) => {
            const element = document.getElementById(`ayah-${ayah.surah}-${ayah.ayah}`);
            if (element) {
                const y = element.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }
    });

    // Scroll Persistence
    useScrollPersistence({
        storageKey: `day_scroll_${dayId}`,
        selector: '[id^="ayah-"]',
        enabled: allPagesLoaded // Only start tracking/restoring when full layout is ready to avoid jumping
    });

    const router = useRouter();
    const { status } = useSession();
    const { data: progress, isFetched: progressFetched } = useProgress();
    const setDayCompleted = useSetDayCompleted();
    const isCompleted = !!progress?.dailyProgress[dayId.toString()];
    const [isSaving, setIsSaving] = useState(false);
    const [justCompleted, setJustCompleted] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (message: string) => {
        setToast(message);
        setTimeout(() => setToast(null), 4000);
    };

    const markCompleted = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dayId, completed: true }),
            });
            if (res.ok) {
                setDayCompleted(dayId, true);
                setJustCompleted(true);
                triggerGamification();
            } else {
                showToast("Erreur lors de la sauvegarde. Veuillez réessayer.");
            }
        } catch (e) {
            console.error("Failed to mark complete", e);
            showToast("Erreur de connexion. Vérifiez votre réseau.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCompletion = () => {
        if (isCompleted || isSaving) return;
        if (status !== 'authenticated') {
            // Revenir sur ce jour après connexion et valider automatiquement
            const callbackUrl = `/jour/${dayId}?validate=1`;
            router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
            return;
        }
        markCompleted();
    };

    // Retour du login avec ?validate=1 : valider le jour puis nettoyer l'URL
    const autoValidated = useRef(false);
    useEffect(() => {
        // attendre la progression pour ne pas re-valider un jour déjà terminé
        if (status !== 'authenticated' || !progressFetched || autoValidated.current) return;
        const params = new URLSearchParams(window.location.search);
        if (params.get('validate') !== '1') return;
        autoValidated.current = true;
        window.history.replaceState(null, '', window.location.pathname);
        if (!isCompleted) markCompleted();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, progressFetched, isCompleted]);

    const triggerGamification = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10B981', '#F59E0B', '#34D399']
        });
        playSuccessChime();
    };

    // En-tête masqué au défilement vers le bas + barre de progression de lecture
    const [headerHidden, setHeaderHidden] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [optionsOpen, setOptionsOpen] = useState(false);
    useEffect(() => {
        let lastY = window.scrollY;
        let ticking = false;
        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const y = window.scrollY;
                const max = document.documentElement.scrollHeight - window.innerHeight;
                setScrollProgress(max > 0 ? Math.min(1, y / max) : 0);
                if (Math.abs(y - lastY) > 8) {
                    setHeaderHidden(y > lastY && y > 120);
                    lastY = y;
                }
                ticking = false;
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    if (!dayPlan) {
        return <div className="p-8 text-center">Plan non trouvé pour le jour {dayId}</div>;
    }

    const openTafsir = (surah: number, ayah: number, text: string, translation: string) => {
        setTafsirState({ isOpen: true, surahNumber: surah, ayahNumber: ayah, text, translation });
    };

    const isAyahPlaying = (surah: number, ayah: number) => {
        return currentAyah?.surah === surah && currentAyah?.ayah === ayah;
    };

    const handlePlayAyah = (surah: number, ayah: number) => {
        if (isAyahPlaying(surah, ayah) && isPlaying) {
            pause();
        } else {
            play({ surah, ayah, url: '' }); // Hook finds the URL from playlist
        }
    };

    const SkeletonPage = ({ idx }: { idx: number }) => (
        <div key={`skel-${idx}`} className="bg-card border rounded-xl shadow-sm overflow-hidden mb-8 h-[500px] animate-pulse relative">
            <div className="absolute inset-x-0 top-0 h-10 bg-muted/40 border-b flex items-center justify-center">
                <span className="w-20 h-3 bg-muted/50 rounded"></span>
            </div>
            <div className="p-8 space-y-8 mt-12 opacity-50">
                <div className="h-4 bg-muted/40 w-full ml-auto rounded" />
                <div className="h-4 bg-muted/40 w-5/6 ml-auto rounded" />
                <div className="h-4 bg-muted/40 w-4/6 ml-auto rounded" />
                <div className="h-4 bg-muted/40 w-full ml-auto rounded" />
                <div className="h-4 bg-muted/40 w-3/4 ml-auto rounded" />
                <div className="h-4 bg-muted/40 w-5/6 ml-auto rounded" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-background/80 p-3 rounded-full shadow-sm backdrop-blur">
                    <p className="text-muted-foreground text-xs font-semibold animate-bounce">Chargement Page {idx + 1}...</p>
                </div>
            </div>
        </div>
    );

    const toggleClass = (active: boolean) =>
        `flex items-center justify-between w-full min-h-12 px-4 rounded-xl border text-sm font-medium transition-colors ${active ? 'bg-primary/10 text-primary border-primary/30' : 'border-border hover:bg-muted'}`;

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* En-tête compact (56 px), masqué au défilement vers le bas */}
            <header
                className={`sticky top-0 z-40 bg-background/95 backdrop-blur border-b shadow-sm transition-transform duration-300 ${headerHidden && !optionsOpen ? '-translate-y-full' : 'translate-y-0'}`}
            >
                <div className="h-14 px-2 flex items-center gap-1">
                    <Link href="/" className="p-2.5 hover:bg-muted rounded-full shrink-0" aria-label="Retour à l'accueil">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <div className="flex-1 min-w-0 text-center">
                        <h1 className="text-base font-bold font-kufi text-primary leading-tight">Jour {dayId}</h1>
                        <p className="text-xs text-muted-foreground truncate" title={dayPlan.sourates}>{dayPlan.sourates}</p>
                    </div>
                    <div className="hidden lg:flex items-center gap-2 shrink-0">
                        <button
                            onClick={() => setShowPhonetic(!showPhonetic)}
                            aria-pressed={showPhonetic}
                            className={`text-xs font-semibold px-3 min-h-9 rounded-full border transition-colors ${showPhonetic ? 'bg-primary/10 text-primary border-primary/20' : 'text-muted-foreground border-border hover:text-foreground'}`}
                        >
                            Phonétique
                        </button>
                        <button
                            onClick={() => setIsWordByWordMode(!isWordByWordMode)}
                            aria-pressed={isWordByWordMode}
                            className={`text-xs font-semibold px-3 min-h-9 rounded-full border transition-colors ${isWordByWordMode ? 'bg-primary text-primary-foreground border-primary' : 'text-primary border-primary/20 hover:bg-primary/5'}`}
                        >
                            Mot par Mot
                        </button>
                    </div>
                    <button
                        onClick={() => setOptionsOpen(true)}
                        className="p-2.5 hover:bg-muted rounded-full shrink-0"
                        aria-label="Options de lecture"
                        aria-haspopup="dialog"
                    >
                        <SlidersHorizontal className="w-5 h-5" />
                    </button>
                    <button
                        className={`p-2.5 rounded-full transition-colors shrink-0 ${isCompleted ? 'text-green-600 bg-green-100 dark:bg-green-900/30' : 'text-primary hover:bg-primary/10'}`}
                        onClick={handleCompletion}
                        disabled={isCompleted || isSaving}
                        aria-label={isCompleted ? 'Jour validé' : 'Marquer le jour comme terminé'}
                        title={isCompleted ? 'Jour validé' : 'Marquer comme terminé'}
                    >
                        <CheckCircle className={`w-6 h-6 ${isCompleted ? 'fill-current' : ''}`} />
                    </button>
                </div>
                {/* Progression de lecture */}
                <div className="h-0.5" aria-hidden="true">
                    <div className="h-full bg-primary transition-[width] duration-150" style={{ width: `${scrollProgress * 100}%` }} />
                </div>
            </header>

            {/* Feuille « Options » */}
            {optionsOpen && (
                <div className="fixed inset-0 z-60 bg-black/50 flex items-end md:items-center justify-center" onClick={() => setOptionsOpen(false)}>
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="reading-options-title"
                        className="bg-background w-full md:max-w-md rounded-t-2xl md:rounded-2xl border shadow-xl p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:pb-4 space-y-3 max-h-[85vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between">
                            <h2 id="reading-options-title" className="font-semibold text-lg">Options de lecture</h2>
                            <button onClick={() => setOptionsOpen(false)} className="p-2.5 hover:bg-muted rounded-lg" aria-label="Fermer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <button onClick={() => setShowPhonetic(!showPhonetic)} aria-pressed={showPhonetic} className={toggleClass(showPhonetic)}>
                            Phonétique <span className="text-xs">{showPhonetic ? 'Activée' : 'Désactivée'}</span>
                        </button>
                        <button onClick={() => setIsWordByWordMode(!isWordByWordMode)} aria-pressed={isWordByWordMode} className={toggleClass(isWordByWordMode)}>
                            Mot par mot <span className="text-xs">{isWordByWordMode ? 'Activé' : 'Désactivé'}</span>
                        </button>
                        {isWordByWordMode && (
                            <button onClick={() => setReversePhonetics(!reversePhonetics)} aria-pressed={reversePhonetics} className={toggleClass(reversePhonetics)}>
                                Phonétique RTL <span className="text-xs">{reversePhonetics ? 'Activée' : 'Désactivée'}</span>
                            </button>
                        )}

                        <div className="space-y-2 pt-1">
                            <p className="text-sm font-medium text-muted-foreground">Taille du texte</p>
                            <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Taille du texte">
                                {(Object.keys(fontSizes) as Array<keyof typeof fontSizes>).map((size, i) => (
                                    <button
                                        key={size}
                                        role="radio"
                                        aria-checked={fontSize === size}
                                        aria-label={['Petite', 'Moyenne', 'Grande', 'Très grande'][i]}
                                        onClick={() => setFontSize(size)}
                                        className={`min-h-12 rounded-xl border font-semibold transition-colors ${fontSize === size ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}
                                        style={{ fontSize: `${14 + i * 3}px` }}
                                    >
                                        A
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                            <Link href={`/jour/${dayId}/tafsir`} className="flex items-center justify-center gap-2 min-h-12 rounded-xl border text-sm font-semibold text-accent hover:bg-accent/5">
                                <BookOpen className="w-4 h-4" /> Tafsir complet
                            </Link>
                            <Link href="/search" className="flex items-center justify-center gap-2 min-h-12 rounded-xl border text-sm font-semibold hover:bg-muted">
                                <Search className="w-4 h-4" /> Recherche
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="max-w-4xl mx-auto p-4 space-y-8">
                {/* Description Block */}
                <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-xl p-6 text-center shadow-sm">
                    <h2 className="text-xl font-bold text-emerald-800 dark:text-emerald-300 mb-2 font-kufi">
                        {dayPlan.theme}
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed italic max-w-2xl mx-auto">
                        &quot;{dayPlan.description}&quot;
                    </p>
                </div>

                {results.map((result, idx) => {
                    const pageNum = pagesToFetch[idx];

                    if (result.isLoading) return <SkeletonPage key={pageNum} idx={idx} />;
                    if (result.error) return (
                        <div key={pageNum} className="p-8 text-center text-red-500 bg-red-50 rounded-xl border border-red-100 flex flex-col items-center gap-2">
                            <p>Erreur lors du chargement de la page.</p>
                            <button onClick={() => result.refetch()} className="text-xs px-3 py-1 bg-red-100 rounded-full hover:bg-red-200">Réessayer</button>
                        </div>
                    );
                    const page = result.data as QuranPageData;
                    if (!page) return null;

                    return (
                        <div key={pageNum} className="bg-card border rounded-none md:rounded-xl shadow-sm overflow-hidden mb-8">
                            <div className="bg-muted/30 px-4 py-2 text-center border-b text-xs text-muted-foreground font-mono">
                                Page {page.pageNumber}
                            </div>

                            <div className="divide-y text-right">
                                {page.ayahs.map((ayah) => {
                                    const isPlaying = isAyahPlaying(ayah.surahNumber, ayah.numberInSurah);

                                    const wbwAyah = wbwData.find(w => w.surah === ayah.surahNumber && w.ayah === ayah.numberInSurah);

                                    if (isWordByWordMode && wbwAyah && wbwAyah.words && wbwAyah.words.length > 0) {
                                        return (
                                            <div key={`${ayah.surahNumber}:${ayah.numberInSurah}`} className="p-4">
                                                <AyahWordByWord
                                                    surah={ayah.surahNumber}
                                                    ayah={ayah.numberInSurah}
                                                    words={wbwAyah.words}
                                                    translation={ayah.translation || ''}
                                                    isPlaying={isPlaying}
                                                    onPlayClick={() => handlePlayAyah(ayah.surahNumber, ayah.numberInSurah)}
                                                    onTafsirClick={() => openTafsir(ayah.surahNumber, ayah.numberInSurah, ayah.text, ayah.translation!)}
                                                    audioRef={audioRef}
                                                    showPhonetic={showPhonetic}
                                                    reversePhonetics={reversePhonetics}
                                                    surahName={ayah.surah?.englishName}
                                                />
                                            </div>
                                        );
                                    }

                                    return (
                                        <div
                                            key={`${ayah.surahNumber}:${ayah.numberInSurah}`}
                                            id={`ayah-${ayah.surahNumber}-${ayah.numberInSurah}`}
                                            className={`group p-4 transition-all duration-300 grid gap-4 ${isPlaying
                                                ? 'bg-primary/5 ring-1 ring-primary/20 shadow-sm z-10'
                                                : 'hover:bg-muted/5'
                                                }`}
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2 border-b pb-2 border-gray-100 dark:border-gray-800">
                                                <span className="text-xs font-mono text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded w-fit">
                                                    Sourate {ayah.surahNumber} {ayah.surah?.englishName ? `(${ayah.surah.englishName})` : ''} : Verset {ayah.numberInSurah}
                                                </span>
                                            </div>
                                            {/* Arabic */}
                                            <div className="w-full">
                                                <p className="font-kufi leading-[2.5] text-foreground" dir="rtl" style={{ fontSize: `calc(${baseFontSize} * 1.25)` }}>
                                                    <TajwidText text={ayah.text} className="inline" />
                                                    <span className="mr-2 inline-flex items-center justify-center w-8 h-8 text-xs border rounded-full font-sans text-muted-foreground align-middle">
                                                        {ayah.numberInSurah}
                                                    </span>
                                                </p>
                                            </div>

                                            {/* Phonetic */}
                                            {showPhonetic && (
                                                <div className="w-full text-gray-600 dark:text-gray-400 text-sm italic border-l-2 pl-4 border-primary/20 text-left dir-ltr">
                                                    {getPhonetic(ayah.surahNumber, ayah.numberInSurah)}
                                                </div>
                                            )}

                                            {/* French Translation & Actions */}
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pt-2 dir-ltr text-left">
                                                <p className="text-muted-foreground/90 leading-relaxed font-sans flex-1" style={{ fontSize: `calc(${baseFontSize} * 0.85)` }}>
                                                    {ayah.translation}
                                                </p>

                                                <div className="self-end md:self-start flex items-center gap-2">
                                                    <button
                                                        onClick={() => handlePlayAyah(ayah.surahNumber, ayah.numberInSurah)}
                                                        aria-label={`${isPlaying ? 'Mettre en pause' : 'Écouter'} le verset ${ayah.numberInSurah}`}
                                                        className={`flex items-center gap-1.5 text-sm font-semibold px-4 min-h-11 rounded-full transition-colors ${isPlaying
                                                            ? 'text-primary bg-primary/10'
                                                            : 'text-primary hover:text-primary/80 border border-primary/20 hover:bg-primary/5'
                                                            }`}
                                                    >
                                                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                                        Écouter
                                                    </button>

                                                    <button
                                                        onClick={() => openTafsir(ayah.surahNumber, ayah.numberInSurah, ayah.text, ayah.translation!)}
                                                        aria-label={`Tafsir du verset ${ayah.numberInSurah}`}
                                                        className="flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent/80 border border-accent/20 hover:bg-accent/5 px-4 min-h-11 rounded-full"
                                                    >
                                                        <BookOpen className="w-4 h-4" />
                                                        Tafsir
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}

                {/* Surah Links Section */}
                {allPagesLoaded && (
                    <div className="bg-card/50 border rounded-2xl p-6 mb-8 space-y-4">
                        <h3 className="font-bold flex items-center gap-2 text-primary">
                            <BookOpen className="w-5 h-5" />
                            Lire la sourate complète
                        </h3>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {Array.from(new Set(results.flatMap(r => r.data?.ayahs.map(a => JSON.stringify({ number: a.surahNumber, name: a.surah.englishName })) || [])))
                                .map(s => JSON.parse(s) as { number: number, name: string })
                                .sort((a, b) => a.number - b.number)
                                .map(surah => (
                                    <Link
                                        key={surah.number}
                                        href={`/coran/${surah.number}`}
                                        className="flex items-center justify-between p-4 bg-background border rounded-xl hover:bg-accent/5 hover:border-accent/20 transition-all group"
                                    >
                                        <span className="font-medium text-sm">Sourate {surah.name}</span>
                                        <span className="text-xs text-muted-foreground group-hover:text-accent flex items-center gap-1">
                                            Lire <ChevronLeft className="w-4 h-4 rotate-180" />
                                        </span>
                                    </Link>
                                ))}
                        </div>
                    </div>
                )}

                {/* Validation du jour (fin de lecture) */}
                {allPagesLoaded && (
                    <div className="flex flex-col items-center gap-4 my-8">
                        <button
                            onClick={handleCompletion}
                            disabled={isCompleted || isSaving}
                            className={`flex items-center gap-2 px-6 min-h-12 rounded-full font-semibold transition-all shadow-md ${isCompleted
                                ? 'bg-green-100 text-green-700 border-2 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
                                : 'bg-card text-foreground border-2 border-primary/40 hover:border-primary hover:text-primary active:scale-95'
                                }`}
                        >
                            <CheckCircle className={`w-5 h-5 ${isCompleted ? 'fill-current' : ''}`} />
                            {isCompleted ? 'Jour validé' : isSaving ? 'Enregistrement…' : status === 'authenticated' ? 'Marquer le jour comme terminé' : 'Se connecter pour valider ce jour'}
                        </button>

                        {/* Invitation au partage aux moments forts */}
                        {justCompleted && SHARE_PROMPT_DAYS.includes(dayId) && (
                            <div className="w-full max-w-md bg-primary/5 border border-primary/20 rounded-2xl p-5 text-center space-y-3">
                                <p className="font-semibold">
                                    {dayId === 40 ? 'Défi terminé, Al-Hamdulillah !' : `Jour ${dayId} validé, bravo !`}
                                </p>
                                <p className="text-sm text-muted-foreground">Invitez un proche à faire le défi avec vous.</p>
                                <ShareAppButton
                                    source="day"
                                    label="Inviter un proche"
                                    text={`J'ai terminé le jour ${dayId} du défi « Coran en 40 jours ». Rejoins-moi !`}
                                    className="mx-auto justify-center bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-semibold"
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* End of Day Navigation */}
                {allPagesLoaded && (
                    <div className="flex justify-center py-8">
                        {dayId < 40 ? (
                            <Link href={`/jour/${dayId + 1}`} className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold shadow-lg hover:bg-primary/90 transition-transform active:scale-95">
                                Passer au Jour {dayId + 1}
                            </Link>
                        ) : (
                            <div className="text-center space-y-2">
                                <h2 className="text-2xl font-bold text-accent">Al-Hamdulillah !</h2>
                                <p>Vous avez terminé le défi.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Mini-lecteur audio : au-dessus de la nav du bas (mobile), à droite de la sidebar (md+) */}
            <div className="fixed left-0 right-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] md:bottom-0 md:left-64 bg-card/95 backdrop-blur border-t z-45 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                <div className="max-w-4xl mx-auto px-3 py-2 md:p-3 flex items-center gap-3">
                    <button
                        onClick={togglePlay}
                        aria-label={isPlaying ? 'Mettre en pause' : 'Lancer la récitation'}
                        className={`size-11 shrink-0 rounded-full flex items-center justify-center transition-transform shadow-md ${!allPagesLoaded && playlist.length === 0 ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-primary text-primary-foreground hover:scale-105'}`}
                    >
                        {(!allPagesLoaded && playlist.length === 0) ?
                            <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" /> :
                            (isPlaying ? <Pause className="fill-current w-5 h-5" /> : <Play className="fill-current ml-1 w-5 h-5" />)
                        }
                    </button>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">
                            {currentAyah ? `Sourate ${currentAyah.surah} : Verset ${currentAyah.ayah}` : 'Mishary Rashid'}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            {isPlaying ? "Lecture en cours..." : "Lecture audio"}
                        </p>
                    </div>

                    <button
                        onClick={toggleRepeat}
                        aria-label={`Répétition : ${repeatMode === 'single' ? 'verset' : repeatMode === 'off' ? 'désactivée' : 'tout'}`}
                        className={`p-3 rounded-full transition-all ${repeatMode !== 'off' ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:bg-muted'}`}
                        title="Répéter (Verset / Tout / Off)"
                    >
                        {repeatMode === 'single' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Toast (au-dessus du lecteur et de la nav) */}
            {toast && (
                <div
                    role="alert"
                    className="fixed left-4 right-4 md:left-auto md:right-6 md:w-96 bottom-[calc(8rem+env(safe-area-inset-bottom))] md:bottom-24 z-70 bg-foreground text-background text-sm px-4 py-3 rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-2"
                >
                    {toast}
                </div>
            )}

            <TafsirModal
                isOpen={tafsirState.isOpen}
                onClose={() => setTafsirState({ ...tafsirState, isOpen: false })}
                surahNumber={tafsirState.surahNumber}
                ayahNumber={tafsirState.ayahNumber}
                ayahText={tafsirState.text}
                translation={tafsirState.translation}
            />
            <audio ref={audioRef} className="hidden" preload="none" playsInline />
        </div>
    );
}
