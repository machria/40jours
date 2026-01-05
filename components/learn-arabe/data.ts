
export type Letter = {
    id: string;
    name: string;
    transliteration: string;
    arabic: string;
    forms: { initial: string; medial: string; final: string };
    description: string;
    position?: 'isolate' | 'initial' | 'medial' | 'final';
};

export type Lesson = {
    id: string;
    title: string;
    description: string;
    content: string;
    examples: { arabic: string; transliteration: string; meaning: string }[];
};

export type QuizQuestion = {
    id: string;
    question: string;
    relatedContent?: string;
    options: string[];
    correctAnswer: string;
    type: 'letter_to_name' | 'name_to_letter' | 'sound_to_letter';
};

export const ALPHABET: Letter[] = [
    { id: 'alif', name: 'Alif', transliteration: 'ā', arabic: 'ا', forms: { initial: 'ا', medial: 'ـا', final: 'ـا' }, description: 'Le support de la Hamza ou une voyelle longue.' },
    { id: 'ba', name: 'Ba', transliteration: 'b', arabic: 'ب', forms: { initial: 'بـ', medial: 'ـبـ', final: 'ـب' }, description: 'Comme le B de Bonjour. Un point en bas.' },
    { id: 'ta', name: 'Ta', transliteration: 't', arabic: 'ت', forms: { initial: 'تـ', medial: 'ـتـ', final: 'ـت' }, description: 'Comme le T de Table. Deux points en haut.' },
    { id: 'tha', name: 'Tha', transliteration: 'th', arabic: 'ث', forms: { initial: 'ثـ', medial: 'ـثـ', final: 'ـث' }, description: 'Comme le "th" anglais dans "think". Trois points en haut.' },
    { id: 'jim', name: 'Jim', transliteration: 'j', arabic: 'ج', forms: { initial: 'جـ', medial: 'ـجـ', final: 'ـج' }, description: 'Comme le J de Jardin ou "dj". Un point en bas.' },
    { id: 'ha', name: 'Ha', transliteration: 'ḥ', arabic: 'ح', forms: { initial: 'حـ', medial: 'ـحـ', final: 'ـح' }, description: 'Un H soufflé, provenant du milieu de la gorge.' },
    { id: 'kha', name: 'Kha', transliteration: 'kh', arabic: 'خ', forms: { initial: 'خـ', medial: 'ـخـ', final: 'ـخ' }, description: 'Comme la "Jota" espagnole ou le "R" parisien très gras.' },
    { id: 'dal', name: 'Dal', transliteration: 'd', arabic: 'د', forms: { initial: 'د', medial: 'ـد', final: 'ـد' }, description: 'Comme le D de Dame. Ne s\'attache pas à gauche.' },
    { id: 'dhal', name: 'Dhal', transliteration: 'dh', arabic: 'ذ', forms: { initial: 'ذ', medial: 'ـذ', final: 'ـذ' }, description: 'Comme le "th" anglais dans "this". Ne s\'attache pas à gauche.' },
    { id: 'ra', name: 'Ra', transliteration: 'r', arabic: 'ر', forms: { initial: 'ر', medial: 'ـر', final: 'ـر' }, description: 'Un R roulé avec la langue. Ne s\'attache pas à gauche.' },
    { id: 'zay', name: 'Zay', transliteration: 'z', arabic: 'ز', forms: { initial: 'ز', medial: 'ـز', final: 'ـز' }, description: 'Comme le Z de Zèbre. Ne s\'attache pas à gauche.' },
    { id: 'sin', name: 'Sin', transliteration: 's', arabic: 'س', forms: { initial: 'سـ', medial: 'ـسـ', final: 'ـس' }, description: 'Comme le S de Soleil.' },
    { id: 'shin', name: 'Shin', transliteration: 'sh', arabic: 'ش', forms: { initial: 'شـ', medial: 'ـشـ', final: 'ـش' }, description: 'Comme le CH de Chat.' },
    { id: 'sad', name: 'Sad', transliteration: 'ṣ', arabic: 'ص', forms: { initial: 'صـ', medial: 'ـصـ', final: 'ـص' }, description: 'Un S emphatique (grave/lourd).' },
    { id: 'dad', name: 'Dad', transliteration: 'ḍ', arabic: 'ض', forms: { initial: 'ضـ', medial: 'ـضـ', final: 'ـض' }, description: 'Un D emphatique, son unique à l\'arabe.' },
    { id: 'ta_emph', name: 'Ta', transliteration: 'ṭ', arabic: 'ط', forms: { initial: 'طـ', medial: 'ـطـ', final: 'ـط' }, description: 'Un T emphatique.' },
    { id: 'dha_emph', name: 'Dha', transliteration: 'ẓ', arabic: 'ظ', forms: { initial: 'ظـ', medial: 'ـظـ', final: 'ـظ' }, description: 'Un DH emphatique.' },
    { id: 'ayn', name: 'Ayn', transliteration: 'ʿ', arabic: 'ع', forms: { initial: 'عـ', medial: 'ـعـ', final: 'ـع' }, description: 'Son guttural profond, spécifique à l\'arabe.' },
    { id: 'ghayn', name: 'Ghayn', transliteration: 'gh', arabic: 'غ', forms: { initial: 'غـ', medial: 'ـغـ', final: 'ـغ' }, description: 'Comme un R français grasseyé (ex: Paris).' },
    { id: 'fa', name: 'Fa', transliteration: 'f', arabic: 'ف', forms: { initial: 'فـ', medial: 'ـفـ', final: 'ـف' }, description: 'Comme le F de Fleur.' },
    { id: 'qaf', name: 'Qaf', transliteration: 'q', arabic: 'ق', forms: { initial: 'قـ', medial: 'ـقـ', final: 'ـق' }, description: 'Son profond, l\'arrière de la langue touche la luette.' },
    { id: 'kaf', name: 'Kaf', transliteration: 'k', arabic: 'ك', forms: { initial: 'كـ', medial: 'ـكـ', final: 'ـك' }, description: 'Comme le K de Kangourou.' },
    { id: 'lam', name: 'Lam', transliteration: 'l', arabic: 'ل', forms: { initial: 'لـ', medial: 'ـلـ', final: 'ـل' }, description: 'Comme le L de Lune.' },
    { id: 'mim', name: 'Mim', transliteration: 'm', arabic: 'م', forms: { initial: 'مـ', medial: 'ـمـ', final: 'ـم' }, description: 'Comme le M de Maman.' },
    { id: 'nun', name: 'Nun', transliteration: 'n', arabic: 'ن', forms: { initial: 'نـ', medial: 'ـنـ', final: 'ـن' }, description: 'Comme le N de Nuage.' },
    { id: 'ha_mem', name: 'Ha', transliteration: 'h', arabic: 'ه', forms: { initial: 'هـ', medial: 'ـهـ', final: 'ـه' }, description: 'Un H léger, comme en anglais "Hello".' },
    { id: 'waw', name: 'Waw', transliteration: 'w', arabic: 'و', forms: { initial: 'و', medial: 'ـو', final: 'ـو' }, description: 'Comme le W de Wagon (ou "ou"). Ne s\'attache pas à gauche.' },
    { id: 'ya', name: 'Ya', transliteration: 'y', arabic: 'ي', forms: { initial: 'يـ', medial: 'ـيـ', final: 'ـي' }, description: 'Comme le Y de Yaourt (ou "i").' },
];

export const LESSONS: Lesson[] = [
    {
        id: 'fatha',
        title: '1. Al-Fatha (La voyelle A)',
        description: 'L\'ouverture de la bouche.',
        content: 'La Fatha est une petite barre oblique placée au-dessus de la lettre. Elle donne le son "a".',
        examples: [
            { arabic: 'بَ', transliteration: 'Ba', meaning: '' },
            { arabic: 'تَ', transliteration: 'Ta', meaning: '' },
            { arabic: 'دَ', transliteration: 'Da', meaning: '' },
        ]
    },
    {
        id: 'kasra',
        title: '2. Al-Kasra (La voyelle I)',
        description: 'Le bris de la voix.',
        content: 'La Kasra est une petite barre oblique placée au-dessous de la lettre. Elle donne le son "i".',
        examples: [
            { arabic: 'بِ', transliteration: 'Bi', meaning: '' },
            { arabic: 'تِ', transliteration: 'Ti', meaning: '' },
            { arabic: 'دِ', transliteration: 'Di', meaning: '' },
        ]
    },
    {
        id: 'damma',
        title: '3. Ad-Damma (La voyelle OU)',
        description: 'L\'arrondissement des lèvres.',
        content: 'La Damma est une petite boucle (comme un petit waw) placée au-dessus de la lettre. Elle donne le son "ou" (u).',
        examples: [
            { arabic: 'بُ', transliteration: 'Bou', meaning: '' },
            { arabic: 'تُ', transliteration: 'Tou', meaning: '' },
            { arabic: 'دُ', transliteration: 'Dou', meaning: '' },
        ]
    },
    {
        id: 'sukun',
        title: '4. As-Soukoun (Le Silence)',
        description: 'L\'absence de voyelle.',
        content: 'Le Soukoun (petit cercle) indique l\'absence de voyelle. Une lettre avec Soukoun ne peut pas être prononcée seule, on ajoute souvent un "A" avant pour l\'entendre.',
        examples: [
            { arabic: 'أَبْ', transliteration: 'Ab', meaning: '' },
            { arabic: 'أَتْ', transliteration: 'At', meaning: '' },
            { arabic: 'أَدْ', transliteration: 'Ad', meaning: '' },
        ]
    },
    {
        id: 'madd',
        title: '5. Al-Madd (Les Prolongations)',
        description: 'Allonger le temps de la voyelle.',
        content: 'Il existe trois lettres de prolongation : Alif (ا) pour le son "aa", Waw (و) pour le son "ouu", et Ya (ي) pour le son "ii". Elles ne portent pas de voyelle.',
        examples: [
            { arabic: 'بَا', transliteration: 'Baa', meaning: '' },
            { arabic: 'بُو', transliteration: 'Bouu', meaning: '' },
            { arabic: 'بِي', transliteration: 'Bii', meaning: '' },
        ]
    },
    {
        id: 'tanween',
        title: '6. At-Tanwin (La Double Voyelle)',
        description: 'Le son "n" nasal à la fin.',
        content: 'Le Tanween est le doublement de la voyelle finale. Il ajoute le son "n" à la fin. Fathatain (an), Kasratain (in), Dammatain (oun).',
        examples: [
            { arabic: 'بً', transliteration: 'Ban', meaning: '' },
            { arabic: 'بٍ', transliteration: 'Bin', meaning: '' },
            { arabic: 'بٌ', transliteration: 'Boun', meaning: '' },
        ]
    },
    {
        id: 'shadda',
        title: '7. Ash-Shadda (L\'Accentuation)',
        description: 'Le doublement de la consonne.',
        content: 'La Shadda ressemble à un petit "w" au-dessus de la lettre. Elle indique que la lettre est doublée (appuyée). C\'est comme s\'il y avait deux fois la même lettre.',
        examples: [
            { arabic: 'رَبّ', transliteration: 'Rabb', meaning: 'Seigneur' },
            { arabic: 'إِنّ', transliteration: 'Inna', meaning: 'Certes' },
        ]
    },
    {
        id: 'makharij',
        title: '8. Al-Makharij (Les Sorties)',
        description: 'Points d\'articulation des lettres.',
        content: 'La précision de la sortie des lettres (Makhraj) est la base du Tajwid. Voici les 5 zones principales détaillées :',
        examples: [
            { arabic: 'ء', transliteration: 'Hamza (Al-Halq)', meaning: 'Fond de la gorge (Aqsa Al-Halq)' },
            { arabic: 'ع', transliteration: 'Ayn (Al-Halq)', meaning: 'Milieu de la gorge (Wasat Al-Halq)' },
            { arabic: 'غ', transliteration: 'Ghayn (Al-Halq)', meaning: 'Haut de la gorge (Adna Al-Halq)' },
            { arabic: 'ق', transliteration: 'Qaf (Al-Lissan)', meaning: 'Fond de la langue touche le palais mou' },
            { arabic: 'ج', transliteration: 'Jim (Al-Lissan)', meaning: 'Milieu de la langue touche le palais dur' },
            { arabic: 'م', transliteration: 'Mim (Ash-Shafatayn)', meaning: 'Fermeture des lèvres' },
        ]
    },
    {
        id: 'sifat',
        title: '9. As-Sifat (Les Caractéristiques)',
        description: 'Les attributs intrinsèques.',
        content: 'Chaque lettre possède des qualificatifs (Sifat) obligatoires. Voici les plus importants à maîtriser :',
        examples: [
            { arabic: 'ف', transliteration: 'Fa (Hams)', meaning: 'Hams : Un souffle d\'air accompagne la lettre' },
            { arabic: 'ب', transliteration: 'Ba (Jahr)', meaning: 'Jahr : Pas de souffle, l\'air est bloqué' },
            { arabic: 'ص', transliteration: 'Sad (Isti\'la)', meaning: 'Isti\'la : La langue monte, son emphatique' },
            { arabic: 'س', transliteration: 'Sin (Istifal)', meaning: 'Istifal : La langue descend, son amincit' },
            { arabic: 'قْ', transliteration: 'Qaf (Qalqala)', meaning: 'Qalqala : Rebond fort sur une lettre Sakin' },
            { arabic: 'ز', transliteration: 'Zay (Safir)', meaning: 'Safir : Son sifflant ou bourdonnant' },
        ]
    },
    {
        id: 'nun_sakina',
        title: '10. Ahkam Nun Sakina (Le Nun Inerte)',
        description: 'Règles du Nun sans voyelle.',
        content: 'Les 4 règles du Nun Sakina (نْ) ou Tanween s\'appliquent selon la lettre qui suit. Observez bien la prononciation :',
        examples: [
            { arabic: 'مَنْ آمَنَ', transliteration: 'Man Amana', meaning: 'Izhar : On prononce le N clairement (devant Hamza)' },
            { arabic: 'عَلِيمٌ حَكِيمٌ', transliteration: 'Alimoun Hakim', meaning: 'Izhar : Tanween clair (devant Ha)' },
            { arabic: 'مَنْ يَقُولُ', transliteration: 'May Yaqoulu', meaning: 'Idgham : Le N fusionne dans le Ya (avec Ghunna)' },
            { arabic: 'مِنْ رَبِّهِمْ', transliteration: 'Mir Rabbihim', meaning: 'Idgham Bilal Ghunna : Fusion totale sans nez (devant Ra)' },
            { arabic: 'مِنْ بَعْدِ', transliteration: 'Mim Ba\'di', meaning: 'Iqlab : Le N se transforme en M (devant Ba)' },
            { arabic: 'أَنْفُسَهُمْ', transliteration: 'Anfusahum', meaning: 'Ikhfa : Le N est caché/nasillard (devant Fa)' },
            { arabic: 'مِنْ شَرِّ', transliteration: 'Min Sharri', meaning: 'Ikhfa : Le N est caché (devant Shin)' },
        ]
    }
];

export const QUIZ_DATA: QuizQuestion[] = [
    {
        id: 'q1',
        question: 'Quelle est cette lettre ?',
        relatedContent: 'ب',
        correctAnswer: 'Ba',
        options: ['Ba', 'Ta', 'Nun', 'Ya'],
        type: 'letter_to_name'
    },
    {
        id: 'q2',
        question: 'Quelle lettre correspond au son "S" comme Soleil ?',
        relatedContent: 'S',
        correctAnswer: 'Sin',
        options: ['Sin', 'Sad', 'Shin', 'Zay'],
        type: 'sound_to_letter'
    },
    {
        id: 'q3',
        question: 'La lettre "Jim" (ج) a son point :',
        relatedContent: 'ج',
        correctAnswer: 'En bas',
        options: ['En haut', 'En bas', 'Pas de point', 'Au milieu'],
        type: 'name_to_letter'
    }
];
