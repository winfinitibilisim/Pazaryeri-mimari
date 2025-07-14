import React, { useState, useRef, useMemo } from 'react';
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
  IconButton
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import tr from 'date-fns/locale/tr';
import CloseIcon from '@mui/icons-material/Close';

interface AccountTransferModalProps {
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
  { value: 'ticari-hesap-tl', label: 'Ticari Hesap', currency: 'TL' },
];

const AccountTransferModal: React.FC<AccountTransferModalProps> = ({ open, onClose }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const dialogContentRef = useRef<HTMLDivElement>(null);
  const [senderAccount, setSenderAccount] = useState('');
  const [receiverAccount, setReceiverAccount] = useState('');
  const [amount, setAmount] = useState('');

  const senderAccountDetails = useMemo(() => allAccounts.find(acc => acc.value === senderAccount), [senderAccount]);
  const currency = senderAccountDetails?.currency || 'TL';

  const handleSenderChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newSender = event.target.value as string;
    setSenderAccount(newSender);
    if (receiverAccount === newSender) {
      setReceiverAccount('');
    }
    const newSenderDetails = allAccounts.find(acc => acc.value === newSender);
    const receiverDetails = allAccounts.find(acc => acc.value === receiverAccount);
    if (newSenderDetails && receiverDetails && newSenderDetails.currency !== receiverDetails.currency) {
        setReceiverAccount('');
    }
  };

  const availableReceiverAccounts = useMemo(() => {
    if (!senderAccountDetails) return [];
    return allAccounts.filter(acc => acc.currency === senderAccountDetails.currency && acc.value !== senderAccountDetails.value);
  }, [senderAccountDetails]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Hesaplar Arası Virman
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers ref={dialogContentRef}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>Gönderen Kasa/Hesap</Typography>
              <TextField select fullWidth value={senderAccount} onChange={handleSenderChange} variant="outlined" size="small">
                {allAccounts.map(account => (
                  <MenuItem key={account.value} value={account.value}>
                    {`${account.label} (${account.currency})`}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>Alıcı Kasa/Hesap</Typography>
              <TextField
                select
                fullWidth
                value={receiverAccount}
                onChange={(e) => setReceiverAccount(e.target.value)}
                variant="outlined"
                size="small"
                disabled={!senderAccount}
              >
                {availableReceiverAccounts.map((account) => (
                  <MenuItem key={account.value} value={account.value}>
                     {`${account.label} (${account.currency})`}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>Tutar</Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                disabled={!senderAccount}
                InputProps={{
                  endAdornment: <InputAdornment position="end">{currencySymbols[currency]}</InputAdornment>
                }}
              />
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
          <Button onClick={onClose} variant="contained" color="primary">Virman Yap</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default AccountTransferModal;
