'use client';

import React, { useState, useEffect } from 'react';
import { ALPHABET, Letter } from './data';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Sparkles } from 'lucide-react';
import { playPronunciation } from './audio';
import { saveGenericQuizScore } from '@/actions/quiz-actions';

type QuestionType = {
    id: string;
    question: string;
    relatedContent: string;
    correctAnswer: string;
    options: string[];
    context: 'initial' | 'medial' | 'final' | 'isolate' | 'sound';
};

export default function QuizGame() {
    const [currentQuestion, setCurrentQuestion] = useState<QuestionType | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [streak, setStreak] = useState(0);

    const generateQuestion = (): QuestionType => {
        const letter = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
        // 70% form recognition (initial, medial, final), 30% sound recognition
        const type = Math.random() > 0.3 ? 'form' : 'sound';

        let questionText = '';
        let content = '';
        let context: QuestionType['context'] = 'isolate';

        if (type === 'form') {
            const formType = ['initial', 'medial', 'final'][Math.floor(Math.random() * 3)] as 'initial' | 'medial' | 'final';
            context = formType;
            content = letter.forms[formType];
            questionText = `Quelle est cette lettre (forme ${formType === 'initial' ? 'fixe/début' : formType === 'medial' ? 'médiane' : 'finale'}) ?`;
        } else {
            context = 'sound';
            content = letter.arabic;
            questionText = `Quel est le nom de cette lettre ?`;
        }

        // Generate options (names of letters)
        const correct = letter.name;
        const distractors = ALPHABET
            .filter(l => l.id !== letter.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(l => l.name);

        const options = [...distractors, correct].sort(() => Math.random() - 0.5);

        return {
            id: Math.random().toString(36).substr(2, 9),
            question: questionText,
            relatedContent: content,
            correctAnswer: correct,
            options,
            context
        };
    };

    useEffect(() => {
        setCurrentQuestion(generateQuestion());
    }, []);

    const handleAnswerSelect = (answer: string) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(answer);
        setShowResult(true);
        setTotalQuestions(prev => prev + 1);

        if (answer === currentQuestion?.correctAnswer) {
            setScore(prev => prev + 1);
            setStreak(prev => prev + 1);

            // Audio feedback for correct answer
            const letter = ALPHABET.find(l => l.name === currentQuestion.correctAnswer);
            if (letter) {
                playPronunciation(letter.id);
            }

            // Auto-advance after 1 second
            setTimeout(() => {
                handleNextQuestion();
            }, 1000);

        } else {
            setStreak(0);
        }
    };

    const handleNextQuestion = () => {
        setSelectedAnswer(null);
        setShowResult(false);
        setCurrentQuestion(generateQuestion());
    };

    if (!currentQuestion) return <div className="text-center p-10">Chargement...</div>;


    const handleFinish = async () => {
        if (score > 0) {
            await saveGenericQuizScore('arabic', score);
        }
        // Redirect or show summary
        window.location.href = '/apprendre-arabe';
    };

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div className="flex justify-between items-center text-sm font-medium text-muted-foreground bg-muted/30 p-4 rounded-xl">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    <span>Série: {streak}</span>
                </div>
                <span>Score: {score}/{totalQuestions}</span>
            </div>

            <div className="bg-card border rounded-3xl p-6 space-y-6 shadow-sm">
                <h3 className="text-xl font-bold text-center">{currentQuestion.question}</h3>

                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <div className="text-8xl font-kufi text-primary animate-in zoom-in duration-300">
                        {currentQuestion.relatedContent}
                    </div>
                    {currentQuestion.context !== 'isolate' && currentQuestion.context !== 'sound' && (
                        <span className="text-sm text-muted-foreground">
                            (Forme {currentQuestion.context === 'initial' ? 'du début' : currentQuestion.context === 'medial' ? 'du milieu' : 'de fin'})
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentQuestion.options.map((option, idx) => {
                        const isSelected = selectedAnswer === option;
                        const isCorrect = option === currentQuestion.correctAnswer;
                        const showCorrectness = showResult && (isSelected || isCorrect);

                        let btnStyle = "h-16 text-lg font-medium transition-all hover:scale-[1.02] active:scale-[0.98]";
                        let variant: "outline" | "default" | "destructive" | "secondary" = "outline";

                        if (showResult) {
                            if (isCorrect) {
                                variant = "default";
                                btnStyle += " bg-green-600 hover:bg-green-700 border-green-600 text-white shadow-lg ring-2 ring-green-600 ring-offset-2";
                            } else if (isSelected && !isCorrect) {
                                variant = "destructive";
                            } else {
                                btnStyle += " opacity-50";
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
                                    <span>{option}</span>
                                    {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-white" />}
                                    {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5" />}
                                </div>
                            </Button>
                        );
                    })}
                </div>
            </div>

            <div className="flex gap-4">
                <Button
                    variant="secondary"
                    className="flex-1 rounded-xl"
                    onClick={handleFinish}
                >
                    Terminer et Sauvegarder
                </Button>
                {showResult && selectedAnswer !== currentQuestion.correctAnswer && (
                    <Button size="lg" onClick={handleNextQuestion} className="flex-1 gap-2 rounded-xl shadow-lg hover:shadow-xl transition-all">
                        Question Suivante
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
