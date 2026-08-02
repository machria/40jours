import os, glob, json, re, shutil

DATA_DIR = os.path.join(os.getcwd(), "data")
MASTER_TAFSIR_DIR = os.path.join(DATA_DIR, "tafsir")
ASBAB_FR_FILE = os.path.join(DATA_DIR, "asbab_nuzul_fr.json")
ASBAB_AUTH_FILE = os.path.join(DATA_DIR, "asbab_nuzul_fr_authentic.json")
PUBLIC_TAFSIR_DIR = os.path.join(os.getcwd(), "public", "tafsir")

def normalize_diacritics(text):
    if not text or not isinstance(text, str):
        return text
    # Fix weird uppercase H in middle of words
    text = text.replace("tawḤīd", "tawhid").replace("taw-Ḥīd", "tawhid").replace("AḤmad", "Ahmad")
    text = text.replace("Mustafā", "Mustafa").replace("Ḥāfī", "Hafi").replace("Ḥanbal", "Hanbal")
    text = text.replace("MuḤammad", "Muhammad")
    
    # Diacritic mapping
    replacements = {
        'Ḥ': 'H', 'ḥ': 'h', 'ā': 'a', 'ī': 'i', 'ū': 'u',
        'ʿ': "'", 'ʾ': "'", 'Ṭ': 'T', 'ṭ': 't', 'Ṣ': 'S', 'ṣ': 's',
        'Ḏ': 'D', 'ḏ': 'd', 'Ẓ': 'Z', 'ẓ': 'z', 'Ġ': 'Gh', 'ġ': 'gh',
        '’': "'", '‘': "'", '`': "'"
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    text = re.sub(r'[\ufffd\uFFFD]', "'", text)
    # Fix consecutive quotes
    text = re.sub(r"''+", "'", text)
    text = re.sub(r"  +", " ", text)
    return text.strip()

SUFI_INDICATORS = [
    'gagne-pain', 'moyens de subsistance', 'noyau secret', 'pir', 'tawhid',
    'les seigneurs des réalités', 'mangonneau de la contemplation', 'maquillage sombre',
    'perspicacité de l\'intellect', 'ibn \'ata', 'basṭāmī', 'sanāìī', 'parangon des êtres',
    'les quatre rideaux', 'dégustation des reconnaissants', 'parangon du monde',
    'compagnons des reconnaissances', 'foyer de l\'esprit', 'appel à la générosité',
    'vocatif est destiné', 'l\'âme est le voile du cœur', 'chacun est lié à son propre état',
    'on dit que ceux qui avancent', 'quiconque gravit ces étapes de la piété',
    'ce type d\'émigrant est toujours dans la souffrance', 'a dieu appartiennent tout ce qui est dans les cieux',
    'lorsque l\'égarement est confié à iblis', 'le bien dans ce verset n\'est pas spécifié',
    'c\'est un avertissement pour les sincères', 'au moment du printemps, lorsque le regard',
    'a dieu appartiennent tout ce qui est'
]

with open(ASBAB_FR_FILE, 'r', encoding='utf-8') as f:
    d = json.load(f)

clean_dict = {}
for k, v in d.items():
    v_norm = normalize_diacritics(v)
    v_lower = v_norm.lower()
    
    # Check if entry contains Sufi allegory
    if any(ind in v_lower for ind in SUFI_INDICATORS):
        continue
        
    clean_dict[k] = v_norm

print(f"Original count: {len(d)} | Clean Al-Wahidi count: {len(clean_dict)}")

with open(ASBAB_FR_FILE, 'w', encoding='utf-8') as f:
    json.dump(clean_dict, f, ensure_ascii=False, indent=2)

with open(ASBAB_AUTH_FILE, 'w', encoding='utf-8') as f:
    json.dump(clean_dict, f, ensure_ascii=False, indent=2)

# Update master tafsir files & public/tafsir
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
        
        has_asbab = key in clean_dict
        
        formatted = f'### 📖 {title}\n*Auteur : {author} | Ouvrage de référence : {work}*\n\n'
        if has_asbab:
            asbab_text = clean_dict[key]
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

print("📦 Syncing to public/tafsir...")
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

print("🎉 Diacritics normalized & Sufi commentary purged successfully!")
