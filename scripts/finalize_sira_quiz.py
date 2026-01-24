import json

# Charger les questions existantes
with open('data/sira-quiz.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

print(f"Questions existantes: {len(questions)}")

# Questions finales pour les événements 31-41
final_questions = [
    # Événement 31: Traité de Hudaybiyyah (628)
    {
        "question": "En quelle année le Traité de Hudaybiyyah a-t-il été signé ?",
        "options": ["5 AH (626)", "6 AH (628)", "7 AH (629)", "8 AH (630)"],
        "correct": 1,
        "explanation": "Le Traité de Hudaybiyyah a été signé en Dhul-Qi'dah 6 AH (mars 628 après J.-C.).",
        "category": "date"
    },
    {
        "question": "Pourquoi le traité semblait-il défavorable aux musulmans au début ?",
        "options": ["Il leur donnait tout", "Il contenait des clauses apparemment inégales", "Il était court", "Il était en arabe"],
        "correct": 1,
        "explanation": "Le traité semblait défavorable car il contenait des clauses apparemment inégales, comme le retour des convertis mecquois à La Mecque.",
        "category": "context"
    },
    {
        "question": "Comment Allah a-t-il qualifié le Traité de Hudaybiyyah dans le Coran ?",
        "options": ["Une défaite", "Une victoire claire (Fath Mubin)", "Un compromis", "Une erreur"],
        "correct": 1,
        "explanation": "Allah a qualifié le Traité de Hudaybiyyah de 'victoire claire' (Fath Mubin) car il a conduit à de nombreuses conversions et à la paix.",
        "category": "importance"
    },
    
    # Événement 32: Lettres aux Rois et Dirigeants (628)
    {
        "question": "À qui le Prophète ﷺ a-t-il envoyé des lettres d'invitation à l'Islam ?",
        "options": ["Uniquement aux Arabes", "Aux dirigeants mondiaux (empereur byzantin, roi perse, etc.)", "À personne", "Uniquement aux Quraysh"],
        "correct": 1,
        "explanation": "Le Prophète ﷺ a envoyé des lettres aux dirigeants mondiaux, notamment l'empereur byzantin Héraclius, le roi perse Khosrô, et le dirigeant égyptien.",
        "category": "context"
    },
    {
        "question": "Que contenaient ces lettres ?",
        "options": ["Des menaces", "Une invitation à l'Islam", "Des demandes d'argent", "Des poèmes"],
        "correct": 1,
        "explanation": "Ces lettres contenaient une invitation respectueuse à embrasser l'Islam et à reconnaître l'unicité d'Allah.",
        "category": "context"
    },
    {
        "question": "Quelle est l'importance de l'envoi de ces lettres ?",
        "options": ["Aucune importance", "Cela montre l'universalité du message de l'Islam", "C'était juste une formalité", "C'était une provocation"],
        "correct": 1,
        "explanation": "L'envoi de ces lettres montre que le message de l'Islam est universel, destiné à toute l'humanité et non seulement aux Arabes.",
        "category": "importance"
    },
    
    # Événement 33: Conquête de Khaybar (628)
    {
        "question": "Khaybar était une forteresse de quelle communauté ?",
        "options": ["Les Romains", "Les Juifs", "Les Perses", "Les Quraysh"],
        "correct": 1,
        "explanation": "Khaybar était une forteresse juive au nord de Médine, conquise par les musulmans en Muharram 7 AH (mai 628).",
        "category": "context"
    },
    {
        "question": "Qui a épousé le Prophète ﷺ après la conquête de Khaybar ?",
        "options": ["'Aishah", "Hafsa", "Safiyyah", "Zaynab"],
        "correct": 2,
        "explanation": "Le Prophète ﷺ a épousé Safiyyah bint Huyayy رضي الله عنها après la conquête de Khaybar.",
        "category": "context"
    },
    {
        "question": "Quelle fut l'importance de la conquête de Khaybar ?",
        "options": ["Aucune importance", "Elle a sécurisé le nord de Médine et renforcé l'économie musulmane", "C'était juste une bataille", "Elle a affaibli les musulmans"],
        "correct": 1,
        "explanation": "La conquête de Khaybar a sécurisé le nord de Médine contre les menaces et a considérablement renforcé l'économie musulmane grâce aux terres fertiles.",
        "category": "importance"
    },
    
    # Événement 34: Bataille de Mu'tah (629)
    {
        "question": "Combien de musulmans ont affronté les forces byzantines à Mu'tah ?",
        "options": ["1000", "2000", "3000", "5000"],
        "correct": 2,
        "explanation": "3000 musulmans ont affronté environ 200 000 forces byzantines et arabes alliées lors de la Bataille de Mu'tah.",
        "category": "date"
    },
    {
        "question": "Qui a mené la retraite tactique à Mu'tah après la mort des trois commandants ?",
        "options": ["Abu Bakr", "'Umar", "Khalid ibn al-Walid", "Ali"],
        "correct": 2,
        "explanation": "Khalid ibn al-Walid a pris le commandement et a mené une brillante retraite tactique, sauvant l'armée musulmane de l'anéantissement.",
        "category": "context"
    },
    {
        "question": "Quels trois commandants ont été martyrisés à Mu'tah ?",
        "options": ["Abu Bakr, 'Umar, Ali", "Zayd, Ja'far, Abdullah ibn Rawahah", "Khalid, Hamza, Mus'ab", "Bilal, Salman, Suhayb"],
        "correct": 1,
        "explanation": "Zayd ibn Harithah, Ja'far ibn Abi Talib, et Abdullah ibn Rawahah ont été martyrisés à Mu'tah en combattant héroïquement.",
        "category": "importance"
    },
    
    # Événement 35: Conquête de La Mecque (630)
    {
        "question": "En quelle année La Mecque a-t-elle été conquise ?",
        "options": ["6 AH (628)", "7 AH (629)", "8 AH (630)", "9 AH (631)"],
        "correct": 2,
        "explanation": "La Mecque a été conquise le 20 Ramadan 8 AH (11 janvier 630 après J.-C.).",
        "category": "date"
    },
    {
        "question": "Combien de musulmans ont participé à la conquête de La Mecque ?",
        "options": ["1000", "3000", "5000", "10 000"],
        "correct": 3,
        "explanation": "Le Prophète ﷺ est entré à La Mecque avec 10 000 musulmans, une armée si imposante que la ville s'est rendue sans combat majeur.",
        "category": "context"
    },
    {
        "question": "Comment le Prophète ﷺ a-t-il traité ses ennemis après la conquête de La Mecque ?",
        "options": ["Il les a punis sévèrement", "Il les a tous pardonnés", "Il les a exilés", "Il les a emprisonnés"],
        "correct": 1,
        "explanation": "Le Prophète ﷺ a pardonné à ses ennemis, disant 'Allez, vous êtes libres', montrant une miséricorde exceptionnelle malgré des années de persécution.",
        "category": "importance"
    },
    
    # Événement 36: Bataille de Hunayn (630)
    {
        "question": "Quand la Bataille de Hunayn a-t-elle eu lieu par rapport à la conquête de La Mecque ?",
        "options": ["Un an avant", "Peu après", "Un an après", "Cinq ans après"],
        "correct": 1,
        "explanation": "La Bataille de Hunayn a eu lieu en Shawwal 8 AH, peu après la conquête de La Mecque en Ramadan 8 AH.",
        "category": "date"
    },
    {
        "question": "Quelle tribu les musulmans ont-ils affrontée à Hunayn ?",
        "options": ["Les Quraysh", "La tribu Hawazin", "Les Byzantins", "Les Perses"],
        "correct": 1,
        "explanation": "Les musulmans ont affronté la tribu Hawazin et ses alliés lors de la Bataille de Hunayn.",
        "category": "context"
    },
    {
        "question": "Quelle leçon les musulmans ont-ils apprise à Hunayn ?",
        "options": ["Qu'ils étaient invincibles", "Que la victoire vient d'Allah, pas du nombre", "Qu'ils devaient abandonner", "Qu'ils étaient faibles"],
        "correct": 1,
        "explanation": "À Hunayn, certains musulmans ont été fiers de leur nombre (10 000), mais ont subi un revers initial, apprenant que la victoire vient d'Allah seul.",
        "category": "importance"
    },
    
    # Événement 37: Bataille de Tabuk (630)
    {
        "question": "Combien de musulmans le Prophète ﷺ a-t-il menés à Tabuk ?",
        "options": ["10 000", "20 000", "30 000", "40 000"],
        "correct": 2,
        "explanation": "Le Prophète ﷺ a mené 30 000 musulmans à Tabuk en Rajab 9 AH (octobre 630) pour faire face à la menace byzantine.",
        "category": "date"
    },
    {
        "question": "Qu'est-il arrivé aux Byzantins lors de la campagne de Tabuk ?",
        "options": ["Ils ont attaqué", "Ils ne se sont pas présentés", "Ils ont gagné", "Ils ont fui"],
        "correct": 1,
        "explanation": "Les Byzantins ne se sont pas présentés au combat, impressionnés par la force musulmane. De nombreuses tribus ont prêté allégeance à l'Islam.",
        "category": "context"
    },
    {
        "question": "Quelle fut l'importance de la campagne de Tabuk ?",
        "options": ["Aucune importance", "Elle a montré la puissance musulmane et étendu l'influence islamique au nord", "C'était une défaite", "Elle a affaibli les musulmans"],
        "correct": 1,
        "explanation": "Tabuk a démontré la puissance musulmane, étendu l'influence islamique jusqu'aux frontières byzantines, et sécurisé le nord de la péninsule arabique.",
        "category": "importance"
    },
    
    # Événement 38: Année des Délégations (631)
    {
        "question": "Pourquoi l'année 9 AH est-elle appelée 'Année des Délégations' ?",
        "options": ["À cause d'une guerre", "Car des tribus de toute l'Arabie ont envoyé des délégations pour accepter l'Islam", "À cause d'une famine", "À cause d'un traité"],
        "correct": 1,
        "explanation": "L'année 9 AH est appelée 'Année des Délégations' car des tribus de toute l'Arabie ont envoyé des délégations à Médine pour accepter l'Islam.",
        "category": "context"
    },
    {
        "question": "Que montre l'Année des Délégations sur l'Islam ?",
        "options": ["Qu'il était faible", "Sa propagation rapide dans toute la péninsule arabique", "Qu'il était rejeté", "Qu'il était limité à Médine"],
        "correct": 1,
        "explanation": "L'Année des Délégations montre la propagation rapide de l'Islam dans toute la péninsule arabique après la conquête de La Mecque.",
        "category": "importance"
    },
    {
        "question": "Quelle était la situation de l'Islam à la fin de l'Année des Délégations ?",
        "options": ["Il était faible", "Il dominait la péninsule arabique", "Il était en déclin", "Il était limité à une ville"],
        "correct": 1,
        "explanation": "À la fin de l'Année des Délégations, l'Islam dominait la péninsule arabique, avec la plupart des tribus ayant accepté l'Islam.",
        "category": "importance"
    },
    
    # Événement 39: Pèlerinage d'Adieu (632)
    {
        "question": "Combien de musulmans ont accompagné le Prophète ﷺ lors du Pèlerinage d'Adieu ?",
        "options": ["10 000", "50 000", "Plus de 100 000", "200 000"],
        "correct": 2,
        "explanation": "Plus de 100 000 musulmans ont accompagné le Prophète ﷺ lors de son premier et dernier Hajj en Dhul-Hijjah 10 AH (mars 632).",
        "category": "date"
    },
    {
        "question": "Qu'a prononcé le Prophète ﷺ lors du Pèlerinage d'Adieu ?",
        "options": ["Un poème", "Le Sermon d'Adieu", "Une déclaration de guerre", "Un testament"],
        "correct": 1,
        "explanation": "Le Prophète ﷺ a prononcé le célèbre Sermon d'Adieu le jour d'Arafah, établissant les principes fondamentaux des droits humains et de l'égalité.",
        "category": "context"
    },
    {
        "question": "Quels principes importants le Sermon d'Adieu a-t-il établis ?",
        "options": ["La supériorité raciale", "L'égalité de tous les humains, les droits des femmes, la sacralité de la vie et des biens", "La guerre", "La richesse"],
        "correct": 1,
        "explanation": "Le Sermon d'Adieu a établi l'égalité de tous les humains devant Allah, les droits des femmes, la sacralité de la vie et des biens, et l'importance de la justice.",
        "category": "importance"
    },
    
    # Événement 40: Révélation du Verset Final (632)
    {
        "question": "Quel verset a été révélé lors du Pèlerinage d'Adieu ?",
        "options": ["Le premier verset", "Le verset de la perfection de la religion (Al-Ma'idah 5:3)", "Le dernier verset", "Un verset de guerre"],
        "correct": 1,
        "explanation": "Le verset 'Aujourd'hui, J'ai parachevé pour vous votre religion...' (Sourate Al-Ma'idah 5:3) a été révélé le jour d'Arafah.",
        "category": "context"
    },
    {
        "question": "Que signifie ce verset pour l'Islam ?",
        "options": ["Qu'il était incomplet", "Que la religion a été parachevée et complétée", "Qu'il fallait changer", "Qu'il était temporaire"],
        "correct": 1,
        "explanation": "Ce verset signifie qu'Allah a parachevé la religion islamique, la rendant complète et parfaite pour toute l'humanité jusqu'au Jour du Jugement.",
        "category": "importance"
    },
    {
        "question": "Comment les compagnons ont-ils réagi à ce verset ?",
        "options": ["Avec joie uniquement", "Avec joie mêlée de tristesse, comprenant que la mission du Prophète ﷺ touchait à sa fin", "Avec indifférence", "Avec colère"],
        "correct": 1,
        "explanation": "Les compagnons ont réagi avec joie pour la perfection de la religion, mais aussi avec tristesse car ils ont compris que cela signalait la fin proche de la vie du Prophète ﷺ.",
        "category": "importance"
    },
    
    # Événement 41: Décès du Prophète Muhammad ﷺ (632)
    {
        "question": "En quelle année le Prophète Muhammad ﷺ est-il décédé ?",
        "options": ["10 AH (631)", "11 AH (632)", "12 AH (633)", "13 AH (634)"],
        "correct": 1,
        "explanation": "Le Prophète Muhammad ﷺ est décédé le 12 Rabi' al-Awwal 11 AH (8 juin 632 après J.-C.), un lundi.",
        "category": "date"
    },
    {
        "question": "Où le Prophète ﷺ est-il décédé ?",
        "options": ["À La Mecque", "Dans la maison de 'Aishah à Médine", "À Jérusalem", "En voyage"],
        "correct": 1,
        "explanation": "Le Prophète ﷺ est décédé dans la maison de 'Aishah رضي الله عنها à Médine, et a été enterré au même endroit.",
        "category": "context"
    },
    {
        "question": "Quel âge avait le Prophète ﷺ à son décès ?",
        "options": ["50 ans", "60 ans", "63 ans", "70 ans"],
        "correct": 2,
        "explanation": "Le Prophète ﷺ avait 63 ans à son décès, ayant vécu 40 ans avant la prophétie et 23 ans comme prophète.",
        "category": "importance"
    }
]

print(f"Questions finales créées: {len(final_questions)}")

# Ajouter aux questions existantes
all_questions = questions + final_questions

print(f"\nTotal de questions: {len(all_questions)}")
print(f"Objectif: 123 questions (41 événements × 3)")
print(f"Questions manquantes: {123 - len(all_questions)}")

# Sauvegarder
with open('data/sira-quiz.json', 'w', encoding='utf-8') as f:
    json.dump(all_questions, f, ensure_ascii=False, indent=2)

print(f"\n✅ Fichier final créé: data/sira-quiz.json")
print(f"Total: {len(all_questions)} questions")

# Vérifier la distribution des réponses correctes
correct_positions = [q['correct'] for q in all_questions]
from collections import Counter
distribution = Counter(correct_positions)
print(f"\nDistribution des réponses correctes:")
for pos, count in sorted(distribution.items()):
    print(f"  Position {pos} (option {chr(65+pos)}): {count} questions ({count/len(all_questions)*100:.1f}%)")
