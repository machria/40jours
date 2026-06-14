'use client';

import { useRef, useEffect } from 'react';
import { Play, Pause, BookOpen, EyeOff, Bookmark } from 'lucide-react';
import { TajwidText } from '@/components/TajwidText';
import { useWordByWordAudio, QuranWord } from '@/hooks/useWordByWordAudio';
import { useSettings } from '@/context/SettingsContext';
import { useSession } from 'next-auth/react';
import { useBookmarks } from '@/hooks/useBookmarks';

interface AyahWordByWordProps {
    surah: number;
    ayah: number;
    words: QuranWord[];
    translation: string;
    isPlaying: boolean;
    onPlayClick: () => void;
    onTafsirClick: () => void;
    audioRef: React.RefObject<HTMLAudioElement | null>;
    showPhonetic: boolean;
    reversePhonetics?: boolean;
    surahName?: string;
    isMaskMode?: boolean;
    maskTarget?: 'arabe' | 'phonetic' | 'translation';
    isMasked?: (ayahNum: number, target: 'arabe' | 'phonetic' | 'translation') => boolean;
    toggleReveal?: (ayahNum: number, target: 'arabe' | 'phonetic' | 'translation', e?: React.MouseEvent) => void;
}

export default function AyahWordByWord({
    surah,
    ayah,
    words,
    translation,
    isPlaying,
    onPlayClick,
    onTafsirClick,
    audioRef,
    showPhonetic,
    reversePhonetics = false,
    surahName,
    isMaskMode = false,
    maskTarget,
    isMasked,
    toggleReveal
}: AyahWordByWordProps) {
    const { fontSize, fontSizes } = useSettings();
    const currentFontSize = fontSizes[fontSize];

    const { data: session } = useSession();
    const { isBookmarked, toggleBookmark } = useBookmarks();

    const { activeWordIndices } = useWordByWordAudio(audioRef, words, isPlaying);

    return (
        <div
            id={`ayah-${ayah}`}
            className={`scroll-mt-32 bg-card border rounded-xl p-4 md:p-6 transition-all duration-500 ${isPlaying ? 'ring-2 ring-primary shadow-lg scale-[1.01]' : 'hover:shadow-md'}`}
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 border-b pb-4 border-border/50">
                <span className={`w-fit text-xs font-mono px-2 py-1 rounded transition-colors ${isPlaying ? 'bg-primary text-primary-foreground' : 'text-muted-foreground bg-muted'}`}>
                    Sourate {surah} {surahName ? `(${surahName})` : ''} : Verset {ayah}
                </span>
                <div className="flex gap-2 self-end sm:self-auto">
                    <button
                        onClick={onPlayClick}
                        className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${isPlaying
                            ? 'text-primary bg-primary/10'
                            : 'text-primary hover:text-primary/80 border border-primary/20 hover:bg-primary/5'
                            }`}
                    >
                        {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                        {isPlaying ? 'Pause' : 'Écouter'}
                    </button>

                    <button
                        onClick={onTafsirClick}
                        className="flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent/80 border border-accent/20 hover:bg-accent/5 px-3 py-1.5 rounded-full"
                    >
                        <BookOpen className="w-3 h-3" />
                        Tafsir
                    </button>

                    <button
                        onClick={() => toggleBookmark(surah, ayah)}
                        disabled={!session?.user?.email}
                        title={!session?.user?.email
                            ? 'Connectez-vous pour ajouter aux favoris'
                            : (isBookmarked(surah, ayah) ? 'Retirer des favoris' : 'Ajouter aux favoris')}
                        className={`flex items-center justify-center text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${isBookmarked(surah, ayah)
                            ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/30'
                            : 'text-muted-foreground border border-border hover:bg-muted/50'
                            } ${!session?.user?.email ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                        <Bookmark className={`w-3 h-3 ${isBookmarked(surah, ayah) ? 'fill-current' : ''}`} />
                    </button>
                </div>
            </div>

            <div className={`text-right mb-6 flex flex-row flex-wrap gap-x-2 gap-y-6 relative ${isMaskMode && maskTarget === 'arabe' && isMasked && !isMasked(ayah, 'arabe') ? 'ring-2 ring-orange-400 rounded-2xl p-4 bg-primary/5' : ''}`} dir="rtl">
                    {isMaskMode && maskTarget === 'arabe' && isMasked && !isMasked(ayah, 'arabe') && (
                        <button
                            onClick={(e) => toggleReveal?.(ayah, 'arabe', e as React.MouseEvent)}
                            className="absolute top-1 right-1 text-[10px] uppercase font-bold tracking-wider bg-orange-500 text-white rounded px-2 py-0.5 hover:bg-orange-600 transition-colors shadow-sm z-10"
                        >
                            Masquer
                        </button>
                    )}
                    {words.map((word, i) => {
                        const isActive = activeWordIndices.includes(i);
                        const hasAudio = word.timestamp !== null;
                        const isEndMarker = word.char_type === 'end';
                        const arabeMasked = isMaskMode && maskTarget === 'arabe' && isMasked ? isMasked(ayah, 'arabe') : false;
                        const phoneticMasked = isMaskMode && maskTarget === 'phonetic' && isMasked ? isMasked(ayah, 'phonetic') : false;

                        return (
                            <div key={word.id} className="inline-flex flex-col items-center">
                                {isEndMarker ? (
                                    <span className="inline-flex items-center justify-center w-8 h-8 text-xs border rounded-full font-sans text-muted-foreground align-middle mx-1 bg-background select-none">
                                        {word.text}
                                    </span>
                                ) : arabeMasked ? (
                                    <div
                                        onClick={(e) => toggleReveal?.(ayah, 'arabe', e)}
                                        className="px-2 py-1 rounded cursor-pointer bg-orange-100 hover:bg-orange-200 dark:bg-orange-950/30 dark:hover:bg-orange-950/50 border border-dashed border-orange-300 transition-colors select-none"
                                        title="Cliquer pour révéler"
                                        style={{ minWidth: '2rem', minHeight: currentFontSize }}
                                    >
                                        <span className="text-orange-400 text-xs font-bold">؟</span>
                                    </div>
                                ) : (
                                    <div
                                        className={`px-1 rounded transition-colors duration-200 ${isActive ? 'bg-primary/20 text-primary' : hasAudio ? 'text-foreground hover:bg-primary/10 cursor-pointer' : 'text-foreground/40'}`}
                                        onClick={() => {
                                            if (hasAudio && isPlaying && audioRef.current) {
                                                audioRef.current.currentTime = word.timestamp!.from / 1000;
                                            } else if (!isPlaying) {
                                                onPlayClick();
                                                setTimeout(() => {
                                                    if (audioRef.current && hasAudio) {
                                                        audioRef.current.currentTime = word.timestamp!.from / 1000;
                                                    }
                                                }, 100);
                                            }
                                        }}
                                        title={word.translation}
                                    >
                                        <TajwidText
                                            text={word.text}
                                            className="font-kufi leading-[2.2]"
                                            style={{ fontSize: currentFontSize }}
                                        />
                                    </div>
                                )}

                                {/* Transliteration below the word */}
                                {showPhonetic && !isEndMarker && word.transliteration && !phoneticMasked && (
                                    <span
                                        className={`mt-2 text-xs font-sans dir-rtl transition-colors duration-200 ${isActive ? 'text-primary font-bold' : hasAudio ? 'text-muted-foreground' : 'text-muted-foreground/40'} ${reversePhonetics ? 'tracking-[0.1em]' : ''}`}
                                        dir="rtl"
                                        title={reversePhonetics ? `Lecture normale: ${word.transliteration}` : undefined}
                                    >
                                        {reversePhonetics ? word.transliteration.split('').reverse().join('') : word.transliteration}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>

            {/* Phonetic mask reveal button (shown when phonetic is masked) */}
            {showPhonetic && isMaskMode && maskTarget === 'phonetic' && isMasked && (
                <div className="mb-4 text-gray-600 dark:text-gray-400 text-sm italic border-l-2 pl-4 border-primary/20 flex justify-between items-center group/phonetic">
                    {isMasked(ayah, 'phonetic') ? (
                        <span
                            onClick={() => toggleReveal?.(ayah, 'phonetic')}
                            className="bg-orange-50 hover:bg-orange-100/60 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-colors border border-dashed border-orange-300"
                        >
                            👁️ Phonétique masquée (Cliquer pour révéler)
                        </span>
                    ) : (
                        <button
                            onClick={() => toggleReveal?.(ayah, 'phonetic')}
                            className="text-xs text-orange-500 hover:underline opacity-0 group-hover/phonetic:opacity-100 transition-opacity"
                        >
                            Masquer
                        </button>
                    )}
                </div>
            )}

            <div className="text-left dir-ltr mt-4 pt-4 border-t border-border/30 flex justify-between items-start group/translation">
                {isMaskMode && maskTarget === 'translation' && isMasked && isMasked(ayah, 'translation') ? (
                    <span
                        onClick={() => toggleReveal?.(ayah, 'translation')}
                        className="bg-orange-50 hover:bg-orange-100/60 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 text-sm px-4 py-2.5 rounded-xl cursor-pointer transition-colors border border-dashed border-orange-300 w-full text-center"
                    >
                        👁️ Traduction masquée (Cliquer pour révéler)
                    </span>
                ) : (
                    <>
                        <p className="text-foreground/80 text-lg leading-relaxed flex-1">
                            {translation}
                        </p>
                        {isMaskMode && maskTarget === 'translation' && (
                            <button
                                onClick={() => toggleReveal?.(ayah, 'translation')}
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
}
