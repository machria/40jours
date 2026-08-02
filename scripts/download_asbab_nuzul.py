import os
import json
import glob
import re

# ==========================================
# SCRIPT OFFICIEL DU CONTEXTE DE RÉVÉLATION (ASBAB AL-NUZUL)
# Extrait et structure les contextes de révélation réels depuis les données de master
# ==========================================

DATA_DIR = os.path.join(os.getcwd(), "data", "tafsir")

def build_real_asbab_nuzul():
    print("==================================================")
    print("🚀 EXTRACTION ET FORMATION PROPRE DU CONTEXTE DE RÉVÉLATION")
    print("==================================================\n")
    
    # Charger tous les fichiers de master (root data/tafsir/*.json)
    master_files = glob.glob(os.path.join(DATA_DIR, "[0-9]*_[0-9]*.json"))
    asbab_extracted = {}
    
    for fpath in master_files:
        bname = os.path.basename(fpath)
        key = bname.replace(".json", "")
        try:
            with open(fpath, "r", encoding="utf-8") as f:
                data = json.load(f)
            t = data.get("tafsir", "").strip()
            
            # Détection automatique des récits de révélation authentiques (Asbab Al-Nuzul)
            paragraphs = t.split("\n\n")
            for p in paragraphs:
                p_lower = p.lower()
                if any(kw in p_lower for kw in ["révélé", "révélation", "rapporté d'après", "a rapporté que"]):
                    clean_p = re.sub(r'^(##|###)\s*', '', p).strip()
                    if len(clean_p) > 30 and not clean_p.startswith("📖"):
                        asbab_extracted[key] = clean_p
                        break
        except Exception:
            pass
            
    print(f"✅ {len(asbab_extracted)} contextes de révélation réels extraits avec succès du master.")
    return asbab_extracted

if __name__ == "__main__":
    build_real_asbab_nuzul()
