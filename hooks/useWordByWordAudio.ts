import { useState, useEffect, RefObject } from 'react';

export interface WordTimestamp {
    from: number;
    to: number;
}

export interface QuranWord {
    id: number;
    position: number;
    char_type: string;
    text: string;
    text_indopak?: string;
    translation?: string;
    transliteration?: string;
    timestamp: WordTimestamp | null;
}

export function useWordByWordAudio(
    audioRef: RefObject<HTMLAudioElement | null>,
    words: QuranWord[],
    isPlaying: boolean // We can pass isPlaying so the hook knows if it should run
) {
    const [activeWordIndices, setActiveWordIndices] = useState<number[]>([]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !words.length) return;

        const handleTimeUpdate = () => {
            if (!isPlaying) return;
            // currentTime is in seconds, convert to ms
            const currentTimeMs = audio.currentTime * 1000;

            // Find all active words (some words share the same timestamp)
            const activeIndices: number[] = [];

            for (let i = 0; i < words.length; i++) {
                const ts = words[i].timestamp;
                if (ts) {
                    if (currentTimeMs >= ts.from && currentTimeMs <= ts.to) {
                        activeIndices.push(i);
                    }
                }
            }

            // Only update if changes
            setActiveWordIndices(prev => {
                if (prev.length !== activeIndices.length) return activeIndices;
                for (let i = 0; i < prev.length; i++) {
                    if (prev[i] !== activeIndices[i]) return activeIndices;
                }
                return prev;
            });
        };

        // Attach event listener
        audio.addEventListener('timeupdate', handleTimeUpdate);

        // Cleanup
        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, [audioRef, words, isPlaying]);

    // Cleanup when paused
    useEffect(() => {
        if (!isPlaying) {
            setActiveWordIndices([]);
        }
    }, [isPlaying]);

    return { activeWordIndices };
}
