import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { InvoiceItem, mockSuppliers, mockProducts, Supplier } from '../../data/mockData';
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  ListSubheader,
  Menu,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  AddCircleOutline as AddCircleOutlineIcon,
  Add as AddIcon,
  Close as CloseIcon,
  InfoOutlined as InfoOutlinedIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import tr from 'date-fns/locale/tr';

const vatRates = [0, 1, 8, 10, 18, 20];

const mockWarehouses = [
  { label: 'Ana Depo' },
  { label: 'Şube 1' },
  { label: 'Şube 2' },
];

const getValidDateOrNull = (date: any): Date | null => {
  if (!date) return null;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime()) ? d : null;
};

interface PurchaseInvoiceFormProps {
  initialData?: any; // Define a proper type for initial invoice data
  onSave: (data: any) => void;
  onSaveAsDraft: (data: any) => void;
  isEditMode?: boolean;
  isModal?: boolean;
}

const PurchaseInvoiceForm: React.FC<PurchaseInvoiceFormProps> = ({ initialData, onSave, onSaveAsDraft, isEditMode = false, isModal = false }) => {
  const { t } = useTranslation();
  
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const lastId = useRef(items.length > 0 ? Math.max(...items.map(i => i.id)) : 0);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [invoiceDate, setInvoiceDate] = useState<Date | null>(new Date());
  const [dueDate, setDueDate] = useState<Date | null>(new Date());

  const [invoiceLanguage, setInvoiceLanguage] = useState('tr');
  const [currency, setCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [balanceProcessing, setBalanceProcessing] = useState<'currency' | 'try'>('currency');
  const [notes, setNotes] = useState('');
  const [pageTitle, setPageTitle] = useState('');

  useEffect(() => {
    if (initialData) {
      const supplierData = mockSuppliers.find(c => c.label === initialData.customer); // Note: using customer field from mock for now
      if (supplierData) setSupplier(supplierData);

      if (isEditMode) {
        setPageTitle(t('invoice.editPurchaseInvoice', 'Alış Faturasını Düzenle'));
        setItems(initialData.items.map((item: InvoiceItem) => ({ ...item, id: Date.now() + Math.random() }))); // Ensure unique IDs
        setInvoiceDate(getValidDateOrNull(initialData.invoiceDate));
        setDueDate(getValidDateOrNull(initialData.dueDate));
        setNotes(initialData.notes || '');
      }
    } else {
      setPageTitle(t('invoice.createNewPurchaseInvoice', 'Yeni Alış Faturası Oluştur'));
    }
  }, [initialData, isEditMode, t]);
  
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [currentItemId, setCurrentItemId] = useState<null | number>(null);
  const [subTotalMenuAnchorEl, setSubTotalMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [grandTotalMenuAnchorEl, setGrandTotalMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [showSubtotalDiscount, setShowSubtotalDiscount] = useState(false);
  const [subtotalDiscountValue, setSubtotalDiscountValue] = useState('0');
  const [subtotalDiscountIsPercentage, setSubtotalDiscountIsPercentage] = useState(true);
  const [withholdingTaxRate, setWithholdingTaxRate] = useState(0);
  const [stopajRate, setStopajRate] = useState(0);
  const [entryWarehouse, setEntryWarehouse] = useState('Ana Depo');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Nakit');
  const [paymentStatus, setPaymentStatus] = useState('Ödenmedi');

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: number) => {
    setMenuAnchorEl(event.currentTarget);
    setCurrentItemId(id);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setCurrentItemId(null);
  };

  const handleSubTotalMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setSubTotalMenuAnchorEl(event.currentTarget);
  };

  const handleSubTotalMenuClose = () => {
    setSubTotalMenuAnchorEl(null);
  };

  const handleGrandTotalMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setGrandTotalMenuAnchorEl(event.currentTarget);
  };

  const handleGrandTotalMenuClose = () => {
    setGrandTotalMenuAnchorEl(null);
  };

  const handleAddSubtotalDiscount = () => {
    setShowSubtotalDiscount(true);
    handleSubTotalMenuClose();
  };

  const handleRemoveSubtotalDiscount = () => {
    setShowSubtotalDiscount(false);
    setSubtotalDiscountValue('0');
    handleSubTotalMenuClose();
  };

  const handleApplyStopaj = (rate: number) => {
    setStopajRate(rate);
    handleGrandTotalMenuClose();
  };

  const handleRemoveStopaj = () => {
    setStopajRate(0);
    handleGrandTotalMenuClose();
  };

  const handleWithholdingTax = (rate: number) => {
    setWithholdingTaxRate(prev => (prev === rate ? 0 : rate));
    handleGrandTotalMenuClose();
  };

  const handleRemoveWithholdingTax = () => {
    setWithholdingTaxRate(0);
    handleGrandTotalMenuClose();
  };

  const handleAddField = (field: 'description' | 'discount' | 'sct' | 'accommodationTax') => {
    if (currentItemId === null) return;
    setItems(items.map(item => {
      if (item.id === currentItemId) {
        const newItem = { ...item };
        switch (field) {
          case 'description':
            newItem.description = '';
            break;
          case 'discount':
            newItem.discountRate = 0;
            newItem.discountIsPercentage = true;
            break;
          case 'sct':
            newItem.sctRate = 0;
            break;
          case 'accommodationTax':
            newItem.accommodationTaxRate = 0;
            break;
        }
        return newItem;
      }
      return item;
    }));
    handleMenuClose();
  };

  const handleRemoveField = (id: number, fieldName: keyof InvoiceItem) => {
    setItems(prev =>
      prev.map(i => {
        if (i.id === id) {
          const { [fieldName]: _, ...rest } = i as any;
          return rest;
        }
        return i;
      })
    );
  };

  const getCurrencySymbol = (currencyCode: string) => {
    const symbols: { [key: string]: string } = { TRY: '₺', USD: '$', EUR: '€' };
    return symbols[currencyCode] || '';
  };

  const formatCurrency = (amount: number, currencyCode: string) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  };

  const calculateItemTotal = (item: InvoiceItem) => {
    const subTotal = item.quantity * item.unitPrice;
    let itemDiscountAmount = 0;
    if (item.discountRate !== undefined) {
      itemDiscountAmount = item.discountIsPercentage
        ? subTotal * (item.discountRate / 100)
        : item.discountRate;
    }
    const priceAfterDiscount = subTotal - itemDiscountAmount;

    const sctAmount = item.sctRate ? priceAfterDiscount * (item.sctRate / 100) : 0;
    const accommodationTaxAmount = item.accommodationTaxRate ? (priceAfterDiscount + sctAmount) * (item.accommodationTaxRate / 100) : 0;

    const vatBase = priceAfterDiscount + sctAmount + accommodationTaxAmount;
    const vatAmount = vatBase * (item.vatRate / 100);
    const total = vatBase + vatAmount;

    return {
      subTotal,
      itemDiscountAmount,
      sctAmount,
      accommodationTaxAmount,
      vatAmount,
      vatRate: item.vatRate,
      total
    };
  };

  const handleAddItem = () => {
    lastId.current += 1;
    const newItem: InvoiceItem = {
      id: lastId.current,
      productName: '',
      quantity: 1,
      unit: 'Adet',
      unitPrice: 0,
      vatRate: 18,
    };
    setItems(prevItems => [...prevItems, newItem]);
  };

  const handleItemChange = (id: number, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const numericFields: (keyof InvoiceItem)[] = ['quantity', 'unitPrice', 'vatRate', 'discountRate', 'sctRate', 'accommodationTaxRate'];
        if (numericFields.includes(field)) {
          const parsedValue = parseFloat(String(value).replace(',', '.'));
          return { ...item, [field]: isNaN(parsedValue) ? 0 : parsedValue };
        }
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleProductChange = (id: number, newValue: string | null) => {
    const product = mockProducts.find(p => p.label === newValue);
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          productName: newValue || '',
          unitPrice: product ? product.price : 0,
          unit: product ? product.unit : 'Adet',
        };
      }
      return item;
    }));
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const totals = useMemo(() => {
    const itemTotals = items.map(item => calculateItemTotal(item));

    const subTotal = itemTotals.reduce((acc, item) => acc + (item.subTotal || 0), 0);
    const totalItemDiscount = itemTotals.reduce((acc, item) => acc + (item.itemDiscountAmount || 0), 0);
    const totalSct = itemTotals.reduce((acc, item) => acc + (item.sctAmount || 0), 0);
    const totalAccommodationTax = itemTotals.reduce((acc, item) => acc + (item.accommodationTaxAmount || 0), 0);

    let subtotalDiscountAmount = 0;
    if (showSubtotalDiscount) {
      const discountValue = parseFloat(subtotalDiscountValue.toString().replace(',', '.')) || 0;
      const subTotalAfterItemDiscount = subTotal - totalItemDiscount;
      subtotalDiscountAmount = subtotalDiscountIsPercentage
        ? subTotalAfterItemDiscount * (discountValue / 100)
        : discountValue;
    }

    const subTotalAfterDiscount = subTotal - totalItemDiscount - subtotalDiscountAmount;

    const vatBreakdown = itemTotals.reduce((acc, item) => {
      if (item.vatAmount > 0) {
        acc[item.vatRate] = (acc[item.vatRate] || 0) + (item.vatAmount || 0);
      }
      return acc;
    }, {} as Record<number, number>);

    const totalVat = Object.values(vatBreakdown).reduce((acc, amount) => acc + (amount || 0), 0);
    const withholdingTaxAmount = totalVat * withholdingTaxRate;
    const stopajAmount = stopajRate > 0 ? (subTotalAfterDiscount + totalSct) * (stopajRate / 100) : 0;

    const grandTotal = subTotalAfterDiscount + totalSct + totalAccommodationTax + totalVat - withholdingTaxAmount - stopajAmount;
    const grandTotalInTRY = grandTotal * exchangeRate;

    return {
      subTotal,
      totalItemDiscount,
      subtotalDiscountAmount,
      subTotalAfterDiscount,
      vatBreakdown,
      totalVat,
      withholdingTaxAmount,
      grandTotal,
      grandTotalInTRY,
      totalSct,
      totalAccommodationTax,
      stopajAmount,
    };
  }, [items, exchangeRate, showSubtotalDiscount, subtotalDiscountValue, subtotalDiscountIsPercentage, withholdingTaxRate, stopajRate]);

  const handleSave = () => {
    const finalInvoiceDate = invoiceDate || new Date();
    const finalDueDate = dueDate || new Date();
    const data = {
      supplier,
      invoiceDate: finalInvoiceDate,
      dueDate: finalDueDate,
      items,
      totals,
      notes,
      currency,
      exchangeRate,
      balanceProcessing,
      paymentMethod,
      paymentStatus,
      description,
      entryWarehouse,
      subtotalDiscount: {
        value: subtotalDiscountValue,
        isPercentage: subtotalDiscountIsPercentage
      },
      withholdingTaxRate,
    };
    onSave(data);
  };

  const handleSaveDraft = () => {
    const finalInvoiceDate = invoiceDate || new Date();
    const finalDueDate = dueDate || new Date();
    const data = {
      supplier,
      invoiceDate: finalInvoiceDate,
      dueDate: finalDueDate,
      items,
      totals,
      notes,
      currency,
      exchangeRate,
      balanceProcessing,
      paymentMethod,
      paymentStatus,
      description,
      entryWarehouse,
      subtotalDiscount: {
        value: subtotalDiscountValue,
        isPercentage: subtotalDiscountIsPercentage
      },
      withholdingTaxRate,
    };
    onSaveAsDraft(data);
  };

  const displayCurrency = (balanceProcessing === 'try' && currency !== 'TRY') ? 'TRY' : currency;
  const effectiveExchangeRate = (balanceProcessing === 'try' && currency !== 'TRY') ? exchangeRate : 1;

  const formContent = (
    <Paper elevation={isModal ? 0 : 3} sx={{ p: isModal ? 0 : { xs: 2, md: 4 }, borderRadius: isModal ? 0 : 2, boxShadow: isModal ? 'none' : 'default' }}>
      {!isModal && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h4" component="h1">{pageTitle}</Typography>
        </Box>
      )}

      {/* Supplier and Invoice Details */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Autocomplete
            options={mockSuppliers}
            getOptionLabel={(option) => option.label}
            value={supplier}
            onChange={(event, newValue) => {
              setSupplier(newValue);
            }}
            renderInput={(params) => <TextField {...params} label={t('supplier', 'Tedarikçi')} variant="outlined" />}
          />
        </Grid>
        <Grid item xs={12} md={6} container spacing={2}>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label={t('invoiceDate', 'Fatura Tarihi')}
              value={invoiceDate}
              onChange={setInvoiceDate}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label={t('dueDate', 'Vade Tarihi')}
              value={dueDate}
              onChange={setDueDate}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
        </Grid>
      </Grid>

      {/* Invoice Items */}
      <Box>
        {items.map((item, index) => (
          <Paper key={item.id} elevation={2} sx={{ p: 2, mb: 2, borderRadius: 2, position: 'relative' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <Autocomplete
                  freeSolo
                  options={mockProducts.map((option) => option.label)}
                  value={item.productName}
                  onChange={(event, newValue) => handleProductChange(item.id, newValue)}
                  onInputChange={(event, newInputValue) => {
                    handleItemChange(item.id, 'productName', newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('productService', 'Ürün/Hizmet')}
                      variant="standard"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6} sm={1.5}>
                <TextField
                  label={t('quantity', 'Miktar')}
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                  variant="standard"
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={1.5}>
                 <TextField
                    label={t('unit', 'Birim')}
                    value={item.unit}
                    onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                    variant="standard"
                    fullWidth
                  />
              </Grid>
              <Grid item xs={6} sm={2}>
                <TextField
                  label={t('unitPrice', 'Birim Fiyat')}
                  type="text"
                  value={item.unitPrice.toLocaleString('tr-TR')}
                  onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)}
                  variant="standard"
                  fullWidth
                  InputProps={{
                    endAdornment: <InputAdornment position="end">{getCurrencySymbol(currency)}</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={1.5}>
                <FormControl variant="standard" fullWidth>
                  <InputLabel>{t('vat', 'KDV')}</InputLabel>
                  <Select
                    value={item.vatRate}
                    onChange={(e) => handleItemChange(item.id, 'vatRate', e.target.value)}
                  >
                    {vatRates.map(rate => <MenuItem key={rate} value={rate}>%{rate}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Typography variant="subtitle1" align="right" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(calculateItemTotal(item).total, currency)}
                </Typography>
              </Grid>
            </Grid>
            {item.description !== undefined && (
              <Box sx={{ mt: 1, position: 'relative' }}>
                <TextField
                  label={t('description', 'Açıklama')}
                  value={item.description}
                  onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                  variant="standard"
                  fullWidth
                  size="small"
                />
                <IconButton size="small" onClick={() => handleRemoveField(item.id, 'description')} sx={{ position: 'absolute', right: -10, top: '50%', transform: 'translateY(-50%)' }}><CloseIcon fontSize="inherit" /></IconButton>
              </Box>
            )}
            {item.discountRate !== undefined && (
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1, position: 'relative' }}>
                <TextField
                  label={t('discount', 'İndirim')}
                  type="number"
                  value={item.discountRate}
                  onChange={(e) => handleItemChange(item.id, 'discountRate', e.target.value)}
                  variant="standard"
                  size="small"
                  sx={{ flexGrow: 1 }}
                />
                <RadioGroup row value={item.discountIsPercentage ? 'percentage' : 'amount'} onChange={(e) => handleItemChange(item.id, 'discountIsPercentage', e.target.value === 'percentage')}>
                  <FormControlLabel value="percentage" control={<Radio size="small" />} label="%" />
                  <FormControlLabel value="amount" control={<Radio size="small" />} label={getCurrencySymbol(currency)} />
                </RadioGroup>
                <IconButton size="small" onClick={() => handleRemoveField(item.id, 'discountRate')} sx={{ position: 'absolute', right: -10, top: '50%', transform: 'translateY(-50%)' }}><CloseIcon fontSize="inherit" /></IconButton>
              </Box>
            )}
            <IconButton onClick={(e) => handleMenuOpen(e, item.id)} size="small" sx={{ position: 'absolute', top: 5, right: 5 }}><AddCircleOutlineIcon /></IconButton>
             <IconButton onClick={() => handleRemoveItem(item.id)} size="small" sx={{ position: 'absolute', top: 5, right: 35 }}><CloseIcon /></IconButton>
          </Paper>
        ))}
      </Box>

      <Button startIcon={<AddIcon />} onClick={handleAddItem} sx={{ mt: 2 }}>
        {t('addNewLine', 'Yeni Satır Ekle')}
      </Button>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <ListSubheader>{t('addField', 'Alan Ekle')}</ListSubheader>
        <MenuItem onClick={() => handleAddField('description')}>{t('description', 'Açıklama')}</MenuItem>
        <MenuItem onClick={() => handleAddField('discount')}>{t('discount', 'İndirim')}</MenuItem>
        <MenuItem onClick={() => handleAddField('sct')}>{t('sct', 'ÖTV')}</MenuItem>
        <MenuItem onClick={() => handleAddField('accommodationTax')}>{t('accommodationTax', 'Konaklama Vergisi')}</MenuItem>
      </Menu>

      {/* Notes and Totals */}
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <TextField
            label={t('notes', 'Notlar')}
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Typography variant="body1">{t('subTotal', 'Ara Toplam')}</Typography>
              <Typography variant="body1">{formatCurrency(totals.subTotal * effectiveExchangeRate, displayCurrency)}</Typography>
            </Grid>
            <Grid container justifyContent="space-between" alignItems="center">
              <Typography variant="body1" color="error">{t('discounts', 'İndirimler')}</Typography>
              <Typography variant="body1" color="error">- {formatCurrency((totals.totalItemDiscount + totals.subtotalDiscountAmount) * effectiveExchangeRate, displayCurrency)}</Typography>
            </Grid>
            <Divider sx={{ my: 1 }} />
            <Grid container justifyContent="space-between" alignItems="center">
              <Typography variant="body1">{t('totalAfterDiscount', 'İndirim Sonrası Toplam')}</Typography>
              <Typography variant="body1">{formatCurrency(totals.subTotalAfterDiscount * effectiveExchangeRate, displayCurrency)}</Typography>
            </Grid>
            {Object.entries(totals.vatBreakdown).map(([rate, amount]) => (
              <Grid container justifyContent="space-between" alignItems="center" key={rate}>
                <Typography variant="body2" color="text.secondary">% {rate} {t('vat', 'KDV')}</Typography>
                <Typography variant="body2" color="text.secondary">+ {formatCurrency(amount * effectiveExchangeRate, displayCurrency)}</Typography>
              </Grid>
            ))}
            {totals.totalSct > 0 && (
              <Grid container justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">{t('sct', 'ÖTV')}</Typography>
                <Typography variant="body2" color="text.secondary">+ {formatCurrency(totals.totalSct * effectiveExchangeRate, displayCurrency)}</Typography>
              </Grid>
            )}
            {totals.withholdingTaxAmount > 0 && (
              <Grid container justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="error">{t('withholdingTax', 'Tevkifat')}</Typography>
                <Typography variant="body2" color="error">- {formatCurrency(totals.withholdingTaxAmount * effectiveExchangeRate, displayCurrency)}</Typography>
              </Grid>
            )}
            {totals.stopajAmount > 0 && (
              <Grid container justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="error">{t('stopaj', 'Stopaj')}</Typography>
                <Typography variant="body2" color="error">- {formatCurrency(totals.stopajAmount * effectiveExchangeRate, displayCurrency)}</Typography>
              </Grid>
            )}
            <Divider sx={{ my: 1 }} />
            <Grid container justifyContent="space-between" alignItems="center">
              <Typography variant="h6">{t('grandTotal', 'Genel Toplam')}</Typography>
              <Typography variant="h6">{formatCurrency(totals.grandTotal * effectiveExchangeRate, displayCurrency)}</Typography>
            </Grid>
            {currency !== 'TRY' && (
              <Grid container justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary">{t('grandTotalTRY', 'Genel Toplam (TRY)')}</Typography>
                <Typography variant="body2" color="text.secondary">{formatCurrency(totals.grandTotalInTRY, 'TRY')}</Typography>
              </Grid>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
              <IconButton size="small" onClick={handleSubTotalMenuClick}><AddCircleOutlineIcon /></IconButton>
              <IconButton size="small" onClick={handleGrandTotalMenuClick}><AddCircleOutlineIcon /></IconButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Additional Info & Payment */}
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <FormControl component="fieldset">
            <Typography variant="subtitle2">{t('currencySettings', 'Döviz Ayarları')}</Typography>
            <RadioGroup row name="balanceProcessing" value={balanceProcessing} onChange={(e) => setBalanceProcessing(e.target.value as 'currency' | 'try')}>
              <FormControlLabel value="currency" control={<Radio />} label={t('processInOriginalCurrency', 'Orjinal Dövizde İşle')}/>
              <FormControlLabel value="try" control={<Radio />} label={t('processInTRY', 'TL Olarak İşle')} />
            </RadioGroup>
          </FormControl>
          {balanceProcessing === 'try' && currency !== 'TRY' && (
            <TextField
              label={`${t('exchangeRate', 'Döviz Kuru')} (1 ${getCurrencySymbol(currency)})`}
              type="number"
              value={exchangeRate}
              onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 1)}
              sx={{ mt: 1 }}
            />
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('entryWarehouse', 'Giriş Deposu')}</InputLabel>
                <Select
                  value={entryWarehouse}
                  label={t('entryWarehouse', 'Giriş Deposu')}
                  onChange={(e) => setEntryWarehouse(e.target.value)}
                >
                  {mockWarehouses.map(w => <MenuItem key={w.label} value={w.label}>{w.label}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label={t('description', 'Açıklama')}
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      
      {!isModal && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
          <Button variant="outlined" onClick={handleSaveDraft}>{t('saveAsDraft', 'Taslak Olarak Kaydet')}</Button>
          <Button variant="contained" color="primary" onClick={handleSave} startIcon={<SaveIcon />}>{t('save', 'Kaydet')}</Button>
        </Box>
      )}
    </Paper>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
      {isModal ? formContent : <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>{formContent}</Box>}
    </LocalizationProvider>
  );
};

export default PurchaseInvoiceForm;
