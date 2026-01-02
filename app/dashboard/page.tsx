import { auth } from "@/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { plan40jours } from "@/data/plan40jours";
import { CheckCircle, BookOpen, Trophy, Flame } from "lucide-react";
import Link from "next/link";

async function getUserData(email: string) {
    await dbConnect();
    const user = await User.findOne({ email }).lean();
    return JSON.parse(JSON.stringify(user));
}

export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user?.email) {
        redirect("/login");
    }

    const user = await getUserData(session.user.email);

    // Calculate stats
    const completedDaysCount = Object.values(user.dailyProgress || {}).filter(Boolean).length;
    const progressPercent = Math.round((completedDaysCount / 40) * 100);
    const completedJuzCount = user.completedJuzs?.length || 0;

    // Convert dailyProgress map to simpler object for checking
    const dailyProgress = user.dailyProgress || {};

    return (
        <div className="min-h-screen p-4 md:p-8 space-y-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold font-kufi text-primary">Mon Tableau de Bord</h1>
                <p className="text-muted-foreground">Bienvenue, {user.name || session.user.name}</p>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card border rounded-xl p-6 flex flex-col items-center justify-center space-y-2 shadow-sm">
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                        <Flame className="w-8 h-8" />
                    </div>
                    <span className="text-3xl font-bold text-foreground">{user.streak || 0}</span>
                    <span className="text-sm text-muted-foreground">Jours consécutifs</span>
                </div>
                <div className="bg-card border rounded-xl p-6 flex flex-col items-center justify-center space-y-2 shadow-sm">
                    <div className="p-3 bg-blue-500/10 rounded-full text-blue-600">
                        <BookOpen className="w-8 h-8" />
                    </div>
                    <span className="text-3xl font-bold text-foreground">{completedJuzCount}/30</span>
                    <span className="text-sm text-muted-foreground">Juz Complétés</span>
                </div>
                <div className="bg-card border rounded-xl p-6 flex flex-col items-center justify-center space-y-2 shadow-sm">
                    <div className="p-3 bg-yellow-500/10 rounded-full text-yellow-600">
                        <Trophy className="w-8 h-8" />
                    </div>
                    <span className="text-3xl font-bold text-foreground">{completedDaysCount}/40</span>
                    <span className="text-sm text-muted-foreground">Programme 40 Jours</span>
                </div>
            </div>

            {/* 40 Jours Progress */}
            <section className="bg-card border rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold font-kufi flex items-center gap-2">
                        <span className="text-primary">📅</span>
                        Progression 40 Jours
                    </h2>
                    <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                        {progressPercent}%
                    </span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3">
                    {plan40jours.map((day) => {
                        const isCompleted = dailyProgress[String(day.jour)];
                        return (
                            <div
                                key={day.jour}
                                className={`
                            relative flex flex-col items-center justify-center p-3 rounded-lg border h-20 transition-all
                            ${isCompleted
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-muted/30 border-border text-muted-foreground"
                                    }
                        `}
                            >
                                <span className="text-xs uppercase font-semibold opacity-70">J-{day.jour}</span>
                                {isCompleted ? (
                                    <CheckCircle className="w-6 h-6 mt-1" />
                                ) : (
                                    <span className="text-xs mt-1 text-center line-clamp-1 w-full">{day.sourates}</span>
                                )}
                            </div>
                        )
                    })}
                </div>
                <div className="flex justify-end">
                    <Link href="/jour/1" className="text-sm text-primary hover:underline">
                        Accéder au programme &rarr;
                    </Link>
                </div>
            </section>

            {/* Juz Progress */}
            <section className="bg-card border rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
                <h2 className="text-xl font-bold font-kufi flex items-center gap-2">
                    <span className="text-blue-600">📖</span>
                    Mes Juz
                </h2>
                <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
                    {[...Array(30)].map((_, i) => {
                        const juzId = i + 1;
                        const isRead = user.completedJuzs?.includes(juzId);
                        return (
                            <div
                                key={juzId}
                                className={`
                            aspect-square rounded-md flex items-center justify-center font-bold text-sm border
                            ${isRead
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-background border-border text-muted-foreground"
                                    }
                        `}
                                title={`Juz ${juzId}`}
                            >
                                {juzId}
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* Quiz Scores (Placeholder or real data if available) */}
            <section className="bg-card border rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
                <h2 className="text-xl font-bold font-kufi flex items-center gap-2">
                    <span className="text-yellow-600">🏆</span>
                    Meilleurs Scores (Quiz)
                </h2>
                {user.quizScores && Object.keys(user.quizScores).length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {Object.entries(user.quizScores).map(([key, score]) => (
                            <div key={key} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
                                <span className="font-medium text-sm">Sourate {key}</span>
                                <span className="font-bold text-primary">{String(score)}%</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-sm">Aucun quiz effectué pour le moment.</p>
                )}
            </section>

        </div>
    );
}
