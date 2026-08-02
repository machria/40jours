import json
import glob
import re
import os

path_pattern = '/Users/achmajid/40jours/data/tafsir/**/*.json'
files = glob.glob(path_pattern, recursive=True)

modified_count = 0

for file_path in files:
    if not os.path.isfile(file_path):
        continue
        
    with open(file_path, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
        except:
            continue
            
    if not isinstance(data, dict):
        continue
    
    original_tafsir = data.get('tafsir', '')
    if not original_tafsir:
        continue
        
    # Remove the header completely: "### 💬 Commentaire d'Exégèse (...)" or "💬 Commentaire d'Exégèse (...)"
    new_tafsir = re.sub(r"(?:### )?💬 Commentaire d'Exégèse \(.*?\)[ \n]*", "", original_tafsir)
    
    # Remove any standalone "d'Exégèse (...)" with trailing spaces or newlines
    new_tafsir = re.sub(r"d'Exégèse \(.*?\)[ \n]*", "", new_tafsir)
    
    # Clean up empty lines that might have been left
    new_tafsir = re.sub(r"\n{3,}", "\n\n", new_tafsir)
    
    if new_tafsir != original_tafsir:
        data['tafsir'] = new_tafsir
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        modified_count += 1

print(f"Cleaned {modified_count} files.")
