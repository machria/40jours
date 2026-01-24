'use client';

import { useSettings } from '@/context/SettingsContext';

export default function SettingsPage() {
    const { theme, setTheme, fontSize, setFontSize, fontSizes } = useSettings();

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8 text-foreground">Paramètres</h1>

            <div className="bg-card text-card-foreground border rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 text-card-foreground">Apparence</h2>

                <div className="flex items-center justify-between mb-4">
                    <span className="text-muted-foreground">Thème</span>
                    <div className="flex bg-muted rounded-lg p-1">
                        <button
                            onClick={() => setTheme('light')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${theme === 'light'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Clair
                        </button>
                        <button
                            onClick={() => setTheme('dark')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${theme === 'dark'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Sombre
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-card text-card-foreground border rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 text-card-foreground">Lecture</h2>

                <div className="mb-6">
                    <label className="block text-muted-foreground mb-2">Taille du texte</label>
                    <div className="flex justify-between items-center bg-muted rounded-lg p-1">
                        {(Object.keys(fontSizes) as Array<keyof typeof fontSizes>).map((size) => (
                            <button
                                key={size}
                                onClick={() => setFontSize(size)}
                                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors capitalize ${fontSize === size
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="border-t border-border pt-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Aperçu</h3>
                    <div
                        className="p-4 bg-muted/50 rounded-lg border border-border text-foreground transition-all"
                        style={{ fontSize: fontSizes[fontSize] }}
                    >
                        <p className="mb-2" style={{ fontFamily: 'var(--font-arabic)' }}>
                            بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                        </p>
                        <p>
                            Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux.
                            Ceci est un exemple de texte pour visualiser vos réglages.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
