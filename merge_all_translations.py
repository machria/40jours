
import json
import glob
import os
from collections import defaultdict

fra_path = r'c:\Users\majid\Documents\islam\data\hadith\fra-malik.json'
translated_pattern = r'c:\Users\majid\Documents\islam\translated_*.json'

with open(fra_path, 'r', encoding='utf-8') as f:
    fra_data = json.load(f)

# Create a map for quick lookup, supporting duplicates
fra_hadiths_map = defaultdict(list)
for h in fra_data['hadiths']:
    fra_hadiths_map[h['hadithnumber']].append(h)

total_updated = 0
files_processed = 0

# Get all translated files
translated_files = glob.glob(translated_pattern)
translated_files.sort()

print(f"Found {len(translated_files)} translation files.")

for file_path in translated_files:
    print(f"Processing {os.path.basename(file_path)}...")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            trans_data = json.load(f)
        
        count_in_file = 0
        for item in trans_data:
            h_num = item['hadithnumber']
            new_text = item['text']
            
            if h_num == 1524:
                print(f"DEBUG: Found 1524 in translation file {os.path.basename(file_path)}")

            if h_num in fra_hadiths_map:
                hadiths_list = fra_hadiths_map[h_num]
                if h_num == 1524:
                    print(f"DEBUG: Found {len(hadiths_list)} matches in fra_malik for 1524")
                for h in hadiths_list:
                    h['text'] = new_text.strip()
                    total_updated += 1
                count_in_file += 1
            else:
                if h_num == 1524:
                    print(f"DEBUG: 1524 NOT FOUND in fra_hadiths_map keys: {list(fra_hadiths_map.keys())[:5]}...")
                print(f"Warning: Hadith {h_num} not found in fra-malik.json")
        
        print(f"  Processed {count_in_file} hadith IDs from {os.path.basename(file_path)}")
        files_processed += 1
        
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

# Save the updated file
with open(fra_path, 'w', encoding='utf-8') as f:
    json.dump(fra_data, f, ensure_ascii=False, indent=4)

print(f"\nMerge complete.")
print(f"Processed {files_processed} files.")
print(f"Total hadith objects updated: {total_updated}")
