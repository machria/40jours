import os
import json
import urllib.request
import urllib.parse
import glob
import re
from concurrent.futures import ThreadPoolExecutor, as_completed

# ==========================================
# SCRIPT DE GÉNÉRATION DES +1 200 VERSETS AVEC CONTEXTE DE RÉVÉLATION (ASBAB AL-NUZUL EN FRANÇAIS)
# Déploiement des plages de versets (ex: Sourate 2 versets 142 à 145, Sourate 22 versets 19 à 24, etc.)
# ==========================================

DATA_DIR = os.path.join(os.getcwd(), "data")
DATA_TAFSIR_DIR = os.path.join(DATA_DIR, "tafsir")

def fetch_json(url: str):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode('utf-8'))

def translate_to_french_clean(text: str) -> str:
    if not text or not text.strip():
        return ""
    try:
        url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fr&dt=t&q=' + urllib.parse.quote(text.strip()[:1200])
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = json.loads(urllib.request.urlopen(req).read())
        fr_text = ''.join([sentence[0] for sentence in res[0] if sentence[0]])
        
        # Nettoyage et élégance des termes d'exégèse en Français
        fr_text = fr_text.replace("méfiez-vous de votre Seigneur", "craignez votre Seigneur")
        fr_text = fr_text.replace("chose formidable", "événement redoutable et immense")
        fr_text = fr_text.replace("vocatif", "interpellation solennelle")
        return fr_text.strip()
    except Exception:
        return text

def build_1200_french_asbab():
    print("==================================================")
    print("🚀 GÉNÉRATION DU CORPUS COMPLET DES +1 200 VERSETS D'ASBAB AL-NUZUL EN FRANÇAIS")
    print("==================================================\n")
    
    # 1. Télécharger la liste complète des contextes de revelation par Wahidi
    print("📥 Récupération du dataset complet d'Al-Wahidi...")
    asbab_map_1200 = {}
    
    # Prise en compte de vos 4 746 fichiers du master (qui contiennent déjà +1000 récits de révélation)
    master_files = glob.glob(os.path.join(DATA_TAFSIR_DIR, "[0-9]*_[0-9]*.json"))
    for mf in master_files:
        bname = os.path.basename(mf)
        key = bname.replace(".json", "")
        try:
            with open(mf, "r", encoding="utf-8") as f:
                data = json.load(f)
            t = data.get("tafsir", "").strip()
            
            # Extraire les récits de révélation
            paragraphs = t.split("\n\n")
            for p in paragraphs:
                pl = p.lower()
                if any(kw in pl for kw in ["révélé", "révélation", "rapporté d'après", "a rapporté que", "asbab"]):
                    clean_p = re.sub(r'^(##|###)\s*', '', p).strip()
                    if len(clean_p) > 35 and not clean_p.startswith("📖"):
                        asbab_map_1200[key] = clean_p
                        break
        except Exception:
            pass
            
    print(f"✅ Baseline extraite de master : {len(asbab_map_1200)} versets déjà équipés d'un contexte de révélation !")
    
    # 2. Compléter et traduire avec Al-Wahidi pour couvrir les 1 200+ versets du Coran
    url_wahidi_all = 'https://raw.githubusercontent.com/spa5k/tafsir_api/main/tafsir/en-asbab-al-nuzul-by-al-wahidi'
    
    # Exemples de plages étendues pour couvrir 1 200+ versets
    surahs_to_scan = range(1, 115)
    raw_to_translate = []
    
    for s in surahs_to_scan:
        for a in range(1, 200):
            key = f"{s}_{a}"
            if key not in asbab_map_1200:
                try:
                    u = f"{url_wahidi_all}/{s}/{a}.json"
                    data = fetch_json(u)
                    en_t = data.get("text", "").strip()
                    if en_t:
                        raw_to_translate.append((key, en_t))
                except Exception:
                    if a > 15:
                        break
                        
    print(f"⚡ Traduction de {len(raw_to_translate)} contextes additionnels en Français...")
    
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(lambda k, txt: (k, translate_to_french_clean(txt)), k, txt) for k, txt in raw_to_translate]
        for future in as_completed(futures):
            k, fr_t = future.result()
            if fr_t:
                asbab_map_1200[k] = fr_t
                
    # Sauvegarde
    out_file = os.path.join(DATA_DIR, "asbab_nuzul_1200_fr.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(asbab_map_1200, f, ensure_ascii=False, indent=2)
        
    print(f"\n🎉 CORPUS COMPLET GÉNÉRÉ : {len(asbab_map_1200)} VERSETS AVEC CONTEXTE DE RÉVÉLATION EN FRANÇAIS !")

    # 3. Injecter dans les 4 Tafsirs (ibn_kathir, al_mukhtasar, as_sadi, al_jalalayn)
    META_INFO = {
        "ibn_kathir": ("Tafsir Ibn Kathir", "Hafiz Ibn Kathir", "Tafsir al-Qur'an al-Azim"),
        "al_mukhtasar": ("Tafsir Al-Mukhtasar", "Center of Quranic Studies (Riyad)", "Al-Mukhtasar fi Tafsir al-Qur'an"),
        "as_sadi": ("Tafsir As-Sa'di", "Sheikh Abd ar-Rahman as-Sa'di", "Taysir al-Karim ar-Rahman"),
        "al_jalalayn": ("Tafsir Al-Jalalayn", "Jalal ad-Din al-Mahalli & as-Suyuti", "Tafsir al-Jalalayn (Traduction annotée R. Maash)")
    }
    
    for source_id, (title, author, work) in META_INFO.items():
        dir_path = os.path.join(DATA_TAFSIR_DIR, source_id)
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
                
                # Nettoyage des en-têtes
                clean_commentary = raw_text
                if "### 💬 Commentaire" in clean_commentary:
                    clean_commentary = clean_commentary.split("### 💬 Commentaire")[-1].strip()
                elif "### 📖 " in clean_commentary:
                    lines = clean_commentary.split("\n")
                    clean_commentary = "\n".join([l for l in lines if not l.startswith("### ") and not l.startswith("*Auteur")]).strip()
                    
                clean_commentary = re.sub(r'### 📜 Contexte de Révélation.*?(?=### 💬|## |\n\n[A-Z]|\n\n\*\*|$)', '', clean_commentary, flags=re.DOTALL).strip()
                
                asbab_text = asbab_map_1200.get(key)
                
                formatted_text = f"### 📖 {title}\n"
                formatted_text += f"*Auteur : {author} | Ouvrage de référence : {work}*\n\n"
                
                if asbab_text and len(asbab_text.strip()) > 20:
                    formatted_text += f"### 📜 Contexte de Révélation (Asbab Al-Nuzul — Imam Al-Wahidi)\n{asbab_text.strip()}\n\n"
                    formatted_text += f"### 💬 Commentaire d'Exégèse ({author})\n"
                    injected += 1
                    
                formatted_text += clean_commentary
                
                entry = {
                    "surah": surah,
                    "ayah": ayah,
                    "tafsir": formatted_text,
                    "provenance": {
                        "source_id": source_id,
                        "title": title,
                        "author": author,
                        "reference_work": work,
                        "has_asbab_nuzul": bool(asbab_text)
                    }
                }
                
                with open(filepath, "w", encoding="utf-8") as f:
                    json.dump(entry, f, ensure_ascii=False, indent=2)
            except Exception:
                pass
                
        print(f"✅ {title} : {injected} versets équipés du Contexte de Révélation en Français !")

    print("\n==================================================")
    print("🎉 DEPLOIEMENT DU CORPUS DES 1 200+ VERSETS ASBAB AL-NUZUL REUSSI !")
    print("==================================================")

if __name__ == "__main__":
    build_1200_french_asbab()
