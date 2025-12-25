import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Cache the data in memory for this server instance
let quranData: Record<number, any[]> | null = null;

function loadQuranData() {
    if (quranData) return quranData;
    const filePath = path.join(process.cwd(), 'data', 'quran-data.json');
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        quranData = JSON.parse(fileContent);
        return quranData;
    } catch (error) {
        console.error('Error loading Quran data:', error);
        return null;
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ pageNumber: string }> }
) {
    const { pageNumber } = await params;
    const page = parseInt(pageNumber, 10);

    if (isNaN(page) || page < 1 || page > 604) {
        return NextResponse.json({ error: 'Invalid page number' }, { status: 400 });
    }

    const data = loadQuranData();

    if (!data || !data[page]) {
        return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Mimic the structure expected by the client if possible, or return a simplified one
    // Client expects: { data: { ayahs: [...] } } roughly
    // The data I saved is `pages[page] = [ayahs]`.
    // So I will wrap it.

    return NextResponse.json({
        code: 200,
        status: 'OK',
        data: {
            number: page,
            ayahs: data[page]
        }
    });
}
