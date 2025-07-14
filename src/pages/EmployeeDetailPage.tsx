import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tooltip,
  IconButton,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Description as DescriptionIcon,
  History as HistoryIcon,
  Receipt as ReceiptIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import ExportButton from '../components/common/ExportButton'; // Global ExportButton importu
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx'; // xlsx kütüphanesini import et
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import tr from 'date-fns/locale/tr';
import {
  Collapse,
  Grid,
  FormControlLabel,
  Checkbox,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

// Veri tipleri
interface HistoryLog {
  id: number;
  description: string;
  date: string;
}

interface AccountMovement {
  id: number;
  date: string;
  description: string;
  amount: number;
}

interface Transaction {
  id: number;
  description: string;
  date: string;
  amount: number;
  currency: 'TRY' | 'USD' | 'EUR';
  status: 'Ödendi' | 'Beklemede' | 'İptal Edildi';
  accountMovements: AccountMovement[];
}

interface FilterState {
  dateRange: [Date | null, Date | null];
  transactionType: string[];
  status: string[];
}

// Örnek veriler
const mockTransactions: Transaction[] = [
  {
    id: 1, description: 'Maaş Ödemesi - Haziran', date: '01.06.2025', amount: 5000, currency: 'TRY', status: 'Ödendi',
    accountMovements: [
      { id: 1, date: '01.06.2025', description: 'Maaş tahakkuk ettirildi', amount: 5000 },
      { id: 2, date: '01.06.2025', description: 'Banka hesabına transfer edildi', amount: -5000 },
    ]
  },
  {
    id: 2, description: 'Avans', date: '15.06.2025', amount: 1000, currency: 'TRY', status: 'Beklemede',
    accountMovements: [
      { id: 1, date: '15.06.2025', description: 'Avans talebi oluşturuldu', amount: 1000 },
    ]
  },
  { id: 3, description: 'Prim Ödemesi', date: '20.06.2025', amount: 2500, currency: 'TRY', status: 'Ödendi', accountMovements: [] },
  { id: 4, description: 'Yol Masrafı', date: '25.06.2025', amount: 300, currency: 'USD', status: 'İptal Edildi', accountMovements: [] },
];

const mockHistoryData: HistoryLog[] = [
  { id: 1, description: '20.000,00 TL tutarında maaş tanımlaması yapıldı', date: '03.07.2025 22:48' },
  { id: 2, description: 'İptal Edildi', date: '29.06.2025 08:21' },
  { id: 3, description: 'Oluşturuldu', date: '28.06.2025 15:04' },
];

const getStatusChipProps = (status: Transaction['status']) => {
  switch (status) {
    case 'Ödendi':
      return { label: 'Ödendi', color: 'success' as const };
    case 'Beklemede':
      return { label: 'Beklemede', color: 'warning' as const };
    case 'İptal Edildi':
      return { label: 'İptal Edildi', color: 'error' as const };
    default:
      return { label: 'Bilinmiyor', color: 'default' as const };
  }
};

const getActionChipProps = (statusText: string) => {
  if (statusText === 'Borç Ver') {
    return { label: 'Borç Ver', style: { backgroundColor: '#f50057', color: 'white' } };
  }
  if (statusText === 'Alacak Ver') {
    return { label: 'Alacak Ver', style: { backgroundColor: '#2e7d32', color: 'white' } };
  }
  return { label: statusText, color: 'default' as const };
}

const EmployeeDetailPage: React.FC = () => {
  const { t } = useTranslation();

  const [historyData, setHistoryData] = useState(mockHistoryData);

  const [isAddDefinitionDialogOpen, setIsAddDefinitionDialogOpen] = useState(false);
  const [definitionType, setDefinitionType] = useState('');
  const [definitionDescription, setDefinitionDescription] = useState('');

  const [isSalaryDialogOpen, setIsSalaryDialogOpen] = useState(false);
  const [salaryAmount, setSalaryAmount] = useState<number | ''>('');
  const [salaryCurrency, setSalaryCurrency] = useState('TRY');
  const [salaryEntitlementDate, setSalaryEntitlementDate] = useState<Date | null>(new Date());
  const [salaryDescription, setSalaryDescription] = useState('');
  const [salaryRecurrence, setSalaryRecurrence] = useState('none');
  const [salaryRecurrenceDay, setSalaryRecurrenceDay] = useState<number | ''>('');

  const [isAdvanceDialogOpen, setIsAdvanceDialogOpen] = useState(false);
  const [advanceAmount, setAdvanceAmount] = useState<number | ''>('');
  const [advanceCurrency, setAdvanceCurrency] = useState('TRY');
  const [advancePaymentDate, setAdvancePaymentDate] = useState<Date | null>(new Date());
  const [advanceDescription, setAdvanceDescription] = useState('');
  const [advanceCashAccount, setAdvanceCashAccount] = useState('');

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isTransactionDetailOpen, setIsTransactionDetailOpen] = useState(false);

  const handleOpenAddDefinitionDialog = () => setIsAddDefinitionDialogOpen(true);

  const handleCloseAddDefinitionDialog = () => {
    setIsAddDefinitionDialogOpen(false);
    setDefinitionType('');
    setDefinitionDescription('');
  };

  const handleSaveDefinition = () => {
    if (!definitionType || !definitionDescription) return;

    const newLog: HistoryLog = {
      id: historyData.length + 1,
      date: new Date().toLocaleString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).replace(',', ''),
      description: `${definitionType}: ${definitionDescription}`,
    };

    setHistoryData(prev => [newLog, ...prev]);
    handleCloseAddDefinitionDialog();
  };

  const handleOpenSalaryDialog = () => setIsSalaryDialogOpen(true);

  const handleCloseSalaryDialog = () => {
    setIsSalaryDialogOpen(false);
    setSalaryAmount('');
    setSalaryCurrency('TRY');
    setSalaryEntitlementDate(new Date());
    setSalaryDescription('');
    setSalaryRecurrence('none');
    setSalaryRecurrenceDay('');
  };

  const handleSaveSalary = () => {
    if (!salaryAmount || !salaryEntitlementDate) return;

    const formattedAmount = salaryAmount.toLocaleString('tr-TR', { style: 'currency', currency: salaryCurrency });
    const formattedDate = salaryEntitlementDate.toLocaleDateString('tr-TR');
    
    let description = `${formattedAmount} maaş tanımlandı. Hak Ediş Tarihi: ${formattedDate}.`;
    if (salaryDescription) {
      description += ` Açıklama: ${salaryDescription}.`;
    }
    if (salaryRecurrence !== 'none') {
      let recurrenceText = 'Tekrarlı ödeme: ';
      if (salaryRecurrence === 'daily') {
        recurrenceText += 'Her gün.';
      } else if (salaryRecurrence === 'weekly' && salaryRecurrenceDay) {
        recurrenceText += `Her hafta, ${salaryRecurrenceDay}. gün.`;
      } else if (salaryRecurrence === 'monthly' && salaryRecurrenceDay) {
        recurrenceText += `Her ayın ${salaryRecurrenceDay}. günü.`;
      }
      description += ` ${recurrenceText}`;
    }

    const newLog: HistoryLog = {
      id: historyData.length + 1,
      date: new Date().toLocaleString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).replace(',', ''),
      description: description,
    };

    setHistoryData(prev => [newLog, ...prev]);
    handleCloseSalaryDialog();
  };

  const handleOpenAdvanceDialog = () => setIsAdvanceDialogOpen(true);

  const handleCloseAdvanceDialog = () => {
    setIsAdvanceDialogOpen(false);
    setAdvanceAmount('');
    setAdvanceCurrency('TRY');
    setAdvancePaymentDate(new Date());
    setAdvanceDescription('');
    setAdvanceCashAccount('');
  };

  const handleSaveAdvance = () => {
    if (!advanceAmount || !advancePaymentDate || !advanceCashAccount) return;

    const formattedAmount = advanceAmount.toLocaleString('tr-TR', { style: 'currency', currency: advanceCurrency });
    const formattedDate = advancePaymentDate.toLocaleDateString('tr-TR');

    let description = `${formattedAmount} avans verildi. Kasa: ${advanceCashAccount}. Ödeme Tarihi: ${formattedDate}.`;
    if (advanceDescription) {
      description += ` Açıklama: ${advanceDescription}.`;
    }

    const newLog: HistoryLog = {
      id: historyData.length + 1,
      date: new Date().toLocaleString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).replace(',', ''),
      description: description,
    };

    setHistoryData(prev => [newLog, ...prev]);
    handleCloseAdvanceDialog();
  };

  const handleOpenTransactionDetail = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsTransactionDetailOpen(true);
  };

  const handleCloseTransactionDetail = () => {
    setIsTransactionDetailOpen(false);
    setSelectedTransaction(null);
  };

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([
    {
      name: '1.jpeg',
      size: 54385,
    } as File,
  ]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const handleRemoveFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(file => file.name !== fileName));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const [tabIndex, setTabIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [typeFilter, setTypeFilter] = useState<Record<string, boolean>>({
    'Avans': false,
    'Maaş Ödemesi': false,
    'Maaş': false,
  });
  const [statusFilter, setStatusFilter] = useState<Record<string, boolean>>({
    'Borç Ver': false,
    'Alacak Ver': false,
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<Record<string, boolean>>>) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setter(prev => ({ ...prev, [event.target.name]: event.target.checked }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setDateRange({ start: null, end: null });
    setTypeFilter({ 'Avans': false, 'Maaş Ödemesi': false, 'Maaş': false });
    setStatusFilter({ 'Borç Ver': false, 'Alacak Ver': false });
  };

  const filteredData = useMemo(() => {
    const activeTypeFilters = Object.entries(typeFilter).filter(([, value]) => value).map(([key]) => key);
    const activeStatusFilters = Object.entries(statusFilter).filter(([, value]) => value).map(([key]) => key);

    return mockTransactions.filter(item => {
      const searchMatch = 
        !searchQuery ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      const typeMatch = activeTypeFilters.length === 0 || activeTypeFilters.includes(item.description);
      const statusMatch = activeStatusFilters.length === 0 || activeStatusFilters.includes(item.status);

      const itemDate = new Date(item.date.split(' ')[0].split('.').reverse().join('-'));
      const { start, end } = dateRange;
      let dateMatch = true;
      if (start && end) {
        dateMatch = itemDate >= start && itemDate <= end;
      } else if (start) {
        dateMatch = itemDate >= start;
      } else if (end) {
        dateMatch = itemDate <= end;
      }

      return searchMatch && typeMatch && statusMatch && dateMatch;
    });
  }, [searchQuery, dateRange, typeFilter, statusFilter]);

  const activeFiltersCount = useMemo(() => {
    const typeCount = Object.values(typeFilter).filter(Boolean).length;
    const statusCount = Object.values(statusFilter).filter(Boolean).length;
    const dateCount = (dateRange.start ? 1 : 0) + (dateRange.end ? 1 : 0);
    return typeCount + statusCount + dateCount;
  }, [typeFilter, statusFilter, dateRange]);

  const handleExport = () => {
    let dataToExport: any[] = [];
    let worksheetName = 'data';
    let fileName = `${t('employeeAccountDetails', 'Çalışan Hesap Detayı')}.xlsx`;
    let columnWidths: { wch: number }[] = [];

    if (tabIndex === 0) { // Hesap Hareketleri
      worksheetName = t('accountMovements', 'Hesap Hareketleri');
      fileName = `${t('employeeAccountDetails', 'Çalışan Hesap Detayı')}_${worksheetName}.xlsx`;
      
      const dataForSheet = filteredData.map(item => ({
        [t('description', 'Açıklama')]: item.description,
        [t('date', 'Tarih')]: item.date,
        [t('amount', 'Tutar')]: item.amount,
        [t('currency', 'Para Birimi')]: item.currency,
        [t('status', 'Durum')]: item.status,
      }));

      const totals: Record<string, number> = filteredData.reduce((acc, item) => {
        const { currency, amount } = item;
        if (!acc[currency]) {
          acc[currency] = 0;
        }
        acc[currency] += amount;
        return acc;
      }, {} as Record<string, number>);

      if (Object.keys(totals).length > 0) {
        dataForSheet.push({
          [t('description', 'Açıklama')]: '',
          [t('date', 'Tarih')]: '',
          [t('amount', 'Tutar')]: '', // null yerine boş string kullanarak tip hatasını düzelt
          [t('currency', 'Para Birimi')]: '',
          [t('status', 'Durum')]: '',
        });
        
        Object.entries(totals).forEach(([currency, total]) => {
          dataForSheet.push({
            [t('description', 'Açıklama')]: `${t('total', 'TOPLAM')} (${currency})`,
            [t('date', 'Tarih')]: '',
            [t('amount', 'Tutar')]: total,
            [t('currency', 'Para Birimi')]: '',
            [t('status', 'Durum')]: '',
          });
        });
      }
      dataToExport = dataForSheet;
      columnWidths = [{ wch: 50 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];

    } else if (tabIndex === 1) { // Geçmiş
      worksheetName = t('history', 'Geçmiş');
      fileName = `${t('employeeAccountDetails', 'Çalışan Hesap Detayı')}_${worksheetName}.xlsx`;
      dataToExport = historyData.map(item => ({
        [t('description', 'Açıklama')]: item.description,
        [t('date', 'Tarih')]: item.date,
      }));
      columnWidths = [{ wch: 60 }, { wch: 25 }];

    } else if (tabIndex === 2) { // Belgeler
      worksheetName = t('documents', 'Belgeler');
      fileName = `${t('employeeAccountDetails', 'Çalışan Hesap Detayı')}_${worksheetName}.xlsx`;
      dataToExport = uploadedFiles.map(file => ({
        [t('fileName', 'Dosya Adı')]: file.name,
        [t('fileSizeKB', 'Boyut (KB)')]: (file.size / 1024).toFixed(2),
        [t('fileType', 'Dosya Tipi')]: file.type || t('notAvailable', 'Mevcut Değil'),
      }));
      columnWidths = [{ wch: 40 }, { wch: 20 }, { wch: 30 }];
    }

    if (dataToExport.length === 0) {
      console.warn("Dışa aktarılacak veri bulunmuyor.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    if (columnWidths.length > 0) {
      worksheet['!cols'] = columnWidths;
    }
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, worksheetName);
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        {/* Sayfa Başlığı ve Butonlar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1">
            {t('employeeAccountDetails', 'Çalışan Hesap Detayı')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={handleOpenAddDefinitionDialog}>{t('additionalDefinitions', 'Ek Tanımlar')}</Button>
            <Button variant="contained" onClick={handleOpenSalaryDialog}>{t('salaryDefinition', 'Maaş Tanımı')}</Button>
            <Button variant="contained" onClick={handleOpenAdvanceDialog}>{t('addAdvance', 'Avans Ekle')}</Button>
            <ExportButton onClick={handleExport} />
          </Box>
        </Box>

        {/* Arama ve Filtre */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={t('searchByDescriptionOrVoucherNo', 'Açıklama veya Fiş No ile Ara...')}
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
          <Tooltip title={t('filter', 'Filtrele')}>
            <IconButton sx={{ ml: 2 }} onClick={() => setFilterOpen(!filterOpen)}>
                <Badge badgeContent={activeFiltersCount} color="error">
                    <FilterListIcon />
                </Badge>
            </IconButton>
          </Tooltip>
        </Box>

        <Collapse in={filterOpen} timeout="auto" unmountOnExit>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2} alignItems="flex-start">
                {/* Tür Filtresi */}
                <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="subtitle2" gutterBottom>{t('type', 'Türü')}</Typography>
                    {Object.keys(typeFilter).map(key => (
                        <FormControlLabel
                            key={key}
                            control={<Checkbox checked={typeFilter[key]} onChange={handleFilterChange(setTypeFilter)} name={key} />}
                            label={t(key, key)}
                        />
                    ))}
                </Grid>
                {/* Durum Filtresi */}
                <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="subtitle2" gutterBottom>{t('status', 'Durum')}</Typography>
                    {Object.keys(statusFilter).map(key => (
                        <FormControlLabel
                            key={key}
                            control={<Checkbox checked={statusFilter[key]} onChange={handleFilterChange(setStatusFilter)} name={key} />}
                            label={t(key, key)}
                        />
                    ))}
                </Grid>
                {/* Tarih Filtresi */}
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>{t('dateRange', 'Tarih Aralığı')}</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <DatePicker
                                label={t('startDate', 'Başlangıç Tarihi')}
                                value={dateRange.start}
                                onChange={(newValue) => setDateRange(prev => ({ ...prev, start: newValue }))}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <DatePicker
                                label={t('endDate', 'Bitiş Tarihi')}
                                value={dateRange.end}
                                onChange={(newValue) => setDateRange(prev => ({ ...prev, end: newValue }))}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="text" color="error" startIcon={<CloseIcon />} onClick={clearFilters}>
                    {t('clearFilters', 'Filtreleri Temizle')}
                </Button>
            </Box>
        </Collapse>

        {/* Sekmeler */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabIndex} onChange={handleTabChange} aria-label="employee detail tabs">
            <Tab icon={<ReceiptIcon />} iconPosition="start" label={t('transactionInfo', 'İşlem Bilgileri')} />
            <Tab icon={<HistoryIcon />} iconPosition="start" label={t('transactionHistory', 'İşlem Geçmişi')} />
            <Tab icon={<DescriptionIcon />} iconPosition="start" label={t('documents', 'Dökümanlar')} />
          </Tabs>
        </Box>

        {/* İşlem Bilgileri Tablosu */}
        <TabPanel value={tabIndex} index={0}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>{t('date', 'Tarih')}</TableCell>
                  <TableCell>{t('type', 'Türü')}</TableCell>
                  <TableCell>{t('description', 'Açıklama')}</TableCell>
                  <TableCell align="right">{t('amount', 'Tutar')}</TableCell>
                  <TableCell align="right">{t('balance', 'Bakiye')}</TableCell>
                  <TableCell align="center">{t('status', 'Durum')}</TableCell>
                  <TableCell align="center">{t('actions', 'İşlemler')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>
                        <Chip {...getStatusChipProps(row.status)} size="small" />
                    </TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell align="right">{`${row.amount.toLocaleString('tr-TR', { style: 'currency', currency: row.currency })}`}</TableCell>
                    <TableCell align="right">{`${row.amount.toLocaleString('tr-TR', { style: 'currency', currency: row.currency })}`}</TableCell>
                    <TableCell align="center">
                        <Chip {...getActionChipProps(row.status)} size="small" />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title={t('viewDetails', 'Detay Gör')}>
                        <IconButton size="small" aria-label={t('viewDetails', 'Detay Gör')}
                          onClick={() => handleOpenTransactionDetail(row)}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Divider sx={{ my: 2 }} />
            {/* Bakiye Özeti */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Box sx={{ textAlign: 'right', minWidth: 250 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t('generalBalanceSummary', 'Genel Bakiye Özeti')}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="body2">{t('totalPaidSalary', 'Toplam Ödenen Maaş')}:</Typography>
                        <Typography variant="body2" sx={{ color: 'blue', fontWeight: 'bold' }}>2.000,00 TL</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="body2">{t('balance', 'Bakiye')}:</Typography>
                        <Typography variant="body2" sx={{ color: 'red', fontWeight: 'bold' }}>-65.000,00 TL</Typography>
                    </Box>
                </Box>
            </Box>
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <Box>
            <Typography variant="h6" gutterBottom sx={{mb: 2}}>
              {t('transactionHistory', 'İşlem Geçmişi')}
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{fontWeight: 'bold'}}>{t('description', 'Açıklama')}</TableCell>
                    <TableCell sx={{fontWeight: 'bold'}}>{t('date', 'Tarih')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historyData.map((log) => (
                    <TableRow key={log.id} hover>
                      <TableCell>{log.description}</TableCell>
                      <TableCell>{log.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>
        <TabPanel value={tabIndex} index={2}>
          <Typography variant="h6" gutterBottom>
            {t('employeeDetail.documents', 'Dökümanlar')}
          </Typography>
          <Box
            {...getRootProps()}
            sx={{
              border: `2px dashed ${isDragActive ? 'primary.main' : 'grey.400'}`,
              borderRadius: 1,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: isDragActive ? 'action.hover' : 'transparent',
              transition: 'background-color 0.2s ease-in-out, border-color 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              mb: 2,
            }}
          >
            <input {...getInputProps()} />
            <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.500', mb: 1 }} />
            <Typography>
              {isDragActive
                ? t('dropzone.prompt_active', 'Dosyaları buraya bırakın...')
                : t('dropzone.prompt', 'Dosyaları buraya sürükleyin veya tıklayın')}
            </Typography>
          </Box>
          <List>
            {uploadedFiles.map((file, index) => (
              <ListItem
                key={index}
                component={Paper}
                variant="outlined"
                sx={{ mb: 1 }}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveFile(file.name)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <FileIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={file.name}
                  secondary={`${(file.size / 1024).toFixed(2)} KB`}
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>
      </Paper>
      <Dialog open={isAddDefinitionDialogOpen} onClose={handleCloseAddDefinitionDialog} fullWidth maxWidth="sm">
        <DialogTitle>{t('addAdditionalDefinition', 'Ek Tanım Ekle')}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
            <InputLabel>{t('definitionType', 'Tanım Tipi')}</InputLabel>
            <Select
              value={definitionType}
              label={t('definitionType', 'Tanım Tipi')}
              onChange={(e) => setDefinitionType(e.target.value as string)}
            >
              <MenuItem value="Performans">{t('performance', 'Performans')}</MenuItem>
              <MenuItem value="İşe Geç Gelme">{t('lateArrival', 'İşe Geç Gelme')}</MenuItem>
              <MenuItem value="İzin">{t('leave', 'İzin')}</MenuItem>
              <MenuItem value="Not">{t('note', 'Not')}</MenuItem>
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            label={t('description', 'Açıklama')}
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={definitionDescription}
            onChange={(e) => setDefinitionDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDefinitionDialog}>{t('cancel', 'İptal')}</Button>
          <Button onClick={handleSaveDefinition} variant="contained">{t('save', 'Kaydet')}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isSalaryDialogOpen} onClose={handleCloseSalaryDialog} fullWidth maxWidth="sm">
        <DialogTitle>{t('salaryDefinition', 'Maaş Tanımı')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t('salaryAmount', 'Maaş Tutarı')}
            type="number"
            fullWidth
            variant="outlined"
            value={salaryAmount}
            onChange={(e) => setSalaryAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
            sx={{ mt: 2 }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>{t('currency', 'Para Birimi')}</InputLabel>
            <Select
              value={salaryCurrency}
              label={t('currency', 'Para Birimi')}
              onChange={(e) => setSalaryCurrency(e.target.value as string)}
            >
              <MenuItem value="TRY">TRY</MenuItem>
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="EUR">EUR</MenuItem>
            </Select>
          </FormControl>
          <DatePicker
            label={t('entitlementDate', 'Hak Ediş Tarihi')}
            value={salaryEntitlementDate}
            onChange={(newValue) => setSalaryEntitlementDate(newValue)}
            renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
          />
          <TextField
            margin="dense"
            label={t('description', 'Açıklama')}
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={salaryDescription}
            onChange={(e) => setSalaryDescription(e.target.value)}
          />
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel>{t('recurrence', 'Tekrarlama')}</InputLabel>
                <Select
                  value={salaryRecurrence}
                  label={t('recurrence', 'Tekrarlama')}
                  onChange={(e) => {
                    setSalaryRecurrence(e.target.value as string);
                    setSalaryRecurrenceDay('');
                  }}
                >
                  <MenuItem value="none">{t('noRecurrence', 'Tekrarlanmaz')}</MenuItem>
                  <MenuItem value="daily">{t('daily', 'Günlük')}</MenuItem>
                  <MenuItem value="weekly">{t('weekly', 'Haftalık')}</MenuItem>
                  <MenuItem value="monthly">{t('monthly', 'Aylık')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              {(salaryRecurrence === 'weekly' || salaryRecurrence === 'monthly') && (
                <TextField
                  margin="dense"
                  label={salaryRecurrence === 'weekly' ? t('dayOfWeek', 'Haftanın Günü (1-7)') : t('dayOfMonth', 'Ayın Günü (1-31)')}
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={salaryRecurrenceDay}
                  onChange={(e) => {
                    const value = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                    if (value === '' || (value >= 1 && (salaryRecurrence === 'weekly' ? value <= 7 : value <= 31))) {
                       setSalaryRecurrenceDay(value);
                    }
                  }}
                />
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSalaryDialog}>{t('cancel', 'İptal')}</Button>
          <Button onClick={handleSaveSalary} variant="contained">{t('save', 'Kaydet')}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isAdvanceDialogOpen} onClose={handleCloseAdvanceDialog} fullWidth maxWidth="sm">
        <DialogTitle>{t('addAdvance', 'Avans Ekle')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t('advanceAmount', 'Avans Tutarı')}
            type="number"
            fullWidth
            variant="outlined"
            value={advanceAmount}
            onChange={(e) => setAdvanceAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
            sx={{ mt: 2 }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>{t('currency', 'Para Birimi')}</InputLabel>
            <Select
              value={advanceCurrency}
              label={t('currency', 'Para Birimi')}
              onChange={(e) => setAdvanceCurrency(e.target.value as string)}
            >
              <MenuItem value="TRY">TRY</MenuItem>
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="EUR">EUR</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>{t('cashAccount', 'Kasa')}</InputLabel>
            <Select
              value={advanceCashAccount}
              label={t('cashAccount', 'Kasa')}
              onChange={(e) => setAdvanceCashAccount(e.target.value as string)}
            >
              <MenuItem value="Merkez Kasa">{t('mainSafe', 'Merkez Kasa')}</MenuItem>
              <MenuItem value="Banka Hesabı">{t('bankAccount', 'Banka Hesabı')}</MenuItem>
              <MenuItem value="Diğer">{t('other', 'Diğer')}</MenuItem>
            </Select>
          </FormControl>
          <DatePicker
            label={t('paymentDate', 'Ödeme Tarihi')}
            value={advancePaymentDate}
            onChange={(newValue) => setAdvancePaymentDate(newValue)}
            renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
          />
          <TextField
            margin="dense"
            label={t('description', 'Açıklama')}
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={advanceDescription}
            onChange={(e) => setAdvanceDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdvanceDialog}>{t('cancel', 'İptal')}</Button>
          <Button onClick={handleSaveAdvance} variant="contained">{t('save', 'Kaydet')}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isTransactionDetailOpen} onClose={handleCloseTransactionDetail} fullWidth maxWidth="md">
        <DialogTitle>{t('transactionDetails', 'İşlem Detayları')}</DialogTitle>
        {selectedTransaction && (
          <DialogContent>
            <Typography variant="h6" gutterBottom>{selectedTransaction.description}</Typography>
            <Typography variant="body1" gutterBottom>
              {t('date', 'Tarih')}: {selectedTransaction.date}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {t('amount', 'Tutar')}: {selectedTransaction.amount.toLocaleString('tr-TR', { style: 'currency', currency: selectedTransaction.currency })}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {t('status', 'Durum')}: {selectedTransaction.status}
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              {t('accountMovements', 'Hesap Hareketleri')}
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('date', 'Tarih')}</TableCell>
                    <TableCell>{t('description', 'Açıklama')}</TableCell>
                    <TableCell align="right">{t('amount', 'Tutar')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedTransaction.accountMovements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>{movement.date}</TableCell>
                      <TableCell>{movement.description}</TableCell>
                      <TableCell align="right">{movement.amount.toLocaleString('tr-TR', { style: 'currency', currency: selectedTransaction.currency })}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={handleCloseTransactionDetail}>{t('close', 'Kapat')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
    </LocalizationProvider>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default EmployeeDetailPage;
