import json
import os

# Define the correct French titles based on ID (Standard Hisn al-Muslim)
ID_TO_TITLE_FR = {
    1: "Invocations du matin au réveil",
    2: "Invocation en s'habillant",
    3: "Invocation en mettant un vêtement neuf",
    4: "Invocation pour celui qui met un vêtement neuf",
    5: "Ce que l'on dit en se déshabillant",
    6: "Invocation en entrant aux toilettes",
    7: "Invocation en sortant des toilettes",
    8: "Invocation avant les ablutions",
    9: "Invocation après les ablutions",
    10: "Invocation en sortant de la maison",
    11: "Invocation en entrant dans la maison",
    12: "Invocation en allant à la mosquée",
    13: "Invocation en entrant à la mosquée",
    14: "Invocation en sortant de la mosquée",
    15: "Invocations de l'appel à la prière (Adhan)",
    16: "Invocations de l'ouverture de la prière (Istiftah)",
    17: "Invocations de l'inclinaison (Ruku')",
    18: "Invocations en se redressant de l'inclinaison",
    19: "Invocations de la prosternation (Sujud)",
    20: "Invocations entre les deux prosternations",
    21: "Invocations de la prosternation de la récitation (Tilawah)",
    22: "Le Tachahoud",
    23: "La prière sur le Prophète après le Tachahoud",
    24: "Invocations après le dernier Tachahoud et avant le salut",
    25: "Invocations après la prière",
    26: "Prière de consultation (Istikhara)",
    27: "Invocations du matin et du soir",
    28: "Invocations avant de dormir",
    29: "Invocation quand on se retourne la nuit",
    30: "Invocation en cas d'insomnie ou de peur panique",
    31: "Invocation en cas de mauvais rêve",
    32: "Invocation du Qounout (Witr)",
    33: "Invocation après le salut du Witr",
    34: "Invocation en cas de souci et de tristesse",
    35: "Invocation en cas d'affliction",
    36: "Invocation en rencontrant l'ennemi ou des autorités",
    37: "Invocation de celui qui craint l'injustice d'un dirigeant",
    38: "Invocation contre l'ennemi",
    39: "Invocation de celui qui craint un groupe de gens",
    40: "Invocation de celui qui doute dans sa foi",
    41: "Invocation pour s'acquitter de ses dettes",
    42: "Invocation contre le doute pendant la prière ou la récitation",
    43: "Invocation de celui qui rencontre une difficulté",
    44: "Ce que dit et fait celui qui a commis un péché",
    45: "Invocation pour chasser le diable et ses tentations",
    46: "Invocation quand une chose désagréable arrive ou qu'on n'obtient pas ce que l'on veut",
    47: "Félicitations pour une naissance et réponse aux félicitations",
    48: "Invocation de protection pour les enfants",
    49: "Invocation en visitant un malade",
    50: "Le mérite de visiter un malade",
    51: "Invocation du malade qui désespère de vivre",
    52: "Incitation du mourant à prononcer la Chahada",
    53: "Invocation de celui qui a subi un malheur",
    54: "Invocation en fermant les yeux du mort",
    55: "Invocations prière mortuaire (Janaza)",
    56: "Invocation prière mortuaire pour un enfant",
    57: "Invocation de condoléances",
    58: "Invocation en plaçant le mort dans la tombe",
    59: "Invocation après l'enterrement",
    60: "Invocation en visitant les tombes",
    61: "Invocation lorsque le vent souffle",
    62: "Invocation lorsque le tonnerre gronde",
    63: "Invocations pour la demande de pluie (Istisqa)",
    64: "Invocation quand il pleut",
    65: "Invocation après la pluie",
    66: "Invocation pour demander l'arrêt de la pluie",
    67: "Invocation à la vue du croissant de lune",
    68: "Invocation à la rupture du jeûne",
    69: "Invocation avant le repas",
    70: "Invocation après le repas",
    71: "Invocation de l'invité pour son hôte",
    72: "Invocation pour celui qui nous offre à boire",
    73: "Invocation pour la famille chez qui on rompt le jeûne",
    74: "Invocation du jeûneur lorsqu'on lui présente à manger et qu'il ne rompt pas son jeûne",
    75: "Ce que doit dire le jeûneur si on l'insulte",
    76: "Invocation à la vue des premiers fruits",
    77: "Invocation en cas d'éternuement",
    78: "Ce qu'on dit au mécréant lorsqu'il éternue et loue Allah",
    79: "Invocation du marié",
    80: "Invocation de l'époux la nuit de noces ou à l'achat d'une monture",
    81: "Invocation avant les rapports intimes",
    82: "Invocation contre la colère",
    83: "Invocation en voyant une personne éprouvée",
    84: "Invocation dans une assemblée",
    85: "Invocation de clôture de l'assemblée (Kaffaratul-Majlis)",
    86: "Invocation pour celui qui dit : \"Qu'Allah te pardonne\"",
    87: "Invocation pour celui qui vous a fait un bienfait",
    88: "Protection contre l'Antéchrist (Dajjal)",
    89: "Invocation pour celui qui dit : \"Je t'aime en Allah\"",
    90: "Invocation pour celui qui vous propose son argent",
    91: "Invocation de celui qui rembourse une dette",
    92: "Invocation contre le polythéisme (Shirk)",
    93: "Invocation pour celui qui dit : \"Barak Allahu Fik\"",
    94: "Invocation contre la superstition",
    95: "Invocation en montant sur une monture ou un véhicule",
    96: "Invocation du voyage",
    97: "Invocation en entrant dans un village ou une ville",
    98: "Invocation en entrant au marché",
    99: "Invocation lorsque la monture trébuche",
    100: "Invocation du voyageur pour ceux qu'il laisse",
    101: "Invocation du résident pour le voyageur",
    102: "Le Takbir et le Tasbih au cours du voyage",
    103: "Invocation du voyageur au petit matin",
    104: "Invocation lors d'une escale en voyage",
    105: "Invocation au retour de voyage",
    106: "Ce que l'on dit lorsqu'on reçoit une nouvelle plaisante ou déplaisante",
    107: "Le mérite de la prière sur le Prophète",
    108: "Le mérite de saluer (Salam)",
    109: "La réponse au salut des gens du Livre",
    110: "Invocation au chant du coq et au braiment de l'âne",
    111: "Invocation à l'aboiement des chiens la nuit",
    112: "Invocation pour celui qu'on a insulté",
    113: "Ce que dit le musulman lorsqu'il fait l'éloge d'un musulman",
    114: "Ce que doit dire celui qui reçoit des éloges",
    115: "La Talbiya du Hajj et de la 'Omra",
    116: "Le Takbir au coin de la Pierre Noire",
    117: "Invocation entre le coin yéménite et la Pierre Noire",
    118: "Invocation sur le Mont Safa et le Mont Marwah",
    119: "Invocation le jour d'Arafat",
    120: "Invocation à Al-Mach'ar Al-Haram (Muzdalifa)",
    121: "Le Takbir lors de la lapidation des stèles (Jamarat)",
    122: "Ce qu'on dit lorsqu'on s'étonne ou qu'on est surpris",
    123: "Ce qu'on dit lorsqu'une chose nous plaît",
    124: "Ce qu'on dit lorsqu'on ressent une douleur dans le corps",
    125: "Invocation pour celui qui craint d'atteindre quelque chose de son mauvais œil",
    126: "Ce qu'on dit lorsqu'on est effrayé",
    127: "Ce qu'on dit en égorgeant une bête",
    128: "Ce qu'on dit pour repousser les ruses des diables",
    129: "Le repentir et la demande de pardon (Istighfar)",
    130: "Le mérite du rappel d'Allah (Dhikr)",
    131: "La manière dont le Prophète glorifiait Allah (Tasbih)",
    132: "Types de bienfaits et règles de vie commune"
}

def repair_hisn_titles():
    input_path = r'c:\Users\majid\Documents\islam\data\hisn\fra-hisn.json'
    
    try:
        with open(input_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        print(f"Loaded {len(data)} chapters from {input_path}")
        
        updated_count = 0
        for chapter in data:
            chapter_id = chapter.get('id')
            if chapter_id in ID_TO_TITLE_FR:
                old_title = chapter.get('title')
                new_title = ID_TO_TITLE_FR[chapter_id]
                
                if old_title != new_title:
                    chapter['title'] = new_title
                    updated_count += 1
                    # print(f"Updated ID {chapter_id}: '{old_title}' -> '{new_title}'")
            else:
                print(f"Warning: ID {chapter_id} not found in translation map.")

        if updated_count > 0:
            with open(input_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=4, ensure_ascii=False)
            print(f"Successfully updated {updated_count} titles in {input_path}")
        else:
            print("No updates were needed.")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    repair_hisn_titles()
