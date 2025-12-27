
import json

fra_path = r'c:\Users\majid\Documents\islam\data\hadith\fra-malik.json'
eng_path = r'c:\Users\majid\Documents\islam\data\hadith\eng-malik-temp.json'

with open(fra_path, 'r', encoding='utf-8') as f:
    fra_data = json.load(f)

with open(eng_path, 'r', encoding='utf-8') as f:
    eng_data = json.load(f)

fra_hadiths = {h['hadithnumber']: h for h in fra_data['hadiths']}
eng_hadiths = {h['hadithnumber']: h for h in eng_data['hadiths']}

missing_in_fra = []
missing_in_eng = []

for h_num, h_fra in fra_hadiths.items():
    if not h_fra.get('text') or h_fra['text'].strip() == "":
        missing_in_fra.append(h_num)

for h_num in missing_in_fra:
    if h_num in eng_hadiths:
        h_eng = eng_hadiths[h_num]
        if not h_eng.get('text') or h_eng['text'].strip() == "":
            missing_in_eng.append(h_num)
    else:
        missing_in_eng.append(h_num)

print(f"Total hadiths in French: {len(fra_hadiths)}")
print(f"Total hadiths in English: {len(eng_hadiths)}")
print(f"Empty/Missing in French: {len(missing_in_fra)}")
print(f"Of those missing in French, still missing/empty in English: {len(missing_in_eng)}")

if len(missing_in_eng) < len(missing_in_fra):
    print("English version can fill some gaps!")
else:
    print("English version has the same gaps.")
