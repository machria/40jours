'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export interface ProgressData {
    progressPercent: number;
    completedDays: number;
    streak: number;
    dailyProgress: Record<string, boolean>;
    userName?: string;
    completedJuzs: number[];
}

export const PROGRESS_QUERY_KEY = ['progress'] as const;

/**
 * Progression de l'utilisateur connecté, partagée entre l'accueil, le calendrier
 * et la page du jour (une seule requête /api/progress grâce au cache React Query).
 */
export function useProgress() {
    const { status } = useSession();

    return useQuery<ProgressData>({
        queryKey: PROGRESS_QUERY_KEY,
        queryFn: async () => {
            const res = await fetch('/api/progress');
            if (!res.ok) throw new Error('Failed to load progress');
            return res.json();
        },
        enabled: status === 'authenticated',
        staleTime: 30_000,
        retry: false,
    });
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
