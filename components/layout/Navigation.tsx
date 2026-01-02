'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, User, Menu, Search, Map as MapIcon, Shield, LogOut, LogIn } from 'lucide-react';
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { useSession, signOut } from 'next-auth/react';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export default function Navigation() {
    const pathname = usePathname();
    const { data: session } = useSession();

    const navItems = [
        { href: '/', label: 'Accueil', icon: Home },
        { href: '/coran', label: 'Sourates', icon: BookOpen },
        { href: '/juz', label: 'Juz (30j)', icon: MapIcon },
        { href: '/hisn', label: 'Citadelle', icon: Shield },
        { href: '/search', label: 'Recherche', icon: Search },
        { href: '/99-noms', label: '99 Noms', icon: Menu },
        { href: '/hadith', label: 'Hadith', icon: BookOpen },
    ];

    // Add Auth/Profile item dynamically
    if (session) {
        navItems.push({ href: '/dashboard', label: 'Profil', icon: User });
    } else {
        navItems.push({ href: '/login', label: 'Connexion', icon: LogIn });
    }

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

            {/* Desktop Sidebar (Left) */}
            <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 border-r bg-background z-50">
                <div className="p-6 border-b flex items-center gap-2">
                    <BookOpen className="w-8 h-8 text-primary" />
                    <span className="font-kufi text-xl font-bold">Coran 40 Jours</span>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
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
