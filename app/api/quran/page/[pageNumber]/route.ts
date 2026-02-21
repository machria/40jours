import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Use public directory as stable source in production (populated by postinstall/build script)
const DATA_DIR = path.join(process.cwd(), 'public', 'quran', 'pages');

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ pageNumber: string }> }
) {
    const { pageNumber } = await params;
    const page = parseInt(pageNumber, 10);

    if (isNaN(page) || page < 1 || page > 604) {
        return NextResponse.json({ error: 'Invalid page number' }, { status: 400 });
    }

    const filePath = path.join(DATA_DIR, `${page}.json`);

    try {
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        }

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const pageAyahs = JSON.parse(fileContent);

        return NextResponse.json({
            code: 200,
            status: 'OK',
            data: {
                number: page,
                ayahs: pageAyahs
            }
        }, {
            headers: { 'Cache-Control': 'public, s-maxage=31536000, stale-while-revalidate=86400' }
        });
    } catch (error) {
        console.error(`Error loading Quran page ${page}:`, error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
