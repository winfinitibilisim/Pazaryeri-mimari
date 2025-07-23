import React, { useState, useEffect, useMemo } from 'react';
import { useForm, Controller, useFieldArray, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Add, AddCircleOutline, Close, Delete } from '@mui/icons-material';
import {
  CircularProgress,
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
  SelectChangeEvent,
  Button,
  IconButton,
  FormHelperText,
  InputAdornment,
  Menu,
  Chip
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import tr from 'date-fns/locale/tr';
import { useTranslation } from 'react-i18next';
import { Theme, useTheme } from '@mui/material/styles';
import tokens from '../../theme';
import AddNewProductModal from './AddNewProductModal';

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

// --- MOCK DATA ---
const customers: Customer[] = [
  { id: 1, label: 'Ahmet Yılmaz', address: 'Örnek Mah. Test Cad. No:1 D:2, İstanbul', taxOffice: 'Maslak', taxNo: '1234567890' },
  { id: 2, label: 'Ayşe Kaya', address: 'Kaya Mah. Deneme Sk. No:5, Ankara', taxOffice: 'Çankaya', taxNo: '0987654321' },
];

const validationSchema: yup.ObjectSchema<IFormInputs> = yup.object().shape({
    customerId: yup.mixed<Customer>().nullable().required('Müşteri seçimi zorunludur'),
    invoiceDate: yup.date().nullable().required('Fatura tarihi zorunludur'),
    dueDate: yup.date().nullable().required('Vade tarihi zorunludur'),
    items: yup.array().of(
        yup.object().shape({
            productName: yup.string().required('Ürün adı zorunludur'),
            quantity: yup.number().typeError('Miktar bir sayı olmalıdır').min(1, 'Miktar en az 1 olmalıdır').required('Miktar zorunludur'),
            unit: yup.string().required('Birim zorunludur'),
            unitPrice: yup.number().typeError('Birim fiyat bir sayı olmalıdır').min(0, 'Birim fiyatı negatif olamaz').required('Birim fiyatı zorunludur'),
            vatRate: yup.number().typeError('KDV oranı bir sayı olmalıdır').min(0, 'KDV oranı negatif olamaz').required('KDV oranı zorunludur'),
            discountType: yup.string().oneOf(['percentage', 'amount']).optional(),
            discountValue: yup.number().min(0, 'İndirim değeri negatif olamaz').optional(),
            sctRate: yup.number().min(0, 'ÖTV oranı negatif olamaz').optional(),
            communicationTaxRate: yup.number().min(0, 'ÖİV oranı negatif olamaz').optional(),
            sct2Rate: yup.number().min(0, 'ÖTV oranı negatif olamaz').optional(),
            accommodationTaxRate: yup.number().min(0, 'Konaklama vergisi oranı negatif olamaz').optional(),
            vatExemptionReason: yup.string().optional(),
        })
    ).min(1, 'En az bir fatura kalemi eklenmelidir').required(),
    stopajRate: yup.number().min(0, 'Stopaj oranı negatif olamaz').optional(),
    notes: yup.string().optional(),
    paymentMethod: yup.string().required('Ödeme şekli zorunludur.'),
    paymentStatus: yup.string().required('Ödeme durumu zorunludur.'),
    warehouse: yup.string().required('Depo zorunludur.'),
    description: yup.string().optional(),
    currency: yup.string().required('Para birimi zorunludur.'),
    invoiceLanguage: yup.string().required('Dil zorunludur.'),
    useForeignCurrency: yup.boolean().optional(),
    exchangeRate: yup.number().min(0, 'Döviz kuru negatif olamaz').optional(),
});

const EditSalesInvoicePage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const colors = tokens;
  const navigate = useNavigate();
  const { invoiceId } = useParams<{ invoiceId: string }>();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialCustomer, setInitialCustomer] = useState<any>(null);
  const [itemFields, setItemFields] = useState<ItemFieldsVisibility>({});
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(null);
  const [includeStopaj, setIncludeStopaj] = useState(false);
  const [subtotalMenuAnchor, setSubtotalMenuAnchor] = useState<HTMLElement | null>(null);
  const [includeSubtotalDiscount, setIncludeSubtotalDiscount] = useState(false);
  const [subtotalDiscountType, setSubtotalDiscountType] = useState<'percentage' | 'amount'>('percentage');
  const [subtotalDiscountValue, setSubtotalDiscountValue] = useState(0);

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

  const { control, handleSubmit, watch, setValue, reset, formState: { errors }, getValues } = useForm<IFormInputs>({
    resolver: yupResolver(validationSchema),
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

  const { grossTotal, totalDiscount, subTotal, totalSct, totalCommunicationTax, totalAccommodationTax, vatTotal, stopajTotal, grandTotal, subtotalDiscountAmount } = useMemo(() => {
    let grossTotal = 0;
    let totalDiscount = 0;
    let vatTotal = 0;
    let totalSct = 0;
    let totalCommunicationTax = 0;
    let totalAccommodationTax = 0;

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
    const grandTotal = subTotal + totalSct + totalCommunicationTax + totalAccommodationTax + vatTotal - stopajTotal;

    return { grossTotal, totalDiscount, subTotal, totalSct, totalCommunicationTax, totalAccommodationTax, vatTotal, stopajTotal, grandTotal, subtotalDiscountAmount };
  }, [watchedItems, includeStopaj, stopajRateForm, itemFields, watchAllItems, includeSubtotalDiscount, subtotalDiscountType, subtotalDiscountValue]);

  useEffect(() => {
    if (invoiceId) {
        console.log(`Fetching data for invoice ${invoiceId}...`);
        setTimeout(() => {
            const mockInvoiceData = {
                customerId: customers[0],
                invoiceDate: new Date('2023-10-26'),
                dueDate: new Date('2023-11-25'),
                items: [
                  { productName: 'Ürün 1', quantity: 2, unit: 'Adet', unitPrice: 100, vatRate: 20 },
                  { productName: 'Ürün 2', quantity: 3, unit: 'Adet', unitPrice: 200, vatRate: 20 },
                ],
                paymentMethod: 'Nakit',
                paymentStatus: 'Ödenmedi',
                warehouse: 'Ana Depo',
                currency: 'TRY',
                invoiceLanguage: 'tr',
                stopajRate: 0,
            };

            reset(mockInvoiceData);
            setInitialCustomer(mockInvoiceData.customerId);
            setLoading(false);
        }, 1000);
    } else {
        setLoading(false);
    }
  }, [invoiceId, reset]);

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
    setValue(`items.${index}.discountValue`, 0); // Başlangıç değeri
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

  const handleAddProduct = (product: any) => {
    append({ ...defaultInvoiceItem, ...product });
    setIsModalOpen(false);
  };



  const selectedCustomer = watch('customerId');

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Satış Faturası Düzenle
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
              background: 'linear-gradient(135deg, #25638f 0%, #1e4f73 100%)',
              color: 'white',
              p: 3,
              textAlign: 'center'
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              Fatura Bilgileri
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
              Müşteri ve fatura detaylarını güncelleyiniz
            </Typography>
          </Box>

          <Box sx={{ p: { xs: 3, md: 4 } }}>
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
                            error={!!errors.customerId}
                            helperText={errors.customerId?.message}
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
                            {...field} 
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
                            {...field} 
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
                        <InputLabel>Çıkış Deposu</InputLabel>
                        <Controller
                          name="warehouse"
                          control={control}
                          render={({ field }) => (
                            <Select 
                              {...field} 
                              label="Çıkış Deposu"
                              sx={{
                                borderRadius: '12px',
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#25638f'
                                }
                              }}
                            >
                              <MenuItem value="Ana Depo">🏢 Ana Depo</MenuItem>
                              <MenuItem value="İkinci Depo">🏬 İkinci Depo</MenuItem>
                              <MenuItem value="Üçüncü Depo">🏭 Üçüncü Depo</MenuItem>
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
                              <MenuItem value="TRY">🇹🇷 TRY (Türk Lirası)</MenuItem>
                              <MenuItem value="USD">🇺🇸 USD (Dolar)</MenuItem>
                              <MenuItem value="EUR">🇪🇺 EUR (Euro)</MenuItem>
                              <MenuItem value="GBP">🇬🇧 GBP (Sterlin)</MenuItem>
                            </Select>
                          )}
                        />
                      </FormControl>
                    </Grid>
                    
                    {/* Döviz Kuru Seçenekleri */}
                    {selectedCurrency !== 'TRY' && (
                      <>
                        <Grid item xs={12}>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              color: '#25638f', 
                              fontWeight: 'bold', 
                              mb: 1,
                              display: 'flex',
                              alignItems: 'center',
                              '&:before': {
                                content: '""',
                                width: '3px',
                                height: '16px',
                                backgroundColor: '#25638f',
                                marginRight: '8px',
                                borderRadius: '2px'
                              }
                            }}
                          >
                            Döviz Kuru Ayarları
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                            <Controller
                              name="useForeignCurrency"
                              control={control}
                              render={({ field }) => (
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                  <Button
                                    variant={!field.value ? "contained" : "outlined"}
                                    onClick={() => field.onChange(false)}
                                    sx={{
                                      borderRadius: '20px',
                                      px: 3,
                                      backgroundColor: !field.value ? '#25638f' : 'transparent',
                                      borderColor: '#25638f',
                                      color: !field.value ? 'white' : '#25638f',
                                      '&:hover': {
                                        backgroundColor: !field.value ? '#1e4f73' : 'rgba(37, 99, 143, 0.1)'
                                      }
                                    }}
                                  >
                                    💵 Bakiye'ye TL İşle
                                  </Button>
                                  <Button
                                    variant={field.value ? "contained" : "outlined"}
                                    onClick={() => field.onChange(true)}
                                    sx={{
                                      borderRadius: '20px',
                                      px: 3,
                                      backgroundColor: field.value ? '#25638f' : 'transparent',
                                      borderColor: '#25638f',
                                      color: field.value ? 'white' : '#25638f',
                                      '&:hover': {
                                        backgroundColor: field.value ? '#1e4f73' : 'rgba(37, 99, 143, 0.1)'
                                      }
                                    }}
                                  >
                                    💱 Bakiye'ye Döviz İşle
                                  </Button>
                                </Box>
                              )}
                            />
                          </Box>
                        </Grid>
                        
                        {useForeignCurrency && (
                          <Grid item xs={12} sm={6}>
                            <Controller
                              name="exchangeRate"
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Döviz Kuru"
                                  type="number"
                                  fullWidth
                                  placeholder="1"
                                  InputProps={{
                                    endAdornment: (
                                      <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        color: '#25638f',
                                        fontWeight: 'bold',
                                        fontSize: '14px'
                                      }}>
                                        ₺
                                      </Box>
                                    )
                                  }}
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
                        )}
                      </>
                    )}
                    
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

        {/* Invoice Items Table */}
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: '16px', 
            border: `2px solid ${theme.palette.divider}`,
            mb: 3,
            overflow: 'hidden'
          }}
        >
          {/* Table Header */}
          <Box 
            sx={{ 
              background: 'linear-gradient(135deg, #25638f 0%, #1e4f73 100%)',
              color: 'white',
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
          {fields.map((item, index) => {
            const watchedItem = (watchedItems && watchedItems[index]) ? watchedItems[index] : defaultInvoiceItem;
            const quantity = watchedItem.quantity || 0;
            const unitPrice = watchedItem.unitPrice || 0;
            const vatRate = watchedItem.vatRate || 0;
            const discountType = watchedItem.discountType;
            const discountValue = watchedItem.discountValue || 0;
            const sctRate = watchedItem.sctRate || 0;

            let itemSubtotal = quantity * unitPrice;
            let discountAmount = 0;
            if (discountType === 'percentage') {
              discountAmount = itemSubtotal * (discountValue / 100);
            } else if (discountType === 'amount') {
              discountAmount = discountValue;
            }
            const totalAfterDiscount = itemSubtotal - discountAmount;
            const sctAmount = totalAfterDiscount * (sctRate / 100);
            const totalAfterSct = totalAfterDiscount + sctAmount;
            const communicationTaxRate = watchedItem.communicationTaxRate || 0;
            const communicationTaxAmount = totalAfterSct * (communicationTaxRate / 100);
            const totalAfterCommunicationTax = totalAfterSct + communicationTaxAmount;

            const accommodationTaxRate = watchedItem.accommodationTaxRate || 0;
            const accommodationTaxAmount = totalAfterCommunicationTax * (accommodationTaxRate / 100);
            const totalAfterAccommodationTax = totalAfterCommunicationTax + accommodationTaxAmount;

            const isVatExempt = itemFields[index]?.vatExemption;
            const vatAmount = isVatExempt ? 0 : totalAfterDiscount * (vatRate / 100); // KDV matrahı indirim sonrası tutardır.
            const total = totalAfterAccommodationTax + vatAmount;

            return (
              <Box key={item.id} sx={{ mb: 2, p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: '8px' }}>
                <Grid container spacing={2} alignItems="flex-start">
                  {/* Row 1: Product Name */}
                  <Grid item xs={12}>
                    <Controller
                      name={`items.${index}.productName`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t('editSalesInvoicePage.productName')}
                          fullWidth
                          error={!!errors.items?.[index]?.productName}
                          helperText={errors.items?.[index]?.productName?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* Row 2: Dynamic Fields (Description, Discount) */}
                  {itemFields[index]?.description && (
                    <Grid item xs={12}>
                      <Controller
                        name={`items.${index}.description`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={t('editSalesInvoicePage.description')}
                            fullWidth
                            size="small"
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton onClick={() => handleRemoveDescription(index)} size="small">
                                    <Close />
                                  </IconButton>
                                  <InputAdornment position="start">%</InputAdornment>
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>
                  )}
                  {itemFields[index]?.vatExemption && (
                    <Grid item xs={12}>
                      <Chip label={t('editSalesInvoicePage.vatExempt', 'Muaf')} color="success" size="small" sx={{ ml: 1 }} />
                    </Grid>
                  )}
                  {itemFields[index]?.discount && (
                    <Grid item xs={12}>
                      <Grid container spacing={1} alignItems="center">
                        <Grid item xs={4} sm={2}>
                          <Controller
                            name={`items.${index}.discountType`}
                            control={control}
                            render={({ field }) => (
                              <FormControl fullWidth size="small">
                                <InputLabel>{t('editSalesInvoicePage.discountType')}</InputLabel>
                                <Select {...field} value={field.value || ''} label={t('editSalesInvoicePage.discountType')}>
                                  <MenuItem value="percentage">%</MenuItem>
                                  <MenuItem value="amount">{t('amount')}</MenuItem>
                                </Select>
                              </FormControl>
                            )}
                          />
                        </Grid>
                        <Grid item xs={6} sm={9}>
                          <Controller
                            name={`items.${index}.discountValue`}
                            control={control}
                            render={({ field }) => (
                              <TextField {...field} label={t('editSalesInvoicePage.discountValue')} type="number" fullWidth size="small" />
                            )}
                          />
                        </Grid>
                        <Grid item xs={2} sm={1}>
                          <IconButton onClick={() => handleRemoveDiscount(index)} size="small">
                            <Close />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                  {itemFields[index]?.sct && (
                    <Grid item xs={12}>
                      <Grid container spacing={1} alignItems="center">
                        <Grid item xs={10} sm={11}>
                          <Controller
                            name={`items.${index}.sctRate`}
                            control={control}
                            render={({ field }) => (
                              <TextField 
                                {...field} 
                                label={t('editSalesInvoicePage.sctRate', { defaultValue: 'ÖTV Oranı (%)' })} 
                                type="number" 
                                fullWidth 
                                size="small" 
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={2} sm={1}>
                          <IconButton onClick={() => handleRemoveSct(index)} size="small">
                            <Close />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                  {itemFields[index]?.communicationTax && (
                    <Grid item xs={12}>
                      <Grid container spacing={1} alignItems="center">
                        <Grid item xs={10} sm={11}>
                          <Controller
                            name={`items.${index}.communicationTaxRate`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label={t('editSalesInvoicePage.communicationTaxRate', 'ÖİV Oranı (%)')}
                                type="number"
                                fullWidth
                                size="small"
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={2} sm={1}>
                          <IconButton onClick={() => handleRemoveCommunicationTax(index)} size="small">
                            <Close />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                  {itemFields[index]?.accommodationTax && (
                    <Grid item xs={12}>
                      <Grid container spacing={1} alignItems="center">
                        <Grid item xs={10} sm={11}>
                          <Controller
                            name={`items.${index}.accommodationTaxRate`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label={t('editSalesInvoicePage.accommodationTaxRate', 'Konaklama Vergisi Oranı (%)')}
                                type="number"
                                fullWidth
                                size="small"
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={2} sm={1}>
                          <IconButton onClick={() => handleRemoveAccommodationTax(index)} size="small">
                            <Close />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}

                  {/* Row 3: Quantity, Unit, Price, VAT */}
                  <Grid item xs={12} container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Controller
                        name={`items.${index}.quantity`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={t('editSalesInvoicePage.quantity')}
                            type="number"
                            fullWidth
                            error={!!errors.items?.[index]?.quantity}
                            helperText={errors.items?.[index]?.quantity?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Controller
                        name={`items.${index}.unit`}
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.items?.[index]?.unit}>
                            <InputLabel>{t('editSalesInvoicePage.unit')}</InputLabel>
                            <Select {...field} label={t('editSalesInvoicePage.unit')}>
                              <MenuItem value="Adet">{t('editSalesInvoicePage.piece')}</MenuItem>
                              <MenuItem value="Saat">{t('editSalesInvoicePage.hour')}</MenuItem>
                              <MenuItem value="Gün">{t('editSalesInvoicePage.day')}</MenuItem>
                            </Select>
                            <FormHelperText>{errors.items?.[index]?.unit?.message}</FormHelperText>
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
                            label={t('editSalesInvoicePage.unitPrice')}
                            type="number"
                            fullWidth
                            error={!!errors.items?.[index]?.unitPrice}
                            helperText={errors.items?.[index]?.unitPrice?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Controller
                        name={`items.${index}.vatRate`}
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.items?.[index]?.vatRate}>
                            <InputLabel>{t('editSalesInvoicePage.vatRate')}</InputLabel>
                            <Select {...field} label={t('editSalesInvoicePage.vatRate')}>
                              <MenuItem value={20}>20%</MenuItem>
                              <MenuItem value={10}>10%</MenuItem>
                              <MenuItem value={1}>1%</MenuItem>
                              <MenuItem value={0}>0%</MenuItem>
                            </Select>
                            <FormHelperText>{errors.items?.[index]?.vatRate?.message}</FormHelperText>
                          </FormControl>
                        )}
                      />
                    </Grid>
                  </Grid>

                  {/* Row 4: Actions and Total */}
                  <Grid item xs={12} sx={{ my: 1 }}><Divider /></Grid>
                  <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography color="text.secondary" sx={{ fontWeight: 'bold' }}>{t('editSalesInvoicePage.totalAmount')}</Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>{total.toFixed(2)} {getValues('currency')}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<AddCircleOutline />}
                        onClick={(event) => handleMenuOpen(event, index)}
                      >
                        {t('editSalesInvoicePage.addAction')}
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<Delete />}
                        onClick={() => remove(index)}
                      >
                        {t('editSalesInvoicePage.delete')}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            );
          })}

          <Button
            startIcon={<Add />}
            onClick={() => append({ ...defaultInvoiceItem, productName: '' })}
            sx={{ mt: 2 }}
          >
            {t('editSalesInvoicePage.addNewItem')}
          </Button>
          </Box>
        </Paper>

        {/* Totals Section */}
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>Notlar</Typography>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label=""
                    multiline
                    rows={5}
                    fullWidth
                    placeholder="Fatura ile ilgili notlarınızı buraya ekleyebilirsiniz..."
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        backgroundColor: '#f8f9fa'
                      }
                    }}
                  />
                )}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>Toplamlar</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1" sx={{ textTransform: 'uppercase' }}>{t('editSalesInvoicePage.subtotal', 'Ara Toplam')}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton 
                    size="small" 
                    onClick={(e) => setSubtotalMenuAnchor(e.currentTarget)}
                    sx={{ mr: 1, p: 0.5 }}
                  >
                    <Add fontSize="small" />
                  </IconButton>
                  <Typography variant="body1">{grossTotal.toFixed(2)} {getValues('currency')}</Typography>
                </Box>
              </Box>
              
              {/* Ara Toplam Dropdown Menu */}
              <Menu
                anchorEl={subtotalMenuAnchor}
                open={Boolean(subtotalMenuAnchor)}
                onClose={() => setSubtotalMenuAnchor(null)}
                PaperProps={{
                  sx: {
                    minWidth: 250,
                    border: '2px solid #ff4444',
                    borderRadius: '8px',
                    '& .MuiMenuItem-root': {
                      py: 1.5,
                      px: 2,
                      borderBottom: '1px solid #e0e0e0',
                      '&:last-child': {
                        borderBottom: 'none'
                      }
                    }
                  }
                }}
              >
                <MenuItem onClick={() => {
                  setIncludeSubtotalDiscount(true);
                  setSubtotalDiscountType('percentage');
                  setSubtotalDiscountValue(0);
                  setSubtotalMenuAnchor(null);
                }}>
                  <Typography>Ara Toplam İndirimi Ekle</Typography>
                </MenuItem>
                <MenuItem onClick={() => {
                  setIncludeStopaj(true);
                  setValue('stopajRate', 20);
                  setSubtotalMenuAnchor(null);
                }}>
                  <Typography>% 20 Stopaj Uygula</Typography>
                </MenuItem>
                <MenuItem onClick={() => {
                  setIncludeStopaj(true);
                  setValue('stopajRate', 17);
                  setSubtotalMenuAnchor(null);
                }}>
                  <Typography>% 17 Stopaj Uygula</Typography>
                </MenuItem>
                <MenuItem onClick={() => {
                  setIncludeStopaj(true);
                  setValue('stopajRate', 15);
                  setSubtotalMenuAnchor(null);
                }}>
                  <Typography>% 15 Stopaj Uygula</Typography>
                </MenuItem>
                <MenuItem onClick={() => {
                  setIncludeStopaj(true);
                  setValue('stopajRate', 10);
                  setSubtotalMenuAnchor(null);
                }}>
                  <Typography>% 10 Stopaj Uygula</Typography>
                </MenuItem>
                <MenuItem onClick={() => {
                  setIncludeStopaj(true);
                  setValue('stopajRate', 3);
                  setSubtotalMenuAnchor(null);
                }}>
                  <Typography>% 3 Stopaj Uygula</Typography>
                </MenuItem>
              </Menu>
              {totalDiscount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1" sx={{ textTransform: 'uppercase' }}>{t('editSalesInvoicePage.lineDiscount', 'Satır İndirimi')}</Typography>
                  <Typography variant="body1" color="error">- {totalDiscount.toFixed(2)} {getValues('currency')}</Typography>
                </Box>
              )}
              {includeSubtotalDiscount && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
                    <Typography variant="body1" sx={{ textTransform: 'uppercase', mr: 2 }}>Ara Toplam İndirimi</Typography>
                    <TextField
                      size="small"
                      value={subtotalDiscountValue}
                      onChange={(e) => setSubtotalDiscountValue(Number(e.target.value))}
                      sx={{ width: 80, mr: 1 }}
                      inputProps={{ min: 0 }}
                    />
                    <Button
                      size="small"
                      variant={subtotalDiscountType === 'percentage' ? 'contained' : 'outlined'}
                      onClick={() => setSubtotalDiscountType('percentage')}
                      sx={{ minWidth: 40, mr: 0.5 }}
                    >
                      %
                    </Button>
                    <Button
                      size="small"
                      variant={subtotalDiscountType === 'amount' ? 'contained' : 'outlined'}
                      onClick={() => setSubtotalDiscountType('amount')}
                      sx={{ minWidth: 40, mr: 1 }}
                    >
                      $
                    </Button>
                    <IconButton size="small" onClick={() => setIncludeSubtotalDiscount(false)} sx={{ p: 0.2 }}>
                      <Close fontSize="inherit" />
                    </IconButton>
                  </Box>
                  <Typography variant="body1" color="error">- {subtotalDiscountAmount.toFixed(2)} {getValues('currency')}</Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>{t('editSalesInvoicePage.grossTotal', 'Brüt Toplam')}</Typography>
                <Typography variant="body1">{subTotal.toFixed(2)} {getValues('currency')}</Typography>
              </Box>
              {totalSct > 0 && (
                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1" sx={{ textTransform: 'uppercase' }}>{t('editSalesInvoicePage.sctTotal', 'ÖTV Toplamı')}</Typography>
                  <Typography variant="body1">+ {totalSct.toFixed(2)} {getValues('currency')}</Typography>
                </Box>
              )}
               {totalCommunicationTax > 0 && (
                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1" sx={{ textTransform: 'uppercase' }}>{t('editSalesInvoicePage.communicationTaxTotal', 'ÖİV Toplamı')}</Typography>
                  <Typography variant="body1">+ {totalCommunicationTax.toFixed(2)} {getValues('currency')}</Typography>
                </Box>
              )}
              {totalAccommodationTax > 0 && (
                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1" sx={{ textTransform: 'uppercase' }}>{t('editSalesInvoicePage.accommodationTaxTotal', 'Konaklama V. T.')}</Typography>
                  <Typography variant="body1">+ {totalAccommodationTax.toFixed(2)} {getValues('currency')}</Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>{t('editSalesInvoicePage.vatTotal')}</Typography>
                <Typography variant="body1">+ {vatTotal.toFixed(2)} {getValues('currency')}</Typography>
              </Box>
              {includeStopaj && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, color: 'error.main' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>STOPAJ ({stopajRateForm || 20}%)</Typography>
                    <IconButton size="small" onClick={() => setIncludeStopaj(false)} sx={{ ml: 1, p: 0.2 }}>
                      <Close fontSize="inherit" />
                    </IconButton>
                  </Box>
                  <Typography variant="body1">- {stopajTotal.toFixed(2)} {getValues('currency')}</Typography>
                </Box>
              )}
               <Box sx={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${theme.palette.divider}`, pt: 2 }}>
                 <Typography variant="h6" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>{t('editSalesInvoicePage.grandTotal')}</Typography>
                 <Typography variant="h6" fontWeight="bold">+ {grandTotal.toFixed(2)} {getValues('currency')}</Typography>
               </Box>
               
               {/* Stopaj Ekleme Butonu */}
               {!includeStopaj && (
                 <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                   <Button
                     variant="outlined"
                     size="small"
                     onClick={() => setIncludeStopaj(true)}
                     sx={{
                       color: '#25638f',
                       borderColor: '#25638f',
                       '&:hover': {
                         backgroundColor: 'rgba(37, 99, 143, 0.1)',
                         borderColor: '#1e4f73'
                       }
                     }}
                   >
                     + Stopaj Ekle
                   </Button>
                 </Box>
               )}
             </Paper>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
          <Button variant="outlined" color="primary" disabled={isSubmitting}>{t('editSalesInvoicePage.cancel')}</Button>
          <Button variant="outlined" color="secondary" disabled={isSubmitting}>{t('editSalesInvoicePage.saveAsDraft')}</Button>
          <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : t('editSalesInvoicePage.saveInvoice')}
          </Button>
        </Box>
      </form>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl) && currentItemIndex !== null}
        onClose={handleMenuClose}
      >
        {currentItemIndex !== null && (
          <>
            <MenuItem onClick={() => { handleAddDescription(currentItemIndex!); handleMenuClose(); }} disabled={itemFields[currentItemIndex!]?.description}>
              {t('editSalesInvoicePage.addDescription')}
            </MenuItem>
            <MenuItem onClick={() => { handleAddDiscount(currentItemIndex!); handleMenuClose(); }} disabled={itemFields[currentItemIndex!]?.discount}>
              {t('editSalesInvoicePage.addDiscount')}
            </MenuItem>
            <MenuItem onClick={() => { handleAddSct(currentItemIndex!); handleMenuClose(); }} disabled={itemFields[currentItemIndex!]?.sct}>
              {t('editSalesInvoicePage.addSct')}
            </MenuItem>
            <MenuItem onClick={() => { handleAddCommunicationTax(currentItemIndex!); handleMenuClose(); }} disabled={itemFields[currentItemIndex!]?.communicationTax}>
              {t('editSalesInvoicePage.addCommunicationTax')}
            </MenuItem>
            <MenuItem onClick={() => { handleAddAccommodationTax(currentItemIndex!); handleMenuClose(); }} disabled={itemFields[currentItemIndex!]?.accommodationTax}>
              {t('editSalesInvoicePage.addAccommodationTax', 'Konaklama Vergisi Ekle')}
            </MenuItem>
            <MenuItem onClick={() => handleToggleVatExemption(currentItemIndex!)}>
              {t('editSalesInvoicePage.toggleVatExemption', 'KDV Muafiyeti')}
            </MenuItem>
          </>
        )}
      </Menu>

      <AddNewProductModal 
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddProduct={handleAddProduct}
      />
    </Box>
  );
};

export default EditSalesInvoicePage;
