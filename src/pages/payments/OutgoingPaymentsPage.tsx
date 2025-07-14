import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FilterList as FilterListIcon,
  GridOn as ExcelIcon,
  PictureAsPdf as PdfIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { tr, enUS } from 'date-fns/locale';
import { Locale } from 'date-fns';
import NewOutgoingPaymentModal from '../../components/modals/NewOutgoingPaymentModal';

// Data types
interface OutgoingPayment {
  id: string;
  paymentNumber: string;
  supplier: string;
  date: string;
  amount: number;
  status: 'paid' | 'scheduled' | 'cancelled';
}

// Mock data
const mockPayments: OutgoingPayment[] = [
  { id: '1', paymentNumber: 'PAY-OUT-2024-001', supplier: 'Ofis Malzemeleri A.Ş.', date: '2024-06-25', amount: 1500.0, status: 'paid' },
  { id: '2', paymentNumber: 'PAY-OUT-2024-002', supplier: 'Yazılım Çözümleri Ltd.', date: '2024-07-01', amount: 8500.75, status: 'scheduled' },
  { id: '3', paymentNumber: 'PAY-OUT-2024-003', supplier: 'Reklam Ajansı', date: '2024-06-22', amount: 3200.0, status: 'cancelled' },
  { id: '4', paymentNumber: 'PAY-OUT-2024-004', supplier: 'Lojistik Hizmetleri', date: '2024-06-30', amount: 12000.0, status: 'scheduled' },
];

const getStatusChipColor = (status: 'paid' | 'scheduled' | 'cancelled') => {
  switch (status) {
    case 'paid': return 'success';
    case 'scheduled': return 'info';
    case 'cancelled': return 'error';
    default: return 'default';
  }
};

const statusOptions = ['paid', 'scheduled', 'cancelled'];

const OutgoingPaymentsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });

  const localeMap: { [key: string]: Locale } = { en: enUS, tr: tr };
  const [currentLocale, setCurrentLocale] = useState<Locale>(localeMap[i18n.language] || enUS);

  useEffect(() => {
    setCurrentLocale(localeMap[i18n.language] || enUS);
  }, [i18n.language]);

  const handleSavePayment = (data: any) => {
    setIsModalOpen(false);
    console.log('Saved Data:', data);
  };

  const handleStatusChange = (event: SelectChangeEvent<typeof statusFilter>) => {
    const { target: { value } } = event;
    setStatusFilter(typeof value === 'string' ? value.split(',') : value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter([]);
    setDateRange({ start: null, end: null });
  };

  const filteredPayments = useMemo(() => {
    return mockPayments.filter((payment) => {
      const searchMatch = !searchQuery ||
        payment.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.paymentNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const statusMatch = statusFilter.length === 0 || statusFilter.includes(payment.status);

      const paymentDate = new Date(payment.date);
      const { start, end } = dateRange;
      let dateMatch = true;
      if (start && end) {
        dateMatch = paymentDate >= start && paymentDate <= end;
      } else if (start) {
        dateMatch = paymentDate >= start;
      } else if (end) {
        dateMatch = paymentDate <= end;
      }

      return searchMatch && statusMatch && dateMatch;
    });
  }, [searchQuery, statusFilter, dateRange]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={currentLocale}>
      <Paper sx={{ p: 3, m: 2, borderRadius: 2, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" gutterBottom component="div">
            {t('outgoingPayments.title')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsModalOpen(true)}>
              {t('outgoingPayments.add_new_payment')}
            </Button>
            <Button variant="outlined" startIcon={<ExcelIcon />}>{t('common.export_excel')}</Button>
            <Button variant="outlined" startIcon={<PdfIcon />}>{t('common.export_pdf')}</Button>
          </Box>
        </Box>

        <Accordion expanded={filtersOpen} onChange={() => setFiltersOpen(!filtersOpen)} sx={{ mb: 2, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
          <AccordionSummary expandIcon={<FilterListIcon />} aria-controls="filters-content" id="filters-header">
            <Typography>{t('common.filters')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2} sx={{ flexDirection: 'column' }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder={t('outgoingPayments.search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>{t('outgoingPayments.status')}</InputLabel>
                  <Select
                    multiple
                    value={statusFilter}
                    onChange={handleStatusChange}
                    input={<OutlinedInput label={t('outgoingPayments.status')} />}
                    renderValue={(selected) => selected.map(s => t(`outgoingPayments.${s}`)).join(', ')}
                  >
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        <ListItemText primary={t(`outgoingPayments.${status}`)} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>{t('outgoingPayments.payment_date_range')}</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label={t('common.startDate')}
                      value={dateRange.start}
                      onChange={(newValue) => setDateRange({ ...dateRange, start: newValue })}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label={t('common.endDate')}
                      value={dateRange.end}
                      onChange={(newValue) => setDateRange({ ...dateRange, end: newValue })}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={clearFilters}>{t('common.clearFilters')}</Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
          <Table sx={{ minWidth: 650 }} aria-label="outgoing payments table">
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>{t('outgoingPayments.table.payment_no')}</TableCell>
                <TableCell>{t('outgoingPayments.table.supplier')}</TableCell>
                <TableCell>{t('outgoingPayments.table.date')}</TableCell>
                <TableCell>{t('outgoingPayments.table.amount')}</TableCell>
                <TableCell>{t('outgoingPayments.table.status')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{payment.paymentNumber}</TableCell>
                  <TableCell>{payment.supplier}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(payment.amount)}</TableCell>
                  <TableCell>
                    <Chip label={t(`outgoingPayments.${payment.status}`)} color={getStatusChipColor(payment.status)} size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={t('common.view')}><IconButton size="small" onClick={() => navigate(`/outgoing-payment-detail/${payment.id}`)}><VisibilityIcon /></IconButton></Tooltip>
                    <Tooltip title={t('common.edit')}><IconButton size="small"><EditIcon /></IconButton></Tooltip>
                    <Tooltip title={t('common.delete')}><IconButton size="small"><DeleteIcon /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <NewOutgoingPaymentModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSavePayment} />
    </LocalizationProvider>
  );
};

export default OutgoingPaymentsPage;
