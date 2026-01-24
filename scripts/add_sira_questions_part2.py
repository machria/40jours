import json
import random

# Charger les questions existantes
with open('data/sira-quiz.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

print(f"Questions existantes: {len(questions)}")

# Questions restantes pour les événements 21-41
remaining_questions = [
    # Événement 21: Voyage à Ta'if (619)
    {
        "question": "Pourquoi le Prophète ﷺ s'est-il rendu à Ta'if ?",
        "options": ["Pour le commerce", "Pour chercher du soutien après l'Année du Chagrin", "Pour visiter des amis", "Pour conquérir la ville"],
        "correct": 1,
        "explanation": "Après l'Année du Chagrin et la perte de sa protection, le Prophète ﷺ s'est rendu à Ta'if pour chercher du soutien et de la protection.",
        "category": "context"
    },
    {
        "question": "Comment les habitants de Ta'if ont-ils traité le Prophète ﷺ ?",
        "options": ["Ils l'ont accueilli chaleureusement", "Ils l'ont ignoré", "Ils l'ont accepté immédiatement", "Ils l'ont rejeté et lapidé"],
        "correct": 3,
        "explanation": "Les habitants de Ta'if ont rejeté le Prophète ﷺ et l'ont lapidé, le blessant gravement. Ce fut l'un des moments les plus difficiles de sa vie.",
        "category": "context"
    },
    {
        "question": "Quelle fut la réaction du Prophète ﷺ quand l'ange Jibril lui a proposé de détruire Ta'if ?",
        "options": ["Il a accepté immédiatement", "Il a demandé plus de temps", "Il a refusé et prié pour leur guidance", "Il est parti en colère"],
        "correct": 2,
        "explanation": "Le Prophète ﷺ a refusé de détruire Ta'if et a prié pour que leurs descendants soient guidés vers l'Islam, montrant sa miséricorde exceptionnelle.",
        "category": "importance"
    },
    
    # Événement 22: Al-Isra' wal-Mi'raj (620)
    {
        "question": "En quelle année a eu lieu le voyage nocturne (Isra' wal-Mi'raj) ?",
        "options": ["619 après J.-C.", "620 après J.-C.", "621 après J.-C.", "622 après J.-C."],
        "correct": 1,
        "explanation": "Le voyage nocturne (Isra' wal-Mi'raj) a eu lieu le 27 Rajab 620 après J.-C.",
        "category": "date"
    },
    {
        "question": "Où le Prophète ﷺ a-t-il été transporté lors de l'Isra' ?",
        "options": ["À Médine", "À Jérusalem (Masjid al-Aqsa)", "En Syrie", "Au Yémen"],
        "correct": 1,
        "explanation": "Lors de l'Isra', le Prophète ﷺ a été transporté miraculeusement de La Mecque à Jérusalem (Masjid al-Aqsa).",
        "category": "context"
    },
    {
        "question": "Qu'a reçu le Prophète ﷺ lors du Mi'raj (ascension) ?",
        "options": ["De l'argent", "Le commandement des cinq prières quotidiennes", "Un livre", "Une armée"],
        "correct": 1,
        "explanation": "Lors du Mi'raj, le Prophète ﷺ a ascensionné vers les cieux, rencontré les prophètes, et reçu le commandement des cinq prières quotidiennes.",
        "category": "importance"
    },
    
    # Événement 23: Premier Serment d''Aqabah (621)
    {
        "question": "Combien d'hommes de Yathrib ont prêté serment lors du premier serment d''Aqabah ?",
        "options": ["3 hommes", "6 hommes", "12 hommes", "73 hommes"],
        "correct": 1,
        "explanation": "Six hommes de Yathrib (Médine) ont rencontré le Prophète ﷺ et ont prêté serment lors du premier serment d''Aqabah en 621.",
        "category": "date"
    },
    {
        "question": "Que signifiait le serment d''Aqabah ?",
        "options": ["Un traité commercial", "Un engagement à soutenir le Prophète ﷺ et l'Islam", "Une déclaration de guerre", "Un mariage"],
        "correct": 1,
        "explanation": "Le serment d''Aqabah était un engagement des Ansaris de Médine à soutenir le Prophète ﷺ et l'Islam.",
        "category": "context"
    },
    {
        "question": "Quelle fut l'importance du premier serment d''Aqabah ?",
        "options": ["Aucune importance", "Il a ouvert la voie à la Hijrah vers Médine", "Il a causé une guerre", "Il a enrichi les musulmans"],
        "correct": 1,
        "explanation": "Le premier serment d''Aqabah a ouvert la voie à la Hijrah en établissant un lien entre le Prophète ﷺ et les habitants de Médine.",
        "category": "importance"
    },
    
    # Événement 24: Second Serment d''Aqabah (622)
    {
        "question": "Combien de personnes ont participé au second serment d''Aqabah ?",
        "options": ["6 personnes", "12 personnes", "75 personnes (73 hommes et 2 femmes)", "100 personnes"],
        "correct": 2,
        "explanation": "Le second serment d''Aqabah a réuni 73 hommes et 2 femmes de Médine, soit 75 personnes au total.",
        "category": "date"
    },
    {
        "question": "Quelle était la différence entre le premier et le second serment d''Aqabah ?",
        "options": ["Aucune différence", "Le second incluait un engagement à protéger le Prophète ﷺ", "Le premier était plus important", "Le second était commercial"],
        "correct": 1,
        "explanation": "Le second serment incluait un engagement à protéger le Prophète ﷺ comme ils protégeraient leurs propres familles, préparant la Hijrah.",
        "category": "context"
    },
    {
        "question": "Qu'a permis le second serment d''Aqabah ?",
        "options": ["La construction d'une mosquée", "La Hijrah vers Médine", "Une bataille", "Un traité de paix"],
        "correct": 1,
        "explanation": "Le second serment d''Aqabah a pavé la voie à la Hijrah en garantissant la protection et le soutien du Prophète ﷺ à Médine.",
        "category": "importance"
    },
    
    # Événement 25: Hijrah vers Médine (622)
    {
        "question": "En quelle année a eu lieu la Hijrah vers Médine ?",
        "options": ["620 après J.-C.", "621 après J.-C.", "622 après J.-C.", "623 après J.-C."],
        "correct": 2,
        "explanation": "La Hijrah vers Médine a eu lieu en 622 après J.-C., marquant le début du calendrier islamique (1er Muharram 1 AH).",
        "category": "date"
    },
    {
        "question": "Pourquoi le Prophète ﷺ a-t-il émigré à Médine ?",
        "options": ["Pour le commerce", "Pour échapper à une tentative d'assassinat et établir un État islamique", "Pour visiter des amis", "Pour conquérir la ville"],
        "correct": 1,
        "explanation": "Le Prophète ﷺ a émigré à Médine pour échapper à une tentative d'assassinat des Quraysh et pour établir le premier État islamique.",
        "category": "context"
    },
    {
        "question": "Quelle est l'importance de la Hijrah dans l'Islam ?",
        "options": ["C'est un événement mineur", "Elle marque le début du calendrier islamique et de l'État islamique", "C'est juste un voyage", "Elle n'a aucune importance"],
        "correct": 1,
        "explanation": "La Hijrah est d'une importance capitale car elle marque le début du calendrier islamique et l'établissement du premier État islamique à Médine.",
        "category": "importance"
    },
    
    # Événement 26: Construction de Masjid an-Nabawi (622)
    {
        "question": "Qu'a construit le Prophète ﷺ en arrivant à Médine ?",
        "options": ["Un palais", "Masjid an-Nabawi (la Mosquée du Prophète)", "Un marché", "Une forteresse"],
        "correct": 1,
        "explanation": "Le Prophète ﷺ a construit Masjid an-Nabawi (la Mosquée du Prophète) en arrivant à Médine en 622.",
        "category": "context"
    },
    {
        "question": "Quelle était la fonction de Masjid an-Nabawi ?",
        "options": ["Uniquement pour la prière", "Centre de la communauté musulmane (prière, éducation, gouvernance)", "Un musée", "Une bibliothèque"],
        "correct": 1,
        "explanation": "Masjid an-Nabawi était le centre de la communauté musulmane, servant de lieu de prière, d'éducation, de gouvernance et de rencontres.",
        "category": "importance"
    },
    {
        "question": "Où se trouve Masjid an-Nabawi aujourd'hui ?",
        "options": ["À La Mecque", "À Médine", "À Jérusalem", "À Damas"],
        "correct": 1,
        "explanation": "Masjid an-Nabawi se trouve toujours à Médine et est l'une des trois mosquées les plus sacrées de l'Islam.",
        "category": "importance"
    },
    
    # Événement 27: Fraternité entre Muhajirun et Ansar (622)
    {
        "question": "Qui sont les Muhajirun ?",
        "options": ["Les habitants de Médine", "Les migrants de La Mecque vers Médine", "Les ennemis de l'Islam", "Les commerçants"],
        "correct": 1,
        "explanation": "Les Muhajirun sont les musulmans qui ont émigré de La Mecque vers Médine avec le Prophète ﷺ.",
        "category": "context"
    },
    {
        "question": "Qui sont les Ansar ?",
        "options": ["Les migrants", "Les auxiliaires de Médine qui ont accueilli les musulmans", "Les Quraysh", "Les étrangers"],
        "correct": 1,
        "explanation": "Les Ansar (Auxiliaires) sont les habitants de Médine qui ont accueilli et soutenu le Prophète ﷺ et les Muhajirun.",
        "category": "context"
    },
    {
        "question": "Qu'a établi le Prophète ﷺ entre les Muhajirun et les Ansar ?",
        "options": ["Un traité commercial", "Une fraternité (Mu'akhah)", "Une guerre", "Une séparation"],
        "correct": 1,
        "explanation": "Le Prophète ﷺ a établi la fraternité (Mu'akhah) entre les Muhajirun et les Ansar, créant des liens fraternels forts entre eux.",
        "category": "importance"
    },
    
    # Événement 28: Bataille de Badr (624)
    {
        "question": "En quelle année a eu lieu la Bataille de Badr ?",
        "options": ["1 AH (623)", "2 AH (624)", "3 AH (625)", "5 AH (627)"],
        "correct": 1,
        "explanation": "La Bataille de Badr a eu lieu le 17 Ramadan 2 AH (13 mars 624 après J.-C.).",
        "category": "date"
    },
    {
        "question": "Combien de musulmans ont participé à la Bataille de Badr ?",
        "options": ["100", "313", "1000", "3000"],
        "correct": 1,
        "explanation": "313 musulmans ont participé à la Bataille de Badr contre environ 1000 Quraysh.",
        "category": "context"
    },
    {
        "question": "Quelle est l'importance de la Bataille de Badr ?",
        "options": ["C'était une défaite", "C'est la première grande victoire musulmane malgré l'infériorité numérique", "C'était un match nul", "Elle n'a aucune importance"],
        "correct": 1,
        "explanation": "Badr est la première grande victoire musulmane et un tournant majeur, prouvant qu'Allah soutient les croyants malgré leur infériorité numérique.",
        "category": "importance"
    },
    
    # Événement 29: Bataille d'Uhud (625)
    {
        "question": "Combien de guerriers Quraysh ont attaqué lors de la Bataille d'Uhud ?",
        "options": ["1000", "2000", "3000", "5000"],
        "correct": 2,
        "explanation": "Les Quraysh sont revenus avec 3000 guerriers lors de la Bataille d'Uhud pour venger leur défaite à Badr.",
        "category": "date"
    },
    {
        "question": "Pourquoi les musulmans ont-ils subi des pertes à Uhud ?",
        "options": ["Ils étaient faibles", "Les archers ont quitté leurs positions prématurément", "Ils ont fui", "Ils n'avaient pas d'armes"],
        "correct": 1,
        "explanation": "Les musulmans ont subi des pertes car les archers ont quitté leurs positions prématurément pour collecter le butin, permettant à Khalid ibn al-Walid d'attaquer par derrière.",
        "category": "context"
    },
    {
        "question": "Quelle leçon importante Uhud a-t-elle enseignée aux musulmans ?",
        "options": ["Qu'ils étaient invincibles", "L'importance de l'obéissance et de la discipline", "Qu'ils devaient abandonner", "Qu'Allah ne les soutenait pas"],
        "correct": 1,
        "explanation": "Uhud a enseigné l'importance cruciale de l'obéissance aux ordres du Prophète ﷺ et de la discipline militaire.",
        "category": "importance"
    },
    
    # Événement 30: Bataille de la Tranchée (627)
    {
        "question": "Combien de guerriers ont assiégé Médine lors de la Bataille de la Tranchée ?",
        "options": ["1000", "3000", "5000", "10 000"],
        "correct": 3,
        "explanation": "Les Quraysh et leurs alliés ont assiégé Médine avec 10 000 guerriers lors de la Bataille de la Tranchée (Khandaq).",
        "category": "date"
    },
    {
        "question": "Qui a suggéré de creuser une tranchée autour de Médine ?",
        "options": ["Abu Bakr", "Salman al-Farsi", "'Umar", "Ali"],
        "correct": 1,
        "explanation": "Salman al-Farsi, un compagnon perse, a suggéré de creuser une tranchée, une tactique militaire persane inconnue des Arabes.",
        "category": "context"
    },
    {
        "question": "Quel fut le résultat de la Bataille de la Tranchée ?",
        "options": ["Défaite musulmane", "Victoire musulmane sans combat direct grâce à la tranchée", "Match nul", "Conquête de La Mecque"],
        "correct": 1,
        "explanation": "Les musulmans ont défendu avec succès Médine grâce à la tranchée, et les assiégeants se sont retirés après un mois, marquant une victoire stratégique.",
        "category": "importance"
    }
]

print(f"Nouvelles questions créées: {len(remaining_questions)}")

# Ajouter aux questions existantes
all_questions = questions + remaining_questions

print(f"Total de questions: {len(all_questions)}")
print(f"Questions restantes à créer: {(41 * 3) - len(all_questions)}")

# Sauvegarder
with open('data/sira-quiz.json', 'w', encoding='utf-8') as f:
    json.dump(all_questions, f, ensure_ascii=False, indent=2)

print(f"\n✅ Fichier mis à jour: data/sira-quiz.json")
print(f"Total: {len(all_questions)} questions")
