'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';
type FontSize = 'small' | 'medium' | 'large' | 'xlarge';

interface SettingsContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    fontSize: FontSize;
    setFontSize: (size: FontSize) => void;
    fontSizes: Record<FontSize, string>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

interface SettingsProviderProps {
    children: ReactNode;
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
    const [theme, setTheme] = useState<Theme>('light');
    const [fontSize, setFontSize] = useState<FontSize>('medium');
    const [mounted, setMounted] = useState(false);

    // Initialize from localStorage on mount (client-side only)
    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') as Theme;
        const storedFontSize = localStorage.getItem('fontSize') as FontSize;

        if (storedTheme) setTheme(storedTheme);
        if (storedFontSize) setFontSize(storedFontSize);
        setMounted(true);
    }, []);

    const fontSizes: Record<FontSize, string> = {
        small: '16px',
        medium: '20px',
        large: '24px',
        xlarge: '28px',
    };

    useEffect(() => {
        if (!mounted) return;
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme, mounted]);

    useEffect(() => {
        if (!mounted) return;
        localStorage.setItem('fontSize', fontSize);
        document.documentElement.setAttribute('data-font-size', fontSize);
    }, [fontSize, mounted]);

    const value = {
        theme,
        setTheme,
        fontSize,
        setFontSize,
        fontSizes,
    };

    // Avoid hydration mismatch by rendering children only after mount, 
    // OR accept that initial render matches server (light/medium) and updates after.
    // For a settings provider, it's often better to render immediately to avoid flash,
    // but suppress hydration warning or handle it. 
    // Here we'll just render. Effect will update DOM.

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};
