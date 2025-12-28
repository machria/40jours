
import json

def find_by_arabic():
    with open('data/hadith/fra-tirmidhi.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    target_arabic = 2736
    
    print(f"Searching for Arabic Number {target_arabic}...")
    
    for h in data['hadiths']:
        # messy data sometimes has strings or floats?
        curr_arabic = h.get('arabicnumber')
        
        if curr_arabic == target_arabic or curr_arabic == str(target_arabic):
            print(f"MATCH! ID: {h['hadithnumber']}")
            print(f"Text: {h['text'][:100]}...")
            print("-" * 20)

if __name__ == "__main__":
    find_by_arabic()
