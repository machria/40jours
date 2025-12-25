import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    await dbConnect();
                    const email = credentials.email as string;
                    const password = credentials.password as string;

                    let user = await User.findOne({ email });

                    if (!user) {
                        await bcrypt.hash(password, 10);
                        user = await User.create({
                            email,
                            name: email.split('@')[0],
                            dailyProgress: {},
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        });
                    }

                    await bcrypt.compare(password, user.password || "");

                    return { id: user._id.toString(), email: user.email, name: user.name };
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            },
        }),
    ],
});
