'use client';

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

const DISMISS_KEY = 'pwaPromptDismissedAt';
const DISMISS_DAYS = 30;

function wasDismissedRecently() {
    try {
        const at = Number(localStorage.getItem(DISMISS_KEY));
        return at > 0 && Date.now() - at < DISMISS_DAYS * 24 * 60 * 60 * 1000;
    } catch {
        return false;
    }
}

export default function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Ne pas réafficher si l'utilisateur l'a fermée récemment
            if (!wasDismissedRecently()) setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch { /* stockage indisponible */ }
        setShowPrompt(false);
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] left-4 right-4 md:bottom-4 md:left-auto md:right-4 md:w-80 bg-background border border-border p-4 rounded-lg shadow-lg z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">Installer l'application</h3>
                    <p className="text-xs text-muted-foreground mb-3">
                        Installez l'application pour une meilleure expérience de lecture et un accès hors ligne.
                    </p>
                    <button
                        onClick={handleInstallClick}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Installer
                    </button>
                </div>
                <button
                    onClick={handleDismiss}
                    className="text-muted-foreground hover:text-foreground transition-colors p-2 -m-1"
                    aria-label="Fermer"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
