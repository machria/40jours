'use client';

import { useState } from 'react';
import { Check, X, RefreshCw, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { QuizQuestion } from '@/data/prophetes';

interface ProphetQuizProps {
  questions: QuizQuestion[];
  prophetName: string;
}

export default function ProphetQuiz({ questions, prophetName }: ProphetQuizProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[current];

  const handleAnswer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.correct) setScore((s) => s + 1);
  };

  const next = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  };

  const reset = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border rounded-2xl p-8 text-center space-y-4"
      >
        <Trophy className="w-12 h-12 text-amber-500 mx-auto" />
        <h3 className="text-2xl font-bold">Quiz terminé !</h3>
        <p className="text-muted-foreground">
          {score}/{questions.length} — {pct}%
        </p>
        <p className="text-sm text-muted-foreground">
          {pct === 100
            ? `Parfait ! Tu connais l'histoire de ${prophetName} sur le bout des doigts.`
            : pct >= 70
            ? 'Très bien ! Quelques détails à revoir.'
            : 'Relis l\'histoire et retente le quiz !'}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Recommencer
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barre de progression */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
        <span>Question {current + 1}/{questions.length}</span>
        <span>Score : {score}</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-amber-500 rounded-full"
          animate={{ width: `${((current) / questions.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {/* Question */}
          <div className="bg-muted/40 rounded-xl p-5">
            <p className="font-semibold text-foreground leading-relaxed">{q.question}</p>
          </div>

          {/* Options */}
          <div className="grid gap-2">
            {q.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = i === q.correct;
              let cls = 'border bg-card hover:bg-muted/50 text-foreground';
              if (selected !== null) {
                if (isCorrect) cls = 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300';
                else if (isSelected) cls = 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300';
                else cls = 'border bg-card opacity-50';
              }
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={selected !== null}
                  className={`w-full text-left p-4 rounded-xl flex items-center justify-between gap-3 transition-all ${cls}`}
                >
                  <span className="text-sm">{opt}</span>
                  {selected !== null && isCorrect && <Check className="w-4 h-4 text-green-600 shrink-0" />}
                  {selected !== null && isSelected && !isCorrect && <X className="w-4 h-4 text-red-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explication + Suivant */}
          <AnimatePresence>
            {selected !== null && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="p-4 bg-muted/50 rounded-xl text-sm text-muted-foreground border-l-4 border-primary/40">
                  {q.explication}
                </div>
                <button
                  onClick={next}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                >
                  {current + 1 >= questions.length ? 'Voir les résultats' : 'Question suivante →'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
