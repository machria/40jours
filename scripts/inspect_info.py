import json

path = r"c:\Users\majid\Documents\islam\data\hadith\info.json"

try:
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print("Top level keys:", list(data.keys()))
    
    for key in ["muslim", "tirmidhi"]:
        if key in data:
            print(f"\n--- {key} ---")
            meta = data[key].get('metadata', {})
            print("Metadata keys:", list(meta.keys()))
            if 'last_hadithnumber' in meta:
                print(f"last_hadithnumber: {meta['last_hadithnumber']}")
            if 'sections' in meta:
                 print(f"Sections count: {len(meta['sections'])}")
        else:
            print(f"\n{key} not found in info.json")

except Exception as e:
    print(f"Error: {e}")
