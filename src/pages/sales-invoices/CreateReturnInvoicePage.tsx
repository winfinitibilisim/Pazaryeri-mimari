import React, { useState, useMemo } from 'react';
import { Box, Button, Paper, Typography, Grid, TextField, Select, MenuItem, IconButton, Divider, Autocomplete, Menu } from '@mui/material';
import { AddCircleOutline, Delete } from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import tr from 'date-fns/locale/tr';

interface InvoiceItem {
  id: number;
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  price: number;
  vat: number;
  discountType: 'percentage' | 'amount';
  discountValue?: number;
  sctRate?: number;
  communicationTaxRate?: number;
  accommodationTaxRate?: number;
  vatExemptionReason?: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  vat: number;
}

const CreateReturnInvoicePage: React.FC = () => {
  const [invoiceDate, setInvoiceDate] = useState<Date | null>(new Date());
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 1, name: '', quantity: 1, unit: 'Adet', price: 0, vat: 20, discountType: 'percentage' },
  ]);

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), name: '', quantity: 1, unit: 'Adet', price: 0, vat: 20, discountType: 'percentage' }]);
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id: number, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>İade Faturası Ekle</Typography>
      
      {/* Customer and Invoice Info */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField label="Müşteri" fullWidth />
        </Grid>
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
            <DatePicker
              label="Fatura Tarihi"
              value={invoiceDate}
              onChange={(newValue) => setInvoiceDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>

      {/* Invoice Items */}
      <Box>
        {items.map((item, index) => (
          <Paper key={item.id} variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField 
                  label={`Ürün/Hizmet ${index + 1}`}
                  value={item.name} 
                  onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                  fullWidth 
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <TextField 
                  label="Miktar" 
                  type="number" 
                  value={item.quantity} 
                  onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                  fullWidth 
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <TextField 
                  label="Birim Fiyatı" 
                  type="number" 
                  value={item.price} 
                  onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                  fullWidth 
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <Select 
                  value={item.vat} 
                  onChange={(e) => handleItemChange(item.id, 'vat', parseInt(String(e.target.value)))}
                  fullWidth
                >
                  <MenuItem value={0}>%0</MenuItem>
                  <MenuItem value={1}>%1</MenuItem>
                  <MenuItem value={10}>%10</MenuItem>
                  <MenuItem value={20}>%20</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={6} md={2}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {`₺${(item.quantity * item.price * (1 + item.vat / 100)).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </Typography>
              </Grid>
              <Grid item xs={12} md={1}>
                <IconButton onClick={() => handleRemoveItem(item.id)}>
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Box>

      <Button startIcon={<AddCircleOutline />} onClick={handleAddItem} sx={{ mb: 3 }}>
        Yeni Ürün Ekle
      </Button>

      {/* Totals Section can be added here */}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button variant="outlined" color="secondary">Vazgeç</Button>
        <Button variant="contained">Kaydet</Button>
      </Box>
    </Paper>
  );
};

export default CreateReturnInvoicePage;
