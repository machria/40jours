
import urllib.request
import os

files_to_download = {
    "eng-muslim.json": "https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/editions/eng-muslim.json",
    "eng-nasai.json": "https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/editions/eng-nasai.json"
}

dest_dir = r'c:\Users\majid\Documents\islam\data\hadith'

for filename, url in files_to_download.items():
    dest_path = os.path.join(dest_dir, filename)
    print(f"Downloading {filename} from {url}...")
    try:
        with urllib.request.urlopen(url) as response:
            data = response.read()
            with open(dest_path, 'wb') as f:
                f.write(data)
        print(f"Saved to {dest_path} ({len(data)} bytes)")
    except Exception as e:
        print(f"Failed to download {filename}: {e}")
