import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, Select, MenuItem, FormControl, InputLabel, Chip } from '@mui/material';

const ORANGE = '#FF9800';

const CrmIntegrationsPage: React.FC = () => {
  const [vendor, setVendor] = useState('salesforce');

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="600" color={ORANGE}>
          Müşteri İlişkileri (CRM)
        </Typography>
        <FormControl size="small" sx={{ minWidth: 200, bgcolor: '#fff' }}>
          <InputLabel>CRM Platformu</InputLabel>
          <Select value={vendor} onChange={(e) => setVendor(e.target.value)} label="CRM Platformu">
            <MenuItem value="salesforce">Salesforce</MenuItem>
            <MenuItem value="hubspot">HubSpot</MenuItem>
            <MenuItem value="zendesk">Zendesk</MenuItem>
            <MenuItem value="zoho">Zoho CRM</MenuItem>
            <MenuItem value="pipedrive">Pipedrive</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Typography variant="h6" color={ORANGE} sx={{ fontWeight: 'bold' }}>Salesforce Müşteri Eşitleme Ayarları</Typography>
          <Chip label="Kurulu Değil" size="small" sx={{ bgcolor: '#eee', color: '#666', fontWeight: 'bold' }} />
        </Box>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Client ID" sx={{ mb: 3 }} />
            <TextField fullWidth label="Client Secret" type="password" sx={{ mb: 3 }} />
            <TextField fullWidth label="OAuth Token / Access Key" type="password" sx={{ mb: 3 }} />
            <TextField fullWidth label="Instance URL" placeholder="https://your-instance.my.salesforce.com" sx={{ mb: 3 }} />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, bgcolor: '#fff3e0', border: `1px solid ${ORANGE}40`, borderRadius: 2, mb: 3 }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Senkronizasyon İşlemleri</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Platforma kayıt olan her yeni müşteri veya satıcı, Salesforce'daki Leads/Contacts havuzuna otomatik olarak akacaktır.
              </Typography>
              <Button size="small" variant="outlined" sx={{ textTransform: 'none', color: ORANGE, borderColor: ORANGE, mr: 1 }}>
                Alan (Field) Eşleştirmelerini Yapılandır
              </Button>
            </Box>

            <Button variant="contained" size="large" fullWidth sx={{ textTransform: 'none', bgcolor: ORANGE, '&:hover': { bgcolor: '#e68a00' } }}>
              OAuth Bağlantısını Test Et & Yetkilendir
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default CrmIntegrationsPage;
