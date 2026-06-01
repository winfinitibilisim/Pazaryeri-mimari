import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, Switch, FormControlLabel } from '@mui/material';

const NAVY = '#1A237E';

const AccountingAutomationsPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h5" fontWeight="600" color={NAVY} sx={{ mb: 3 }}>
        E-Fatura & Otomatik Kesim (Paraşüt)
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" color={NAVY} sx={{ mb: 3, fontWeight: 'bold' }}>API ve Şirket Kimlikleri</Typography>
            <TextField fullWidth label="Client ID" defaultValue="prst_client_abc123" sx={{ mb: 3 }} />
            <TextField fullWidth label="Client Secret" type="password" defaultValue="************************" sx={{ mb: 3 }} />
            <TextField fullWidth label="Firma / Organizasyon ID" defaultValue="120953" sx={{ mb: 3 }} />
            
            <Button variant="outlined" fullWidth sx={{ mb: 2, textTransform: 'none' }}>Bağlantıyı Yenile</Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" color={NAVY} sx={{ mb: 3, fontWeight: 'bold' }}>Otomasyon Davranışları</Typography>
            
            <FormControlLabel control={<Switch defaultChecked color="primary" />} label="Sipariş 'Onaylandı' statüsüne geçince Fatura taslağı oluştur" sx={{ mb: 2, display: 'block' }} />
            <FormControlLabel control={<Switch color="primary" />} label="Taslakları otomatik resmileştir (GİB'e gönder)" sx={{ mb: 2, display: 'block' }} />
            <FormControlLabel control={<Switch defaultChecked color="primary" />} label="Fatura kesildiğinde müşteriye PDF linki içeren Email gönder" sx={{ mb: 2, display: 'block' }} />
            
            <TextField fullWidth size="small" type="number" label="Varsayılan KDV Oranı (%)" defaultValue={20} sx={{ mb: 3, mt: 2 }} />

            <Button variant="contained" fullWidth sx={{ bgcolor: NAVY, textTransform: 'none' }}>Ayarları Kaydet</Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AccountingAutomationsPage;
