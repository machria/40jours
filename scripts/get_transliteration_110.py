
import json

def get_transliteration_110():
    try:
        with open('data/quran-transliteration.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Structure is { "quran": [ { "chapter": 1, ... } ] }
        print("Searching for Chapter 110...")
        found = []
        for verse in data.get('quran', []):
            if verse.get('chapter') == 110:
                found.append(verse)
        
        if not found:
            print("Chapter 110 not found")
        else:
            for v in found:
                print(f"Ayah {v['verse']}: {v['text']}")
                
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    get_transliteration_110()
