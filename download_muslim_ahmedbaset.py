
import urllib.request
import os

url = "https://raw.githubusercontent.com/AhmedBaset/hadith-json/master/db/by_book/the_9_books/muslim.json"
dest_path = r'c:\Users\majid\Documents\islam\data\hadith\muslim_ahmedbaset.json'

print(f"Downloading Muslim from {url}...")
try:
    with urllib.request.urlopen(url) as response:
        data = response.read()
        with open(dest_path, 'wb') as f:
            f.write(data)
    print(f"Saved to {dest_path} ({len(data)} bytes)")
except Exception as e:
    print(f"Failed to download: {e}")
