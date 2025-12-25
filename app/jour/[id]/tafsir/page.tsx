import { plan40jours, ReadingDay } from "@/data/plan40jours";
import { notFound } from "next/navigation";
import TafsirFullClient from "./TafsirFullClient";
import { Ayah, getQuranPage, getTafsir } from "@/lib/quranApi";

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
    // Since it's local file access via API route (or simulated), it's fast.
    const pagePromises = [];
    for (let p = start; p <= end; p++) {
        pagePromises.push(getQuranPage(p));
    }
    const pages = await Promise.all(pagePromises);
    const allAyahs = pages.flatMap(p => p.ayahs);

    // 2. Fetch Tafsirs in Parallel
    // We can be aggressive here on Server
    const totalAyahs = allAyahs.length;
    // We map all to promises. Direct translation function uses chunks, it's safe.
    // However, thousands of translations might be too much for the free Endpoint all at once?
    // Let's do batches of 10 to be safe but faster than 5.
    const BATCH_SIZE = 10;
    const tafsirResults: { ay: Ayah, content: string }[] = [];

    for (let i = 0; i < totalAyahs; i += BATCH_SIZE) {
        const batch = allAyahs.slice(i, i + BATCH_SIZE);
        const promises = batch.map(async (ay) => {
            // This now calls translateText directly without HTTP
            const content = await getTafsir(ay.surahNumber, ay.numberInSurah) || "Tafsir non disponible.";
            return { ay, content };
        });
        const results = await Promise.all(promises);
        tafsirResults.push(...results);
    }

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
