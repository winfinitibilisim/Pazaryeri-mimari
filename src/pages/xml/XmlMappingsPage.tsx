import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, FormControl } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

const NAVY = '#1A237E';

const mappingsData = [
  { id: 1, xmlTag: '<product_id>', systemField: 'Ürün ID (PK)' },
  { id: 2, xmlTag: '<title>', systemField: 'Ürün Adı' },
  { id: 3, xmlTag: '<price>', systemField: 'Satış Fiyatı (KDV Dahil)' },
  { id: 4, xmlTag: '<quantity>', systemField: 'Stok Miktarı' },
  { id: 5, xmlTag: '<barcode>', systemField: 'Barkod (EAN)' },
  { id: 6, xmlTag: '<image_link>', systemField: 'Ana Görsel URL' },
  { id: 7, xmlTag: '<description>', systemField: 'Ürün Açıklaması' },
  { id: 8, xmlTag: '<category_path>', systemField: 'Kategori Ağacı' },
];

const systemFields = [
  'Ürün ID (PK)', 'Ürün Adı', 'Kısa Açıklama', 'Ürün Açıklaması', 
  'Satış Fiyatı (KDV Dahil)', 'İndirimli Fiyat', 'Stok Miktarı', 'Kritik Stok Seviyesi',
  'Barkod (EAN)', 'SKU', 'Ana Görsel URL', 'Kategori Ağacı', 'Marka', 'Ağırlık/Desi', 'Atla (Skip)'
];

const XmlMappingsPage: React.FC = () => {
  const [template, setTemplate] = useState('techstore_custom');

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="600" color={NAVY}>
          XML Eşleştirme ve Şablonlar
        </Typography>
        <FormControl size="small" sx={{ minWidth: 250, bgcolor: '#fff' }}>
          <Select value={template} onChange={(e) => setTemplate(e.target.value)}>
            <MenuItem value="techstore_custom">Şablon: TechStore Ana Feed</MenuItem>
            <MenuItem value="modatrend_v2">Şablon: ModaTrend V2</MenuItem>
            <MenuItem value="google_standard">Google Merchant Standart</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h6" color={NAVY} sx={{ mb: 2, fontWeight: 'bold' }}>Şablon Bilgileri</Typography>
            <TextField fullWidth size="small" label="Şablon Adı" defaultValue="TechStore Ana Feed" sx={{ mb: 3 }} />
            
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Kök Etiket (Root Node)</Typography>
            <TextField fullWidth size="small" defaultValue="<products>" sx={{ mb: 3 }} />
            
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Öğe Etiketi (Item Node)</Typography>
            <TextField fullWidth size="small" defaultValue="<product>" sx={{ mb: 4 }} />

            <Button variant="contained" fullWidth startIcon={<SaveIcon />} sx={{ bgcolor: NAVY, py: 1.5 }}>
              Şablonu Kaydet
            </Button>
            <Button variant="outlined" color="error" fullWidth sx={{ mt: 2 }}>
              Şablonu Sil
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
              <Typography variant="subtitle1" fontWeight="bold">Değişken Eşleştirmeleri (Mapping)</Typography>
              <Typography variant="caption" color="text.secondary">Gelen XML'deki etiketlerin sistemde hangi alana yazılacağını belirleyin.</Typography>
            </Box>
            
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><b>XML Etiketi (Tag)</b></TableCell>
                    <TableCell><b>Sistem Karşılığı</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mappingsData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <TextField size="small" defaultValue={row.xmlTag} fullWidth sx={{ maxWidth: 200 }} />
                      </TableCell>
                      <TableCell>
                        <Select size="small" fullWidth defaultValue={row.systemField}>
                          {systemFields.map(field => (
                            <MenuItem key={field} value={field}>{field}</MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell>
                      <TextField size="small" placeholder="Yeni Bir Tag Ekle..." fullWidth sx={{ maxWidth: 200 }} />
                    </TableCell>
                    <TableCell>
                      <Select size="small" fullWidth displayEmpty defaultValue="Atla (Skip)">
                        {systemFields.map(field => (
                          <MenuItem key={field} value={field}>{field}</MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ p: 2, bgcolor: '#f9f9f9', textAlign: 'right' }}>
              <Button variant="text" size="small" sx={{ textTransform: 'none' }}>+ Yeni Satır Ekle</Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default XmlMappingsPage;
