import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { checkBadges } from "@/lib/gamification";
import { calculateStreak } from "@/lib/streak-utils";
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
        // Handle Map or Object depending on hydration
        const progressMap = user.dailyProgress instanceof Map ? user.dailyProgress : new Map(Object.entries(user.dailyProgress || {}));
        const completedDays = Array.from(progressMap.values()).filter(Boolean).length;
        const progressPercent = Math.round((completedDays / totalDays) * 100);

        // Convert Map to plain object for JSON
        const dailyProgressObj = Object.fromEntries(progressMap);

        // Calculate dynamic streak based on actual history
        // This ensures that if a user missed a day, they see 0 immediately
        const currentStreak = calculateStreak(user.activityHistory);

        return NextResponse.json({
            progressPercent,
            completedDays,
            streak: currentStreak,
            dailyProgress: dailyProgressObj,
            userName: user.name,
            completedJuzs: user.completedJuzs || []
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
        const { dayId, completed, juzId } = body;

        await dbConnect();

        const user = await User.findOne({ email: session.user.email });

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // Handle Juz Completion
        if (juzId) {
            if (!user.completedJuzs) user.completedJuzs = [];

            let newBadgesAdded: string[] = [];

            if (completed) {
                // Add if not exists
                if (!user.completedJuzs.includes(juzId)) {
                    user.completedJuzs.push(juzId);
                }

                // Ensure activityHistory exists
                if (!user.activityHistory) {
                    user.activityHistory = new Map();
                }

                // Update Activity History
                const today = new Date().toISOString().split('T')[0];
                const currentCount = user.activityHistory.get(today) || 0;
                user.activityHistory.set(today, currentCount + 1);

                // Update Streak
                user.streak = calculateStreak(user.activityHistory);

                // Check Badges
                const potentialBadges = checkBadges(user);
                if (potentialBadges.length > 0) {
                    if (!user.badges) user.badges = [];
                    potentialBadges.forEach(badgeId => {
                        user.badges.push({ id: badgeId, unlockedAt: new Date() });
                    });
                    newBadgesAdded = potentialBadges;
                }

            } else {
                // Remove if exists
                user.completedJuzs = user.completedJuzs.filter((id: number) => id !== juzId);
            }

            await user.save();
            return NextResponse.json({
                success: true,
                completedJuzs: user.completedJuzs,
                newBadges: newBadgesAdded,
                newStreak: user.streak
            });
        }

        // Handle Day Completion (Existing Logic)
        if (dayId) {
            // Ensure dailyProgress exists
            if (!user.dailyProgress) {
                user.dailyProgress = new Map();
            }

            // Mongoose Map set
            user.dailyProgress.set(dayId.toString(), completed);

            // Ensure activityHistory exists (for existing users who don't have this field yet)
            if (!user.activityHistory) {
                user.activityHistory = new Map();
            }

            // Update Activity History
            if (completed) {
                const today = new Date().toISOString().split('T')[0];
                const currentCount = user.activityHistory.get(today) || 0;
                user.activityHistory.set(today, currentCount + 1);
            }

            // Update Streak
            user.streak = calculateStreak(user.activityHistory);

            // Check Badges
            const newBadges = checkBadges(user);
            if (newBadges.length > 0) {
                if (!user.badges) user.badges = [];
                newBadges.forEach(badgeId => {
                    user.badges.push({ id: badgeId, unlockedAt: new Date() });
                });
            }

            await user.save();

            return NextResponse.json({ success: true, newBadges, newStreak: user.streak });
        }

        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
