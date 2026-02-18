
import { NextRequest, NextResponse } from 'next/server';
import { HADITH_THEMES } from '@/lib/hadith-themes';
import { getSectionHadiths } from '@/lib/hadith-api';
import { Hadith } from '@/types/hadith';

// Priority order: 'bukhari', 'muslim', 'nasai', 'tirmidhi', 'malik', 'ibnmajah', 'abudawud'
const COLLECTION_WEIGHTS: Record<string, number> = {
    'bukhari': 100,
    'muslim': 80,
    'nasai': 60,
    'tirmidhi': 50,
    'malik': 40,
    'ibnmajah': 30,
    'abudawud': 20
};

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const themeId = searchParams.get('id');
    const count = parseInt(searchParams.get('count') || '10', 10);

    if (!themeId) {
        return NextResponse.json({ error: 'Theme ID is required' }, { status: 400 });
    }

    const theme = HADITH_THEMES.find(t => t.id === themeId);
    if (!theme) {
        return NextResponse.json({ error: 'Invalid Theme ID' }, { status: 404 });
    }

    try {
        // Strategy: Weighted Random Selection
        // We want to pick multiple sections (e.g. 3) to load hadiths from.
        // We want to favor high-priority collections but still allow others to appear (lower probability).

        const numSectionsToLoad = Math.min(theme.sections.length, 3);
        const selectedSections: typeof theme.sections = [];
        let availableSections = [...theme.sections];

        for (let i = 0; i < numSectionsToLoad; i++) {
            if (availableSections.length === 0) break;

            // Calculate total weight of valid available sections
            const totalWeight = availableSections.reduce((sum, section) => {
                return sum + (COLLECTION_WEIGHTS[section.collection] || 10);
            }, 0);

            let randomValue = Math.random() * totalWeight;
            let selectedIndex = -1;

            for (let j = 0; j < availableSections.length; j++) {
                const weight = COLLECTION_WEIGHTS[availableSections[j].collection] || 10;
                randomValue -= weight;
                if (randomValue <= 0) {
                    selectedIndex = j;
                    break;
                }
            }

            // Fallback (should normally not happen due to math, but safe guard)
            if (selectedIndex === -1) selectedIndex = availableSections.length - 1;

            selectedSections.push(availableSections[selectedIndex]);
            availableSections.splice(selectedIndex, 1); // Remove to avoid duplicate section selection (variety)
        }

        const pool: Hadith[] = [];

        // Load hadiths from selected sections
        await Promise.all(selectedSections.map(async (sec) => {
            // A "section" in our theme definition might have multiple sectionIds (e.g. ['1', '2'])
            // We pick ONE random sectionId from this group to keep the fetch light.
            const randomSectionId = sec.sectionIds[Math.floor(Math.random() * sec.sectionIds.length)];
            const loaded = await getSectionHadiths(sec.collection, randomSectionId);

            // Add metadata
            loaded.forEach(h => {
                (h as any).collectionName = sec.collection;
                // If we want to be very strict about "not showing the same hadith", 
                // we would need client-side tracking, but backend shuffling helps.
            });
            pool.push(...loaded);
        }));

        // Shuffle pool
        const shuffled = pool.sort(() => 0.5 - Math.random());

        // Take N
        const result = shuffled.slice(0, count);

        return NextResponse.json(result, {
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
            }
        });

    } catch (error) {
        console.error('Error fetching thematic hadiths:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
