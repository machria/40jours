'use server';

import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { revalidatePath } from "next/cache";

type QuizType = 'hisn' | 'arabic' | 'vocabulary';

export async function saveGenericQuizScore(type: QuizType, score: number) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return { success: false, error: "Unauthorized" };
        }

        await dbConnect();
        const user = await User.findOne({ email: session.user.email });
        if (!user) return { success: false, error: "User not found" };

        let updated = false;

        switch (type) {
            case 'hisn':
                if (score > (user.hisnQuizBestScore || 0)) {
                    user.hisnQuizBestScore = score;
                    updated = true;
                }
                break;
            case 'arabic':
                if (score > (user.arabicQuizBestScore || 0)) {
                    user.arabicQuizBestScore = score;
                    updated = true;
                }
                break;
            case 'vocabulary':
                if (score > (user.vocabularyQuizBestScore || 0)) {
                    user.vocabularyQuizBestScore = score;
                    updated = true;
                }
                break;
        }

        if (updated) {
            await user.save();
            revalidatePath('/dashboard');
            return { success: true, score, updated: true };
        }

        return { success: true, score, updated: false };

    } catch (error) {
        console.error("Error saving quiz score:", error);
        return { success: false, error: "Internal Server Error" };
    }
}
