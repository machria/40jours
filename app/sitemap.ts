import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://coran40jours.com'; // Replace with actual domain

    // Static routes
    const routes = [
        '',
        '/login',
        '/dashboard',
        '/99-noms',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic routes (Days 1-40)
    const days = Array.from({ length: 40 }, (_, i) => ({
        url: `${baseUrl}/jour/${i + 1}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const, // Content might not change but user progress does
        priority: 0.9,
    }));

    return [...routes, ...days];
}
