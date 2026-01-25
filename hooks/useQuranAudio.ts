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
}

export function useQuranAudio({ playlist, onAyahChange, audioRef }: UseQuranAudioProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    const [repeatMode, setRepeatMode] = useState<AudioRepeatMode>('off');
    const [isLoading, setIsLoading] = useState(false);

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

        const audio = audioRef.current;
        if (!audio) return;

        const item = playlist[index];
        // Only set src if it changed or if we are restarting?
        // Actually, if we want to play a new item, we must set src.
        // If we want to resume, we use `resume`.

        if (audio.src !== window.location.origin + item.url && audio.src !== item.url) {
            audio.src = item.url;
        }

        // Setup event listeners
        // We assign directly to onended property to avoid piling up listeners
        audio.onended = () => {
            handleEnded(index);
        };

        audio.onplay = () => setIsPlaying(true);
        audio.onpause = () => setIsPlaying(false);
        audio.onerror = (e) => {
            console.error("Audio error", e);
            setIsLoading(false);
            setIsPlaying(false);
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

    // Use a ref for repeatMode to access it inside the event listener without recreating the listener
    const repeatModeRef = useRef(repeatMode);
    useEffect(() => { repeatModeRef.current = repeatMode; }, [repeatMode]);

    const playlistRef = useRef(playlist);
    useEffect(() => { playlistRef.current = playlist; }, [playlist]);

    const handleEnded = (endedIndex: number) => {
        const mode = repeatModeRef.current;
        const list = playlistRef.current;

        if (mode === 'single') {
            // Replay same index
            // We need to re-trigger play
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(console.error);
            }
        } else {
            // Go to next
            if (endedIndex < list.length - 1) {
                playAtIndex(endedIndex + 1);
            } else if (mode === 'all') {
                // Loop back to start
                playAtIndex(0);
            } else {
                // Stop
                setIsPlaying(false);
                setCurrentIndex(-1);
            }
        }
    };

    const play = (ayah: AyahAudio) => {
        const index = playlist.findIndex(a => a.surah === ayah.surah && a.ayah === ayah.ayah);
        if (index !== -1) {
            playAtIndex(index);
        }
    };

    const resume = () => {
        if (currentIndex !== -1 && audioRef.current) {
            audioRef.current.play().catch(console.error);
        } else if (playlist.length > 0) {
            playAtIndex(0);
        }
    };

    const pause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
    };

    const togglePlay = () => {
        if (isPlaying) pause();
        else resume();
    };

    const playNext = () => {
        if (currentIndex < playlist.length - 1) {
            playAtIndex(currentIndex + 1);
        }
    };

    const playPrevious = () => {
        if (currentIndex > 0) {
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
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, []);

    return {
        isPlaying,
        isLoading,
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
