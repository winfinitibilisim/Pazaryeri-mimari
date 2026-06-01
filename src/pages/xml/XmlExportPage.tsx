import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, MenuItem, Select, FormControl, InputLabel, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { CloudDownload as CloudDownloadIcon, Link as LinkIcon, ContentCopy as CopyIcon } from '@mui/icons-material';

const NAVY = '#1A237E';
const ORANGE = '#FF9800';

const XmlExportPage: React.FC = () => {
  const [exportTarget, setExportTarget] = useState('google');

  return (
    <Box>
      <Typography variant="h5" fontWeight="600" color={NAVY} sx={{ mb: 3 }}>
        XML Dışa Aktar (Export)
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 4, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" color={NAVY} sx={{ mb: 3, fontWeight: 'bold' }}>Dışa Aktarım Ayarları</Typography>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Hedef Platform Şablonu</InputLabel>
              <Select value={exportTarget} onChange={(e) => setExportTarget(e.target.value)} label="Hedef Platform Şablonu">
                <MenuItem value="google">Google Merchant Center</MenuItem>
                <MenuItem value="facebook">Facebook Catalog</MenuItem>
                <MenuItem value="akakce">Akakçe</MenuItem>
                <MenuItem value="cimri">Cimri.com</MenuItem>
                <MenuItem value="custom">Özel XML (Tüm Veriler)</MenuItem>
              </Select>
            </FormControl>

            <TextField fullWidth label="Feed Adı" placeholder="Örn: Günlük Kampanyalı Ürünler Ciktisi" sx={{ mb: 3 }} />

            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Dışa Aktarılacak Kategoriler</Typography>
            <FormGroup row sx={{ mb: 3 }}>
              <FormControlLabel control={<Checkbox defaultChecked />} label="Elektronik" />
              <FormControlLabel control={<Checkbox defaultChecked />} label="Moda" />
              <FormControlLabel control={<Checkbox />} label="Kozmetik" />
              <FormControlLabel control={<Checkbox defaultChecked />} label="Ev & Yaşam" />
            </FormGroup>
            
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Filtreler</Typography>
            <FormGroup row sx={{ mb: 4 }}>
              <FormControlLabel control={<Checkbox defaultChecked />} label="Sadece Stokta Olanları Aktar" />
              <FormControlLabel control={<Checkbox defaultChecked />} label="Sadece Görseli Olanları Aktar" />
            </FormGroup>

            <Button variant="contained" size="large" sx={{ bgcolor: NAVY, textTransform: 'none', px: 4 }}>
              XML Feed Oluştur
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 4, borderRadius: 2, height: '100%', bgcolor: '#f5f5f5' }}>
            <Typography variant="h6" color={NAVY} sx={{ mb: 3, fontWeight: 'bold' }}>Aktif XML Bağlantıları</Typography>
            
            <Box sx={{ p: 3, mb: 3, bgcolor: '#fff', borderRadius: 2, border: '1px solid #ddd' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" color={ORANGE}>Google Merchant Ana Feed</Typography>
                <Typography variant="caption" color="text.secondary">Güncelleme: Her Gece</Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 2, wordBreak: 'break-all', color: '#555' }}>
                https://api.winfiniti.com/export/xml/v1/feed_8a2b3c...
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" variant="outlined" startIcon={<CopyIcon />} sx={{ textTransform: 'none' }}>Kopyala</Button>
                <Button size="small" variant="text" startIcon={<LinkIcon />} sx={{ textTransform: 'none' }}>Test Et</Button>
              </Box>
            </Box>

            <Box sx={{ p: 3, bgcolor: '#fff', borderRadius: 2, border: '1px solid #ddd' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" color={ORANGE}>Facebook Katalog (Sadece Elektronik)</Typography>
                <Typography variant="caption" color="text.secondary">Güncelleme: Canlı</Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 2, wordBreak: 'break-all', color: '#555' }}>
                https://api.winfiniti.com/export/xml/v2/fb_catalog_xyz...
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" variant="outlined" startIcon={<CopyIcon />} sx={{ textTransform: 'none' }}>Kopyala</Button>
                <Button size="small" variant="text" startIcon={<LinkIcon />} sx={{ textTransform: 'none' }}>Test Et</Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default XmlExportPage;
