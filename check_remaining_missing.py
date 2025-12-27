
import json

fra_path = r'c:\Users\majid\Documents\islam\data\hadith\fra-malik.json'
eng_path = r'c:\Users\majid\Documents\islam\data\hadith\eng-malik-temp.json'

with open(fra_path, 'r', encoding='utf-8') as f:
    fra_data = json.load(f)

with open(eng_path, 'r', encoding='utf-8') as f:
    eng_data = json.load(f)

eng_hadiths = {h['hadithnumber']: h for h in eng_data['hadiths']}

still_missing = []
missing_but_in_eng = []

for h in fra_data['hadiths']:
    text = h.get('text', '')
    if not text or text.strip() == "":
        h_num = h['hadithnumber']
        still_missing.append(h_num)
        
        if h_num in eng_hadiths:
            eng_text = eng_hadiths[h_num].get('text', '').strip()
            if eng_text:
                missing_but_in_eng.append(h_num)

print(f"Still missing/empty in French: {len(still_missing)}")
print(f"Of those, present in English: {len(missing_but_in_eng)}")

if missing_but_in_eng:
    print("IDs present in English:", missing_but_in_eng)
else:
    print("All remaining missing hadiths are also missing in English.")
