import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  InputAdornment, 
  IconButton, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TableFooter,
  Chip, 
  Tooltip, 
  Collapse, 
  Grid, 
  FormControlLabel, 
  Checkbox, 
  Divider, 
  Badge,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
  FormLabel,
  FormGroup,
  Menu,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Search as SearchIcon, 
  FilterList as FilterListIcon, 
  PictureAsPdf as PdfIcon, 
  Download as DownloadIcon, 
  Visibility as VisibilityIcon,
  ExpandMore as ExpandMoreIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Input as InputIcon,
  SyncAlt as SyncAltIcon,
  GridOn as ExcelIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import tr from 'date-fns/locale/tr';
import { exportToExcel, exportToPdf } from '../utils/exportUtils';
import PaymentModal from '../components/modals/PaymentModal';

interface Transaction {
  id: number;
  date: string;
  customerCode: string;
  customerName: string;
  description: string;
  debit: number; // Base currency TL
  credit: number; // Base currency TL
  balance: number; // Base currency TL
  originalAmount: number;
  originalCurrency: 'TRY' | 'USD' | 'EUR';
}

const mockTransactions: Transaction[] = [
  { id: 1, date: '01.01.2023', customerCode: 'C001', customerName: 'Winfiniti AŞ', description: 'Mal Alımı (TL)', debit: 5000, credit: 0, balance: 5000, originalCurrency: 'TRY', originalAmount: 5000 },
  { id: 2, date: '02.01.2023', customerCode: 'C001', customerName: 'Winfiniti AŞ', description: 'Lisans Alımı (USD)', debit: 4050, credit: 0, balance: 9050, originalCurrency: 'USD', originalAmount: 135 },
  { id: 3, date: '03.01.2023', customerCode: 'C002', customerName: 'Teknoloji Market', description: 'Ekipman Satışı (EUR)', debit: 0, credit: 2475, balance: -2475, originalCurrency: 'EUR', originalAmount: 75 },
  { id: 4, date: '04.01.2023', customerCode: 'C003', customerName: 'Global Lojistik', description: 'Taşıma Gideri', debit: 1200, credit: 0, balance: 1200, originalCurrency: 'TRY', originalAmount: 1200 },
  { id: 5, date: '05.01.2023', customerCode: 'C001', customerName: 'Winfiniti AŞ', description: 'Hizmet Satışı (EUR)', debit: 0, credit: 3300, balance: 5750, originalCurrency: 'EUR', originalAmount: 100 },
  { id: 6, date: '06.01.2023', customerCode: 'C002', customerName: 'Teknoloji Market', description: 'Danışmanlık (USD)', debit: 6000, credit: 0, balance: 3525, originalCurrency: 'USD', originalAmount: 200 },
  { id: 7, date: '07.01.2023', customerCode: 'TK-9999', customerName: 'Yeni Müşteri', description: 'İlk İşlem', debit: 0, credit: 10000, balance: -10000, originalCurrency: 'TRY', originalAmount: 10000 },
];

const getStatusChipColor = (status: 'Borçlu' | 'Alacaklı' | 'Nötr') => {
  switch (status) {
    case 'Borçlu': return 'error';
    case 'Alacaklı': return 'success';
    case 'Nötr': return 'default';
    default: return 'default';
  }
};

const exchangeRates = { TRY: 1, USD: 30, EUR: 33 };
const currencySymbols = { TRY: '₺', USD: '$', EUR: '€' };

const CurrentAccountTransactionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isFiltersOpen, setFiltersOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('all');
  const [statusFilter, setStatusFilter] = useState<Record<string, boolean>>({
    Borçlu: false,
    Alacaklı: false,
    Nötr: false,
  });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenPaymentModal = () => {
    handleClose();
    setPaymentModalOpen(true);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatusFilter({ ...statusFilter, [event.target.name]: event.target.checked });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter({ Borçlu: false, Alacaklı: false, Nötr: false });
    setSelectedCurrency('all');
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery) count++;
    if (Object.values(statusFilter).some(v => v)) count++;
    return count;
  }, [searchQuery, statusFilter]);

  const filteredTransactions = useMemo(() => {
    const activeStatusFilters = Object.entries(statusFilter).filter(([, value]) => value).map(([key]) => key);
    return mockTransactions.filter((transaction) => {
      const searchMatch = !searchQuery || transaction.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || transaction.customerCode.toLowerCase().includes(searchQuery.toLowerCase());
      const status = transaction.balance > 0 ? 'Borçlu' : transaction.balance < 0 ? 'Alacaklı' : 'Nötr';
      const statusMatch = (
        Object.values(statusFilter).every(v => !v) ||
        statusFilter[status]
      );

      const currencyMatch = selectedCurrency === 'all' || transaction.originalCurrency === selectedCurrency;
      return searchMatch && statusMatch && currencyMatch;
    });
  }, [searchQuery, statusFilter, selectedCurrency]);

  const totals = useMemo(() => {
    if (selectedCurrency === 'all') {
      return filteredTransactions.reduce((acc, t) => {
        const { originalCurrency, debit, credit } = t;
        if (!acc[originalCurrency]) {
          acc[originalCurrency] = { totalDebit: 0, totalCredit: 0, balance: 0 };
        }
        acc[originalCurrency].totalDebit += debit;
        acc[originalCurrency].totalCredit += credit;
        acc[originalCurrency].balance = acc[originalCurrency].totalCredit - acc[originalCurrency].totalDebit;
        return acc;
      }, {} as Record<string, { totalDebit: number, totalCredit: number, balance: number }>);
    }
    
    const totalDebit = filteredTransactions.reduce((acc, t) => acc + t.debit, 0);
    const totalCredit = filteredTransactions.reduce((acc, t) => acc + t.credit, 0);
    const balance = totalCredit - totalDebit;
    return { totalDebit, totalCredit, balance };
  }, [filteredTransactions, selectedCurrency]);

  const handleExport = (format: 'excel' | 'pdf') => {
    const columns = [
      { field: 'date', header: 'Tarih' },
      { field: 'customerCode', header: 'Cari Kodu' },
      { field: 'customerName', header: 'Cari Adı' },
      { field: 'description', header: 'Açıklama' },
      { field: 'debit', header: 'Borç (TL)' },
      { field: 'credit', header: 'Alacak (TL)' },
      { field: 'balance', header: 'Bakiye (TL)' },
      { field: 'originalAmount', header: 'Orj. Tutar' },
    ];

    const reportData = filteredTransactions.map(t => ({
      ...t,
      originalAmount: `${t.originalAmount.toFixed(2)} ${t.originalCurrency}`,
    }));

    let summary = {};
    if (selectedCurrency !== 'all') {
      const totalsData = totals as { totalDebit: number; totalCredit: number; balance: number };
      summary = {
        description: 'Toplam',
        debit: totalsData.totalDebit.toFixed(2),
        credit: totalsData.totalCredit.toFixed(2),
        balance: totalsData.balance.toFixed(2),
      };
    } else {
      const totalsByCurrency = totals as Record<string, { totalDebit: number; totalCredit: number; balance: number }>;
      const debitTotals = Object.entries(totalsByCurrency).map(([cur, val]) => `${cur}: ${val.totalDebit.toFixed(2)}`).join(' | ');
      const creditTotals = Object.entries(totalsByCurrency).map(([cur, val]) => `${cur}: ${val.totalCredit.toFixed(2)}`).join(' | ');
      const balanceTotals = Object.entries(totalsByCurrency).map(([cur, val]) => `${cur}: ${val.balance.toFixed(2)}`).join(' | ');
      summary = {
        description: 'Genel Toplamlar',
        debit: debitTotals,
        credit: creditTotals,
        balance: balanceTotals,
      };
    }

    const fileName = 'Cari_Hareketler_Raporu';
    const title = 'Cari Hareketler Raporu';

    if (format === 'excel') {
      exportToExcel(reportData, columns, fileName, summary);
    } else {
      exportToPdf(reportData, columns, fileName, title, summary);
    }
  };

  const getFormattedCurrency = (amountInTl: number, targetCurrency: string) => {
    const rate = exchangeRates[targetCurrency as keyof typeof exchangeRates] || 1;
    const symbol = currencySymbols[targetCurrency as keyof typeof currencySymbols] || '₺';
    return `${symbol}${(amountInTl / rate).toFixed(2)}`;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
      <PaymentModal open={isPaymentModalOpen} onClose={() => setPaymentModalOpen(false)} />
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <Typography variant="h4" component="h1">Cari Hareketler</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>

            <Button variant="outlined" startIcon={<ExcelIcon />} onClick={() => handleExport('excel')}>Excel'e Aktar</Button>
            <Button variant="outlined" startIcon={<PdfIcon />} onClick={() => handleExport('pdf')}>PDF'e Aktar</Button>
          </Box>
        </Box>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Cari Adı veya Kodu ile Ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Tooltip title="Filtrele">
              <IconButton sx={{ ml: 2 }} onClick={() => setFiltersOpen(!isFiltersOpen)}>
                <Badge badgeContent={activeFiltersCount} color="error">
                  <FilterListIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          </Box>
          <Collapse in={isFiltersOpen} timeout="auto" unmountOnExit>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <FormControl component="fieldset" variant="standard">
                  <FormLabel component="legend">Duruma Göre Filtrele</FormLabel>
                  <FormGroup row>
                    <FormControlLabel
                      control={<Checkbox checked={statusFilter.Borçlu} onChange={handleStatusChange} name="Borçlu" />}
                      label="Borçlu"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={statusFilter.Alacaklı} onChange={handleStatusChange} name="Alacaklı" />}
                      label="Alacaklı"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={statusFilter.Nötr} onChange={handleStatusChange} name="Nötr" />}
                      label="Nötr"
                    />
                  </FormGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Para Birimi</InputLabel>
                  <Select
                    value={selectedCurrency}
                    label="Para Birimi"
                    onChange={(e: SelectChangeEvent) => setSelectedCurrency(e.target.value)}
                  >
                    <MenuItem value="all">Tümü</MenuItem>
                    <MenuItem value="TRY">TRY</MenuItem>
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Button variant="text" color="error" startIcon={<CloseIcon />} onClick={clearFilters}>Filtreleri Temizle</Button>
            </Grid>
          </Collapse>
        </Paper>

        <TableContainer component={Paper} sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Table sx={{ minWidth: 650 }} aria-label="current account transactions table" stickyHeader>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Cari Kodu</TableCell>
                <TableCell>Cari Adı</TableCell>
                <TableCell align="right">Tutar</TableCell>
                <TableCell align="center">Durum</TableCell>
                <TableCell align="center">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.customerCode}</TableCell>
                  <TableCell>{transaction.customerName}</TableCell>
                  <TableCell align="right" sx={{ color: transaction.debit > 0 ? 'error.main' : 'primary.main', fontWeight: '500' }}>
                    {selectedCurrency === 'all' 
                      ? `${currencySymbols[transaction.originalCurrency as keyof typeof currencySymbols]}${transaction.originalAmount.toFixed(2)}`
                      : getFormattedCurrency(transaction.debit || transaction.credit, selectedCurrency)
                    }
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontWeight: '500', color: transaction.balance < 0 ? 'error.main' : 'primary.main' }}>
                      {getFormattedCurrency(transaction.balance, selectedCurrency === 'all' ? transaction.originalCurrency : selectedCurrency)}
                    </Typography>
                    <Chip 
                      label={transaction.balance < 0 ? 'Borç Bakiye' : 'Alacak Bakiye'}
                      color={transaction.balance < 0 ? 'error' : 'primary'} 
                      size="small" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Hesap Detayları">
                      <IconButton onClick={() => navigate(`/account-details/${transaction.customerCode}?currency=${transaction.originalCurrency}`)}>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow sx={{ backgroundColor: 'grey.100' }}>
                <TableCell colSpan={2} style={{ borderBottom: "none" }} />
                <TableCell align="right" colSpan={3} style={{ borderBottom: "none" }}>
                  {selectedCurrency !== 'all' ? (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 4 }}>
                      <Typography variant="body1" fontWeight="bold">
                        Toplam Borç: <Typography component="span" color="error.main">{getFormattedCurrency((totals as any).totalDebit, selectedCurrency)}</Typography>
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        Toplam Alacak: <Typography component="span" color="warning.main">{getFormattedCurrency((totals as any).totalCredit, selectedCurrency)}</Typography>
                      </Typography>
                      <Typography variant="h6" fontWeight="bold">
                        Bakiye: <Typography component="span" color={(totals as any).balance >= 0 ? 'primary.main' : 'error.main'}>{getFormattedCurrency((totals as any).balance, selectedCurrency)}</Typography>
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      {Object.entries(totals).map(([currency, values]) => (
                        <Box key={currency} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 3, mb: 0.5 }}>
                          <Typography variant="subtitle2" fontWeight="bold">{currency}:</Typography>
                          <Typography variant="body2">
                            Borç: <Typography component="span" color="error.main" fontWeight="bold">{getFormattedCurrency(values.totalDebit, currency)}</Typography>
                          </Typography>
                          <Typography variant="body2">
                            Alacak: <Typography component="span" color="warning.main" fontWeight="bold">{getFormattedCurrency(values.totalCredit, currency)}</Typography>
                          </Typography>
                          <Typography variant="body1">
                            Bakiye: <Typography component="span" color={values.balance >= 0 ? 'primary.main' : 'error.main'} fontWeight="bold">{getFormattedCurrency(values.balance, currency)}</Typography>
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>
    </LocalizationProvider>
  );
};

export default CurrentAccountTransactionsPage;
