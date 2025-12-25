import { Metadata } from 'next';
import { plan40jours } from '@/data/plan40jours';
import ReadingClient from './ReadingClient';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const dayId = parseInt(id);
    const dayPlan = plan40jours.find(d => d.jour === dayId);

    if (!dayPlan) return { title: 'Jour Inconnu' };

    return {
        title: `Jour ${dayId} - Lecture du Coran`,
        description: `Lecture du Coran Jour ${dayId}: ${dayPlan.sourates}. Défi Coran 40 Jours.`,
        openGraph: {
            title: `Jour ${dayId} - Coran 40 Jours`,
            description: `Rejoignez-moi pour la lecture du Jour ${dayId}: ${dayPlan.sourates} sur Coran 40 Jours.`,
            images: ['/og-image.jpg'] // We could generate dynamic OG images later
        }
    };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ReadingClient dayId={parseInt(id)} />;
}
