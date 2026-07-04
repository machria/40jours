'use client';

import HadithSwipeFeed, { type FeedHadith } from '@/components/hadith/HadithSwipeFeed';
import { Hadith } from '@/types/hadith';

type FlashcardHadith = Hadith & {
    collectionName?: string;
    bookName?: string;
    chapterTitle?: string;
};

const COLLECTION_LABELS: Record<string, string> = {
    bukhari: 'Sahih al-Bukhari',
    muslim: 'Sahih Muslim',
    nasai: "Sunan an-Nasa'i",
    abudawud: 'Sunan Abu Dawud',
    tirmidhi: 'Jami at-Tirmidhi',
    ibnmajah: 'Sunan Ibn Majah',
    malik: 'Muwatta Malik',
};

interface ThematicFlashcardClientProps {
    initialPlaylist: FlashcardHadith[];
    themeTitle: string;
    themeEmoji: string;
}

export default function ThematicFlashcardClient({ initialPlaylist, themeTitle, themeEmoji }: ThematicFlashcardClientProps) {
    const hadiths: FeedHadith[] = initialPlaylist.map((h) => ({
        hadithnumber: h.hadithnumber,
        arabic: h.arabic,
        text: h.text,
        grades: h.grades,
        collectionId: h.collectionName,
        bookName: h.collectionName ? (COLLECTION_LABELS[h.collectionName] ?? h.collectionName) : h.bookName,
        chapterTitle: h.chapterTitle,
    }));

    return (
        <HadithSwipeFeed
            hadiths={hadiths}
            backHref="/hadith/themes"
            backLabel="Univers Hadith"
            badgeLabel={themeTitle}
            badgeEmoji={themeEmoji}
        />
    );
}
