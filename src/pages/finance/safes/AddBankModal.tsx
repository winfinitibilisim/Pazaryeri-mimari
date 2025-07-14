import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  IconButton,
  Typography,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Close as CloseIcon } from '@mui/icons-material';
import { Safe, Currency } from '../../../types/Safe';

interface AddBankModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (bankData: Partial<Safe>) => void;
  initialData: Safe | null;
}

// Mock data for dropdowns - replace with actual data fetching later
const banks = [{ id: '0046', name: '0046 - Akbank T.A.Ş.' }];
const branches = [{ id: '1', name: 'Merkez Şube' }];
const countries = [{ code: 'TR', name: 'Türkiye' }];
const currencies = [
  { value: 'TRY', label: '₺' },
  { value: 'USD', label: '$' },
  { value: 'EUR', label: '€' },
];

const AddBankModal: React.FC<AddBankModalProps> = ({ open, onClose, onSave, initialData }) => {
    const { t } = useTranslation();
  const isEditMode = Boolean(initialData);

  // State for all form fields
  const [accountType, setAccountType] = useState('normal');
  const [accountName, setAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [openingBalance, setOpeningBalance] = useState('');
  const [currency, setCurrency] = useState<Currency>('TRY');
  const [branch, setBranch] = useState('');
  const [openingDate, setOpeningDate] = useState(new Date().toISOString().split('T')[0]);
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [countryCode, setCountryCode] = useState('TR');
  const [iban, setIban] = useState('');

  React.useEffect(() => {
    if (initialData) {
      setAccountName(initialData.name);
      setBankName(initialData.bankName || '');
      setOpeningBalance(String(initialData.balance));
      setCurrency(initialData.currency);
      setBranch(initialData.branch || '');
      setOpeningDate(initialData.openingDate || new Date().toISOString().split('T')[0]);
      setAccountHolder(initialData.accountHolder || '');
      setAccountNumber(initialData.accountNumber || '');
      setCountryCode(initialData.countryCode || 'TR');
      setIban(initialData.iban || '');
    } else {
      // Reset form for new entry
      setAccountName('');
      setBankName('');
      setOpeningBalance('');
      setCurrency('TRY');
      setBranch('');
      setOpeningDate(new Date().toISOString().split('T')[0]);
      setAccountHolder('');
      setAccountNumber('');
      setCountryCode('TR');
      setIban('');
    }
  }, [initialData]);

    const handleSave = () => {
    const bankData: Partial<Safe> = {
      ...initialData,
      id: initialData?.id,
      type: 'bank',
      name: accountName,
      bankName,
      balance: parseFloat(openingBalance) || 0,
      currency,
      branch,
      openingDate,
      accountHolder,
      accountNumber,
      countryCode,
      iban,
    };
    onSave(bankData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {isEditMode ? t('safes.editBankTitle', 'Bankayı Düzenle') : t('safes.addBankTitle')}
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ p: 2 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">{t('safes.selectAccountTypePrompt')}</FormLabel>
            <RadioGroup row value={accountType} onChange={(e) => setAccountType(e.target.value)}>
              <FormControlLabel value="normal" control={<Radio />} label={t('safes.accountTypeNormal')} />
              <FormControlLabel value="swap" control={<Radio />} label={t('safes.accountTypeSwap')} />
              <FormControlLabel value="creditCard" control={<Radio />} label={t('safes.accountTypeCreditCard')} />
            </RadioGroup>
          </FormControl>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Left Column */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>{t('safes.accountNameLabel')}</Typography>
              <TextField fullWidth variant="outlined" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
              
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>{t('safes.openingBalanceAndCurrencyLabel')}</Typography>
              <Grid container spacing={1}>
                <Grid item xs={8}>
                  <TextField fullWidth type="number" variant="outlined" value={openingBalance} onChange={(e) => setOpeningBalance(e.target.value)} placeholder="0,00"/>
                </Grid>
                <Grid item xs={4}>
                                    <TextField select fullWidth variant="outlined" value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
                    {currencies.map(c => <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>)}
                  </TextField>
                </Grid>
              </Grid>

              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>{t('safes.openingBalanceDateLabel')}</Typography>
              <TextField fullWidth type="date" variant="outlined" value={openingDate} onChange={(e) => setOpeningDate(e.target.value)} />
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>{t('safes.bankNameLabel')}</Typography>
              <TextField 
                select 
                fullWidth 
                variant="outlined" 
                value={bankName} 
                onChange={(e) => setBankName(e.target.value)} 
                SelectProps={{ displayEmpty: true }}
              >
                 <MenuItem value="" disabled>{t('safes.selectPlaceholder')}</MenuItem>
                 {banks.map(b => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
              </TextField>

              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>{t('safes.branchLabel')}</Typography>
              <TextField 
                select 
                fullWidth 
                variant="outlined" 
                value={branch} 
                onChange={(e) => setBranch(e.target.value)} 
                SelectProps={{ displayEmpty: true }}
              >
                 <MenuItem value="" disabled>{t('safes.selectPlaceholder')}</MenuItem>
                 {branches.map(b => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
              </TextField>

              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>{t('safes.accountHolderLabel')}</Typography>
              <TextField fullWidth variant="outlined" value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)} />

              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>{t('safes.accountNumberLabel')}</Typography>
              <TextField fullWidth variant="outlined" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
              
              <Grid container spacing={1} sx={{ mt: 2 }}>
                <Grid item xs={5}>
                  <Typography variant="subtitle2" gutterBottom>{t('safes.countryCodeLabel')}</Typography>
                  <TextField select fullWidth variant="outlined" value={countryCode} onChange={(e) => setCountryCode(e.target.value)}>
                    {countries.map(c => <MenuItem key={c.code} value={c.code}>{c.code}, {c.name}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant="subtitle2" gutterBottom>{t('safes.ibanNumberLabel')}</Typography>
                  <TextField fullWidth variant="outlined" value={iban} onChange={(e) => setIban(e.target.value)} placeholder="---- ---- ---- ---- ---- ----"/>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined" color="error">{t('safes.cancelButton')}</Button>
        <Button onClick={handleSave} variant="contained">{t('safes.saveButton')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddBankModal;
