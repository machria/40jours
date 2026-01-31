'use client';

import { cn } from "@/lib/utils";

interface ThemeFilterProps {
    currentTheme: string;
    onThemeChange: (theme: string) => void;
}

const THEMES = [
    { id: 'all', label: 'Tous 📚' },
    { id: 'aqida', label: 'Croyance ☝️' },
    { id: 'ibadat', label: 'Adoration 🕌' },
    { id: 'muamalat', label: 'Transactions 🤝' },
    { id: 'adab', label: 'Comportement 🌟' },
    { id: 'tazkiya', label: 'Purification ❤️' },
];

export default function ThemeFilter({ currentTheme, onThemeChange }: ThemeFilterProps) {
    return (
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {THEMES.map((theme) => (
                <button
                    key={theme.id}
                    onClick={() => onThemeChange(theme.id)}
                    className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                        currentTheme === theme.id
                            ? "bg-primary text-primary-foreground shadow-md scale-105"
                            : "bg-muted hover:bg-muted/80 text-muted-foreground"
                    )}
                >
                    {theme.label}
                </button>
            ))}
        </div>
    );
}
