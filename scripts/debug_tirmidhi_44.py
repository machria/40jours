
import json

def is_english(text):
    """Heuristic to detect if text is likely English."""
    if not text: return True
    
    english_indicators = [
        " narrated ", " reported ", " messenger of allah ", 
        " peace be upon him ", " he said: ", " prophet ",
        " allah's messenger ", " abu huraira ", " ibn 'umar ",
        " narrated by ", " reported by "
    ]
    
    text_lower = text.lower()
    print(f"DEBUG: Checking text: '{text[:50]}...'")
    for indicator in english_indicators:
        if indicator in text_lower:
            print(f"DEBUG: Found indicator '{indicator}'")
    
    match_count = sum(1 for indicator in english_indicators if indicator in text_lower)
    
    if match_count >= 2:
        return True
    if "narrated" in text_lower or "messenger of allah" in text_lower:
        return True
    return False

def check_specific():
    with open('data/hadith/fra-tirmidhi.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    target_id = 2860
    found = False
    for h in data['hadiths']:
        if h['hadithnumber'] == target_id:
            print(f"Hadith #{target_id}:")
            print(h['text'])
            print(f"Is English? {is_english(h['text'])}")
            found = True
            break
            
    if not found:
        print(f"Hadith #{target_id} not found.")

if __name__ == "__main__":
    check_specific()
