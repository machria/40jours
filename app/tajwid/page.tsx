
import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Play, Info, CheckCircle2, BookOpen } from 'lucide-react';

export default function TajwidPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="p-4 flex items-center gap-4 sticky top-0 bg-background/80 backdrop-blur z-10 border-b">
                <Link href="/" className="p-2 hover:bg-muted rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-xl font-bold font-kufi text-primary">Le Tajwid Simplifié</h1>
                    <p className="text-xs text-muted-foreground">Sourate An-Nasr (La Victoire)</p>
                </div>
            </header>

            <main className="flex-1 container max-w-2xl mx-auto p-6 space-y-10 pb-24">

                {/* Importance of Tajwid Section */}
                <section className="space-y-4">
                    <div className="bg-card border rounded-3xl p-6 shadow-sm space-y-3">
                        <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                            <BookOpen className="w-5 h-5" />
                            Pourquoi apprendre le Tajwid ?
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Le Tajwid n'est pas une option esthétique, c'est une <strong>nécessité</strong> pour tout musulman. Il permet de :
                        </p>
                        <ul className="list-disc list-inside text-sm space-y-2 text-muted-foreground ml-2">
                            <li>Préserver le sens de la parole d'Allah (une lettre mal prononcée peut changer le sens).</li>
                            <li>Valider sa prière (la Fatiha doit être lue correctement).</li>
                            <li>Embellir sa récitation comme l'a demandé le Prophète (ﷺ).</li>
                        </ul>
                    </div>

                    <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
                        <h2 className="text-lg font-bold mb-2 text-primary flex items-center gap-2">
                            <Info className="w-5 h-5" />
                            Pourquoi étudier Sourate An-Nasr ?
                        </h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Cette sourate courte (110) est idéale pour débuter car elle regroupe <strong>les trois règles fondamentales</strong> que vous retrouverez partout dans le Coran : le Madd, la Ghunnah et la Qalqala.
                        </p>
                    </div>
                </section>

                <div className="space-y-12">
                    {/* Rule 1: Madd */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-700 font-bold text-sm">1</span>
                            <h2 className="text-2xl font-bold font-kufi">Le Madd (Prolongation)</h2>
                        </div>

                        <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
                            <div className="text-center space-y-4">
                                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Verset 1</p>
                                <div className="text-2xl md:text-3xl font-kufi leading-loose text-foreground dir-rtl">
                                    إِذَا <span className="text-red-500 font-bold">جَآءَ</span> نَصْرُ ٱللَّهِ وَٱلْفَتْحُ
                                </div>
                                <div className="text-lg text-muted-foreground font-medium px-4 py-2 bg-muted/30 rounded-lg inline-block">
                                    Itha <span className="text-red-500 font-bold">jaa</span> nasru Allahi waalfathu
                                </div>
                            </div>

                            <div className="bg-muted/50 p-4 rounded-xl flex flex-col items-center gap-4">
                                <p className="text-sm text-center leading-relaxed">
                                    Sur le mot <strong>Jaa'a</strong> (en <span className="text-red-500 font-bold">rouge</span>), vous voyez une petite vague (~) sur l'alif. Elle indique une prolongation obligatoire de <strong>4 à 5 temps</strong> (environ 2-3 secondes).
                                </p>
                                <audio controls className="w-full h-10 rounded-lg">
                                    <source src="/audio/110001.mp3" type="audio/mpeg" />
                                    Votre navigateur ne supporte pas l'élément audio.
                                </audio>
                            </div>
                        </div>
                    </section>

                    {/* Rule 2: Ghunnah */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold text-sm">2</span>
                            <h2 className="text-2xl font-bold font-kufi">La Ghunnah (Nasalisation)</h2>
                        </div>

                        <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
                            <div className="text-center space-y-4">
                                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Verset 2</p>
                                <div className="text-2xl md:text-3xl font-kufi leading-loose text-foreground dir-rtl">
                                    وَرَأَيْتَ <span className="text-green-500 font-bold">ٱلنَّاسَ</span> يَدْخُلُونَ فِى دِينِ ٱللَّهِ أَفْوَاجًا
                                </div>
                                <div className="text-lg text-muted-foreground font-medium px-4 py-2 bg-muted/30 rounded-lg inline-block">
                                    Waraayta <span className="text-green-500 font-bold">alnnasa</span> yadkhuloona fee deeni Allahi afwajan
                                </div>
                            </div>

                            <div className="bg-muted/50 p-4 rounded-xl space-y-4">
                                <p className="text-sm text-center leading-relaxed">
                                    C'est le son qui sort du nez. Regardez le mot <strong>An-Naas</strong> (en <span className="text-green-500 font-bold">vert</span>). La lettre <em>Noun</em> (ن) porte une Shadda (le petit "w"). Il faut insister dessus pendant <strong>2 temps</strong>.
                                </p>
                                <audio controls className="w-full h-10 rounded-lg">
                                    <source src="/audio/110002.mp3" type="audio/mpeg" />
                                </audio>
                            </div>

                            <div className="border-t pt-6 text-center space-y-4">
                                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Verset 3 (Autre exemple)</p>
                                <div className="text-2xl md:text-3xl font-kufi leading-loose text-foreground dir-rtl">
                                    فَسَبِّحْ بِحَمْدِ رَبِّكَ وَٱسْتَغْفِرْهُ ۚ <span className="text-green-500 font-bold">إِنَّهُۥ</span> كَانَ تَوَّابًۢا
                                </div>
                                <div className="text-lg text-muted-foreground font-medium px-4 py-2 bg-muted/30 rounded-lg inline-block">
                                    Fasabbih bihamdi rabbika waistaghfirhu <span className="text-green-500 font-bold">innahu</span> kana tawwaban
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Même règle sur <strong>Innahu</strong> (aussi en <span className="text-green-500 font-bold">vert</span>) : on insiste sur le "Nnn".
                                </p>
                                <div className="w-full flex justify-center mt-2">
                                    <audio controls className="w-full max-w-sm h-8 rounded-lg">
                                        <source src="/audio/110003.mp3" type="audio/mpeg" />
                                    </audio>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Rule 3: Qalqala */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">3</span>
                            <h2 className="text-2xl font-bold font-kufi">La Qalqala (Rebond)</h2>
                        </div>

                        <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
                            <div className="text-center space-y-4">
                                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Verset 2 (Rappel)</p>
                                <div className="text-2xl md:text-3xl font-kufi leading-loose text-foreground dir-rtl">
                                    وَرَأَيْتَ ٱلنَّاسَ <span className="text-blue-500 font-bold">يَدْ</span>خُلُونَ فِى دِينِ ٱللَّهِ أَفْوَاجًا
                                </div>
                                <div className="text-lg text-muted-foreground font-medium px-4 py-2 bg-muted/30 rounded-lg inline-block">
                                    Waraayta alnnasa <span className="text-blue-500 font-bold">yad</span>khuloona fee deeni Allahi afwajan
                                </div>
                            </div>

                            <div className="bg-muted/50 p-4 rounded-xl flex flex-col items-center gap-4">
                                <p className="text-sm text-center leading-relaxed">
                                    Le rebond ou l'écho. Ici, c'est la lettre <strong>Dal</strong> (en <span className="text-blue-500 font-bold">bleu</span>) qui porte un Soukoun (le petit rond). On ne la bloque pas, on la fait rebondir : "Ya<span className="text-blue-500 font-bold">d</span>-khuluna".
                                </p>
                                <audio controls className="w-full h-10 rounded-lg">
                                    <source src="/audio/110002.mp3" type="audio/mpeg" />
                                </audio>
                            </div>
                        </div>
                    </section>
                </div>

                <section className="bg-accent/10 p-6 rounded-3xl text-center space-y-4 mt-8">
                    <CheckCircle2 className="w-12 h-12 text-primary mx-auto opacity-50" />
                    <h3 className="text-xl font-bold">Prêt à continuer ?</h3>
                    <p className="text-muted-foreground text-sm">
                        Écoutez la sourate en entier pour entendre l'enchaînement de toutes ces règles.
                    </p>
                    <Link href="/coran/110" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                        <Play className="w-4 h-4 fill-current" />
                        Sourate An-Nasr Complète
                    </Link>
                </section>
            </main>
        </div>
    );
}
