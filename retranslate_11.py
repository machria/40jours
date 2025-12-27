
import json
import time
from deep_translator import GoogleTranslator

# Load missing hadiths
input_path = r'c:\Users\majid\Documents\islam\missing_hadiths.json'
output_path = r'c:\Users\majid\Documents\islam\translated_11.json'

with open(input_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Batch 11 was 280-295
batch = data[280:295]

translator = GoogleTranslator(source='en', target='fr')
translated_data = []

print(f"Translating batch of {len(batch)} hadiths...")

for i, item in enumerate(batch):
    try:
        eng_text = item['english_text']
        if len(eng_text) > 4500:
             print(f"Text too long ({len(eng_text)}), skipping translation for {item['hadithnumber']}")
             fr_text = eng_text
        else:
             fr_text = translator.translate(eng_text)
        
        translated_data.append({
            "hadithnumber": item['hadithnumber'],
            "text": fr_text
        })
        print(f"Translated {item['hadithnumber']}")
        time.sleep(0.5)
    except Exception as e:
        print(f"Error {item['hadithnumber']}: {e}")
        translated_data.append({
            "hadithnumber": item['hadithnumber'],
            "text": item['english_text']
        })

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(translated_data, f, indent=4, ensure_ascii=False)

print("Batch 11 re-translation complete.")
