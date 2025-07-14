import React, { useState, useMemo, useCallback } from 'react';
import { 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography, 
  Chip, 
  Tooltip, 
  IconButton as MuiIconButton,
  Grid,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useExpenseReceipts, ExpenseReceipt } from 'hooks/useExpenseReceipts';

import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Add as AddIcon, FileDownload as FileDownloadIcon, PictureAsPdf as PictureAsPdfIcon, Search as SearchIcon, FilterList as FilterListIcon, Visibility } from '@mui/icons-material';

interface Column {
  id: 'receiptNumber' | 'date' | 'description' | 'amount' | 'status' | 'actions';
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: number) => string;
}

const ExpenseReceiptList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { receipts: expenseReceipts = [] } = useExpenseReceipts();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [accordionExpanded, setAccordionExpanded] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const columns: readonly Column[] = [
    { id: 'receiptNumber', label: t('common.receiptNumber', 'Fiş No'), minWidth: 120 },
    { id: 'date', label: t('common.date', 'Tarih'), minWidth: 120 },
    { id: 'description', label: t('common.description', 'Açıklama'), minWidth: 250 },
    {
      id: 'amount',
      label: t('common.amount', 'Tutar'),
      minWidth: 120,
      align: 'right',
      format: (value: number) => `${value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}`,
    },
    { id: 'status', label: t('common.status', 'Durum'), minWidth: 120, align: 'center' },
    { id: 'actions', label: t('common.actions', 'İşlemler'), minWidth: 80, align: 'center' },
  ];

  const filteredReceipts = useMemo(() => {
    return expenseReceipts.filter((receipt: ExpenseReceipt) => {
      const matchSearchTerm = 
        receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.description.toLowerCase().includes(searchTerm.toLowerCase());

      const receiptDate = new Date(receipt.date);
      const matchStartDate = startDate ? receiptDate >= startDate : true;
      const matchEndDate = endDate ? receiptDate <= endDate : true;

      return matchSearchTerm && matchStartDate && matchEndDate;
    });
  }, [expenseReceipts, searchTerm, startDate, endDate]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setStartDate(null);
    setEndDate(null);
  };

  const exportToExcel = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(filteredReceipts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Gider Fişleri');
    XLSX.writeFile(workbook, 'gider_fisleri.xlsx');
  }, [filteredReceipts]);

  const exportToPDF = useCallback(() => {
    const doc = new jsPDF();
    const tableColumn = columns.filter(col => col.id !== 'actions').map(col => col.label);
    const tableRows: (string | number)[][] = [];

    filteredReceipts.forEach(receipt => {
      const receiptData = columns
        .filter(col => col.id !== 'actions')
        .map(col => {
          const value = receipt[col.id as keyof Omit<ExpenseReceipt, 'actions'>];
          if (col.format && typeof value === 'number') {
            return col.format(value);
          }
          return value;
        });
      tableRows.push(receiptData as (string | number)[]);
    });

    (doc as any).autoTable({ head: [tableColumn], body: tableRows });
    doc.save('gider_fisleri.pdf');
  }, [filteredReceipts, columns]);

  const getStatusChip = (status: 'paid' | 'pending' | 'cancelled') => {
    const statusProps = {
      paid: { label: t('status.paid', 'Ödendi'), color: 'success' as const },
      pending: { label: t('status.pending', 'Beklemede'), color: 'warning' as const },
      cancelled: { label: t('status.cancelled', 'İptal Edildi'), color: 'error' as const },
    };
    const { label, color } = statusProps[status] || { label: status, color: 'default' as const };
    return <Chip label={label} color={color} size="small" />;
  };

  return (
    <Paper sx={{ p: 3, m: 2, borderRadius: 2, boxShadow: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('receipt.expenseReceipts', 'Gider Fişleri')}
        </Typography>
        <Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => setAddDialogOpen(true)} 
            sx={{ mr: 1 }}
          >
            Gider Fişi Ekle
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<FileDownloadIcon />} 
            onClick={exportToExcel} 
            sx={{ mr: 1 }}
          >
            {t('common.exportToExcel', 'Excel\'e Aktar')}
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<PictureAsPdfIcon />} 
            onClick={exportToPDF}
          >
            {t('common.exportToPdf', 'PDF\'e Aktar')}
          </Button>
        </Box>
      </Box>

      <Accordion expanded={accordionExpanded} onChange={() => setAccordionExpanded(!accordionExpanded)} sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<FilterListIcon />}>
          <Typography>{t('common.filter', 'Filtrele')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={3} direction="column">
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  placeholder={t('common.search', 'Ara')}
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
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Tarih Aralığı
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label={t('common.startDate', 'Başlangıç Tarihi')}
                      value={startDate}
                      onChange={setStartDate}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label={t('common.endDate', 'Bitiş Tarihi')}
                      value={endDate}
                      onChange={setEndDate}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={handleClearFilters}>
                  {t('common.clearFilters', 'Filtreleri Temizle')}
                </Button>
              </Grid>
            </Grid>
          </LocalizationProvider>
        </AccordionDetails>
      </Accordion>

      <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, fontWeight: 'bold' }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReceipts.map((receipt) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={receipt.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                {columns.map((column) => {
                  const value = receipt[column.id as keyof Omit<ExpenseReceipt, 'items' | 'history' | 'documents'>];
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.id === 'status' ? (
                        getStatusChip(receipt.status as 'paid' | 'pending' | 'cancelled')
                      ) : column.id === 'actions' ? (
                        <Tooltip title={t('common.viewDetails', 'Detayları Görüntüle')}>
                          <MuiIconButton onClick={() => navigate(`/expense-receipts/${receipt.id}`)} size="small">
                            <Visibility />
                          </MuiIconButton>
                        </Tooltip>
                      ) : column.format && typeof value === 'number' ? (
                        column.format(value)
                      ) : (typeof value === 'string' || typeof value === 'number') ? (
                        value
                      ) : null}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 2 }}>
          <Typography variant="h6">{t('addExpenseReceipt', 'Gider Fişi Ekle')}</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box component="form" noValidate autoComplete="off">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField fullWidth label={t('receiptNumber', 'Fiş Numarası')} variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label={t('plastiyer', 'Plastiyer')} variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={t('receiptOrInvoiceDate', 'Makbuz veya Fatura Tarihi')}
                    value={null}
                    onChange={() => {}}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>{t('expenseItems', 'Harcama Kalemleri')} *</InputLabel>
                  <Select label={t('expenseItems', 'Harcama Kalemleri')} >
                    <MenuItem value=""><em>{t('select', 'Seçiniz')}</em></MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>{t('tax', 'Vergi')}</InputLabel>
                  <Select label={t('tax', 'Vergi')}>
                    <MenuItem value=""><em>{t('select', 'Seçiniz')}</em></MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label={t('amount', 'Miktar') + ' *'} 
                  variant="outlined"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">TRY (₺)</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label={t('amountIncludingTax', 'Vergi Dahil Miktar')}
                  variant="outlined"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">TRY (₺)</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>{t('paymentType', 'Ödeme Tipi')} *</InputLabel>
                  <Select label={t('paymentType', 'Ödeme Tipi')} defaultValue="employeePaid">
                    <MenuItem value="employeePaid">{t('employeePaid', 'Çalışan Ödedi')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={t('paymentDate', 'Ödeme Tarihi')}
                    value={null}
                    onChange={() => {}}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>{t('employee', 'Employee')}</InputLabel>
                  <Select label={t('employee', 'Employee')}>
                     <MenuItem value=""><em>{t('select', 'Seçiniz')}</em></MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label={t('description', 'Açıklama')} multiline rows={3} variant="outlined" />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'flex-end' }}>
          <Button onClick={() => setAddDialogOpen(false)} variant="contained" sx={{ bgcolor: 'error.main', '&:hover': { bgcolor: 'error.dark' }, mr: 1 }}>{t('cancel', 'Vazgeç')}</Button>
          <Button variant="contained" disabled sx={{ bgcolor: 'grey.400' }}>{t('save', 'Kaydet')}</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ExpenseReceiptList;
