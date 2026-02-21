import { getCollection, getCollectionsList } from '@/lib/hadith-api';
import { CollectionName, Hadith } from '@/types/hadith';
import FlashcardsClient from './FlashcardsClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Flashcards Aléatoires - Hadiths",
    description: "Découvrez des hadiths authentiques au hasard pour enrichir votre quotidien.",
};

// Force dynamic so that the random selection runs fresh on each visit
export const dynamic = 'force-dynamic';

export default async function HadithFlashcardsPage() {
    const randomHadiths: (Hadith & { book: string; bookName: string; chapterTitle?: string })[] = [];

    try {
        const collectionsList = getCollectionsList();
        const count = 50; // Load 50 ahead of time

        for (let i = 0; i < count; i++) {
            const randomBook = collectionsList[Math.floor(Math.random() * collectionsList.length)];
            const collection = await getCollection(randomBook.id as CollectionName);

            if (collection && collection.hadiths.length > 0) {
                const randomHadithIndex = Math.floor(Math.random() * collection.hadiths.length);
                const hadith = collection.hadiths[randomHadithIndex];

                // Find chapter title
                const chapterId = hadith.reference.book;
                const chapterTitle = collection.metadata.sections[chapterId] || '';

                randomHadiths.push({
                    ...hadith,
                    book: randomBook.id,
                    bookName: randomBook.name,
                    chapterTitle
                });
            }
        }
    } catch (error) {
        console.error('Error fetching random hadiths:', error);
    }

    return <FlashcardsClient initialPlaylist={randomHadiths} />;
}
