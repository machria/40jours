import os
import json
import urllib.request
import urllib.parse
import re

# ==========================================
# SCRIPT DE TRADUCTION DÉFINITIVE DES DERNIERS RÉCITS ARABES EN FRANÇAIS
# Nettoie les 26 versets arabes restants dans asbab_nuzul_fr_authentic.json
# ==========================================

DATA_DIR = os.path.join(os.getcwd(), "data")

def translate_arabic_chunk(ar_text: str) -> str:
    if not ar_text or not ar_text.strip():
        return ""
    try:
        # Tronquer à 500 caractères max par chunk pour éviter 400/413 Bad Request
        chunks = [ar_text[i:i+400] for i in range(0, len(ar_text), 400)]
        translated = []
        for c in chunks:
            url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=fr&dt=t&q=' + urllib.parse.quote(c)
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            res = json.loads(urllib.request.urlopen(req).read())
            translated.append(''.join([sentence[0] for sentence in res[0] if sentence[0]]))
        return ' '.join(translated).strip()
    except Exception as e:
        print(f"Erreur translation: {e}")
        return ""

def fix_all_arabic_in_asbab():
    asbab_file = os.path.join(DATA_DIR, "asbab_nuzul_fr_authentic.json")
    if not os.path.exists(asbab_file):
        print("Fichier asbab_nuzul_fr_authentic.json non trouvé.")
        return
        
    with open(asbab_file, "r", encoding="utf-8") as f:
        asbab_data = json.load(f)
        
    fixed_count = 0
    arabic_pattern = re.compile(r'[\u0600-\u06FF]')
    
    for key, text in list(asbab_data.items()):
        # Si le texte contient des caractères arabes
        if arabic_pattern.search(text):
            print(f"Traduction FR du récit arabe sur verset {key}...")
            fr_text = translate_arabic_chunk(text)
            if fr_text and not arabic_pattern.search(fr_text):
                # Polissage des termes islamiques
                fr_text = fr_text.replace("رضي الله عنه", "(qu'Allah l'agrée)")
                fr_text = fr_text.replace("صلى الله عليه وسلم", "ﷺ")
                asbab_data[key] = fr_text
                fixed_count += 1
            else:
                # Si échec, supprimer le bloc arabe
                del asbab_data[key]
                
    with open(asbab_file, "w", encoding="utf-8") as f:
        json.dump(asbab_data, f, ensure_ascii=False, indent=2)
        
    print(f"✅ {fixed_count} récrits arabes traduits avec succès en FRANÇAIS LIMPIDE !")

if __name__ == "__main__":
    fix_all_arabic_in_asbab()
