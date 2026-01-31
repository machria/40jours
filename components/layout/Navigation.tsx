'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Home, BookOpen, User, Menu, Search, Map as MapIcon, Shield, LogOut, LogIn, Settings, X, BookMarked, Languages, GraduationCap } from 'lucide-react';
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { useSession, signOut } from 'next-auth/react';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export default function Navigation() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Main navigation items (visible on mobile bottom bar)
    const mainNavItems = [
        { href: '/', label: 'Accueil', icon: Home },
        { href: '/coran', label: 'Sourates', icon: BookOpen },
        { href: '/search', label: 'Recherche', icon: Search },
    ];

    // Menu items (in hamburger menu on mobile)
    const menuItems = [
        { href: '/juz', label: 'Juz (30 jours)', icon: MapIcon },
        { href: '/sira', label: 'Sira du Prophète ﷺ', icon: BookOpen },
        { href: '/hisn', label: 'Citadelle du Musulman', icon: Shield },
        { href: '/99-noms', label: '99 Noms d\'Allah', icon: BookMarked },
        { href: '/hadith', label: 'Hadith', icon: BookOpen },
        { href: '/hadith/nawawi', label: 'Portail des 40 hadiths', icon: BookOpen },
        { href: '/tajwid', label: 'Tajwid', icon: BookMarked },
        { href: '/vocabulaire', label: 'Vocabulaire', icon: Languages },
        { href: '/apprendre-arabe', label: 'Apprendre l\'Arabe', icon: GraduationCap },
        { href: '/settings', label: 'Paramètres', icon: Settings },
    ];

    // Add Auth/Profile item dynamically
    if (session) {
        menuItems.push({ href: '/dashboard', label: 'Mon Profil', icon: User });
    } else {
        menuItems.push({ href: '/login', label: 'Connexion', icon: LogIn });
    }

    // All items for desktop sidebar
    const allNavItems = [
        ...mainNavItems.slice(0, 2), // Accueil, Sourates
        ...menuItems,
        mainNavItems[2], // Recherche
    ];

    return (
        <>
            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t z-50 pb-safe">
                <div className="flex justify-around items-center h-16">
                    {mainNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors",
                                    isActive
                                        ? "text-primary font-semibold"
                                        : "text-muted-foreground hover:text-primary/70"
                                )}
                            >
                                <Icon className="w-6 h-6" />
                                <span className="text-xs">{item.label}</span>
                            </Link>
                        );
                    })}

                    {/* Hamburger Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={cn(
                            "flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors",
                            isMenuOpen
                                ? "text-primary font-semibold"
                                : "text-muted-foreground hover:text-primary/70"
                        )}
                    >
                        <Menu className="w-6 h-6" />
                        <span className="text-xs">Menu</span>
                    </button>
                </div>
            </nav>

            {/* Mobile Hamburger Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMenuOpen(false)}>
                    <div
                        className="absolute bottom-16 left-0 right-0 bg-background border-t max-h-[70vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 border-b flex items-center justify-between">
                            <h2 className="font-semibold text-lg">Menu</h2>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <nav className="p-2">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                            isActive
                                                ? "bg-primary/10 text-primary font-medium"
                                                : "text-foreground hover:bg-muted"
                                        )}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="text-sm">{item.label}</span>
                                    </Link>
                                );
                            })}

                            {/* Logout Button for Mobile */}
                            {session && (
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        signOut({ callbackUrl: '/' });
                                    }}
                                    className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-500 hover:bg-red-50 transition-colors mt-2 border-t pt-4"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="text-sm font-medium">Déconnexion</span>
                                </button>
                            )}
                        </nav>
                    </div>
                </div>
            )}

            {/* Desktop Sidebar (Left) */}
            <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 border-r bg-background z-50">
                <div className="p-6 border-b flex items-center gap-2">
                    <BookOpen className="w-8 h-8 text-primary" />
                    <span className="font-kufi text-xl font-bold">Coran 40 Jours</span>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {allNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                    isActive
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "text-muted-foreground hover:bg-muted"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-sm">{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                {/* Logout Button for Desktop */}
                {session && (
                    <div className="p-4 border-t">
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="text-sm font-medium">Déconnexion</span>
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
}
