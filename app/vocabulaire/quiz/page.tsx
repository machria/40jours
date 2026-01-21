'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, Brain, Trophy, AlertTriangle, RefreshCcw, Home, Loader2, Sparkles, HeartCrack, Eye, EyeOff } from 'lucide-react';
import { VOCABULARY_DATA, VocabularyWord } from '@/data/vocabulary';
import { saveQuizScore, getBestScore } from './actions';
import { useSession } from 'next-auth/react';
import confetti from 'canvas-confetti';

type QuestionType = 'AR_TO_FR' | 'FR_TO_AR';

interface Question {
    word: VocabularyWord;
    type: QuestionType;
    options: VocabularyWord[]; // Contains the correct answer + 3 distractors
    correctAnswer: VocabularyWord;
}

// Flatten words for easy access
const allWords = VOCABULARY_DATA.flatMap((cat) => cat.words);

const generateQuestion = (): Question => {
    // 1. Pick random word
    const randIdx = Math.floor(Math.random() * allWords.length);
    const word = allWords[randIdx];

    // 2. Pick random type
    const types: QuestionType[] = ['AR_TO_FR', 'FR_TO_AR'];
    const type = types[Math.floor(Math.random() * types.length)];

    // 3. Generate distractors
    const distractors: VocabularyWord[] = [];
    while (distractors.length < 3) {
        const dIdx = Math.floor(Math.random() * allWords.length);
        const randomWord = allWords[dIdx];
        // Prevent picking same word or duplicate distractors
        if (randomWord.arabic !== word.arabic && !distractors.find(w => w.arabic === randomWord.arabic)) {
            distractors.push(randomWord);
        }
    }

    // 4. Shuffle options
    const options = [...distractors, word].sort(() => Math.random() - 0.5);

    return {
        word,
        type,
        options,
        correctAnswer: word
    };
};

export default function QuizPage() {
    const { data: session } = useSession();

    const [isPlaying, setIsPlaying] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showTransliteration, setShowTransliteration] = useState(true);

    // Load best score on mount
    useEffect(() => {
        async function loadScore() {
            if (session?.user) {
                const res = await getBestScore();
                if (res.success) setBestScore(res.score);
            } else {
                const local = localStorage.getItem('vocab_best_score');
                if (local) setBestScore(parseInt(local));
            }
            setLoading(false);
        }
        loadScore();
    }, [session]);



    const startGame = () => {
        setScore(0);
        setGameOver(false);
        setIsPlaying(true);
        setNextQuestion();
    };

    const setNextQuestion = () => {
        setSelectedOption(null);
        setIsCorrect(null);
        setCurrentQuestion(generateQuestion());
    };

    const handleAnswer = async (option: VocabularyWord, index: number) => {
        if (selectedOption !== null || !currentQuestion) return; // Prevent double click

        setSelectedOption(index);
        const correct = option.arabic === currentQuestion.correctAnswer.arabic;
        setIsCorrect(correct);

        if (correct) {
            // Correct!
            if (score + 1 > 0 && (score + 1) % 5 === 0) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
            setTimeout(() => {
                setScore(s => s + 1);
                setNextQuestion();
            }, 1000);
        } else {
            // Game Over
            setTimeout(() => {
                handleGameOver(score);
            }, 1500);
        }
    };

    const handleGameOver = async (finalScore: number) => {
        setGameOver(true);
        setIsPlaying(false);

        // Update Best Score Logic
        let newBest = bestScore;
        if (finalScore > bestScore) {
            newBest = finalScore;
            setBestScore(newBest);
            // Confetti for new high score
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#FFD700', '#FFA500']
            });
        }

        // Persist
        if (session?.user) {
            await saveQuizScore(finalScore);
        } else {
            localStorage.setItem('vocab_best_score', newBest.toString());
        }
    };

    const renderQuestionText = (q: Question) => {
        switch (q.type) {
            case 'AR_TO_FR':
                return (
                    <div className="flex flex-col items-center gap-2">
                        <span className="font-kufi text-4xl">{q.word.arabic}</span>
                        {showTransliteration && <span className="text-muted-foreground text-lg">{q.word.trans}</span>}
                    </div>
                );
            case 'FR_TO_AR':
                return <span className="font-semibold text-2xl">{q.word.fr}</span>;
        }
    };

    const renderOptionText = (option: VocabularyWord, type: QuestionType) => {
        switch (type) {
            case 'AR_TO_FR':
                return <span className="text-lg">{option.fr}</span>;
            case 'FR_TO_AR':
                return (
                    <div className="flex flex-col items-center">
                        <span className="font-kufi text-xl">{option.arabic}</span>
                        {showTransliteration && <span className="text-xs text-muted-foreground">{option.trans}</span>}
                    </div>
                );
        }
    }

    const getQuestionInstruction = (type: QuestionType) => {
        switch (type) {
            case 'AR_TO_FR': return "Que veut dire ce mot ?";
            case 'FR_TO_AR': return "Quel est ce mot en Arabe ?";
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center p-4">
            {/* Header */}
            <header className="w-full max-w-md flex items-center justify-between py-4 mb-6">
                <Link href="/vocabulaire" className="p-2 hover:bg-muted rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowTransliteration(!showTransliteration)}
                        className="p-2 hover:bg-muted rounded-full transition-colors relative group"
                        title={showTransliteration ? "Masquer la phonétique" : "Afficher la phonétique"}
                    >
                        {showTransliteration ? (
                            <Eye className="w-5 h-5 text-primary" />
                        ) : (
                            <EyeOff className="w-5 h-5 text-muted-foreground" />
                        )}
                    </button>
                    <div className="flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full">
                        <Trophy className="w-4 h-4 text-accent" />
                        <span className="font-bold text-accent">{bestScore}</span>
                    </div>
                </div>
            </header>

            {/* Main Game Area */}
            <main className="w-full max-w-md flex-1 flex flex-col">
                {!isPlaying && !gameOver && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-8 text-center animate-in fade-in zoom-in duration-300">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                            <Brain className="w-24 h-24 text-primary relative z-10" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold font-kufi">Quiz Vocabulaire</h1>
                            <p className="text-muted-foreground">Mode "Mort Subite" : Une erreur et c'est fini !</p>
                        </div>

                        <button
                            onClick={startGame}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xl font-bold py-4 rounded-2xl shadow-lg shadow-primary/25 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Sparkles className="w-5 h-5" />
                            Commencer
                        </button>
                    </div>
                )}

                {isPlaying && currentQuestion && (
                    <div className="flex-1 flex flex-col space-y-8 animate-in slide-in-from-right duration-300">
                        {/* Score & Progress */}
                        <div className="text-center space-y-1">
                            <span className="text-4xl font-black text-primary">{score}</span>
                            <span className="text-xs uppercase tracking-widest text-muted-foreground block">Score Actuel</span>
                        </div>

                        {/* Card */}
                        <div className="bg-card border rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center min-h-[200px] space-y-6 relative overflow-hidden">
                            <span className="absolute top-4 left-0 right-0 text-center text-xs text-muted-foreground uppercase tracking-wider">
                                {getQuestionInstruction(currentQuestion.type)}
                            </span>
                            <div className="text-center">
                                {renderQuestionText(currentQuestion)}
                                {/* Hint for context if needed */}
                                {(currentQuestion.type === 'AR_TO_FR') && (
                                    <p className="mt-2 text-xs text-muted-foreground opacity-50">mot fréquent</p>
                                )}
                            </div>
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 gap-3">
                            {currentQuestion.options.map((option, idx) => {
                                let btnClass = "bg-card border hover:border-primary/50 p-4 rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center text-center min-h-[70px]";

                                // Reveal states
                                if (selectedOption !== null) {
                                    if (option.arabic === currentQuestion.correctAnswer.arabic) {
                                        btnClass = "bg-green-500 text-white border-green-600 shadow-md scale-[1.02]";
                                    } else if (idx === selectedOption) {
                                        btnClass = "bg-red-500 text-white border-red-600 shadow-md opacity-50";
                                    } else {
                                        btnClass = "bg-muted opacity-50 cursor-not-allowed";
                                    }
                                }

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(option, idx)}
                                        disabled={selectedOption !== null}
                                        className={btnClass}
                                    >
                                        {renderOptionText(option, currentQuestion.type)}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}

                {gameOver && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-8 text-center animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-500 mb-4">
                            <HeartCrack className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold">Dommage !</h2>
                            <p className="text-muted-foreground">Vous avez atteint un score de</p>
                            <div className="text-6xl font-black text-primary py-4">{score}</div>
                        </div>

                        {!session?.user && score > 0 && (
                            <div className="bg-muted/50 p-4 rounded-xl text-sm text-balance">
                                <AlertTriangle className="w-4 h-4 inline mr-1 text-amber-500" />
                                Connectez-vous pour sauvegarder votre score dans le classement !
                            </div>
                        )}

                        <div className="flex flex-col gap-3 w-full">
                            <button
                                onClick={startGame}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold py-3 rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <RefreshCcw className="w-5 h-5" />
                                Rejouer
                            </button>
                            <Link
                                href="/vocabulaire"
                                className="w-full bg-card hover:bg-muted text-foreground border text-lg font-bold py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Home className="w-5 h-5" />
                                Retour au vocabulaire
                            </Link>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
