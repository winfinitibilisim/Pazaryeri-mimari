import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import tr from 'date-fns/locale/tr';
import CreatePurchaseInvoiceModal from './purchase-invoices/CreatePurchaseInvoiceModal';

// Mock Data
const mockPurchaseInvoices = [
  {
    id: '1',
    invoiceNumber: 'ALIS-001',
    supplier: 'Tedarikçi A.Ş.',
    invoiceDate: '2023-10-26T10:00:00Z',
    dueDate: '2023-11-25T10:00:00Z',
    amount: 1500.0,
    vat: 270.0,
    status: 'paid',
  },
  {
    id: '2',
    invoiceNumber: 'ALIS-002',
    supplier: 'Bilişim Hizmetleri Ltd.',
    invoiceDate: '2023-10-28T14:30:00Z',
    dueDate: '2023-11-12T14:30:00Z',
    amount: 750.5,
    vat: 135.09,
    status: 'pending',
  },
  {
    id: '3',
    invoiceNumber: 'ALIS-003',
    supplier: 'Ofis Malzemeleri A.Ş.',
    invoiceDate: '2023-09-01T11:00:00Z',
    dueDate: '2023-10-01T11:00:00Z',
    amount: 320.0,
    vat: 57.6,
    status: 'overdue',
  },
];

type InvoiceStatus = 'paid' | 'pending' | 'overdue';

const getStatusChipColor = (status: InvoiceStatus) => {
  switch (status) {
    case 'paid':
      return 'success';
    case 'pending':
      return 'warning';
    case 'overdue':
      return 'error';
    default:
      return 'default';
  }
};

const statusOptions: InvoiceStatus[] = ['paid', 'pending', 'overdue'];

const PurchaseInvoicesPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState(mockPurchaseInvoices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value as string);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStartDate(null);
    setEndDate(null);
    setStatusFilter('');
  };

  const handleSaveInvoice = (newInvoiceData: { invoiceNumber: string; supplierName: string; date: string; dueDate: string }) => {
    console.log('Yeni Fatura Kaydedildi:', newInvoiceData);
    const newInvoice = {
      id: (invoices.length + 1).toString(),
      invoiceNumber: newInvoiceData.invoiceNumber,
      supplier: newInvoiceData.supplierName,
      invoiceDate: new Date(newInvoiceData.date).toISOString(),
      dueDate: new Date(newInvoiceData.dueDate).toISOString(),
      amount: 0, // No amount field in new modal
      vat: 0, // No vat field in new modal
      status: 'pending' as InvoiceStatus,
    };
    setInvoices((prev) => [newInvoice, ...prev]);
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.invoiceDate);
      const matchesSearchTerm =
        invoice.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDateRange =
        (!startDate || invoiceDate >= startDate) && (!endDate || invoiceDate <= endDate);
      const matchesStatus = statusFilter === '' || invoice.status === statusFilter;
      return matchesSearchTerm && matchesDateRange && matchesStatus;
    });
  }, [invoices, searchTerm, startDate, endDate, statusFilter]);

  return (
    <Paper sx={{ p: 3, m: 2, borderRadius: 2, boxShadow: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          {t('purchaseInvoicesPage.title')}
        </Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setIsModalOpen(true)}>
          {t('purchaseInvoicesPage.addInvoice')}
        </Button>
      </Box>

      <Accordion expanded={filtersOpen} onChange={() => setFiltersOpen(!filtersOpen)} sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<FilterListIcon />}>
          <Typography>{t('filter', 'Filtrele')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
            <Grid container spacing={3} direction="column">
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  placeholder={t('purchaseInvoicesPage.searchPlaceholder')}
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>{t('purchaseInvoicesPage.status')}</InputLabel>
                  <Select value={statusFilter} label={t('purchaseInvoicesPage.status')} onChange={handleStatusChange}>
                    <MenuItem value="">{t('all', 'Tümü')}</MenuItem>
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>{t(`purchaseInvoicesPage.${status}`)}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <DatePicker
                  label={t('startDate', 'Başlangıç Tarihi')}
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12}>
                <DatePicker
                  label={t('endDate', 'Bitiş Tarihi')}
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={handleClearFilters}>{t('clearFilters', 'Filtreleri Temizle')}</Button>
              </Grid>
            </Grid>
          </LocalizationProvider>
        </AccordionDetails>
      </Accordion>

      <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>{t('invoiceNo', 'Fatura No')}</TableCell>
              <TableCell>{t('supplier', 'Tedarikçi')}</TableCell>
              <TableCell>{t('date', 'Tarih')}</TableCell>
              <TableCell>{t('vat', 'KDV')}</TableCell>
              <TableCell>{t('amount', 'Tutar')}</TableCell>
              <TableCell>{t('status', 'Durum')}</TableCell>
              <TableCell align="right">{t('actions', 'İşlemler')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.supplier}</TableCell>
                  <TableCell>{format(new Date(invoice.invoiceDate), 'dd.MM.yyyy')}</TableCell>
                  <TableCell>{invoice.vat.toFixed(2)} TL</TableCell>
                  <TableCell>{invoice.amount.toFixed(2)} TL</TableCell>
                  <TableCell>
                    <Chip
                      label={t(`purchaseInvoicesPage.${invoice.status}`)}
                      color={getStatusChipColor(invoice.status as InvoiceStatus)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => navigate(`/purchase-invoices/${invoice.id}`)}>
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CreatePurchaseInvoiceModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveInvoice}
      />
    </Paper>
  );
};

export default PurchaseInvoicesPage;
