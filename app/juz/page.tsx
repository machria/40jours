'use client';

import { getAllJuz } from '@/lib/juzData';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BookOpen, PlayCircle, Map as MapIcon } from 'lucide-react';

export default function JuzListPage() {
    const juzList = getAllJuz();
    const [lastRead, setLastRead] = useState<number | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('lastJuz');
        if (saved) setLastRead(parseInt(saved));
    }, []);

    return (
        <div className="container mx-auto px-4 py-8 pb-24">
            <h1 className="text-3xl font-bold mb-6 text-center text-emerald-800 dark:text-emerald-400">
                Lecture par Juz (30 Jours)
            </h1>

            {lastRead && (
                <div className="mb-8 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800 flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-emerald-800 dark:text-emerald-400">Reprendre la lecture</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Vous étiez au Juz {lastRead}</p>
                    </div>
                    <Link
                        href={`/juz/${lastRead}`}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                    >
                        <PlayCircle size={20} />
                        Continuer
                    </Link>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {juzList.map((juz) => (
                    <Link
                        key={juz.id}
                        href={`/juz/${juz.id}`}
                        className="group bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all hover:shadow-md"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="w-8 h-8 flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 rounded-full font-bold text-sm">
                                {juz.id}
                            </span>
                            <BookOpen size={20} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
                        </div>

                        <div className="mt-2">
                            <div className="flex justify-between items-baseline">
                                <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                    Juz {juz.id}
                                </span>
                                <span className="text-xs text-gray-500">
                                    Pages {juz.startPage}-{juz.endPage}
                                </span>
                            </div>

                            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 flex flex-col gap-1">
                                <div className="flex justify-between">
                                    <span>Début:</span>
                                    <span className="font-arabic">Sourate {juz.start.surah}, V. {juz.start.ayah}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Fin:</span>
                                    <span className="font-arabic">Sourate {juz.end.surah}, V. {juz.end.ayah}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
