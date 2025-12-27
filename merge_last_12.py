
import json
import shutil

update_file = r'c:\Users\majid\Documents\islam\translated_last_12.json'
target_file = r'c:\Users\majid\Documents\islam\data\hadith\fra-muslim.json'

with open(update_file, 'r', encoding='utf-8') as f:
    updates = json.load(f)

update_map = {item['hadithnumber']: item['text'] for item in updates}

print(f"Loading {target_file}...")
with open(target_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

count = 0
hadiths = data['hadiths']
for h in hadiths:
    h_num = h.get('hadithnumber')
    if h_num in update_map:
        h['text'] = update_map[h_num]
        count += 1

shutil.copy(target_file, target_file + ".bak_final")
with open(target_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print(f"Updated {count} hadiths.")
