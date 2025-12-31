import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'data/hisn/fra-hisn.json');
        const fileContents = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(fileContents);

        // Return the full data as is, since we need everything for the quiz
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error reading Hisn data for quiz:', error);
        return NextResponse.json(
            { error: 'Failed to load Hisn data' },
            { status: 500 }
        );
    }
}
