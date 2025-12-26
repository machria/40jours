
'use client';

import React, { useMemo } from 'react';

interface TajwidTextProps {
    text: string;
    className?: string;
}

export function TajwidText({ text, className = "" }: TajwidTextProps) {
    const segments = useMemo(() => {
        if (!text) return [];

        // Regex Explanation:
        // Group 1 (Blue/Qalqala): [قطبجد] followed by Sukun (0652)
        // Group 2 (Green/Ghunna): [نم] followed by Shadda (0651)
        // Group 3 (Red/Prolongation): Alif/Waw/Ya or Maddah (0653)
        // Note: Simple heuristic. Real Tajwid is context-dependent.

        const regex = /([قطبجد]\u0652)|([نم]\u0651)|([اوي\u0653])/g;

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
            if (match[1]) type = 'qalqala'; // Blue
            else if (match[2]) type = 'ghunna'; // Green
            else if (match[3]) type = 'madd'; // Red

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

    return (
        <span className={className}>
            {segments.map((seg, i) => {
                switch (seg.type) {
                    case 'qalqala':
                        return <span key={i} className="tajwid-blue">{seg.text}</span>;
                    case 'ghunna':
                        return <span key={i} className="tajwid-green">{seg.text}</span>;
                    case 'madd':
                        return <span key={i} className="tajwid-red">{seg.text}</span>;
                    default:
                        return <span key={i}>{seg.text}</span>;
                }
            })}
        </span>
    );
}
