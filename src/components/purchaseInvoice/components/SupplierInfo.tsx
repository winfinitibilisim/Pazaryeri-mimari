import React from 'react';
import { useTranslation } from 'react-i18next';
import { Control, Controller, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { 
  Grid, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
  IconButton,
  Tooltip,
  useTheme,
  CircularProgress
} from '@mui/material';
import { History as HistoryIcon } from '@mui/icons-material';
import { PurchaseInvoiceFormValues, Supplier } from './types';

interface SupplierInfoProps {
  control: Control<PurchaseInvoiceFormValues>;
  errors: FieldErrors<PurchaseInvoiceFormValues>;
  setValue: UseFormSetValue<PurchaseInvoiceFormValues>;
  watch: UseFormWatch<PurchaseInvoiceFormValues>;
  suppliers: Supplier[];
  selectedSupplier: Supplier | null;
}

const SupplierInfo: React.FC<SupplierInfoProps> = ({ 
  control, 
  errors, 
  setValue, 
  watch, 
  suppliers, 
  selectedSupplier
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const watchSupplierId = watch('supplierId');

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ 
        fontSize: { xs: '1rem', sm: '1.25rem' },
        fontWeight: 'medium',
        mb: 2,
        mt: 2,
        display: 'flex',
        alignItems: 'center',
        color: theme.palette.text.primary
      }}>
        {t('supplierInformation')}
      </Typography>
      
      <Grid container spacing={2}>
        {/* Tedarikçi Seçimi */}
        <Grid item xs={12} sm={6}>
          <Controller
            name="supplierId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small" error={!!errors.supplierId}>
                <InputLabel id="supplier-label">{t('supplier')}</InputLabel>
                <Select
                  {...field}
                  labelId="supplier-label"
                  label={t('supplier')}
                  sx={{ 
                    '& .MuiSelect-select': { 
                      fontSize: { xs: '0.875rem', sm: '1rem' } 
                    }
                  }}
                  endAdornment={
                    <Box sx={{ display: 'flex', mr: 2 }}>
                      {!watchSupplierId ? (
                        <span>
                          <Tooltip title={t('supplierHistory')}>
                            <span>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Tedarikçi geçmişi gösterme fonksiyonu eklenebilir
                                }}
                                disabled={true}
                                sx={{ mr: 1 }}
                              >
                                <HistoryIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </span>
                      ) : (
                        <Tooltip title={t('supplierHistory')}>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Tedarikçi geçmişi gösterme fonksiyonu eklenebilir
                            }}
                            sx={{ mr: 1 }}
                          >
                            <HistoryIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  }
                >
                  {suppliers.map((supplier) => (
                    <MenuItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        
        {/* Fatura Numarası */}
        <Grid item xs={12} sm={6}>
          <Controller
            name="invoiceNumber"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('invoiceNumber')}
                fullWidth
                size="small"
                error={!!errors.invoiceNumber}
                helperText={errors.invoiceNumber?.message}
                sx={{ 
                  '& .MuiInputBase-input': { 
                    fontSize: { xs: '0.875rem', sm: '1rem' } 
                  }
                }}
              />
            )}
          />
        </Grid>
        
        {/* Tedarikçi Bilgileri */}
        {selectedSupplier && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                label={t('taxId')}
                value={selectedSupplier.taxId || ''}
                fullWidth
                size="small"
                InputProps={{ readOnly: true }}
                sx={{ 
                  '& .MuiInputBase-input': { 
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label={t('contactPerson')}
                value={selectedSupplier.contactPerson || ''}
                fullWidth
                size="small"
                InputProps={{ readOnly: true }}
                sx={{ 
                  '& .MuiInputBase-input': { 
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Controller
                name="shippingAddress"
                control={control}
                defaultValue={selectedSupplier.address}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('shippingAddress')}
                    fullWidth
                    multiline
                    rows={2}
                    size="small"
                    error={!!errors.shippingAddress}
                    helperText={errors.shippingAddress?.message}
                    sx={{ 
                      '& .MuiInputBase-input': { 
                        fontSize: { xs: '0.875rem', sm: '1rem' } 
                      }
                    }}
                  />
                )}
              />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default SupplierInfo;
