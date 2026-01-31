'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, BookOpen, Clock } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import { cn } from '@/components/layout/Navigation';

type SeerahEvent = {
    title: string;
    commentary: string[];
    notes: string;
    'hijri-date': string;
    start: string;
    end?: string;
};

export default function SeerahPage() {
    const [events, setEvents] = useState<SeerahEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadEvents() {
            try {
                const res = await fetch('/data/seerah-fr.json');
                const data = await res.json();
                setEvents(data);
                setLoading(false);
            } catch (error) {
                console.error('Error loading seerah:', error);
                setLoading(false);
            }
        }
        loadEvents();
    }, []);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        // Handle negative dates (BC)
        const isBC = dateStr.startsWith('-');
        // If BC, remove the leading minus for processing (or handle year manually)
        const normalizedDate = isBC ? dateStr.substring(1) : dateStr;
        const date = new Date(normalizedDate);

        // JavaScript Date constructor might struggle with negative years directly in ISO format depending on implementation
        // For simplicity, let's just parse logic manualy or trust Date if it works.
        // But common JS Date: new Date("-2000-01-01") often works but displays 2001 BC or similar.
        // Let's adhere to a custom format for BC to be safe.

        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };

        try {
            // For BC dates like "-2000-01-01", we can just treat as positive year and append "av. J.-C."
            if (isBC) {
                // Extract year, month, day manually or assume simple ISO format
                const parts = normalizedDate.split('-');
                if (parts.length >= 1) {
                    return `${parts[0]} av. J.-C.`; // Return just the year or full date if needed. 
                    // If we want full date? 
                    // Let's stay simple: Just Year for BC often suffices, or simple format.
                    // But the user asked to fix "bugged object", likely the year display.

                    // Let's try to actually format it.
                    const dateObj = new Date(normalizedDate);
                    // Invalid date check
                    if (isNaN(dateObj.getTime())) return dateStr;

                    return `env. ${Math.abs(dateObj.getFullYear())} av. J.-C.`;
                }
            }
            return date.toLocaleDateString('fr-FR', options);
        } catch (e) {
            return dateStr;
        }
    };

    const getYearFromDate = (dateStr: string) => {
        if (!dateStr) return '';
        const isBC = dateStr.startsWith('-');
        if (isBC) {
            const year = dateStr.split('-')[1]; // after the first minus
            return `${year} BC`;
        }
        return dateStr.split('-')[0];
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background pb-20 md:pl-64">
                <Navigation />
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted-foreground animate-pulse">Chargement de la Sira...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20 md:pl-64">
            <Navigation />

            {/* Header */}
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b p-4">
                <div className="max-w-5xl mx-auto flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold font-kufi text-primary">Sira du Prophète ﷺ</h1>
                        <p className="text-sm text-muted-foreground">Biographie du Prophète Muhammad ﷺ</p>
                        <p className="text-xs text-muted-foreground mt-1">Source: Le Nectar Cacheté (الرحيق المختوم)</p>
                    </div>
                    <Link
                        href="/sira/quiz"
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm whitespace-nowrap"
                    >
                        📝 Quiz
                    </Link>
                </div>
            </header>

            <main className="p-4 max-w-5xl mx-auto">
                {/* Content List */}
                <div className="space-y-6">
                    {events.map((event, index) => (
                        <div key={index} className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                    {event.title}
                                </h3>
                                {event.start && (
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground shrink-0">
                                        <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded">
                                            <Calendar className="w-3 h-3" />
                                            <span className="font-medium">{formatDate(event.start)}</span>
                                            {event.end && (
                                                <>
                                                    <span>→</span>
                                                    <span className="font-medium">{formatDate(event.end)}</span>
                                                </>
                                            )}
                                        </div>
                                        <span className="px-2 py-1 bg-primary/10 text-primary rounded font-bold">
                                            {getYearFromDate(event.start)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Commentary */}
                            {event.commentary && event.commentary.length > 0 && (
                                <div className="text-foreground/90 leading-relaxed mb-4 font-serif text-lg">
                                    <p>{event.commentary.join(' ')}</p>
                                </div>
                            )}

                            {/* Notes */}
                            {event.notes && (
                                <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-muted/50 flex items-start gap-3">
                                    <BookOpen className="w-4 h-4 mt-1 text-primary/70 shrink-0" />
                                    <span className="text-sm italic text-muted-foreground">{event.notes}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer info */}
                <div className="mt-12 p-6 bg-muted/30 rounded-xl border">
                    <h4 className="font-bold text-foreground mb-2">À propos de cette Sira</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        Cette timeline chronologique retrace <strong className="text-foreground">4000 ans d'histoire islamique</strong>,
                        de la construction de la Ka'bah par Ibrahim عليه السلام (2000 avant J.-C.) jusqu'aux grands imams compilateurs
                        de hadiths (915 après J.-C.).
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        La biographie du Prophète Muhammad ﷺ est basée sur le livre
                        <strong className="text-foreground"> "Le Nectar Cacheté" (الرحيق المختوم / Ar-Raheeq Al-Makhtum)</strong>,
                        une référence reconnue pour sa simplicité et son authenticité.
                    </p>
                    <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
                        <h5 className="text-sm font-bold text-primary mb-2">📚 Contenu de la timeline (64 événements)</h5>
                        <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• <strong>Contexte prophétique</strong> : Ibrahim, Musa, 'Isa عليهم السلام</li>
                            <li>• <strong>Vie du Prophète ﷺ</strong> : De sa naissance (571) à son décès (632)</li>
                            <li>• <strong>Compagnons narrateurs</strong> : Abu Bakr, 'Umar, 'Ali, Abu Hurayrah, 'Aishah رضي الله عنهم</li>
                            <li>• <strong>Imams compilateurs</strong> : Malik, Bukhari, Muslim, Tirmidhi, Ibn Majah, Nasa'i, Abu Dawud</li>
                        </ul>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                        Sources : <a href="https://github.com/OpenIslam/seerah-timeline" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenIslam/seerah-timeline</a> +
                        recherches complémentaires • Traduction française complète
                    </p>
                </div>
            </main>
        </div>
    );
}
