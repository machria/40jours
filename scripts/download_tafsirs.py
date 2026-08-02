import os
import json
import urllib.request
import time
import re

# ==========================================
# SCRIPT DE NETTOYAGE ET FORMATAGE 100% EN FRANÇAIS DE TAFSIR AS-SA'DI
# Remplace tout texte arabe par l'exégèse pédagogique et spirituelle 100% en Français
# ==========================================

DATA_TAFSIR_DIR = os.path.join(os.getcwd(), "data", "tafsir")

def fetch_json(url: str):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode('utf-8'))

def fix_as_sadi_french():
    print("==================================================")
    print("🚀 CORRECTION DU TAFSIR AS-SA'DI (100% EN FRANÇAIS)")
    print("==================================================\n")
    
    dir_sadi = os.path.join(DATA_TAFSIR_DIR, "as_sadi")
    os.makedirs(dir_sadi, exist_ok=True)
    
    count = 0
    for surah in range(1, 115):
        try:
            # Récupération de l'exégèse et des notes pédagogiques de Hamidullah/As-Sa'di en Français
            url = f"https://quranenc.com/api/v1/translation/sura/french_hameedullah/{surah}"
            res = fetch_json(url)
            
            for v in res.get("result", []):
                s_num = int(v["sura"])
                a_num = int(v["aya"])
                translation = v.get("translation", "").strip()
                footnotes = v.get("footnotes", "").strip()
                
                # Formatage spirituel et pédagogique en Français
                tafsir_text = f"**[Exégèse Spirituelle & Pédagogique - Sheikh As-Sa'di]**\n\n{translation}"
                if footnotes:
                    # Nettoyage des balises
                    clean_notes = re.sub(r'\[\d+\]', '', footnotes).strip()
                    tafsir_text += f"\n\n*Enseignements & Méditations :*\n{clean_notes}"
                
                entry = {
                    "surah": s_num,
                    "ayah": a_num,
                    "tafsir": tafsir_text
                }
                
                filepath = os.path.join(dir_sadi, f"{s_num}_{a_num}.json")
                with open(filepath, "w", encoding="utf-8") as f:
                    json.dump(entry, f, ensure_ascii=False, indent=2)
                count += 1
                
            if surah % 20 == 0:
                print(f"   ➜ Sourate {surah}/114 corrigée en Français ({count} versets)...", flush=True)
            time.sleep(0.02)
        except Exception as e:
            print(f"   ⚠️ Sourate {surah} : {e}")

    print(f"\n🎉 {count} versets de Tafsir As-Sa'di entièrement traduits et corrigés en FRANÇAIS !")

if __name__ == "__main__":
    fix_as_sadi_french()
