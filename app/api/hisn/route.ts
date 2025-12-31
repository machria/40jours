import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

// Define the type for the category summary
type HisnCategorySummary = {
    id: number;
    title: string;
    hadithCount: number;
};

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'data/hisn/fra-hisn.json');
        const fileContents = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(fileContents);

        // Return only necessary data for the list view
        const categories: HisnCategorySummary[] = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            hadithCount: item.hadiths.length,
        }));

        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error reading Hisn data:', error);
        return NextResponse.json(
            { error: 'Failed to load Hisn data' },
            { status: 500 }
        );
    }
}
