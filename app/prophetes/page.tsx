import Link from 'next/link';
import { BookOpen, Sparkles, Star } from 'lucide-react';
import { prophetes, quizGeneral } from '@/data/prophetes';
import GeneralQuiz from './GeneralQuiz';
import type { Metadata } from 'next';

export const revalidate = false;

export const metadata: Metadata = {
  title: 'Histoires des Prophètes — Coran 40 Jours',
  description:
    'Découvrez les histoires des 25 prophètes mentionnés dans le Coran : récits, traits de caractère, morales et quiz interactifs.',
};

export default function ProphetesPage() {
  return (
    <div className="mb-20 md:mb-8 md:pl-72">
      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-br from-amber-500/8 via-background to-background border-b px-4 py-10">
        <div className="absolute -left-20 -top-20 w-72 h-72 rounded-full bg-amber-500/8 blur-3xl pointer-events-none" />
        <div className="absolute right-0 bottom-0 w-64 h-64 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

        <div className="container max-w-4xl mx-auto relative z-10 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40">
            <Star className="w-3 h-3" />
            Histoires coraniques
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Histoires des Prophètes</h1>
          <p className="text-muted-foreground max-w-xl">
            Les récits des 25 prophètes mentionnés dans le Coran — leurs épreuves, leur caractère, les leçons de leur vie.
          </p>
          <div className="flex flex-wrap gap-2 pt-1 text-xs font-semibold text-muted-foreground">
            <div className="flex items-center gap-1.5 bg-card/80 border px-3 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {prophetes.length} prophètes
            </div>
            <div className="flex items-center gap-1.5 bg-card/80 border px-3 py-1.5 rounded-full">
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              Quiz inclus
            </div>
          </div>
        </div>
      </header>

      {/* Grille */}
      <main className="container max-w-4xl mx-auto px-4 py-8">
        {/* Quiz général */}
        <div className="mb-8">
          <GeneralQuiz questions={quizGeneral} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prophetes.map((p, i) => (
            <Link
              key={p.id}
              href={`/prophetes/${p.id}`}
              className="group bg-card border rounded-2xl p-5 hover:border-amber-400/40 hover:shadow-md transition-all flex gap-4 items-start"
            >
              {/* Numéro */}
              <span className="shrink-0 w-9 h-9 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-sm flex items-center justify-center border border-amber-200 dark:border-amber-800/40 group-hover:bg-amber-500/20 transition-colors">
                {i + 1}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h2 className="font-bold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {p.nom}
                  </h2>
                  {p.nomBiblique && (
                    <span className="text-sm text-muted-foreground">({p.nomBiblique})</span>
                  )}
                  <span className="font-kufi text-primary text-lg">{p.arabe}</span>
                </div>
                {p.surnom && (
                  <p className="text-xs text-muted-foreground mt-0.5 italic">{p.surnom}</p>
                )}
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                  {p.resume}
                </p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {p.traits.slice(0, 3).map((t) => (
                    <span
                      key={t.label}
                      className="text-xs bg-muted/60 px-2 py-0.5 rounded-full"
                    >
                      {t.emoji} {t.label}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
