import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Stack,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  ReceiptLong as ReceiptIcon,
  History as HistoryIcon,
  Description as DescriptionIcon,
  CloudUpload as CloudUploadIcon,
  Send as SendIcon,
  Print as PrintIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Transform as TransformIcon
} from '@mui/icons-material';

// Mock data for a single draft invoice
const draftInvoice = {
  id: 'DRAFT-2024-001',
  customer: 'Ayşe Kaya',
  invoiceDate: '2024-07-08',
  dueDate: '2024-08-08',
  status: 'Taslak',
  subTotal: 1500.00,
  vat: 300.00,
  total: 1800.00,
  items: [
    { id: 1, product: 'Danışmanlık Hizmeti', quantity: 10, unitPrice: 150.00, total: 1500.00 },
  ],
  paymentHistory: [], // Drafts don't have payment history
};

const mockDocuments = [
  { id: 1, name: 'proje-teklifi.pdf', size: '250.12 KB' },
];

// Component for printing
const DraftInvoicePrint = React.forwardRef<HTMLDivElement, { invoice: typeof draftInvoice, t: any }>(({ invoice, t }, ref) => {
  return (
    <Box ref={ref} sx={{ p: 4, color: 'black', backgroundColor: 'white' }}>
      {/* Header */}
      <Grid container justifyContent="space-between" alignItems="flex-start" sx={{ mb: 4 }}>
        <Grid item>
          <Box display="flex" alignItems="center" mb={2}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
              WINFINITI
            </Typography>
          </Box>
          <Typography variant="body2">Office 149, 450 South Brand Brooklyn</Typography>
          <Typography variant="body2">San Diego County, CA 91905, USA</Typography>
          <Typography variant="body2">+1 (123) 456 7891, +44 (876) 543 2198</Typography>
        </Grid>
        <Grid item sx={{ textAlign: 'right' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{t('draftInvoice.draftInvoiceLabel', 'Taslak Fatura')} #{invoice.id}</Typography>
          <Typography variant="body2">{t('dateIssued', 'Düzenleme Tarihi')}: {invoice.invoiceDate}</Typography>
          <Typography variant="body2">{t('dateDue', 'Vade Tarihi')}: {invoice.dueDate}</Typography>
        </Grid>
      </Grid>
      <Divider sx={{ my: 4, borderColor: 'black' }} />
      {/* Customer Details */}
      <Grid container justifyContent="space-between" sx={{ mb: 4 }}>
        <Grid item xs={12} md={5}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>{t('invoiceTo', 'Fatura Edilen')}:</Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{invoice.customer}</Typography>
        </Grid>
      </Grid>
      {/* Items Table */}
      <TableContainer>
        <Table sx={{ border: '1px solid #ddd' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ border: '1px solid #ddd' }}>{t('item', 'Ürün')}</TableCell>
              <TableCell align="right" sx={{ border: '1px solid #ddd' }}>{t('quantity', 'Miktar')}</TableCell>
              <TableCell align="right" sx={{ border: '1px solid #ddd' }}>{t('unitPrice', 'Birim Fiyat')}</TableCell>
              <TableCell align="right" sx={{ border: '1px solid #ddd' }}>{t('total', 'Toplam')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              invoice.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>{item.product}</TableCell>
                  <TableCell align="right" sx={{ border: '1px solid #ddd' }}>{item.quantity}</TableCell>
                  <TableCell align="right" sx={{ border: '1px solid #ddd' }}>{item.unitPrice.toFixed(2)} TL</TableCell>
                  <TableCell align="right" sx={{ border: '1px solid #ddd' }}>{item.total.toFixed(2)} TL</TableCell>
                </TableRow>
              ))
            }
            <TableRow>
                <TableCell colSpan={2} sx={{ border: 0 }} />
                <TableCell sx={{ border: '1px solid #ddd' }}><Typography>{t('subtotal', 'Ara Toplam')}</Typography></TableCell>
                <TableCell align="right" sx={{ border: '1px solid #ddd' }}><Typography>{invoice.subTotal.toFixed(2)} TL</Typography></TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={2} sx={{ border: 0 }} />
                <TableCell sx={{ border: '1px solid #ddd' }}><Typography>{t('tax', 'Vergi')}</Typography></TableCell>
                <TableCell align="right" sx={{ border: '1px solid #ddd' }}><Typography>{invoice.vat.toFixed(2)} TL</Typography></TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={2} sx={{ border: 0 }} />
                <TableCell sx={{ border: '1px solid #ddd' }}><Typography variant="h6" sx={{ fontWeight: 'bold' }}>{t('total', 'Toplam')}</Typography></TableCell>
                <TableCell align="right" sx={{ border: '1px solid #ddd' }}><Typography variant="h6" sx={{ fontWeight: 'bold' }}>{invoice.total.toFixed(2)} TL</Typography></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
});

const DraftInvoiceDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const invoice = draftInvoice; // Using mock data
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tabIndex, setTabIndex] = useState(0);

  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleConvertToInvoice = () => {
    // In a real app, this would involve:
    // 1. Sending a request to the backend to convert the draft.
    // 2. The backend would create a new sales invoice and return its new ID.
    // 3. Navigating to the new sales invoice page with the returned ID.
    console.log(`Converting draft ${id} to a sales invoice.`);
    const newInvoiceId = `INV-2024-${Math.floor(1000 + Math.random() * 9000)}`; // Generate a random new ID
    navigate(`/sales-invoices/${newInvoiceId}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>
          {t('draftInvoice.draftInvoiceDetail', 'Taslak Fatura Detayı')}
        </Typography>
        <Box>
          {isMobile ? (
            <Tooltip title={t('draftInvoice.convertToInvoice', 'Faturaya Dönüştür')}>
              <IconButton
                sx={{ color: 'white', backgroundColor: theme.palette.success.main, '&:hover': { backgroundColor: theme.palette.success.dark } }}
                onClick={handleConvertToInvoice}
              >
                <TransformIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Button
              variant="contained"
              color="success"
              startIcon={<TransformIcon />}
              onClick={handleConvertToInvoice}
            >
              {t('draftInvoice.convertToInvoice', 'Faturaya Dönüştür')}
            </Button>
          )}
        </Box>
      </Box>

      <div style={{ display: 'none' }}>
        <DraftInvoicePrint ref={componentRef} invoice={invoice} t={t} />
      </div>

      {/* TABS */}
      <Tabs value={tabIndex} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tab icon={<ReceiptIcon />} iconPosition="start" label={t('draftInvoice.invoiceInfo', 'Fatura Bilgileri')} />
      </Tabs>

      {/* MAIN CONTENT */}
      <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
        {tabIndex === 0 && (
          <Grid container spacing={3}>
            {/* Left Side: Invoice Details */}
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>{t('draftInvoice.invoiceDetails', 'Fatura Detayları')}</Typography>
              <Divider sx={{ mb: 2 }} />
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>{t('invoiceNumber', 'Fatura No')}:</strong></TableCell>
                      <TableCell>{invoice.id}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>{t('customer', 'Müşteri')}:</strong></TableCell>
                      <TableCell>{invoice.customer}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>{t('invoiceDate', 'Fatura Tarihi')}:</strong></TableCell>
                      <TableCell>{invoice.invoiceDate}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>{t('status', 'Durum')}:</strong></TableCell>
                      <TableCell>
                        <Chip label={t(`status.${invoice.status.toLowerCase()}`, invoice.status)} color="warning" size="small" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>{t('items', 'Ürünler')}</Typography>
              <Divider sx={{ mb: 2 }} />
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('product', 'Ürün')}</TableCell>
                      <TableCell align="right">{t('quantity', 'Miktar')}</TableCell>
                      <TableCell align="right">{t('unitPrice', 'Birim Fiyat')}</TableCell>
                      <TableCell align="right">{t('total', 'Toplam')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoice.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.product}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">{item.unitPrice.toFixed(2)} TL</TableCell>
                        <TableCell align="right">{item.total.toFixed(2)} TL</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* Right Side: Totals */}
            <Grid item xs={12} md={4}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>{t('summary', 'Özet')}</Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={1}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography>{t('subtotal', 'Ara Toplam')}:</Typography>
                    <Typography>{invoice.subTotal.toFixed(2)} TL</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography>{t('tax', 'Vergi')} (20%):</Typography>
                    <Typography>{invoice.vat.toFixed(2)} TL</Typography>
                  </Box>
                  <Divider />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6"><strong>{t('total', 'Toplam')}:</strong></Typography>
                    <Typography variant="h6"><strong>{invoice.total.toFixed(2)} TL</strong></Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Paper>
    </Box>
  );
};

export default DraftInvoiceDetailPage;
