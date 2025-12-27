
import json

empty_ids_path = r'c:\Users\majid\Documents\islam\all_empty_ids.json'
nasai_source_path = r'c:\Users\majid\Documents\islam\data\hadith\nasai_ahmedbaset.json'
output_path = r'c:\Users\majid\Documents\islam\nasai_to_translate.json'

with open(empty_ids_path, 'r', encoding='utf-8') as f:
    all_empty = json.load(f)

nasai_empty_ids = all_empty.get('fra-nasai.json', [])

with open(nasai_source_path, 'r', encoding='utf-8') as f:
    source_data = json.load(f)

# Create lookup from idInBook to english text
lookup = {}
if 'hadiths' in source_data:
    for h in source_data['hadiths']:
        id_in_book = h.get('idInBook')
        eng = h.get('english', {})
        text = eng.get('text', '').strip()
        if id_in_book is not None and text:
            lookup[id_in_book] = text

to_translate = []
found_count = 0
for h_id in nasai_empty_ids:
    text = lookup.get(h_id, '')
    if text:
        to_translate.append({
            "hadithnumber": h_id,
            "english_text": text
        })
        found_count += 1
    else:
        print(f"ID {h_id} still not found in AhmedBaset")

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(to_translate, f, indent=4, ensure_ascii=False)

print(f"Extracted {found_count} Nasai hadiths for translation out of {len(nasai_empty_ids)} missing.")
