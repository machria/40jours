
import json

missing_ids = [7460, 7461, 7462, 7463, 7513, 7514, 7515, 7516, 7517, 7518, 7519, 7557]
sources = [
    r'c:\Users\majid\Documents\islam\data\hadith\eng-muslim.json',
    r'c:\Users\majid\Documents\islam\data\hadith\muslim_ahmedbaset.json'
]

found_data = {}

print(f"Searching for {missing_ids}...")

for src in sources:
    print(f"Checking {src}...")
    try:
        with open(src, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        hadiths = data.get('hadiths', [])
        
        for h in hadiths:
            # Check fields
            h_num = h.get('hadithnumber')
            id_in_book = h.get('idInBook')
            raw_id = h.get('id')
            
            text = ""
            matched_id = None
            
            # extract text strategy
            if 'english' in h and isinstance(h['english'], dict):
                text = h['english'].get('text', '')
            elif 'text' in h:
                text = h['text']
            
            if not text:
                continue
                
            # check ID match
            if h_num in missing_ids:
                matched_id = h_num
            elif id_in_book in missing_ids:
                matched_id = id_in_book
            elif raw_id in missing_ids:
                matched_id = raw_id
            
            if matched_id and matched_id not in found_data:
                found_data[matched_id] = text
                print(f"  Found {matched_id}")
                
    except Exception as e:
        print(f"Error: {e}")

print(f"Total Unique Found: {len(found_data)}")

# Save
with open(r'c:\Users\majid\Documents\islam\last_12_found.json', 'w', encoding='utf-8') as f:
    # Convert to translation format
    out = [{"hadithnumber": k, "english_text": v} for k,v in found_data.items()]
    json.dump(out, f, indent=4, ensure_ascii=False)
