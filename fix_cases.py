import re

with open('src/pages/products/CreateProductPage.tsx', 'r') as f:
    lines = f.readlines()

def find_block(start_marker, end_marker=None):
    start = -1
    for i, line in enumerate(lines):
        if start_marker in line:
            start = i
            break
    if start == -1: return None
    
    end = -1
    if end_marker:
        for i in range(start, len(lines)):
            if end_marker in lines[i]:
                end = i
                break
    else:
        # Find next case or default
        brace_count = 0
        started = False
        for i in range(start, len(lines)):
            if '{' in lines[i]: brace_count += lines[i].count('{')
            if '}' in lines[i]: brace_count -= lines[i].count('}')
            if not started and ('return (' in lines[i] or 'return(' in lines[i]):
                started = True
                brace_count = 1
            if started and brace_count == 0 and ');' in lines[i]:
                end = i
                break
            if i > start and ('case ' in lines[i] or 'default:' in lines[i]) and brace_count <= 0:
                end = i - 1
                break
    
    return "".join(lines[start:end+1]) if end != -1 else None

# Getting best blocks manually since they might be duplicated
content = "".join(lines)

# Split by case to see the chunks
case_chunks = re.split(r'(\s+case \d+:.+)', content)
# case_chunks will be: [text_before, "case 0:...", chunk0, "case 1:...", chunk1, ...]

new_cases = {}
for i in range(1, len(case_chunks), 2):
    header = case_chunks[i]
    body = case_chunks[i+1]
    
    # Identify which block this is based on its comment or content
    if 'Genel' in header:
        new_cases[0] = body
    elif 'Fotoğraf' in header:
        # keep the LAST one found (newer)
        new_cases[1] = body
    elif 'Özellikler' in header:
        new_cases[5] = body
    elif 'Ürün Seçenekleri' in header:
        new_cases[6] = body

# Now construct the final switch
switch_start = content.find('switch (activeTab) {')
if switch_start == -1: switch_start = content.find('switch(activeTab)')
switch_end = content.find('default:', switch_start)

text_before = content[:switch_start]
default_and_after = content[switch_end:]

final_switch = "        switch (activeTab) {\n"
for idx in sorted(new_cases.keys()):
    if idx == 0: title = "Genel"
    elif idx == 1: title = "Fotoğraf"
    elif idx == 5: title = "Özellikler"
    elif idx == 6: title = "Ürün Seçenekleri"
    
    final_switch += f"            case {idx}: // {title}\n"
    final_switch += new_cases[idx]

final_switch += "            "

with open('src/pages/products/CreateProductPage.tsx', 'w') as f:
    f.write(text_before + final_switch + default_and_after)

print("Fixed duplicate cases and mapped them to correct indexes!")
