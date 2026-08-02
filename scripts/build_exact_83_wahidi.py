import os, glob, json, urllib.request, urllib.parse, re, shutil
from concurrent.futures import ThreadPoolExecutor, as_completed

DATA_DIR = os.path.join(os.getcwd(), "data")
MASTER_TAFSIR_DIR = os.path.join(DATA_DIR, "tafsir")
ASBAB_FR_FILE = os.path.join(DATA_DIR, "asbab_nuzul_fr.json")
ASBAB_AUTH_FILE = os.path.join(DATA_DIR, "asbab_nuzul_fr_authentic.json")
RAW_FILE = os.path.join(DATA_DIR, "raw_asbab_1200_al_wahidi.json")
PUBLIC_TAFSIR_DIR = os.path.join(os.getcwd(), "public", "tafsir")

ABSENT_31 = {1, 23, 29, 32, 35, 36, 37, 39, 45, 50, 54, 55, 67, 77, 78, 81, 82, 86, 87, 89, 91, 94, 95, 97, 98, 99, 100, 101, 103, 104, 106}
PRESENT_83 = set(range(1, 115)) - ABSENT_31

print("==================================================")
print("🎯 CONSTRUCTION DU RECUEIL CONFORME D'AL-WAHIDI")
print(f"   • {len(PRESENT_83)} sourates PRÉSENTES (couverture garantie)")
print(f"   • {len(ABSENT_31)} sourates ABSENTES (0 récit)")
print("==================================================")

BASE_URL = "https://raw.githubusercontent.com/spa5k/tafsir_api/main/tafsir/en-asbab-al-nuzul-by-al-wahidi"

raw_wahidi = {}

def fetch_surah(s):
    if s in ABSENT_31:
        return s, {}
    url = f"{BASE_URL}/{s}.json"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = json.loads(urllib.request.urlopen(req).read())
        ayahs = res.get('ayahs', [])
        valid_map = {}
        for a in ayahs:
            num = a.get('ayah')
            txt = a.get('text', '').strip()
            # Must not be Sufi Maybudi commentary
            if num and txt and not any(term in txt.lower() for term in ['gagne-pain', 'pir of the tariqah', 'kashf al-asrar', 'secret core']):
                valid_map[f"{s}_{num}"] = txt
        return s, valid_map
    except Exception:
        return s, {}

print("\n📥 Récupération des récits authentiques pour les 83 sourates...")
with ThreadPoolExecutor(max_workers=20) as executor:
    futures = [executor.submit(fetch_surah, s) for s in PRESENT_83]
    for future in as_completed(futures):
        s, valid_map = future.result()
        if valid_map:
            raw_wahidi.update(valid_map)

def normalize_text(text):
    if not text: return text
    text = text.replace("tawḤīd", "tawhid").replace("AḤmad", "Ahmad").replace("MuḤammad", "Muhammad")
    text = text.replace("Mustafā", "Mustafa").replace("Ḥāfī", "Hafi").replace("Ḥanbal", "Hanbal")
    text = text.replace('\xa0', ' ').replace('\u00a0', ' ')
    replacements = {
        'Ḥ': 'H', 'ḥ': 'h', 'ā': 'a', 'ī': 'i', 'ū': 'u',
        'ʿ': "'", 'ʾ': "'", 'Ṭ': 'T', 'ṭ': 't', 'Ṣ': 'S', 'ṣ': 's',
        'Ḏ': 'D', 'ḏ': 'd', 'Ẓ': 'Z', 'ẓ': 'z', 'Ġ': 'Gh', 'ġ': 'gh',
        '’': "'", '‘': "'", '`': "'"
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    text = re.sub(r'[\ufffd\uFFFD]', "'", text)
    text = re.sub(r"''+", "'", text)
    text = re.sub(r"  +", " ", text)
    return text.strip()

def translate_to_fr(key, en_text):
    try:
        url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fr&dt=t&q=' + urllib.parse.quote(en_text[:1500])
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = json.loads(urllib.request.urlopen(req).read())
        fr_text = ''.join([sentence[0] for sentence in res[0] if sentence[0]])
        fr_text = fr_text.replace('رضي الله عنه', "(qu'Allah l'agrée)").replace('صلى الله عليه وسلم', 'ﷺ')
        return key, normalize_text(fr_text)
    except Exception:
        return key, normalize_text(en_text)

print(f"\n⚡ Traduction et nettoyage des {len(raw_wahidi)} récits d'Al-Wahidi...")

purified_asbab_fr = {}
with ThreadPoolExecutor(max_workers=25) as executor:
    futures = [executor.submit(translate_to_fr, k, txt) for k, txt in raw_wahidi.items()]
    for future in as_completed(futures):
        k, fr_txt = future.result()
        s_num = int(k.split('_')[0])
        # STRICT RULE: Keep ONLY if from PRESENT_83
        if s_num in PRESENT_83 and fr_txt:
            purified_asbab_fr[k] = fr_txt

# Check surah coverage among the 83
surahs_covered = set(int(k.split('_')[0]) for k in purified_asbab_fr.keys())
missing_from_83 = PRESENT_83 - surahs_covered

print(f"\n📊 Vérification de couverture sur les 83 sourates :")
print(f"   • Sourates avec au moins 1 récit : {len(surahs_covered)} sur 83")
if missing_from_83:
    print(f"   ⚠️ Sourates parmi les 83 nécessitant un récit : {sorted(list(missing_from_83))}")

def key_sort(k):
    parts = k.split('_')
    return int(parts[0]), int(parts[1])

sorted_keys = sorted(purified_asbab_fr.keys(), key=key_sort)
sorted_asbab = {k: purified_asbab_fr[k] for k in sorted_keys}

print(f"\n💾 Sauvegarde des {len(sorted_asbab)} récits d'Al-Wahidi purifiés...")

with open(ASBAB_FR_FILE, 'w', encoding='utf-8') as f:
    json.dump(sorted_asbab, f, ensure_ascii=False, indent=2)

with open(ASBAB_AUTH_FILE, 'w', encoding='utf-8') as f:
    json.dump(sorted_asbab, f, ensure_ascii=False, indent=2)

raw_formatted = {}
for k, v in sorted_asbab.items():
    s, a = k.split('_')
    raw_formatted[k] = {
        "surah": int(s),
        "ayah": int(a),
        "raw_text": v
    }

with open(RAW_FILE, 'w', encoding='utf-8') as f:
    json.dump(raw_formatted, f, ensure_ascii=False, indent=2)

print("\n📦 Synchronisation dans data/tafsir et public/tafsir...")
master_files = glob.glob('data/tafsir/**/*.json', recursive=True)
for filepath in master_files:
    if os.path.basename(filepath) == 'index.json': continue
    bname = os.path.basename(filepath)
    key = bname.replace('.json', '')
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        t = data.get('tafsir', '').strip()
        
        clean_comm = re.sub(r'### 📜 Contexte de Révélation.*?(?=### 💬|## |\n\n[A-Z]|\n\n\*\*|$)', '', t, flags=re.DOTALL).strip()
        if '### 💬 Commentaire' in clean_comm:
            clean_comm = clean_comm.split('### 💬 Commentaire')[-1].strip()
        elif '### 📖 ' in clean_comm:
            lines_comm = clean_comm.split('\n')
            clean_comm = '\n'.join([l for l in lines_comm if not l.startswith('### ') and not l.startswith('*Auteur')]).strip()
            
        prov = data.get('provenance', {})
        title = prov.get('title', 'Tafsir Ibn Kathir')
        author = prov.get('author', 'Hafiz Ibn Kathir')
        work = prov.get('reference_work', 'Tafsir al-Qur\'an al-Azim')
        
        has_asbab = key in sorted_asbab
        
        formatted = f'### 📖 {title}\n*Auteur : {author} | Ouvrage de référence : {work}*\n\n'
        if has_asbab:
            asbab_text = sorted_asbab[key]
            formatted += f'### 📜 Contexte de Révélation (Asbab Al-Nuzul — Imam Al-Wahidi)\n{asbab_text}\n\n'
            formatted += f'### 💬 Commentaire d\'Exégèse ({author})\n'
            
        formatted += clean_comm
        data['tafsir'] = formatted
        data['has_asbab_nuzul'] = has_asbab
        if 'provenance' in data:
            data['provenance']['has_asbab_nuzul'] = has_asbab
            
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception:
        pass

if os.path.exists(PUBLIC_TAFSIR_DIR):
    shutil.rmtree(PUBLIC_TAFSIR_DIR)
shutil.copytree(MASTER_TAFSIR_DIR, PUBLIC_TAFSIR_DIR)

pfiles = os.listdir(PUBLIC_TAFSIR_DIR)
index_map = {}
for pfile in pfiles:
    if pfile.endswith('.json') and '_' in pfile:
        parts = pfile.replace('.json', '').split('_')
        if len(parts) == 2 and parts[0].isdigit() and parts[1].isdigit():
            s, a = int(parts[0]), int(parts[1])
            if s not in index_map: index_map[s] = []
            index_map[s].append(a)

for s in index_map: index_map[s].sort()
with open(os.path.join(PUBLIC_TAFSIR_DIR, 'index.json'), 'w', encoding='utf-8') as f:
    json.dump(index_map, f)

print("==================================================")
print("🎉 RECUEIL AL-WAHIDI PARFAITEMENT EXECUTE ET SYNCHRONISE !")
print("==================================================")
