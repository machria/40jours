import json
from datetime import datetime

def load_json(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def add_content():
    # 1. New Events
    new_events = [
        {
            "title": "L'Allaitement chez Halima As-Sa'diyyah",
            "commentary": [
                "Selon la coutume des Arabes, le jeune Muhammad ﷺ a été confié à une nourrice bédouine, Halima As-Sa'diyyah, pour grandir à l'air pur du désert.",
                "C'est durant cette période qu'a eu lieu l'événement de l'ouverture de la poitrine par les anges."
            ],
            "notes": "0 - 4 ans",
            "hijri-date": "",
            "start": "0571-05-01"
        },
        {
            "title": "Le Martyre de Sumayyah",
            "commentary": [
                "Sumayyah bint Khayyat fut la première martyre de l'Islam. Elle fut tuée par Abu Jahl pour avoir refusé de renier sa foi.",
                "Sa famille, les Yasir, a subi de terribles tortures, et le Prophète ﷺ leur a promis le Paradis."
            ],
            "notes": "Début de l'Islam (Hégire -7)",
            "hijri-date": "7 BH",
            "start": "0615-06-01"
        },
        {
            "title": "Le Boycott des Banu Hashim",
            "commentary": [
                "Les Quraysh ont imposé un boycott social et économique total aux clans Banu Hashim et Banu Muttalib pour qu'ils livrent le Prophète ﷺ.",
                "Pendant trois ans, ils ont souffert de la faim dans le ravin d'Abu Talib, jusqu'à ce que le pacte injuste soit mangé par des termites."
            ],
            "notes": "7 BH - 10 BH",
            "hijri-date": "7 BH",
            "start": "0616-09-01",
            "end": "0619-09-01"
        },
        {
            "title": "Le Serment de l'Agrément (Bay'at al-Ridwan)",
            "commentary": [
                "Lors de l'incident de Hudaybiyah, 1400 compagnons ont prêté serment de mort sous un arbre pour venger la rumeur de la mort d'Uthman.",
                "Allah a révélé Sa satisfaction envers eux dans le Coran : 'Allah a très certainement agréé les croyants quand ils t'ont prêté serment sous l'arbre'."
            ],
            "notes": "Dhul-Qi'dah 6 AH",
            "hijri-date": "6 AH",
            "start": "0628-02-25"
        },
        {
            "title": "Mariage avec 'Aishah رضي الله عنها",
            "commentary": [
                "Le Prophète ﷺ a consummé son mariage avec 'Aishah à Médine. Elle allait devenir la femme la plus savante de la Oumma et une source majeure de hadiths.",
                "C'était le seul mariage du Prophète ﷺ avec une femme qui n'avait pas été mariée auparavant."
            ],
            "notes": "Shawwal 1 AH",
            "hijri-date": "1 AH",
            "start": "0623-04-01"
        },
        {
            "title": "La Constitution de Médine",
            "commentary": [
                "Peu après son arrivée à Médine, le Prophète ﷺ a établi un document constitutionnel définissant les relations entre les musulmans (Muhajirun et Ansar), les juifs et les autres tribus.",
                "Ce pacte établissait un état fondé sur la justice, la défense commune et la liberté religieuse."
            ],
            "notes": "1 AH",
            "hijri-date": "1 AH",
            "start": "0623-06-01"
        },
        {
            "title": "Changement de la Qibla",
            "commentary": [
                "Dix-sept mois après la Hijra, alors que le Prophète ﷺ priait, Allah lui a ordonné de changer la direction de la prière de Jérusalem vers la Ka'bah à La Mecque.",
                "Ceci marqua une distinction claire pour la communauté musulmane."
            ],
            "notes": "Milieu de Sha'ban 2 AH",
            "hijri-date": "2 AH",
            "start": "0624-02-11"
        },
        {
            "title": "Institution du Ramadan et de la Zakat",
            "commentary": [
                "Le jeûne du mois de Ramadan et l'obligation de la Zakat ont été prescrits par Allah avant la bataille de Badr. Ces piliers ont renforcé la spiritualité et la solidarité sociale de la communauté."
            ],
            "notes": "Sha'ban 2 AH",
            "hijri-date": "2 AH",
            "start": "0624-02-25"
        },
        {
            "title": "Expulsion des Banu Qaynuqa",
            "commentary": [
                "La tribu juive des Banu Qaynuqa a rompu le pacte de Médine en agressant une femme musulmane et en tuant un homme musulman. Après un siège, ils ont été expulsés de Médine."
            ],
            "notes": "Shawwal 2 AH",
            "hijri-date": "2 AH",
            "start": "0624-04-15"
        },
        {
            "title": "Expulsion des Banu Nadir",
            "commentary": [
                "Les Banu Nadir ont comploté pour assassiner le Prophète ﷺ en jetant une pierre sur lui. Jibril l'a informé du complot. Ils ont été assiégés puis expulsés. La Sourate Al-Hashr a été révélée à ce sujet."
            ],
            "notes": "Rabi' al-Awwal 4 AH",
            "hijri-date": "4 AH",
            "start": "0625-08-01"
        },
        {
            "title": "Bataille de Banu Qurayza",
            "commentary": [
                "Immédiatement après la Bataille de la Tranchée, les musulmans ont marché sur les Banu Qurayza qui les avaient trahis au moment le plus critique. Ils ont été jugés par Sa'd ibn Mu'adh selon leur propre loi."
            ],
            "notes": "Dhul-Qi'dah 5 AH",
            "hijri-date": "5 AH",
            "start": "0627-04-15"
        },
        {
            "title": "L'incident d'Al-Ifk (La Calomnie)",
            "commentary": [
                "Lors du retour de l'expédition des Banu Mustaliq, des hypocrites ont répandu de fausses rumeurs sur l'honneur de 'Aishah. Allah a révélé son innocence dans la Sourate An-Nur."
            ],
            "notes": "Sha'ban 6 AH",
            "hijri-date": "6 AH",
            "start": "0627-12-01"
        },
        {
            "title": "'Umrah al-Qada (Pèlerinage de Compensation)",
            "commentary": [
                "Conformément au traité de Hudaybiyah, le Prophète ﷺ et les musulmans sont retournés à La Mecque l'année suivante pour accomplir la 'Umrah qu'ils avaient manquée. Ils y sont restés 3 jours."
            ],
            "notes": "Dhul-Qi'dah 7 AH",
            "hijri-date": "7 AH",
            "start": "0629-03-01"
        },
        {
            "title": "Décès d'Ibrahim, fils du Prophète ﷺ",
            "commentary": [
                "Le fils du Prophète, Ibrahim, né de Maria al-Qibtiyya, est décédé en bas âge. Le Prophète ﷺ a pleuré sa perte mais a accepté le décret d'Allah. Une éclipse solaire a eu lieu ce jour-là."
            ],
            "notes": "10 AH",
            "hijri-date": "10 AH",
            "start": "0632-01-27"
        }
    ]

    # 2. Comprehensive Questions (Min 3 per event)
    new_questions = [
        # Halima As-Sa'diyyah
        {
            "question": "Qui était Halima As-Sa'diyyah ?",
            "options": ["La mère du Prophète ﷺ", "La nourrice du Prophète ﷺ", "Une épouse du Prophète ﷺ", "Une commerçante de La Mecque"],
            "correct": 1,
            "explanation": "Halima As-Sa'diyyah était la nourrice bédouine qui a allaité et élevé le Prophète ﷺ dans le désert durant ses premières années, comme c'était la coutume.",
            "category": "context"
        },
        {
            "question": "Quel événement miraculeux a eu lieu pendant que le Prophète ﷺ vivait chez Halima ?",
            "options": ["La fente de la lune", "L'ouverture de sa poitrine par deux anges", "La révélation du Coran", "Le voyage nocturne"],
            "correct": 1,
            "explanation": "Deux anges sont venus, ont ouvert la poitrine du jeune Muhammad ﷺ, ont lavé son cœur avec de l'eau de Zamzam et en ont retiré une part de Satan.",
            "category": "importance"
        },
        {
            "question": "Pourquoi les Arabes confiaient-ils leurs bébés aux Bédouins du désert ?",
            "options": ["Pour les cacher", "Parce qu'ils étaient pauvres", "Pour qu'ils grandissent forts, éloquents et loin des maladies de la ville", "Pour travailler"],
            "correct": 2,
            "explanation": "C'était une coutume noble pour assurer aux enfants une santé robuste, un langage arabe pur et une éducation aux valeurs bédouines.",
            "category": "context"
        },

        # Martyre de Sumayyah
        {
            "question": "Qui est considéré comme le premier martyr (Shaheed) de l'Islam ?",
            "options": ["Hamza", "Sumayyah bint Khayyat", "Bilal", "Yasser"],
            "correct": 1,
            "explanation": "Sumayyah bint Khayyat, la mère de 'Ammar ibn Yasir, fut la première personne à être tuée pour sa foi en Islam, assassinée par Abu Jahl.",
            "category": "importance"
        },
        {
            "question": "Comment le Prophète ﷺ a-t-il réconforté la famille de Yasir commme ils étaient torturés ?",
            "options": ["Il les a libérés par la force", "Il leur a dit : 'Patience, ô famille de Yasir, car votre rendez-vous est le Paradis'", "Il leur a donné de l'or", "Il a négocié avec Abu Jahl"],
            "correct": 1,
            "explanation": "Ne pouvant les libérer physiquement à ce stade, il leur a donné la plus grande bonne nouvelle : la promesse du Paradis pour leur patience.",
            "category": "context"
        },
        {
            "question": "Qui a tué Sumayyah ?",
            "options": ["Abu Lahab", "Abu Sufyan", "Abu Jahl", "Umayyah ibn Khalaf"],
            "correct": 2,
            "explanation": "C'est Abu Jahl, l'un des pires ennemis de l'Islam, qui a tué Sumayyah d'un coup de lance dans un accès de rage face à sa fermeté.",
            "category": "context"
        },

        # Boycott Banu Hashim
        {
            "question": "Combien de temps a duré le boycott imposé aux Banu Hashim ?",
            "options": ["1 an", "3 ans", "6 mois", "10 ans"],
            "correct": 1,
            "explanation": "Le boycott social et économique a duré trois longues années, durant lesquelles les musulmans et leur clan protecteur ont souffert d'une famine extrême.",
            "category": "date"
        },
        {
            "question": "Où les Banu Hashim ont-ils été confinés pendant le boycott ?",
            "options": ["Dans la Ka'bah", "À Médine", "Dans le ravin (Shi'b) d'Abu Talib", "Dans le désert"],
            "correct": 2,
            "explanation": "Ils ont été forcés de se retirer dans la vallée ou le quartier (Shi'b) appartenant à Abu Talib, coupés de tout commerce et mariage.",
            "category": "context"
        },
        {
            "question": "Comment le boycott a-t-il pris fin ?",
            "options": ["Les Quraysh ont eu pitié", "Les musulmans ont payé une rançon", "Le document du boycott a été mangé par des termites sauf le nom d'Allah", "Une inondation a détruit La Mecque"],
            "correct": 2,
            "explanation": "Allah a envoyé des termites (ou vers de terre) pour manger le pacte injuste accroché dans la Ka'bah, ne laissant que l'inscription 'Bismik Allahumma' (En ton nom, ô Allah).",
            "category": "importance"
        },

        # Bay'at al-Ridwan
        {
            "question": "Quelle rumeur a déclenché le Serment de l'Agrément (Bay'at al-Ridwan) ?",
            "options": ["La mort du Prophète ﷺ", "La mort de 'Uthman ibn 'Affan", "L'attaque de Médine", "La trahison des Ansar"],
            "correct": 1,
            "explanation": "'Uthman avait été envoyé comme émissaire à La Mecque et la rumeur de son assassinat par les Quraysh a conduit les compagnons à prêter serment de venger sa mort.",
            "category": "context"
        },
        {
            "question": "Où a eu lieu le Bay'at al-Ridwan ?",
            "options": ["À La Mecque", "Sous un arbre à al-Hudaybiyah", "À la mosquée de Médine", "Au Mont Uhud"],
            "correct": 1,
            "explanation": "Ce serment historique a eu lieu sous un arbre (Samurah) dans la plaine d'Al-Hudaybiyah.",
            "category": "context"
        },
        {
            "question": "Quelle récompense Allah a-t-Il mentionnée dans le Coran pour ceux qui ont prêté ce serment ?",
            "options": ["De l'or", "La victoire sur les Perses", "Son agrément (Ridwan) et la tranquillité (Sakinah)", "Une longue vie"],
            "correct": 2,
            "explanation": "Allah dit dans la Sourate Al-Fath (48:18) qu'Il a agréé les croyants lorsqu'ils ont prêté serment sous l'arbre, d'où le nom 'Serment de l'Agrément'.",
            "category": "importance"
        },

        # Constitution de Médine
        {
            "question": "Quel était l'objectif principal de la Constitution de Médine ?",
            "options": ["Organiser la vie sociale et la défense commune à Médine", "Convertir tout le monde", "Déclarer la guerre aux Perses", "Fixer les impôts"],
            "correct": 0,
            "explanation": "La Constitution de Médine (Sahifat al-Madinah) visait à établir un cadre de vie commune, de justice et de défense mutuelle entre les musulmans (Muhajirun et Ansar) et les tribus juives.",
            "category": "context"
        },
        {
            "question": "Quel statut la Constitution de Médine accordait-elle aux juifs signataires ?",
            "options": ["Ils devaient quitter la ville", "Ils étaient considérés comme esclaves", "Ils formaient une seule communauté (Ummah) avec les croyants, gardant leur religion", "Ils n'avaient aucun droit"],
            "correct": 2,
            "explanation": "La Constitution stipulait que les juifs formaient une communauté politique avec les croyants, tout en conservant leur propre religion et leurs biens, tant qu'ils respectaient le pacte.",
            "category": "context"
        },
        {
            "question": "Quelle année marque l'établissement de la Constitution de Médine ?",
            "options": ["1 AH", "5 AH", "8 AH", "10 AH"],
            "correct": 0,
            "explanation": "Ce document fondateur a été établi la première année de l'Hégire (1 AH), peu après l'arrivée du Prophète ﷺ à Médine.",
            "category": "date"
        },

        # Changement de Qibla
        {
            "question": "Quelle était la première Qibla des musulmans avant La Mecque ?",
            "options": ["La Mecque", "Jérusalem (Al-Quds)", "Médine", "Damas"],
            "correct": 1,
            "explanation": "Avant que la Qibla ne soit changée vers la Ka'bah à La Mecque, les musulmans priaient en direction de Jérusalem (Al-Aqsa).",
            "category": "context"
        },
        {
            "question": "En quelle année le changement de Qibla a-t-il eu lieu ?",
            "options": ["1 AH", "2 AH", "4 AH", "6 AH"],
            "correct": 1,
            "explanation": "Le changement de la Qibla a eu lieu durant la 2ème année de l'Hégire (2 AH), environ 16 ou 17 mois après la Hijra.",
            "category": "date"
        },
        {
            "question": "Quelle signification spirituelle a le changement de Qibla vers la Ka'bah ?",
            "options": ["C'était plus pratique géographiquement", "Cela marquait l'indépendance identitaire de la communauté musulmane", "C'était une demande des Quraysh", "C'était temporaire"],
            "correct": 1,
            "explanation": "Le changement vers la Ka'bah, la maison construite par Ibrahim, marquait l'identité distincte de la communauté musulmane et son lien direct avec l'héritage d'Abraham.",
            "category": "importance"
        },

        # Ramadan et Zakat
        {
            "question": "En quelle année le jeûne du Ramadan a-t-il été rendu obligatoire ?",
            "options": ["1 AH", "2 AH", "5 AH", "10 AH"],
            "correct": 1,
            "explanation": "Le jeûne du mois de Ramadan a été légiféré en l'an 2 de l'Hégire, la même année que la bataille de Badr.",
            "category": "date"
        },
        {
            "question": "Quel pilier de l'Islam a été institué en même temps que le jeûne de Ramadan en l'an 2 AH ?",
            "options": ["Le Hajj", "La Zakat (aumône légale)", "La Shahada", "Le Jihad"],
            "correct": 1,
            "explanation": "La Zakat, l'aumône légale purificatrice, a été instituée en l'an 2 AH, renforçant la solidarité sociale de la communauté naissante.",
            "category": "context"
        },
        {
            "question": "Quelle fête célèbre la fin du mois de Ramadan ?",
            "options": ["Eid al-Adha", "Eid al-Fitr", "Mawlid", "Ashura"],
            "correct": 1,
            "explanation": "Eid al-Fitr (la fête de la rupture du jeûne) marque la fin du mois de Ramadan et a été célébrée pour la première fois en l'an 2 AH.",
            "category": "context"
        },

        # Banu Qaynuqa
        {
            "question": "Quelle fut la raison principale du conflit avec les Banu Qaynuqa ?",
            "options": ["Un différend commercial", "L'agression d'une femme musulmane et le meurtre d'un musulman sur leur marché", "Le refus de payer l'impôt", "Une attaque nocturne"],
            "correct": 1,
            "explanation": "Le conflit a éclaté après qu'un orfèvre juif a humilié une femme musulmane et qu'un musulman venu la défendre a été tué, rompant ainsi le pacte de sécurité.",
            "category": "context"
        },
        {
            "question": "Quel trait caractérisait la tribu des Banu Qaynuqa ?",
            "options": ["Ils étaient agriculteurs", "Ils étaient forgerons et orfèvres connus pour leur bravoure", "Ils étaient éleveurs de chameaux", "Ils étaient nomades"],
            "correct": 1,
            "explanation": "Les Banu Qaynuqa étaient des artisans, forgerons et orfèvres, résidant au centre de Médine et connus pour leur équipement militaire.",
            "category": "context"
        },
        {
            "question": "Quelle fut l'issue du siège des Banu Qaynuqa ?",
            "options": ["Ils ont été exécutés", "Ils ont été expulsés de Médine vers la Syrie", "Ils se sont convertis", "Ils ont payé une amende"],
            "correct": 1,
            "explanation": "Après leur reddition, et suite à l'intercession d'Abdullah ibn Ubayy, le Prophète ﷺ a ordonné leur expulsion de Médine. Ils sont partis vers Adhri'at en Syrie.",
            "category": "context"
        },

        # Banu Nadir
        {
            "question": "Quelle trahison spécifique a conduit à l'expulsion des Banu Nadir ?",
            "options": ["Ils ont insulté le Prophète", "Ils ont tenté d'assassiner le Prophète ﷺ en jetant une meule de pierre sur lui", "Ils ont vendu des armes aux Quraysh", "Ils ont volé du bétail"],
            "correct": 1,
            "explanation": "Alors que le Prophète ﷺ était venu leur demander une contribution financière prévue par le pacte, ils ont comploté pour le tuer en jetant une lourde pierre depuis un toit.",
            "category": "context"
        },
        {
            "question": "Quelle sourate du Coran commente l'expulsion des Banu Nadir ?",
            "options": ["Sourate Al-Baqarah", "Sourate Al-Hashr (L'Exode)", "Sourate Al-Anfal", "Sourate At-Tawbah"],
            "correct": 1,
            "explanation": "La Sourate Al-Hashr (59) a été révélée au sujet de l'expulsion des Banu Nadir, décrivant comment Allah a jeté l'effroi dans leurs cœurs.",
            "category": "context"
        },
        {
            "question": "En quelle année a eu lieu l'expulsion des Banu Nadir ?",
            "options": ["2 AH", "4 AH", "6 AH", "8 AH"],
            "correct": 1,
            "explanation": "Cet événement a eu lieu en Rabi' al-Awwal de l'an 4 de l'Hégire.",
            "category": "date"
        },

        # Banu Qurayza
        {
            "question": "À quel moment critique les Banu Qurayza ont-ils trahi les musulmans ?",
            "options": ["Avant Badr", "Pendant le siège de la Bataille du Fossé (Khandaq)", "Après la conquête de La Mecque", "Pendant Uhud"],
            "correct": 1,
            "explanation": "Ils ont rompu leur pacte et se sont alliés aux coalisés ennemis au moment le plus dangereux du siège de Médine (Bataille du Fossé), exposant les femmes et enfants musulmans au danger.",
            "category": "context"
        },
        {
            "question": "Qui a prononcé le jugement final sur les Banu Qurayza ?",
            "options": ["Le Prophète ﷺ", "Sa'd ibn Mu'adh, chef des Aws (leurs anciens alliés)", "Abu Bakr", "Umar"],
            "correct": 1,
            "explanation": "Les Banu Qurayza ont accepté de se soumettre au jugement de Sa'd ibn Mu'adh, leur ancien allié. Il a jugé selon la loi de la Torah (Deutéronome) appliquée en temps de guerre pour trahison.",
            "category": "context"
        },
        {
            "question": "Quel fut le verdict pour les combattants des Banu Qurayza ?",
            "options": ["L'exil", "L'exécution pour trahison en temps de guerre", "L'amende", "L'esclavage"],
            "correct": 1,
            "explanation": "Le verdict fut l'exécution des combattants pour haute trahison ayant mis en péril toute la cité, conformément à la loi mosaïque et aux règles militaires de l'époque.",
            "category": "context"
        },

        # Al-Ifk (Calomnie Aishah)
        {
            "question": "Qui était la cible de la calomnie lors de l'incident d'Al-Ifk ?",
            "options": ["Khadijah", "Zaynab", "Aishah, l'épouse du Prophète ﷺ", "Fatimah"],
            "correct": 2,
            "explanation": "Les hypocrites ont visé l'honneur de Aishah رضي الله عنها, causant une grande douleur au Prophète ﷺ et à la communauté.",
            "category": "context"
        },
        {
            "question": "Quelle sourate contient les versets innocentant Aishah ?",
            "options": ["Sourate An-Nur (La Lumière)", "Sourate An-Nisa", "Sourate Maryam", "Sourate Yasin"],
            "correct": 0,
            "explanation": "Allah a révélé une dizaine de versets dans la Sourate An-Nur (24:11-26) déclarant l'innocence totale de Aishah et établissant les règles contre la diffamation.",
            "category": "importance"
        },
        {
            "question": "Quelle leçon majeure l'incident d'Al-Ifk enseigne-t-il aux musulmans ?",
            "options": ["De ne pas voyager", "L'interdiction stricte de répandre des rumeurs sans preuves et l'importance de protéger l'honneur", "De ne pas faire confiance aux femmes", "L'importance de la guerre"],
            "correct": 1,
            "explanation": "Cet incident enseigne la gravité de la médisance et de la calomnie, et l'obligation de penser du bien des croyants et d'exiger des preuves irréfutables.",
            "category": "importance"
        },

        # Umrah al-Qada
        {
            "question": "Qu'est-ce que la 'Umrah al-Qada ?",
            "options": ["Le premier Hajj", "La 'Umrah de compensation accomplie un an après le traité de Hudaybiyah", "Une 'Umrah secrète", "La 'Umrah d'adieu"],
            "correct": 1,
            "explanation": "C'est le pèlerinage mineur accompli en l'an 7 AH pour compenser celui que les musulmans n'avaient pas pu faire l'année précédente à cause du blocage des Quraysh à Hudaybiyah.",
            "category": "context"
        },
        {
            "question": "Combien de temps les musulmans sont-ils restés à La Mecque pour la 'Umrah al-Qada ?",
            "options": ["1 jour", "3 jours", "10 jours", "1 mois"],
            "correct": 1,
            "explanation": "Conformément au traité, ils ont eu le droit de rester 3 jours à La Mecque, durant lesquels la ville a résonné de la Talbiyah.",
            "category": "date"
        },
        {
            "question": "Quelle démonstration les musulmans ont-ils faite lors de la 'Umrah al-Qada ?",
            "options": ["Une démonstration de richesse", "Une démonstration de force et de discipline (Raml) pour démentir les rumeurs de faiblesse", "Une démonstration de colère", "Une démonstration de silence"],
            "correct": 1,
            "explanation": "Le Prophète ﷺ a ordonné aux hommes de marcher fièrement (Raml) durant le Tawaf pour montrer aux Quraysh que la fièvre de Médine ne les avait pas affaiblis.",
            "category": "importance"
        },

        # Mariage Aishah
        {
            "question": "Quel statut unique avait Aishah parmi les épouses du Prophète ﷺ ?",
            "options": ["Elle était la plus riche", "Elle était la seule qu'il a épousée vierge", "Elle était étrangère", "Elle avait le plus d'enfants"],
            "correct": 1,
            "explanation": "Aishah رضي الله عنها est la seule épouse que le Prophète ﷺ a mariée alors qu'elle était vierge ; toutes ses autres épouses étaient veuves ou divorcées.",
            "category": "context"
        },
        {
            "question": "Quelle contribution majeure Aishah a-t-elle apportée à l'Islam ?",
            "options": ["Elle a dirigé des armées", "Elle a rapporté plus de 2200 hadiths et était une experte en jurisprudence", "Elle a construit la Ka'bah", "Elle a écrit le Coran"],
            "correct": 1,
            "explanation": "Aishah est l'une des plus grandes savantes de l'Islam, ayant rapporté 2210 hadiths et émis des fatwas, préservant ainsi une grande partie de la Sunnah.",
            "category": "importance"
        },
        {
            "question": "Où le Prophète ﷺ est-il décédé ?",
            "options": ["À la mosquée", "Sur le champ de bataille", "Dans l'appartement de Aishah, sa tête sur ses genoux", "À La Mecque"],
            "correct": 2,
            "explanation": "Le Prophète ﷺ a choisi de passer ses derniers jours chez Aishah et s'est éteint dans ses bras ; il a été enterré à l'endroit même de son décès.",
            "category": "context"
        },

        # Décès Ibrahim
        {
            "question": "Qui était Ibrahim par rapport au Prophète ﷺ ?",
            "options": ["Son père", "Son oncle", "Son fils né de Maria al-Qibtiyya", "Son frère"],
            "correct": 2,
            "explanation": "Ibrahim était le dernier fils du Prophète ﷺ, né à Médine de son épouse Maria al-Qibtiyya.",
            "category": "context"
        },
        {
            "question": "Quel phénomène naturel a coïncidé avec la mort d'Ibrahim, fils du Prophète ﷺ ?",
            "options": ["Un tremblement de terre", "Une éclipse solaire", "Une tempête", "Une inondation"],
            "correct": 1,
            "explanation": "Une éclipse solaire a eu lieu le jour de la mort d'Ibrahim. Les gens ont cru que c'était à cause de sa mort, mais le Prophète ﷺ a corrigé cette croyance.",
            "category": "context"
        },
        {
            "question": "Qu'a dit le Prophète ﷺ lors de la mort de son fils Ibrahim ?",
            "options": ["Il a crié de colère", "Il est resté silencieux", "'Les yeux versent des larmes, le cœur est triste, mais nous ne disons que ce qui plaît à notre Seigneur'", "Il a blâmé les médecins"],
            "correct": 2,
            "explanation": "Le Prophète ﷺ a montré une humanité profonde et une soumission totale à Dieu, pleurant son fils tout en acceptant le décret divin sans révolte.",
            "category": "importance"
        }
    ]

    # Process Sira Events
    sira_path = 'public/data/seerah-fr.json'
    events = load_json(sira_path)
    
    # Check if events already exist (simple check by title)
    existing_titles = {e['title'] for e in events}
    
    events_added = 0
    for new_event in new_events:
        if new_event['title'] not in existing_titles:
            events.append(new_event)
            events_added += 1
            print(f"Adding event: {new_event['title']}")
        else:
            print(f"Skipping existing event: {new_event['title']}")
    
    # Sort events by start date
    # Handle dates like "-2000-01-01" correctly
    events.sort(key=lambda x: x.get('start', '9999-99-99'))
    
    if events_added > 0:
        save_json(sira_path, events)
        print(f"Saved {len(events)} events to {sira_path}")
    else:
        print("No new events added.")

    # Process Quiz Questions
    quiz_path = 'public/data/sira-quiz.json'
    questions = load_json(quiz_path)
    
    # Check duplicates by question text
    existing_questions = {q['question'] for q in questions}
    
    questions_added = 0
    for new_q in new_questions:
        if new_q['question'] not in existing_questions:
            questions.append(new_q)
            questions_added += 1
            print(f"Adding question: {new_q['question']}")
        else:
            print(f"Skipping existing question: {new_q['question']}")
            
    if questions_added > 0:
        save_json(quiz_path, questions)
        print(f"Saved {len(questions)} questions to {quiz_path}")
    else:
        print("No new questions added.")

if __name__ == "__main__":
    add_content()
