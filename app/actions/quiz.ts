
'use server';

import { auth } from "@/auth";
import User from "@/models/User";
import dbConnect from "@/lib/db";

export async function saveHighScore(quizId: string, score: number) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return { error: "User not authenticated" };
        }

        await dbConnect();

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return { error: "User not found" };
        }

        const currentHighScore = user.quizScores?.get(quizId) || 0;

        if (score > currentHighScore) {
            if (!user.quizScores) {
                user.quizScores = new Map();
            }
            user.quizScores.set(quizId, score);
            await user.save();
            return { success: true, highScore: score, newRecord: true };
        }

        return { success: true, highScore: currentHighScore, newRecord: false };

    } catch (error) {
        console.error("Error saving high score:", error);
        return { error: "Failed to save high score" };
    }
}

export async function getHighScore(quizId: string) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return { highScore: 0 };
        }

        await dbConnect();
        const user = await User.findOne({ email: session.user.email });

        return { highScore: user?.quizScores?.get(quizId) || 0 };

    } catch (error) {
        console.error("Error fetching high score:", error);
        return { highScore: 0 };
    }
}
