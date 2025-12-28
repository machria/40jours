
import json

def check_chapter_44():
    path = 'data/hadith/fra-tirmidhi.json'
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    start = 2859
    end = 2874
    
    print(f"Checking Chapter 44 (Hadiths {start}-{end})...")
    
    for h in data['hadiths']:
        if start <= h['hadithnumber'] <= end:
            print(f"#{h['hadithnumber']}: {h['text'][:100]}...")

if __name__ == "__main__":
    check_chapter_44()
