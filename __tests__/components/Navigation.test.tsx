import { render, screen } from '@testing-library/react';
import Navigation from '@/components/layout/Navigation';
import { usePathname } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    usePathname: jest.fn(),
}));

describe('Navigation', () => {
    it('should mark the current link as active', () => {
        (usePathname as jest.Mock).mockReturnValue('/');

        render(<Navigation />);

        // Mobile Link
        const homeLinks = screen.getAllByRole('link', { name: /accueil/i });
        // Should have active class on the first one (Mobile or Desktop depending on implementation order but logic is same)
        // In our component logic: isActive ? "text-primary font-semibold" (Mobile) or "bg-primary/10" (Desktop)

        // Let's check if class contains 'text-primary'
        expect(homeLinks[0]).toHaveClass('text-primary');

        // Other links should not be active
        const profileLinks = screen.getAllByRole('link', { name: /profil/i });
        expect(profileLinks[0]).not.toHaveClass('text-primary');
    });

    it('should render all navigation items', () => {
        (usePathname as jest.Mock).mockReturnValue('/');
        render(<Navigation />);

        expect(screen.getAllByText('Accueil')).toHaveLength(2); // Mobile + Desktop
        expect(screen.getAllByText('99 Noms')).toHaveLength(2);
        expect(screen.getAllByText('Profil')).toHaveLength(2);
    });
});
