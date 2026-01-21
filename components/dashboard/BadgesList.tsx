"use client";

import { Badge, BADGES } from "@/lib/gamification";
import { Lock } from "lucide-react";

interface BadgesListProps {
    unlockedBadges: { id: string; unlockedAt: string }[];
}

export default function BadgesList({ unlockedBadges }: BadgesListProps) {
    return (
        <section className="bg-card border rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
            <h2 className="text-xl font-bold font-kufi flex items-center gap-2">
                <span className="text-yellow-600">🏅</span>
                Badges & Succès
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {BADGES.map((badge) => {
                    const isUnlocked = unlockedBadges.some((b) => b.id === badge.id);

                    return (
                        <div
                            key={badge.id}
                            className={`
                                relative flex flex-col items-center justify-center p-4 rounded-xl border text-center space-y-2 transition-all group
                                ${isUnlocked
                                    ? "bg-yellow-500/10 border-yellow-200"
                                    : "bg-muted/30 border-border opacity-60 grayscale"
                                }
                            `}
                            title={badge.description}
                        >
                            <div className="text-4xl group-hover:scale-110 transition-transform cursor-help">
                                {badge.icon}
                            </div>
                            <span className={`text-xs font-bold ${isUnlocked ? 'text-yellow-700' : 'text-muted-foreground'}`}>
                                {badge.name}
                            </span>

                            {!isUnlocked && (
                                <div className="absolute top-2 right-2 text-muted-foreground/50">
                                    <Lock className="w-3 h-3" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
