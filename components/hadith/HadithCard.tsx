'use client';

import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";

interface Hadith {
    id: number;
    title: string;
    arabic: string;
    french: string;
    theme: string;
    narrator?: string;
    grade?: string;
}

interface HadithCardProps {
    hadith: Hadith;
    showArabic: boolean;
    showFrench: boolean;
    isRead: boolean;
    onToggleRead: () => void;
}

export default function HadithCard({ hadith, showArabic, showFrench, isRead, onToggleRead }: HadithCardProps) {
    return (
        <div className={cn(
            "group relative bg-card rounded-xl border p-6 shadow-sm transition-all duration-300 hover:shadow-md",
            isRead && "border-green-200 bg-green-50/30 dark:bg-green-900/10 dark:border-green-900"
        )}>
            {/* Header: Number, Title, Read Toggle */}
            <div className="flex items-start justify-between mb-4 gap-4">
                <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                        {hadith.id}
                    </span>
                    <h3 className="font-semibold text-lg leading-tight">{hadith.title}</h3>
                </div>

                <button
                    onClick={onToggleRead}
                    className="text-muted-foreground hover:text-green-600 transition-colors focus:outline-none"
                    aria-label={isRead ? "Marquer comme non lu" : "Marquer comme lu"}
                >
                    {isRead ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600 fill-green-50" />
                    ) : (
                        <Circle className="w-6 h-6" />
                    )}
                </button>
            </div>

            {/* Narrator & Grade Metadata */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mb-6 text-xs text-muted-foreground">
                {hadith.narrator && (
                    <span className="font-medium text-primary/80">
                        {hadith.narrator}
                    </span>
                )}
                {hadith.grade && hadith.grade !== 'Non spécifié' && (
                    <span className="px-2 py-0.5 rounded-full bg-muted border text-[10px]">
                        {hadith.grade}
                    </span>
                )}
            </div>

            {/* Ghazali Commentary/Wisdom */}
            {hadith.commentaries && hadith.commentaries.length > 0 && (
                <div className="mb-6 bg-primary/5 border border-primary/10 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2 text-primary font-semibold text-sm">
                        <span>💡 Sagesse de l'Imam Ghazali</span>
                    </div>
                    {hadith.commentaries.map((comm: any, idx: number) => (
                        <p key={idx} className="text-sm italic text-muted-foreground leading-relaxed">
                            {comm.text}
                        </p>
                    ))}
                </div>
            )}

            {/* Content Content */}
            <div className="space-y-6">
                {showArabic && (
                    <div className="text-right font-amiri text-2xl leading-loose text-foreground/90 dir-rtl">
                        {hadith.arabic}
                    </div>
                )}

                {showFrench && (
                    <div className="text-left text-base leading-relaxed text-muted-foreground">
                        {hadith.french}
                    </div>
                )}
            </div>

            {/* Theme Badge (Bottom right) */}
            <div className="mt-4 flex justify-end">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground/50 font-semibold">
                    {hadith.theme}
                </span>
            </div>
        </div>
    );
}
