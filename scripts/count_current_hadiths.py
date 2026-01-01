import json
import os

files = [
    r'c:\Users\majid\Documents\islam\data\hadith\fra-muslim.json',
    r'c:\Users\majid\Documents\islam\data\hadith\fra-tirmidhi.json'
]

for file_path in files:
    if os.path.exists(file_path):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                # Assuming data structure is {'hadiths': [...]} or just a list
                if 'hadiths' in data:
                    count = len(data['hadiths'])
                    print(f"{os.path.basename(file_path)}: {count} hadiths found (metadata key 'hadiths')")
                elif isinstance(data, list):
                    count = len(data)
                    print(f"{os.path.basename(file_path)}: {count} hadiths found (list)")
                else:
                    print(f"{os.path.basename(file_path)}: Unknown structure")
        except Exception as e:
            print(f"Error reading {file_path}: {e}")
    else:
        print(f"{file_path} not found")
