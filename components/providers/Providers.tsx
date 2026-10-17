'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { useState } from 'react';

import { SettingsProvider } from '@/context/SettingsContext';

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        // Pas de re-fetch de /api/auth/session à chaque retour sur l'onglet (iOS en déclenche beaucoup)
        <SessionProvider refetchOnWindowFocus={false}>
            <QueryClientProvider client={queryClient}>
                <SettingsProvider>
                    {children}
                </SettingsProvider>
            </QueryClientProvider>
        </SessionProvider>
    );
}
