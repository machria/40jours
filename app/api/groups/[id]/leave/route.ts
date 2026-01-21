import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import Group from "@/models/Group";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const session = await auth();
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const user = await User.findOne({ email: session.user.email });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const group = await Group.findById(params.id);
        if (!group) return NextResponse.json({ error: "Group not found" }, { status: 404 });

        // Check if user is member
        const memberIndex = group.members.findIndex((m: any) => m.toString() === user._id.toString());
        if (memberIndex === -1) {
            return NextResponse.json({ error: "Not a member of this group" }, { status: 400 });
        }

        // Remove from group members
        group.members.splice(memberIndex, 1);

        // Handle Admin Logic
        if (group.admin.toString() === user._id.toString()) {
            if (group.members.length > 0) {
                // Transfer admin to the first remaining member
                group.admin = group.members[0];
            } else {
                // No members left, delete the group
                await Group.findByIdAndDelete(group._id);

                // Also remove from user's groups list and return
                user.groups = user.groups.filter((g: any) => g.toString() !== group._id.toString());
                await user.save();

                return NextResponse.json({ success: true, message: "Group deleted as it became empty" });
            }
        }

        // Save group if not deleted
        await group.save();

        // Remove from user's groups list
        user.groups = user.groups.filter((g: any) => g.toString() !== group._id.toString());
        await user.save();

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Leave Group Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
