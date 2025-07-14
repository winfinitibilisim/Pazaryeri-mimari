import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { tr, enUS } from 'date-fns/locale';
import { Locale } from 'date-fns';

interface AddIncomingPaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (payment: any) => void;
}

const AddIncomingPaymentDialog: React.FC<AddIncomingPaymentDialogProps> = ({ open, onClose, onSave }) => {
    const { t, i18n } = useTranslation();

  const localeMap: { [key: string]: Locale } = {
    en: enUS,
    tr: tr,
  };

  const [currentLocale, setCurrentLocale] = useState<Locale>(localeMap[i18n.language] || enUS);

  useEffect(() => {
    setCurrentLocale(localeMap[i18n.language] || enUS);
  }, [i18n.language]);
  const [customerName, setCustomerName] = useState('');
  const [paymentDate, setPaymentDate] = useState<Date | null>(new Date());
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('TRY');
  const [safe, setSafe] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('completed');

  useEffect(() => {
    if (!open) {
      // Reset form when dialog is closed
      setCustomerName('');
      setPaymentDate(new Date());
      setAmount('');
      setCurrency('TRY');
      setSafe('');
      setDescription('');
      setStatus('completed');
    }
  }, [open]);

  const handleSave = () => {
    const paymentData = {
      customerName,
      paymentDate,
      amount: parseFloat(amount),
      currency,
      safe,
      description,
      status,
    };
    onSave(paymentData);
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={currentLocale}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{t('payments.add_payment_dialog.title')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('payments.add_payment_dialog.customer_name')}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label={t('payments.add_payment_dialog.payment_date')}
                value={paymentDate}
                onChange={(newValue: Date | null) => setPaymentDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('payments.add_payment_dialog.amount')}
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('payments.add_payment_dialog.currency')}</InputLabel>
                <Select
                  value={currency}
                  label={t('payments.add_payment_dialog.currency')}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <MenuItem value="TRY">TRY</MenuItem>
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('payments.add_payment_dialog.safe')}</InputLabel>
                <Select
                  value={safe}
                  label={t('payments.add_payment_dialog.safe')}
                  onChange={(e) => setSafe(e.target.value)}
                >
                  <MenuItem value="main_safe">{t('payments.safes.main_safe')}</MenuItem>
                  <MenuItem value="bank_safe">{t('payments.safes.bank_safe')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('common.status')}</InputLabel>
                <Select
                  value={status}
                  label={t('common.status')}
                  onChange={(e) => setStatus(e.target.value)}
                >
                                    <MenuItem value="completed">{t('payments.completed')}</MenuItem>
                  <MenuItem value="pending">{t('payments.pending')}</MenuItem>
                  <MenuItem value="cancelled">{t('payments.cancelled')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('payments.add_payment_dialog.description')}
                multiline
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
                    <Button onClick={onClose}>{t('common.close')}</Button>
          <Button onClick={handleSave} variant="contained">{t('common.save')}</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default AddIncomingPaymentDialog;
