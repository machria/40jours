
import json
import sys

input_path = r'c:\Users\majid\Documents\islam\missing_hadiths.json'
output_path = r'c:\Users\majid\Documents\islam\batch_temp.json'
start_idx = int(sys.argv[1])
end_idx = int(sys.argv[2])

with open(input_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

batch = data[start_idx:end_idx]
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(batch, f, indent=2, ensure_ascii=False)

print(f"Written {len(batch)} items to {output_path}")
