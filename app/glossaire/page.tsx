import { Suspense } from 'react';
import { BookMarked, Sparkles } from 'lucide-react';
import { glossaire, CATEGORIES } from '@/data/glossaire';
import GlossaireClient from './GlossaireClient';
import type { Metadata } from 'next';

export const revalidate = false;

export const metadata: Metadata = {
  title: 'Glossaire islamique — Coran 40 Jours',
  description:
    'Définitions des termes islamiques essentiels : Foi, Piliers de l\'islam, Pratique, Coran et Histoire. Plus de 60 termes expliqués en français.',
};

export default function GlossairePage() {
  const total = glossaire.length;

  return (
    <div className="mb-20 md:mb-8 md:pl-72">
      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-br from-violet-500/8 via-background to-background border-b px-4 py-10">
        <div className="absolute -left-20 -top-20 w-72 h-72 rounded-full bg-violet-500/8 blur-3xl pointer-events-none" />
        <div className="absolute right-0 bottom-0 w-64 h-64 rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />

        <div className="container max-w-3xl mx-auto relative z-10 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800/40">
            <BookMarked className="w-3 h-3" />
            Référence
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Glossaire islamique</h1>
          <p className="text-muted-foreground max-w-xl">
            Les termes arabes et islamiques essentiels expliqués en français — de l'Iman au Tajwid.
          </p>

          {/* Statistiques */}
          <div className="flex flex-wrap gap-2 pt-1 text-xs font-semibold text-muted-foreground">
            <div className="flex items-center gap-1.5 bg-card/80 border px-3 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-violet-500" />
              {total} termes
            </div>
            {CATEGORIES.map((cat) => (
              <div
                key={cat}
                className="flex items-center gap-1.5 bg-card/80 border px-3 py-1.5 rounded-full"
              >
                {cat}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Contenu interactif */}
      <Suspense
        fallback={
          <div className="container max-w-3xl mx-auto px-4 py-6 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        }
      >
        <GlossaireClient />
      </Suspense>
    </div>
  );
}
