import { namesOfAllah, CONFUSABLE_GROUPS } from '@/data/names';

describe('99 Noms d\'Allah (namesOfAllah)', () => {
    it('should have 99 names numbered 1 to 99', () => {
        expect(namesOfAllah).toHaveLength(99);
        namesOfAllah.forEach((name, i) => expect(name.Number).toBe(i + 1));
    });

    it('should not repeat any French translation', () => {
        const seen = new Map<string, number>();
        namesOfAllah.forEach(name => {
            const key = name.francais.toLowerCase().replace(/[-\s]+/g, ' ').trim();
            expect([key, seen.get(key)]).toEqual([key, undefined]);
            seen.set(key, name.Number);
        });
    });

    it('should resolve a verse text for every name', () => {
        namesOfAllah.forEach(name => {
            expect(name.verset.arabe).toBeTruthy();
            expect(name.verset.francais).toBeTruthy();
            expect(name.verset.arabe).not.toMatch(/^﻿/);
        });
    });

    it('should explain the verse when the name is not literally in it', () => {
        namesOfAllah
            .filter(name => name.verset.source !== 'nom')
            .forEach(name => expect(name.verset.note).toBeTruthy());
    });

    it('should use ʿ for ʿayn and ʾ for hamza, never a plain apostrophe', () => {
        namesOfAllah.forEach(name => {
            expect(name.transliteration).not.toMatch(/['’]/);
            expect(name.transliteration.includes('ʿ')).toBe(name.arabe.includes('ع'));
            // hamza hors début de mot (ؤ ئ ء, ou أ après la 1re lettre du nom)
            const medialHamza = /[ؤئء]/.test(name.arabe);
            expect(name.transliteration.includes('ʾ')).toBe(medialHamza);
        });
    });

    it('should reference valid names in confusable groups', () => {
        CONFUSABLE_GROUPS.flat().forEach(num => {
            expect(num).toBeGreaterThanOrEqual(1);
            expect(num).toBeLessThanOrEqual(99);
        });
    });

    it('should give a distinction to every confusable name, symmetrically', () => {
        namesOfAllah.forEach(name => {
            name.confusableWith?.forEach(other => {
                expect(name.distinction).toBeTruthy();
                expect(namesOfAllah[other - 1].confusableWith).toContain(name.Number);
            });
        });
    });

    it('should distinguish Al-Majīd from Al-Mājid', () => {
        const majid = namesOfAllah[47];
        const maajid = namesOfAllah[64];
        expect(majid.transliteration).toBe('Al-Majīd');
        expect(maajid.transliteration).toBe('Al-Mājid');
        expect(majid.confusableWith).toContain(65);
        expect(majid.francais).not.toBe(maajid.francais);
    });
});
