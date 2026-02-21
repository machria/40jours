import fs from 'fs/promises';
import path from 'path';
import FlashcardsClient from './FlashcardsClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Flashcards Hisn al-Muslim - Apprentissage",
    description: "Révisez et mémorisez les invocations de la Citadelle du Musulman avec notre système de flashcards intelligent.",
};

export default async function FlashcardsPage() {
    // Read data directly on the server to save Vercel Compute & Transfer
    const filePath = path.join(process.cwd(), 'data/hisn/fra-hisn.json');
    let playlist = [];

    try {
        const fileContents = await fs.readFile(filePath, 'utf8');
        const categories = JSON.parse(fileContents);

        // Flatten data
        playlist = categories.flatMap((cat: any) =>
            cat.hadiths.map((h: any) => ({
                ...h,
                categoryTitle: cat.title
            }))
        );
    } catch (error) {
        console.error('Error reading Hisn quiz data:', error);
    }

    return <FlashcardsClient initialPlaylist={playlist} />;
}

