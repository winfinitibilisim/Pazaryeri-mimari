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
import CreateSalesInvoiceModal from './CreateSalesInvoiceModal';

// Örnek Fatura Verileri
const invoices = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    customer: 'Ahmet Yılmaz',
    date: '15.06.2024',
    vat: '650.00 TL',
    total: '3250.00 TL',
    status: 'Ödendi',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    customer: 'Teknoloji A.Ş.',
    date: '20.05.2024',
    vat: '3560.10 TL',
    total: '17800.50 TL',
    status: 'Beklemede',
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    customer: 'Ayşe Kaya',
    date: '10.04.2024',
    vat: '240.00 TL',
    total: '1200.00 TL',
    status: 'Gecikti',
  },
  {
    id: '4',
    invoiceNumber: 'INV-2024-004',
    customer: 'Global Lojistik',
    date: '01.07.2024',
    vat: '150.00 TL',
    total: '750.00 TL',
    status: 'İade Edildi',
  },
];

// Durum etiketleri için renk belirleme
const getStatusChipColor = (status: string) => {
  switch (status) {
    case 'Ödendi':
      return 'success';
    case 'Beklemede':
      return 'warning';
    case 'Gecikti':
      return 'error';
    case 'İade Edildi':
      return 'info';
    default:
      return 'default';
  }
};

const SalesInvoicesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Paper sx={{ p: 3, m: 2, borderRadius: 2, boxShadow: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Satış Faturaları
        </Typography>
        <Box>
          <Button variant="contained" startIcon={<Add />} sx={{ mr: 1 }} onClick={() => setModalOpen(true)}>
            Fatura Ekle
          </Button>
          <Button variant="contained" color="secondary" startIcon={<Add />} onClick={() => navigate('/sales-invoices/create-return')}>
            İade Faturası Ekle
          </Button>
        </Box>
      </Box>

      <Accordion expanded={filtersOpen} onChange={() => setFiltersOpen(!filtersOpen)} sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<FilterList />}>
          <Typography>Filtrele</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
            <Grid container spacing={3} direction="column">
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  placeholder="Fatura No veya Müşteri Adı ile Ara"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Durum</InputLabel>
                  <Select
                    label="Durum"
                    defaultValue=""
                  >
                    <MenuItem value=""><em>Tümü</em></MenuItem>
                    <MenuItem value="Ödendi">Ödendi</MenuItem>
                    <MenuItem value="Beklemede">Beklemede</MenuItem>
                    <MenuItem value="Gecikti">Gecikti</MenuItem>
                    <MenuItem value="İade Edildi">İade Edildi</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Tarih Aralığı
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="Başlangıç Tarihi"
                      value={null}
                      onChange={() => {}}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="Bitiş Tarihi"
                      value={null}
                      onChange={() => {}}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="outlined">Filtreleri Temizle</Button>
              </Grid>
            </Grid>
          </LocalizationProvider>
        </AccordionDetails>
      </Accordion>

      <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Fatura No</TableCell>
              <TableCell>Müşteri</TableCell>
              <TableCell>Tarih</TableCell>
              <TableCell>KDV</TableCell>
              <TableCell>Tutar</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell align="right">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {invoice.invoiceNumber}
                </TableCell>
                <TableCell>{invoice.customer}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.vat}</TableCell>
                <TableCell>{invoice.total}</TableCell>
                <TableCell>
                  <Chip label={invoice.status} color={getStatusChipColor(invoice.status)} size="small" />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => navigate(`/sales-invoices/${invoice.id}`)} size="small">
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CreateSalesInvoiceModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Paper>
  );
};

export default SalesInvoicesListPage;
