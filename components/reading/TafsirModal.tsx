'use client';

import { useState } from 'react';
import { X, BookOpen, Sparkles, Feather, Compass, Loader2, Info, ArrowLeft, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { TafsirSourceId } from '@/lib/tafsir-data';
import { TajwidText } from '@/components/TajwidText';
import ReactMarkdown from 'react-markdown';

interface TafsirModalProps {
    isOpen: boolean;
    onClose: () => void;
    surahNumber: number;
    ayahNumber: number;
    ayahText: string;
    translation?: string;
    onNavigate?: (direction: 'next' | 'prev') => void;
    hasNext?: boolean;
    hasPrev?: boolean;
}

export const TAFSIR_SOURCES: { id: TafsirSourceId; label: string; badge: string; icon: any }[] = [
    { id: 'al_mukhtasar', label: 'Al-Mukhtasar', badge: 'Concis & Direct', icon: Sparkles },
    { id: 'as_sadi', label: "As-Sa'di", badge: 'Spirituel & Pédagogique', icon: Compass },
    { id: 'al_jalalayn', label: 'Al-Jalalayn', badge: 'Synthétique', icon: Feather },
    { id: 'ibn_kathir', label: 'Ibn Kathir', badge: 'Classique complet', icon: BookOpen }
];

async function fetchStaticTafsir(surah: number, ayah: number, sourceId: TafsirSourceId): Promise<string> {
    try {
        const response = await fetch(`/tafsir/${sourceId}/${surah}_${ayah}.json`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) {
            const rootRes = await fetch(`/tafsir/${surah}_${ayah}.json`);
            if (rootRes.ok) {
                const rootData = await rootRes.json();
                return rootData.tafsir;
            }
            return "Exégèse non disponible pour ce verset.";
        }
        const data = await response.json();
        return data.tafsir;
    } catch (e) {
        return "Erreur lors du chargement de l'exégèse.";
    }
}

async function fetchStaticAsbab(surah: number, ayah: number): Promise<string | null> {
    try {
        const response = await fetch(`/asbab/${surah}_${ayah}.json`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data.text || null;
    } catch (e) {
        return null;
    }
}

type TabType = 'tafsir' | 'asbab';

export default function TafsirModal({ isOpen, onClose, surahNumber, ayahNumber, ayahText, translation, onNavigate, hasNext, hasPrev }: TafsirModalProps) {
    const [selectedSource, setSelectedSource] = useState<TafsirSourceId>('al_mukhtasar');
    const [activeTab, setActiveTab] = useState<TabType>('tafsir');

    const { data: tafsirContent, isLoading: isTafsirLoading } = useQuery({
        queryKey: ['static-tafsir', surahNumber, ayahNumber, selectedSource],
        queryFn: () => fetchStaticTafsir(surahNumber, ayahNumber, selectedSource),
        enabled: isOpen && !!surahNumber && !!ayahNumber,
        staleTime: Infinity
    });

    const { data: asbabNuzul, isLoading: isAsbabLoading } = useQuery({
        queryKey: ['asbab-nuzul', surahNumber, ayahNumber],
        queryFn: () => fetchStaticAsbab(surahNumber, ayahNumber),
        enabled: isOpen && !!surahNumber && !!ayahNumber,
        staleTime: Infinity
    });

    if (!isOpen) return null;

    const activeSourceInfo = TAFSIR_SOURCES.find(s => s.id === selectedSource);
    const hasAsbab = !!asbabNuzul;

    const formatTafsirContent = (text: string | null) => {
        if (!text) return '';
        // Replace quotes « ... » with inline code syntax `« ... »` for specific Hadith highlighting
        return text.replace(/«([^»]+)»/g, '`«$1»`');
    };

    const markdownComponents = {
        code({node, inline, className, children, ...props}: any) {
            if (inline) {
                return (
                    <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded-md italic font-medium leading-relaxed shadow-sm" {...props}>
                        {children}
                    </span>
                );
            }
            return <code className={className} {...props}>{children}</code>;
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-background/95 w-full max-w-3xl max-h-[90vh] sm:rounded-3xl rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/10 relative">
                
                {/* Decorative Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-primary/20 blur-[60px] rounded-full pointer-events-none" />

                {/* Header */}
                <div className="p-5 border-b border-white/5 flex items-center justify-between bg-card/40 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h3 className="font-bold text-lg font-kufi">Étude du Verset</h3>
                                {(hasPrev || hasNext) && (
                                    <div className="flex bg-background/50 border border-border/50 rounded-lg shadow-sm">
                                        <button 
                                            onClick={() => onNavigate?.('prev')} 
                                            disabled={!hasPrev}
                                            className="px-2 py-1.5 hover:bg-muted/80 disabled:opacity-30 border-r border-border/50 rounded-l-lg transition-colors"
                                            title="Verset précédent"
                                        >
                                            <ArrowLeft className="w-3.5 h-3.5" />
                                        </button>
                                        <button 
                                            onClick={() => onNavigate?.('next')} 
                                            disabled={!hasNext}
                                            className="px-2 py-1.5 hover:bg-muted/80 disabled:opacity-30 rounded-r-lg transition-colors"
                                            title="Verset suivant"
                                        >
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground font-medium mt-0.5">Sourate {surahNumber} • Verset {ayahNumber}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-all duration-200"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Ayah Card */}
                <div className="px-6 pt-6 z-10 shrink-0">
                    <div className="bg-gradient-to-br from-muted/50 to-muted/20 p-5 sm:p-6 rounded-2xl border border-white/5 shadow-inner relative group max-h-[30vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <TajwidText text={ayahText} className="font-kufi text-2xl sm:text-3xl text-right dir-rtl leading-[2.2] block drop-shadow-sm" />
                        {translation && (
                            <p className="text-base sm:text-lg text-foreground/80 mt-6 font-serif border-t border-border/50 pt-4 leading-relaxed">
                                {translation}
                            </p>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="px-4 sm:px-6 mt-4 sm:mt-6 shrink-0 border-b border-border/40 flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar whitespace-nowrap">
                    <button
                        onClick={() => setActiveTab('tafsir')}
                        className={`pb-3 text-sm font-semibold transition-all relative ${
                            activeTab === 'tafsir' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        Tafsir & Exégèse
                        {activeTab === 'tafsir' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full shadow-[0_-2px_10px_rgba(var(--primary),0.5)]" />
                        )}
                    </button>
                    {hasAsbab && (
                        <button
                            onClick={() => setActiveTab('asbab')}
                            className={`pb-3 text-sm font-semibold transition-all relative flex items-center gap-1.5 ${
                                activeTab === 'asbab' ? 'text-amber-500' : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <Info className="w-4 h-4" />
                            Circonstances de Révélation
                            {activeTab === 'asbab' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-t-full shadow-[0_-2px_10px_rgba(245,158,11,0.5)]" />
                            )}
                        </button>
                    )}
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {activeTab === 'tafsir' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {/* Tafsir Sources Selector */}
                            <div className="flex flex-wrap items-center gap-2">
                                {TAFSIR_SOURCES.map((source) => {
                                    const Icon = source.icon;
                                    const isActive = selectedSource === source.id;
                                    return (
                                        <button
                                            key={source.id}
                                            onClick={() => setSelectedSource(source.id)}
                                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                                                isActive
                                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02] ring-1 ring-primary/50'
                                                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground ring-1 ring-border/50'
                                            }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span>{source.label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Tafsir Text */}
                            <div className="prose dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-kufi prose-a:text-primary">
                                {isTafsirLoading ? (
                                    <div className="flex flex-col gap-3 py-12 items-center justify-center text-muted-foreground">
                                        <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
                                        <span className="text-sm font-medium">Chargement de l'exégèse...</span>
                                    </div>
                                ) : (
                                    <div className="text-[15px] sm:text-base text-justify text-foreground/90 bg-card/30 p-5 rounded-2xl border border-white/5 shadow-sm">
                                        {tafsirContent ? (
                                            <ReactMarkdown components={markdownComponents}>{formatTafsirContent(tafsirContent)}</ReactMarkdown>
                                        ) : (
                                            "Aucune explication trouvée pour cette source."
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'asbab' && hasAsbab && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="prose dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-kufi">
                                <div className="text-[15px] sm:text-base text-justify text-foreground/90 bg-amber-500/5 p-6 rounded-2xl border border-amber-500/20 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full" />
                                    <h4 className="flex items-center gap-2 text-amber-500 font-bold mb-4 font-kufi text-lg">
                                        <Info className="w-5 h-5" />
                                        Asbab al-Nuzul
                                    </h4>
                                    <ReactMarkdown components={markdownComponents}>{formatTafsirContent(asbabNuzul)}</ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
