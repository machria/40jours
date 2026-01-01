import os

FILE_PATH = r"c:\Users\majid\Documents\islam\data\hadith\fra-tirmidhi.json"
TEMP_PATH = r"c:\Users\majid\Documents\islam\data\hadith\fra-tirmidhi.tmp"

def fix_quotes():
    print(f"Scanning {FILE_PATH} for unescaped quotes...")
    corrections = 0
    with open(FILE_PATH, 'r', encoding='utf-8') as infile, \
         open(TEMP_PATH, 'w', encoding='utf-8') as outfile:
        
        for line in infile:
            stripped = line.strip()
            if stripped.startswith('"arabic": "'):
                # Identify content bounds
                start_marker = '"arabic": "'
                start_idx = line.find(start_marker) + len(start_marker)
                
                # Find end quote
                # Assuming the line ends with `",` or `"` plus newline/whitespace
                # We interpret from the right.
                r_quote_idx = line.rfind('"')
                
                if r_quote_idx > start_idx:
                    content = line[start_idx:r_quote_idx]
                    
                    new_content_chars = []
                    backslash_count = 0
                    modified = False
                    
                    for char in content:
                        if char == '\\':
                            backslash_count += 1
                            new_content_chars.append(char)
                        elif char == '"':
                            # Check if escaped
                            if backslash_count % 2 == 0:
                                # Even backslashes (0, 2...) -> Unescaped quote!
                                # Escape it.
                                new_content_chars.append('\\')
                                new_content_chars.append('"')
                                modified = True
                            else:
                                # Odd backslashes -> Already escaped.
                                new_content_chars.append('"')
                            backslash_count = 0
                        else:
                            backslash_count = 0
                            new_content_chars.append(char)
                            
                    if modified:
                        corrections += 1
                        fixed_content = "".join(new_content_chars)
                        # Reconstruct line
                        new_line = line[:start_idx] + fixed_content + line[r_quote_idx:]
                        outfile.write(new_line)
                    else:
                        outfile.write(line)
                else:
                    outfile.write(line)
            else:
                outfile.write(line)
                
    print(f"Pass complete. Corrected {corrections} lines.")
    
    infile.close()
    outfile.close()
    
    if corrections > 0:
        # Backup original
        bak_path = FILE_PATH + ".bak_auto"
        if os.path.exists(bak_path):
            os.remove(bak_path)
        os.rename(FILE_PATH, bak_path)
        os.rename(TEMP_PATH, FILE_PATH)
        print("File updated.")
    else:
        print("No corrections needed.")
        if os.path.exists(TEMP_PATH):
            os.remove(TEMP_PATH)

if __name__ == "__main__":
    fix_quotes()
