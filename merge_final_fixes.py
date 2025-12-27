
import json
import os
import shutil

# Config
muslim_updates = [
    r'c:\Users\majid\Documents\islam\translated_muslim_partial.json',
    r'c:\Users\majid\Documents\islam\translated_muslim_gap.json'
]
nasai_updates = [
    r'c:\Users\majid\Documents\islam\translated_nasai_partial.json'
]

targets = {
    'muslim': r'c:\Users\majid\Documents\islam\data\hadith\fra-muslim.json',
    'nasai': r'c:\Users\majid\Documents\islam\data\hadith\fra-nasai.json'
}

def load_updates(files):
    updates = {}
    for fp in files:
        if not os.path.exists(fp):
            print(f"File not found: {fp}")
            continue
        with open(fp, 'r', encoding='utf-8') as f:
            data = json.load(f)
            for item in data:
                updates[item['hadithnumber']] = item['text']
    return updates

def apply_updates(target_path, updates_map):
    print(f"Updating {target_path}...")
    with open(target_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    hadiths = data['hadiths'] if 'hadiths' in data else data
    updated_count = 0
    
    for h in hadiths:
        h_num = h.get('hadithnumber')
        if h_num in updates_map:
            if not h.get('text') or h['text'].strip() == "":
                h['text'] = updates_map[h_num]
                updated_count += 1
    
    # Save back
    # Backup first
    shutil.copy(target_path, target_path + ".bak")
    
    with open(target_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
        
    print(f"Updated {updated_count} hadiths.")

# Process Muslim
print("Processing Muslim...")
muslim_map = load_updates(muslim_updates)
print(f"Loaded {len(muslim_map)} updates for Muslim.")
apply_updates(targets['muslim'], muslim_map)

# Process Nasai
print("\nProcessing Nasai...")
nasai_map = load_updates(nasai_updates)
print(f"Loaded {len(nasai_map)} updates for Nasai.")
apply_updates(targets['nasai'], nasai_map)

print("\nDone.")
