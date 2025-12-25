'use client';

import { X, BookOpen } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getTafsir } from '@/lib/quranApi';

interface TafsirModalProps {
    isOpen: boolean;
    onClose: () => void;
    surahNumber: number;
    ayahNumber: number;
    ayahText: string;
}

export default function TafsirModal({ isOpen, onClose, surahNumber, ayahNumber, ayahText }: TafsirModalProps) {
    const { data: tafsirData, isLoading } = useQuery({
        queryKey: ['tafsir', surahNumber, ayahNumber],
        queryFn: () => getTafsir(surahNumber, ayahNumber),
        enabled: isOpen && !!surahNumber && !!ayahNumber,
        staleTime: Infinity
    });

    const content = tafsirData
        ? (typeof tafsirData === 'string' ? tafsirData : JSON.stringify(tafsirData, null, 2))
        : null;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">

                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between bg-muted/30">
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-accent" />
                        <h3 className="font-bold text-lg font-kufi">Tafsir Mokhtasar (Français)</h3>
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
                        <p className="font-kufi text-xl text-right dir-rtl leading-loose">{ayahText}</p>
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
                            <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                                {content || "Aucune explication trouvée."}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-muted/10 text-center text-xs text-muted-foreground">
                    Source: Tafsir Ibn Kathir
                </div>

            </div>
        </div>
    );
}
