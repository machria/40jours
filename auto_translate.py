
import json
import time
from deep_translator import GoogleTranslator

input_path = r'c:\Users\majid\Documents\islam\missing_hadiths.json'
output_path = r'c:\Users\majid\Documents\islam\translated_hadiths_all.json'

with open(input_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

translator = GoogleTranslator(source='en', target='fr')

translated_data = []
total = len(data)
print(f"Starting translation of {total} hadiths...")

for i, item in enumerate(data):
    try:
        eng_text = item['english_text']
        # Split text if too long (Google Translate has 5000 char limit usually, but deep-translator handles it often. 
        # Safest is to just try, hadiths are usually < 5000 chars)
        if len(eng_text) > 4000:
            print(f"Skipping translation for hadith {item['hadithnumber']} - text too long ({len(eng_text)} chars)")
            fr_text = eng_text # Fallback to English
        else:
            fr_text = translator.translate(eng_text)
        
        translated_data.append({
            "hadithnumber": item['hadithnumber'],
            "text": fr_text
        })
        
        if (i + 1) % 10 == 0:
            print(f"Translated {i + 1}/{total}")
        
        # Small delay to be polite
        time.sleep(0.5)
        
    except Exception as e:
        print(f"Error translating hadith {item['hadithnumber']}: {e}")
        translated_data.append({
            "hadithnumber": item['hadithnumber'],
            "text": item['english_text'] # Fallback
        })

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(translated_data, f, indent=4, ensure_ascii=False)

print("Translation complete.")
