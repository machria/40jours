import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import Group from "@/models/Group";
import User from "@/models/User";
import { NextResponse } from "next/server";
import crypto from 'crypto';

// Helper to generate a random 6-character code
function generateGroupCode(): string {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, description } = body;

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        await dbConnect();
        const user = await User.findOne({ email: session.user.email });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        let code = generateGroupCode();
        let isUnique = false;

        // Ensure uniqueness (simple retry loop)
        while (!isUnique) {
            const existing = await Group.findOne({ code });
            if (!existing) isUnique = true;
            else code = generateGroupCode();
        }

        const group = new Group({
            name,
            description: description || "Challenge des 30 jours",
            code,
            admin: user._id,
            members: [user._id]
        });
        await group.save();

        // Add to user's groups
        if (!user.groups) user.groups = [];
        user.groups.push(group._id);
        await user.save();

        return NextResponse.json(group);

    } catch (error) {
        console.error("Create Group Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const session = await auth();
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findOne({ email: session.user.email });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // Find groups where user is a member
        const groups = await Group.find({ members: user._id })
            .sort({ createdAt: -1 })
            .select('name code description members createdAt');

        // Enhance with member count
        const enhancedGroups = groups.map(g => ({
            ...g.toObject(),
            memberCount: g.members.length
        }));

        return NextResponse.json(enhancedGroups);

    } catch (error) {
        console.error("List Groups Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
