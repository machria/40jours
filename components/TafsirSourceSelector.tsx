'use client';

import React, { useState, useTransition } from 'react';
import { TafsirSourceId } from '@/lib/tafsir-data';
import { BookOpen, Sparkles, Feather, Compass, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const TAFSIR_SOURCES: { id: TafsirSourceId; label: string; badge: string; icon: any }[] = [
    { id: 'al_mukhtasar', label: 'Al-Mukhtasar', badge: 'Concis & Direct', icon: Sparkles },
    { id: 'as_sadi', label: "As-Sa'di", badge: 'Spirituel & Pédagogique', icon: Compass },
    { id: 'al_jalalayn', label: 'Al-Jalalayn', badge: 'Synthétique', icon: Feather },
    { id: 'ibn_kathir', label: 'Ibn Kathir', badge: 'Classique complet', icon: BookOpen }
];

interface TafsirSourceSelectorProps {
    surah: number;
    ayah: number;
    initialTafsir: string;
    initialSourceId?: TafsirSourceId;
}

export default function TafsirSourceSelector({
    surah,
    ayah,
    initialTafsir,
    initialSourceId = 'al_mukhtasar'
}: TafsirSourceSelectorProps) {
    const [activeSource, setActiveSource] = useState<TafsirSourceId>(initialSourceId);
    const [tafsirContent, setTafsirContent] = useState<string>(initialTafsir);
    const [isPending, startTransition] = useTransition();

    const handleSelectSource = (sourceId: TafsirSourceId) => {
        if (sourceId === activeSource) return;
        setActiveSource(sourceId);

        startTransition(async () => {
            try {
                // Fetch HTTP GET Statique CDN (0 invocation Vercel Serverless)
                const res = await fetch(`/tafsir/${sourceId}/${surah}_${ayah}.json`);
                if (res.ok) {
                    const data = await res.json();
                    setTafsirContent(data.tafsir);
                } else {
                    const rootRes = await fetch(`/tafsir/${surah}_${ayah}.json`);
                    if (rootRes.ok) {
                        const rootData = await rootRes.json();
                        setTafsirContent(rootData.tafsir);
                    } else {
                        setTafsirContent("Exégèse non disponible pour cette source.");
                    }
                }
            } catch (e) {
                setTafsirContent("Erreur de chargement.");
            }
        });
    };

    return (
        <div className="space-y-4">
            {/* Source Selector Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <span className="text-xs font-semibold text-muted-foreground mr-1 uppercase tracking-wider">
                    Source :
                </span>
                {TAFSIR_SOURCES.map((source) => {
                    const Icon = source.icon;
                    const isActive = activeSource === source.id;
                    return (
                        <button
                            key={source.id}
                            onClick={() => handleSelectSource(source.id)}
                            disabled={isPending}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${
                                isActive
                                    ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-105'
                                    : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                            }`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{source.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Active Source Badge */}
            <div className="flex items-center justify-between border-b pb-2 text-xs text-muted-foreground">
                <span className="font-medium text-primary flex items-center gap-1">
                    Exégèse : {TAFSIR_SOURCES.find(s => s.id === activeSource)?.label} ({TAFSIR_SOURCES.find(s => s.id === activeSource)?.badge})
                </span>
                {isPending && (
                    <span className="flex items-center gap-1 text-primary animate-pulse">
                        <Loader2 className="w-3 h-3 animate-spin" /> Chargement (CDN Statique)...
                    </span>
                )}
            </div>

            {/* Tafsir Commentary Content */}
            <div className="prose dark:prose-invert max-w-none prose-base text-justify leading-relaxed transition-opacity duration-300">
                {isPending ? (
                    <div className="py-6 text-center text-muted-foreground animate-pulse">
                        Mise à jour de l'exégèse...
                    </div>
                ) : (
                    <ReactMarkdown>{tafsirContent}</ReactMarkdown>
                )}
            </div>
        </div>
    );
}
