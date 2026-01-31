'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { HADITH_THEMES } from '@/lib/hadith-themes';

export default function HadithThemesPage() {
    return (
        <div className="container max-w-5xl mx-auto py-8 px-4 pb-24 md:pl-64">
            <div className="mb-8">
                <Link href="/hadith" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Retour aux Hadiths
                </Link>
                <h1 className="text-3xl font-bold font-kufi text-primary mb-2">Univers Hadith</h1>
                <p className="text-muted-foreground">Explorez les hadiths par thématiques et sujets majeurs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {HADITH_THEMES.map((theme) => (
                    <Link
                        key={theme.id}
                        href={`/hadith/themes/${theme.id}`}
                        className="group bg-card hover:bg-muted/50 border rounded-xl p-6 transition-all hover:shadow-md flex flex-col items-start gap-4"
                    >
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                            {theme.emoji}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors mb-2">
                                {theme.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {theme.description}
                            </p>
                        </div>
                        <div className="mt-auto pt-4 w-full flex items-center justify-between text-xs text-muted-foreground">
                            <span>{theme.sections.length} Collections</span>
                            <span className="bg-primary/5 px-2 py-1 rounded text-primary font-medium">Explorer →</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
