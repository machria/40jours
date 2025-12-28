
import json
import os

def check_nasr_resources():
    # 1. Text
    print("--- Surah An-Nasr (110) Text ---")
    try:
        with open('data/quran-data.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Determine page for 110. It's usually end of Quran, page 603 or 604?
        # Let's scan a bit or search specifically if possible, but simplest is linear scan of keys if small, 
        # or just guess ranges. 
        # Actually I can just iter all pages since I don't know the exact page key mapping.
        
        found = False
        for page_num, ayahs in data.items():
            for a in ayahs:
                if a.get('surah') == 110:
                    print(f"Ayah {a['ayah']}: {a['text']}")
                    found = True
            if found: break 
            
    except Exception as e:
        print(f"Error reading text: {e}")

    # 2. Audio
    print("\n--- Audio Files in public/audio ---")
    try:
        # User said "audio du projet déjà présent". 
        # I'll list the directory to see structure (identifiers like 110.mp3 or 110001.mp3 etc)
        # Note: In python script I can't browse directly, but I can use os.walk if running locally? 
        # Actually I can use the list_dir tool, but here I'm writing a script. 
        # I'll rely on the tool call for file listing.
        pass
    except Exception as e:
        print(f"Error checking audio: {e}")

if __name__ == "__main__":
    check_nasr_resources()
