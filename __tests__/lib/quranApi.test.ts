import { getQuranPage } from '@/lib/quranApi';

// Mock global fetch
global.fetch = jest.fn();

describe('getQuranPage', () => {
    beforeEach(() => {
        (global.fetch as jest.Mock).mockClear();
        // Clear internal cache if possible, or just rely on inputs unique enough if mocking changes?
        // Since cache is module level private const, we can't easily clear it without "rewiring".
        // For unit testing, it might be better to test logic or avoid cache for test enviros.
        // However, since we mock fetch, if cached it won't fetch. 
        // We'll use different page numbers to assume no cache collision for these tests.
    });

    it('should fetch and merge Arabic and French data correctly', async () => {
        const mockArabicResponse = {
            code: 200,
            data: {
                ayahs: [
                    { number: 1, text: 'Arabic 1', surah: { number: 1, name: 'Al-Fatiha' } },
                    { number: 2, text: 'Arabic 2', surah: { number: 1, name: 'Al-Fatiha' } }
                ]
            }
        };

        const mockFrenchResponse = {
            code: 200,
            data: {
                ayahs: [
                    { text: 'French 1' },
                    { text: 'French 2' }
                ]
            }
        };

        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue(mockArabicResponse)
            })
            .mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue(mockFrenchResponse)
            });


        const pageData = await getQuranPage(1001); // Arbitrary large page to avoid potential cache if run multiple times (though jest resets modules usually only if configured)

        expect(global.fetch).toHaveBeenCalledTimes(2);
        expect(pageData.pageNumber).toBe(1001);
        expect(pageData.ayahs).toHaveLength(2);
        expect(pageData.ayahs[0].text).toBe('Arabic 1');
        expect(pageData.ayahs[0].translation).toBe('French 1');
        expect(pageData.surahs).toContain('Al-Fatiha');
    });

    it('should throw error if API fails', async () => {
        (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

        await expect(getQuranPage(1002)).rejects.toThrow('Network error');
    });
});
