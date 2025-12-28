
import json
import time
from deep_translator import GoogleTranslator
import os

input_path = r'data/hadith/eng-tirmidhi.json'
output_path = r'data/hadith/fra-tirmidhi.json'

def translate_tirmidhi():
    print(f"Loading {input_path}...")
    with open(input_path, 'r', encoding='utf-8') as f:
        data_eng = json.load(f)

    # Load existing progress if available
    if os.path.exists(output_path):
        print(f"Loading existing {output_path}...")
        with open(output_path, 'r', encoding='utf-8') as f:
            data_fra = json.load(f)
    else:
        data_fra = data_eng.copy()
        data_fra['hadiths'] = [h.copy() for h in data_eng['hadiths']]
        # Clear texts to be translated
        for h in data_fra['hadiths']:
            h['text'] = ""
    
    translator = GoogleTranslator(source='en', target='fr')

    # Translate Metadata Sections if not already done (check a sample or just re-do/fill missing)
    print("Translating metadata sections...")
    sections = data_eng['metadata']['sections']
    fra_sections = data_fra['metadata'].get('sections', {})
    
    for key, value in sections.items():
        if not value:
            fra_sections[key] = ""
            continue
        
        # If missing or looks english (simple heuristic? or just overwrite/fill?)
        # Let's assume if it exists in fra_sections, it's done.
        if key in fra_sections and fra_sections[key] and fra_sections[key] != value:
            continue
            
        try:
            trans = translator.translate(value)
            fra_sections[key] = trans
            print(f"Section {key}: {value} -> {trans}")
            time.sleep(0.2)
        except Exception as e:
            print(f"Error translating section {key}: {e}")
            fra_sections[key] = value

    data_fra['metadata']['sections'] = fra_sections
    data_fra['metadata']['name'] = "Jami At Tirmidhi" 

    # Translate Hadiths
    hadiths_eng = data_eng['hadiths']
    hadiths_fra = data_fra['hadiths']
    
    total = len(hadiths_eng)
    print(f"Starting translation of {total} hadiths...")
    
    batch_size = 20 # Smaller batch size for safety
    current_batch_texts = []
    current_batch_indices = []

    # Map hadithnumber to index in fra list for easy access
    fra_map = {h['hadithnumber']: h for h in hadiths_fra}

    changed = False

    for i, item_eng in enumerate(hadiths_eng):
        h_number = item_eng['hadithnumber']
        item_fra = fra_map.get(h_number)
        
        if not item_fra:
             # Should not happen if we copied structure
             continue

        current_text_fra = item_fra.get('text', '')
        text_eng = item_eng.get('text', '')

        # Check if needs translation: 
        # 1. English text exists
        # 2. French text is empty OR French text equals English text (copy-paste case)
        if text_eng and (not current_text_fra or current_text_fra == text_eng):
             pass # Needs translation
        else:
             continue # Already done

        if not text_eng.strip():
            continue

        # Handle long text by splitting? Or just try?
        # Google Translate limit is usually ~5000 chars.
        if len(text_eng) > 4500:
             print(f"Hadith {h_number} is long ({len(text_eng)} chars), splitting chunks...")
             # Split by broad chunks (e.g. sentences)
             chunks = []
             current_chunk = ""
             for sentence in text_eng.split('.'):
                 if len(current_chunk) + len(sentence) < 4000:
                     current_chunk += sentence + "."
                 else:
                     chunks.append(current_chunk)
                     current_chunk = sentence + "."
             if current_chunk:
                 chunks.append(current_chunk)
             
             # Translate chunks individually
             full_trans = ""
             try:
                 for chunk in chunks:
                     if chunk.strip():
                        full_trans += translator.translate(chunk) + " "
                        time.sleep(0.2)
                 item_fra['text'] = full_trans.strip()
                 changed = True
                 print(f"Translated long hadith {h_number}")
             except Exception as e:
                 print(f"Error translating long hadith {h_number}: {e}")
        else:
            current_batch_texts.append(text_eng)
            current_batch_indices.append(h_number)

        # Process batch
        if len(current_batch_texts) >= batch_size:
            try:
                translations = translator.translate_batch(current_batch_texts)
                for idx_in_batch, h_num in enumerate(current_batch_indices):
                    fra_map[h_num]['text'] = translations[idx_in_batch]
                changed = True
                print(f"Translated batch ending at {i+1}/{total}")
            except Exception as e:
                print(f"Error translating batch: {e}")
                # Fallback: translate one by one
                for idx_in_batch, h_num in enumerate(current_batch_indices):
                    try:
                        fra_map[h_num]['text'] = translator.translate(current_batch_texts[idx_in_batch])
                        changed = True
                    except Exception as e2:
                        print(f"Failed single translation for {h_num}: {e2}")

            current_batch_texts = []
            current_batch_indices = []
            time.sleep(1)
            
            # Save progress periodically
            if changed and i % 100 == 0:
                 print("Saving progress...")
                 with open(output_path, 'w', encoding='utf-8') as f:
                     json.dump(data_fra, f, indent=4, ensure_ascii=False)
                 changed = False

    # Process remaining batch
    if current_batch_texts:
        try:
            translations = translator.translate_batch(current_batch_texts)
            for idx_in_batch, h_num in enumerate(current_batch_indices):
                fra_map[h_num]['text'] = translations[idx_in_batch]
            changed = True
        except Exception as e:
            print(f"Error translating final batch: {e}")
            for idx_in_batch, h_num in enumerate(current_batch_indices):
                    try:
                        fra_map[h_num]['text'] = translator.translate(current_batch_texts[idx_in_batch])
                        changed = True
                    except Exception as e2:
                        print(f"Failed single translation for {h_num}: {e2}")

    print(f"Saving final to {output_path}...")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data_fra, f, indent=4, ensure_ascii=False)
    print("Done.")

if __name__ == "__main__":
    translate_tirmidhi()
