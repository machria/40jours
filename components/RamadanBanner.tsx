'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Ramadan 2026 : 18 février → 20 mars
const RAMADAN_START = new Date('2026-02-18T00:00:00');
const RAMADAN_END = new Date('2026-03-20T23:59:59');

export default function RamadanBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const now = new Date();
        setVisible(now >= RAMADAN_START && now <= RAMADAN_END);
    }, []);

    if (!visible) return null;

    return (
        <div className="w-full rounded-2xl overflow-hidden border border-amber-300/40 dark:border-amber-500/30 shadow-md mb-8">
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/60 dark:to-yellow-950/50 px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Texte */}
                <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                    <span className="text-4xl shrink-0 leading-none" role="img" aria-label="Croissant de lune">
                        🌙
                    </span>
                    <div className="min-w-0">
                        <p className="text-base font-bold text-amber-900 dark:text-amber-200 leading-tight">
                            Ramadan Moubarak — Le mois du Coran
                        </p>
                        <p className="text-sm text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                            Lisez 1 Juz par jour et terminez le Coran ce Ramadan
                        </p>
                    </div>
                </div>

                {/* CTA */}
                <Link
                    href="/juz"
                    className="shrink-0 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-colors shadow-sm"
                >
                    Lire le Coran en 30 Juz
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
