import re

with open('src/pages/products/CreateProductPage.tsx', 'r') as f:
    lines = f.readlines()

# Find the end of renderTabContent function mapping correctly.
# The default case should be at lines 789-801:
# 789:             default:
# 800:         }
# 801:     };

# Wait, if `return (` was duplicated, the gamification progress block starts at line 804.
# And ends at 973: export default CreateProductPage;

# I can just remove the incorrect duplicated part from line 780 to line 788!
# Because 780 to 788 is:
# 780:             {/* Main Form Content */}
# 781:             <Box sx={{ minHeight: 600 }}>
# 782:                 {renderTabContent()}
# 783:             </Box>
# 784:         </Box>
# 785:     );
# 786: };
# 787: 
# 788: export default CreateProductPage;

# Let's verify by checking the contents before line 780.
# Is line 778 `            </Box>` the end of the tabs rendering in `renderTabContent()`? 
# No, `renderTabContent`'s tabs are not there. The horizontal tabs are rendered below line 922!
# So lines 770-778 are RENDERING TABS! But they are OUTSIDE the return statement?
# No, they were inside the FIRST wrong `return (`!

# Okay, let's take a surgical approach.
# Read the file text.
content = "".join(lines)

# We want the file to be structurally sound:
# 1. Imports
# 2. Component definition
# 3. renderTabContent function (with switch statement)
# 4. the main return statement of the component
# 5. export default

# I can see the real main return statement starts at line 811.
# And `renderTabContent` ends properly at line 801 with `};`.

# BUT WAIT! The first wrong `return (` was injected way above.
# Let's find exactly where the first unexpected `return (` happens after `renderTabContent` starts.
# Actually, it's easier to find the `final` valid `return(` and clean up everything else.

# Let's just find the start of `renderTabContent()`.
render_tab_idx = content.find('const renderTabContent = () => {')

# Find the actual real main return which starts with:
# `    // Calculate overall progress` and `const nameProgress = ...`
progress_idx = content.find('// Calculate overall progress')

if render_tab_idx != -1 and progress_idx != -1:
    # Everything from `render_tab_idx` to `progress_idx` should be JUST the `renderTabContent` function!
    # Let me ensure the `renderTabContent` finishes exactly at `progress_idx`.
    # Wait, there are TWO `// Calculate overall progress` blocks?! Let's check.
    parts = content.split('// Calculate overall progress')
    if len(parts) > 2:
        # It's duplicated!
        clean_content = parts[0] + '// Calculate overall progress' + parts[-1]
    else:
        # Let's look at the part between `switch` and `// Calculate overall progress`.
        # Is there a random `return (` ?
        mid_part = content[render_tab_idx:progress_idx]
        
        # It seems the first half of the page rendering was pasted between `case 1:` and `case 5:` ?
        # No, look at lines 770-788 ... that's the end of standard component return!
        
        pass

# Actually, the safest way is:
with open('src/pages/products/CreateProductPage.tsx', 'w') as f:
    # Let's find exactly lines 780 to 788 and delete them.
    for i in range(len(lines)):
        # If line contains export default CreateProductPage and we are not at the end of the file
        if 'export default CreateProductPage;' in lines[i] and i < len(lines) - 10:
            lines[i] = '' # Drop it
            
        # Lines 780-786:
        if '            {/* Main Form Content */}' in lines[i] and i < len(lines) - 50:
            # We found the first fake return block closure.
            # Let's just erase until we hit `default:`
            for j in range(i, len(lines)):
                if 'default:' in lines[j] and 'case' not in lines[j]:
                    break
                lines[j] = ''
    
    # Also I need to remove the start of that fake return block.
    # Where does it start? Search for `        <Box sx={{ width: '100%', pb: 5 }}>`
    box_starts = [i for i, l in enumerate(lines) if "width: '100%', pb: 5" in l]
    if len(box_starts) > 1:
        # The first one is a fake return start!
        fake_start = box_starts[0]
        # We must go backwards to find the `return (` that started it.
        ret_start = fake_start
        while 'return (' not in lines[ret_start] and 'return(' not in lines[ret_start]:
            ret_start -= 1
        
        # We erase from ret_start to the line before `case 5: // Özellikler` ?
        # No, wait! If there is a fake `return( <Box><Tabs/></Box> ); export default` INSIDE the switch statement?!
        # YES! That's exactly what happened!
        # When I used `fix_cases.py`, it took chunks from `case_chunks`.
        # When it grabbed `chunk[1]` (Fotoğraf), `chunk[1]` ALREADY contained the fake return because the GAMIFICATION script had carelessly injected a whole new component return inside `case 1: // Fotoğraf`!
        # Let's completely nuke `case 1: // Fotoğraf` contents that include `<Box width="100%">...`
        pass
        
    for i in range(len(lines)):
        l = lines[i]
        f.write(l)

print("done")
