import fs from 'fs/promises';
import path from 'path';
import { HadithCollection, CollectionName, Hadith, HadithMetadata } from '@/types/hadith';
import { SECTION_TRANSLATIONS } from './hadith-translations';

// Use public directory for stable access
const DATA_DIR = path.join(process.cwd(), 'public', 'hadith');

// In-memory cache for metadata to avoid reading file on every request
const metadataCache: Partial<Record<CollectionName, HadithMetadata>> = {};

const COLLECTIONS_LIST = [
    { id: 'bukhari', name: 'Sahih al-Bukhari' },
    { id: 'muslim', name: 'Sahih Muslim' },
    { id: 'nasai', name: 'Sunan an-Nasai' },
    { id: 'tirmidhi', name: 'Jami At-Tirmidhi' },
    { id: 'malik', name: 'Muwatta Malik' },
    { id: 'ibnmajah', name: 'Sunan Ibn Majah' },
    { id: 'abudawud', name: 'Sunan Abu Dawud' },
] as const;

export function getCollectionsList() {
    return COLLECTIONS_LIST;
}

export async function getCollectionMetadata(name: CollectionName): Promise<HadithMetadata> {
    if (metadataCache[name]) {
        return metadataCache[name]!;
    }

    // Load generated metadata (contains section_details)
    const metadataPath = path.join(DATA_DIR, name, 'metadata.json');
    let fileMetadata: { section_details: Record<string, any> } = { section_details: {} };

    try {
        const fileContent = await fs.readFile(metadataPath, 'utf-8');
        fileMetadata = JSON.parse(fileContent);
    } catch (e) {
        console.warn(`Could not load metadata for ${name} at ${metadataPath}`, e);
        // Fallback or empty if not generated yet
    }

    const collectionInfo = COLLECTIONS_LIST.find(c => c.id === name);
    const collectionName = collectionInfo ? collectionInfo.name : name;

    const metadata: HadithMetadata = {
        name: collectionName,
        sections: SECTION_TRANSLATIONS[name] || {},
        section_details: fileMetadata.section_details || {}
    };

    metadataCache[name] = metadata;
    return metadata;
}

export async function getSectionHadiths(name: CollectionName, sectionId: string): Promise<Hadith[]> {
    const filePath = path.join(DATA_DIR, name, `section-${sectionId}.json`);

    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const hadiths = JSON.parse(fileContent) as Hadith[];
        return hadiths;
    } catch (error: any) {
        if (error.code !== 'ENOENT') {
            console.error(`Error loading section ${sectionId} for ${name}:`, error);
        }
        return [];
    }
}

// Deprecated or expensive: Load ALL sections
// Created to satisfy existing signature if needed, but optimally unused.
export async function getCollection(name: CollectionName): Promise<HadithCollection> {
    const metadata = await getCollectionMetadata(name);

    // We need to load ALL hadiths. This is heavy.
    // If we truly need this, we loop through all sections.
    const allHadiths: Hadith[] = [];
    const sectionIds = Object.keys(metadata.section_details || {});

    // Sort roughly numerically
    sectionIds.sort((a, b) => parseInt(a) - parseInt(b));

    for (const id of sectionIds) {
        const sectionHadiths = await getSectionHadiths(name, id);
        allHadiths.push(...sectionHadiths);
    }

    return {
        metadata,
        hadiths: allHadiths
    };
}
