import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findOne({ email: session.user.email }).select('bookmarks');

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ bookmarks: user.bookmarks || [] }, {
            headers: { 'Cache-Control': 'private, max-age=30, stale-while-revalidate=60' }
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { surah, ayah, action } = body;

        if (
            typeof surah !== 'number' || surah < 1 || surah > 114 ||
            typeof ayah !== 'number' || ayah < 1 ||
            (action !== 'add' && action !== 'remove')
        ) {
            return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
        }

        await dbConnect();
        const user = await User.findOne({ email: session.user.email });

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        if (!user.bookmarks) user.bookmarks = [];

        if (action === 'add') {
            const exists = user.bookmarks.some((b) => b.surah === surah && b.ayah === ayah);
            if (!exists) {
                user.bookmarks.push({ surah, ayah, addedAt: new Date() });
            }
        } else {
            user.bookmarks = user.bookmarks.filter((b) => !(b.surah === surah && b.ayah === ayah));
        }

        await user.save();

        return NextResponse.json({ success: true, bookmarks: user.bookmarks });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
