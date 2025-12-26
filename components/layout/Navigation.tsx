'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, User, Menu, Search, Map as MapIcon } from 'lucide-react';
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const navItems = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/coran', label: 'Sourates', icon: BookOpen },
    { href: '/juz', label: 'Juz (30j)', icon: MapIcon }, // Import MapIcon if needed or use another
    { href: '/search', label: 'Recherche', icon: Search },
    { href: '/99-noms', label: '99 Noms', icon: Menu }, // Maybe another icon
    { href: '/dashboard', label: 'Profil', icon: User },
];

export default function Navigation() {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t z-50 pb-safe">
                <div className="flex justify-around items-center h-16">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                                    isActive
                                        ? "text-primary font-semibold"
                                        : "text-muted-foreground hover:text-primary/70"
                                )}
                            >
                                <Icon className="w-6 h-6" />
                                <span className="text-[10px]">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Desktop Sidebar (Left) - simple version */}
            <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 border-r bg-background z-50">
                <div className="p-6 border-b flex items-center gap-2">
                    <BookOpen className="w-8 h-8 text-primary" />
                    <span className="font-kufi text-xl font-bold">Coran 40 Jours</span>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
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
            </aside>
        </>
    );
}
