import React from 'react';
import { useTranslation } from 'react-i18next';
import { Control, Controller, FieldErrors, UseFormSetValue, useFieldArray } from 'react-hook-form';
import { 
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  useTheme
} from '@mui/material';
import { Add as AddCircleOutlineIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { PurchaseInvoiceFormValues, Product, PurchaseInvoiceItem, calculateItemTotal, formatCurrency } from './types';

interface InvoiceItemsProps {
  control: Control<PurchaseInvoiceFormValues>;
  errors: FieldErrors<PurchaseInvoiceFormValues>;
  setValue: UseFormSetValue<PurchaseInvoiceFormValues>;
  products: Product[];
  getProductDetails: (productId: string, index: number) => void;
  currency?: string;
}

const InvoiceItems: React.FC<InvoiceItemsProps> = ({ 
  control, 
  errors, 
  setValue, 
  products, 
  getProductDetails,
  currency = 'TRY'
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  
  // Field array için setup
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  // Yeni boş ürün ekle
  const addNewItem = () => {
    append({
      productId: '',
      description: '',
      quantity: 1,
      unit: 'adet',
      unitPrice: 0,
      taxRate: 18,
      discount: 0
    });
  };

  // Toplam tutarları hesapla
  const calculateTotals = () => {
    let subtotal = 0;
    let taxAmount = 0;
    let discountAmount = 0;
    
    fields.forEach((field) => {
      const item = {
        productId: field.productId,
        description: field.description,
        quantity: field.quantity,
        unitPrice: field.unitPrice,
        taxRate: field.taxRate,
        discount: field.discount
      };
      
      const itemSubtotal = item.quantity * item.unitPrice;
      const itemDiscount = itemSubtotal * (item.discount / 100);
      const itemTax = (itemSubtotal - itemDiscount) * (item.taxRate / 100);
      
      subtotal += itemSubtotal;
      discountAmount += itemDiscount;
      taxAmount += itemTax;
    });
    
    const total = subtotal - discountAmount + taxAmount;
    
    return {
      subtotal,
      taxAmount,
      discountAmount,
      total
    };
  };
  
  const totals = calculateTotals();
  
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2,
        mt: 2,
        flexWrap: 'wrap',
        gap: 1
      }}>
        <Typography variant="h6" sx={{ 
          fontSize: { xs: '1rem', sm: '1.25rem' },
          fontWeight: 'medium'
        }}>
          {t('invoiceItems')}
        </Typography>
      </Box>

      <TableContainer sx={{ 
        overflowX: 'auto',
        borderRadius: '8px',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
        mb: 2,
        '& .MuiTableCell-root': {
          padding: { xs: '8px 4px', sm: '12px 8px', md: '16px 8px' },
          fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
          color: theme.palette.text.primary,
          whiteSpace: { xs: 'nowrap', md: 'normal' }
        },
        '& .MuiTableHead-root .MuiTableCell-root': {
          fontWeight: 'bold',
          backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
          position: 'sticky',
          top: 0,
          zIndex: 1
        }
      }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width="20%">Ürün</TableCell>
              <TableCell width="20%">Açıklama</TableCell>
              <TableCell width="10%" align="right">Adet</TableCell>
              <TableCell width="15%" align="right">Birim Fiyat</TableCell>
              <TableCell width="10%" align="right">İndirim (%)</TableCell>
              <TableCell width="10%" align="right">Vergi Oranı (%)</TableCell>
              <TableCell width="15%" align="right">Toplam</TableCell>
              <TableCell width="5%"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fields.map((field, index) => {
              const itemErrors = errors.items?.[index];
              const currentItem: PurchaseInvoiceItem = {
                productId: field.productId,
                description: field.description,
                quantity: field.quantity || 0,
                unit: (field as any).unit || 'adet',
                unitPrice: field.unitPrice || 0,
                taxRate: field.taxRate || 0,
                discount: field.discount || 0,
              };
              
              return (
                <TableRow key={field.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  {/* Ürün Adı */}
                  <TableCell>
                    <FormControl fullWidth error={!!itemErrors?.productId}>
                      <Controller
                        name={`items.${index}.productId`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            size="small"
                            onChange={(e) => {
                              field.onChange(e);
                              getProductDetails(e.target.value, index);
                            }}
                            displayEmpty
                          >
                            <MenuItem value="" disabled>{t('selectProduct')}</MenuItem>
                            {products.map((product) => (
                              <MenuItem key={product.id} value={product.id}>
                                {product.name}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                    </FormControl>
                  </TableCell>

                  {/* Açıklama */}
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    <Controller
                      name={`items.${index}.description`}
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} size="small" fullWidth />
                      )}
                    />
                  </TableCell>
                  
                  {/* Miktar */}
                  <TableCell align="right">
                    <Controller
                      name={`items.${index}.quantity`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="number"
                          size="small"
                          error={!!itemErrors?.quantity}
                          InputProps={{ inputProps: { min: 1, step: 1 } }}
                          sx={{ width: '80px', textAlign: 'right' }}
                        />
                      )}
                    />
                  </TableCell>

                  {/* Birim */}
                  <TableCell>
                    <FormControl fullWidth error={!!(itemErrors as any)?.unit}>
                      <Controller
                        name={`items.${index}.unit`}
                        control={control}
                        render={({ field }) => (
                          <Select {...field} size="small" displayEmpty>
                            <MenuItem value="adet">{t('adet')}</MenuItem>
                            <MenuItem value="kg">{t('kg')}</MenuItem>
                            <MenuItem value="metre">{t('metre')}</MenuItem>
                            <MenuItem value="litre">{t('litre')}</MenuItem>
                          </Select>
                        )}
                      />
                    </FormControl>
                  </TableCell>
                  
                  {/* Birim Fiyat */}
                  <TableCell align="right" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                    <Controller
                      name={`items.${index}.unitPrice`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="number"
                          size="small"
                          error={!!itemErrors?.unitPrice}
                          InputProps={{ 
                            inputProps: { min: 0, step: 0.01 },
                            startAdornment: <Typography variant="caption" sx={{ mr: 0.5 }}>{currency}</Typography>
                          }}
                          sx={{ width: '100px', textAlign: 'right' }}
                        />
                      )}
                    />
                  </TableCell>
                  
                  {/* KDV Oranı */}
                  <TableCell align="right" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                    <Controller
                      name={`items.${index}.taxRate`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="number"
                          size="small"
                          error={!!itemErrors?.taxRate}
                          InputProps={{ 
                            inputProps: { min: 0, max: 100, step: 1 },
                            endAdornment: <Typography variant="caption">%</Typography>
                          }}
                          sx={{ width: '70px', textAlign: 'right' }}
                        />
                      )}
                    />
                  </TableCell>
                  
                  {/* İndirim */}
                  <TableCell align="right" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                    <Controller
                      name={`items.${index}.discount`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="number"
                          size="small"
                          error={!!itemErrors?.discount}
                          InputProps={{ 
                            inputProps: { min: 0, max: 100, step: 1 },
                            endAdornment: <Typography variant="caption">%</Typography>
                          }}
                          sx={{ width: '70px', textAlign: 'right' }}
                        />
                      )}
                    />
                  </TableCell>
                  
                  {/* Toplam */}
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {formatCurrency(calculateItemTotal(currentItem), currency)}
                    </Typography>
                  </TableCell>
                  
                  {/* İşlemler */}
                  <TableCell align="center">
                    <IconButton 
                      size="small" 
                      onClick={() => remove(index)}
                      sx={{ color: theme.palette.error.main }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
            
            {fields.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('noItemsAdded')}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        fullWidth
        variant="contained"
        startIcon={<AddCircleOutlineIcon />}
        onClick={addNewItem}
        sx={{ 
          mt: 2, 
          mb: 2, 
          textTransform: 'none',
          backgroundColor: theme.palette.grey[600],
          '&:hover': {
            backgroundColor: theme.palette.grey[700]
          }
        }}
      >
        {t('addRow')}
      </Button>

      {/* Özet bölümü kaldırıldı - artık ana formda modern özet bölümü kullanılıyor */}
    </Box>
  );
};

export default InvoiceItems;
