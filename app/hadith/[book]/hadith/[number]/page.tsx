import { redirect, notFound } from 'next/navigation';
import { getCollectionMetadata } from '@/lib/hadith-api';
import type { CollectionName } from '@/types/hadith';

interface PageProps {
    params: Promise<{ book: string; number: string }>;
}

export default async function HadithRedirectPage({ params }: PageProps) {
    const { book, number } = await params;
    const n = parseInt(number, 10);

    if (isNaN(n)) notFound();

    let metadata;
    try {
        metadata = await getCollectionMetadata(book as CollectionName);
    } catch {
        notFound();
    }

    const sectionId = Object.entries(metadata.section_details).find(
        ([, d]) => n >= d.hadithnumber_first && n <= d.hadithnumber_last
    )?.[0];

    if (!sectionId) notFound();

    redirect(`/hadith/${book}/section/${sectionId}#h${n}`);
}
