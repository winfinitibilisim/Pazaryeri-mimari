import re

with open('src/pages/products/CreateProductPage.tsx', 'r') as f:
    content = f.read()

# 1. Substitute the tabs list
old_tabs = """    const tabs = [
        { label: 'Genel', icon: <StarIcon sx={{ fontSize: 18, color: '#FFD700' }} /> },
        { label: 'Fotoğraf', icon: <PhotoIcon sx={{ fontSize: 18, color: '#A9A9A9' }} /> },
        { label: 'Vergiler', icon: <TaxIcon sx={{ fontSize: 18, color: '#4682B4' }} /> },
        { label: 'Ek Tanımlamalar', icon: <TagIcon sx={{ fontSize: 18, color: '#FFE4B5' }} /> },
        { label: 'Videolar', icon: <VideoIcon sx={{ fontSize: 18, color: '#708090' }} /> },
        { label: 'Varyantlar', icon: <VariantsIcon sx={{ fontSize: 18, color: '#87CEFA' }} /> },
        { label: 'Promosyonlar', icon: <PromotionsIcon sx={{ fontSize: 18, color: '#FFA07A' }} /> },
        { label: 'Vitrine Ekle', icon: <ShowcaseIcon sx={{ fontSize: 18, color: '#ADD8E6' }} /> },
        { label: 'Benzer Ürünler', icon: <SimilarProductsIcon sx={{ fontSize: 18, color: '#C0C0C0' }} /> },
        { label: 'Ek Fiyatlar', icon: <ExtraPriceIcon sx={{ fontSize: 18, color: '#F5F5DC' }} /> },
        { label: 'Tedarikçi Bilgileri', icon: <SupplierIcon sx={{ fontSize: 18, color: '#B0C4DE' }} /> }
    ];"""

new_tabs = """    const tabs = [
        { label: 'Genel', icon: <StarIcon sx={{ fontSize: 18, color: '#FFD700' }} /> },
        { label: 'Fotoğraf', icon: <PhotoIcon sx={{ fontSize: 18, color: '#A9A9A9' }} /> },
        { label: 'Vergiler', icon: <TaxIcon sx={{ fontSize: 18, color: '#4682B4' }} /> },
        { label: 'Ek Tanımlamalar', icon: <TagIcon sx={{ fontSize: 18, color: '#FFE4B5' }} /> },
        { label: 'Videolar', icon: <VideoIcon sx={{ fontSize: 18, color: '#708090' }} /> },
        { label: 'Özellikler', icon: <FeaturesIcon sx={{ fontSize: 18, color: '#8A2BE2' }} /> },
        { label: 'Ürün Seçenekleri', icon: <OptionsIcon sx={{ fontSize: 18, color: '#FF6347' }} /> },
        { label: 'Varyantlar', icon: <VariantsIcon sx={{ fontSize: 18, color: '#87CEFA' }} /> },
        { label: 'Promosyonlar', icon: <PromotionsIcon sx={{ fontSize: 18, color: '#FFA07A' }} /> },
        { label: 'Vitrine Ekle', icon: <ShowcaseIcon sx={{ fontSize: 18, color: '#ADD8E6' }} /> },
        { label: 'Benzer Ürünler', icon: <SimilarProductsIcon sx={{ fontSize: 18, color: '#C0C0C0' }} /> },
        { label: 'Ek Fiyatlar', icon: <ExtraPriceIcon sx={{ fontSize: 18, color: '#F5F5DC' }} /> },
        { label: 'Tedarikçi Bilgileri', icon: <SupplierIcon sx={{ fontSize: 18, color: '#B0C4DE' }} /> }
    ];"""

if old_tabs in content:
    content = content.replace(old_tabs, new_tabs)
else:
    print("Warning: old_tabs not found!")
    # Just simple replace
    content = content.replace("{ label: 'Videolar', icon: <VideoIcon sx={{ fontSize: 18, color: '#708090' }} /> },", 
                              "{ label: 'Videolar', icon: <VideoIcon sx={{ fontSize: 18, color: '#708090' }} /> },\n        { label: 'Özellikler', icon: <FeaturesIcon sx={{ fontSize: 18, color: '#8A2BE2' }} /> },\n        { label: 'Ürün Seçenekleri', icon: <OptionsIcon sx={{ fontSize: 18, color: '#FF6347' }} /> },")


# 2. Extract and remove the combo block from activeTab === 0
combo_block_start = '                            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>\n                                <Typography variant="h6" sx={{ mb: 2, display: \'flex\', alignItems: \'center\', gap: 1 }}>\n                                    <OptionsIcon color="primary" /> Ürün Seçenekleri ve Özellikleri\n                                </Typography>'

combo_block_end = '                            </Paper>\n\n                            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>\n                                <Typography variant="h6" sx={{ mb: 2 }}>Fiyatlandırma ve Envanter</Typography>'

start_idx = content.find(combo_block_start)
end_idx = content.find('                            </Paper>\n', start_idx) + len('                            </Paper>\n')

if start_idx == -1:
    print("Combo block not found!")
    exit(1)

content = content[:start_idx] + content[end_idx:]

# 3. Add the cases for activeTab === 5 (Özellikler) and 6 (Ürün Seçenekleri)
# The current switch cases probably look like:
#             case 1:
#                 return ( ... )

new_cases_block = """
            case 5: // Özellikler
                return (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FeaturesIcon color="primary" /> Ürün Özellikleri
                        </Typography>
                        <Paper sx={{ p: 3, borderRadius: 2 }}>
                            <Grid container spacing={4}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Ürün Sınıfı (Şablon)</InputLabel>
                                        <Select value={productClass} label="Ürün Sınıfı (Şablon)" onChange={(e) => setProductClass(e.target.value)}>
                                            <MenuItem value=""><em>Seçiniz</em></MenuItem>
                                            {classes.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                                        </Select>
                                    </FormControl>

                                    {productClass === 'Tişört Şablonu' && (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2, pl: 2, borderLeft: '3px solid #e0e0e0' }}>
                                            <Typography variant="body2" color="text.secondary">Tişört Özellikleri:</Typography>
                                            <Autocomplete
                                                multiple
                                                options={['Tümünü Seç', ...availableFabrics]}
                                                value={selectedFabric}
                                                onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedFabric(availableFabrics) : setSelectedFabric(newValue)}
                                                renderInput={(params) => <TextField {...params} variant="outlined" label="Kumaş Tipi" placeholder="Kumaş Tipi Seçin" />}
                                                renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)}
                                            />
                                            <Autocomplete
                                                multiple
                                                options={['Tümünü Seç', ...availableCollars]}
                                                value={selectedCollar}
                                                onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedCollar(availableCollars) : setSelectedCollar(newValue)}
                                                renderInput={(params) => <TextField {...params} variant="outlined" label="Yaka Tipi" placeholder="Yaka Tipi Seçin" />}
                                                renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)}
                                            />
                                        </Box>
                                    )}

                                    {productClass === 'Bilgisayar Şablonu' && (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2, pl: 2, borderLeft: '3px solid #e0e0e0' }}>
                                            <Typography variant="body2" color="text.secondary">Bilgisayar Özellikleri:</Typography>
                                            <Autocomplete
                                                multiple
                                                options={['Tümünü Seç', ...availableProcessors]}
                                                value={selectedProcessor}
                                                onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedProcessor(availableProcessors) : setSelectedProcessor(newValue)}
                                                renderInput={(params) => <TextField {...params} variant="outlined" label="İşlemci Tipi" placeholder="İşlemci Tipi Seçin" />}
                                                renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)}
                                            />
                                            <Autocomplete
                                                multiple
                                                options={['Tümünü Seç', ...availableRams]}
                                                value={selectedRam}
                                                onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedRam(availableRams) : setSelectedRam(newValue)}
                                                renderInput={(params) => <TextField {...params} variant="outlined" label="RAM Kapasitesi" placeholder="RAM Seçin" />}
                                                renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)}
                                            />
                                            <Autocomplete
                                                multiple
                                                options={['Tümünü Seç', ...availableOs]}
                                                value={selectedOs}
                                                onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedOs(availableOs) : setSelectedOs(newValue)}
                                                renderInput={(params) => <TextField {...params} variant="outlined" label="İşletim Sistemi" placeholder="İşletim Sistemi Seçin" />}
                                                renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)}
                                            />
                                        </Box>
                                    )}

                                    {productClass === 'Ayakkabı Şablonu' && (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2, pl: 2, borderLeft: '3px solid #e0e0e0' }}>
                                            <Typography variant="body2" color="text.secondary">Ayakkabı Özellikleri:</Typography>
                                            <Autocomplete
                                                multiple
                                                options={['Tümünü Seç', ...availableMaterials]}
                                                value={selectedMaterial}
                                                onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedMaterial(availableMaterials) : setSelectedMaterial(newValue)}
                                                renderInput={(params) => <TextField {...params} variant="outlined" label="Dış Materyal" placeholder="Materyal Seçin" />}
                                                renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)}
                                            />
                                            <Autocomplete
                                                multiple
                                                options={['Tümünü Seç', ...availableHeels]}
                                                value={selectedHeel}
                                                onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedHeel(availableHeels) : setSelectedHeel(newValue)}
                                                renderInput={(params) => <TextField {...params} variant="outlined" label="Topuk Boyu" placeholder="Topuk Boyu Seçin" />}
                                                renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)}
                                            />
                                        </Box>
                                    )}
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                );
            case 6: // Ürün Seçenekleri
                return (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <OptionsIcon color="primary" /> Ürün Seçenekleri
                        </Typography>
                        <Paper sx={{ p: 3, borderRadius: 2 }}>
                            <Grid container spacing={4}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Ürün seçenekleri</InputLabel>
                                        <Select value={selectedProductOption} label="Ürün seçenekleri" onChange={(e) => setSelectedProductOption(e.target.value)}>
                                            <MenuItem value=""><em>Seçiniz</em></MenuItem>
                                            <MenuItem value="Renk, Beden">Renk, Beden</MenuItem>
                                            <MenuItem value="Numara">Numara</MenuItem>
                                            <MenuItem value="Varyant Yok">Varyant Yok</MenuItem>
                                        </Select>
                                    </FormControl>

                                    {selectedProductOption === 'Renk, Beden' && (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2, pl: 2, borderLeft: '3px solid #e0e0e0' }}>
                                            <Typography variant="body2" color="text.secondary">Kullanılacak Seçenek Değerleri:</Typography>
                                            <Autocomplete
                                                multiple
                                                options={['Tümünü Seç', ...availableColors]}
                                                value={selectedColors}
                                                onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedColors(availableColors) : setSelectedColors(newValue)}
                                                renderInput={(params) => <TextField {...params} variant="outlined" label="Renk Seçimleri" placeholder="Renk Seçin" />}
                                                renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" color="primary" />)}
                                            />
                                            <Autocomplete
                                                multiple
                                                options={['Tümünü Seç', ...availableSizes]}
                                                value={selectedSizes}
                                                onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedSizes(availableSizes) : setSelectedSizes(newValue)}
                                                renderInput={(params) => <TextField {...params} variant="outlined" label="Beden Seçimleri" placeholder="Beden Seçin" />}
                                                renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" color="secondary" />)}
                                            />
                                        </Box>
                                    )}

                                    {selectedProductOption === 'Numara' && (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2, pl: 2, borderLeft: '3px solid #e0e0e0' }}>
                                            <Typography variant="body2" color="text.secondary">Kullanılacak Numara Değerleri:</Typography>
                                            <Autocomplete
                                                multiple
                                                options={['Tümünü Seç', ...availableNumbers]}
                                                value={selectedNumbers}
                                                onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedNumbers(availableNumbers) : setSelectedNumbers(newValue)}
                                                renderInput={(params) => <TextField {...params} variant="outlined" label="Numara Seçimleri" placeholder="Numara Seçin" />}
                                                renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" color="primary" />)}
                                            />
                                        </Box>
                                    )}
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                );
"""

# Insert these new cases into the switch statement
# Let's find "default:" to insert them right before it
default_idx = content.find('            default:')
if default_idx != -1:
    content = content[:default_idx] + new_cases_block + content[default_idx:]
else:
    print("default case not found!")

# Note: The active tabs for the other indexes after 4 were shifted.
# 5 is Variyantlar right now if there's a case 5.
# Let's fix the switch cases indices. I'll just shift all cases >= 5 by 2.
# Instead of doing that manually via strings, let's use a regex
def shift_case(match):
    num = int(match.group(1))
    if num >= 5:
        num += 2
    return f"case {num}:"

# Apply shift to existing cases
# Need to apply ONLY to the switch inside renderTabContent
# Wait! Instead of complex python regex, let's just do it directly.
switch_start = content.find('switch (activeTab) {')
switch_end = content.find('        }\n    };', switch_start)

switch_body = content[switch_start:switch_end]
# Shift case N -> N+2 for N >= 5
for n in reversed(range(5, 11)):
    switch_body = switch_body.replace(f'case {n}:', f'case {n+2}:')

# Now insert the new cases before case 7 (which used to be case 5)
case7_idx = switch_body.find('case 7:')
if case7_idx != -1:
    switch_body = switch_body[:case7_idx] + new_cases_block.strip() + '\n            ' + switch_body[case7_idx:]
else:
    # If case 5 didn't exist, just insert before default
    default_case_idx = switch_body.find('default:')
    switch_body = switch_body[:default_case_idx] + new_cases_block.strip() + '\n            ' + switch_body[default_case_idx:]

content = content[:switch_start] + switch_body + content[switch_end:]

with open('src/pages/products/CreateProductPage.tsx', 'w') as f:
    f.write(content)

print("Replacement complete.")
