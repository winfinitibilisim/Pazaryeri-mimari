import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Grid,
  Button,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  FileDownload as ExportIcon,
} from '@mui/icons-material';
import DataTable, { Column } from '../components/common/DataTable';

interface Order {
  id: string;
  customer: string;
  products: string;
  date: string;
  amount: number;
  status: 'Tamamlandı' | 'İşleniyor' | 'İptal Edildi';
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'SPR-001',
      customer: 'Ahmet Yılmaz',
      products: 'Laptop, Mouse',
      date: '20.05.2023',
      amount: 12500.00,
      status: 'Tamamlandı',
    },
    {
      id: 'SPR-002',
      customer: 'Ayşe Demir',
      products: 'Telefon, Kılıf',
      date: '19.05.2023',
      amount: 9800.50,
      status: 'İşleniyor',
    },
    {
      id: 'SPR-003',
      customer: 'Mehmet Kaya',
      products: 'Tablet',
      date: '18.05.2023',
      amount: 4500.75,
      status: 'Tamamlandı',
    },
    {
      id: 'SPR-004',
      customer: 'Zeynep Şahin',
      products: 'Kulaklık, Klavye',
      date: '17.05.2023',
      amount: 1250.00,
      status: 'İptal Edildi',
    },
    {
      id: 'SPR-005',
      customer: 'Ali Yıldız',
      products: 'Monitor, Hoparlör',
      date: '16.05.2023',
      amount: 3780.25,
      status: 'İşleniyor',
    },
  ]);

  const columns: Column[] = [
    { id: 'id', label: 'Sipariş No', minWidth: 100 },
    { id: 'customer', label: 'Müşteri', minWidth: 170 },
    { id: 'products', label: 'Ürünler', minWidth: 200 },
    { id: 'date', label: 'Tarih', minWidth: 100 },
    {
      id: 'amount',
      label: 'Tutar',
      minWidth: 100,
      align: 'right',
      format: (value: number) => `${value.toLocaleString('tr-TR')} ₺`,
    },
    {
      id: 'status',
      label: 'Durum',
      minWidth: 120,
      format: (value: string) => {
        let color = '';
        let backgroundColor = '';
        
        switch (value) {
          case 'Tamamlandı':
            color = '#2ecc71';
            backgroundColor = 'rgba(46, 204, 113, 0.1)';
            break;
          case 'İşleniyor':
            color = '#f39c12';
            backgroundColor = 'rgba(243, 156, 18, 0.1)';
            break;
          case 'İptal Edildi':
            color = '#e74c3c';
            backgroundColor = 'rgba(231, 76, 60, 0.1)';
            break;
          default:
            color = 'inherit';
            backgroundColor = 'transparent';
        }
        
        return (
          <Chip 
            label={value} 
            size="small" 
            sx={{ 
              color: color, 
              backgroundColor: backgroundColor,
              borderRadius: '4px',
              fontWeight: 500,
            }} 
          />
        );
      },
    },
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight="500" sx={{ mb: 3 }}>
        Siparişler
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'stretch', sm: 'center' },
                  justifyContent: 'space-between',
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Toplam Sipariş
                  </Typography>
                  <Typography variant="h4" fontWeight="500" color="#2980b9">
                    25
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  sx={{ 
                    backgroundColor: '#2980b9',
                    '&:hover': {
                      backgroundColor: '#2471a3',
                    }
                  }}
                >
                  Yeni Sipariş
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <TextField
                  placeholder="Sipariş ara..."
                  variant="outlined"
                  size="small"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mr: 2 }}
                />
                <IconButton sx={{ color: '#2980b9' }}>
                  <FilterIcon />
                </IconButton>
                <IconButton sx={{ color: '#2980b9' }}>
                  <ExportIcon />
                </IconButton>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <DataTable
          title="Sipariş Listesi"
          columns={columns}
          data={orders}
          onRowClick={(row) => console.log('Seçilen sipariş:', row)}
        />
      </Paper>
    </Box>
  );
};

export default OrdersPage; 