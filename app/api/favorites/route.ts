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
    const user = await User.findOne({ email: session.user.email }).select('likedHadiths savedHadiths');

    return NextResponse.json(
        {
            liked: user?.likedHadiths ?? [],
            saved: user?.savedHadiths ?? [],
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
        type: 'like' | 'save';
        key: string;
        snapshot?: {
            text: string;
            bookName: string;
            hadithnumber: number;
            collectionId: string;
        };
    };

    const { type, key, snapshot } = body;
    if (!type || !key) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email }).select('likedHadiths savedHadiths');
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (type === 'like') {
        const idx = user.likedHadiths.indexOf(key);
        if (idx === -1) {
            user.likedHadiths.push(key);
        } else {
            user.likedHadiths.splice(idx, 1);
        }
    } else if (type === 'save') {
        const idx = user.savedHadiths.findIndex(s => s.key === key);
        if (idx === -1 && snapshot) {
            user.savedHadiths.push({
                key,
                text:         snapshot.text,
                bookName:     snapshot.bookName,
                hadithnumber: snapshot.hadithnumber,
                collectionId: snapshot.collectionId,
                savedAt:      new Date(),
            });
        } else if (idx !== -1) {
            user.savedHadiths.splice(idx, 1);
        }
    }

    await user.save();
    return NextResponse.json({ ok: true });
}
