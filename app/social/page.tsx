'use client';

import { Suspense, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Users, ArrowRight, Trophy, Lock, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

interface GroupSummary {
    _id: string;
    name: string;
    description?: string;
    code: string;
    memberCount: number;
}

export default function SocialPage() {
    return (
        <Suspense fallback={null}>
            <SocialContent />
        </Suspense>
    );
}

function SocialContent() {
    const queryClient = useQueryClient();
    const { status } = useSession();
    const router = useRouter();

    // Les actions de groupe nécessitent un compte : renvoyer au login puis revenir ici
    const requireAuth = (returnTo: string) => {
        if (status === 'authenticated') return true;
        router.push(`/login?callbackUrl=${encodeURIComponent(returnTo)}`);
        return false;
    };
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    // Lien d'invitation /social?code=XXXXXX : ouvre directement « Rejoindre » avec le code rempli
    const inviteParam = useSearchParams().get('code');
    const inviteCode = inviteParam && /^[A-Za-z0-9]{6}$/.test(inviteParam) ? inviteParam.toUpperCase() : null;
    const [isJoinOpen, setIsJoinOpen] = useState(!!inviteCode);

    // Form States
    const [newGroupName, setNewGroupName] = useState('');
    const [joinCode, setJoinCode] = useState(inviteCode ?? '');
    const [joinError, setJoinError] = useState<string | null>(null);

    const { data: groups, isLoading } = useQuery<GroupSummary[]>({
        queryKey: ['groups'],
        queryFn: async () => {
            const res = await fetch('/api/groups');
            if (!res.ok) throw new Error('Failed to fetch groups');
            return res.json();
        },
        enabled: status === 'authenticated',
    });

    const createGroupMutation = useMutation({
        mutationFn: async (data: { name: string }) => {
            const res = await fetch('/api/groups', {
                method: 'POST',
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('Failed to create');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            setIsCreateOpen(false);
            setNewGroupName('');
        }
    });

    const joinGroupMutation = useMutation({
        mutationFn: async (code: string) => {
            const res = await fetch('/api/groups/join', {
                method: 'POST',
                body: JSON.stringify({ code })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to join');
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            setIsJoinOpen(false);
            setJoinCode('');
            setJoinError(null);
            window.history.replaceState(null, '', '/social');
        },
        onError: (err) => {
            setJoinError(err instanceof Error && err.message !== 'Failed to join' ? err.message : 'Code invalide ou groupe introuvable.');
        }
    });

    return (
        <div className="min-h-screen bg-background pb-24 p-4 md:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold font-kufi text-primary mb-2">Communauté</h1>
                <p className="text-muted-foreground">Rejoignez vos amis et motivez-vous ensemble pour le défi des 40 jours.</p>
            </header>

            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="flex-1 bg-primary text-primary-foreground py-3 px-4 rounded-xl font-semibold shadow hover:bg-primary/90 transition flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Créer un groupe
                </button>
                <button
                    onClick={() => setIsJoinOpen(true)}
                    className="flex-1 bg-card border border-border text-foreground py-3 px-4 rounded-xl font-semibold hover:bg-muted transition flex items-center justify-center gap-2"
                >
                    <Users className="w-5 h-5" /> Rejoindre
                </button>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-accent" /> Vos Groupes
                </h2>

                {status === 'unauthenticated' && (
                    <div className="text-center py-10 bg-card rounded-xl border border-dashed border-border space-y-4">
                        <p className="text-muted-foreground">Connectez-vous pour créer ou rejoindre un groupe.</p>
                        <Link
                            href={`/login?callbackUrl=${encodeURIComponent(joinCode ? `/social?code=${joinCode}` : '/social')}`}
                            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 min-h-11 rounded-full font-semibold"
                        >
                            <LogIn className="w-4 h-4" /> Se connecter
                        </Link>
                    </div>
                )}

                {isLoading && status === 'authenticated' && <div className="text-center py-8 text-muted-foreground">Chargement...</div>}

                {!isLoading && groups?.length === 0 && (
                    <div className="text-center py-12 bg-card rounded-xl border border-dashed border-border">
                        <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground">Vous n&apos;avez rejoint aucun groupe pour le moment.</p>
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                    {groups?.map(group => (
                        <Link
                            key={group._id}
                            href={`/social/${group._id}`}
                            className="bg-card border rounded-xl p-5 hover:shadow-md transition-all group block"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg">{group.name}</h3>
                                <span className="text-xs bg-muted px-2 py-1 rounded font-mono text-muted-foreground">
                                    #{group.code}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Users className="w-4 h-4" /> {group.memberCount} membre{group.memberCount > 1 ? 's' : ''}
                                </span>
                                <span className="flex items-center gap-1 text-primary font-medium group-hover:underline">
                                    Voir le classement <ArrowRight className="w-4 h-4" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Create Modal */}
            {isCreateOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-background rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-bold mb-4">Nouveau Groupe</h3>
                        <input
                            type="text"
                            placeholder="Nom du groupe (ex: Famille, Amis...)"
                            className="w-full p-3 rounded-lg border bg-muted/50 mb-4 focus:ring-2 focus:ring-primary outline-none"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsCreateOpen(false)}
                                className="flex-1 py-2 rounded-lg hover:bg-muted font-medium"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={() => requireAuth('/social') && createGroupMutation.mutate({ name: newGroupName })}
                                disabled={!newGroupName || createGroupMutation.isPending}
                                className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg font-bold disabled:opacity-50"
                            >
                                {createGroupMutation.isPending ? 'Création...' : 'Créer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Join Modal */}
            {isJoinOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-background rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-bold mb-4">Rejoindre un Groupe</h3>
                        <p className="text-sm text-muted-foreground mb-4">Entrez le code à 6 caractères fourni par l&apos;administrateur du groupe.</p>
                        <div className="relative mb-6">
                            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Code (ex: A1B2C3)"
                                className="w-full p-3 pl-10 rounded-lg border bg-muted/50 focus:ring-2 focus:ring-primary outline-none font-mono uppercase tracking-widest text-center text-lg"
                                maxLength={6}
                                value={joinCode}
                                onChange={(e) => { setJoinCode(e.target.value.toUpperCase()); setJoinError(null); }}
                            />
                        </div>
                        {joinError && <p role="alert" className="text-sm text-red-500 -mt-3 mb-4">{joinError}</p>}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsJoinOpen(false)}
                                className="flex-1 py-2 rounded-lg hover:bg-muted font-medium"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={() => requireAuth(`/social?code=${joinCode}`) && joinGroupMutation.mutate(joinCode)}
                                disabled={joinCode.length < 6 || joinGroupMutation.isPending}
                                className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg font-bold disabled:opacity-50"
                            >
                                {joinGroupMutation.isPending ? 'Recherche...' : 'Rejoindre'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
