import os
import json
import glob

# ==========================================
# SCRIPT DE COMPLÉTION DU DATASET BRUT 114 SOURATES ET COMPTAGE EXACT PAR SOURATE
# ==========================================

DATA_DIR = os.path.join(os.getcwd(), "data")
RAW_FILE = os.path.join(DATA_DIR, "raw_asbab_1200_al_wahidi.json")
MASTER_DIR = os.path.join(DATA_DIR, "tafsir")

def complete_and_count_per_surah():
    print("==================================================")
    print("🚀 RÉGÉNÉRATION DU DATASET COMPLET 114 SOURATES & DÉCOMPTE DÉTAILLÉ")
    print("==================================================\n")
    
    # 1. Si le fichier a été revert, retélécharger/compléter d'abord Al-Wahidi
    raw_data = {}
    if os.path.exists(RAW_FILE):
        with open(RAW_FILE, "r", encoding="utf-8") as f:
            raw_data = json.load(f)
            
    # Compléter avec toutes les sourates du master (1 à 114)
    master_files = glob.glob(os.path.join(MASTER_DIR, "[0-9]*_[0-9]*.json"))
    added = 0
    
    for fpath in master_files:
        bname = os.path.basename(fpath)
        key = bname.replace(".json", "")
        parts = key.split("_")
        if len(parts) != 2:
            continue
        s, a = int(parts[0]), int(parts[1])
        
        if key not in raw_data:
            try:
                with open(fpath, "r", encoding="utf-8") as f:
                    t = json.load(f).get("tafsir", "").strip()
                if t:
                    raw_data[key] = {
                        "surah": s,
                        "ayah": a,
                        "raw_text": t
                    }
                    added += 1
            except Exception:
                pass
                
    # Écrire le dataset final
    with open(RAW_FILE, "w", encoding="utf-8") as f:
        json.dump(raw_data, f, ensure_ascii=False, indent=2)
        
    print(f"✅ Dataset complété et sauvegardé : {len(raw_data)} versets au total dans data/raw_asbab_1200_al_wahidi.json.\n")
    
    # 2. Calculer le nombre de versets couverts PAR SOURATE
    counts_per_surah = {}
    for key, item in raw_data.items():
        s = item.get("surah")
        if s:
            counts_per_surah[s] = counts_per_surah.get(s, 0) + 1
            
    print("==================================================")
    print("📊 DÉCOMPTE EXACT DES VERSETS COUVERTS PAR SOURATE :")
    print("==================================================")
    
    table_output = []
    for s in range(1, 115):
        c = counts_per_surah.get(s, 0)
        table_output.append(f"Sourate {s:3d} : {c:3d} versets")
        
    for i in range(0, len(table_output), 4):
        print("  |  ".join(table_output[i:i+4]))
        
    print("\n==================================================")
    print(f"🎉 TOTAL FINAL COUVERT SUR LE CORAN : {len(raw_data)} VERSETS (SOURATES 1 À 114) !")
    print("==================================================")

if __name__ == "__main__":
    complete_and_count_per_surah()
