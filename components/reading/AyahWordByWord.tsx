'use client';

import { useRef, useEffect } from 'react';
import { Play, Pause, BookOpen } from 'lucide-react';
import { TajwidText } from '@/components/TajwidText';
import { useWordByWordAudio, QuranWord } from '@/hooks/useWordByWordAudio';
import { useSettings } from '@/context/SettingsContext';

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
    showPhonetic
}: AyahWordByWordProps) {
    const { fontSize, fontSizes } = useSettings();
    const currentFontSize = fontSizes[fontSize];

    const { activeWordIndices } = useWordByWordAudio(audioRef, words, isPlaying);

    return (
        <div
            id={`ayah-${ayah}`}
            className={`scroll-mt-32 bg-card border rounded-xl p-6 transition-all duration-500 ${isPlaying ? 'ring-2 ring-primary shadow-lg scale-[1.01]' : 'hover:shadow-md'}`}
        >
            <div className="flex items-center justify-between mb-4 border-b pb-4 border-border/50">
                <span className={`text-xs font-mono px-2 py-1 rounded transition-colors ${isPlaying ? 'bg-primary text-primary-foreground' : 'text-muted-foreground bg-muted'}`}>
                    {surah}:{ayah}
                </span>
                <div className="flex gap-2">
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
                </div>
            </div>

            <div className="text-right mb-6 flex flex-row flex-wrap gap-x-2 gap-y-6" dir="rtl">
                {words.map((word, i) => {
                    const isActive = activeWordIndices.includes(i);
                    // Bismillah fix: grey out unpronounced
                    const hasAudio = word.timestamp !== null;
                    const isEndMarker = word.char_type === 'end';

                    return (
                        <div key={word.id} className="inline-flex flex-col items-center">
                            {isEndMarker ? (
                                <span className="inline-flex items-center justify-center w-8 h-8 text-xs border rounded-full font-sans text-muted-foreground align-middle mx-1 bg-background select-none">
                                    {word.text}
                                </span>
                            ) : (
                                <div
                                    className={`px-1 rounded transition-colors duration-200 ${isActive ? 'bg-primary/20 text-primary' : hasAudio ? 'text-foreground hover:bg-primary/10 cursor-pointer' : 'text-foreground/40'}`}
                                    onClick={() => {
                                        if (hasAudio && isPlaying && audioRef.current) {
                                            audioRef.current.currentTime = word.timestamp!.from / 1000;
                                        } else if (!isPlaying) {
                                            onPlayClick();
                                            // Ideally we pass an initial time to start from this word, 
                                            // but for now just play the verse
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
                            {showPhonetic && !isEndMarker && word.transliteration && (
                                <span
                                    className={`mt-2 text-xs font-sans dir-ltr transition-colors duration-200 ${isActive ? 'text-primary font-bold' : hasAudio ? 'text-muted-foreground' : 'text-muted-foreground/40'}`}
                                    dir="ltr"
                                >
                                    {word.transliteration}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="text-left dir-ltr mt-4 pt-4 border-t border-border/30">
                <p className="text-foreground/80 text-lg leading-relaxed">
                    {translation}
                </p>
            </div>
        </div>
    );
}
