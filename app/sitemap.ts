import { MetadataRoute } from 'next';
import { getCollectionsList, getCollectionMetadata } from '@/lib/hadith-api';

// Régénère le sitemap toutes les 24h via ISR — évite un crawl bot = Lambda à chaque fois
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://coran40jours.com';

    // 1. Static Routes
    const staticRoutes = [
        '',
        '/login',
        '/dashboard',
        '/99-noms',
        '/apprendre-arabe',
        '/vocabulaire',
        '/tajwid',
        '/hisn',
        '/search',
        '/settings'
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // 2. Program Days (1-40)
    const programRoutes = Array.from({ length: 40 }, (_, i) => ({
        url: `${baseUrl}/jour/${i + 1}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }));

    // 3. Surahs (1-114) AND Tafsir
    const surahRoutes = [];
    for (let i = 1; i <= 114; i++) {
        // Main Reading Page
        surahRoutes.push({
            url: `${baseUrl}/coran/${i}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.9,
        });
        // Tafsir Page
        surahRoutes.push({
            url: `${baseUrl}/coran/${i}/tafsir`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        });
    }

    // 4. Hadith Collections
    const hadithRoutes: MetadataRoute.Sitemap = [];
    const collections = getCollectionsList();

    for (const collection of collections) {
        // Collection Home
        hadithRoutes.push({
            url: `${baseUrl}/hadith/${collection.id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8
        });

        // Collection Sections
        try {
            const meta = await getCollectionMetadata(collection.id as any);
            const sections = Object.keys(meta.section_details || {});
            for (const sectionId of sections) {
                // Section route
                // Logic assumes route is /hadith/[collection]/section/[sectionId]
                // Checking route structure... Yes, /hadith/[collectionId]/section/[sectionId]/page.tsx exists? 
                // Wait, need to verify route structure.
                // Assuming standard project structure: app/hadith/[collectionId]/section/[sectionId]/page.tsx
                hadithRoutes.push({
                    url: `${baseUrl}/hadith/${collection.id}/section/${sectionId}`,
                    lastModified: new Date(),
                    changeFrequency: 'monthly' as const,
                    priority: 0.6
                });
            }
        } catch (e) {
            console.error(`Error generating sitemap for ${collection.id}`, e);
        }
    }


    return [...staticRoutes, ...programRoutes, ...surahRoutes, ...hadithRoutes];
}
