import { notFound } from 'next/navigation';
import { HADITH_THEMES } from '@/lib/hadith-themes';
import { getSectionHadiths, getCollectionsList } from '@/lib/hadith-api';
import ThematicFlashcardClient from './ThematicFlashcardClient';
import { Hadith } from '@/types/hadith';

type FlashcardHadith = Hadith & {
    collectionName?: string;
    bookName?: string;
    chapterTitle?: string;
};

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

export async function generateStaticParams() {
    return HADITH_THEMES.map((theme) => ({
        id: theme.id,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const theme = HADITH_THEMES.find(t => t.id === id);

    if (!theme) {
        return {
            title: 'Thème non trouvé',
        };
    }

    return {
        title: `${theme.emoji} ${theme.title} - Hadiths Thématiques`,
        description: theme.description,
    };
}

export default async function ThematicFlashcardPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: themeId } = await params;
    const theme = HADITH_THEMES.find(t => t.id === themeId);

    if (!theme) {
        notFound();
    }

    let playlist: FlashcardHadith[] = [];

    try {
        // Load up to 50 hadiths for the theme directly on the server
        const numSectionsToLoad = Math.min(theme.sections.length, 5);
        const selectedSections: typeof theme.sections = [];
        let availableSections = [...theme.sections];

        for (let i = 0; i < numSectionsToLoad; i++) {
            if (availableSections.length === 0) break;

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

            if (selectedIndex === -1) selectedIndex = availableSections.length - 1;

            selectedSections.push(availableSections[selectedIndex]);
            availableSections.splice(selectedIndex, 1);
        }

        const pool: FlashcardHadith[] = [];

        await Promise.all(selectedSections.map(async (sec) => {
            const randomSectionId = sec.sectionIds[Math.floor(Math.random() * sec.sectionIds.length)];
            const loaded = await getSectionHadiths(sec.collection, randomSectionId);

            loaded.forEach(h => {
                const fh = h as FlashcardHadith;
                fh.collectionName = sec.collection;
                pool.push(fh);
            });
        }));

        const shuffled = pool.sort(() => 0.5 - Math.random());
        playlist = shuffled.slice(0, 50); // Provide 50 statically loaded flashcards
    } catch (error) {
        console.error('Error fetching thematic hadiths on server:', error);
    }

    return <ThematicFlashcardClient initialPlaylist={playlist} themeTitle={theme.title} themeEmoji={theme.emoji} />;
}

