
import json

fra_path = r'c:\Users\majid\Documents\islam\data\hadith\fra-malik.json'

with open(fra_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

count_int = 0
count_str = 0
count_float = 0
examples = []

target_nums = [1559, 1551, 1524]

for h in data['hadiths']:
    hn = h.get('hadithnumber')
    if isinstance(hn, int):
        count_int += 1
    elif isinstance(hn, float):
        count_float += 1
    elif isinstance(hn, str):
        count_str += 1
    
    # fuzzy match for targets
    if str(hn) in [str(x) for x in target_nums]:
        print(f"Found {hn} (Type: {type(hn)})")

print(f"Ints: {count_int}, Floats: {count_float}, Strings: {count_str}")
