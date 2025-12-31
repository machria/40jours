
import json
import time
import os
import argparse
from deep_translator import GoogleTranslator

# Configuration
BATCH_SIZE = 40  # Number of hadiths to translate before saving/sleeping
SLEEP_TIME = 1   # Seconds to sleep between batches to be polite
CHUNK_SIZE = 4000 # Max chars per translation request

def split_text(text, max_length=CHUNK_SIZE):
    """Splits text into chunks respecting sentence boundaries."""
    if len(text) <= max_length:
        return [text]
    
    chunks = []
    current_chunk = ""
    
    # Split by common sentence endings
    # Simple split might break if not careful, but sufficient for this purpose
    sentences = text.replace('. ', '.|').replace('? ', '?|').replace('! ', '!|').split('|')
    
    for sentence in sentences:
        if len(current_chunk) + len(sentence) < max_length:
            current_chunk += sentence + " "
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
            current_chunk = sentence + " "
            
            # Force split if single sentence is too long
            if len(current_chunk) > max_length:
                while len(current_chunk) > max_length:
                    chunks.append(current_chunk[:max_length])
                    current_chunk = current_chunk[max_length:]
    
    if current_chunk:
        chunks.append(current_chunk.strip())
        
    return chunks

def translate_batch(texts, source_lang, translator):
    """Translates a batch of texts. Handles exceptions per batch."""
    try:
        # Check for empty texts to avoid API errors
        valid_texts = [t for t in texts if t and t.strip()]
        if not valid_texts:
            return texts # All empty? return as is (empty)

        # We can't easily map back if we filter empty ones out for the batch call
        # So we'll iterate one by one if we want to be safe, or just send all
        # deep_translator usually handles empty strings okay, but let's be safe
        
        # Actually, deep_translator batch mode might fail if one fails. 
        # For robustness with free API, loop might be safer but slower. 
        # Let's try batch, fallback to single.
        
        return translator.translate_batch(texts)
    except Exception as e:
        print(f"    Batch translation failed ({e}). Retrying individually...")
        results = []
        for t in texts:
            try:
                if not t.strip():
                    results.append("")
                    continue
                res = translator.translate(t)
                results.append(res)
                time.sleep(0.1)
            except Exception as e2:
                print(f"    Failed to translate specific item: {e2}")
                results.append("") # Failed
        return results

def process_file(file_path):
    directory = os.path.dirname(file_path)
    filename = os.path.basename(file_path)
    # Target name: bukhari_ahmedbaset.json -> bukhari_ahmedbaset_fr.json
    target_filename = filename.replace('.json', '_fr.json')
    if '_fr.json' not in target_filename: # safely ensure suffix
         target_filename = filename.replace('.json', '_fr.json')
         
    target_path = os.path.join(directory, target_filename)

    print(f"Processing {filename} -> {target_filename}")

    # Load Source
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Load Target (if exists, to resume) or create from source
    if os.path.exists(target_path):
        print("  Resuming from existing target file...")
        with open(target_path, 'r', encoding='utf-8') as f:
            target_data = json.load(f)
    else:
        print("  Creating new target file...")
        target_data = data.copy() # Shallow copy top level
        # Deep copy hadiths because we will modify them
        # Actually standard python dict copy is shallow. We need to be careful.
        # Simplest: Just use data as base and we will save to new path.
        # But we want to modify 'hadiths' list.
        # Let's just use 'data' and save it to 'target_path' at the end/checkpoints.
        target_data = json.loads(json.dumps(data)) # Deep copy via JSON
    
    hadiths = target_data.get('hadiths', [])
    total = len(hadiths)
    
    # Translators
    translator_en = GoogleTranslator(source='en', target='fr')
    translator_ar = GoogleTranslator(source='ar', target='fr')

    updated_count = 0
    batch_indices = []
    batch_texts = []
    batch_source_lang = None # 'en' or 'ar' request for current batch

    for i, hadith in enumerate(hadiths):
        # Check if already translated
        french_entry = hadith.get('french')
        french_text = ""
        if french_entry and isinstance(french_entry, dict):
            french_text = french_entry.get('text', "")
        
        if french_text and french_text.strip():
            continue # Already done
        
        # Determine Source
        english_entry = hadith.get('english', {})
        english_text = english_entry.get('text', "") if english_entry else ""
        
        arabic_text = hadith.get('arabic', "")
        
        source_text = ""
        is_english = False
        
        if english_text and english_text.strip():
            source_text = english_text
            is_english = True
        elif arabic_text and arabic_text.strip():
            print(f"  [#{hadith.get('idInBook')}] No English. Using Arabic fallback.")
            source_text = arabic_text
            is_english = False
        else:
            # No text to translate
            continue

        # Logic for Batching
        # We can only batch if source lang is same. 
        # Since 99% is English, we'll flush batch if we hit an Arabic one.
        
        current_lang = 'en' if is_english else 'ar'
        
        if batch_source_lang and batch_source_lang != current_lang:
            # Flush existing batch because language changed
            _flush_batch(batch_indices, batch_texts, batch_source_lang, hadiths, translator_en, translator_ar)
            batch_indices = []
            batch_texts = []
        
        batch_source_lang = current_lang
        
        # Handle really long texts immediately (don't batch)
        if len(source_text) > 4500:
            print(f"  [#{hadith.get('idInBook')}] Long text ({len(source_text)}), translating chunks...")
            chunks = split_text(source_text)
            trans_chunks = []
            active_translator = translator_en if is_english else translator_ar
            for chunk in chunks:
                try:
                    res = active_translator.translate(chunk)
                    trans_chunks.append(res)
                    time.sleep(0.5)
                except Exception as e:
                    print(f"Error translating chunk: {e}")
                    trans_chunks.append(chunk) # Fallback to original
            
            _update_hadith(hadith, " ".join(trans_chunks))
            updated_count += 1
        else:
            batch_indices.append(i)
            batch_texts.append(source_text)

        # Flush Batch if full
        if len(batch_indices) >= BATCH_SIZE:
             success = _flush_batch(batch_indices, batch_texts, batch_source_lang, hadiths, translator_en, translator_ar)
             updated_count += len(batch_indices) # This might be slightly inaccurate if failures, but okay for progress
             batch_indices = []
             batch_texts = []
             
             # Save Checkpoint
             print(f"  Progress: {i+1}/{total} | Updated: {updated_count}")
             _save_file(target_data, target_path)
             time.sleep(SLEEP_TIME)

    # Final Flush
    if batch_indices:
        _flush_batch(batch_indices, batch_texts, batch_source_lang, hadiths, translator_en, translator_ar)
        updated_count += len(batch_indices)
        
    print(f"  Complete. Total Updated: {updated_count}")
    _save_file(target_data, target_path)

def _flush_batch(indices, texts, lang, all_hadiths, trans_en, trans_ar):
    if not indices: return
    
    translator = trans_en if lang == 'en' else trans_ar
    results = translate_batch(texts, lang, translator)
    
    if len(results) != len(indices):
        print(f"  Warning: Batch result size mismatch {len(results)} vs {len(indices)}")
        # If mismatch, don't update to avoid misalignment
        return

    for idx, translated_text in zip(indices, results):
        if translated_text:
            _update_hadith(all_hadiths[idx], translated_text)

def _update_hadith(hadith_obj, text):
    if 'french' not in hadith_obj or not isinstance(hadith_obj['french'], dict):
        hadith_obj['french'] = {}
    hadith_obj['french']['text'] = text

def _save_file(data, path):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Translate Hadith JSON files.')
    parser.add_argument('files', metavar='F', type=str, nargs='+',
                        help='list of files to process')

    args = parser.parse_args()

    for f in args.files:
        if os.path.exists(f):
            process_file(f)
        else:
            print(f"File not found: {f}")
