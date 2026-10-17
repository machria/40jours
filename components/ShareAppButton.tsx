'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
    source: 'menu' | 'home' | 'day' | 'group';
    path?: string;
    label?: string;
    text?: string;
    iconOnly?: boolean;
    className?: string;
};

const DEFAULT_TEXT = 'Je lis le Coran en 40 jours avec cette app (tafsir, audio, phonétique). Rejoins-moi !';

export default function ShareAppButton({
    source,
    path = '/',
    label = "Partager l'application",
    text = DEFAULT_TEXT,
    iconOnly = false,
    className,
}: Props) {
    const [copied, setCopied] = useState(false);

    const onShare = async () => {
        // construit au clic : pas d'accès à window pendant le rendu serveur
        const url = new URL(path, window.location.origin);
        url.searchParams.set('ref', source === 'group' ? 'group-invite' : `share-${source}`);
        const data = { title: 'Coran 40 Jours', text, url: url.toString() };

        if (navigator.share && navigator.canShare?.(data) !== false) {
            try { await navigator.share(data); } catch { /* partage annulé */ }
            return;
        }
        try {
            await navigator.clipboard.writeText(data.url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch { /* presse-papiers indisponible */ }
    };

    const Icon = copied ? Check : Share2;

    return (
        <button
            type="button"
            onClick={onShare}
            aria-label={copied ? 'Lien copié' : label}
            className={cn('flex items-center gap-3 min-h-11 px-4 rounded-lg transition-colors hover:bg-muted', className)}
        >
            <Icon className="w-5 h-5 shrink-0" />
            {!iconOnly && <span className="text-sm">{copied ? 'Lien copié' : label}</span>}
            <span role="status" aria-live="polite" className="sr-only">{copied ? 'Lien copié' : ''}</span>
        </button>
    );
}
