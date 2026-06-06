'use client';

import React, { useState, useEffect } from 'react';
import { VOCABULARY_DATA, VocabularyWord } from '@/data/vocabulary';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Sparkles, Eye, EyeOff, ArrowRightLeft, BookOpen, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSession } from 'next-auth/react';
import { saveHighScore, getHighScore } from '@/app/actions/quiz';

type QuizMode = 'mixed' | 'ar_to_trans' | 'trans_to_ar';

interface WordQuestion {
    id: string;
    word: VocabularyWord;
    type: 'AR_TO_TRANS' | 'TRANS_TO_AR';
    questionText: string;
    content: string;
    correctAnswer: string;
    options: string[];
}

// Flatten all words from VOCABULARY_DATA
const allWords = VOCABULARY_DATA.flatMap(category => category.words);

export default function WordQuizGame() {
    const { data: session } = useSession();
    const [mode, setMode] = useState<QuizMode>('mixed');
    const [showFrenchHint, setShowFrenchHint] = useState<boolean>(false);
    const [currentQuestion, setCurrentQuestion] = useState<WordQuestion | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [score, setScore] = useState<number>(0);
    const [totalQuestions, setTotalQuestions] = useState<number>(0);
    const [streak, setStreak] = useState<number>(0);
    const [bestScore, setBestScore] = useState<number>(0);
    const [showResult, setShowResult] = useState<boolean>(false);

    // Load best score on mount or when session changes
    useEffect(() => {
        async function loadBestScore() {
            if (session?.user) {
                const res = await getHighScore('arabic_word');
                if (res && typeof res.highScore === 'number') {
                    setBestScore(res.highScore);
                    return;
                }
            }
            const stored = localStorage.getItem('arabe_word_quiz_best_score');
            if (stored) {
                setBestScore(parseInt(stored, 10));
            }
        }
        loadBestScore();
    }, [session]);

    // Generate a new question based on the selected mode
    const generateQuestion = (currentMode: QuizMode): WordQuestion => {
        if (allWords.length < 4) {
            // Fallback in case of empty vocabulary
            return {
                id: 'fallback',
                word: { arabic: 'وَ', trans: 'Wa', fr: 'Et' },
                type: 'AR_TO_TRANS',
                questionText: 'Quelle est la translittération de ce mot ?',
                content: 'وَ',
                correctAnswer: 'Wa',
                options: ['Wa', 'Fa', 'Ya', 'Ta']
            };
        }

        // 1. Pick a random word
        const wordIdx = Math.floor(Math.random() * allWords.length);
        const targetWord = allWords[wordIdx];

        // 2. Determine question type
        let questionType: 'AR_TO_TRANS' | 'TRANS_TO_AR';
        if (currentMode === 'ar_to_trans') {
            questionType = 'AR_TO_TRANS';
        } else if (currentMode === 'trans_to_ar') {
            questionType = 'TRANS_TO_AR';
        } else {
            questionType = Math.random() > 0.5 ? 'AR_TO_TRANS' : 'TRANS_TO_AR';
        }

        // 3. Generate distractors
        const distractors: string[] = [];
        const targetValue = questionType === 'AR_TO_TRANS' ? targetWord.trans : targetWord.arabic;

        while (distractors.length < 3) {
            const randomIdx = Math.floor(Math.random() * allWords.length);
            const candidateWord = allWords[randomIdx];
            
            // Check for uniqueness of Arabic representation and transliteration
            if (candidateWord.arabic !== targetWord.arabic) {
                const distractorVal = questionType === 'AR_TO_TRANS' ? candidateWord.trans : candidateWord.arabic;
                if (!distractors.includes(distractorVal) && distractorVal !== targetValue) {
                    distractors.push(distractorVal);
                }
            }
        }

        // 4. Set question properties
        const questionText = questionType === 'AR_TO_TRANS'
            ? 'Quelle est la translittération de ce mot ?'
            : 'Quel mot arabe correspond à cette translitération ?';
        
        const content = questionType === 'AR_TO_TRANS' ? targetWord.arabic : targetWord.trans;
        const correctAnswer = targetValue;
        const options = [...distractors, correctAnswer].sort(() => Math.random() - 0.5);

        return {
            id: Math.random().toString(36).substring(2, 9),
            word: targetWord,
            type: questionType,
            questionText,
            content,
            correctAnswer,
            options
        };
    };

    // Initialize the first question
    useEffect(() => {
        handleReset();
    }, [mode]);

    const handleAnswerSelect = (answer: string) => {
        if (selectedAnswer !== null) return;
        
        setSelectedAnswer(answer);
        setShowResult(true);
        setTotalQuestions(prev => prev + 1);

        const isCorrect = answer === currentQuestion?.correctAnswer;

        if (isCorrect) {
            setScore(prev => prev + 1);
            const newStreak = streak + 1;
            setStreak(newStreak);

            // Update high score
            if (newStreak > bestScore) {
                setBestScore(newStreak);
                localStorage.setItem('arabe_word_quiz_best_score', newStreak.toString());
                
                if (session?.user) {
                    saveHighScore('arabic_word', newStreak);
                }
                
                // Trigger a nice confetti effect on achieving multiples of 5 on highscore
                if (newStreak % 5 === 0) {
                    confetti({
                        particleCount: 80,
                        spread: 60,
                        origin: { y: 0.7 }
                    });
                }
            }

            // Auto-advance on correct answer
            setTimeout(() => {
                handleNextQuestion();
            }, 1200);
        } else {
            setStreak(0);
        }
    };

    const handleNextQuestion = () => {
        setSelectedAnswer(null);
        setShowResult(false);
        setCurrentQuestion(generateQuestion(mode));
    };

    const handleReset = () => {
        setSelectedAnswer(null);
        setShowResult(false);
        setScore(0);
        setTotalQuestions(0);
        setStreak(0);
        setCurrentQuestion(generateQuestion(mode));
    };

    if (!currentQuestion) {
        return (
            <div className="flex justify-center items-center p-12">
                <span className="text-muted-foreground animate-pulse">Chargement du quiz...</span>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto space-y-6">
            
            {/* Header controls (Mode selector, hints, stats) */}
            <div className="flex flex-col gap-4 bg-card border rounded-3xl p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                    <div className="flex items-center gap-2">
                        <ArrowRightLeft className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-muted-foreground">Mode de jeu:</span>
                    </div>
                    <div className="flex bg-muted/60 p-1 rounded-xl gap-1 text-xs">
                        <button
                            onClick={() => setMode('mixed')}
                            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                                mode === 'mixed'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            Mixte
                        </button>
                        <button
                            onClick={() => setMode('ar_to_trans')}
                            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                                mode === 'ar_to_trans'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            Arabe ➔ Trans
                        </button>
                        <button
                            onClick={() => setMode('trans_to_ar')}
                            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                                mode === 'trans_to_ar'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            Trans ➔ Arabe
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setShowFrenchHint(!showFrenchHint)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                            showFrenchHint
                                ? 'bg-primary/10 border-primary/20 text-primary'
                                : 'bg-background border-border text-muted-foreground hover:text-foreground'
                        }`}
                        title={showFrenchHint ? "Masquer la traduction française" : "Afficher la traduction française"}
                    >
                        {showFrenchHint ? (
                            <>
                                <Eye className="w-4 h-4" />
                                <span>Traduction Active</span>
                            </>
                        ) : (
                            <>
                                <EyeOff className="w-4 h-4" />
                                <span>Afficher la Traduction</span>
                            </>
                        )}
                    </button>

                    <div className="flex items-center gap-4 text-sm font-medium">
                        <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-2.5 py-1 rounded-lg border border-amber-100 dark:border-amber-900/30">
                            <Trophy className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                            <span>Max: {bestScore}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20 px-2.5 py-1 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                            <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-500/20" />
                            <span>Série: {streak}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Score tracker */}
            <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground px-4">
                <span>Progression : {totalQuestions} question{totalQuestions > 1 ? 's' : ''} répondue{totalQuestions > 1 ? 's' : ''}</span>
                <span>Taux de réussite : {totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}% ({score}/{totalQuestions})</span>
            </div>

            {/* Main Game Card */}
            <div className="bg-card border rounded-3xl p-8 space-y-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-4 left-0 right-0 text-center">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold px-3 py-1 bg-muted/50 rounded-full">
                        {currentQuestion.questionText}
                    </span>
                </div>

                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                    {/* Word display */}
                    <div className={`text-center transition-all ${
                        currentQuestion.type === 'AR_TO_TRANS'
                            ? 'text-7xl font-kufi text-primary font-bold'
                            : 'text-4xl font-semibold tracking-wide text-foreground'
                    } animate-in zoom-in duration-300`}>
                        {currentQuestion.content}
                    </div>

                    {/* Optional Translation Hint */}
                    {showFrenchHint && (
                        <div className="text-sm text-muted-foreground flex items-center gap-1 bg-muted/40 px-3 py-1.5 rounded-xl border animate-in fade-in duration-300">
                            <BookOpen className="w-3.5 h-3.5 text-primary" />
                            <span>Indice : <strong>{currentQuestion.word.fr}</strong></span>
                        </div>
                    )}
                </div>

                {/* Options grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {currentQuestion.options.map((option, idx) => {
                        const isSelected = selectedAnswer === option;
                        const isCorrect = option === currentQuestion.correctAnswer;
                        const showCorrectness = showResult && (isSelected || isCorrect);

                        let btnStyle = "h-16 text-lg font-medium transition-all hover:scale-[1.02] active:scale-[0.98] rounded-xl";
                        let variant: "outline" | "default" | "destructive" | "secondary" = "outline";

                        if (showResult) {
                            if (isCorrect) {
                                variant = "default";
                                btnStyle += " bg-green-600 hover:bg-green-700 border-green-600 text-white shadow-lg ring-2 ring-green-600 ring-offset-2";
                            } else if (isSelected && !isCorrect) {
                                variant = "destructive";
                            } else {
                                btnStyle += " opacity-40";
                            }
                        } else if (isSelected) {
                            variant = "secondary";
                        }

                        return (
                            <Button
                                key={idx}
                                variant={variant as any}
                                className={btnStyle}
                                onClick={() => handleAnswerSelect(option)}
                                disabled={showResult}
                            >
                                <div className="flex items-center justify-center w-full gap-3">
                                    <span className={currentQuestion.type === 'TRANS_TO_AR' ? 'font-kufi text-xl' : 'text-base font-semibold'}>
                                        {option}
                                    </span>
                                    {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-white" />}
                                    {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5" />}
                                </div>
                            </Button>
                        );
                    })}
                </div>
            </div>

            {/* Next question and restart buttons */}
            <div className="flex gap-4">
                <Button
                    variant="outline"
                    className="flex-1 rounded-xl font-semibold border-border hover:bg-muted"
                    onClick={handleReset}
                >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Réinitialiser
                </Button>
                
                {showResult && selectedAnswer !== currentQuestion.correctAnswer && (
                    <Button 
                        size="lg" 
                        onClick={handleNextQuestion} 
                        className="flex-1 gap-2 rounded-xl shadow-md hover:shadow-lg bg-primary hover:bg-primary/90 transition-all font-semibold"
                    >
                        Question Suivante
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
