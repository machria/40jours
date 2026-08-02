import os
import json
import urllib.request
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed

# ==========================================
# BUILDER DES CONTEXTES DE RÉVÉLATION AUTHENTIQUES (ASBAB AL-NUZUL EN FRANÇAIS LIMPIDE)
# Source : Dataset Authentique Asbab Al-Nuzul (Al-Bukhari, Muslim, Al-Tirmidhi, Al-Wahidi)
# ==========================================

DATA_DIR = os.path.join(os.getcwd(), "data")

def translate_arabic_hadith_to_french(key: str, ar_text: str):
    """Traduit proprement un hadith / récit d'Asbab Al-Nuzul de l'arabe/anglais vers le français fluide."""
    if not ar_text or len(ar_text.strip()) == 0:
        return key, ""
    try:
        url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=fr&dt=t&q=' + urllib.parse.quote(ar_text.strip())
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = json.loads(urllib.request.urlopen(req).read())
        fr_text = ''.join([sentence[0] for sentence in res[0] if sentence[0]])
        
        # Nettoyage et polissage des formules islamiques en Français
        fr_text = fr_text.replace("رضي الله عنه", "(qu'Allah l'agrée)")
        fr_text = fr_text.replace("رضي الله عنهما", "(qu'Allah les agrée)")
        fr_text = fr_text.replace("صلى الله عليه وسلم", "ﷺ")
        fr_text = fr_text.replace("Wal-Lafz lil-Bukhari", "(Rapporté par Al-Bukhari)")
        fr_text = fr_text.replace("واللفظ للبخاري", "(Rapporté par Al-Bukhari)")
        fr_text = fr_text.replace("واللفظ للترمذي", "(Rapporté par At-Tirmidhi)")
        
        return key, fr_text.strip()
    except Exception as e:
        print(f"   ⚠️ Erreur sur {key}: {e}")
        return key, ar_text

def build_authentic_french_asbab():
    print("==================================================")
    print("🚀 TRADUCTION DE LA BASE DE DONNÉES AUTHENTIQUE D'ASBAB AL-NUZUL")
    print("==================================================\n")
    
    url = 'https://raw.githubusercontent.com/mostafaahmed97/asbab-al-nuzul-dataset/main/data/structured/json/all.json'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    dataset = json.loads(urllib.request.urlopen(req).read())
    
    print(f"📥 {len(dataset)} événements authentiques identifiés. Préparation de la traduction en Français...")
    
    tasks = []
    for item in dataset:
        surah = item.get("surah")
        ayahs = item.get("ayahs", [])
        occasions = item.get("occasions", [])
        if surah and ayahs and occasions:
            occ_text = "\n\n".join(occasions)
            for ayah in ayahs:
                key = f"{surah}_{ayah}"
                tasks.append((key, occ_text))
                
    print(f"⚡ Traduction parallèle de {len(tasks)} versets avec contexte de révélation...")
    
    asbab_fr_map = {}
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(translate_arabic_hadith_to_french, key, text) for key, text in tasks]
        for future in as_completed(futures):
            key, fr_text = future.result()
            if fr_text:
                asbab_fr_map[key] = fr_text
                
    output_file = os.path.join(DATA_DIR, "asbab_nuzul_fr_authentic.json")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(asbab_fr_map, f, ensure_ascii=False, indent=2)
        
    print(f"\n🎉 Base authentique de {len(asbab_fr_map)} versets avec Asbab Al-Nuzul générée en FRANÇAIS !")

if __name__ == "__main__":
    build_authentic_french_asbab()
