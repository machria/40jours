import json
import time
import concurrent.futures
from deep_translator import GoogleTranslator

input_path = r"c:\Users\majid\Documents\islam\data\hisn\hisn_en.json"
output_path = r"c:\Users\majid\Documents\islam\data\hisn\fra-hisn.json"

translator = GoogleTranslator(source='auto', target='fr')

def translate_text(text):
    if not text:
        return ""
    try:
        # Simple retry logic
        for _ in range(3):
            try:
                return translator.translate(text)
            except Exception as e:
                time.sleep(1)
        return text 
    except Exception as e:
        print(f"Translation failed for '{text[:20]}...': {e}")
        return text

def process_category(cat):
    title = cat.get('TITLE', 'Unknown')
    # print(f"Processing: {title[:30]}...")
    
    french_title = translate_text(cat.get('TITLE', ''))
    
    processed_cat = {
        "id": cat.get('ID'),
        "title": french_title,
        "hadiths": []
    }
    
    for item in cat.get('TEXT', []):
        trans_text = translate_text(item.get('TRANSLATED_TEXT', ''))
        # User requested to KEEP this field (likely transliteration or important context), so do not translate.
        lang_arabic_trans = item.get('LANGUAGE_ARABIC_TRANSLATED_TEXT', '')
        
        processed_cat['hadiths'].append({
            "id": item.get('ID'),
            "arabic": item.get('ARABIC_TEXT', ''),
            "french": trans_text,
            "source": lang_arabic_trans, 
            "repeat": item.get('REPEAT', 1)
        })
    return processed_cat

def process_hisn():
    with open(input_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    categories = data.get('English', [])
    total = len(categories)
    print(f"Processing {total} categories with 10 workers...")
    
    processed_data = []
    
    # Use ThreadPoolExecutor
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        # Submit all tasks
        future_to_cat = {executor.submit(process_category, cat): idx for idx, cat in enumerate(categories)}
        
        for i, future in enumerate(concurrent.futures.as_completed(future_to_cat)):
            try:
                result = future.result()
                processed_data.append(result)
                if i % 10 == 0:
                    print(f"Completed {i}/{total}")
            except Exception as exc:
                print(f"Category generated an exception: {exc}")

    # Sort by ID to maintain order (since future.as_completed is unordered)
    processed_data.sort(key=lambda x: x['id'])

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(processed_data, f, indent=4, ensure_ascii=False)
        
    print(f"Done! Saved to {output_path}")

if __name__ == "__main__":
    process_hisn()
