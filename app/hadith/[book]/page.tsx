import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCollectionMetadata, getCollectionsList } from '@/lib/hadith-api';
import { CollectionName } from '@/types/hadith';

interface PageProps {
    params: Promise<{ book: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { book } = await params;
    const collections = getCollectionsList();
    const collectionInfo = collections.find(c => c.id === book);

    if (!collectionInfo) {
        return {
            title: 'Recueil non trouvé',
        };
    }

    return {
        title: `${collectionInfo.name} - Sommaire`,
        description: `Sommaire des chapitres de ${collectionInfo.name} en français.`,
    };
}

import { BOOK_DESCRIPTIONS } from '@/lib/hadith-descriptions';

// ... imports

export default async function BookPage({ params }: PageProps) {
    const resolvedParams = await params;
    const { book } = resolvedParams;

    const collections = getCollectionsList();
    if (!collections.some(c => c.id === book)) {
        notFound();
    }

    const metadata = await getCollectionMetadata(book as CollectionName);
    const description = BOOK_DESCRIPTIONS[book as CollectionName];

    // Convert sections object to array and sort by ID
    const sections = Object.entries(metadata.sections)
        .map(([id, title]) => ({
            id,
            title,
            details: metadata.section_details[id]
        }))
        .filter(s => s.title) // Filter out empty titles (like section 0 sometimes)
        .sort((a, b) => parseInt(a.id) - parseInt(b.id));

    return (
        <main className="min-h-screen p-4 md:p-8">
            <header className="mb-8 text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                    <Link href="/hadith" className="hover:text-primary">Hadiths</Link>
                    <span>/</span>
                    <span className="font-semibold text-foreground">{metadata.name}</span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold font-kufi text-primary">{metadata.name}</h1>

                {description && (
                    <div className="max-w-3xl mx-auto mt-6 bg-card border rounded-xl p-6 text-left space-y-4 shadow-sm">
                        <div>
                            <h3 className="text-lg font-bold font-kufi mb-1">À propos de l&apos;ouvrage</h3>
                            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                                {description.description}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold font-kufi mb-1 text-primary">Importance</h3>
                            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                                {description.importance}
                            </p>
                        </div>
                    </div>
                )}

                <p className="text-muted-foreground pt-4 block">Sommaire des chapitres</p>
            </header>


            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                {sections.map((section) => (
                    <Link
                        key={section.id}
                        href={`/hadith/${book}/section/${section.id}`}
                        className="group block"
                    >
                        <div className="bg-card border hover:border-primary/50 transition-all rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md h-full flex flex-col justify-between">
                            <div className="space-y-2">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Chapitre {section.id}
                                </span>
                                <h3 className="text-lg font-semibold font-kufi text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                    {section.title}
                                </h3>
                            </div>
                            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground bg-muted/50 p-2 rounded-lg">
                                <span>Hadiths {section.details?.hadithnumber_first} - {section.details?.hadithnumber_last}</span>
                                <span>Lire &rarr;</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    );
}
