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
    const [viewMode, setViewMode] = useState<'list' | 'timeline'>('timeline');

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
        const isBC = dateStr.startsWith('-');
        const normalizedDate = isBC ? dateStr.substring(1) : dateStr;
        const date = new Date(normalizedDate);

        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };

        try {
            if (isBC) {
                const parts = normalizedDate.split('-');
                if (parts.length >= 1) {
                    const dateObj = new Date(normalizedDate);
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
            const year = dateStr.split('-')[1];
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
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex bg-muted/50 p-1 rounded-lg">
                            <button
                                onClick={() => setViewMode('timeline')}
                                className={cn(
                                    "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                                    viewMode === 'timeline'
                                        ? "bg-background shadow text-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Timeline
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={cn(
                                    "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                                    viewMode === 'list'
                                        ? "bg-background shadow text-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Liste
                            </button>
                        </div>
                        <Link
                            href="/sira/quiz"
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm whitespace-nowrap ml-2"
                        >
                            📝 Quiz
                        </Link>
                    </div>
                </div>
            </header>

            <main className="p-4 max-w-5xl mx-auto">
                {viewMode === 'list' ? (
                    /* Content List View */
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
                ) : (
                    /* Timeline Visual View */
                    <div className="relative space-y-8 pl-8 md:pl-0 before:absolute before:inset-0 before:ml-8 md:before:ml-[50%] before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-muted-foreground/20 before:to-transparent">
                        {events.map((event, index) => (
                            <div key={index} className={cn(
                                "relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group",
                                "is-active", // Placeholder for actual active state if needed
                            )}>
                                {/* Timeline Dot */}
                                <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-background border-4 border-primary shadow-sm -translate-x-[calc(50%-0.5px)] shrink-0 z-10 group-hover:scale-125 transition-transform" />

                                {/* Date Badge (Desktop Center) */}
                                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 -top-6 text-xs font-bold text-muted-foreground bg-background px-2 py-1 rounded-full border shadow-sm z-10">
                                    {getYearFromDate(event.start)}
                                </div>

                                {/* Spacer for alternate side */}
                                <div className="hidden md:block w-1/2" />

                                {/* Content Card */}
                                <div className={cn(
                                    "w-full md:w-[calc(50%-2rem)] ml-8 md:ml-0 p-6 rounded-xl border bg-card shadow-sm hover:shadow-lg transition-all relative",
                                    "md:group-odd:mr-8 md:group-even:ml-8"
                                )}>
                                    {/* Arrow */}
                                    <div className={cn(
                                        "absolute top-6 w-3 h-3 bg-card border-t border-r rotate-45",
                                        "hidden md:block",
                                        "md:group-odd:-right-[7px] md:group-odd:border-t-muted md:group-odd:border-r-muted md:group-odd:border-l-0 md:group-odd:border-b-0",
                                        "md:group-even:-left-[7px] md:group-even:border-l-muted md:group-even:border-b-muted md:group-even:border-t-0 md:group-even:border-r-0 md:group-even:rotate-[225deg]"
                                    )} />

                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <h3 className="text-lg font-bold text-primary">{event.title}</h3>
                                        <div className="md:hidden text-xs font-bold bg-muted px-2 py-1 rounded">{formatDate(event.start)}</div>
                                    </div>

                                    <div className="text-sm text-foreground/80 leading-relaxed mb-3">
                                        {event.commentary && event.commentary.length > 0 && (
                                            <p className="line-clamp-4 group-hover:line-clamp-none transition-all duration-300">
                                                {event.commentary.join(' ')}
                                            </p>
                                        )}
                                    </div>

                                    {event.notes && (
                                        <div className="text-xs text-muted-foreground italic border-t pt-2 mt-2">
                                            {event.notes}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer info (Always visible) */}
                <div className="mt-20 p-6 bg-muted/30 rounded-xl border relative z-10">
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
                    <p className="text-xs text-muted-foreground mt-3">
                        Sources : <a href="https://github.com/OpenIslam/seerah-timeline" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenIslam/seerah-timeline</a> +
                        recherches complémentaires • Traduction française complète
                    </p>
                </div>
            </main>
        </div>
    );
}
