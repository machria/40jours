import os
import json
import shutil

DATA_FILE = os.path.join(os.getcwd(), 'data', 'asbab_nuzul_fr.json')
PUBLIC_ASBAB_DIR = os.path.join(os.getcwd(), 'public', 'asbab')

def main():
    if os.path.exists(PUBLIC_ASBAB_DIR):
        shutil.rmtree(PUBLIC_ASBAB_DIR)
    os.makedirs(PUBLIC_ASBAB_DIR, exist_ok=True)
    
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    count = 0
    for key, text in data.items():
        # key is "surah_ayah"
        filepath = os.path.join(PUBLIC_ASBAB_DIR, f"{key}.json")
        with open(filepath, 'w', encoding='utf-8') as out_f:
            json.dump({"text": text}, out_f, ensure_ascii=False)
        count += 1
        
    print(f"✅ Generated {count} Asbab files in {PUBLIC_ASBAB_DIR}")

if __name__ == '__main__':
    main()
