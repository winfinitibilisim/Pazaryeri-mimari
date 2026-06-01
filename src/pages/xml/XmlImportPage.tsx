import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, MenuItem, Select, FormControl, InputLabel, Switch, FormControlLabel } from '@mui/material';
import { CloudUpload as CloudUploadIcon, AddLink as AddLinkIcon } from '@mui/icons-material';

const NAVY = '#1A237E';
const ORANGE = '#FF9800';

const XmlImportPage: React.FC = () => {
  const [importType, setImportType] = useState('url');
  const [frequency, setFrequency] = useState('24');

  return (
    <Box>
      <Typography variant="h5" fontWeight="600" color={NAVY} sx={{ mb: 3 }}>
        XML İçe Aktar (Import)
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h6" color={NAVY} sx={{ mb: 3, fontWeight: 'bold' }}>Yeni Bir XML Kaynağı Bağla</Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Veri Kaynağı Tipi</InputLabel>
              <Select value={importType} onChange={(e) => setImportType(e.target.value)} label="Veri Kaynağı Tipi">
                <MenuItem value="url">Uzak Bağlantı (XML URL)</MenuItem>
                <MenuItem value="file">Dosya Yükle (.xml)</MenuItem>
              </Select>
            </FormControl>

            {importType === 'url' ? (
              <TextField 
                fullWidth 
                label="XML Besleme (Feed) URL'si" 
                placeholder="https://orneksatici.com/feed.xml" 
                sx={{ mb: 3 }} 
              />
            ) : (
              <Box sx={{ border: '2px dashed #ccc', borderRadius: 2, p: 4, textAlign: 'center', mb: 3 }}>
                <CloudUploadIcon sx={{ fontSize: 40, color: '#ccc', mb: 1 }} />
                <Typography color="text.secondary">Bir .xml dosyası sürükleyin veya seçin</Typography>
                <Button variant="outlined" sx={{ mt: 2, textTransform: 'none' }}>Dosya Seç</Button>
              </Box>
            )}

            <TextField fullWidth label="Satıcı/Tedarikçi Adı" placeholder="Örn: TechStore" sx={{ mb: 3 }} />

          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Güncelleme Frekansı</InputLabel>
              <Select value={frequency} onChange={(e) => setFrequency(e.target.value)} label="Güncelleme Frekansı">
                <MenuItem value="0">Sadece Bir Kere</MenuItem>
                <MenuItem value="1">Her 1 Saatte Bir</MenuItem>
                <MenuItem value="6">Her 6 Saatte Bir</MenuItem>
                <MenuItem value="12">Her 12 Saatte Bir</MenuItem>
                <MenuItem value="24">Günde Bir Kez</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold">Senkronizasyon Tercihleri</Typography>
              <FormControlLabel control={<Switch defaultChecked color="primary" />} label="Sadece Stok ve Fiyat Güncelle" />
              <FormControlLabel control={<Switch defaultChecked color="primary" />} label="Eksik Ürünleri Otomatik Olarak Pasife Al" />
              <FormControlLabel control={<Switch color="primary" />} label="Etiketleri (Tags) İçeri Aktar" />
            </Box>

            <Button variant="contained" size="large" fullWidth sx={{ bgcolor: ORANGE, '&:hover': { bgcolor: NAVY }, textTransform: 'none', py: 1.5, fontSize: '1.1rem' }}>
              XML Bağlantısını Kur ve Başlat
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default XmlImportPage;
