import React, { useState, useMemo } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
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
  useTheme,
  Button,
  IconButton,
  Divider
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import tr from 'date-fns/locale/tr';

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
  discountType?: 'percentage' | 'amount';
  discountValue?: number;
}

interface IFormInputs {
  notes: string;
  customerId: Customer | null;
  invoiceDate: Date | null;
  dueDate: Date | null;
  paymentMethod: string;
  paymentStatus: string;
  warehouse: string;
  description: string;
  currency: string;
  invoiceLanguage: string;
  items: InvoiceItem[];
  useForeignCurrency: boolean;
  exchangeRate: number;
}

// --- MOCK DATA ---
const customers: Customer[] = [
  { id: 1, label: 'Ahmet Yılmaz', address: 'Örnek Mah. Test Cad. No:1 D:2, İstanbul', taxOffice: 'Maslak', taxNo: '1234567890' },
  { id: 2, label: 'Ayşe Kaya', address: 'Kaya Mah. Deneme Sk. No:5, Ankara', taxOffice: 'Çankaya', taxNo: '0987654321' },
];

const CreateSalesInvoicePage: React.FC = () => {
  const [includeStopaj, setIncludeStopaj] = useState(true);
  const theme = useTheme();
  const { control, watch, formState: { errors } } = useForm<IFormInputs>({
    defaultValues: {
      customerId: null,
      invoiceDate: new Date(),
      dueDate: new Date(),
      paymentMethod: 'Nakit',
      paymentStatus: 'Ödenmedi',
      warehouse: 'Ana Depo',
      description: '',
      currency: 'TRY',
      invoiceLanguage: 'Türkçe',
      items: [{ productName: '', quantity: 1, unit: 'Adet', unitPrice: 0, vatRate: 20, discountType: undefined, discountValue: 0 }],
      notes: '',
      useForeignCurrency: false,
      exchangeRate: 1,
    },
  });

  const selectedCustomer = watch('customerId');
  const watchedItems = watch('items');
  const selectedCurrency = watch('currency');
  const useForeignCurrency = watch('useForeignCurrency');

  const { subTotal, vatTotal, stopajTotal, grandTotal, totalDiscount } = useMemo(() => {
    let subTotal = 0;
    let vatTotal = 0;
    let totalDiscount = 0;
    
    watchedItems.forEach((item, index) => {
      const itemSubtotal = (item.quantity || 0) * (item.unitPrice || 0);
      
      // İndirim hesaplama - değer varsa hesapla
      let itemDiscount = 0;
      if (item.discountType && (item.discountValue || 0) > 0) {
        if (item.discountType === 'percentage') {
          itemDiscount = itemSubtotal * ((item.discountValue || 0) / 100);
        } else if (item.discountType === 'amount') {
          itemDiscount = item.discountValue || 0;
        }
      }
      
      const itemSubtotalAfterDiscount = itemSubtotal - itemDiscount;
      const itemVat = itemSubtotalAfterDiscount * ((item.vatRate || 0) / 100);
      
      subTotal += itemSubtotal;
      totalDiscount += itemDiscount;
      vatTotal += itemVat;
    });
    
    const stopajTotal = includeStopaj ? (subTotal - totalDiscount) * 0.20 : 0;
    const grandTotal = subTotal - totalDiscount + vatTotal - stopajTotal;
    
    return {
      subTotal,
      vatTotal,
      stopajTotal,
      grandTotal,
      totalDiscount,
    };
  }, [watchedItems, includeStopaj]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Yeni Satış Faturası Oluştur
      </Typography>

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
            Müşteri ve fatura detaylarını eksiksiz doldurunuz
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
          borderRadius: '12px', 
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden'
        }}
      >
        {/* Table Header */}
        <Box 
          sx={{ 
            backgroundColor: '#f5f5f5',
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <Typography variant="subtitle2" fontWeight="bold">Ürün Adı</Typography>
            </Grid>
            <Grid item xs={6} sm={1.5}>
              <Typography variant="subtitle2" fontWeight="bold">Miktar</Typography>
            </Grid>
            <Grid item xs={6} sm={1.5}>
              <Typography variant="subtitle2" fontWeight="bold">Birim</Typography>
            </Grid>
            <Grid item xs={6} sm={2}>
              <Typography variant="subtitle2" fontWeight="bold">Birim Fiyat</Typography>
            </Grid>
            <Grid item xs={6} sm={1.5}>
              <Typography variant="subtitle2" fontWeight="bold">KDV (%)</Typography>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Typography variant="subtitle2" fontWeight="bold">Toplam</Typography>
            </Grid>
            <Grid item xs={12} sm={0.5}>
              <Typography variant="subtitle2" fontWeight="bold">İşlem</Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Table Body */}
        <Box sx={{ p: 2 }}>
          {fields.map((item, index) => {
            const quantity = watch(`items.${index}.quantity`, 1);
            const unitPrice = watch(`items.${index}.unitPrice`, 0);
            const vatRate = watch(`items.${index}.vatRate`, 20);
            const discountType = watch(`items.${index}.discountType`);
            const discountValue = watch(`items.${index}.discountValue`, 0);
            
            const subtotal = quantity * unitPrice;
            
            // İndirim hesaplama
            let itemDiscount = 0;
            if (discountType && (discountValue || 0) > 0) {
              if (discountType === 'percentage') {
                itemDiscount = subtotal * ((discountValue || 0) / 100);
              } else if (discountType === 'amount') {
                itemDiscount = discountValue || 0;
              }
            }
            
            const subtotalAfterDiscount = subtotal - itemDiscount;
            const vatAmount = subtotalAfterDiscount * (vatRate / 100);
            const total = subtotalAfterDiscount + vatAmount;
            
            return (
              <Box 
                key={item.id} 
                sx={{ 
                  mb: 2, 
                  p: 2, 
                  border: `1px solid ${theme.palette.divider}`, 
                  borderRadius: '8px',
                  backgroundColor: theme.palette.background.paper
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <Controller
                      name={`items.${index}.productName`}
                      control={control}
                      render={({ field }) => (
                        <TextField 
                          {...field} 
                          placeholder="Ürün adı veya açıklama" 
                          variant="outlined" 
                          size="small" 
                          fullWidth 
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6} sm={1.5}>
                    <Controller
                      name={`items.${index}.quantity`}
                      control={control}
                      render={({ field }) => (
                        <TextField 
                          {...field} 
                          type="number" 
                          variant="outlined" 
                          size="small" 
                          fullWidth 
                          inputProps={{ min: 0, step: 0.01 }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6} sm={1.5}>
                    <Controller
                      name={`items.${index}.unit`}
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth size="small">
                          <Select {...field} displayEmpty>
                            <MenuItem value="Adet">Adet</MenuItem>
                            <MenuItem value="Kg">Kg</MenuItem>
                            <MenuItem value="Lt">Lt</MenuItem>
                            <MenuItem value="M">Metre</MenuItem>
                            <MenuItem value="M2">M²</MenuItem>
                            <MenuItem value="M3">M³</MenuItem>
                            <MenuItem value="Saat">Saat</MenuItem>
                            <MenuItem value="Gün">Gün</MenuItem>
                            <MenuItem value="Ay">Ay</MenuItem>
                            <MenuItem value="Yıl">Yıl</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <Controller
                      name={`items.${index}.unitPrice`}
                      control={control}
                      render={({ field }) => (
                        <TextField 
                          {...field} 
                          type="number" 
                          variant="outlined" 
                          size="small" 
                          fullWidth 
                          inputProps={{ min: 0, step: 0.01 }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6} sm={1.5}>
                    <Controller
                      name={`items.${index}.vatRate`}
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth size="small">
                          <Select {...field} displayEmpty>
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
                  <Grid item xs={12}>
                     <Box sx={{ mt: 1, p: 1, backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                       <Grid container spacing={1} alignItems="center">
                         <Grid item xs={12} sm={3}>
                           <Typography variant="body2" fontWeight="bold">İndirim:</Typography>
                         </Grid>
                         <Grid item xs={6} sm={2}>
                           <Controller
                             name={`items.${index}.discountType`}
                             control={control}
                             render={({ field }) => (
                               <FormControl fullWidth size="small">
                                 <Select {...field} value={field.value || ''} displayEmpty>
                                   <MenuItem value="">Seçiniz</MenuItem>
                                   <MenuItem value="percentage">%</MenuItem>
                                   <MenuItem value="amount">Tutar</MenuItem>
                                 </Select>
                               </FormControl>
                             )}
                           />
                         </Grid>
                         <Grid item xs={6} sm={3}>
                           <Controller
                             name={`items.${index}.discountValue`}
                             control={control}
                             render={({ field }) => (
                               <TextField 
                                 {...field} 
                                 type="number" 
                                 size="small" 
                                 fullWidth 
                                 placeholder="0"
                                 inputProps={{ min: 0, step: 0.01 }}
                               />
                             )}
                           />
                         </Grid>
                       </Grid>
                     </Box>
                   </Grid>
                   <Grid item xs={12} sm={2}>
                     <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                       <Typography variant="body2" color="text.secondary">
                         Ara Toplam: ₺{subtotal.toFixed(2)}
                       </Typography>
                       {itemDiscount > 0 && (
                         <Typography variant="body2" color="warning.main">
                           İndirim: -₺{itemDiscount.toFixed(2)}
                         </Typography>
                       )}
                       <Typography variant="body2" color="text.secondary">
                         KDV: ₺{vatAmount.toFixed(2)}
                       </Typography>
                       <Typography variant="subtitle1" fontWeight="bold" color="primary">
                         ₺{total.toFixed(2)}
                       </Typography>
                     </Box>
                   </Grid>
                  <Grid item xs={12} sm={0.5}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <IconButton 
                        color="error" 
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            );
          })}
        </Box>
      </Paper>

      <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => append({ productName: '', quantity: 1, unit: 'Adet', unitPrice: 0, vatRate: 20, discountType: undefined, discountValue: 0 })}
          sx={{
            backgroundColor: '#25638f',
            color: 'white',
            fontWeight: 'bold',
            px: { xs: 3, md: 4 },
            py: { xs: 1.5, md: 2 },
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(37, 99, 143, 0.3)',
            '&:hover': {
              backgroundColor: '#1e4f73',
              boxShadow: '0 6px 16px rgba(37, 99, 143, 0.4)',
              transform: 'translateY(-1px)'
            },
            transition: 'all 0.2s ease-in-out'
          }}
        >
          Kalem Ekle
        </Button>
        <Button
          variant="outlined"
          startIcon={<Add />}
          sx={{
            borderColor: '#25638f',
            color: '#25638f',
            fontWeight: 'bold',
            px: { xs: 3, md: 4 },
            py: { xs: 1.5, md: 2 },
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: 'rgba(37, 99, 143, 0.1)',
              borderColor: '#1e4f73',
              transform: 'translateY(-1px)'
            },
            transition: 'all 0.2s ease-in-out'
          }}
        >
          Yeni Ürün Ekle
        </Button>
      </Box>

      {/* Notes and Totals */}
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
                  rows={4}
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
          <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: '12px', border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>Toplamlar</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>ARA TOPLAM</Typography>
              <Typography variant="body1">+ {subTotal.toFixed(2)} TRY</Typography>
            </Box>
             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
               <Typography variant="body1" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>BRÜT TOPLAM</Typography>
               <Typography variant="body1">+ {subTotal.toFixed(2)} TRY</Typography>
             </Box>
             {totalDiscount > 0 && (
               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, color: 'warning.main' }}>
                 <Typography variant="body1" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>TOPLAM İNDİRİM</Typography>
                 <Typography variant="body1">- {totalDiscount.toFixed(2)} TRY</Typography>
               </Box>
             )}
             {includeStopaj && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, color: 'error.main' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>STOPAJ (%20)</Typography>
                  <IconButton size="small" onClick={() => setIncludeStopaj(false)} sx={{ ml: 1, p: 0.2 }}>
                    <Close fontSize="inherit" />
                  </IconButton>
                </Box>
                <Typography variant="body1">- {stopajTotal.toFixed(2)} TRY</Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body1" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>KDV Toplamı</Typography>
              <Typography variant="body1">+ {vatTotal.toFixed(2)} TRY</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${theme.palette.divider}`, pt: 2 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>GENEL TOPLAM</Typography>
              <Typography variant="h6" fontWeight="bold">+ {grandTotal.toFixed(2)} TRY</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
        <Button variant="outlined" color="primary">İptal</Button>
        <Button variant="outlined" color="secondary">Taslak Olarak Kaydet</Button>
        <Button variant="contained" color="primary">Faturayı Kaydet</Button>
      </Box>
    </Box>
  );
};

export default CreateSalesInvoicePage;
