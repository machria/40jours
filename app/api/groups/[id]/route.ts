import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import Group from "@/models/Group";
import User, { IUser } from "@/models/User"; // Ensure IUser is exported from models/User
import { calculateStreak } from "@/lib/streak-utils";
import { NextResponse } from "next/server";

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const session = await auth();
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        console.log("DetailsAPI: DB Connected");


        // Verify user is in the group (security)
        const user = await User.findOne({ email: session.user.email });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const group = await Group.findById(params.id)
            .populate({
                path: 'members',
                select: 'name image dailyProgress completedJuzs streak activityHistory'
            })
            .lean();
        console.log("DetailsAPI: Group found", group ? group.name : "null");


        if (!group) return NextResponse.json({ error: "Group not found" }, { status: 404 });

        // Access control: User must be a member
        const isMember = group.members.some((m: any) => m._id.toString() === user._id.toString());
        if (!isMember) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        // Transform members to leaderboard format
        const leaderboard = group.members.map((member: any) => {
            // Handle Map or Object for dailyProgress
            const progressMap = member.dailyProgress instanceof Map
                ? member.dailyProgress
                : new Map(Object.entries(member.dailyProgress || {}));

            const daysCompleted = Array.from(progressMap.values()).filter(Boolean).length;

            return {
                id: member._id,
                name: member.name || "Utilisateur",
                image: member.image,
                daysCompleted,
                streak: calculateStreak(member.activityHistory)
            };
        });

        // Sort by score
        leaderboard.sort((a: any, b: any) => b.daysCompleted - a.daysCompleted);

        return NextResponse.json({
            group: {
                id: group._id,
                name: group.name,
                code: group.code,
                description: group.description,
                isAdmin: group.admin.toString() === user._id.toString(),
            },
            leaderboard
        }, {
            headers: { 'Cache-Control': 'private, no-store' }
        });

    } catch (error) {
        console.error("Get Group Details Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
