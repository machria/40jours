import { plan40jours, ReadingDay } from "@/data/plan40jours";
import { notFound } from "next/navigation";
import TafsirFullClient from "./TafsirFullClient";
import { Ayah, getQuranPage } from "@/lib/quranApi";

// Generate static params for all 40 days
export function generateStaticParams() {
    return plan40jours.map((day) => ({
        id: day.jour.toString(),
    }));
}

async function getDayAyahs(day: ReadingDay): Promise<Ayah[]> {
    const start = day.startPage;
    const end = day.endPage;

    // Fetch ALL pages in parallel
    const pagePromises = [];
    for (let p = start; p <= end; p++) {
        pagePromises.push(getQuranPage(p));
    }
    const pages = await Promise.all(pagePromises);
    return pages.flatMap(p => p.ayahs);
}

export default async function FullTafsirPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const dayId = parseInt(id);
    const dayPlan = plan40jours.find(d => d.jour === dayId);

    if (!dayPlan) {
        notFound();
    }

    // Server-side fetching of verses only
    const ayahs = await getDayAyahs(dayPlan);

    return (
        <main className="min-h-screen bg-background">
            <TafsirFullClient day={dayPlan} ayahs={ayahs} />
        </main>
    );
}
