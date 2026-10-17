'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Palette, Trophy, Users, X, ArrowRight, ArrowLeft } from 'lucide-react';

const STORAGE_KEY = 'hasSeenOnboarding';

interface Step {
    icon: React.ReactNode;
    title: string;
    description: string;
    href?: { label: string; url: string };
}

const steps: Step[] = [
    {
        icon: <BookOpen className="w-7 h-7" />,
        title: 'Le Coran en 40 jours',
        description:
            "Ce programme découpe la lecture du Coran en 40 étapes quotidiennes de 35 à 45 minutes, pour vous habituer progressivement à une lecture régulière, en accord avec la Sunna.",
    },
    {
        icon: <Palette className="w-7 h-7" />,
        title: 'Tafsir & Tajwid colorisé',
        description:
            "Chaque sourate est accompagnée du Tafsir d'Ibn Kathir. Le texte utilise une colorisation Tajwid simplifiée (rouge, vert, bleu) pour vous aider à mieux réciter.",
    },
    {
        icon: <Trophy className="w-7 h-7" />,
        title: 'Progression & badges',
        description:
            'Votre streak de lecture, vos Juz complétés et vos badges sont suivis automatiquement depuis votre tableau de bord pour vous motiver à revenir chaque jour.',
    },
    {
        icon: <Users className="w-7 h-7" />,
        title: 'Lisez en communauté',
        description:
            "Rejoignez ou créez un groupe pour suivre la progression de vos proches et rester motivés ensemble.",
        href: { label: 'Découvrir les groupes', url: '/social' },
    },
];

export default function WelcomeModal() {
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);

    useEffect(() => {
        setMounted(true);
        const hasSeen = localStorage.getItem(STORAGE_KEY);
        if (!hasSeen) {
            setOpen(true);
        }
    }, []);

    useEffect(() => {
        if (!open) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [open]);

    const close = () => {
        localStorage.setItem(STORAGE_KEY, 'true');
        setOpen(false);
    };

    const isLastStep = stepIndex === steps.length - 1;
    const step = steps[stepIndex];

    if (!mounted || !open) return null;

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-60 flex items-end md:items-center justify-center p-0 md:p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={close}
                >
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="welcome-modal-title"
                        className="bg-background w-full md:max-w-md rounded-t-2xl md:rounded-2xl border border-border shadow-xl overflow-hidden"
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 40, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <div className="flex items-center gap-1.5">
                                {steps.map((_, i) => (
                                    <span
                                        key={i}
                                        className={`h-1.5 rounded-full transition-all ${
                                            i === stepIndex ? 'w-6 bg-primary' : 'w-1.5 bg-muted'
                                        }`}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={close}
                                className="text-muted-foreground hover:text-foreground transition-colors p-2.5 -m-1.5"
                                aria-label="Fermer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={stepIndex}
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -16 }}
                                transition={{ duration: 0.2 }}
                                className="p-6 space-y-4 text-center"
                            >
                                <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                    {step.icon}
                                </div>
                                <h2 id="welcome-modal-title" className="text-xl font-bold font-kufi text-primary">
                                    {step.title}
                                </h2>
                                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                                {step.href && (
                                    <Link
                                        href={step.href.url}
                                        onClick={close}
                                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                                    >
                                        {step.href.label}
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex items-center justify-between gap-3 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:pb-4 border-t border-border">
                            <button
                                onClick={() => setStepIndex((i) => i - 1)}
                                disabled={stepIndex === 0}
                                className="inline-flex items-center gap-1.5 min-h-11 px-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-0 disabled:pointer-events-none"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Précédent
                            </button>

                            {isLastStep ? (
                                <button
                                    onClick={close}
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-full font-semibold text-sm transition-transform active:scale-95 shadow-lg shadow-primary/20"
                                >
                                    Commencer le Défi
                                </button>
                            ) : (
                                <button
                                    onClick={() => setStepIndex((i) => i + 1)}
                                    className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-full font-semibold text-sm transition-transform active:scale-95 shadow-lg shadow-primary/20"
                                >
                                    Suivant
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
