import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSectionHadiths, getCollectionMetadata, getCollectionsList } from '@/lib/hadith-api';
import { CollectionName } from '@/types/hadith';
import HadithList from '@/components/hadith/HadithList';

interface PageProps {
    params: Promise<{ book: string; sectionId: string }>;
}

export async function generateStaticParams() {
    const collections = getCollectionsList();
    const paramsList = [];

    for (const collection of collections) {
        const metadata = await getCollectionMetadata(collection.id as CollectionName);
        // Use section_details to only generate param for sections that actually exist on disk
        const sectionIds = Object.keys(metadata.section_details || {});
        for (const sectionId of sectionIds) {
            paramsList.push({
                book: collection.id,
                sectionId: sectionId,
            });
        }
    }
    return paramsList;
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
                <div className="max-w-3xl mx-auto space-y-6">
                    <HadithList
                        hadiths={hadiths}
                        book={book}
                        prevSection={prevId ? { id: prevId, url: `/hadith/${book}/section/${prevId}` } : undefined}
                        nextSection={nextId ? { id: nextId, url: `/hadith/${book}/section/${nextId}` } : undefined}
                    />
                </div>
            </div>


        </main>
    );
}
