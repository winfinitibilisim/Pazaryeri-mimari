import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  Select,
  MenuItem,
  Menu,
  FormControl,
  FormLabel,
  InputLabel,
  IconButton,
  Divider,
  Table, TableHead, TableRow, TableCell, TableBody, TableContainer,
  RadioGroup,
  FormControlLabel,
  Radio,
  Autocomplete
} from '@mui/material';
import { AddCircleOutline, Delete } from '@mui/icons-material';
import AddNewProductModal from './AddNewProductModal';
import { useParams, useNavigate } from 'react-router-dom';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import tr from 'date-fns/locale/tr';

// Örnek Müşteri Verisi
const customers = [
  { label: 'Ahmet Yılmaz', address: 'Orhan Mah. Test Cad. No:1 D:2, İstanbul', taxOffice: 'Maslak', taxNo: '1234567890' },
  { label: 'Ayşe Kaya', address: 'Kaya Mah. Deneme Sk. No:5, Ankara', taxOffice: 'Çankaya', taxNo: '0987654321' },
];

interface Product {
  label: string;
}

interface InvoiceItem {
  id: number;
  name: string;
  description?: string;
  discountType?: 'percentage' | 'amount';
  discountValue?: number;
  sctRate?: number; // ÖTV
  communicationTaxRate?: number; // ÖİV
  accommodationTaxRate?: number;
  vatExemptionReason?: string;
  quantity: number;
  unit: string;
  price: number;
  vat: number;
}

const EditSalesInvoicePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoiceDate, setInvoiceDate] = useState<Date | null>(new Date());
  const [dueDate, setDueDate] = useState<Date | null>(new Date());
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]);
  const [currency, setCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(32.50);
  const [isProductModalOpen, setProductModalOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [stopajRate, setStopajRate] = useState<number | null>(null);
  const [stopajMenuAnchorEl, setStopajMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [vatWithholdingRate, setVatWithholdingRate] = useState<{ numerator: number; denominator: number } | null>(null);
  const [vatWithholdingMenuAnchorEl, setVatWithholdingMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItemIdForMenu, setSelectedItemIdForMenu] = useState<null | number>(null);
  const [balanceTransactionType, setBalanceTransactionType] = useState('doviz');
  const [products, setProducts] = useState<Product[]>([
    { label: 'Laptop' },
    { label: 'Klavye' },
    { label: 'Mouse' },
  ]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, itemId: number) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedItemIdForMenu(itemId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedItemIdForMenu(null);
  };

  const handleMenuItemClick = (action: 'addDescription' | 'addDiscount' | 'addSct' | 'addCommunicationTax' | 'addAccommodationTax' | 'addVatExemption') => {
    if (!selectedItemIdForMenu) return;

    setItems(items.map(item => {
      if (item.id !== selectedItemIdForMenu) return item;
      let updatedItem = { ...item };

      if (action === 'addDescription' && typeof updatedItem.description === 'undefined') {
        updatedItem.description = '';
      }
      if (action === 'addDiscount' && typeof updatedItem.discountValue === 'undefined') {
        updatedItem.discountType = 'percentage';
        updatedItem.discountValue = 0;
      }
      if (action === 'addSct' && typeof updatedItem.sctRate === 'undefined') {
        updatedItem.sctRate = 0;
      }
      if (action === 'addCommunicationTax' && typeof updatedItem.communicationTaxRate === 'undefined') {
        updatedItem.communicationTaxRate = 0;
      }
      if (action === 'addAccommodationTax' && typeof updatedItem.accommodationTaxRate === 'undefined') {
        updatedItem.accommodationTaxRate = 0;
      }
      if (action === 'addVatExemption' && typeof updatedItem.vatExemptionReason === 'undefined') {
        updatedItem.vatExemptionReason = '';
        updatedItem.vat = 0; // Set VAT to 0 when exemption is added
      }
      return updatedItem;
    }));

    handleMenuClose();
  };

  const handleVatExemptionRemove = (itemId: number) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const { vatExemptionReason, ...rest } = item;
        return { ...rest, vat: 20 } as InvoiceItem; // Reset VAT to default
      }
      return item;
    }));
  };

  const handleAddNewProduct = (productName: string) => {
    const newProduct: Product = { label: productName };
    setProducts(prevProducts => [...prevProducts, newProduct]);
  };
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 1, name: 'Laptop', quantity: 1, unit: 'Adet', price: 2500, vat: 20 },
    { id: 2, name: 'Klavye', quantity: 1, unit: 'Adet', price: 450, vat: 20 },
  ]);

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now(),
      name: '',
      quantity: 1,
      unit: 'Adet',
      price: 0,
      vat: 20,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (itemId: number) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const handleItemChange = (id: number, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(i => {
      if (i.id === id) {
        if (value === undefined) {
          const { [field]: removed, ...rest } = i;
          return rest as InvoiceItem;
        } 
        return { ...i, [field]: value };
      }
      return i;
    }));
  };

  const calculateItemTotal = (item: InvoiceItem) => {
    const basePrice = item.quantity * item.price;
    let discountAmount = 0;
    if (item.discountValue) {
      if (item.discountType === 'percentage') {
        discountAmount = basePrice * (item.discountValue / 100);
      } else { // 'amount'
        discountAmount = item.discountValue;
      }
    }
    const priceAfterDiscount = basePrice - discountAmount;

    let totalTaxAmount = 0;
    if (item.sctRate) {
      totalTaxAmount += priceAfterDiscount * (item.sctRate / 100);
    }
    if (item.communicationTaxRate) {
      totalTaxAmount += priceAfterDiscount * (item.communicationTaxRate / 100);
    }
    if (item.accommodationTaxRate) {
      totalTaxAmount += priceAfterDiscount * (item.accommodationTaxRate / 100);
    }

    const priceAfterSpecialTaxes = priceAfterDiscount + totalTaxAmount;
    const vatOnItem = item.vatExemptionReason !== undefined ? 0 : priceAfterSpecialTaxes * (item.vat / 100);

    return priceAfterSpecialTaxes + vatOnItem;
  };

  const { grossSubTotal, totalDiscount, netSubTotal, sctTotal, communicationTaxTotal, accommodationTaxTotal, stopajAmount, vatBreakdown, vatTotal, vatWithholdingAmount, grandTotal, tlEquivalent } = useMemo(() => {
    let grossSubTotal = 0;
    let totalDiscount = 0;
    let sctTotal = 0;
    let communicationTaxTotal = 0;
    let accommodationTaxTotal = 0;
    const vatBreakdown: { [key: number]: number } = {};
    let vatTotal = 0;

    items.forEach(item => {
      const basePrice = item.quantity * item.price;
      grossSubTotal += basePrice;

      let discountAmount = 0;
      if (item.discountValue) {
        discountAmount = item.discountType === 'percentage' ? basePrice * (item.discountValue / 100) : item.discountValue;
      }
      totalDiscount += discountAmount;

      const priceAfterDiscount = basePrice - discountAmount;
      let specialTaxBase = priceAfterDiscount;

      let itemSct = 0;
      if (item.sctRate) {
        itemSct = specialTaxBase * (item.sctRate / 100);
        sctTotal += itemSct;
        specialTaxBase += itemSct;
      }

      let itemCommTax = 0;
      if (item.communicationTaxRate) {
        itemCommTax = specialTaxBase * (item.communicationTaxRate / 100);
        communicationTaxTotal += itemCommTax;
        specialTaxBase += itemCommTax;
      }

      let itemAccomTax = 0;
      if (item.accommodationTaxRate) {
        itemAccomTax = specialTaxBase * (item.accommodationTaxRate / 100);
        accommodationTaxTotal += itemAccomTax;
        specialTaxBase += itemAccomTax;
      }

      const priceAfterSpecialTaxes = specialTaxBase;
      const vatOnItem = item.vatExemptionReason !== undefined ? 0 : priceAfterSpecialTaxes * (item.vat / 100);
      vatTotal += vatOnItem;

      if (vatBreakdown[item.vat]) {
        vatBreakdown[item.vat] += vatOnItem;
      } else {
        vatBreakdown[item.vat] = vatOnItem;
      }
    });

    const netSubTotal = grossSubTotal - totalDiscount;
    const stopajAmount = stopajRate ? netSubTotal * (stopajRate / 100) : 0;
    const vatWithholdingAmount = vatWithholdingRate ? vatTotal * (vatWithholdingRate.numerator / vatWithholdingRate.denominator) : 0;

    const grandTotal = netSubTotal + sctTotal + communicationTaxTotal + accommodationTaxTotal + vatTotal - stopajAmount - vatWithholdingAmount;
    const tlEquivalent = currency !== 'TRY' ? grandTotal * exchangeRate : grandTotal;

    return { grossSubTotal, totalDiscount, netSubTotal, sctTotal, communicationTaxTotal, accommodationTaxTotal, stopajAmount, vatBreakdown, vatTotal, vatWithholdingAmount, grandTotal, tlEquivalent };
  }, [items, currency, exchangeRate, stopajRate, vatWithholdingRate]);

  const { currencySymbol, locale } = useMemo(() => {
    switch (currency) {
      case 'USD': return { currencySymbol: '$', locale: 'en-US' };
      case 'EUR': return { currencySymbol: '€', locale: 'de-DE' };
      default: return { currencySymbol: '₺', locale: 'tr-TR' };
    }
  }, [currency]);

  return (
    <>
      <AddNewProductModal 
        open={isProductModalOpen} 
        onClose={() => setProductModalOpen(false)} 
        onProductAdd={handleAddNewProduct} 
      />
      <Paper sx={{ p: 3, m: 2, backgroundColor: '#fafafa' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Satış Faturasını Düzenle
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
          <Menu
            anchorEl={stopajMenuAnchorEl}
            open={Boolean(stopajMenuAnchorEl)}
            onClose={() => setStopajMenuAnchorEl(null)}
          >
            <MenuItem onClick={() => { setStopajRate(20); setStopajMenuAnchorEl(null); }}>%20 Stopaj Uygula</MenuItem>
            <MenuItem onClick={() => { setStopajRate(17); setStopajMenuAnchorEl(null); }}>%17 Stopaj Uygula</MenuItem>
            <MenuItem onClick={() => { setStopajRate(15); setStopajMenuAnchorEl(null); }}>%15 Stopaj Uygula</MenuItem>
            <MenuItem onClick={() => { setStopajRate(10); setStopajMenuAnchorEl(null); }}>%10 Stopaj Uygula</MenuItem>
            <MenuItem onClick={() => { setStopajRate(3); setStopajMenuAnchorEl(null); }}>%3 Stopaj Uygula</MenuItem>
          </Menu>
          <Menu
            anchorEl={vatWithholdingMenuAnchorEl}
            open={Boolean(vatWithholdingMenuAnchorEl)}
            onClose={() => setVatWithholdingMenuAnchorEl(null)}
          >
            <MenuItem onClick={() => { setVatWithholdingRate({ numerator: 9, denominator: 10 }); setVatWithholdingMenuAnchorEl(null); }}>9/10 Tevkifat Uygula</MenuItem>
            <MenuItem onClick={() => { setVatWithholdingRate({ numerator: 7, denominator: 10 }); setVatWithholdingMenuAnchorEl(null); }}>7/10 Tevkifat Uygula</MenuItem>
            <MenuItem onClick={() => { setVatWithholdingRate({ numerator: 5, denominator: 10 }); setVatWithholdingMenuAnchorEl(null); }}>5/10 Tevkifat Uygula</MenuItem>
            <MenuItem onClick={() => { setVatWithholdingRate({ numerator: 3, denominator: 10 }); setVatWithholdingMenuAnchorEl(null); }}>3/10 Tevkifat Uygula</MenuItem>
            <MenuItem onClick={() => { setVatWithholdingRate({ numerator: 2, denominator: 10 }); setVatWithholdingMenuAnchorEl(null); }}>2/10 Tevkifat Uygula</MenuItem>
          </Menu>
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem 
              onClick={() => handleMenuItemClick('addDescription')} 
              disabled={items.find(item => item.id === selectedItemIdForMenu)?.description !== undefined}
            >
              Açıklama Ekle
            </MenuItem>
            <MenuItem 
              onClick={() => handleMenuItemClick('addDiscount')}
              disabled={items.find(item => item.id === selectedItemIdForMenu)?.discountValue !== undefined}
            >
              İndirim Ekle
            </MenuItem>
            <MenuItem 
              onClick={() => handleMenuItemClick('addSct')}
              disabled={items.find(item => item.id === selectedItemIdForMenu)?.sctRate !== undefined}
            >
              ÖTV Ekle
            </MenuItem>
            <MenuItem 
              onClick={() => handleMenuItemClick('addCommunicationTax')}
              disabled={items.find(item => item.id === selectedItemIdForMenu)?.communicationTaxRate !== undefined}
            >
              ÖİV Ekle
            </MenuItem>
            <MenuItem 
              onClick={() => handleMenuItemClick('addAccommodationTax')}
              disabled={items.find(item => item.id === selectedItemIdForMenu)?.accommodationTaxRate !== undefined}
            >
              Konaklama Vergisi Ekle
            </MenuItem>
            <MenuItem 
              onClick={() => handleMenuItemClick('addVatExemption')}
              disabled={items.find(item => item.id === selectedItemIdForMenu)?.vatExemptionReason !== undefined}
            >
              KDV Muafiyeti
            </MenuItem>
          </Menu>

          <Grid container spacing={3}>
            {/* Sol Taraf: Müşteri, Tarih, Kalemler */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                {/* Müşteri ve Tarih Bilgileri */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Autocomplete
                      options={customers}
                      getOptionLabel={(option) => option.label}
                      value={selectedCustomer}
                      onChange={(event, newValue) => {
                        if (newValue) setSelectedCustomer(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} label="Müşteri" />}
                    />
                  </FormControl>
                  {selectedCustomer && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {selectedCustomer.address}<br />
                      Vergi Dairesi: {selectedCustomer.taxOffice} - Vergi No: {selectedCustomer.taxNo}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <DatePicker
                        label="Fatura Tarihi"
                        value={invoiceDate}
                        onChange={(newValue) => setInvoiceDate(newValue)}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <DatePicker
                        label="Vade Tarihi"
                        value={dueDate}
                        onChange={(newValue) => setDueDate(newValue)}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel>Ödeme Yöntemi</InputLabel>
                        <Select defaultValue="Nakit" label="Ödeme Yöntemi">
                          <MenuItem value="Nakit">Nakit</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel>Döviz</InputLabel>
                        <Select value={currency} label="Döviz" onChange={(e) => setCurrency(e.target.value)}>
                          <MenuItem value="TRY">Türk Lirası (TRY)</MenuItem>
                          <MenuItem value="USD">ABD Doları (USD)</MenuItem>
                          <MenuItem value="EUR">Euro (EUR)</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    {currency !== 'TRY' && (
                      <Grid item xs={12}>
                        <TextField
                          label="Döviz Kuru"
                          type="number"
                          value={exchangeRate}
                          onChange={(e) => setExchangeRate(parseFloat(e.target.value))}
                          fullWidth
                        />
                      </Grid>
                    )}
                  </Grid>
                </Grid>

                {/* Kalemler Tablosu */}
                <Grid item xs={12}>
                  <TableContainer component={Paper} sx={{ mt: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Ürün/Hizmet</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Miktar</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Birim</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Birim Fiyat</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>KDV (%)</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Tutar</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {items.map((item) => (
                          <React.Fragment key={item.id}>
                            <TableRow>
                              <TableCell>
                                <Autocomplete
                                  freeSolo
                                  options={products}
                                  getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
                                  value={item.name}
                                  onInputChange={(event, newInputValue) => {
                                    handleItemChange(item.id, 'name', newInputValue);
                                  }}
                                  renderInput={(params) => <TextField {...params} variant="standard" />}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField type="number" value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value))} variant="standard" sx={{ width: 80 }} />
                              </TableCell>
                              <TableCell>
                                <Select value={item.unit} onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)} variant="standard">
                                  <MenuItem value="Adet">Adet</MenuItem>
                                  <MenuItem value="Kg">Kg</MenuItem>
                                  <MenuItem value="Metre">Metre</MenuItem>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <TextField type="number" value={item.price} onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value))} variant="standard" />
                              </TableCell>
                              <TableCell>
                                <TextField type="number" value={item.vat} onChange={(e) => handleItemChange(item.id, 'vat', parseInt(e.target.value))} variant="standard" sx={{ width: 80 }} disabled={item.vatExemptionReason !== undefined} />
                              </TableCell>
                              <TableCell>{`${currencySymbol}${calculateItemTotal(item).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</TableCell>
                              <TableCell>
                                <IconButton onClick={(e) => handleMenuClick(e, item.id)}><AddCircleOutline /></IconButton>
                                <IconButton onClick={() => handleRemoveItem(item.id)}><Delete /></IconButton>
                              </TableCell>
                            </TableRow>
                            {/* Ekstra Alanlar */}
                            {item.description !== undefined && (
                              <TableRow>
                                <TableCell colSpan={7}>
                                  <TextField label="Açıklama" value={item.description} onChange={(e) => handleItemChange(item.id, 'description', e.target.value)} fullWidth variant="standard" InputProps={{ endAdornment: (<IconButton onClick={() => handleItemChange(item.id, 'description', undefined)}><Delete fontSize="small" /></IconButton>)}} />
                                </TableCell>
                              </TableRow>
                            )}
                            {item.discountValue !== undefined && (
                              <TableRow>
                                <TableCell colSpan={7}>
                                  <Grid container spacing={2} alignItems="center">
                                    <Grid item><Typography>İndirim</Typography></Grid>
                                    <Grid item><Select value={item.discountType} onChange={(e) => handleItemChange(item.id, 'discountType', e.target.value)} variant="standard"><MenuItem value="percentage">%</MenuItem><MenuItem value="amount">Tutar</MenuItem></Select></Grid>
                                    <Grid item><TextField type="number" value={item.discountValue} onChange={(e) => handleItemChange(item.id, 'discountValue', parseFloat(e.target.value))} variant="standard" /></Grid>
                                    <Grid item><IconButton onClick={() => handleItemChange(item.id, 'discountValue', undefined)}><Delete fontSize="small" /></IconButton></Grid>
                                  </Grid>
                                </TableCell>
                              </TableRow>
                            )}
                            {item.sctRate !== undefined && (
                              <TableRow>
                                <TableCell colSpan={7}>
                                  <TextField label="ÖTV Oranı (%)" type="number" value={item.sctRate} onChange={(e) => handleItemChange(item.id, 'sctRate', parseFloat(e.target.value))} variant="standard" InputProps={{ endAdornment: (<IconButton onClick={() => handleItemChange(item.id, 'sctRate', undefined)}><Delete fontSize="small" /></IconButton>)}} />
                                </TableCell>
                              </TableRow>
                            )}
                            {item.communicationTaxRate !== undefined && (
                              <TableRow>
                                <TableCell colSpan={7}>
                                  <TextField label="ÖİV Oranı (%)" type="number" value={item.communicationTaxRate} onChange={(e) => handleItemChange(item.id, 'communicationTaxRate', parseFloat(e.target.value))} variant="standard" InputProps={{ endAdornment: (<IconButton onClick={() => handleItemChange(item.id, 'communicationTaxRate', undefined)}><Delete fontSize="small" /></IconButton>)}} />
                                </TableCell>
                              </TableRow>
                            )}
                            {item.accommodationTaxRate !== undefined && (
                              <TableRow>
                                <TableCell colSpan={7}>
                                  <TextField label="Konaklama Vergisi Oranı (%)" type="number" value={item.accommodationTaxRate} onChange={(e) => handleItemChange(item.id, 'accommodationTaxRate', parseFloat(e.target.value))} variant="standard" InputProps={{ endAdornment: (<IconButton onClick={() => handleItemChange(item.id, 'accommodationTaxRate', undefined)}><Delete fontSize="small" /></IconButton>)}} />
                                </TableCell>
                              </TableRow>
                            )}
                            {item.vatExemptionReason !== undefined && (
                              <TableRow>
                                <TableCell colSpan={7}>
                                  <TextField label="KDV Muafiyet Sebebi" value={item.vatExemptionReason} onChange={(e) => handleItemChange(item.id, 'vatExemptionReason', e.target.value)} fullWidth variant="standard" InputProps={{ endAdornment: (<IconButton onClick={() => handleVatExemptionRemove(item.id)}><Delete fontSize="small" /></IconButton>)}} />
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                {/* Kalem Ekle Butonu */}
                <Grid item xs={12}>
                  <Button startIcon={<AddCircleOutline />} onClick={handleAddItem} sx={{ mt: 1, textTransform: 'none', fontWeight: 'bold' }}>
                    Kalem Ekle
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            {/* Sağ Taraf: Özet */}
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: '8px', position: 'sticky', top: '20px' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Özet</Typography>
                <Box sx={{ '& > div': { mb: 1 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography>Ara Toplam</Typography><Typography>{`${currencySymbol}${grossSubTotal.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</Typography></Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography color="error">İndirim</Typography><Typography color="error">{`- ${currencySymbol}${totalDiscount.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</Typography></Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography>Net Ara Toplam</Typography><Typography>{`${currencySymbol}${netSubTotal.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</Typography></Box>
                  {sctTotal > 0 && (<Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography>ÖTV Toplamı</Typography><Typography>{`${currencySymbol}${sctTotal.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</Typography></Box>)}
                  {communicationTaxTotal > 0 && (<Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography>ÖİV Toplamı</Typography><Typography>{`${currencySymbol}${communicationTaxTotal.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</Typography></Box>)}
                  {accommodationTaxTotal > 0 && (<Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography>Konaklama V. Toplamı</Typography><Typography>{`${currencySymbol}${accommodationTaxTotal.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</Typography></Box>)}
                  {stopajRate && (<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Typography color="error">{`Stopaj (%${stopajRate})`}</Typography><Box sx={{ display: 'flex', alignItems: 'center' }}><Typography color="error">{`- ${currencySymbol}${stopajAmount.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</Typography><IconButton size="small" onClick={() => setStopajRate(null)} sx={{ ml: 0.5 }}><Delete fontSize="small" color="error" /></IconButton></Box></Box>)}
                  {Object.entries(vatBreakdown).map(([rate, amount]) => (<Box key={rate} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}><Typography>{`KDV %${rate}`}</Typography><Typography>{`${currencySymbol}${Number(amount).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</Typography></Box>))}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography sx={{ fontWeight: 'bold' }}>TOPLAM KDV</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton size="small" onClick={(e) => setVatWithholdingMenuAnchorEl(e.currentTarget)} sx={{ mr: 0.5 }}><AddCircleOutline fontSize="small" /></IconButton>
                      <Typography sx={{ fontWeight: 'bold' }}>{`${currencySymbol}${vatTotal.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</Typography>
                    </Box>
                  </Box>
                  {vatWithholdingRate && (<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}><Typography color="error">{`KDV TEVKİFATI ${vatWithholdingRate.numerator}/${vatWithholdingRate.denominator}`}</Typography><Box sx={{ display: 'flex', alignItems: 'center' }}><Typography color="error">{`- ${currencySymbol}${vatWithholdingAmount.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</Typography><IconButton size="small" onClick={() => setVatWithholdingRate(null)} sx={{ ml: 0.5 }}><Delete fontSize="small" color="error" /></IconButton></Box></Box>)}
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>GENEL TOPLAM</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{`${currencySymbol}${grandTotal.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</Typography>
                </Box>
                {balanceTransactionType === 'doviz' && currency !== 'TRY' && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Typography color="primary" sx={{ fontWeight: 'bold' }}>TL KARŞILIĞI</Typography>
                    <Typography color="primary" sx={{ fontWeight: 'bold' }}>{`₺${tlEquivalent.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</Typography>
                  </Box>
                )}
                <FormControl component="fieldset" sx={{ mt: 2 }}>
                  <FormLabel component="legend">Cari Bakiye Etkisi</FormLabel>
                  <RadioGroup row value={balanceTransactionType} onChange={(e) => setBalanceTransactionType(e.target.value)}>
                    <FormControlLabel value="doviz" control={<Radio />} label="Döviz Tutarını İşle" />
                    <FormControlLabel value="tl" control={<Radio />} label="TL Karşılığını İşle" />
                  </RadioGroup>
                </FormControl>
              </Paper>
            </Grid>

            {/* Butonlar */}
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
              <Button variant="text" color="warning" onClick={() => navigate('/sales-invoices')}>İptal</Button>
              <Button variant="outlined" color="warning">Taslak Olarak Kaydet</Button>
              <Button variant="contained" color="primary">Faturayı Kaydet</Button>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Paper>
    </>
  );
};

export default EditSalesInvoicePage;
