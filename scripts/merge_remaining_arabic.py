import json
import os
import urllib.request
import time

def download_json(url):
    print(f"Downloading from {url}...")
    try:
        with urllib.request.urlopen(url) as response:
            return json.loads(response.read().decode('utf-8'))
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return None

def merge_arabic_text(local_file_path, arabic_url):
    print(f"Processing {os.path.basename(local_file_path)}...")
    
    if not os.path.exists(local_file_path):
        print(f"Error: File {local_file_path} not found.")
        return

    # Load local French data
    try:
        with open(local_file_path, 'r', encoding='utf-8') as f:
            local_data = json.load(f)
    except Exception as e:
        print(f"Error reading local file: {e}")
        return

    # Download Arabic data
    arabic_data = download_json(arabic_url)
    if not arabic_data:
        return

    # Create a map of Arabic hadiths by hadithnumber
    arabic_map = {}
    if 'hadiths' in arabic_data:
        for h in arabic_data['hadiths']:
            h_num = h.get('hadithnumber')
            if h_num is not None:
                arabic_map[h_num] = h.get('text', '')
    else:
         print(f"Warning: 'hadiths' key not found in Arabic data for {arabic_url}")
         return

    updated_count = 0
    
    # Update local data
    for hadith in local_data['hadiths']:
        h_num = hadith.get('hadithnumber')
        if h_num in arabic_map:
            hadith['arabic'] = arabic_map[h_num]
            updated_count += 1
    
    # Save updated file
    try:
        with open(local_file_path, 'w', encoding='utf-8') as f:
            json.dump(local_data, f, ensure_ascii=False, indent=4)
        print(f"Success! Updated {updated_count} hadiths in {os.path.basename(local_file_path)}")
    except Exception as e:
        print(f"Error saving file: {e}")

def main():
    base_path = r"c:\Users\majid\Documents\islam\data\hadith"
    
    tasks = [
        {
            "file": "fra-nasai.json",
            "url": "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-nasai.json"
        },
        {
            "file": "fra-abudawud.json",
            "url": "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-abudawud.json"
        },
        {
            "file": "fra-tirmidhi.json",
            "url": "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-tirmidhi.json"
        },
         {
            "file": "fra-ibnmajah.json",
            "url": "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-ibnmajah.json"
        },
        {
            "file": "fra-malik.json",
            "url": "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-malik.json"
        }
    ]

    for task in tasks:
        file_path = os.path.join(base_path, task["file"])
        merge_arabic_text(file_path, task["url"])
        print("-" * 30)

if __name__ == "__main__":
    main()
