'use client';

import { plan40jours } from '@/data/plan40jours';
import Link from 'next/link';

export default function Home() {


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
              <span className="text-3xl font-bold block text-accent">0%</span>
              <span className="text-xs text-muted-foreground">Complété</span>
            </div>
          </div>
          <Link href="/jour/1" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-3 rounded-full font-semibold transition-transform active:scale-95 shadow-lg shadow-primary/20 inline-block">
            Commencer le Défi
          </Link>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto mb-12">
        <Link href="/hadith" className="block group">
          <div className="bg-card border hover:border-primary/50 transition-all rounded-2xl p-6 md:p-8 shadow-sm group-hover:shadow-md flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <span className="text-2xl">📚</span>
              </div>
              <div>
                <h3 className="text-xl font-bold font-kufi text-foreground group-hover:text-primary transition-colors">Hadiths Authentiques</h3>
                <p className="text-muted-foreground">Sahih Al-Bukhari et Sahih Muslim en français</p>
              </div>
            </div>
            <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">
              &rarr;
            </div>
          </div>
        </Link>
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
