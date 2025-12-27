
import json
import glob
import os

data_dir = r'c:\Users\majid\Documents\islam\data\hadith'
files = glob.glob(os.path.join(data_dir, 'fra-*.json'))

print(f"{'File':<20} | {'Total':<8} | {'Empty':<8} | {'% Empty':<8}")
print("-" * 50)

for file_path in files:
    filename = os.path.basename(file_path)
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Check structure
        hadiths = []
        if 'hadiths' in data:
            hadiths = data['hadiths']
        elif isinstance(data, list):
            hadiths = data
        else:
            print(f"{filename:<20} | Error: Unknown structure")
            continue

        total = len(hadiths)
        empty_count = 0
        empty_ids = []

        for h in hadiths:
            text = h.get('text', '')
            if not text or (isinstance(text, str) and not text.strip()):
                empty_count += 1
                empty_ids.append(h.get('hadithnumber', 'Unknown'))
        
        pct = (empty_count / total * 100) if total > 0 else 0
        print(f"{filename:<20} | {total:<8} | {empty_count:<8} | {pct:<7.2f}%")
        
        if empty_count > 0:
            # Print sample of empty IDs
            sample = empty_ids[:10]
            print(f"  -> Empty IDs sample: {sample}")
            if len(empty_ids) > 10:
                print(f"  -> ... and {len(empty_ids) - 10} more.")
        print("-" * 50)

    except Exception as e:
        print(f"{filename:<20} | Error: {e}")
