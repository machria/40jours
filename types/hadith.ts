export interface HadithReference {
    book: number;
    hadith: number;
}

export interface Hadith {
    hadithnumber: number;
    arabicnumber: number;
    text: string;
    arabic: string;
    english?: {
        narrator?: string;
        text: string;
    };
    tags?: string[];
    grades?: any[];
    reference: HadithReference;
}

export interface SectionDetails {
    hadithnumber_first: number;
    hadithnumber_last: number;
    arabicnumber_first: number;
    arabicnumber_last: number;
}

export interface HadithMetadata {
    name: string;
    sections: Record<string, string>;
    section_details: Record<string, SectionDetails>;
}

export interface HadithCollection {
    metadata: HadithMetadata;
    hadiths: Hadith[];
}

export type CollectionName = 'bukhari' | 'muslim' | 'abudawud' | 'ibnmajah' | 'nasai' | 'malik' | 'tirmidhi';
