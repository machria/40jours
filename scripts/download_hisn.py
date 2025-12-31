import urllib.request
import json
import os

url = "https://raw.githubusercontent.com/wafaaelmaandy/Hisn-Muslim-Json/master/husn_en.json"
output_path = r"c:\Users\majid\Documents\islam\data\hisn\hisn_en.json"

try:
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    print(f"Downloading from {url}...")
    with urllib.request.urlopen(url) as response:
        data = response.read().decode('utf-8-sig') # Handle BOM if present
        
        # Parse to ensure validity
        json_data = json.loads(data)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(json_data, f, indent=4, ensure_ascii=False)
            
    print(f"Successfully saved to {output_path}")
    print(f"Total Categories: {len(json_data['English'])}")
    
except Exception as e:
    print(f"Error: {e}")
