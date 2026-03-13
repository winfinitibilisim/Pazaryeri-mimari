import sys

with open('src/pages/products/CreateProductPage.tsx', 'r') as f:
    content = f.read()

# Make sure LinearProgress and CircularProgress are imported
if "LinearProgress" not in content:
    content = content.replace("import {", "import {\n    LinearProgress,\n    CircularProgress,", 1)

progress_block = """
            {/* Progress/Gamification Header */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 3, border: '1px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {/* Fake Semi-circle / Circular Progress using SVG for exact match */}
                    <Box sx={{ position: 'relative', width: 120, height: 60, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                        <Box sx={{
                            width: 120, height: 120, borderRadius: '50%',
                            border: '12px solid #f0f0f0',
                            borderBottomColor: 'transparent', borderRightColor: 'transparent',
                            transform: 'rotate(-45deg)', position: 'absolute', top: 0
                        }} />
                        <Box sx={{
                            width: 120, height: 120, borderRadius: '50%',
                            border: '12px solid #ff6a00',
                            borderBottomColor: 'transparent', borderRightColor: 'transparent',
                            transform: `rotate(${-45 + (180 * 0.3)}deg)`, position: 'absolute', top: 0,
                            transition: '1s ease-out'
                        }} />
                        <Typography variant="h5" fontWeight="bold" sx={{ position: 'absolute', bottom: -5 }}>%30</Typography>
                        <Typography variant="caption" sx={{ position: 'absolute', bottom: -25, color: '#ff6a00', bgcolor: '#fff3e0', px: 1, borderRadius: 1 }}>Orta</Typography>
                    </Box>
                    <Box sx={{ ml: 2, mt: 1 }}>
                        <Typography variant="h6" fontWeight="bold" color="text.primary">
                            Ürün bilgilerini detaylı doldurun, satışlarınızı artırın!
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flex: 1, minWidth: 400 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Box sx={{ bgcolor: '#f9f9f9', p: 1.5, borderRadius: 1.5, border: '1px solid #eee' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <InfoIcon sx={{ fontSize: 16, color: '#bbb' }} />
                                    <Typography variant="body2" fontWeight="500" color="text.secondary">Ürün adını detaylı doldur</Typography>
                                </Box>
                                <LinearProgress variant="determinate" value={productName.length > 0 ? 100 : 0} sx={{ height: 8, borderRadius: 4, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: productName.length > 0 ? '#4caf50' : '#ff9800' } }} />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box sx={{ bgcolor: '#f9f9f9', p: 1.5, borderRadius: 1.5, border: '1px solid #eee' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <InfoIcon sx={{ fontSize: 16, color: '#bbb' }} />
                                    <Typography variant="body2" fontWeight="500" color="text.secondary">Her ürüne 5 görsel ekle</Typography>
                                </Box>
                                <LinearProgress variant="determinate" value={Math.min((images.length / 5) * 100, 100)} sx={{ height: 8, borderRadius: 4, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: '#ff9800' } }} />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box sx={{ bgcolor: '#f9f9f9', p: 1.5, borderRadius: 1.5, border: '1px solid #eee' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <InfoIcon sx={{ fontSize: 16, color: '#bbb' }} />
                                    <Typography variant="body2" fontWeight="500" color="text.secondary">Ürün özelliklerini doldur</Typography>
                                </Box>
                                <LinearProgress variant="determinate" value={productClass ? 100 : 0} sx={{ height: 8, borderRadius: 4, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: productClass ? '#4caf50' : '#ff9800' } }} />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box sx={{ bgcolor: '#f9f9f9', p: 1.5, borderRadius: 1.5, border: '1px solid #eee' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <InfoIcon sx={{ fontSize: 16, color: '#bbb' }} />
                                    <Typography variant="body2" fontWeight="500" color="text.secondary">Ürün açıklamalarını detaylı doldur</Typography>
                                </Box>
                                <LinearProgress variant="determinate" value={Math.min((description.length / 50) * 100, 100)} sx={{ height: 8, borderRadius: 4, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: '#ff9800' } }} />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
"""

# Calculate overall progress dynamically
progress_calc = """
    // Calculate overall progress
    const nameProgress = productName.length > 0 ? 100 : 0;
    const imageProgress = Math.min((images.length / 5) * 100, 100);
    const featureProgress = productClass ? 100 : 0;
    const descProgress = Math.min((description.length / 50) * 100, 100);
    const totalProgress = Math.round((nameProgress + imageProgress + featureProgress + descProgress) / 4);
"""

# Inject calc before return
content = content.replace("return (", progress_calc + "\n    return (")

# Update progress_block to use totalProgress
progress_block = progress_block.replace("%30", "{`%${totalProgress}`}")
progress_block = progress_block.replace("180 * 0.3", "180 * (totalProgress / 100)")
progress_block = progress_block.replace("Orta", "{totalProgress < 50 ? 'Düşük' : totalProgress < 80 ? 'Orta' : 'Yüksek'}")

# Insert the progress block after the sticky header
target_marker = "{/* Horizontal Tabs Component (MainCategoriesBar style) */}"
content = content.replace(target_marker, progress_block + "\n            " + target_marker)

with open('src/pages/products/CreateProductPage.tsx', 'w') as f:
    f.write(content)

print("Progress block added successfully.")
