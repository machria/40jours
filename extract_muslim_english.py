
import json

empty_ids_path = r'c:\Users\majid\Documents\islam\all_empty_ids.json'
eng_muslim_path = r'c:\Users\majid\Documents\islam\data\hadith\eng-muslim.json'
output_path = r'c:\Users\majid\Documents\islam\muslim_to_translate.json'

with open(empty_ids_path, 'r', encoding='utf-8') as f:
    all_empty = json.load(f)

muslim_empty_ids = all_empty.get('fra-muslim.json', [])

with open(eng_muslim_path, 'r', encoding='utf-8') as f:
    eng_data = json.load(f)

eng_hadiths = eng_data['hadiths'] if 'hadiths' in eng_data else eng_data
eng_lookup = {h['hadithnumber']: h.get('text', '').strip() for h in eng_hadiths if h.get('hadithnumber') is not None}

to_translate = []
for h_id in muslim_empty_ids:
    text = eng_lookup.get(h_id, '')
    if text:
        to_translate.append({
            "hadithnumber": h_id,
            "english_text": text
        })

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(to_translate, f, indent=4, ensure_ascii=False)

print(f"Extracted {len(to_translate)} hadiths for translation.")
