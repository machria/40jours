'use client';

import { CheckCircle } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';

/** Pastille « Lu » d'une carte du calendrier (accueil statique, progression chargée côté client). */
export default function DayDoneBadge({ dayId }: { dayId: number }) {
    const { data } = useProgress();
    if (!data?.dailyProgress[dayId.toString()]) return null;

    return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
            <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
            Lu
        </span>
    );
}
