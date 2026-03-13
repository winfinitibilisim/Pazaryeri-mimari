import re

with open('src/pages/products/CreateProductPage.tsx', 'r') as f:
    content = f.read()

# Define the category mapping logic
mapping_code = """
    const categoryToClassesMap: Record<string, string[]> = {
        'Giyim': ['Tişört Şablonu', 'Pantolon Şablonu', 'Ceket Şablonu'],
        'Elektronik - Bilgisayar': ['Bilgisayar Şablonu', 'Telefon Şablonu', 'Tablet Şablonu'],
        'Ayakkabı': ['Ayakkabı Şablonu', 'Bot Şablonu', 'Terlik Şablonu'],
        'Spor & Outdoor': ['Spor Ekipmanı Şablonu', 'Kamp Şablonu']
    };

    // Calculate available classes based on selected category, fallback to all if no category selected
    const availableClasses = category ? (categoryToClassesMap[category] || []) : classes;
"""

# Insert mapping code after the classes array
classes_array = "    const classes = ['Tişört Şablonu', 'Bilgisayar Şablonu', 'Ayakkabı Şablonu'];"
if classes_array in content and "categoryToClassesMap:" not in content:
    content = content.replace(classes_array, classes_array + "\n" + mapping_code)

# Now find the Select dropdown for Ürün Sınıfı (Şablon) in the Özellikler tab
# We need to change {classes.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
# to {availableClasses.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}

old_select_mapping = "{classes.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}"
new_select_mapping = "{availableClasses.length > 0 ? availableClasses.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>) : <MenuItem disabled>Kategoriye uygun şablon bulunamadı</MenuItem>}"

content = content.replace(old_select_mapping, new_select_mapping)

with open('src/pages/products/CreateProductPage.tsx', 'w') as f:
    f.write(content)

print("Applied category-based class filtering")
