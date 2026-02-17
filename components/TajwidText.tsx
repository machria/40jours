
'use client';

import React, { useMemo } from 'react';

interface TajwidTextProps {
    text: string;
    className?: string;
    style?: React.CSSProperties;
}

export function TajwidText({ text, className = "", style }: TajwidTextProps) {
    const segments = useMemo(() => {
        if (!text) return [];

        // Regex Groups:
        // 1. Red (Madd Strong): Letter + Maddah (\u0653)
        // 2. Green (Ghunnah): Nun/Mim + Shadda (\u0651)
        // 3. Green (Ikhfa): Nun (Sakina) followed by Ikhfa letters [تثجدذزسشصضطظفقك]
        // 4. Green (Ikhfa Tanween): Tanween followed by Ikhfa letters
        // 5. Blue (Qalqalah): [قطبجد] + Sukun (\u0652)
        // 6. Gray (Hamzatul Wasl): \u0671
        // 7. Gray (Sun Lam): Lam (\u0644) followed by (Letter + Shadda \u0651)
        // 8. Gray (Silent Vowels): Alif/Waw/Ya with Oval Zero (\u06df) or Rect Zero (\u06e0)
        // 9. Orange (Dagger Alif): \u0670
        // 10. Orange (Natural Alif): Alif (\u0627) preceded by Fatha (\u064E) - Relaxed
        // 11. Orange (Natural Waw): Waw (\u0648) preceded by Damma (\u064F)
        // 12. Orange (Natural Ya): Ya (\u064A) preceded by Kasra (\u0650)

        const ikhfaLetters = 'تثجدذزسشصضطظفقك'; // 15 Letters
        const ikhfaClassGroup = `[${ikhfaLetters}]`;

        const regex = new RegExp(
            `([\\u0600-\\u06FF]\\u0653)|` + // 1. Madd Strong
            `([نم]\\u0651)|` + // 2. Ghunnah (Shadda)
            `(\\u0646\\u0652?(?=\\s*${ikhfaClassGroup}))|` + // 3. Ikhfa (Nun)
            `([\\u064B-\\u064D](?=\\s*${ikhfaClassGroup}))|` + // 4. Ikhfa (Tanween)
            `([قطبجد]\\u0652)|` + // 5. Qalqalah
            `(\\u0671)|` + // 6. Hamzatul Wasl
            `(\\u0644(?=[\\u0600-\\u06FF]\\u0651))|` + // 7. Sun Lam
            `([\\u0627\\u0648\\u064A][\\u06DF\\u06E0])|` + // 8. Silent Vowels (Zero marks)
            `(\\u0670)|` + // 9. Dagger Alif
            `((?<=[\\u0600-\\u06FF]\\u064E)\\u0627)|` + // 10. Natural Alif (Simple: Preceded by Fatha)
            `((?<=[\\u0600-\\u06FF]\\u064F)\\u0648(?![\\u064B-\\u065F]))|` + // 11. Natural Waw
            `((?<=[\\u0600-\\u06FF]\\u0650)\\u064A(?![\\u064B-\\u065F]))`, // 12. Natural Ya
            'g'
        );

        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(text)) !== null) {
            // Add text before match
            if (match.index > lastIndex) {
                parts.push({
                    text: text.substring(lastIndex, match.index),
                    type: 'normal'
                });
            }

            // Identify match type
            let type = 'normal';
            if (match[1]) type = 'madd-strong'; // Red
            else if (match[2]) type = 'ghunna'; // Green
            else if (match[3] || match[4]) type = 'ikhfa'; // Green (Ikhfa)
            else if (match[5]) type = 'qalqala'; // Blue
            else if (match[6] || match[7] || match[8]) type = 'silent'; // Gray
            else if (match[9] || match[10] || match[11] || match[12]) type = 'madd-natural'; // Orange

            // For matching characters that were lookaheads/lookbehinds (not captured in group 0 sometimes?)
            // Regex exec match[0] is the full match.
            // For Ikhfa, we captured the Nun/Tanween. The lookahead part is NOT consumed. This is correct.

            parts.push({
                text: match[0],
                type: type
            });

            lastIndex = regex.lastIndex;
        }

        // Add remaining text
        if (lastIndex < text.length) {
            parts.push({
                text: text.substring(lastIndex),
                type: 'normal'
            });
        }

        return parts;
    }, [text]);

    // Group segments into words to prevent breaking inside a word (fixes ligature issues)
    const words = useMemo(() => {
        type WordGroup = { isSpace: true; text: string } | { isSpace: false; segments: typeof segments };
        const groups: WordGroup[] = [];
        let currentWord: typeof segments = [];

        const commitWord = () => {
            if (currentWord.length > 0) {
                groups.push({ isSpace: false, segments: currentWord });
                currentWord = [];
            }
        };

        segments.forEach(seg => {
            if (seg.type !== 'normal') {
                // Colored segments are parts of a word
                currentWord.push(seg);
            } else {
                // Normal segments might contain spaces
                // Split by whitespace but keep delimiters
                const parts = seg.text.split(/(\s+)/);
                parts.forEach(part => {
                    if (!part) return;
                    if (/\s+/.test(part)) {
                        commitWord();
                        groups.push({ isSpace: true, text: part });
                    } else {
                        currentWord.push({ text: part, type: 'normal' });
                    }
                });
            }
        });
        commitWord();
        return groups;
    }, [segments]);

    return (
        <span className={className} style={{ ...style, overflowWrap: 'break-word', wordBreak: 'keep-all' }}>
            {words.map((group, i) => {
                if (group.isSpace) {
                    return <span key={i}>{group.text}</span>;
                }
                return (
                    <span key={i} style={{ whiteSpace: 'nowrap', display: 'inline-block' }}>
                        {group.segments.map((seg, j) => {
                            switch (seg.type) {
                                case 'qalqala':
                                    return <span key={j} className="tajwid-blue">{seg.text}</span>;
                                case 'ghunna':
                                case 'ikhfa':
                                    return <span key={j} className="tajwid-green">{seg.text}</span>;
                                case 'madd-strong':
                                    return <span key={j} className="tajwid-red">{seg.text}</span>;
                                case 'madd-natural':
                                    return <span key={j} className="tajwid-orange">{seg.text}</span>;
                                case 'silent':
                                    return <span key={j} className="tajwid-gray">{seg.text}</span>;
                                default:
                                    return <span key={j}>{seg.text}</span>;
                            }
                        })}
                    </span>
                );
            })}
        </span>
    );
}
