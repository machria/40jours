'use client';

import { X, BookOpen, Info, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface SurahInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    surahId: number;
    surahName: string;
}

interface SurahDetail {
    title: string;
    sections: {
        title: string;
        content: string;
    }[];
}

export default function SurahInfoModal({ isOpen, onClose, surahId, surahName }: SurahInfoModalProps) {
    const [details, setDetails] = useState<SurahDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            // Fetch the large JSON dynamically to avoid bundling it all
            // Ideally this would be an API route, but for now we import the whole file or fetch it if it was in public.
            // Since it's in data/surah-details.json and simplistic, we can use a server action or just import it in the parent and pass it down.
            // BUT, passing 114 surahs text down is bad.
            // Let's create a server action to fetch this specific surah's detail.

            fetch(`/api/surah-details?id=${surahId}`)
                .then(res => res.json())
                .then(data => {
                    setDetails(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to load details", err);
                    setLoading(false);
                });
        }
    }, [isOpen, surahId]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-background w-full max-w-2xl max-h-[85vh] rounded-xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 border border-border"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full text-primary">
                            <Info className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold font-kufi">Contexte de la Sourate</h2>
                            <p className="text-sm text-muted-foreground">{surahName}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    {loading ? (
                        <div className="space-y-4 animate-pulse">
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                            <div className="h-32 bg-muted rounded w-full"></div>
                            <div className="h-4 bg-muted rounded w-1/2"></div>
                            <div className="h-32 bg-muted rounded w-full"></div>
                        </div>
                    ) : details ? (
                        <>
                            {details.sections.map((section, idx) => (
                                <section key={idx} className="space-y-3">
                                    <h3 className="text-base font-bold text-primary flex items-center gap-2">
                                        {section.title}
                                    </h3>
                                    <div className="prose dark:prose-invert text-sm text-foreground/90 leading-relaxed max-w-none">
                                        <ReactMarkdown>{section.content}</ReactMarkdown>
                                    </div>
                                </section>
                            ))}
                        </>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground flex flex-col items-center gap-3">
                            <FileText className="w-12 h-12 opacity-20" />
                            <p>Aucune information détaillée disponible pour cette sourate pour le moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
