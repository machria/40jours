'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Trophy, AlertCircle, Shield, Sparkles, BookOpen, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/components/layout/Navigation';
import { saveGenericQuizScore } from '@/actions/quiz-actions';
import confetti from 'canvas-confetti';

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

type GameState = 'menu' | 'playing' | 'game-over';
type QuizType = 'sit-to-inv' | 'inv-to-sit';
type GameMode = 'practice' | 'challenge';

interface Option {
    id: number;
    text: string;
    subtext?: string;
    phonetic?: string;
}

interface Question {
    instruction: string;
    content: string;
    correctAnswerId: number;
    options: Option[];
    translation?: string;
    phonetic?: string;
}

interface HisnQuizClientProps {
    initialData: HisnCategory[];
}

export default function HisnQuizClient({ initialData }: HisnQuizClientProps) {
    const [gameState, setGameState] = useState<GameState>('menu');
    const [quizType, setQuizType] = useState<QuizType>('sit-to-inv');
    const [gameMode, setGameMode] = useState<GameMode>('practice');

    const [score, setScore] = useState(0);
    const [questionIndex, setQuestionIndex] = useState(0); // For practice mode (0 to 9)
    const [highScore, setHighScore] = useState(0);

    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    
    // Help Toggles
    const [showFrench, setShowFrench] = useState(true);
    const [showPhonetic, setShowPhonetic] = useState(false);

    // Filter categories with valid Hadiths
    const validCategories = useMemo(() => {
        return initialData.filter(cat => cat.hadiths && cat.hadiths.length > 0);
    }, [initialData]);

    function useMemo<T>(fn: () => T, deps: any[]): T {
        // Standard react memo hook wrapper
        return useCallback(fn, deps)();
    }

    // Load High Score on mount
    useEffect(() => {
        const saved = localStorage.getItem('hisn-quiz-highscore');
        if (saved) setHighScore(parseInt(saved, 10));
    }, []);

    // Generate Question
    const generateQuestion = useCallback(() => {
        if (!validCategories.length) return;

        // 1. Pick a random category
        const randomCatIndex = Math.floor(Math.random() * validCategories.length);
        const targetCategory = validCategories[randomCatIndex];

        // 2. Pick a random hadith from that category
        const randomHadithIndex = Math.floor(Math.random() * targetCategory.hadiths.length);
        const targetHadith = targetCategory.hadiths[randomHadithIndex];

        let question: Question;

        if (quizType === 'sit-to-inv') {
            // Situation ➔ Invocation
            // Distractors: pick 3 hadiths from different categories
            const distractors: Option[] = [];
            const chosenCategoryIds = new Set<number>([targetCategory.id]);

            while (distractors.length < 3 && chosenCategoryIds.size < validCategories.length) {
                const idx = Math.floor(Math.random() * validCategories.length);
                const distCat = validCategories[idx];
                
                if (!chosenCategoryIds.has(distCat.id)) {
                    chosenCategoryIds.add(distCat.id);
                    const randHIdx = Math.floor(Math.random() * distCat.hadiths.length);
                    const distHadith = distCat.hadiths[randHIdx];
                    distractors.push({
                        id: distHadith.id,
                        text: distHadith.arabic,
                        subtext: distHadith.french,
                        phonetic: distHadith.source
                    });
                }
            }

            const correctOption: Option = {
                id: targetHadith.id,
                text: targetHadith.arabic,
                subtext: targetHadith.french,
                phonetic: targetHadith.source
            };

            const options = [correctOption, ...distractors].sort(() => Math.random() - 0.5);

            question = {
                instruction: "Quelle invocation dit-on dans cette situation ?",
                content: targetCategory.title,
                correctAnswerId: targetHadith.id,
                options
            };
        } else {
            // Invocation ➔ Situation
            // Distractors: pick 3 different categories
            const distractors: Option[] = [];
            const chosenCategoryIds = new Set<number>([targetCategory.id]);

            while (distractors.length < 3) {
                const idx = Math.floor(Math.random() * validCategories.length);
                const distCat = validCategories[idx];
                
                if (!chosenCategoryIds.has(distCat.id)) {
                    chosenCategoryIds.add(distCat.id);
                    distractors.push({
                        id: distCat.id,
                        text: distCat.title
                    });
                }
            }

            const correctOption: Option = {
                id: targetCategory.id,
                text: targetCategory.title
            };

            const options = [correctOption, ...distractors].sort(() => Math.random() - 0.5);

            question = {
                instruction: "À quelle situation correspond cette invocation ?",
                content: targetHadith.arabic,
                correctAnswerId: targetCategory.id,
                options,
                translation: targetHadith.french,
                phonetic: targetHadith.source
            };
        }

        setCurrentQuestion(question);
        setSelectedOptionId(null);
        setShowResult(false);
    }, [validCategories, quizType]);

    const startQuiz = () => {
        setScore(0);
        setQuestionIndex(0);
        setGameState('playing');
        generateQuestion();
    };

    const handleOptionSelect = (optionId: number) => {
        if (selectedOptionId !== null) return;
        
        setSelectedOptionId(optionId);
        setShowResult(true);

        const isCorrect = optionId === currentQuestion?.correctAnswerId;

        if (isCorrect) {
            const newScore = score + 1;
            setScore(newScore);

            // If challenge mode: save high score dynamically
            if (gameMode === 'challenge' && newScore > highScore) {
                setHighScore(newScore);
                localStorage.setItem('hisn-quiz-highscore', newScore.toString());
                saveGenericQuizScore('hisn', newScore);
            }

            // Auto-advance after 1.2 seconds
            setTimeout(() => {
                handleNextQuestion();
            }, 1200);
        } else {
            // Wrong answer
            if (gameMode === 'challenge') {
                // Wait and then Game Over
                setTimeout(() => {
                    setGameState('game-over');
                }, 1500);
            }
        }
    };

    const handleNextQuestion = () => {
        if (gameMode === 'practice') {
            const nextIdx = questionIndex + 1;
            if (nextIdx >= 10) {
                // Practice session complete!
                setGameState('game-over');
                if (score === 10) {
                    confetti({
                        particleCount: 150,
                        spread: 80,
                        origin: { y: 0.6 }
                    });
                }
            } else {
                setQuestionIndex(nextIdx);
                generateQuestion();
            }
        } else {
            generateQuestion();
        }
    };

    const handleBackToMenu = () => {
        setGameState('menu');
        setCurrentQuestion(null);
    };

    // -------------------------------------------------------------
    // RENDER: MENU
    // -------------------------------------------------------------
    if (gameState === 'menu') {
        return (
            <div className="container max-w-xl mx-auto py-12 px-4 space-y-8 animate-in fade-in zoom-in duration-300">
                <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary mb-4">
                        <Trophy className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black font-kufi text-foreground tracking-tight">
                        Quiz Hisn al-Muslim
                    </h1>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                        Testez et renforcez votre mémorisation des invocations authentiques de la Citadelle du Musulman.
                    </p>
                </div>

                <div className="bg-card border rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
                    {/* Direction Selection */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            1. Type de Questions
                        </label>
                        <div className="grid grid-cols-1 gap-2.5">
                            <button
                                onClick={() => setQuizType('sit-to-inv')}
                                className={cn(
                                    "p-4 rounded-2xl text-left border transition-all flex flex-col gap-1.5",
                                    quizType === 'sit-to-inv'
                                        ? "border-primary bg-primary/5 text-foreground ring-2 ring-primary/20"
                                        : "border-border hover:bg-muted/50"
                                )}
                            >
                                <span className="font-bold text-sm">🕋 Situation ➔ Invocation</span>
                                <span className="text-xs text-muted-foreground">On vous donne la situation (ex: en s'habillant), trouvez la bonne formule en arabe.</span>
                            </button>
                            <button
                                onClick={() => setQuizType('inv-to-sit')}
                                className={cn(
                                    "p-4 rounded-2xl text-left border transition-all flex flex-col gap-1.5",
                                    quizType === 'inv-to-sit'
                                        ? "border-primary bg-primary/5 text-foreground ring-2 ring-primary/20"
                                        : "border-border hover:bg-muted/50"
                                )}
                            >
                                <span className="font-bold text-sm">🗣️ Invocation ➔ Situation</span>
                                <span className="text-xs text-muted-foreground">On vous donne le texte d'une invocation, trouvez à quel moment la dire.</span>
                            </button>
                        </div>
                    </div>

                    {/* Mode Selection */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            2. Mode de Jeu
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setGameMode('practice')}
                                className={cn(
                                    "p-4 rounded-2xl text-left border transition-all flex flex-col gap-1",
                                    gameMode === 'practice'
                                        ? "border-primary bg-primary/5 text-foreground ring-2 ring-primary/20"
                                        : "border-border hover:bg-muted/50"
                                )}
                            >
                                <span className="font-bold text-sm">💡 Entraînement</span>
                                <span className="text-[10px] text-muted-foreground leading-normal">10 questions pour apprendre sans pression.</span>
                            </button>
                            <button
                                onClick={() => setGameMode('challenge')}
                                className={cn(
                                    "p-4 rounded-2xl text-left border transition-all flex flex-col gap-1",
                                    gameMode === 'challenge'
                                        ? "border-primary bg-primary/5 text-foreground ring-2 ring-primary/20"
                                        : "border-border hover:bg-muted/50"
                                )}
                            >
                                <span className="font-bold text-sm">🔥 Challenge</span>
                                <span className="text-[10px] text-muted-foreground leading-normal">Mort Subite : la moindre erreur élimine !</span>
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={startQuiz}
                        className="w-full py-4 bg-primary text-primary-foreground hover:bg-primary/95 text-lg font-bold rounded-2xl shadow-lg shadow-primary/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <Sparkles className="w-5 h-5" />
                        Commencer le Quiz
                    </button>
                </div>

                <div className="text-center">
                    <Link href="/hisn" className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5">
                        <ArrowLeft className="w-4 h-4" />
                        Retour aux Invocations
                    </Link>
                </div>
            </div>
        );
    }

    // -------------------------------------------------------------
    // RENDER: GAME OVER / COMPLETE
    // -------------------------------------------------------------
    if (gameState === 'game-over') {
        const perfectScore = gameMode === 'practice' && score === 10;
        return (
            <div className="container max-w-md mx-auto py-12 px-4 text-center space-y-8 animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col items-center gap-4">
                    <div className={cn(
                        "p-4 rounded-full mb-2",
                        perfectScore ? "bg-amber-100 text-amber-500" : "bg-destructive/10 text-destructive"
                    )}>
                        {perfectScore ? <Sparkles className="w-12 h-12" /> : <AlertCircle className="w-12 h-12" />}
                    </div>
                    <h1 className="text-3xl font-black font-kufi">
                        {gameMode === 'practice' ? 'Entraînement Terminé !' : 'Partie Terminée !'}
                    </h1>
                    <p className="text-muted-foreground text-base">
                        {gameMode === 'practice'
                            ? "Félicitations pour avoir complété ta session d'apprentissage."
                            : "La mort subite a frappé ! Retente ta chance pour t'améliorer."}
                    </p>
                    <div className="text-5xl font-black text-primary py-4">
                        {score}{gameMode === 'practice' && ' / 10'}
                    </div>
                    {gameMode === 'challenge' && score >= highScore && score > 0 && (
                        <div className="px-4 py-2 bg-yellow-500/10 text-yellow-600 rounded-full font-bold flex items-center gap-2 text-sm border border-yellow-200/50">
                            <Trophy className="w-4 h-4 fill-yellow-500/20" />
                            Nouveau Record Personnel !
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <button
                        onClick={startQuiz}
                        className="w-full py-3.5 px-6 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25 active:scale-[0.98]"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Recommencer
                    </button>
                    <button
                        onClick={handleBackToMenu}
                        className="w-full py-3.5 px-6 bg-card border text-muted-foreground hover:text-foreground font-bold rounded-2xl hover:bg-muted/40 transition-all flex items-center justify-center gap-2"
                    >
                        Choisir un autre mode
                    </button>
                </div>
            </div>
        );
    }

    // -------------------------------------------------------------
    // RENDER: PLAYING
    // -------------------------------------------------------------
    return (
        <div className="container max-w-2xl mx-auto py-6 px-4 flex flex-col min-h-[calc(100vh-4rem)]">
            
            {/* Header section with Stats & Controls */}
            <header className="flex items-center justify-between mb-6 bg-card border rounded-2xl p-4 shadow-sm">
                <button
                    onClick={handleBackToMenu}
                    className="p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-muted/55 rounded-xl transition-all"
                    title="Retour au menu"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3">
                    {/* Help toggles inside Situation -> Invocation (helpful for matching Arabic) */}
                    {quizType === 'sit-to-inv' && (
                        <>
                            <button
                                onClick={() => setShowFrench(!showFrench)}
                                className={cn(
                                    "p-2 rounded-xl border transition-all",
                                    showFrench ? "bg-primary/10 border-primary/20 text-primary" : "text-muted-foreground bg-background"
                                )}
                                title={showFrench ? "Masquer la traduction" : "Afficher la traduction"}
                            >
                                <BookOpen className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setShowPhonetic(!showPhonetic)}
                                className={cn(
                                    "p-2 rounded-xl border transition-all",
                                    showPhonetic ? "bg-accent/20 border-accent/30 text-accent-foreground" : "text-muted-foreground bg-background"
                                )}
                                title={showPhonetic ? "Masquer la phonétique" : "Afficher la phonétique"}
                            >
                                {showPhonetic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                        </>
                    )}

                    <div className="h-6 w-px bg-border hidden sm:block" />

                    <div className="flex items-center gap-3 text-xs font-bold">
                        {gameMode === 'challenge' ? (
                            <>
                                <div className="flex items-center gap-1.5 text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20 px-2.5 py-1.5 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
                                    <Trophy className="w-3.5 h-3.5 fill-yellow-500/10" />
                                    <span>Max: {highScore}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-primary bg-primary/10 px-2.5 py-1.5 rounded-xl border border-primary/20">
                                    <Shield className="w-3.5 h-3.5" />
                                    <span>Score: {score}</span>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-1.5 text-primary bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20">
                                <span>Question {questionIndex + 1} / 10</span>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Practice mode progress bar */}
            {gameMode === 'practice' && (
                <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden mb-6">
                    <div 
                        className="bg-primary h-full transition-all duration-300"
                        style={{ width: `${(questionIndex / 10) * 100}%` }}
                    />
                </div>
            )}

            {/* Question Card */}
            {currentQuestion && (
                <div className="flex-1 flex flex-col">
                    <div className="flex-grow flex flex-col justify-center items-center text-center space-y-6 mb-8">
                        <div className="w-full p-6 md:p-8 bg-card border rounded-3xl shadow-sm space-y-6 relative overflow-hidden">
                            <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold px-3 py-1 bg-muted/60 rounded-full">
                                {currentQuestion.instruction}
                            </span>
                            
                            {/* Question Content */}
                            <div className={cn(
                                "w-full text-center leading-relaxed",
                                quizType === 'inv-to-sit'
                                    ? "text-2xl md:text-3xl font-kufi text-primary font-semibold py-4"
                                    : "text-lg md:text-xl font-bold text-foreground py-6 font-sans"
                            )}>
                                {currentQuestion.content}
                            </div>

                            {/* Additional metadata for Invocation -> Situation */}
                            {quizType === 'inv-to-sit' && (
                                <div className="space-y-3 border-t border-border/40 pt-4 text-sm text-left font-medium">
                                    {currentQuestion.phonetic && (
                                        <p className="text-xs md:text-sm text-muted-foreground italic">
                                            Phonétique : {currentQuestion.phonetic}
                                        </p>
                                    )}
                                    {currentQuestion.translation && (
                                        <p className="text-xs md:text-sm text-muted-foreground">
                                            Traduction : <strong>{currentQuestion.translation}</strong>
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 gap-3.5 pb-8">
                        {currentQuestion.options.map((option) => {
                            const isSelected = selectedOptionId === option.id;
                            const showCorrect = showResult && option.id === currentQuestion.correctAnswerId;
                            const showWrong = showResult && isSelected && option.id !== currentQuestion.correctAnswerId;

                            let btnStyle = "bg-card border hover:border-primary/50 hover:bg-accent/40 text-foreground transition-all duration-200 rounded-2xl p-5 text-left font-medium relative overflow-hidden flex flex-col gap-1.5 w-full";
                            let variant: "outline" | "default" | "destructive" | "secondary" = "outline";

                            if (showResult) {
                                if (showCorrect) {
                                    variant = "default";
                                    btnStyle += " bg-green-600 hover:bg-green-700 border-green-600 text-white shadow-md ring-2 ring-green-600 ring-offset-2";
                                } else if (showWrong) {
                                    variant = "destructive";
                                    btnStyle += " text-white";
                                } else {
                                    btnStyle += " opacity-40 cursor-not-allowed";
                                }
                            } else if (isSelected) {
                                variant = "secondary";
                            }

                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleOptionSelect(option.id)}
                                    disabled={selectedOptionId !== null}
                                    className={btnStyle}
                                >
                                    <span className={cn(
                                        "w-[90%] leading-relaxed",
                                        quizType === 'sit-to-inv' ? 'font-kufi text-lg' : 'text-base font-bold'
                                    )}>
                                        {option.text}
                                    </span>
                                    
                                    {/* Sub-text for Situation -> Invocation */}
                                    {quizType === 'sit-to-inv' && (
                                        <div className="space-y-1">
                                            {showPhonetic && option.phonetic && (
                                                <span className={cn(
                                                    "text-[11px] italic block",
                                                    showCorrect || showWrong ? "text-white/80" : "text-muted-foreground"
                                                )}>
                                                    {option.phonetic}
                                                </span>
                                            )}
                                            {showFrench && option.subtext && (
                                                <span className={cn(
                                                    "text-xs font-semibold block",
                                                    showCorrect || showWrong ? "text-white/95" : "text-muted-foreground"
                                                )}>
                                                    {option.subtext}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Success/Error Icon indicators */}
                                    {showResult && showCorrect && (
                                        <CheckCircle2 className="w-5 h-5 text-white absolute right-4 top-1/2 transform -translate-y-1/2" />
                                    )}
                                    {showResult && showWrong && (
                                        <XCircle className="w-5 h-5 text-white absolute right-4 top-1/2 transform -translate-y-1/2" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Manual progression button for Practice mode wrong answers */}
                    {showResult && selectedOptionId !== currentQuestion.correctAnswerId && gameMode === 'practice' && (
                        <div className="pb-8">
                            <button
                                onClick={handleNextQuestion}
                                className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-md hover:shadow-lg hover:bg-primary/95 transition-all"
                            >
                                Question Suivante
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
