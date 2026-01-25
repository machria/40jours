import { plan40jours, ReadingDay } from "@/data/plan40jours";
import { notFound } from "next/navigation";
import TafsirFullClient from "./TafsirFullClient";
import { Ayah, getQuranPage } from "@/lib/quranApi";
import { getTafsirBatch } from "@/app/actions/tafsir";

// Generate static params for all 40 days
export function generateStaticParams() {
    return plan40jours.map((day) => ({
        id: day.jour.toString(),
    }));
}

interface TafsirGroup {
    ayahs: Ayah[];
    tafsirContent: string;
    id: string;
}

// Helper to check equality
const areTafsirsEqual = (t1: string, t2: string) => {
    return t1.trim() === t2.trim();
};

async function getFullDayTafsir(day: ReadingDay): Promise<TafsirGroup[]> {
    const start = day.startPage;
    const end = day.endPage;

    // 1. Fetch ALL pages in parallel (Local JSON is fast)
    const pagePromises = [];
    for (let p = start; p <= end; p++) {
        pagePromises.push(getQuranPage(p));
    }
    const pages = await Promise.all(pagePromises);
    const allAyahs = pages.flatMap(p => p.ayahs);

    // 2. Fetch Tafsir locally in one go
    // Prepare the list of requested Ayahs
    const requestedAyahs = allAyahs.map(ay => ({ surah: ay.surahNumber, ayah: ay.numberInSurah }));

    // Call server action
    const tafsirs = await getTafsirBatch(requestedAyahs);

    // Map results back to ayahs
    // Create lookup map
    const tafsirMap = new Map<string, string>();
    tafsirs.forEach(t => tafsirMap.set(`${t.surah}:${t.ayah}`, t.tafsir));

    const tafsirResults = allAyahs.map(ay => ({
        ay,
        content: tafsirMap.get(`${ay.surahNumber}:${ay.numberInSurah}`) || "Tafsir non disponible."
    }));

    // 3. Deduplicate
    const groups: TafsirGroup[] = [];
    let currentGroup: TafsirGroup | null = null;

    tafsirResults.forEach(({ ay, content }) => {
        if (currentGroup && areTafsirsEqual(currentGroup.tafsirContent, content)) {
            currentGroup.ayahs.push(ay);
        } else {
            if (currentGroup) groups.push(currentGroup);
            currentGroup = {
                ayahs: [ay],
                tafsirContent: content,
                id: `${ay.surahNumber}-${ay.numberInSurah}`
            };
        }
    });
    if (currentGroup) groups.push(currentGroup);

    return groups;
}

export default async function FullTafsirPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const dayId = parseInt(id);
    const dayPlan = plan40jours.find(d => d.jour === dayId);

    if (!dayPlan) {
        notFound();
    }

    // Server-side fetching
    // This will run on request.
    const tafsirGroups = await getFullDayTafsir(dayPlan);

    return (
        <main className="min-h-screen bg-background">
            <TafsirFullClient day={dayPlan} initialGroups={tafsirGroups} />
        </main>
    );
}
