'use client';

import { X, BookOpen } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getLocalTafsir } from '@/app/actions/tafsir';
import { TajwidText } from '@/components/TajwidText';
import ReactMarkdown from 'react-markdown';

interface TafsirModalProps {
    isOpen: boolean;
    onClose: () => void;
    surahNumber: number;
    ayahNumber: number;
    ayahText: string;
    translation?: string;
}

export default function TafsirModal({ isOpen, onClose, surahNumber, ayahNumber, ayahText, translation }: TafsirModalProps) {
    const { data: tafsirContent, isLoading } = useQuery({
        queryKey: ['tafsir', surahNumber, ayahNumber],
        queryFn: () => getLocalTafsir(surahNumber, ayahNumber),
        enabled: isOpen && !!surahNumber && !!ayahNumber,
        staleTime: Infinity
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">

                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between bg-muted/30">
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-accent" />
                        <h3 className="font-bold text-lg font-kufi">Tafsir Ibn Kathir (Français)</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="bg-muted/20 p-4 rounded-lg border-r-4 border-primary">
                        <TajwidText text={ayahText} className="font-kufi text-xl text-right dir-rtl leading-loose block" />
                        {translation && (
                            <p className="text-base text-muted-foreground mt-3 font-serif border-t border-border/50 pt-2">
                                {translation}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">Sourate {surahNumber}, Verset {ayahNumber}</p>
                    </div>

                    <div className="prose dark:prose-invert max-w-none">
                        {isLoading ? (
                            <div className="flex flex-col gap-2 animate-pulse">
                                <div className="h-4 bg-muted rounded w-3/4"></div>
                                <div className="h-4 bg-muted rounded w-full"></div>
                                <div className="h-4 bg-muted rounded w-5/6"></div>
                            </div>
                        ) : (
                            <div className="text-sm md:text-base leading-relaxed">
                                {tafsirContent ? (
                                    <ReactMarkdown>{tafsirContent}</ReactMarkdown>
                                ) : (
                                    "Aucune explication trouvée pour ce verset."
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-muted/10 text-center text-xs text-muted-foreground">
                    Source: Tafsir Ibn Kathir (Adapté)
                </div>

            </div>
        </div>
    );
}
