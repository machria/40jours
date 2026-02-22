'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ProgressData {
  progressPercent: number;
  completedDays: number;
  dailyProgress: Record<string, boolean>;
}

export default function HomeProgress() {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [nextDay, setNextDay] = useState(1);

  useEffect(() => {
    fetch('/api/progress')
      .then(res => (res.ok ? res.json() : null))
      .then((data: ProgressData | null) => {
        if (!data || (data as any).error) return;
        setProgress(data);
        for (let i = 1; i <= 40; i++) {
          if (!data.dailyProgress[i.toString()]) {
            setNextDay(i);
            break;
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
      <div className="relative size-32 md:size-40 rounded-full border-4 border-accent flex items-center justify-center bg-accent/5">
        <div className="text-center">
          <span className="text-3xl font-bold block text-accent">
            {progress?.progressPercent ?? 0}%
          </span>
          <span className="text-xs text-muted-foreground">Complété</span>
        </div>
      </div>
      <Link
        href={`/jour/${nextDay}`}
        className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-3 rounded-full font-semibold transition-transform active:scale-95 shadow-lg shadow-primary/20 inline-block"
      >
        {progress && progress.completedDays > 0
          ? `Continuer (Jour ${nextDay})`
          : 'Commencer le Défi'}
      </Link>
    </div>
  );
}
