import re

with open('src/pages/products/CreateProductPage.tsx', 'r') as f:
    content = f.read()

# 1. Replace the header with the Info Box
old_header = '<Typography variant="h6" color="primary" sx={{ mb: 3 }}>Bilgisayar Özellikleri</Typography>'
new_header = """<Box sx={{ bgcolor: '#F0F4FF', p: 2.5, borderRadius: 2, display: 'flex', alignItems: 'flex-start', gap: 2, mb: 4 }}>
                                                <InfoIcon color="primary" sx={{ fontSize: 28 }} />
                                                <Box>
                                                    <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ mb: 0.5 }}>Ürün özellikleri</Typography>
                                                    <Typography variant="body2" color="text.secondary">Ürün özelliklerini eksiksiz ve doğru bir şekilde doldurmanız ürünlerinizin müşteriler tarafından daha kolay bulunmasını ve satışlarınızın artmasını sağlayacaktır. Ürün özellikleri Hepsiburada'da ürün sayfasında görüntülenir.</Typography>
                                                </Box>
                                            </Box>"""

if old_header in content:
    content = content.replace(old_header, new_header)

# 2. Update TextField styling inside the Bilgisayar Şablonu grid to have grey background and no borders initially
# We need to replace `variant="outlined"` with `variant="outlined" InputProps={{ ...params.InputProps, sx: { bgcolor: '#f4f5f7', borderRadius: 1.5, '& fieldset': { borderColor: 'transparent' }, '&:hover fieldset': { borderColor: 'transparent' } } }}`
# However, params.InputProps is already spread in {...params}. Wait, if we pass InputProps it merges or overrides.
# Actually, the easiest way is to put `sx` on `TextField` itself targeting the root and fieldset:

styled_variant = """variant="outlined" sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#f4f5f7', borderRadius: 1.5, '& fieldset': { borderColor: 'transparent' }, '&:hover fieldset': { borderColor: '#e0e0e0' } } }} InputLabelProps={{ shrink: true }}"""

# To only apply this to the computer features (lines added in the previous step), we can isolate that block:
block_start_idx = content.find("Ürün özellikleri</Typography>")
if block_start_idx != -1:
    block_end_idx = content.find("{productClass === 'Ayakkabı Şablonu' && (", block_start_idx)
    if block_end_idx != -1:
        block = content[block_start_idx:block_end_idx]
        
        # Replace variant="outlined" but make sure to also adjust labels to match the user's design which has labels above the input (shrink=true with empty label placeholder? No, the user image shows label floating outside or shrinked).
        # To make label appear outside/shrinked like the image, InputLabelProps={{ shrink: true }} shrinks it.
        
        # Let's replace variant="outlined" label=... placeholder="Seçin"
        # Since I used variant="outlined" everywhere in that block:
        block = block.replace('variant="outlined"', styled_variant)
        
        content = content[:block_start_idx] + block + content[block_end_idx:]

with open('src/pages/products/CreateProductPage.tsx', 'w') as f:
    f.write(content)

print("Update complete")
