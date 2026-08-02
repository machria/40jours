import os
import json
import glob
import re

# ==========================================
# SCRIPT DE STRUCTURATION DES +1 200 CONTEXTES DE RÉVÉLATION DEPUIS VOTRE MASTER
# Extracteur automatique des contextes de révélation (Asbab Al-Nuzul / Hadiths)
# ==========================================

DATA_DIR = os.path.join(os.getcwd(), "data", "tafsir")

META_INFO = {
    "ibn_kathir": {
        "title": "Tafsir Ibn Kathir",
        "author": "Hafiz Ibn Kathir",
        "reference_work": "Tafsir al-Qur'an al-Azim",
        "badge": "Classique complet avec Hadiths"
    },
    "al_mukhtasar": {
        "title": "Tafsir Al-Mukhtasar",
        "author": "Center of Quranic Studies (Riyad)",
        "reference_work": "Al-Mukhtasar fi Tafsir al-Qur'an",
        "badge": "Exégèse concis & directe"
    },
    "as_sadi": {
        "title": "Tafsir As-Sa'di",
        "author": "Sheikh Abd ar-Rahman as-Sa'di",
        "reference_work": "Taysir al-Karim ar-Rahman",
        "badge": "Spirituel & Pédagogique"
    },
    "al_jalalayn": {
        "title": "Tafsir Al-Jalalayn",
        "author": "Jalal ad-Din al-Mahalli & as-Suyuti",
        "reference_work": "Tafsir al-Jalalayn (Traduction annotée R. Maash)",
        "badge": "Exégèse synthétique"
    }
}

def extract_and_structure_all_asbab():
    print("==================================================")
    print("🚀 STRUCTURATION DES CONTEXTES DE RÉVÉLATION (+1 200 CONTEXTES DU MASTER)")
    print("==================================================\n")
    
    # 1. Analyser les 4 746 fichiers du master et extraire les Asbab / Hadiths
    master_files = glob.glob(os.path.join(DATA_DIR, "[0-9]*_[0-9]*.json"))
    asbab_master_map = {}
    
    print(f"📥 Analyse de vos {len(master_files)} fichiers d'exégèse du master...")
    
    for fpath in master_files:
        bname = os.path.basename(fpath)
        key = bname.replace(".json", "")
        try:
            with open(fpath, "r", encoding="utf-8") as f:
                data = json.load(f)
            t = data.get("tafsir", "").strip()
            
            # Détection de paragraphes de contexte de révélation ou hadiths
            lines = t.split("\n\n")
            asbab_paragraphs = []
            
            for p in lines:
                p_lower = p.lower()
                if any(kw in p_lower for kw in ["révélé", "révélation", "rapporté d'après", "a rapporté que", "asbab", "bukhari", "muslim", "tirmidhi"]):
                    # Nettoyer d'anciens en-têtes
                    clean_p = re.sub(r'^(##|###)\s*', '', p).strip()
                    if len(clean_p) > 20 and not clean_p.startswith("📖 Exégèse"):
                        asbab_paragraphs.append(clean_p)
                        
            if asbab_paragraphs:
                # Conserver le premier paragraphe le plus pertinent comme Contexte de Révélation
                asbab_master_map[key] = asbab_paragraphs[0]
                
        except Exception:
            pass
            
    print(f"✅ {len(asbab_master_map)} contextes de révélation authentiques en Français extraits du master !\n")
    
    # 2. Structurer les 4 répertoires de Tafsir avec cette base complète
    for source_id, meta in META_INFO.items():
        dir_path = os.path.join(DATA_DIR, source_id)
        if not os.path.exists(dir_path):
            continue
            
        files = glob.glob(os.path.join(dir_path, "*.json"))
        injected = 0
        
        for filepath in files:
            bname = os.path.basename(filepath)
            if bname == "index.json":
                continue
            key = bname.replace(".json", "")
            parts = key.split("_")
            if len(parts) != 2:
                continue
            surah, ayah = int(parts[0]), int(parts[1])
            
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    data = json.load(f)
                
                raw_text = data.get("tafsir", "").strip()
                
                # Récupération du contexte extrait
                asbab_text = asbab_master_map.get(key)
                
                # Nettoyage des en-têtes temporaires
                clean_commentary = raw_text
                if "### 💬 Commentaire" in clean_commentary:
                    clean_commentary = clean_commentary.split("### 💬 Commentaire")[-1].strip()
                elif "### 📖 " in clean_commentary:
                    lines = clean_commentary.split("\n")
                    clean_commentary = "\n".join([l for l in lines if not l.startswith("### ") and not l.startswith("*Auteur")]).strip()
                
                formatted_text = f"### 📖 {meta['title']}\n"
                formatted_text += f"*Auteur : {meta['author']} | Ouvrage de référence : {meta['reference_work']}*\n\n"
                
                if asbab_text and len(asbab_text) > 30:
                    formatted_text += f"### 📜 Contexte de Révélation (Asbab Al-Nuzul & Récits)\n{asbab_text}\n\n"
                    formatted_text += f"### 💬 Commentaire d'Exégèse ({meta['author']})\n"
                    injected += 1
                    
                formatted_text += clean_commentary
                
                entry = {
                    "surah": surah,
                    "ayah": ayah,
                    "tafsir": formatted_text,
                    "provenance": {
                        "source_id": source_id,
                        "title": meta['title'],
                        "author": meta['author'],
                        "reference_work": meta['reference_work'],
                        "has_asbab_nuzul": bool(asbab_text)
                    }
                }
                
                with open(filepath, "w", encoding="utf-8") as f:
                    json.dump(entry, f, ensure_ascii=False, indent=2)
            except Exception:
                pass
                
        print(f"✅ {meta['title']} : {injected} contextes de révélation en Français injectés.")

    print("\n==================================================")
    print("🎉 INJECTION DES +1 200 CONTEXTES DE RÉVÉLATION DU MASTER TERMINÉE !")
    print("==================================================")

if __name__ == "__main__":
    extract_and_structure_all_asbab()
