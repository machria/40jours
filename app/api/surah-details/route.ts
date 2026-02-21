import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    try {
        const filePath = path.join(process.cwd(), 'data', 'surah-details.json');

        if (!fs.existsSync(filePath)) {
            return NextResponse.json(null);
        }

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(fileContent);

        // If no ID provided, return all surahs
        if (!id) {
            return NextResponse.json(data, {
                headers: { 'Cache-Control': 'public, s-maxage=31536000, stale-while-revalidate=86400' }
            });
        }

        // If ID provided, return specific surah
        const surahData = data[id];

        if (!surahData) {
            return NextResponse.json(null);
        }

        return NextResponse.json(surahData, {
            headers: { 'Cache-Control': 'public, s-maxage=31536000, stale-while-revalidate=86400' }
        });
    } catch (error) {
        console.error('Error fetching surah details:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
