import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import HisnInvocationList from '@/components/hisn/HisnInvocationList';
import path from 'path';
import fs from 'fs/promises';
import { notFound } from 'next/navigation';

type Hadith = {
    id: number;
    arabic: string;
    french: string;
    source: string;
    repeat: number;
    audio?: string;
};

type HisnCategory = {
    id: number;
    title: string;
    hadiths: Hadith[];
};

// Helper to get data (Build time)
async function getHisnData(): Promise<HisnCategory[]> {
    const filePath = path.join(process.cwd(), 'data/hisn/fra-hisn.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
}

// Generate Static Params for all IDs
export async function generateStaticParams() {
    const data = await getHisnData();
    return data.map((category) => ({
        id: category.id.toString(),
    }));
}

export default async function HisnDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const idInt = parseInt(id);

    const data = await getHisnData();
    const category = data.find((c) => c.id === idInt);

    if (!category) {
        return notFound();
    }

    return (
        <div className="container py-8 px-4 max-w-4xl mx-auto">
            <div className="mb-6">
                <Link
                    href="/hisn"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Retour aux invocations
                </Link>
                <h1 className="text-2xl md:text-3xl font-bold leading-tight text-primary">
                    {category.title}
                </h1>
            </div>

            <HisnInvocationList hadiths={category.hadiths} categoryTitle={category.title} />
        </div>
    );
}
