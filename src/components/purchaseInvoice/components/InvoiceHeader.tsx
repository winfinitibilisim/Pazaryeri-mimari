import React from 'react';
import { useTranslation } from 'react-i18next';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { 
  Grid, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Typography,
  Box,
  useTheme
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import trLocale from 'date-fns/locale/tr';
import { PurchaseInvoiceFormValues } from './types';

interface InvoiceHeaderProps {
  control: Control<PurchaseInvoiceFormValues>;
  errors: FieldErrors<PurchaseInvoiceFormValues>;
  isEditMode: boolean;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ control, errors, isEditMode }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  // Fatura durumları (Satın alma faturaları için)
  const invoiceStatuses = [
    { value: 'draft', label: t('draft') },
    { value: 'received', label: t('received') },
    { value: 'pending_payment', label: t('pendingPayment') },
    { value: 'paid', label: t('paid') },
    { value: 'cancelled', label: t('cancelled') }
  ];

  // Ödeme yöntemleri
  const paymentMethods = [
    { value: 'cash', label: t('cash') },
    { value: 'bankTransfer', label: t('bankTransfer') },
    { value: 'creditCard', label: t('creditCard') },
    { value: 'check', label: t('check') }
  ];

  // Para birimleri
  const currencies = [
    { value: 'TRY', label: t('turkishLira') },
    { value: 'USD', label: t('usDollar') },
    { value: 'EUR', label: t('euro') },
    { value: 'GBP', label: t('britishPound') }
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ 
        fontSize: { xs: '1rem', sm: '1.25rem' },
        fontWeight: 'medium',
        mb: 2,
        color: theme.palette.text.primary
      }}>
        {t('invoiceDetails')}
      </Typography>
      
      <Grid container spacing={2}>
        {/* Fatura Tarihi */}
        <Grid item xs={12} sm={6} md={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={trLocale}>
            <Controller
              name="invoiceDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label={t('invoiceDate')}
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      size="small"
                      error={!!errors.invoiceDate}
                      helperText={errors.invoiceDate ? t(errors.invoiceDate.message as string) : ''}
                      sx={{ 
                        '& .MuiInputBase-input': { 
                          fontSize: { xs: '0.875rem', sm: '1rem' } 
                        }
                      }}
                    />
                  )}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>

        {/* Vade Tarihi */}
        <Grid item xs={12} sm={6} md={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={trLocale}>
            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label={t('dueDate')}
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      size="small"
                      error={!!errors.dueDate}
                      helperText={errors.dueDate ? t(errors.dueDate.message as string) : ''}
                      sx={{ 
                        '& .MuiInputBase-input': { 
                          fontSize: { xs: '0.875rem', sm: '1rem' } 
                        }
                      }}
                    />
                  )}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>

        {/* Mal/Hizmet Alım Tarihi */}
        <Grid item xs={12} sm={6} md={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={trLocale}>
            <Controller
              name="receivedDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label={t('receivedDate')}
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      size="small"
                      error={!!errors.receivedDate}
                      helperText={errors.receivedDate ? t(errors.receivedDate.message as string) : ''}
                      sx={{ 
                        '& .MuiInputBase-input': { 
                          fontSize: { xs: '0.875rem', sm: '1rem' } 
                        }
                      }}
                    />
                  )}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>

        {/* Fatura Durumu */}
        <Grid item xs={12} sm={6} md={4}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small" error={!!errors.status}>
                <InputLabel id="status-label">{t('status')}</InputLabel>
                <Select
                  {...field}
                  labelId="status-label"
                  label={t('status')}
                  sx={{ 
                    '& .MuiSelect-select': { 
                      fontSize: { xs: '0.875rem', sm: '1rem' } 
                    }
                  }}
                >
                  {invoiceStatuses.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>

        {/* Ödeme Yöntemi */}
        <Grid item xs={12} sm={6} md={4}>
          <Controller
            name="paymentMethod"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small" error={!!errors.paymentMethod}>
                <InputLabel id="payment-method-label">{t('paymentMethod')}</InputLabel>
                <Select
                  {...field}
                  labelId="payment-method-label"
                  label={t('paymentMethod')}
                  sx={{ 
                    '& .MuiSelect-select': { 
                      fontSize: { xs: '0.875rem', sm: '1rem' } 
                    }
                  }}
                >
                  {paymentMethods.map((method) => (
                    <MenuItem key={method.value} value={method.value}>
                      {method.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>

        {/* Para Birimi */}
        <Grid item xs={12} sm={6} md={4}>
          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small" error={!!errors.currency}>
                <InputLabel id="currency-label">{t('currency')}</InputLabel>
                <Select
                  {...field}
                  labelId="currency-label"
                  label={t('currency')}
                  sx={{ 
                    '& .MuiSelect-select': { 
                      fontSize: { xs: '0.875rem', sm: '1rem' } 
                    }
                  }}
                >
                  {currencies.map((currency) => (
                    <MenuItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>

        {/* Ödeme Koşulları */}
        <Grid item xs={12}>
          <Controller
            name="paymentTerms"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('paymentTerms')}
                fullWidth
                multiline
                rows={2}
                size="small"
                error={!!errors.paymentTerms}
                helperText={errors.paymentTerms ? t(errors.paymentTerms.message as string) : ''}
                sx={{ 
                  '& .MuiInputBase-input': { 
                    fontSize: { xs: '0.875rem', sm: '1rem' } 
                  }
                }}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default InvoiceHeader;
