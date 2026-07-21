export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explication: string;
}

export interface EtapeHistoire {
  etape: string;
  texte: string;
}

export interface Prophete {
  id: string;
  nom: string;
  arabe: string;
  surnom?: string;
  periode?: string;
  resume: string;
  histoire: (string | EtapeHistoire)[];
  traits: { label: string; emoji: string }[];
  morale: string;
  versetCle?: { ref: string; texte: string };
  quiz: QuizQuestion[];
}

export const prophetes: Prophete[] = [
  {
    id: 'adam',
    nom: 'Adam',
    arabe: 'آدَم',
    surnom: 'Père de l\'humanité',
    periode: 'Origine des temps',
    resume: 'Adam est le premier homme et le premier prophète, créé par Allah de l\'argile. Il vécut au Paradis avant d\'en descendre sur Terre, inaugurant l\'histoire humaine par un acte de repentir.',
    histoire: [
      {
        etape: 'La création d\'Adam',
        texte: 'Avant de créer Adam, Allah dit aux anges : "Je vais mettre sur terre un représentant (khalifa)." Surpris, les anges demandèrent s\'Il allait y mettre quelqu\'un qui ferait le mal et verserait le sang, alors qu\'eux Le glorifiaient sans arrêt. Allah répondit : "Je sais ce que vous ne savez pas" (Coran 2:30). Il façonna alors le corps d\'Adam avec de l\'argile — rouge, blanche et noire, ce qui explique la diversité des couleurs de peau chez les humains. Cette terre sécha longtemps, jusqu\'à sonner comme de la poterie. Ibn Kathir raconte qu\'Iblis passait devant ce corps sans vie et le frappait pour l\'entendre résonner, en se demandant ce qu\'Allah allait en faire.',
      },
      {
        etape: 'Le souffle de vie',
        texte: 'Quand Allah souffla la vie en lui, celle-ci se répandit peu à peu dans son corps. Dès qu\'elle atteignit sa tête, Adam éternua et dit : "Al-hamdu lillah" (louange à Allah). Allah lui répondit : "Yarhamuka Rabbuka" (que ton Seigneur te fasse miséricorde). Le Prophète ﷺ a enseigné que c\'est de là que vient l\'habitude, entre croyants, de se dire ces mots après un éternuement (Sahih al-Bukhari, n°3326 ; Sahih Muslim, n°2841).',
      },
      {
        etape: 'L\'honneur accordé à Adam',
        texte: 'Allah ordonna aux anges de se prosterner devant Adam, pour l\'honorer. Tous obéirent, sauf Iblis, qui refusa par orgueil : "Tu m\'as créé de feu, et lui de terre" (Coran 7:12), pensant être meilleur. C\'est la toute première erreur de raisonnement de l\'histoire : Iblis compare deux matières, sans comprendre que c\'est Allah qui décide qui Il honore. Allah montra ensuite qu\'Adam savait des choses que les anges eux-mêmes ignoraient : Il lui apprit le nom de toutes choses, que les anges furent incapables de dire (Coran 2:31-33).',
      },
      {
        etape: 'La vie au Paradis',
        texte: 'Allah installa Adam dans le Jardin du Paradis. Il pouvait y manger de tout, sauf d\'un seul arbre. Se sentant seul, Adam s\'endormit, et à son réveil, il découvrit Hawwa à ses côtés — créée pour qu\'il ne soit plus seul. Allah leur dit : "Ne vous approchez pas de cet arbre, sinon vous serez du nombre des injustes" (Coran 2:35).',
      },
      {
        etape: 'La tentation et la chute',
        texte: 'Iblis voulait se venger. Il chuchota le doute à Adam et Hawwa, allant même jusqu\'à jurer par Allah qu\'il leur voulait du bien : "Je suis pour vous deux un conseiller sincère" (Coran 7:21). Ils finirent par manger de l\'arbre interdit. Aussitôt, ils prirent conscience de leur nudité et se couvrirent avec des feuilles. Allah leur demanda : "Ne vous avais-Je pas interdit cet arbre... ?" (Coran 7:22)',
      },
      {
        etape: 'Le repentir et la descente',
        texte: 'Adam et Hawwa ne cherchèrent aucune excuse. Ils dirent à Allah : "Seigneur, nous nous sommes fait du tort à nous-mêmes ; si Tu ne nous pardonnes pas, nous serons perdus" (Coran 7:23). Allah leur pardonna, avant même qu\'ils ne descendent sur Terre. Cela montre que leur venue sur Terre n\'était pas une punition : c\'était le plan prévu depuis le début par Allah.',
      },
      {
        etape: 'Habil et Qabil, et la fin de sa vie',
        texte: 'Sur Terre, parmi les enfants d\'Adam, Habil et Qabil offrirent chacun un sacrifice à Allah. Celui de Habil fut accepté, celui de Qabil refusé. Jaloux, Qabil tua son frère : ce fut le premier meurtre de l\'histoire humaine. Ne sachant pas quoi faire du corps, il regarda un corbeau creuser la terre pour en enterrer un autre, et comprit ainsi comment enterrer son frère (Coran 5:27-31). Selon la tradition, Adam vécut mille ans et apprit à ses enfants à croire en un seul Dieu. Le Prophète ﷺ a dit qu\'Allah l\'avait créé très grand — soixante coudées de haut — une taille qui n\'a cessé de diminuer chez ses descendants depuis (Sahih al-Bukhari, n°3326 ; Sahih Muslim, n°2841).',
      },
    ],
    traits: [
      { label: 'Repentir', emoji: '🌿' },
      { label: 'Réceptivité au savoir', emoji: '📚' },
      { label: 'Humilité', emoji: '🌱' },
      { label: 'Gratitude', emoji: '🤲' },
    ],
    morale: 'La chute n\'est pas une fin : le vrai échec est de refuser de se relever. Adam nous enseigne que le repentir sincère efface toute faute et rouvre les portes de la miséricorde divine.',
    versetCle: {
      ref: 'Coran 2:37',
      texte: 'Adam reçut de son Seigneur des paroles, et Il se tourna vers lui avec miséricorde. Il est Celui qui revient sans cesse, le Très Miséricordieux.',
    },
    quiz: [
      {
        question: 'De quoi Allah a-t-Il créé Adam ?',
        options: ['D\'eau', 'De lumière', 'D\'argile', 'De feu'],
        correct: 2,
        explication: 'Allah créa Adam de Ses propres mains à partir d\'argile (Coran 38:75).',
      },
      {
        question: 'Qui refusa de se prosterner devant Adam ?',
        options: ['Jibril', 'Mika\'il', 'Iblis', 'Israfil'],
        correct: 2,
        explication: 'Iblis (Shaytan) refusa par orgueil, disant être meilleur qu\'Adam car créé de feu.',
      },
      {
        question: 'Qu\'enseigna Allah à Adam avant de le présenter aux anges ?',
        options: ['Les prières', 'Les noms de toutes choses', 'Le Coran', 'Les lois'],
        correct: 1,
        explication: 'Allah enseigna à Adam les noms de toutes choses — symbole de la connaissance accordée à l\'humanité (Coran 2:31).',
      },
      {
        question: 'Comment s\'appelait le fils d\'Adam tué injustement ?',
        options: ['Idris', 'Habil', 'Qabil', 'Sham'],
        correct: 1,
        explication: 'Habil (Abel) fut tué par son frère Qabil (Caïn), premier meurtre de l\'histoire humaine.',
      },
    ],
  },
  {
    id: 'idris',
    nom: 'Idris',
    arabe: 'إِدْرِيس',
    surnom: 'Le Savant',
    periode: 'Avant le déluge',
    resume: 'Idris est le prophète de la sagesse et du savoir, premier homme à écrire avec un calame. Allah l\'éleva à un rang élevé et le Coran le cite parmi les patients et les vertueux.',
    histoire: [
      {
        etape: 'Un prophète après Adam',
        texte: 'Idris vécut plusieurs générations après Adam, à une époque où certains hommes avaient commencé à s\'éloigner de la foi en un Dieu unique. Il appela son peuple à revenir à l\'adoration d\'Allah seul, comme Adam l\'avait fait avant lui.',
      },
      {
        etape: 'Le premier savant',
        texte: 'Selon la tradition, Idris fut le premier homme à écrire avec un calame et le premier à coudre des vêtements — avant lui, les hommes se couvraient de peaux d\'animaux. C\'est pour cela qu\'on le surnomme "Le Savant" : il aimait apprendre et enseigner, et sa sagesse marqua son peuple.',
      },
      {
        etape: 'Véridique et prophète',
        texte: 'Le Coran décrit Idris en des mots simples et forts : "C\'était un homme très véridique et un prophète" (Coran 19:56). Être "véridique" (*siddiq*) veut dire qu\'il ne mentait jamais et croyait sincèrement en ce qu\'Allah lui avait révélé.',
      },
      {
        etape: 'Une station élevée',
        texte: 'Allah dit à son sujet : "Et Nous l\'élevâmes à un rang élevé" (Coran 19:57). Les commentateurs expliquent ce verset de deux façons : certains y voient une grande élévation spirituelle ; d\'autres rappellent que, lors du Voyage Nocturne (Isra wal Mi\'raj), le Prophète ﷺ rencontra Idris au quatrième ciel — un lieu que peu d\'hommes ont jamais atteint (Sahih al-Bukhari, n°3887).',
      },
    ],
    traits: [
      { label: 'Amour du savoir', emoji: '📖' },
      { label: 'Véracité', emoji: '✅' },
      { label: 'Patience', emoji: '⏳' },
      { label: 'Piété', emoji: '🕌' },
    ],
    morale: 'La connaissance au service de la foi est la plus noble des élévations — elle hausse l\'homme dans ce monde et dans l\'autre.',
    versetCle: {
      ref: 'Coran 19:56-57',
      texte: 'Mentionne dans le Livre Idris. C\'était un homme très véridique et un prophète. Et Nous l\'élevâmes à un rang élevé.',
    },
    quiz: [
      {
        question: 'Quel est le surnom traditionnel d\'Idris ?',
        options: ['Khalilullah', 'Kaliimullah', 'Le Savant', 'Ruhullah'],
        correct: 2,
        explication: 'Idris est connu pour son savoir et sa sagesse, on lui attribue l\'écriture et diverses sciences.',
      },
      {
        question: 'Que dit le Coran sur la station d\'Idris ?',
        options: ['Il fut envoyé aux rois', 'Allah l\'éleva à un rang élevé', 'Il combattit les idoles', 'Il traversa la mer'],
        correct: 1,
        explication: 'Le Coran (19:57) dit qu\'Allah l\'éleva à un rang élevé (مَكَانًا عَلِيًّا).',
      },
      {
        question: 'Qu\'est-ce qu\'Idris est traditionnellement le premier à avoir fait ?',
        options: ['Construire une mosquée', 'Écrire avec un calame', 'Combattre un tyran', 'Traverser la mer'],
        correct: 1,
        explication: 'Selon les exégètes, Idris fut le premier à écrire avec un calame et à confectionner des habits.',
      },
      {
        question: 'Lors du Voyage Nocturne (Isra wal Mi\'raj), à quel ciel le Prophète ﷺ rencontra-t-il Idris ?',
        options: ['Premier ciel', 'Troisième ciel', 'Quatrième ciel', 'Septième ciel'],
        correct: 2,
        explication: 'Lors de l\'Isra wal Mi\'raj, le Prophète ﷺ rencontra Idris au quatrième ciel (Sahih al-Bukhari, n°3887).',
      },
    ],
  },
  {
    id: 'nuh',
    nom: 'Nuh',
    arabe: 'نُوح',
    surnom: 'Le Reconnaissant',
    periode: 'Environ 3000 av. J.-C.',
    resume: 'Nuh prêcha son peuple pendant 950 ans sans se décourager. Face à leur rejet, il construisit l\'Arche par ordre divin, y embarqua les croyants et les animaux, et survécut au grand Déluge.',
    histoire: [
      {
        etape: 'Un peuple qui adorait des statues',
        texte: 'Nuh vécut longtemps après Adam, à une époque où les hommes avaient commencé à adorer des statues. Ils avaient sculpté l\'image de cinq hommes vertueux — Wadd, Suwa\', Yaghuth, Ya\'uq et Nasr — pour se souvenir d\'eux. Au fil des générations, ils oublièrent que c\'étaient de simples hommes et se mirent à les adorer comme des dieux. Allah envoya Nuh pour ramener son peuple à l\'adoration d\'un Dieu unique.',
      },
      {
        etape: '950 ans d\'appel, jour et nuit',
        texte: 'Nuh appela son peuple sans relâche, de jour comme de nuit, en public comme en privé, pendant neuf cent cinquante ans (Coran 29:14). Il dit : "Seigneur, j\'ai appelé mon peuple nuit et jour, mais mon appel n\'a fait qu\'augmenter leur fuite" (Coran 71:5-6). Les chefs le méprisaient et disaient que seuls les pauvres et les gens de rang inférieur le suivaient. Nuh leur répondit qu\'il ne rejetait personne : son rôle était de transmettre le message, pas de juger les gens selon leur rang.',
      },
      {
        etape: 'La dernière invocation',
        texte: 'Voyant que son peuple resterait fermé à la vérité, et qu\'il ne donnerait naissance qu\'à d\'autres mécréants, Nuh invoqua Allah : "Seigneur, ne laisse sur la terre aucun des mécréants" (Coran 71:26-27).',
      },
      {
        etape: 'La construction de l\'Arche',
        texte: 'Allah ordonna à Nuh de construire une Arche, sous Son regard et selon Son inspiration (Coran 11:37). Le peuple se moquait de lui en le voyant fabriquer un immense bateau loin de toute mer. Allah lui donna un signe pour savoir quand embarquer : quand le four (*tannur*) déborderait d\'eau (Coran 11:40). Le jour venu, Nuh fit monter un couple de chaque espèce animale, sa famille, et les quelques croyants qui l\'avaient suivi.',
      },
      {
        etape: 'Le Déluge',
        texte: 'Le ciel se déversa en pluie battante et la terre elle-même se fendit, laissant jaillir des sources d\'eau de toutes parts. Les deux eaux se rejoignirent selon un ordre décrété par Allah, et le déluge recouvrit toute la terre (Coran 54:11-12).',
      },
      {
        etape: 'Le fils qui refusa d\'embarquer',
        texte: 'Le fils de Nuh refusa de monter dans l\'Arche, préférant se réfugier sur une montagne. Nuh l\'appela une dernière fois, mais les vagues l\'emportèrent. Bouleversé, Nuh invoqua Allah, disant que son fils faisait partie de sa famille. Allah lui répondit : "Il n\'est pas de ta famille, car son comportement était mauvais. Ne me demande pas ce que tu ne sais pas" (Coran 11:45-46). Nuh comprit alors que le vrai lien de famille se mesure à la foi et aux bonnes actions, pas seulement au sang.',
      },
      {
        etape: 'L\'arrivée sur le mont Judi',
        texte: 'L\'Arche s\'arrêta finalement sur le mont Judi (Coran 11:44). Allah ordonna à la terre d\'absorber ses eaux et au ciel de cesser de pleuvoir. Nuh fut accueilli par ces mots : "Descends avec Notre paix et Nos bénédictions" (Coran 11:48).',
      },
    ],
    traits: [
      { label: 'Persévérance', emoji: '💪' },
      { label: 'Gratitude', emoji: '🙏' },
      { label: 'Obéissance totale', emoji: '🛶' },
      { label: 'Courage', emoji: '🦁' },
      { label: 'Patience', emoji: '⏳' },
    ],
    morale: '950 ans de da\'wah pour une poignée de croyants — Nuh nous enseigne que notre rôle est de transmettre, pas de forcer. Les résultats appartiennent à Allah.',
    versetCle: {
      ref: 'Coran 71:5-6',
      texte: 'Il dit : "Seigneur, j\'ai appelé mon peuple nuit et jour, mais mon appel n\'a fait qu\'augmenter leur fuite."',
    },
    quiz: [
      {
        question: 'Combien d\'années Nuh prêcha-t-il son peuple ?',
        options: ['100 ans', '500 ans', '950 ans', '40 ans'],
        correct: 2,
        explication: 'Le Coran (29:14) précise que Nuh resta parmi son peuple mille ans moins cinquante, soit 950 ans.',
      },
      {
        question: 'Quel signe annonça à Nuh de monter dans l\'Arche ?',
        options: ['Un arc-en-ciel', 'Le four déborda d\'eau', 'Un tremblement de terre', 'Une éclipse'],
        correct: 1,
        explication: 'Allah avait dit à Nuh que quand le four (tannur) déborderait, c\'était le signal pour embarquer.',
      },
      {
        question: 'Où l\'Arche de Nuh s\'arrêta-t-elle ?',
        options: ['Mont Sinaï', 'Mont Arafat', 'Mont Judi', 'Mont Hira'],
        correct: 2,
        explication: 'Le Coran (11:44) précise que l\'Arche s\'arrêta sur le mont Judi.',
      },
      {
        question: 'Pourquoi Allah dit-il à Nuh que son fils n\'était pas de sa famille ?',
        options: ['Car il n\'était pas son fils biologique', 'Car il avait commis un crime', 'Car il avait refusé de croire et ses actes étaient mauvais', 'Car il avait quitté le pays'],
        correct: 2,
        explication: 'Allah précise (11:46) que la vraie famille se définit par la foi et les bonnes actions, non par le lien de sang.',
      },
    ],
  },
  {
    id: 'hud',
    nom: 'Hud',
    arabe: 'هُود',
    surnom: 'Prophète de \'Ad',
    periode: 'Environ 2500 av. J.-C.',
    resume: 'Hud fut envoyé au peuple de \'Ad, une nation puissante et orgueilleuse qui bâtissait des monuments imposants. Ils rejetèrent son message et furent anéantis par un vent dévastateur de sept nuits et huit jours.',
    histoire: [
      {
        etape: 'Un peuple fier de sa force',
        texte: 'Le peuple de \'Ad vivait après le déluge de Nuh, dans la région d\'Al-Ahqaf, au sud de la péninsule arabique (l\'actuel Yémen). Allah leur avait donné une force physique immense et une grande stature. Fiers de cette puissance, ils construisirent d\'immenses cités aux hautes colonnes, comme la légendaire Iram, "dont on n\'a jamais créé de pareille dans les pays" (Coran 89:7-8). Mais malgré tout ce qu\'Allah leur avait donné, ils adoraient des idoles au lieu de Lui. Allah leur envoya Hud, l\'un des leurs, pour les rappeler à la vérité.',
      },
      {
        etape: 'L\'appel sincère de Hud',
        texte: 'Hud leur dit : "Ô mon peuple, adorez Allah : vous n\'avez pas d\'autre divinité que Lui" (Coran 11:50). Il leur rappela qu\'Allah les avait fait succéder au peuple de Nuh et leur avait donné force et puissance, afin qu\'ils Lui en soient reconnaissants. Il ajouta qu\'il ne demandait aucune récompense pour son message : sa seule récompense viendrait d\'Allah (Coran 11:51).',
      },
      {
        etape: 'Un refus plein d\'orgueil',
        texte: 'Les chefs répondirent avec fierté : "Qui est plus fort que nous ?" (Coran 41:15). Ils refusèrent d\'abandonner les idoles de leurs ancêtres, traitèrent Hud de menteur et de fou, allant jusqu\'à dire que leurs dieux l\'avaient frappé de folie pour s\'être opposé à eux (Coran 11:54).',
      },
      {
        etape: 'La confiance de Hud face à la menace',
        texte: 'Sans peur, Hud leur répondit qu\'il prenait Allah à témoin de son innocence, et il les mit tous au défi de comploter contre lui sans attendre : "Je place ma confiance en Allah, mon Seigneur et le vôtre. Il n\'y a pas d\'être vivant qu\'Il ne tienne fermement" (Coran 11:54-56).',
      },
      {
        etape: 'Un nuage pris pour de la pluie',
        texte: 'Après une longue sécheresse, le peuple vit un jour un grand nuage sombre s\'approcher au-dessus de leurs vallées et se réjouit, pensant qu\'il allait enfin pleuvoir. Mais Hud leur dit : "Non, c\'est plutôt ce que vous cherchiez à hâter : un vent qui contient un châtiment douloureux" (Coran 46:24).',
      },
      {
        etape: 'Le vent qui ne pardonna rien',
        texte: 'La punition d\'Allah arriva sous la forme d\'un vent violent et glacé, envoyé pendant sept nuits et huit jours sans interruption (Coran 69:6-7). Ce vent détruisit tout sur son passage, laissant les hommes étendus au sol comme des troncs de palmiers creux. Seuls Hud et ceux qui avaient cru avec lui furent épargnés.',
      },
    ],
    traits: [
      { label: 'Fermeté dans la vérité', emoji: '🏔️' },
      { label: 'Désintéressement', emoji: '🤝' },
      { label: 'Courage face aux puissants', emoji: '🦁' },
      { label: 'Confiance en Allah', emoji: '🌟' },
    ],
    morale: 'L\'orgueil aveugle les nations comme il aveugle les individus. La force physique et la richesse ne protègent de rien face au décret divin.',
    versetCle: {
      ref: 'Coran 41:15',
      texte: 'Quant au peuple de \'Ad, ils s\'enorgueillirent sur Terre sans droit et dirent : "Qui est plus fort que nous ?"',
    },
    quiz: [
      {
        question: 'Quel peuple Hud fut-il envoyé à ?',
        options: ['Thamud', '\'Ad', 'Madyan', 'Babylone'],
        correct: 1,
        explication: 'Hud fut le prophète du peuple de \'Ad, une nation puissante du sud arabique.',
      },
      {
        question: 'Comment le peuple de \'Ad fut-il puni ?',
        options: ['Par un déluge', 'Par un séisme', 'Par un vent dévastateur', 'Par la foudre'],
        correct: 2,
        explication: 'Allah leur envoya un vent furieux et stérile pendant sept nuits et huit jours (Coran 69:6-7).',
      },
      {
        question: 'Quelle était la fierté principale du peuple de \'Ad ?',
        options: ['Leur or', 'Leur force physique et leurs constructions', 'Leur sagesse', 'Leur armée'],
        correct: 1,
        explication: 'Ils s\'enorgueillissaient de leur force physique et de leurs monuments, disant "Qui est plus fort que nous ?"',
      },
      {
        question: 'Dans quelle région vivait le peuple de \'Ad ?',
        options: ['Al-Ahqaf, dans le sud de la péninsule arabique', 'L\'Égypte', 'La Perse', 'La Syrie'],
        correct: 0,
        explication: 'Le peuple de \'Ad habitait la région d\'Al-Ahqaf, dans le sud de la péninsule arabique, l\'actuel Yémen (Coran 46:21).',
      },
    ],
  },
  {
    id: 'salih',
    nom: 'Salih',
    arabe: 'صَالِح',
    surnom: 'Prophète de Thamud',
    periode: 'Environ 2000 av. J.-C.',
    resume: 'Salih fut envoyé au peuple de Thamud qui sculptait ses maisons dans les rochers. Allah leur accorda un signe miraculeux : une chamelle sacrée. Ils la tuèrent et furent anéantis trois jours après.',
    histoire: [
      {
        etape: 'Un peuple qui sculptait la roche',
        texte: 'Le peuple de Thamud vivait à Al-Hijr, dans le nord-ouest de l\'Arabie — la région qu\'on appelle aujourd\'hui Madain Saleh. Ils étaient de grands bâtisseurs et sculptaient leurs maisons directement dans les montagnes rocheuses. Allah leur envoya Salih, l\'un des leurs, pour les appeler à adorer un seul Dieu.',
      },
      {
        etape: 'La chamelle sortie d\'un rocher',
        texte: 'Le peuple demanda à Salih un signe pour prouver qu\'il était vraiment prophète. Allah fit alors sortir une chamelle d\'un rocher — un signe extraordinaire. Salih leur dit : "Voici la chamelle d\'Allah, un signe pour vous. Laissez-la paître sur la terre d\'Allah et ne lui faites aucun mal, sinon un châtiment douloureux vous saisira" (Coran 11:64). Allah fixa un partage de l\'eau du puits entre elle et le village : "Elle boira un jour convenu et vous boirez un jour convenu, à tour de rôle" (Coran 26:155) — un jour entier pour la chamelle seule, puis le jour suivant réservé aux habitants.',
      },
      {
        etape: 'Une chamelle, une épreuve',
        texte: 'Cette chamelle était en réalité une épreuve pour le peuple de Thamud. Beaucoup trouvèrent ce partage pesant, et les notables se réunirent pour décider de s\'en débarrasser afin de garder l\'eau pour eux seuls. Ils égorgèrent la chamelle, désobéissant ouvertement à l\'ordre de leur Seigneur, et dirent avec défi : "Ô Salih, apporte-nous ce dont tu nous menaces, si tu es du nombre des envoyés" (Coran 7:77).',
      },
      {
        etape: 'Trois jours de sursis',
        texte: 'Salih leur répondit : "Jouissez encore trois jours dans vos demeures : c\'est une promesse qui ne sera pas démentie" (Coran 11:65). Selon la tradition, le visage des habitants changea de couleur chaque jour qui passait — jaune le premier jour, rouge le deuxième, puis noir le troisième — comme un signe annonçant le châtiment. Loin de se repentir, un groupe de neuf hommes complota même cette nuit-là pour tuer Salih et sa famille en secret, en jurant de nier ensuite toute implication (Coran 27:48-49). Mais Allah déjoua leur plan : ils périrent avec le reste de leur peuple (Coran 27:50-51).',
      },
      {
        etape: 'Le cri qui foudroya Thamud',
        texte: 'Au matin du quatrième jour, un cri terrible (*sayha*), accompagné d\'un violent tremblement, s\'abattit sur le peuple entier. Ils furent retrouvés inertes dans leurs maisons, comme s\'ils n\'y avaient jamais vécu (Coran 11:67-68). Par Sa miséricorde, Allah sauva Salih et ceux qui avaient cru avec lui (Coran 11:66) — un signe, dit le Coran, pour ceux qui savent réfléchir (Coran 26:158).',
      },
    ],
    traits: [
      { label: 'Patience', emoji: '🌿' },
      { label: 'Confiance en Allah', emoji: '🌟' },
      { label: 'Clarté du message', emoji: '📣' },
      { label: 'Douceur', emoji: '🕊️' },
    ],
    morale: 'Mépriser les signes d\'Allah par orgueil mène à la perte. Chaque grâce accordée est aussi un test de notre reconnaissance.',
    versetCle: {
      ref: 'Coran 11:64',
      texte: 'Ô mon peuple ! Voici la chamelle d\'Allah, un signe pour vous. Laissez-la paître sur la terre d\'Allah et ne lui faites aucun mal.',
    },
    quiz: [
      {
        question: 'Quel était le miracle accordé à Salih par Allah ?',
        options: ['Un bâton qui se transforme', 'Une chamelle sortie d\'une roche', 'La mer qui s\'ouvre', 'Du feu qui ne brûle pas'],
        correct: 1,
        explication: 'Allah fit sortir une chamelle miraculeuse d\'une roche comme signe pour le peuple de Thamud.',
      },
      {
        question: 'Combien de jours avant le châtiment Salih prévint-il son peuple ?',
        options: ['7 jours', '1 jour', '3 jours', '40 jours'],
        correct: 2,
        explication: 'Après que la chamelle fut tuée, Salih prévint son peuple qu\'il leur restait trois jours (Coran 11:65).',
      },
      {
        question: 'Comment le peuple de Thamud fut-il puni ?',
        options: ['Par un déluge', 'Par un vent', 'Par un cri céleste (sayhah)', 'Par des pierres'],
        correct: 2,
        explication: 'Un cri fulgurant (sayhah) anéantit le peuple de Thamud au matin du quatrième jour.',
      },
      {
        question: 'Où vivait le peuple de Thamud ?',
        options: ['À Babylone', 'À Al-Hijr, dans le nord-ouest de l\'Arabie', 'En Égypte', 'Dans la vallée du Nil'],
        correct: 1,
        explication: 'Le peuple de Thamud habitait Al-Hijr — aujourd\'hui Madain Saleh, en Arabie Saoudite — où ils sculptaient leurs demeures dans la roche.',
      },
    ],
  },
  {
    id: 'ibrahim',
    nom: 'Ibrahim',
    arabe: 'إِبْرَاهِيم',
    surnom: 'Khalilullah — Ami d\'Allah',
    periode: 'Environ 1800 av. J.-C.',
    resume: 'Ibrahim est le père des prophètes, l\'Ami d\'Allah. Il brisa les idoles, fut jeté dans le feu sans brûler, accepta de sacrifier son fils et bâtit la Kaaba avec Ismaïl. Sa vie est un modèle de foi absolue.',
    histoire: [
      {
        etape: 'L\'appel à son père',
        texte: 'Ibrahim grandit dans une famille et une société qui adoraient des idoles. Son père se nommait (ou se surnommait) Azar, comme le rapporte le Coran : "Ibrahim dit à son père Azar : Prends-tu des idoles pour divinités ? Je te vois, toi et ton peuple, dans un égarement évident" (Coran 6:74). Azar fut ainsi la toute première personne qu\'Ibrahim appela à l\'adoration d\'un Dieu unique. Il s\'adressa à lui avec une grande douceur, répétant "Ô mon père" (Coran 19:42-45), le suppliant de ne pas suivre Shaytan et lui promettant de demander pardon pour lui. Mais son père le repoussa avec colère et le menaça de le lapider s\'il ne se taisait pas.',
      },
      {
        etape: 'Le raisonnement des astres',
        texte: 'Encore jeune, Ibrahim observa les étoiles, puis la lune, puis le soleil, en se demandant si l\'un d\'eux méritait d\'être adoré. Chaque fois, l\'astre finissait par disparaître, et Ibrahim disait : "Je n\'aime pas ce qui disparaît" (Coran 6:76-79). Il comprit ainsi qu\'aucune chose périssable ne peut être un dieu, et se tourna vers le seul Créateur des cieux et de la terre.',
      },
      {
        etape: 'La ruse contre les idoles',
        texte: 'Le jour où son peuple partait célébrer une grande fête hors de la ville, Ibrahim prétexta être malade pour ne pas y assister — "Je suis malade", leur dit-il (Coran 37:89) — et resta seul en ville. Une fois le temple vide, il brisa toutes les idoles à coups de hache, sauf la plus grande, sur laquelle il accrocha l\'outil : un piège pour que son peuple, à son retour, comprenne de lui-même l\'absurdité d\'adorer des statues sans vie (Coran 21:57-58). Quand on l\'interrogea, il répondit, avec ironie, de le demander à la grande idole elle-même. Le peuple comprit le piège logique — une idole ne peut ni parler ni agir — mais refusa quand même de changer d\'avis.',
      },
      {
        etape: 'Jeté dans le feu',
        texte: 'Furieux, son peuple décida : "Brûlez-le, et secourez vos dieux, si vous voulez agir !" (Coran 21:68). Ils amassèrent du bois pendant des jours et allumèrent un brasier si immense qu\'il fallut une catapulte pour y projeter Ibrahim, personne ne pouvant en approcher. Ligoté, il ne cessa de répéter : "Il n\'y a de divinité digne d\'adoration que Toi ! Gloire à Toi, Tu n\'as point d\'associé !" Selon la tradition, l\'ange Jibril vint alors lui demander s\'il avait besoin d\'aide ; Ibrahim répondit qu\'il n\'avait besoin de rien, sauf d\'Allah. Allah ordonna alors : "Ô feu, sois pour Ibrahim une fraîcheur salutaire !" (Coran 21:69) — froid, mais aussi sûr, car un froid sans mesure aurait pu lui être tout aussi fatal. Le feu ne lui fit aucun mal. C\'est pour cette foi inébranlable qu\'Allah lui donna le titre de *Khalilullah* — l\'Ami d\'Allah (Coran 4:125) — le plus grand honneur jamais accordé à un prophète.',
      },
      {
        etape: 'L\'épreuve du sacrifice',
        texte: 'Ibrahim avait longtemps prié pour un fils vertueux, et Allah lui annonça la naissance d\'un "garçon doux et patient" (Coran 37:101) : Ismaïl. Une fois celui-ci en âge de l\'accompagner dans ses activités, Ibrahim vit en songe qu\'il devait le sacrifier — une vision qui, pour un prophète, est une forme de révélation. Il en parla à son fils avec respect, lui demandant son avis : "Ô mon fils, je me vois en songe en train de t\'immoler. Qu\'en penses-tu ?" Ismaïl répondit : "Père, fais ce qu\'on t\'a ordonné, tu me trouveras, si Allah le veut, parmi les patients" (Coran 37:102). Tous deux se soumirent, et au moment où Ibrahim s\'apprêtait à obéir, Allah l\'appela : "Ô Ibrahim, tu as déjà réalisé la vision !" (Coran 37:104-105) — l\'épreuve était accomplie par la seule sincérité de leur intention. Allah remplaça alors Ismaïl par un immense bélier (Coran 37:107). C\'est ce jour que les musulmans célèbrent chaque année lors de l\'Aïd al-Adha.',
      },
      {
        etape: 'La Kaaba et Zamzam',
        texte: 'Sur ordre d\'Allah, Ibrahim conduisit Hajar et leur bébé Ismaïl dans la vallée aride de La Mecque, et les y laissa avec très peu de provisions. Quand Hajar lui demanda s\'il faisait cela sur ordre d\'Allah, et qu\'il répondit oui, elle dit : "Alors Il ne nous délaissera pas." Ibrahim s\'éloigna en priant : "Seigneur, j\'ai établi une partie de ma descendance dans une vallée sans culture, près de Ta Maison sacrée..." (Coran 14:37), Lui demandant de leur accorder subsistance et des cœurs bienveillants autour d\'eux. Des années plus tard, Ibrahim revint, et avec Ismaïl devenu grand, éleva les fondations de la Kaaba, en priant : "Seigneur, accepte cela de nous" (Coran 2:127). C\'est de la confiance de Hajar que jaillit la source de Zamzam, et de cette vallée que naquit la ville sainte de La Mecque.',
      },
    ],
    traits: [
      { label: 'Foi absolue', emoji: '⭐' },
      { label: 'Raisonnement', emoji: '🧠' },
      { label: 'Sacrifice', emoji: '🐏' },
      { label: 'Hospitalité', emoji: '🏠' },
      { label: 'Soumission totale', emoji: '🤲' },
    ],
    morale: 'La confiance absolue en Allah transforme chaque épreuve en bénédiction. Ibrahim fut jeté dans le feu — il en sortit indemne. Chaque obstacle est une opportunité de montrer sa foi.',
    versetCle: {
      ref: 'Coran 2:131',
      texte: 'Quand son Seigneur lui dit : "Soumets-toi !", il dit : "Je me soumets au Seigneur des mondes."',
    },
    quiz: [
      {
        question: 'Quel titre Allah accorda-t-Il à Ibrahim ?',
        options: ['Ruhullah', 'Kalimullah', 'Khalilullah', 'Nabiyullah'],
        correct: 2,
        explication: 'Ibrahim reçut le titre de Khalilullah — Ami d\'Allah (Coran 4:125), le plus haut titre accordé à un prophète avec Kalimullah pour Musa.',
      },
      {
        question: 'Que fit Allah pour Ibrahim quand son peuple le jeta dans le feu ?',
        options: ['Il éteignit le feu', 'Il rendit le feu froid et sécurisant', 'Il fit descendre la pluie', 'Il ouvrit la terre'],
        correct: 1,
        explication: 'Allah dit au feu : "Sois froid et sécurisant pour Ibrahim" (Coran 21:69).',
      },
      {
        question: 'Quel édifice sacré Ibrahim éleva-t-il avec son fils Ismaïl ?',
        options: ['La mosquée al-Aqsa', 'La Kaaba', 'La mosquée du Prophète', 'Le puits de Zamzam'],
        correct: 1,
        explication: 'Ibrahim et Ismaïl élevèrent ensemble les fondations de la Kaaba à La Mecque (Coran 2:127).',
      },
      {
        question: 'Qu\'est-ce qu\'Ibrahim observa pour raisonner sur l\'existence d\'Allah ?',
        options: ['La mer et les poissons', 'Les étoiles, la lune et le soleil', 'Les montagnes et les rivières', 'Les animaux et les plantes'],
        correct: 1,
        explication: 'Ibrahim observa les astres et conclut qu\'ils se couchent donc ne méritent pas l\'adoration (Coran 6:76-79).',
      },
    ],
  },
  {
    id: 'lut',
    nom: 'Lut',
    arabe: 'لُوط',
    surnom: 'Neveu d\'Ibrahim',
    periode: 'Environ 1800 av. J.-C.',
    resume: 'Lut fut envoyé au peuple de Sodome qui pratiquait l\'homosexualité et le brigandage. Il les appela au droit chemin pendant des années. Des anges vinrent le visiter et les villes furent renversées.',
    histoire: [
      'Lut était le neveu d\'Ibrahim et crut en lui. Il émigra avec lui et fut envoyé comme prophète au peuple de Sodome (Lut) dans la région de la mer Morte. Ce peuple pratiquait une immoralité que nulle nation avant eux n\'avait commise — l\'homosexualité — en plus du vol et du brigandage.',
      'Lut les appela inlassablement mais ils répondaient par le rejet et les menaces. Ils lui dirent même de chasser les croyants de la ville s\'il voulait rester parmi eux. Sa propre épouse trahit la confiance des hôtes — elle informait le peuple de l\'arrivée des visiteurs étrangers.',
      'Trois anges, envoyés d\'abord chez Ibrahim pour lui annoncer un fils, descendirent ensuite chez Lut. Le peuple voulut s\'en prendre à eux. Les anges avertirent Lut : "Pars cette nuit avec ta famille, ne retourne pas en arrière — sauf ton épouse." Au matin, Allah renversa les villes à l\'envers et fit pleuvoir des pierres d\'argile cuite sur elles.',
    ],
    traits: [
      { label: 'Fermeté morale', emoji: '🏛️' },
      { label: 'Courage', emoji: '🦁' },
      { label: 'Hospitalité', emoji: '🏠' },
      { label: 'Persévérance', emoji: '⏳' },
    ],
    morale: 'Se tenir seul contre une société corrompue exige un courage rare. Lut nous enseigne qu\'aucune pression sociale ne justifie de trahir les valeurs divines.',
    versetCle: {
      ref: 'Coran 11:78',
      texte: 'Lut dit : "Ô mon peuple ! Voici mes filles — elles sont plus pures pour vous. Craignez Allah et ne me déshonorez pas devant mes hôtes."',
    },
    quiz: [
      {
        question: 'Quel était le lien de parenté entre Lut et Ibrahim ?',
        options: ['Son fils', 'Son frère', 'Son neveu', 'Son cousin'],
        correct: 2,
        explication: 'Lut était le neveu d\'Ibrahim et émigra avec lui avant d\'être envoyé comme prophète.',
      },
      {
        question: 'Comment les villes du peuple de Lut furent-elles punies ?',
        options: ['Par un déluge', 'Par un vent', 'Renversées et lapidées de pierres d\'argile', 'Par la famine'],
        correct: 2,
        explication: 'Allah renversa les villes et fit pleuvoir des pierres d\'argile cuite (Coran 11:82-83).',
      },
      {
        question: 'Qui trahit Lut parmi les siens ?',
        options: ['Son fils', 'Son frère', 'Son épouse', 'Son associé'],
        correct: 2,
        explication: 'L\'épouse de Lut trahit les hôtes en informant le peuple de leur présence, et périt avec les coupables.',
      },
      {
        question: 'De quel prophète Lut était-il le neveu et le compagnon de migration ?',
        options: ['Nuh', 'Ibrahim', 'Musa', 'Idris'],
        correct: 1,
        explication: 'Lut émigra avec son oncle Ibrahim avant d\'être envoyé comme prophète au peuple de Sodome.',
      },
    ],
  },
  {
    id: 'ismail',
    nom: 'Ismaïl',
    arabe: 'إِسْمَاعِيل',
    surnom: 'Père des Arabes',
    periode: 'Environ 1750 av. J.-C.',
    resume: 'Ismaïl est le fils aîné d\'Ibrahim et l\'ancêtre de la lignée arabe des prophètes. Il co-construisit la Kaaba avec son père, accepta d\'être sacrifié avec une soumission totale et fut réputé pour sa sincérité dans ses promesses.',
    histoire: [
      'Ismaïl naquit d\'Hajar, épouse d\'Ibrahim. Nourrisson, il fut laissé avec sa mère dans la vallée aride et sans eau de La Mecque. Quand l\'eau s\'épuisa, Hajar courut sept fois entre les collines de Safa et Marwa cherchant de l\'aide. Allah fit jaillir le puits de Zamzam sous les pieds du bébé Ismaïl — un puits qui coule encore aujourd\'hui.',
      'Quand Ibrahim reçut en rêve l\'ordre de sacrifier son fils, il en informa Ismaïl. La réponse d\'Ismaïl est parmi les plus belles du Coran : "Père, fais ce qu\'on t\'a ordonné — tu me trouveras, si Allah le veut, parmi les patients." Ibrahim le coucha sur le front, prêt à exécuter l\'ordre, avant qu\'Allah ne le retienne et remplace Ismaïl par un bélier.',
      'Ismaïl aida son père à bâtir la Kaaba, posant pierre après pierre en priant : "Seigneur, accepte de nous, Tu es Celui qui entend et qui sait." Il apprit l\'arabe auprès des tribus qui s\'installèrent autour de Zamzam, et de sa descendance naquit le Prophète Muhammad ﷺ des siècles plus tard.',
    ],
    traits: [
      { label: 'Obéissance totale', emoji: '🌿' },
      { label: 'Patience', emoji: '⏳' },
      { label: 'Sincérité', emoji: '✅' },
      { label: 'Fidélité aux promesses', emoji: '🤝' },
    ],
    morale: 'La soumission à Allah n\'est pas une contrainte mais une libération. Ismaïl, en acceptant le sacrifice, reçut la grâce la plus grande — et devint l\'ancêtre du sceau des prophètes.',
    versetCle: {
      ref: 'Coran 37:102',
      texte: 'Il dit : "Ô mon fils, je vois en songe que je t\'immole." Il dit : "Père, fais ce qu\'on t\'ordonne. Tu me trouveras patient, si Allah le veut."',
    },
    quiz: [
      {
        question: 'Qui est la mère d\'Ismaïl ?',
        options: ['Sara', 'Hajar', 'Maryam', 'Asiya'],
        correct: 1,
        explication: 'Ismaïl est le fils d\'Ibrahim et de son épouse Hajar.',
      },
      {
        question: 'Quel puits jaillit sous les pieds du bébé Ismaïl ?',
        options: ['Bir Tuba', 'Bir Aris', 'Zamzam', 'Bir Ruma'],
        correct: 2,
        explication: 'Allah fit jaillir le puits de Zamzam sous les pieds d\'Ismaïl quand Hajar cherchait de l\'eau.',
      },
      {
        question: 'Que fit Ismaïl avec son père Ibrahim ?',
        options: ['Ils construisirent la mosquée al-Aqsa', 'Ils construisirent la Kaaba', 'Ils traversèrent la mer Rouge', 'Ils combattirent Pharaon'],
        correct: 1,
        explication: 'Ibrahim et Ismaïl élevèrent ensemble les fondations de la Kaaba (Coran 2:127).',
      },
      {
        question: 'Quelle langue Ismaïl apprit-il en grandissant près de Zamzam ?',
        options: ['L\'hébreu', 'L\'araméen', 'L\'arabe', 'Le copte'],
        correct: 2,
        explication: 'Ismaïl grandit parmi les tribus arabes installées autour de Zamzam et apprit l\'arabe, devenant l\'ancêtre de la lignée arabe des prophètes, dont Muhammad ﷺ.',
      },
    ],
  },
  {
    id: 'ishaq',
    nom: 'Ishaq',
    arabe: 'إِسْحَاق',
    surnom: 'Fils de la promesse',
    periode: 'Environ 1750 av. J.-C.',
    resume: 'Ishaq naquit comme un miracle d\'Ibrahim et de sa femme Sara, tous deux âgés. Il devint prophète et père de Yaqub (Jacob), poursuivant la lignée prophétique qui mènerait aux prophètes des Enfants d\'Israël.',
    histoire: [
      'Quand les anges vinrent chez Ibrahim pour l\'informer de la destruction du peuple de Lut, ils lui annoncèrent également la naissance d\'un fils, Ishaq — et après lui, Yaqub. Sara, âgée et stérile, s\'étonna : "Malheur à moi ! Vais-je enfanter alors que je suis vieille et que mon époux est un vieillard ?" Les anges lui rappelèrent que c\'était le décret d\'Allah.',
      'Ishaq grandit dans la maison de la foi et de la prophétie. Il reçut la prophétie et perpétua le message du Tawhid. Son fils Yaqub eut douze enfants qui devinrent les ancêtres des douze tribus d\'Israël. Allah bénit Ibrahim et lui dit : "Je t\'ai donné Ishaq et Yaqub, et j\'ai placé la prophétie et le Livre dans ta descendance."',
      'Ishaq et son demi-frère Ismaïl, bien que nés de mères différentes — Sara et Hajar —, partagent la même origine prophétique par leur père Ibrahim. C\'est de la descendance d\'Ishaq, à travers Yaqub, que naîtront la plupart des prophètes envoyés aux Bani Israël, tandis que la lignée d\'Ismaïl mènera, des siècles plus tard, au sceau des prophètes, Muhammad ﷺ.',
    ],
    traits: [
      { label: 'Piété', emoji: '🕌' },
      { label: 'Continuité de la foi', emoji: '🌿' },
      { label: 'Bénédiction divine', emoji: '⭐' },
    ],
    morale: 'Les promesses d\'Allah se réalisent toujours, même quand les circonstances semblent impossibles. Sara rit d\'incrédulité — et reçut le don le plus précieux.',
    versetCle: {
      ref: 'Coran 11:71',
      texte: 'Et Nous lui annonçâmes la bonne nouvelle d\'Ishaq, et après Ishaq, de Yaqub.',
    },
    quiz: [
      {
        question: 'Qui est la mère d\'Ishaq ?',
        options: ['Hajar', 'Maryam', 'Sara', 'Asiya'],
        correct: 2,
        explication: 'Ishaq est le fils d\'Ibrahim et de Sara, sa première épouse.',
      },
      {
        question: 'Qui est le fils d\'Ishaq mentionné dans le Coran ?',
        options: ['Ismaïl', 'Yusuf', 'Yaqub', 'Musa'],
        correct: 2,
        explication: 'Yaqub (Jacob) est le fils d\'Ishaq et le père des douze tribus d\'Israël.',
      },
      {
        question: 'Quel est le lien de parenté entre Ishaq et Ismaïl ?',
        options: ['Ils sont cousins', 'Ils sont demi-frères, tous deux fils d\'Ibrahim', 'Ils sont père et fils', 'Aucun lien'],
        correct: 1,
        explication: 'Ismaïl est né de Hajar et Ishaq de Sara, les deux épouses d\'Ibrahim — ils sont donc demi-frères.',
      },
      {
        question: 'Dans quelle situation se trouvait Sara quand elle reçut l\'annonce de la naissance d\'Ishaq ?',
        options: ['Elle était jeune et venait de se marier', 'Elle était âgée et stérile', 'Elle avait déjà eu cinq enfants', 'Son âge n\'est pas précisé'],
        correct: 1,
        explication: 'Sara était âgée et stérile depuis toujours ; elle s\'étonna de cette annonce miraculeuse (Coran 11:72).',
      },
    ],
  },
  {
    id: 'yaqub',
    nom: 'Yaqub',
    arabe: 'يَعْقُوب',
    surnom: 'Israël',
    periode: 'Environ 1700 av. J.-C.',
    resume: 'Yaqub, surnommé Israël, est le père des douze tribus. Il perdit son fils bien-aimé Yusuf pendant des années et pleura jusqu\'à perdre la vue, mais ne cessa jamais d\'espérer en la miséricorde d\'Allah.',
    histoire: [
      'Yaqub était le fils d\'Ishaq et le petit-fils d\'Ibrahim. Il eut douze fils, dont son préféré était Yusuf, né de son épouse la plus aimée. Cette préférence suscita la jalousie des autres frères. Un jour, ils complotèrent de se débarrasser de Yusuf : ils le jetèrent dans un puits et rapportèrent à leur père qu\'un loup l\'avait dévoré, apportant sa chemise couverte de faux sang.',
      'Yaqub reconnut l\'imposture mais garda sa peine en lui, disant : "La belle patience est la mienne." Il pleura Yusuf des années entières, au point de perdre la vue. Ses fils lui dirent : "Par Allah, tu ne cesseras de te souvenir de Yusuf jusqu\'à en tomber malade ou périr." Il répondit qu\'il se plaignait uniquement à Allah.',
      'Quand finalement Yusuf fut retrouvé en Égypte devenu ministre, il envoya sa chemise à son père. Yaqub sentit l\'odeur de Yusuf de loin et dit : "Je perçois le parfum de Yusuf — ne me traitez pas de vieux radoteur." Quand la chemise fut posée sur son visage, sa vue revint. Il retrouva son fils et sa famille fut réunie à Jérusalem puis en Égypte.',
    ],
    traits: [
      { label: 'Patience noble', emoji: '⏳' },
      { label: 'Espoir en Allah', emoji: '🌅' },
      { label: 'Amour paternel', emoji: '❤️' },
      { label: 'Foi inébranlable', emoji: '🌟' },
    ],
    morale: 'Ne jamais désespérer de la miséricorde d\'Allah — c\'est le péché des gens qui ne croient pas. Yaqub attendit des décennies et fut exaucé.',
    versetCle: {
      ref: 'Coran 12:87',
      texte: 'Ne désespérez pas de la miséricorde d\'Allah. Seuls les gens mécréants désespèrent de la miséricorde d\'Allah.',
    },
    quiz: [
      {
        question: 'Quel autre nom Yaqub portait-il ?',
        options: ['Ibrahim', 'Israël', 'Ismaïl', 'Ishaq'],
        correct: 1,
        explication: 'Yaqub est aussi appelé Israël — ses descendants sont les Bani Israïl (Enfants d\'Israël).',
      },
      {
        question: 'Pourquoi Yaqub perdit-il la vue ?',
        options: ['D\'une maladie', 'De pleurer la perte de son fils Yusuf', 'D\'un accident', 'De vieillesse'],
        correct: 1,
        explication: 'Yaqub pleura si intensément l\'absence de Yusuf que ses yeux blanchirent de chagrin (Coran 12:84).',
      },
      {
        question: 'Comment Yaqub retrouva-t-il la vue ?',
        options: ['Par une guérison miraculeuse', 'Par la chemise de Yusuf posée sur son visage', 'Par du Zamzam', 'Par une prière des anges'],
        correct: 1,
        explication: 'Yusuf envoya sa chemise et quand elle fut posée sur le visage de Yaqub, sa vue revint (Coran 12:96).',
      },
      {
        question: 'Combien de fils Yaqub a-t-il eu, selon la tradition islamique ?',
        options: ['Sept', 'Dix', 'Douze', 'Quinze'],
        correct: 2,
        explication: 'Yaqub eut douze fils, qui devinrent les ancêtres des douze tribus d\'Israël (Bani Israïl).',
      },
    ],
  },
  {
    id: 'yusuf',
    nom: 'Yusuf',
    arabe: 'يُوسُف',
    surnom: 'Le Beau, le Patient',
    periode: 'Environ 1650 av. J.-C.',
    resume: 'L\'histoire de Yusuf est appelée "la plus belle des histoires" dans le Coran. Jeté dans un puits par ses frères, vendu comme esclave, emprisonné injustement, il devint ministre d\'Égypte et pardonna à ceux qui lui firent du mal.',
    histoire: [
      'Yusuf était le fils bien-aimé de Yaqub, doté d\'une beauté physique et spirituelle extraordinaire. Il eut un songe : onze étoiles, le soleil et la lune se prosternaient devant lui. Son père le mit en garde de ne pas en parler à ses frères. Mais la jalousie de ses frères grandit jusqu\'à ce qu\'ils le jettent dans un puits et le vendent à une caravane passante pour quelques pièces d\'argent.',
      'En Égypte, Yusuf fut acheté par un haut fonctionnaire (Al-Aziz). L\'épouse de cet homme tenta de le séduire. Il résista fermement, disant : "Je cherche refuge en Allah." Il préféra la prison à la désobéissance. En prison, il interpréta les rêves de ses compagnons de cellule, puis le songe du roi d\'Égypte (sept vaches grasses dévorées par sept maigres).',
      'Le roi convoqua Yusuf et lui proposa de le libérer. Yusuf demanda d\'abord la vérification de son innocence avant de sortir. Une fois innocenté publiquement, il fut nommé ministre des réserves et des greniers d\'Égypte — une position qu\'il demanda lui-même car il était "gardien compétent et savant".',
      'Quand ses frères vinrent en Égypte chercher des vivres pendant la famine, il les reconnut mais ne se révéla pas immédiatement. Il les mit à l\'épreuve, les testa, jusqu\'au moment de la révélation : "Je suis Yusuf, et voici mon frère. Allah nous a comblés de bienfaits." Quand ils s\'excusèrent, il dit : "Pas de reproche contre vous aujourd\'hui. Allah vous pardonnera."',
    ],
    traits: [
      { label: 'Chasteté', emoji: '🌹' },
      { label: 'Patience', emoji: '⏳' },
      { label: 'Pardon', emoji: '🕊️' },
      { label: 'Sagesse', emoji: '🧠' },
      { label: 'Gratitude', emoji: '🤲' },
    ],
    morale: 'La chasteté face à la tentation et le pardon face à l\'injustice sont les deux sommets du caractère humain. Yusuf vécut les deux et fut élevé aux sommets dans les deux mondes.',
    versetCle: {
      ref: 'Coran 12:90',
      texte: 'Certes, quiconque craint Allah et endure, Allah ne laisse pas perdre la récompense des bienfaisants.',
    },
    quiz: [
      {
        question: 'Que fit Yusuf avant d\'accepter de sortir de prison ?',
        options: ['Il jeûna trois jours en signe de gratitude', 'Il demanda la vérification publique de son innocence', 'Il refusa de partir sans la permission du roi', 'Il demanda une armée pour se venger'],
        correct: 1,
        explication: 'Yusuf exigea qu\'on enquête d\'abord sur l\'affaire avec l\'épouse d\'Al-Aziz — pour que son innocence soit établie publiquement avant sa libération.',
      },
      {
        question: 'Qui tenta de séduire Yusuf en Égypte ?',
        options: ['La fille du roi', 'L\'épouse du vizir (Al-Aziz)', 'Une esclave du palais', 'La fille de Pharaon'],
        correct: 1,
        explication: 'L\'épouse d\'Al-Aziz (le maître de Yusuf) tenta de le séduire. Yusuf résista et préféra la prison.',
      },
      {
        question: 'Que fit Yusuf quand ses frères lui demandèrent pardon ?',
        options: ['Il les fit emprisonner', 'Il les chassa d\'Égypte', 'Il leur pardonna sans reproches', 'Il les mit à l\'épreuve encore'],
        correct: 2,
        explication: 'Yusuf dit : "Pas de reproche contre vous aujourd\'hui. Allah vous pardonnera — Il est le plus miséricordieux" (Coran 12:92).',
      },
      {
        question: 'Quel poste Yusuf obtint-il en Égypte ?',
        options: ['Général de l\'armée', 'Conseiller du roi', 'Ministre des réserves et greniers', 'Grand prêtre'],
        correct: 2,
        explication: 'Yusuf demanda lui-même à être placé sur les greniers d\'Égypte, car il était "gardien compétent et savant" (Coran 12:55).',
      },
    ],
  },
  {
    id: 'ayyub',
    nom: 'Ayyub',
    arabe: 'أَيُّوب',
    surnom: 'Le Patient',
    periode: 'Environ 1500 av. J.-C.',
    resume: 'Ayyub perdit sa santé, ses biens et ses enfants pendant des années d\'épreuves. Il ne se plaignit qu\'à Allah par un du\'a sobre et magnifique, et Allah le guérit, lui restituant tout en double.',
    histoire: [
      'Ayyub était un prophète béni d\'Allah : riche, en bonne santé, père de nombreux enfants. Puis les épreuves s\'abattirent — il perdit ses biens, ses enfants, puis sa santé. Sa maladie dura de longues années, à tel point que ses proches s\'éloignèrent de lui. Seule son épouse Rahma (ou Liya) resta à ses côtés, travaillant pour le nourrir.',
      'Ayyub ne murmura pas. Ses lèvres ne prononcèrent ni plainte ni reproche envers Allah. Quand il atteignit le fond de l\'épreuve, il fit un du\'a parmi les plus sobres et les plus profonds du Coran : "Le mal m\'a touché et Tu es le plus Miséricordieux des miséricordieux." Pas de plainte — juste une constatation et un rappel de qui est Allah.',
      'Allah répondit immédiatement : "Nous l\'avons exaucé, Nous avons écarté de lui le mal qu\'il avait." Allah lui ordonna de frapper le sol du pied — une source jaillit et il se lava et but, et fut guéri entièrement. Sa famille lui fut restituée et Allah lui accorda, en plus, leurs pareils — bénédiction sur bénédiction.',
    ],
    traits: [
      { label: 'Patience absolue', emoji: '🏔️' },
      { label: 'Gratitude dans la détresse', emoji: '🤲' },
      { label: 'Confiance en Allah', emoji: '🌟' },
      { label: 'Sobriété dans la plainte', emoji: '🕊️' },
    ],
    morale: 'La vraie patience ne se mesure pas quand tout va bien. Elle se révèle quand tout s\'effondre — et Ayyub nous a montré qu\'elle ouvre les portes de la guérison divine.',
    versetCle: {
      ref: 'Coran 21:83',
      texte: 'Le mal m\'a touché et Tu es le plus Miséricordieux des miséricordieux.',
    },
    quiz: [
      {
        question: 'Quelle fut la réaction d\'Ayyub pendant ses longues années d\'épreuve ?',
        options: ['Il se mit en colère contre Allah', 'Il resta patient et ne se plaignit qu\'à Allah', 'Il abandonna la foi', 'Il demanda aux hommes de l\'aide'],
        correct: 1,
        explication: 'Ayyub garda une patience extraordinaire et ne se plaignit qu\'à Allah par un du\'a sobre.',
      },
      {
        question: 'Comment Ayyub fut-il guéri selon le Coran ?',
        options: ['Par un ange qui le toucha', 'En frappant le sol du pied — une source jaillit', 'Par les prières de son peuple', 'Par une plante médicinale'],
        correct: 1,
        explication: 'Allah ordonna à Ayyub de frapper le sol du pied. Une source jaillit avec laquelle il se lava et but (Coran 38:42).',
      },
      {
        question: 'Quel est le du\'a d\'Ayyub cité dans le Coran ?',
        options: [
          '"Seigneur, je me plains de ma tristesse"',
          '"Le mal m\'a touché et Tu es le plus Miséricordieux"',
          '"Délivre-moi Seigneur de cette épreuve"',
          '"Pardonne-moi, j\'ai été parmi les injustes"',
        ],
        correct: 1,
        explication: 'Coran 21:83 : "Le mal m\'a touché et Tu es le plus Miséricordieux des miséricordieux."',
      },
      {
        question: 'Qui resta fidèlement aux côtés d\'Ayyub durant toute son épreuve ?',
        options: ['Son fils aîné', 'Son épouse', 'Ses frères', 'Ses voisins'],
        correct: 1,
        explication: 'Seule son épouse resta à ses côtés, travaillant pour subvenir à ses besoins alors que ses proches s\'éloignaient de lui.',
      },
    ],
  },
  {
    id: 'shuayb',
    nom: 'Shu\'ayb',
    arabe: 'شُعَيْب',
    surnom: 'L\'Éloquent',
    periode: 'Environ 1500 av. J.-C.',
    resume: 'Shu\'ayb fut envoyé au peuple de Madyan qui trichait dans les balances et les mesures. Il les appela à l\'honnêteté commerciale et à la crainte d\'Allah. Rejetés, ils furent détruits par un cri foudroyant.',
    histoire: [
      'Le peuple de Madyan vivait dans la région du nord-ouest de l\'Arabie actuelle. Leur vice principal était de tricher dans les mesures et les balances pour s\'enrichir au détriment des autres. Shu\'ayb, l\'un d\'eux, leur dit : "Donnez la pleine mesure et ne soyez pas parmi ceux qui font subir des pertes."',
      'Les chefs de Madyan répondirent avec mépris. Ils utilisèrent même l\'argument de la liberté économique : "Nos prières nous ordonnent-elles d\'abandonner ce que nos pères adoraient ou de ne plus faire de notre bien ce que nous voulons ?" Shu\'ayb leur répliqua que la foi et l\'honnêteté sont inséparables.',
      'Ils menacèrent Shu\'ayb de l\'expulser s\'il ne revenait pas à leurs pratiques. Il plaça sa confiance en Allah et refusa. Le châtiment vint : un cri (sayhah) accompagné d\'un nuage d\'ombre qui se referma sur eux comme une fournaise, les anéantissant en un instant.',
    ],
    traits: [
      { label: 'Justice économique', emoji: '⚖️' },
      { label: 'Éloquence', emoji: '📣' },
      { label: 'Fermeté', emoji: '🏔️' },
      { label: 'Désintéressement', emoji: '🤝' },
    ],
    morale: 'L\'intégrité dans les affaires est une obligation religieuse, pas une option. La fraude économique est une forme d\'injustice que Allah ne laisse pas impunie.',
    versetCle: {
      ref: 'Coran 11:85',
      texte: 'Ô mon peuple ! Donnez la pleine mesure et le plein poids en toute équité, et ne lésez pas les gens dans leurs biens.',
    },
    quiz: [
      {
        question: 'Quel était le péché principal du peuple de Madyan ?',
        options: ['L\'adoration d\'idoles', 'La triche dans les mesures et les balances', 'L\'adultère', 'Le meurtre'],
        correct: 1,
        explication: 'Le peuple de Madyan volait en trichant dans les balances — Shu\'ayb les appela à l\'honnêteté commerciale.',
      },
      {
        question: 'Quelle menace les chefs de Madyan lancèrent-ils à Shu\'ayb ?',
        options: ['De le jeter dans le feu', 'De l\'expulser s\'il ne revenait pas à leurs pratiques', 'De l\'emprisonner', 'De le lapider'],
        correct: 1,
        explication: 'Les chefs lui dirent de les rejoindre dans leurs pratiques ou d\'être expulsé — Shu\'ayb refusa et plaça sa confiance en Allah.',
      },
      {
        question: 'Pourquoi Shu\'ayb est-il traditionnellement surnommé "l\'Éloquent" ?',
        options: ['Il parlait plusieurs langues', 'Pour la clarté et la force de sa prédication', 'Il était poète', 'Il chantait le Zabur'],
        correct: 1,
        explication: 'Shu\'ayb est surnommé "l\'Éloquent" (Khatib al-Anbiya) pour la clarté et la puissance de persuasion de sa prédication.',
      },
      {
        question: 'Quel argument les chefs de Madyan opposèrent-ils à Shu\'ayb ?',
        options: ['Qu\'il était trop jeune', 'Que la religion ne devait pas dicter leurs affaires commerciales', 'Qu\'il n\'était pas de leur tribu', 'Qu\'il n\'avait fait aucun miracle'],
        correct: 1,
        explication: 'Ils rétorquèrent : "Tes prières t\'ordonnent-elles que nous abandonnions ce qu\'adoraient nos ancêtres, ou de ne plus faire de nos biens ce que nous voulons ?" (Coran 11:87)',
      },
    ],
  },
  {
    id: 'musa',
    nom: 'Musa',
    arabe: 'مُوسَى',
    surnom: 'Kalimullah — Celui à qui Allah a parlé',
    periode: 'Environ 1300 av. J.-C.',
    resume: 'Musa est le prophète le plus cité dans le Coran. Il confronta Pharaon avec le bâton et les miracles, libéra les Enfants d\'Israël, reçut la Torah sur le mont Sinaï et partagea la mer Rouge.',
    histoire: [
      'Musa naquit à une époque où Pharaon faisait égorger tous les nouveau-nés mâles israélites par peur d\'une prophétie. Sa mère, guidée par Allah, le posa dans une nacelle sur le Nil. La nacelle fut recueillie par la famille de Pharaon lui-même. La sœur de Musa suivit la nacelle et proposa d\'amener une nourrice — sa propre mère. Ainsi Musa grandit dans le palais de Pharaon, allaitée par sa vraie mère, payée pour cela.',
      'Adulte, Musa tua accidentellement un Égyptien en voulant défendre un Israélite. Il fuit vers Madyan où il vécut dix ans, gardant les troupeaux de Shu\'ayb et épousant sa fille. Sur le chemin du retour, il aperçut un feu et s\'en approcha. C\'était la révélation divine : Allah lui parla directement — c\'est pour cela que Musa reçut le titre de Kalimullah, Celui à qui Allah a parlé. Il lui assigna la mission de se rendre chez Pharaon avec son frère Harun.',
      'Face à Pharaon, Musa accomplit les miracles — son bâton devint serpent et avala les cordes des magiciens, sa main devint lumineuse. Les magiciens de Pharaon reconnurent la vérité et se prosternèrent, disant qu\'ils croyaient au Seigneur de Musa et Harun. Pharaon infligea dix plaies à l\'Égypte avant de laisser partir les Israélites.',
      'Quand Pharaon les poursuivit avec son armée jusqu\'à la mer, Musa frappa l\'eau de son bâton. La mer s\'ouvrit en douze chemins, un pour chaque tribu. Les Israélites traversèrent. Pharaon et son armée les suivirent — et la mer se referma sur eux. Musa reçut ensuite la Torah sur le mont Sinaï pendant quarante jours, pendant que son peuple retombait dans l\'idolâtrie du veau d\'or.',
    ],
    traits: [
      { label: 'Courage devant les puissants', emoji: '🦁' },
      { label: 'Sincérité', emoji: '✅' },
      { label: 'Humilité (Khidr)', emoji: '🌿' },
      { label: 'Leadership', emoji: '🏔️' },
      { label: 'Direct', emoji: '📣' },
    ],
    morale: 'Parler vrai face au tyran est le sommet du jihad. Musa, seul avec un bâton, affronta le plus puissant roi de la Terre — car sa force venait d\'Allah.',
    versetCle: {
      ref: 'Coran 28:7',
      texte: 'Nous révélâmes à la mère de Musa : "Allaite-le. Et quand tu craindras pour lui, jette-le dans le fleuve."',
    },
    quiz: [
      {
        question: 'Quel titre Allah accorda-t-Il à Musa ?',
        options: ['Khalilullah', 'Kalimullah', 'Ruhullah', 'Habibullah'],
        correct: 1,
        explication: 'Musa est appelé Kalimullah — Celui à qui Allah a parlé directement (Coran 4:164).',
      },
      {
        question: 'Comment Musa partagea-t-il la mer Rouge ?',
        options: ['Par une prière', 'En soufflant dessus', 'En frappant l\'eau de son bâton', 'Par l\'ordre d\'un ange'],
        correct: 2,
        explication: 'Allah ordonna à Musa de frapper la mer de son bâton et elle s\'ouvrit (Coran 26:63).',
      },
      {
        question: 'Où Musa reçut-il la Torah ?',
        options: ['Dans le désert du Sinaï', 'Sur le mont Sinaï', 'À Jérusalem', 'En Égypte'],
        correct: 1,
        explication: 'Musa passa quarante nuits sur le mont Sinaï (Tur) où Allah lui donna les Tables de la Loi (Coran 7:142).',
      },
      {
        question: 'Qui accompagna Musa dans sa mission chez Pharaon ?',
        options: ['Son fils', 'Son cousin Yusuf', 'Son frère Harun', 'Le sage Khidr'],
        correct: 2,
        explication: 'Allah envoya Harun, frère de Musa, comme soutien car il était plus éloquent (Coran 28:34).',
      },
    ],
  },
  {
    id: 'harun',
    nom: 'Harun',
    arabe: 'هَارُون',
    surnom: 'Le Soutien de Musa',
    periode: 'Environ 1300 av. J.-C.',
    resume: 'Harun est le frère de Musa et son compagnon de prophétie. Allah l\'accorda à Musa comme ministre et porte-parole grâce à son éloquence. Il géra le peuple pendant l\'absence de Musa sur le Sinaï.',
    histoire: [
      'Quand Musa reçut sa mission, il demanda à Allah un soutien. Sa première demande fut pour son frère Harun : "Accorde-moi un ministre de ma famille, Harun mon frère — renforce par lui mon dos et associe-le à ma mission." Allah accepta.',
      'Harun était connu pour son éloquence, là où Musa avait une gêne dans la parole. Ensemble ils allèrent chez Pharaon. Harun était le porte-parole et le soutien moral de son frère tout au long de la mission.',
      'Quand Musa monta sur le Sinaï pendant quarante jours, il confia son peuple à Harun. Le peuple tomba dans l\'adoration du veau d\'or, un piège tendu par le Samiri. Harun tenta de les en dissuader mais ils refusèrent d\'écouter. À son retour, Musa fut si en colère qu\'il saisit la barbe de Harun. Harun expliqua qu\'il avait tout fait pour les en empêcher.',
    ],
    traits: [
      { label: 'Éloquence', emoji: '📣' },
      { label: 'Solidarité fraternelle', emoji: '🤝' },
      { label: 'Douceur', emoji: '🕊️' },
      { label: 'Patience', emoji: '⏳' },
    ],
    morale: 'Soutenir ceux qui font le bien est une forme de prophétie. Harun n\'est pas dans l\'ombre de Musa — il est sa force. On ne fait jamais seul ce qu\'on peut faire ensemble.',
    versetCle: {
      ref: 'Coran 20:29-32',
      texte: 'Et accorde-moi un ministre de ma famille, Harun mon frère. Renforce par lui mon dos et associe-le à ma mission.',
    },
    quiz: [
      {
        question: 'Pourquoi Musa demanda-t-il à Allah d\'envoyer Harun avec lui ?',
        options: ['Car Harun était plus courageux', 'Car Harun était plus éloquent', 'Car Harun connaissait Pharaon', 'Car Harun était plus âgé'],
        correct: 1,
        explication: 'Musa avait une gêne dans la parole et demanda Harun car il était plus éloquent (Coran 28:34).',
      },
      {
        question: 'Que se passa-t-il pendant l\'absence de Musa sur le Sinaï ?',
        options: ['Le peuple pria', 'Le peuple adora un veau d\'or', 'Le peuple combattit les Égyptiens', 'Le peuple immigra'],
        correct: 1,
        explication: 'Le Samiri fabriqua un veau d\'or et le peuple se mit à l\'adorer en l\'absence de Musa.',
      },
      {
        question: 'Que fit Musa, sous le coup de la colère, en retrouvant Harun au retour du Sinaï ?',
        options: ['Il le chassa du camp', 'Il saisit sa barbe et sa tête', 'Il refusa de lui parler', 'Il le désigna comme seul coupable'],
        correct: 1,
        explication: 'Musa saisit la barbe et la tête de son frère sous le coup de la colère, avant que Harun ne s\'explique (Coran 20:94).',
      },
      {
        question: 'Quelle qualité de Harun le Coran cite-t-il explicitement comme raison de son choix par Musa ?',
        options: ['Sa force physique', 'Son éloquence', 'Sa richesse', 'Son âge'],
        correct: 1,
        explication: 'Musa dit à Allah : "Il est plus éloquent que moi dans le discours" (Coran 28:34).',
      },
    ],
  },
  {
    id: 'dhul-kifl',
    nom: "Dhul-Kifl",
    arabe: 'ذُو الْكِفْل',
    surnom: 'L\'Homme de l\'engagement',
    periode: 'Environ 1300 av. J.-C.',
    resume: 'Dhul-Kifl est cité deux fois dans le Coran parmi les patients et les vertueux. Son nom signifie "Celui de la double récompense" ou "l\'Homme de l\'engagement". Il est reconnu pour sa fidélité à ses promesses.',
    histoire: [
      'Le Coran mentionne Dhul-Kifl aux côtés d\'Ismaïl et d\'Idris, parmi les hommes de patience et de vertu. Son identité exacte est débattue entre les exégètes — certains l\'identifient à Ezéchiel, d\'autres à un prophète distinct.',
      'Selon des narrations, Dhul-Kifl prit l\'engagement de prier cent fois par jour, de jeûner continuellement et de ne jamais se mettre en colère en jugeant entre les hommes. Il tint ses engagements jusqu\'à la fin de sa vie, ce qui lui valut le nom "Dhul-Kifl" — "Celui qui s\'engagea" ou "Celui de la double récompense".',
      'Certains commentateurs, comme At-Tabari, rapportent qu\'un prophète vieillissant chercha un homme capable de tenir ces engagements exigeants avant de lui confier la charge de juge de son peuple, et que Dhul-Kifl fut le seul à accepter et à les tenir sans faillir. Sa constance lui valut cette place parmi les hommes cités comme modèles de patience, aux côtés d\'Ismaïl et d\'Idris.',
    ],
    traits: [
      { label: 'Fidélité aux engagements', emoji: '🤝' },
      { label: 'Patience', emoji: '⏳' },
      { label: 'Justice', emoji: '⚖️' },
      { label: 'Constance', emoji: '🌿' },
    ],
    morale: 'Tenir ses promesses envers Allah et envers les hommes est une forme d\'adoration. L\'engagement sincère et tenu vaut une double récompense.',
    versetCle: {
      ref: 'Coran 21:85',
      texte: 'Et Ismaïl, Idris et Dhul-Kifl — tous étaient parmi les patients.',
    },
    quiz: [
      {
        question: 'Que signifie le nom "Dhul-Kifl" ?',
        options: ['Celui du feu', 'Celui de l\'engagement ou de la double récompense', 'Celui du voyage', 'Celui du savoir'],
        correct: 1,
        explication: 'Dhul-Kifl signifie "Celui de l\'engagement" ou "Celui de la double récompense" selon les interprétations.',
      },
      {
        question: 'Avec quels autres prophètes Dhul-Kifl est-il mentionné dans le Coran (21:85) ?',
        options: ['Ibrahim et Musa', 'Ismaïl et Idris', 'Nuh et Hud', 'Dawud et Sulayman'],
        correct: 1,
        explication: 'Le verset 21:85 cite Ismaïl, Idris et Dhul-Kifl ensemble parmi les patients.',
      },
      {
        question: 'Quel engagement Dhul-Kifl aurait-il pris, selon les narrations ?',
        options: ['Ne jamais dormir', 'Prier cent fois par jour et ne jamais céder à la colère en jugeant', 'Jeûner uniquement le vendredi', 'Ne jamais parler'],
        correct: 1,
        explication: 'Selon des récits, Dhul-Kifl s\'engagea à prier cent fois par jour, à jeûner continuellement et à ne jamais céder à la colère en tant que juge.',
      },
      {
        question: 'Dans quel autre verset le Coran mentionne-t-il Dhul-Kifl parmi les meilleurs serviteurs ?',
        options: ['Coran 2:255', 'Coran 38:48', 'Coran 5:3', 'Coran 12:1'],
        correct: 1,
        explication: 'Coran 38:48 cite Ismaïl, Al-Yasa\' et Dhul-Kifl ensemble parmi les meilleurs (Akhyar).',
      },
    ],
  },
  {
    id: 'dawud',
    nom: 'Dawud',
    arabe: 'دَاوُد',
    surnom: 'Roi-Prophète',
    periode: 'Environ 1000 av. J.-C.',
    resume: 'Dawud était un jeune berger qui tua le géant Jalut (Goliath) avec une fronde. Devenu roi d\'Israël, il reçut les Psaumes (Zabur) et pouvait ramollir le fer de ses mains. Les oiseaux et les montagnes glorifiaient Allah avec lui.',
    histoire: [
      'Dawud était un jeune homme dans l\'armée israélite face à l\'armée de Jalut (Goliath). L\'armée d\'Israël était terrifiée. Dawud, simple berger, s\'avança avec sa fronde et une pierre, invoquant Allah. La pierre atteignit Jalut et le tua. Cette victoire inattendue lui valut la gloire et finalement la royauté.',
      'Allah lui accorda des dons extraordinaires : les oiseaux et les montagnes glorifiaient Allah avec lui, et sa voix était d\'une beauté surnaturelle pour la récitation du Zabur (les Psaumes), le livre saint qui lui fut révélé. Allah ramollit pour lui le fer sans feu — il fabriquait des cottes de mailles avec ses propres mains et vivait de son travail, refusant de vivre aux dépens de ses sujets.',
      'Dawud était aussi un juge remarquable. Le Coran rappelle un épisode où deux hommes se disputèrent devant lui — une allusion à une épreuve qu\'il traversa. Il se repentit profondément et Allah le pardonna : "Nous lui avons pardonné et il a, auprès de Nous, une haute considération et une belle demeure."',
    ],
    traits: [
      { label: 'Courage', emoji: '🦁' },
      { label: 'Gratitude', emoji: '🤲' },
      { label: 'Travail de ses mains', emoji: '⚒️' },
      { label: 'Justice', emoji: '⚖️' },
      { label: 'Repentir', emoji: '🌿' },
    ],
    morale: 'La gloire ne vient pas de la taille ou de la force, mais de la foi. Dawud, berger à la fronde, abattit le géant le plus redouté — parce qu\'Allah était de son côté.',
    versetCle: {
      ref: 'Coran 38:17',
      texte: 'Souviens-toi de Notre serviteur Dawud, l\'homme de la force — il était souvent repentant.',
    },
    quiz: [
      {
        question: 'Quel géant Dawud tua-t-il étant jeune ?',
        options: ['Namrud', 'Abraha', 'Jalut (Goliath)', 'Pharaon'],
        correct: 2,
        explication: 'Dawud tua Jalut (Goliath) avec une fronde et une pierre (Coran 2:251).',
      },
      {
        question: 'Quel livre saint fut révélé à Dawud ?',
        options: ['La Torah', 'L\'Injil', 'Le Zabur (Psaumes)', 'Le Coran'],
        correct: 2,
        explication: 'Allah révéla à Dawud le Zabur (les Psaumes) (Coran 4:163).',
      },
      {
        question: 'Quel don matériel Allah accorda-t-Il à Dawud ?',
        options: ['L\'or coulait sous ses pieds', 'Il pouvait ramollir le fer de ses mains', 'La pluie venait à son appel', 'Les animaux lui obéissaient'],
        correct: 1,
        explication: 'Allah ramollit le fer pour Dawud qui fabriquait des cottes de mailles (Coran 34:10).',
      },
      {
        question: 'Quel métier Dawud exerçait-il de ses propres mains malgré sa royauté ?',
        options: ['Menuisier', 'Fabricant de cottes de mailles', 'Potier', 'Tisserand'],
        correct: 1,
        explication: 'Allah ramollit le fer pour Dawud, qui fabriquait des cottes de mailles et refusait de vivre aux dépens de ses sujets (Coran 34:10-11).',
      },
    ],
  },
  {
    id: 'sulayman',
    nom: 'Sulayman',
    arabe: 'سُلَيْمَان',
    surnom: 'Roi des rois',
    periode: 'Environ 950 av. J.-C.',
    resume: 'Sulayman, fils de Dawud, fut le roi le plus puissant de l\'histoire. Il comprenait le langage des animaux, commandait les djinns et le vent, et reçut la reine de Saba en convertissant son royaume à l\'islam.',
    histoire: [
      'Sulayman hérita de la royauté et de la prophétie de son père Dawud. Allah lui accorda un règne sans précédent : les djinns, les humains et les oiseaux lui étaient soumis. Le vent lui obéissait — un mois pour aller, un mois pour revenir. Il pouvait comprendre le langage des animaux et des insectes : une fourmi prévint ses congénères quand l\'armée de Sulayman s\'approchait.',
      'La reine de Saba (Bilqis), régnant sur le Yémen, lui envoya des cadeaux en signe de neutralité. Sulayman refusa : "Ce qu\'Allah m\'a donné est meilleur que ce que vous m\'avez offert." Il invita Bilqis à venir le rencontrer. Un djinn apporta son trône à Jérusalem avant qu\'elle ne puisse "cligner de l\'œil". La reine, face à ce prodige, embrassa l\'islam.',
      'Sulayman ne fut jamais enivré par son pouvoir. Il dit constamment : "C\'est la faveur de mon Seigneur pour m\'éprouver — serai-je reconnaissant ou ingrat ?" Sa mort arriva alors qu\'il était appuyé sur son bâton, surveillant les djinns au travail. Les djinns ne surent qu\'il était mort que quand les termites rongèrent son bâton et qu\'il s\'effondra.',
    ],
    traits: [
      { label: 'Gratitude', emoji: '🤲' },
      { label: 'Sagesse', emoji: '🧠' },
      { label: 'Gouvernance', emoji: '👑' },
      { label: 'Humilité malgré le pouvoir', emoji: '🌿' },
    ],
    morale: 'Le vrai roi remercie Allah pour son pouvoir au lieu de s\'en enorgueillir. Sulayman, maître des djinns et du vent, resta humble et toujours reconnaissant.',
    versetCle: {
      ref: 'Coran 27:40',
      texte: 'Ceci est de la faveur de mon Seigneur, pour m\'éprouver — serai-je reconnaissant ou ingrat ?',
    },
    quiz: [
      {
        question: 'Quel être apporta le trône de la reine de Saba à Sulayman ?',
        options: ['Un ange', 'Un djinn', 'Un homme savant', 'Un oiseau'],
        correct: 1,
        explication: 'Un ifrit (djinn puissant) proposa d\'apporter le trône avant que Sulayman se lève de sa place (Coran 27:39).',
      },
      {
        question: 'Que comprenait Sulayman que les autres rois ne comprenaient pas ?',
        options: ['Les langues de tous les pays', 'Le langage des oiseaux et des animaux', 'Les secrets du cosmos', 'Les livres anciens'],
        correct: 1,
        explication: 'Allah dit à Sulayman : "Ô hommes, on nous a enseigné le langage des oiseaux" (Coran 27:16).',
      },
      {
        question: 'Comment les djinns apprirent-ils la mort de Sulayman ?',
        options: ['Un ange le leur annonça', 'Les termites rongèrent son bâton et il s\'effondra', 'Ils l\'entendirent par sa femme', 'Un oiseau le leur dit'],
        correct: 1,
        explication: 'Les termites rongèrent le bâton de Sulayman — quand il s\'effondra, les djinns surent qu\'il était mort (Coran 34:14).',
      },
      {
        question: 'Quel royaume la reine Bilqis dirigeait-elle avant sa conversion ?',
        options: ['L\'Égypte', 'Saba, l\'actuel Yémen', 'Babylone', 'La Perse'],
        correct: 1,
        explication: 'Bilqis régnait sur le royaume de Saba, dans l\'actuel Yémen, avant de reconnaître la vérité du message de Sulayman (Coran 27:22-44).',
      },
    ],
  },
  {
    id: 'ilyas',
    nom: 'Ilyas',
    arabe: 'إِلْيَاس',
    surnom: 'Prophète de Ba\'labakk',
    periode: 'Environ 850 av. J.-C.',
    resume: 'Ilyas fut envoyé aux Bani Israël qui adoraient l\'idole Ba\'l. Il les affronta seul, fut chassé par son peuple, et Allah le salua jusqu\'au Jour dernier. Son nom signifie "Mon Dieu est Seigneur".',
    histoire: [
      'Ilyas fut envoyé aux habitants de Ba\'labakk (Liban actuel) et aux Bani Israël qui adoraient une idole nommée Ba\'l et avaient délaissé Allah. Il leur dit : "Adorez-vous Ba\'l et abandonnez-vous le meilleur des créateurs — Allah, votre Seigneur et le Seigneur de vos ancêtres ?"',
      'Son peuple le rejeta. Seule une petite poignée crut avec lui. Dans une épreuve semblable à celle d\'Ayyub, Ilyas se retrouva seul contre toute une nation. Il demeura ferme dans sa mission sans jamais fléchir. Allah le salua par les générations : "Paix sur Ilyas dans l\'univers entier !"',
      'Certains récits, non confirmés explicitement par le Coran, rapprochent le destin d\'Ilyas de celui d\'Al-Khidr, évoquant une vie prolongée hors du cours ordinaire de la mort. Ces traditions témoignent en tout cas de la place particulière qu\'occupe Ilyas dans l\'imaginaire prophétique, comme symbole de la fermeté solitaire face à l\'égarement collectif.',
    ],
    traits: [
      { label: 'Fermeté solitaire', emoji: '🏔️' },
      { label: 'Courage', emoji: '🦁' },
      { label: 'Dévouement à Allah', emoji: '🌟' },
    ],
    morale: 'Se tenir seul contre une société idolâtre est la forme la plus haute du courage. La solitude dans la vérité vaut mieux que la foule dans l\'erreur.',
    versetCle: {
      ref: 'Coran 37:123',
      texte: 'Certes Ilyas est l\'un des envoyés.',
    },
    quiz: [
      {
        question: 'Quelle idole adorait le peuple d\'Ilyas ?',
        options: ['Hubal', 'Ba\'l', 'Al-Lat', 'Al-Uzza'],
        correct: 1,
        explication: 'Le peuple adorait l\'idole Ba\'l que le Coran mentionne explicitement (37:125).',
      },
      {
        question: 'Quel vœu divin accompagne la mention d\'Ilyas dans le Coran ?',
        options: ['Miséricorde sur Ilyas', 'Paix sur Ilyas dans l\'univers entier', 'Bénédiction sur Ilyas et sa famille', 'Grâce sur Ilyas'],
        correct: 1,
        explication: 'Coran 37:130 : "Paix sur Il-Yasin (Ilyas) dans l\'univers entier."',
      },
      {
        question: 'Dans quelle région Ilyas exerça-t-il sa mission prophétique ?',
        options: ['L\'Égypte', 'Ba\'labakk, dans l\'actuel Liban', 'La Perse', 'Le Yémen'],
        correct: 1,
        explication: 'Ilyas fut envoyé aux habitants de Ba\'labakk, dans l\'actuel Liban, et aux Bani Israël environnants.',
      },
      {
        question: 'À quel autre prophète l\'épreuve d\'Ilyas — seul contre toute une nation — est-elle comparée dans son récit ?',
        options: ['Yusuf', 'Ayyub', 'Musa', 'Sulayman'],
        correct: 1,
        explication: 'Comme Ayyub, qui endura seul une épreuve extrême, Ilyas se retrouva seul face au rejet de tout un peuple, sans jamais fléchir.',
      },
    ],
  },
  {
    id: 'al-yasa',
    nom: "Al-Yasa'",
    arabe: 'الْيَسَع',
    surnom: 'Successeur d\'Ilyas',
    periode: 'Environ 850 av. J.-C.',
    resume: "Al-Yasa' est le successeur et disciple d'Ilyas. Le Coran le cite deux fois parmi les vertueux. Il continua la mission prophétique aux Bani Israël après Ilyas.",
    histoire: [
      "Al-Yasa' fut le disciple et successeur d'Ilyas. Après le départ d'Ilyas, Al-Yasa' porta la prophétie aux Bani Israël, continuant à les appeler au culte exclusif d'Allah.",
      "Le Coran le mentionne deux fois (6:86 et 38:48) parmi les prophètes qu'Allah a guidés et préférés sur les mondes. Bien que son histoire soit peu développée dans le Coran, sa mention dans cette liste illustre qu'il fit partie des meilleurs serviteurs d'Allah.",
      "Peu de détails narratifs sont rapportés sur la vie d'Al-Yasa' dans les sources islamiques, contrairement à d'autres prophètes dont le Coran développe longuement l'histoire. Cette sobriété n'enlève rien à sa valeur : le Coran le classe explicitement, aux côtés d'Ismaïl et de Dhul-Kifl, parmi les Akhyar — les meilleurs des hommes — un rappel que la reconnaissance d'Allah ne dépend pas de la place qu'on occupe dans le récit, mais de la sincérité du service rendu.",
    ],
    traits: [
      { label: 'Continuité', emoji: '🌿' },
      { label: 'Fidélité à la mission', emoji: '✅' },
      { label: 'Service', emoji: '🤝' },
    ],
    morale: 'Continuer l\'œuvre d\'un homme vertueux est une noblesse. Chaque génération a la responsabilité de transmettre le flambeau de la foi.',
    versetCle: {
      ref: 'Coran 38:48',
      texte: "Et rappelle-toi Ismaïl, Al-Yasa' et Dhul-Kifl — tous étaient parmi les meilleurs.",
    },
    quiz: [
      {
        question: "Al-Yasa' est le successeur de quel prophète ?",
        options: ['Musa', 'Dawud', 'Ilyas', 'Ibrahim'],
        correct: 2,
        explication: "Al-Yasa' est traditionnellement considéré comme le disciple et successeur d'Ilyas dans sa mission.",
      },
      {
        question: "Combien de fois le Coran mentionne-t-il Al-Yasa' ?",
        options: ['Une fois', 'Deux fois', 'Cinq fois', 'Il n\'est jamais cité directement'],
        correct: 1,
        explication: "Al-Yasa' est cité deux fois dans le Coran, en 6:86 et 38:48.",
      },
      {
        question: "Aux côtés de quels prophètes le Coran cite-t-il Al-Yasa' en 38:48 ?",
        options: ['Musa et Harun', 'Ismaïl et Dhul-Kifl', 'Ibrahim et Ishaq', 'Dawud et Sulayman'],
        correct: 1,
        explication: "Coran 38:48 : \"Et rappelle-toi Ismaïl, Al-Yasa' et Dhul-Kifl — tous étaient parmi les meilleurs.\"",
      },
      {
        question: "Quel qualificatif le Coran utilise-t-il pour décrire Al-Yasa' et les prophètes cités à ses côtés ?",
        options: ['Les patients', 'Les meilleurs (Akhyar)', 'Les savants', 'Les rois'],
        correct: 1,
        explication: "Le Coran les décrit comme faisant partie des Akhyar — les meilleurs des serviteurs d'Allah.",
      },
    ],
  },
  {
    id: 'yunus',
    nom: 'Yunus',
    arabe: 'يُونُس',
    surnom: 'Dhul-Nun — l\'Homme du poisson',
    periode: 'Environ 800 av. J.-C.',
    resume: 'Yunus quitta son peuple sans permission divine et fut avalé par un grand poisson. Dans les ténèbres, il fit un du\'a d\'une profondeur unique. Allah le délivra et son peuple tout entier crut.',
    histoire: [
      'Yunus était le prophète de Ninive (Irak actuel). Face au rejet répété de son peuple, il s\'en alla de sa propre initiative, sans attendre l\'ordre d\'Allah. Cette décision — noble dans son intention mais prématurée — attira sur lui une épreuve extraordinaire.',
      'Il monta sur un bateau qui fut pris dans une tempête violente. Le sort désigna Yunus comme celui qu\'il fallait jeter à la mer pour calmer la tempête. Il fut englouti par un grand poisson (hut). Dans les ténèbres superposées — nuit, fond de mer, ventre du poisson — il prononça l\'un des du\'as les plus puissants de l\'histoire : "Il n\'y a de divinité que Toi, gloire à Toi, j\'ai été parmi les injustes."',
      'Allah dit : "Si ce n\'était qu\'il était parmi ceux qui glorifient Allah, il serait resté dans le ventre du poisson jusqu\'au Jour de la Résurrection." Allah le délivra — il fut recraché sur une rive nue, malade. Allah fit pousser au-dessus de lui une plante (yaqtina) pour l\'ombrer. Guéri, il retourna vers son peuple — et toute la ville de cent mille habitants crut.',
    ],
    traits: [
      { label: 'Repentir', emoji: '🌿' },
      { label: 'Du\'a sincère', emoji: '🤲' },
      { label: 'Retour à Allah', emoji: '🌅' },
      { label: 'Glorification d\'Allah', emoji: '⭐' },
    ],
    morale: 'Aucune profondeur n\'est trop sombre pour qu\'Allah ne t\'entende. Le du\'a de Yunus dans le ventre du poisson nous apprend qu\'il n\'y a pas de situation sans issue quand on revient à Allah.',
    versetCle: {
      ref: 'Coran 21:87',
      texte: 'Il n\'y a de divinité que Toi ! Gloire à Toi ! Vraiment j\'ai été parmi les injustes.',
    },
    quiz: [
      {
        question: 'Pourquoi Yunus fut-il jeté à la mer ?',
        options: ['Il voulait traverser la mer', 'Le sort le désigna lors d\'une tempête sur le bateau', 'Il sauta volontairement', 'Il fut puni par son peuple'],
        correct: 1,
        explication: 'Lors d\'une tempête, l\'équipage tira au sort pour alléger le bateau et le sort tomba sur Yunus (Coran 37:141).',
      },
      {
        question: 'Quel est le du\'a de Yunus dans le ventre du poisson ?',
        options: [
          '"Seigneur, délivre-moi de cette épreuve"',
          '"Il n\'y a de divinité que Toi, gloire à Toi, j\'ai été parmi les injustes"',
          '"Le mal m\'a touché et Tu es le plus Miséricordieux"',
          '"Je me plains de ma tristesse à Allah"',
        ],
        correct: 1,
        explication: 'Le du\'a de Yunus (Coran 21:87) est l\'un des plus puissants : "La ilaha illa Anta subhanaka inni kuntu min adh-dhalimin."',
      },
      {
        question: 'Que fit le peuple de Yunus quand il revint vers eux ?',
        options: ['Ils le rejetèrent à nouveau', 'La moitié crut', 'Toute la ville crut', 'Ils l\'arrêtèrent'],
        correct: 2,
        explication: 'Yunus fut envoyé vers cent mille personnes ou plus, et ils crurent tous — fait unique dans l\'histoire prophétique (Coran 37:147-148).',
      },
      {
        question: 'Quelle plante Allah fit-Il pousser pour ombrer Yunus après sa délivrance ?',
        options: ['Un palmier', 'Une vigne', 'Un yaqtin (courge)', 'Un olivier'],
        correct: 2,
        explication: 'Allah fit pousser au-dessus de lui une plante de yaqtin pour l\'ombrer après qu\'il eut été recraché sur le rivage (Coran 37:146).',
      },
    ],
  },
  {
    id: 'zakariya',
    nom: 'Zakariya',
    arabe: 'زَكَرِيَّا',
    surnom: 'Gardien de Maryam',
    periode: 'Environ 1er siècle av. J.-C.',
    resume: 'Zakariya était le tuteur de la Vierge Maryam et un vieux prêtre du Temple. Vieux et sans enfant, il pria Allah pour un héritier qui perpétuerait la prophétie. Allah lui accorda Yahya comme un miracle.',
    histoire: [
      'Zakariya était un prêtre du Temple de Jérusalem et tuteur de Maryam bint Imran. Chaque fois qu\'il entrait chez elle dans son mihrab (oratoire), il trouvait des provisions. Il dit : "Ô Maryam, d\'où te vient cela ?" Elle répondit : "Cela vient d\'Allah — Allah pourvoit à qui Il veut sans compter." Ce spectacle de la grâce divine embrasa la foi de Zakariya.',
      'Zakariya était âgé, sa femme stérile depuis toujours. Mais inspiré par la grâce accordée à Maryam, il supplia Allah : "Seigneur, donne-moi une descendance bénie de Ta part — Tu es Celui qui entend les invocations." Allah l\'exauça avec Yahya — un nom qu\'aucun homme avant lui ne portait.',
      'Allah lui donna un signe : il serait muet pendant trois jours bien qu\'en bonne santé. Ce signe de gratitude et de contemplation marqua les trois jours précédant la naissance de Yahya.',
    ],
    traits: [
      { label: 'Espoir en Allah', emoji: '🌅' },
      { label: 'Du\'a sincère', emoji: '🤲' },
      { label: 'Gratitude', emoji: '🙏' },
      { label: 'Foi dans l\'impossible', emoji: '⭐' },
    ],
    morale: 'Il n\'y a pas d\'âge pour demander à Allah. Zakariya pria pour un fils à un âge où la biologie semblait dire non — et Allah dit oui.',
    versetCle: {
      ref: 'Coran 19:4-5',
      texte: 'Il dit : "Seigneur, mes os sont devenus faibles et ma tête flamboie de cheveux blancs. Mais je n\'ai jamais été malheureux dans mes invocations vers Toi."',
    },
    quiz: [
      {
        question: 'Qui Zakariya avait-il sous sa tutelle ?',
        options: ['Isa', 'Maryam', 'Yahya', 'Bilqis'],
        correct: 1,
        explication: 'Zakariya était le tuteur de Maryam bint Imran dans le Temple (Coran 3:37).',
      },
      {
        question: 'Quel signe Allah donna-t-Il à Zakariya après son du\'a ?',
        options: ['Il vit un ange', 'Il fut muet pendant trois jours', 'Une lumière illumina sa maison', 'Les oiseaux chantèrent'],
        correct: 1,
        explication: 'Allah lui donna comme signe qu\'il serait muet pendant trois jours bien que sain (Coran 19:10).',
      },
      {
        question: 'Que trouva Zakariya chez Maryam chaque fois qu\'il lui rendait visite ?',
        options: ['Des livres saints', 'Des provisions venant d\'Allah', 'Des anges en prière', 'Des fleurs du paradis'],
        correct: 1,
        explication: 'Zakariya trouvait toujours chez Maryam des provisions hors saison venant d\'Allah (Coran 3:37).',
      },
      {
        question: 'Dans quelle situation se trouvait Zakariya quand il demanda un fils à Allah ?',
        options: ['Il était jeune et en bonne santé', 'Il était âgé, avec les os affaiblis et les cheveux blancs', 'Il avait 30 ans', 'Son âge n\'est pas mentionné'],
        correct: 1,
        explication: 'Zakariya dit : "Mes os sont devenus faibles et ma tête flamboie de cheveux blancs" (Coran 19:4).',
      },
    ],
  },
  {
    id: 'yahya',
    nom: 'Yahya',
    arabe: 'يَحْيَى',
    surnom: 'Jean le Baptiste',
    periode: 'Environ 1er siècle av. J.-C.',
    resume: 'Yahya est le fils de Zakariya, né d\'un miracle. Il fut le premier à porter ce nom. Prophète de pureté et de compassion, il confirma la prophétie d\'Isa. Allah lui accorda le Hukm (la sagesse) dès l\'enfance.',
    histoire: [
      'Yahya naquit du miracle accordé à Zakariya et à son épouse stérile. Allah l\'honora de trois façons uniques dans le Coran : Il lui donna un prénom que personne avant lui n\'avait porté, il lui accorda le Hukm (la sagesse du jugement) dès l\'enfance, et Allah lui dit : "Prends le Livre fermement" — signifiant la Torah.',
      'Yahya était décrit comme pur, plein de compassion pour ses parents, craignant Allah, aimant la paix. Il vivait avec ascétisme et simplicité, se nourrissant de ce que la nature offrait, se vêtant modestement. Il confirmea la venue d\'Isa avant lui et l\'en informa.',
      'Yahya fut martyrisé par un roi tyrannique qui céda à l\'influence d\'une femme immorale. Sa tête fut présentée comme cadeau. Allah lui accorda la paix dans les trois moments les plus redoutés de l\'homme : sa naissance, sa mort et le jour de sa résurrection.',
    ],
    traits: [
      { label: 'Pureté', emoji: '🌸' },
      { label: 'Compassion', emoji: '❤️' },
      { label: 'Sagesse dès l\'enfance', emoji: '🧠' },
      { label: 'Ascétisme', emoji: '🌿' },
    ],
    morale: 'La pureté du cœur est la plus grande richesse. Yahya vécut sans luxe, sans compromis — et Allah lui accorda la paix dans les trois moments les plus difficiles de l\'existence.',
    versetCle: {
      ref: 'Coran 19:12-13',
      texte: 'Ô Yahya, prends le Livre fermement ! Et Nous lui avons accordé la sagesse quand il était encore enfant, ainsi que la tendresse de Notre part et la pureté.',
    },
    quiz: [
      {
        question: 'Quel don unique Allah accorda-t-Il à Yahya dès son enfance ?',
        options: ['La force physique', 'La sagesse du jugement (Hukm)', 'La connaissance des langues', 'La capacité de faire des miracles'],
        correct: 1,
        explication: 'Allah accorda à Yahya le Hukm (la sagesse du jugement) dès l\'enfance (Coran 19:12).',
      },
      {
        question: 'Quel est l\'honneur unique du nom de Yahya mentionné dans le Coran ?',
        options: ['C\'est un nom coranique', 'C\'est le plus beau prénom', 'Personne ne l\'avait porté avant lui', 'C\'est le nom d\'un ange'],
        correct: 2,
        explication: 'Allah dit à Zakariya : "Nous lui avons donné le nom de Yahya — Nous n\'avons donné ce nom à personne avant lui" (Coran 19:7).',
      },
      {
        question: 'Comment Yahya vivait-il, selon la description coranique et les récits ?',
        options: ['Dans le luxe du palais', 'Avec ascétisme et simplicité', 'En tant que guerrier', 'En reclus, sans jamais parler aux gens'],
        correct: 1,
        explication: 'Yahya vivait avec ascétisme, se nourrissant simplement et craignant Allah, loin du luxe.',
      },
      {
        question: 'En quels moments Allah accorda-t-Il la paix à Yahya, selon le Coran ?',
        options: ['Uniquement à sa mort', 'Sa naissance, sa mort et le jour de sa résurrection', 'Uniquement à sa naissance', 'Chaque vendredi'],
        correct: 1,
        explication: 'Coran 19:15 : "Paix sur lui le jour où il naquit, le jour où il mourra, et le jour où il sera ressuscité vivant."',
      },
    ],
  },
  {
    id: 'isa',
    nom: 'Isa',
    arabe: 'عِيسَى',
    surnom: 'Ruhullah — Esprit d\'Allah / Al-Masih',
    periode: 'Environ 1er siècle',
    resume: 'Isa naquit sans père d\'une mère vierge, Maryam. Il parla dès le berceau pour défendre sa mère. Prophète de miséricorde, il guérit les aveugles, ressuscita des morts et annonça la venue de Muhammad ﷺ.',
    histoire: [
      'Maryam reçut la visite de l\'ange Jibril qui lui annonça qu\'elle enfanterait un fils sans qu\'un homme l\'ait touchée. Elle dit : "Comment aurais-je un fils alors qu\'aucun homme ne m\'a touchée ?" L\'ange répondit : "C\'est ainsi — Allah crée ce qu\'Il veut. Quand Il décide une chose, Il dit seulement : \'Sois !\' et elle est." Maryam se retira seule et accoucha d\'Isa. Le Coran lui attribua deux titres uniques : Al-Masih (l\'Oint) et Ruhullah (l\'Esprit d\'Allah).',
      'De retour chez son peuple avec le bébé, on l\'accusa. Elle pointa vers Isa. Isa parla depuis son berceau : "Je suis le serviteur d\'Allah. Il m\'a donné le Livre et fait de moi un prophète. Il m\'a fait béni où que je sois, m\'a enjoint la prière et la zakat tant que je vivrai." Cette parole fut sa première déclaration de prophétie.',
      'Isa accomplit des miracles par la permission d\'Allah : il guérissait les aveugles de naissance et les lépreux, ressuscitait les morts, et façonnait des oiseaux d\'argile qui prenaient vie. Il révéla également ce que les gens cachaient et mangeaient chez eux. Il annonça explicitement la venue d\'un prophète après lui nommé Ahmad (Muhammad ﷺ).',
      'Les Bani Israël complotèrent contre lui. Mais Allah le sauva : "Ils ne l\'ont ni tué ni crucifié — il en fut fait un semblant. Allah l\'éleva vers Lui." Isa reviendra à la fin des temps, descendra à Damas, brisera les croix, tuera le Dajjal et mourra une mort naturelle — la plus belle fin annoncée pour un prophète.',
    ],
    traits: [
      { label: 'Miséricorde', emoji: '❤️' },
      { label: 'Guérison', emoji: '🌿' },
      { label: 'Monothéisme pur', emoji: '⭐' },
      { label: 'Humilité', emoji: '🌱' },
      { label: 'Ascétisme', emoji: '🕊️' },
    ],
    morale: 'Isa prêcha toute sa vie que l\'adoration ne revient qu\'à Allah seul — "Adorez Allah, mon Seigneur et votre Seigneur" (Coran 5:117). Son message était celui de tous les prophètes : le Tawhid.',
    versetCle: {
      ref: 'Coran 3:45',
      texte: 'Ô Maryam, Allah t\'annonce une parole venant de Lui, dont le nom est : Al-Masih, Isa fils de Maryam, illustre en ce monde et dans l\'au-delà.',
    },
    quiz: [
      {
        question: 'Quel est l\'un des titres d\'Isa dans le Coran ?',
        options: ['Khalilullah', 'Kalimullah', 'Ruhullah', 'Habibullah'],
        correct: 2,
        explication: 'Isa est appelé "Ruhullah" (Esprit d\'Allah) et "Kalimah minhu" (Parole venant de Lui) dans le Coran (4:171).',
      },
      {
        question: 'Que fit Isa dès son berceau ?',
        options: ['Il fit un miracle', 'Il parla pour défendre sa mère', 'Il récita la Torah', 'Il guérit un malade'],
        correct: 1,
        explication: 'Isa parla depuis son berceau pour défendre l\'honneur de sa mère Maryam (Coran 19:30-33).',
      },
      {
        question: 'Quel prophète Isa annonça-t-il explicitement dans le Coran ?',
        options: ['Yahya', 'Musa', 'Muhammad ﷺ', 'Ibrahim'],
        correct: 2,
        explication: 'Isa annonça la venue d\'un messager après lui nommé Ahmad (Muhammad ﷺ) (Coran 61:6).',
      },
      {
        question: 'Selon le Coran, qu\'arriva-t-il à Isa en réalité ?',
        options: ['Il fut crucifié puis ressuscité', 'Il mourut de vieillesse', 'Allah l\'éleva vers Lui sans qu\'il soit tué', 'Il disparut dans le désert'],
        correct: 2,
        explication: 'Le Coran (4:157-158) affirme qu\'Isa ne fut ni tué ni crucifié et qu\'Allah l\'éleva vers Lui.',
      },
    ],
  },
  {
    id: 'muhammad',
    nom: 'Muhammad',
    arabe: 'مُحَمَّد',
    surnom: 'Sceau des Prophètes ﷺ',
    periode: '570 — 632 ap. J.-C.',
    resume: 'Muhammad ﷺ est le dernier et le sceau des prophètes, envoyé comme miséricorde pour les mondes. En 23 ans, il transforma une société tribale en une civilisation fondée sur le Tawhid, la justice et la miséricorde.',
    histoire: [
      'Muhammad ﷺ naquit orphelin de père à La Mecque en 570. Il perdit sa mère à 6 ans, son grand-père à 8 ans. Connu parmi son peuple sous le titre d\'Al-Amin (le Trustworthy), il épousa Khadijah à 25 ans. À 40 ans, dans la grotte de Hira, il reçut la première révélation : "Lis au nom de ton Seigneur qui a créé." La mission prophétique avait commencé.',
      'Pendant 23 ans, il reçut le Coran et transforma La Mecque puis l\'Arabie entière. Il endura les persécutions, l\'exil de ses proches, la mort de ses enfants, le boycott économique, la lapidation à Taïf — et ne cessa jamais de pardonner et de sourire. Lors de la conquête de La Mecque, il amnistia ses pires ennemis.',
      'Son caractère était la mise en pratique du Coran. Sa femme Aïsha dit : "Son caractère était le Coran." Il était le plus généreux, le plus courageux, le plus souriant. Il réparait lui-même ses sandales, s\'occupait de ses tâches ménagères et traitait les pauvres comme les rois. Il quitta ce monde en 632 sans laisser aucune richesse matérielle.',
    ],
    traits: [
      { label: 'Miséricorde pour les mondes', emoji: '❤️' },
      { label: 'Pardon', emoji: '🕊️' },
      { label: 'Honnêteté', emoji: '✅' },
      { label: 'Générosité', emoji: '🤲' },
      { label: 'Patience', emoji: '⏳' },
    ],
    morale: 'Le caractère du Prophète ﷺ est la preuve vivante que l\'islam est une miséricorde. Pour comprendre le Coran dans la pratique, regarde sa vie.',
    versetCle: {
      ref: 'Coran 21:107',
      texte: 'Nous ne t\'avons envoyé qu\'en miséricorde pour les mondes.',
    },
    quiz: [
      {
        question: 'Quel surnom les Mecquois donnaient-ils au Prophète ﷺ avant la révélation ?',
        options: ['Al-Hafiz', 'Al-Amin (le Trustworthy)', 'Al-Aziz', 'Al-Karim'],
        correct: 1,
        explication: 'Les Mecquois l\'appelaient Al-Amin (le Trustworthy) pour sa réputation d\'honnêteté.',
      },
      {
        question: 'Quel âge avait Muhammad ﷺ quand il reçut la première révélation ?',
        options: ['25 ans', '30 ans', '40 ans', '50 ans'],
        correct: 2,
        explication: 'Muhammad ﷺ reçut la première révélation à 40 ans dans la grotte de Hira.',
      },
      {
        question: 'Comment s\'appelait la première épouse du Prophète ﷺ ?',
        options: ['Aïsha', 'Hajar', 'Khadijah', 'Fatima'],
        correct: 2,
        explication: 'Khadijah bint Khuwaylid fut la première épouse et la première personne à croire en la mission du Prophète ﷺ.',
      },
      {
        question: 'Que fit le Prophète ﷺ lors de la conquête de La Mecque envers ses ennemis ?',
        options: ['Il les fit emprisonner', 'Il les amnistia et pardonna', 'Il les bannit d\'Arabie', 'Il les soumit par la force'],
        correct: 1,
        explication: 'Lors de la conquête de La Mecque, le Prophète ﷺ dit à ses anciens tortionnaires : "Allez, vous êtes libres."',
      },
    ],
  },
];

// Quiz général — questions transversales sur l'ensemble des 25 prophètes :
// chronologie, liens de parenté, Livres révélés, titres honorifiques...
export const quizGeneral: QuizQuestion[] = [
  {
    question: 'Combien de prophètes sont cités nommément dans le Coran ?',
    options: ['19', '25', '30', '33'],
    correct: 1,
    explication: 'Le Coran nomme 25 prophètes, du premier homme Adam jusqu\'au dernier, Muhammad ﷺ.',
  },
  {
    question: 'Qui est le premier prophète et premier homme de l\'humanité ?',
    options: ['Nuh', 'Adam', 'Idris', 'Ibrahim'],
    correct: 1,
    explication: 'Adam est le premier homme et le premier prophète, créé par Allah de Ses propres mains.',
  },
  {
    question: 'Qui est le dernier prophète, "Sceau des Prophètes" ?',
    options: ['Isa', 'Musa', 'Ibrahim', 'Muhammad ﷺ'],
    correct: 3,
    explication: 'Muhammad ﷺ est le dernier et le sceau des prophètes — aucun prophète ne viendra après lui.',
  },
  {
    question: 'Lesquels de ces prophètes forment les "Ulul Azm" (les plus déterminés), cités ensemble en Coran 33:7 ?',
    options: [
      'Adam, Idris, Nuh, Hud, Salih',
      'Nuh, Ibrahim, Musa, Isa et Muhammad ﷺ',
      'Musa, Harun, Dawud, Sulayman, Yunus',
      'Yusuf, Yaqub, Ishaq, Ismaïl, Ibrahim',
    ],
    correct: 1,
    explication: 'Coran 33:7 mentionne l\'alliance prise auprès de Nuh, Ibrahim, Musa, Isa et Muhammad ﷺ — les cinq prophètes "dotés d\'une ferme résolution" (Ulul Azm).',
  },
  {
    question: 'Quel prophète est le père commun d\'Ismaïl et d\'Ishaq ?',
    options: ['Nuh', 'Ibrahim', 'Yaqub', 'Dawud'],
    correct: 1,
    explication: 'Ibrahim est le père d\'Ismaïl (par Hajar) et d\'Ishaq (par Sara), ses deux fils prophètes.',
  },
  {
    question: 'Quel prophète est le fils d\'Ishaq et le père de Yusuf ?',
    options: ['Harun', 'Yaqub', 'Sulayman', 'Zakariya'],
    correct: 1,
    explication: 'Yaqub, aussi appelé Israël, est le fils d\'Ishaq et le père de Yusuf et de onze autres fils.',
  },
  {
    question: 'Quel prophète reçut le Zabur (les Psaumes) ?',
    options: ['Musa', 'Dawud', 'Sulayman', 'Isa'],
    correct: 1,
    explication: 'Allah révéla le Zabur à Dawud (Coran 4:163), qui le récitait d\'une voix si belle que les oiseaux et les montagnes glorifiaient Allah avec lui.',
  },
  {
    question: 'Quel prophète reçut la Torah (Tawrat) sur le mont Sinaï ?',
    options: ['Harun', 'Musa', 'Yusuf', 'Ibrahim'],
    correct: 1,
    explication: 'Musa passa quarante nuits sur le mont Sinaï où Allah lui donna les Tables de la Loi (Coran 7:142).',
  },
  {
    question: 'Quel prophète est le père de Sulayman ?',
    options: ['Dawud', 'Musa', 'Zakariya', 'Ibrahim'],
    correct: 0,
    explication: 'Sulayman hérita de la royauté et de la prophétie de son père Dawud.',
  },
  {
    question: 'Quel prophète est le père de Yahya et le tuteur de Maryam ?',
    options: ['Isa', 'Zakariya', 'Ilyas', 'Yunus'],
    correct: 1,
    explication: 'Zakariya, tuteur de Maryam au Temple, pria Allah pour un héritier et reçut Yahya comme un miracle dans sa vieillesse.',
  },
  {
    question: 'À quels prophètes correspondent respectivement les titres Khalilullah, Kalimullah et Ruhullah ?',
    options: ['Ibrahim, Musa, Isa', 'Musa, Ibrahim, Isa', 'Ibrahim, Isa, Musa', 'Adam, Nuh, Ibrahim'],
    correct: 0,
    explication: 'Ibrahim est Khalilullah (l\'Ami d\'Allah), Musa est Kalimullah (Celui à qui Allah a parlé), et Isa est Ruhullah (l\'Esprit d\'Allah).',
  },
  {
    question: 'Quel prophète prêcha son peuple pendant 950 ans avant le Déluge ?',
    options: ['Hud', 'Nuh', 'Salih', 'Idris'],
    correct: 1,
    explication: 'Le Coran (29:14) précise que Nuh resta parmi son peuple mille ans moins cinquante, soit 950 ans.',
  },
  {
    question: 'Quel prophète fut avalé par un poisson après avoir quitté son peuple sans permission divine ?',
    options: ['Musa', 'Yunus', 'Ayyub', 'Sulayman'],
    correct: 1,
    explication: 'Yunus quitta Ninive sans attendre l\'ordre d\'Allah et fut englouti par un grand poisson après avoir été jeté à la mer.',
  },
  {
    question: 'Parmi ces duos, lequel correspond à un père et son fils, tous deux prophètes ?',
    options: ['Musa et Harun', 'Dawud et Sulayman', 'Ilyas et Al-Yasa\'', 'Ayyub et Yunus'],
    correct: 1,
    explication: 'Dawud est le père de Sulayman. Musa et Harun sont frères, Ilyas et Al-Yasa\' sont maître et disciple, Ayyub et Yunus ne sont pas apparentés.',
  },
  {
    question: 'Lequel de ces prophètes vécut chronologiquement le premier ?',
    options: ['Ibrahim', 'Nuh', 'Musa', 'Isa'],
    correct: 1,
    explication: 'Nuh vécut bien avant Ibrahim, qui vécut lui-même des siècles avant Musa, puis Isa — dans cet ordre chronologique.',
  },
];
