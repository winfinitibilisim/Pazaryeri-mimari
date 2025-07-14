import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  InputAdornment,
  MenuItem,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Close as CloseIcon, CalendarToday as CalendarTodayIcon, Notes as NotesIcon, EuroSymbol as EuroSymbolIcon } from '@mui/icons-material';
import { Safe, Currency } from '../../../types/Safe';

interface AddSafeModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (safe: Partial<Safe>) => void;
  initialData: Safe | null;
}

const currencies = [
  { value: 'TRY', label: '₺' },
  { value: 'USD', label: '$' },
  { value: 'EUR', label: '€' },
];

const AddSafeModal: React.FC<AddSafeModalProps> = ({ open, onClose, onSave, initialData }) => {
    const { t } = useTranslation();
  const [accountName, setAccountName] = useState('');
  const [openingBalance, setOpeningBalance] = useState('');
    const [currency, setCurrency] = useState<Currency>('TRY');
  const [openingDate, setOpeningDate] = useState(new Date().toISOString().split('T')[0]);
  const isEditMode = Boolean(initialData);

  React.useEffect(() => {
    if (initialData) {
      setAccountName(initialData.name);
      setOpeningBalance(String(initialData.balance));
      setCurrency(initialData.currency);
      if (initialData.openingDate) {
        setOpeningDate(initialData.openingDate);
      }
    } else {
      setAccountName('');
      setOpeningBalance('');
      setCurrency('TRY');
      setOpeningDate(new Date().toISOString().split('T')[0]);
    }
  }, [initialData]);

    const handleSave = () => {
    const safeData: Partial<Safe> = {
      ...initialData,
      id: initialData?.id,
      name: accountName,
      balance: parseFloat(openingBalance) || 0,
      currency: currency,
      openingDate: openingDate,
            type: 'cash',
    };
    onSave(safeData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {isEditMode ? t('safes.editSafeTitle', 'Kasayı Düzenle') : t('safes.addSafeTitle')}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>{t('safes.accountNameLabel')}</Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={t('safes.accountNamePlaceholder') as string}
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <NotesIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={8}>
            <Typography variant="subtitle2" gutterBottom>{t('safes.openingBalanceAndCurrencyLabel')}</Typography>
            <TextField
              fullWidth
              variant="outlined"
              type="number"
              value={openingBalance}
              onChange={(e) => setOpeningBalance(e.target.value)}
              placeholder="0,00"
               InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EuroSymbolIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={4}>
             <Typography variant="subtitle2" gutterBottom sx={{ opacity: 0 }}>.</Typography>
            <TextField
              select
              fullWidth
              variant="outlined"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
            >
              {currencies.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label} ({option.value})
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>{t('safes.openingBalanceDateLabel')}</Typography>
            <TextField
              fullWidth
              variant="outlined"
              type="date"
              value={openingDate}
              onChange={(e) => setOpeningDate(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined" color="error">{t('safes.cancelButton')}</Button>
        <Button onClick={handleSave} variant="contained" color="primary">{t('safes.saveButton')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSafeModal;
