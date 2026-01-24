import { auth } from "@/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { plan40jours } from "@/data/plan40jours";
import { CheckCircle, BookOpen, Trophy, Flame, Users } from "lucide-react";
import Link from "next/link";
import ActivityChart from "@/components/dashboard/ActivityChart";
import BadgesList from "@/components/dashboard/BadgesList";
import { calculateStreak } from "@/lib/streak-utils";

async function getUserData(email: string) {
    await dbConnect();
    const user = await User.findOne({ email }).lean();
    if (!user) return null;

    // Manually serialize to handle Maps if necessary
    const serialized: any = { ...user };

    if (serialized.activityHistory instanceof Map) {
        serialized.activityHistory = Object.fromEntries(serialized.activityHistory);
    }

    // Check other Maps just in case (dailyProgress is usually Map in schema)
    if (serialized.dailyProgress instanceof Map) {
        serialized.dailyProgress = Object.fromEntries(serialized.dailyProgress);
    }
    if (serialized.quizScores instanceof Map) {
        serialized.quizScores = Object.fromEntries(serialized.quizScores);
    }

    return JSON.parse(JSON.stringify(serialized));
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

    // Calculate dynamic streak to ensure accuracy
    const currentStreak = calculateStreak(user.activityHistory || {});

    // Convert dailyProgress map to simpler object for checking
    const dailyProgress = user.dailyProgress || {};

    // Calculate next day (first uncompleted day, or 1 if all completed)
    let nextDay = 1;
    for (let i = 1; i <= 40; i++) {
        if (!dailyProgress[i.toString()]) {
            nextDay = i;
            break;
        }
    }

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
                    <span className="text-3xl font-bold text-foreground">{currentStreak}</span>
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
            <Link href="/social" className="bg-card border rounded-xl p-6 flex flex-col items-center justify-center space-y-2 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                <div className="p-3 bg-purple-500/10 rounded-full text-purple-600 group-hover:scale-110 transition-transform">
                    <Users className="w-8 h-8" />
                </div>
                <span className="text-xl font-bold text-foreground text-center">Communauté</span>
                <span className="text-sm text-muted-foreground text-center">Groupes & Classements</span>
            </Link>




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
                    <Link href={`/jour/${nextDay}`} className="text-sm text-primary hover:underline">
                        {completedDaysCount === 40 ? "Recommencer le programme (Jour 1) →" : `Continuer le programme (Jour ${nextDay}) →`}
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


            {/* Charts & Badges */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ActivityChart activityHistory={user.activityHistory || {}} />
                <BadgesList unlockedBadges={user.badges || []} />
            </div>

            {/* Quiz Scores */}
            <section className="bg-card border rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
                <h2 className="text-xl font-bold font-kufi flex items-center gap-2">
                    <span className="text-yellow-600">🏆</span>
                    Meilleurs Scores (Quiz)
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Hisn Quiz */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
                        <span className="font-medium text-sm flex items-center gap-2">
                            🏰 Citadelle
                        </span>
                        <span className="font-bold text-primary">{user.hisnQuizBestScore || 0} pts</span>
                    </div>

                    {/* Vocabulary Quiz */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
                        <span className="font-medium text-sm flex items-center gap-2">
                            📚 Vocabulaire
                        </span>
                        <span className="font-bold text-primary">{user.vocabularyQuizBestScore || 0} pts</span>
                    </div>

                    {/* Arabic Quiz */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
                        <span className="font-medium text-sm flex items-center gap-2">
                            🎓 Alphabet
                        </span>
                        <span className="font-bold text-primary">{user.arabicQuizBestScore || 0} pts</span>
                    </div>

                    {/* 99 Names Quiz */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
                        <span className="font-medium text-sm flex items-center gap-2">
                            ✨ 99 Noms
                        </span>
                        <span className="font-bold text-primary">{user.names99QuizBestScore || 0} pts</span>
                    </div>

                    {/* Sira Quiz */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
                        <span className="font-medium text-sm flex items-center gap-2">
                            📜 Sira
                        </span>
                        <span className="font-bold text-primary">{user.siraQuizBestScore || 0} pts</span>
                    </div>
                </div>

                {(() => {
                    const memorizationScores = user.quizScores
                        ? Object.entries(user.quizScores).filter(([key]) => key !== '99-names')
                        : [];

                    if (memorizationScores.length === 0) return null;

                    return (
                        <div className="mt-4 pt-4 border-t">
                            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Sourates (Mémorisation)</h3>
                            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                                {memorizationScores.map(([key, score]) => (
                                    <div key={key} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
                                        <span className="font-medium text-sm">Sourate {key}</span>
                                        <span className="font-bold text-primary">{String(score)}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })()}
            </section>

        </div>
    );
}
