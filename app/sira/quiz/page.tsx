'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trophy, X, Check, BookOpen } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import { saveGenericQuizScore } from '@/actions/quiz-actions';

type Question = {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
    category: string;
};

export default function SiraQuizPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadQuestions() {
            try {
                const res = await fetch('/data/sira-quiz.json');
                const data = await res.json();
                // Mélanger les questions
                const shuffled = data.sort(() => Math.random() - 0.5);
                setQuestions(shuffled);
                setLoading(false);
            } catch (error) {
                console.error('Error loading questions:', error);
                setLoading(false);
            }
        }
        loadQuestions();

        // Charger le meilleur score
        const saved = localStorage.getItem('sira-quiz-high-score');
        if (saved) setHighScore(parseInt(saved));
    }, []);

    const handleAnswer = async (answerIndex: number) => {
        if (selectedAnswer !== null) return;

        setSelectedAnswer(answerIndex);
        const isCorrect = answerIndex === questions[currentQuestion].correct;

        if (isCorrect) {
            setScore(score + 1);
            setShowExplanation(true);
        } else {
            // Mort subite - fin du jeu
            setShowExplanation(true);

            // Sauvegarder le score immédiatement sans attendre le timeout visuel
            if (score > highScore) {
                setHighScore(score);
                localStorage.setItem('sira-quiz-high-score', score.toString());
            }

            console.log('Saving score (GameOver)...', score);
            try {
                const result = await saveGenericQuizScore('sira', score);
                console.log('Score saved result:', result);
            } catch (err) {
                console.error('Error saving score:', err);
            }

            setTimeout(() => {
                setGameOver(true);
            }, 3000);
        }
    };

    const nextQuestion = async () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        } else {
            // Fin du quiz - toutes les questions répondues correctement !
            const finalScore = score + 1;
            setGameOver(true);
            if (finalScore > highScore) {
                setHighScore(finalScore);
                localStorage.setItem('sira-quiz-high-score', finalScore.toString());
            }
            console.log('Saving score (Win)...', finalScore);
            try {
                const result = await saveGenericQuizScore('sira', finalScore);
                console.log('Score saved result:', result);
            } catch (err) {
                console.error('Error saving score:', err);
            }
        }
    };

    const restartQuiz = () => {
        const shuffled = [...questions].sort(() => Math.random() - 0.5);
        setQuestions(shuffled);
        setCurrentQuestion(0);
        setScore(0);
        setGameOver(false);
        setSelectedAnswer(null);
        setShowExplanation(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background pb-20 md:pl-64">
                <Navigation />
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted-foreground animate-pulse">Chargement du quiz...</p>
                </div>
            </div>
        );
    }

    if (gameOver) {
        const isPerfect = score === questions.length;
        return (
            <div className="min-h-screen bg-background pb-20 md:pl-64">
                <Navigation />

                <div className="p-4 max-w-2xl mx-auto">
                    <Link href="/sira" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
                        <ArrowLeft className="w-4 h-4" />
                        Retour à la Sira
                    </Link>

                    <div className="bg-card border rounded-xl p-8 text-center">
                        <Trophy className="w-16 h-16 text-primary mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">
                            {isPerfect ? '🎉 Parfait !' : 'Quiz Terminé !'}
                        </h2>
                        <p className="text-4xl font-bold text-primary mb-4">{score}</p>
                        <p className="text-muted-foreground mb-6">
                            {isPerfect
                                ? `Félicitations ! Vous avez répondu correctement à toutes les ${questions.length} questions !`
                                : `Vous avez répondu correctement à ${score} question${score > 1 ? 's' : ''} consécutive${score > 1 ? 's' : ''}.`
                            }
                        </p>

                        <div className="bg-muted/50 rounded-lg p-4 mb-6">
                            <p className="text-sm text-muted-foreground mb-1">Meilleur Score</p>
                            <p className="text-2xl font-bold text-primary">{highScore}</p>
                        </div>

                        <button
                            onClick={restartQuiz}
                            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                        >
                            Recommencer
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const question = questions[currentQuestion];

    return (
        <div className="min-h-screen bg-background pb-20 md:pl-64">
            <Navigation />

            {/* Header */}
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b p-4">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <Link href="/sira" className="text-primary hover:underline flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Sira
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="text-sm">
                            <span className="text-muted-foreground">Score: </span>
                            <span className="font-bold text-primary">{score}</span>
                        </div>
                        <div className="text-sm">
                            <span className="text-muted-foreground">Meilleur: </span>
                            <span className="font-bold text-primary">{highScore}</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="p-4 max-w-2xl mx-auto">
                {/* Progress */}
                <div className="mb-6">
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                        <span>Question {currentQuestion + 1}/{questions.length}</span>
                        <span className="capitalize">{question.category}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                        <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Question */}
                <div className="bg-card border rounded-xl p-6 mb-6">
                    <h2 className="text-xl font-bold mb-6">{question.question}</h2>

                    {/* Options */}
                    <div className="space-y-3">
                        {question.options.map((option, index) => {
                            const isSelected = selectedAnswer === index;
                            const isCorrect = index === question.correct;
                            const showResult = selectedAnswer !== null;

                            let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-all ";

                            if (!showResult) {
                                buttonClass += "border-border hover:border-primary hover:bg-primary/5";
                            } else if (isCorrect) {
                                buttonClass += "border-green-500 bg-green-500/10";
                            } else if (isSelected && !isCorrect) {
                                buttonClass += "border-red-500 bg-red-500/10";
                            } else {
                                buttonClass += "border-border opacity-50";
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(index)}
                                    disabled={selectedAnswer !== null}
                                    className={buttonClass}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{option}</span>
                                        {showResult && isCorrect && <Check className="w-5 h-5 text-green-500" />}
                                        {showResult && isSelected && !isCorrect && <X className="w-5 h-5 text-red-500" />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Explanation */}
                {showExplanation && (
                    <div className={`border rounded-xl p-6 mb-6 ${selectedAnswer === question.correct
                        ? 'bg-green-500/10 border-green-500'
                        : 'bg-red-500/10 border-red-500'
                        }`}>
                        <div className="flex items-start gap-3">
                            <BookOpen className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold mb-2">
                                    {selectedAnswer === question.correct ? '✅ Correct !' : '❌ Incorrect'}
                                </p>
                                <p className="text-sm leading-relaxed">{question.explanation}</p>
                            </div>
                        </div>

                        {selectedAnswer === question.correct && (
                            <button
                                onClick={nextQuestion}
                                className="w-full mt-4 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                            >
                                {currentQuestion < questions.length - 1 ? 'Question Suivante' : 'Terminer'}
                            </button>
                        )}
                    </div>
                )}

                {/* Info */}
                <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground">
                    <p className="font-semibold mb-1">⚠️ Mode Mort Subite</p>
                    <p>Une seule erreur et le quiz se termine. Testez votre connaissance de la Sira du Prophète ﷺ !</p>
                </div>
            </main>
        </div>
    );
}
