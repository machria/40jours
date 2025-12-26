
import SearchInterface from '@/components/SearchInterface';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function SearchPage() {
    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b p-4">
                <div className="max-w-2xl mx-auto flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-muted rounded-full">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-xl font-bold">Recherche</h1>
                </div>
            </header>

            <main className="p-4 md:p-8">
                <SearchInterface />
            </main>
        </div>
    );
}
