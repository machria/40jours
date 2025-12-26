import { CollectionName } from '@/types/hadith';

export const BOOK_DESCRIPTIONS: Record<CollectionName, { title: string; description: string; importance: string }> = {
    bukhari: {
        title: "Sahih al-Bukhari",
        description: "Compilé par l'Imam Muhammad ibn Isma'il al-Bukhari (mort en 256 H), c'est le recueil de hadiths le plus célèbre du monde musulman.",
        importance: "Considéré unanimement comme le livre le plus authentique après le Coran. L'Imam Bukhari a passé 16 ans à voyager pour recueillir ces hadiths, appliquant des critères de sélection d'une rigueur extrême. Il est la référence absolue pour toutes les écoles juridiques (Madhabs) en matière d'authenticité prophétique."
    },
    muslim: {
        title: "Sahih Muslim",
        description: "Compilé par l'Imam Muslim ibn al-Hajjaj (mort en 261 H), un élève de l'Imam Bukhari.",
        importance: "Il partage avec le Sahih Bukhari le statut de 'Sahihain' (les deux authentiques). Il est particulièrement apprécié pour son organisation thématique rigoureuse et le fait de regrouper toutes les voies de transmission d'un même hadith au même endroit. C'est une source fondamentale pour la jurisprudence islamique."
    },
    abudawud: {
        title: "Sunan Abu Dawud",
        description: "Compilé par l'Imam Abu Dawud al-Sijistani (mort en 275 H). Ce recueil fait partie des 'Sunan' et se concentre spécifiquement sur les hadiths relatifs aux règles juridiques (Ahkam).",
        importance: "L'Imam Abu Dawud a dit : 'J'ai compilé ce livre pour qu'il serve de juge entre les gens.' Il est extrêmement prisé par les juristes (Fouqaha) de toutes les écoles (Hanafite, Malikite, Shafi'ite, Hanbalite) car il rassemble presque toutes les preuves légales nécessaires à l'élaboration du Fiqh."
    },
    ibnmajah: {
        title: "Sunan Ibn Majah",
        description: "Compilé par l'Imam Ibn Majah al-Qazwini (mort en 273 H). C'est le dernier des six livres canoniques (Koutoub as-Sitta) à avoir été reconnu.",
        importance: "Bien qu'il contienne quelques hadiths faibles, il est précieux pour ses milliers de hadiths 'Zawa'id' (supplémentaires) qui ne figurent pas dans les 5 autres livres. Il est connu pour sa structure simple et accessible, et est étudié pour compléter la compréhension des autres Sunan."
    },
    nasai: {
        title: "Sunan an-Nasai",
        description: "Compilé par l'Imam Ahmad ibn Shu'ayb an-Nasai (mort en 303 H). Son livre est aussi appelé 'Al-Mujtaba' (Le Choisi).",
        importance: "Souvent considéré comme le troisième livre le plus authentique après Bukhari et Muslim en raison de la sévérité de l'Imam Nasai dans la critique des narrateurs. Il contient très peu de hadiths faibles. Il est une référence majeure pour l'école Shafi'ite en particulier, mais respecté par tous."
    },
    malik: {
        title: "Muwatta Malik",
        description: "Compilé par l'Imam Malik ibn Anas (mort en 179 H), l'Imam de Médine. C'est l'un des tout premiers ouvrages de hadith et de fiqh jamais écrits.",
        importance: "Fondement de l'école Malikite, ce livre n'est pas seulement un recueil de hadiths mais aussi un livre de jurisprudence (Fiqh) basé sur la pratique des gens de Médine ('Amal Ahl al-Madina). L'Imam Shafi'i a dit à son sujet (avant l'écriture des deux Sahihs) : 'Il n'y a pas de livre sur terre, après le Livre d'Allah, plus authentique que le Muwatta de Malik'."
    }
};
