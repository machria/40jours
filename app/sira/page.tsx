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
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getYearFromDate = (dateStr: string) => {
        if (!dateStr) return '';
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
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-2xl font-bold font-kufi text-primary">Sira du Prophète ﷺ</h1>
                    <p className="text-sm text-muted-foreground">Biographie du Prophète Muhammad ﷺ</p>
                    <p className="text-xs text-muted-foreground mt-1">Source: Le Nectar Cacheté (الرحيق المختوم)</p>
                </div>
            </header>

            <main className="p-4 max-w-5xl mx-auto">
                {/* Timeline */}
                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent"></div>

                    {/* Events */}
                    <div className="space-y-8">
                        {events.map((event, index) => (
                            <div key={index} className="relative pl-20">
                                {/* Timeline dot */}
                                <div className="absolute left-6 top-2 w-5 h-5 rounded-full bg-primary border-4 border-background shadow-lg"></div>

                                {/* Event card */}
                                <div className="bg-card border rounded-xl p-6 hover:shadow-lg transition-all group">
                                    {/* Date badge */}
                                    {event.start && (
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                            <Calendar className="w-3 h-3" />
                                            <span className="font-medium">{formatDate(event.start)}</span>
                                            {event.end && (
                                                <>
                                                    <span>→</span>
                                                    <span className="font-medium">{formatDate(event.end)}</span>
                                                </>
                                            )}
                                            <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-bold">
                                                {getYearFromDate(event.start)} CE
                                            </span>
                                        </div>
                                    )}

                                    {/* Title */}
                                    <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                                        {event.title}
                                    </h3>

                                    {/* Commentary */}
                                    {event.commentary && event.commentary.length > 0 && (
                                        <div className="text-foreground/80 leading-relaxed mb-3">
                                            <p>{event.commentary.join(' ')}</p>
                                        </div>
                                    )}

                                    {/* Notes */}
                                    {event.notes && (
                                        <div className="mt-3 p-3 bg-muted/50 rounded-lg border border-muted">
                                            <p className="text-sm italic text-muted-foreground flex items-start gap-2">
                                                <BookOpen className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                <span>{event.notes}</span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
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
