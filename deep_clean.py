import re

with open('src/pages/products/CreateProductPage.tsx', 'r') as f:
    content = f.read()

# I want to find the real start of the final return block.
# "    return (\n        <Box sx={{ width: '100%', pb: 5 }}>"
# Let's define the parts.
# 1. Everything up to "    const renderTabContent = () => {"
render_start_idx = content.find("    const renderTabContent = () => {")

# 2. Inside renderTabContent, we should only have standard cases. No gamification stuff, no full page structure.
# But since case 1 was polluted, I will manually extract the clean versions of cases!
# I can use regex to find the cases in the ORIGINAL content before my gamification messed them up? No, I don't have the original.
# Let's extract the cases by finding "            case 0: // Genel" up to the next case.
def extract_case(case_num, title):
    start_str = f"            case {case_num}: // {title}"
    start_idx = content.find(start_str)
    if start_idx == -1: return ""
    
    # find next case or default
    end_idx = len(content)
    for next_str in ["            case ", "            default:"]:
        idx = content.find(next_str, start_idx + 10)
        if idx != -1 and idx < end_idx:
            end_idx = idx
            
    # Now, check if this chunk is polluted!
    chunk = content[start_idx:end_idx]
    if "Calculate overall progress" in chunk or "export default" in chunk:
        # Heavily polluted! We must cut it early.
        # Find the last valid closing tag for this tab.
        # Fot case 1 (Fotoğraf), it should end with `</Paper>\n                );\n`
        end_return_idx = chunk.find("                );\n")
        if end_return_idx != -1:
            chunk = chunk[:end_return_idx + 19]
    return chunk

case0 = extract_case(0, "Genel")
case1 = extract_case(1, "Fotoğraf")
case5 = extract_case(5, "Özellikler")
case6 = extract_case(6, "Ürün Seçenekleri")

# What about the default case and the end of the function?
default_case = """            default:
                return (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h5" color="text.secondary" gutterBottom>
                            {tabs[activeTab].label} Konfigürasyonu
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Bu bölüm henüz doldurulmamıştır.
                        </Typography>
                    </Box>
                );
        }
    };
"""

# Now the final part: The Gamification progress calculation and the REAL main return.
# We know it starts with `// Calculate overall progress` and ends with `export default CreateProductPage;`
# But there might be multiple. We take the LAST one!
calc_blocks = content.split("    // Calculate overall progress")
last_part = "    // Calculate overall progress" + calc_blocks[-1]
# Ensure it has export default
if "export default" not in last_part:
    print("WARNING: export default not found in last part!")

# Reconstruct the file!
final_content = content[:render_start_idx + len("    const renderTabContent = () => {\n        switch (activeTab) {\n")]
final_content += case0 + case1 + case5 + case6 + default_case + "\n" + last_part

with open('src/pages/products/CreateProductPage.tsx', 'w') as f:
    f.write(final_content)

print("Cleaned up CreateProductPage.tsx!")
