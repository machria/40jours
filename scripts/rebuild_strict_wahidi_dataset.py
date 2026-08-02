import os, glob, json, re, shutil

DATA_DIR = os.path.join(os.getcwd(), "data")
MASTER_TAFSIR_DIR = os.path.join(DATA_DIR, "tafsir")
ASBAB_FR_FILE = os.path.join(DATA_DIR, "asbab_nuzul_fr.json")
ASBAB_AUTH_FILE = os.path.join(DATA_DIR, "asbab_nuzul_fr_authentic.json")
RAW_FILE = os.path.join(DATA_DIR, "raw_asbab_1200_al_wahidi.json")
PUBLIC_TAFSIR_DIR = os.path.join(os.getcwd(), "public", "tafsir")

print("==================================================")
print("🧹 NETTOYAGE STRICT ET DEPURATIF DE LA BASE AL-WAHIDI")
print("==================================================")

with open(ASBAB_FR_FILE, 'r', encoding='utf-8') as f:
    d = json.load(f)

# Explicit list of Maybudi Sufi phrases to purge
SUFI_PURGE_PHRASES = [
    'vivification se fait par', 'salarié peine toujours', 'voyage des religieux',
    'la première consiste à orner', 'parure fait allusion', 'dans ce verset, c\'est comme si dieu',
    'on a également dit que c\'était une allusion', 'l\'âme est le voile', 'le gagne-pain',
    'noyau secret', 'pir', 'les seigneurs des réalités', 'mangonneau de la contemplation',
    'maquillage sombre', 'perspicacité de l\'intellect', 'ibn \'ata', 'basṭāmī', 'sanāìī',
    'parangon des êtres', 'les quatre rideaux', 'dégustation des reconnaissants',
    'parangon du monde', 'compagnons des reconnaissances', 'foyer de l\'esprit',
    'appel à la générosité', 'vocatif est destiné', 'chacun est lié à son propre état',
    'on dit que ceux qui avancent', 'quiconque gravit ces étapes', 'ce type d\'émigrant',
    'lorsque l\'égarement est confié à iblis', 'le bien dans ce verset n\'est pas spécifié',
    'c\'est un avertissement pour les sincères', 'au moment du printemps, lorsque le regard'
]

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

clean_asbab = {}
for k, v in d.items():
    s_num = int(k.split('_')[0])
    
    # 1. STRICT RULE: Surah 1 (Al-Fatiha) has NO Asbab in Al-Wahidi
    if s_num == 1:
        continue
        
    v_norm = normalize_text(v)
    v_lower = v_norm.lower()
    
    # 2. Reject any Maybudi Sufi allegory
    if any(phrase in v_lower for phrase in SUFI_PURGE_PHRASES):
        continue
        
    # 3. Must contain Hadith / Isnad / Asbab revelation narrative indicators
    has_asbab_narrative = any(m in v_lower for m in [
        'révélé', 'révélation', 'rapporté', 'prophète', 'bukhari', 'muslim', 'tirmidhi',
        'ibn abbas', 'wahidi', 'al-kalbi', 'abu salih', 'ce verset', 'lorsque', 'quand',
        'un homme', 'les juifs', 'les hypocrites', 'bataille', 'a dit :'
    ])
    
    if has_asbab_narrative:
        clean_asbab[k] = v_norm

# Sort naturally
def key_sort(k):
    parts = k.split('_')
    return int(parts[0]), int(parts[1])

sorted_keys = sorted(clean_asbab.keys(), key=key_sort)
sorted_asbab = {k: clean_asbab[k] for k in sorted_keys}

surahs_present = set(int(k.split('_')[0]) for k in sorted_asbab.keys())
absent_surahs = sorted(list(set(range(1, 115)) - surahs_present))

print(f"✅ Nombre de récits authentiques d'Al-Wahidi retenus : {len(sorted_asbab)} récits")
print(f"📊 Nombre de sourates couvertes : {len(surahs_present)} sourates")
print(f"🚫 Nombre de sourates absentes (0 récit) : {len(absent_surahs)} sourates")
print(f"   • Liste des sourates absentes : {absent_surahs}")
print(f"   • La sourate 1 (Al-Fatiha) est-elle absente ? {'1' not in [str(s) for s in surahs_present]}")

with open(ASBAB_FR_FILE, 'w', encoding='utf-8') as f:
    json.dump(sorted_asbab, f, ensure_ascii=False, indent=2)

with open(ASBAB_AUTH_FILE, 'w', encoding='utf-8') as f:
    json.dump(sorted_asbab, f, ensure_ascii=False, indent=2)

# Update raw_asbab_1200_al_wahidi.json
raw_data_formatted = {}
for k, v in sorted_asbab.items():
    s, a = k.split('_')
    raw_data_formatted[k] = {
        "surah": int(s),
        "ayah": int(a),
        "raw_text": v
    }

with open(RAW_FILE, 'w', encoding='utf-8') as f:
    json.dump(raw_data_formatted, f, ensure_ascii=False, indent=2)

# Sync into master tafsir files and public/tafsir
print("📦 Synchronisation avec data/tafsir et public/tafsir...")
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
print("🎉 NETTOYAGE ET CORRECTION REUSSIS AVEC SUCCES !")
print("==================================================")
