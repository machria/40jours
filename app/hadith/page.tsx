import Link from 'next/link';
import { getCollectionsList } from '@/lib/hadith-api';

export const metadata = {
    title: 'Hadiths - Sahih Bukhari & Muslim',
    description: 'Consultez les recueils de hadiths authentiques Sahih Bukhari et Muslim en français.',
};

export default function HadithPage() {
    const collections = getCollectionsList();

    return (
        <main className="min-h-screen p-4 md:p-8">
            <header className="mb-8 text-center space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold font-kufi text-primary">Hadiths</h1>
                <p className="text-muted-foreground text-lg">
                    L'héritage prophétique (La Sunna)
                </p>
            </header>

            <section className="max-w-4xl mx-auto mb-10 bg-card border rounded-3xl p-6 md:p-8 shadow-sm">
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row items-start gap-4">
                        <span className="text-4xl hidden md:block">📜</span>
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold text-primary font-kufi flex items-center gap-2">
                                <span className="md:hidden">📜</span>
                                Pourquoi les Hadiths sont-ils nécessaires ?
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Le Coran est la parole d'Allah, et les Hadiths (la Sunna) sont son <strong>explication pratique</strong>.
                                Sans les Hadiths, nous ne saurions pas comment prier (le nombre de rakat, les gestes), comment payer la Zakat, ou comment faire le Hajj.
                                Allah dit : <em>"Obéissez à Allah et obéissez au Messager"</em> (Coran 4:59). Les deux sont indissociables.
                            </p>
                        </div>
                    </div>

                    <div className="border-t pt-6 flex flex-col md:flex-row items-start gap-4">
                        <span className="text-4xl hidden md:block">💎</span>
                        <div className="space-y-3">
                            <h2 className="text-xl font-bold text-primary font-kufi flex items-center gap-2">
                                <span className="md:hidden">💎</span>
                                La Méthode de Vérification (L'Isnad)
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Pour garantir l'authenticité des textes, les savants ont établi un système de vérification méthodique : <strong>l'Isnad</strong> (la chaîne de transmission).
                            </p>
                            <ul className="list-disc list-inside text-sm space-y-2 text-muted-foreground ml-1">
                                <li>Chaque parole a été transmise de maître à élève jusqu'au Prophète (ﷺ).</li>
                                <li>Les savants ont analysé la vie de <strong>chaque rapporteur</strong> (plus de 100 000 biographies) : sa mémoire, son honnêteté, ses voyages.</li>
                                <li>Si un rapporteur avait menti une seule fois dans sa vie, même pour une blague, ses hadiths étaient rejetés.</li>
                            </ul>
                            <p className="text-muted-foreground leading-relaxed">
                                C'est grâce à ce filtre ultra-sélectif que nous avons aujourd'hui les recueils <strong>Sahih</strong> (Authentiques), purifiés de toute invention ou erreur humaine.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-4xl mx-auto mb-8 flex flex-col sm:flex-row justify-center gap-4">
                <Link
                    href="/hadith/flashcards"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground font-bold rounded-full hover:bg-secondary/90 transition-all hover:scale-105 active:scale-95 border"
                >
                    <span className="text-xl">🔀</span>
                    Aléatoire
                </Link>
                <Link
                    href="/hadith/themes"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-full shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
                >
                    <span className="text-xl">🌍</span>
                    Univers Hadith
                </Link>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12">
                {collections.map((collection) => (
                    <Link
                        key={collection.id}
                        href={`/hadith/${collection.id}`}
                        className="group block"
                    >
                        <div className="bg-card border hover:border-primary/50 transition-all rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md h-full flex flex-row md:flex-col items-center md:justify-center text-left md:text-center space-x-4 md:space-x-0 md:space-y-4">
                            <span className="text-3xl md:text-4xl bg-primary/10 p-3 rounded-full md:bg-transparent md:p-0">📚</span>
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold font-kufi text-foreground group-hover:text-primary transition-colors">
                                    {collection.name}
                                </h2>
                                <span className="text-sm text-muted-foreground md:inline hidden">
                                    Consulter le recueil complet en français
                                </span>
                            </div>
                            <div className="ml-auto md:hidden text-muted-foreground">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <section className="max-w-4xl mx-auto mt-6 bg-muted/30 rounded-2xl p-6 md:p-8">
                <h3 className="text-xl font-bold font-kufi mb-6 text-center">Comprendre les Degrés des Hadiths</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-card p-4 rounded-lg border">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-3 h-3 rounded-full bg-green-500"></span>
                            <span className="font-bold">Sahih (Authentique)</span>
                        </div>
                        <p className="text-muted-foreground">
                            Hadith rapporté par une chaîne continue de narrateurs fiables, intègres et dotés d&apos;une excellente mémoire. C&apos;est le plus haut degré d&apos;authenticité.
                        </p>
                    </div>

                    <div className="bg-card p-4 rounded-lg border">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                            <span className="font-bold">Hasan (Bon)</span>
                        </div>
                        <p className="text-muted-foreground">
                            Hadith acceptable et fiable, mais dont la précision ou la mémoire d&apos;un narrateur est légèrement inférieure au degré Sahih.
                        </p>
                    </div>

                    <div className="bg-card p-4 rounded-lg border">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-3 h-3 rounded-full bg-orange-400"></span>
                            <span className="font-bold">Da&apos;if (Faible)</span>
                        </div>
                        <p className="text-muted-foreground">
                            Hadith qui ne remplit pas les conditions de l&apos;authentique ni du bon (ex: rupture dans la chaîne ou narrateur peu fiable). Il ne peut pas servir de preuve seul.
                        </p>
                    </div>

                    <div className="bg-card p-4 rounded-lg border">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-3 h-3 rounded-full bg-red-500"></span>
                            <span className="font-bold">Maudu (Fabriqué)</span>
                        </div>
                        <p className="text-muted-foreground">
                            Hadirh inventé ou mensonger faussement attribué au Prophète (ﷺ). Il est interdit de le rapporter sans préciser sa fausseté.
                        </p>
                    </div>
                </div>
            </section>


            <div className="mt-8 text-center">
                <Link href="/" className="text-primary hover:underline">
                    &larr; Retour à l&apos;accueil
                </Link>
            </div>
        </main>
    );
}
