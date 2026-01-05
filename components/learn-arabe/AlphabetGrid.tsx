
import React from 'react';
import { ALPHABET, Letter } from './data';

export default function AlphabetGrid() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {ALPHABET.map((letter) => (
                <LetterCard key={letter.id} letter={letter} />
            ))}
        </div>
    );
}

import { playPronunciation } from './audio';

function LetterCard({ letter }: { letter: Letter }) {
    const playAudio = (e: React.MouseEvent) => {
        e.stopPropagation();
        playPronunciation(letter.id);
    };

    return (
        <div
            onClick={playAudio}
            className="bg-card border rounded-xl p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow cursor-pointer group hover:bg-muted/10 relative"
        >
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
            </div>
            <div className="text-4xl font-kufi mb-2 text-primary group-hover:scale-110 transition-transform">
                {letter.arabic}
            </div>
            <div className="font-bold text-foreground mb-1">{letter.name}</div>
            <div className="text-xs text-muted-foreground italic px-2 mb-3">
                {letter.description}
            </div>

            {/* Forms display */}
            <div className="grid grid-cols-3 gap-2 w-full pt-3 border-t text-sm font-kufi opacity-60 group-hover:opacity-100 transition-opacity">
                <div className="flex flex-col items-center">
                    <span className="text-xs text-muted-foreground font-sans scale-75">Fin</span>
                    <span>{letter.forms.final}</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-xs text-muted-foreground font-sans scale-75">Milieu</span>
                    <span>{letter.forms.medial}</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-xs text-muted-foreground font-sans scale-75">Début</span>
                    <span>{letter.forms.initial}</span>
                </div>
            </div>
        </div>
    );
}
