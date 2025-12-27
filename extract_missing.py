
import json

fra_path = r'c:\Users\majid\Documents\islam\data\hadith\fra-malik.json'
eng_path = r'c:\Users\majid\Documents\islam\data\hadith\eng-malik-temp.json'
output_path = r'c:\Users\majid\Documents\islam\missing_hadiths.json'

with open(fra_path, 'r', encoding='utf-8') as f:
    fra_data = json.load(f)

with open(eng_path, 'r', encoding='utf-8') as f:
    eng_data = json.load(f)

eng_hadiths = {h['hadithnumber']: h for h in eng_data['hadiths']}

to_translate = []

for h in fra_data['hadiths']:
    if not h.get('text') or h['text'].strip() == "":
        h_num = h['hadithnumber']
        if h_num in eng_hadiths:
            eng_text = eng_hadiths[h_num].get('text', '').strip()
            if eng_text:
                to_translate.append({
                    "hadithnumber": h_num,
                    "english_text": eng_text
                })

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(to_translate, f, indent=4, ensure_ascii=False)

print(f"Extracted {len(to_translate)} hadiths for translation.")
