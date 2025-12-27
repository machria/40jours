
import json
import glob
import os

data_dir = r'c:\Users\majid\Documents\islam\data\hadith'
files = glob.glob(os.path.join(data_dir, 'fra-*.json'))

results = {}

for file_path in files:
    filename = os.path.basename(file_path)
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        hadiths = []
        if 'hadiths' in data:
            hadiths = data['hadiths']
        elif isinstance(data, list):
            hadiths = data
        
        empty_ids = []
        for h in hadiths:
            text = h.get('text', '')
            if not text or (isinstance(text, str) and not text.strip()):
                empty_ids.append(h.get('hadithnumber', 'Unknown'))
        
        if empty_ids:
            results[filename] = empty_ids

    except Exception as e:
        print(f"Error reading {filename}: {e}")

output_path = r'c:\Users\majid\Documents\islam\all_empty_ids.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=4)

print(f"Exported all empty IDs to {output_path}")
# Print summary for user view
for fname, ids in results.items():
    print(f"\n{fname} ({len(ids)} empty):")
    # Print compact list
    print(ids)
