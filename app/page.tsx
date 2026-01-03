import { plan40jours } from '@/data/plan40jours';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export default async function Home() {
  const session = await auth();
  let progressPercent = 0;
  let nextDay = 1;
  let completedDaysCount = 0;

  if (session?.user?.email) {
    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (user && user.dailyProgress) {
      const progressMap = user.dailyProgress instanceof Map ? user.dailyProgress : new Map(Object.entries(user.dailyProgress));
      const completedDays = Array.from(progressMap.entries()).filter(([_, v]) => v).map(([k]) => parseInt(k));
      completedDaysCount = completedDays.length;
      progressPercent = Math.round((completedDaysCount / 40) * 100);

      // Find first uncompleted day
      for (let i = 1; i <= 40; i++) {
        if (!progressMap.get(i.toString())) {
          nextDay = i;
          break;
        }
      }
    }
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <header className="mb-8 text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold font-kufi text-primary">Coran 40 Jours</h1>
        <p className="text-muted-foreground text-lg">Votre compagnon spirituel pour compléter le Coran.</p>
      </header>



      <section className="max-w-4xl mx-auto mb-12">
        <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative size-32 md:size-40 rounded-full border-4 border-accent flex items-center justify-center bg-accent/5">
            <div className="text-center">
              <span className="text-3xl font-bold block text-accent">{progressPercent}%</span>
              <span className="text-xs text-muted-foreground">Complété</span>
            </div>
          </div>
          <Link href={`/jour/${nextDay}`} className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-3 rounded-full font-semibold transition-transform active:scale-95 shadow-lg shadow-primary/20 inline-block">
            {completedDaysCount > 0 ? `Continuer (Jour ${nextDay})` : "Commencer le Défi"}
          </Link>
        </div>
      </section>

      <section className="max-w-4xl mx-auto mb-12">
        <div className="bg-card border rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
          <h2 className="text-xl md:text-2xl font-bold font-kufi text-primary flex items-center gap-2">
            <span className="text-2xl">⏳</span> Pourquoi un programme sur 40 jours ?
          </h2>
          <div className="space-y-3 text-muted-foreground leading-relaxed">
            <p>
              Ce programme est conçu comme une étape intermédiaire idéale pour <strong>s&apos;habituer à lire le Coran quotidiennement</strong>. L&apos;objectif est de vous entraîner progressivement pour, à terme, être capable de le clôturer en 30 jours (une pratique courante notamment pendant le Ramadan).
            </p>
            <p className="p-4 bg-muted/50 rounded-lg border-l-4 border-accent text-sm md:text-base">
              <span className="font-semibold block text-foreground mb-1">💡 Note sur le Hadith des 40 jours :</span>
              Il existe un hadith rapportant qu&apos;il ne faut pas lire le Coran en plus de 40 jours. Il est important de savoir que ce hadith est considéré comme <strong>shadh (isolé/irrégulier)</strong> par les savants du hadith. Il n&apos;y a donc pas d&apos;interdiction formelle à mettre plus de temps, mais se fixer un objectif de 40 jours reste une excellente discipline spirituelle.
            </p>
            <div className="flex items-center gap-2 pt-2 text-foreground font-medium">
              <span className="bg-primary/10 p-2 rounded-md">⏱️</span>
              <span>Estimation quotidienne : <span className="text-primary">35 à 45 minutes</span> de lecture.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto mb-12">
        <div className="bg-muted/30 border border-border/50 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full hidden md:block">
              <span className="text-2xl">📖</span>
            </div>
            <div className="space-y-4 flex-1">
              <div>
                <h3 className="text-xl font-bold font-kufi text-primary mb-2">Lecture Hafs & Code Tajwid</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Le texte coranique utilisé sur ce site suit la lecture de <strong>Hafs d&apos;après &apos;Asim</strong> (la plus répandue).
                  Pour faciliter votre lecture, une colorisation Tajwid simplifiée a été appliquée :
                </p>
              </div>

              <div className="flex gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                  <div className="flex items-center gap-3 bg-card p-3 rounded-lg border shadow-sm">
                    <span className="w-4 h-4 rounded-full bg-red-600 shadow-sm shrink-0"></span>
                    <div className="text-sm">
                      <span className="font-bold text-red-600 block">Rouge</span>
                      <span className="text-muted-foreground">Prolongation (Madd)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-card p-3 rounded-lg border shadow-sm">
                    <span className="w-4 h-4 rounded-full bg-green-600 shadow-sm shrink-0"></span>
                    <div className="text-sm">
                      <span className="font-bold text-green-600 block">Vert</span>
                      <span className="text-muted-foreground">Nasalisation (Ghunna)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-card p-3 rounded-lg border shadow-sm">
                    <span className="w-4 h-4 rounded-full bg-blue-600 shadow-sm shrink-0"></span>
                    <div className="text-sm">
                      <span className="font-bold text-blue-600 block">Bleu</span>
                      <span className="text-muted-foreground">Emphase / Qalqala</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border/50">
                <Link href="/tajwid" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors">
                  <span className="bg-primary/10 p-1.5 rounded-full">🎓</span>
                  Apprendre le Tajwid Simplifié (Sourate An-Nasr)
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>



      <section className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 font-kufi flex items-center gap-2">
          <span className="w-1 h-8 bg-accent rounded-full block"></span>
          Calendrier de Lecture
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-3">
          {plan40jours.map((day) => (
            <Link
              key={day.jour}
              href={`/jour/${day.jour}`}
              className="group relative bg-card border hover:border-primary/50 transition-all rounded-xl p-3 flex flex-col items-center justify-between h-24 shadow-sm hover:shadow-md cursor-pointer"
            >
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Jour</span>
              <span className="text-2xl font-bold font-kufi text-foreground group-hover:text-primary transition-colors">{day.jour}</span>
              <span className="text-[10px] text-center text-muted-foreground line-clamp-1 w-full px-1">{day.sourates}</span>

              {/* Progress Indicator (hidden for now) */}
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-muted group-hover:bg-primary/20"></div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
