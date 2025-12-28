
import json

def inspect_2736():
    with open('data/hadith/fra-tirmidhi.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    target_id = 2736
    for h in data['hadiths']:
        if h['hadithnumber'] == target_id:
            print(f"Hadith #{target_id}:")
            print(h['text'])
            
            # Test detection
            text = h['text'].lower()
            keywords_en = {"the", "and", "of", "to", "in", "that", "is", "he", "was", "with", "narrated", "messenger", "allah"}
            keywords_fr = {"le", "la", "les", "de", "dul", "des", "et", "à", "dans", "que", "il", "est", "avec", "rapporté", "messager", "dieu"}
            
            words = text.replace('.', '').replace(',', '').split()
            count_en = sum(1 for w in words if w in keywords_en)
            count_fr = sum(1 for w in words if w in keywords_fr)
            
            print(f"EN words: {count_en}")
            print(f"FR words: {count_fr}")
            print(f"Ratio EN/FR: {count_en/count_fr if count_fr > 0 else 'inf'}")

if __name__ == "__main__":
    inspect_2736()
