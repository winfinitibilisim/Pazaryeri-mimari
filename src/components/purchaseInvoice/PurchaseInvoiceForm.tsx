import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { addDays } from 'date-fns';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  Snackbar,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Alt bileşenler
import InvoiceItems from './components/InvoiceItems';

// Tipler ve yardımcı fonksiyonlar
import {
  Supplier,
  Product,
  PurchaseInvoiceItem,
  PurchaseInvoiceFormValues,
  PurchaseTotalsData,
  formatCurrency,
  calculateItemTotal,
  calculateTotals,
  mockSuppliers as suppliersList
} from './components/types';

interface PurchaseInvoiceFormProps {
  invoiceId: string | null;
  isEditMode: boolean;
  onSubmitSuccess: () => void;
}

// Mock data
const mockProducts: Product[] = [
  { id: '1', name: 'Laptop Bilgisayar', price: 12000, taxRate: 18, sku: 'LT-001', category: 'Elektronik' },
  { id: '2', name: 'Ofis Masası', price: 2500, taxRate: 8, sku: 'OF-001', category: 'Mobilya' },
  { id: '3', name: 'Ergonomik Sandalye', price: 1800, taxRate: 8, sku: 'OF-002', category: 'Mobilya' },
  { id: '4', name: 'Kablosuz Mouse', price: 250, taxRate: 18, sku: 'EL-001', category: 'Elektronik' },
  { id: '5', name: 'Monitör', price: 3500, taxRate: 18, sku: 'EL-002', category: 'Elektronik' },
];

// Tipler ve yardımcı fonksiyonlar types.ts'den import edildi

// Form validation schema
const schema = yup.object().shape({
  invoiceNumber: yup.string().required('invoiceNumber.required'),
  supplierId: yup.string().required('supplierId.required'),
  invoiceDate: yup.date().required('invoiceDate.required'),
  dueDate: yup.date().nullable(),
  receivedDate: yup.date().nullable(),
  status: yup.string().required('status.required'),
  paymentMethod: yup.string(),
  paymentTerms: yup.string(),
  shippingAddress: yup.string(),
  notes: yup.string(),
  items: yup.array().of(
    yup.object().shape({
      productId: yup.string().required('productId.required'),
      description: yup.string().required('description.required'),
      quantity: yup.number().positive().required('quantity.required'),
      unit: yup.string().required('unit.required'),
      unitPrice: yup.number().positive().required('unitPrice.required'),
      taxRate: yup.number().min(0).required('taxRate.required'),
      discount: yup.number().min(0).max(100).required('discount.required')
    })
  ).min(1, 'items.min'),
  currency: yup.string()
});

const PurchaseInvoiceForm: React.FC<PurchaseInvoiceFormProps> = ({
  invoiceId,
  isEditMode,
  onSubmitSuccess
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  
  // Form setup with react-hook-form and yup validation
  const { control, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<PurchaseInvoiceFormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      invoiceNumber: '',
      supplierId: '',
      invoiceDate: new Date(),
      dueDate: addDays(new Date(), 30),
      receivedDate: new Date(),
      status: 'draft',
      paymentMethod: 'bankTransfer',
      paymentTerms: '',
      shippingAddress: '',
      notes: '',
      items: [
        {
          productId: '',
          description: '',
          quantity: 1,
          unit: 'adet',
          unitPrice: 0,
          taxRate: 18,
          discount: 0
        }
      ],
      currency: 'TRY'
    }
  });
  
  // Field array for invoice items
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });
  
  // Watch items for totals calculation
  const watchItems = watch('items');
  const totals = calculateTotals(watchItems || []) as PurchaseTotalsData;
  
  // Load invoice data if in edit mode
  useEffect(() => {
    if (isEditMode && invoiceId) {
      setLoading(true);
      
      // In a real app, this would be an API call
      // For now, we'll simulate loading data
      setTimeout(() => {
        // Mock data for editing
        const mockInvoice = {
          id: invoiceId,
          invoiceNumber: `PINV-2025-00${invoiceId}`,
          supplierId: '1',
          invoiceDate: new Date('2025-05-20'),
          dueDate: new Date('2025-06-20'),
          status: 'draft',
          paymentMethod: 'bankTransfer',
          billingAddress: 'İstanbul, Türkiye',
          shippingAddress: 'İstanbul, Türkiye',
          notes: 'Bu bir örnek alış faturasıdır.',
          items: [
            {
              id: '1',
              productId: '1',
              description: 'Yüksek performanslı iş laptopu',
              quantity: 2,
              unitPrice: 12000,
              taxRate: 18,
              discount: 5
            },
            {
              id: '2',
              productId: '5',
              description: '27" 4K Monitör',
              quantity: 2,
              unitPrice: 3500,
              taxRate: 18,
              discount: 0
            }
          ]
        };
        
        // Reset form with loaded data
        reset(mockInvoice);
        setLoading(false);
      }, 1000);
    }
  }, [isEditMode, invoiceId, reset]);
  
  // Handle form submission
  const onSubmit = (data: any) => {
    setLoading(true);
    
    // In a real app, this would be an API call
    // For now, we'll simulate saving data
    setTimeout(() => {
      console.log('Form data submitted:', data);
      setLoading(false);
      setSnackbar({
        open: true,
        message: isEditMode 
          ? t('purchaseInvoice') + ' ' + t('successfullyUpdated')
          : t('purchaseInvoice') + ' ' + t('successfullyAdded'),
        severity: 'success'
      });
      
      // After successful submission, call the callback
      setTimeout(() => {
        onSubmitSuccess();
      }, 1500);
    }, 1000);
  };
  
  // Handle product selection
  const handleProductChange = (index: number, productId: string) => {
    const selectedProduct = mockProducts.find(p => p.id === productId);
    if (selectedProduct) {
      setValue(`items.${index}.unitPrice`, selectedProduct.price);
      setValue(`items.${index}.taxRate`, selectedProduct.taxRate);
      setValue(`items.${index}.description`, selectedProduct.name);
    }
  };
  
  // Handle supplier selection
  const handleSupplierChange = (supplierId: string) => {
    const supplier = suppliersList.find((s: Supplier) => s.id === supplierId);
    if (supplier) {
      setValue('shippingAddress', supplier.address);
    }
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {isEditMode ? t('editPurchaseInvoice') : t('addPurchaseInvoice')}
        </Typography>
        
        <Grid container spacing={3}>
          {/* Fatura Numarası */}
          <Grid item xs={12} sm={6} md={3}>
            <Controller
              name="invoiceNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('invoiceNumber')}
                  fullWidth
                  error={!!errors.invoiceNumber}
                  helperText={errors.invoiceNumber ? t(errors.invoiceNumber.message as string) : ''}
                  disabled={loading}
                />
              )}
            />
          </Grid>
          
          {/* Tedarikçi */}
          <Grid item xs={12} sm={6} md={3}>
            <Controller
              name="supplierId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.supplierId}>
                  <InputLabel>{t('supplier')}</InputLabel>
                  <Select
                    {...field}
                    label={t('supplier')}
                    disabled={loading}
                    onChange={(e) => {
                      field.onChange(e);
                      handleSupplierChange(e.target.value as string);
                    }}
                  >
                    <MenuItem value="" disabled>
                      <em>{t('selectSupplier')}</em>
                    </MenuItem>
                    {suppliersList.map((supplier: Supplier) => (
                      <MenuItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.supplierId && (
                    <FormHelperText>{t(errors.supplierId.message as string)}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>
          
          {/* Fatura Tarihi */}
          <Grid item xs={12} sm={6} md={3}>
            <Controller
              name="invoiceDate"
              control={control}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={t('invoiceDate')}
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                    disabled={loading}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!errors.invoiceDate}
                        helperText={errors.invoiceDate ? t(errors.invoiceDate.message as string) : ''}
                      />
                    )}
                  />
                </LocalizationProvider>
              )}
            />
          </Grid>
          
          {/* Vade Tarihi */}
          <Grid item xs={12} sm={6} md={3}>
            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={t('dueDate')}
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                    disabled={loading}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!errors.dueDate}
                        helperText={errors.dueDate ? t(errors.dueDate.message as string) : ''}
                      />
                    )}
                  />
                </LocalizationProvider>
              )}
            />
          </Grid>
          
          {/* Durum */}
          <Grid item xs={12} sm={6} md={3}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.status}>
                  <InputLabel>{t('invoiceStatus')}</InputLabel>
                  <Select
                    {...field}
                    label={t('invoiceStatus')}
                    disabled={loading}
                  >
                    <MenuItem value="draft">{t('draft')}</MenuItem>
                    <MenuItem value="unpaid">{t('unpaid')}</MenuItem>
                    <MenuItem value="paid">{t('paid')}</MenuItem>
                    <MenuItem value="partial">{t('partial')}</MenuItem>
                    <MenuItem value="cancelled">{t('cancelled')}</MenuItem>
                  </Select>
                  {errors.status && (
                    <FormHelperText>{t(errors.status.message as string)}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>
          
          {/* Ödeme Yöntemi */}
          <Grid item xs={12} sm={6} md={3}>
            <Controller
              name="paymentMethod"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.paymentMethod}>
                  <InputLabel>{t('paymentMethod')}</InputLabel>
                  <Select
                    {...field}
                    label={t('paymentMethod')}
                    disabled={loading}
                  >
                    <MenuItem value="bankTransfer">{t('bankTransfer')}</MenuItem>
                    <MenuItem value="creditCard">{t('creditCard')}</MenuItem>
                    <MenuItem value="cash">{t('cash')}</MenuItem>
                    <MenuItem value="check">{t('check')}</MenuItem>
                  </Select>
                  {errors.paymentMethod && (
                    <FormHelperText>{t(errors.paymentMethod.message as string)}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>
          
          {/* Teslimat Adresi */}
          <Grid item xs={12} sm={6}>
            <FormControl
              fullWidth
              error={!!errors.shippingAddress}
              disabled={loading}
              size="small"
            >
              <InputLabel id="shippingAddress-label">{t('shippingAddress')}</InputLabel>
              <Controller
                name="shippingAddress"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={2}
                    error={!!errors.shippingAddress}
                    helperText={errors.shippingAddress ? t(errors.shippingAddress.message as string) : ''}
                    disabled={loading}
                  />
                )}
              />
            </FormControl>
          </Grid>
          
          {/* Notlar */}
          <Grid item xs={12}>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('notes')}
                  fullWidth
                  multiline
                  rows={2}
                  disabled={loading}
                />
              )}
            />
          </Grid>
        </Grid>
      </Paper>
      
      {/* Fatura Kalemleri ve Özet */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 3 }}>
            <InvoiceItems
              control={control}
              errors={errors}
              setValue={setValue}
              products={mockProducts}
              getProductDetails={(productId, index) => handleProductChange(index, productId)}
              currency="TRY"
            />
          </Paper>
        </Box>
        
        {/* Modern Özet Bölümü */}
        <Box sx={{ width: { xs: '100%', md: '350px' } }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Özet
            </Typography>
            
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Ara Toplam:</Typography>
              <Typography variant="body2">{formatCurrency(totals.subtotal)}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">İndirim:</Typography>
              <Typography variant="body2" color="error">
                -{formatCurrency(totals.discountAmount)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2">KDV:</Typography>
              <Typography variant="body2">{formatCurrency(totals.taxAmount)}</Typography>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Genel Toplam:</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {formatCurrency(totals.total)}
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
      
      {/* Butonlar */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => onSubmitSuccess()} // İptal durumunda listeye geri dön
          disabled={loading}
        >
          {t('cancel')}
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {isEditMode ? t('update') : t('save')}
        </Button>
      </Box>
      
      {/* Bildirim */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PurchaseInvoiceForm;
