import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  FileDownload as ExportIcon,
  CreditCard as CreditCardIcon,
} from '@mui/icons-material';
import DataTable, { Column } from '../components/common/DataTable';

interface Payment {
  id: string;
  date: string;
  amount: number;
  method: 'Kredi Kartı' | 'Banka Transferi' | 'Nakit';
  note: string;
}

const PaymentsPage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: '1',
      date: '15.06.2024',
      amount: 3600.00,
      method: 'Banka Transferi',
      note: 'Fatura bedelinin tamamı ödendi.',
    },
    {
      id: '2',
      date: '14.06.2024',
      amount: 2500.00,
      method: 'Kredi Kartı',
      note: 'Sipariş ödemesi tamamlandı.',
    },
    {
      id: '3',
      date: '13.06.2024',
      amount: 1200.00,
      method: 'Nakit',
      note: 'Peşin ödeme yapıldı.',
    },
    {
      id: '4',
      date: '12.06.2024',
      amount: 4500.00,
      method: 'Banka Transferi',
      note: 'Toplu ödeme gerçekleştirildi.',
    },
    {
      id: '5',
      date: '11.06.2024',
      amount: 800.00,
      method: 'Kredi Kartı',
      note: 'Kısmi ödeme alındı.',
    },
  ]);

  const columns: Column[] = [
    { 
      id: 'date', 
      label: 'Tarih', 
      minWidth: 120,
      format: (value: string) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {value}
        </Typography>
      )
    },
    {
      id: 'amount',
      label: 'Tutar',
      minWidth: 120,
      align: 'right',
      format: (value: number) => (
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 600,
            color: '#2e7d32'
          }}
        >
          {value.toLocaleString('tr-TR')} TL
        </Typography>
      ),
    },
    {
      id: 'method',
      label: 'Ödeme Yöntemi',
      minWidth: 150,
      format: (value: string) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {value}
        </Typography>
      ),
    },
    { 
      id: 'note', 
      label: 'Not', 
      minWidth: 300,
      format: (value: string) => (
        <Typography variant="body2" color="text.secondary">
          {value}
        </Typography>
      )
    },
  ];

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="500">
          Ödeme Geçmişi
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          sx={{ 
            backgroundColor: '#25638f',
            '&:hover': {
              backgroundColor: '#1e4f72',
            }
          }}
        >
          + Yeni Ödeme Ekle
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Card sx={{ bgcolor: 'rgba(37, 99, 143, 0.05)', border: '1px solid rgba(37, 99, 143, 0.2)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Toplam Ödeme Tutarı
                </Typography>
                <Typography variant="h4" fontWeight="500" color="#25638f">
                  {totalAmount.toLocaleString('tr-TR')} TL
                </Typography>
              </Box>
              <CreditCardIcon sx={{ color: '#25638f', fontSize: '2.5rem' }} />
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0', bgcolor: '#f8f9fa' }}>
          <Typography variant="h6" sx={{ color: '#495057', fontWeight: 600 }}>Ödeme Detayları</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              placeholder="Ödeme ara..."
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: '200px' }}
            />
            <IconButton sx={{ color: '#495057' }}>
              <FilterIcon />
            </IconButton>
            <IconButton sx={{ color: '#495057' }}>
              <ExportIcon />
            </IconButton>
          </Box>
        </Box>
        <DataTable
          columns={columns}
          data={payments}
          onRowClick={(row) => console.log('Seçilen ödeme:', row)}
          showToolbar={false}
        />
      </Paper>
    </Box>
  );
};

export default PaymentsPage; 