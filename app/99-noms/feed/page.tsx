import { namesOfAllah } from '@/data/names';
import NomsFeedClient from './NomsFeedClient';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
    title: 'Les 99 Noms d\'Allah — Méditation',
    description: 'Découvrez les 99 noms d\'Allah un par un, en mode immersif.',
};

export default function NomsFeedPage() {
    return <NomsFeedClient names={namesOfAllah} />;
}
