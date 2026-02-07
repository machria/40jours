import { getSurahTafsir, TafsirSource } from '@/app/actions/tafsir';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, ExternalLink, Library } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { TajwidText } from '@/components/TajwidText';
import fs from 'fs/promises';
import path from 'path';
import { Metadata } from 'next';
import { cn } from '@/lib/utils';

async function getSurahMeta(surahId: number) {
    try {
        const p = path.join(process.cwd(), 'public', 'surahs.json');
        const file = await fs.readFile(p, 'utf-8');
        const surahs = JSON.parse(file);
        return surahs.find((s: any) => s.number === surahId);
    } catch (e) {
        return null;
    }
}

export async function generateMetadata({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
    const { id } = await params;
    const { source } = await searchParams;
    const surahId = parseInt(id);
    const meta = await getSurahMeta(surahId);

    let sourceName = 'Ibn Kathir';
    if (source === 'al-jalalayn') sourceName = 'Al-Jalalayn';
    if (source === 'asbab-al-nuzul') sourceName = 'Asbab al-Nuzul';
    if (source === 'ibn-kathir-en') sourceName = 'Ibn Kathir (Spa5k)';
    if (source === 'maarif-ul-quran') sourceName = 'Maarif-ul-Quran';

    if (!meta) {
        return { title: `Tafsir ${sourceName} - Coran 40 Jours` };
    }

    return {
        title: `Tafsir ${sourceName} - Sourate ${meta.englishName}`,
        description: `Explication complète (Tafsir ${sourceName}) de la Sourate ${meta.englishName} (${meta.englishNameTranslation}). Comprendre le sens des versets du Coran.`,
    };
}

// Helper to get Ayahs for a Surah (Serverside)
async function getAyahsForSurah(surahId: number) {
    try {
        const indexPath = path.join(process.cwd(), 'public', 'ayah-location.json');
        const indexContent = await fs.readFile(indexPath, 'utf-8');
        const index = JSON.parse(indexContent);

        // Find pages for this surah
        const pages = new Set<number>();
        // Optimization: Keys are "surah:ayah"
        for (const key in index) {
            if (key.startsWith(`${surahId}:`)) {
                pages.add(index[key]);
            }
        }

        const sortedPages = Array.from(pages).sort((a, b) => a - b);

        let surahAyahs: any[] = [];

        for (const pNum of sortedPages) {
            const pPath = path.join(process.cwd(), 'public', 'quran', 'pages', `${pNum}.json`);
            try {
                const pContent = await fs.readFile(pPath, 'utf-8');
                const pageData = JSON.parse(pContent);
                // Filter verses for this surah
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

export default async function FullTafsirPage({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>,
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { id } = await params;
    const sp = await searchParams;
    let currentSource = (sp.source || 'ibn-kathir') as TafsirSource;
    if (!['ibn-kathir', 'al-jalalayn', 'asbab-al-nuzul', 'ibn-kathir-en', 'maarif-ul-quran'].includes(currentSource)) {
        currentSource = 'ibn-kathir';
    }

    const surahId = parseInt(id);

    if (isNaN(surahId) || surahId < 1 || surahId > 114) {
        notFound();
    }

    const tafsirList = await getSurahTafsir(surahId, currentSource);
    const ayahs = await getAyahsForSurah(surahId);

    // Merge them
    const combinedData = ayahs.map(ayah => {
        const tafsirEntry = tafsirList.find(t => t.ayah === ayah.ayah);
        return {
            ...ayah,
            tafsir: tafsirEntry?.tafsir
        };
    });

    // Group consecutive verses with same Tafsir
    const groupedData: { tafsir: string | undefined; ayahs: typeof combinedData }[] = [];
    let currentGroup: { tafsir: string | undefined; ayahs: typeof combinedData } | null = null;

    combinedData.forEach(item => {
        if (!currentGroup) {
            currentGroup = {
                tafsir: item.tafsir,
                ayahs: [item]
            };
        } else if (item.tafsir === currentGroup.tafsir && item.tafsir) {
            // Only group if tafsir exists and is identical
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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/coran/${surahId}`}
                            className="p-2 hover:bg-muted rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold font-kufi flex items-center gap-2">
                                <BookOpen className="w-6 h-6 text-primary" />
                                Tafsir - Sourate {surahId}
                            </h1>
                            <p className="text-muted-foreground">Explication complète de la sourate</p>
                        </div>
                    </div>

                    {/* Source Selector */}
                    <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg border border-border/50 overflow-x-auto">
                        <Link
                            href={`/coran/${surahId}/tafsir`}
                            className={cn(
                                "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap",
                                currentSource === 'ibn-kathir'
                                    ? "bg-background shadow-sm text-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                            )}
                        >
                            <Library className="w-4 h-4" />
                            Ibn Kathir
                        </Link>
                        <Link
                            href={`/coran/${surahId}/tafsir?source=al-jalalayn`}
                            className={cn(
                                "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap",
                                currentSource === 'al-jalalayn'
                                    ? "bg-background shadow-sm text-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                            )}
                        >
                            <BookOpen className="w-4 h-4" />
                            Al-Jalalayn
                        </Link>
                        <Link
                            href={`/coran/${surahId}/tafsir?source=asbab-al-nuzul`}
                            className={cn(
                                "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap",
                                currentSource === 'asbab-al-nuzul'
                                    ? "bg-background shadow-sm text-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                            )}
                        >
                            <BookOpen className="w-4 h-4" />
                            Asbab al-Nuzul
                        </Link>
                        <Link
                            href={`/coran/${surahId}/tafsir?source=ibn-kathir-en`}
                            className={cn(
                                "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap",
                                currentSource === 'ibn-kathir-en'
                                    ? "bg-background shadow-sm text-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                            )}
                        >
                            <BookOpen className="w-4 h-4" />
                            Ibn Kathir (Spa5k)
                        </Link>
                        <Link
                            href={`/coran/${surahId}/tafsir?source=maarif-ul-quran`}
                            className={cn(
                                "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap",
                                currentSource === 'maarif-ul-quran'
                                    ? "bg-background shadow-sm text-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                            )}
                        >
                            <BookOpen className="w-4 h-4" />
                            Maarif-ul-Quran
                        </Link>
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

                            {/* Tafsir Body (Shared) */}
                            <div className="bg-card p-6 md:p-8 rounded-b-xl border border-t-0 shadow-sm">
                                <div className="prose dark:prose-invert max-w-none prose-lg">
                                    {group.tafsir ? (
                                        <ReactMarkdown>{group.tafsir}</ReactMarkdown>
                                    ) : (
                                        <p className="text-muted-foreground italic">Aucune explication disponible pour ce verset (ou non traduite).</p>
                                    )}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
