
import json
import os

empty_ids_path = r'c:\Users\majid\Documents\islam\all_empty_ids.json'
data_dir = r'c:\Users\majid\Documents\islam\data\hadith'

with open(empty_ids_path, 'r', encoding='utf-8') as f:
    all_empty = json.load(f)

# Map french filename to english filename
file_map = {
    'fra-muslim.json': 'eng-muslim.json',
    'fra-nasai.json': 'eng-nasai.json',
    'fra-ibnmajah.json': 'eng-ibnmajah.json' # Might not have downloaded this one yet
}

for fra_file, ids in all_empty.items():
    if fra_file not in file_map:
        continue
    
    eng_file = file_map[fra_file]
    eng_path = os.path.join(data_dir, eng_file)
    
    if not os.path.exists(eng_path):
        print(f"Skipping {fra_file}: {eng_file} not found.")
        continue

    print(f"Checking coverage for {fra_file} ({len(ids)} missing)...")
    
    with open(eng_path, 'r', encoding='utf-8') as f:
        eng_data = json.load(f)
    
    # english data structure: {'hadiths': [...]} or just [...]
    if 'hadiths' in eng_data:
        eng_hadiths = eng_data['hadiths']
    elif isinstance(eng_data, list):
        eng_hadiths = eng_data
    else:
        print(f"  Unknown stricture in {eng_file}")
        continue
        
    # Create lookup
    eng_lookup = {}
    for h in eng_hadiths:
        h_num = h.get('hadithnumber')
        text = h.get('text', '').strip()
        if h_num is not None and text:
            eng_lookup[h_num] = text
            
    found_count = 0
    not_found_ids = []
    
    for h_id in ids:
        if h_id in eng_lookup:
            found_count += 1
        else:
            not_found_ids.append(h_id)
            
    print(f"  Found English text for {found_count}/{len(ids)} hadiths.")
    if not_found_ids:
        print(f"  Still missing in English: {not_found_ids[:10]}...")
