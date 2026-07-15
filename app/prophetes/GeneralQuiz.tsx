'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import ProphetQuiz from './[id]/ProphetQuiz';
import type { QuizQuestion } from '@/data/prophetes';

interface GeneralQuizProps {
  questions: QuizQuestion[];
}

export default function GeneralQuiz({ questions }: GeneralQuizProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-card border rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 p-5 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="shrink-0 w-10 h-10 rounded-full bg-amber-500/10 border border-amber-200 dark:border-amber-800/40 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </span>
          <div>
            <p className="font-bold text-foreground">Quiz général — Testez vos connaissances</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Chronologie, liens de parenté, Livres révélés... {questions.length} questions sur l&apos;ensemble des 25 prophètes
            </p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="p-5 border-t">
          <ProphetQuiz questions={questions} prophetName="tous les prophètes" />
        </div>
      )}
    </div>
  );
}
