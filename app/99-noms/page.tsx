'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, HelpCircle, Trophy, ChevronRight, RefreshCw, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { namesOfAllah, AllahName } from '@/data/names';

export default function NamesPage() {
    const [mode, setMode] = useState<'learn' | 'quiz'>('learn');
    const [index, setIndex] = useState(0);

    // Quiz State
    const [quizQuestion, setQuizQuestion] = useState<AllahName | null>(null);
    const [questionType, setQuestionType] = useState<'arabe' | 'transliteration' | 'francais'>('arabe');
    const [options, setOptions] = useState<AllahName[]>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);

    const startQuiz = () => {
        setMode('quiz');
        setScore(0);
        nextQuestion();
    };

    const nextQuestion = () => {
        const randomIndex = Math.floor(Math.random() * namesOfAllah.length);
        const question = namesOfAllah[randomIndex];
        setQuizQuestion(question);

        // Randomize question type
        const types: ('arabe' | 'transliteration' | 'francais')[] = ['arabe', 'transliteration', 'francais'];
        setQuestionType(types[Math.floor(Math.random() * types.length)]);

        setSelectedOption(null);
        setIsCorrect(null);

        // Generate 3 distractors
        const neighbors = [...namesOfAllah].sort(() => 0.5 - Math.random()).slice(0, 3);
        // Ensure unique options
        const allOptions = [question, ...neighbors.filter(n => n.transliteration !== question.transliteration)].slice(0, 4);
        setOptions(allOptions.sort(() => 0.5 - Math.random()));
    };

    const handleAnswer = (answer: string) => {
        if (selectedOption) return; // Prevent double guess
        setSelectedOption(answer);
        const correct = answer === quizQuestion?.transliteration;
        setIsCorrect(correct);
        if (correct) setScore(s => s + 1);

        // Auto next after delay if correct
        if (correct) {
            setTimeout(nextQuestion, 1500);
        }
    };

    // Learn Mode Navigation
    const nextCard = () => setIndex((prev) => (prev + 1) % namesOfAllah.length);
    const prevCard = () => setIndex((prev) => (prev - 1 + namesOfAllah.length) % namesOfAllah.length);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur z-10">
                <Link href="/" className="p-2 hover:bg-muted rounded-full">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-xl font-bold font-kufi text-primary">Les 99 Noms</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setMode(mode === 'learn' ? 'quiz' : 'learn')}
                        className={`p-2 rounded-full transition-colors ${mode === 'quiz' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-accent'}`}
                    >
                        {mode === 'quiz' ? <HelpCircle className="w-5 h-5" /> : <Trophy className="w-5 h-5" />}
                    </button>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-start py-8 px-4 overflow-y-auto w-full max-w-lg mx-auto space-y-6">
                <div className="text-center space-y-4 bg-emerald-50/50 dark:bg-emerald-900/10 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
                    <p className="font-kufi text-xl text-emerald-800 dark:text-emerald-400">
                        Au nom d&apos;Allah, le Tout Miséricordieux, le Très Miséricordieux
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        D&apos;après Abou Houreira (qu&apos;Allah l&apos;agrée), le Prophète (que la prière d&apos;Allah et Son salut soient sur lui) a dit: <br />
                        <span className="font-medium text-foreground italic">« Certes Allah a quatre vingt dix neuf noms, cent moins un, celui qui les dénombre rentre dans le paradis »</span>.
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                        (Rapporté par Boukhari dans son Sahih n°2736 et Mouslim dans son Sahih n°2677)
                    </p>
                </div>
                <AnimatePresence mode="wait">
                    {mode === 'learn' ? (
                        <motion.div
                            key="learn"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full relative flex items-center justify-center"
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full"
                                >
                                    <div className="px-4 py-2">
                                        <div className="bg-card border-2 border-primary/10 rounded-3xl p-8 shadow-xl flex flex-col items-center text-center space-y-8 aspect-[3/4] justify-center relative overflow-hidden group hover:border-accent/50 transition-colors bg-gradient-to-br from-card to-muted/20">
                                            <div className="absolute top-4 right-4 text-xs font-mono text-muted-foreground/50">#{index + 1}</div>

                                            {/* Calligraphy */}
                                            <div className="flex-1 flex items-center justify-center w-full">
                                                <h2 className="text-6xl md:text-8xl font-kufi text-primary group-hover:scale-110 transition-transform duration-500 drop-shadow-sm">
                                                    {namesOfAllah[index].arabe}
                                                </h2>
                                            </div>

                                            <div className="space-y-2">
                                                <h3 className="text-2xl font-bold text-foreground">{namesOfAllah[index].transliteration}</h3>
                                                <p className="text-accent font-semibold text-lg">{namesOfAllah[index].francais}</p>
                                            </div>

                                            <div className="bg-muted/50 p-4 rounded-xl w-full">
                                                <p className="text-sm text-muted-foreground italic">&quot;{namesOfAllah[index].signification}&quot;</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation Buttons overlay */}
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 pointer-events-none">
                                <button onClick={prevCard} className="pointer-events-auto p-2 bg-background/50 rounded-full hover:bg-background shadow-sm backdrop-blur">
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button onClick={nextCard} className="pointer-events-auto p-2 bg-background/50 rounded-full hover:bg-background shadow-sm backdrop-blur">
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="quiz"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full space-y-6"
                        >
                            {!quizQuestion ? (
                                <div className="text-center space-y-4">
                                    <h2 className="text-2xl font-bold">Quiz des 99 Noms</h2>
                                    <p className="text-muted-foreground">Testez vos connaissances sur les noms d&apos;Allah.</p>
                                    <button onClick={startQuiz} className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold shadow-lg hover:bg-primary/90">
                                        Commencer
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center text-sm font-medium">
                                        <span>Score: {score}</span>
                                        <button onClick={nextQuestion} className="text-muted-foreground hover:text-primary flex items-center gap-1">
                                            <RefreshCw className="w-4 h-4" /> Passer
                                        </button>
                                    </div>

                                    <div className="bg-card border rounded-2xl p-8 text-center space-y-4 shadow-sm min-h-[200px] flex flex-col items-center justify-center">
                                        <p className="text-sm text-muted-foreground uppercase tracking-widest">
                                            {questionType === 'arabe' && "Quel est ce nom ?"}
                                            {questionType === 'transliteration' && "Comment s'écrit ce nom en arabe ?"}
                                            {questionType === 'francais' && "Quel nom signifie :"}
                                        </p>

                                        {questionType === 'arabe' && (
                                            <h2 className="text-6xl font-kufi text-primary">{quizQuestion.arabe}</h2>
                                        )}
                                        {questionType === 'transliteration' && (
                                            <h2 className="text-4xl font-bold text-foreground">{quizQuestion.transliteration}</h2>
                                        )}
                                        {questionType === 'francais' && (
                                            <h2 className="text-2xl font-medium text-accent italic">&quot;{quizQuestion.francais}&quot;</h2>
                                        )}
                                    </div>

                                    <div className="grid gap-3">
                                        {options.map((opt, i) => {
                                            const isSelected = selectedOption === opt.transliteration;
                                            const isCorrectAnswer = opt.transliteration === quizQuestion.transliteration;

                                            // Determine style
                                            let style = "bg-card hover:bg-muted/50 border-input";
                                            if (selectedOption) {
                                                if (isCorrectAnswer) style = "bg-green-100 border-green-500 text-green-800";
                                                else if (isSelected) style = "bg-red-100 border-red-500 text-red-800";
                                                else style = "opacity-50";
                                            }

                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => handleAnswer(opt.transliteration)}
                                                    disabled={!!selectedOption}
                                                    className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${style}`}
                                                >
                                                    <div>
                                                        {/* If question is Transliteration, show Arabic in options, otherwise show Transliteration */}
                                                        {questionType === 'transliteration' ? (
                                                            <span className="font-kufi text-2xl block text-right w-full">{opt.arabe}</span>
                                                        ) : (
                                                            <>
                                                                <span className="font-bold block">{opt.transliteration}</span>
                                                                {questionType !== 'francais' && <span className="text-xs text-muted-foreground">{opt.francais}</span>}
                                                            </>
                                                        )}
                                                    </div>
                                                    {selectedOption && isCorrectAnswer && <Check className="w-5 h-5 text-green-600" />}
                                                    {selectedOption && isSelected && !isCorrectAnswer && <X className="w-5 h-5 text-red-600" />}
                                                </button>
                                            )
                                        })}
                                    </div>

                                    {isCorrect === false && (
                                        <div className="p-4 bg-red-50 text-red-800 rounded-xl text-center text-sm animate-in fade-in slide-in-from-bottom-2">
                                            Mauvaise réponse ! C&apos;était <strong>{quizQuestion.transliteration}</strong> ({quizQuestion.francais}).
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
