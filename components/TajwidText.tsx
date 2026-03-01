
'use client';

import React, { useMemo } from 'react';

interface TajwidTextProps {
    text: string;
    /** Texte pré-annoté Tajwid Hafs (scholar-verified).
     *  Formats acceptés :
     *    "<tajweed class=ham_wasl>ٱ</tajweed>للَّهِ ..."  (API Quran.com)
     *    "<rule class='ham_wasl'>ٱ</rule>للَّهِ ..."      (dataset GitHub)
     *  Quand fourni et que le tajwid est activé, remplace la détection regex. */
    tajweedText?: string;
    className?: string;
    style?: React.CSSProperties;
}

import { useSettings } from '@/context/SettingsContext';

// ─────────────────────────────────────────────────────────────────────────────
// Mapping classes Tajwid → types internes
// Compatible avec deux sources :
//   • api.quran.com (15 classes, balises <tajweed>)
//   • ascorbic-acid/quran_data sur GitHub (classes étendues, balises <rule>)
// Rivayat Hafs 'an 'Asim (Mushaf Dar al-Ma'rifa / Al-Azhar)
// ─────────────────────────────────────────────────────────────────────────────
const API_CLASS_TO_TYPE: Record<string, string> = {
    // ── MADD ──────────────────────────────────────────────────────────────────
    // مد لازم — 6 harakat (rouge foncé) — حروف مقطعة et similaires
    'madda_necessary':          'madd-6',
    // مد واجب متصل — 4-5 harakat (rouge) — même mot
    'madda_obligatory':         'madd-strong',
    'madda_obligatory_mottasel':'madd-strong',
    // مد جائز منفصل — 2/4/5 harakat (orange) — mot suivant commence par hamza
    'madda_obligatory_monfasel':'madd-natural',
    'madda_permissible':        'madd-natural',
    // مد طبيعي — 2 harakat (orange)
    'madda_normal':             'madd-natural',

    // ── GHUNNA (toutes les règles nasales → vert) ─────────────────────────────
    'ghunnah':           'ghunna',   // غنة (noon/mim mushaddad)
    'idgham_ghunnah':    'ghunna',   // إدغام بغنة
    'idgham_shafawi':    'ghunna',   // إدغام شفوي (mim sur mim)
    'ikhafa':            'ghunna',   // إخفاء حقيقي
    'ikhafa_shafawi':    'ghunna',   // إخفاء شفوي (mim avant ba)
    'iqlab':             'ghunna',   // إقلاب (nun/tanwin avant ba)

    // ── SILENCIEUX / ASSIMILÉS (→ gris) ──────────────────────────────────────
    'ham_wasl':          'silent',   // همزة الوصل
    'laam_shamsiyah':    'silent',   // لام شمسية (assimilée)
    'idgham_wo_ghunnah': 'silent',   // إدغام بلا غنة (l, r)
    'idgham_mutajanisayn':'silent',  // إدغام متجانسين (lettres similaires)
    'idgham_mutaqaribayn':'silent',  // إدغام متقاربين (lettres proches)
    'slnt':              'silent',   // حرف لا يُلفظ (lettre non prononcée)

    // ── QALQALAH (→ bleu) ────────────────────────────────────────────────────
    'qalaqah':           'qalqala',  // قلقلة : ق ط ب ج د avec sukun
};

/** Parse le texte annoté Tajwid en segments typés.
 *  Compatible avec deux formats de balises :
 *    <tajweed class=ham_wasl>ٱ</tajweed>   (API Quran.com)
 *    <rule class='ham_wasl'>ٱ</rule>        (dataset GitHub ascorbic-acid)
 *  Les guillemets autour de la valeur class sont optionnels.
 */
function parseTajweedAnnotations(tajweedText: string): { text: string; type: string }[] {
    const segments: { text: string; type: string }[] = [];
    // Accepte <tajweed ...> et <rule ...> (les deux sources connues)
    const regex = /<(?:tajweed|rule)\s+class=["']?([^"'>\s]+)["']?>([^<]*)<\/(?:tajweed|rule)>|([^<]+)/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(tajweedText)) !== null) {
        if (match[1] !== undefined) {
            const type = API_CLASS_TO_TYPE[match[1]] ?? 'normal';
            if (match[2]) segments.push({ text: match[2], type });
        } else if (match[3]) {
            segments.push({ text: match[3], type: 'normal' });
        }
    }

    return segments;
}

export function TajwidText({ text, tajweedText, className = "", style }: TajwidTextProps) {
    const { tajwidEnabled } = useSettings();

    const segments = useMemo(() => {
        if (!text) return [];

        if (!tajwidEnabled) {
            return [{ text, type: 'normal' }];
        }

        // ── Chemin 1 : données pré-annotées de l'API Quran.com (Hafs, validées) ──
        if (tajweedText) {
            return parseTajweedAnnotations(tajweedText);
        }

        // ── Chemin 2 : détection regex (fallback si données non téléchargées) ──

        // 15 lettres d'Ikhfa (prononciation cachée)
        const ikhfaLetters = 'تثجدذزسشصضطظفقك';
        const ikhfaGroup = `[${ikhfaLetters}]`;

        // Séquence de saut entre les mots : espaces + marques qurâniques (U+06D6–U+06ED)
        const skip = `[\\s\\u06D6-\\u06ED]*`;

        // ─────────────────────────────────────────────────────────────────
        // Règles Tajwid Hafs — ordre important (plus spécifique d'abord)
        //
        // Groupe  1 : Madd Fort    — lettre + maddah (U+0653) OU آ (U+0622 précomposé)
        // Groupe  2 : Ghunna       — Noon/Mim mushaddada
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
        let m;

        while ((m = regex.exec(text)) !== null) {
            if (m.index > lastIndex) {
                parts.push({ text: text.substring(lastIndex, m.index), type: 'normal' });
            }

            let type = 'normal';
            if      (m[1])                               type = 'madd-strong';
            else if (m[2])                               type = 'ghunna';
            else if (m[3])                               type = 'iqlab';
            else if (m[4])                               type = 'idgham-ghunna';
            else if (m[5])                               type = 'ikhfa';
            else if (m[6])                               type = 'qalqala';
            else if (m[7] || m[8] || m[9])               type = 'silent';
            else if (m[10] || m[11] || m[12] || m[13])  type = 'madd-natural';

            parts.push({ text: m[0], type });
            lastIndex = regex.lastIndex;
        }

        if (lastIndex < text.length) {
            parts.push({ text: text.substring(lastIndex), type: 'normal' });
        }

        return parts;
    }, [text, tajweedText, tajwidEnabled]);

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
                                // ── Madd (données API : 3 niveaux distincts) ──
                                case 'madd-6':
                                    // مد لازم — 6 harakat (rouge foncé)
                                    return <span key={j} className="tajwid-red-dark">{segText}</span>;
                                case 'madd-strong':
                                    // مد واجب متصل — 4-5 harakat (rouge)
                                    return <span key={j} className="tajwid-red">{segText}</span>;
                                case 'madd-natural':
                                    // مد طبيعي / مد جائز — 2 harakat (orange)
                                    return <span key={j} className="tajwid-orange">{segText}</span>;
                                // ── Ghunna (toutes les règles nasales) ──
                                case 'ghunna':
                                case 'iqlab':
                                case 'idgham-ghunna':
                                case 'ikhfa':
                                    return <span key={j} className="tajwid-green">{segText}</span>;
                                // ── Qalqalah ──
                                case 'qalqala':
                                    return <span key={j} className="tajwid-blue">{segText}</span>;
                                // ── Lettres silencieuses / assimilées ──
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
