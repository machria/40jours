import { CollectionName } from '@/types/hadith';

export type ThemeId =
    | 'croyance-tawhid'
    | 'science-savoir'
    | 'purification'
    | 'priere-salat'
    | 'funerailles'
    | 'zakat-sadaqa'
    | 'jeune-ramadan'
    | 'hajj-omra'
    | 'transactions-economie'
    | 'justice-jugements'
    | 'peines-hudud'
    | 'mariage-famille'
    | 'successions-testaments'
    | 'affranchissement'
    | 'nourriture-boissons'
    | 'sacrifices'
    | 'habillement-parure'
    | 'comportement-adab'
    | 'medecine-sante'
    | 'invocations-dhikr'
    | 'serments-voeux'
    | 'jihad-expeditions'
    | 'riqaq-zuhd'
    | 'reves-interpretation'
    | 'prophetes-compagnons'
    | 'coran-tafsir'
    | 'paraboles-paroles'
    | 'fitan-signes'
    | 'audela-akhira';

export interface HadithTheme {
    id: ThemeId;
    title: string;
    description: string;
    emoji: string;
    sections: Array<{ collection: CollectionName; sectionIds: string[] }>;
}

export const HADITH_THEMES: HadithTheme[] = [
    {
        id: 'croyance-tawhid',
        title: 'La Croyance, le Tawhid & le Destin',
        description: 'Les fondements de la foi (Iman), l\'unicité d\'Allah, le destin et la prédestination.',
        emoji: '☝️',
        sections: [
            { collection: 'bukhari', sectionIds: ['1', '2', '97'] }, // Révélation, Croyance, Tawhid
            { collection: 'muslim', sectionIds: ['1', '46'] }, // Foi, Destin
            { collection: 'nasai', sectionIds: ['47'] }, // Foi et signes
            { collection: 'malik', sectionIds: ['46'] }, // Qadar
            { collection: 'tirmidhi', sectionIds: ['40', '32'] } // Foi, Qadar
        ]
    },
    {
        id: 'science-savoir',
        title: 'La Science & Le Savoir',
        description: 'L\'importance de la recherche du savoir, les mérites des savants et la transmission.',
        emoji: '📚',
        sections: [
            { collection: 'bukhari', sectionIds: ['3', '96'] }, // Science, Attachement au Coran et Sunna
            { collection: 'muslim', sectionIds: ['0', '47'] }, // Introduction (méthodologie), Science
            { collection: 'abudawud', sectionIds: ['26'] }, // Science
            { collection: 'ibnmajah', sectionIds: ['0'] }, // Introduction (Sunna)
            { collection: 'nasai', sectionIds: ['35'] }, // Témoins (transmission)
            { collection: 'malik', sectionIds: ['59'] }, // Science
            { collection: 'tirmidhi', sectionIds: ['41'] } // Science
        ]
    },
    {
        id: 'purification',
        title: 'La Purification',
        description: 'Les ablutions (Wudu), le bain rituel (Ghusl), le Tayammum et les menstrues.',
        emoji: '💧',
        sections: [
            { collection: 'bukhari', sectionIds: ['4', '5', '6', '7'] }, // Wudu, Ghusl, Menstrues, Tayammum
            { collection: 'muslim', sectionIds: ['2', '3'] }, // Purification, Menstrues
            { collection: 'abudawud', sectionIds: ['1', '33'] }, // Purification, Bains
            { collection: 'nasai', sectionIds: ['1', '2', '3', '4'] }, // Purification, Eau, Menstrues, Ghusl/Tayammum
            { collection: 'ibnmajah', sectionIds: ['1'] }, // Purification
            { collection: 'malik', sectionIds: ['2'] }, // Pureté
            { collection: 'tirmidhi', sectionIds: ['1'] } // Purification
        ]
    },
    {
        id: 'priere-salat',
        title: 'La Prière (Salat)',
        description: 'Les piliers, les conditions, les horaires et les mérites de la prière.',
        emoji: '🕌',
        sections: [
            { collection: 'bukhari', sectionIds: ['8', '9', '10', '11', '12', '14', '16', '17', '18', '19', '20', '21', '22'] },
            // Salat, Horaires, Adhan, Vendredi, Peur, Witr, Éclipses, Prosternation récitation, Raccourcissement, Tahajjud, Mérites, Actions prière, Oubli
            { collection: 'muslim', sectionIds: ['4', '5', '6', '7', '8', '9'] }, // Prière, Mosquées, Voyageurs, Vendredi, Deux Fêtes, Pluie
            { collection: 'abudawud', sectionIds: ['2', '3', '4', '5', '7', '8'] }, // Prière, Pluie, Voyageur, Surérogatoires, Prosternation, Witr
            { collection: 'nasai', sectionIds: ['5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'] },
            // Salah, Horaires, Adhan, Mosquées, Qiblah, Imamat, Commencement, Tatbiq, Oubli, Vendredi, Raccourcissement, Éclipses, Istisqa, Peur, Deux Fêtes, Qiyam
            { collection: 'ibnmajah', sectionIds: ['2', '3', '4', '5'] }, // Prière, Adhan, Mosquées, Accomplissement
            { collection: 'malik', sectionIds: ['1', '3', '4', '5', '7', '8', '9', '10', '11', '12', '13', '14'] },
            // Horaires, Prière, Oubli, Vendredi, Ramadan, Tahajjud, Assemblée, Raccourcissement, Deux Fêtes, Peur, Éclipse, Pluie, Qibla
            { collection: 'tirmidhi', sectionIds: ['2', '3', '4', '6'] } // Salat, Witr, Vendredi, Voyages
        ]
    },
    {
        id: 'funerailles',
        title: 'Les Funérailles (Janaza)',
        description: 'Les rites funéraires, la prière sur le mort et les visites des tombes.',
        emoji: '🪦',
        sections: [
            { collection: 'bukhari', sectionIds: ['23'] }, // Funérailles
            { collection: 'muslim', sectionIds: ['11'] }, // Funérailles
            { collection: 'abudawud', sectionIds: ['21'] }, // Funérailles
            { collection: 'nasai', sectionIds: ['21'] }, // Funérailles
            { collection: 'ibnmajah', sectionIds: ['6'] }, // Funérailles
            { collection: 'malik', sectionIds: ['16'] }, // Funérailles
            { collection: 'tirmidhi', sectionIds: ['10'] } // Janaza
        ]
    },
    {
        id: 'zakat-sadaqa',
        title: 'La Zakat & L\'Aumône',
        description: 'L\'obligation de la Zakat, les mérites de la charité (Sadaqa) et les dons.',
        emoji: '💰',
        sections: [
            { collection: 'bukhari', sectionIds: ['24', '51'] }, // Zakat, Dons
            { collection: 'muslim', sectionIds: ['12', '24'] }, // Zakat, Dons
            { collection: 'abudawud', sectionIds: ['9'] }, // Zakat
            { collection: 'nasai', sectionIds: ['23', '31', '32'] }, // Zakat, Cadeaux, Dons
            { collection: 'ibnmajah', sectionIds: ['8', '14', '15'] }, // Zakat, Dons, Aumône
            { collection: 'malik', sectionIds: ['17', '58'] }, // Zakat, Sadaqa
            { collection: 'tirmidhi', sectionIds: ['7', '31'] } // Zakat, Wala' et cadeaux
        ]
    },
    {
        id: 'jeune-ramadan',
        title: 'Le Jeûne & Ramadan',
        description: 'Le jeûne obligatoire du Ramadan, la retraite spirituelle (I\'tikaf) et les jeûnes surérogatoires.',
        emoji: '🌙',
        sections: [
            { collection: 'bukhari', sectionIds: ['30', '31', '32', '33'] }, // Jeûne, Tarawih, Laylat al-Qadr, I'tikaf
            { collection: 'muslim', sectionIds: ['13', '14'] }, // Jeûne, I'tikaf
            { collection: 'abudawud', sectionIds: ['6', '14'] }, // Ramadan, Jeûne
            { collection: 'nasai', sectionIds: ['22'] }, // Jeûne
            { collection: 'ibnmajah', sectionIds: ['7'] }, // Jeûne
            { collection: 'malik', sectionIds: ['6', '18', '19'] }, // Ramadan, Jeûne, I'tikaf
            { collection: 'tirmidhi', sectionIds: ['8'] } // Jeûne
        ]
    },
    {
        id: 'hajj-omra',
        title: 'Le Hajj & La Omra',
        description: 'Le Pèlerinage à La Mecque, la Omra et leurs rites sacrés.',
        emoji: '🕋',
        sections: [
            { collection: 'bukhari', sectionIds: ['25', '26', '27', '28', '29'] }, // Hajj, Omra, Empêchements, Compensation chasse, Médine
            { collection: 'muslim', sectionIds: ['15'] }, // Hajj
            { collection: 'abudawud', sectionIds: ['11'] }, // Rites du Hajj
            { collection: 'nasai', sectionIds: ['24', '29', '34'] }, // Hajj, Dotations, Omra
            { collection: 'ibnmajah', sectionIds: ['25'] }, // Hajj
            { collection: 'malik', sectionIds: ['20', '45'] }, // Hajj, Médine
            { collection: 'tirmidhi', sectionIds: ['9'] } // Hajj
        ]
    },
    {
        id: 'transactions-economie',
        title: 'Transactions & Économie',
        description: 'Le commerce, les ventes, les prêts, l\'agriculture et les transactions financières.',
        emoji: '🤝',
        sections: [
            { collection: 'bukhari', sectionIds: ['34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '47', '48'] },
            // Ventes, Salam, Préemption, Location, Hawal, Cautionnement, Procuration, Agriculture, Distribution eau, Emprunts, Objets trouvés, Associations, Gage
            { collection: 'muslim', sectionIds: ['21', '22'] }, // Transactions, Métayage
            { collection: 'abudawud', sectionIds: ['23', '24'] }, // Commerce, Salaires
            { collection: 'nasai', sectionIds: ['35', '44'] }, // Agriculture, Transactions financières
            { collection: 'ibnmajah', sectionIds: ['12', '16', '17', '18'] }, // Transactions, Gage, Préemption, Objets trouvés
            { collection: 'malik', sectionIds: ['31', '32', '33', '34', '35'] }, // Commerce, Qirad, Métayage, Location terres, Préemption
            { collection: 'tirmidhi', sectionIds: ['14'] } // Affaires
        ]
    },
    {
        id: 'justice-jugements',
        title: 'Justice & Jugements',
        description: 'L\'administration de la justice, les témoignages, la réconciliation et les conflits.',
        emoji: '⚖️',
        sections: [
            { collection: 'bukhari', sectionIds: ['44', '46', '52', '53', '93'] }, // Conflits, Injustices, Témoignages, Réconciliation, Jugements
            { collection: 'muslim', sectionIds: ['28', '30'] }, // Serments/Talion/Prix sang, Jugements
            { collection: 'abudawud', sectionIds: ['25'] }, // Magistrature
            { collection: 'nasai', sectionIds: ['45', '49'] }, // Qasamah/Prix sang, Étiquette juges
            { collection: 'ibnmajah', sectionIds: ['13'] }, // Jugements
            { collection: 'malik', sectionIds: ['36', '44'] }, // Jugements, Qasama
            { collection: 'tirmidhi', sectionIds: ['15', '35'] } // Jugements, Témoins
        ]
    },
    {
        id: 'peines-hudud',
        title: 'Les Peines Légales (Hudud)',
        description: 'Les sanctions prescrites par la loi islamique et le prix du sang (Diyat).',
        emoji: '⚠️',
        sections: [
            { collection: 'bukhari', sectionIds: ['86', '87', '88', '89', '90'] }, // Hudud, Diyat, Apostats, Contrainte, Ruses
            { collection: 'muslim', sectionIds: ['28', '29'] }, // Serments/Talion/Prix sang, Hudud
            { collection: 'abudawud', sectionIds: ['40', '41'] }, // Hudud, Prix du sang
            { collection: 'nasai', sectionIds: ['37', '45', '46'] }, // Interdiction sang, Qasamah/Prix sang, Peine voleur
            { collection: 'ibnmajah', sectionIds: ['20', '21'] }, // Hudud, Prix du sang
            { collection: 'malik', sectionIds: ['41', '43'] }, // Hudud, Prix du sang
            { collection: 'tirmidhi', sectionIds: ['16', '17'] } // Prix du sang, Hudud
        ]
    },
    {
        id: 'mariage-famille',
        title: 'Mariage & Famille',
        description: 'Le mariage, le divorce, l\'allaitement et les dépenses familiales.',
        emoji: '💍',
        sections: [
            { collection: 'bukhari', sectionIds: ['67', '68', '69'] }, // Mariage, Divorce, Dépenses familiales
            { collection: 'muslim', sectionIds: ['16', '17', '18', '19'] }, // Mariage, Allaitement, Divorce, Li'an
            { collection: 'abudawud', sectionIds: ['12', '13'] }, // Mariage, Divorce
            { collection: 'nasai', sectionIds: ['26', '27', '36'] }, // Mariage, Divorce, Bon traitement femmes
            { collection: 'ibnmajah', sectionIds: ['9', '10', '11'] }, // Mariage, Divorce, Kaffara
            { collection: 'malik', sectionIds: ['28', '29', '30'] }, // Mariage, Divorce, Allaitement
            { collection: 'tirmidhi', sectionIds: ['11', '12', '13'] } // Mariage, Allaitement, Divorce/Li'an
        ]
    },
    {
        id: 'successions-testaments',
        title: 'Successions & Testaments',
        description: 'Les lois d\'héritage (Fara\'id) et les dispositions testamentaires.',
        emoji: '📜',
        sections: [
            { collection: 'bukhari', sectionIds: ['55', '85'] }, // Testaments, Successions
            { collection: 'muslim', sectionIds: ['23', '25'] }, // Successions, Testaments
            { collection: 'abudawud', sectionIds: ['18', '19'] }, // Testaments, Successions
            { collection: 'nasai', sectionIds: ['30'] }, // Testaments
            { collection: 'ibnmajah', sectionIds: ['22', '23'] }, // Testaments, Successions
            { collection: 'malik', sectionIds: ['27', '37'] }, // Fara'id, Testaments
            { collection: 'tirmidhi', sectionIds: ['29', '30'] } // Héritage, Wasaya
        ]
    },
    {
        id: 'affranchissement',
        title: 'L\'Affranchissement',
        description: 'La libération des esclaves (Itq), le Mukatab et le Wala\'.',
        emoji: '🔓',
        sections: [
            { collection: 'bukhari', sectionIds: ['49', '50'] }, // Affranchissement, Muktata
            { collection: 'muslim', sectionIds: ['20'] }, // Affranchissement
            { collection: 'abudawud', sectionIds: ['31'] }, // Affranchissement
            { collection: 'ibnmajah', sectionIds: ['19'] }, // Affranchissement
            { collection: 'malik', sectionIds: ['38', '39', '40'] }, // Affranchissement/Wala', Mukatab, Mudabbar
            { collection: 'tirmidhi', sectionIds: ['31'] } // Wala' et cadeaux
        ]
    },
    {
        id: 'nourriture-boissons',
        title: 'Nourriture & Boissons',
        description: 'Les règles alimentaires, les boissons licites et illicites.',
        emoji: '🍽️',
        sections: [
            { collection: 'bukhari', sectionIds: ['70', '72', '74'] }, // Nourriture, Chasse/Abattage, Boissons
            { collection: 'muslim', sectionIds: ['34', '36'] }, // Chasse/Abattage, Boissons
            { collection: 'abudawud', sectionIds: ['17', '27', '28'] }, // Gibier, Boissons, Aliments
            { collection: 'nasai', sectionIds: ['42', '51'] }, // Chasse/Abattage, Boissons
            { collection: 'ibnmajah', sectionIds: ['27', '28', '29', '30'] }, // Abattage, Chasse, Nourriture, Boissons
            { collection: 'malik', sectionIds: ['24', '25', '42'] }, // Abattage, Gibier, Boissons
            { collection: 'tirmidhi', sectionIds: ['18', '25', '26'] } // Chasse, Nourriture, Boissons
        ]
    },
    {
        id: 'sacrifices',
        title: 'Les Sacrifices',
        description: 'Le sacrifice de l\'Aïd (Udhiya), la Aqiqa et les animaux sacrificiels.',
        emoji: '🐑',
        sections: [
            { collection: 'bukhari', sectionIds: ['71', '73'] }, // Aqiqah, Sacrifice Eid
            { collection: 'muslim', sectionIds: ['35'] }, // Sacrifices
            { collection: 'abudawud', sectionIds: ['16'] }, // Sacrifices
            { collection: 'nasai', sectionIds: ['40', '41', '43'] }, // Aqiqah, Al-Fara'/Al-'Atirah, Ad-Dahaya
            { collection: 'ibnmajah', sectionIds: ['26'] }, // Udhiyah
            { collection: 'malik', sectionIds: ['23', '26'] }, // Animaux sacrificiels, Aqiqa
            { collection: 'tirmidhi', sectionIds: ['19'] } // Sacrifices
        ]
    },
    {
        id: 'habillement-parure',
        title: 'Habillement & Parure',
        description: 'Les règles vestimentaires, les ornements et les bagues.',
        emoji: '👔',
        sections: [
            { collection: 'bukhari', sectionIds: ['77'] }, // Habillement
            { collection: 'muslim', sectionIds: ['37'] }, // Vêtements/Parures
            { collection: 'abudawud', sectionIds: ['34', '35', '36'] }, // Habillement, Peignage, Bagues
            { collection: 'nasai', sectionIds: ['48'] }, // Parure
            { collection: 'ibnmajah', sectionIds: ['32'] }, // Habillement
            { collection: 'malik', sectionIds: ['48', '51'] }, // Habillement, Cheveux
            { collection: 'tirmidhi', sectionIds: ['24'] } // Vêtements
        ]
    },
    {
        id: 'comportement-adab',
        title: 'Bon Comportement (Adab)',
        description: 'La morale, les bonnes manières, l\'éthique et les salutations.',
        emoji: '🤝',
        sections: [
            { collection: 'bukhari', sectionIds: ['78', '79'] }, // Adab, Permission
            { collection: 'muslim', sectionIds: ['38', '39', '40', '41'] }, // Adab, Salutations, Usage mots corrects, Poésie
            { collection: 'abudawud', sectionIds: ['43'] }, // Adab
            { collection: 'ibnmajah', sectionIds: ['33'] }, // Adab
            { collection: 'malik', sectionIds: ['47', '53', '56'] }, // Bon comportement, Salutations, Parole
            { collection: 'tirmidhi', sectionIds: ['27', '42', '43'] } // Justice/Relations proches, Demande autorisation, Bonnes manières
        ]
    },
    {
        id: 'medecine-sante',
        title: 'Médecine & Santé',
        description: 'Les remèdes prophétiques, les soins des malades et la médecine.',
        emoji: '⚕️',
        sections: [
            { collection: 'bukhari', sectionIds: ['75', '76'] }, // Malades, Médecine
            { collection: 'abudawud', sectionIds: ['29', '30'] }, // Médecine, Divination
            { collection: 'ibnmajah', sectionIds: ['31'] }, // Médecine
            { collection: 'malik', sectionIds: ['50'] }, // Mauvais œil
            { collection: 'tirmidhi', sectionIds: ['28'] } // Médecine
        ]
    },
    {
        id: 'invocations-dhikr',
        title: 'Invocations & Dhikr',
        description: 'Les douas, le rappel d\'Allah, le repentir et les supplications.',
        emoji: '🤲',
        sections: [
            { collection: 'bukhari', sectionIds: ['80'] }, // Invocations
            { collection: 'muslim', sectionIds: ['48', '50'] }, // Rappel/Invocation/Repentir, Repentir
            { collection: 'ibnmajah', sectionIds: ['34'] }, // Invocation
            { collection: 'nasai', sectionIds: ['50'] }, // Refuge auprès d'Allah
            { collection: 'malik', sectionIds: ['60'] }, // Invocation de l'opprimé
            { collection: 'tirmidhi', sectionIds: ['48'] } // Supplication
        ]
    },
    {
        id: 'serments-voeux',
        title: 'Serments & Vœux',
        description: 'Les serments (Ayman), les vœux (Nuthur) et leurs expiations.',
        emoji: '🤞',
        sections: [
            { collection: 'bukhari', sectionIds: ['83', '84'] }, // Serments/Vœux, Expiation serments
            { collection: 'muslim', sectionIds: ['26', '27'] }, // Vœux, Serments
            { collection: 'abudawud', sectionIds: ['22'] }, // Serments/Vœux
            { collection: 'malik', sectionIds: ['22'] }, // Vœux/Serments
            { collection: 'tirmidhi', sectionIds: ['20'] } // Vœux/Serments
        ]
    },
    {
        id: 'jihad-expeditions',
        title: 'Jihad & Expéditions',
        description: 'L\'effort dans la voie d\'Allah, les batailles prophétiques et le gouvernement.',
        emoji: '⚔️',
        sections: [
            { collection: 'bukhari', sectionIds: ['56', '57', '58', '64'] }, // Jihad, Khumus, Jizya, Maghazi
            { collection: 'muslim', sectionIds: ['32', '33'] }, // Jihad/Expéditions, Gouvernement
            { collection: 'abudawud', sectionIds: ['15', '20', '39'] }, // Jihad, Impôt foncier/Butin, Batailles
            { collection: 'nasai', sectionIds: ['25', '28', '38', '39'] }, // Jihad, Chevaux/Tir, Distribution Fay', Allégeance
            { collection: 'ibnmajah', sectionIds: ['24'] }, // Jihad
            { collection: 'malik', sectionIds: ['21', '55'] }, // Jihad, Allégeance
            { collection: 'tirmidhi', sectionIds: ['21', '22', '23'] } // Expéditions, Vertus Jihad, Jihad
        ]
    },
    {
        id: 'riqaq-zuhd',
        title: 'Adoucissement des Cœurs & Ascétisme',
        description: 'La spiritualité, le renoncement (Zuhd), la piété et l\'adoucissement des cœurs.',
        emoji: '💚',
        sections: [
            { collection: 'bukhari', sectionIds: ['81', '94'] }, // Riqaq, Souhaits
            { collection: 'muslim', sectionIds: ['49', '55'] }, // Adoucissement cœurs, Zuhd
            { collection: 'ibnmajah', sectionIds: ['37'] }, // Zuhd
            { collection: 'tirmidhi', sectionIds: ['36', '37'] } // Zuhd, Description Jugement/Riqaq/Wara'
        ]
    },
    {
        id: 'reves-interpretation',
        title: 'Rêves & Interprétation',
        description: 'L\'interprétation des rêves et leurs significations.',
        emoji: '💭',
        sections: [
            { collection: 'bukhari', sectionIds: ['91'] }, // Interprétation rêves
            { collection: 'muslim', sectionIds: ['42'] }, // Rêves
            { collection: 'ibnmajah', sectionIds: ['35'] }, // Interprétation rêves
            { collection: 'malik', sectionIds: ['52'] }, // Visions
            { collection: 'tirmidhi', sectionIds: ['34'] } // Rêves
        ]
    },
    {
        id: 'prophetes-compagnons',
        title: 'Les Prophètes & Compagnons',
        description: 'Les histoires des prophètes et les mérites des compagnons du Prophète ﷺ.',
        emoji: '🌟',
        sections: [
            { collection: 'bukhari', sectionIds: ['59', '60', '61', '62', '63'] }, // Création, Prophètes, Mérites Prophète/Compagnons, Compagnons, Ansars
            { collection: 'muslim', sectionIds: ['43', '44'] }, // Vertus, Mérites Compagnons
            { collection: 'malik', sectionIds: ['49', '61'] }, // Description Prophète, Noms du Prophète
            { collection: 'tirmidhi', sectionIds: ['49'] } // Vertus
        ]
    },
    {
        id: 'coran-tafsir',
        title: 'Le Coran & Tafsir',
        description: 'L\'exégèse du Coran, ses mérites, sa récitation et ses sciences.',
        emoji: '📖',
        sections: [
            { collection: 'bukhari', sectionIds: ['65', '66'] }, // Tafsir, Vertus Coran
            { collection: 'muslim', sectionIds: ['56'] }, // Tafsir
            { collection: 'abudawud', sectionIds: ['32'] }, // Lectures Coran
            { collection: 'malik', sectionIds: ['15'] }, // Coran
            { collection: 'tirmidhi', sectionIds: ['45', '46', '47'] } // Vertus Coran, Récitation, Tafsir
        ]
    },
    {
        id: 'paraboles-paroles',
        title: 'Paraboles & Paroles Sages',
        description: 'Les exemples prophétiques, les métaphores et les enseignements moraux.',
        emoji: '💬',
        sections: [
            { collection: 'bukhari', sectionIds: ['95'] }, // Acceptation information unique
            { collection: 'tirmidhi', sectionIds: ['44'] } // Paraboles
        ]
    },
    {
        id: 'fitan-signes',
        title: 'Les Troubles & Signes de la Fin',
        description: 'Les épreuves (Fitan), les signes de l\'Heure et la fin des temps.',
        emoji: '⚡',
        sections: [
            { collection: 'bukhari', sectionIds: ['92'] }, // Fitan
            { collection: 'muslim', sectionIds: ['51', '54'] }, // Hypocrites, Fitan/Signes fin
            { collection: 'abudawud', sectionIds: ['37', '38'] }, // Fitan, Mahdi
            { collection: 'ibnmajah', sectionIds: ['36'] }, // Fitan
            { collection: 'tirmidhi', sectionIds: ['33'] } // Fitan
        ]
    },
    {
        id: 'audela-akhira',
        title: 'L\'Au-delà & Le Jugement',
        description: 'Le Jour du Jugement, le Paradis, l\'Enfer et la résurrection.',
        emoji: '🌅',
        sections: [
            { collection: 'muslim', sectionIds: ['52', '53'] }, // Jugement/Paradis/Enfer, Paradis/Habitants
            { collection: 'malik', sectionIds: ['57'] }, // Jahannam
            { collection: 'tirmidhi', sectionIds: ['37', '38', '39'] } // Description Jugement/Riqaq, Paradis, Enfer
        ]
    }
];
