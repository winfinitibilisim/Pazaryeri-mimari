import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, Select, MenuItem, FormControl, InputLabel, Switch, FormControlLabel } from '@mui/material';

const NAVY = '#1A237E';
const GREEN = '#4CAF50';

const ErpIntegrationsPage: React.FC = () => {
  const [provider, setProvider] = useState('logo');

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="600" color={NAVY}>
          Kurumsal ERP Bağlantıları
        </Typography>
        <FormControl size="small" sx={{ minWidth: 200, bgcolor: '#fff' }}>
          <InputLabel>Servis Sağlayıcı</InputLabel>
          <Select value={provider} onChange={(e) => setProvider(e.target.value)} label="Servis Sağlayıcı">
            <MenuItem value="logo">Logo Yazılım (Tiger/Goplus)</MenuItem>
            <MenuItem value="sap">SAP / Hana</MenuItem>
            <MenuItem value="mikro">Mikro Yazılım</MenuItem>
            <MenuItem value="netsis">Netsis</MenuItem>
            <MenuItem value="custom">Özel API Hook</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h6" color={NAVY} sx={{ mb: 3, fontWeight: 'bold' }}>Logo Yazılım API Konfigürasyonu</Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="REST API Base URL" placeholder="https://api.domain.com/logo/v2/" sx={{ mb: 3 }} />
            <TextField fullWidth label="Firma Kodu (Firm No)" placeholder="Örn: 001" sx={{ mb: 3 }} />
            <TextField fullWidth label="Dönem Kodu (Period No)" placeholder="Örn: 01" sx={{ mb: 3 }} />
            <TextField fullWidth label="API Kullanıcı Adı" sx={{ mb: 3 }} />
            <TextField fullWidth label="API Şifre" type="password" sx={{ mb: 3 }} />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 2, mb: 3 }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>Otomasyon Kuralları</Typography>
              <FormControlLabel control={<Switch defaultChecked color="primary" />} label="Sipariş onaylanınca otomatik cari / irsaliye oluştur" sx={{ mb: 1, display: 'block' }} />
              <FormControlLabel control={<Switch defaultChecked color="primary" />} label="İadeleri otomatik işleme al (Satış İade İrsaliyesi)" sx={{ mb: 1, display: 'block' }} />
              <FormControlLabel control={<Switch color="primary" />} label="Stokları ERP'den Yönet (Pazaryeri stoklarını ezer)" sx={{ mb: 1, display: 'block' }} />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" size="large" fullWidth sx={{ textTransform: 'none', borderColor: NAVY, color: NAVY }}>
                Bağlantıyı Test Et
              </Button>
              <Button variant="contained" size="large" fullWidth sx={{ textTransform: 'none', bgcolor: NAVY }}>
                Ayarları Kaydet ve Aktifleştir
              </Button>
            </Box>
            
            <Box sx={{ mt: 3, p: 2, bgcolor: `${GREEN}15`, borderRadius: 1, border: `1px solid ${GREEN}40` }}>
              <Typography variant="body2" color={GREEN} fontWeight="bold" textAlign="center">
                Test Başarılı: Logo REST servisine erişim sağlandı. (23ms)
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ErpIntegrationsPage;
