import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getAyahsData } from "@/app/search/actions";
import FavorisClient, { HydratedBookmark } from "@/components/dashboard/FavorisClient";

export default async function FavorisPage() {
    const session = await auth();
    if (!session?.user?.email) {
        redirect("/login");
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email }).select('bookmarks').lean();
    const bookmarks = (user?.bookmarks ?? []) as { surah: number; ayah: number; addedAt: Date }[];

    const ayahsData = await getAyahsData(bookmarks.map(b => ({ surah: b.surah, ayah: b.ayah })));

    const hydrated: HydratedBookmark[] = bookmarks
        .map((b): HydratedBookmark | null => {
            const details = ayahsData.find((a: any) => a.surah === b.surah && a.ayah === b.ayah);
            if (!details) return null;
            return {
                surah: b.surah,
                ayah: b.ayah,
                text: details.text,
                translation: details.translation,
                surahName: details.surahName,
                addedAt: new Date(b.addedAt).toISOString(),
            };
        })
        .filter((b): b is HydratedBookmark => b !== null)
        .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b p-4">
                <div className="max-w-2xl mx-auto flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-muted rounded-full">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-xl font-bold">Mes favoris</h1>
                </div>
            </header>

            <main className="p-4 md:p-8 max-w-2xl mx-auto">
                <FavorisClient initialBookmarks={JSON.parse(JSON.stringify(hydrated))} />
            </main>
        </div>
    );
}
