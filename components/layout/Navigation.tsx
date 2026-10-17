'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    Home, BookOpen, User, Menu, Search, Map as MapIcon, Shield, LogOut, LogIn, Settings, X,
    Languages, GraduationCap, Users, ScrollText, Library, Sparkles, MessageSquareQuote,
    ListOrdered, AudioLines, BookA, Lightbulb, type LucideIcon,
} from 'lucide-react';
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { useSession, signOut } from 'next-auth/react';
import ShareAppButton from '@/components/ShareAppButton';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

type NavItem = { href: string; label: string; icon: LucideIcon };
type NavGroup = { title: string; items: NavItem[] };

export default function Navigation() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (!isMenuOpen) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsMenuOpen(false); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isMenuOpen]);

    // Main navigation items (visible on mobile bottom bar)
    const mainNavItems: NavItem[] = [
        { href: '/', label: 'Accueil', icon: Home },
        { href: '/coran', label: 'Sourates', icon: BookOpen },
        { href: '/search', label: 'Recherche', icon: Search },
    ];

    const accountItem: NavItem = session
        ? { href: '/dashboard', label: 'Mon Profil', icon: User }
        : { href: '/login', label: 'Connexion', icon: LogIn };

    // Menu groups (hamburger menu on mobile, sidebar on desktop)
    const menuGroups: NavGroup[] = [
        {
            title: 'Mon défi',
            items: [
                accountItem,
                { href: '/juz', label: 'Juz (30 jours)', icon: MapIcon },
                { href: '/social', label: 'Communauté', icon: Users },
            ],
        },
        {
            title: 'Apprendre',
            items: [
                { href: '/apprendre-arabe', label: 'Apprendre l\'Arabe', icon: GraduationCap },
                { href: '/vocabulaire', label: 'Vocabulaire', icon: Languages },
                { href: '/tajwid', label: 'Tajwid', icon: AudioLines },
                { href: '/glossaire', label: 'Glossaire islamique', icon: BookA },
            ],
        },
        {
            title: 'Découvrir',
            items: [
                { href: '/sira', label: 'Sira du Prophète ﷺ', icon: ScrollText },
                { href: '/prophetes', label: 'Histoires des Prophètes', icon: Library },
                { href: '/hisn', label: 'Citadelle du Musulman', icon: Shield },
                { href: '/99-noms', label: '99 Noms d\'Allah', icon: Sparkles },
                { href: '/hadith', label: 'Hadith', icon: MessageSquareQuote },
                { href: '/hadith/nawawi', label: 'Portail des 40 hadiths', icon: ListOrdered },
                { href: '/conseils', label: 'Conseils', icon: Lightbulb },
            ],
        },
    ];

    const settingsItem: NavItem = { href: '/settings', label: 'Paramètres', icon: Settings };

    const renderLink = (item: NavItem, onClick?: () => void) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
            <Link
                key={item.href}
                href={item.href}
                onClick={onClick}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                    "flex items-center gap-3 px-4 min-h-11 rounded-lg transition-colors",
                    isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground hover:bg-muted"
                )}
            >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-sm">{item.label}</span>
            </Link>
        );
    };

    const renderGroups = (onClick?: () => void) => (
        <>
            {menuGroups.map((group) => (
                <div key={group.title} className="space-y-1">
                    <p className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {group.title}
                    </p>
                    {group.items.map((item) => renderLink(item, onClick))}
                </div>
            ))}
            <div className="pt-2 mt-2 border-t">{renderLink(settingsItem, onClick)}</div>
        </>
    );

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <>
            {/* Mobile Bottom Navigation */}
            <nav aria-label="Navigation principale" className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t z-40 pb-safe">
                <div className="flex justify-around items-center h-16">
                    {mainNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                aria-current={isActive ? 'page' : undefined}
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
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-menu"
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

            {/* Mobile Hamburger Menu Overlay (au-dessus du lecteur audio, sous les modales) */}
            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={closeMenu}>
                    <div
                        id="mobile-menu"
                        role="dialog"
                        aria-label="Menu"
                        className="absolute bottom-[calc(4rem+env(safe-area-inset-bottom))] left-0 right-0 bg-background border-t rounded-t-2xl max-h-[75vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-background p-4 border-b flex items-center justify-between">
                            <h2 className="font-semibold text-lg">Menu</h2>
                            <button
                                onClick={closeMenu}
                                aria-label="Fermer le menu"
                                className="p-2.5 hover:bg-muted rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <nav aria-label="Rubriques" className="p-2">
                            <ShareAppButton source="menu" className="w-full text-primary font-medium bg-primary/5 hover:bg-primary/10" />

                            {renderGroups(closeMenu)}

                            {/* Logout Button for Mobile */}
                            {session && (
                                <button
                                    onClick={() => {
                                        closeMenu();
                                        signOut({ callbackUrl: '/' });
                                    }}
                                    className="flex items-center gap-3 px-4 min-h-11 w-full rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors mt-2"
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
            <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 border-r bg-background z-40">
                <div className="p-6 border-b flex items-center gap-2">
                    <BookOpen className="w-8 h-8 text-primary" />
                    <span className="font-kufi text-xl font-bold">Coran 40 Jours</span>
                </div>
                <nav aria-label="Navigation principale" className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {mainNavItems.map((item) => renderLink(item))}
                    {renderGroups()}
                    <ShareAppButton source="menu" className="w-full text-muted-foreground" />
                </nav>

                {/* Logout Button for Desktop */}
                {session && (
                    <div className="p-4 border-t">
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
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
