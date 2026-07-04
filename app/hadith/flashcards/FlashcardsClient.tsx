'use client';

import HadithSwipeFeed, { type FeedHadith } from '@/components/hadith/HadithSwipeFeed';
import { Hadith } from '@/types/hadith';

type FlashcardHadith = Hadith & {
    book: string;
    bookName: string;
    chapterTitle?: string;
};

interface FlashcardsClientProps {
    initialPlaylist: FlashcardHadith[];
}

export default function FlashcardsClient({ initialPlaylist }: FlashcardsClientProps) {
    const hadiths: FeedHadith[] = initialPlaylist.map((h) => ({
        hadithnumber: h.hadithnumber,
        arabic: h.arabic,
        text: h.text,
        grades: h.grades,
        collectionId: h.book,
        bookName: h.bookName,
        chapterTitle: h.chapterTitle,
    }));

    return (
        <HadithSwipeFeed
            hadiths={hadiths}
            backHref="/hadith"
            backLabel="Hadiths"
            badgeLabel="Aléatoire"
            badgeEmoji="🔀"
        />
    );
}
