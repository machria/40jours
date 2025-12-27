
import json

fra_path = r'c:\Users\majid\Documents\islam\data\hadith\fra-malik.json'
trans_path = r'c:\Users\majid\Documents\islam\translated_hadiths_all.json'
output_path = r'c:\Users\majid\Documents\islam\data\hadith\fra-malik.json'

with open(fra_path, 'r', encoding='utf-8') as f:
    fra_data = json.load(f)

try:
    with open(trans_path, 'r', encoding='utf-8') as f:
        trans_data = json.load(f)
except FileNotFoundError:
    print("Translated file not found yet.")
    exit(1)

trans_map = {item['hadithnumber']: item['text'] for item in trans_data}

count_updated = 0
for h in fra_data['hadiths']:
    if not h.get('text') or h['text'].strip() == "":
        h_num = h['hadithnumber']
        if h_num in trans_map:
            h['text'] = trans_map[h_num]
            count_updated += 1

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(fra_data, f, indent=4, ensure_ascii=False)

print(f"Updated {count_updated} hadiths with translations.")
