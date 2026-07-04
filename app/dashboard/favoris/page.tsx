import { auth } from "@/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getAyahsData } from "@/app/search/actions";
import FavorisUnified from "@/components/dashboard/FavorisUnified";
import type { HydratedBookmark } from "@/components/dashboard/FavorisClient";
import type { ISavedHadith, ISavedArticle } from "@/models/User";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mes favoris" };

export default async function FavorisPage() {
    const session = await auth();
    if (!session?.user?.email) redirect("/login");

    await dbConnect();
    const user = await User.findOne({ email: session.user.email })
        .select("bookmarks savedHadiths savedArticles")
        .lean();

    // ── Versets ──────────────────────────────────────────────────────────────
    const rawBookmarks = (user?.bookmarks ?? []) as { surah: number; ayah: number; addedAt: Date }[];
    const ayahsData = rawBookmarks.length
        ? await getAyahsData(rawBookmarks.map(b => ({ surah: b.surah, ayah: b.ayah })))
        : [];

    const verses: HydratedBookmark[] = rawBookmarks
        .map((b): HydratedBookmark | null => {
            const d = ayahsData.find((a: any) => a.surah === b.surah && a.ayah === b.ayah);
            if (!d) return null;
            return {
                surah: b.surah,
                ayah: b.ayah,
                text: d.text,
                translation: d.translation,
                surahName: d.surahName,
                addedAt: new Date(b.addedAt).toISOString(),
            };
        })
        .filter((b): b is HydratedBookmark => b !== null)
        .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());

    // ── Hadiths ───────────────────────────────────────────────────────────────
    const hadiths: ISavedHadith[] = ((user as any)?.savedHadiths ?? []) as ISavedHadith[];

    // ── Articles ──────────────────────────────────────────────────────────────
    const articles: ISavedArticle[] = ((user as any)?.savedArticles ?? []) as ISavedArticle[];

    return (
        <FavorisUnified
            initialVerses={JSON.parse(JSON.stringify(verses))}
            initialHadiths={JSON.parse(JSON.stringify(hadiths))}
            initialArticles={JSON.parse(JSON.stringify(articles))}
        />
    );
}
