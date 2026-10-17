'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useSyncExternalStore } from 'react';

export interface ProgressData {
    progressPercent: number;
    completedDays: number;
    streak: number;
    dailyProgress: Record<string, boolean>;
    userName?: string;
    completedJuzs: number[];
}

export const PROGRESS_QUERY_KEY = ['progress'] as const;

// Dernière progression connue, affichée immédiatement à l'ouverture pendant que
// la session puis /api/progress se chargent (au lieu d'un cercle à 0 %).
const PROGRESS_STORAGE_KEY = 'progressCache';

const subscribeNoop = () => () => {};

function readCachedRaw(): string | null {
    try {
        return localStorage.getItem(PROGRESS_STORAGE_KEY);
    } catch {
        return null;
    }
}

/** Lu après l'hydratation seulement (null côté serveur) pour ne pas désaligner le HTML. */
function useCachedProgress(): ProgressData | undefined {
    const raw = useSyncExternalStore(subscribeNoop, readCachedRaw, () => null);
    return useMemo(() => {
        if (!raw) return undefined;
        try {
            return JSON.parse(raw) as ProgressData;
        } catch {
            return undefined;
        }
    }, [raw]);
}

/**
 * Progression de l'utilisateur connecté, partagée entre l'accueil, le calendrier
 * et la page du jour (une seule requête /api/progress grâce au cache React Query).
 */
export function useProgress() {
    const { status } = useSession();
    const cached = useCachedProgress();

    const query = useQuery<ProgressData>({
        queryKey: PROGRESS_QUERY_KEY,
        queryFn: async () => {
            const res = await fetch('/api/progress');
            if (!res.ok) throw new Error('Failed to load progress');
            return res.json();
        },
        enabled: status === 'authenticated',
        staleTime: 30_000,
        retry: false,
        placeholderData: status === 'unauthenticated' ? undefined : cached,
    });

    useEffect(() => {
        try {
            if (query.data && !query.isPlaceholderData) {
                localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(query.data));
            } else if (status === 'unauthenticated') {
                localStorage.removeItem(PROGRESS_STORAGE_KEY);
            }
        } catch { /* stockage indisponible */ }
    }, [query.data, query.isPlaceholderData, status]);

    return query;
}

/** Met à jour le cache après une validation, sans attendre un nouveau GET (lui-même caché 30 s côté navigateur). */
export function useSetDayCompleted() {
    const queryClient = useQueryClient();

    return (dayId: number, completed: boolean) => {
        queryClient.setQueryData<ProgressData>(PROGRESS_QUERY_KEY, (prev) => {
            if (!prev) return prev;
            const dailyProgress = { ...prev.dailyProgress, [dayId.toString()]: completed };
            const completedDays = Object.values(dailyProgress).filter(Boolean).length;
            return {
                ...prev,
                dailyProgress,
                completedDays,
                progressPercent: Math.round((completedDays / 40) * 100),
            };
        });
    };
}
