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

import PageHeader from '../components/layout/PageHeader';
import FilterPanel from '../components/common/FilterPanel';

// Örnek Fatura Verileri
const invoices = [
  {
    id: '1',
    invoiceNumber: 'ALIS-2024-001',
    supplier: 'ABC Tedarik A.Ş.',
    date: '15.06.2024',
    vat: '450.00 TL',
    total: '2950.00 TL',
    status: 'Ödendi',
  },
  {
    id: '2',
    invoiceNumber: 'ALIS-2024-002',
    supplier: 'XYZ Malzeme Ltd.',
    date: '20.05.2024',
    vat: '1260.50 TL',
    total: '8260.50 TL',
    status: 'Ödenmedi',
  },
  {
    id: '3',
    invoiceNumber: 'ALIS-2024-003',
    supplier: 'Güven Tedarikçi A.Ş.',
    date: '18.05.2024',
    vat: '890.25 TL',
    total: '5840.25 TL',
    status: 'Kısmi Ödendi',
  },
  {
    id: '4',
    invoiceNumber: 'ALIS-2024-004',
    supplier: 'Kalite Malzeme Ltd.',
    date: '12.05.2024',
    vat: '720.00 TL',
    total: '4720.00 TL',
    status: 'Ödendi',
  },
  {
    id: '5',
    invoiceNumber: 'ALIS-2024-005',
    supplier: 'Endüstri Tedarik A.Ş.',
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

const PurchaseInvoicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState<Date | null>(null);

  return (
    <Box sx={{ width: '100%' }}>
      <PageHeader
        title="Alış Faturaları"
        actionButton={
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<Add />} 
            onClick={() => navigate('/purchase-invoices/new')}
            sx={{
              bgcolor: '#fff',
              color: '#3949ab',
              '&:hover': { bgcolor: '#f5f5f5' },
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: 'none'
            }}
          >
            Yeni Alış Faturası
          </Button>
        }
      />

      <FilterPanel
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        searchPlaceholder="Tedarikçi veya Fatura No Ara"
        fields={[
          {
            id: 'status',
            label: 'Ödeme Durumu',
            type: 'select',
            options: [
              { value: '', label: 'Tümü' },
              { value: 'Ödendi', label: '✅ Ödendi' },
              { value: 'Ödenmedi', label: '❌ Ödenmedi' },
              { value: 'Kısmi Ödendi', label: '⚠️ Kısmi Ödendi' },
              { value: 'Beklemede', label: '⏳ Beklemede' }
            ]
          }
        ]}
        onAdvancedSearch={(values: any) => {
          if (values.status !== undefined) setStatusFilter(values.status);
        }}
      />

      {/* Fatura Tablosu */}
      <Paper sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#343a40' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>Fatura No</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>Tedarikçi</TableCell>
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

export default PurchaseInvoicesPage;
