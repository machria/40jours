import json
import urllib.request

def debug_keys(url, name):
    print(f"--- Debugging {name} ---")
    try:
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read().decode('utf-8'))
            print(f"Total hadiths: {len(data['hadiths'])}")
            print("First 5 hadith numbers and types:")
            for h in data['hadiths'][:5]:
                print(f"Key: {h.get('hadithnumber')} (Type: {type(h.get('hadithnumber'))})")
    except Exception as e:
        print(f"Error: {e}")

urls = {
    "Abu Dawud": "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-abudawud.json",
    "Tirmidhi": "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-tirmidhi.json",
    "Ibn Majah": "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-ibnmajah.json"
}

for name, url in urls.items():
    debug_keys(url, name)
