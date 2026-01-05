
'use client';

import React, { useState } from 'react';
import { ALPHABET, Letter } from './data';
import { ChevronRight, ChevronLeft, RefreshCw, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FlashcardGame() {
    const [cards, setCards] = useState<Letter[]>([...ALPHABET]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const currentCard = cards[currentIndex];

    const handleNext = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % cards.length);
        }, 200);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
        }, 200);
    };

    const shuffleCards = () => {
        setIsFlipped(false);
        setCards([...ALPHABET].sort(() => Math.random() - 0.5));
        setCurrentIndex(0);
    };

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div className="flex flex-col items-center space-y-6 max-w-md mx-auto">
            <div
                className="relative w-full aspect-[4/3] perspective-1000 cursor-pointer"
                onClick={handleFlip}
            >
                <div
                    className={`w-full h-full relative transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                >
                    {/* Front */}
                    <div className="absolute w-full h-full bg-card border-2 border-primary/20 rounded-3xl shadow-xl flex flex-col items-center justify-center backface-hidden">
                        <span className="text-xs absolute top-4 left-4 text-muted-foreground">Appuyez pour retourner</span>
                        <div className="text-9xl font-kufi text-primary">{currentCard.arabic}</div>
                    </div>

                    {/* Back */}
                    <div className="absolute w-full h-full bg-primary text-primary-foreground rounded-3xl shadow-xl flex flex-col items-center justify-center transform rotate-y-180 backface-hidden p-6 text-center">
                        <h2 className="text-4xl font-bold mb-2">{currentCard.name}</h2>
                        <p className="text-lg opacity-90">{currentCard.transliteration}</p>
                        <p className="mt-2 text-sm opacity-80">{currentCard.description}</p>

                        <div className="grid grid-cols-3 gap-2 w-full mt-6 pt-4 border-t border-primary-foreground/20 text-sm font-kufi">
                            <div className="flex flex-col items-center">
                                <span className="text-xs opacity-70 mb-1 scale-75">Fin</span>
                                <span className="text-2xl">{currentCard.forms.final}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-xs opacity-70 mb-1 scale-75">Milieu</span>
                                <span className="text-2xl">{currentCard.forms.medial}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-xs opacity-70 mb-1 scale-75">Début</span>
                                <span className="text-2xl">{currentCard.forms.initial}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 w-full justify-center">
                <Button variant="outline" size="icon" onClick={handlePrev}>
                    <ChevronLeft className="w-5 h-5" />
                </Button>
                <div className="text-sm font-medium">
                    {currentIndex + 1} / {cards.length}
                </div>
                <Button variant="outline" size="icon" onClick={handleNext}>
                    <ChevronRight className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={shuffleCards} title="Mélanger">
                    <RotateCcw className="w-5 h-5" />
                </Button>
            </div>
            <style jsx global>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
        </div>
    );
}
