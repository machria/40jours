'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Trophy, AlertCircle, Shield } from 'lucide-react';
import { cn } from '@/components/layout/Navigation';
import { saveGenericQuizScore } from '@/actions/quiz-actions';

type Hadith = {
    id: number;
    arabic: string;
    french: string;
    source: string;
};

type HisnCategory = {
    id: number;
    title: string;
    hadiths: Hadith[];
};

type GameState = 'loading' | 'playing' | 'game-over';

export default function HisnQuizPage() {
    const [data, setData] = useState<HisnCategory[]>([]);
    const [gameState, setGameState] = useState<GameState>('loading');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);

    // Current Question State
    const [currentCategory, setCurrentCategory] = useState<HisnCategory | null>(null);
    const [currentHadith, setCurrentHadith] = useState<Hadith | null>(null);
    const [options, setOptions] = useState<HisnCategory[]>([]);
    const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    // Load High Score
    useEffect(() => {
        const saved = localStorage.getItem('hisn-quiz-highscore');
        if (saved) setHighScore(parseInt(saved));
    }, []);

    // Update High Score
    useEffect(() => {
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('hisn-quiz-highscore', score.toString());
            // Save to DB
            saveGenericQuizScore('hisn', score);
        }
    }, [score, highScore]);

    // Fetch Data
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/hisn/quiz-data');
                if (!res.ok) throw new Error('Failed to load data');
                const jsonData = await res.json();
                setData(jsonData);
                setGameState('playing');
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, []);

    // Initialize first question when data loads
    useEffect(() => {
        if (data.length > 0 && gameState === 'playing' && !currentCategory) {
            generateQuestion();
        }
    }, [data, gameState, currentCategory]);

    const generateQuestion = useCallback(() => {
        if (!data.length) return;

        // 1. Pick random category
        const randomCatIndex = Math.floor(Math.random() * data.length);
        const targetCategory = data[randomCatIndex];

        // 2. Pick random hadith from that category
        if (!targetCategory.hadiths.length) {
            generateQuestion(); // Retry if empty
            return;
        }
        const randomHadithIndex = Math.floor(Math.random() * targetCategory.hadiths.length);
        const targetHadith = targetCategory.hadiths[randomHadithIndex];

        // 3. Pick 3 distractors
        const distractors: HisnCategory[] = [];
        while (distractors.length < 3) {
            const idx = Math.floor(Math.random() * data.length);
            const distractor = data[idx];
            if (distractor.id !== targetCategory.id && !distractors.find(d => d.id === distractor.id)) {
                distractors.push(distractor);
            }
        }

        // 4. Shuffle options
        const allOptions = [targetCategory, ...distractors].sort(() => Math.random() - 0.5);

        setCurrentCategory(targetCategory);
        setCurrentHadith(targetHadith);
        setOptions(allOptions);
        setSelectedOptionId(null);
        setIsCorrect(null);
    }, [data]);

    const handleOptionClick = (optionId: number) => {
        if (selectedOptionId !== null) return; // Prevent double clicks

        setSelectedOptionId(optionId);

        if (optionId === currentCategory?.id) {
            setIsCorrect(true);
            // Increment score immediately
            const newScore = score + 1;
            setScore(newScore);

            // Update high score if needed
            if (newScore > highScore) {
                setHighScore(newScore);
                localStorage.setItem('hisn-quiz-highscore', newScore.toString());
                saveGenericQuizScore('hisn', newScore);
            }

            // Wait a bit then next question
            setTimeout(() => {
                generateQuestion();
            }, 1000);
        } else {
            setIsCorrect(false);
            // Save final score before game over
            if (score > highScore) {
                setHighScore(score);
                localStorage.setItem('hisn-quiz-highscore', score.toString());
                saveGenericQuizScore('hisn', score);
            }
            // Wait a bit then Game Over
            setTimeout(() => {
                setGameState('game-over');
            }, 1500);
        }
    };

    const restartGame = () => {
        setScore(0);
        setGameState('playing');
        generateQuestion();
    };

    if (gameState === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-muted-foreground animate-pulse">Chargement du quiz...</p>
            </div>
        );
    }

    if (gameState === 'game-over') {
        return (
            <div className="container max-w-md mx-auto py-12 px-4 text-center space-y-8 animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-destructive/10 text-destructive mb-2">
                        <AlertCircle className="w-12 h-12" />
                    </div>
                    <h1 className="text-4xl font-bold">Perdu !</h1>
                    <p className="text-muted-foreground text-lg">
                        Ton score final : <span className="font-bold text-foreground">{score}</span>
                    </p>
                    {score >= highScore && score > 0 && (
                        <div className="px-4 py-2 bg-yellow-500/10 text-yellow-600 rounded-full font-medium flex items-center gap-2">
                            <Trophy className="w-4 h-4" />
                            Nouveau Record !
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <button
                        onClick={restartGame}
                        className="w-full py-3 px-6 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Rejouer
                    </button>
                    <Link
                        href="/hisn"
                        className="w-full py-3 px-6 bg-muted text-muted-foreground font-semibold rounded-xl hover:bg-muted/80 transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Quitter
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container max-w-2xl mx-auto py-6 px-4 flex flex-col min-h-[calc(100vh-4rem)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <Link href="/hisn" className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div className="flex items-center gap-4 text-sm font-medium">
                    <div className="flex items-center gap-1.5 text-yellow-600 bg-yellow-500/10 px-3 py-1 rounded-full">
                        <Trophy className="w-4 h-4" />
                        {highScore}
                    </div>
                    <div className="flex items-center gap-1.5 text-primary bg-primary/10 px-3 py-1 rounded-full">
                        <Shield className="w-4 h-4" />
                        Score: {score}
                    </div>
                </div>
            </div>

            {/* Main Game Area */}
            <div className="flex-1 flex flex-col">
                {/* Question Card */}
                <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6 mb-12">
                    <div className="w-full p-8 bg-card border rounded-2xl shadow-sm space-y-6">
                        <p className="text-3xl md:text-4xl leading-relaxed font-arabic text-primary/90" dir="rtl">
                            {currentHadith?.arabic}
                        </p>
                        {currentHadith?.source && (
                            <p className="text-sm md:text-base italic text-muted-foreground">
                                {currentHadith.source}
                            </p>
                        )}
                    </div>
                    <p className="text-muted-foreground font-medium">
                        À quelle catégorie appartient cette invocation ?
                    </p>
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 gap-3 pb-8">
                    {options.map((option) => {
                        const isSelected = selectedOptionId === option.id;
                        const showCorrect = selectedOptionId !== null && option.id === currentCategory?.id;
                        const showWrong = isSelected && option.id !== currentCategory?.id;

                        let variantClass = "bg-card border hover:border-primary/50 hover:bg-accent/50";
                        if (showCorrect) variantClass = "bg-green-500/15 border-green-500 text-green-700 dark:text-green-400";
                        if (showWrong) variantClass = "bg-destructive/15 border-destructive text-destructive";

                        return (
                            <button
                                key={option.id}
                                onClick={() => handleOptionClick(option.id)}
                                disabled={selectedOptionId !== null}
                                className={cn(
                                    "w-full p-4 text-left rounded-xl transition-all duration-200 font-medium text-sm md:text-base relative overflow-hidden",
                                    variantClass,
                                    selectedOptionId === null && "hover:scale-[1.01] active:scale-[0.99]"
                                )}
                            >
                                {option.title}
                                {showCorrect && (
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-green-600 animate-in fade-in slide-in-from-right-2">
                                        ✓
                                    </div>
                                )}
                                {showWrong && (
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-destructive animate-in fade-in slide-in-from-right-2">
                                        ✕
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
