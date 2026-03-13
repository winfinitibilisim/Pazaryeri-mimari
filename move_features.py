import re

with open('src/pages/products/CreateProductPage.tsx', 'r') as f:
    content = f.read()

# 1. Delete the old block in the right column
start_str = "                            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>\n                                <Typography variant=\"h6\" sx={{ mb: 2 }}>Sınıflandırma</Typography>\n                                <Divider sx={{ mb: 3 }} />\n                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>\n                                    <FormControl fullWidth variant=\"outlined\">\n                                        <InputLabel>Ürün seçenekleri</InputLabel>"

end_str = "                                    {/* The old generic feature selection dropdown that wasn't being used contextually */}\n                                    {/* is removed to clear the UI context and favor explicit selections via the dynamic logic above */}\n                                </Box>\n                            </Paper>\n"

start_idx = content.find(start_str)
end_idx = content.find(end_str) + len(end_str)

if start_idx == -1 or end_idx < len(end_str):
    print("Could not find the block to delete!")
    exit(1)

content = content[:start_idx] + content[end_idx:]

# 2. Extract the interior components (we don't need to, we can just insert the new code)
new_block = """                            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <OptionsIcon color="primary" /> Ürün Seçenekleri ve Özellikleri
                                </Typography>
                                <Divider sx={{ mb: 3 }} />
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
"""

# Insert the new block right before Fiyatlandırma ve Envanter
insert_target = '                            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>\n                                <Typography variant="h6" sx={{ mb: 2 }}>Fiyatlandırma ve Envanter</Typography>'

insert_idx = content.find(insert_target)

if insert_idx == -1:
    print("Could not find insert target!")
    exit(1)

content = content[:insert_idx] + new_block + '\n' + content[insert_idx:]

with open('src/pages/products/CreateProductPage.tsx', 'w') as f:
    f.write(content)

print("Modification complete!")
