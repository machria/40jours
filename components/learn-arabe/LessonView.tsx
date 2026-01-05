
import React from 'react';
import { LESSONS, Lesson } from './data';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { playPronunciation } from './audio';

export default function LessonView() {
    return (
        <div className="space-y-8">
            {LESSONS.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} />
            ))}
        </div>
    );
}

function LessonCard({ lesson }: { lesson: Lesson }) {
    const renderArabic = (text: string) => {
        if (!text.includes('*')) return text;

        const parts = text.split('*');
        return parts.map((part, i) =>
            i % 2 === 1 ? <span key={i} className="text-red-500">{part}</span> : part
        );
    };

    const getCleanText = (text: string) => text.replace(/\*/g, '');

    return (
        <Card className="rounded-2xl overflow-hidden border-2 border-muted">
            <CardHeader className="bg-muted/30">
                <CardTitle className="font-kufi text-xl text-primary">{lesson.title}</CardTitle>
                <CardDescription>{lesson.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <p className="leading-relaxed text-muted-foreground">{lesson.content}</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {lesson.examples.map((ex, idx) => (
                        <div
                            key={idx}
                            onClick={() => playPronunciation(getCleanText(ex.arabic))}
                            className="bg-card border rounded-xl p-4 text-center space-y-2 hover:bg-muted/10 transition-colors cursor-pointer active:scale-95 transition-transform"
                        >
                            <div className="text-4xl font-kufi text-primary mb-2">
                                {renderArabic(ex.arabic)}
                            </div>
                            <div className="font-semibold text-sm">{ex.transliteration}</div>
                            {ex.meaning && <div className="text-xs text-muted-foreground">{ex.meaning}</div>}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
