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
  nomBiblique?: string;
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
      {
        question: 'Comment Qabil apprit-il à enterrer le corps de son frère ?',
        options: [
          'Un ange le lui montra',
          'En observant un corbeau creuser la terre',
          'Adam le lui enseigna',
          'Il l\'apprit dans un rêve',
        ],
        correct: 1,
        explication: 'Ne sachant que faire du corps, Qabil observa un corbeau creuser la terre pour en enterrer un autre, et comprit ainsi comment enterrer son frère (Coran 5:31).',
      },
    ],
  },
  {
    id: 'idris',
    nom: 'Idris',
    nomBiblique: 'Hénoch',
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
      {
        question: 'Que signifie le mot "siddiq" utilisé par le Coran pour décrire Idris ?',
        options: ['Savant', 'Véridique, qui ne ment jamais', 'Riche', 'Voyageur'],
        correct: 1,
        explication: 'Coran 19:56 décrit Idris comme "siddiq" — un homme profondément véridique, qui ne mentait jamais et croyait sincèrement en la révélation.',
      },
    ],
  },
  {
    id: 'nuh',
    nom: 'Nuh',
    nomBiblique: 'Noé',
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
      {
        question: 'Quelles étaient les cinq idoles adorées par le peuple de Nuh ?',
        options: [
          'Hubal, Al-Lat, Al-Uzza, Manat, Ba\'l',
          'Wadd, Suwa\', Yaghuth, Ya\'uq, Nasr',
          'Ra, Osiris, Isis, Horus, Seth',
          'Bel, Ishtar, Marduk, Nabu, Sin',
        ],
        correct: 1,
        explication: 'Le peuple de Nuh avait sculpté cinq hommes vertueux — Wadd, Suwa\', Yaghuth, Ya\'uq et Nasr — puis fini par les adorer comme des dieux.',
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
      {
        question: 'Comment s\'appelait la cité légendaire aux hautes colonnes bâtie par le peuple de \'Ad ?',
        options: ['Babylone', 'Iram', 'Ninive', 'Pétra'],
        correct: 1,
        explication: 'Le Coran mentionne Iram, "dont on n\'a jamais créé de pareille dans les pays" (Coran 89:7-8), symbole de la fierté architecturale du peuple de \'Ad.',
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
      {
        question: 'Que complota un groupe de neuf hommes la nuit précédant le châtiment ?',
        options: [
          'Fuir la cité',
          'Tuer Salih et sa famille en secret',
          'Reconstruire un temple',
          'Offrir un sacrifice à Allah',
        ],
        correct: 1,
        explication: 'Neuf hommes complotèrent pour tuer Salih et sa famille la nuit même, en jurant de nier toute implication — mais ils périrent avec le reste du peuple (Coran 27:48-51).',
      },
    ],
  },
  {
    id: 'ibrahim',
    nom: 'Ibrahim',
    nomBiblique: 'Abraham',
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
      {
        question: 'Quel nom le Coran donne-t-il au père (ou tuteur) d\'Ibrahim, qu\'il appela à quitter l\'idolâtrie ?',
        options: ['Tarikh', 'Azar', 'Nahor', 'Haran'],
        correct: 1,
        explication: 'Coran 6:74 : "Ibrahim dit à son père Azar : Prends-tu des idoles pour divinités ?" — la première personne qu\'Ibrahim appela au Tawhid.',
      },
    ],
  },
  {
    id: 'lut',
    nom: 'Lut',
    nomBiblique: 'Loth',
    arabe: 'لُوط',
    surnom: 'Neveu d\'Ibrahim',
    periode: 'Environ 1800 av. J.-C.',
    resume: 'Lut fut envoyé au peuple de Sodome qui pratiquait l\'homosexualité et le brigandage. Il les appela au droit chemin pendant des années. Des anges vinrent le visiter et les villes furent renversées.',
    histoire: [
      {
        etape: 'Le neveu qui crut en Ibrahim',
        texte: 'Lut était le neveu d\'Ibrahim. Il crut en lui dès le début et émigra avec lui loin de leur pays natal. Allah l\'envoya ensuite comme prophète au peuple de Sodome, une ville près de la mer Morte.',
      },
      {
        etape: 'Une immoralité inédite',
        texte: 'Ce peuple commettait un acte qu\'aucune nation avant lui n\'avait osé faire : les hommes recherchaient les hommes au lieu des femmes. Ils attaquaient aussi les voyageurs sur les routes et se conduisaient mal dans leurs assemblées (Coran 29:29). Lut leur dit : "Vous, parmi les mondes, êtes les seuls à commettre pareille chose !" (Coran 7:80)',
      },
      {
        etape: 'L\'appel rejeté',
        texte: 'Lut les appela sans relâche à abandonner ce mal, mais ils répondaient par le rejet et les menaces. Ils allèrent jusqu\'à dire : "Chassez de votre cité la famille de Lut, ce sont des gens qui veulent se garder purs !" (Coran 7:82) — se moquant ainsi de leur propre vertu.',
      },
      {
        etape: 'La visite des anges',
        texte: 'Trois anges, sous l\'apparence de jeunes hommes, vinrent d\'abord annoncer à Ibrahim la naissance d\'un fils, puis se rendirent chez Lut. Inquiet pour leur sécurité, Lut leur dit : "Ô mon peuple, voici mes filles, elles sont plus pures pour vous. Craignez Allah et ne me déshonorez pas devant mes hôtes" (Coran 11:78), espérant détourner la foule de ses invités. Son propre peuple se pressa contre sa porte, et sa femme elle-même, qui ne croyait pas en son message, avait déjà trahi la confiance des invités en prévenant les habitants de leur arrivée.',
      },
      {
        etape: 'Le départ et la destruction',
        texte: 'Voyant la détresse de Lut, les anges se firent connaître et le rassurèrent : ils étaient des messagers d\'Allah, et le peuple ne pourrait jamais les atteindre. Ils lui ordonnèrent : "Pars avec ta famille dans la nuit, et que nul d\'entre vous ne se retourne — sauf ta femme, qui sera atteinte comme les autres" (Coran 11:81). Au matin, Allah renversa les cités sens dessus dessous et fit pleuvoir sur elles des pierres d\'argile cuite (Coran 11:82-83).',
      },
      {
        etape: 'Le soutien puissant',
        texte: 'Submergé par l\'ampleur du mal qui l\'entourait, Lut s\'était un jour exclamé : "Si seulement j\'avais la force de vous résister, ou un appui solide auprès de qui me réfugier !" (Coran 11:80) Des siècles plus tard, le Prophète ﷺ répondit à cette plainte : "Qu\'Allah fasse miséricorde à Lut : il s\'appuyait pourtant sur un soutien bien plus puissant" (Sahih al-Bukhari, n°3387) — Allah Lui-même. Ce soutien, Lut l\'a eu sans le savoir : lui et sa famille croyante furent sauvés, tandis que tout le reste fut anéanti.',
      },
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
        question: 'Que répondit le Prophète ﷺ en repensant à la plainte de Lut, qui souhaitait un "appui solide" (Coran 11:80) ?',
        options: [
          'Que Lut manquait de foi',
          'Que Lut aurait dû fuir plus tôt',
          'Que Lut s\'appuyait pourtant sur un soutien bien plus puissant',
          'Que Lut aurait dû combattre son peuple',
        ],
        correct: 2,
        explication: 'Le Prophète ﷺ dit : "Qu\'Allah fasse miséricorde à Lut : il s\'appuyait pourtant sur un soutien bien plus puissant" — Allah Lui-même (Sahih al-Bukhari, n°3387).',
      },
      {
        question: 'Que proposa Lut à son peuple pour tenter de protéger ses hôtes (les anges) ?',
        options: [
          'De fuir avec lui dans la nuit',
          'Ses filles, comme union plus pure',
          'De l\'argent en échange',
          'De combattre le peuple lui-même',
        ],
        correct: 1,
        explication: 'Lut dit : "Voici mes filles, elles sont plus pures pour vous. Craignez Allah et ne me déshonorez pas devant mes hôtes" (Coran 11:78).',
      },
    ],
  },
  {
    id: 'ismail',
    nom: 'Ismaïl',
    nomBiblique: 'Ismaël',
    arabe: 'إِسْمَاعِيل',
    surnom: 'Père des Arabes',
    periode: 'Environ 1750 av. J.-C.',
    resume: 'Ismaïl est le fils aîné d\'Ibrahim et l\'ancêtre de la lignée arabe des prophètes. Il co-construisit la Kaaba avec son père, accepta d\'être sacrifié avec une soumission totale et fut réputé pour sa sincérité dans ses promesses.',
    histoire: [
      {
        etape: 'Laissés dans le désert',
        texte: 'Ismaïl naquit d\'Hajar, une Égyptienne copte, épouse d\'Ibrahim. Sur ordre d\'Allah, Ibrahim la conduisit avec son bébé dans la vallée aride de La Mecque, sans eau ni culture, puis les y laissa avec peu de provisions. Quand Hajar lui demanda si Allah le lui avait ordonné, et qu\'il répondit oui, elle dit : "Alors Il ne nous délaissera pas."',
      },
      {
        etape: 'La quête d\'eau et la source de Zamzam',
        texte: 'Quand l\'eau et les dattes s\'épuisèrent, Hajar, affolée pour son bébé, courut sept fois entre les collines de Safa et Marwa à la recherche d\'un secours — un geste que des millions de pèlerins refont encore aujourd\'hui pendant le Hajj et la Omra. En revenant vers Ismaïl, elle vit l\'eau jaillir sous ses petits pieds. Pour l\'empêcher de se répandre, elle répétait : "Zomzomi" (arrête-toi, contiens-toi) — c\'est de là que vient le nom de Zamzam. Le Prophète ﷺ dit plus tard : "Qu\'Allah fasse miséricorde à la mère d\'Ismaïl ! Si elle avait laissé Zamzam couler librement, ce serait aujourd\'hui une rivière" (Sahih al-Bukhari, n°3364).',
      },
      {
        etape: 'La tribu qui s\'installa autour du puits',
        texte: 'Des oiseaux, attirés par l\'eau, se mirent à tournoyer au-dessus de la vallée. Une tribu de passage, les Jurhum, remarqua ce signe et demanda la permission de s\'installer près du puits. Hajar accepta, à condition qu\'ils ne s\'approprient pas l\'eau. Ismaïl grandit ainsi au milieu d\'eux, apprenant leur langue jusqu\'à la parler couramment. C\'est de lui que descendra, bien des générations plus tard, toute la lignée arabe des prophètes — jusqu\'à Muhammad ﷺ lui-même.',
      },
      {
        etape: 'L\'épreuve du sacrifice',
        texte: 'Une fois Ismaïl en âge d\'accompagner son père dans ses activités, Ibrahim vit en songe qu\'il devait le sacrifier. Il lui en parla avec respect : "Ô mon fils, je vois en songe que je t\'immole. Qu\'en penses-tu ?" Ismaïl répondit, dans l\'une des plus belles réponses du Coran : "Père, fais ce qu\'on t\'ordonne. Tu me trouveras, si Allah le veut, parmi les patients" (Coran 37:102). Au moment où Ibrahim s\'apprêtait à obéir, Allah l\'arrêta et remplaça Ismaïl par un bélier.',
      },
      {
        etape: 'La construction de la Kaaba',
        texte: 'Ismaïl aida son père à élever les murs de la Kaaba, posant pierre après pierre en priant avec lui : "Seigneur, accepte cela de nous, Tu es Celui qui entend et qui sait" (Coran 2:127).',
      },
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
      {
        question: 'Quelle tribu s\'installa près du puits de Zamzam après avoir aperçu des oiseaux tournoyer ?',
        options: ['Les Quraych', 'Les Jurhum', 'Les Thamud', 'Les Aws'],
        correct: 1,
        explication: 'La tribu des Jurhum, de passage, remarqua des oiseaux attirés par l\'eau et demanda à Hajar la permission de s\'installer près du puits.',
      },
    ],
  },
  {
    id: 'ishaq',
    nom: 'Ishaq',
    nomBiblique: 'Isaac',
    arabe: 'إِسْحَاق',
    surnom: 'Fils de la promesse',
    periode: 'Environ 1750 av. J.-C.',
    resume: 'Ishaq naquit comme un miracle d\'Ibrahim et de sa femme Sara, tous deux âgés. Il devint prophète et père de Yaqub (Jacob), poursuivant la lignée prophétique qui mènerait aux prophètes des Enfants d\'Israël.',
    histoire: [
      {
        etape: 'L\'annonce inattendue',
        texte: 'Des anges, envoyés vers le peuple de Lut, s\'arrêtèrent d\'abord chez Ibrahim sous l\'apparence d\'invités. Ils lui annoncèrent la naissance prochaine d\'un fils, Ishaq, puis d\'un petit-fils, Yaqub. Sara, sa femme, âgée et stérile depuis toujours, s\'exclama : "Malheur à moi ! Vais-je enfanter alors que je suis vieille et que mon époux est un vieillard ?" (Coran 11:72) Les anges lui répondirent : "T\'étonnes-tu de l\'ordre d\'Allah ?" (Coran 11:73) — rien n\'est impossible pour Celui qui décide de tout.',
      },
      {
        etape: 'Une lignée bénie',
        texte: 'Ishaq grandit dans une maison de foi et de prophétie, et devint à son tour prophète. Allah dit à son sujet : "Nous lui donnâmes Ishaq et Yaqub, et plaçâmes en sa descendance la prophétie et le Livre" (Coran 29:27). Son fils Yaqub allait donner naissance aux douze tribus d\'Israël, poursuivant ainsi la mission commencée par Ibrahim.',
      },
      {
        etape: 'Deux frères, deux lignées',
        texte: 'Ishaq et son demi-frère Ismaïl, nés de mères différentes — Sara et Hajar —, partageaient la même origine par leur père Ibrahim. Mais leurs descendances prirent deux chemins distincts : de celle d\'Ishaq, à travers Yaqub, naîtront la plupart des prophètes envoyés aux Bani Israël ; de celle d\'Ismaïl naîtra, des siècles plus tard, le dernier des prophètes, Muhammad ﷺ.',
      },
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
      {
        question: 'Vers quelles lignées se répartit la descendance d\'Ibrahim, à travers Ishaq et Ismaïl ?',
        options: [
          'Toutes deux menèrent aux prophètes arabes',
          'Celle d\'Ishaq mena aux prophètes des Bani Israël, celle d\'Ismaïl à Muhammad ﷺ',
          'Aucune des deux ne donna de prophète',
          'Seule celle d\'Ismaïl donna des prophètes',
        ],
        correct: 1,
        explication: 'De la descendance d\'Ishaq, par Yaqub, naquirent la plupart des prophètes envoyés aux Bani Israël ; de celle d\'Ismaïl naîtra, des siècles plus tard, Muhammad ﷺ.',
      },
    ],
  },
  {
    id: 'yaqub',
    nom: 'Yaqub',
    nomBiblique: 'Jacob',
    arabe: 'يَعْقُوب',
    surnom: 'Israël',
    periode: 'Environ 1700 av. J.-C.',
    resume: 'Yaqub, surnommé Israël, est le père des douze tribus. Il perdit son fils bien-aimé Yusuf pendant des années et pleura jusqu\'à perdre la vue, mais ne cessa jamais d\'espérer en la miséricorde d\'Allah.',
    histoire: [
      {
        etape: 'Un père, douze fils, un songe à taire',
        texte: 'Yaqub, fils d\'Ishaq et petit-fils d\'Ibrahim, eut douze fils. Le plus jeune, Yusuf, lui était particulièrement cher. Quand Yusuf raconta un songe où onze étoiles, le soleil et la lune se prosternaient devant lui, Yaqub, inquiet, le mit en garde : "Ô mon fils, ne raconte pas ton rêve à tes frères, sinon ils maniganceraient un complot contre toi" (Coran 12:5). Cette prévoyance ne suffit pas à empêcher la jalousie de grandir parmi ses fils.',
      },
      {
        etape: 'La ruse des frères',
        texte: 'Les frères convainquirent Yaqub de laisser Yusuf les accompagner, malgré sa crainte qu\'un loup ne le dévore. Ils le jetèrent dans un puits et revinrent en larmes, présentant à leur père une chemise tachée d\'un faux sang. Mais Yaqub comprit aussitôt la supercherie et dit : "Vos âmes vous ont embelli quelque chose... La belle patience est la mienne" (Coran 12:18).',
      },
      {
        etape: 'Des années de larmes',
        texte: 'Yaqub pleura Yusuf pendant de si longues années qu\'il en perdit la vue (Coran 12:84). Ses autres fils lui reprochèrent de se souvenir sans cesse de Yusuf au point d\'en tomber malade. Il leur répondit : "Je ne me plains de ma peine et de mon chagrin qu\'à Allah" (Coran 12:86) — refusant de perdre espoir, quoi qu\'il arrive.',
      },
      {
        etape: 'Le parfum reconnu de loin',
        texte: 'Des années plus tard, quand ses fils repartirent en Égypte avec la chemise de Yusuf devenu ministre, Yaqub sentit son parfum avant même leur arrivée : "Je perçois le parfum de Yusuf — ne me traitez pas de vieux radoteur" (Coran 12:94). Quand la chemise fut posée sur son visage, sa vue lui revint aussitôt.',
      },
      {
        etape: 'Le songe accompli',
        texte: 'Yaqub et toute sa famille rejoignirent alors Yusuf en Égypte. Là, il installa ses parents sur le trône, et tous — ses parents et ses onze frères — se prosternèrent devant lui (Coran 12:100). Le songe raconté des décennies plus tôt, que Yaqub avait pris tant de précautions à cacher, se réalisait enfin.',
      },
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
      {
        question: 'Pourquoi Yaqub mit-il son fils Yusuf en garde de ne pas raconter son songe à ses frères ?',
        options: [
          'Par crainte qu\'ils ne complotent contre lui par jalousie',
          'Car les songes étaient interdits',
          'Car Yusuf mentait souvent',
          'Par superstition sans raison précise',
        ],
        correct: 0,
        explication: 'Yaqub dit : "Ô mon fils, ne raconte pas ton rêve à tes frères, sinon ils maniganceraient un complot contre toi" (Coran 12:5).',
      },
    ],
  },
  {
    id: 'yusuf',
    nom: 'Yusuf',
    nomBiblique: 'Joseph',
    arabe: 'يُوسُف',
    surnom: 'Le Beau, le Patient',
    periode: 'Environ 1650 av. J.-C.',
    resume: 'L\'histoire de Yusuf est appelée "la plus belle des histoires" dans le Coran. Jeté dans un puits par ses frères, vendu comme esclave, emprisonné injustement, il devint ministre d\'Égypte et pardonna à ceux qui lui firent du mal.',
    histoire: [
      {
        etape: 'Un songe et une jalousie',
        texte: 'Yusuf, fils préféré de Yaqub, eut un jour un songe : onze étoiles, le soleil et la lune se prosternaient devant lui (Coran 12:4). Son père, comprenant la portée de cette vision, le mit en garde de ne pas la raconter à ses frères, de peur qu\'ils ne complotent contre lui. Mais la préférence de Yaqub pour Yusuf nourrissait déjà leur jalousie.',
      },
      {
        etape: 'Le puits et la caravane',
        texte: 'Les frères complotèrent de se débarrasser de Yusuf. L\'un d\'eux proposa de ne pas le tuer, mais de le jeter au fond d\'un puits, où des voyageurs le recueilleraient (Coran 12:10). C\'est ce qu\'ils firent, avant de revenir vers leur père avec une fausse chemise ensanglantée. Une caravane de passage envoya un homme puiser de l\'eau ; il remonta Yusuf avec son seau et s\'écria : "Bonne nouvelle ! Voici un garçon !" (Coran 12:19) Ils le vendirent en Égypte pour quelques pièces d\'argent, sans grande valeur à leurs yeux.',
      },
      {
        etape: 'La tentation et la preuve de son innocence',
        texte: 'En Égypte, Yusuf fut acheté par un haut fonctionnaire, Al-Aziz. Devenu jeune homme d\'une grande beauté, il attira les avances de l\'épouse de son maître, qui ferma les portes et le pressa. Yusuf s\'enfuit vers la sortie ; elle le retint et déchira sa tunique par-derrière. Ils trouvèrent Al-Aziz à la porte, et elle l\'accusa. Mais un témoin de sa propre famille proposa une preuve simple : si la tunique était déchirée par-devant, elle disait vrai ; par-derrière, c\'était elle qui mentait (Coran 12:26-27). La tunique déchirée dans le dos prouva l\'innocence de Yusuf devant tous.',
      },
      {
        etape: 'Les femmes de la ville',
        texte: 'La rumeur de cette affaire se répandit, et les femmes de la ville se moquèrent de l\'épouse d\'Al-Aziz. Piquée, elle les invita et donna à chacune un couteau pour couper des fruits, puis fit entrer Yusuf. Frappées par sa beauté, les femmes se coupèrent les mains sans même s\'en apercevoir, en disant : "Ceci n\'est pas un être humain, ce ne peut être qu\'un ange noble !" (Coran 12:31) Yusuf préféra alors la prison plutôt que de céder à leurs avances.',
      },
      {
        etape: 'Les songes en prison',
        texte: 'En prison, deux compagnons lui racontèrent leurs rêves. Yusuf leur annonça que l\'un servirait de nouveau du vin à son roi, et que l\'autre serait exécuté (Coran 12:36-41) — tout se réalisa comme il l\'avait dit. Des années plus tard, le roi d\'Égypte lui-même vit en songe sept vaches grasses dévorées par sept maigres, et sept épis verts contre sept desséchés. Yusuf interpréta ce songe comme l\'annonce de sept années d\'abondance suivies de sept années de famine.',
      },
      {
        etape: 'La libération et le pouvoir',
        texte: 'Le roi voulut libérer Yusuf, mais celui-ci refusa de sortir avant que son innocence dans l\'affaire d\'Al-Aziz ne soit publiquement reconnue. Une fois lavé de tout soupçon, il fut nommé à la tête des réserves d\'Égypte — un poste qu\'il demanda lui-même, se disant "gardien compétent et savant" (Coran 12:55).',
      },
      {
        etape: 'Les retrouvailles et le pardon',
        texte: 'Des années plus tard, la famine poussa ses frères jusqu\'en Égypte pour chercher des vivres. Yusuf les reconnut sans se faire connaître, les mit à l\'épreuve, avant de finalement se révéler : "Je suis Yusuf, et voici mon frère. Allah nous a comblés de bienfaits" (Coran 12:90). À leurs excuses, il répondit : "Pas de reproche contre vous aujourd\'hui. Allah vous pardonnera" (Coran 12:92). Sa famille tout entière vint le rejoindre en Égypte, et devant lui, ses parents et ses onze frères se prosternèrent — le songe de son enfance s\'accomplissait enfin (Coran 12:100).',
      },
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
      {
        question: 'Que craignait Yaqub s\'il arrivait malheur à Yusuf lors de sa sortie avec ses frères ?',
        options: ['Qu\'il se perde', 'Qu\'un loup le dévore', 'Qu\'il tombe malade', 'Qu\'il soit capturé par des voleurs'],
        correct: 1,
        explication: 'Yaqub craignait qu\'un loup ne dévore Yusuf s\'il partait seul avec ses frères — une crainte que ceux-ci utilisèrent ensuite pour justifier la fausse chemise ensanglantée.',
      },
    ],
  },
  {
    id: 'ayyub',
    nom: 'Ayyub',
    nomBiblique: 'Job',
    arabe: 'أَيُّوب',
    surnom: 'Le Patient',
    periode: 'Environ 1500 av. J.-C.',
    resume: 'Ayyub perdit sa santé, ses biens et ses enfants pendant des années d\'épreuves. Il ne se plaignit qu\'à Allah par un du\'a sobre et magnifique, et Allah le guérit, lui restituant tout en double.',
    histoire: [
      {
        etape: 'Un homme comblé, éprouvé dans ses biens et son corps',
        texte: 'Ibn Kathir rapporte qu\'Ayyub, descendant d\'Ibrahim, vivait dans la région du Hauran, comblé de troupeaux, de terres et d\'enfants, tout en restant d\'une piété et d\'une générosité rares (Coran 6:84). Allah l\'éprouva par étapes : ses biens périrent, ses maisons s\'effondrèrent sur ses enfants, puis la maladie couvrit son corps de plaies au point que les gens de sa ville, effrayés, l\'éloignèrent. Seuls son cœur et sa langue restèrent intacts pour l\'évocation d\'Allah — jamais il ne prononça une parole de révolte.',
      },
      {
        etape: 'La fidélité de son épouse',
        texte: 'Pendant de très longues années, son épouse resta seule à ses côtés, travaillant pour le nourrir alors que tous l\'avaient abandonné. Un jour, à bout de force, elle fut approchée par Shaytan qui lui promit la guérison d\'Ayyub si elle acceptait, une seule fois, un geste contraire à l\'adoration exclusive d\'Allah. Elle faillit céder par désespoir. En l\'apprenant, Ayyub, peiné, jura que s\'il guérissait, il la frapperait de cent coups.',
      },
      {
        etape: 'Le du\'a et la guérison',
        texte: 'Après tant d\'années, Ayyub adressa à Allah son invocation la plus connue, sans une once de plainte : "Le mal m\'a touché, et Tu es le plus Miséricordieux des miséricordieux" (Coran 21:83). Allah répondit aussitôt et lui ordonna : "Frappe le sol de ton pied : voici une eau fraîche pour te laver et pour boire" (Coran 38:42). Une source jaillit ; il s\'y lava et en but, et sa maladie disparut entièrement.',
      },
      {
        etape: 'La double bénédiction et le serment tenu',
        texte: 'Allah lui rendit sa famille et y ajouta leurs pareils, "par miséricorde de Notre part" (Coran 21:84). Restait le serment envers son épouse, restée fidèle malgré son seul instant de faiblesse : Allah lui accorda un allègement plein de sagesse — "Prends dans ta main un faisceau de brindilles, frappe avec cela et ne viole pas ton serment" (Coran 38:44). Ayyub tint ainsi sa parole sans lui faire de mal.',
      },
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
      {
        question: 'Ayyub avait juré de frapper son épouse de cent coups. Comment Allah lui permit-Il de tenir ce serment sans lui faire de mal ?',
        options: [
          'En annulant simplement le serment',
          'En lui ordonnant de la frapper avec un faisceau de brindilles',
          'En demandant à un juge de trancher',
          'En remplaçant les coups par un jeûne',
        ],
        correct: 1,
        explication: 'Coran 38:44 : Allah ordonna à Ayyub de prendre un faisceau de brindilles et de frapper avec, afin qu\'il tienne son serment sans blesser son épouse fidèle.',
      },
    ],
  },
  {
    id: 'shuayb',
    nom: 'Shu\'ayb',
    nomBiblique: 'Jéthro',
    arabe: 'شُعَيْب',
    surnom: 'L\'Éloquent',
    periode: 'Environ 1500 av. J.-C.',
    resume: 'Shu\'ayb fut envoyé au peuple de Madyan qui trichait dans les balances et les mesures. Il les appela à l\'honnêteté commerciale et à la crainte d\'Allah. Rejetés, ils furent détruits par un cri foudroyant.',
    histoire: [
      {
        etape: 'Un carrefour commercial gagné par la fraude',
        texte: 'Le peuple de Madyan vivait dans le nord-ouest de l\'Arabie, sur une route commerciale fréquentée entre le Sham et le Hijaz. Ibn Kathir rapporte qu\'à ce vice de la fraude s\'ajoutaient l\'adoration d\'idoles et le brigandage : les habitants guettaient les voyageurs sur les routes pour les détrousser et les détourner de la foi, comme le rappelle le Coran : "Ne vous embusquez pas sur chaque chemin, menaçant et détournant du sentier d\'Allah ceux qui croient en Lui" (Coran 7:86). Shu\'ayb, l\'un des leurs, fut envoyé pour les rappeler à Allah seul et à l\'intégrité dans leurs affaires.',
      },
      {
        etape: 'L\'appel à l\'honnêteté et à la foi',
        texte: 'Shu\'ayb leur dit : "Ô mon peuple, adorez Allah, vous n\'avez pas d\'autre divinité que Lui... Donnez la pleine mesure et le plein poids en toute équité, et ne lésez pas les gens dans leurs biens" (Coran 11:84-85). Il liait ainsi, dans un même appel, l\'adoration du Créateur et la droiture envers les créatures — refusant de séparer la foi du comportement quotidien.',
      },
      {
        etape: 'Le mépris des notables',
        texte: 'Les chefs de Madyan répondirent avec dédain : "Ô Shu\'ayb, ta prière t\'ordonne-t-elle que nous abandonnions ce qu\'adoraient nos ancêtres, ou de ne plus faire de nos biens ce que nous voulons ? Tu es assurément le tolérant, le droit raisonnable !" (Coran 11:87) — ironie amère envers celui qu\'ils jugeaient pourtant sincère. Ils allèrent jusqu\'à lui dire qu\'ils le considéraient comme faible parmi eux et que, sans le clan de sa famille, ils l\'auraient déjà lapidé (Coran 11:91).',
      },
      {
        etape: 'Le défi et la menace d\'expulsion',
        texte: 'Les notables menacèrent d\'expulser Shu\'ayb et les croyants de la cité s\'ils ne revenaient pas à leur religion (Coran 7:88). D\'autres, provocateurs, réclamèrent ouvertement le châtiment : "Fais tomber sur nous un morceau du ciel, si tu es du nombre des véridiques !" (Coran 26:187) Shu\'ayb leur répondit qu\'Allah seul savait ce qu\'ils faisaient, et plaça entièrement sa confiance en Lui : "Je place ma confiance en Allah, mon Seigneur et le vôtre" (Coran 11:88).',
      },
      {
        etape: 'Le châtiment : le jour de l\'ombre',
        texte: 'Le châtiment vint sous une forme redoutable : après une chaleur suffocante, un nuage apparut, apportant une ombre que le peuple accueillit avec soulagement — jusqu\'à ce qu\'il se referme sur eux et déverse un feu dévastateur, ce que le Coran appelle "le châtiment du jour de l\'Ombre" (Coran 26:189). D\'autres versets ajoutent qu\'un cri (sayhah) et un tremblement les saisirent, les laissant inertes dans leurs demeures (Coran 11:94 ; 29:37). Shu\'ayb et les croyants furent épargnés.',
      },
      {
        etape: 'Un fil qui se poursuit avec Musa',
        texte: 'Des siècles plus tard, c\'est chez un homme pieux de Madyan — que la tradition identifie souvent à Shu\'ayb ou à l\'un de ses descendants portant le même esprit de droiture — que Musa, fuyant l\'Égypte, trouvera refuge, épousera l\'une de ses filles et gardera ses troupeaux pendant plusieurs années (Coran 28:23-28), reliant ainsi l\'histoire de Shu\'ayb à celle du prochain grand prophète.',
      },
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
      {
        question: 'Sous quelle forme le châtiment final s\'abattit-il sur le peuple de Madyan et les Compagnons du Bois ?',
        options: [
          'Un déluge soudain',
          'Un nuage d\'ombre qui se referma en un feu dévastateur, accompagné d\'un cri',
          'Une invasion de sauterelles',
          'Une nuit sans fin',
        ],
        correct: 1,
        explication: 'Le Coran (26:189) parle du "châtiment du jour de l\'Ombre" et (11:94) d\'un cri (sayhah) qui les laissa inertes dans leurs demeures.',
      },
    ],
  },
  {
    id: 'musa',
    nom: 'Musa',
    nomBiblique: 'Moïse',
    arabe: 'مُوسَى',
    surnom: 'Kalimullah — Celui à qui Allah a parlé',
    periode: 'Environ 1300 av. J.-C.',
    resume: 'Musa est le prophète le plus cité dans le Coran. Il confronta Pharaon avec le bâton et les miracles, libéra les Enfants d\'Israël, reçut la Torah sur le mont Sinaï et partagea la mer Rouge.',
    histoire: [
      {
        etape: 'Une nacelle confiée au Nil',
        texte: 'Pharaon, ayant vu en songe ou appris par ses devins qu\'un enfant des Bani Israël causerait sa chute, ordonna l\'égorgement de tous les nouveau-nés mâles israélites. Quand Musa naquit, Allah inspira à sa mère : "Allaite-le. Et quand tu craindras pour lui, jette-le dans le fleuve, sans crainte ni chagrin : Nous te le rendrons et ferons de lui un messager" (Coran 28:7). Le cœur déchiré, elle plaça son bébé dans une nacelle et le confia au Nil, tandis que sa fille suivait discrètement pour savoir ce qu\'il adviendrait de lui.',
      },
      {
        etape: 'Recueilli dans le palais de son ennemi',
        texte: 'La nacelle fut recueillie par les gens de Pharaon eux-mêmes. Aviser de bonté envers cet enfant, l\'épouse de Pharaon, Asiya, supplia son mari : "Une fraîcheur des yeux pour moi et pour toi. Ne le tuez pas, il pourrait nous être utile ou nous l\'adopterons comme fils" (Coran 28:9). Musa refusa toute nourrice, jusqu\'à ce que sa sœur, présente sur les lieux, propose une famille "qui s\'en occupera bien" — sa propre mère, qui put ainsi allaiter et élever son fils au cœur même du palais, rémunérée par Pharaon pour prendre soin de celui qu\'il avait juré de faire disparaître : "Ainsi Nous le rendîmes à sa mère, afin que son œil se réjouisse et qu\'elle ne s\'afflige plus, et pour qu\'elle sache que la promesse d\'Allah est vérité" (Coran 28:13).',
      },
      {
        etape: 'Le meurtre accidentel et la fuite vers Madyan',
        texte: 'Devenu adulte, Musa surprit un Égyptien en train de frapper un Israélite. Il intervint et lui donna un coup de poing qui, sans qu\'il l\'ait voulu, causa sa mort. Musa se repentit aussitôt : "Seigneur, j\'ai fait du tort à moi-même, pardonne-moi" (Coran 28:16). Averti qu\'on complotait pour le tuer, il s\'enfuit seul vers Madyan, invoquant Allah : "Peut-être mon Seigneur me guidera-t-Il sur le droit chemin" (Coran 28:22). Arrivé près d\'un puits, il aida deux jeunes femmes à faire boire leurs troupeaux ; leur père, un homme pieux de Madyan, l\'accueillit, lui donna l\'une de ses filles en mariage et l\'engagea pour dix années au service de ses troupeaux (Coran 28:27).',
      },
      {
        etape: 'Le feu du mont Tuwa et l\'appel divin',
        texte: 'Sur le chemin du retour vers l\'Égypte avec sa famille, Musa aperçut un feu au loin et s\'en approcha pour en ramener un tison. Dans la vallée bénie de Tuwa, Allah lui parla directement, sans intermédiaire — c\'est pour cet honneur unique que Musa reçut le titre de Kalimullah, Celui à qui Allah a parlé (Coran 4:164) : "Ôte tes sandales, car tu es dans la vallée sacrée de Tuwa" (Coran 20:12). Son bâton se changea en serpent et sa main, glissée sous son bras, ressortit blanche et lumineuse sans aucun mal (Coran 20:17-22) — deux signes qu\'il devrait montrer à Pharaon. Musa, conscient de sa gêne dans la parole depuis une brûlure d\'enfance, implora : "Seigneur, ouvre ma poitrine, facilite ma tâche, dénoue un nœud de ma langue... et donne-moi un ministre de ma famille, Harun mon frère" (Coran 20:25-30). Allah exauça sa demande.',
      },
      {
        etape: 'Face à Pharaon : les miracles et les magiciens',
        texte: 'Musa et Harun se présentèrent devant Pharaon avec un message d\'une clarté totale : "Envoie avec nous les Bani Israël" (Coran 20:47). Pharaon, qui se proclamait lui-même divinité suprême ("Je suis votre seigneur, le très-haut", Coran 79:24), rassembla ses plus grands magiciens pour discréditer Musa. Le jour de la fête, les magiciens jetèrent leurs cordes et bâtons qui semblèrent grouiller comme des serpents. Musa jeta le sien : il avala tout ce qu\'ils avaient produit. Les magiciens, hommes de l\'art, reconnurent aussitôt qu\'aucune magie humaine ne pouvait produire ce prodige et tombèrent en prosternation, s\'écriant : "Nous croyons au Seigneur des mondes, le Seigneur de Musa et Harun !" (Coran 26:47-48), bravant la menace de Pharaon de leur couper mains et pieds.',
      },
      {
        etape: 'Les plaies d\'Égypte et la libération',
        texte: 'Pharaon s\'entêta, malgré neuf signes clairs envoyés successivement — parmi eux le déluge, les sauterelles, les poux, les grenouilles et le sang (Coran 7:133) — chaque fois suivis d\'une promesse de croire, aussitôt trahie une fois le fléau levé. Allah ordonna finalement à Musa de partir de nuit avec les Bani Israël (Coran 20:77).',
      },
      {
        etape: 'La traversée de la mer',
        texte: 'Pharaon les poursuivit avec son armée. Acculés entre la mer et l\'ennemi, les Israélites paniquèrent : "Nous allons être rattrapés !" Musa répondit avec une confiance inébranlable : "Non ! Mon Seigneur est avec moi, Il me guidera" (Coran 26:61-62). Allah lui ordonna de frapper la mer de son bâton : elle s\'ouvrit en douze passages secs, "chaque partie comme une immense montagne" (Coran 26:63). Les Israélites traversèrent ; Pharaon et son armée s\'y engouffrèrent à leur tour, et les eaux se refermèrent sur eux. Au moment de se noyer, Pharaon proclama sa foi trop tard ; Allah préserva son corps comme signe pour la postérité (Coran 10:90-92).',
      },
      {
        etape: 'Le Sinaï, la Torah et le veau d\'or',
        texte: 'Allah donna rendez-vous à Musa sur le mont Sinaï pour quarante nuits et lui révéla la Torah, gravée sur des Tables, "un exposé complet de toute chose" (Coran 7:145). Pendant son absence, un homme du nom de Samiri façonna, à partir des bijoux du peuple, un veau d\'or qui semblait mugir, et le peuple s\'y adonna en idolâtrie malgré les mises en garde de Harun. De retour, Musa, bouleversé, saisit la tête et la barbe de son frère sous le coup de la colère avant d\'apprendre son innocence, puis jeta les Tables au sol (Coran 7:150). Il choisit ensuite soixante-dix hommes pour se repentir sur le Mont ; certains, non satisfaits, demandèrent à voir Allah directement et furent saisis par la foudre avant d\'être ressuscités (Coran 7:155).',
      },
      {
        etape: 'La rencontre avec le sage Khidr',
        texte: 'Après avoir affirmé être le plus savant des hommes, Musa fut renvoyé par Allah vers un serviteur détenteur d\'une science que lui-même ne possédait pas : Al-Khidr. Sourate Al-Kahf (18:60-82) relate leur voyage : Musa, malgré sa promesse de patience, s\'étonna à trois reprises des actes en apparence injustes de Khidr — un bateau endommagé, un jeune homme tué, un mur relevé sans salaire — avant d\'apprendre la sagesse cachée derrière chacun. Cet épisode enseigne à Musa, le plus grand des messagers face à Pharaon, une leçon d\'humilité devant l\'immensité du savoir d\'Allah.',
      },
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
      {
        question: 'Que rechercha Musa auprès du sage Al-Khidr (Coran 18:60-82) ?',
        options: [
          'De l\'or et des richesses',
          'Une science qu\'Allah avait donnée à Khidr et que Musa ne possédait pas',
          'Un remède pour Pharaon',
          'Un chemin plus court vers Madyan',
        ],
        correct: 1,
        explication: 'Musa partit en voyage pour apprendre de Khidr une science particulière qu\'Allah lui avait enseignée, et dut faire preuve de patience face à des actes en apparence injustifiés.',
      },
    ],
  },
  {
    id: 'harun',
    nom: 'Harun',
    nomBiblique: 'Aaron',
    arabe: 'هَارُون',
    surnom: 'Le Soutien de Musa',
    periode: 'Environ 1300 av. J.-C.',
    resume: 'Harun est le frère de Musa et son compagnon de prophétie. Allah l\'accorda à Musa comme ministre et porte-parole grâce à son éloquence. Il géra le peuple pendant l\'absence de Musa sur le Sinaï.',
    histoire: [
      {
        etape: 'La demande de Musa exaucée',
        texte: 'Face à l\'ampleur de sa mission devant Pharaon, Musa implora Allah : "Seigneur, ouvre ma poitrine, facilite ma tâche, dénoue un nœud de ma langue afin qu\'ils comprennent mon discours. Et accorde-moi un ministre de ma famille, Harun mon frère. Renforce par lui mon dos et associe-le à ma mission" (Coran 20:25-32). Allah répondit : "Ta demande est exaucée, ô Musa" (Coran 20:36). Le Coran précise ailleurs qu\'Il fit de Harun un prophète "par un effet de Notre miséricorde" (Coran 19:53), et non un simple assistant : les deux frères reçurent ensemble le titre de messagers.',
      },
      {
        etape: 'Ensemble devant Pharaon',
        texte: 'Allah leur ordonna à tous deux d\'aller voir Pharaon, avec une consigne surprenante de douceur envers un tyran : "Parlez-lui avec des mots doux ; peut-être se souviendra-t-il ou craindra-t-il" (Coran 20:44). Harun, plus éloquent que son frère, portait la parole tandis que Musa affrontait Pharaon avec les signes. Ensemble ils demandaient : "Envoie avec nous les Bani Israël, et ne les châtie plus" (Coran 20:47).',
      },
      {
        etape: 'Le gardien du peuple en l\'absence de Musa',
        texte: 'Avant de monter au Sinaï, Musa confia sa communauté à Harun : "Remplace-moi auprès de mon peuple, agis avec droiture et ne suis pas la voie des corrupteurs" (Coran 7:142). Quand le Samiri façonna le veau d\'or et que le peuple s\'y adonna, Harun les avertit sans relâche : "Ô mon peuple, vous n\'êtes éprouvés que par cela. Votre Seigneur est le Tout Miséricordieux : suivez-moi et obéissez à mon ordre" (Coran 20:90). Mais le peuple, entêté, répondit qu\'il continuerait tant que Musa ne serait pas revenu (Coran 20:91).',
      },
      {
        etape: 'La colère de Musa et l\'innocence de Harun',
        texte: 'De retour et furieux devant l\'idolâtrie de son peuple, Musa saisit la tête et la barbe de son frère. Harun, avec une immense douceur malgré l\'injustice du geste, répondit : "Ô fils de ma mère, ne me saisis ni par la barbe ni par la tête ! Je craignais que tu dises : tu as créé la division parmi les Bani Israël et tu n\'as pas gardé mes paroles" (Coran 20:94). Musa comprit alors que son frère avait fait tout ce qui était en son pouvoir, et invoqua : "Seigneur, pardonne-moi et à mon frère, et fais-nous entrer dans Ta miséricorde" (Coran 7:151).',
      },
      {
        etape: 'Une fraternité prophétique inséparable',
        texte: 'Le Coran unit constamment les deux frères dans la mémoire des croyants : "Nous avons certes accordé une grâce à Musa et à Harun. Et Nous les sauvâmes, eux et leur peuple, de la grande détresse... Paix sur Musa et Harun !" (Coran 37:114-120). Selon la tradition, Harun mourut avant Musa, durant les années d\'errance des Bani Israël dans le désert du Tih — un frère resté fidèle jusqu\'au bout, dont le nom demeure indissociable de celui de Musa dans le Coran comme dans l\'histoire de la prophétie.',
      },
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
      {
        question: 'Quelle consigne étonnante Allah donna-t-Il à Musa et Harun avant leur rencontre avec Pharaon ?',
        options: [
          'De se montrer menaçants',
          'De lui parler avec des mots doux',
          'De rester silencieux',
          'De venir accompagnés d\'une armée',
        ],
        correct: 1,
        explication: 'Coran 20:44 : Allah leur ordonna de parler à Pharaon "avec des mots doux ; peut-être se souviendra-t-il ou craindra-t-il".',
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
      {
        etape: 'Une identité débattue par les savants',
        texte: 'Ibn Kathir consacre plusieurs pages à Dhul-Kifl dans ses "Qisas al-Anbiya", rappelant que son identité exacte fait débat parmi les exégètes : certains le considèrent comme un prophète à part entière, d\'autres pensent qu\'il s\'agit d\'un homme vertueux non-prophète, parfois identifié au fils d\'Ayyub. Ce qui reste certain, c\'est la place que le Coran lui accorde parmi les meilleurs serviteurs d\'Allah, aux côtés d\'Ismaïl et d\'Idris (Coran 21:85) puis d\'Ismaïl et d\'Al-Yasa\' (Coran 38:48).',
      },
      {
        etape: 'Le vœu qui donna son nom',
        texte: 'Selon un récit largement rapporté par les commentateurs, un prophète vieillissant du peuple des Bani Israël, cherchant qui pourrait lui succéder pour juger les gens, lança un défi : il donnerait la charge à quiconque s\'engagerait à jeûner le jour, prier la nuit, et ne jamais se mettre en colère en tranchant entre les hommes. Un jeune homme peu considéré par son entourage se présenta et accepta cet engagement (*kafala*), en échange de quoi le prophète lui garantit le Paradis. C\'est de cet engagement tenu qu\'il tira son nom : Dhul-Kifl, "Celui qui a pris la charge" ou "Celui de la garantie double".',
      },
      {
        etape: 'Les épreuves de Shaytan',
        texte: 'Ibn Kathir rapporte que Shaytan, furieux de cette promesse de Paradis, tenta à de nombreuses reprises de le faire sortir de sa colère ou de lui faire manquer sa séance de jugement quotidienne, se présentant sous les traits d\'un vieillard en détresse juste au moment de son repos, cherchant à provoquer son agacement. Chaque fois, Dhul-Kifl garda son calme et respecta scrupuleusement son engagement, jusqu\'à ce que Shaytan renonce, vaincu par sa constance.',
      },
      {
        etape: 'Une place parmi les vertueux',
        texte: 'Sa fidélité totale à sa parole, malgré toutes les tentatives de le faire vaciller, lui valut d\'être cité par le Coran parmi les patients (Coran 21:85) et parmi les meilleurs (*Akhyar*, Coran 38:48) — une reconnaissance divine accordée non pour un miracle spectaculaire, mais pour la constance silencieuse d\'un homme fidèle à son engagement jour après jour.',
      },
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
      {
        question: 'Comment Shaytan tenta-t-il de faire fléchir Dhul-Kifl dans son engagement, selon Ibn Kathir ?',
        options: [
          'En lui volant ses biens',
          'En se présentant comme un vieillard en détresse juste avant son repos',
          'En menaçant sa famille',
          'En le calomniant publiquement',
        ],
        correct: 1,
        explication: 'Ibn Kathir rapporte que Shaytan se présenta à plusieurs reprises sous les traits d\'un vieillard en détresse pour le faire sortir de son calme ou lui faire manquer sa séance de jugement — sans jamais y parvenir.',
      },
    ],
  },
  {
    id: 'dawud',
    nom: 'Dawud',
    nomBiblique: 'David',
    arabe: 'دَاوُد',
    surnom: 'Roi-Prophète',
    periode: 'Environ 1000 av. J.-C.',
    resume: 'Dawud était un jeune berger qui tua le géant Jalut (Goliath) avec une fronde. Devenu roi d\'Israël, il reçut les Psaumes (Zabur) et pouvait ramollir le fer de ses mains. Les oiseaux et les montagnes glorifiaient Allah avec lui.',
    histoire: [
      {
        etape: 'Le jeune berger face au géant Jalut',
        texte: 'Après que le prophète des Bani Israël leur eut désigné Talut (Saül) comme roi, confirmé par le signe d\'un coffre sacré (Tabut) porté par les anges (Coran 2:248), l\'armée israélite affronta celle du géant Jalut (Goliath). Beaucoup de soldats faiblirent en chemin, incapables de résister à la soif près de la rivière malgré l\'avertissement de Talut (Coran 2:249). Parmi les rares restés fermes se trouvait Dawud, simple jeune berger. Il s\'avança seul avec sa fronde, invoquant Allah, et abattit Jalut d\'une pierre. Le Coran résume : "Dawud tua Jalut, et Allah lui donna la royauté et la sagesse, et lui enseigna ce qu\'Il voulut" (Coran 2:251).',
      },
      {
        etape: 'Un roi-prophète comblé de dons',
        texte: 'Allah unit en Dawud la royauté et la prophétie, chose rare parmi les envoyés. Il lui révéla le Zabur (les Psaumes) et lui accorda une voix si belle que "Nous avons asservi les montagnes avec lui, chantant Nos louanges soir et matin, ainsi que les oiseaux rassemblés" (Coran 38:18-19). Le Coran ajoute : "Certes Nous avons donné à Dawud une grâce de Notre part : Ô montagnes, répétez avec lui Nos louanges ! Et vous aussi, oiseaux !" (Coran 34:10) — un accompagnement cosmique de sa glorification d\'Allah, unique dans le récit prophétique.',
      },
      {
        etape: 'Le fer ramolli et le travail de ses mains',
        texte: 'Allah ramollit le fer pour Dawud sans qu\'il ait besoin de feu, lui permettant de façonner des cottes de mailles : "Fabrique des cottes de mailles complètes et mesure bien les mailles. Et faites le bien, vous et lui, car Je vois parfaitement ce que vous œuvrez" (Coran 34:11). Un hadith rapporté par Al-Bukhari précise que Dawud ne mangeait que de ce que ses propres mains avaient gagné (Sahih al-Bukhari, n°2073) — un roi qui, malgré son immense pouvoir, refusait de vivre aux dépens de son peuple.',
      },
      {
        etape: 'Les deux plaideurs et le repentir sincère',
        texte: 'Le Coran relate qu\'un jour, deux hommes escaladèrent le mur de son lieu de prière privé (mihrab) pour lui soumettre un litige : l\'un accusait l\'autre de lui avoir injustement pris sa brebis unique en plus de ses quatre-vingt-dix-neuf (Coran 38:21-24). Dawud, sans entendre l\'autre partie, trancha rapidement — puis comprit qu\'il s\'agissait d\'une épreuve (fitna) pour tester la rigueur de son jugement. Il tomba aussitôt en prosternation, demandant pardon. Ibn Kathir insiste avec force sur ce point : il réfute explicitement les récits d\'origine israélite (Isra\'iliyyat) qui prêtent à Dawud une faute grave et indigne d\'un prophète, rappelant qu\'Allah préserve Ses messagers de tels péchés ; l\'erreur de Dawud ne fut qu\'une précipitation dans le jugement, aussitôt suivie d\'un repentir sincère. Allah lui pardonna : "Nous lui pardonnâmes cela. Il a, auprès de Nous, un rang élevé et un beau retour" (Coran 38:25).',
      },
      {
        etape: 'Le jeûne et la prière de Dawud',
        texte: 'Le Prophète ﷺ a cité l\'adoration de Dawud comme un modèle d\'équilibre : "Le jeûne le plus aimé d\'Allah est le jeûne de Dawud : il jeûnait un jour et rompait le jeûne le jour suivant. Et la prière la plus aimée d\'Allah est la prière de Dawud : il dormait la moitié de la nuit, en priait le tiers, puis dormait le sixième restant" (Sahih al-Bukhari, n°1131 ; Sahih Muslim, n°1159). Cette pratique, encore appelée aujourd\'hui "siyam Dawud", reste citée comme l\'idéal de la constance dans l\'adoration, ni excessive ni relâchée.',
      },
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
      {
        question: 'Que dit le Prophète ﷺ à propos du jeûne de Dawud ?',
        options: [
          'Qu\'il jeûnait toute l\'année',
          'Qu\'il jeûnait un jour sur deux — le jeûne le plus aimé d\'Allah',
          'Qu\'il ne jeûnait jamais',
          'Qu\'il jeûnait uniquement le mois sacré',
        ],
        correct: 1,
        explication: 'Sahih al-Bukhari (n°1131) rapporte que le jeûne le plus aimé d\'Allah est celui de Dawud : un jour sur deux.',
      },
    ],
  },
  {
    id: 'sulayman',
    nom: 'Sulayman',
    nomBiblique: 'Salomon',
    arabe: 'سُلَيْمَان',
    surnom: 'Roi des rois',
    periode: 'Environ 950 av. J.-C.',
    resume: 'Sulayman, fils de Dawud, fut le roi le plus puissant de l\'histoire. Il comprenait le langage des animaux, commandait les djinns et le vent, et reçut la reine de Saba en convertissant son royaume à l\'islam.',
    histoire: [
      {
        etape: 'Un héritage royal et prophétique',
        texte: 'Sulayman hérita de la royauté et de la prophétie de son père Dawud. Le Coran résume cet héritage par ces mots : "Sulayman hérita de Dawud et dit : Ô hommes, on nous a enseigné le langage des oiseaux et on nous a donné part de toutes choses. C\'est là, vraiment, la grâce évidente" (Coran 27:16). Allah lui soumit les djinns, les humains, les oiseaux, et le vent lui-même : "Nous avons soumis à Sulayman le vent qui, par son ordre, courait un mois le matin et un mois le soir" (Coran 34:12).',
      },
      {
        etape: 'La vallée des fourmis',
        texte: 'Passant avec son immense armée composée de djinns, d\'hommes et d\'oiseaux, Sulayman traversa une vallée de fourmis. L\'une d\'elles s\'écria : "Ô fourmis, entrez dans vos demeures, de peur que Sulayman et ses armées ne vous écrasent sans s\'en apercevoir !" Sulayman entendit ses paroles et sourit, amusé et reconnaissant, puis invoqua : "Seigneur, inspire-moi de Te remercier pour Ton bienfait... et de faire le bien que Tu agrées" (Coran 27:18-19) — preuve que sa science du langage animal servait avant tout à nourrir sa gratitude.',
      },
      {
        etape: 'La huppe absente et le royaume de Saba',
        texte: 'Passant en revue les oiseaux de son armée, Sulayman remarqua l\'absence de la huppe (hudhud) et menaça de la punir sévèrement si elle n\'avait pas d\'excuse valable (Coran 27:20-21). Elle revint avec une nouvelle capitale : elle avait découvert un royaume gouverné par une femme, Bilqis, disposant d\'un trône immense, mais dont le peuple se prosternait devant le soleil au lieu d\'Allah (Coran 27:22-24).',
      },
      {
        etape: 'La lettre et le défi de Bilqis',
        texte: 'Sulayman envoya à Bilqis une lettre l\'invitant, elle et son peuple, à se soumettre à Allah. Bilqis, prudente, lui envoya d\'abord de riches présents pour sonder ses intentions. Sulayman les refusa avec fermeté : "Est-ce par des biens que vous voulez m\'aider ? Ce qu\'Allah m\'a donné vaut mieux que ce qu\'Il vous a donné" (Coran 27:36), et exigea qu\'elle vienne se soumettre, faute de quoi son armée interviendrait.',
      },
      {
        etape: 'Le trône apporté en un clin d\'œil',
        texte: 'Avant l\'arrivée de Bilqis, Sulayman demanda qui pourrait lui apporter son trône. Un puissant djinn (ifrit) proposa de le faire avant qu\'il ne se lève de sa place ; mais un homme détenteur d\'une science du Livre déclara pouvoir l\'apporter en un instant, "avant même que ton regard ne revienne à toi" (Coran 27:40). Voyant le trône devant lui, Sulayman ne s\'enorgueillit pas, mais dit : "Ceci est de la faveur de mon Seigneur, pour m\'éprouver — serai-je reconnaissant ou ingrat ?"',
      },
      {
        etape: 'La conversion de Bilqis',
        texte: 'On modifia le trône de Bilqis pour tester sa perspicacité ; elle le reconnut malgré tout. On la fit ensuite entrer dans un palais au sol de verre poli sur de l\'eau : croyant marcher vers une mare, elle releva sa robe. Sulayman lui précisa qu\'il s\'agissait d\'un dallage de cristal (Coran 27:44). Face à ces prodiges, Bilqis reconnut son erreur passée et déclara : "Seigneur, je me suis fait du tort à moi-même, et je me soumets avec Sulayman à Allah, Seigneur des mondes" (Coran 27:44).',
      },
      {
        etape: 'Les djinns à son service',
        texte: 'Allah mit au service de Sulayman des djinns qui plongeaient dans la mer et accomplissaient d\'autres travaux, "et Nous les surveillions" (Coran 21:82). Ils lui construisirent "ce qu\'il voulait comme sanctuaires, statues, bassins grands comme des réservoirs et marmites fixées au sol" (Coran 34:13), tandis que d\'autres djinns rebelles étaient enchaînés (Coran 38:38).',
      },
      {
        etape: 'La mort appuyée sur son bâton',
        texte: 'Sulayman mourut debout, appuyé sur son bâton, alors qu\'il surveillait les djinns au travail. Ceux-ci continuèrent leur labeur, croyant qu\'il vivait encore, jusqu\'à ce qu\'un ver ronge le bâton et que le corps s\'effondre. Le Coran conclut : "Quand les djinns comprirent qu\'il était mort... si les djinns avaient connu l\'Inconnu, ils ne seraient pas restés dans le châtiment humiliant" du travail forcé, prouvant qu\'ils n\'avaient jamais eu accès au savoir caché (Coran 34:14).',
      },
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
      {
        question: 'Quel oiseau apporta à Sulayman la nouvelle du royaume de Saba ?',
        options: ['Le corbeau', 'La huppe (hudhud)', 'L\'aigle', 'Le faucon'],
        correct: 1,
        explication: 'Absente puis de retour, la huppe rapporta à Sulayman l\'existence d\'un royaume gouverné par Bilqis dont le peuple adorait le soleil (Coran 27:20-24).',
      },
    ],
  },
  {
    id: 'ilyas',
    nom: 'Ilyas',
    nomBiblique: 'Élie',
    arabe: 'إِلْيَاس',
    surnom: 'Prophète de Ba\'labakk',
    periode: 'Environ 850 av. J.-C.',
    resume: 'Ilyas fut envoyé aux Bani Israël qui adoraient l\'idole Ba\'l. Il les affronta seul, fut chassé par son peuple, et Allah le salua jusqu\'au Jour dernier. Son nom signifie "Mon Dieu est Seigneur".',
    histoire: [
      {
        etape: 'Un peuple tombé dans l\'idolâtrie',
        texte: 'Ibn Kathir situe Ilyas plusieurs générations après Musa, envoyé aux Bani Israël de Ba\'labakk (l\'actuelle Baalbek, au Liban). Ce peuple, pourtant héritier du monothéisme transmis par Musa et Harun, s\'était détourné d\'Allah pour adorer une idole appelée Ba\'l — selon les récits, une statue dorée de grande taille érigée dans leur cité.',
      },
      {
        etape: 'L\'appel à l\'adoration exclusive d\'Allah',
        texte: 'Ilyas les affronta avec des mots d\'une clarté totale : "Ne craignez-vous pas [Allah] ? Invoquez-vous Ba\'l et délaissez-vous le Meilleur des créateurs, Allah, votre Seigneur et le Seigneur de vos plus anciens ancêtres ?" (Coran 37:124-126). Il ne leur proposait rien de nouveau, seulement un retour à la foi de leurs propres pères.',
      },
      {
        etape: 'Le rejet et la solitude du prophète',
        texte: 'Le peuple le traita de menteur. Le Coran précise : "Ils le traitèrent de menteur. Ils seront tous emmenés [au châtiment], sauf les serviteurs élus d\'Allah" (Coran 37:127-128) — seule une poignée de croyants sincères échappa au sort commun. Comme Ayyub avant lui, Ilyas se retrouva pratiquement seul à défendre le Tawhid face à une nation entière, sans jamais fléchir dans sa mission.',
      },
      {
        etape: 'Une salutation éternelle',
        texte: 'Malgré ce rejet, Allah lui accorda un honneur rare, réservé à très peu de prophètes : être salué par les générations futures jusqu\'au Jour dernier. "Et Nous avons laissé sur lui [ce salut] parmi les générations ultérieures : Paix sur Ilyas ! (Ilyasin, selon une autre lecture) — c\'est ainsi que Nous récompensons les bienfaisants. Il était du nombre de Nos serviteurs croyants" (Coran 37:129-132).',
      },
      {
        etape: 'La transmission à Al-Yasa\'',
        texte: 'Selon la tradition, arrivé au terme de sa mission, Ilyas transmit le flambeau de la prophétie à son disciple Al-Yasa\', qui continua après lui à appeler les Bani Israël vers Allah — assurant que l\'appel à la vérité ne s\'éteint jamais avec un seul homme, mais se poursuit de génération en génération.',
      },
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
      {
        question: 'À qui Ilyas transmit-il, selon la tradition, la mission prophétique auprès des Bani Israël ?',
        options: ['À son fils', 'À son disciple Al-Yasa\'', 'À Dhul-Kifl', 'À Zakariya'],
        correct: 1,
        explication: 'Selon la tradition, Ilyas transmit le flambeau de la prophétie à son disciple Al-Yasa\', qui poursuivit l\'appel après lui.',
      },
    ],
  },
  {
    id: 'al-yasa',
    nom: "Al-Yasa'",
    nomBiblique: 'Élisée',
    arabe: 'الْيَسَع',
    surnom: 'Successeur d\'Ilyas',
    periode: 'Environ 850 av. J.-C.',
    resume: "Al-Yasa' est le successeur et disciple d'Ilyas. Le Coran le cite deux fois parmi les vertueux. Il continua la mission prophétique aux Bani Israël après Ilyas.",
    histoire: [
      {
        etape: 'Le disciple qui reprit le flambeau',
        texte: "Ibn Kathir rapporte qu'Al-Yasa' fut le disciple le plus proche d'Ilyas, celui qui l'accompagna fidèlement durant sa mission. Lorsque celle-ci s'acheva, Al-Yasa' reprit la charge prophétique auprès des Bani Israël, poursuivant sans interruption l'appel à l'adoration exclusive d'Allah que son maître avait porté avant lui.",
      },
      {
        etape: "Une mention discrète mais honorable",
        texte: "Le Coran le cite deux fois, toujours aux côtés d'autres prophètes exemplaires : une première fois parmi ceux qu'Allah a guidés et \"préférés sur les mondes\" (Coran 6:86-87), une seconde fois aux côtés d'Ismaïl et de Dhul-Kifl parmi les Akhyar, les meilleurs des serviteurs (Coran 38:48). Contrairement à Musa ou Yusuf, aucun épisode détaillé de sa vie n'est développé dans le Coran ou dans les recueils authentiques de hadith.",
      },
      {
        etape: "La valeur qui ne dépend pas du récit",
        texte: "Cette sobriété narrative n'enlève rien à sa valeur devant Allah. Ibn Kathir souligne que la brièveté d'un récit prophétique dans le Coran n'indique jamais un rang inférieur : Al-Yasa' est explicitement classé parmi les meilleurs, un rappel que la reconnaissance d'Allah se mesure à la sincérité du service rendu, non à la place qu'on occupe dans le récit.",
      },
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
      {
        question: "Que retenir de la brièveté du récit d'Al-Yasa' dans le Coran, selon Ibn Kathir ?",
        options: [
          "Qu'il fut un prophète de rang inférieur",
          "Que la brièveté d'un récit n'indique jamais un rang inférieur devant Allah",
          "Qu'il n'exerça jamais réellement sa mission",
          "Que son histoire a été perdue",
        ],
        correct: 1,
        explication: "Ibn Kathir souligne que la sobriété narrative d'un prophète ne diminue en rien sa valeur : Al-Yasa' est explicitement classé parmi les meilleurs.",
      },
    ],
  },
  {
    id: 'yunus',
    nom: 'Yunus',
    nomBiblique: 'Jonas',
    arabe: 'يُونُس',
    surnom: 'Dhul-Nun — l\'Homme du poisson',
    periode: 'Environ 800 av. J.-C.',
    resume: 'Yunus quitta son peuple en colère, sans attendre l\'ordre d\'Allah, et fut avalé par un grand poisson. Dans les ténèbres, il fit un du\'a d\'une profondeur unique — et son peuple fut le seul, dans tout le Coran, à être épargné après avoir cru en voyant venir le châtiment.',
    histoire: [
      {
        etape: 'Le prophète de Ninive et l\'annonce du châtiment',
        texte: 'Yunus fut envoyé au peuple de Ninive, en Irak actuel. Après un long rejet de son message, il les avertit qu\'un châtiment s\'abattrait sur eux dans un délai fixé, puis quitta la ville, découragé, avant même que ce délai ne soit écoulé.',
      },
      {
        etape: 'Le repentir in extremis du peuple',
        texte: 'Ibn Kathir rapporte, en s\'appuyant sur Coran 10:98, un événement unique dans l\'histoire des nations châtiées : voyant approcher les signes annonciateurs du châtiment, le peuple de Ninive se repentit sincèrement avant qu\'il ne s\'abatte sur eux. Allah leur fit alors miséricorde et retira l\'épreuve : "Pourquoi n\'y a-t-il eu aucune cité qui ait cru et à qui sa foi ait profité, sinon le peuple de Yunus ? Quand ils crurent, Nous leur enlevâmes le châtiment d\'humiliation dans la vie présente" (Coran 10:98) — le seul peuple, parmi tous ceux mentionnés dans le Coran, à avoir été épargné après avoir vu le châtiment venir.',
      },
      {
        etape: 'Un départ sans attendre l\'ordre d\'Allah',
        texte: 'Ignorant ce repentir de dernière heure et pensant sa mission un échec, Yunus s\'en alla en colère, sans attendre la permission divine de quitter son peuple : "Souviens-toi de l\'homme au poisson (Dhul-Nun), quand il s\'en alla en colère" (Coran 21:87). Cette décision — compréhensible dans son découragement, mais prématurée — attira sur lui une épreuve extraordinaire.',
      },
      {
        etape: 'Le tirage au sort et l\'engloutissement',
        texte: 'Yunus monta sur un bateau surchargé, pris dans une tempête violente. Pour l\'alléger, l\'équipage tira au sort qui devrait être jeté à la mer, et le sort tomba trois fois sur Yunus (Coran 37:140-141). Une fois à l\'eau, un grand poisson (hut), envoyé par Allah, l\'avala entier sans le blesser : "Il se jeta à la mer alors qu\'il était blâmable. Un poisson l\'avala, car il était blâmable" (Coran 37:142).',
      },
      {
        etape: 'Le du\'a dans les trois ténèbres',
        texte: 'Enfermé dans les ténèbres superposées de la nuit, des profondeurs marines et du ventre du poisson, Yunus reconnut sa faute et se tourna entièrement vers Allah par l\'un des du\'as les plus puissants du Coran : "Il n\'y a de divinité que Toi ! Gloire à Toi ! J\'ai été vraiment du nombre des injustes" (Coran 21:87). Allah précise l\'importance de cette invocation : "Si ce n\'était qu\'il fut du nombre de ceux qui glorifient Allah, il serait resté dans son ventre jusqu\'au jour où l\'on sera ressuscité" (Coran 37:143-144).',
      },
      {
        etape: 'La délivrance et la plante de yaqtin',
        texte: 'Allah l\'exauça et le fit rejeter sur une rive nue et déserte, le corps affaibli par l\'épreuve. Par miséricorde, Il fit pousser au-dessus de lui une plante de courge (yaqtin), dont les larges feuilles l\'abritèrent du soleil pendant sa convalescence (Coran 37:145-146). Puis Allah le renvoya vers son peuple — celui-là même qui avait fini par croire — et le Coran conclut : "Nous l\'envoyâmes vers cent mille hommes ou plus ; ils crurent, et Nous leur accordâmes jouissance pour un temps" (Coran 37:147-148).',
      },
      {
        etape: 'Un rappel d\'humilité pour tous',
        texte: 'Malgré ce moment de faiblesse, la stature de Yunus reste immense devant Allah. Le Prophète ﷺ mit en garde contre toute parole qui rabaisserait ce prophète : "Il ne convient à personne de dire que je suis meilleur que Yunus fils de Matta" (Sahih al-Bukhari, n°3416) — un rappel que même l\'instant de découragement d\'un prophète ne diminue en rien son rang auprès d\'Allah, dès lors qu\'il revient sincèrement à Lui.',
      },
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
        question: 'Qu\'a d\'unique le peuple de Yunus parmi tous les peuples mentionnés dans le Coran ?',
        options: [
          'Ils furent le seul peuple à ne jamais recevoir de prophète',
          'Ils crurent en voyant venir le châtiment et furent épargnés',
          'Ils furent détruits malgré leur foi',
          'Ils devinrent tous prophètes',
        ],
        correct: 1,
        explication: 'Coran 10:98 : le peuple de Yunus est le seul cité dans le Coran à avoir cru en voyant approcher le châtiment, et à qui Allah retira l\'épreuve pour cette raison.',
      },
      {
        question: 'Quelle plante Allah fit-Il pousser pour ombrer Yunus après sa délivrance ?',
        options: ['Un palmier', 'Une vigne', 'Un yaqtin (courge)', 'Un olivier'],
        correct: 2,
        explication: 'Allah fit pousser au-dessus de lui une plante de yaqtin pour l\'ombrer après qu\'il eut été recraché sur le rivage (Coran 37:146).',
      },
      {
        question: 'Que dit le Prophète ﷺ pour rappeler la haute stature de Yunus malgré son moment de découragement ?',
        options: [
          '"Yunus est le moindre des prophètes"',
          '"Il ne convient à personne de dire que je suis meilleur que Yunus fils de Matta"',
          '"Yunus n\'était pas un vrai prophète"',
          '"Que personne ne prie pour Yunus"',
        ],
        correct: 1,
        explication: 'Sahih al-Bukhari (n°3416) : le Prophète ﷺ rappela qu\'il ne sied à personne de se prétendre meilleur que Yunus fils de Matta.',
      },
    ],
  },
  {
    id: 'zakariya',
    nom: 'Zakariya',
    nomBiblique: 'Zacharie',
    arabe: 'زَكَرِيَّا',
    surnom: 'Gardien de Maryam',
    periode: 'Environ 1er siècle av. J.-C.',
    resume: 'Zakariya était le tuteur de la Vierge Maryam et un vieux prêtre du Temple. Vieux et sans enfant, il pria Allah pour un héritier qui perpétuerait la prophétie. Allah lui accorda Yahya comme un miracle.',
    histoire: [
      {
        etape: 'Le tuteur émerveillé par les provisions de Maryam',
        texte: 'Zakariya était prêtre du Temple de Jérusalem et tuteur de Maryam bint Imran. Chaque fois qu\'il entrait chez elle dans son mihrab (oratoire), il y trouvait des provisions hors saison. Il demanda : "Ô Maryam, d\'où te vient cela ?" Elle répondit : "Cela vient d\'Allah — Allah pourvoit à qui Il veut sans compter" (Coran 3:37). Ce spectacle de la grâce divine ranima en Zakariya l\'espoir que rien n\'est impossible à Allah.',
      },
      {
        etape: 'La crainte pour l\'héritage de la foi',
        texte: 'Zakariya, âgé et à la santé déclinante, s\'inquiétait de laisser sa mission sans successeur : "Je crains [le comportement de] mes héritiers après moi, tandis que ma femme est stérile. Accorde-moi, de Ta part, un descendant qui hérite de moi et hérite de la famille de Yaqub" (Coran 19:5-6). Ibn Kathir précise que cet héritage réclamé n\'était pas matériel mais spirituel — la continuité de la guidance et de la prophétie —, conformément à la parole authentique du Prophète ﷺ : "Nous, la communauté des prophètes, ne laissons pas d\'héritage ; ce que nous laissons est une aumône" (Sahih al-Bukhari, n°6730).',
      },
      {
        etape: 'La supplique secrète et la réponse',
        texte: 'Zakariya invoqua Allah en secret, loin des regards : "Il invoqua son Seigneur d\'un appel secret. Il dit : Seigneur, mes os sont devenus faibles et ma tête s\'est enflammée de cheveux blancs, sans que je n\'aie jamais été malheureux dans mes invocations vers Toi" (Coran 19:3-4). Alors qu\'il priait dans le mihrab, les anges l\'appelèrent pour lui donner une nouvelle inespérée : "Allah t\'annonce la naissance de Yahya" (Coran 3:39), un fils qui allait confirmer une parole d\'Allah — "et Nous ne lui avions pas donné auparavant d\'homonyme" (Coran 19:7), car nul avant lui n\'avait porté ce nom.',
      },
      {
        etape: 'Le signe du silence',
        texte: 'Étonné, Zakariya demanda un signe confirmant cette annonce, lui si âgé et sa femme stérile. Allah lui répondit : "Ton signe est que tu ne pourras parler aux gens pendant trois jours, sinon par gestes" (Coran 19:10 ; 3:41), bien qu\'il fût en parfaite santé. Ces trois jours de silence devinrent pour lui une retraite de glorification intense, "matin et soir" (Coran 19:11), avant la naissance de Yahya.',
      },
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
      {
        question: 'Quel type d\'héritage Zakariya demandait-il réellement à Allah, selon la précision d\'Ibn Kathir ?',
        options: [
          'Un héritage matériel et financier',
          'Un héritage spirituel : la continuité de la guidance et de la prophétie',
          'Le trône du Temple',
          'Les terres de sa famille',
        ],
        correct: 1,
        explication: 'Le Prophète ﷺ a précisé : "Nous, la communauté des prophètes, ne laissons pas d\'héritage ; ce que nous laissons est une aumône" (Sahih al-Bukhari, n°6730) — la demande de Zakariya visait un héritier spirituel, non des biens.',
      },
    ],
  },
  {
    id: 'yahya',
    nom: 'Yahya',
    nomBiblique: 'Jean-Baptiste',
    arabe: 'يَحْيَى',
    surnom: 'Jean le Baptiste',
    periode: 'Environ 1er siècle av. J.-C.',
    resume: 'Yahya est le fils de Zakariya, né d\'un miracle. Il fut le premier à porter ce nom. Prophète de pureté et de compassion, il confirma la prophétie d\'Isa. Allah lui accorda le Hukm (la sagesse) dès l\'enfance.',
    histoire: [
      {
        etape: 'Une naissance sans précédent',
        texte: 'Yahya naquit du miracle accordé à Zakariya et à son épouse âgée et stérile, en réponse à une invocation secrète et sincère (Coran 19:2-9). Allah l\'honora d\'un prénom qu\'aucun homme avant lui n\'avait porté : "Ô Zakariya, Nous t\'annonçons la bonne nouvelle d\'un fils : son nom sera Yahya. Nous ne lui avons pas donné auparavant d\'homonyme" (Coran 19:7).',
      },
      {
        etape: 'La sagesse et la pureté dès l\'enfance',
        texte: 'Allah lui accorda un don rarissime, réservé à très peu de créatures : le Hukm — la sagesse et la fermeté dans la compréhension du Livre — alors qu\'il n\'était encore qu\'un enfant : "Ô Yahya, prends le Livre fermement ! Et Nous lui avons accordé la sagesse quand il était encore enfant, ainsi que la tendresse de Notre part et la pureté ; il craignait Allah" (Coran 19:12-13).',
      },
      {
        etape: 'La maîtrise de soi et la compassion',
        texte: 'Le Coran le décrit comme "un chef, un homme chaste maîtrisant ses passions, et un prophète du nombre des vertueux" (Coran 3:39). Il ajoute qu\'il fut "plein de bonté envers ses parents, et ne fut ni violent ni désobéissant" (Coran 19:14) — un équilibre rare entre rigueur spirituelle envers soi-même et douceur envers autrui.',
      },
      {
        etape: 'Le confirmateur d\'Isa',
        texte: 'Les anges annoncèrent à Zakariya que son fils viendrait "confirmer une parole d\'Allah" (Coran 3:39) — une allusion à Isa, appelé "une parole venant de Lui". Yahya et Isa, cousins selon la tradition, grandirent en confirmant mutuellement leurs missions respectives auprès des Bani Israël, tous deux messagers de la même vérité.',
      },
      {
        etape: 'Une paix accordée trois fois',
        texte: 'Selon les récits historiques rapportés notamment par Ibn Kathir, Yahya fut mis à mort sur ordre d\'un roi tyrannique de son époque, cédant à la demande d\'une femme de son entourage — un épisode transmis par la tradition historique plus que par le texte coranique lui-même. Le Coran, en revanche, affirme avec certitude la faveur qu\'Allah lui accorda : "Paix sur lui le jour où il naquit, le jour où il mourra, et le jour où il sera ressuscité vivant" (Coran 19:15) — une paix divine embrassant les trois moments les plus redoutés de toute vie humaine.',
      },
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
      {
        question: 'Quel prophète Yahya vint-il confirmer, selon Coran 3:39 ?',
        options: ['Musa', 'Isa, "une parole venant d\'Allah"', 'Ibrahim', 'Zakariya lui-même'],
        correct: 1,
        explication: 'Les anges annoncèrent que Yahya viendrait "confirmer une parole d\'Allah" — une allusion à Isa, son cousin selon la tradition.',
      },
    ],
  },
  {
    id: 'isa',
    nom: 'Isa',
    nomBiblique: 'Jésus',
    arabe: 'عِيسَى',
    surnom: 'Ruhullah — Esprit d\'Allah / Al-Masih',
    periode: 'Environ 1er siècle',
    resume: 'Isa naquit sans père d\'une mère vierge, Maryam. Il parla dès le berceau pour défendre sa mère. Prophète de miséricorde, il guérit les aveugles, ressuscita des morts et annonça la venue de Muhammad ﷺ.',
    histoire: [
      {
        etape: 'L\'annonciation à Maryam',
        texte: 'L\'ange Jibril apparut à Maryam "sous la forme d\'un homme parfait" (Coran 19:17) et lui annonça qu\'elle enfanterait un fils pur, sans qu\'aucun homme ne l\'ait touchée. Bouleversée, elle demanda : "Comment aurais-je un fils, alors qu\'aucun homme ne m\'a touchée et que je ne suis pas prostituée ?" (Coran 19:20) Jibril répondit que la chose était aisée pour Allah : "Il en est ainsi ! Ton Seigneur a dit : Ceci M\'est facile... Quand Il décide une chose, Il dit seulement : Sois ! et elle est" (Coran 19:21 ; 3:47).',
      },
      {
        etape: 'La naissance sous le palmier',
        texte: 'Maryam se retira seule, loin des siens, dans un lieu éloigné. Les douleurs de l\'enfantement la surprirent près d\'un palmier sec ; désespérée, elle s\'écria qu\'elle aurait préféré mourir et être oubliée. Une voix — celle de l\'ange ou de l\'enfant lui-même — la réconforta : "Ne t\'afflige pas. Ton Seigneur a placé à tes pieds un ruisseau. Secoue vers toi le tronc du palmier : il fera tomber sur toi des dattes fraîches et mûres" (Coran 19:23-25), un double miracle de subsistance au cœur de sa détresse.',
      },
      {
        etape: 'Le miracle du berceau',
        texte: 'De retour vers les siens portant l\'enfant, elle fut accusée d\'un grand péché. Fidèle à son vœu de silence, elle désigna Isa du doigt. Le peuple s\'étonna : "Comment parlerions-nous à un bébé au berceau ?" Mais Isa parla, dévoilant sa mission dès ses premiers mots : "Je suis le serviteur d\'Allah. Il m\'a donné le Livre et a fait de moi un prophète... Il m\'a enjoint la prière et la zakat tant que je vivrai, et [m\'a rendu] bon envers ma mère" (Coran 19:30-32) — un miracle qui innocenta Maryam sur-le-champ.',
      },
      {
        etape: 'Les miracles de sa mission',
        texte: 'Devenu adulte, Isa annonça à son peuple des signes accordés "par la permission d\'Allah" — jamais de son propre pouvoir : il façonnait avec de l\'argile la forme d\'un oiseau qui, une fois soufflé, prenait vie ; il guérissait l\'aveugle-né et le lépreux ; il ressuscitait les morts ; il informait les gens de ce qu\'ils mangeaient et gardaient en réserve dans leurs maisons (Coran 3:49). Ses disciples, les Hawariyyun, lui demandèrent une table servie descendue du ciel comme signe pour affermir leur cœur ; Allah l\'exauça, en avertissant que quiconque mécroirait ensuite serait sévèrement châtié (Coran 5:112-115).',
      },
      {
        etape: 'Le complot déjoué',
        texte: 'Rejeté par une partie des Bani Israël qui complotèrent pour le faire tuer, Isa fut sauvé par Allah Lui-même : "Ils ne l\'ont ni tué ni crucifié, mais ce fut pour eux une chose semblable... Ils ne l\'ont certainement pas tué. Mais Allah l\'a élevé vers Lui" (Coran 4:157-158). Le Coran affirme ainsi avec une clarté totale qu\'Isa fut préservé, contrairement à ce qu\'ont cru ses ennemis.',
      },
      {
        etape: 'L\'annonce du dernier prophète',
        texte: 'Isa lui-même annonça la venue de celui qui viendrait clore la chaîne des messagers : "Ô fils d\'Israël, je suis le messager d\'Allah vers vous... annonçant un messager à venir après moi, dont le nom sera Ahmad" (Coran 61:6) — une préfiguration explicite de la mission de Muhammad ﷺ.',
      },
      {
        etape: 'Le retour attendu',
        texte: 'Le Prophète ﷺ a enseigné qu\'Isa n\'est pas mort mais reviendra à la fin des temps, descendant à l\'est de Damas, brisant les croix, abolissant l\'impôt injuste et rétablissant le culte exclusif d\'Allah, avant de vaincre le Dajjal et de connaître, cette fois, une mort naturelle (Sahih Muslim, n°2937). Cette fin paisible, après une vie entière consacrée au Tawhid, couronne le parcours de celui qui répéta sans relâche : "Adorez Allah, mon Seigneur et votre Seigneur" (Coran 5:117).',
      },
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
      {
        question: 'Que demandèrent les disciples (Hawariyyun) d\'Isa comme signe pour affermir leur foi ?',
        options: [
          'Un déluge',
          'Une table servie descendue du ciel',
          'La résurrection de leurs ancêtres',
          'Un livre écrit sur pierre',
        ],
        correct: 1,
        explication: 'Coran 5:112-115 : les disciples demandèrent une table (Al-Ma\'ida) descendue du ciel comme signe, et Allah l\'exauça en avertissant du châtiment pour quiconque mécroirait ensuite.',
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
      {
        etape: 'Une enfance marquée par l\'épreuve',
        texte: 'Muhammad ﷺ naquit à La Mecque en 570, l\'année dite "de l\'Éléphant", après l\'échec de l\'expédition d\'Abraha contre la Kaaba (Coran 105). Orphelin de père avant même sa naissance, il perdit sa mère Aminah à six ans, puis son grand-père Abdul-Muttalib à huit ans. Élevé ensuite par son oncle Abu Talib, il travailla très jeune comme berger, puis comme commerçant dans les caravanes, où sa droiture lui valut, bien avant la révélation, le surnom d\'Al-Amin — le Digne de confiance — reconnu par tout Quraych. À 25 ans, il épousa Khadijah bint Khuwaylid, une riche commerçante de quinze ans son aînée, qui devint son plus grand soutien.',
      },
      {
        etape: 'La première révélation dans la grotte de Hira',
        texte: 'À 40 ans, Muhammad ﷺ avait pris l\'habitude de se retirer en méditation dans la grotte de Hira, aux abords de La Mecque. C\'est là que l\'ange Jibril lui apparut et lui ordonna : "Lis !" Effrayé, il répondit qu\'il ne savait pas lire, jusqu\'à ce que Jibril lui révèle les premiers versets : "Lis, au nom de ton Seigneur qui a créé, qui a créé l\'homme d\'une adhérence. Lis ! Ton Seigneur est le Très Noble" (Coran 96:1-3). Bouleversé, il rentra tremblant chez Khadijah, qui le rassura avec des mots restés célèbres : "Allah ne t\'humiliera jamais, car tu es bon envers tes proches, tu aides les faibles, tu es généreux envers l\'hôte et tu soutiens les gens dans les épreuves du destin" (Sahih al-Bukhari, n°3).',
      },
      {
        etape: 'La persécution et l\'année de la tristesse',
        texte: 'La prédication, d\'abord secrète puis publique, se heurta au rejet violent des notables de Quraych, attachés à l\'idolâtrie et à leurs privilèges. Les premiers musulmans pauvres ou esclaves, comme Bilal ibn Rabah, furent torturés pour les forcer à renier leur foi. Le clan du Prophète ﷺ subit un boycott total pendant trois ans, privé de commerce et de mariage avec le reste de la tribu. En l\'an 10 de la mission, surnommée "l\'année de la tristesse", il perdit coup sur coup Khadijah, son épouse et soutien de toujours, et Abu Talib, son oncle protecteur. Il se rendit alors seul à Taïf pour y prêcher et y fut lapidé par la population, rentrant blessé et humilié — épisode où, selon la tradition, l\'ange des montagnes lui proposa d\'écraser la ville entre deux monts, et où le Prophète ﷺ répondit qu\'il espérait encore que leur descendance adore Allah seul (Sahih al-Bukhari, n°3231).',
      },
      {
        etape: 'Al-Isra wal-Mi\'raj, le Voyage nocturne',
        texte: 'Peu avant l\'émigration, Allah honora Son Messager d\'un voyage miraculeux en une seule nuit : de la Mecque à la mosquée Al-Aqsa de Jérusalem (Al-Isra, Coran 17:1), puis une ascension à travers les sept cieux (Al-Mi\'raj), où il rencontra plusieurs prophètes dont Adam, Idris, Musa et Ibrahim, avant de recevoir directement d\'Allah l\'ordre des cinq prières quotidiennes.',
      },
      {
        etape: 'L\'Hégire vers Médine',
        texte: 'Face à un complot mecquois visant à l\'assassiner, le Prophète ﷺ émigra vers Yathrib (Médine) avec Abu Bakr, se cachant trois jours dans la grotte de Thawr pendant que ses poursuivants les cherchaient — un moment d\'angoisse apaisé par ses mots à Abu Bakr : "Ne t\'afflige pas, Allah est avec nous" (Coran 9:40). À Médine, il scella une fraternité sans précédent entre les Muhajirun (émigrés mecquois) et les Ansar (habitants médinois), posant les bases de la première communauté musulmane organisée.',
      },
      {
        etape: 'Les grandes batailles et le traité de Hudaybiyya',
        texte: 'La jeune communauté dut ensuite défendre son existence : la victoire de Badr contre une armée mecquoise trois fois supérieure en nombre, l\'épreuve d\'Uhud où le Prophète ﷺ fut blessé, puis la bataille du Fossé (Al-Khandaq) où une tranchée creusée sur son conseil mit en échec le siège d\'une coalition de tribus. En l\'an 6 de l\'Hégire, le traité de Hudaybiyya, bien que perçu comme défavorable par plusieurs compagnons, ouvrit la voie à une paix qui permit à l\'islam de se répandre plus largement que par les armes.',
      },
      {
        etape: 'La conquête de La Mecque et le pardon',
        texte: 'En l\'an 8 de l\'Hégire, le Prophète ﷺ entra à La Mecque à la tête de dix mille compagnons, sans effusion de sang. Il purifia la Kaaba de ses trois-cent-soixante idoles et, devant ceux qui l\'avaient persécuté, exilé et combattu pendant des années, il déclara : "Allez, vous êtes libres" — reprenant les mots de Yusuf envers ses frères. Cette amnistie générale envers ses pires ennemis reste l\'un des sommets de son caractère miséricordieux.',
      },
      {
        etape: 'Le pèlerinage d\'adieu et la fin de la mission',
        texte: 'En l\'an 10 de l\'Hégire, il accomplit son unique et dernier pèlerinage, prononçant devant plus de cent mille compagnons un sermon d\'adieu fixant les principes intangibles de l\'islam : sacralité de la vie, des biens et de l\'honneur ; interdiction de l\'usure et de la vengeance tribale ; égalité entre les hommes "comme les dents d\'un peigne", "un Arabe n\'a aucune supériorité sur un non-Arabe, si ce n\'est par la piété" ; droits réciproques des époux. Il y reçut la révélation : "Aujourd\'hui, J\'ai parachevé pour vous votre religion, complété sur vous Mon bienfait, et agréé pour vous l\'islam comme religion" (Coran 5:3).',
      },
      {
        etape: 'Un caractère qui était le Coran',
        texte: 'Il quitta ce monde à Médine en 632, après 23 années de mission, sans laisser de richesse matérielle. Interrogée sur son caractère, son épouse Aïsha répondit simplement : "Son caractère était le Coran" (Sahih Muslim, n°746) — il réparait lui-même ses sandales, participait aux tâches domestiques, ne se vengeait jamais pour lui-même, et fut décrit par le Coran comme "envoyé en miséricorde pour les mondes" (Coran 21:107).',
      },
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
      {
        question: 'Quel principe le Prophète ﷺ affirma-t-il lors de son sermon d\'adieu, pendant le pèlerinage d\'adieu ?',
        options: [
          'La supériorité de certaines tribus arabes',
          'Qu\'un Arabe n\'a aucune supériorité sur un non-Arabe, si ce n\'est par la piété',
          'L\'abolition de la prière',
          'Le maintien de la vengeance tribale',
        ],
        correct: 1,
        explication: 'Dans son sermon d\'adieu, le Prophète ﷺ proclama l\'égalité entre les hommes, "comme les dents d\'un peigne", sans distinction si ce n\'est par la piété.',
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
