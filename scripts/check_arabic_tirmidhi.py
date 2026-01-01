import json
import os

REPORT_PATH = r'c:\Users\majid\Documents\islam\data\hadith\tirmidhi_empty_report.txt'
ARABIC_PATH = r'c:\Users\majid\Documents\islam\data\hadith\ara-tirmidhi.json'

def load_empty_ids():
    ids = []
    if not os.path.exists(REPORT_PATH):
        print("Report file not found")
        return []
    
    with open(REPORT_PATH, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        capture = False
        for line in lines:
            line = line.strip()
            if line == "Hadith Numbers:":
                capture = True
                continue
            if capture and line:
                ids.append(line)
    return ids

def check_arabic(empty_ids):
    if not os.path.exists(ARABIC_PATH):
        print(f"Arabic file not found at {ARABIC_PATH}")
        return

    print("Loading Arabic Tirmidhi...")
    with open(ARABIC_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Create lookup map. Handling both int and float/string IDs
    arabic_map = {}
    for h in data.get('hadiths', []):
        # Store as string for easy lookup
        arabic_map[str(h['hadithnumber'])] = h

    found_count = 0
    valid_text_count = 0
    missing_in_arabic = []
    empty_in_arabic = []

    print(f"\nChecking {len(empty_ids)} hadiths...")
    
    for hid in empty_ids:
        if hid in arabic_map:
            found_count += 1
            h_ara = arabic_map[hid]
            text = h_ara.get('text', '')
            if text and text.strip():
                valid_text_count += 1
            else:
                empty_in_arabic.append(hid)
        else:
            missing_in_arabic.append(hid)

    with open(r'c:\Users\majid\Documents\islam\data\hadith\arabic_check_results.txt', 'w', encoding='utf-8') as f:
        f.write("\n--- Results ---\n")
        f.write(f"Total checked: {len(empty_ids)}\n")
        f.write(f"Found in Arabic file: {found_count}\n")
        f.write(f"With valid Arabic text: {valid_text_count}\n")
        
        if missing_in_arabic:
            f.write(f"\nIDs Not Found in Arabic ({len(missing_in_arabic)}):\n")
            f.write(", ".join(missing_in_arabic) + "\n")
        
        if empty_in_arabic:
            f.write(f"\nFound but empty in Arabic ({len(empty_in_arabic)}):\n")
            f.write(", ".join(empty_in_arabic) + "\n")
            
    print("Results saved to arabic_check_results.txt")

if __name__ == "__main__":
    ids = load_empty_ids()
    if ids:
        check_arabic(ids)
    else:
        print("No IDs to check.")
