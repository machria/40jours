'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Play, Square, Volume2, Info } from 'lucide-react';
import { getAyahAudioUrl } from '@/lib/audioUrls';

// ─── Lecteur audio partagé ────────────────────────────────────────────────────
// Un seul audio joue à la fois — géré au niveau de la page
// ─────────────────────────────────────────────────────────────────────────────
export default function TajwidPage() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [playingId, setPlayingId] = useState<string | null>(null);

    function play(id: string, surah: number, ayah: number) {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.onended = null;
        }
        if (playingId === id) {
            setPlayingId(null);
            return;
        }
        const audio = new Audio(getAyahAudioUrl(surah, ayah));
        audio.onended = () => setPlayingId(null);
        audio.play().catch(() => setPlayingId(null));
        audioRef.current = audio;
        setPlayingId(id);
    }

    const isPlaying = (id: string) => playingId === id;

    // Bouton play réutilisable
    function PlayBtn({ id, surah, ayah }: { id: string; surah: number; ayah: number }) {
        const active = isPlaying(id);
        return (
            <button
                onClick={() => play(id, surah, ayah)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    active
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-muted hover:bg-muted/80 text-foreground border border-border'
                }`}
            >
                {active ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <Volume2 className="w-3.5 h-3.5 opacity-60" />
                {active ? 'Stop' : 'Écouter'}
            </button>
        );
    }

    // Carte de règle réutilisable
    function RuleCard({
        id, ruleFr, ruleAr, badge, badgeColor, explanation, tip, verseNode, reference, surah, ayah
    }: {
        id: string; ruleFr: string; ruleAr: string; badge: string; badgeColor: string;
        explanation: string; tip?: string;
        verseNode: React.ReactNode; reference: string;
        surah: number; ayah: number;
    }) {
        return (
            <div className="p-5 bg-card border rounded-2xl shadow-sm space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                        <h4 className="font-bold text-base">{ruleFr}</h4>
                        <span className="text-sm text-muted-foreground font-kufi">{ruleAr}</span>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColor}`}>
                        {badge}
                    </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">{explanation}</p>

                {tip && (
                    <div className="flex gap-2 p-3 bg-muted/50 rounded-xl">
                        <Info className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                        <p className="text-xs text-muted-foreground">{tip}</p>
                    </div>
                )}

                <div
                    className="p-4 bg-muted/30 rounded-xl text-center leading-[2.6]"
                    dir="rtl"
                    style={{ fontFamily: 'var(--font-kufi)', fontSize: '1.5rem' }}
                >
                    {verseNode}
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground italic">{reference}</span>
                    <PlayBtn id={id} surah={surah} ayah={ayah} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
                <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-3">
                    <Link href="/" className="p-2 hover:bg-muted rounded-full transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="font-bold text-base leading-tight">Guide Tajwid Hafs</h1>
                        <p className="text-xs text-muted-foreground">Pour débutants — 6 couleurs expliquées</p>
                    </div>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 pt-8 space-y-10">

                {/* ── Palette ─────────────────────────────────────────────── */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight text-center">Le Coran en couleurs</h2>
                    <p className="text-center text-muted-foreground text-sm max-w-md mx-auto">
                        Chaque couleur indique une règle de prononciation précise selon la rivayat <strong>Hafs ʿan ʿĀṣim</strong>.
                    </p>
                    <div className="grid grid-cols-3 gap-2 mt-4">
                        {[
                            { bg: 'bg-red-900/15', text: 'text-red-900 dark:text-red-300', label: 'Madd Lazim', sub: '6 temps', dot: 'bg-red-900 dark:bg-red-400' },
                            { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', label: 'Madd Wajib', sub: '4-5 temps', dot: 'bg-red-600 dark:bg-red-400' },
                            { bg: 'bg-orange-100 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400', label: 'Madd Naturel', sub: '2 temps', dot: 'bg-orange-500' },
                            { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', label: 'Ghunna', sub: 'Nasal', dot: 'bg-green-600 dark:bg-green-400' },
                            { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', label: 'Qalqalah', sub: 'Rebond', dot: 'bg-blue-600 dark:bg-blue-400' },
                            { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-500 dark:text-gray-400', label: 'Silencieux', sub: 'Fondu', dot: 'bg-gray-400' },
                        ].map(c => (
                            <div key={c.label} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl ${c.bg}`}>
                                <div className={`w-4 h-4 rounded-full ${c.dot}`} />
                                <span className={`text-xs font-bold text-center ${c.text}`}>{c.label}</span>
                                <span className="text-[10px] text-muted-foreground">{c.sub}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════
                    1. VERT — GHUNNA (Nasalisation)
                ═══════════════════════════════════════════════════════════ */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center shrink-0">
                            <div className="w-3.5 h-3.5 rounded-full bg-green-600 dark:bg-green-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-green-700 dark:text-green-400">Vert — Nasalisation <span className="font-kufi font-normal">(غنة)</span></h3>
                            <p className="text-xs text-muted-foreground">Le son passe par le nez — tenez-le 2 temps</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <RuleCard
                            id="ghunnah"
                            ruleFr="Ghunnah — Mim ou Noun avec Shadda"
                            ruleAr="غنة — نّ أو مّ"
                            badge="2 temps · Nasal"
                            badgeColor="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                            explanation="Quand Nun ou Mim porte une Shadda (ّ), vous produisez un son nasal de 2 temps, comme si vous fredonniez par le nez."
                            tip="Bouchez vos narines : si votre voix vibre, c'est bon ! C'est le test de la ghunna."
                            verseNode={<>قُلۡ أَعُوذُ بِرَبِّ <span className="tajwid-green">ٱلنَّ</span>اسِ</>}
                            reference="Sourate An-Nās (114:1) — le Nun avec Shadda"
                            surah={114} ayah={1}
                        />

                        <RuleCard
                            id="ikhfa"
                            ruleFr="Ikhfa — Noun Sakina devant 15 lettres"
                            ruleAr="إخفاء حقيقي"
                            badge="2 temps · Caché"
                            badgeColor="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                            explanation='Le Noun sakina (نۡ) ou le Tanwin disparaît à moitié devant les 15 lettres d'ikhfā. On entend un son nasal "flottant" entre n et la lettre suivante.'
                            tip="Lettres déclenchantes : ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك"
                            verseNode={<>مِ<span className="tajwid-green">نۡ شَ</span>رِّ مَا خَلَقَ</>}
                            reference="Sourate Al-Falaq (113:2) — nūn avant shīn"
                            surah={113} ayah={2}
                        />

                        <RuleCard
                            id="iqlab"
                            ruleFr="Iqlab — Noun/Tanwin devant Bā"
                            ruleAr="إقلاب"
                            badge="2 temps · Transformé"
                            badgeColor="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                            explanation="Devant Ba (ب), le Noun se transforme en Mim nasal avec les lèvres légèrement fermées. Aucune nasalisation audible si vous n'avez pas failli fermer les lèvres."
                            tip="Souvenez-vous : N → M devant B, avec vibration nasale."
                            verseNode={<>وَمِ<span className="tajwid-green">نۢ بَ</span>عۡدُ</>}
                            reference="Sourate Ar-Rūm (30:4) — nūn avant bā"
                            surah={30} ayah={4}
                        />

                        <RuleCard
                            id="idgham-ghunna"
                            ruleFr="Idghām bi Ghunna — Noun/Tanwin devant ي ن م و"
                            ruleAr="إدغام بغنة"
                            badge="2 temps · Fondu nasal"
                            badgeColor="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                            explanation="Le Noun sakina fond complètement dans la lettre suivante (ي ن م و), tout en gardant un son nasal de 2 temps. La lettre résultante est doublée."
                            tip="On ne prononce plus le Noun du tout — c'est la lettre suivante qui prend le son nasal."
                            verseNode={<>فَمَ<span className="tajwid-green">نۡ يَّ</span>عۡمَلۡ مِثۡقَالَ</>}
                            reference="Sourate Az-Zalzala (99:7) — nūn avant yā"
                            surah={99} ayah={7}
                        />
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════
                    2. BLEU — QALQALAH (Rebond)
                ═══════════════════════════════════════════════════════════ */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                            <div className="w-3.5 h-3.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400">Bleu — Qalqalah <span className="font-kufi font-normal">(قلقلة)</span></h3>
                            <p className="text-xs text-muted-foreground">Un rebond sur les 5 lettres ق ط ب ج د avec sukun</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <RuleCard
                            id="qalqala-sughra"
                            ruleFr="Qalqalah Sughrā — Rebond léger (milieu du mot)"
                            ruleAr="قلقلة صغرى"
                            badge="Rebond léger"
                            badgeColor="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                            explanation='Une des 5 lettres (ق ط ب ج د) avec un sukun (°) en plein milieu d'un mot produit un petit rebond ou "écho". Imaginez que la lettre "ricoche" légèrement.'
                            tip="Mnémotechnique : قُطُبٌ جَدٌّ — ces 5 mots contiennent les 5 lettres de qalqalah."
                            verseNode={<>فَأَثَرۡنَ بِهِۦ نَ<span className="tajwid-blue">قۡ</span>عًا</>}
                            reference="Sourate Al-ʿĀdiyāt (100:4) — qāf avec sukun"
                            surah={100} ayah={4}
                        />

                        <RuleCard
                            id="qalqala-kubra"
                            ruleFr="Qalqalah Kubrā — Rebond fort (fin de souffle)"
                            ruleAr="قلقلة كبرى"
                            badge="Rebond fort"
                            badgeColor="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                            explanation="Quand la lettre de qalqalah est en fin de verset et qu'on s'arrête (waqf), le rebond est bien plus prononcé. C'est la marque distinctive de la récitation Hafs."
                            tip="N'arrêtez pas brusquement — laissez la lettre résonner avec ce mini rebond vers le haut."
                            verseNode={<>لَمۡ يَلِدۡ وَلَمۡ يُولَ<span className="tajwid-blue">دۡ</span></>}
                            reference="Sourate Al-Ikhlāṣ (112:3) — dāl en pause"
                            surah={112} ayah={3}
                        />
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════
                    3. ROUGE FONCÉ — MADD LAZIM (6 temps)
                ═══════════════════════════════════════════════════════════ */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                            <div className="w-3.5 h-3.5 rounded-full bg-red-900 dark:bg-red-300" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-red-900 dark:text-red-300">Rouge foncé — Madd Lāzim <span className="font-kufi font-normal">(مد لازم)</span></h3>
                            <p className="text-xs text-muted-foreground">L'allongement obligatoire — toujours 6 temps, jamais moins</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <RuleCard
                            id="madd-lazim"
                            ruleFr="Madd Lāzim — Lettre de Madd + Sukun dans le même mot"
                            ruleAr="مد لازم"
                            badge="6 temps · Obligatoire"
                            badgeColor="bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-300"
                            explanation="Une lettre de madd (ا و ي) suivie d'un sukun dans le même mot produit l'allongement le plus long du Coran : 6 temps. On le trouve souvent dans les lettres isolées en début de sourate (حروف مقطعة)."
                            tip="Comptez mentalement : un-deux-trois-quatre-cinq-six. Aucune exception dans Hafs."
                            verseNode={<><span className="tajwid-red-dark">ا</span><span className="tajwid-red-dark">لٓ</span><span className="tajwid-red-dark">مٓ</span></>}
                            reference="Sourate Al-Baqara (2:1) — lettres isolées alif-lām-mīm"
                            surah={2} ayah={1}
                        />
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════
                    4. ROUGE — MADD WAJIB MUTTASIL (4-5 temps)
                ═══════════════════════════════════════════════════════════ */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                            <div className="w-3.5 h-3.5 rounded-full bg-red-600 dark:bg-red-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-red-600 dark:text-red-400">Rouge — Madd Wājib Muttaṣil <span className="font-kufi font-normal">(مد واجب متصل)</span></h3>
                            <p className="text-xs text-muted-foreground">Lettre de madd + Hamza dans le MÊME mot — 4 ou 5 temps</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <RuleCard
                            id="madd-wajib"
                            ruleFr="Madd Wājib Muttaṣil — Madd rencontre Hamza dans le même mot"
                            ruleAr="مد واجب متصل"
                            badge="4-5 temps · Obligatoire"
                            badgeColor="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                            explanation='Quand une lettre de madd (ا و ي) est immédiatement suivie par une Hamza (ء) dans le MÊME mot, l'allongement est obligatoire : 4 ou 5 temps (Hafs choisit 4 ou 5, à tenir de façon constante).'
                            tip="Astuce visuelle : cherchez le signe ~ (madda) au-dessus d'un alif, comme dans آ (alif + madda = alif maddée)."
                            verseNode={<>إِذَا <span className="tajwid-red">جَآءَ</span> نَصۡرُ ٱللَّهِ</>}
                            reference="Sourate An-Naṣr (110:1) — ā devant hamza dans جاء"
                            surah={110} ayah={1}
                        />
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════
                    5. ORANGE — MADD NATUREL et JAIZ (2 temps)
                ═══════════════════════════════════════════════════════════ */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center shrink-0">
                            <div className="w-3.5 h-3.5 rounded-full bg-orange-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400">Orange — Madd Ṭabīʿī & Jāʾiz <span className="font-kufi font-normal">(مد طبيعي / جائز)</span></h3>
                            <p className="text-xs text-muted-foreground">L'allongement de base — 2 temps</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <RuleCard
                            id="madd-tabii"
                            ruleFr="Madd Ṭabīʿī — L'allongement naturel (2 temps)"
                            ruleAr="مد طبيعي"
                            badge="2 temps · Base"
                            badgeColor="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300"
                            explanation="Tout Alif, Waw ou Yā portant sa voyelle assortie (fatha + alif, damma + waw, kasra + yā) s'allonge naturellement 2 temps. C'est le madd de base, sans règle spéciale."
                            tip="2 temps = la durée naturelle d'une voyelle longue en arabe classique. Ni trop court, ni trop long."
                            verseNode={<>قُلۡ يَٰٓأَيُّهَا ٱلۡ<span className="tajwid-orange">كَا</span>فِرُ<span className="tajwid-orange">و</span>نَ</>}
                            reference="Sourate Al-Kāfirūn (109:1) — alif et waw longs"
                            surah={109} ayah={1}
                        />

                        <RuleCard
                            id="madd-munfasil"
                            ruleFr="Madd Jāʾiz Munfaṣil — Madd à la fin d'un mot, Hamza au début du suivant"
                            ruleAr="مد جائز منفصل"
                            badge="2-5 temps · Variable"
                            badgeColor="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300"
                            explanation='Quand le madd est en fin de mot et que le mot suivant commence par une Hamza, on peut allonger de 2 à 5 temps. Hafs choisit généralement 4 ou 5 — l'essentiel est d'être constant tout au long de la récitation.'
                            tip="Dans la même récitation, choisissez une durée et tenez-la du début à la fin."
                            verseNode={<>بِمَ<span className="tajwid-orange">آ</span> أُنزِلَ إِلَيۡكَ</>}
                            reference="Sourate Al-Baqara (2:4) — ā en fin de mot, hamza au suivant"
                            surah={2} ayah={4}
                        />
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════
                    6. GRIS — LETTRES SILENCIEUSES / ASSIMILÉES
                ═══════════════════════════════════════════════════════════ */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                            <div className="w-3.5 h-3.5 rounded-full bg-gray-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-600 dark:text-gray-400">Gris — Silencieux & Assimilés <span className="font-kufi font-normal">(ما لا يُلفظ)</span></h3>
                            <p className="text-xs text-muted-foreground">Ces caractères s'écrivent mais ne se prononcent pas seuls</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <RuleCard
                            id="ham-wasl"
                            ruleFr="Hamzatul Wasl — Le Alif de liaison (ٱ)"
                            ruleAr="همزة الوصل"
                            badge="Liaison · Sauter"
                            badgeColor="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                            explanation='Le ٱ (alif avec un petit trait sous la baseline) disparaît quand on enchaîne les mots. On ne l'entend qu'en début absolu de récitation. En liant : "Ma-l-Qāriʿah" et non "Ma-al-Qāriʿah".'
                            tip="Si vous voyez ٱ (différent de ا), préparez-vous à ne pas entendre de son glottal."
                            verseNode={<>مَا <span className="tajwid-gray">ٱ</span>لۡقَارِعَةُ</>}
                            reference="Sourate Al-Qāriʿa (101:2) — hamzatul wasl en liaison"
                            surah={101} ayah={2}
                        />

                        <RuleCard
                            id="lam-shams"
                            ruleFr="Lam Shamsiya — Le Lam qui disparaît"
                            ruleAr="لام شمسية"
                            badge="Assimilé · Fondu"
                            badgeColor="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                            explanation='Le Lam de "Al-" (ٱلـ) se fond dans la lettre suivante quand celle-ci est une des 14 "lettres solaires". Le résultat : la lettre suivante est doublée (shadda) et le Lam disparaît.'
                            tip='Lettres solaires : ت ث د ذ ر ز س ش ص ض ط ظ ل ن — leur point commun : toutes se prononcent en touchant la même zone que le Lam.'
                            verseNode={<>وَٱ<span className="tajwid-gray">لۡ</span>شَّمۡسِ وَضُحَىٰهَا</>}
                            reference="Sourate Ash-Shams (91:1) — lam fondu dans le shīn"
                            surah={91} ayah={1}
                        />

                        <RuleCard
                            id="idgham-bila"
                            ruleFr="Idghām bilā Ghunna — Noun/Tanwin fondu sans nasalisation"
                            ruleAr="إدغام بلا غنة"
                            badge="Sans nasal · Fondu"
                            badgeColor="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                            explanation="Devant Lam (ل) ou Rā (ر), le Noun sakina ou le Tanwin fond complètement dans la lettre suivante SANS son nasal. Contrairement à l'idghām bi ghunna (vert), ici le nez ne vibre pas."
                            tip="Seules deux lettres déclenchent cette règle : ل et ر. La lettre résultante est doublée sans ghunna."
                            verseNode={<>هُدًى مِّ<span className="tajwid-gray">ن رَّ</span>بِّهِمۡ</>}
                            reference="Sourate Al-Baqara (2:5) — nūn avant rā, sans nasalisation"
                            surah={2} ayah={5}
                        />
                    </div>
                </section>

                {/* ── CTA ──────────────────────────────────────────────────── */}
                <div className="p-6 bg-primary/10 rounded-2xl text-center space-y-4">
                    <div className="text-3xl font-kufi text-primary">بِسۡمِ ٱللَّهِ</div>
                    <h3 className="text-lg font-bold">Prêt à pratiquer ?</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                        Toutes ces règles s'appliquent en temps réel sur le Coran complet dans l'application.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link href="/coran/1" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors text-sm">
                            Lire Al-Fātiḥa
                        </Link>
                        <Link href="/apprendre-arabe" className="bg-background border text-foreground px-6 py-2.5 rounded-xl font-semibold hover:bg-muted transition-colors text-sm">
                            Apprendre l'Arabe
                        </Link>
                    </div>
                </div>

            </main>
        </div>
    );
}
