export interface QuranTheme {
    id: string;
    label: string;
    keywords: string[];
}

// Mots-clés/racines matchés via \b<racine> sur la traduction française normalisée
// (cf. normalizeFrench dans scripts/indexer.ts) — utilisés par scripts/generate-quran-themes.ts
export const QURAN_THEMES_TAXONOMY: QuranTheme[] = [
    { id: 'patience', label: 'Patience et endurance', keywords: ['patien', 'endur', 'persever', 'support'] },
    { id: 'misericorde', label: 'Miséricorde et pardon', keywords: ['misericor', 'pardonn', 'clement'] },
    { id: 'priere', label: 'Prière et invocation', keywords: ['prier', 'priere', 'prosterner', 'invoqu', 'salat'] },
    { id: 'famille', label: 'Famille et liens parentaux', keywords: ['pere', 'mere', 'enfant', 'fils', 'fille', 'epoux', 'epouse', 'frere', 'soeur', 'orphelin'] },
    { id: 'paradis', label: 'Paradis et récompense', keywords: ['paradis', 'jardin', 'recompense', 'delice', 'eden'] },
    { id: 'enfer', label: 'Enfer et châtiment', keywords: ['enfer', 'chatiment', 'feu', 'tourment', 'flamme', 'brasier'] },
    { id: 'charite', label: 'Charité et aumône', keywords: ['aumone', 'charit', 'depens', 'pauvre', 'mendiant', 'partag'] },
    { id: 'repentir', label: 'Repentir', keywords: ['repent', 'implor'] },
    { id: 'foi', label: 'Foi et croyance', keywords: ['croi', 'foi', 'croyant', 'mecreant', 'incroyant'] },
    { id: 'effort_spirituel', label: 'Effort et lutte spirituelle', keywords: ['lutt', 'combat', 'effort', 'epreuve'] },
    { id: 'justice', label: 'Justice et équité', keywords: ['juste', 'justice', 'injust', 'iniqu', 'oppress'] },
    { id: 'gratitude', label: 'Gratitude et reconnaissance', keywords: ['gratitud', 'remerci', 'reconnaiss', 'louange', 'grace', 'bienfait'] },
    { id: 'humilite', label: 'Humilité et orgueil', keywords: ['humili', 'modest', 'orgueil', 'arrogan', 'vanit'] },
    { id: 'savoir', label: 'Savoir et réflexion', keywords: ['savoir', 'connaissance', 'science', 'sage', 'reflechi', 'mediter', 'comprendre'] },
    { id: 'creation', label: 'Création et signes', keywords: ['creation', 'cieux', 'terre', 'signe', 'etoile', 'soleil', 'lune', 'montagne', 'mer'] },
    { id: 'prophetes', label: 'Prophètes et messagers', keywords: ['prophete', 'messager', 'moise', 'jesus', 'abraham', 'noe', 'joseph', 'salaire'] },
    { id: 'jour_dernier', label: 'Jour dernier et résurrection', keywords: ['resurrection', 'jugement', 'ressuscit', 'jour dernier', 'heure'] },
    { id: 'hypocrisie', label: 'Hypocrisie', keywords: ['hypocrit'] },
    { id: 'sincerite', label: 'Sincérité', keywords: ['sincer', 'loyal'] },
    { id: 'mariage', label: 'Mariage et vie conjugale', keywords: ['mariage', 'epouser', 'divorce', 'dot', 'conjug'] },
    { id: 'commerce', label: 'Commerce et dettes', keywords: ['commerce', 'dette', 'usure', 'interet', 'pret', 'contrat', 'marche'] },
    { id: 'guerre', label: 'Guerre et combat', keywords: ['guerre', 'bataille', 'ennemi', 'butin', 'captif'] },
    { id: 'nourriture', label: 'Nourriture et interdits', keywords: ['nourritur', 'manger', 'viande', 'porc', 'vin', 'licite', 'interdit'] },
    { id: 'mort', label: 'Mort et au-delà', keywords: ['mort', 'mourir', 'tombe', 'ame', 'trepas'] },
    { id: 'tawhid', label: 'Unicité de Dieu', keywords: ['associe', 'idole', 'polytheis', 'seul dieu'] },
    { id: 'tentation', label: 'Satan et tentation', keywords: ['satan', 'diable', 'demon', 'tentation'] },
    { id: 'verite', label: 'Vérité et mensonge', keywords: ['mensong', 'verite', 'menteur', 'calomni', 'temoign'] },
    { id: 'peuples_anciens', label: 'Peuples et châtiments anciens', keywords: ['pharaon', 'peuple de', 'deluge', 'sodome', 'ancetre'] },
    { id: 'voyage_pelerinage', label: 'Voyage et pèlerinage', keywords: ['pelerinage', 'voyage', 'kaaba', 'mecque', 'caravane'] },
    { id: 'temps', label: 'Temps et impermanence', keywords: ['temps', 'eternel', 'ephemere', 'ici-bas'] },
    { id: 'crainte_piete', label: 'Crainte d\'Allah et piété (Taqwa)', keywords: ['crain', 'redout', 'pieu', 'piete'] },
    { id: 'adoration', label: 'Adoration et soumission à Allah', keywords: ['ador', 'culte', 'soumi', 'soumet'] },
];

// Export léger pour l'UI (id + label uniquement)
export const QURAN_THEMES = QURAN_THEMES_TAXONOMY.map(({ id, label }) => ({ id, label }));
