
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { ChevronRight, Search, Sparkles } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';

interface SurahMeta {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
    description?: string;
}

function getSurahs(): SurahMeta[] {
    try {
        const p = path.join(process.cwd(), 'data', 'surahs.json');
        const file = fs.readFileSync(p, 'utf-8');
        return JSON.parse(file);
    } catch (e) {
        return [];
    }
}

export default function CoranPage() {
    const surahs = getSurahs();

    return (
        <div className="min-h-screen bg-background pb-20 md:pl-64">
            <Navigation />

            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold font-kufi text-primary">Le Saint Coran</h1>
                        <p className="text-sm text-muted-foreground">Index des Sourates</p>
                    </div>
                    <Link
                        href="/coran/flashcards"
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span className="hidden sm:inline">Découvrir</span>
                    </Link>
                </div>
            </header>

            <main className="p-4 max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {surahs.map((surah) => (
                        <Link
                            key={surah.number}
                            href={`/coran/${surah.number}`}
                            className="group bg-card hover:bg-muted/50 border rounded-xl p-4 transition-all hover:shadow-md flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4 min-w-0 flex-1">
                                <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                                    {surah.number}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors truncate">
                                        {surah.englishName}
                                    </h3>
                                    <p className="text-xs text-muted-foreground mb-1">
                                        {surah.englishNameTranslation} • {surah.numberOfAyahs} Versets
                                    </p>
                                    {surah.description && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed max-w-[250px]" title={surah.description}>
                                            {surah.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="text-right shrink-0 ml-2">
                                <span className="font-kufi text-xl text-foreground/80 block mb-1">
                                    {surah.name}
                                </span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${surah.revelationType === 'Meccan'
                                    ? 'bg-orange-50 text-orange-600 border-orange-100'
                                    : 'bg-green-50 text-green-600 border-green-100'
                                    }`}>
                                    {surah.revelationType === 'Meccan' ? 'Mecquoise' : 'Médinoise'}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
