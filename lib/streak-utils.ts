
export function calculateStreak(activityHistory: Map<string, any> | undefined | { [key: string]: any }): number {
    if (!activityHistory) return 0;

    // Normalize to Map if it's an object (just in case, though Mongoose should give Map)
    // But checking instance is safer.
    let historyKeys: Set<string>;

    if (activityHistory instanceof Map) {
        historyKeys = new Set(activityHistory.keys());
    } else {
        historyKeys = new Set(Object.keys(activityHistory));
    }

    if (historyKeys.size === 0) return 0;

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const fmt = (d: Date) => d.toISOString().split('T')[0];
    const todayStr = fmt(today);
    const yesterdayStr = fmt(yesterday);

    let current = today;
    let streak = 0;

    // Determine start point
    // If we have activity today, we start counting from today.
    // If not, but we have activity yesterday, the streak is still "active" (just not incremented for today yet), so we start from yesterday.
    // If neither, streak is broken (0).

    if (!historyKeys.has(todayStr)) {
        if (!historyKeys.has(yesterdayStr)) {
            return 0;
        }
        current = yesterday;
    }

    // Count backwards strictly
    while (historyKeys.has(fmt(current))) {
        streak++;
        current.setDate(current.getDate() - 1);
    }

    return streak;
}
