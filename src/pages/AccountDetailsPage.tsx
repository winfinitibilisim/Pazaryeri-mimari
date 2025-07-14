import React, { useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputAdornment,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import {
  ArrowDropDown as ArrowDropDownIcon,
  CompareArrows as CompareArrowsIcon,
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterListIcon,
  GridOn as GridOnIcon,
  Input as InputIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import tr from 'date-fns/locale/tr';
import { mockCustomers as customers, transactions } from '../data/mockData';

const AccountDetailsPage: React.FC = () => {
  const { customerCode } = useParams<{ customerCode: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setTypeFilters(prev =>
      checked ? [...prev, name] : prev.filter(type => type !== name)
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStartDate(null);
    setEndDate(null);
    setTypeFilters([]);
  };

  const queryParams = new URLSearchParams(location.search);
  const selectedCurrency = queryParams.get('currency');

  const customer = useMemo(() => customers.find(c => c.code === customerCode), [customerCode]);
  const allCustomerTransactions = useMemo(() => transactions.filter(t => t.customerCode === customerCode), [customerCode]);

  const filteredTransactions = useMemo(() => {
    return allCustomerTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      
      const searchMatch = 
        !searchQuery ||
        transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.receiptNo.toLowerCase().includes(searchQuery.toLowerCase());
      
      const currencyMatch = !selectedCurrency || transaction.currency === selectedCurrency;

      const dateMatch =
        (!startDate || transactionDate >= new Date(new Date(startDate).setHours(0, 0, 0, 0))) &&
        (!endDate || transactionDate <= new Date(new Date(endDate).setHours(23, 59, 59, 999)));

      const typeMatch = typeFilters.length === 0 || typeFilters.includes(transaction.type);

      return searchMatch && currencyMatch && dateMatch && typeMatch;
    });
  }, [allCustomerTransactions, searchQuery, selectedCurrency, startDate, endDate, typeFilters]);

  const totals = useMemo(() => {
    const result = { borc: 0, alacak: 0, bakiye: 0 };

    filteredTransactions.forEach(transaction => {
        const { amount } = transaction;
        if (amount > 0) {
            result.borc += amount;
        } else {
            result.alacak += Math.abs(amount);
        }
    });
    
    result.bakiye = result.alacak - result.borc;

    return result;
  }, [filteredTransactions]);

  if (!customer) {
    return <Typography sx={{ p: 3 }}>Müşteri bulunamadı.</Typography>;
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#f9f9f9' }}>
      <Paper sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" fontWeight="bold">Hesap Hareketleri Detayları</Typography>
          <Box>
            <Button
              id="account-actions-button"
              aria-controls={open ? 'account-actions-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              variant="contained"
              onClick={handleClick}
              endIcon={<ArrowDropDownIcon />}
            >
              Hesap İşlemleri
            </Button>
            <Menu
              id="account-actions-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'account-actions-button',
              }}
            >
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <InputIcon fontSize="small" />
                </ListItemIcon>
                Tahsilat Talep Et
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <CompareArrowsIcon fontSize="small" />
                </ListItemIcon>
                Hesaplar Arası Virman
              </MenuItem>
            </Menu>
            <Button variant="outlined" startIcon={<GridOnIcon />} sx={{ ml: 1 }}>Excel'e Aktar</Button>
            <Button variant="outlined" startIcon={<PictureAsPdfIcon />} sx={{ ml: 1 }}>PDF'e Aktar</Button>
          </Box>
        </Box>

        {/* Filter Accordion */}
        <Accordion sx={{ mb: 2, border: '1px solid rgba(0, 0, 0, 0.12)', boxShadow: 'none' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <FilterListIcon sx={{ mr: 1 }} />
            <Typography>Filtrele</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Açıklama veya Fiş No ile Ara..."
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
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>İşlem Türü</Typography>
                <FormGroup row>
                  <FormControlLabel
                    control={<Checkbox checked={typeFilters.includes('Giriş')} onChange={handleTypeChange} name="Giriş" />}
                    label="Giriş"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={typeFilters.includes('Çıkış')} onChange={handleTypeChange} name="Çıkış" />}
                    label="Çıkış"
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>Tarih Aralığı</Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Başlangıç Tarihi"
                        value={startDate}
                        onChange={setStartDate}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Bitiş Tarihi"
                        value={endDate}
                        onChange={setEndDate}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </Grid>
                  </Grid>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={handleClearFilters}>
                  Filtreleri Temizle
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Customer Info */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">{customer.name}</Typography>
          <Typography variant="body2" color="text.secondary">Cari Kodu: {customer.code}</Typography>
        </Box>

        {/* Transactions Table */}
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Tarih</TableCell>
                <TableCell>Fiş No</TableCell>
                <TableCell>Türü</TableCell>
                <TableCell>Açıklama</TableCell>
                <TableCell align="right">Tutar</TableCell>
                <TableCell align="right">Bakiye</TableCell>
                <TableCell>Durum</TableCell>
                <TableCell>İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.receiptNo}</TableCell>
                  <TableCell>
                    <Chip 
                      label={transaction.type} 
                      size="small"
                      color={transaction.type === 'Giriş' ? 'success' : 'error'}
                      sx={{ color: 'white', backgroundColor: transaction.type === 'Giriş' ? 'green' : 'red' }}
                    />
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell align="right">{Math.abs(transaction.amount).toLocaleString('tr-TR', { style: 'currency', currency: transaction.currency })}</TableCell>
                  <TableCell align="right">{transaction.balance.toLocaleString('tr-TR', { style: 'currency', currency: transaction.currency })}</TableCell>
                  <TableCell>
                    <Chip 
                      label={transaction.status} 
                      size="small"
                      variant="outlined"
                      color={transaction.status === 'Alacağı Var' ? 'primary' : 'error'}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => navigate(`/collection-detail/${transaction.id}`)}>
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer Summary */}
        <Grid container justifyContent="flex-end" sx={{ mt: 3 }}>
            <Grid item>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 1, justifyContent: 'flex-end', p: 2, backgroundColor: '#f0f0f0', borderRadius: 1 }}>
                    <Typography variant="body1">
                        Toplam Borç: <Typography component="span" sx={{ color: 'red', fontWeight: 'bold' }}>{totals.borc.toLocaleString('tr-TR', { style: 'currency', currency: selectedCurrency || 'TRY' })}</Typography>
                    </Typography>
                    <Typography variant="body1">
                        Toplam Alacak: <Typography component="span" sx={{ color: 'green', fontWeight: 'bold' }}>{totals.alacak.toLocaleString('tr-TR', { style: 'currency', currency: selectedCurrency || 'TRY' })}</Typography>
                    </Typography>
                    <Typography variant="body1">
                        Bakiye: <Typography component="span" sx={{ color: totals.bakiye >= 0 ? 'blue' : 'red', fontWeight: 'bold' }}>{totals.bakiye.toLocaleString('tr-TR', { style: 'currency', currency: selectedCurrency || 'TRY' })}</Typography>
                    </Typography>
                </Box>
            </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AccountDetailsPage;

