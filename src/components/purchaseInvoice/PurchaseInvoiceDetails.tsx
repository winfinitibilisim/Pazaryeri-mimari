import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import EditIcon from '@mui/icons-material/Edit';
import { colors } from '../../theme/colors';
import ExportButton from '../common/ExportButton';
import PrintButton from '../common/PrintButton';
import { formatCurrency, formatDate } from '../../utils/exportUtils';

// Fatura durumu için renk belirleme fonksiyonu
const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return { bg: '#e6f7ee', text: '#1e8e3e' };
    case 'unpaid':
      return { bg: '#fef2f2', text: '#d92f2f' };
    case 'partial':
      return { bg: '#fff8e6', text: '#e8a317' };
    case 'cancelled':
      return { bg: '#f2f2f2', text: '#757575' };
    case 'draft':
      return { bg: '#e6f3ff', text: '#1976d2' };
    default:
      return { bg: '#f2f2f2', text: '#757575' };
  }
};

// Örnek fatura verisi (gerçek uygulamada API'den gelecek)
const mockInvoiceData = {
  id: '1001',
  invoiceNumber: 'PINV-2025-001',
  supplier: {
    id: '1',
    name: 'ABC Tedarikçisi',
    taxId: '1234567890',
    email: 'info@abctedarik.com',
    phone: '+90 212 123 4567'
  },
  invoiceDate: '2025-05-20',
  dueDate: '2025-06-20',
  status: 'paid',
  paymentMethod: 'bankTransfer',
  billingAddress: 'Merkez Mah. Atatürk Cad. No:123\nŞişli, İstanbul, 34000\nTürkiye',
  shippingAddress: 'Merkez Mah. Atatürk Cad. No:123\nŞişli, İstanbul, 34000\nTürkiye',
  notes: 'Bu bir örnek alış faturasıdır. Ödeme 30 gün içinde yapılmalıdır.',
  items: [
    {
      id: '1',
      productName: 'Laptop',
      description: 'Yüksek performanslı iş laptopu',
      quantity: 2,
      unitPrice: 12000,
      taxRate: 18,
      discount: 5,
      subtotal: 24000,
      discountAmount: 1200,
      taxAmount: 4104,
      total: 26904
    },
    {
      id: '2',
      productName: 'Monitör',
      description: '27" 4K Monitör',
      quantity: 2,
      unitPrice: 3500,
      taxRate: 18,
      discount: 0,
      subtotal: 7000,
      discountAmount: 0,
      taxAmount: 1260,
      total: 8260
    }
  ],
  subtotal: 31000,
  discountAmount: 1200,
  taxAmount: 5364,
  total: 35164,
  createdAt: '2025-05-20T10:30:00Z',
  updatedAt: '2025-05-20T10:30:00Z'
};

interface PurchaseInvoiceDetailsProps {
  invoiceId: string;
  onEdit: () => void;
}

const PurchaseInvoiceDetails: React.FC<PurchaseInvoiceDetailsProps> = ({ invoiceId, onEdit }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gerçek uygulamada API'den veri çekilecek
    // Şimdilik örnek veri kullanıyoruz
    setLoading(true);
    setTimeout(() => {
      setInvoice(mockInvoiceData);
      setLoading(false);
    }, 500);
  }, [invoiceId]);

  // Excel'e aktar
  const handleExportToExcel = () => {
    console.log('Export to Excel');
  };

  // Yazdır
  const handlePrint = () => {
    window.print();
  };

  if (loading || !invoice) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>{t('loading')}</Typography>
      </Box>
    );
  }

  const statusColor = getStatusColor(invoice.status);

  return (
    <Box>
      {/* Üst Bilgi Alanı */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" component="h1">
              {t('purchaseInvoiceDetails')}
            </Typography>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={onEdit}
                sx={{ color: colors.warning, borderColor: colors.warning }}
              >
                {t('edit')}
              </Button>
              <ExportButton onClick={handleExportToExcel} label={t('export')} />

            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          {/* Sol Taraf - Fatura Bilgileri */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>

                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      {t('invoiceNumber')}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {invoice.invoiceNumber}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      {t('invoiceStatus')}
                    </Typography>
                    <Chip
                      label={t(invoice.status)}
                      size="small"
                      sx={{
                        bgcolor: statusColor.bg,
                        color: statusColor.text,
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        mt: 0.5
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      {t('invoiceDate')}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {formatDate(invoice.invoiceDate)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      {t('dueDate')}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {formatDate(invoice.dueDate)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      {t('paymentMethod')}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {t(invoice.paymentMethod)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      {t('notes')}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {invoice.notes || '-'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Sağ Taraf - Tedarikçi Bilgileri */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('supplier')}
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      {t('supplier')}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {invoice.supplier.name}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      {t('taxId')}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {invoice.supplier.taxId}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      {t('phone')}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {invoice.supplier.phone}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      {t('email')}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {invoice.supplier.email}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      {t('billingAddress')}
                    </Typography>
                    <Typography variant="body1" gutterBottom style={{ whiteSpace: 'pre-line' }}>
                      {invoice.billingAddress}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      {t('shippingAddress')}
                    </Typography>
                    <Typography variant="body1" gutterBottom style={{ whiteSpace: 'pre-line' }}>
                      {invoice.shippingAddress}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Fatura Kalemleri */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('items')}
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>{t('invoiceProductName')}</TableCell>
                <TableCell>{t('description')}</TableCell>
                <TableCell align="right">{t('quantity')}</TableCell>
                <TableCell align="right">{t('invoiceUnitPrice')}</TableCell>
                <TableCell align="right">{t('discount')} (%)</TableCell>
                <TableCell align="right">{t('taxRate')} (%)</TableCell>
                <TableCell align="right">{t('totalAmount')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoice.items.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">{formatCurrency(item.unitPrice)}</TableCell>
                  <TableCell align="right">{item.discount}%</TableCell>
                  <TableCell align="right">{item.taxRate}%</TableCell>
                  <TableCell align="right">{formatCurrency(item.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Toplamlar */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Grid container spacing={1} sx={{ maxWidth: 400 }}>
            <Grid item xs={6}>
              <Typography variant="body1" align="right">
                {t('subtotal')}:
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" align="right">
                {formatCurrency(invoice.subtotal)}
              </Typography>
            </Grid>
            
            <Grid item xs={6}>
              <Typography variant="body1" align="right">
                {t('discountAmount')}:
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" align="right">
                -{formatCurrency(invoice.discountAmount)}
              </Typography>
            </Grid>
            
            <Grid item xs={6}>
              <Typography variant="body1" align="right">
                {t('taxAmount')}:
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" align="right">
                {formatCurrency(invoice.taxAmount)}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>
            
            <Grid item xs={6}>
              <Typography variant="h6" align="right" fontWeight="bold">
                {t('totalAmount')}:
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6" align="right" fontWeight="bold" color={colors.primary}>
                {formatCurrency(invoice.total)}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
      {/* Alt Bilgiler */}
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              {t('printDate')}
            </Typography>
            <Typography variant="body1">
              {format(new Date(), 'dd.MM.yyyy HH:mm')}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6} textAlign="right">
            <Typography variant="body2" color="text.secondary">
              {t('createdAt')}
            </Typography>
            <Typography variant="body1">
              {format(new Date(invoice.createdAt), 'dd.MM.yyyy HH:mm')}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default PurchaseInvoiceDetails;
