'use client';

import { useState, useRef, useEffect, useCallback, MutableRefObject } from 'react';

export type AudioRepeatMode = 'off' | 'single' | 'all';

export interface AyahAudio {
    surah: number;
    ayah: number;
    url: string;
    reciter?: string;
    metadata?: {
        surahName?: string;
        text?: string;
    };
}

interface UseQuranAudioProps {
    playlist: AyahAudio[];
    onAyahChange?: (ayah: AyahAudio) => void;
    audioRef: MutableRefObject<HTMLAudioElement | null>;
    startIndex?: number;
    endIndex?: number;
    pauseDuration?: number; // 0: none, -1: match verse duration, >0: fixed seconds
}

export function useQuranAudio({
    playlist,
    onAyahChange,
    audioRef,
    startIndex,
    endIndex,
    pauseDuration = 0
}: UseQuranAudioProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    const [repeatMode, setRepeatMode] = useState<AudioRepeatMode>('off');
    const [isLoading, setIsLoading] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);

    const playTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const startIndexRef = useRef(0);
    const endIndexRef = useRef(playlist.length - 1);
    const pauseDurationRef = useRef(0);

    useEffect(() => {
        startIndexRef.current = startIndex !== undefined ? startIndex : 0;
        endIndexRef.current = endIndex !== undefined ? endIndex : playlist.length - 1;
        pauseDurationRef.current = pauseDuration !== undefined ? pauseDuration : 0;
    }, [startIndex, endIndex, pauseDuration, playlist.length]);

    const currentAyah = currentIndex >= 0 && currentIndex < playlist.length ? playlist[currentIndex] : null;

    // Initialize Media Session metadata
    useEffect(() => {
        if (currentAyah && typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
            const nav = navigator as any;
            if (nav.mediaSession) {
                // @ts-ignore
                nav.mediaSession.metadata = new MediaMetadata({
                    title: `Sourate ${currentAyah.surah}, Verset ${currentAyah.ayah}`,
                    artist: 'Mishary Rashid Al-Afasy',
                    album: 'Coran 40 Jours',
                    artwork: [
                        { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
                        { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' }
                    ]
                });

                nav.mediaSession.setActionHandler('play', resume);
                nav.mediaSession.setActionHandler('pause', pause);
                nav.mediaSession.setActionHandler('previoustrack', playPrevious);
                nav.mediaSession.setActionHandler('nexttrack', playNext);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentAyah]);

    const playAtIndex = useCallback(async (index: number) => {
        if (index < 0 || index >= playlist.length) return;

        if (playTimeoutRef.current) {
            clearTimeout(playTimeoutRef.current);
            playTimeoutRef.current = null;
        }
        setIsWaiting(false);

        const audio = audioRef.current;
        if (!audio) return;

        const item = playlist[index];

        if (audio.src !== window.location.origin + item.url && audio.src !== item.url) {
            audio.src = item.url;
        }

        audio.onended = () => {
            handleEnded(index);
        };

        audio.onplay = () => setIsPlaying(true);
        audio.onpause = () => setIsPlaying(false);
        audio.onerror = (e) => {
            console.error("Audio error", e);
            setIsLoading(false);
            setIsPlaying(false);
            setIsWaiting(false);
        };

        setCurrentIndex(index);
        setIsLoading(true);

        try {
            await audio.play();
            if (onAyahChange) onAyahChange(item);
        } catch (err: any) {
            if (err.name === 'AbortError') {
                console.log('Audio play aborted (user switched track)');
            } else {
                console.error("Play failed", err);
                setIsPlaying(false);
            }
        } finally {
            setIsLoading(false);
        }
    }, [playlist, onAyahChange]);

    const repeatModeRef = useRef(repeatMode);
    useEffect(() => { repeatModeRef.current = repeatMode; }, [repeatMode]);

    const playlistRef = useRef(playlist);
    useEffect(() => { playlistRef.current = playlist; }, [playlist]);

    const handleEnded = (endedIndex: number) => {
        const mode = repeatModeRef.current;
        const list = playlistRef.current;
        const startIdx = startIndexRef.current;
        const endIdx = endIndexRef.current;
        const pauseDur = pauseDurationRef.current;

        let nextIndex = -1;
        if (mode === 'single') {
            nextIndex = endedIndex;
        } else {
            if (endedIndex < endIdx && endedIndex < list.length - 1) {
                nextIndex = endedIndex + 1;
            } else if (mode === 'all') {
                nextIndex = startIdx;
            }
        }

        if (nextIndex !== -1) {
            if (pauseDur !== 0) {
                let delayMs = 0;
                if (pauseDur === -1) {
                    const duration = audioRef.current?.duration || 4; // fallback to 4s
                    delayMs = Math.round(duration * 1000);
                } else if (pauseDur > 0) {
                    delayMs = pauseDur * 1000;
                }

                if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);
                setIsWaiting(true);
                playTimeoutRef.current = setTimeout(() => {
                    setIsWaiting(false);
                    playAtIndex(nextIndex);
                }, delayMs);
            } else {
                playAtIndex(nextIndex);
            }
        } else {
            setIsPlaying(false);
            setCurrentIndex(-1);
        }
    };

    const play = (ayah: AyahAudio) => {
        if (playTimeoutRef.current) {
            clearTimeout(playTimeoutRef.current);
            playTimeoutRef.current = null;
        }
        setIsWaiting(false);
        const index = playlist.findIndex(a => a.surah === ayah.surah && a.ayah === ayah.ayah);
        if (index !== -1) {
            playAtIndex(index);
        }
    };

    const resume = () => {
        if (playTimeoutRef.current) {
            clearTimeout(playTimeoutRef.current);
            playTimeoutRef.current = null;
        }
        setIsWaiting(false);
        if (currentIndex !== -1 && audioRef.current) {
            audioRef.current.play().catch(console.error);
        } else if (playlist.length > 0) {
            playAtIndex(startIndexRef.current);
        }
    };

    const pause = () => {
        if (playTimeoutRef.current) {
            clearTimeout(playTimeoutRef.current);
            playTimeoutRef.current = null;
        }
        setIsWaiting(false);
        if (audioRef.current) {
            audioRef.current.pause();
        }
    };

    const togglePlay = () => {
        if (isPlaying) pause();
        else resume();
    };

    const playNext = () => {
        const endIdx = endIndexRef.current;
        if (currentIndex < endIdx && currentIndex < playlist.length - 1) {
            playAtIndex(currentIndex + 1);
        }
    };

    const playPrevious = () => {
        const startIdx = startIndexRef.current;
        if (currentIndex > startIdx) {
            playAtIndex(currentIndex - 1);
        }
    };

    const toggleRepeat = () => {
        setRepeatMode(prev => {
            if (prev === 'off') return 'single';
            if (prev === 'single') return 'all';
            return 'off';
        });
    };

    // Cleanup
    useEffect(() => {
        return () => {
            if (playTimeoutRef.current) {
                clearTimeout(playTimeoutRef.current);
            }
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, []);

    return {
        isPlaying,
        isLoading,
        isWaiting,
        currentAyah,
        currentIndex,
        repeatMode,
        play,
        pause,
        togglePlay,
        playNext,
        playPrevious,
        toggleRepeat,
        playlist
    };
}
