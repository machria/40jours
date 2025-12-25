'use client';

// import { auth } from "@/auth"; // Client component cannot import auth directly easily usually in V5 unless session provider
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";

interface ProgressData {
    progressPercent: number;
    completedDays: number;
    streak: number;
    dailyProgress: { [key: string]: boolean };
}

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const { data: progressData, isLoading } = useQuery<ProgressData>({
        queryKey: ['progress'],
        queryFn: async () => {
            const res = await fetch('/api/progress');
            if (!res.ok) throw new Error('Failed to fetch');
            return res.json();
        },
        enabled: status === 'authenticated'
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading' || (status === 'authenticated' && isLoading)) {
        return <div className="p-10 text-center animate-pulse">Chargement de vos données...</div>;
    }

    if (!session) return null;

    // Transform dailyProgress map to chart data
    const chartData = progressData?.dailyProgress ?
        Object.entries(progressData.dailyProgress).map(([day, completed]) => ({
            day: `J${day}`,
            completed: completed ? 100 : 0
        })) : [];

    const percentage = progressData?.progressPercent || 0;
    const streak = progressData?.streak || 0;

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <header className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold font-kufi">Mon Tableau de Bord</h1>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                            <UserIcon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">{session.user?.name}</span>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                    <h3 className="text-muted-foreground text-sm font-medium mb-2">Progression Totale</h3>
                    <div className="text-3xl font-bold text-primary">{percentage}%</div>
                    <p className="text-xs text-muted-foreground mt-1">{progressData?.completedDays || 0} jours complétés</p>
                </div>
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                    <h3 className="text-muted-foreground text-sm font-medium mb-2">Série Actuelle (Streak)</h3>
                    <div className="text-3xl font-bold text-accent">{streak} Jours</div>
                    <p className="text-xs text-muted-foreground mt-1">Continuez ainsi !</p>
                </div>
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                    <h3 className="text-muted-foreground text-sm font-medium mb-2">Prochaine Lecture</h3>
                    <div className="text-xl font-bold">Jour {(progressData?.completedDays || 0) + 1}</div>
                    <Link href={`/jour/${(progressData?.completedDays || 0) + 1}`} className="text-primary text-xs hover:underline block mt-2">Commencer &rarr;</Link>
                </div>
            </div>

            <div className="bg-card border rounded-xl p-6 shadow-sm h-[400px]">
                <h3 className="text-lg font-bold mb-6">Activité Récente</h3>
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="day" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Line
                                type="step"
                                dataKey="completed"
                                stroke="#10B981"
                                strokeWidth={3}
                                dot={{ fill: '#10B981', r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                        Aucune donnée disponible. Commencez une lecture !
                    </div>
                )}
            </div>
        </div>
    );
}
