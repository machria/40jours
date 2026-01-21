import { IUser } from "@/models/User";

export interface Badge {
    id: string;
    icon: string;
    name: string;
    description: string;
}

export const BADGES: Badge[] = [
    {
        id: "FIRST_STEP",
        icon: "🌱",
        name: "Premier Pas",
        description: "Complétez votre premier jour de lecture."
    },
    {
        id: "STREAK_3",
        icon: "🔥",
        name: "Lanceur",
        description: "3 jours consécutifs de lecture."
    },
    {
        id: "STREAK_7",
        icon: "🚀",
        name: "Engagé",
        description: "7 jours consécutifs de lecture."
    },
    {
        id: "STREAK_40",
        icon: "👑",
        name: "Légende",
        description: "40 jours consécutifs ! Incroyable."
    },
    {
        id: "JUZ_1",
        icon: "📖",
        name: "Débutant du Coran",
        description: "Complétez votre premier Juz."
    },
    {
        id: "JUZ_30",
        icon: "🌟",
        name: "Hafiz en devenir",
        description: "Complétez les 30 Juz."
    },
    {
        id: "SOCIAL_BUTTERFLY",
        icon: "🦋",
        name: "Papillon Social",
        description: "Rejoignez un groupe et participez."
    }
];

export function checkBadges(user: IUser): string[] {
    const newBadges: string[] = [];
    const currentBadges = user.badges?.map(b => b.id) || [];

    // Helper to add badge if not already owned
    const unlock = (badgeId: string) => {
        if (!currentBadges.includes(badgeId) && !newBadges.includes(badgeId)) {
            newBadges.push(badgeId);
        }
    };

    // 1. FIRST_STEP
    const completedDays = Array.from(user.dailyProgress?.values() || []).filter(Boolean).length;
    if (completedDays >= 1) unlock("FIRST_STEP");

    // 2. STREAKS (Simple Logic: user.streak is already calculated in API)
    if (user.streak >= 3) unlock("STREAK_3");
    if (user.streak >= 7) unlock("STREAK_7");
    if (user.streak >= 40) unlock("STREAK_40");

    // 3. JUZ
    const completedJuzCount = user.completedJuzs?.length || 0;
    if (completedJuzCount >= 1) unlock("JUZ_1");
    if (completedJuzCount >= 30) unlock("JUZ_30");

    // 4. SOCIAL
    if (user.groups && user.groups.length > 0) unlock("SOCIAL_BUTTERFLY");

    return newBadges;
}
