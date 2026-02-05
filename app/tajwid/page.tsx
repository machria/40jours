'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Music, Mic, Layers, PlayCircle } from 'lucide-react';

export default function TajwidPage() {
    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-md border-b">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-3">
                    <Link href="/" className="p-2 hover:bg-muted rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="font-bold text-lg">Guide des Règles de Tajwid</h1>
                </div>
            </div>

            <main className="max-w-3xl mx-auto px-4 pt-24 space-y-8">

                {/* Intro */}
                <div className="text-center space-y-3 mb-8">
                    <h2 className="text-3xl font-bold tracking-tight">Le Code Couleur</h2>
                    <p className="text-muted-foreground">
                        Découvrez les 12 règles de Tajwid détectées par notre algorithme, avec des exemples audio concrets.
                    </p>
                </div>

                {/* 1. VERT - NASALISATION */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <span className="text-green-600 font-bold">1</span>
                        </div>
                        <h3 className="text-xl font-bold text-green-700 dark:text-green-400">Le Vert (Nasalisation)</h3>
                    </div>

                    <div className="grid gap-4 md:grid-cols-1">
                        {/* Ghunnah */}
                        <div className="p-4 bg-card border rounded-xl shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold">Ghunnah (Mim/Nun Shadda)</h4>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">2 temps</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                                L'exemple classique du Nun avec Shadda. On maintient le son nasal.
                            </p>
                            <div className="bg-muted/50 p-3 rounded-lg text-center dir-rtl font-kufi text-xl mb-3">
                                قُلْ أَعُوذُ بِرَبِّ <span className="text-green-600">ٱلنَّاسِ</span>
                            </div>
                            <p className="text-xs text-muted-foreground italic mb-2">Sourate An-Nas (114:1) - Focus sur "An-Nas"</p>
                            <audio controls className="w-full h-8 rounded text-xs">
                                <source src="/audio/114001.mp3" type="audio/mpeg" />
                            </audio>
                        </div>

                        {/* Ikhfa (Nun) */}
                        <div className="p-4 bg-card border rounded-xl shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold">Ikhfa (Nun Sakina)</h4>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Caché</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                                Le Nun sans voyelle qui se cache devant une lettre d'Ikhfa.
                            </p>
                            <div className="bg-muted/50 p-3 rounded-lg text-center dir-rtl font-kufi text-xl mb-3">
                                <span className="text-green-600">مِن شَ</span>رِّ مَا خَلَقَ
                            </div>
                            <p className="text-xs text-muted-foreground italic mb-2">Sourate Al-Falaq (113:2) - Focus sur "Min Sharri"</p>
                            <audio controls className="w-full h-8 rounded text-xs">
                                <source src="/audio/113002.mp3" type="audio/mpeg" />
                            </audio>
                        </div>

                        {/* Ikhfa (Tanween) */}
                        <div className="p-4 bg-card border rounded-xl shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold">Ikhfa (Tanween)</h4>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Caché</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                                Les deux traits (Tanween) qui se cachent devant une lettre d'Ikhfa.
                            </p>
                            <div className="bg-muted/50 p-3 rounded-lg text-center dir-rtl font-kufi text-xl mb-3">
                                سَيَصْلَىٰ <span className="text-green-600">نَارًا ذَ</span>اتَ لَهَبٍ
                            </div>
                            <p className="text-xs text-muted-foreground italic mb-2">Sourate Al-Masad (111:3) - Focus sur "Naran Dhata"</p>
                            <audio controls className="w-full h-8 rounded text-xs">
                                <source src="/audio/111003.mp3" type="audio/mpeg" />
                            </audio>
                        </div>
                    </div>
                </section>

                {/* 2. BLEU - QALQALAH */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <span className="text-blue-600 font-bold">2</span>
                        </div>
                        <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400">Le Bleu (Le Rebond)</h3>
                    </div>

                    <div className="grid gap-4 md:grid-cols-1">
                        {/* Qalqalah Sughra */}
                        <div className="p-4 bg-card border rounded-xl shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold">Qalqalah Petit (Milieu)</h4>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Ressort</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                                Le rebond au cœur du mot.
                            </p>
                            <div className="bg-muted/50 p-3 rounded-lg text-center dir-rtl font-kufi text-xl mb-3">
                                فَأَثَرْنَ بِهِۦ <span className="text-blue-600">نَقْ</span>عًا
                            </div>
                            <p className="text-xs text-muted-foreground italic mb-2">Sourate Al-Adiyat (100:4) - Focus sur le Qaf</p>
                            <audio controls className="w-full h-8 rounded text-xs">
                                <source src="/audio/100004.mp3" type="audio/mpeg" />
                            </audio>
                        </div>

                        {/* Qalqalah Kubra */}
                        <div className="p-4 bg-card border rounded-xl shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold">Qalqalah Grand (Arrêt)</h4>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Fort</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                                Le rebond fort en fin de souffle (arrêt).
                            </p>
                            <div className="bg-muted/50 p-3 rounded-lg text-center dir-rtl font-kufi text-xl mb-3">
                                لَمْ يَلِدْ وَلَمْ <span className="text-blue-800 dark:text-blue-400">يُولَدْ</span>
                            </div>
                            <p className="text-xs text-muted-foreground italic mb-2">Sourate Al-Ikhlas (112:3) - Focus sur le Dal final</p>
                            <audio controls className="w-full h-8 rounded text-xs">
                                <source src="/audio/112003.mp3" type="audio/mpeg" />
                            </audio>
                        </div>
                    </div>
                </section>

                {/* 3. ROUGE & ORANGE - ALLONGEMENTS */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <span className="text-red-600 font-bold">3</span>
                        </div>
                        <h3 className="text-xl font-bold text-red-700 dark:text-red-400">Les Allongements (Madd)</h3>
                    </div>

                    <div className="grid gap-4 md:grid-cols-1">
                        {/* Madd Fort */}
                        <div className="p-4 bg-card border rounded-xl shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-red-600">Madd Fort (Rouge)</h4>
                                <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">4-5 temps</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                                L'allongement long obligatoire (signe vague ~).
                            </p>
                            <div className="bg-muted/50 p-3 rounded-lg text-center dir-rtl font-kufi text-xl mb-3">
                                إِذَا <span className="text-red-600">جَاءَ</span> نَصْرُ ٱللَّهِ
                            </div>
                            <p className="text-xs text-muted-foreground italic mb-2">Sourate An-Nasr (110:1) - Focus sur "Jaaa'a"</p>
                            <audio controls className="w-full h-8 rounded text-xs">
                                <source src="/audio/110001.mp3" type="audio/mpeg" />
                            </audio>
                        </div>

                        {/* Madd Naturel */}
                        <div className="p-4 bg-card border rounded-xl shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-orange-500">Madd Naturel (Orange)</h4>
                                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">2 temps</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                                L'allongement simple (Alif, Waw, Ya).
                            </p>
                            <div className="bg-muted/50 p-3 rounded-lg text-center dir-rtl font-kufi text-xl mb-3">
                                قُلْ يَا أَيُّهَا <span className="text-orange-500">ٱلْكَافِرُونَ</span>
                            </div>
                            <p className="text-xs text-muted-foreground italic mb-2">Sourate Al-Kafirun (109:1) - Focus sur "Kafirouna"</p>
                            <audio controls className="w-full h-8 rounded text-xs">
                                <source src="/audio/109001.mp3" type="audio/mpeg" />
                            </audio>
                        </div>

                        {/* Alif Suscrit */}
                        <div className="p-4 bg-card border rounded-xl shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-orange-500">Alif Suscrit (Dagué)</h4>
                                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">2 temps</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                                Le petit trait vertical. Se prononce comme un grand Alif.
                            </p>
                            <div className="bg-muted/50 p-3 rounded-lg text-center dir-rtl font-kufi text-xl mb-3">
                                <span className="text-orange-500">مَٰلِكِ</span> يَوْمِ ٱلدِّينِ
                            </div>
                            <p className="text-xs text-muted-foreground italic mb-2">Sourate Al-Fatiha (1:4) - Focus sur "Maliki"</p>
                            <audio controls className="w-full h-8 rounded text-xs">
                                <source src="/audio/001004.mp3" type="audio/mpeg" />
                            </audio>
                        </div>
                    </div>
                </section>

                {/* 4. GRIS - LETTRES MUETTES */}
                <section className="space-y-4 mb-12">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <span className="text-gray-600 font-bold">4</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400">Le Gris (Lettres Muettes)</h3>
                    </div>

                    <div className="grid gap-4 md:grid-cols-1">
                        {/* Hamzatul Wasl */}
                        <div className="p-4 bg-card border rounded-xl shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold">Hamzatul Wasl (Liaison)</h4>
                                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">Sauter</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                                Le Alif qu'on saute en liant les mots.
                            </p>
                            <div className="bg-muted/50 p-3 rounded-lg text-center dir-rtl font-kufi text-xl mb-3">
                                ٱلْقَارِعَةُ مَا <span className="text-gray-400">ٱ</span>لْقَارِعَةُ
                            </div>
                            <p className="text-xs text-muted-foreground italic mb-2">Sourate Al-Qari'a (101:2) - Focus sur la liaison "Maa-l-Qari'ah"</p>
                            <audio controls className="w-full h-8 rounded text-xs">
                                <source src="/audio/101002.mp3" type="audio/mpeg" />
                            </audio>
                        </div>

                        {/* Lam Solaire */}
                        <div className="p-4 bg-card border rounded-xl shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold">Lam Solaire (Fusion)</h4>
                                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">Sauter</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                                Le Lam qui disparaît devant une lettre Solaire (Shadda).
                            </p>
                            <div className="bg-muted/50 p-3 rounded-lg text-center dir-rtl font-kufi text-xl mb-3">
                                وَ<span className="text-gray-400">ٱل</span>شَّمْسِ وَضُحَىٰهَا
                            </div>
                            <p className="text-xs text-muted-foreground italic mb-2">Sourate Ash-Shams (91:1) - Focus sur "Wash-Shams"</p>
                            <audio controls className="w-full h-8 rounded text-xs">
                                <source src="/audio/091001.mp3" type="audio/mpeg" />
                            </audio>
                        </div>

                        {/* Voyelles Muettes */}
                        <div className="p-4 bg-card border rounded-xl shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold">Voyelles Muettes (Ornement)</h4>
                                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">Ignorer</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                                Le rond ou zéro qui annule la lettre.
                            </p>
                            <div className="bg-muted/50 p-3 rounded-lg text-center dir-rtl font-kufi text-xl mb-3">
                                أُ<span className="text-gray-400">و</span>لَٰئِكَ عَلَىٰ هُدًى
                            </div>
                            <p className="text-xs text-muted-foreground italic mb-2">Sourate Al-Baqara (2:5) - Focus sur le Waw de "Ula'ika"</p>
                            <audio controls className="w-full h-8 rounded text-xs">
                                <source src="/audio/002005.mp3" type="audio/mpeg" />
                            </audio>
                        </div>
                    </div>
                </section>

                {/* Footer Call to Action */}
                <div className="p-6 bg-primary/10 rounded-2xl text-center space-y-4 mb-20">
                    <h3 className="text-lg font-bold">Prêt à pratiquer ?</h3>
                    <p className="text-sm text-muted-foreground">
                        Ces règles s'appliquent automatiquement sur tout le Coran dans l'application.
                        Cherchez les couleurs !
                    </p>
                    <Link href="/coran" className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors">
                        Lire le Coran
                    </Link>
                </div>
            </main>
        </div>
    );
}
