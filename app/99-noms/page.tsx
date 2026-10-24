'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, HelpCircle, Trophy, ChevronRight, RefreshCw, Check, X, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { namesOfAllah, AllahName } from '@/data/names';
import { saveGenericQuizScore } from '@/actions/quiz-actions';
import NameVerse from '@/components/names/NameVerse';
import PhoneticGuide from '@/components/PhoneticGuide';
import NamesIntro from '@/components/names/NamesIntro';

const nameByNumber = new Map(namesOfAllah.map((n, i) => [n.Number, { name: n, index: i }]));

const generateQuizRound = (names: AllahName[]) => {
    const randomIndex = Math.floor(Math.random() * names.length);
    const question = names[randomIndex];

    // Randomize question type
    const types: ('arabe' | 'transliteration' | 'francais')[] = ['arabe', 'transliteration', 'francais'];
    const type = types[Math.floor(Math.random() * types.length)];

    // 3 distracteurs. Pour une question en français, on écarte les noms proches
    // (ex. Al-Ghafur / Al-Ghaffar) : les deux réponses seraient défendables.
    const excluded = new Set([question.Number, ...(type === 'francais' ? question.confusableWith ?? [] : [])]);
    const neighbors = names.filter(n => !excluded.has(n.Number)).sort(() => 0.5 - Math.random()).slice(0, 3);
    const options = [question, ...neighbors].sort(() => 0.5 - Math.random());

    return { question, type, options };
};

export default function NamesPage() {
    const [mode, setMode] = useState<'learn' | 'quiz' | 'list'>('list');
    const [index, setIndex] = useState(0);

    // Quiz State
    const [quizQuestion, setQuizQuestion] = useState<AllahName | null>(null);
    const [questionType, setQuestionType] = useState<'arabe' | 'transliteration' | 'francais'>('arabe');
    const [options, setOptions] = useState<AllahName[]>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);

    const startQuiz = () => {
        setMode('quiz');
        setScore(0);
        nextQuestion();
    };

    const nextQuestion = () => {
        const { question, type, options } = generateQuizRound(namesOfAllah);
        setQuizQuestion(question);
        setQuestionType(type);
        setOptions(options);

        setSelectedOption(null);
        setIsCorrect(null);
    };


    const handleAnswer = async (answer: string) => {
        if (selectedOption) return; // Prevent double guess
        setSelectedOption(answer);
        const correct = answer === quizQuestion?.transliteration;
        setIsCorrect(correct);

        if (correct) {
            const newScore = score + 1;
            setScore(newScore);
            if (newScore > highScore) {
                setHighScore(newScore);
                // Save to DB using generic action
                await saveGenericQuizScore('names99', newScore);
            }
        } else {
            setScore(0);
        }

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
            <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur z-10 border-b">
                <div className="flex items-center gap-2">
                    <Link href="/" className="p-2 hover:bg-muted rounded-full">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-xl font-bold font-kufi text-primary">Les 99 Noms</h1>
                </div>
                <div className="flex gap-1 bg-muted/50 p-1 rounded-full">
                    <button
                        onClick={() => setMode('learn')}
                        className={`p-2 rounded-full transition-all ${mode === 'learn' ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                        title="Mode Cartes"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setMode('list')}
                        className={`p-2 rounded-full transition-all ${mode === 'list' ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                        title="Mode Liste"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list"><line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" /><line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" /></svg>
                    </button>
                    <button
                        onClick={() => setMode('quiz')}
                        className={`p-2 rounded-full transition-all ${mode === 'quiz' ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                        title="Mode Quiz"
                    >
                        <Trophy className="w-4 h-4" />
                    </button>
                    <Link
                        href="/99-noms/feed"
                        className="p-2 rounded-full text-muted-foreground hover:text-foreground transition-all"
                        title="Mode Immersif"
                    >
                        <Layers className="w-4 h-4" />
                    </Link>
                </div>
            </header>

            <main className={`flex-1 flex flex-col items-center justify-start py-8 px-4 w-full ${mode === 'list' ? 'max-w-4xl' : 'max-w-lg'} mx-auto space-y-6 overflow-y-auto`}>
                <div className="text-center space-y-4 bg-emerald-50/50 dark:bg-emerald-900/10 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 w-full">
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

                <PhoneticGuide />

                <AnimatePresence mode="wait">
                    {mode === 'learn' && (
                        <motion.div
                            key="learn"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full space-y-4"
                        >
                            <div className="relative flex items-center justify-center">
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
                            </div>

                            <div className="px-4 space-y-4">
                                <NameVerse verset={namesOfAllah[index].verset} />

                                {namesOfAllah[index].distinction && (
                                    <div className="rounded-xl border border-amber-200 dark:border-amber-800/40 bg-amber-50/60 dark:bg-amber-900/10 p-4 space-y-3 text-left">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                                            Ne pas confondre
                                        </p>
                                        <p className="text-sm leading-relaxed text-foreground/90">{namesOfAllah[index].distinction}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {namesOfAllah[index].confusableWith?.map(num => {
                                                const target = nameByNumber.get(num);
                                                if (!target) return null;
                                                return (
                                                    <button
                                                        key={num}
                                                        onClick={() => setIndex(target.index)}
                                                        className="text-xs px-3 py-1.5 rounded-full border bg-background hover:border-primary hover:text-primary transition-colors"
                                                    >
                                                        <span className="font-kufi mr-1">{target.name.arabe}</span>
                                                        {target.name.transliteration} · {target.name.francais}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {mode === 'list' && (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full space-y-6"
                        >
                            <NamesIntro onStartCards={() => setMode('learn')} onStartQuiz={() => setMode('quiz')} />

                            <div className="space-y-3">
                                <div className="text-xs text-muted-foreground px-1 space-y-1">
                                    <p>Touchez un nom pour voir son verset et ses nuances.</p>
                                    <p>
                                        <span className="text-amber-600 dark:text-amber-400 font-bold">*</span> Nom tiré du hadith d&apos;at-Tirmidhī, qui ne figure pas tel quel dans le Coran : le verset associé contient sa racine ou en illustre le sens.
                                    </p>
                                </div>
                                <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-medium">
                                                <tr>
                                                    <th className="px-2 sm:px-4 py-3 text-center w-12">#</th>
                                                    <th className="px-2 sm:px-4 py-3 font-kufi text-right">Arabe</th>
                                                    <th className="px-2 sm:px-4 py-3">Translittération</th>
                                                    <th className="px-2 sm:px-4 py-3">Français</th>
                                                    <th className="px-2 sm:px-4 py-3 hidden md:table-cell">Signification</th>
                                                    <th className="px-2 sm:px-4 py-3 hidden sm:table-cell">Verset</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {namesOfAllah.map((name, i) => (
                                                    <tr
                                                        key={name.Number}
                                                        onClick={() => { setIndex(i); setMode('learn'); }}
                                                        title="Voir le verset et les nuances"
                                                        className="hover:bg-muted/30 transition-colors cursor-pointer"
                                                    >
                                                        <td className="px-2 sm:px-4 py-3 text-center text-muted-foreground font-mono text-xs">{name.Number}</td>
                                                        <td className="px-2 sm:px-4 py-3 font-kufi text-lg sm:text-xl text-primary text-right">{name.arabe}</td>
                                                        <td className="px-2 sm:px-4 py-3 font-bold">
                                                            {name.transliteration}
                                                            {name.verset.source !== 'nom' && (
                                                                <sup className="ml-0.5 text-amber-600 dark:text-amber-400" title="Nom tiré du hadith d'at-Tirmidhī, ne figurant pas tel quel dans le Coran">*</sup>
                                                            )}
                                                        </td>
                                                        <td className="px-2 sm:px-4 py-3">{name.francais}</td>
                                                        <td className="px-2 sm:px-4 py-3 text-muted-foreground italic hidden md:table-cell">{name.signification}</td>
                                                        <td className="px-2 sm:px-4 py-3 text-xs text-muted-foreground font-mono whitespace-nowrap hidden sm:table-cell">
                                                            {name.verset.sourate}:{name.verset.ayah}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {mode === 'quiz' && (
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
                                        <div className="flex gap-4">
                                            <span>Score: <span className="text-primary">{score}</span></span>
                                            <span className="text-muted-foreground">Meilleur: {highScore}</span>
                                        </div>
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
                                            {options.some(o => o.transliteration === selectedOption && quizQuestion.confusableWith?.includes(o.Number)) && (
                                                <p className="mt-2 text-xs text-red-900/80 text-left">{quizQuestion.distinction}</p>
                                            )}
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
