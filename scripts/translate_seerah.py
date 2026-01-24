import json
import os

# Charger le fichier anglais
input_file = 'public/data/seerah-en.json'
output_file = 'public/data/seerah-fr.json'

with open(input_file, 'r', encoding='utf-8') as f:
    events = json.load(f)

# Dictionnaire de traductions complètes pour chaque événement
translations = [
    # Événement 0
    {
        "title": "Construction de la Ka'bah par Ibrahim et Isma'il عليهما السلام",
        "commentary": ["Le Prophète Ibrahim (Abraham) et son fils Isma'il (Ismaël) ont construit la Ka'bah à La Mecque comme première maison de culte dédiée au Dieu Unique."],
        "notes": "Environ 2000 avant J.-C."
    },
    # Événement 1
    {
        "title": "Prophète Musa (Moïse) عليه السلام",
        "commentary": ["Le Prophète Musa a reçu la Torah et a conduit les Enfants d'Israël hors d'Égypte. Il est l'un des plus grands prophètes et est fréquemment mentionné dans le Coran."],
        "notes": "Environ 1400 avant J.-C."
    },
    # Événement 2
    {
        "title": "Prophète 'Isa (Jésus) عليه السلام",
        "commentary": ["Le Prophète 'Isa est né de Maryam (Marie) par un miracle. Il a accompli des miracles et prêché le message du monothéisme. Il a annoncé la venue du Prophète Muhammad ﷺ."],
        "notes": "Né environ 4 avant J.-C., mentionné dans le Coran comme annonçant Ahmad"
    },
    # Événement 3
    {
        "title": "Naissance de 'Abdul-Muttalib",
        "commentary": ["Grand-père du Prophète Muhammad ﷺ. Il était le chef des Quraysh et a redécouvert le puits de Zamzam."],
        "notes": "Grand-père du Prophète ﷺ"
    },
    # Événement 4
    {
        "title": "Redécouverte du puits de Zamzam",
        "commentary": ["'Abdul-Muttalib a redécouvert le puits de Zamzam à La Mecque, qui avait été enseveli pendant des siècles. Ce puits a été créé à l'origine par Allah pour Hajar et Isma'il."],
        "notes": "Puits miraculeux qui coule encore aujourd'hui"
    },
    # Événement 5
    {
        "title": "Naissance de 'Abdullah (Père du Prophète ﷺ)",
        "commentary": ["'Abdullah ibn 'Abdul-Muttalib est né. Il était connu pour sa beauté exceptionnelle et sa piété. Il allait devenir le père du Prophète Muhammad ﷺ."],
        "notes": "Père du Prophète ﷺ"
    },
    # Événement 6
    {
        "title": "L'Année de l'Éléphant",
        "commentary": ["Abraha, le dirigeant abyssin du Yémen, a mené une armée avec des éléphants pour détruire la Ka'bah. Allah a envoyé des nuées d'oiseaux (Ababil) portant des pierres pour détruire l'armée. Cet événement est mentionné dans la Sourate Al-Fil."],
        "notes": "L'année de la naissance du Prophète"
    },
    # Événement 7
    {
        "title": "Décès de 'Abdullah (Père du Prophète ﷺ)",
        "commentary": ["'Abdullah est décédé avant la naissance de son fils Muhammad ﷺ. Il est mort en revenant d'un voyage commercial en Syrie, laissant Aminah enceinte."],
        "notes": "Le Prophète ﷺ est né orphelin"
    },
    # Événement 8
    {
        "title": "Naissance du Prophète Muhammad ﷺ",
        "commentary": ["Il a été nommé par son grand-père 'Abdul-Muttalib. Né à La Mecque durant l'Année de l'Éléphant."],
        "notes": "12 Rabi' al-Awwal"
    },
    # Événement 9
    {
        "title": "Décès de sa mère Aminah",
        "commentary": ["La mère du Prophète, Aminah, est décédée d'une maladie grave à Abwa, sur la route entre La Mecque et Médine."],
        "notes": ""
    },
    # Événement 10
    {
        "title": "Décès de son grand-père 'Abdul-Muttalib",
        "commentary": ["'Abdul-Muttalib, le grand-père du Prophète ﷺ, est décédé. Son oncle Abu Talib a pris soin de lui."],
        "notes": ""
    },
    # Événement 11
    {
        "title": "Voyage en Syrie avec Abu Talib",
        "commentary": ["Le Prophète ﷺ a voyagé avec son oncle Abu Talib en Syrie pour le commerce. Le moine Bahira a reconnu en lui les signes de la prophétie."],
        "notes": "Âge 12 ans"
    },
    # Événement 12
    {
        "title": "Participation au Hilf al-Fudul",
        "commentary": ["Le Prophète ﷺ a participé au Hilf al-Fudul (Alliance des Vertueux), un pacte pour aider les opprimés à La Mecque."],
        "notes": "Âge 20 ans"
    },
    # Événement 13
    {
        "title": "Mariage avec Khadijah رضي الله عنها",
        "commentary": ["Le Prophète ﷺ a épousé Khadijah bint Khuwaylid, une femme noble et riche de La Mecque. Elle avait 40 ans et lui 25."],
        "notes": ""
    },
    # Événement 14
    {
        "title": "Reconstruction de la Ka'bah",
        "commentary": ["Les Quraysh ont reconstruit la Ka'bah. Le Prophète ﷺ a résolu un différend sur qui placerait la Pierre Noire en faisant soulever celle-ci par toutes les tribus ensemble."],
        "notes": "Âge 35 ans"
    },
    # Événement 15
    {
        "title": "Première Révélation",
        "commentary": ["L'ange Jibril est apparu au Prophète ﷺ dans la grotte de Hira et a révélé les premiers versets du Coran : 'Lis au nom de ton Seigneur...' (Sourate Al-'Alaq)"],
        "notes": "27 Ramadan, Âge 40 ans"
    },
    # Événement 16
    {
        "title": "Début de la Da'wah secrète",
        "commentary": ["Le Prophète ﷺ a commencé à appeler les gens à l'Islam secrètement. Les premiers à accepter l'Islam furent Khadijah, Ali, Zayd ibn Harithah et Abu Bakr."],
        "notes": "Premières 3 années"
    },
    # Événement 17
    {
        "title": "Début de la prédication publique",
        "commentary": ["Allah a ordonné au Prophète ﷺ de prêcher ouvertement. Il a gravi le Mont Safa et a appelé les Quraysh à l'Islam publiquement."],
        "notes": ""
    },
    # Événement 18
    {
        "title": "Première migration vers l'Abyssinie",
        "commentary": ["En raison de persécutions sévères, le Prophète ﷺ a conseillé à certains musulmans de migrer en Abyssinie (Éthiopie) où le roi chrétien était juste."],
        "notes": "11 hommes et 4 femmes"
    },
    # Événement 19
    {
        "title": "'Umar ibn al-Khattab accepte l'Islam",
        "commentary": ["'Umar رضي الله عنه a accepté l'Islam, renforçant la communauté musulmane. Les musulmans ont pu prier ouvertement à la Ka'bah."],
        "notes": "Âge 45 ans"
    },
    # Événement 20
    {
        "title": "Année du Chagrin",
        "commentary": ["Khadijah رضي الله عنها et Abu Talib sont tous deux décédés la même année, laissant le Prophète ﷺ sans son plus grand soutien et protecteur."],
        "notes": "10ème année de la prophétie"
    },
    # Événement 21
    {
        "title": "Voyage à Ta'if",
        "commentary": ["Le Prophète ﷺ s'est rendu à Ta'if pour chercher du soutien, mais a été rejeté et lapidé. L'ange Jibril a proposé de détruire la ville, mais le Prophète ﷺ a refusé et a prié pour leur guidance."],
        "notes": ""
    },
    # Événement 22
    {
        "title": "Al-Isra' wal-Mi'raj (Voyage Nocturne)",
        "commentary": ["Le Prophète ﷺ a été transporté de La Mecque à Jérusalem (Isra') puis a ascensionné vers les cieux (Mi'raj), où il a rencontré les prophètes et a reçu le commandement des cinq prières quotidiennes."],
        "notes": "27 Rajab"
    },
    # Événement 23
    {
        "title": "Premier Serment d''Aqabah",
        "commentary": ["Six hommes de Yathrib (Médine) ont rencontré le Prophète ﷺ et ont accepté l'Islam, s'engageant à le soutenir."],
        "notes": ""
    },
    # Événement 24
    {
        "title": "Second Serment d''Aqabah",
        "commentary": ["73 hommes et 2 femmes de Médine se sont engagés à protéger le Prophète ﷺ comme ils protégeraient leurs propres familles, ouvrant la voie à la Hijrah."],
        "notes": ""
    },
    # Événement 25
    {
        "title": "Hijrah vers Médine",
        "commentary": ["Le Prophète ﷺ a émigré de La Mecque à Médine, échappant à un assassinat. Cela marque le début du calendrier islamique."],
        "notes": "1er Muharram 1 AH"
    },
    # Événement 26
    {
        "title": "Construction de Masjid an-Nabawi",
        "commentary": ["Le Prophète ﷺ a construit la première mosquée à Médine, qui est devenue le centre de la communauté musulmane."],
        "notes": ""
    },
    # Événement 27
    {
        "title": "Fraternité entre Muhajirun et Ansar",
        "commentary": ["Le Prophète ﷺ a établi la fraternité entre les Migrants (Muhajirun) et les Auxiliaires (Ansar) de Médine."],
        "notes": ""
    },
    # Événement 28
    {
        "title": "Bataille de Badr",
        "commentary": ["La première grande bataille entre les musulmans (313) et les Quraysh (1000). Allah a accordé la victoire aux musulmans malgré leur infériorité numérique."],
        "notes": "17 Ramadan 2 AH"
    },
    # Événement 29
    {
        "title": "Bataille d'Uhud",
        "commentary": ["Les Quraysh sont revenus avec 3000 guerriers. Les musulmans ont d'abord gagné mais ont subi des pertes lorsque les archers ont quitté leurs positions. Le Prophète ﷺ a été blessé."],
        "notes": "7 Shawwal 3 AH"
    },
    # Événement 30
    {
        "title": "Bataille de la Tranchée (Khandaq)",
        "commentary": ["Les Quraysh et leurs alliés ont assiégé Médine avec 10 000 guerriers. Les musulmans ont creusé une tranchée sur les conseils de Salman al-Farsi et ont défendu avec succès la ville."],
        "notes": "Shawwal 5 AH"
    },
    # Événement 31
    {
        "title": "Traité de Hudaybiyyah",
        "commentary": ["Le Prophète ﷺ et les Quraysh ont signé un traité de paix. Bien qu'il semblait défavorable, il a été appelé une 'victoire claire' dans le Coran et a conduit à de nombreuses conversions."],
        "notes": "Dhul-Qi'dah 6 AH"
    },
    # Événement 32
    {
        "title": "Lettres aux Rois et Dirigeants",
        "commentary": ["Le Prophète ﷺ a envoyé des lettres invitant les dirigeants mondiaux à l'Islam, notamment l'empereur byzantin, le roi perse et le dirigeant égyptien."],
        "notes": ""
    },
    # Événement 33
    {
        "title": "Conquête de Khaybar",
        "commentary": ["Les musulmans ont conquis la forteresse juive de Khaybar. Le Prophète ﷺ a épousé Safiyyah رضي الله عنها."],
        "notes": "Muharram 7 AH"
    },
    # Événement 34
    {
        "title": "Bataille de Mu'tah",
        "commentary": ["3000 musulmans ont affronté 200 000 forces byzantines et arabes. Zayd, Ja'far et Abdullah ibn Rawahah ont été martyrisés. Khalid ibn al-Walid a mené une retraite tactique."],
        "notes": "Jumada al-Ula 8 AH"
    },
    # Événement 35
    {
        "title": "Conquête de La Mecque",
        "commentary": ["Le Prophète ﷺ est entré pacifiquement à La Mecque avec 10 000 musulmans. Il a pardonné à ses ennemis et a purifié la Ka'bah des idoles."],
        "notes": "20 Ramadan 8 AH"
    },
    # Événement 36
    {
        "title": "Bataille de Hunayn",
        "commentary": ["Peu après la conquête de La Mecque, les musulmans ont affronté la tribu Hawazin. Après un revers initial, ils ont remporté la victoire."],
        "notes": "Shawwal 8 AH"
    },
    # Événement 37
    {
        "title": "Bataille de Tabuk",
        "commentary": ["Le Prophète ﷺ a mené 30 000 musulmans à Tabuk pour faire face à la menace byzantine. Les Byzantins ne se sont pas présentés et de nombreuses tribus ont prêté allégeance à l'Islam."],
        "notes": "Rajab 9 AH"
    },
    # Événement 38
    {
        "title": "Année des Délégations",
        "commentary": ["Des tribus de toute l'Arabie ont envoyé des délégations à Médine pour accepter l'Islam. L'Islam s'est répandu rapidement dans toute la péninsule."],
        "notes": "9 AH"
    },
    # Événement 39
    {
        "title": "Pèlerinage d'Adieu",
        "commentary": ["Le Prophète ﷺ a effectué son premier et dernier Hajj avec plus de 100 000 musulmans. Il a prononcé le Sermon d'Adieu établissant les droits humains et l'égalité."],
        "notes": "9 Dhul-Hijjah 10 AH"
    },
    # Événement 40
    {
        "title": "Révélation du Verset Final",
        "commentary": ["Durant le Pèlerinage d'Adieu, le verset a été révélé : 'Aujourd'hui, J'ai parachevé pour vous votre religion...' (Sourate Al-Ma'idah 5:3)"],
        "notes": "Jour d'Arafah"
    },
    # Événement 41
    {
        "title": "Décès du Prophète Muhammad ﷺ",
        "commentary": ["Le Prophète ﷺ est décédé à Médine dans la maison de 'Aishah رضي الله عنها, à l'âge de 63 ans. Il a été enterré au même endroit."],
        "notes": "12 Rabi' al-Awwal 11 AH, Lundi"
    },
    # Événement 42
    {
        "title": "Décès d'Abu Bakr as-Siddiq رضي الله عنه",
        "commentary": ["Le premier Calife et compagnon le plus proche du Prophète ﷺ est décédé. Il était l'un des plus grands narrateurs de hadiths et le premier homme à accepter l'Islam."],
        "notes": "A rapporté 142 hadiths"
    },
    # Événement 43
    {
        "title": "Décès de 'Umar ibn al-Khattab رضي الله عنه",
        "commentary": ["Le deuxième Calife, connu pour sa justice et sa force. Il a été assassiné en dirigeant la prière de Fajr. Grand narrateur de hadiths."],
        "notes": "A rapporté 537 hadiths"
    },
    # Événement 44
    {
        "title": "Décès de 'Uthman ibn 'Affan رضي الله عنه",
        "commentary": ["Le troisième Calife, qui a compilé le Coran en un texte standard. Il a été martyrisé lors d'un siège de sa maison."],
        "notes": "A rapporté 146 hadiths"
    },
    # Événement 45
    {
        "title": "Décès de 'Ali ibn Abi Talib رضي الله عنه",
        "commentary": ["Le quatrième Calife, cousin et gendre du Prophète ﷺ. Il fut l'un des premiers à accepter l'Islam et un grand érudit."],
        "notes": "A rapporté 586 hadiths"
    },
    # Événement 46
    {
        "title": "Décès de 'Aishah رضي الله عنها",
        "commentary": ["Épouse du Prophète ﷺ et l'une des plus grandes érudites de l'Islam. Elle était la femme la plus savante en hadiths et en jurisprudence islamique."],
        "notes": "A rapporté 2 210 hadiths - l'une des principales narratrices"
    },
    # Événement 47
    {
        "title": "Décès d'Abu Hurayrah رضي الله عنه",
        "commentary": ["Le plus grand narrateur de hadiths, qui a mémorisé et transmis plus de hadiths que tout autre compagnon. Il a consacré sa vie à apprendre du Prophète ﷺ."],
        "notes": "A rapporté 5 374 hadiths - le narrateur le plus prolifique"
    },
    # Événement 48
    {
        "title": "Décès d'Abdullah ibn 'Umar رضي الله عنه",
        "commentary": ["Fils de 'Umar ibn al-Khattab, connu pour sa piété et son adhésion stricte à la Sunnah. Grand narrateur de hadiths."],
        "notes": "A rapporté 2 630 hadiths"
    },
    # Événement 49
    {
        "title": "Décès d'Anas ibn Malik رضي الله عنه",
        "commentary": ["Serviteur personnel du Prophète ﷺ pendant 10 ans. Il fut le dernier compagnon à mourir à Bassorah et a rapporté de nombreux hadiths."],
        "notes": "A rapporté 2 286 hadiths"
    },
    # Événement 50
    {
        "title": "Naissance de l'Imam Malik ibn Anas",
        "commentary": ["Le grand Imam de Médine, fondateur de l'école juridique malékite. Il a compilé Al-Muwatta, l'une des premières collections de hadiths."],
        "notes": "Auteur d'Al-Muwatta"
    },
    # Événement 51
    {
        "title": "Décès de l'Imam Malik ibn Anas",
        "commentary": ["L'Imam Malik est décédé à Médine après une vie d'enseignement et de préservation de la Sunnah. Son Muwatta contient 1 720 hadiths."],
        "notes": "A vécu 85 ans"
    },
    # Événement 52
    {
        "title": "Naissance de l'Imam Abu Dawud",
        "commentary": ["Compilateur de Sunan Abu Dawud, l'une des six collections majeures de hadiths (Kutub al-Sittah). Sa collection se concentre sur les hadiths juridiques."],
        "notes": "Auteur de Sunan Abu Dawud (4 800 hadiths)"
    },
    # Événement 53
    {
        "title": "Naissance de l'Imam al-Bukhari",
        "commentary": ["Le plus grand érudit de hadiths, compilateur de Sahih al-Bukhari, le livre le plus authentique après le Coran. Il a mémorisé 600 000 hadiths."],
        "notes": "Auteur de Sahih al-Bukhari (7 563 hadiths avec répétitions)"
    },
    # Événement 54
    {
        "title": "Naissance de l'Imam Muslim",
        "commentary": ["Compilateur de Sahih Muslim, la deuxième collection de hadiths la plus authentique. Il a beaucoup voyagé pour collecter des hadiths auprès des érudits."],
        "notes": "Auteur de Sahih Muslim (12 000 hadiths avec répétitions)"
    },
    # Événement 55
    {
        "title": "Naissance de l'Imam al-Tirmidhi",
        "commentary": ["Compilateur de Jami' at-Tirmidhi, l'une des six collections majeures de hadiths. Connu pour son analyse critique de l'authenticité des hadiths."],
        "notes": "Auteur de Jami' at-Tirmidhi (3 956 hadiths)"
    },
    # Événement 56
    {
        "title": "Naissance de l'Imam al-Nasa'i",
        "commentary": ["Compilateur de Sunan an-Nasa'i, l'une des six collections majeures de hadiths. Connu pour ses critères stricts d'authentification des hadiths."],
        "notes": "Auteur de Sunan an-Nasa'i (5 761 hadiths)"
    },
    # Événement 57
    {
        "title": "Naissance de l'Imam Ibn Majah",
        "commentary": ["Compilateur de Sunan Ibn Majah, la sixième des collections majeures de hadiths. Il était un érudit de hadiths et d'exégèse coranique."],
        "notes": "Auteur de Sunan Ibn Majah (4 341 hadiths)"
    },
    # Événement 58
    {
        "title": "Décès de l'Imam al-Bukhari",
        "commentary": ["L'Imam al-Bukhari est décédé après avoir consacré sa vie à préserver les hadiths authentiques. Son Sahih est considéré comme le livre le plus authentique après le Coran."],
        "notes": "A vécu 62 ans"
    },
    # Événement 59
    {
        "title": "Décès de l'Imam Muslim",
        "commentary": ["L'Imam Muslim est décédé à Nishapur. Son Sahih Muslim est la deuxième collection de hadiths la plus authentique."],
        "notes": "A vécu 55 ans"
    },
    # Événement 60
    {
        "title": "Décès de l'Imam Abu Dawud",
        "commentary": ["L'Imam Abu Dawud est décédé à Bassorah. Son Sunan est essentiel pour la jurisprudence islamique."],
        "notes": "A vécu 73 ans"
    },
    # Événement 61
    {
        "title": "Décès de l'Imam Ibn Majah",
        "commentary": ["L'Imam Ibn Majah est décédé à Qazvin. Son Sunan complète les six collections majeures de hadiths."],
        "notes": "A vécu 64 ans"
    },
    # Événement 62
    {
        "title": "Décès de l'Imam al-Tirmidhi",
        "commentary": ["L'Imam al-Tirmidhi est décédé à Tirmidh. Son Jami' est connu pour son commentaire détaillé sur les degrés des hadiths."],
        "notes": "A vécu 70 ans"
    },
    # Événement 63
    {
        "title": "Décès de l'Imam al-Nasa'i",
        "commentary": ["L'Imam al-Nasa'i a été martyrisé à Damas après avoir été battu pour son soutien à 'Ali رضي الله عنه. Son Sunan est très apprécié pour son authenticité."],
        "notes": "A vécu 88 ans, martyrisé"
    },
]

# Appliquer les traductions
print(f"Traduction de {len(events)} événements...")
for i, event in enumerate(events):
    if i < len(translations):
        event['title'] = translations[i]['title']
        event['commentary'] = translations[i]['commentary']
        event['notes'] = translations[i]['notes']
        print(f"✓ Événement {i+1}/{len(events)}: {event['title'][:50]}...")

# Sauvegarder le fichier traduit
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(events, f, ensure_ascii=False, indent=2)

print(f"\n✅ Traduction terminée ! Fichier sauvegardé : {output_file}")
print(f"Total : {len(events)} événements traduits")
