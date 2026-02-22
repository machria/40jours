import { getRandomHadithFromCollection, getCollectionsList } from '@/lib/hadith-api';
import { CollectionName, Hadith } from '@/types/hadith';
import FlashcardsClient from './FlashcardsClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Flashcards Aléatoires - Hadiths",
    description: "Découvrez des hadiths authentiques au hasard pour enrichir votre quotidien.",
};

// ISR : regénère toutes les heures côté origin (CDN garde la page en cache entre-temps)
export const revalidate = 3600;

export default async function HadithFlashcardsPage() {
    const randomHadiths: (Hadith & { book: string; bookName: string; chapterTitle?: string })[] = [];

    try {
        const collectionsList = getCollectionsList();
        const count = 50;

        await Promise.all(
            Array.from({ length: count }, async () => {
                const randomBook = collectionsList[Math.floor(Math.random() * collectionsList.length)];
                const result = await getRandomHadithFromCollection(randomBook.id as CollectionName);
                if (result) {
                    randomHadiths.push({
                        ...result.hadith,
                        book: randomBook.id,
                        bookName: randomBook.name,
                        chapterTitle: result.chapterTitle,
                    });
                }
            })
        );
    } catch (error) {
        console.error('Error fetching random hadiths:', error);
    }

    return <FlashcardsClient initialPlaylist={randomHadiths} />;
}
