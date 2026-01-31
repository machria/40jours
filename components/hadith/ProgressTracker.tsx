'use client';

interface ProgressTrackerProps {
    total: number;
    completed: number;
}

export default function ProgressTracker({ total, completed }: ProgressTrackerProps) {
    const percentage = Math.round((completed / total) * 100);

    return (
        <div className="w-full max-w-md mx-auto mb-8">
            <div className="flex justify-between text-sm mb-2 font-medium text-muted-foreground">
                <span>Progression</span>
                <span>{completed}/{total} ({percentage}%)</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
