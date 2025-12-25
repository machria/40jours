import { plan40jours } from '@/data/plan40jours';

describe('Reading Plan (plan40jours)', () => {
    it('should have exactly 40 days', () => {
        expect(plan40jours).toHaveLength(40);
    });

    it('should start at day 1 and end at day 40', () => {
        expect(plan40jours[0].jour).toBe(1);
        expect(plan40jours[39].jour).toBe(40);
    });

    it('should have continuity in pages', () => {
        let previousEndPage = 0;
        plan40jours.forEach((day, index) => {
            if (index > 0) {
                expect(day.startPage).toBe(previousEndPage + 1);
            } else {
                expect(day.startPage).toBe(1);
            }
            expect(day.endPage).toBeGreaterThanOrEqual(day.startPage);
            previousEndPage = day.endPage;
        });
        // Quran has 604 pages usually in standard Mushaf
        expect(previousEndPage).toBe(604);
    });
});
