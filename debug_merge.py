
import json

fra_path = r'c:\Users\majid\Documents\islam\data\hadith\fra-malik.json'

with open(fra_path, 'r', encoding='utf-8') as f:
    fra_data = json.load(f)

found = []
for h in fra_data['hadiths']:
    if h['hadithnumber'] == 1524:
        found.append(h)

print(f"Found {len(found)} occurrences of 1524.")
for i, h in enumerate(found):
    print(f"Occurrence {i}: Text length = {len(h.get('text', ''))}")
    h['text'] = "DEBUG_UPDATE"

# Save
with open(fra_path, 'w', encoding='utf-8') as f:
    json.dump(fra_data, f, ensure_ascii=False, indent=4)

print("Saved file with DEBUG_UPDATE.")
