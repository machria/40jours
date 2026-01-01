import json
import os

files = [
    (r'c:\Users\majid\Documents\islam\data\hadith\eng-malik-temp.json', 'English Malik'),
    (r'c:\Users\majid\Documents\islam\data\hadith\fra-malik.json', 'French Malik'),
    (r'c:\Users\majid\Documents\islam\data\hadith\eng-tirmidhi.json', 'English Tirmidhi'),
    (r'c:\Users\majid\Documents\islam\data\hadith\fra-tirmidhi.json', 'French Tirmidhi')
]

for file_path, label in files:
    if os.path.exists(file_path):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                if 'hadiths' in data:
                    count = len(data['hadiths'])
                    last_id = data['hadiths'][-1]['hadithnumber'] if count > 0 else 0
                    print(f"{label}: {count} hadiths. Last ID: {last_id}")
                else:
                    print(f"{label}: Unknown structure")
        except Exception as e:
            print(f"{label}: Error {e}")
    else:
        print(f"{label}: File not found at {file_path}")
