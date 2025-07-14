import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import * as XLSX from 'xlsx';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextFieldProps,
  useTheme,
  Collapse,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import {
  Payment as PaymentIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  Print as PrintIcon,
  FileDownload as FileDownloadIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  ReceiptLong as ReceiptIcon,
  History as HistoryIcon,
  Description as DescriptionIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import ExportButton from '../components/common/ExportButton';

// Mock Data updated to match the image
const mockPaymentHistory = [
  {
    id: 1,
    date: '01.06.2025',
    type: 'paid',
    cashBank: 'Ana Kasa',
    amount: 1000.00,
    balance: 1000.00,
    user: 'Ahmet Yılmaz',
    description: 'Ofis malzemeleri alımı yapıldı.',
  },
  {
    id: 2,
    date: '15.06.2025',
    type: 'pending',
    cashBank: '-',
    amount: 1000.00,
    balance: 1000.00,
    user: 'Ayşe Kaya',
    description: 'Personel yemeği için avans ödemesi.',
  },
];

const mockAuditLog = [
  {
    id: 1,
    timestamp: '01.07.2024 13:00:00',
    user: 'Ahmet Durmaz',
    action: 'receiptCreated',
    details: 'Receipt for business trip to Ankara created.',
  },
  {
    id: 2,
    timestamp: '02.07.2024 17:30:00',
    user: 'Ayşe Yılmaz',
    action: 'paymentAdded',
    details: 'Payment of 1555.00 TRY added via Corporate Credit Card.',
  },
  {
    id: 3,
    timestamp: '02.07.2024 17:35:00',
    user: 'System',
    action: 'statusChanged',
    details: 'Status changed to Paid.',
  },
];

const mockDocuments = [
  { id: 1, name: 'flight-ticket.pdf', size: '120.56 KB' },
  { id: 2, name: 'hotel-receipt.jpg', size: '770.52 KB' },
];

// Helper to parse DD.MM.YYYY dates
const parseDateDDMMYYYY = (dateStr: string) => {
  if (!dateStr || dateStr.split('.').length !== 3) return null;
  const [day, month, year] = dateStr.split('.').map(Number);
  return new Date(year, month - 1, day);
};

const ExpenseReceiptDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [tabIndex, setTabIndex] = useState(0); // Default to 'Gider Bilgileri'
  const [documents, setDocuments] = useState(mockDocuments);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const handleSavePayment = () => {
    // TODO: Implement payment saving logic
    console.log('Payment saved');
    setPaymentDialogOpen(false);
  };

  const handleExport = () => {
    // The TS error indicates 'amount' is a number, so no parsing is needed.
    const totalAmount = mockPaymentHistory.reduce((sum, item) => sum + item.amount, 0);

    // The TS error indicates 'vat' and 'total' properties do not exist.
    // Map the available data to columns for the export.
    const dataForExport = mockPaymentHistory.map(item => ({
      'ID': item.id,
      'Tarih': item.date,
      'Tip': item.type,
      'Kasa/Banka': item.cashBank,
      'Açıklama': item.description,
      'Kullanıcı': item.user,
      'Tutar': item.amount,
      'Bakiye': item.balance,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExport);

    // Add total row
    XLSX.utils.sheet_add_aoa(worksheet, [['']], { origin: -1 }); // Add a blank row for spacing
    const totalRow = [['', '', '', '', '', 'Toplam Tutar', totalAmount.toFixed(2)]];
    XLSX.utils.sheet_add_aoa(worksheet, totalRow, { origin: -1 });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ödeme Geçmişi');
    XLSX.writeFile(workbook, 'odeme_gecmisi.xlsx');
  };

  const [filters, setFilters] = useState({
    type: 'all',
    cashBank: 'all',
    startDate: '',
    endDate: '',
  });

  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<(typeof mockPaymentHistory)[0] | null>(null);

  const handleOpenDetailDialog = (payment: (typeof mockPaymentHistory)[0]) => {
    setSelectedPayment(payment);
    setDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setSelectedPayment(null);
  };
  const [filteredHistory, setFilteredHistory] = useState(mockPaymentHistory);

  useEffect(() => {
    let data = [...mockPaymentHistory];

    if (filters.type !== 'all') {
      data = data.filter(item => item.type === filters.type);
    }

    if (filters.cashBank !== 'all') {
      data = data.filter(item => item.cashBank === filters.cashBank);
    }

    if (filters.startDate) {
      data = data.filter(item => {
        const itemDate = parseDateDDMMYYYY(item.date);
        return itemDate && itemDate >= new Date(filters.startDate);
      });
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setDate(endDate.getDate() + 1); // include the end date
      data = data.filter(item => {
        const itemDate = parseDateDDMMYYYY(item.date);
        return itemDate && itemDate < endDate;
      });
    }

    setFilteredHistory(data);
  }, [filters]);

  const handleDeleteDocument = (id: number) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>) => {
    const eventTarget = e.target as HTMLInputElement;
    setFilters({
      ...filters,
      [eventTarget.name as string]: eventTarget.value,
    });
  };

  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  const getStatusChip = (status: 'paid' | 'pending') => {
    const isPaid = status === 'paid';
    return (
      <Chip
        label={isPaid ? t('paid', 'Ödendi') : t('pending', 'Beklemede')}
        color={isPaid ? 'success' : 'warning'}
        size="small"
        sx={{ fontWeight: 'bold' }}
      />
    );
  };

  const subTotal = filteredHistory.reduce((acc, item) => acc + item.amount, 0);
  const vat = subTotal * 0.10; // Assuming 10% VAT as in the static example
  const grandTotal = subTotal + vat;

  return (
    <Box sx={{ p: 3 }}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" fontWeight="bold">
          {t('expenseDetails', 'Gider Detayları')}
        </Typography>
        <Box>
          <Button variant="contained" sx={{ mr: 1, backgroundColor: 'orange', '&:hover': { backgroundColor: '#e65100' } }} startIcon={<EditIcon />}>
            {t('edit', 'Düzenle')}
          </Button>
          <Button variant="contained" startIcon={<PaymentIcon />} sx={{ mr: 1 }} onClick={() => setPaymentDialogOpen(true)}>
            {t('payment', 'Ödeme')}
          </Button>
          <Button variant="contained" color="primary" sx={{ mr: 1 }} startIcon={<CancelIcon />}>
            {t('cancelIt', 'İptal Et')}
          </Button>
          <Button variant="contained" color="error" sx={{ mr: 1 }} startIcon={<DeleteIcon />}>
            {t('delete', 'Sil')}
          </Button>
          <ExportButton label={t('exportToExcel', "Excel'e Aktar")} onClick={handleExport} />
        </Box>
      </Box>

      {/* SEARCH BAR AND FILTER */}
      <Paper sx={{ p: 1, mb: 1 }} elevation={0} variant="outlined">
        <TextField
          fullWidth
          variant="standard"
          placeholder={t('searchByDescriptionOrReceiptNo', 'Açıklama veya Fiş No ile Ara...')}
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setFiltersVisible(!filtersVisible)}>
                  <FilterListIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Paper>
      <Collapse in={filtersVisible}>
        <Paper sx={{ p: 2, mb: 3 }} elevation={0} variant="outlined">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label={t('start_date', 'Başlangıç Tarihi')}
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label={t('end_date', 'Bitiş Tarihi')}
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>{t('type', 'Türü')}</InputLabel>
                <Select
                  label={t('type', 'Türü')}
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                >
                  <MenuItem value="all">{t('all', 'Tümü')}</MenuItem>
                  <MenuItem value="paid">{t('paid', 'Ödendi')}</MenuItem>
                  <MenuItem value="pending">{t('pending', 'Beklemede')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>{t('cash_bank', 'Kasa/Banka')}</InputLabel>
                <Select
                  label={t('cash_bank', 'Kasa/Banka')}
                  name="cashBank"
                  value={filters.cashBank}
                  onChange={handleFilterChange}
                >
                  <MenuItem value="all">{t('all', 'Tümü')}</MenuItem>
                  <MenuItem value="Ana Kasa">Ana Kasa</MenuItem>
                  <MenuItem value="Banka">Banka</MenuItem>
                  <MenuItem value="-">-</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      </Collapse>

      {/* TABS */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
          <Tab icon={<ReceiptIcon />} iconPosition="start" label={t('expenseInfo', 'Gider Bilgileri')} />
          <Tab icon={<HistoryIcon />} iconPosition="start" label={t('expenseHistory', 'Gider Geçmişi')} />
          <Tab icon={<DescriptionIcon />} iconPosition="start" label={t('documents', 'DÖKÜMANLAR')} />
        </Tabs>
      </Box>

      {/* TAB CONTENT */}
      {tabIndex === 0 && (
        <Paper elevation={0} variant="outlined">
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
                <TableRow>
                  <TableCell>{t('date', 'Tarih')}</TableCell>
                  <TableCell>{t('type', 'Türü')}</TableCell>
                  <TableCell>{t('cashAndBank', 'Kasa & Banka')}</TableCell>
                  <TableCell align="right">{t('amount', 'Tutar')}</TableCell>
                  <TableCell align="right">{t('balance', 'Bakiye')}</TableCell>
                  <TableCell align="center">{t('actions', 'İşlemler')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredHistory.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{getStatusChip(row.type as 'paid' | 'pending')}</TableCell>
                    <TableCell>{row.cashBank}</TableCell>
                    <TableCell align="right">{row.amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</TableCell>
                    <TableCell align="right">{row.balance.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</TableCell>
                    <TableCell align="center">
                      <Tooltip title={t('viewDetails', 'Detayları Görüntüle')}>
                        <IconButton size="small" onClick={() => handleOpenDetailDialog(row as (typeof mockPaymentHistory)[0])}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('delete', 'Sil')}>
                        <IconButton size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box p={3} display="flex" justifyContent="flex-end">
            <Box width={{ xs: '100%', sm: '50%', md: '350px' }}>
              <Grid container spacing={1}>
                <Grid item xs={6}><Typography align="right" variant="body1">{t('subtotal', 'ARA TOPLAM')}</Typography></Grid>
                <Grid item xs={6}><Typography align="right" variant="body1">{subTotal.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</Typography></Grid>
                <Grid item xs={6}><Typography align="right" variant="body1">{t('vat10', 'KDV (%10)')}</Typography></Grid>
                <Grid item xs={6}><Typography align="right" variant="body1">{vat.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</Typography></Grid>
                <Grid item xs={6}><Typography align="right" variant="h6">{t('grandTotal', 'GENEL TOPLAM')}</Typography></Grid>
                <Grid item xs={6}><Typography align="right" variant="h6">{grandTotal.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</Typography></Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      )}
      {tabIndex === 1 && (
        <Paper elevation={0} variant="outlined">
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
                <TableRow>
                  <TableCell>{t('date', 'Tarih')}</TableCell>
                  <TableCell>{t('user', 'Kullanıcı')}</TableCell>
                  <TableCell>{t('action', 'Eylem')}</TableCell>
                  <TableCell>{t('details', 'Detaylar')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockAuditLog.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.timestamp}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      {tabIndex === 2 && (
        <Paper elevation={0} variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('documents', 'Dökümanlar')}
          </Typography>
          <Box
            sx={{
              border: `2px dashed ${theme.palette.grey[400]}`,
              borderRadius: 1,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              mb: 3,
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 48, color: theme.palette.grey[600] }} />
            <Typography>
              {t('drag_and_drop_or_click', 'Dosyaları buraya sürükleyin veya tıklayın')}
            </Typography>
          </Box>
          <List>
            {documents.map((doc) => (
              <ListItem
                key={doc.id}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteDocument(doc.id)}>
                    <DeleteIcon />
                  </IconButton>
                }
                sx={{
                  backgroundColor: theme.palette.grey[50],
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': {
                    backgroundColor: theme.palette.grey[100],
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar>
                    <DescriptionIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={doc.name} secondary={doc.size} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onClose={handleCloseDetailDialog} fullWidth maxWidth="sm">
        <DialogTitle>{t('paymentDetails', 'Ödeme Detayları')}</DialogTitle>
        <DialogContent dividers>
          {selectedPayment && (
            <Grid container spacing={2} sx={{ p: 2 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">{t('employee', 'Çalışan')}</Typography>
                <Typography variant="body1">{selectedPayment.user}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">{t('date', 'Tarih')}</Typography>
                <Typography variant="body1">{selectedPayment.date}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">{t('description', 'Açıklama')}</Typography>
                <Typography variant="body1">{selectedPayment.description}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">{t('type', 'Türü')}</Typography>
                {getStatusChip(selectedPayment.type as 'paid' | 'pending')}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">{t('cashAndBank', 'Kasa & Banka')}</Typography>
                <Typography variant="body1">{selectedPayment.cashBank}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">{t('amount', 'Tutar')}</Typography>
                <Typography variant="body1">{selectedPayment.amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">{t('balance', 'Bakiye')}</Typography>
                <Typography variant="body1">{selectedPayment.balance.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailDialog}>{t('close', 'Kapat')}</Button>
        </DialogActions>
      </Dialog>

      {/* Add Payment Dialog */}
      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{t('addPayment', 'Ödeme Ekle')}</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>{t('plasiyer', 'Plasiyer')}</InputLabel>
                  <Select label={t('plasiyer', 'Plasiyer')} value="ahmet_durmaz">
                    <MenuItem value="ahmet_durmaz">Ahmet Durmaz</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={t('transactionDate', 'İşlem Tarihi')}
                    value={new Date('2025-07-06')}
                    onChange={() => {}}
                    renderInput={(params: TextFieldProps) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>{t('cashBank', 'Kasa / Banka')}</InputLabel>
                  <Select label={t('cashBank', 'Kasa / Banka')} value="main_safe">
                    <MenuItem value="main_safe">Ana Kasa (TL)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('amount', 'Tutar')}
                  defaultValue="0,00"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Select variant="standard" disableUnderline value="TRY">
                          <MenuItem value="TRY">₺</MenuItem>
                          <MenuItem value="USD">$</MenuItem>
                          <MenuItem value="EUR">€</MenuItem>
                        </Select>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
          <Button 
            onClick={() => setPaymentDialogOpen(false)} 
            variant="contained" 
            color="error" 
            startIcon={<CloseIcon />}
            sx={{ mr: 1 }}
          >
            {t('cancel', 'Vazgeç')}
          </Button>
          <Button 
            variant="contained" 
            color="success" 
            startIcon={<CheckIcon />}
          >
            {t('save', 'Kaydet')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExpenseReceiptDetailPage;
