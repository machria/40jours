
import json
import re

file_path = r'c:\Users\majid\Documents\islam\translated_11.json'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace literal newlines/tabs inside strings? 
# Only if they are inside quote?
# Actually, JSON standard doesn't allow literal newlines.
# We can replace all control characters (0x00-0x1F) except maybe newline if it's formatting?
# But if it's "Invalid control character", it's likely inside a string.
# A simple regex replacer might strictify it.

def escape_control_chars(match):
    return match.group(0).encode('unicode_escape').decode('utf-8')

# Naive fix: re-encode? 
# If I use `json.loads(content, strict=False)` it might work? 
# Standard `json` library is strict.
# Let's try to just find the char and print it to know what it is.

print(f"Content length: {len(content)}")

# The error was at char 25975.
if len(content) > 25975:
    bad_char = content[25975]
    print(f"Char at 25975: {repr(bad_char)}")
    context = content[25975-20:25975+20]
    print(f"Context: {repr(context)}")

# Try to clean
cleaned_content = ""
for i, char in enumerate(content):
    if ord(char) < 32:
        if char == '\n' or char == '\r':
            # Keep newlines if they are format newlines (e.g. between fields)
            # But if they are inside a string... 
            # It's hard to tell without parsing.
            pass
        elif char == '\t':
             pass
        else:
             print(f"Found weird char at {i}: {ord(char)}")
             
# Better approach: simplistic scrub of non-printable chars inside quotes? 
# Or just use `eval` if trusted? No.

# Regex to find control characters explicitly?
# pattern: [\x00-\x1f]
# We typically want to keep \n, \r, \t if they are part of layout.
# But `json.load` failed.

# Let's try to replace all literal newlines with space, EXCEPT those that look like structural?
# Structure: `    "` or `": "` or `},` or `[` or `]`.
# If deep inside a long string, it shouldn't have newlines.

# Let's try to just read 25975-ish area.
