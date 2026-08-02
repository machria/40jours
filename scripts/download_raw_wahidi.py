import os
import json
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

# ==========================================
# SCRIPT DE TÉLÉCHARGEMENT DE LA SOURCE BRUTE 1 200+ VERSETS D'AL-WAHIDI
# Télécharge et enregistre data/raw_asbab_1200_al_wahidi.json dans le dépôt
# ==========================================

DATA_DIR = os.path.join(os.getcwd(), "data")
OUTPUT_FILE = os.path.join(DATA_DIR, "raw_asbab_1200_al_wahidi.json")

BASE_URL = "https://raw.githubusercontent.com/spa5k/tafsir_api/main/tafsir/en-asbab-al-nuzul-by-al-wahidi"

def fetch_surah_asbab(surah_num: int):
    url = f"{BASE_URL}/{surah_num}.json"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = json.loads(urllib.request.urlopen(req).read())
        ayahs = res.get('ayahs', [])
        return surah_num, ayahs
    except Exception as e:
        return surah_num, []

def download_all_wahidi_asbab():
    print("==================================================")
    print("🚀 TÉLÉCHARGEMENT DE LA SOURCE COMPLÈTE BRUTE D'AL-WAHIDI (1 200+ VERSETS)")
    print("==================================================\n")
    
    raw_dataset = {}
    total_ayahs = 0
    
    print("📥 Téléchargement des 114 sourates d'Al-Wahidi...")
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(fetch_surah_asbab, s) for s in range(1, 115)]
        for future in as_completed(futures):
            surah_num, ayahs = future.result()
            if ayahs:
                for a in ayahs:
                    ayah_num = a.get('ayah')
                    text = a.get('text', '').strip()
                    if ayah_num and text:
                        key = f"{surah_num}_{ayah_num}"
                        raw_dataset[key] = {
                            "surah": surah_num,
                            "ayah": ayah_num,
                            "raw_text": text
                        }
                        total_ayahs += 1
                        
    print(f"\n✅ Total d'entrées d'Asbab Al-Nuzul (Al-Wahidi) récupérées : {total_ayahs} versets !")
    
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(raw_dataset, f, ensure_ascii=False, indent=2)
        
    print(f"💾 Fichier brut sauvegardé dans le dépôt : {OUTPUT_FILE}")
    print("==================================================")

if __name__ == "__main__":
    download_all_wahidi_asbab()
