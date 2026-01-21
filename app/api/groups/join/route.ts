import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import Group from "@/models/Group";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { code } = body;

        if (!code) {
            return NextResponse.json({ error: "Code is required" }, { status: 400 });
        }

        await dbConnect();
        const user = await User.findOne({ email: session.user.email });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const group = await Group.findOne({ code: code.toUpperCase() });
        if (!group) {
            return NextResponse.json({ error: "Groupe introuvable" }, { status: 404 });
        }

        // Check if already member
        const isMember = group.members.some((m: any) => m.toString() === user._id.toString());
        if (isMember) {
            return NextResponse.json({ error: "Vous êtes déjà membre de ce groupe" }, { status: 400 });
        }

        // Add to group
        group.members.push(user._id);
        await group.save();

        // Add to user
        if (!user.groups) user.groups = [];
        user.groups.push(group._id);
        await user.save();

        return NextResponse.json({ success: true, groupId: group._id });

    } catch (error) {
        console.error("Join Group Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
