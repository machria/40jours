'use client';

import { useState, useEffect } from 'react';
import { Play, RotateCcw, CheckCircle2, XCircle, Trophy } from 'lucide-react';

interface Ayah {
    number: number;
    text: string;
    translation: string;
    phonetic?: string;
    numberInSurah: number;
}

interface MemorizationQuizProps {
    ayahs: Ayah[];
    surahName: string;
    onClose: () => void;
}

export default function MemorizationQuiz({ ayahs, surahName, onClose }: MemorizationQuizProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [options, setOptions] = useState<Ayah[]>([]);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);
    const [showResult, setShowResult] = useState(false);

    // Initial setup
    useEffect(() => {
        generateQuestion(0);
    }, []);

    // Generate options for the current question
    const generateQuestion = (index: number) => {
        // Correct answer is the NEXT ayah.
        // If we are at the last ayah, loop back to the first (index 0).
        const nextIndex = (index + 1) % ayahs.length;
        const correctAnswer = ayahs[nextIndex];

        // Pick 2 distractors
        const potentialDistractors = ayahs.filter(a =>
            a.numberInSurah !== correctAnswer.numberInSurah &&
            a.numberInSurah !== ayahs[index].numberInSurah
        );

        // Deduplicate based on numberInSurah to prevent duplicate keys if data has overlaps
        const uniqueDistractors = Array.from(new Map(potentialDistractors.map(item => [item.numberInSurah, item])).values());

        // Allow at least some options even if surah is tiny
        const distractorsCount = Math.min(2, uniqueDistractors.length);
        const distractors = uniqueDistractors
            .sort(() => Math.random() - 0.5)
            .slice(0, distractorsCount);

        // Shuffle options
        const allOptions = [...distractors, correctAnswer].sort(() => Math.random() - 0.5);

        setOptions(allOptions);
        setSelectedOption(null);
        setIsCorrect(null);
        setShowResult(false);
        setCurrentIndex(index);
    };

    const handleOptionClick = (option: Ayah) => {
        if (selectedOption !== null) return; // Prevent double clicks

        const nextIndex = (currentIndex + 1) % ayahs.length;
        const correct = option.numberInSurah === ayahs[nextIndex].numberInSurah;

        setSelectedOption(option.numberInSurah);
        setIsCorrect(correct);
        setShowResult(true);

        if (correct) {
            setScore(s => s + 10);
            setStreak(s => {
                const newStreak = s + 1;
                if (newStreak > bestStreak) setBestStreak(newStreak);
                return newStreak;
            });
            // Auto advance after correct delay? Or manual? 
            // Manual "Continuer" is better for reading.
        } else {
            setStreak(0);
        }
    };

    const nextQuestion = () => {
        const nextIndex = (currentIndex + 1) % ayahs.length;
        generateQuestion(nextIndex);
    };

    const currentAyah = ayahs[currentIndex];
    const nextIndex = (currentIndex + 1) % ayahs.length;
    const correctAyah = ayahs[nextIndex];

    return (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between border-b bg-background/50">
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground font-semibold">
                    Quitter
                </button>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-muted-foreground">Score</span>
                        <span className="font-bold font-mono">{score}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Trophy className="w-3 h-3 text-yellow-500" /> Série
                        </span>
                        <span className="font-bold font-mono text-primary">{streak}</span>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-2xl flex flex-col items-center gap-8 mt-12 overflow-y-auto max-h-[calc(100vh-100px)] pb-20">

                {/* Current Verse Display */}
                <div className="text-center space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        Verset actuel ({currentAyah.numberInSurah})
                    </span>
                    <h2 className="text-3xl md:text-4xl font-kufi leading-relaxed dir-rtl text-foreground px-4">
                        {currentAyah.text}
                    </h2>
                    {/* Only show translation if needed? Let's show it to help context */}
                    <p className="text-lg text-muted-foreground italic px-8">
                        {currentAyah.phonetic || currentAyah.translation}
                    </p>
                </div>

                {/* Question Divider */}
                <div className="w-full flex items-center gap-4 text-muted-foreground text-sm font-semibold uppercase tracking-widest">
                    <div className="h-px bg-border flex-1"></div>
                    Quel est le verset suivant ?
                    <div className="h-px bg-border flex-1"></div>
                </div>

                {/* Options */}
                <div className="w-full grid gap-3">
                    {options.map((option) => {
                        const isSelected = selectedOption === option.numberInSurah;
                        const isThisCorrect = option.numberInSurah === correctAyah.numberInSurah;

                        let buttonStyle = "bg-card hover:bg-muted/50 border text-left p-4 rounded-xl transition-all relative group h-auto whitespace-normal";

                        if (showResult) {
                            if (isThisCorrect) {
                                buttonStyle = "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-300 pointer-events-none";
                            } else if (isSelected && !isThisCorrect) {
                                buttonStyle = "bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-300 pointer-events-none";
                            } else {
                                buttonStyle = "opacity-50 pointer-events-none border-transparent";
                            }
                        }

                        return (
                            <button
                                key={option.numberInSurah}
                                onClick={() => handleOptionClick(option)}
                                className={buttonStyle}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${showResult && isThisCorrect ? 'bg-green-500 border-green-500 text-white' :
                                        showResult && isSelected && !isThisCorrect ? 'bg-red-500 border-red-500 text-white' :
                                            'bg-background border-muted-foreground/30 text-muted-foreground group-hover:border-primary group-hover:text-primary'
                                        }`}>
                                        {showResult && isThisCorrect ? <CheckCircle2 className="w-5 h-5" /> :
                                            showResult && isSelected && !isThisCorrect ? <XCircle className="w-5 h-5" /> :
                                                <span className="font-mono text-sm font-bold">{String.fromCharCode(65 + options.indexOf(option))}</span>}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        {/* Show Arabic too? Might make it easier if they memorize visuals. Let's show French first as it's harder to guess by length */}
                                        <p className="font-medium text-sm md:text-base leading-snug">
                                            {option.phonetic || option.translation}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Continue Actions */}
                {showResult && (
                    <div className="fixed bottom-8 left-0 right-0 flex justify-center animate-in slide-in-from-bottom-5 duration-300">
                        <button
                            onClick={nextQuestion}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-4 rounded-full font-bold shadow-xl shadow-primary/20 flex items-center gap-2"
                        >
                            Verset Suivant <Play className="w-5 h-5 fill-current" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
