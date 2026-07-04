import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email })
        .select('likedHadiths savedHadiths savedArticles');

    return NextResponse.json(
        {
            liked:         user?.likedHadiths    ?? [],
            saved:         user?.savedHadiths    ?? [],
            savedArticles: user?.savedArticles   ?? [],
        },
        { headers: { 'Cache-Control': 'private, no-store' } }
    );
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json() as {
        type: 'like' | 'save' | 'article';
        key?: string;
        slug?: string;
        snapshot?: {
            // hadith snapshot
            text?: string;
            bookName?: string;
            hadithnumber?: number;
            collectionId?: string;
            // article snapshot
            title?: string;
            category?: string;
            excerpt?: string;
        };
    };

    const { type, key, slug, snapshot } = body;
    if (!type || (!key && !slug)) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email })
        .select('likedHadiths savedHadiths savedArticles');
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (type === 'like' && key) {
        const idx = user.likedHadiths.indexOf(key);
        if (idx === -1) user.likedHadiths.push(key);
        else user.likedHadiths.splice(idx, 1);

    } else if (type === 'save' && key) {
        const idx = user.savedHadiths.findIndex(s => s.key === key);
        if (idx === -1 && snapshot) {
            user.savedHadiths.push({
                key,
                text:         snapshot.text         ?? '',
                bookName:     snapshot.bookName      ?? '',
                hadithnumber: snapshot.hadithnumber  ?? 0,
                collectionId: snapshot.collectionId  ?? '',
                savedAt:      new Date(),
            });
        } else if (idx !== -1) {
            user.savedHadiths.splice(idx, 1);
        }

    } else if (type === 'article' && slug) {
        const idx = user.savedArticles.findIndex(a => a.slug === slug);
        if (idx === -1 && snapshot) {
            user.savedArticles.push({
                slug,
                title:    snapshot.title    ?? '',
                category: snapshot.category ?? '',
                excerpt:  snapshot.excerpt  ?? '',
                savedAt:  new Date(),
            });
        } else if (idx !== -1) {
            user.savedArticles.splice(idx, 1);
        }
    }

    await user.save();
    return NextResponse.json({ ok: true });
}
