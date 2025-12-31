import json
import os
import urllib.request
import time

def download_json(url):
    print(f"Downloading from {url}...")
    with urllib.request.urlopen(url) as response:
        return json.loads(response.read().decode('utf-8'))

def merge_arabic_text(local_file_path, arabic_url):
    print(f"Processing {local_file_path}...")
    
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
    try:
        arabic_data = download_json(arabic_url)
    except Exception as e:
        print(f"Error downloading Arabic data: {e}")
        return

    # Create a map of Arabic hadiths by hadithnumber
    # Some hadiths might have duplicates or slight variations, using hadithnumber is standard for this API
    arabic_map = {}
    for h in arabic_data['hadiths']:
        # Ensure hadithnumber is treated consistently (as string or int) depending on source
        # Usually checking both matches helps, but let's stick to the raw value key
        h_num = h.get('hadithnumber')
        if h_num is not None:
            arabic_map[h_num] = h.get('text', '')

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
        print(f"Success! Updated {updated_count} hadiths in {local_file_path}")
    except Exception as e:
        print(f"Error saving file: {e}")

def main():
    base_path = r"c:\Users\majid\Documents\islam\data\hadith"
    
    tasks = [
        {
            "file": "fra-bukhari.json",
            "url": "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-bukhari.json"
        },
        {
            "file": "fra-muslim.json",
            "url": "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-muslim.json"
        }
    ]

    for task in tasks:
        file_path = os.path.join(base_path, task["file"])
        merge_arabic_text(file_path, task["url"])
        print("-" * 30)

if __name__ == "__main__":
    main()
