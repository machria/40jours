import { NextRequest, NextResponse } from 'next/server';
import { translateText } from '@/lib/translator';

export async function POST(request: NextRequest) {
  try {
    const { text, sourceLang = 'auto', targetLang = 'fr' } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Missing text' }, { status: 400 });
    }

    const translation = await translateText(text, sourceLang, targetLang);

    return NextResponse.json({ translation });

  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
