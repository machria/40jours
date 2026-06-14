'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export interface Bookmark {
    surah: number;
    ayah: number;
    addedAt: string;
}

export function useBookmarks() {
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    const enabled = !!session?.user?.email;

    const query = useQuery<Bookmark[]>({
        queryKey: ['bookmarks'],
        queryFn: async () => {
            const res = await fetch('/api/bookmarks');
            if (!res.ok) throw new Error('Failed to fetch bookmarks');
            const data = await res.json();
            return data.bookmarks;
        },
        enabled,
        staleTime: 30_000,
    });

    const toggleMutation = useMutation({
        mutationFn: async (vars: { surah: number; ayah: number; action: 'add' | 'remove' }) => {
            const res = await fetch('/api/bookmarks', {
                method: 'POST',
                body: JSON.stringify(vars),
            });
            if (!res.ok) throw new Error('Failed to update bookmark');
            return res.json() as Promise<{ success: boolean; bookmarks: Bookmark[] }>;
        },
        onMutate: async (vars) => {
            await queryClient.cancelQueries({ queryKey: ['bookmarks'] });
            const previous = queryClient.getQueryData<Bookmark[]>(['bookmarks']) ?? [];
            const next = vars.action === 'add'
                ? [...previous, { surah: vars.surah, ayah: vars.ayah, addedAt: new Date().toISOString() }]
                : previous.filter(b => !(b.surah === vars.surah && b.ayah === vars.ayah));
            queryClient.setQueryData(['bookmarks'], next);
            return { previous };
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) queryClient.setQueryData(['bookmarks'], context.previous);
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['bookmarks'], data.bookmarks);
        },
    });

    const isBookmarked = (surah: number, ayah: number) =>
        (query.data ?? []).some(b => b.surah === surah && b.ayah === ayah);

    const toggleBookmark = (surah: number, ayah: number) => {
        toggleMutation.mutate({
            surah,
            ayah,
            action: isBookmarked(surah, ayah) ? 'remove' : 'add',
        });
    };

    return {
        bookmarks: query.data ?? [],
        isLoading: query.isLoading,
        isBookmarked,
        toggleBookmark,
        isToggling: toggleMutation.isPending,
    };
}
