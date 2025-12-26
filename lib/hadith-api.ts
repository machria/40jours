import fs from 'fs/promises';
import path from 'path';
import { HadithCollection, CollectionName, Hadith } from '@/types/hadith';
import { SECTION_TRANSLATIONS } from './hadith-translations';

const DATA_DIR = path.join(process.cwd(), 'data/hadith');

const COLLECTIONS: Partial<Record<CollectionName, string>> = {
    bukhari: 'fra-bukhari.json',
    muslim: 'fra-muslim.json',
    abudawud: 'fra-abudawud.json',
    ibnmajah: 'fra-ibnmajah.json',
    nasai: 'fra-nasai.json',
    malik: 'fra-malik.json',
};

// Simple in-memory cache
const cache: Partial<Record<CollectionName, HadithCollection>> = {};

export async function getCollection(name: CollectionName): Promise<HadithCollection> {
    if (cache[name]) {
        return cache[name]!;
    }

    const fileName = COLLECTIONS[name];
    if (!fileName) {
        throw new Error(`Collection ${name} not configured.`);
    }

    const filePath = path.join(DATA_DIR, fileName);
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContent) as HadithCollection;

        // Apply translations to sections
        const translations = SECTION_TRANSLATIONS[name];
        if (translations && data.metadata && data.metadata.sections) {
            Object.keys(data.metadata.sections).forEach(sectionId => {
                if (translations[sectionId]) {
                    data.metadata.sections[sectionId] = translations[sectionId];
                }
            });
        }

        cache[name] = data;
        return data;
    } catch (error) {
        console.error(`Error loading collection ${name}:`, error);
        throw new Error(`Failed to load collection ${name}`);
    }
}

export async function getCollectionMetadata(name: CollectionName) {
    const collection = await getCollection(name);
    return collection.metadata;
}

export async function getSectionHadiths(name: CollectionName, sectionId: string): Promise<Hadith[]> {
    const collection = await getCollection(name);
    const bookId = parseInt(sectionId, 10);

    // Some collections use 'book' in reference as string or number, handle safely
    // Usually it matches the section ID number.
    return collection.hadiths.filter(h => {
        // Convert both to numbers for comparison to avoid string/number mismatch
        const hBook = Number(h.reference.book);
        const sId = Number(sectionId);
        return hBook === sId;
    });
}

export function getCollectionsList() {
    return [
        { id: 'bukhari', name: 'Sahih al-Bukhari' },
        { id: 'muslim', name: 'Sahih Muslim' },
        { id: 'abudawud', name: 'Sunan Abu Dawud' },
        { id: 'ibnmajah', name: 'Sunan Ibn Majah' },
        { id: 'nasai', name: 'Sunan an-Nasai' },
        { id: 'malik', name: 'Muwatta Malik' },
    ];
}
