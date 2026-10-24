import namesVerses from './names-verses.json';

/**
 * Origine du verset associé à un nom :
 * - 'nom'    : le nom figure tel quel (ou sous une forme nominale) dans le verset
 * - 'racine' : le verset contient la racine / la forme verbale ; le nom vient de la liste du hadith d'at-Tirmidhī
 * - 'sens'   : pas de racine commune ; verset au sens proche, le nom vient de la liste du hadith d'at-Tirmidhī
 */
export type NameVerseSource = 'nom' | 'racine' | 'sens';

export interface NameVerse {
    sourate: number;
    ayah: number;
    source: NameVerseSource;
    note?: string;
    // Remplis depuis data/names-verses.json (généré par scripts/build_names_verses.ts)
    arabe?: string;
    francais?: string;
    sourateNom?: string;
}

export interface AllahName {
    Number: number;
    arabe: string;
    transliteration: string;
    francais: string;
    signification: string;
    /** Ce qui distingue ce nom des noms proches (sens ou orthographe) */
    distinction?: string;
    /** Numéros des noms avec lesquels il ne faut pas le confondre (dérivé de CONFUSABLE_GROUPS) */
    confusableWith?: number[];
    verset: NameVerse;
}

/** Groupes de noms proches par le sens ou par l'orthographe. */
export const CONFUSABLE_GROUPS: number[][] = [
    [1, 2, 83],             // miséricorde
    [14, 34, 82],           // pardon
    [8, 53, 54, 69, 70],    // force et pouvoir
    [18, 28, 29, 86],       // jugement et justice
    [28, 32, 46],           // Ḥakam / Ḥalīm / Ḥakīm (orthographe)
    [32, 99],               // longanimité / patience
    [48, 65],               // Majīd / Mājid
    [64, 66, 67],           // Wājid / Wāḥid / Aḥad
    [55, 77],               // Waliyy / Wālī
    [3, 84],                // Malik / Mālik al-Mulk
    [36, 78],               // ʿAliyy / Mutaʿālī
    [10, 33, 37],           // grandeur
    [41, 85],               // majesté
    [4, 5],                 // Quddūs / Salām
    [6, 7, 38],             // sécurité et préservation
    [43, 50],               // observation et témoignage
    [11, 12, 13, 95],       // création
    [58, 95],               // Mubdiʾ / Badīʿ
    [17, 39],               // subsistance
    [16, 42],               // don et générosité
    [88, 89],               // Ghaniyy / Mughnī
    [94, 98],               // guidance
    [19, 31],               // science
    [21, 27],               // Bāsiṭ / Baṣīr (orthographe)
    [62, 74, 96],           // vie et permanence
    [30, 79],               // bonté
    [9, 15],                // domination
    [40, 57],               // compte
];

const D_MISERICORDE = "Ar-Raḥmān : une miséricorde immense qui touche toute la création, croyants comme non-croyants, dans cette vie. Ar-Raḥīm : une miséricorde particulière et durable envers les croyants, surtout dans l'au-delà. Ar-Raʾūf : la forme la plus tendre de la miséricorde, qui épargne l'épreuve et allège les charges.";
const D_PARDON = "Al-Ghaffār : le pardon répété, sans cesse renouvelé chaque fois que le serviteur revient. Al-Ghafūr : l'immensité du pardon, qui couvre même les plus grands péchés. Al-ʿAfuww : l'effacement total du péché, jusqu'à sa trace.";
const D_FORCE = "Al-ʿAzīz : Il n'est jamais vaincu et nul ne peut L'atteindre. Al-Qawiyy : Sa force est parfaite. Al-Matīn : Sa force est intense et ne faiblit jamais. Al-Qādir : Il est capable de toute chose. Al-Muqtadir : Son pouvoir est absolu et s'exerce pleinement.";
const D_JUSTICE = "Al-Fattāḥ : Il ouvre ce qui est fermé (miséricorde, subsistance) et tranche entre les gens. Al-Ḥakam : le Juge dont le jugement est définitif. Al-ʿAdl : la justice même, Il ne lèse personne. Al-Muqsiṭ : Il établit l'équité et rend justice à l'opprimé.";
const D_HAKAM = "Trois noms proches (même ح) : Al-Ḥakam (الحَكَم, juger), Al-Ḥakīm (الحَكِيم, la sagesse) et Al-Ḥalīm (الحَلِيم, la longanimité, avec un « l »).";
const D_HALIM = "Al-Ḥalīm : Il voit la désobéissance et s'abstient de punir alors qu'Il le peut, souvent pour pardonner. Aṣ-Ṣabūr : Il retarde la punition jusqu'à un terme fixé, sans pour autant la négliger.";
const D_MAJID = "Même racine (m-j-d : gloire, noblesse). Al-Majīd (المَجِيد, « ī » long) est la forme intensive : une gloire immense et permanente ; il est cité dans le Coran (« حَمِيدٌ مَجِيدٌ »). Al-Mājid (المَاجِد, « ā » long) met l'accent sur la noblesse qui se manifeste par la générosité ; il provient de la liste du hadith d'at-Tirmidhī.";
const D_WAHID = "Al-Wājid (الوَاجِد, avec ج) : Celui qui trouve tout ce qu'Il veut, à qui rien ne manque. Al-Wāḥid (الوَاحِد, avec ح) : l'Unique, Il n'a ni second ni égal. Al-Aḥad (الأَحَد) : l'Un, indivisible en Son essence, rien ne Lui ressemble.";
const D_WALI = "Al-Waliyy (الوَلِيّ) : l'Allié proche, qui soutient, protège et aime les croyants. Al-Wālī (الوَالِي) : Celui qui administre et gouverne toute la création.";
const D_MALIK = "Al-Malik : Il est le Roi. Mālik al-Mulk : Il possède toute royauté et la donne ou la retire à qui Il veut.";
const D_ALI = "Al-ʿAliyy : Il est au-dessus de toute chose. Al-Mutaʿālī : Il est exalté au-dessus de tout ce qui ne Lui convient pas (défaut, ressemblance avec la création).";
const D_GRANDEUR = "Al-Mutakabbir : la grandeur Lui appartient en propre (qualité louable pour Lui seul, blâmable chez la créature). Al-Kabīr : Il est plus grand que toute chose. Al-ʿAẓīm : Son immensité dépasse toute conception.";
const D_MAJESTE = "Al-Jalīl : la majesté. Dhū-l-Jalāl wa-l-Ikrām : la majesté ET la générosité réunies ; Il est exalté et honoré, et Il honore Ses serviteurs.";
const D_QUDDUS = "Al-Quddūs : la sainteté, la pureté absolue de toute imperfection. As-Salām : exempt de tout défaut, et source de paix et de salut pour Ses créatures.";
const D_SECURITE = "Al-Muʾmin : Il accorde la sécurité et confirme la véracité de Ses messagers. Al-Muhaymin : Il veille sur toute chose et en est témoin. Al-Ḥafīẓ : Il préserve et conserve, rien ne se perd auprès de Lui.";
const D_RAQIB = "Ar-Raqīb : la vigilance permanente, Il surveille chaque acte et chaque pensée. Ash-Shahīd : Il est présent à toute chose et en témoignera.";
const D_CREATION = "Al-Khāliq : Il détermine et crée. Al-Bāriʾ : Il fait exister en distinguant chaque créature. Al-Muṣawwir : Il donne à chacune sa forme propre. Al-Badīʿ : Il crée de façon inédite, sans modèle préalable.";
const D_MUBDI = "Al-Mubdiʾ (المُبْدِئ) : Il commence la création une première fois (et la refera : Al-Muʿīd). Al-Badīʿ (البَدِيع) : Il crée de façon inédite, sans modèle préalable.";
const D_RIZQ = "Ar-Razzāq : Il accorde la subsistance à toutes Ses créatures. Al-Muqīt : Il donne à chaque être sa nourriture et veille sur lui avec pouvoir.";
const D_DON = "Al-Wahhāb : Il donne gratuitement, sans contrepartie. Al-Karīm : la générosité dans toute sa noblesse ; Il donne avant qu'on Lui demande et pardonne.";
const D_GHANI = "Al-Ghaniyy : Lui-même n'a besoin de rien ni de personne. Al-Mughnī : Il enrichit les autres et comble leurs besoins.";
const D_GUIDE = "Al-Hādī : Il guide vers la vérité et ce qui est utile. Ar-Rashīd : Il conduit toute chose avec sagesse vers sa juste fin et accorde la droiture.";
const D_SCIENCE = "Al-ʿAlīm : Il connaît toute chose. Al-Khabīr : Il connaît la réalité intime et le fond des choses.";
const D_BASIT = "Orthographe proche : Al-Bāsiṭ (البَاسِط, avec ط) : Celui qui étend la subsistance. Al-Baṣīr (البَصِير, avec ر) : Celui qui voit tout.";
const D_VIE = "Al-Ḥayy : Sa vie est parfaite, sans commencement ni fin. Al-Ākhir : rien n'est après Lui. Al-Bāqī : Il demeure quand tout disparaît.";
const D_BONTE = "Al-Laṭīf : une bonté discrète et subtile, qui passe par des chemins cachés. Al-Barr : une bonté manifeste et abondante, fidèle à Ses promesses.";
const D_DOMINATION = "Al-Jabbār : Il impose Sa volonté et répare ce qui est brisé (les cœurs, les situations). Al-Qahhār : Il domine tout, et tout Lui est soumis.";
const D_COMPTE = "Al-Ḥasīb : Il suffit à Ses serviteurs et leur demandera compte. Al-Muḥṣī : Il dénombre tout avec précision, rien ne Lui échappe.";

const v = (sourate: number, ayah: number, source: NameVerseSource, note?: string): NameVerse =>
    note ? { sourate, ayah, source, note } : { sourate, ayah, source };

const baseNames: AllahName[] = [
    { Number: 1, arabe: "الرَّحْمَنُ", transliteration: "Ar-Raḥmān", francais: "Le Tout-Miséricordieux", signification: "Celui dont la miséricorde immense embrasse toute la création, croyants comme non-croyants.", distinction: D_MISERICORDE, verset: v(20, 5, 'nom') },
    { Number: 2, arabe: "الرَّحِيمُ", transliteration: "Ar-Raḥīm", francais: "Le Très-Miséricordieux", signification: "Celui qui fait miséricorde de façon particulière et durable aux croyants, surtout dans l'au-delà.", distinction: D_MISERICORDE, verset: v(33, 43, 'nom') },
    { Number: 3, arabe: "الْمَلِكُ", transliteration: "Al-Malik", francais: "Le Roi, le Souverain", signification: "Le Souverain absolu, qui possède toute chose et la gouverne par Son ordre.", distinction: D_MALIK, verset: v(23, 116, 'nom') },
    { Number: 4, arabe: "الْقُدُّوسُ", transliteration: "Al-Quddūs", francais: "Le Très-Saint", signification: "Celui qui est pur de tout défaut, de toute imperfection et de toute ressemblance avec la création.", distinction: D_QUDDUS, verset: v(62, 1, 'nom') },
    { Number: 5, arabe: "السَّلَامُ", transliteration: "As-Salām", francais: "La Paix", signification: "Celui qui est exempt de tout défaut, et de qui viennent la paix et le salut.", distinction: D_QUDDUS, verset: v(59, 23, 'nom') },
    { Number: 6, arabe: "الْمُؤْمِنُ", transliteration: "Al-Muʾmin", francais: "Le Garant de la sécurité", signification: "Celui qui accorde la sécurité à Ses serviteurs et confirme la véracité de Ses messagers.", distinction: D_SECURITE, verset: v(59, 23, 'nom') },
    { Number: 7, arabe: "الْمُهَيْمِنُ", transliteration: "Al-Muhaymin", francais: "Le Surveillant suprême", signification: "Celui qui veille sur toute chose, en est témoin et la tient sous Son autorité.", distinction: D_SECURITE, verset: v(59, 23, 'nom') },
    { Number: 8, arabe: "الْعَزِيزُ", transliteration: "Al-ʿAzīz", francais: "L'Invincible", signification: "Le Tout-Puissant que nul ne peut vaincre ni atteindre.", distinction: D_FORCE, verset: v(3, 6, 'nom') },
    { Number: 9, arabe: "الْجَبَّارُ", transliteration: "Al-Jabbār", francais: "Le Contraignant", signification: "Celui qui impose Sa volonté à toute chose et qui répare ce qui est brisé chez Ses serviteurs.", distinction: D_DOMINATION, verset: v(59, 23, 'nom') },
    { Number: 10, arabe: "الْمُتَكَبِّرُ", transliteration: "Al-Mutakabbir", francais: "Le Suprêmement Grand", signification: "Celui à qui seul appartient la grandeur, au-dessus de tout défaut.", distinction: D_GRANDEUR, verset: v(59, 23, 'nom') },
    { Number: 11, arabe: "الْخَالِقُ", transliteration: "Al-Khāliq", francais: "Le Créateur", signification: "Celui qui détermine et crée toute chose à partir du néant.", distinction: D_CREATION, verset: v(59, 24, 'nom') },
    { Number: 12, arabe: "الْبَارِئُ", transliteration: "Al-Bāriʾ", francais: "Celui qui donne l'existence", signification: "Celui qui fait exister les créatures en les distinguant les unes des autres, sans défaut.", distinction: D_CREATION, verset: v(59, 24, 'nom') },
    { Number: 13, arabe: "الْمُصَوِّرُ", transliteration: "Al-Muṣawwir", francais: "Le Façonneur", signification: "Celui qui donne à chaque créature sa forme et son aspect propres.", distinction: D_CREATION, verset: v(59, 24, 'nom') },
    { Number: 14, arabe: "الْغَفَّارُ", transliteration: "Al-Ghaffār", francais: "Celui qui pardonne sans cesse", signification: "Celui qui pardonne encore et encore, autant de fois que le serviteur revient à Lui.", distinction: D_PARDON, verset: v(20, 82, 'nom') },
    { Number: 15, arabe: "الْقَهَّارُ", transliteration: "Al-Qahhār", francais: "Le Dominateur suprême", signification: "Celui qui soumet toute chose et à qui rien ne résiste.", distinction: D_DOMINATION, verset: v(40, 16, 'nom') },
    { Number: 16, arabe: "الْوَهَّابُ", transliteration: "Al-Wahhāb", francais: "Le Dispensateur de dons", signification: "Celui qui donne abondamment, sans contrepartie et sans attendre de retour.", distinction: D_DON, verset: v(3, 8, 'nom') },
    { Number: 17, arabe: "الرَّزَّاقُ", transliteration: "Ar-Razzāq", francais: "Le Pourvoyeur", signification: "Celui qui accorde la subsistance, matérielle et spirituelle, à toutes Ses créatures.", distinction: D_RIZQ, verset: v(51, 58, 'nom') },
    { Number: 18, arabe: "الْفَتَّاحُ", transliteration: "Al-Fattāḥ", francais: "Celui qui ouvre et tranche", signification: "Celui qui ouvre les portes de la miséricorde et de la subsistance, et qui tranche entre les gens avec la vérité.", distinction: D_JUSTICE, verset: v(34, 26, 'nom') },
    { Number: 19, arabe: "الْعَلِيمُ", transliteration: "Al-ʿAlīm", francais: "L'Omniscient", signification: "Celui qui connaît toute chose : le passé, le présent, l'avenir, l'apparent et le caché.", distinction: D_SCIENCE, verset: v(2, 29, 'nom') },
    { Number: 20, arabe: "الْقَابِضُ", transliteration: "Al-Qābiḍ", francais: "Celui qui restreint", signification: "Celui qui retient et restreint la subsistance selon Sa sagesse.", verset: v(2, 245, 'racine', "Forme verbale : « يَقْبِضُ » (Il restreint).") },
    { Number: 21, arabe: "الْبَاسِطُ", transliteration: "Al-Bāsiṭ", francais: "Celui qui étend", signification: "Celui qui étend et élargit la subsistance et la miséricorde à qui Il veut.", distinction: D_BASIT, verset: v(2, 245, 'racine', "Forme verbale : « يَبْسُطُ » (Il étend).") },
    { Number: 22, arabe: "الْخَافِضُ", transliteration: "Al-Khāfiḍ", francais: "Celui qui abaisse", signification: "Celui qui abaisse les orgueilleux et les injustes.", verset: v(56, 3, 'racine', "Le verset décrit l'Heure qui, par décret d'Allah, abaisse les uns et élève les autres.") },
    { Number: 23, arabe: "الرَّافِعُ", transliteration: "Ar-Rāfiʿ", francais: "Celui qui élève", signification: "Celui qui élève en degrés les croyants et les gens de savoir.", verset: v(58, 11, 'racine', "Forme verbale : « يَرْفَعِ اللَّهُ » (Allah élèvera).") },
    { Number: 24, arabe: "الْمُعِزُّ", transliteration: "Al-Muʿizz", francais: "Celui qui donne la puissance", signification: "Celui qui honore et donne la force à qui Il veut.", verset: v(3, 26, 'racine', "Forme verbale : « تُعِزُّ » (Tu donnes la puissance).") },
    { Number: 25, arabe: "الْمُذِلُّ", transliteration: "Al-Mudhill", francais: "Celui qui humilie", signification: "Celui qui avilit qui Il veut parmi ceux qui s'opposent à la vérité.", verset: v(3, 26, 'racine', "Forme verbale : « تُذِلُّ » (Tu humilies).") },
    { Number: 26, arabe: "السَّمِيعُ", transliteration: "As-Samīʿ", francais: "Celui qui entend tout", signification: "Celui qui entend toute voix, toute parole et toute invocation, même secrète.", verset: v(2, 127, 'nom') },
    { Number: 27, arabe: "الْبَصِيرُ", transliteration: "Al-Baṣīr", francais: "Le Clairvoyant", signification: "Celui qui voit toute chose, rien ne Lui échappe.", distinction: D_BASIT, verset: v(42, 11, 'nom') },
    { Number: 28, arabe: "الْحَكَمُ", transliteration: "Al-Ḥakam", francais: "Le Juge", signification: "Celui qui juge entre Ses créatures ; nul ne peut revenir sur Son jugement.", distinction: `${D_JUSTICE} ${D_HAKAM}`, verset: v(6, 114, 'nom') },
    { Number: 29, arabe: "الْعَدْلُ", transliteration: "Al-ʿAdl", francais: "Le Juste", signification: "La justice même : Il ne commet aucune injustice, fût-ce du poids d'un atome.", distinction: D_JUSTICE, verset: v(16, 90, 'racine', "Le verset contient le mot « العَدْل » (la justice).") },
    { Number: 30, arabe: "اللَّطِيفُ", transliteration: "Al-Laṭīf", francais: "Le Subtil, le Bienveillant", signification: "Celui qui connaît les choses les plus fines et fait parvenir Ses bienfaits par des voies insoupçonnées.", distinction: D_BONTE, verset: v(67, 14, 'nom') },
    { Number: 31, arabe: "الْخَبِيرُ", transliteration: "Al-Khabīr", francais: "Le Parfaitement Informé", signification: "Celui qui connaît la réalité intime et le fond de toute chose.", distinction: D_SCIENCE, verset: v(6, 18, 'nom') },
    { Number: 32, arabe: "الْحَلِيمُ", transliteration: "Al-Ḥalīm", francais: "Le Longanime", signification: "Celui qui voit la désobéissance et ne se hâte pas de punir alors qu'Il en a le pouvoir, laissant le temps du repentir.", distinction: `${D_HALIM} ${D_HAKAM}`, verset: v(2, 263, 'nom') },
    { Number: 33, arabe: "الْعَظِيمُ", transliteration: "Al-ʿAẓīm", francais: "L'Immense", signification: "Celui dont la grandeur et la majesté dépassent toute conception.", distinction: D_GRANDEUR, verset: v(56, 96, 'nom') },
    { Number: 34, arabe: "الْغَفُورُ", transliteration: "Al-Ghafūr", francais: "Le Très-Pardonneur", signification: "Celui dont le pardon est immense et couvre les péchés, même les plus grands.", distinction: D_PARDON, verset: v(15, 49, 'nom') },
    { Number: 35, arabe: "الشَّكُورُ", transliteration: "Ash-Shakūr", francais: "Le Reconnaissant", signification: "Celui qui récompense largement les œuvres, même petites.", verset: v(35, 30, 'nom') },
    { Number: 36, arabe: "الْعَلِيُّ", transliteration: "Al-ʿAliyy", francais: "Le Très-Haut", signification: "Celui qui est au-dessus de toute chose, par Son essence, Sa valeur et Sa domination.", distinction: D_ALI, verset: v(42, 4, 'nom') },
    { Number: 37, arabe: "الْكَبِيرُ", transliteration: "Al-Kabīr", francais: "Le Grand", signification: "Celui qui est plus grand que toute chose.", distinction: D_GRANDEUR, verset: v(22, 62, 'nom') },
    { Number: 38, arabe: "الْحَفِيظُ", transliteration: "Al-Ḥafīẓ", francais: "Le Gardien", signification: "Celui qui préserve Ses créatures et conserve toute chose : rien ne se perd auprès de Lui.", distinction: D_SECURITE, verset: v(11, 57, 'nom') },
    { Number: 39, arabe: "الْمُقِيتُ", transliteration: "Al-Muqīt", francais: "Celui qui nourrit et maintient", signification: "Celui qui donne à chaque être sa nourriture et veille sur toute chose avec pouvoir.", distinction: D_RIZQ, verset: v(4, 85, 'nom') },
    { Number: 40, arabe: "الْحَسِيبُ", transliteration: "Al-Ḥasīb", francais: "Celui qui suffit et demande compte", signification: "Celui qui suffit à Ses serviteurs et qui leur demandera compte de leurs actes.", distinction: D_COMPTE, verset: v(4, 86, 'nom') },
    { Number: 41, arabe: "الْجَلِيلُ", transliteration: "Al-Jalīl", francais: "Le Majestueux", signification: "Celui qui possède la majesté et la grandeur parfaites.", distinction: D_MAJESTE, verset: v(55, 78, 'racine', "Le verset contient « الجَلَال » (la majesté).") },
    { Number: 42, arabe: "الْكَرِيمُ", transliteration: "Al-Karīm", francais: "Le Généreux", signification: "Celui dont la générosité est infinie, qui donne avant qu'on Lui demande et pardonne.", distinction: D_DON, verset: v(82, 6, 'nom') },
    { Number: 43, arabe: "الرَّقِيبُ", transliteration: "Ar-Raqīb", francais: "L'Observateur", signification: "Celui qui observe en permanence Ses créatures ; rien de leurs actes ni de leurs pensées ne Lui échappe.", distinction: D_RAQIB, verset: v(4, 1, 'nom') },
    { Number: 44, arabe: "الْمُجِيبُ", transliteration: "Al-Mujīb", francais: "Celui qui exauce", signification: "Celui qui répond aux invocations de ceux qui L'appellent.", verset: v(11, 61, 'nom') },
    { Number: 45, arabe: "الْوَاسِعُ", transliteration: "Al-Wāsiʿ", francais: "Le Vaste", signification: "Celui dont la miséricorde, la science et la générosité embrassent tout.", verset: v(2, 115, 'nom') },
    { Number: 46, arabe: "الْحَكِيمُ", transliteration: "Al-Ḥakīm", francais: "Le Sage", signification: "Celui qui met chaque chose à sa juste place ; rien dans Ses ordres ni dans Sa création n'est vain.", distinction: D_HAKAM, verset: v(2, 32, 'nom') },
    { Number: 47, arabe: "الْوَدُودُ", transliteration: "Al-Wadūd", francais: "Le Bien-Aimant", signification: "Celui qui aime Ses serviteurs croyants et qui est aimé d'eux.", verset: v(85, 14, 'nom') },
    { Number: 48, arabe: "الْمَجِيدُ", transliteration: "Al-Majīd", francais: "Le Tout-Glorieux", signification: "Celui dont la gloire, l'honneur et la générosité sont immenses et permanents.", distinction: D_MAJID, verset: v(11, 73, 'nom') },
    { Number: 49, arabe: "الْبَاعِثُ", transliteration: "Al-Bāʿith", francais: "Celui qui ressuscite", signification: "Celui qui redonne vie aux morts le Jour de la Résurrection.", verset: v(22, 7, 'racine', "Forme verbale : « يَبْعَثُ » (Il ressuscite).") },
    { Number: 50, arabe: "الشَّهِيدُ", transliteration: "Ash-Shahīd", francais: "Le Témoin", signification: "Celui qui est présent à toute chose et en témoigne ; rien ne Lui échappe.", distinction: D_RAQIB, verset: v(85, 9, 'nom') },
    { Number: 51, arabe: "الْحَقُّ", transliteration: "Al-Ḥaqq", francais: "La Vérité", signification: "Celui dont l'existence est certaine ; tout ce qui est adoré en dehors de Lui est faux.", verset: v(22, 6, 'nom') },
    { Number: 52, arabe: "الْوَكِيلُ", transliteration: "Al-Wakīl", francais: "Le Garant", signification: "Celui à qui l'on confie ses affaires et qui s'en charge parfaitement.", verset: v(3, 173, 'nom') },
    { Number: 53, arabe: "الْقَوِيُّ", transliteration: "Al-Qawiyy", francais: "Le Fort", signification: "Celui dont la force est parfaite.", distinction: D_FORCE, verset: v(42, 19, 'nom') },
    { Number: 54, arabe: "الْمَتِينُ", transliteration: "Al-Matīn", francais: "L'Inébranlable", signification: "Celui dont la force est intense et ne faiblit jamais.", distinction: D_FORCE, verset: v(51, 58, 'nom') },
    { Number: 55, arabe: "الْوَلِيُّ", transliteration: "Al-Waliyy", francais: "L'Allié", signification: "Celui qui soutient, protège et aime les croyants.", distinction: D_WALI, verset: v(3, 68, 'nom') },
    { Number: 56, arabe: "الْحَمِيدُ", transliteration: "Al-Ḥamīd", francais: "Le Digne de louange", signification: "Celui qui mérite toutes les louanges, dans l'aisance comme dans l'épreuve.", verset: v(42, 28, 'nom') },
    { Number: 57, arabe: "الْمُحْصِي", transliteration: "Al-Muḥṣī", francais: "Celui qui dénombre", signification: "Celui qui connaît le nombre exact de toute chose.", distinction: D_COMPTE, verset: v(19, 94, 'racine', "Forme verbale : « أَحْصَاهُمْ » (Il les a dénombrés).") },
    { Number: 58, arabe: "الْمُبْدِئُ", transliteration: "Al-Mubdiʾ", francais: "Celui qui commence", signification: "Celui qui fait commencer la création une première fois.", distinction: D_MUBDI, verset: v(85, 13, 'racine', "Forme verbale : « يُبْدِئُ » (Il commence).") },
    { Number: 59, arabe: "الْمُعِيدُ", transliteration: "Al-Muʿīd", francais: "Celui qui recrée", signification: "Celui qui ramène la création après sa disparition, notamment lors de la Résurrection.", verset: v(30, 27, 'racine', "Forme verbale : « يُعِيدُهُ » (Il la refait).") },
    { Number: 60, arabe: "الْمُحْيِي", transliteration: "Al-Muḥyī", francais: "Celui qui donne la vie", signification: "Celui qui crée la vie, ranime la terre morte et ressuscitera les morts.", verset: v(30, 50, 'nom') },
    { Number: 61, arabe: "الْمُمِيتُ", transliteration: "Al-Mumīt", francais: "Celui qui donne la mort", signification: "Celui qui décrète la mort de tout être vivant au terme fixé.", verset: v(57, 2, 'racine', "Forme verbale : « يُمِيتُ » (Il fait mourir).") },
    { Number: 62, arabe: "الْحَيُّ", transliteration: "Al-Ḥayy", francais: "Le Vivant", signification: "Celui dont la vie est parfaite, sans commencement ni fin, et qui ne meurt jamais.", distinction: D_VIE, verset: v(25, 58, 'nom') },
    { Number: 63, arabe: "الْقَيُّومُ", transliteration: "Al-Qayyūm", francais: "Celui qui subsiste par Lui-même", signification: "Celui qui n'a besoin de personne et par qui toute chose subsiste.", verset: v(3, 2, 'nom') },
    { Number: 64, arabe: "الْوَاجِدُ", transliteration: "Al-Wājid", francais: "Celui à qui rien ne manque", signification: "Celui qui trouve tout ce qu'Il veut et ne manque de rien.", distinction: D_WAHID, verset: v(93, 6, 'racine', "Forme verbale : « يَجِدْكَ » (Il t'a trouvé).") },
    { Number: 65, arabe: "الْمَاجِدُ", transliteration: "Al-Mājid", francais: "Le Noble", signification: "Celui dont la noblesse se manifeste par Sa générosité et Ses bienfaits.", distinction: D_MAJID, verset: v(85, 15, 'racine', "Le verset contient « المَجِيد », de la même racine.") },
    { Number: 66, arabe: "الْوَاحِدُ", transliteration: "Al-Wāḥid", francais: "L'Unique", signification: "Celui qui n'a ni associé, ni égal, ni second.", distinction: D_WAHID, verset: v(12, 39, 'nom') },
    { Number: 67, arabe: "الْأَحَدُ", transliteration: "Al-Aḥad", francais: "L'Un", signification: "Celui qui est Un en Son essence, indivisible, et à qui rien ne ressemble.", distinction: D_WAHID, verset: v(112, 1, 'nom') },
    { Number: 68, arabe: "الصَّمَدُ", transliteration: "Aṣ-Ṣamad", francais: "Le Soutien universel", signification: "Celui vers qui toutes les créatures se tournent pour leurs besoins, et qui n'a besoin de personne.", verset: v(112, 2, 'nom') },
    { Number: 69, arabe: "الْقَادِرُ", transliteration: "Al-Qādir", francais: "Le Capable", signification: "Celui qui a le pouvoir de faire tout ce qu'Il veut.", distinction: D_FORCE, verset: v(6, 65, 'nom') },
    { Number: 70, arabe: "الْمُقْتَدِرُ", transliteration: "Al-Muqtadir", francais: "L'Omnipotent", signification: "Celui dont le pouvoir est absolu et s'exerce pleinement, sans que rien ne L'en empêche.", distinction: D_FORCE, verset: v(54, 55, 'nom') },
    { Number: 71, arabe: "الْمُقَدِّمُ", transliteration: "Al-Muqaddim", francais: "Celui qui avance", signification: "Celui qui place en avant ce qu'Il veut et qui Il veut.", verset: v(50, 28, 'racine', "Forme verbale : « قَدَّمْتُ » (J'ai avancé). Le nom vient du hadith : « Tu es Celui qui avance et Celui qui retarde » (Al-Bukhārī, Muslim).") },
    { Number: 72, arabe: "الْمُؤَخِّرُ", transliteration: "Al-Muʾakhkhir", francais: "Celui qui retarde", signification: "Celui qui place en arrière ce qu'Il veut et qui Il veut.", verset: v(14, 42, 'racine', "Forme verbale : « يُؤَخِّرُهُمْ » (Il leur accorde un délai). Le nom vient du hadith : « Tu es Celui qui avance et Celui qui retarde » (Al-Bukhārī, Muslim).") },
    { Number: 73, arabe: "الْأَوَّلُ", transliteration: "Al-Awwal", francais: "Le Premier", signification: "Celui qui n'a pas de commencement ; rien n'était avant Lui.", verset: v(57, 3, 'nom') },
    { Number: 74, arabe: "الْآخِرُ", transliteration: "Al-Ākhir", francais: "Le Dernier", signification: "Celui qui n'a pas de fin ; rien ne sera après Lui.", distinction: D_VIE, verset: v(57, 3, 'nom') },
    { Number: 75, arabe: "الظَّاهِرُ", transliteration: "Aẓ-Ẓāhir", francais: "L'Apparent", signification: "Celui dont l'existence est évidente par Ses signes ; rien n'est au-dessus de Lui.", verset: v(57, 3, 'nom') },
    { Number: 76, arabe: "الْبَاطِنُ", transliteration: "Al-Bāṭin", francais: "Le Caché", signification: "Celui que les regards ne peuvent atteindre ; rien n'est plus proche que Lui.", verset: v(57, 3, 'nom') },
    { Number: 77, arabe: "الْوَالِي", transliteration: "Al-Wālī", francais: "Le Gouverneur", signification: "Celui qui administre et dirige toutes les affaires de la création.", distinction: D_WALI, verset: v(13, 11, 'nom') },
    { Number: 78, arabe: "الْمُتَعَالِي", transliteration: "Al-Mutaʿālī", francais: "L'Exalté", signification: "Celui qui est exalté au-dessus de toute imperfection et de toute ressemblance avec la création.", distinction: D_ALI, verset: v(13, 9, 'nom') },
    { Number: 79, arabe: "الْبَرُّ", transliteration: "Al-Barr", francais: "Le Bienfaisant", signification: "Celui dont la bonté envers Ses créatures est manifeste et abondante, et qui tient Ses promesses.", distinction: D_BONTE, verset: v(52, 28, 'nom') },
    { Number: 80, arabe: "التَّوَّابُ", transliteration: "At-Tawwāb", francais: "Celui qui accueille le repentir", signification: "Celui qui guide Ses serviteurs vers le repentir et l'accepte sans cesse.", verset: v(2, 37, 'nom') },
    { Number: 81, arabe: "الْمُنْتَقِمُ", transliteration: "Al-Muntaqim", francais: "Celui qui châtie les criminels", signification: "Celui qui punit les injustes obstinés, par justice et non par passion.", verset: v(32, 22, 'racine', "Le verset contient « مُنتَقِمُونَ » (Nous châtierons).") },
    { Number: 82, arabe: "الْعَفُوُّ", transliteration: "Al-ʿAfuww", francais: "Celui qui efface les péchés", signification: "Celui qui efface complètement les péchés, sans en laisser de trace.", distinction: D_PARDON, verset: v(4, 99, 'nom') },
    { Number: 83, arabe: "الرَّءُوفُ", transliteration: "Ar-Raʾūf", francais: "Le Très-Compatissant", signification: "Celui dont la tendresse est extrême : Il épargne à Ses serviteurs les épreuves et allège leurs charges.", distinction: D_MISERICORDE, verset: v(2, 207, 'nom') },
    { Number: 84, arabe: "مَالِكُ الْمُلْكِ", transliteration: "Mālik al-Mulk", francais: "Le Possesseur de la Royauté", signification: "Celui qui possède toute royauté, la donne et la retire à qui Il veut.", distinction: D_MALIK, verset: v(3, 26, 'nom') },
    { Number: 85, arabe: "ذُو الْجَلَالِ وَالْإِكْرَامِ", transliteration: "Dhū-l-Jalāl wa-l-Ikrām", francais: "Le Détenteur de la Majesté et de la Générosité", signification: "Celui qui mérite d'être exalté et honoré, et qui honore Ses serviteurs.", distinction: D_MAJESTE, verset: v(55, 27, 'nom') },
    { Number: 86, arabe: "الْمُقْسِطُ", transliteration: "Al-Muqsiṭ", francais: "L'Équitable", signification: "Celui qui établit l'équité et rend justice à l'opprimé face à l'oppresseur.", distinction: D_JUSTICE, verset: v(3, 18, 'racine', "Le verset contient « القِسْط » (l'équité).") },
    { Number: 87, arabe: "الْجَامِعُ", transliteration: "Al-Jāmiʿ", francais: "Le Rassembleur", signification: "Celui qui réunira toutes les créatures le Jour du Jugement.", verset: v(3, 9, 'nom') },
    { Number: 88, arabe: "الْغَنِيُّ", transliteration: "Al-Ghaniyy", francais: "Celui qui se suffit à Lui-même", signification: "Celui qui n'a besoin de rien ni de personne, alors que tout a besoin de Lui.", distinction: D_GHANI, verset: v(35, 15, 'nom') },
    { Number: 89, arabe: "الْمُغْنِي", transliteration: "Al-Mughnī", francais: "Celui qui enrichit", signification: "Celui qui enrichit qui Il veut et comble les besoins de Ses créatures.", distinction: D_GHANI, verset: v(93, 8, 'racine', "Forme verbale : « فَأَغْنَىٰ » (Il t'a enrichi).") },
    { Number: 90, arabe: "الْمَانِعُ", transliteration: "Al-Māniʿ", francais: "Celui qui empêche", signification: "Celui qui empêche ce qu'Il veut : Il retient un bien par sagesse ou protège d'un mal.", verset: v(35, 2, 'sens', "Sens proche : ce qu'Allah retient, nul ne peut le relâcher.") },
    { Number: 91, arabe: "الضَّارُّ", transliteration: "Aḍ-Ḍārr", francais: "Celui qui décrète l'épreuve", signification: "Celui qui, par sagesse, décrète le mal et l'épreuve ; ce nom se cite toujours avec An-Nāfiʿ.", verset: v(6, 17, 'racine', "Le verset contient « بِضُرٍّ » (un malheur).") },
    { Number: 92, arabe: "النَّافِعُ", transliteration: "An-Nāfiʿ", francais: "Celui qui accorde le bienfait", signification: "Celui qui accorde le bien et le profit à qui Il veut ; bien et mal n'arrivent que par Sa permission.", verset: v(48, 11, 'racine', "Le verset contient « نَفْعًا » (un bien) face à « ضَرًّا » (un mal).") },
    { Number: 93, arabe: "النُّورُ", transliteration: "An-Nūr", francais: "La Lumière", signification: "Celui qui illumine les cieux et la terre et guide les cœurs vers Sa lumière.", verset: v(24, 35, 'nom') },
    { Number: 94, arabe: "الْهَادِي", transliteration: "Al-Hādī", francais: "Le Guide", signification: "Celui qui guide Ses serviteurs vers la vérité et vers ce qui leur est utile.", distinction: D_GUIDE, verset: v(25, 31, 'nom') },
    { Number: 95, arabe: "الْبَدِيعُ", transliteration: "Al-Badīʿ", francais: "L'Inventeur", signification: "Celui qui a créé les cieux et la terre sans modèle préalable.", distinction: `${D_CREATION} ${D_MUBDI}`, verset: v(2, 117, 'nom') },
    { Number: 96, arabe: "الْبَاقِي", transliteration: "Al-Bāqī", francais: "Le Permanent", signification: "Celui qui demeure éternellement quand toute chose disparaît.", distinction: D_VIE, verset: v(55, 27, 'racine', "Forme verbale : « يَبْقَىٰ » (subsistera).") },
    { Number: 97, arabe: "الْوَارِثُ", transliteration: "Al-Wārith", francais: "L'Héritier", signification: "Celui qui hérite de toute chose après la disparition des créatures.", verset: v(15, 23, 'nom') },
    { Number: 98, arabe: "الرَّشِيدُ", transliteration: "Ar-Rashīd", francais: "Celui qui dirige avec droiture", signification: "Celui qui conduit toute chose avec sagesse vers sa juste fin et accorde la droiture.", distinction: D_GUIDE, verset: v(18, 10, 'racine', "Le verset contient « رَشَدًا » (la droiture), demandée à Allah.") },
    { Number: 99, arabe: "الصَّبُورُ", transliteration: "Aṣ-Ṣabūr", francais: "Le Patient", signification: "Celui qui ne se hâte pas de punir les fautifs et retarde leur sanction jusqu'à un terme fixé.", distinction: D_HALIM, verset: v(16, 61, 'sens', "Sens proche : Allah ne saisit pas aussitôt les gens pour leurs fautes, Il les renvoie à un terme fixé.") },
];

type VerseText = { arabe: string; francais: string; sourateNom: string };
const verses = namesVerses as Record<string, VerseText>;

export const namesOfAllah: AllahName[] = baseNames.map(n => {
    const confusable = new Set<number>();
    for (const group of CONFUSABLE_GROUPS) {
        if (group.includes(n.Number)) group.forEach(id => id !== n.Number && confusable.add(id));
    }
    const text = verses[`${n.verset.sourate}:${n.verset.ayah}`];
    return {
        ...n,
        confusableWith: confusable.size ? [...confusable].sort((a, b) => a - b) : undefined,
        verset: { ...n.verset, ...text },
    };
});
