'use server';

import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function saveQuizScore(score: number) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return { success: false, error: "Not authenticated" };
        }

        await dbConnect();

        // Ideally, we only update if the new score is greater than the existing one.
        // However, the caller might want to check this logic too.
        // Here we strictly update if higher.

        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return { success: false, error: "User not found" };
        }

        const currentBest = user.vocabularyQuizBestScore || 0;

        if (score > currentBest) {
            user.vocabularyQuizBestScore = score;
            await user.save();
            return { success: true, newBest: true, score: score };
        }

        return { success: true, newBest: false, score: currentBest };

    } catch (error) {
        console.error("Error saving score:", error);
        return { success: false, error: "Internal Error" };
    }
}

export async function getBestScore() {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return { success: false, score: 0 };
        }

        await dbConnect();
        const user = await User.findOne({ email: session.user.email }).select('vocabularyQuizBestScore');

        return { success: true, score: user?.vocabularyQuizBestScore || 0 };

    } catch (error) {
        console.error("Error fetching score:", error);
        return { success: false, score: 0 };
    }
}
