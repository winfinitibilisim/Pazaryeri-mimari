import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSafes } from '../../../hooks/useSafes';
import { Safe } from '../../../types/Safe';
import { useParams } from 'react-router-dom';
import { exportToExcel, exportToPdf } from '../../../utils/exportUtils';
import {
  Box, Typography, Button, Paper, TextField, InputAdornment, Grid, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Chip, Accordion, AccordionSummary, AccordionDetails, FormControl, InputLabel, Select, SelectChangeEvent
} from '@mui/material';
import SafeTransactionTable from './SafeTransactionTable';
import { Download as DownloadIcon, Search as SearchIcon, ArrowDropDown as ArrowDropDownIcon, Add as AddIcon, Remove as RemoveIcon, InfoOutlined as InfoIcon, FilterList as FilterListIcon } from '@mui/icons-material';
import TransferModal from './TransferModal';
import AddMoneyInModal from './AddMoneyInModal';
import AddMoneyOutModal from './AddMoneyOutModal';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import tr from 'date-fns/locale/tr';

interface Transaction {
  id: number; date: string; type: 'Giriş' | 'Çıkış'; description: string; amount: number; balance: number; status: string;
}

const mockTransactions: Transaction[] = [
  { id: 1, date: '2023-10-27', type: 'Giriş', description: 'Satış Faturası #123', amount: 1500, balance: 6500, status: 'Tamamlandı' },
  { id: 2, date: '2023-10-26', type: 'Çıkış', description: 'Ofis Malzemeleri', amount: -200, balance: 5000, status: 'Tamamlandı' },
  { id: 3, date: '2023-10-25', type: 'Giriş', description: 'Hizmet Bedeli', amount: 500, balance: 5200, status: 'Beklemede' },
];

const formatCurrency = (amount: number, currency: string = 'TRY') => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency }).format(amount);
};

const SafeDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { getSafeById } = useSafes();

  const [safe, setSafe] = useState<Safe | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isInfoModalOpen, setInfoModalOpen] = useState(false);
  const [isTransferModalOpen, setTransferModalOpen] = useState(false);
  const [isAddMoneyInModalOpen, setAddMoneyInModalOpen] = useState(false);
  const [isAddMoneyOutModalOpen, setAddMoneyOutModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [transactionType, setTransactionType] = useState<string[]>([]);
  const [transactionStatus, setTransactionStatus] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchSafeDetails = async () => {
      if (id) {
        const fetchedSafe = await getSafeById(id);
        setSafe(fetchedSafe || null);
      }
    };
    fetchSafeDetails();
  }, [id, getSafeById]);

  const handleExport = (format: 'excel' | 'pdf') => {
    const columns = [
      { field: 'date', header: t('safes.transactionDate') },
      { field: 'type', header: t('safes.transactionType') },
      { field: 'description', header: t('safes.transactionDescription') },
      { field: 'amount', header: t('safes.transactionAmount') },
      { field: 'balance', header: t('safes.transactionBalance') },
      { field: 'status', header: t('safes.transactionStatus') },
    ];
    if (format === 'excel') {
      exportToExcel(mockTransactions, columns, `Kasa_${id}_Hareketleri`);
    } else {
      exportToPdf(mockTransactions, columns, `Kasa_${id}_Hareketleri`, `${t('safes.safeDetailTitle')} - ${safe?.name || ''}`);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleViewTransactionDetails = (transaction: Transaction) => setSelectedTransaction(transaction);
  const handleCloseTransactionDetails = () => setSelectedTransaction(null);

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'Tamamlandı': return <Chip label={t('safes.statusCompleted')} color="success" size="small" />;
      case 'Beklemede': return <Chip label={t('safes.statusPending')} color="warning" size="small" />;
      default: return <Chip label={status} size="small" />;
    }
  };

  const totalCredit = mockTransactions.filter(t => t.type === 'Giriş').reduce((sum, t) => sum + t.amount, 0);
  const totalDebit = mockTransactions.filter(t => t.type === 'Çıkış').reduce((sum, t) => sum + t.amount, 0);
  const summaryBalance = totalCredit + totalDebit;

  const filteredTransactions = React.useMemo(() => {
    return mockTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      if (startDate && transactionDate < startDate) return false;
      if (endDate && transactionDate > endDate) return false;
      if (transactionType.length > 0 && !transactionType.includes(transaction.type)) return false;
      if (transactionStatus.length > 0 && !transactionStatus.includes(transaction.status)) return false;
      if (searchText && !transaction.description.toLowerCase().includes(searchText.toLowerCase())) return false;
      return true;
    });
  }, [searchText, transactionType, transactionStatus, startDate, endDate]);

  return (
    <Paper sx={{ p: 3, m: 2, borderRadius: 2, boxShadow: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h5">{`${t('safes.safeDetailTitle')} - ${safe?.name || ''}`}</Typography>
          <IconButton onClick={() => setInfoModalOpen(true)} size="small" sx={{ ml: 1 }}><InfoIcon /></IconButton>
        </Box>
        <Box>
          <Button variant="contained" onClick={handleMenuClick} endIcon={<ArrowDropDownIcon />}>{t('safes.newTransaction')}</Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={() => { handleMenuClose(); setTransferModalOpen(true); }}><ListItemIcon><AddIcon fontSize="small" /></ListItemIcon><ListItemText>{t('safes.makeTransfer')}</ListItemText></MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); setAddMoneyInModalOpen(true); }}><ListItemIcon><AddIcon fontSize="small" /></ListItemIcon><ListItemText>{t('safes.addMoneyIn')}</ListItemText></MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); setAddMoneyOutModalOpen(true); }}><ListItemIcon><RemoveIcon fontSize="small" /></ListItemIcon><ListItemText>{t('safes.addMoneyOut')}</ListItemText></MenuItem>
          </Menu>
          <Button variant="outlined" startIcon={<DownloadIcon />} sx={{ ml: 1 }} onClick={() => handleExport('excel')}>{t('safes.exportToExcel')}</Button>
          <Button variant="outlined" startIcon={<DownloadIcon />} sx={{ ml: 1 }} onClick={() => handleExport('pdf')}>{t('safes.exportToPdf')}</Button>
        </Box>
      </Box>

      <Accordion expanded={filtersOpen} onChange={() => setFiltersOpen(!filtersOpen)} sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<FilterListIcon />}>
          <Typography>{t('common.filter')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField fullWidth label={t('common.search')} placeholder={t('safes.detailSearchPlaceholder')} variant="outlined" value={searchText} onChange={(e) => setSearchText(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>)}} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>{t('safes.transactionType')}</InputLabel>
                  <Select multiple value={transactionType} onChange={(e: SelectChangeEvent<string[]>) => setTransactionType(e.target.value as string[])} label={t('safes.transactionType')}>
                    <MenuItem value="Giriş">{t('safes.typeCredit')}</MenuItem>
                    <MenuItem value="Çıkış">{t('safes.typeDebit')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>{t('common.status')}</InputLabel>
                  <Select multiple value={transactionStatus} onChange={(e: SelectChangeEvent<string[]>) => setTransactionStatus(e.target.value as string[])} label={t('common.status')}>
                    <MenuItem value="Tamamlandı">{t('safes.statusCompleted')}</MenuItem>
                    <MenuItem value="Beklemede">{t('safes.statusPending')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker label={t('common.startDate')} value={startDate} onChange={setStartDate} renderInput={(params) => <TextField {...params} fullWidth />} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker label={t('common.endDate')} value={endDate} onChange={setEndDate} renderInput={(params) => <TextField {...params} fullWidth />} />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={() => { setTransactionType([]); setTransactionStatus([]); setStartDate(null); setEndDate(null); setSearchText(''); }}>{t('common.clearFilters')}</Button>
              </Grid>
            </Grid>
          </LocalizationProvider>
        </AccordionDetails>
      </Accordion>

      <SafeTransactionTable transactions={filteredTransactions} onViewDetails={handleViewTransactionDetails} />

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>{t('safes.generalBalanceSummary')}</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}><Typography>{t('safes.totalCredit')}:</Typography><Typography color="success.main">{formatCurrency(totalCredit)}</Typography></Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}><Typography>{t('safes.totalDebit')}:</Typography><Typography color="error.main">{formatCurrency(totalDebit)}</Typography></Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', mt: 2, borderTop: '1px solid #e0e0e0', pt: 1 }}><Typography variant="body1" sx={{ fontWeight: 'bold' }}>{t('safes.summaryBalance')}:</Typography><Typography variant="body1" sx={{ fontWeight: 'bold' }}>{formatCurrency(summaryBalance)}</Typography></Box>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={isInfoModalOpen} onClose={() => setInfoModalOpen(false)}>
        <DialogTitle>{t('safes.safeDetailTitle')}</DialogTitle>
        <DialogContent>{safe && <Box>{`ID: ${safe.id}`} <br /> {`${t('safes.safeName')}: ${safe.name}`} <br /> {`${t('safes.currency')}: ${safe.currency}`} <br /> {`${t('safes.balance')}: ${formatCurrency(safe.balance)}`} <br /> {`${t('common.status')}: ${safe.isActive ? t('common.active') : t('common.inactive')}`}</Box>}</DialogContent>
        <DialogActions><Button onClick={() => setInfoModalOpen(false)}>{t('common.close')}</Button></DialogActions>
      </Dialog>

      {selectedTransaction && (
        <Dialog open={true} onClose={handleCloseTransactionDetails} maxWidth="sm" fullWidth>
          <DialogTitle>{t('safes.transactionDetails')}</DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <Grid container spacing={1}>
                <Grid item xs={4}><Typography sx={{ fontWeight: 'bold' }}>{t('safes.transactionDate')}:</Typography></Grid><Grid item xs={8}><Typography>{new Date(selectedTransaction.date).toLocaleDateString('tr-TR')}</Typography></Grid>
                <Grid item xs={4}><Typography sx={{ fontWeight: 'bold' }}>{t('safes.transactionType')}:</Typography></Grid><Grid item xs={8}><Typography color={selectedTransaction.type === 'Giriş' ? 'success.main' : 'error.main'}>{selectedTransaction.type === 'Giriş' ? t('safes.typeCredit') : t('safes.typeDebit')}</Typography></Grid>
                <Grid item xs={4}><Typography sx={{ fontWeight: 'bold' }}>{t('safes.transactionDescription')}:</Typography></Grid><Grid item xs={8}><Typography>{selectedTransaction.description}</Typography></Grid>
                <Grid item xs={4}><Typography sx={{ fontWeight: 'bold' }}>{t('safes.transactionAmount')}:</Typography></Grid><Grid item xs={8}><Typography color={selectedTransaction.amount > 0 ? 'success.main' : 'error.main'}>{formatCurrency(selectedTransaction.amount)}</Typography></Grid>
                <Grid item xs={4}><Typography sx={{ fontWeight: 'bold' }}>{t('safes.transactionBalance')}:</Typography></Grid><Grid item xs={8}><Typography>{formatCurrency(selectedTransaction.balance)}</Typography></Grid>
                <Grid item xs={4}><Typography sx={{ fontWeight: 'bold' }}>{t('safes.transactionStatus')}:</Typography></Grid><Grid item xs={8}>{getStatusChip(selectedTransaction.status)}</Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions><Button onClick={handleCloseTransactionDetails}>{t('common.close')}</Button></DialogActions>
        </Dialog>
      )}

      <TransferModal open={isTransferModalOpen} onClose={() => setTransferModalOpen(false)} senderSafeId={id} />
      <AddMoneyInModal open={isAddMoneyInModalOpen} onClose={() => setAddMoneyInModalOpen(false)} safeId={id} />
      <AddMoneyOutModal open={isAddMoneyOutModalOpen} onClose={() => setAddMoneyOutModalOpen(false)} safeId={id} />
    </Paper>
  );
};

export default SafeDetailPage;
