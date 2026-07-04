import { readFileSync } from 'fs';
import { join } from 'path';
import SiraFeed from '@/components/sira/SiraFeed';
import { SIRA_ENRICHED } from '@/data/sira-enriched';

export const revalidate = false;

export const metadata = {
    title: 'Sira — Feed · Coran 40 Jours',
    description: "Parcourez la biographie du Prophète Muhammad ﷺ épisode par épisode, du début de la Révélation jusqu'aux grandes victoires de l'Islam.",
};

export default function SiraFeedPage() {
    const rawEvents = JSON.parse(
        readFileSync(join(process.cwd(), 'public', 'data', 'seerah-fr.json'), 'utf-8')
    );
    const quizQuestions = JSON.parse(
        readFileSync(join(process.cwd(), 'public', 'data', 'sira-quiz.json'), 'utf-8')
    );

    // Merge enriched narrative text into events
    const events = rawEvents.map((e: { title: string; commentary: string[] }) => {
        const enriched = SIRA_ENRICHED[e.title];
        return enriched ? { ...e, commentary: [enriched] } : e;
    });

    return <SiraFeed events={events} quizQuestions={quizQuestions} />;
}
