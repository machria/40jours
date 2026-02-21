import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const surahParams = searchParams.getAll('surah');

    if (!surahParams || surahParams.length === 0) {
        return NextResponse.json({ error: 'Missing surah parameters' }, { status: 400 });
    }

    const uniqueSurahs = Array.from(new Set(surahParams.map(s => parseInt(s))));
    const wbwData: any[] = [];

    uniqueSurahs.forEach(surah => {
        try {
            const wbwPath = path.join(process.cwd(), 'data', 'quran', 'word_by_word', `${surah}.json`);
            if (fs.existsSync(wbwPath)) {
                const data = JSON.parse(fs.readFileSync(wbwPath, 'utf-8'));
                // Add surah and ayah for easy matching
                const formattedData = data.map((ayah: any) => ({
                    ...ayah,
                    surah: surah,
                    ayah: parseInt(ayah.verse_key.split(':')[1])
                }));
                wbwData.push(...formattedData);
            }
        } catch (e) {
            console.error(`Failed to load wbw for surah ${surah}`, e);
        }
    });

    return NextResponse.json(wbwData);
}
