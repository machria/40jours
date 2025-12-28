
import json

def get_surah_1():
    with open('data/quran-data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Surah 1 is on page 1
    page_1 = data.get("1")
    if page_1:
        print(f"Found {len(page_1)} ayahs for Surah 1:")
        for a in page_1:
            print(f"Ayah {a['ayah']}: {a['text']}")

if __name__ == "__main__":
    get_surah_1()
