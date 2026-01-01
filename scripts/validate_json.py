import json
import sys

FILE_PATH = r"c:\Users\majid\Documents\islam\data\hadith\fra-tirmidhi.json"
LOG_PATH = r"c:\Users\majid\Documents\islam\validation_log.txt"

try:
    with open(FILE_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
        print(f"File size: {len(content)} bytes")
        json.loads(content)
        print("JSON is valid.")
        
except json.JSONDecodeError as e:
    print(f"JSON Error: {e}")
    with open(LOG_PATH, 'w', encoding='utf-8') as log:
        log.write(f"JSON Error: {e}\n")
        lines = content.splitlines()
        err_line = e.lineno - 1
        start = max(0, err_line - 2)
        end = min(len(lines), err_line + 3)
        log.write("\nContext:\n")
        for i in range(start, end):
            prefix = ">> " if i == err_line else "   "
            log.write(f"{prefix}{i+1}: {lines[i]}\n")
            
except Exception as e:
    print(f"Error: {e}")
