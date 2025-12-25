import { render, screen, fireEvent } from '@testing-library/react';
import TafsirModal from '@/components/reading/TafsirModal';
import { useQuery } from '@tanstack/react-query';

// Mock useQuery
jest.mock('@tanstack/react-query', () => ({
    useQuery: jest.fn(),
}));

describe('TafsirModal', () => {
    const mockOnClose = jest.fn();
    const defaultProps = {
        isOpen: true,
        onClose: mockOnClose,
        surahNumber: 1,
        ayahNumber: 1,
        ayahText: 'Arabic Text'
    };

    beforeEach(() => {
        jest.clearAllMocks();
        // Default mock return
        (useQuery as jest.Mock).mockReturnValue({
            data: null,
            isLoading: false
        });
    });

    it('should not render when isOpen is false', () => {
        const { container } = render(<TafsirModal {...defaultProps} isOpen={false} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('should render loading state', () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: null,
            isLoading: true
        });

        render(<TafsirModal {...defaultProps} />);

        expect(screen.getByText('Tafsir Ibn Kathir')).toBeInTheDocument();
        expect(screen.getByText('Arabic Text')).toBeInTheDocument();
        expect(screen.queryByText('Tafsir non disponible.')).not.toBeInTheDocument();
    });

    it('should render content when loaded', () => {
        const mockData = {
            tafsir: {
                text: "Explanation of the verse..."
            }
        };

        (useQuery as jest.Mock).mockReturnValue({
            data: mockData,
            isLoading: false
        });

        render(<TafsirModal {...defaultProps} />);

        expect(screen.getByText(JSON.stringify(mockData))).toBeInTheDocument();
    });

    it('should call onClose when close button clicked', () => {
        render(<TafsirModal {...defaultProps} />);

        // The close button is the one with the X icon in the header.
        // It's the 2nd button in the DOM usually if BookOpen isn't a button.
        // Actually, looking at code:
        // <button onClick={onClose} ...> <X /> </button>
        // Just find by role button.
        const buttons = screen.getAllByRole('button');
        fireEvent.click(buttons[0]);
        expect(mockOnClose).toHaveBeenCalled();
    });
});
