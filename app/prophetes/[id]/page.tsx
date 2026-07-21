import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, BookOpen, Lightbulb, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { prophetes } from '@/data/prophetes';
import ProphetQuiz from './ProphetQuiz';
import type { Metadata } from 'next';

function HistoireTexte({ texte }: { texte: string }) {
  return (
    <div className="text-sm text-foreground/90 leading-relaxed [&>p]:m-0">
      <ReactMarkdown>{texte}</ReactMarkdown>
    </div>
  );
}

export const revalidate = false;

export function generateStaticParams() {
  return prophetes.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const p = prophetes.find((x) => x.id === id);
  if (!p) return {};
  return {
    title: `${p.nom} (${p.arabe}) — Histoires des Prophètes`,
    description: p.resume,
  };
}

// @ts-ignore — Next.js 15 async params
export default async function PropheteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const index = prophetes.findIndex((p) => p.id === id);
  if (index === -1) notFound();

  const p = prophetes[index];
  const prev = prophetes[index - 1] ?? null;
  const next = prophetes[index + 1] ?? null;

  return (
    <div className="mb-20 md:mb-8 md:pl-72">
      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-amber-500/8 via-background to-background border-b px-4 py-8">
        <div className="absolute -left-20 -top-20 w-72 h-72 rounded-full bg-amber-500/6 blur-3xl pointer-events-none" />
        <div className="container max-w-3xl mx-auto relative z-10">
          <Link
            href="/prophetes"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Tous les prophètes
          </Link>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-black tracking-tight flex items-baseline gap-2 flex-wrap">
                {p.nom}
                <span className="font-kufi text-lg font-normal text-muted-foreground">
                  {p.id === 'muhammad' ? 'ﷺ' : 'عليه السلام'}
                </span>
              </h1>
              <p className="font-kufi text-3xl text-primary mt-1">{p.arabe}</p>
              {p.surnom && (
                <p className="text-sm text-amber-600 dark:text-amber-400 font-semibold mt-1 italic">
                  {p.surnom}
                </p>
              )}
              {p.periode && (
                <p className="text-xs text-muted-foreground mt-1">{p.periode}</p>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-4 pt-8 pb-16">

        {/* Résumé */}
        <p className="text-base text-muted-foreground leading-relaxed border-l-4 border-amber-400/40 pl-4 italic">
          {p.resume}
        </p>

        {/* Histoire */}
        <section style={{ marginTop: '3rem' }}>
          <h2 className="flex items-center gap-2 text-lg font-bold" style={{ marginBottom: '1.25rem' }}>
            <BookOpen className="w-5 h-5 text-amber-500" /> Son histoire
          </h2>
          {p.histoire.some((item) => typeof item !== 'string') ? (
            <ol>
              {p.histoire.map((item, i) => {
                const etape = typeof item === 'string' ? null : item.etape;
                const texte = typeof item === 'string' ? item : item.texte;
                const isLast = i === p.histoire.length - 1;
                return (
                  <li key={i} className="flex gap-4">
                    <div className="flex flex-col items-center shrink-0 w-3">
                      <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                      {!isLast && (
                        <span className="w-0.5 flex-1 bg-amber-200 dark:bg-amber-800/40 my-1.5" />
                      )}
                    </div>
                    <div className={isLast ? 'flex-1 min-w-0' : 'flex-1 min-w-0 pb-8'}>
                      {etape && (
                        <p className="text-xs font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400 mb-1.5 -mt-0.5">
                          {i + 1}. {etape}
                        </p>
                      )}
                      <HistoireTexte texte={texte} />
                    </div>
                  </li>
                );
              })}
            </ol>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {p.histoire.map((item, i) => (
                <HistoireTexte key={i} texte={typeof item === 'string' ? item : item.texte} />
              ))}
            </div>
          )}
        </section>

        {/* Verset clé */}
        {p.versetCle && (
          <blockquote
            className="bg-amber-50/60 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-2xl"
            style={{ marginTop: '3rem', padding: '1.5rem' }}
          >
            <p className="text-sm text-foreground/90 italic leading-relaxed">
              &ldquo;{p.versetCle.texte}&rdquo;
            </p>
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400" style={{ marginTop: '0.75rem' }}>
              {p.versetCle.ref}
            </p>
          </blockquote>
        )}

        {/* Traits de caractère */}
        <section style={{ marginTop: '3rem' }}>
          <h2 className="text-lg font-bold" style={{ marginBottom: '1.25rem' }}>Traits de caractère</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {p.traits.map((t) => (
              <span
                key={t.label}
                className="flex items-center gap-1.5 bg-card border rounded-full text-sm font-medium"
                style={{ padding: '0.5rem 1rem' }}
              >
                <span>{t.emoji}</span>
                {t.label}
              </span>
            ))}
          </div>
        </section>

        {/* Morale */}
        <section
          className="bg-primary/5 border border-primary/15 rounded-2xl"
          style={{ marginTop: '3rem', padding: '1.75rem' }}
        >
          <div className="flex items-center gap-2 text-primary font-bold text-base" style={{ marginBottom: '0.75rem' }}>
            <Lightbulb className="w-5 h-5" /> La leçon
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">{p.morale}</p>
        </section>

        {/* Quiz */}
        <section style={{ marginTop: '3rem' }}>
          <h2 className="flex items-center gap-2 text-lg font-bold" style={{ marginBottom: '1.5rem' }}>
            <HelpCircle className="w-5 h-5 text-amber-500" /> Quiz — Connais-tu {p.nom} ?
          </h2>
          <ProphetQuiz questions={p.quiz} prophetName={p.nom} />
        </section>

        <div style={{ marginTop: '3rem', borderTop: '1px solid hsl(var(--border) / 0.5)' }} />

        {/* Navigation précédent / suivant */}
        <nav className="flex items-center justify-between gap-4" style={{ marginTop: '2rem' }}>
          {prev ? (
            <Link
              href={`/prophetes/${prev.id}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <div className="text-left">
                <div className="text-xs">Précédent</div>
                <div className="font-semibold">{prev.nom}</div>
              </div>
            </Link>
          ) : <div />}

          {next ? (
            <Link
              href={`/prophetes/${next.id}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="text-right">
                <div className="text-xs">Suivant</div>
                <div className="font-semibold">{next.nom}</div>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : <div />}
        </nav>
      </main>
    </div>
  );
}
