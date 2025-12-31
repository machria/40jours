import Link from 'next/link';
import { Book, ChevronRight } from 'lucide-react';

type HisnCategorySummary = {
    id: number;
    title: string;
    hadithCount: number;
};

interface HisnCardProps {
    category: HisnCategorySummary;
}

export default function HisnCard({ category }: HisnCardProps) {
    return (
        <Link
            href={`/hisn/${category.id}`}
            className="group relative flex flex-col p-6 h-full bg-card hover:bg-accent/50 border rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Book className="w-6 h-6 text-primary" />
                </div>
                <span className="flex items-center text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                    {category.hadithCount} {category.hadithCount > 1 ? 'invocations' : 'invocation'}
                </span>
            </div>

            <h3 className="text-lg font-semibold leading-relaxed mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {category.title}
            </h3>

            <div className="mt-auto pt-4 flex items-center text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                Lire les invocations
                <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
        </Link>
    );
}
