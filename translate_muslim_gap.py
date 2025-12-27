
import json
import time
from deep_translator import GoogleTranslator

input_path = r'c:\Users\majid\Documents\islam\muslim_gap_to_translate.json'
output_path = r'c:\Users\majid\Documents\islam\translated_muslim_gap.json'

with open(input_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

translator = GoogleTranslator(source='en', target='fr')
translated_data = []

print(f"Translating {len(data)} hadiths...")

for i, item in enumerate(data):
    try:
        eng_text = item['english_text']
        if not eng_text:
            continue
            
        if len(eng_text) > 4800:
             print(f"Skipping too long text for {item['hadithnumber']}")
             fr_text = eng_text
        else:
             fr_text = translator.translate(eng_text)
        
        translated_data.append({
            "hadithnumber": item['hadithnumber'],
            "text": fr_text
        })
        
        if i % 10 == 0:
            print(f"Translated {i}/{len(data)}")
            
        time.sleep(0.2)
        
    except Exception as e:
        print(f"Error translating {item['hadithnumber']}: {e}")

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(translated_data, f, indent=4, ensure_ascii=False)

print("Translation complete.")
