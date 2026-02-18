import { NextResponse } from 'next/server';
import { getCollection, getCollectionsList } from '@/lib/hadith-api';
import { CollectionName, Hadith } from '@/types/hadith';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const count = parseInt(searchParams.get('count') || '10');
        const collectionsList = getCollectionsList();

        const randomHadiths: (Hadith & { book: string; bookName: string; chapterTitle?: string })[] = [];

        // We want to pick `count` random hadiths.
        // Strategy:
        // 1. Randomly pick a book.
        // 2. Load basic info if needed (we rely on server cache in getCollection).
        // 3. Pick a random hadith from that book.
        // Repeat.

        // Use a loop to pick items.
        // Note: Loading a book takes time/memory, so we might want to be smart.
        // But for < 20 items, just hitting the cached server function is mostly fine 
        // as long as the server has enough RAM to hold the JSONs once loaded.

        // To avoid loading ALL books effectively at once if random picks cover all of them,
        // we can try to pick from a subset of loaded books? No, true random is better.
        // The file system cache in `lib/hadith-api` will handle repeated loads.

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

        return NextResponse.json(randomHadiths, {
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
            }
        });
    } catch (error) {
        console.error('Error fetching random hadiths:', error);
        return NextResponse.json({ error: 'Failed to fetch random hadiths' }, { status: 500 });
    }
}
