import { Suspense } from 'react';
import ConseilsContent from './ConseilsContent';

export const revalidate = false; // données statiques, jamais re-validé

export default function ConseilsPage() {
    return (
        <div className="container max-w-4xl mx-auto py-8 mb-20 md:mb-8 md:pl-72 px-4">
            <h1 className="text-3xl font-bold mb-2">Conseils & Sagesse</h1>
            <p className="text-muted-foreground mb-8">
                Articles, méthodes et réflexions pour accompagner votre cheminement spirituel.
            </p>
            <Suspense fallback={
                <div className="flex flex-col gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
                    ))}
                </div>
            }>
                <ConseilsContent />
            </Suspense>
        </div>
    );
}
