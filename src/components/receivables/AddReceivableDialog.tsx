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
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useTranslation } from 'react-i18next';
import { StatusType } from '../../pages/receivables/CustomerReceivablesPage';

export interface NewReceivable {
  customerName: string;
  invoiceNumber: string;
  invoiceDate: Date | null;
  dueDate: Date | null;
  amount: number;
  currency: string;
  description: string;
  status: StatusType;
}

interface AddReceivableDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: NewReceivable) => void;
}

const AddReceivableDialog: React.FC<AddReceivableDialogProps> = ({ open, onClose, onSave }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<NewReceivable>({
    customerName: '',
    invoiceNumber: '',
    invoiceDate: null,
    dueDate: null,
    amount: 0,
    currency: 'TRY',
    description: '',
    status: 'not_due',
  });

  useEffect(() => {
    if (open) {
      // Reset form when dialog opens
      setFormData({
        customerName: '',
        invoiceNumber: '',
        invoiceDate: new Date(),
        dueDate: null,
        amount: 0,
        currency: 'TRY',
        description: '',
        status: 'not_due',
      });
    }
  }, [open]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) || 0 : value }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string | StatusType>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: 'invoiceDate' | 'dueDate', date: Date | null) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const handleSave = () => {
    // Basic validation can be added here
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('receivables.add_new_receivable')}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              name="customerName"
              label={t('receivables.customer_name')}
              value={formData.customerName}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="invoiceNumber"
              label={t('receivables.invoice_no')}
              value={formData.invoiceNumber}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
             <DatePicker
              label={t('receivables.invoice_date')}
              value={formData.invoiceDate}
              onChange={(newValue: Date | null) => handleDateChange('invoiceDate', newValue)}
              renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label={t('receivables.due_date')}
              value={formData.dueDate}
              onChange={(newValue: Date | null) => handleDateChange('dueDate', newValue)}
              renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="amount"
              label={t('receivables.amount')}
              type="number"
              value={formData.amount}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
           <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>{t('receivables.currency')}</InputLabel>
              <Select
                name="currency"
                value={formData.currency}
                onChange={handleSelectChange}
                label={t('receivables.currency')}
              >
                <MenuItem value="TRY">TRY</MenuItem>
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>{t('receivables.status')}</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleSelectChange}
                label={t('receivables.status')}
              >
                <MenuItem value="not_due">{t('customerReceivablesPage.not_due')}</MenuItem>
                <MenuItem value="overdue">{t('customerReceivablesPage.overdue')}</MenuItem>
                <MenuItem value="paid">{t('customerReceivablesPage.paid')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              label={t('receivables.description')}
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t(['general.close', 'close'])}</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {t(['general.saveChanges', 'save'])}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddReceivableDialog;
