
'use client';

import React, { useMemo } from 'react';

interface TajwidTextProps {
    text: string;
    className?: string;
    style?: React.CSSProperties;
}

import { useSettings } from '@/context/SettingsContext';

export function TajwidText({ text, className = "", style }: TajwidTextProps) {
    const { tajwidEnabled } = useSettings();

    const segments = useMemo(() => {
        if (!text) return [];

        if (!tajwidEnabled) {
            return [{ text, type: 'normal' }];
        }

        // 15 lettres d'Ikhfa (prononciation cachée)
        const ikhfaLetters = 'تثجدذزسشصضطظفقك';
        const ikhfaGroup = `[${ikhfaLetters}]`;

        // Séquence de saut entre les mots : espaces + marques qurâniques (U+06D6–U+06ED)
        // Ex : نْ ۚ ب → le ۚ ne doit pas bloquer la détection de l'Iqlab
        const skip = `[\\s\\u06D6-\\u06ED]*`;

        // ─────────────────────────────────────────────────────────────────
        // Règles Tajwid Hafs — ordre important (plus spécifique d'abord)
        //
        // Groupe  1 : Madd Fort    — lettre + maddah (U+0653) OU آ (U+0622 précomposé)
        // Groupe  2 : Ghunna       — Noon/Mim mushaddada (lettre + shadda U+0651)
        // Groupe  3 : Iqlab        — Noon sakina ou Tanwin avant Ba (ب)
        // Groupe  4 : Idgham bi gh — Noon sakina ou Tanwin avant ي ن م و
        // Groupe  5 : Ikhfa        — Noon sakina ou Tanwin avant 15 lettres
        // Groupe  6 : Qalqalah     — ق ط ب ج د + sukun (U+0652)
        // Groupe  7 : Hamzatul Wasl— ٱ (U+0671)
        // Groupe  8 : Lam Shamsiya — ل avant lettre mushaddada
        // Groupe  9 : Voyelles sil.— Alif/Waw/Ya + zéro circulaire/rectangulaire
        // Groupe 10 : Alef Dagger  — ٰ (U+0670)
        // Groupe 11 : Madd Alif    — alif précédé d'une fatha
        // Groupe 12 : Madd Waw     — waw précédé d'une damma
        // Groupe 13 : Madd Ya      — ya précédé d'une kasra
        // ─────────────────────────────────────────────────────────────────
        const regex = new RegExp(
            `([\\u0600-\\u06FF]\\u0653|\\u0622)|` +                          // 1. Madd Fort
            `([نم]\\u0651)|` +                                                // 2. Ghunna
            `(\\u0646\\u0652(?=${skip}ب)|[\\u064B-\\u064D](?=${skip}ب))|` +  // 3. Iqlab
            `(\\u0646\\u0652(?=${skip}[ينمو])|[\\u064B-\\u064D](?=${skip}[ينمو]))|` + // 4. Idgham bi gh.
            `(\\u0646\\u0652(?=${skip}${ikhfaGroup})|[\\u064B-\\u064D](?=${skip}${ikhfaGroup}))|` + // 5. Ikhfa
            `([قطبجد]\\u0652)|` +                                             // 6. Qalqalah
            `(\\u0671)|` +                                                    // 7. Hamzatul Wasl
            `(\\u0644(?=[\\u0600-\\u06FF]\\u0651))|` +                       // 8. Lam Shamsiya
            `([\\u0627\\u0648\\u064A][\\u06DF\\u06E0])|` +                   // 9. Voyelles silencieuses
            `(\\u0670)|` +                                                    // 10. Alef Dagger
            `((?<=[\\u0600-\\u06FF]\\u064E)\\u0627)|` +                      // 11. Madd Alif
            `((?<=[\\u0600-\\u06FF]\\u064F)\\u0648(?![\\u064B-\\u065F]))|`+  // 12. Madd Waw
            `((?<=[\\u0600-\\u06FF]\\u0650)\\u064A(?![\\u064B-\\u065F]))`,   // 13. Madd Ya
            'g'
        );

        const parts: { text: string; type: string }[] = [];
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                parts.push({ text: text.substring(lastIndex, match.index), type: 'normal' });
            }

            let type = 'normal';
            if      (match[1])                               type = 'madd-strong';
            else if (match[2])                               type = 'ghunna';
            else if (match[3])                               type = 'iqlab';
            else if (match[4])                               type = 'idgham-ghunna';
            else if (match[5])                               type = 'ikhfa';
            else if (match[6])                               type = 'qalqala';
            else if (match[7] || match[8] || match[9])       type = 'silent';
            else if (match[10] || match[11] || match[12] || match[13]) type = 'madd-natural';

            parts.push({ text: match[0], type });
            lastIndex = regex.lastIndex;
        }

        if (lastIndex < text.length) {
            parts.push({ text: text.substring(lastIndex), type: 'normal' });
        }

        return parts;
    }, [text, tajwidEnabled]);

    // Regroupe les segments en mots pour éviter de casser les ligatures arabes
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
                currentWord.push(seg);
            } else {
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
        <span
            className={`${className} optimize-legibility`}
            style={{ ...style, overflowWrap: 'break-word', wordBreak: 'normal', textRendering: 'optimizeLegibility' }}
            dir="rtl"
        >
            {words.map((group, i) => {
                if (group.isSpace) {
                    return <span key={i}>{group.text}</span>;
                }
                return (
                    <span key={i} style={{ whiteSpace: 'nowrap' }} dir="rtl">
                        {group.segments.map((seg, j) => {
                            // ZWJ entre segments pour forcer la connexion des ligatures (iOS 12+)
                            const segText = seg.text + (j < group.segments.length - 1 ? '\u200D' : '');

                            switch (seg.type) {
                                case 'madd-strong':
                                    return <span key={j} className="tajwid-red">{segText}</span>;
                                case 'ghunna':
                                case 'iqlab':
                                case 'idgham-ghunna':
                                case 'ikhfa':
                                    return <span key={j} className="tajwid-green">{segText}</span>;
                                case 'qalqala':
                                    return <span key={j} className="tajwid-blue">{segText}</span>;
                                case 'madd-natural':
                                    return <span key={j} className="tajwid-orange">{segText}</span>;
                                case 'silent':
                                    return <span key={j} className="tajwid-gray">{segText}</span>;
                                default:
                                    return <span key={j}>{segText}</span>;
                            }
                        })}
                    </span>
                );
            })}
        </span>
    );
}
