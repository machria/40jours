import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }

    try {
        const filePath = path.join(process.cwd(), 'data', 'surah-details.json');

        if (!fs.existsSync(filePath)) {
            return NextResponse.json(null);
        }

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        const surahData = data[id];

        if (!surahData) {
            return NextResponse.json(null);
        }

        return NextResponse.json(surahData);
    } catch (error) {
        console.error('Error fetching surah details:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
