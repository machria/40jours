import os, glob, json, re, shutil

DATA_DIR = os.path.join(os.getcwd(), "data")
MASTER_TAFSIR_DIR = os.path.join(DATA_DIR, "tafsir")
ASBAB_FR_FILE = os.path.join(DATA_DIR, "asbab_nuzul_fr.json")
ASBAB_AUTH_FILE = os.path.join(DATA_DIR, "asbab_nuzul_fr_authentic.json")
RAW_FILE = os.path.join(DATA_DIR, "raw_asbab_1200_al_wahidi.json")
PUBLIC_TAFSIR_DIR = os.path.join(os.getcwd(), "public", "tafsir")

print("==================================================")
print("🎯 FILTRAGE STRICT DES ISNADS ET RECITS D'AL-WAHIDI")
print("==================================================")

with open(ASBAB_FR_FILE, 'r', encoding='utf-8') as f:
    d = json.load(f)

# Mandatory indicators for authentic Al-Wahidi / Hadith entries
WAHIDI_ISNAD_MARKERS = [
    'nous a informé', 'a dit :', 'a été révélé', 'ce verset a été révélé',
    'révélé au sujet', 'révélé à propos', 'rapporté par', 'un homme est venu',
    'ils ont interrogé', 'bataille de', 'quand le prophète', 'les juifs de'
]

# Reject non-isnad Sufi / general commentary phrases
SUFI_REJECT = [
    'ceux qui ont foi en l\'inconnaissable', 'si vous avez des doutes sur ce que nous avons fait descendre',
    'et donne la bonne nouvelle à ceux qui ont la foi', 'et quand ton seigneur dit aux anges',
    'et lorsque nous avons dit aux anges', 'demeure toi et ton épouse dans le jardin',
    'pour les compagnons des reconnaissances', 'le gagne-pain', 'noyau secret',
    'mangonneau de la contemplation', 'l\'âme est le voile', 'voyage des religieux',
    'vivification se fait par', 'salarié peine toujours', 'la parure fait allusion'
]

clean_wahidi = {}
for k, v in d.items():
    s_num = int(k.split('_')[0])
    
    # 1. Exclude Surah 1 (Al-Fatiha)
    if s_num == 1:
        continue
        
    v_lower = v.lower()
    
    # 2. Reject Sufi non-isnad texts
    if any(rej in v_lower for rej in SUFI_REJECT):
        continue
        
    # 3. Must have Wahidi Isnad or authentic revelation narrative
    has_isnad = any(marker in v_lower for marker in WAHIDI_ISNAD_MARKERS)
    if has_isnad:
        clean_wahidi[k] = v.strip()

# Sort keys naturally
def key_sort(k):
    parts = k.split('_')
    return int(parts[0]), int(parts[1])

sorted_keys = sorted(clean_wahidi.keys(), key=key_sort)
sorted_wahidi = {k: clean_wahidi[k] for k in sorted_keys}

surahs_present = set(int(k.split('_')[0]) for k in sorted_wahidi.keys())
absent_surahs = sorted(list(set(range(1, 115)) - surahs_present))

print(f"✅ Récits authentiques d'Al-Wahidi retenus : {len(sorted_wahidi)} récits")
print(f"📊 Sourates couvertes : {len(surahs_present)} sourates")
print(f"🚫 Sourates absentes : {len(absent_surahs)} sourates")
print(f"   • Sourates absentes : {absent_surahs}")

with open(ASBAB_FR_FILE, 'w', encoding='utf-8') as f:
    json.dump(sorted_wahidi, f, ensure_ascii=False, indent=2)

with open(ASBAB_AUTH_FILE, 'w', encoding='utf-8') as f:
    json.dump(sorted_wahidi, f, ensure_ascii=False, indent=2)

# Update raw dataset
raw_formatted = {}
for k, v in sorted_wahidi.items():
    s, a = k.split('_')
    raw_formatted[k] = {
        "surah": int(s),
        "ayah": int(a),
        "raw_text": v
    }

with open(RAW_FILE, 'w', encoding='utf-8') as f:
    json.dump(raw_formatted, f, ensure_ascii=False, indent=2)

# Sync into master tafsir files and public/tafsir
print("📦 Synchronisation dans data/tafsir et public/tafsir...")
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
        
        has_asbab = key in sorted_wahidi
        
        formatted = f'### 📖 {title}\n*Auteur : {author} | Ouvrage de référence : {work}*\n\n'
        if has_asbab:
            asbab_text = sorted_wahidi[key]
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
print("🎉 RECONSTRUCTION STRICTE ET PARFAITE D'AL-WAHIDI REUSSIE !")
print("==================================================")
