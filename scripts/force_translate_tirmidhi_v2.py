
import json
import time
import os
from deep_translator import GoogleTranslator

# Config
SOURCE_FILE = 'data/hadith/eng-tirmidhi.json'
TARGET_FILE = 'data/hadith/fra-tirmidhi.json'
CHECKPOINT_FILE = 'data/hadith/fra-tirmidhi-checkpoint.json'
BATCH_SIZE = 50

def split_text(text, max_length=4500):
    """Splits text into chunks respecting sentence boundaries."""
    if len(text) <= max_length:
        return [text]
    
    chunks = []
    current_chunk = ""
    
    # Split by common sentence endings to avoid breaking mid-sentence
    sentences = text.replace('. ', '.|').replace('? ', '?|').replace('! ', '!|').split('|')
    
    for sentence in sentences:
        if len(current_chunk) + len(sentence) < max_length:
            current_chunk += sentence + " "
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
            current_chunk = sentence + " "
            
            # If a single sentence is still too long (unlikely but possible), force split
            if len(current_chunk) > max_length:
                while len(current_chunk) > max_length:
                    chunks.append(current_chunk[:max_length])
                    current_chunk = current_chunk[max_length:]
    
    if current_chunk:
        chunks.append(current_chunk.strip())
        
    return chunks

def is_english(text):
    """Detects if text is English based on stopword frequency."""
    if not text: return True
    
    keywords_en = {"the", "and", "of", "to", "in", "that", "is", "he", "was", "with", "narrated", "messenger", "allah"}
    keywords_fr = {"le", "la", "les", "de", "dul", "des", "et", "à", "dans", "que", "il", "est", "avec", "rapporté", "messager", "dieu"}
    
    words = text.lower().replace('.', '').replace(',', '').split()
    count_en = sum(1 for w in words if w in keywords_en)
    count_fr = sum(1 for w in words if w in keywords_fr)
    
    # If significantly more English words than French, or very low French count in long text
    if count_en > count_fr:
        # If we have mainly English words, it's English
        return True
    
    if count_en > 2 and count_fr == 0:
        return True
    
    # Special case: very short text, look for specific English markers only
    if len(words) < 10:
        if "narrated" in words or "reported" in words: return True
        
    return False

def translate_text(text, translator):
    if not text:
        return ""
        
    chunks = split_text(text)
    translated_chunks = []
    
    for i, chunk in enumerate(chunks):
        try:
            # Small delay to respect API
            time.sleep(0.5)
            res = translator.translate(chunk)
            translated_chunks.append(res)
        except Exception as e:
            print(f"    Error translating chunk {i+1}/{len(chunks)}: {e}")
            # Fallback: keep original if translation fails, but try others
            translated_chunks.append(chunk) 
            
    return " ".join(translated_chunks)

def main():
    print("Loading datasets...")
    with open(SOURCE_FILE, 'r', encoding='utf-8') as f:
        source_data = json.load(f)
        
    if os.path.exists(TARGET_FILE):
        with open(TARGET_FILE, 'r', encoding='utf-8') as f:
            target_data = json.load(f)
    else:
        target_data = source_data # Start with copy if no target
    
    # Create map for fast lookup of English source
    source_map = {h['hadithnumber']: h['text'] for h in source_data['hadiths']}
    
    translator = GoogleTranslator(source='en', target='fr')
    
    updated_count = 0
    processed_count = 0
    total = len(target_data['hadiths'])
    
    print(f"Scanning {total} hadiths...")

    # Forced range for Chapter 44
    forced_range = range(2859, 2875) 
    
    for i, hadith in enumerate(target_data['hadiths']):
        h_id = hadith['hadithnumber']
        current_text = hadith['text']
        
        # Check if needs translation
        # Force translate Chapter 44 OR if detected as English
        is_forced = h_id in forced_range
        is_en = is_english(current_text)
        
        if not current_text or is_en or is_forced:
            english_source = source_map.get(h_id)
            
            if english_source:
                reason = "Force-Chapter-44" if is_forced else "English-Detected"
                if not current_text: reason = "Empty"
                
                print(f"[{i+1}/{total}] Translating Hadith #{h_id} ({reason})...")
                new_text = translate_text(english_source, translator)
                
                if new_text and new_text != english_source:
                    hadith['text'] = new_text
                    updated_count += 1
                else:
                    print(f"    Warning: Translation failed or text identicial for #{h_id}")
            else:
                print(f"    Warning: No English source found for #{h_id}")
        
        processed_count += 1
        
        # Periodic Save
        if updated_count > 0 and updated_count % BATCH_SIZE == 0:
            print(f"Saving progress... ({updated_count} updated so far)")
            with open(TARGET_FILE, 'w', encoding='utf-8') as f:
                json.dump(target_data, f, ensure_ascii=False, indent=4)
    
    # Final Save
    if updated_count > 0:
        print(f"Final save. Total updated: {updated_count}")
        with open(TARGET_FILE, 'w', encoding='utf-8') as f:
            json.dump(target_data, f, ensure_ascii=False, indent=4)
    else:
        print("No hadiths needed updating. Everything seems to be in French.")

if __name__ == "__main__":
    main()
