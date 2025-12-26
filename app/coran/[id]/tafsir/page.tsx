import { getSurahTafsir } from '@/app/actions/tafsir';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { TajwidText } from '@/components/TajwidText';
import { getQuranPage } from '@/lib/quranApi'; // We might need this to get Ayah text, or we can fetch it separately. 
// Actually, getSurahTafsir only returns tafsir text. We ideally want the Ayah text too.
// Let's import quran data logic or separate it. 
// For now, let's just display the Tafsir indexed by Ayah number. 
// Enhancing it to show Ayah text would be better. Let's try to get Ayahs too.

import fs from 'fs/promises';
import path from 'path';

// Helper to get Ayahs for a Surah (Serverside)
async function getAyahsForSurah(surahId: number) {
    const filePath = path.join(process.cwd(), 'data', 'quran-data.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const allPages = JSON.parse(fileContent);

    let surahAyahs: any[] = [];
    // Iterate pages to find ayahs for this surah
    Object.values(allPages).forEach((page: any) => {
        page.forEach((ayah: any) => {
            if (ayah.surah === surahId) {
                surahAyahs.push(ayah);
            }
        });
    });
    return surahAyahs.sort((a, b) => a.ayah - b.ayah);
}

export default async function FullTafsirPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const surahId = parseInt(id);

    if (isNaN(surahId) || surahId < 1 || surahId > 114) {
        notFound();
    }

    const tafsirList = await getSurahTafsir(surahId);
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
                            Tafsir - Sourate {surahId}
                        </h1>
                        <p className="text-muted-foreground">Explication complète de la sourate</p>
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
                                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                                                Verset {item.ayah}
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
                    ))}
                </div>
            </div>
        </div>
    );
}
