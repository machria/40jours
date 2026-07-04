import { articles } from '@/data/advice';
import DecouvrirClient from './DecouvrirClient';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
    title: 'Découvrir — Conseils & Sagesse',
    description: 'Swipez pour découvrir des articles spirituels, des sagesses et des conseils pratiques pour votre cheminement islamique.',
};

// Articles prioritaires en haut du feed (les plus accrocheurs)
const PRIORITY_SLUGS = [
    'destin-qadar-pour-les-nuls',
    'hasad-maladie-invisible',
    'mort-preparatifs-manuel-croyant',
    '3-moments-dua-rejetee',
    'barzakh-vie-tombe-resurrection',
    'riya-ostentation-ennemi-invisible',
    'ijaz-coran-miracle-inimitabilite',
    'dhikr-neurosciences-science-confirme-rappel-allah',
    'ghazali-alchimie-bonheur-connaissance-soi',
    'isra-miraj-voyage-nocturne-prophete',
    'anxiete-tristesse-remedes',
    'secrets-istijaba-invocation',
    'deep-work-spirituel',
    '5-histoires-echec-coran',
    'puissance-istighfar-debloquer-destin',
];

export default function DecouvrirPage() {
    const priority = PRIORITY_SLUGS
        .map(slug => articles.find(a => a.slug === slug))
        .filter(Boolean) as typeof articles;

    const rest = articles.filter(a => !PRIORITY_SLUGS.includes(a.slug));

    const ordered = [...priority, ...rest];

    return <DecouvrirClient articles={ordered} />;
}
