import os
import json
import glob
import re

# ==========================================
# INJECTION DES ASBAB AL-NUZUL AUTHENTIQUES 100% EN FRANÇAIS DANS LES 4 TAFSIRS
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

def apply_authentic_asbab():
    asbab_file = os.path.join(os.getcwd(), "data", "asbab_nuzul_fr_authentic.json")
    if not os.path.exists(asbab_file):
        print("Fichier asbab_nuzul_fr_authentic.json non trouvé.")
        return
        
    with open(asbab_file, "r", encoding="utf-8") as f:
        asbab_fr = json.load(f)
        
    print(f"📥 Chargement de {len(asbab_fr)} contextes de révélation authentiques en Français.")
    
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
                
                # Nettoyage des anciens en-têtes
                clean_commentary = raw_text
                if "### 💬 Commentaire" in clean_commentary:
                    clean_commentary = clean_commentary.split("### 💬 Commentaire")[-1].strip()
                elif "### 📖 " in clean_commentary:
                    lines = clean_commentary.split("\n")
                    clean_commentary = "\n".join([l for l in lines if not l.startswith("### ") and not l.startswith("*Auteur")]).strip()
                    
                clean_commentary = re.sub(r'### 📜 Contexte de Révélation.*?(?=### 💬|## |\n\n[A-Z]|\n\n\*\*|$)', '', clean_commentary, flags=re.DOTALL).strip()
                
                asbab_text = asbab_fr.get(key)
                
                formatted_text = f"### 📖 {meta['title']}\n"
                formatted_text += f"*Auteur : {meta['author']} | Ouvrage de référence : {meta['reference_work']}*\n\n"
                
                if asbab_text and len(asbab_text.strip()) > 15:
                    formatted_text += f"### 📜 Contexte de Révélation (Asbab Al-Nuzul — Imam Al-Wahidi)\n{asbab_text.strip()}\n\n"
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
                
        print(f"✅ {meta['title']} : {injected} contextes de révélation authentiques en Français injectés.")

    print("\n==================================================")
    print("🎉 INJECTION DES CONTEXTES DE RÉVÉLATION AUTHENTIQUES EN FRANÇAIS TERMINÉE !")
    print("==================================================")

if __name__ == "__main__":
    apply_authentic_asbab()
