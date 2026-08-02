import json
import glob
import re
import os

path_pattern = '/Users/achmajid/40jours/data/tafsir/ibn_kathir/*.json'
files = glob.glob(path_pattern)

modified_count = 0

for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    original_tafsir = data.get('tafsir', '')
    
    # We want to replace the repeated block:
    # ### 💬 Commentaire d'Exégèse (Hafiz Ibn Kathir)
    # d'Exégèse (Hafiz Ibn Kathir)
    # d'Exégèse (Hafiz Ibn Kathir)
    # ...
    
    # Regex to match the header and any subsequent repeated "d'Exégèse (Hafiz Ibn Kathir)\n"
    # Actually, let's just use a simpler regex or string replacement.
    
    # Find "### 💬 Commentaire d'Exégèse (Hafiz Ibn Kathir)\n"
    # followed by multiple "d'Exégèse (Hafiz Ibn Kathir)\n"
    
    pattern = r"(### 💬 Commentaire d'Exégèse \(Hafiz Ibn Kathir\)\n)(?:d'Exégèse \(Hafiz Ibn Kathir\)\n)+"
    
    new_tafsir, count = re.subn(pattern, r"\1", original_tafsir)
    
    if count > 0:
        data['tafsir'] = new_tafsir
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        modified_count += 1

print(f"Cleaned {modified_count} files.")
