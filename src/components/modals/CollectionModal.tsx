import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  MenuItem,
  InputAdornment,
  IconButton,
  Tooltip
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import tr from 'date-fns/locale/tr';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface CollectionModalProps {
  open: boolean;
  onClose: () => void;
}

const currencySymbols: { [key: string]: string } = {
  'TL': '₺',
  'USD': '$',
  'EUR': '€',
};

const allAccounts = [
  { value: 'ana-kasa-tl', label: 'Ana Kasa', currency: 'TL' },
  { value: 'banka-hesabi-usd', label: 'Banka Hesabı', currency: 'USD' },
  { value: 'euro-kasasi', label: 'Euro Kasası', currency: 'EUR' },
  { value: 'dolar-kasasi', label: 'Dolar Kasası', currency: 'USD' },
];

const CollectionModal: React.FC<CollectionModalProps> = ({ open, onClose }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const dialogContentRef = useRef<HTMLDivElement>(null);
  const [selectedCurrency, setSelectedCurrency] = useState('TL');
  const [selectedAccount, setSelectedAccount] = useState('ana-kasa-tl');

  const handleCurrencyChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const currency = event.target.value as string;
    setSelectedCurrency(currency);
    const firstMatchingAccount = allAccounts.find(acc => acc.currency === currency);
    if (firstMatchingAccount) {
      setSelectedAccount(firstMatchingAccount.value);
    }
  };

  const filteredAccounts = allAccounts.filter(acc => acc.currency === selectedCurrency);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Nakit Tahsilat Ekle
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers ref={dialogContentRef}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>Para Birimi</Typography>
              <TextField select fullWidth value={selectedCurrency} onChange={handleCurrencyChange} variant="outlined" size="small">
                <MenuItem value="TL">TL</MenuItem>
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>Kasa/Hesap</Typography>
              <TextField select fullWidth value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)} variant="outlined" size="small">
                {filteredAccounts.map((account) => (
                  <MenuItem key={account.value} value={account.value}>
                    {`${account.label} (${account.currency})`}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>Tutar</Typography>
              <TextField fullWidth variant="outlined" size="small" InputProps={{
                endAdornment: <InputAdornment position="end">{currencySymbols[selectedCurrency]}</InputAdornment>
              }}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                Masraf
                <Tooltip title="Müşteriden kesilen komisyon vb. masraflar bu alana girilir.">
                  <InfoOutlinedIcon sx={{ fontSize: 14, ml: 0.5, color: 'text.secondary' }} />
                </Tooltip>
              </Typography>
              <TextField fullWidth variant="outlined" size="small" defaultValue="0,00" InputProps={{
                endAdornment: <InputAdornment position="end">{currencySymbols[selectedCurrency]}</InputAdornment>
              }}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>Tarih</Typography>
              <DatePicker
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                PopperProps={{ container: dialogContentRef.current }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Açıklama</Typography>
              <TextField fullWidth multiline rows={2} variant="outlined" size="small" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} variant="contained" color="error" startIcon={<CloseIcon />}>Vazgeç</Button>
          <Button onClick={onClose} variant="contained" color="primary">Ekle</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default CollectionModal;
