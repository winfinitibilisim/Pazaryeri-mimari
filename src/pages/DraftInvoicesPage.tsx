import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility,
  ExpandMore as ExpandMoreIcon,
  FilterList,
  Search,
} from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import tr from 'date-fns/locale/tr';

// Data types
interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  date: string;
  vat: number;
  amount: number;
  status: 'Taslak';
}

// Mock data
const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'TAS-2024-001',
    customer: 'Potansiyel Müşteri A',
    date: '2024-06-16',
    vat: 300.0,
    amount: 1500.0,
    status: 'Taslak',
  },
  {
    id: '2',
    invoiceNumber: 'TAS-2024-002',
    customer: 'Yeni Müşteri B',
    date: '2024-06-15',
    vat: 840.1,
    amount: 4200.5,
    status: 'Taslak',
  },
  {
    id: '3',
    invoiceNumber: 'TAS-2024-003',
    customer: 'Deneme Müşterisi C',
    date: '2024-06-14',
    vat: 170.0,
    amount: 850.0,
    status: 'Taslak',
  },
];

const getStatusChipColor = (status: 'Taslak'): 'default' => 'default';

const DraftInvoicesPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleClearFilters = () => {
    setSearchTerm('');
    setStartDate(null);
    setEndDate(null);
  };

  const filteredInvoices = useMemo(() => {
    return mockInvoices.filter(invoice => {
      const invoiceDate = new Date(invoice.date);
      const matchesSearchTerm =
        invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDateRange =
        (!startDate || invoiceDate >= startDate) &&
        (!endDate || invoiceDate <= endDate);
      return matchesSearchTerm && matchesDateRange;
    });
  }, [searchTerm, startDate, endDate]);

  return (
    <Paper sx={{ p: 3, m: 2, borderRadius: 2, boxShadow: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        mb={2}
      >
        <Typography variant="h4" gutterBottom>
          {t('draftInvoicesPage.title')}
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}>
              {t('draftInvoicesPage.addDraft')}
            </Button>
          </Box>
        </Box>

        <Accordion expanded={filtersOpen} onChange={() => setFiltersOpen(!filtersOpen)} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<FilterList />}>
            <Typography>{t('filter')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3} direction="column">
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder={t('draftInvoicesPage.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
                  <DatePicker
                    label={t('startDate')}
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
                  <DatePicker
                    label={t('endDate')}
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={handleClearFilters}>
                  {t('clearFilters')}
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>{t('invoiceNo')}</TableCell>
                <TableCell>{t('customer')}</TableCell>
                <TableCell>{t('date')}</TableCell>
                <TableCell>{t('vat')}</TableCell>
                <TableCell>{t('amount')}</TableCell>
                <TableCell>{t('status')}</TableCell>
                <TableCell align="right">{t('actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.customer}</TableCell>
                  <TableCell>{format(new Date(invoice.date), 'dd.MM.yyyy')}</TableCell>
                  <TableCell>{invoice.vat.toFixed(2)} TL</TableCell>
                  <TableCell>{invoice.amount.toFixed(2)} TL</TableCell>
                  <TableCell>
                    <Chip
                      label={t(invoice.status)}
                      color={getStatusChipColor(invoice.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/draft-invoices/${invoice.id}`)} // Navigate to the draft detail page
                    >
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  };

export default DraftInvoicesPage;
