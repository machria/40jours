
import json

empty_ids_path = r'c:\Users\majid\Documents\islam\all_empty_ids.json'
already_extracted_path = r'c:\Users\majid\Documents\islam\muslim_to_translate.json'
source_path = r'c:\Users\majid\Documents\islam\data\hadith\muslim_ahmedbaset.json'
output_path = r'c:\Users\majid\Documents\islam\muslim_gap_to_translate.json'

with open(empty_ids_path, 'r', encoding='utf-8') as f:
    all_empty = json.load(f)
empty_ids = set(all_empty.get('fra-muslim.json', []))

with open(already_extracted_path, 'r', encoding='utf-8') as f:
    existing = json.load(f)
existing_ids = set(item['hadithnumber'] for item in existing)

missing_ids = empty_ids - existing_ids
print(f"Total empty: {len(empty_ids)}")
print(f"Already found: {len(existing_ids)}")
print(f"Searching for remaining: {len(missing_ids)}")

with open(source_path, 'r', encoding='utf-8') as f:
    source_data = json.load(f)

source_lookup = {}
if 'hadiths' in source_data:
    for h in source_data['hadiths']:
        id_in_book = h.get('idInBook')
        eng = h.get('english', {})
        text = eng.get('text', '').strip()
        if id_in_book is not None and text:
            source_lookup[id_in_book] = text

found_data = []
for h_id in missing_ids:
    text = source_lookup.get(h_id, '')
    if text:
        found_data.append({
            "hadithnumber": h_id,
            "english_text": text
        })

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(found_data, f, indent=4, ensure_ascii=False)

print(f"Extracted {len(found_data)} hadiths for gap translation.")
