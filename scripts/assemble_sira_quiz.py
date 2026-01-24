import json

# Charger les données de la Sira
with open('public/data/seerah-fr.json', 'r', encoding='utf-8') as f:
    seerah_data = json.load(f)

# Charger les questions existantes
with open('data/sira-quiz-part1.json', 'r', encoding='utf-8') as f:
    existing_questions = json.load(f)

print(f"Questions existantes: {len(existing_questions)}")
print(f"Événements de la Sira: {len(seerah_data)}")

# On s'arrête à l'événement 41 (Décès du Prophète ﷺ)
# Les événements sont indexés de 0 à 40 (41 événements au total)
events_to_cover = seerah_data[:41]

print(f"Événements à couvrir: {len(events_to_cover)}")
print(f"Questions à créer au total: {len(events_to_cover) * 3} (3 par événement)")

# Questions supplémentaires à ajouter (événements 14-41)
additional_questions = [
    # Événement 14: Reconstruction de la Ka'bah (605)
    {
        "question": "En quelle année la Ka'bah a-t-elle été reconstruite par les Quraysh ?",
        "options": ["595 après J.-C.", "605 après J.-C.", "610 après J.-C.", "615 après J.-C."],
        "correct": 1,
        "explanation": "La Ka'bah a été reconstruite par les Quraysh en 605 après J.-C., quand le Prophète ﷺ avait 35 ans.",
        "category": "date"
    },
    {
        "question": "Quel problème le Prophète ﷺ a-t-il résolu lors de la reconstruction de la Ka'bah ?",
        "options": ["Un problème financier", "Un différend sur qui placerait la Pierre Noire", "Un problème de construction", "Un problème de terrain"],
        "correct": 1,
        "explanation": "Le Prophète ﷺ a résolu un différend entre les tribus sur qui aurait l'honneur de placer la Pierre Noire en proposant que toutes les tribus la soulèvent ensemble sur un tissu.",
        "category": "context"
    },
    {
        "question": "Que montre la résolution du différend de la Pierre Noire sur le Prophète ﷺ ?",
        "options": ["Sa force physique", "Sa sagesse et sa capacité à résoudre les conflits", "Sa richesse", "Son pouvoir politique"],
        "correct": 1,
        "explanation": "Cet événement montre la sagesse exceptionnelle du Prophète ﷺ et sa capacité à résoudre les conflits de manière juste et équitable, même avant la révélation.",
        "category": "importance"
    },
    
    # Événement 15: Première Révélation (610)
    {
        "question": "À quel âge le Prophète ﷺ a-t-il reçu la première révélation ?",
        "options": ["35 ans", "40 ans", "45 ans", "50 ans"],
        "correct": 1,
        "explanation": "Le Prophète ﷺ avait 40 ans lorsqu'il a reçu la première révélation le 27 Ramadan 610 après J.-C.",
        "category": "date"
    },
    {
        "question": "Où le Prophète ﷺ a-t-il reçu la première révélation ?",
        "options": ["À la Ka'bah", "Dans la grotte de Hira", "À sa maison", "Au marché"],
        "correct": 1,
        "explanation": "Le Prophète ﷺ a reçu la première révélation dans la grotte de Hira, où il avait l'habitude de se retirer pour méditer.",
        "category": "context"
    },
    {
        "question": "Quels sont les premiers mots révélés du Coran ?",
        "options": ["Bismillah ar-Rahman ar-Rahim", "Iqra' (Lis)", "Al-Hamdulillah", "Allahu Akbar"],
        "correct": 1,
        "explanation": "Les premiers mots révélés furent 'Iqra' bismi Rabbika' (Lis au nom de ton Seigneur) de la Sourate Al-'Alaq, marquant le début de la révélation coranique.",
        "category": "importance"
    },
    
    # Événement 16: Début de la Da'wah secrète (610-613)
    {
        "question": "Combien de temps a duré la période de prédication secrète ?",
        "options": ["1 an", "2 ans", "3 ans", "5 ans"],
        "correct": 2,
        "explanation": "La période de prédication secrète a duré 3 ans, de 610 à 613 après J.-C.",
        "category": "date"
    },
    {
        "question": "Qui furent les premiers à accepter l'Islam ?",
        "options": ["Les riches de La Mecque", "Khadijah, Ali, Zayd ibn Harithah et Abu Bakr", "Les chefs des Quraysh", "Les étrangers"],
        "correct": 1,
        "explanation": "Les premiers à accepter l'Islam furent Khadijah (sa femme), Ali (son cousin), Zayd ibn Harithah (son serviteur affranchi) et Abu Bakr (son ami proche).",
        "category": "context"
    },
    {
        "question": "Pourquoi la prédication était-elle secrète au début ?",
        "options": ["Par peur", "Pour protéger les premiers musulmans de la persécution", "Par honte", "Par stratégie politique"],
        "correct": 1,
        "explanation": "La prédication était secrète pour protéger les premiers musulmans faibles et vulnérables de la persécution des Quraysh, permettant à la communauté de se renforcer progressivement.",
        "category": "importance"
    },
    
    # Événement 17: Début de la prédication publique (613)
    {
        "question": "En quelle année le Prophète ﷺ a-t-il commencé à prêcher publiquement ?",
        "options": ["610 après J.-C.", "613 après J.-C.", "615 après J.-C.", "616 après J.-C."],
        "correct": 1,
        "explanation": "Le Prophète ﷺ a commencé à prêcher publiquement en 613 après J.-C., après avoir reçu l'ordre d'Allah.",
        "category": "date"
    },
    {
        "question": "Où le Prophète ﷺ s'est-il rendu pour appeler publiquement à l'Islam ?",
        "options": ["À la Ka'bah", "Au Mont Safa", "Au marché", "Chez les Quraysh"],
        "correct": 1,
        "explanation": "Le Prophète ﷺ a gravi le Mont Safa et a appelé les Quraysh à l'Islam publiquement, marquant le début de la prédication ouverte.",
        "category": "context"
    },
    {
        "question": "Quelle fut la conséquence de la prédication publique ?",
        "options": ["Acceptation immédiate", "Persécution accrue des musulmans", "Indifférence", "Soutien des Quraysh"],
        "correct": 1,
        "explanation": "La prédication publique a entraîné une persécution accrue des musulmans par les Quraysh, qui voyaient l'Islam comme une menace à leur pouvoir et leurs traditions.",
        "category": "importance"
    },
    
    # Événement 18: Première migration vers l'Abyssinie (615)
    {
        "question": "En quelle année a eu lieu la première migration vers l'Abyssinie ?",
        "options": ["613 après J.-C.", "615 après J.-C.", "616 après J.-C.", "619 après J.-C."],
        "correct": 1,
        "explanation": "La première migration vers l'Abyssinie (Éthiopie) a eu lieu en 615 après J.-C.",
        "category": "date"
    },
    {
        "question": "Pourquoi le Prophète ﷺ a-t-il conseillé aux musulmans de migrer en Abyssinie ?",
        "options": ["Pour le commerce", "En raison de la persécution sévère à La Mecque", "Pour conquérir le pays", "Pour le tourisme"],
        "correct": 1,
        "explanation": "Le Prophète ﷺ a conseillé aux musulmans de migrer en Abyssinie en raison de la persécution sévère qu'ils subissaient à La Mecque, sachant que le roi chrétien était juste.",
        "category": "context"
    },
    {
        "question": "Combien de musulmans ont participé à la première migration vers l'Abyssinie ?",
        "options": ["5 personnes", "11 hommes et 4 femmes", "50 personnes", "100 personnes"],
        "correct": 1,
        "explanation": "La première migration vers l'Abyssinie comprenait 11 hommes et 4 femmes, soit 15 musulmans au total.",
        "category": "importance"
    },
    
    # Événement 19: 'Umar accepte l'Islam (616)
    {
        "question": "En quelle année 'Umar ibn al-Khattab رضي الله عنه a-t-il accepté l'Islam ?",
        "options": ["613 après J.-C.", "615 après J.-C.", "616 après J.-C.", "619 après J.-C."],
        "correct": 2,
        "explanation": "'Umar ibn al-Khattab رضي الله عنه a accepté l'Islam en 616 après J.-C., quand le Prophète ﷺ avait 45 ans.",
        "category": "date"
    },
    {
        "question": "Qu'est-ce qui a changé après la conversion de 'Umar رضي الله عنه ?",
        "options": ["Rien", "Les musulmans ont pu prier ouvertement à la Ka'bah", "La persécution a augmenté", "Les Quraysh ont accepté l'Islam"],
        "correct": 1,
        "explanation": "Après la conversion de 'Umar, les musulmans ont gagné en force et ont pu prier ouvertement à la Ka'bah grâce à sa présence imposante et son courage.",
        "category": "context"
    },
    {
        "question": "Pourquoi la conversion de 'Umar رضي الله عنه était-elle importante ?",
        "options": ["Il était riche", "Il était fort et courageux, renforçant considérablement la communauté musulmane", "Il était vieux", "Il était étranger"],
        "correct": 1,
        "explanation": "La conversion de 'Umar était cruciale car il était fort, courageux et respecté, ce qui a considérablement renforcé la communauté musulmane et leur a donné plus de confiance.",
        "category": "importance"
    },
    
    # Événement 20: Année du Chagrin (619)
    {
        "question": "En quelle année Khadijah رضي الله عنها et Abu Talib sont-ils décédés ?",
        "options": ["616 après J.-C.", "619 après J.-C.", "620 après J.-C.", "622 après J.-C."],
        "correct": 1,
        "explanation": "Khadijah رضي الله عنها et Abu Talib sont tous deux décédés en 619 après J.-C., la même année appelée 'Année du Chagrin'.",
        "category": "date"
    },
    {
        "question": "Pourquoi cette année est-elle appelée 'Année du Chagrin' ?",
        "options": ["À cause d'une famine", "Car le Prophète ﷺ a perdu sa femme et son oncle protecteur", "À cause d'une guerre", "À cause d'une maladie"],
        "correct": 1,
        "explanation": "Cette année est appelée 'Année du Chagrin' car le Prophète ﷺ a perdu Khadijah, sa plus grande supportrice, et Abu Talib, son protecteur, la même année.",
        "category": "context"
    },
    {
        "question": "Quel impact a eu l'Année du Chagrin sur le Prophète ﷺ ?",
        "options": ["Aucun impact", "Il a perdu son soutien personnel et sa protection tribale", "Il est devenu plus fort", "Il a quitté La Mecque"],
        "correct": 1,
        "explanation": "L'Année du Chagrin a laissé le Prophète ﷺ sans son plus grand soutien émotionnel (Khadijah) et sans sa protection tribale (Abu Talib), augmentant sa vulnérabilité.",
        "category": "importance"
    }
]

print(f"\nQuestions additionnelles créées: {len(additional_questions)}")

# Combiner toutes les questions
all_questions = existing_questions + additional_questions

print(f"Total de questions: {len(all_questions)}")
print(f"Questions restantes à créer: {(41 * 3) - len(all_questions)}")

# Sauvegarder
with open('data/sira-quiz.json', 'w', encoding='utf-8') as f:
    json.dump(all_questions, f, ensure_ascii=False, indent=2)

print(f"\n✅ Fichier sauvegardé: data/sira-quiz.json")
print(f"Total: {len(all_questions)} questions")
