import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Calculate aggregated stats
        const totalDays = 40;
        // Handle Map or Object depending on hydration, but with Interface change it is Map
        const progressMap = user.dailyProgress instanceof Map ? user.dailyProgress : new Map(Object.entries(user.dailyProgress || {}));
        const completedDays = Array.from(progressMap.values()).filter(Boolean).length;
        const progressPercent = Math.round((completedDays / totalDays) * 100);

        // Convert Map to plain object for JSON
        const dailyProgressObj = Object.fromEntries(progressMap);

        return NextResponse.json({
            progressPercent,
            completedDays,
            streak: user.streak || 0,
            dailyProgress: dailyProgressObj,
            userName: user.name
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { dayId, completed } = body;

        await dbConnect();

        // Use findOne first to get the document instance
        const user = await User.findOne({ email: session.user.email });

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // Ensure dailyProgress exists
        if (!user.dailyProgress) {
            user.dailyProgress = new Map();
        }

        // Mongoose Map set
        user.dailyProgress.set(dayId.toString(), completed);

        await user.save();

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
