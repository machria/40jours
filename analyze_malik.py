
import json
import re

file_path = r'c:\Users\majid\Documents\islam\data\hadith\fra-malik.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total Hadiths: {len(data['hadiths'])}")

empty_text_count = 0
chapitre_in_text_count = 0
issues = []

for h in data['hadiths']:
    text = h.get('text', '')
    if not text or text.strip() == "":
        empty_text_count += 1
        issues.append(f"Empty text at Hadith {h['hadithnumber']}")
    
    if "Chapitre" in text:
        # Check if it looks like a header embedded at the end
        matches = re.finditer(r'(Chapitre [IVX]+.*)', text)
        for match in matches:
            chapitre_in_text_count += 1
            issues.append(f"Embedded Chapter in Hadith {h['hadithnumber']}: '{match.group(1)[:50]}...'")

print(f"Empty texts: {empty_text_count}")
print(f"Embedded Chapters: {chapitre_in_text_count}")
if issues:
    print("First 20 issues:")
    for issue in issues[:20]:
        print(issue)

# I need to collect IDs.
empty_ids = []
for h in data['hadiths']:
    text = h.get('text', '')
    if not text or text.strip() == "":
        empty_ids.append(h['hadithnumber'])
print("Full list of empty IDs:", empty_ids)
