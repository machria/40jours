import json
import os
import time
from deep_translator import GoogleTranslator

# File Paths
MALIK_ENG_PATH = r'c:\Users\majid\Documents\islam\data\hadith\eng-malik-temp.json'
MALIK_FRA_PATH = r'c:\Users\majid\Documents\islam\data\hadith\fra-malik.json'
TIRMIDHI_FRA_PATH = r'c:\Users\majid\Documents\islam\data\hadith\fra-tirmidhi.json'
TIRMIDHI_REPORT_PATH = r'c:\Users\majid\Documents\islam\data\hadith\tirmidhi_empty_report.txt'

def sync_malik():
    print("--- Syncing Malik ---")
    if not os.path.exists(MALIK_ENG_PATH) or not os.path.exists(MALIK_FRA_PATH):
        print("Malik files not found.")
        return

    with open(MALIK_ENG_PATH, 'r', encoding='utf-8') as f:
        data_eng = json.load(f)
    with open(MALIK_FRA_PATH, 'r', encoding='utf-8') as f:
        data_fra = json.load(f)

    eng_hadiths = {h['hadithnumber']: h for h in data_eng['hadiths']}
    fra_hadiths = {h['hadithnumber']: h for h in data_fra.get('hadiths', [])}
    
    missing_ids = [hid for hid in eng_hadiths if hid not in fra_hadiths]
    print(f"Found {len(missing_ids)} missing hadiths in Malik.")
    
    if not missing_ids:
        print("No missing hadiths.")
        return

    translator = GoogleTranslator(source='en', target='fr')
    new_hadiths = []

    for i, hid in enumerate(missing_ids):
        eng_h = eng_hadiths[hid]
        text_eng = eng_h.get('text', '')
        
        # Translate
        try:
            text_fra = translator.translate(text_eng) if text_eng.strip() else ""
            time.sleep(0.2)
        except Exception as e:
            print(f"Error translating {hid}: {e}")
            text_fra = text_eng # Fallback

        new_h = eng_h.copy()
        new_h['text'] = text_fra
        new_hadiths.append(new_h)
        
        if (i + 1) % 10 == 0:
            print(f"Translated {i+1}/{len(missing_ids)}")

    # Add to main list
    if 'hadiths' not in data_fra:
        data_fra['hadiths'] = []
    
    data_fra['hadiths'].extend(new_hadiths)
    # Sort by hadithnumber (handling potential strings vs ints if mixed, but usually ints/numeric strings)
    # Assuming hadithnumber is comparable. Safest is key=lambda x: float(x['hadithnumber']) if numeric
    try:
         data_fra['hadiths'].sort(key=lambda x: float(x.get('hadithnumber', 0)))
    except:
         data_fra['hadiths'].sort(key=lambda x: str(x.get('hadithnumber', '')))

    with open(MALIK_FRA_PATH, 'w', encoding='utf-8') as f:
        json.dump(data_fra, f, indent=4, ensure_ascii=False)
    
    print(f"Updated {MALIK_FRA_PATH} with {len(new_hadiths)} new hadiths.")

def audit_tirmidhi():
    print("\n--- Auditing Tirmidhi ---")
    if not os.path.exists(TIRMIDHI_FRA_PATH):
        print("Tirmidhi file not found.")
        return

    with open(TIRMIDHI_FRA_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    empty_list = []
    for h in data.get('hadiths', []):
        text = h.get('text', '')
        if not text or not text.strip():
            empty_list.append(h.get('hadithnumber'))

    print(f"Found {len(empty_list)} empty hadiths in Tirmidhi.")
    
    with open(TIRMIDHI_REPORT_PATH, 'w', encoding='utf-8') as f:
        f.write(f"Total Empty Hadiths: {len(empty_list)}\n")
        f.write("Hadith Numbers:\n")
        for hid in empty_list:
            f.write(f"{hid}\n")
    
    print(f"Report saved to {TIRMIDHI_REPORT_PATH}")

if __name__ == "__main__":
    sync_malik()
    audit_tirmidhi()
