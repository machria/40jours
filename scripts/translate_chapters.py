import json
import os
import sys
from concurrent.futures import ThreadPoolExecutor
from deep_translator import GoogleTranslator

# Files to process
FILES = [
    "data/hadith/bukhari_ahmedbaset_fr.json",
    "data/hadith/abudawud_ahmedbaset_fr.json",
    "data/hadith/nasai_ahmedbaset_fr.json",
    "data/hadith/ibnmajah_ahmedbaset_fr.json",
    "data/hadith/malik_ahmedbaset_fr.json",
    "data/hadith/tirmidhi_ahmedbaset_fr.json",
    # Muslim is already done, but we can include it to fill any gaps or recheck
    "data/hadith/muslim_ahmedbaset_fr.json" 
]

def translate_text(text):
    if not text: return ""
    try:
        translated = GoogleTranslator(source='en', target='fr').translate(text)
        return translated
    except Exception as e:
        print(f"Error translating '{text}': {e}")
        return text

def process_file(file_path):
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    print(f"Processing {file_path}...")
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    chapters = data.get('chapters', [])
    updated_count = 0
    
    # Collect texts to translate (that are missing french)
    # Actually, we should just iterate and translate if 'french' is missing or we want to overwrite?
    # User said "add french chapters", implies they are missing.
    # Muslim has them, so we skip if present? 
    # Let's check if 'french' key exists.
    
    for chapter in chapters:
        # If 'french' key missing or empty, translate 'english'
        if 'french' not in chapter or not chapter['french']:
            english_title = chapter.get('english', '')
            if english_title:
                trans = translate_text(english_title)
                chapter['french'] = trans
                updated_count += 1
                print(f"Translated: {english_title} -> {trans}")
    
    if updated_count > 0:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Updated {file_path} with {updated_count} translated chapters.")
    else:
        print(f"No new translations for {file_path}.")

def main():
    # Process files sequentially or parallel?
    # Translator might rate limit if too fast. Sequential is safer for reliability.
    for file_path in FILES:
        process_file(file_path)

if __name__ == "__main__":
    main()
