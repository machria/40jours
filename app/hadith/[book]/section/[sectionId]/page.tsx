import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSectionHadiths, getCollectionMetadata, getCollectionsList } from '@/lib/hadith-api';
import { CollectionName } from '@/types/hadith';

interface PageProps {
    params: Promise<{ book: string; sectionId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { book, sectionId } = await params;
    const collections = getCollectionsList();
    const collectionInfo = collections.find(c => c.id === book);

    if (!collectionInfo) {
        return { title: 'Hadith non trouvé' };
    }

    try {
        const metadata = await getCollectionMetadata(book as CollectionName);
        const sectionName = metadata.sections[sectionId];
        return {
            title: `${collectionInfo.name} - ${sectionName || 'Chapitre ' + sectionId}`,
        };
    } catch (e) {
        return { title: 'Hadith' };
    }
}

export default async function SectionPage({ params }: PageProps) {
    const resolvedParams = await params;
    const { book, sectionId } = resolvedParams;

    const collections = getCollectionsList();
    if (!collections.some(c => c.id === book)) {
        notFound();
    }

    const [hadiths, metadata] = await Promise.all([
        getSectionHadiths(book as CollectionName, sectionId),
        getCollectionMetadata(book as CollectionName)
    ]);

    if (!hadiths || hadiths.length === 0) {
        // It's possible the section exists but has no hadiths, or sectionId is invalid
        // If sectionId is not in metadata, it's definitely 404
        if (!metadata.sections[sectionId]) {
            notFound();
        }
    }

    const sectionName = metadata.sections[sectionId];

    // Calculate specific navigation
    const sectionIds = Object.keys(metadata.sections)
        .filter(k => metadata.sections[k]) // Filter empty
        .sort((a, b) => parseInt(a) - parseInt(b));

    const currentIndex = sectionIds.indexOf(sectionId);
    const prevId = currentIndex > 0 ? sectionIds[currentIndex - 1] : null;
    const nextId = currentIndex < sectionIds.length - 1 ? sectionIds[currentIndex + 1] : null;

    return (
        <main className="min-h-screen p-4 md:p-8">
            <header className="mb-8 text-center space-y-4 max-w-4xl mx-auto">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                    <Link href="/hadith" className="hover:text-primary">Hadiths</Link>
                    <span>/</span>
                    <Link href={`/hadith/${book}`} className="hover:text-primary">{metadata.name}</Link>
                    <span>/</span>
                    <span className="font-semibold text-foreground">Chapitre {sectionId}</span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold font-kufi text-primary">{sectionName}</h1>
            </header>

            <div className="max-w-3xl mx-auto space-y-6">
                {hadiths.map((hadith) => (
                    <div key={hadith.hadithnumber} id={`h${hadith.hadithnumber}`} className="bg-card border rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4 border-b pb-4">
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
                                Hadith {hadith.hadithnumber}
                            </span>
                            {hadith.arabicnumber && (
                                <span className="text-muted-foreground text-xs">
                                    Arabe: {hadith.arabicnumber}
                                </span>
                            )}
                        </div>
                        <div className="prose dark:prose-invert max-w-none">
                            <p className="text-lg leading-relaxed whitespace-pre-wrap font-serif">
                                {hadith.text}
                            </p>
                        </div>
                        <div className="mt-4 pt-4 border-t text-sm text-muted-foreground flex flex-wrap gap-2">
                            {hadith.grades && hadith.grades.length > 0 ? (
                                hadith.grades.map((g, i) => (
                                    <span key={i} className="bg-muted px-2 py-1 rounded">
                                        {g.name}: <span className={
                                            g.grade.toLowerCase().includes('sahih') ? 'text-green-600 font-bold' :
                                                g.grade.toLowerCase().includes('hasan') ? 'text-emerald-500 font-bold' :
                                                    g.grade.toLowerCase().includes('daif') || g.grade.toLowerCase().includes('weak') ? 'text-orange-500 font-bold' :
                                                        ''
                                        }>{g.grade}</span>
                                    </span>
                                ))
                            ) : (
                                (book === 'bukhari' || book === 'muslim') && (
                                    <span className="bg-muted px-2 py-1 rounded">
                                        Degré: <span className="text-green-600 font-bold">Sahih</span>
                                    </span>
                                )
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="max-w-3xl mx-auto mt-12 flex items-center justify-between gap-4">
                {prevId ? (
                    <Link
                        href={`/hadith/${book}/section/${prevId}`}
                        className="flex-1 bg-muted hover:bg-muted/80 text-center py-3 rounded-lg transition-colors border"
                    >
                        &larr; Précédent
                    </Link>
                ) : <div className="flex-1"></div>}

                {nextId ? (
                    <Link
                        href={`/hadith/${book}/section/${nextId}`}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-center py-3 rounded-lg transition-colors shadow-lg shadow-primary/20"
                    >
                        Suivant &rarr;
                    </Link>
                ) : <div className="flex-1"></div>}
            </div>
        </main>
    );
}
