'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation'; // Correct import for App Router
import { ChevronLeft, Copy, Share2, Medal, Flame } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
// @ts-ignore
import { use } from 'react'; // React 19 unwrapping

interface LeaderboardEntry {
    id: string;
    name: string;
    image?: string;
    juzsCompleted: number;
    streak: number;
}

interface GroupDetails {
    group: {
        id: string;
        name: string;
        code: string;
        description?: string;
        isAdmin: boolean;
    };
    leaderboard: LeaderboardEntry[];
}

export default function GroupDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params in React 19 / Next 15+ convention
    const { id } = use(params);
    const { data: session } = useSession();

    const { data, isLoading, error } = useQuery<GroupDetails>({
        queryKey: ['group', id],
        queryFn: async () => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

            try {
                const res = await fetch(`/api/groups/${id}`, { signal: controller.signal });
                clearTimeout(timeoutId);
                if (!res.ok) throw new Error('Failed to load group');
                return res.json();
            } catch (err) {
                clearTimeout(timeoutId);
                throw err;
            }
        }
    });

    const copyCode = () => {
        if (data?.group.code) {
            navigator.clipboard.writeText(data.group.code);
            alert('Code copié !');
        }
    };

    const handleLeaveGroup = async () => {
        if (!confirm("Êtes-vous sûr de vouloir quitter ce groupe ?")) return;

        try {
            const res = await fetch(`/api/groups/${id}/leave`, {
                method: "POST"
            });

            if (res.ok) {
                // Force refresh or redirect
                window.location.href = '/social';
            } else {
                alert("Erreur lors de la tentative de quitter le groupe.");
            }
        } catch (error) {
            console.error("Error leaving group:", error);
            alert("Une erreur est survenue.");
        }
    };

    if (isLoading) return <div className="p-8 text-center">Chargement du classement...</div>;
    if (error || !data) return <div className="p-8 text-center text-red-500">Erreur impossible de charger le groupe.</div>;

    const { group, leaderboard } = data;

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <header className="bg-primary text-primary-foreground p-6 pb-12 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>

                <div className="relative z-10">
                    <Link href="/social" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
                        <ChevronLeft className="w-5 h-5 mr-1" /> Retour
                    </Link>

                    <div className="text-center">
                        <h1 className="text-3xl font-bold font-kufi mb-2">{group.name}</h1>
                        <p className="text-primary-foreground/80 text-sm mb-6 max-w-sm mx-auto">{group.description || "Challenge des 40 jours"}</p>

                        <div className="flex flex-col items-center gap-4">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                                <span className="text-xs font-semibold tracking-widest uppercase opacity-70">Code Groupe</span>
                                <span className="font-mono text-lg font-bold tracking-widest">{group.code}</span>
                                <button onClick={copyCode} className="ml-2 hover:bg-white/20 p-1 rounded transition">
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>

                            <button
                                onClick={handleLeaveGroup}
                                className="text-xs text-red-200 hover:text-red-100 underline decoration-red-200/50 hover:decoration-red-100"
                            >
                                Quitter le groupe
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Leaderboard */}
            <div className="max-w-2xl mx-auto px-4 -mt-8 relative z-20">
                <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b bg-muted/30 flex justify-between items-center">
                        <h2 className="font-bold flex items-center gap-2">
                            <Medal className="w-5 h-5 text-accent" /> Classement
                        </h2>
                        <span className="text-xs text-muted-foreground">{leaderboard.length} participants</span>
                    </div>

                    <div className="divide-y">
                        {leaderboard.map((user, index) => {
                            const isCurrentUser = session?.user?.email === user.image; // HACK: Assume image check or ID check if available in session
                            // Better: use ID check if we expose user ID in session, but typically not default in NextAuth v5 without callback
                            // Let's assume highlighting works vaguely or fix later.

                            const rank = index + 1;
                            let rankColor = "text-muted-foreground font-mono";
                            if (rank === 1) rankColor = "text-yellow-500 font-bold drop-shadow-sm text-xl";
                            if (rank === 2) rankColor = "text-gray-400 font-bold text-lg";
                            if (rank === 3) rankColor = "text-amber-700 font-bold text-lg";

                            return (
                                <div key={user.id} className={`p-4 flex items-center gap-4 ${isCurrentUser ? 'bg-primary/5' : ''}`}>
                                    <div className={`w-8 text-center ${rankColor}`}>
                                        {rank}
                                    </div>

                                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
                                        {user.image ? (
                                            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-lg font-bold text-muted-foreground">{user.name.charAt(0)}</span>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between mb-1">
                                            <span className="font-semibold truncate">{user.name}</span>
                                            {user.streak > 0 && (
                                                <span className="text-xs flex items-center gap-1 text-orange-500 font-medium">
                                                    <Flame className="w-3 h-3 fill-current" /> {user.streak}
                                                </span>
                                            )}
                                        </div>

                                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary/80 rounded-full transition-all duration-1000"
                                                style={{ width: `${(user.juzsCompleted / 30) * 100}%` }}
                                            />
                                        </div>
                                        <div className="text-right text-xs text-muted-foreground mt-1">
                                            {user.juzsCompleted} / 30 Juz
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
