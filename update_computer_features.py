import re

with open('src/pages/products/CreateProductPage.tsx', 'r') as f:
    content = f.read()

# 1. Add new available options
available_options = """
    const availableEmmc = ['Yok', '32 GB', '64 GB', '128 GB', '256 GB', '512 GB', '1 TB'];
    const availableGpuMemoryType = ['Yok', 'DDR3', 'DDR4', 'GDDR5', 'GDDR6', 'GDDR7'];
    const availableScreenPanel = ['IPS', 'OLED', 'AMOLED', 'TN', 'VA'];
    const availableProcessorGen = ['10. Nesil', '11. Nesil', '12. Nesil', '13. Nesil', '14. Nesil', 'Apple M1', 'Apple M2', 'Apple M3'];
    const availableMaxSpeed = ['2.0 GHz', '2.5 GHz', '3.0 GHz', '3.5 GHz', '4.0 GHz', '4.5+ GHz'];
    const availableMemorySpeed = ['2133 MHz', '2400 MHz', '2666 MHz', '3200 MHz', '4800 MHz', '5600+ MHz'];
    const availableBluetooth = ['Yok', 'Var (4.2)', 'Var (5.0)', 'Var (5.1)', 'Var (5.2)', 'Var (5.3)'];
    const availableWeight = ['1 kg altı', '1 - 1.5 kg', '1.5 - 2 kg', '2 - 2.5 kg', '2.5 kg ve üzeri'];
    const availableTouch = ['Var', 'Yok'];
    const availableScreenSize = ['13 inç', '13.3 inç', '14 inç', '15.6 inç', '16.1 inç', '16.3 inç', '17.3 inç'];
    const availableGpu = ['Dahili', 'NVIDIA GeForce RTX 3050', 'NVIDIA GeForce RTX 4060', 'AMD Radeon RX 6600', 'Apple M3 GPU'];
    const availableGpuMemory = ['Paylaşımlı', '2 GB', '4 GB', '6 GB', '8 GB', '12 GB', '16 GB'];
"""

# Insert right after `const availableOs = ...;`
os_idx = content.find("const availableOs = ['Windows 11', 'FreeDOS', 'macOS'];\n")
if os_idx != -1:
    content = content[:os_idx + len("const availableOs = ['Windows 11', 'FreeDOS', 'macOS'];\n")] + available_options + content[os_idx + len("const availableOs = ['Windows 11', 'FreeDOS', 'macOS'];\n"):]


# 2. Add new state variabless
state_vars = """
    const [selectedEmmc, setSelectedEmmc] = useState<string[]>([]);
    const [selectedGpuMemoryType, setSelectedGpuMemoryType] = useState<string[]>([]);
    const [selectedScreenPanel, setSelectedScreenPanel] = useState<string[]>([]);
    const [selectedProcessorGen, setSelectedProcessorGen] = useState<string[]>([]);
    const [selectedMaxSpeed, setSelectedMaxSpeed] = useState<string[]>([]);
    const [selectedMemorySpeed, setSelectedMemorySpeed] = useState<string[]>([]);
    const [selectedBluetooth, setSelectedBluetooth] = useState<string[]>([]);
    const [selectedWeight, setSelectedWeight] = useState<string[]>([]);
    const [selectedTouch, setSelectedTouch] = useState<string[]>([]);
    const [selectedScreenSize, setSelectedScreenSize] = useState<string[]>([]);
    const [selectedGpu, setSelectedGpu] = useState<string[]>([]);
    const [selectedGpuMemory, setSelectedGpuMemory] = useState<string[]>([]);
"""

# Insert right after selectedOs state
selected_os_def = "const [selectedOs, setSelectedOs] = useState<string[]>([]);\n"
os_state_idx = content.find(selected_os_def)
if os_state_idx != -1:
    content = content[:os_state_idx + len(selected_os_def)] + state_vars + content[os_state_idx + len(selected_os_def):]

# 3. Replace the Bilgisayar Özellikleri block
old_block_start = "                                    {productClass === 'Bilgisayar Şablonu' && ("
old_block_end = "                                    {productClass === 'Ayakkabı Şablonu' && ("

old_block_start_idx = content.find(old_block_start)
old_block_end_idx = content.find(old_block_end)

new_block = """                                    {productClass === 'Bilgisayar Şablonu' && (
                                        <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #eee', width: '200%' }}>
                                            <Typography variant="h6" color="primary" sx={{ mb: 3 }}>Bilgisayar Özellikleri</Typography>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} sm={6}>
                                                    <Autocomplete multiple options={['Tümünü Seç', ...availableEmmc]} value={selectedEmmc} onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedEmmc(availableEmmc) : setSelectedEmmc(newValue)} renderInput={(params) => <TextField {...params} variant="outlined" label="eMMC Kapasitesi*" placeholder="Seçin" />} renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)} />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Autocomplete multiple options={['Tümünü Seç', ...availableGpuMemoryType]} value={selectedGpuMemoryType} onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedGpuMemoryType(availableGpuMemoryType) : setSelectedGpuMemoryType(newValue)} renderInput={(params) => <TextField {...params} variant="outlined" label="Ekran Kartı Bellek Tipi*" placeholder="Seçin" />} renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)} />
                                                </Grid>
                                                
                                                <Grid item xs={12} sm={6}>
                                                    <Autocomplete multiple options={['Tümünü Seç', ...availableScreenPanel]} value={selectedScreenPanel} onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedScreenPanel(availableScreenPanel) : setSelectedScreenPanel(newValue)} renderInput={(params) => <TextField {...params} variant="outlined" label="Ekran Panel Tipi*" placeholder="Seçin" />} renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)} />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Autocomplete multiple options={['Tümünü Seç', ...availableProcessorGen]} value={selectedProcessorGen} onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedProcessorGen(availableProcessorGen) : setSelectedProcessorGen(newValue)} renderInput={(params) => <TextField {...params} variant="outlined" label="İşlemci Nesli*" placeholder="Seçin" />} renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)} />
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <Autocomplete multiple options={['Tümünü Seç', ...availableMaxSpeed]} value={selectedMaxSpeed} onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedMaxSpeed(availableMaxSpeed) : setSelectedMaxSpeed(newValue)} renderInput={(params) => <TextField {...params} variant="outlined" label="Maksimum İşlemci Hızı*" placeholder="Seçin" />} renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)} />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Autocomplete multiple options={['Tümünü Seç', ...availableMemorySpeed]} value={selectedMemorySpeed} onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedMemorySpeed(availableMemorySpeed) : setSelectedMemorySpeed(newValue)} renderInput={(params) => <TextField {...params} variant="outlined" label="Bellek Hızı*" placeholder="Seçin" />} renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)} />
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <Autocomplete multiple options={['Tümünü Seç', ...availableBluetooth]} value={selectedBluetooth} onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedBluetooth(availableBluetooth) : setSelectedBluetooth(newValue)} renderInput={(params) => <TextField {...params} variant="outlined" label="Bluetooth Özelliği*" placeholder="Seçin" />} renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)} />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Autocomplete multiple options={['Tümünü Seç', ...availableWeight]} value={selectedWeight} onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedWeight(availableWeight) : setSelectedWeight(newValue)} renderInput={(params) => <TextField {...params} variant="outlined" label="Cihaz Ağırlığı*" placeholder="Seçin" />} renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)} />
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <Autocomplete multiple options={['Tümünü Seç', ...availableTouch]} value={selectedTouch} onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedTouch(availableTouch) : setSelectedTouch(newValue)} renderInput={(params) => <TextField {...params} variant="outlined" label="Dokunmatik Ekran*" placeholder="Seçin" />} renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)} />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Autocomplete multiple options={['Tümünü Seç', ...availableScreenSize]} value={selectedScreenSize} onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedScreenSize(availableScreenSize) : setSelectedScreenSize(newValue)} renderInput={(params) => <TextField {...params} variant="outlined" label="Ekran Boyutu*" placeholder="Seçin" />} renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)} />
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <Autocomplete multiple options={['Tümünü Seç', ...availableGpu]} value={selectedGpu} onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedGpu(availableGpu) : setSelectedGpu(newValue)} renderInput={(params) => <TextField {...params} variant="outlined" label="Ekran Kartı*" placeholder="Seçin" />} renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)} />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Autocomplete multiple options={['Tümünü Seç', ...availableGpuMemory]} value={selectedGpuMemory} onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedGpuMemory(availableGpuMemory) : setSelectedGpuMemory(newValue)} renderInput={(params) => <TextField {...params} variant="outlined" label="Ekran Kartı Hafızası*" placeholder="Seçin" />} renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)} />
                                                </Grid>

                                            </Grid>
                                        </Box>
                                    )}
"""

content = content[:old_block_start_idx] + new_block + "                                    " + content[old_block_end_idx:]

with open('src/pages/products/CreateProductPage.tsx', 'w') as f:
    f.write(content)

print("Replacement complete.")
