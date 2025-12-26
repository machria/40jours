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
                    Recueils authentiques du Prophète (ﷺ)
                </p>
            </header>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                {collections.map((collection) => (
                    <Link
                        key={collection.id}
                        href={`/hadith/${collection.id}`}
                        className="group block"
                    >
                        <div className="bg-card border hover:border-primary/50 transition-all rounded-2xl p-8 shadow-sm hover:shadow-md h-full flex flex-col items-center justify-center text-center space-y-4">
                            <span className="text-4xl">📚</span>
                            <h2 className="text-2xl font-bold font-kufi text-foreground group-hover:text-primary transition-colors">
                                {collection.name}
                            </h2>
                            <span className="text-sm text-muted-foreground">
                                Consulter le recueil complet en français
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            <section className="max-w-4xl mx-auto mt-12 bg-muted/30 rounded-2xl p-6 md:p-8">
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
