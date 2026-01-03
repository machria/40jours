import React from 'react';
import Link from 'next/link';
import { ChevronLeft, BookOpen, Star, Sparkles, ArrowRight } from 'lucide-react';

import { VOCABULARY_DATA } from '@/data/vocabulary';

export default function VocabularyPage() {
    const categories = VOCABULARY_DATA;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="p-4 flex items-center gap-4 sticky top-0 bg-background/80 backdrop-blur z-10 border-b">
                <Link href="/tajwid" className="p-2 hover:bg-muted rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-xl font-bold font-kufi text-primary">Vocabulaire Coranique</h1>
                    <p className="text-xs text-muted-foreground">Les 250+ mots essentiels (Kit de Survie)</p>
                </div>
                <Link
                    href="/vocabulaire/quiz"
                    className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-full font-bold text-sm transition-colors"
                >
                    <Sparkles className="w-4 h-4" />
                    <span className="hidden md:inline">Quiz</span>
                    <span className="md:hidden">Jouer</span>
                </Link>
            </header>

            <main className="flex-1 container max-w-3xl mx-auto p-4 md:p-6 space-y-8 pb-24">

                {/* Intro */}
                <section className="bg-card border rounded-3xl p-6 shadow-sm space-y-4 text-center">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto text-accent mb-2">
                        <Sparkles className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold font-kufi">Le Principe du 80/20</h2>
                    <div className="text-muted-foreground leading-relaxed space-y-4">
                        <p>
                            Le Coran contient environ 77 000 mots. Cependant, une minorité de racine se répète constamment.
                        </p>
                        <div className="bg-muted/50 p-4 rounded-xl text-sm border border-border/50">
                            <p className="font-semibold text-foreground mb-1">Pourquoi cette sélection de ~250 mots ?</p>
                            <p>
                                Nous avons filtré le vocabulaire pour ne garder que les termes à <strong>très haute fréquence</strong>. Bien que l'objectif de 80% de compréhension nécessite environ 300 mots, cette liste de 250 constitue le "noyau dur" indispensable. Maîtriser ces 250 mots vous donne déjà accès à la majorité du sens global des versets.
                            </p>
                        </div>
                    </div>
                </section>

                {categories.map((cat, idx) => (
                    <section key={idx} className="space-y-4">
                        <div className="flex items-center gap-2 px-2">
                            <Star className="w-5 h-5 text-primary fill-primary/20" />
                            <h2 className="text-xl font-bold font-kufi text-foreground">{cat.title}</h2>
                        </div>
                        <p className="text-sm text-muted-foreground px-2">{cat.description}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {cat.words.map((word, wIdx) => (
                                <div key={wIdx} className="bg-card border rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow group">
                                    <div className="space-y-1">
                                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{word.trans}</span>
                                        <p className="font-bold text-foreground group-hover:text-primary transition-colors">{word.fr}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl md:text-3xl font-kufi text-foreground/90 dir-rtl">{word.arabic}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}

                <section className="bg-muted/30 border border-border/50 rounded-2xl p-6 text-center space-y-4">
                    <h3 className="font-bold text-lg">Envie d'aller plus loin ?</h3>
                    <p className="text-muted-foreground text-sm">
                        Cette liste de 250 mots est votre fondation. Une fois maîtrisée, vous aurez franchi l'étape la plus difficile de l'apprentissage du vocabulaire coranique.
                    </p>
                </section>



            </main>
        </div>
    );
}
