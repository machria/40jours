const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'nawawi.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Authoritative Data for 40 Hadiths of Nawawi
// Format: ID -> { french, narrator, grade, theme }
const corrections = {
    1: {
        narrator: "Omar ibn al-Khattab (qu'Allah l'agrée)",
        grade: "Sahih Boukhari et Mouslim",
        theme: "tazkiya",
        french: "Les actes ne valent que par les intentions, et chacun ne récoltera que ce qu'il a eu l'intention d'acquérir. Ainsi, celui dont l'émigration (hijra) a pour but Allah et Son Messager, son émigration sera comptée comme étant pour Allah et Son Messager. Et celui dont l'émigration a pour but un bien de ce monde ou une femme à épouser, son émigration ne sera comptée que pour ce vers quoi il a émigré."
    },
    2: {
        narrator: "Omar ibn al-Khattab (qu'Allah l'agrée)",
        grade: "Sahih Mouslim",
        theme: "aqida",
        french: "Un jour que nous étions assis auprès du Messager d'Allah (ﷺ), un homme aux vêtements très blancs et aux cheveux très noirs apparut. On ne voyait sur lui aucune trace de voyage et nul parmi nous ne le connaissait. Il s'assit face au Prophète (ﷺ), appuya ses genoux contre les siens et posa les paumes de ses mains sur ses cuisses. Il dit : « Ô Mohammed, informe-moi sur l'Islam. » Le Messager d'Allah (ﷺ) répondit : « L'Islam consiste à attester qu'il n'y a pas de divinité digne d'adoration sauf Allah et que Mohammed est le Messager d'Allah, à accomplir la Prière, à s'acquitter de la Zakat, à jeûner le mois de Ramadan et à effectuer le Pèlerinage à la Maison Sacrée si tu en as la possibilité. » L'homme dit : « Tu as dit vrai. » Nous fûmes étonnés de le voir l'interroger et approuver sa réponse. Il dit ensuite : « Informe-moi sur la Foi (Iman). » Le Prophète répondit : « C'est de croire en Allah, en Ses Anges, en Ses Livres, en Ses Messagers, au Jour Dernier et de croire au Destin, qu'il soit bon ou mauvais. » L'homme dit : « Tu as dit vrai. » Il ajouta : « Informe-moi sur l'Excellence (Ihsan). » Le Prophète répondit : « C'est d'adorer Allah comme si tu Le voyais, car si tu ne Le vois pas, certes, Lui te voit. » L'homme dit : « Informe-moi sur l'Heure. » Le Prophète répondit : « L'interrogé n'en sait pas plus que celui qui l'interroge. » L'homme dit : « Informe-moi alors sur ses signes. » Il dit : « C'est lorsque la servante engendrera sa maîtresse, et lorsque tu verras les va-nu-pieds, les déguenillés et les miséreux, gardiens de bêtes, rivaliser dans l'élévation des constructions. » Puis l'homme partit. Je restai un moment, puis le Prophète (ﷺ) me dit : « Ô Omar, sais-tu qui était celui qui m'interrogeait ? » Je répondis : « Allah et Son Messager le savent mieux. » Il dit : « C'était Jibril (Gabriel), il est venu vous enseigner votre religion. »"
    },
    3: {
        narrator: "Abdallah ibn Omar (qu'Allah les agrée)",
        grade: "Sahih Boukhari et Mouslim",
        theme: "ibadat",
        french: "L'Islam est bâti sur cinq piliers : L'attestation qu'il n'y a pas de divinité digne d'adoration sauf Allah et que Mohammed est le Messager d'Allah, l'accomplissement de la Prière, l'acquittement de la Zakat, le Pèlerinage à la Maison (Hajj) et le jeûne du Ramadan."
    },
    4: {
        narrator: "Abdallah ibn Mas'oud (qu'Allah l'agrée)",
        grade: "Sahih Boukhari et Mouslim",
        theme: "aqida",
        french: "La création de chacun d'entre vous est réunie dans le ventre de sa mère pendant quarante jours sous forme de goutte (nutfah), puis il devient une adhérence (alaqah) pendant une période semblable, puis un morceau de chair (mudghah) pendant une période semblable. Ensuite, Allah lui envoie un Ange qui insuffle l'âme en lui, et il reçoit l'ordre d'écrire quatre choses : sa subsistance (rizq), son terme, ses actions et s'il sera malheureux ou heureux. Par Allah, en dehors de Qui il n'y a pas de divinité, l'un d'entre vous accomplit les actes des gens du Paradis jusqu'à ce qu'il ne reste entre lui et le Paradis qu'une coudée ; mais ce qui est écrit le devance, il accomplit alors les actes des gens de l'Enfer et y entre. Et l'un d'entre vous accomplit les actes des gens de l'Enfer jusqu'à ce qu'il ne reste entre lui et l'Enfer qu'une coudée ; mais ce qui est écrit le devance, il accomplit alors les actes des gens du Paradis et y entre."
    },
    5: {
        narrator: "Aïcha (qu'Allah l'agrée)",
        grade: "Sahih Boukhari et Mouslim",
        theme: "aqida",
        french: "Celui qui innove dans notre affaire-ci (l'Islam) une chose qui n'en fait pas partie, cela lui sera rejeté."
    },
    6: {
        narrator: "Al-Nu'man ibn Bachir (qu'Allah l'agrée)",
        grade: "Sahih Boukhari et Mouslim",
        theme: "muamalat",
        french: "Certes, le licite est évident et l'illicite est évident. Entre les deux, il y a des choses équivoques que beaucoup de gens ne connaissent pas. Celui qui se préserve des choses équivoques préserve sa religion et son honneur. Mais celui qui tombe dans les choses équivoques tombe dans l'illicite, comme le berger qui fait paître son troupeau autour d'un enclos réservé, risquant à tout moment d'y pénétrer. Attention ! Chaque roi a un domaine réservé. Attention ! Le domaine réservé d'Allah sur Sa terre, ce sont Ses interdits. Attention ! Il y a dans le corps un morceau de chair : s'il est sain, tout le corps est sain, mais s'il est corrompu, tout le corps est corrompu. Attention ! C'est le cœur."
    },
    7: {
        narrator: "Tamim ad-Dari (qu'Allah l'agrée)",
        grade: "Sahih Mouslim",
        theme: "adab",
        french: "La religion, c'est la sincérité (Nasîha). » Nous dîmes : « Envers qui ? » Il dit : « Envers Allah, Son Livre, Son Messager, les dirigeants des musulmans et le commun des musulmans. »"
    },
    8: {
        narrator: "Abdallah ibn Omar (qu'Allah les agrée)",
        grade: "Sahih Boukhari et Mouslim",
        theme: "aqida",
        french: "Il m'a été ordonné de combattre les gens jusqu'à ce qu'ils attestent qu'il n'y a de divinité digne d'adoration qu'Allah et que Mohammed est le Messager d'Allah, qu'ils accomplissent la Prière et s'acquittent de la Zakat. S'ils font cela, ils auront préservé vis-à-vis de moi leur sang et leurs biens, sauf ce que l'Islam permet d'en prélever légalement, et leur compte incombe à Allah."
    },
    9: {
        narrator: "Abou Houraira (qu'Allah l'agrée)",
        grade: "Sahih Boukhari et Mouslim",
        theme: "adab",
        french: "Ce que je vous ai interdit, évitez-le, et ce que je vous ai ordonné, accomplissez-le dans la mesure de votre capacité. Certes, ce qui a causé la perte de ceux qui vous ont précédés, c'est l'abondance de leurs questions et leurs divergences avec leurs prophètes."
    },
    10: {
        narrator: "Abou Houraira (qu'Allah l'agrée)",
        grade: "Sahih Mouslim",
        theme: "tazkiya",
        french: "Certes Allah est Bon et Il n'accepte que ce qui est bon. Et certes Allah a ordonné aux croyants ce qu'Il a ordonné aux Messagers. Il a dit : « Ô Messagers ! Mangez de ce qui est bon et faites du bien. » Et Il a dit : « Ô vous qui croyez ! Mangez des nourritures licites que Nous vous avons attribuées. » Puis le Prophète mentionna l'homme qui prolonge son voyage, les cheveux ébouriffés et couvert de poussière, tendant les mains vers le ciel [en disant] : « Ô Seigneur ! Ô Seigneur ! », alors que sa nourriture est illicite, sa boisson est illicite, ses vêtements sont illicites et qu'il a été nourri de l'illicite. Comment donc serait-il exaucé ?"
    },
    11: {
        narrator: "Al-Hasan ibn Ali (qu'Allah les agrée)",
        grade: "Sahih Tirmidhi",
        theme: "tazkiya",
        french: "Laisse ce qui te jette dans le doute pour ce qui ne t'y jette pas."
    },
    12: {
        narrator: "Abou Houraira (qu'Allah l'agrée)",
        grade: "Hasan (Tirmidhi)",
        theme: "tazkiya",
        french: "Fait partie du bel Islam d'une personne de délaisser ce qui ne la regarde pas."
    },
    13: {
        narrator: "Anas ibn Malik (qu'Allah l'agrée)",
        grade: "Sahih Boukhari et Mouslim",
        theme: "adab",
        french: "Aucun de vous ne sera [véritablement] croyant tant qu'il n'aimera pas pour son frère ce qu'il aime pour lui-même."
    },
    14: {
        narrator: "Abdallah ibn Mas'oud (qu'Allah l'agrée)",
        grade: "Sahih Boukhari et Mouslim",
        theme: "muamalat",
        french: "Il n'est pas permis de verser le sang d'un musulman qui atteste qu'il n'y a de divinité digne d'adoration qu'Allah et que je suis le Messager d'Allah, sauf dans trois cas : la personne mariée qui commet l'adultère, vie pour vie (le talion), et celui qui délaisse sa religion et se sépare de la communauté."
    },
    15: {
        narrator: "Abou Houraira (qu'Allah l'agrée)",
        grade: "Sahih Boukhari et Mouslim",
        theme: "adab",
        french: "Que celui qui croit en Allah et au Jour Dernier dise du bien ou qu'il se taise. Que celui qui croit en Allah et au Jour Dernier honore son voisin. Que celui qui croit en Allah et au Jour Dernier honore son invité."
    },
    16: {
        narrator: "Abou Houraira (qu'Allah l'agrée)",
        grade: "Sahih Boukhari",
        theme: "adab",
        french: "Un homme dit au Prophète (ﷺ) : « Conseille-moi. » Il répondit : « Ne te mets pas en colère. » L'homme répéta sa demande plusieurs fois, et il répondit à chaque fois : « Ne te mets pas en colère. »"
    },
    17: {
        narrator: "Chaddad ibn Aws (qu'Allah l'agrée)",
        grade: "Sahih Mouslim",
        theme: "adab",
        french: "Certes Allah a prescrit l'excellence (Ihsan) en toute chose. Si vous tuez, tuez avec excellence, et si vous égorgez, égorgez avec excellence. Que l'un de vous aiguise sa lame et qu'il ménage sa bête."
    },
    18: {
        narrator: "Abou Dharr et Mu'adh ibn Jabal (qu'Allah les agrée)",
        grade: "Hasan (Tirmidhi)",
        theme: "tazkiya",
        french: "Crains Allah où que tu sois. Fais suivre la mauvaise action par une bonne action, elle l'effacera. Et comporte-toi avec les gens avec un bon caractère."
    },
    19: {
        narrator: "Abdallah ibn Abbas (qu'Allah les agrée)",
        grade: "Sahih Tirmidhi",
        theme: "aqida",
        french: "J'étais un jour derrière le Prophète (ﷺ) et il me dit : « Ô jeune homme, je vais t'enseigner quelques paroles : Préserve Allah, Il te préservera. Préserve Allah, tu Le trouveras devant toi. Si tu demandes, demande à Allah. Si tu cherches secours, cherche secours auprès d'Allah. Et sache que si toute la communauté se rassemblait pour t'être utile en quelque chose, ils ne te seraient utiles que dans une chose qu'Allah a déjà écrite pour toi. Et s'ils se rassemblaient pour te nuire en quelque chose, ils ne te nuiraient que dans une chose qu'Allah a déjà écrite contre toi. Les plumes sont levées et les feuillets ont séché. »"
    },
    20: {
        narrator: "Abou Mas'oud (qu'Allah l'agrée)",
        grade: "Sahih Boukhari",
        theme: "adab",
        french: "Parmi les paroles prophétiques que les gens ont saisies [des prophètes précédents], il y a : « Si tu n'as pas de pudeur, fais ce que tu veux. »"
    },
    21: {
        narrator: "Sufyan ibn Abdallah ath-Thaqafi",
        grade: "Sahih Mouslim",
        theme: "ibadat",
        french: "Je demandai : « Ô Messager d'Allah, dis-moi en Islam une parole sur laquelle je n'interrogerai personne d'autre que toi. » Il répondit : « Dis : \\\"J'ai cru en Allah\\\", puis agis avec droiture (istiqama). »"
    },
    22: {
        narrator: "Jabir ibn Abdallah (qu'Allah les agrée)",
        grade: "Sahih Mouslim",
        theme: "ibadat",
        french: "Un homme interrogea le Messager d'Allah (ﷺ) en disant : « Si j'accomplis les prières obligatoires, que je jeûne le Ramadan, que je rends licite le licite et illicite l'illicite, et que je n'ajoute rien à cela, entrerai-je au Paradis ? » Il répondit : « Oui. »"
    },
    23: {
        narrator: "Abou Malik al-Ash'ari (qu'Allah l'agrée)",
        grade: "Sahih Mouslim",
        theme: "tazkiya",
        french: "La purification est la moitié de la foi. [La parole] \\\"Al-Hamdu lillah\\\" (Louange à Allah) remplit la balance. \\\"Subhanallah wal-Hamdu lillah\\\" (Gloire à Allah et Louange à Allah) remplissent ce qu'il y a entre le ciel et la terre. La prière est une lumière, l'aumône est une preuve, l'endurance est une clarté et le Coran est un argument en ta faveur ou contre toi. Tout homme débute sa journée trafiquant de son âme : il l'affranchit ou la conduit à sa perte."
    },
    24: {
        narrator: "Abou Dharr al-Ghifari (qu'Allah l'agrée)",
        grade: "Sahih Mouslim",
        theme: "muamalat",
        french: "D'après le Prophète (ﷺ), parmi ce qu'il rapporte de son Seigneur le Très-Haut, Il a dit : « Â Mes serviteurs ! Je Me suis interdit l'injustice à Moi-même et Je l'ai rendue interdite entre vous ; ne soyez donc pas injustes les uns envers les autres. Ô Mes serviteurs ! Vous êtes tous égarés sauf celui que Je guide ; demandez-Moi donc la guidée, Je vous guiderai. [...] Ô Mes serviteurs ! Ce sont vos actes seulement dont Je tiens compte pour vous, ensuite Je vous rémunérerai [selon ceux-ci]. Donc celui qui trouve le bien, qu'il loue Allah ; et celui qui trouve autre chose, qu'il ne blâme que lui-même. »"
    },
    25: {
        narrator: "Abou Dharr al-Ghifari (qu'Allah l'agrée)",
        grade: "Sahih Mouslim",
        theme: "ibadat",
        french: "Des gens pauvres parmi les Compagnons du Prophète dirent au Prophète : « Ô Messager d'Allah, les gens riches ont emporté les récompenses. Ils prient comme nous prions, ils jeûnent comme nous jeûnons et ils donnent en aumône le surplus de leurs biens. » Il dit : « Allah ne vous a-t-Il pas donné de quoi faire l'aumône ? Certes, chaque Tasbiha (dire Subhanallah) est une aumône, chaque Takbira (dire Allahu Akbar) est une aumône, chaque Tahmida (dire Al-Hamdu lillah) est une aumône, chaque Tahlila (dire La ilaha illallah) est une aumône. Commander le bien est une aumône, interdire le mal est une aumône, et dans le rapport intime de l'un de vous il y a une aumône. »"
    },
    26: {
        narrator: "Abou Houraira (qu'Allah l'agrée)",
        grade: "Sahih Boukhari et Mouslim",
        theme: "adab",
        french: "Pour chaque articulation des gens, une aumône est due chaque jour où le soleil se lève. Pratiquer l'équité entre deux personnes est une aumône. Aider un homme pour sa monture, en l'aidant à monter dessus ou en lui hissant ses bagages, est une aumône. La bonne parole est une aumône. Chaque pas que l'on fait vers la prière est une aumône. Et écarter ce qui nuit du chemin est une aumône."
    },
    27: {
        narrator: "An-Nawwas ibn Sam'an (qu'Allah l'agrée)",
        grade: "Sahih Mouslim",
        theme: "adab",
        french: "La bienfaisance, c'est le bon comportement. Et le péché, c'est ce qui se trame dans ton âme et que tu répugnes que les gens découvrent."
    },
    28: {
        narrator: "Al-Irbad ibn Sariya (qu'Allah l'agrée)",
        grade: "Hasan Sahih (Tirmidhi)",
        theme: "aqida",
        french: "Le Messager d'Allah (ﷺ) nous fit un sermon qui fit frémir les cœurs et verser les larmes aux yeux. Nous dîmes : « Ô Messager d'Allah, on dirait un sermon d'adieu, alors fais-nous une recommandation. » Il dit : « Je vous recommande la crainte d'Allah (Taqwa), ainsi que l'écoute et l'obéissance, même si un esclave abyssin était placé à votre tête. Car certes, celui d'entre vous qui vivra verra de nombreuses divergences. Attachez-vous donc à ma Sunna et à la sunna des califes bien guidés après moi. Mordez-y à pleines dents. Et prenez garde aux choses nouvelles [en religion], car toute innovation est un égarement. »"
    },
    29: {
        narrator: "Mu'adh ibn Jabal (qu'Allah l'agrée)",
        grade: "Hasan Sahih (Tirmidhi)",
        theme: "ibadat",
        french: "Je dis : « Ô Messager d'Allah, informe-moi d'une œuvre qui me fera entrer au Paradis et m'éloignera de l'Enfer. » Il dit : « Tu as interrogé sur une chose immense, mais elle est aisée pour celui à qui Allah la facilite. Tu adores Allah sans rien Lui associer, tu accomplis la prière, tu t'acquittes de la Zakat, tu jeûnes le Ramadan et tu fais le Pèlerinage à la Maison. » Puis il dit : « Ne t'indiquerai-je pas les portes du bien ? Le jeûne est un bouclier, l'aumône éteint le péché comme l'eau éteint le feu, et la prière de l'homme au cœur de la nuit. » [...] Puis il dit : « Ne t'informerai-je pas de ce qui soutient tout cela ? » Je dis : « Certes, ô Messager d'Allah. » Il saisit sa langue et dit : « Retiens celle-ci. »"
    },
    30: {
        narrator: "Abou Tha'laba al-Khushani (qu'Allah l'agrée)",
        grade: "Hasan (Daraqutni)",
        theme: "ibadat",
        french: "Certes Allah le Très-Haut a prescrit des obligations, ne les négligez pas. Il a fixé des limites, ne les transgressez pas. Il a interdit des choses, ne les violez pas. Et Il s'est tu sur des choses, par miséricorde pour vous et non par oubli, alors ne cherchez pas à les connaître."
    },
    31: {
        narrator: "Sahl ibn Sa'd (qu'Allah l'agrée)",
        grade: "Hasan (Ibn Majah)",
        theme: "tazkiya",
        french: "Un homme vint au Prophète (ﷺ) et dit : « Ô Messager d'Allah, indique-moi une œuvre qui, si je l'accomplis, me fera aimer d'Allah et aimer des gens. » Il répondit : « Renonce à ce monde (sois ascète), Allah t'aimera. Et renonce à ce que possèdent les gens, les gens t'aimeront. »"
    },
    32: {
        narrator: "Abou Sa'id al-Khudri (qu'Allah l'agrée)",
        grade: "Hasan (Ibn Majah, Daraqutni)",
        theme: "muamalat",
        french: "Pas de préjudice [à autrui] et pas de préjudice réciproque (La darara wa la dirar)."
    },
    33: {
        narrator: "Ibn Abbas (qu'Allah les agrée)",
        grade: "Hasan (Bayhaqi)",
        theme: "muamalat",
        french: "Si l'on donnait aux gens sur leur simple demande, des hommes réclameraient les biens d'un peuple et leur sang. Mais la preuve incombe au demandeur, et le serment incombe à celui qui conteste."
    },
    34: {
        narrator: "Abou Sa'id al-Khudri (qu'Allah l'agrée)",
        grade: "Sahih Mouslim",
        theme: "adab",
        french: "Celui d'entre vous qui voit un mal, qu'il le change par sa main. S'il ne le peut pas, alors par sa langue. Et s'il ne le peut pas, alors par son cœur, et c'est là le degré le plus faible de la foi."
    },
    35: {
        narrator: "Abou Houraira (qu'Allah l'agrée)",
        grade: "Sahih Boukhari et Mouslim",
        theme: "adab",
        french: "Ne vous jalousez pas, ne surenchérissez pas les uns sur les autres [dans les ventes], ne vous haïssez pas, ne vous tournez pas le dos, et ne vendez pas par-dessus la vente des autres. Soyez, ô serviteurs d'Allah, des frères. Le musulman est le frère du musulman : il ne l'opprime pas, ne l'abandonne pas, ne lui ment pas et ne le méprise pas. La piété (Taqwa) est ici – et il désigna sa poitrine trois fois. Il suffit à l'homme pour être mauvais de mépriser son frère musulman. Tout le musulman est sacré pour le musulman : son sang, son bien et son honneur."
    },
    36: {
        narrator: "Abou Houraira (qu'Allah l'agrée)",
        grade: "Sahih Mouslim",
        theme: "tazkiya",
        french: "Celui qui soulage un croyant d'une affliction de ce monde, Allah le soulagera d'une affliction du Jour de la Résurrection. Celui qui accorde une facilité à un débiteur en difficulté, Allah lui accordera une facilité dans ce monde et dans l'au-delà. Celui qui couvre un musulman, Allah le couvrira dans ce monde et dans l'au-delà. Allah aide le serviteur tant que le serviteur aide son frère. Celui qui emprunte un chemin à la recherche d'une science, Allah lui facilite par cela un chemin vers le Paradis."
    },
    37: {
        narrator: "Ibn Abbas (qu'Allah les agrée)",
        grade: "Sahih Boukhari et Mouslim",
        theme: "aqida",
        french: "Certes Allah a écrit les bonnes actions et les mauvaises actions, puis Il a clarifié cela : Celui qui a l'intention d'accomplir une bonne action mais ne l'accomplit pas, Allah la lui inscrit auprès de Lui comme une bonne action complète. Et s'il a l'intention de l'accomplir et qu'il l'accomplit, Allah la lui inscrit auprès de Lui comme dix bonnes actions, jusqu'à sept cents fois et bien plus encore. Et s'il a l'intention d'accomplir une mauvaise action mais ne l'accomplit pas, Allah la lui inscrit auprès de Lui comme une bonne action complète. Mais s'il a l'intention de l'accomplir et qu'il l'accomplit, Allah ne lui inscrit qu'une seule mauvaise action."
    },
    38: {
        narrator: "Abou Houraira (qu'Allah l'agrée)",
        grade: "Sahih Boukhari",
        theme: "tazkiya",
        french: "Allah le Très-Haut a dit : « Celui qui se montre hostile envers un de Mes alliés (Wali), Je lui déclare la guerre. Mon serviteur ne se rapproche pas de Moi par une chose que J'aime plus que ce que Je lui ai imposé. Et Mon serviteur ne cesse de se rapprocher de Moi par les œuvres surérogatoires jusqu'à ce que Je l'aime. Et lorsque Je l'aime, Je suis son ouïe avec laquelle il entend, sa vue avec laquelle il voit, sa main avec laquelle il saisit et son pied avec lequel il marche. S'il Me demande, Je lui donne ; et s'il cherche refuge auprès de Moi, Je le protège. »"
    },
    39: {
        narrator: "Ibn Abbas (qu'Allah les agrée)",
        grade: "Hasan (Ibn Majah)",
        theme: "aqida",
        french: "Certes Allah a pardonné à ma communauté l'erreur, l'oubli et ce à quoi ils ont été contraints."
    },
    40: {
        narrator: "Abdallah ibn Omar (qu'Allah les agrée)",
        grade: "Sahih Boukhari",
        theme: "tazkiya",
        french: "Le Messager d'Allah (ﷺ) me saisit par l'épaule et dit : « Sois dans ce monde comme si tu étais un étranger ou un voyageur de passage. »"
    },
    41: {
        narrator: "Abdallah ibn Amr ibn al-As (qu'Allah les agrée)",
        grade: "Hasan Sahih",
        theme: "aqida",
        french: "Aucun de vous ne sera [véritablement] croyant tant que ses passions ne suivront pas ce avec quoi je suis venu."
    },
    42: {
        narrator: "Anas ibn Malik (qu'Allah l'agrée)",
        grade: "Hasan (Tirmidhi)",
        theme: "tazkiya",
        french: "J'ai entendu le Messager d'Allah (ﷺ) dire : « Allah le Très-Haut a dit : Ô fils d'Adam ! Tant que tu M'invoques et que tu as espoir en Moi, Je te pardonne ce que tu as fait et Je ne M'en soucie pas. Ô fils d'Adam ! Si tes péchés atteignaient le ciel puis que tu Me demandais pardon, Je te pardonnerais. Ô fils d'Adam ! Si tu venais à Moi avec la terre entière remplie de péchés, puis que tu Me rencontrais sans rien M'associer, Je viendrais à toi avec la terre entière remplie de pardon. »"
    }
};

const updatedData = data.map(hadith => {
    const correction = corrections[hadith.id];
    if (correction) {
        hadith.french = correction.french;
        hadith.narrator = correction.narrator;
        hadith.grade = correction.grade;
        hadith.theme = correction.theme;
        hadith.commentaries = [];
    }
    return hadith;
});

fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf8');

console.log("Repair Complete: 42 Hadiths updated. Arabic preserved.");
