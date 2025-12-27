
import json

missing_ids = [7460, 7461, 7462, 7463, 7513, 7514, 7515, 7516, 7517, 7518, 7519, 7557]
sources = [
    r'c:\Users\majid\Documents\islam\data\hadith\eng-muslim.json',
    r'c:\Users\majid\Documents\islam\data\hadith\muslim_ahmedbaset.json'
]

print(f"Searching for {missing_ids}...")

for src in sources:
    print(f"\nChecking {src}...")
    try:
        with open(src, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        hadiths = data.get('hadiths', [])
        
        found_in_file = 0
        for h in hadiths:
            # Check various ID fields
            h_id = h.get('hadithnumber')
            id_in_book = h.get('idInBook')
            raw_id = h.get('id')
            
            # Check for matches
            if h_id in missing_ids:
                print(f"  Found via 'hadithnumber': {h_id} -> Text: {str(h.get('text'))[:50]}...")
                found_in_file += 1
            elif id_in_book in missing_ids:
                 # ahmedbaset structure has 'english': {'text': ...}
                eng = h.get('english', {})
                text = eng.get('text', '') if isinstance(eng, dict) else ''
                print(f"  Found via 'idInBook': {id_in_book} -> Text: {text[:50]}...")
                found_in_file += 1
            elif raw_id in missing_ids:
                 # ahmedbaset
                eng = h.get('english', {})
                text = eng.get('text', '') if isinstance(eng, dict) else ''
                print(f"  Found via 'id': {raw_id} -> Text: {text[:50]}...")
                found_in_file += 1
                
        print(f"  Total found in file: {found_in_file}")
        
    except Exception as e:
        print(f"Error reading {src}: {e}")
