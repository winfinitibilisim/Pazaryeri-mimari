import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip, 
  IconButton, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Add, Visibility, FilterList, Search } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import tr from 'date-fns/locale/tr';
import { useNavigate } from 'react-router-dom';

// Örnek Fatura Verileri
const invoices = [
  {
    id: '1',
    invoiceNumber: 'SATIS-2024-001',
    supplier: 'Ahmet Yılmaz',
    date: '15.06.2024',
    vat: '450.00 TL',
    total: '2950.00 TL',
    status: 'Ödendi',
  },
  {
    id: '2',
    invoiceNumber: 'SATIS-2024-002',
    supplier: 'Teknoloji A.Ş.',
    date: '20.05.2024',
    vat: '1260.50 TL',
    total: '8260.50 TL',
    status: 'Ödenmedi',
  },
  {
    id: '3',
    invoiceNumber: 'SATIS-2024-003',
    supplier: 'Ayşe Kaya',
    date: '18.05.2024',
    vat: '890.25 TL',
    total: '5840.25 TL',
    status: 'Kısmi Ödendi',
  },
  {
    id: '4',
    invoiceNumber: 'SATIS-2024-004',
    supplier: 'Mehmet Demir A.Ş.',
    date: '12.05.2024',
    vat: '720.00 TL',
    total: '4720.00 TL',
    status: 'Ödendi',
  },
  {
    id: '5',
    invoiceNumber: 'SATIS-2024-005',
    supplier: 'Fatma Özkan Ltd.',
    date: '08.05.2024',
    vat: '1580.75 TL',
    total: '10380.75 TL',
    status: 'Beklemede',
  },
];

// Durum etiketleri için renk belirleme
function getStatusChipColor(status: string) {
  switch (status) {
    case 'Ödendi':
      return { backgroundColor: '#d4edda', color: '#155724' };
    case 'Ödenmedi':
      return { backgroundColor: '#f8d7da', color: '#721c24' };
    case 'Kısmi Ödendi':
      return { backgroundColor: '#fff3cd', color: '#856404' };
    case 'Beklemede':
      return { backgroundColor: '#cce7ff', color: '#004085' };
    default:
      return { backgroundColor: '#e2e3e5', color: '#383d41' };
  }
}

const SalesInvoicesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState<Date | null>(null);

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Başlık ve Butonlar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
          Alış Faturaları
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<Add />} 
            onClick={() => navigate('/sales-invoices/create')}
            sx={{ borderRadius: '20px', px: 3 }}
          >
            Yeni Satış Faturası
          </Button>
        </Box>
      </Box>

      {/* Filtreler */}
      <Accordion sx={{ mb: 3, borderRadius: '12px', '&:before': { display: 'none' } }}>
        <AccordionSummary 
          expandIcon={<FilterList />}
          sx={{ 
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            '&.Mui-expanded': {
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0
            }
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#495057' }}>
            🔍 Gelişmiş Arama ve Filtreler
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ backgroundColor: '#ffffff', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Müşteri veya Fatura No Ara"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Ödeme Durumu</InputLabel>
                <Select
                  value={statusFilter}
                  label="Ödeme Durumu"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{
                    borderRadius: '12px'
                  }}
                >
                  <MenuItem value="">Tümü</MenuItem>
                  <MenuItem value="Ödendi">✅ Ödendi</MenuItem>
                  <MenuItem value="Ödenmedi">❌ Ödenmedi</MenuItem>
                  <MenuItem value="Kısmi Ödendi">⚠️ Kısmi Ödendi</MenuItem>
                  <MenuItem value="Beklemede">⏳ Beklemede</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
                <DatePicker
                  label="Tarih Filtresi"
                  value={dateFilter}
                  onChange={(newValue) => setDateFilter(newValue)}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      fullWidth 
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px'
                        }
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Fatura Tablosu */}
      <Paper sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#343a40' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>Fatura No</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>Müşteri</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>Tarih</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>KDV</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>Toplam</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>Durum</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '16px', textAlign: 'center' }}>İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices
                .filter(invoice => 
                  (searchTerm === '' || 
                   invoice.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())) &&
                  (statusFilter === '' || invoice.status === statusFilter)
                )
                .map((invoice) => (
                  <TableRow 
                    key={invoice.id} 
                    sx={{ 
                      '&:nth-of-type(odd)': { backgroundColor: '#f8f9fa' },
                      '&:hover': { backgroundColor: '#e3f2fd', cursor: 'pointer' },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <TableCell sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell sx={{ color: '#495057' }}>
                      {invoice.supplier}
                    </TableCell>
                    <TableCell sx={{ color: '#6c757d' }}>
                      {invoice.date}
                    </TableCell>
                    <TableCell sx={{ color: '#28a745', fontWeight: 'bold' }}>
                      {invoice.vat}
                    </TableCell>
                    <TableCell sx={{ color: '#007bff', fontWeight: 'bold', fontSize: '16px' }}>
                      {invoice.total}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={invoice.status} 
                        sx={{
                          ...getStatusChipColor(invoice.status),
                          fontWeight: 'bold',
                          borderRadius: '16px'
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <IconButton 
                        onClick={() => navigate(`/purchase-invoices/${invoice.id}`)} 
                        size="small"
                        sx={{
                          backgroundColor: '#e3f2fd',
                          color: '#1976d2',
                          '&:hover': {
                            backgroundColor: '#bbdefb',
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default SalesInvoicesListPage;
