
import json
import re

file_path = r'c:\Users\majid\Documents\islam\data\hadith\fra-malik.json'
output_path = r'c:\Users\majid\Documents\islam\data\hadith\fra-malik.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

count_cleaned = 0

for h in data['hadiths']:
    text = h.get('text', '')
    if not text:
        continue
        
    # Pattern to find "Chapitre" followed by Roman numerals or numbers at the end of the text
    # We want to remove everything from that point onwards
    # Case insensitive search
    match = re.search(r'(Chapitre\s+[IVX0-9]+.*)$', text, re.IGNORECASE | re.DOTALL)
    if match:
        original_text = text
        # Keep everything BEFORE the match
        clean_text = text[:match.start()].strip()
        h['text'] = clean_text
        count_cleaned += 1
        # print(f"Cleaned Hadith {h['hadithnumber']}: Removed '{match.group(1)}'")

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print(f"Cleanup complete. Modified {count_cleaned} hadiths.")
