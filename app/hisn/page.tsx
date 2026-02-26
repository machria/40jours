import fs from 'fs/promises';
import path from 'path';
import HisnClient from './HisnClient';
import { Metadata } from 'next';

// Contenu 100% statique — jamais revalidé, servi depuis le CDN
export const revalidate = false;

export const metadata: Metadata = {
    title: "Citadelle du Musulman (Hisn al-Muslim) - Invocations",
    description: "Recueil complet des invocations et prières (Du'a) authentiques de la Citadelle du Musulman en arabe, phonétique et français.",
};

export default async function HisnPage() {
    // Read data directly on the server to save Vercel Compute & Transfer
    const filePath = path.join(process.cwd(), 'data/hisn/fra-hisn.json');
    let categories = [];

    try {
        const fileContents = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(fileContents);

        categories = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            hadithCount: item.hadiths.length,
        }));
    } catch (error) {
        console.error('Error reading Hisn data:', error);
        // Handle gracefully, maybe return an empty array or throw an error to be caught by an error.tsx boundary
    }

    return <HisnClient categories={categories} />;
}
