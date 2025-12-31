import json
import os
import glob

# Path to the directory containing the JSON files
BASE_DIR = r"C:\Users\majid\Documents\islam\scripts\temp_hadith_analysis\db\by_book\the_9_books"

def analyze_file(filepath):
    """
    Analyzes a single hadith JSON file.
    Returns (filename, total_hadiths, english_hadiths)
    """
    filename = os.path.basename(filepath)
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        hadiths = data.get('hadiths', [])
        total = len(hadiths)
        
        english_count = 0
        for h in hadiths:
            english = h.get('english')
            if english:
                # Check based on inspection: english is an object with 'text'
                # Sometimes it might be just a string in other formats? 
                # Based on bukhari.json, it is a dict.
                if isinstance(english, dict):
                     text = english.get('text', '')
                     if text and text.strip():
                         english_count += 1
                elif isinstance(english, str):
                    if english.strip():
                        english_count += 1
        
        return (filename, total, english_count)

    except Exception as e:
        print(f"Error processing {filename}: {e}")
        return (filename, 0, 0)

def main():
    files = glob.glob(os.path.join(BASE_DIR, "*.json"))
    files.sort()
    
    results = []
    print(f"{'Book':<15} | {'Total':<10} | {'English':<10} | {'% Translated':<10}")
    print("-" * 55)
    
    for f in files:
        name, total, english = analyze_file(f)
        percent = (english / total * 100) if total > 0 else 0
        print(f"{name:<15} | {total:<10} | {english:<10} | {percent:.1f}%")
        results.append((name, total, english))

if __name__ == "__main__":
    main()
