
'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, GraduationCap, LayoutGrid, BookOpen, BrainCircuit } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AlphabetGrid from '@/components/learn-arabe/AlphabetGrid';
import LessonView from '@/components/learn-arabe/LessonView';
import FlashcardGame from '@/components/learn-arabe/FlashcardGame';
import QuizGame from '@/components/learn-arabe/QuizGame';

export default function LearnArabicPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="p-4 flex items-center gap-4 sticky top-0 bg-background/80 backdrop-blur z-10 border-b">
                <Link href="/tajwid" className="p-2 hover:bg-muted rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-xl font-bold font-kufi text-primary">Apprendre l'Arabe</h1>
                    <p className="text-xs text-muted-foreground">Alphabet et Lecture pour débutants</p>
                </div>
            </header>

            <main className="flex-1 container max-w-4xl mx-auto p-4 md:p-6 pb-24 space-y-8">

                <div className="text-center space-y-4 mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary mb-4">
                        <GraduationCap className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">Commencez votre voyage</h2>
                    <p className="text-muted-foreground max-w-lg mx-auto">
                        Apprenez l'alphabet arabe, comprenez les voyelles et testez vos connaissances avec nos outils interactifs.
                    </p>
                </div>

                <Tabs defaultValue="alphabet" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-muted/50 rounded-2xl">
                        <TabsTrigger value="alphabet" className="rounded-xl py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <LayoutGrid className="w-4 h-4 mr-2" /> Alphabet
                        </TabsTrigger>
                        <TabsTrigger value="lessons" className="rounded-xl py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <BookOpen className="w-4 h-4 mr-2" /> Leçons
                        </TabsTrigger>
                        <TabsTrigger value="flashcards" className="rounded-xl py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <BrainCircuit className="w-4 h-4 mr-2" /> Flashcards
                        </TabsTrigger>
                        <TabsTrigger value="quiz" className="rounded-xl py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <GraduationCap className="w-4 h-4 mr-2" /> Quiz
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="alphabet" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold">L'Alphabet Arabe</h3>
                            <span className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full">28 Lettres</span>
                        </div>
                        <AlphabetGrid />
                    </TabsContent>

                    <TabsContent value="lessons" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold">Leçons de Lecture</h3>
                        </div>
                        <LessonView />
                    </TabsContent>

                    <TabsContent value="flashcards" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center mb-8">
                            <h3 className="text-lg font-bold mb-2">Mémorisation</h3>
                            <p className="text-sm text-muted-foreground">Testez votre mémoire avec les flashcards.</p>
                        </div>
                        <FlashcardGame />
                    </TabsContent>

                    <TabsContent value="quiz" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center mb-8">
                            <h3 className="text-lg font-bold mb-2">Quiz Connaissances</h3>
                            <p className="text-sm text-muted-foreground">Validez vos acquis avec ce petit quiz.</p>
                        </div>
                        <QuizGame />
                    </TabsContent>
                </Tabs>

            </main>
        </div>
    );
}
