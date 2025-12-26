
import { getTafsirBatch } from '@/app/actions/tafsir';
import { getJuz } from '@/lib/juzData';
import { getQuranPage } from '@/lib/quranApi';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { TajwidText } from '@/components/TajwidText';

interface PageProps {
    params: Promise<{ id: string }>
}

export async function generateStaticParams() {
    return Array.from({ length: 30 }, (_, i) => ({
        id: (i + 1).toString(),
    }));
}

export default async function JuzTafsirPage({ params }: PageProps) {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    const juz = getJuz(id);

    if (!juz) {
        notFound();
    }

    // 1. Fetch Ayahs
    let allAyahs: any[] = [];
    const promises = [];
    for (let p = juz.startPage; p <= juz.endPage; p++) {
        promises.push(getQuranPage(p));
    }
    const pages = await Promise.all(promises);
    pages.forEach(page => {
        const juzAyahs = page.ayahs.filter(a => a.juz === id);
        allAyahs = [...allAyahs, ...juzAyahs];
    });

    // 2. Fetch Tafsir Batch
    const ayahKeys = allAyahs.map(a => ({ surah: a.surahNumber, ayah: a.numberInSurah }));
    const tafsirEntries = await getTafsirBatch(ayahKeys);

    // Create a local Map for O(1) lookup
    const tafsirMap = new Map<string, string>();
    tafsirEntries.forEach(t => {
        tafsirMap.set(`${t.surah}:${t.ayah}`, t.tafsir);
    });

    // 3. Merge
    const combinedData = allAyahs.map(ayah => {
        const key = `${ayah.surahNumber}:${ayah.numberInSurah}`;
        return {
            ...ayah,
            tafsir: tafsirMap.get(key)
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
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href={`/juz/${id}`}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold font-kufi flex items-center gap-2">
                            <BookOpen className="w-6 h-6 text-primary" />
                            Tafsir - Juz {id}
                        </h1>
                        <p className="text-muted-foreground">Explication complète du Juz (Pages {juz.startPage}-{juz.endPage})</p>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-12">
                    {groupedData.map((group, groupIndex) => {
                        // Check for Surah change (based on first ayah in group)
                        const firstAyah = group.ayahs[0];
                        const prevGroup = groupIndex > 0 ? groupedData[groupIndex - 1] : null;
                        const prevAyah = prevGroup ? prevGroup.ayahs[prevGroup.ayahs.length - 1] : null;

                        const isNewSurah = prevAyah && prevAyah.surahNumber !== firstAyah.surahNumber;

                        return (
                            <div key={groupIndex}>
                                {isNewSurah && (
                                    <div className="my-8 pt-8 border-t text-center">
                                        <h2 className="text-xl font-bold text-primary bg-primary/5 inline-block px-4 py-2 rounded-lg">Sourate {firstAyah.surahNumber}</h2>
                                    </div>
                                )}

                                <div className="scroll-mt-24" id={`ayah-${firstAyah.numberInSurah}`}>
                                    {/* Group Header (Ayahs) */}
                                    <div className="bg-muted/30 p-6 rounded-t-xl border-b border-border/50 space-y-8">
                                        {group.ayahs.map((item, i) => (
                                            <div key={item.number} className={i > 0 ? "pt-8 border-t border-border/30" : ""}>
                                                <div className="flex justify-between items-start mb-4">
                                                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                                                        Sourate {item.surahNumber} : Verset {item.numberInSurah}
                                                    </span>
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
                                                <p className="text-muted-foreground italic">Aucune explication disponible pour ce verset.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
