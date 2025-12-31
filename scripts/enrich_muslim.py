import json
import re
import os

FILE_PATH = "data/hadith/muslim_ahmedbaset_fr.json"

CHAPTER_TRANSLATIONS = {
    "1": "Le Livre de la Foi",
    "2": "Le Livre de la Purification",
    "3": "Le Livre des Menstrues",
    "4": "Le Livre de la Prière",
    "5": "Le Livre des Mosquées et des lieux de prière",
    "6": "Le Livre de la Prière - Voyageurs",
    "7": "Le Livre de la Prière - Vendredi",
    "8": "Le Livre de la Prière - Les deux Aïd",
    "9": "Le Livre de la Prière - La demande de pluie (Istisqa)",
    "10": "Le Livre de la Prière - Éclipses",
    "11": "Le Livre de la Prière - Funérailles",
    "12": "Le Livre de la Zakat",
    "13": "Le Livre du Jeûne",
    "14": "Le Livre de la Retraite spirituelle (I'tikaf)",
    "15": "Le Livre du Pèlerinage",
    "16": "Le Livre du Mariage",
    "17": "Le Livre de l'Allaitement",
    "18": "Le Livre du Divorce",
    "19": "Le Livre du Li'an (Serment d'anathème)",
    "20": "Le Livre de l'Affranchissement",
    "21": "Le Livre des Transactions (Ventes)",
    "22": "Le Livre de la Musaqah (Irrigation)",
    "23": "Le Livre des Successions (Fara'id)",
    "24": "Le Livre des Dons",
    "25": "Le Livre des Testaments",
    "26": "Le Livre des Vœux",
    "27": "Le Livre des Serments",
    "28": "Le Livre des Serments, des Muharibin, du Qasas et des Diyat",
    "29": "Le Livre des Peines légales (Hudud)",
    "30": "Le Livre des Jugements",
    "31": "Le Livre des Objets trouvés",
    "32": "Le Livre du Jihad et des Expéditions",
    "33": "Le Livre du Gouvernement (Al-Imara)",
    "34": "Le Livre de la Chasse, de l'Abattage et des Animaux comestibles",
    "35": "Le Livre des Sacrifices",
    "36": "Le Livre des Boissons",
    "37": "Le Livre des Vêtements et de la Parure",
    "38": "Le Livre des Bonnes Manières",
    "39": "Le Livre des Salutations",
    "40": "Le Livre de l'Usage des Mots Corrects",
    "41": "Le Livre de la Poésie",
    "42": "Le Livre des Rêves",
    "43": "Le Livre des Vertus",
    "44": "Le Livre des Mérites des Compagnons",
    "45": "Le Livre de la Vertu, des Bonnes Manières et des Liens de Parenté",
    "46": "Le Livre du Destin (Qadar)",
    "47": "Le Livre de la Science",
    "48": "Le Livre de l'Évocation, des Invocations, du Repentir et du Pardon",
    "49": "Le Livre de l'Adoucissement des Cœurs (Ar-Riqaq)",
    "50": "Le Livre du Repentir",
    "51": "Caractéristiques des Hypocrites et leurs Jugements",
    "52": "Caractéristiques du Jour du Jugement, du Paradis et de l'Enfer",
    "53": "Le Livre du Paradis, ses délices et ses habitants",
    "54": "Le Livre des Tribulations et des Signes de l'Heure",
    "55": "Le Livre de l'Ascétisme et de la Piété",
    "56": "Le Livre de l'Exégèse du Coran",
    "0": "Introduction"
}

def analyze_type(text, narrator):
    combined = (narrator + " " + text).lower()
    
    # Qudsi indicators
    if re.search(r"allah.*said", combined) or \
       re.search(r"my lord.*said", combined) or \
       re.search(r"saith the lord", combined) or \
       re.search(r"says allah", combined):
        # Must distinguish from Prophet quoting Quran. 
        # But Qudsi usually phrased as "Prophet said: Allah said..."
        # Simplistic check for now, can be refined.
        if "prophet" in combined or "messenger" in combined:
             return "Qudsi"
    
    # Marfou indicators (Prophet said/did/approved)
    marfou_indicators = [
        "prophet", "messenger of allah", "apostle of allah", 
        "heard him saying", "narrated from him", "peace be upon him"
    ]
    if any(ind in combined for ind in marfou_indicators):
        return "Marfou"
        
    return "Mawqouf" # Fallback, likely companion if in Sahih Muslim

def main():
    if not os.path.exists(FILE_PATH):
        print(f"File not found: {FILE_PATH}")
        return

    with open(FILE_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Update chapters
    for chapter in data.get('chapters', []):
        chap_id = str(chapter['id'])
        if chap_id in CHAPTER_TRANSLATIONS:
            # We add a 'french' field if we want to follow new schema, 
            # or just rely on the 'french' object in existing schema?
            # Creating 'french' key if not exists, or string?
            # The current 'chapters' have arabic/english strings.
            # Let's add 'french' string.
            chapter['french'] = CHAPTER_TRANSLATIONS[chap_id]

    # Tag hadiths
    count_qudsi = 0
    count_marfou = 0
    count_mawqouf = 0

    for hadith in data.get('hadiths', []):
        eng_text = hadith.get('english', {}).get('text', '')
        eng_narrator = hadith.get('english', {}).get('narrator', '')
        
        hadith_type = analyze_type(eng_text, eng_narrator)
        
        # Add tags field
        hadith['tags'] = [hadith_type]
        
        if hadith_type == "Qudsi": count_qudsi += 1
        elif hadith_type == "Marfou": count_marfou += 1
        else: count_mawqouf += 1

    print(f"Processed Hadiths. Qudsi: {count_qudsi}, Marfou: {count_marfou}, Mawqouf: {count_mawqouf}")

    with open(FILE_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"Updated {FILE_PATH}")

if __name__ == "__main__":
    main()
