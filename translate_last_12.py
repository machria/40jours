
import json
import time
from deep_translator import GoogleTranslator

input_path = r'c:\Users\majid\Documents\islam\last_12_found.json'
output_path = r'c:\Users\majid\Documents\islam\translated_last_12.json'

with open(input_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

translator = GoogleTranslator(source='en', target='fr')
translated_data = []

print(f"Translating {len(data)} hadiths...")

for item in data:
    try:
        eng = item['english_text']
        if not eng: continue
        
        fr = translator.translate(eng)
        translated_data.append({
            "hadithnumber": item['hadithnumber'],
            "text": fr
        })
        print(f"Translated {item['hadithnumber']}")
        time.sleep(0.5)
    except Exception as e:
        print(f"Error {item['hadithnumber']}: {e}")

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(translated_data, f, indent=4, ensure_ascii=False)
