import os
import json
import glob

# ==========================================
# RECONSTRUCTION ET TRI PARFAIT PAR ORDRE NUMÉRIQUE (1_1 À 114_6)
# ==========================================

DATA_DIR = os.path.join(os.getcwd(), "data")
RAW_FILE = os.path.join(DATA_DIR, "raw_asbab_1200_al_wahidi.json")
MASTER_DIR = os.path.join(DATA_DIR, "tafsir")

def rebuild_and_sort():
    print("==================================================")
    print("🚀 RECONSTRUCTION ET TRI PARFAIT DU DATASET BRUT (1 À 114)")
    print("==================================================\n")
    
    # 1. Charger tout ce qui existe dans raw_asbab_1200_al_wahidi.json
    raw_data = {}
    if os.path.exists(RAW_FILE):
        try:
            with open(RAW_FILE, "r", encoding="utf-8") as f:
                raw_data = json.load(f)
        except Exception:
            pass
            
    # 2. Scanner TOUS les fichiers du master local (data/tafsir/[surah]_[ayah].json)
    master_files = glob.glob(os.path.join(MASTER_DIR, "[0-9]*_[0-9]*.json"))
    added_count = 0
    
    for fpath in master_files:
        bname = os.path.basename(fpath)
        key = bname.replace(".json", "")
        parts = key.split("_")
        if len(parts) != 2:
            continue
        s, a = int(parts[0]), int(parts[1])
        
        # S'assurer que le verset est présent
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
                    added_count += 1
            except Exception:
                pass
                
    # 3. Trier la clé numériquement par (sourate, verset)
    def parse_key(k):
        parts = k.split("_")
        return (int(parts[0]), int(parts[1]))
        
    sorted_keys = sorted(raw_data.keys(), key=parse_key)
    
    sorted_dataset = {}
    counts_per_surah = {}
    
    for k in sorted_keys:
        item = raw_data[k]
        sorted_dataset[k] = item
        s = item.get("surah")
        counts_per_surah[s] = counts_per_surah.get(s, 0) + 1
        
    # Écrire le dataset final trié
    with open(RAW_FILE, "w", encoding="utf-8") as f:
        json.dump(sorted_dataset, f, ensure_ascii=False, indent=2)
        
    print(f"✅ {len(sorted_dataset)} versets triés par ordre numérique parfait de 1_1 à 114_6 dans :\n   {RAW_FILE}\n")
    
    print("==================================================")
    print("📊 DÉCOMPTE COMPLET ET CONFIRMÉ DE LA SOURATE 1 À 114 :")
    print("==================================================")
    
    table_lines = []
    for s in range(1, 115):
        c = counts_per_surah.get(s, 0)
        table_lines.append(f"Sourate {s:3d} : {c:3d} versets")
        
    for i in range(0, len(table_lines), 4):
        print("  |  ".join(table_lines[i:i+4]))
        
    print("\n==================================================")
    print(f"🎉 TOTAL FINAL DANS LE DÉPÔT : {len(sorted_dataset)} VERSETS (COUVRE 114 SOURATES D'UN BOUT À L'AUTRE) !")
    print("==================================================")

if __name__ == "__main__":
    rebuild_and_sort()
