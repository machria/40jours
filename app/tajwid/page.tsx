
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
                    <h1 className="text-xl font-bold font-kufi text-primary">Code Couleur Tajwid</h1>
                    <p className="text-xs text-muted-foreground">Guide de lecture (Hafs)</p>
                </div>
            </header>

            <main className="flex-1 container max-w-2xl mx-auto p-6 space-y-10 pb-24">

                {/* Importance Section */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold font-kufi text-primary">L'Importance du Tajwid</h2>
                    <div className="bg-card border rounded-3xl p-6 shadow-sm space-y-4">
                        <p className="text-muted-foreground leading-relaxed">
                            Le mot <strong>Tajwid</strong> signifie "embellir". Il s'agit de donner à chaque lettre du Coran son droit, en la prononçant depuis son point de sortie correct et en respectant ses caractéristiques.
                        </p>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="bg-muted/30 p-4 rounded-xl text-center space-y-2">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-sm">Préserver le Sens</h3>
                                <p className="text-xs text-muted-foreground">Une lettre mal prononcée peut changer le sens (ex: "Qalb" = Cœur vs "Kalb" = Chien).</p>
                            </div>
                            <div className="bg-muted/30 p-4 rounded-xl text-center space-y-2">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-sm">Valider la Prière</h3>
                                <p className="text-xs text-muted-foreground">La récitation correcte de la Fatiha est une condition de validité de la prière.</p>
                            </div>
                            <div className="bg-muted/30 p-4 rounded-xl text-center space-y-2">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                                    <Play className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-sm">Ordre Divin</h3>
                                <p className="text-xs text-muted-foreground">Allah ordonne : "Et récite le Coran lentement et clairement." (73:4)</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Intro Section */}
                <section className="space-y-4">
                    <div className="bg-card border rounded-3xl p-6 shadow-sm space-y-3">
                        <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                            <Info className="w-5 h-5" />
                            Comment lire le Coran sur ce site ?
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Nous utilisons un code couleur simplifié basé sur <strong>3 couleurs principales</strong> pour vous aider à appliquer les règles de Tajwid sans avoir à connaître tous les termes techniques.
                        </p>
                    </div>
                </section>

                <div className="space-y-12">
                    {/* RED: Madd */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold text-sm">1</span>
                            <h2 className="text-2xl font-bold font-kufi text-red-600">Le Rouge : La Prolongation (Madd)</h2>
                        </div>
                        <p className="text-muted-foreground text-sm ml-11">
                            Indique qu'il faut allonger le son de la voyelle au-delà de sa durée naturelle.
                        </p>
                        <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
                            <div className="bg-muted/30 p-4 rounded-xl space-y-2">
                                <h3 className="font-semibold text-foreground">La règle Détaillée</h3>
                                <div className="text-sm text-muted-foreground leading-relaxed">
                                    En règle générale, toute lettre colorée en <span className="text-red-500 font-bold">Rouge</span> doit être prolongée de <strong>4 à 5 temps</strong> (soit environ 2 à 3 secondes).
                                    <br />
                                    <br />
                                    Cela correspond techniquement au <strong>Madd Wajib</strong> (Obligatoire) ou <strong>Madd Jaiz</strong> (Permis), souvent signalés par une petite vague (~) au-dessus de la lettre. C'est plus long qu'une simple prolongation naturelle (2 temps).
                                </div>
                            </div>

                            <div className="text-center space-y-4 border-t pt-4">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Exemple Audio (Sourate 110:1)</p>
                                <div className="text-2xl md:text-3xl font-kufi leading-loose text-foreground dir-rtl px-4">
                                    إِذَا <span className="text-red-500 font-bold">جَآءَ</span> نَصْرُ ٱللَّهِ وَٱلْفَتْحُ
                                </div>
                                <div className="text-lg text-muted-foreground font-medium px-4 py-2 bg-muted/30 rounded-lg inline-block">
                                    Itha <span className="text-red-500 font-bold">jaa</span> nasru Allahi waalfathu
                                </div>
                                <audio controls className="w-full h-10 rounded-lg">
                                    <source src="/audio/110001.mp3" type="audio/mpeg" />
                                    Votre navigateur ne supporte pas l'élément audio.
                                </audio>
                            </div>
                        </div>
                    </section>

                    {/* GREEN: Ghunnah */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 font-bold text-sm">2</span>
                            <h2 className="text-2xl font-bold font-kufi text-green-600">Le Vert : La Nasalisation (Ghunnah)</h2>
                        </div>
                        <p className="text-muted-foreground text-sm ml-11">
                            Indique un son qui doit résonner dans le nez (cavité nasale).
                        </p>

                        <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
                            <div className="bg-muted/30 p-4 rounded-xl space-y-2">
                                <h3 className="font-semibold text-foreground">La règle Détaillée</h3>
                                <div className="text-sm text-muted-foreground leading-relaxed">
                                    La Ghunnah est un son nasillard persistant. Elle s'applique principalement sur deux lettres lorsqu'elles portent une Shadda (le signe « w ») :
                                    <ul className="list-disc list-inside mt-2 ml-2 space-y-1">
                                        <li>Le <strong>Noun</strong> (نّ)</li>
                                        <li>Le <strong>Mim</strong> (مّ)</li>
                                    </ul>
                                    <br />
                                    Lorsque vous voyez du <span className="text-green-500 font-bold">Vert</span>, vous devez maintenir le son pendant <strong>2 temps</strong> avant de passer à la lettre suivante.
                                </div>
                            </div>

                            <div className="text-center space-y-4 border-t pt-4">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Exemple Audio (Sourate 110:3)</p>
                                <div className="text-2xl md:text-3xl font-kufi leading-loose text-foreground dir-rtl px-4">
                                    فَسَبِّحْ بِحَمْدِ رَبِّكَ وَٱسْتَغْفِرْهُ ۚ <span className="text-green-500 font-bold">إِنَّهُۥ</span> كَانَ تَوَّابًۢا
                                </div>
                                <div className="text-lg text-muted-foreground font-medium px-4 py-2 bg-muted/30 rounded-lg inline-block">
                                    Fasabbih bihamdi rabbika waistaghfirhu <span className="text-green-500 font-bold">innahu</span> kana tawwaban
                                </div>
                                <audio controls className="w-full h-10 rounded-lg">
                                    <source src="/audio/110003.mp3" type="audio/mpeg" />
                                </audio>
                            </div>
                        </div>
                    </section>

                    {/* BLUE: Qalqala */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">3</span>
                            <h2 className="text-2xl font-bold font-kufi text-blue-600">Le Bleu : Le Rebond (Qalqala)</h2>
                        </div>
                        <p className="text-muted-foreground text-sm ml-11">
                            Indique une vibration ou un écho lors de la prononciation d'une consonne.
                        </p>

                        <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
                            <div className="bg-muted/30 p-4 rounded-xl space-y-2">
                                <h3 className="font-semibold text-foreground">La règle Détaillée</h3>
                                <div className="text-sm text-muted-foreground leading-relaxed">
                                    La Qalqala s'applique lorsque l'une des 5 lettres de "Qoutbou Jad" (<strong>ق ط ب ج د</strong>) porte un Soukoun (absence de voyelle).
                                    <br />
                                    <br />
                                    Au lieu de bloquer le son brutalement, il faut le laisser "rebondir" légèrement pour que la lettre reste audible. Le <span className="text-blue-500 font-bold">Bleu</span> vous signale ce rebond nécessaire.
                                </div>
                            </div>

                            <div className="text-center space-y-4 border-t pt-4">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Exemple Audio (Sourate 110:2)</p>
                                <div className="text-2xl md:text-3xl font-kufi leading-loose text-foreground dir-rtl px-4">
                                    وَرَأَيْتَ ٱلنَّاسَ <span className="text-blue-500 font-bold">يَدْ</span>خُلُونَ فِى دِينِ ٱللَّهِ أَفْوَاجًا
                                </div>
                                <div className="text-lg text-muted-foreground font-medium px-4 py-2 bg-muted/30 rounded-lg inline-block">
                                    Waraayta alnnasa <span className="text-blue-500 font-bold">yad</span>khuloona fee deeni Allahi afwajan
                                </div>
                                <audio controls className="w-full h-10 rounded-lg">
                                    <source src="/audio/110002.mp3" type="audio/mpeg" />
                                </audio>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Going Further Section */}
                <section className="space-y-6">
                    <h2 className="text-xl font-bold font-kufi flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-primary" />
                        Pour aller plus loin (Hafs)
                    </h2>
                    <div className="bg-card border rounded-3xl p-6 shadow-sm space-y-4">
                        <p className="text-muted-foreground leading-relaxed">
                            Ce guide simplifié couvre les bases pour débuter avec la lecture <strong>Hafs d'après 'Asim</strong>, qui est la lecture la plus répandue dans le monde musulman aujourd'hui.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            Cependant, les couleurs ne remplacent pas l'apprentissage complet. Pour maîtriser le Tajwid, nous vous encourageons à étudier :
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-sm text-foreground/80 ml-2">
                            <li><strong>Les Points d'Articulation (Makharij)</strong> : Savoir exactement d'où sort chaque lettre (gorge, langue, lèvres...).</li>
                            <li><strong>Les Caractéristiques (Sifat)</strong> : Le souffle, l'emphase (Tafkhim), l'amincissement (Tarqiq).</li>
                            <li><strong>Les Règles du Noun Sakina</strong> : Distinguer clairement l'Izhar (clarté), l'Idgham (fusion), l'Iqlab (transformation) et l'Ikhfa (dissimulation).</li>
                        </ul>
                        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-xl border border-blue-100 dark:border-blue-900 mt-4">
                            <p className="text-sm text-blue-800 dark:text-blue-300 flex gap-2">
                                <Info className="w-5 h-5 shrink-0" />
                                <span><strong>Conseil d'or :</strong> Le Coran se transmet oralement. Rien ne remplace l'écoute et la correction par un enseignant qualifié (Cheikh/Cheikha) pour valider votre prononciation.</span>
                            </p>
                        </div>
                    </div>
                </section>

                <section className="bg-accent/10 p-6 rounded-3xl text-center space-y-4 mt-8">
                    <BookOpen className="w-12 h-12 text-primary mx-auto opacity-50" />
                    <h3 className="text-xl font-bold">Essayez maintenant</h3>
                    <p className="text-muted-foreground text-sm">
                        Mettez en pratique ces 3 couleurs.
                    </p>
                    <Link href="/coran/1" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                        <Play className="w-4 h-4 fill-current" />
                        Lire Al-Fatiha
                    </Link>
                </section>
            </main>
        </div>
    );
}

