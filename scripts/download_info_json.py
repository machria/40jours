import requests
import json
import os

url = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/info.json"
output_path = r"c:\Users\majid\Documents\islam\data\hadith\info.json"

try:
    print(f"Downloading {url}...")
    response = requests.get(url)
    response.raise_for_status()
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(response.text)
    
    print(f"Saved to {output_path}")
    
    # Analyze counts
    data = response.json()
    if 'muslim' in data:
        print(f"Remote Muslim Count: {data['muslim']['last_hadithnumber']}")
    if 'tirmidhi' in data:
        print(f"Remote Tirmidhi Count: {data['tirmidhi']['last_hadithnumber']}")

except Exception as e:
    print(f"Error: {e}")
