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
  AccountBalance as BankIcon,
  Money as CashIcon,
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
} from '@mui/icons-material';
import DataTable, { Column } from '../components/common/DataTable';

interface Payment {
  id: string;
  date: string;
  customer: string;
  amount: number;
  method: 'Kredi Kartı' | 'Banka Transferi' | 'Nakit';
  type: 'Gelir' | 'Gider';
  description: string;
}

const PaymentsPage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: 'ODM-001',
      date: '20.05.2023',
      customer: 'Ahmet Yılmaz',
      amount: 12500.00,
      method: 'Kredi Kartı',
      type: 'Gelir',
      description: 'Sipariş #SPR-001 Ödemesi',
    },
    {
      id: 'ODM-002',
      date: '19.05.2023',
      customer: 'Ayşe Demir',
      amount: 9800.50,
      method: 'Banka Transferi',
      type: 'Gelir',
      description: 'Sipariş #SPR-002 Ödemesi',
    },
    {
      id: 'ODM-003',
      date: '18.05.2023',
      customer: 'Tedarikçi A.Ş.',
      amount: 25000.00,
      method: 'Banka Transferi',
      type: 'Gider',
      description: 'Stok alımı',
    },
    {
      id: 'ODM-004',
      date: '17.05.2023',
      customer: 'Mehmet Kaya',
      amount: 4500.75,
      method: 'Kredi Kartı',
      type: 'Gelir',
      description: 'Sipariş #SPR-003 Ödemesi',
    },
    {
      id: 'ODM-005',
      date: '16.05.2023',
      customer: 'Ali Yıldız',
      amount: 3780.25,
      method: 'Nakit',
      type: 'Gelir',
      description: 'Sipariş #SPR-005 Ödemesi',
    },
  ]);

  const columns: Column[] = [
    { id: 'id', label: 'Ödeme No', minWidth: 100 },
    { id: 'date', label: 'Tarih', minWidth: 100 },
    { id: 'customer', label: 'Müşteri/Sağlayıcı', minWidth: 170 },
    {
      id: 'amount',
      label: 'Tutar',
      minWidth: 120,
      align: 'right',
      format: (value: number, row: Payment) => (
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 600,
            color: row.type === 'Gelir' ? '#2ecc71' : '#e74c3c'
          }}
        >
          {row.type === 'Gelir' ? '+' : '-'} {value.toLocaleString('tr-TR')} ₺
        </Typography>
      ),
    },
    {
      id: 'method',
      label: 'Ödeme Yöntemi',
      minWidth: 150,
      format: (value: string) => {
        let color = '';
        let bgColor = '';
        
        switch (value) {
          case 'Kredi Kartı':
            color = '#9b59b6';
            bgColor = 'rgba(155, 89, 182, 0.1)';
            break;
          case 'Banka Transferi':
            color = '#3498db';
            bgColor = 'rgba(52, 152, 219, 0.1)';
            break;
          case 'Nakit':
            color = '#f1c40f';
            bgColor = 'rgba(241, 196, 15, 0.1)';
            break;
          default:
            color = 'inherit';
            bgColor = 'transparent';
        }
        
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {value === 'Kredi Kartı' && <CreditCardIcon fontSize="small" sx={{ color }} />}
            {value === 'Banka Transferi' && <BankIcon fontSize="small" sx={{ color }} />}
            {value === 'Nakit' && <CashIcon fontSize="small" sx={{ color }} />}
            <Chip 
              label={value} 
              size="small" 
              sx={{ 
                color: color, 
                backgroundColor: bgColor,
                borderRadius: '4px',
                fontWeight: 500
              }} 
            />
          </Box>
        );
      },
    },
    {
      id: 'type',
      label: 'Tür',
      minWidth: 100,
      format: (value: string) => {
        const color = value === 'Gelir' ? '#2ecc71' : '#e74c3c';
        const bgColor = value === 'Gelir' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)';
        
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {value === 'Gelir' ? 
              <IncomeIcon fontSize="small" sx={{ color }} /> : 
              <ExpenseIcon fontSize="small" sx={{ color }} />
            }
            <Chip 
              label={value} 
              size="small" 
              sx={{ 
                color: color, 
                backgroundColor: bgColor,
                borderRadius: '4px',
                fontWeight: 500
              }} 
            />
          </Box>
        );
      },
    },
    { id: 'description', label: 'Açıklama', minWidth: 200 },
  ];

  const totalIncome = payments
    .filter(p => p.type === 'Gelir')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const totalExpense = payments
    .filter(p => p.type === 'Gider')
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <Box>
      <Typography variant="h5" fontWeight="500" sx={{ mb: 3 }}>
        Ödemeler
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', bgcolor: 'rgba(46, 204, 113, 0.05)', border: '1px solid rgba(46, 204, 113, 0.2)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Toplam Gelir
                    </Typography>
                    <Typography variant="h4" fontWeight="500" color="#2ecc71">
                      {totalIncome.toLocaleString('tr-TR')} ₺
                    </Typography>
                  </Box>
                  <IncomeIcon sx={{ color: '#2ecc71', fontSize: '2rem', p: 0.5, bgcolor: 'rgba(46, 204, 113, 0.1)', borderRadius: '8px' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', bgcolor: 'rgba(231, 76, 60, 0.05)', border: '1px solid rgba(231, 76, 60, 0.2)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Toplam Gider
                    </Typography>
                    <Typography variant="h4" fontWeight="500" color="#e74c3c">
                      {totalExpense.toLocaleString('tr-TR')} ₺
                    </Typography>
                  </Box>
                  <ExpenseIcon sx={{ color: '#e74c3c', fontSize: '2rem', p: 0.5, bgcolor: 'rgba(231, 76, 60, 0.1)', borderRadius: '8px' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', bgcolor: 'rgba(41, 128, 185, 0.05)', border: '1px solid rgba(41, 128, 185, 0.2)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Net Durum
                    </Typography>
                    <Typography variant="h4" fontWeight="500" color="#2980b9">
                      {(totalIncome - totalExpense).toLocaleString('tr-TR')} ₺
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
                    Yeni Ödeme
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
          <Typography variant="h6">Ödeme Listesi</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
              sx={{ mr: 2, width: '250px' }}
            />
            <IconButton sx={{ color: '#2980b9' }}>
              <FilterIcon />
            </IconButton>
            <IconButton sx={{ color: '#2980b9' }}>
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