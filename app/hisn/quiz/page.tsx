import fs from 'fs/promises';
import path from 'path';
import HisnQuizClient from './HisnQuizClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Quiz Hisn al-Muslim - Testez vos connaissances",
    description: "Apprenez ludiquement les invocations de la Citadelle du Musulman en jouant à notre quiz interactif.",
};

export default async function HisnQuizPage() {
    // Server-side data read to avoid client fetching overhead
    const filePath = path.join(process.cwd(), 'data/hisn/fra-hisn.json');
    let data = [];

    try {
        const fileContents = await fs.readFile(filePath, 'utf8');
        data = JSON.parse(fileContents);
    } catch (error) {
        console.error('Error reading Hisn quiz data:', error);
    }

    return <HisnQuizClient initialData={data} />;
}

