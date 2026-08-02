import { getSurahTafsir } from '@/app/actions/tafsir';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, ExternalLink } from 'lucide-react';
import { TajwidText } from '@/components/TajwidText';
import TafsirSourceSelector from '@/components/TafsirSourceSelector';
import fs from 'fs/promises';
import path from 'path';
import { Metadata } from 'next';

async function getSurahMeta(surahId: number) {
    try {
        const p = path.join(process.cwd(), 'data', 'surahs.json');
        try {
            const file = await fs.readFile(p, 'utf-8');
            return JSON.parse(file).find((s: any) => s.number === surahId);
        } catch {
            const altP = path.join(process.cwd(), 'public', 'surahs.json');
            const file = await fs.readFile(altP, 'utf-8');
            return JSON.parse(file).find((s: any) => s.number === surahId);
        }
    } catch (e) {
        return null;
    }
}

export async function generateStaticParams() {
    return Array.from({ length: 114 }, (_, i) => ({
        id: (i + 1).toString(),
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const surahId = parseInt(id);
    const meta = await getSurahMeta(surahId);

    if (!meta) {
        return { title: 'Tafsir - Coran 40 Jours' };
    }

    return {
        title: `Tafsir - Sourate ${meta.englishName}`,
        description: `Explication complète et comparatif des 4 Tafsirs (Al-Mukhtasar, As-Sa'di, Al-Jalalayn, Ibn Kathir) pour la Sourate ${meta.englishName}.`,
    };
}

async function getAyahsForSurah(surahId: number) {
    try {
        let indexPath = path.join(process.cwd(), 'data', 'ayah-location.json');
        try {
            await fs.access(indexPath);
        } catch {
            indexPath = path.join(process.cwd(), 'public', 'ayah-location.json');
        }
        const indexContent = await fs.readFile(indexPath, 'utf-8');
        const index = JSON.parse(indexContent);

        const pages = new Set<number>();
        for (const key in index) {
            if (key.startsWith(`${surahId}:`)) {
                pages.add(index[key]);
            }
        }

        const sortedPages = Array.from(pages).sort((a, b) => a - b);
        let surahAyahs: any[] = [];

        for (const pNum of sortedPages) {
            let pPath = path.join(process.cwd(), 'data', 'quran', 'pages', `${pNum}.json`);
            try {
                await fs.access(pPath);
            } catch {
                pPath = path.join(process.cwd(), 'public', 'quran', 'pages', `${pNum}.json`);
            }
            try {
                const pContent = await fs.readFile(pPath, 'utf-8');
                const pageData = JSON.parse(pContent);
                const matches = pageData.filter((a: any) => a.surah === surahId);
                surahAyahs.push(...matches);
            } catch (e) {
                console.error(`Missing page ${pNum}`, e);
            }
        }

        return surahAyahs.sort((a, b) => a.ayah - b.ayah);
    } catch (e) {
        console.error("Error loading Surah ayahs", e);
        return [];
    }
}

export default async function FullTafsirPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const surahId = parseInt(id);

    if (isNaN(surahId) || surahId < 1 || surahId > 114) {
        notFound();
    }

    // Par défaut, charger Al-Mukhtasar (Direct & Concis) pour une UX fluide
    const tafsirList = await getSurahTafsir(surahId, 'al_mukhtasar');
    const ayahs = await getAyahsForSurah(surahId);

    const combinedData = ayahs.map(ayah => {
        const tafsirEntry = tafsirList.find(t => t.ayah === ayah.ayah);
        return {
            ...ayah,
            tafsir: tafsirEntry?.tafsir
        };
    });

    const groupedData: { tafsir: string | undefined; ayahs: typeof combinedData }[] = [];
    let currentGroup: { tafsir: string | undefined; ayahs: typeof combinedData } | null = null;

    combinedData.forEach(item => {
        if (!currentGroup) {
            currentGroup = {
                tafsir: item.tafsir,
                ayahs: [item]
            };
        } else if (item.tafsir === currentGroup.tafsir && item.tafsir) {
            currentGroup.ayahs.push(item);
        } else {
            groupedData.push(currentGroup);
            currentGroup = {
                tafsir: item.tafsir,
                ayahs: [item]
            };
        }
    });
    if (currentGroup) {
        groupedData.push(currentGroup);
    }

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href={`/coran/${surahId}`}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold font-kufi flex items-center gap-2">
                            <BookOpen className="w-6 h-6 text-primary" />
                            Exégèse & Tafsirs - Sourate {surahId}
                        </h1>
                        <p className="text-muted-foreground">Changez de Tafsir en un clic sur chaque verset</p>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-12">
                    {groupedData.map((group, groupIndex) => (
                        <div key={groupIndex} className="scroll-mt-24" id={`ayah-${group.ayahs[0].ayah}`}>

                            {/* Group Header (Ayahs) */}
                            <div className="bg-muted/30 p-6 rounded-t-xl border-b border-border/50 space-y-8">
                                {group.ayahs.map((item, i) => (
                                    <div key={item.id} className={i > 0 ? "pt-8 border-t border-border/30" : ""}>
                                        <div className="flex justify-between items-start mb-4">
                                            <Link
                                                href={`/coran/${surahId}#ayah-${item.ayah}`}
                                                className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium hover:bg-primary/20 transition-colors flex items-center gap-2 group"
                                            >
                                                Verset {item.ayah}
                                                <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                                            </Link>
                                        </div>
                                        <TajwidText
                                            text={item.text}
                                            className="text-2xl md:text-3xl font-kufi text-right dir-rtl leading-[2.5] block text-foreground mb-4"
                                        />
                                        <p className="text-lg text-muted-foreground mt-2 font-serif">
                                            {item.translation}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Tafsir Body with Selector */}
                            <div className="bg-card p-6 md:p-8 rounded-b-xl border border-t-0 shadow-sm">
                                <TafsirSourceSelector
                                    surah={surahId}
                                    ayah={group.ayahs[0].ayah}
                                    initialTafsir={group.tafsir || 'Aucune explication disponible.'}
                                    initialSourceId="al_mukhtasar"
                                />
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
