import React, { useState, useMemo } from 'react';
import { useForm, Controller, useFieldArray, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Add, AddCircleOutline, Close, Delete } from '@mui/icons-material';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
  Divider,
  Button,
  IconButton,
  FormHelperText,
  InputAdornment,
  Menu,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import tr from 'date-fns/locale/tr';
import { useTranslation } from 'react-i18next';
import { Theme, useTheme } from '@mui/material/styles';
import tokens from '../../theme';

// --- TYPE DEFINITIONS ---
interface Customer {
  id: number;
  label: string;
  address: string;
  taxOffice: string;
  taxNo: string;
}

interface InvoiceItem {
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  vatRate: number;
  description?: string;
  discountType?: 'percentage' | 'amount';
  discountValue?: number;
  discount?: boolean;
  sctRate?: number;
  communicationTaxRate?: number;
  sct2Rate?: number;
  sct2?: boolean;
  accommodationTaxRate?: number;
  vatExemptionReason?: string;
}

interface IFormInputs {
  customerId: Customer | null;
  invoiceDate: Date | null;
  dueDate: Date | null;
  items: InvoiceItem[];
  notes?: string;
  paymentMethod: string;
  paymentStatus: string;
  warehouse: string;
  description?: string;
  currency: string;
  invoiceLanguage: string;
  stopajRate?: number;
  useForeignCurrency?: boolean;
  exchangeRate?: number;
  // İade faturası özel alanları
  originalInvoiceNo?: string;
  returnReason?: string;
  returnType: 'full' | 'partial';
}

interface ItemFieldsVisibility {
    [key: number]: {
        description: boolean;
        discount?: boolean;
        sct: boolean;
        communicationTax: boolean;
        sct2: boolean;
        accommodationTax: boolean;
        vatExemption: boolean;
    };
}

// --- VALIDATION SCHEMA ---
const validationSchema: yup.ObjectSchema<IFormInputs> = yup.object().shape({
    customerId: yup.mixed<Customer>().nullable().required('Müşteri seçimi zorunludur'),
    invoiceDate: yup.date().nullable().required('Fatura tarihi zorunludur'),
    dueDate: yup.date().nullable().required('Vade tarihi zorunludur'),
    items: yup.array().of(
        yup.object().shape({
            productName: yup.string().required('Ürün adı zorunludur'),
            quantity: yup.number().min(0.01, 'Miktar 0\'dan büyük olmalıdır').required('Miktar zorunludur'),
            unit: yup.string().required('Birim zorunludur'),
            unitPrice: yup.number().min(0, 'Birim fiyat 0\'dan küçük olamaz').required('Birim fiyat zorunludur'),
            vatRate: yup.number().min(0, 'KDV oranı 0\'dan küçük olamaz').required('KDV oranı zorunludur'),
            description: yup.string().optional(),
            discountType: yup.mixed<'percentage' | 'amount'>().optional(),
            discountValue: yup.number().optional(),
            discount: yup.boolean().optional(),
            sctRate: yup.number().optional(),
            communicationTaxRate: yup.number().optional(),
            sct2Rate: yup.number().optional(),
            sct2: yup.boolean().optional(),
            accommodationTaxRate: yup.number().optional(),
            vatExemptionReason: yup.string().optional(),
        })
    ).required().min(1, 'En az bir ürün eklemelisiniz'),
    paymentMethod: yup.string().required('Ödeme yöntemi zorunludur'),
    paymentStatus: yup.string().required('Ödeme durumu zorunludur'),
    warehouse: yup.string().required('Depo seçimi zorunludur'),
    currency: yup.string().required('Para birimi zorunludur'),
    invoiceLanguage: yup.string().required('Fatura dili zorunludur'),
    notes: yup.string().optional(),
    description: yup.string().optional(),
    stopajRate: yup.number().optional(),
    useForeignCurrency: yup.boolean().optional(),
    exchangeRate: yup.number().optional(),
    // İade faturası alanları
    originalInvoiceNo: yup.string().optional(),
    returnReason: yup.string().optional(),
    returnType: yup.mixed<'full' | 'partial'>().required('İade tipi zorunludur'),
});

// --- MOCK DATA ---
const customers: Customer[] = [
  { id: 1, label: 'Ahmet Yılmaz', address: 'Örnek Mah. Test Cad. No:1 D:2, İstanbul', taxOffice: 'Maslak', taxNo: '1234567890' },
  { id: 2, label: 'Ayşe Kaya', address: 'Kaya Mah. Deneme Sk. No:5, Ankara', taxOffice: 'Çankaya', taxNo: '0987654321' },
  { id: 3, label: 'Mehmet Demir A.Ş.', address: 'Merkez Mah. İş Cad. No:12, İzmir', taxOffice: 'Bornova', taxNo: '5555666677' },
  { id: 4, label: 'Fatma Özkan Ltd.', address: 'Ticaret Mah. Satış Cad. No:25, Bursa', taxOffice: 'Nilüfer', taxNo: '3333444455' },
];

const CreateReturnInvoicePage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const colors = tokens;
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [itemFields, setItemFields] = useState<ItemFieldsVisibility>({});
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(null);
  const [includeStopaj, setIncludeStopaj] = useState(false);
  const [subtotalMenuAnchor, setSubtotalMenuAnchor] = useState<HTMLElement | null>(null);
  const [includeSubtotalDiscount, setIncludeSubtotalDiscount] = useState(false);
  const [subtotalDiscountType, setSubtotalDiscountType] = useState<'percentage' | 'amount'>('percentage');
  const [subtotalDiscountValue, setSubtotalDiscountValue] = useState(0);
  const [includeTevkifat, setIncludeTevkifat] = useState(false);
  const [tevkifatMenuAnchor, setTevkifatMenuAnchor] = useState<HTMLElement | null>(null);
  const [tevkifatRate, setTevkifatRate] = useState(0);

  const defaultInvoiceItem: InvoiceItem = {
    productName: '',
    quantity: 1,
    unit: 'Adet',
    unitPrice: 0,
    vatRate: 20,
    description: '',
    discount: false,
    discountType: 'amount',
    discountValue: 0,
    sctRate: 0,
    communicationTaxRate: 0,
    sct2: false,
    sct2Rate: 0,
    accommodationTaxRate: 0,
    vatExemptionReason: '',
  };

  const { control, handleSubmit, watch, setValue, formState: { errors }, getValues } = useForm<IFormInputs>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues: {
      customerId: null,
      invoiceDate: new Date(),
      dueDate: new Date(),
      items: [defaultInvoiceItem],
      paymentMethod: 'Nakit',
      paymentStatus: 'Ödenmedi',
      warehouse: 'Ana Depo',
      currency: 'TRY',
      invoiceLanguage: 'tr',
      stopajRate: 0,
      useForeignCurrency: false,
      exchangeRate: 1,
      // İade faturası default değerler
      originalInvoiceNo: '',
      returnReason: '',
      returnType: 'full' as 'full' | 'partial',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items');
  const stopajRateForm = watch('stopajRate');
  const selectedCurrency = watch('currency');
  const useForeignCurrency = watch('useForeignCurrency');
  
  // İndirim değerlerini ayrıca izle
  const watchAllItems = watch(); // Tüm form değerlerini izle

  const { grossTotal, totalDiscount, subTotal, totalSct, totalCommunicationTax, totalAccommodationTax, vatTotal, stopajTotal, grandTotal, subtotalDiscountAmount, vatBreakdown, tevkifatAmount } = useMemo(() => {
    let grossTotal = 0;
    let totalDiscount = 0;
    let vatTotal = 0;
    let totalSct = 0;
    let totalCommunicationTax = 0;
    let totalAccommodationTax = 0;
    let vatBreakdown: { [key: number]: { base: number; amount: number } } = {};

    (watchedItems || []).forEach((item: InvoiceItem, index: number) => {
      if (!item) return;

      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      const discountValue = Number(item.discountValue) || 0;
      const sctRate = Number(item.sctRate) || 0;
      const communicationTaxRate = Number(item.communicationTaxRate) || 0;
      const accommodationTaxRate = Number(item.accommodationTaxRate) || 0;
      const vatRate = Number(item.vatRate) || 0;

      const itemSubtotal = quantity * unitPrice;
      grossTotal += itemSubtotal;

      let discountAmount = 0;
      // İndirim hesaplama - indirim alanı görünür ve değer varsa hesapla
      if (itemFields[index]?.discount && item.discountType && discountValue > 0) {
        if (item.discountType === 'percentage') {
          discountAmount = itemSubtotal * (discountValue / 100);
        } else {
          discountAmount = discountValue;
        }
      }
      totalDiscount += discountAmount;

      const totalAfterDiscount = itemSubtotal - discountAmount;

      const sctAmount = totalAfterDiscount * (sctRate / 100);
      const communicationTaxAmount = totalAfterDiscount * (communicationTaxRate / 100);
      const accommodationTaxAmount = totalAfterDiscount * (accommodationTaxRate / 100);

      totalSct += sctAmount;
      totalCommunicationTax += communicationTaxAmount;
      totalAccommodationTax += accommodationTaxAmount;

      const vatBase = totalAfterDiscount + sctAmount + communicationTaxAmount + accommodationTaxAmount;

      const isVatExempt = itemFields[index]?.vatExemption;
      const vatAmount = isVatExempt ? 0 : vatBase * (vatRate / 100);
      vatTotal += vatAmount;
      
      // KDV oranına göre grupla
      if (!isVatExempt && vatAmount > 0) {
        if (!vatBreakdown[vatRate]) {
          vatBreakdown[vatRate] = { base: 0, amount: 0 };
        }
        vatBreakdown[vatRate].base += vatBase;
        vatBreakdown[vatRate].amount += vatAmount;
      }
    });

    // Ara toplam indirimi hesaplama
    let subtotalDiscountAmount = 0;
    if (includeSubtotalDiscount && subtotalDiscountValue > 0) {
      if (subtotalDiscountType === 'percentage') {
        subtotalDiscountAmount = grossTotal * (subtotalDiscountValue / 100);
      } else {
        subtotalDiscountAmount = subtotalDiscountValue;
      }
    }

    const subTotal = grossTotal - totalDiscount - subtotalDiscountAmount;
    const currentStopajRate = stopajRateForm || 0;
    const stopajTotal = includeStopaj ? subTotal * (currentStopajRate / 100) : 0;
    
    // Tevkifat hesaplama
    const tevkifatAmount = includeTevkifat && tevkifatRate > 0 ? vatTotal * (tevkifatRate / 10) : 0;
    
    const grandTotal = subTotal + totalSct + totalCommunicationTax + totalAccommodationTax + vatTotal - stopajTotal - tevkifatAmount;

    return { grossTotal, totalDiscount, subTotal, totalSct, totalCommunicationTax, totalAccommodationTax, vatTotal, stopajTotal, grandTotal, subtotalDiscountAmount, vatBreakdown, tevkifatAmount };
  }, [watchedItems, includeStopaj, stopajRateForm, itemFields, watchAllItems, includeSubtotalDiscount, subtotalDiscountType, subtotalDiscountValue, includeTevkifat, tevkifatRate]);

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    setIsSubmitting(true);
    console.log(data);
    // TODO: Implement API call to save invoice data
    setIsSubmitting(false);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setCurrentItemIndex(index);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentItemIndex(null);
  };

  const handleAddDescription = (index: number) => {
    setItemFields(prev => ({ ...prev, [index]: { ...prev[index], description: true } }));
    handleMenuClose();
  };

  const handleRemoveDescription = (index: number) => {
    setItemFields((prevFields) => ({ ...prevFields, [index]: { ...prevFields[index], description: false } }));
  };

  const handleAddDiscount = (index: number) => {
    setItemFields(prev => ({ ...prev, [index]: { ...prev[index], discount: true } }));
    setValue(`items.${index}.discount`, true);
    setValue(`items.${index}.discountType`, 'percentage');
    setValue(`items.${index}.discountValue`, 0);
    handleMenuClose();
  };

  const handleAddSct = (index: number) => {
    setItemFields(prev => ({ ...prev, [index]: { ...prev[index], sct: true } }));
    handleMenuClose();
  };

  const handleRemoveDiscount = (index: number) => {
    setItemFields(prev => ({
      ...prev,
      [index]: { ...prev[index], discount: false }
    }));
    setValue(`items.${index}.discount`, false);
    setValue(`items.${index}.discountType`, undefined);
    setValue(`items.${index}.discountValue`, 0);
  };

  const handleRemoveSct = (index: number) => {
    setItemFields(prev => ({
      ...prev,
      [index]: { ...prev[index], sct: false }
    }));
    setValue(`items.${index}.sctRate`, 0);
  };

  const handleAddCommunicationTax = (index: number) => {
    setItemFields(prev => ({
      ...prev,
      [index]: { ...prev[index], communicationTax: true }
    }));
    handleMenuClose();
  };

  const handleRemoveCommunicationTax = (index: number) => {
    setItemFields(prev => ({
      ...prev,
      [index]: { ...prev[index], communicationTax: false }
    }));
    setValue(`items.${index}.communicationTaxRate`, 0);
  };

  const handleAddAccommodationTax = (index: number) => {
    setItemFields(prev => ({
      ...prev,
      [index]: { ...prev[index], accommodationTax: true }
    }));
    handleMenuClose();
  };

  const handleRemoveAccommodationTax = (index: number) => {
    setItemFields(prev => ({
      ...prev,
      [index]: { ...prev[index], accommodationTax: false }
    }));
    setValue(`items.${index}.accommodationTaxRate`, 0);
  };

  const handleToggleVatExemption = (index: number) => {
    setItemFields(prev => ({
      ...prev,
      [index]: { ...prev[index], vatExemption: !prev[index]?.vatExemption }
    }));
    handleMenuClose();
  };

  const handleToggleStopaj = () => {
    setIncludeStopaj(!includeStopaj);
  };

  const selectedCustomer = watch('customerId');

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Yeni İade Faturası Oluştur
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Fatura Bilgileri */}
      <Paper 
        elevation={0} 
        sx={{ 
          borderRadius: '16px', 
          border: `2px solid ${theme.palette.divider}`,
          mb: 3,
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box 
          sx={{ 
            background: 'linear-gradient(135deg, #25638f 0%, #120a8f 100%)',
            color: '#ffffff',
            p: 3,
            textAlign: 'center'
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Fatura Bilgileri
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
            Müşteri ve fatura detaylarını eksiksiz doldurunuz
          </Typography>
        </Box>

        <Box sx={{ p: { xs: 3, md: 4 } }}>
          {/* İade Faturası Özel Alanları */}
          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #ffebee 0%, #fce4ec 100%)',
                  border: '1px solid #f8bbd9'
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#d32f2f', 
                    fontWeight: 'bold', 
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    '&:before': {
                      content: '""',
                      width: '4px',
                      height: '20px',
                      backgroundColor: '#d32f2f',
                      marginRight: '12px',
                      borderRadius: '2px'
                    }
                  }}
                >
                  🔄 İade Faturası Bilgileri
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="originalInvoiceNo"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Orijinal Fatura No"
                          fullWidth
                          placeholder="Örn: SF-2024-001"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              '&:hover fieldset': {
                                borderColor: '#d32f2f'
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#d32f2f'
                              }
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="returnType"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel>İade Tipi</InputLabel>
                          <Select
                            {...field}
                            label="İade Tipi"
                            sx={{
                              borderRadius: '12px',
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#d32f2f'
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#d32f2f'
                              }
                            }}
                          >
                            <MenuItem value="full">Tam İade</MenuItem>
                            <MenuItem value="partial">Kısmi İade</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Controller
                      name="returnReason"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="İade Sebebi"
                          fullWidth
                          multiline
                          rows={3}
                          placeholder="İade sebebini detaylı olarak açıklayın..."
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              '&:hover fieldset': {
                                borderColor: '#d32f2f'
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#d32f2f'
                              }
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={4}>
            {/* Sol Kolon - Müşteri Bilgileri */}
            <Grid item xs={12} lg={6}>
              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#25638f', 
                    fontWeight: 'bold', 
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    '&:before': {
                      content: '""',
                      width: '4px',
                      height: '20px',
                      backgroundColor: '#25638f',
                      marginRight: '12px',
                      borderRadius: '2px'
                    }
                  }}
                >
                  Müşteri Bilgileri
                </Typography>
                
                <Controller
                  name="customerId"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={customers}
                      getOptionLabel={(option) => option.label}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      onChange={(_, data) => field.onChange(data)}
                      value={field.value}
                      renderInput={(params) => (
                        <TextField 
                          {...params} 
                          label="Müşteri Seçiniz" 
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              '&:hover fieldset': {
                                borderColor: '#25638f'
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#25638f'
                              }
                            }
                          }}
                        />
                      )}
                    />
                  )}
                />
                
                {selectedCustomer && (
                  <Box 
                    sx={{ 
                      mt: 2,
                      p: 3, 
                      border: `1px solid #e0e0e0`, 
                      borderRadius: '12px', 
                      backgroundColor: '#f8f9fa',
                      borderLeft: '4px solid #25638f'
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="bold" color="#25638f" sx={{ mb: 1 }}>
                      Seçilen Müşteri Detayları
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      📍 {selectedCustomer.address}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      🏢 Vergi Dairesi: {selectedCustomer.taxOffice}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      📄 Vergi No: {selectedCustomer.taxNo}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>



            {/* Sağ Kolon - Fatura Detayları */}
            <Grid item xs={12} lg={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#25638f', 
                    fontWeight: 'bold', 
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    '&:before': {
                      content: '""',
                      width: '4px',
                      height: '20px',
                      backgroundColor: '#25638f',
                      marginRight: '12px',
                      borderRadius: '2px'
                    }
                  }}
                >
                  Fatura Detayları
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="invoiceDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker 
                          value={field.value}
                          onChange={field.onChange}
                          label="Fatura Tarihi" 
                          renderInput={(params) => (
                            <TextField 
                              {...params} 
                              fullWidth 
                              error={!!errors.invoiceDate}
                              helperText={errors.invoiceDate?.message}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '12px'
                                }
                              }}
                            />
                          )} 
                        />
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="dueDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker 
                          value={field.value}
                          onChange={field.onChange}
                          label="Vade Tarihi" 
                          renderInput={(params) => (
                            <TextField 
                              {...params} 
                              fullWidth 
                              error={!!errors.dueDate}
                              helperText={errors.dueDate?.message}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '12px'
                                }
                              }}
                            />
                          )} 
                        />
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Ödeme Yöntemi</InputLabel>
                      <Controller
                        name="paymentMethod"
                        control={control}
                        render={({ field }) => (
                          <Select 
                            {...field} 
                            label="Ödeme Yöntemi"
                            sx={{
                              borderRadius: '12px',
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#25638f'
                              }
                            }}
                          >
                            <MenuItem value="Nakit">💵 Nakit</MenuItem>
                            <MenuItem value="Kredi Kartı">💳 Kredi Kartı</MenuItem>
                            <MenuItem value="Havale/EFT">🏦 Havale/EFT</MenuItem>
                            <MenuItem value="Çek">📄 Çek</MenuItem>
                            <MenuItem value="Senet">📋 Senet</MenuItem>
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Ödeme Durumu</InputLabel>
                      <Controller
                        name="paymentStatus"
                        control={control}
                        render={({ field }) => (
                          <Select 
                            {...field} 
                            label="Ödeme Durumu"
                            sx={{
                              borderRadius: '12px',
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#25638f'
                              }
                            }}
                          >
                            <MenuItem value="Ödendi">✅ Ödendi</MenuItem>
                            <MenuItem value="Ödenmedi">❌ Ödenmedi</MenuItem>
                            <MenuItem value="Kısmi Ödendi">⚠️ Kısmi Ödendi</MenuItem>
                            <MenuItem value="Beklemede">⏳ Beklemede</MenuItem>
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Giriş Deposu</InputLabel>
                      <Controller
                        name="warehouse"
                        control={control}
                        render={({ field }) => (
                          <Select 
                            {...field} 
                            label="Giriş Deposu"
                            sx={{
                              borderRadius: '12px',
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#25638f'
                              }
                            }}
                          >
                            <MenuItem value="Ana Depo">🏢 Ana Depo</MenuItem>
                            <MenuItem value="Şube 1">🏪 Şube 1</MenuItem>
                            <MenuItem value="Şube 2">🏪 Şube 2</MenuItem>
                            <MenuItem value="Geçici Depo">📦 Geçici Depo</MenuItem>
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Para Birimi</InputLabel>
                      <Controller
                        name="currency"
                        control={control}
                        render={({ field }) => (
                          <Select 
                            {...field} 
                            label="Para Birimi"
                            sx={{
                              borderRadius: '12px',
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#25638f'
                              }
                            }}
                          >
                            <MenuItem value="TRY">🇹🇷 Türk Lirası (TRY)</MenuItem>
                            <MenuItem value="USD">🇺🇸 Amerikan Doları (USD)</MenuItem>
                            <MenuItem value="EUR">🇪🇺 Euro (EUR)</MenuItem>
                            <MenuItem value="GBP">🇬🇧 İngiliz Sterlini (GBP)</MenuItem>
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <TextField 
                          {...field} 
                          label="Açıklama / Notlar" 
                          fullWidth 
                          multiline 
                          rows={3}
                          placeholder="Fatura ile ilgili ek açıklamalarınızı buraya yazabilirsiniz..."
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              '&:hover fieldset': {
                                borderColor: '#25638f'
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#25638f'
                              }
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Fatura Kalemleri */}
      <Paper 
        elevation={0} 
        sx={{ 
          borderRadius: '16px', 
          border: `2px solid ${theme.palette.divider}`,
          mb: 3,
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box 
          sx={{ 
            background: 'linear-gradient(135deg, #ff5722 0%, #ff1744 100%)',
            color: '#ffffff',
            p: 3,
            textAlign: 'center'
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Fatura Kalemleri
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
            Ürün ve hizmet detaylarını düzenleyiniz
          </Typography>
        </Box>

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {fields.map((item, index) => (
            <Box key={item.id} sx={{ mb: 3, p: 3, border: '1px solid #e0e0e0', borderRadius: '12px', backgroundColor: '#fafafa' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#25638f', fontWeight: 'bold' }}>
                  Ürün/Hizmet #{index + 1}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={(e) => handleMenuOpen(e, index)}
                    sx={{
                      borderColor: '#25638f',
                      color: '#25638f',
                      borderRadius: '6px',
                      minWidth: 'auto',
                      px: 2,
                      '&:hover': {
                        borderColor: '#120a8f',
                        backgroundColor: 'rgba(37, 99, 143, 0.1)'
                      }
                    }}
                  >
                    <Add /> Ekle
                  </Button>
                  {fields.length > 1 && (
                    <IconButton 
                      onClick={() => remove(index)} 
                      sx={{ 
                        color: '#ff1744',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 23, 68, 0.1)'
                        }
                      }}
                    >
                      <Delete />
                    </IconButton>
                  )}
                </Box>
              </Box>
              
              <Grid container spacing={3}>
                {/* Ürün Adı - Tam genişlikte üstte */}
                <Grid item xs={12}>
                  <Controller
                    name={`items.${index}.productName`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Ürün Adı"
                        fullWidth
                        placeholder="Ürün veya hizmet adını giriniz"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            backgroundColor: '#fafafa'
                          }
                        }}
                      />
                    )}
                  />
                </Grid>
                
                {/* Alt satır - Miktar, Birim, Birim Fiyat, KDV Oranı */}
                <Grid item xs={6} sm={3}>
                  <Controller
                    name={`items.${index}.quantity`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Miktar"
                        type="number"
                        fullWidth
                        inputProps={{ min: 0, step: 0.01 }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px'
                          }
                        }}
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Controller
                    name={`items.${index}.unit`}
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Birim</InputLabel>
                        <Select 
                          {...field} 
                          label="Birim"
                          sx={{
                            borderRadius: '8px'
                          }}
                        >
                          <MenuItem value="Adet">Adet</MenuItem>
                          <MenuItem value="Kg">Kg</MenuItem>
                          <MenuItem value="Lt">Lt</MenuItem>
                          <MenuItem value="M">M</MenuItem>
                          <MenuItem value="M²">M²</MenuItem>
                          <MenuItem value="M³">M³</MenuItem>
                          <MenuItem value="Saat">Saat</MenuItem>
                          <MenuItem value="Gün">Gün</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Controller
                    name={`items.${index}.unitPrice`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Birim Fiyat"
                        type="number"
                        fullWidth
                        inputProps={{ min: 0, step: 0.01 }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px'
                          }
                        }}
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Controller
                    name={`items.${index}.vatRate`}
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>KDV Oranı</InputLabel>
                        <Select 
                          {...field} 
                          label="KDV Oranı"
                          sx={{
                            borderRadius: '8px'
                          }}
                        >
                          <MenuItem value={0}>%0</MenuItem>
                          <MenuItem value={1}>%1</MenuItem>
                          <MenuItem value={8}>%8</MenuItem>
                          <MenuItem value={18}>%18</MenuItem>
                          <MenuItem value={20}>%20</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                
                {/* Dinamik Alanlar */}
                {/* Açıklama Alanı */}
                {itemFields[index]?.description && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Controller
                        name={`items.${index}.description`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Açıklama"
                            fullWidth
                            multiline
                            rows={2}
                            placeholder="Ürün açıklamasını giriniz"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '8px'
                              }
                            }}
                          />
                        )}
                      />
                      <IconButton
                        onClick={() => handleRemoveDescription(index)}
                        sx={{ color: '#ff1744' }}
                      >
                        <Close />
                      </IconButton>
                    </Box>
                  </Grid>
                )}
                
                {/* İndirim Alanı */}
                {itemFields[index]?.discount && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Grid container spacing={2} sx={{ flex: 1 }}>
                        <Grid item xs={6}>
                          <Controller
                            name={`items.${index}.discountType`}
                            control={control}
                            render={({ field }) => (
                              <FormControl fullWidth>
                                <InputLabel>İndirim Tipi</InputLabel>
                                <Select {...field} label="İndirim Tipi">
                                  <MenuItem value="percentage">Yuzde (%)</MenuItem>
                                  <MenuItem value="amount">Tutar (₺)</MenuItem>
                                </Select>
                              </FormControl>
                            )}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Controller
                            name={`items.${index}.discountValue`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="İndirim Değeri"
                                type="number"
                                fullWidth
                                inputProps={{ min: 0, step: 0.01 }}
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                      <IconButton
                        onClick={() => handleRemoveDiscount(index)}
                        sx={{ color: '#ff1744' }}
                      >
                        <Close />
                      </IconButton>
                    </Box>
                  </Grid>
                )}
                
                {/* ÖTV Alanı */}
                {itemFields[index]?.sct && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Controller
                        name={`items.${index}.sctRate`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="ÖTV Oranı (%)"
                            type="number"
                            fullWidth
                            inputProps={{ min: 0, max: 100, step: 0.01 }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '8px'
                              }
                            }}
                          />
                        )}
                      />
                      <IconButton
                        onClick={() => handleRemoveSct(index)}
                        sx={{ color: '#ff1744' }}
                      >
                        <Close />
                      </IconButton>
                    </Box>
                  </Grid>
                )}
                
                {/* İletişim Vergisi */}
                {itemFields[index]?.communicationTax && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Controller
                        name={`items.${index}.communicationTaxRate`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="İletişim Vergisi Oranı (%)"
                            type="number"
                            fullWidth
                            inputProps={{ min: 0, max: 100, step: 0.01 }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '8px'
                              }
                            }}
                          />
                        )}
                      />
                      <IconButton
                        onClick={() => handleRemoveCommunicationTax(index)}
                        sx={{ color: '#ff1744' }}
                      >
                        <Close />
                      </IconButton>
                    </Box>
                  </Grid>
                )}
                
                {/* Konaklama Vergisi */}
                {itemFields[index]?.accommodationTax && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Controller
                        name={`items.${index}.accommodationTaxRate`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Konaklama Vergisi Oranı (%)"
                            type="number"
                            fullWidth
                            inputProps={{ min: 0, max: 100, step: 0.01 }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '8px'
                              }
                            }}
                          />
                        )}
                      />
                      <IconButton
                        onClick={() => handleRemoveAccommodationTax(index)}
                        sx={{ color: '#ff1744' }}
                      >
                        <Close />
                      </IconButton>
                    </Box>
                  </Grid>
                )}
                
                {/* KDV Muafiyeti */}
                {itemFields[index]?.vatExemption && (
                  <Grid item xs={12}>
                    <Box sx={{ 
                      p: 2, 
                      backgroundColor: '#fff3cd', 
                      borderRadius: '8px',
                      border: '1px solid #ffeaa7',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#856404' }}>
                        ⚠️ KDV Muafiyeti Aktif
                      </Typography>
                      <Controller
                        name={`items.${index}.vatExemptionReason`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Muafiyet Sebebi"
                            placeholder="KDV muafiyeti sebebini giriniz"
                            sx={{ flex: 1 }}
                          />
                        )}
                      />
                      <IconButton
                        onClick={() => handleToggleVatExemption(index)}
                        sx={{ color: '#ff1744' }}
                      >
                        <Close />
                      </IconButton>
                    </Box>
                  </Grid>
                )}
                
                {/* Toplam Tutar ve İşlem Butonları */}
                <Grid item xs={12}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mt: 2, 
                    p: 2, 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: '8px',
                    border: '1px solid #dee2e6'
                  }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#6c757d', mb: 0.5 }}>
                        Toplam Tutar
                      </Typography>
                      {(() => {
                        const quantity = watchedItems[index]?.quantity || 0;
                        const unitPrice = watchedItems[index]?.unitPrice || 0;
                        const vatRate = watchedItems[index]?.vatRate || 0;
                        const discountValue = watchedItems[index]?.discountValue || 0;
                        const discountType = watchedItems[index]?.discountType;
                        
                        const itemSubtotal = quantity * unitPrice;
                        let discountAmount = 0;
                        
                        // İndirim hesaplama
                        if (itemFields[index]?.discount && discountType && discountValue > 0) {
                          if (discountType === 'percentage') {
                            discountAmount = itemSubtotal * (discountValue / 100);
                          } else {
                            discountAmount = discountValue;
                          }
                        }
                        
                        const netAmount = itemSubtotal - discountAmount;
                        const isVatExempt = itemFields[index]?.vatExemption;
                        const vatAmount = isVatExempt ? 0 : netAmount * (vatRate / 100);
                        const totalWithVat = netAmount + vatAmount;
                        
                        return (
                          <Box>
                            <Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#6c757d' }}>
                              Net: {netAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TRY
                            </Typography>
                            {!isVatExempt && vatAmount > 0 && (
                              <Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#25638f' }}>
                                KDV (%{vatRate}): {vatAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TRY
                              </Typography>
                            )}
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#120a8f' }}>
                              Toplam: {totalWithVat.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TRY
                            </Typography>
                          </Box>
                        );
                      })()}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          borderColor: '#6c757d',
                          color: '#6c757d',
                          borderRadius: '6px',
                          '&:hover': {
                            borderColor: '#5a6268',
                            backgroundColor: 'rgba(108, 117, 125, 0.1)'
                          }
                        }}
                      >
                        🔄 İptal Ekle
                      </Button>
                      {fields.length > 1 && (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => remove(index)}
                          sx={{
                            backgroundColor: '#ff1744',
                            borderRadius: '6px',
                            '&:hover': {
                              backgroundColor: '#ff5722'
                            }
                          }}
                        >
                          🗑️ Sil
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          ))}
          
          {/* Yeni Kalem Ekle Butonu */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              variant="outlined"
              startIcon={<AddCircleOutline />}
              onClick={() => append({ ...defaultInvoiceItem })}
              sx={{
                borderColor: '#25638f',
                color: '#25638f',
                borderRadius: '20px',
                px: 4,
                py: 1,
                fontWeight: 'bold',
                '&:hover': {
                  borderColor: '#120a8f',
                  backgroundColor: 'rgba(37, 99, 143, 0.1)'
                }
              }}
            >
              + Yeni Kalem Ekle
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Fatura Özeti */}
      <Paper 
        elevation={0} 
        sx={{ 
          borderRadius: '16px', 
          border: `2px solid ${theme.palette.divider}`,
          mb: 3,
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box 
          sx={{ 
            background: 'linear-gradient(135deg, #120a8f 0%, #25638f 100%)',
            color: '#ffffff',
            p: 3,
            textAlign: 'center'
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Fatura Özeti
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
            Toplam tutarlar ve vergi hesaplamaları
          </Typography>
        </Box>

        <Box sx={{ p: { xs: 3, md: 4 } }}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Fatura Notları"
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Fatura ile ilgili özel notlarınızı buraya yazabilirsiniz..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        '&:hover fieldset': {
                          borderColor: '#25638f'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#25638f'
                        }
                      }
                    }}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} lg={4}>
              <Box sx={{ 
                p: { xs: 2, sm: 3 }, 
                backgroundColor: '#f8f9fa', 
                borderRadius: { xs: '12px', sm: '16px' },
                border: '1px solid #e9ecef',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                mt: { xs: 2, lg: 0 }
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: { xs: 1.5, sm: 2 }, 
                    color: '#25638f', 
                    fontWeight: 'bold',
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}
                >
                  💰 Fatura Toplamları
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: { xs: 0.5, sm: 1 } }}>
                  <Typography variant="body2">Brut Toplam:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {grossTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                  </Typography>
                </Box>
                
                {totalDiscount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: { xs: 0.5, sm: 1 } }}>
                    <Typography variant="body2" sx={{ color: '#ff1744' }}>Satır İndirimleri:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ff1744' }}>
                      -{totalDiscount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                    </Typography>
                  </Box>
                )}
                
                {/* Ara Toplam İndirimi Giriş Alanı */}
                {includeSubtotalDiscount && (
                  <Box sx={{ 
                    mb: 2, 
                    p: 2, 
                    backgroundColor: '#fff3cd', 
                    borderRadius: '8px',
                    border: '1px solid #ffeaa7'
                  }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold', color: '#856404' }}>
                      🏷️ Ara Toplam İndirimi
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <FormControl size="small" sx={{ minWidth: 80 }}>
                        <Select
                          value={subtotalDiscountType}
                          onChange={(e) => setSubtotalDiscountType(e.target.value as 'percentage' | 'amount')}
                          sx={{ backgroundColor: '#ffffff' }}
                        >
                          <MenuItem value="percentage">%</MenuItem>
                          <MenuItem value="amount">$</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        size="small"
                        type="number"
                        value={subtotalDiscountValue}
                        onChange={(e) => setSubtotalDiscountValue(Number(e.target.value))}
                        inputProps={{ min: 0, step: 0.01 }}
                        sx={{ 
                          flex: 1,
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: '#ffffff'
                          }
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => {
                          setIncludeSubtotalDiscount(false);
                          setSubtotalDiscountValue(0);
                        }}
                        sx={{ color: '#ff1744' }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                )}
                
                {subtotalDiscountAmount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: { xs: 0.5, sm: 1 } }}>
                    <Typography variant="body2" sx={{ color: '#ff1744' }}>Ara Toplam İndirimi:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ff1744' }}>
                      -{subtotalDiscountAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                    </Typography>
                  </Box>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2">Ara Toplam:</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => setSubtotalMenuAnchor(e.currentTarget)}
                      sx={{
                        color: '#25638f',
                        backgroundColor: 'rgba(37, 99, 143, 0.1)',
                        '&:hover': {
                          backgroundColor: 'rgba(37, 99, 143, 0.2)'
                        }
                      }}
                    >
                      <Add fontSize="small" />
                    </IconButton>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {subTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                    </Typography>
                  </Box>
                </Box>
                
                {totalSct > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: { xs: 0.5, sm: 1 } }}>
                    <Typography variant="body2">ÖTV:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {totalSct.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                    </Typography>
                  </Box>
                )}
                
                {totalCommunicationTax > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: { xs: 0.5, sm: 1 } }}>
                    <Typography variant="body2">İletişim Vergisi:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {totalCommunicationTax.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                    </Typography>
                  </Box>
                )}
                
                {totalAccommodationTax > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: { xs: 0.5, sm: 1 } }}>
                    <Typography variant="body2">Konaklama Vergisi:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {totalAccommodationTax.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                    </Typography>
                  </Box>
                )}
                
                {/* KDV Detayları */}
                {Object.keys(vatBreakdown).length > 0 ? (
                  Object.entries(vatBreakdown).map(([rate, data]) => (
                    <Box key={rate} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">KDV %{rate} ({data.base.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺ üzerinden):</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {data.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: { xs: 0.5, sm: 1 } }}>
                    <Typography variant="body2">KDV:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {vatTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                    </Typography>
                  </Box>
                )}
                
                {/* Stopaj Giriş Alanı */}
                {includeStopaj && (
                  <Box sx={{ 
                    mb: 2, 
                    p: 2, 
                    backgroundColor: '#fff3cd', 
                    borderRadius: '8px',
                    border: '1px solid #ffeaa7'
                  }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold', color: '#856404' }}>
                      💰 Stopaj Oranı
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <TextField
                        size="small"
                        type="number"
                        value={stopajRateForm || 0}
                        onChange={(e) => setValue('stopajRate', Number(e.target.value))}
                        inputProps={{ min: 0, max: 100, step: 0.01 }}
                        InputProps={{
                          endAdornment: <Typography variant="body2" sx={{ color: '#666' }}>%</Typography>
                        }}
                        sx={{ 
                          flex: 1,
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: '#ffffff'
                          }
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => {
                          setIncludeStopaj(false);
                          setValue('stopajRate', 0);
                        }}
                        sx={{ color: '#ff1744' }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                )}
                
                {includeStopaj && stopajTotal > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: { xs: 0.5, sm: 1 } }}>
                    <Typography variant="body2" sx={{ color: '#ff5722' }}>Stopaj ({stopajRateForm || 0}%):</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ff5722' }}>
                      -{stopajTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                    </Typography>
                  </Box>
                )}
                
                <Divider sx={{ my: { xs: 1.5, sm: 2 } }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: '#120a8f',
                      fontSize: { xs: '1.1rem', sm: '1.25rem' }
                    }}
                  >
                    Genel Toplam:
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: '#120a8f',
                      fontSize: { xs: '1.1rem', sm: '1.25rem' }
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={(e) => setTevkifatMenuAnchor(e.currentTarget)}
                      sx={{
                        color: '#120a8f',
                        backgroundColor: 'rgba(18, 10, 143, 0.1)',
                        mr: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(18, 10, 143, 0.2)'
                        }
                      }}
                    >
                      <Add fontSize="small" />
                    </IconButton>
                    {grandTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                  </Typography>
                </Box>

                {/* TL KARŞILIĞI Bölümü - Sadece TL dışındaki para birimleri için göster */}
                {selectedCurrency !== 'TRY' && (
                  <Box sx={{ 
                    mt: 3, 
                    p: 2, 
                    backgroundColor: '#f0f8ff', 
                    borderRadius: '12px',
                    border: '1px solid #e3f2fd'
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                        TL KARŞILIĞI
                      </Typography>
                    </Box>
                    
                    {/* Tevkifat Giriş Alanı */}
                    {includeTevkifat && (
                      <Box sx={{ 
                        mb: 2, 
                        p: 2, 
                        backgroundColor: '#fff3cd', 
                        borderRadius: '8px',
                        border: '1px solid #ffeaa7'
                      }}>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold', color: '#856404' }}>
                          📄 Tevkifat Oranı
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <TextField
                            size="small"
                            type="number"
                            value={tevkifatRate || 0}
                            onChange={(e) => setTevkifatRate(Number(e.target.value))}
                            inputProps={{ min: 0, max: 100, step: 0.01 }}
                            InputProps={{
                              endAdornment: <Typography variant="body2" sx={{ color: '#666' }}>/10</Typography>
                            }}
                            sx={{ 
                              flex: 1,
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: '#ffffff'
                              }
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => {
                              setIncludeTevkifat(false);
                              setTevkifatRate(0);
                            }}
                            sx={{ color: '#ff1744' }}
                          >
                            <Close fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    )}
                    
                    {tevkifatAmount > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#ff1744' }}>KDV TEVKİFATI {tevkifatRate}/10:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ff1744' }}>
                          -{tevkifatAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          size="large"
          sx={{
            borderRadius: '20px',
            px: 4,
            py: 1.5,
            borderColor: '#ff5722',
            color: '#ff5722',
            '&:hover': {
              borderColor: '#ff1744',
              backgroundColor: 'rgba(255, 87, 34, 0.1)'
            }
          }}
        >
          ❌ İptal Et
        </Button>
        
        <Button
          variant="outlined"
          size="large"
          sx={{
            borderRadius: '20px',
            px: 4,
            py: 1.5,
            borderColor: '#ffc107',
            color: '#ffc107',
            '&:hover': {
              borderColor: '#e0a800',
              backgroundColor: 'rgba(255, 193, 7, 0.1)'
            }
          }}
        >
          📄 Taslak Olarak Kaydet
        </Button>
        
        <Button
          variant="contained"
          size="large"
          sx={{
            borderRadius: '20px',
            px: 4,
            py: 1.5,
            background: 'linear-gradient(135deg, #25638f 0%, #120a8f 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #120a8f 0%, #25638f 100%)'
            }
          }}
        >
          ✅ Faturayı Kaydet
        </Button>
      </Box>
      
      {/* Menü - Gelişmiş Özellikler */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            mt: 1
          }
        }}
      >
        <MenuItem 
          onClick={() => currentItemIndex !== null && handleAddDescription(currentItemIndex)}
          disabled={currentItemIndex !== null && itemFields[currentItemIndex]?.description}
          sx={{ py: 1.5, px: 3 }}
        >
          📝 Açıklama Ekle
        </MenuItem>
        <MenuItem 
          onClick={() => currentItemIndex !== null && handleAddDiscount(currentItemIndex)}
          disabled={currentItemIndex !== null && itemFields[currentItemIndex]?.discount}
          sx={{ py: 1.5, px: 3 }}
        >
          🏷️ İndirim Ekle
        </MenuItem>
        <MenuItem 
          onClick={() => currentItemIndex !== null && handleAddSct(currentItemIndex)}
          disabled={currentItemIndex !== null && itemFields[currentItemIndex]?.sct}
          sx={{ py: 1.5, px: 3 }}
        >
          💰 ÖTV Ekle
        </MenuItem>
        <MenuItem 
          onClick={() => currentItemIndex !== null && handleAddCommunicationTax(currentItemIndex)}
          disabled={currentItemIndex !== null && itemFields[currentItemIndex]?.communicationTax}
          sx={{ py: 1.5, px: 3 }}
        >
          📞 İletişim Vergisi
        </MenuItem>
        <MenuItem 
          onClick={() => currentItemIndex !== null && handleAddAccommodationTax(currentItemIndex)}
          disabled={currentItemIndex !== null && itemFields[currentItemIndex]?.accommodationTax}
          sx={{ py: 1.5, px: 3 }}
        >
          🏨 Konaklama Vergisi
        </MenuItem>
        <MenuItem 
          onClick={() => currentItemIndex !== null && handleToggleVatExemption(currentItemIndex)}
          sx={{ py: 1.5, px: 3 }}
        >
          {currentItemIndex !== null && itemFields[currentItemIndex]?.vatExemption ? '❌ KDV Muafiyeti Kaldır' : '✅ KDV Muafiyeti'}
        </MenuItem>
      </Menu>
      
      {/* Ara Toplam Menüsü */}
      <Menu
        anchorEl={subtotalMenuAnchor}
        open={Boolean(subtotalMenuAnchor)}
        onClose={() => setSubtotalMenuAnchor(null)}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            mt: 1,
            minWidth: 250
          }
        }}
      >
        <MenuItem 
          onClick={() => {
            setIncludeSubtotalDiscount(!includeSubtotalDiscount);
            setSubtotalMenuAnchor(null);
          }}
          sx={{ py: 1.5, px: 3 }}
        >
          🏷️ Ara Toplam İndirimi Ekle
        </MenuItem>
        <MenuItem 
          onClick={() => {
            setIncludeStopaj(!includeStopaj);
            setSubtotalMenuAnchor(null);
          }}
          sx={{ py: 1.5, px: 3, borderTop: '1px solid #f0f0f0' }}
        >
          💰 Stopaj Uygula
        </MenuItem>
        
        {/* Stopaj Oranları */}
        {includeStopaj && (
          <Box sx={{ px: 2, pb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: '#666', fontWeight: 'bold' }}>
              Stopaj Oranları:
            </Typography>
            {[3, 10, 15, 17, 20].map((rate) => (
              <MenuItem
                key={rate}
                onClick={() => {
                  setValue('stopajRate', rate);
                  setSubtotalMenuAnchor(null);
                }}
                sx={{
                  py: 0.5,
                  px: 2,
                  fontSize: '0.9rem',
                  backgroundColor: stopajRateForm === rate ? 'rgba(37, 99, 143, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(37, 99, 143, 0.1)'
                  }
                }}
              >
                % {rate} Stopaj Uygula
              </MenuItem>
            ))}
          </Box>
        )}
      </Menu>
      
      {/* Tevkifat Menüsü */}
      <Menu
        anchorEl={tevkifatMenuAnchor}
        open={Boolean(tevkifatMenuAnchor)}
        onClose={() => setTevkifatMenuAnchor(null)}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            mt: 1,
            minWidth: 250
          }
        }}
      >
        <MenuItem 
          onClick={() => {
            setIncludeTevkifat(!includeTevkifat);
            setTevkifatMenuAnchor(null);
          }}
          sx={{ py: 1.5, px: 3 }}
        >
          📄 Tümüne Tevkifat Uygula
        </MenuItem>
        
        {/* Tevkifat Oranları */}
        {includeTevkifat && (
          <Box sx={{ px: 2, pb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: '#666', fontWeight: 'bold' }}>
              Tevkifat Oranları:
            </Typography>
            {[2, 3, 5, 7, 9].map((rate) => (
              <MenuItem
                key={rate}
                onClick={() => {
                  setTevkifatRate(rate);
                  setTevkifatMenuAnchor(null);
                }}
                sx={{
                  py: 0.5,
                  px: 2,
                  fontSize: '0.9rem',
                  backgroundColor: tevkifatRate === rate ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.1)'
                  }
                }}
              >
                {rate}/10 Tevkifat
              </MenuItem>
            ))}
          </Box>
        )}
      </Menu>
      </form>
    </Box>
  );
};

export default CreateReturnInvoicePage;
