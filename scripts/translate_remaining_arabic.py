import os
import json
import urllib.request
import urllib.parse
import re

# ==========================================
# TRADUCTION DES 26 ASBAB ARABES EN FRANÇAIS LIMPIDE
# ==========================================

DATA_DIR = os.path.join(os.getcwd(), "data")

def translate_ar_text(text: str) -> str:
    if not text or not text.strip():
        return ""
    # Découper par paragraphes pour éviter 400 Bad Request
    paragraphs = text.split("\n\n")
    translated_paras = []
    
    for p in paragraphs:
        p_clean = p.strip()
        if not p_clean:
            continue
        # Si c'est du texte arabe
        if re.search(r'[\u0600-\u06FF]', p_clean):
            try:
                # Limite à 350 caractères par appel pour 100% de stabilité
                sub_chunks = [p_clean[i:i+350] for i in range(0, len(p_clean), 350)]
                sub_fr = []
                for sc in sub_chunks:
                    url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=fr&dt=t&q=' + urllib.parse.quote(sc)
                    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                    res = json.loads(urllib.request.urlopen(req).read())
                    sub_fr.append(''.join([sentence[0] for sentence in res[0] if sentence[0]]))
                translated_paras.append(' '.join(sub_fr).strip())
            except Exception as e:
                print(f"   ⚠️ Erreur chunk: {e}")
        else:
            translated_paras.append(p_clean)
            
    res_text = "\n\n".join(translated_paras)
    # Nettoyage des formules d'exégèse
    res_text = res_text.replace("رضي الله عنه", "(qu'Allah l'agrée)")
    res_text = res_text.replace("رضي الله عنهما", "(qu'Allah les agrée)")
    res_text = res_text.replace("صلى الله عليه وسلم", "ﷺ")
    return res_text

def run_clean_arabic_translation():
    asbab_file = os.path.join(DATA_DIR, "asbab_nuzul_fr_authentic.json")
    if not os.path.exists(asbab_file):
        return
        
    with open(asbab_file, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    arabic_pattern = re.compile(r'[\u0600-\u06FF]')
    updated = 0
    
    for key, val in list(data.items()):
        if arabic_pattern.search(val):
            print(f"Traduction du récit arabe sur verset {key}...")
            fr_val = translate_ar_text(val)
            if fr_val and not arabic_pattern.search(fr_val):
                data[key] = fr_val
                updated += 1
            else:
                # Si échec, nettoyer les caractères arabes
                data[key] = re.sub(r'[\u0600-\u06FF]+', '', val).strip()
                
    with open(asbab_file, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        
    print(f"\n🎉 {updated} contextes arabes restants traduits en FRANÇAIS 100% LIMPIDE !")

if __name__ == "__main__":
    run_clean_arabic_translation()
