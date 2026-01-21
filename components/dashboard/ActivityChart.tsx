"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ActivityChartProps {
    activityHistory: Record<string, number>;
}

export default function ActivityChart({ activityHistory }: ActivityChartProps) {
    // Generate last 7 days data
    const data = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        // Format for display (e.g., "Lun")
        const dayName = new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(d);

        data.push({
            name: dayName,
            date: dateStr,
            count: activityHistory[dateStr] || 0
        });
    }

    return (
        <section className="bg-card border rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
            <h2 className="text-xl font-bold font-kufi flex items-center gap-2">
                <span className="text-blue-600">📊</span>
                Activité des 7 derniers jours
            </h2>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.count > 0 ? "#2563eb" : "#e5e7eb"} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}
