import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, MenuItem, InputLabel, Select, FormControl } from '@mui/material';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { suppliers, expenseItems, taxes } from './paymentFormOptions';

interface AddPaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  employees?: { id: string; name: string }[];
}

const paymentTypes = [
  { value: 'cash', labelKey: 'paymentTypeCash' },
  { value: 'creditCard', labelKey: 'paymentTypeCreditCard' },
  { value: 'bankTransfer', labelKey: 'paymentTypeBankTransfer' },
];

const currencies = [
  { value: 'TRY', label: '₺' },
  { value: 'USD', label: '$' },
  { value: 'EUR', label: '€' },
  { value: 'GBP', label: '£' },
];

const AddPaymentDialog: React.FC<AddPaymentDialogProps> = ({ open, onClose, onSave, employees = [] }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    supplier: '',
    receiptDate: dayjs().format('YYYY-MM-DDTHH:mm'),
    expenseItem: '',
    tax: '',
    amount: '',
    currency: 'TRY',
    amountWithTax: '',
    paymentType: '',
    paymentDate: dayjs().format('YYYY-MM-DDTHH:mm'),
    paidBy: '',
    employee: '',
    description: '',
  });
  const [touched, setTouched] = useState<{[k:string]: boolean}>({});

  // Otomatik vergi dahil miktar hesaplama
  React.useEffect(() => {
    let taxRate = 0;
    if (form.tax === 'kdv1') taxRate = 0.01;
    else if (form.tax === 'kdv8') taxRate = 0.08;
    else if (form.tax === 'kdv18') taxRate = 0.18;
    else taxRate = 0;
    const amountNum = parseFloat(form.amount);
    if (!isNaN(amountNum)) {
      setForm(f => ({ ...f, amountWithTax: (amountNum * (1 + taxRate)).toFixed(2) }));
    } else {
      setForm(f => ({ ...f, amountWithTax: '' }));
    }
  }, [form.amount, form.tax]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSelectChange = (e: import('@mui/material').SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name!]: value }));
    setTouched((prev) => ({ ...prev, [name!]: true }));
  };

  const isValid = () => {
    return (
      form.supplier &&
      form.receiptDate &&
      form.expenseItem &&
      form.tax &&
      form.amount &&
      form.currency &&
      form.paymentType &&
      form.paymentDate &&
      form.paidBy &&
      form.employee
    );
  };

  const handleSave = () => {
    if (!isValid()) return;
    onSave(form);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };





  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{t('add')}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>
          {/* 1. Satır: Plastiyer ve Makbuz/Fatura Tarihi */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>{t('supplier')}</InputLabel>
              <Select
                name="supplier"
                value={form.supplier}
                label={t('supplier')}
                onChange={handleSelectChange}
                error={touched.supplier && !form.supplier}
              >
                {suppliers.map((s) => (
                  <MenuItem key={s.value} value={s.value}>{t(s.labelKey)}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="receiptDate"
              label={t('receiptOrInvoiceDate')}
              type="datetime-local"
              value={form.receiptDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
              error={touched.receiptDate && !form.receiptDate}
            />
          </Grid>
          {/* 2. Satır: Harcama Kalemi ve Vergi */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>{t('expenseItem')}</InputLabel>
              <Select
                name="expenseItem"
                value={form.expenseItem}
                label={t('expenseItem')}
                onChange={handleSelectChange}
                error={touched.expenseItem && !form.expenseItem}
              >
                {expenseItems.map((item) => (
                  <MenuItem key={item.value} value={item.value}>{t(item.labelKey)}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>{t('tax')}</InputLabel>
              <Select
                name="tax"
                value={form.tax}
                label={t('tax')}
                onChange={handleSelectChange}
                error={touched.tax && !form.tax}
              >
                {taxes.map((tax) => (
                  <MenuItem key={tax.value} value={tax.value}>{t(tax.labelKey)}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* 3. Satır: Miktar/Para Birimi, Vergi Dahil Miktar/Para Birimi */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              name="amount"
              label={t('amount') + ' *'}
              value={form.amount}
              onChange={handleChange}
              type="number"
              fullWidth
              required
              error={touched.amount && !form.amount}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth required>
              <InputLabel>{t('currency')}</InputLabel>
              <Select
                name="currency"
                value={form.currency}
                label={t('currency')}
                onChange={handleSelectChange}
                error={touched.currency && !form.currency}
              >
                {currencies.map((cur) => (
                  <MenuItem key={cur.value} value={cur.value}>{cur.value} {cur.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              name="amountWithTax"
              label={t('amountWithTax')}
              value={form.amountWithTax}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>{t('currency')}</InputLabel>
              <Select
                value={form.currency}
                label={t('currency')}
                disabled
              >
                {currencies.map((cur) => (
                  <MenuItem key={cur.value} value={cur.value}>{cur.value} {cur.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* 4. Satır: Ödeme Tipi, Ödeme Tarihi */}
          <Grid item xs={12} sm={6} md={6}>
            <FormControl fullWidth required>
              <InputLabel>{t('paymentType')}</InputLabel>
              <Select
                name="paymentType"
                value={form.paymentType}
                label={t('paymentType')}
                onChange={handleSelectChange}
                error={touched.paymentType && !form.paymentType}
              >
                {paymentTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>{t(type.labelKey)}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              name="paymentDate"
              label={t('paymentDate')}
              type="datetime-local"
              value={form.paymentDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
              error={touched.paymentDate && !form.paymentDate}
            />
          </Grid>
          {/* 5. Satır: Çalışan Ödedi, Employee */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>{t('paidBy')}</InputLabel>
              <Select
                name="paidBy"
                value={form.paidBy}
                label={t('paidBy')}
                onChange={handleSelectChange}
                error={touched.paidBy && !form.paidBy}
              >
                {employees.map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>{emp.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>{t('employee')}</InputLabel>
              <Select
                name="employee"
                value={form.employee}
                label={t('employee')}
                onChange={handleSelectChange}
                error={touched.employee && !form.employee}
              >
                {employees.map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>{emp.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* 6. Satır: Açıklama */}
          <Grid item xs={12}>
            <TextField
              name="description"
              label={t('description')}
              value={form.description}
              onChange={handleChange}
              fullWidth
              multiline
              minRows={2}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={handleClose}>
          {t('cancel')}
        </Button>
        <Button variant="contained" color="primary" onClick={handleSave} disabled={!isValid()}>
          {t('save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPaymentDialog;
