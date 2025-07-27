import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Tooltip,
  IconButton,
  Stack
} from '@mui/material';
import {
  Edit,
  Delete,
  Print,
  Send,
  CloudUpload,
  GetApp,
  DeleteOutline,
  Close,
  Payment,
  Email,
  AttachFile,
  Receipt,
  History,
  Description
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import PrintButton from '../../components/common/PrintButton';

// Mock data for purchase invoice
const mockInvoiceData = {
  id: 'ALIS-2024-001',
  invoiceNumber: 'ALIS-2024-001',
  invoiceDate: '2024-06-15',
  dueDate: '2024-07-15',
  totalAmount: 3600.00,
  total: 3600.00,
  subTotal: 3000.00,
  vat: 600.00,
  status: 'Ödendi',
  supplier: {
    name: 'Teknoloji Tedarikçisi A.Ş.',
    address: 'Atatürk Cad. No:123',
    city: 'İstanbul',
    phone: '+90 212 555 0123',
    email: 'info@tedarikci.com'
  },
  company: {
    name: 'WINFINITI',
    address: 'Maslak Mahallesi, Büyükdere Cad. No:255',
    city: 'İstanbul',
    phone: '+90 212 555 0100',
    email: 'info@winfiniti.com'
  },
  items: [
    {
      id: 1,
      product: 'Laptop Bilgisayar',
      description: 'Dell Latitude 5520, Intel i7, 16GB RAM',
      hours: 0,
      quantity: 2,
      unitPrice: 1500.00,
      total: 3000.00
    },
    {
      id: 2,
      product: 'Yazılım Lisansı',
      description: 'Microsoft Office 365 Business Premium',
      hours: 0,
      quantity: 1,
      unitPrice: 600.00,
      total: 600.00
    }
  ],
  subtotal: 3000.00,
  discount: 0.00,
  tax: 600.00,
  note: 'Tedarikçi faturası. Ödeme 30 gün vadeli olarak gerçekleştirilecektir.',
  customer: {
    name: 'Teknoloji Tedarikçisi A.Ş.',
    address: 'Atatürk Cad. No:123',
    city: 'İstanbul',
    phone: '+90 212 555 0123',
    email: 'info@tedarikci.com'
  },
  paymentHistory: [
    {
      id: 1,
      date: '2024-06-20',
      amount: 1800.00,
      method: 'Banka Havalesi',
      description: 'İlk taksit ödemesi'
    },
    {
      id: 2,
      date: '2024-07-15',
      amount: 1800.00,
      method: 'Banka Havalesi',
      description: 'Son taksit ödemesi'
    }
  ]
};

// Helper to parse DD.MM.YYYY dates
// Component for printing
const PurchaseInvoicePrint = React.forwardRef<HTMLDivElement, { invoice: typeof mockInvoiceData, t: any }>(({ invoice, t }, ref) => {
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
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{t('invoiceLabel', 'Fatura')} #{invoice.id}</Typography>
          <Typography variant="body2">{t('dateIssued', 'Düzenleme Tarihi')}: {invoice.invoiceDate}</Typography>
          <Typography variant="body2">{t('dateDue', 'Vade Tarihi')}: {invoice.dueDate}</Typography>
        </Grid>
      </Grid>
      <Divider sx={{ my: 4, borderColor: 'black' }} />
      {/* Customer and Payment Details */}
      <Grid container justifyContent="space-between" sx={{ mb: 4 }}>
        <Grid item xs={12} md={5}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>{t('invoiceTo', 'Fatura Edilen')}:</Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{invoice.supplier.name}</Typography>
          <Typography variant="body2">{invoice.supplier.address}</Typography>
          <Typography variant="body2">{invoice.supplier.city}</Typography>
          <Typography variant="body2">{invoice.supplier.phone}</Typography>
          <Typography variant="body2">{invoice.supplier.email}</Typography>
        </Grid>
        <Grid item xs={12} md={5} sx={{ textAlign: 'right' }}>
          <Table size="small" sx={{ width: 'auto', ml: 'auto' }}>
            <TableBody>
              <TableRow>
                <TableCell sx={{ border: 0, p: 0.5, fontWeight: 'bold' }}>{t('totalDue', 'Ödenecek Toplam')}:</TableCell>
                <TableCell sx={{ border: 0, p: 0.5, textAlign: 'right' }}>{invoice.total.toFixed(2)} TL</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ border: 0, p: 0.5, fontWeight: 'bold' }}>{t('bankName', 'Banka Adı')}:</TableCell>
                <TableCell sx={{ border: 0, p: 0.5, textAlign: 'right' }}>American Bank</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ border: 0, p: 0.5, fontWeight: 'bold' }}>{t('country', 'Ülke')}:</TableCell>
                <TableCell sx={{ border: 0, p: 0.5, textAlign: 'right' }}>United States</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ border: 0, p: 0.5, fontWeight: 'bold' }}>{t('iban', 'IBAN')}:</TableCell>
                <TableCell sx={{ border: 0, p: 0.5, textAlign: 'right' }}>ETD95476213874685</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ border: 0, p: 0.5, fontWeight: 'bold' }}>{t('swiftCode', 'SWIFT Kodu')}:</TableCell>
                <TableCell sx={{ border: 0, p: 0.5, textAlign: 'right' }}>BR91905</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
      </Grid>
      {/* Items Table with Totals */}
      <TableContainer>
        <Table sx={{ border: '1px solid #ddd' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ border: '1px solid #ddd' }}>{t('item', 'Ürün')}</TableCell>
              <TableCell sx={{ border: '1px solid #ddd' }}>{t('description', 'Açıklama')}</TableCell>
              <TableCell align="right" sx={{ border: '1px solid #ddd' }}>{t('hours', 'Saat')}</TableCell>
              <TableCell align="right" sx={{ border: '1px solid #ddd' }}>{t('quantity', 'Miktar')}</TableCell>
              <TableCell align="right" sx={{ border: '1px solid #ddd' }}>{t('total', 'Toplam')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <React.Fragment>
              {invoice.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>{item.product}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd' }}>Web and Logo Design</TableCell>
                  <TableCell align="right" sx={{ border: '1px solid #ddd' }}>{(item.unitPrice / 50).toFixed(1)}</TableCell>
                  <TableCell align="right" sx={{ border: '1px solid #ddd' }}>{item.quantity}</TableCell>
                  <TableCell align="right" sx={{ border: '1px solid #ddd' }}>{item.total.toFixed(2)} TL</TableCell>
                </TableRow>
              ))}
              <TableRow key="subtotal">
                <TableCell colSpan={3} sx={{ border: 0 }} />
                <TableCell sx={{ border: '1px solid #ddd' }}><Typography>{t('subtotal', 'Ara Toplam')}</Typography></TableCell>
                <TableCell align="right" sx={{ border: '1px solid #ddd' }}><Typography>{invoice.subTotal.toFixed(2)} TL</Typography></TableCell>
              </TableRow>
              <TableRow key="discount">
                <TableCell colSpan={3} sx={{ border: 0 }} />
                <TableCell sx={{ border: '1px solid #ddd' }}><Typography>{t('discount', 'İndirim')}</Typography></TableCell>
                <TableCell align="right" sx={{ border: '1px solid #ddd' }}><Typography>0.00 TL</Typography></TableCell>
              </TableRow>
              <TableRow key="tax">
                <TableCell colSpan={3} sx={{ border: 0 }} />
                <TableCell sx={{ border: '1px solid #ddd' }}><Typography>{t('tax', 'Vergi')}</Typography></TableCell>
                <TableCell align="right" sx={{ border: '1px solid #ddd' }}><Typography>{invoice.vat.toFixed(2)} TL</Typography></TableCell>
              </TableRow>
              <TableRow key="total">
                <TableCell colSpan={3} sx={{ border: 0 }} />
                <TableCell sx={{ border: '1px solid #ddd' }}><Typography variant="h6" sx={{ fontWeight: 'bold' }}>{t('total', 'Toplam')}</Typography></TableCell>
                <TableCell align="right" sx={{ border: '1px solid #ddd' }}><Typography variant="h6" sx={{ fontWeight: 'bold' }}>{invoice.total.toFixed(2)} TL</Typography></TableCell>
              </TableRow>
            </React.Fragment>
          </TableBody>
        </Table>
      </TableContainer>
      <Divider sx={{ my: 4, borderColor: 'black' }} />
      {/* Note Section */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{t('note', 'Not')}:</Typography>
        <Typography variant="body2">{t('invoiceNote', 'Sizinle ve ekibinizle çalışmak bir zevkti. Gelecekteki serbest projeleriniz için bizi aklınızda tutacağınızı umuyoruz. Teşekkür ederiz!')}</Typography>
      </Box>
    </Box>
  );
});

const parseDateDDMMYYYY = (dateStr: string) => {
  if (!dateStr || dateStr.split('.').length !== 3) return null;
  const [day, month, year] = dateStr.split('.').map(Number);
  return new Date(year, month - 1, day);
};



const PurchaseInvoiceDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  // In a real app, you would fetch the invoice data based on the id
  // For now, we'll use the mock data.
  const invoice = mockInvoiceData;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tabIndex, setTabIndex] = useState(0); // Default to 'Fatura Bilgileri'

  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });


  const [documents, setDocuments] = useState([
    { id: 1, name: 'purchase-invoice.pdf', size: '120.56 KB' },
    { id: 2, name: 'delivery-receipt.jpg', size: '770.52 KB' },
  ]);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [isSendModalOpen, setSendModalOpen] = useState(false);

  const handleOpenDetailDialog = () => {
    setDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
  };

  const handleDeleteDocument = (id: number) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  const handleOpenSendModal = () => setSendModalOpen(true);
  const handleCloseSendModal = () => setSendModalOpen(false);

  const handleSendInvoice = () => {
    // TODO: Implement actual email sending logic with a backend service
    console.log('Sending invoice to:', 'don85@johnson.com'); // Using mock email as customer object doesn't contain email
    handleCloseSendModal();
  };

  const handleEdit = () => {
    if (id) {
      navigate(`/sales-invoices/edit/${id}`);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>
          {t('salesInvoice.salesInvoiceDetail', 'Satış Faturası Detayı')}
        </Typography>
        <Box>
          {isMobile ? (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title={t('edit', 'Düzenle')}>
                <IconButton
                  sx={{ color: 'white', backgroundColor: 'orange', '&:hover': { backgroundColor: '#e65100' } }}
                  onClick={handleEdit}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('delete', 'Sil')}>
                <IconButton sx={{ color: 'white', backgroundColor: theme.palette.error.main, '&:hover': { backgroundColor: theme.palette.error.dark } }}>
                  <Delete />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('salesInvoice.print', 'Yazdır')}>
                <IconButton onClick={handlePrint} sx={{ color: 'white', backgroundColor: theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.primary.dark } }}>
                  <Print />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('salesInvoice.sendInvoice', 'Fatura Gönder')}>
                <IconButton onClick={handleOpenSendModal} sx={{ color: 'white', backgroundColor: theme.palette.secondary.main, '&:hover': { backgroundColor: theme.palette.secondary.dark } }}>
                  <Send />
                </IconButton>
              </Tooltip>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                sx={{ mr: 1, backgroundColor: 'orange', '&:hover': { backgroundColor: '#e65100' } }}
                startIcon={<Edit />}
                onClick={handleEdit}
              >
                {t('edit', 'Düzenle')}
              </Button>
              <Button variant="contained" color="error" sx={{ mr: 1 }} startIcon={<Delete />}>
                {t('delete', 'Sil')}
              </Button>
              <PrintButton label={t('salesInvoice.print', 'Yazdır')} onClick={handlePrint} />
              <Button variant="contained" color="secondary" startIcon={<Send />} onClick={handleOpenSendModal}>
                {t('salesInvoice.sendInvoice', 'Fatura Gönder')}
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      <div style={{ display: 'none' }}>
        {/* Print content will be added here */}
      </div>

      <Dialog open={isSendModalOpen} onClose={handleCloseSendModal} fullWidth maxWidth="sm">
        <DialogTitle>
          {t('salesInvoice.sendInvoiceTitle', 'Faturayı Gönder')}
          <IconButton
            aria-label="close"
            onClick={handleCloseSendModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label={t('salesInvoice.from', 'Kimden')}
              defaultValue="winfiniti@email.com"
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              fullWidth
            />
            <TextField
              label={t('salesInvoice.to', 'Kime')}
              defaultValue="don85@johnson.com" // Using mock email
              variant="outlined"
              fullWidth
            />
            <TextField
              label={t('salesInvoice.subject', 'Konu')}
              defaultValue={`${t('invoiceLabel', 'Fatura')} #${invoice.id} - ${t('salesInvoice.invoiceFrom', 'Winfiniti Bilişim A.Ş. Faturanız')}`}
              variant="outlined"
              fullWidth
            />
            <TextField
              label={t('salesInvoice.message', 'Mesaj')}
              multiline
              rows={8}
              defaultValue={
                `${t('salesInvoice.dear', 'Sayın')} ${invoice.customer},\n\n` +
                `${t('salesInvoice.invoiceAttachedMessage', 'Bu e-postanın ekinde, son işlemlerinize ait faturanız bulunmaktadır.')}\n\n` +
                `${t('salesInvoice.invoiceTotalMessage', 'Fatura tutarı')} ${invoice.total.toFixed(2)} TL ${t('salesInvoice.isDueOn', 'olup, son ödeme tarihi')} ${invoice.dueDate}${t('salesInvoice.dir', 'dir')}.\n\n` +
                `${t('salesInvoice.thankYouForBusiness', 'İş birliğiniz için teşekkür ederiz.')}\n\n` +
                `${t('salesInvoice.sincerely', 'Saygılarımızla')},\n` +
                `Winfiniti Bilişim A.Ş.`
              }
              variant="outlined"
              fullWidth
            />
            <Chip icon={<AttachFile />} label={t('salesInvoice.invoiceAttached', 'Fatura Eklendi')} color="primary" variant="outlined" />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: '16px 24px' }}>
          <Button onClick={handleCloseSendModal}>{t('salesInvoice.cancel', 'İptal')}</Button>
          <Button onClick={handleSendInvoice} variant="contained" startIcon={<Send />}>
            {t('salesInvoice.send', 'Gönder')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* TABS */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
          <Tab icon={<Receipt />} iconPosition="start" label={t('salesInvoice.invoiceInfo', 'Fatura Bilgileri')} />
          <Tab icon={<History />} iconPosition="start" label={t('salesInvoice.paymentHistory', 'Ödeme Geçmişi')} />
          <Tab icon={<Description />} iconPosition="start" label={t('salesInvoice.documents', 'Dökümanlar')} />
        </Tabs>
      </Box>

      {/* TAB CONTENT */}
      {tabIndex === 0 && (
        <Paper elevation={0} variant="outlined" sx={{ p: { xs: 2, sm: 4 } }}>
          {/* Header */}
          <Grid container justifyContent="space-between" alignItems="flex-start" sx={{ mb: 4 }}>
            <Grid item>
              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  WINFINITI
                </Typography>
              </Box>
              <Typography variant="body2">Office 149, 450 South Brand Brooklyn</Typography>
              <Typography variant="body2">San Diego County, CA 91905, USA</Typography>
              <Typography variant="body2">+1 (123) 456 7891, +44 (876) 543 2198</Typography>
            </Grid>
            <Grid item sx={{ textAlign: 'right' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{t('invoiceLabel', 'Fatura')} #{invoice.id}</Typography>
              <Typography variant="body2">{t('dateIssued', 'Düzenleme Tarihi')}: {invoice.invoiceDate}</Typography>
              <Typography variant="body2">{t('dateDue', 'Vade Tarihi')}: {invoice.dueDate}</Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Customer and Payment Details */}
          <Grid container justifyContent="space-between" sx={{ mb: 4 }}>
            <Grid item xs={12} md={5}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>{t('invoiceTo', 'Fatura Edilen')}:</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{invoice.supplier.name}</Typography>
              <Typography variant="body2">{invoice.supplier.address}</Typography>
              <Typography variant="body2">{invoice.supplier.city}</Typography>
              <Typography variant="body2">{invoice.supplier.phone}</Typography>
              <Typography variant="body2">{invoice.supplier.email}</Typography>
            </Grid>
            <Grid item xs={12} md={5} sx={{ textAlign: { xs: 'left', md: 'right' }, mt: { xs: 2, md: 0 } }}>
              <Table size="small" sx={{ width: 'auto', ml: 'auto' }}>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ border: 0, p: 0.5, fontWeight: 'bold' }}>{t('totalDue', 'Ödenecek Toplam')}:</TableCell>
                    <TableCell sx={{ border: 0, p: 0.5, textAlign: 'right' }}>{invoice.total.toFixed(2)} TL</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ border: 0, p: 0.5, fontWeight: 'bold' }}>{t('bankName', 'Banka Adı')}:</TableCell>
                    <TableCell sx={{ border: 0, p: 0.5, textAlign: 'right' }}>American Bank</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ border: 0, p: 0.5, fontWeight: 'bold' }}>{t('country', 'Ülke')}:</TableCell>
                    <TableCell sx={{ border: 0, p: 0.5, textAlign: 'right' }}>United States</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ border: 0, p: 0.5, fontWeight: 'bold' }}>{t('iban', 'IBAN')}:</TableCell>
                    <TableCell sx={{ border: 0, p: 0.5, textAlign: 'right' }}>ETD95476213874685</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ border: 0, p: 0.5, fontWeight: 'bold' }}>{t('swiftCode', 'SWIFT Kodu')}:</TableCell>
                    <TableCell sx={{ border: 0, p: 0.5, textAlign: 'right' }}>BR91905</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Grid>
          </Grid>

          {/* Items Table with Totals */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                  <TableCell>{t('item', 'Ürün')}</TableCell>
                  <TableCell>{t('description', 'Açıklama')}</TableCell>
                  <TableCell align="right">{t('hours', 'Saat')}</TableCell>
                  <TableCell align="right">{t('quantity', 'Miktar')}</TableCell>
                  <TableCell align="right">{t('total', 'Toplam')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <React.Fragment>
                  {invoice.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell sx={{ fontWeight: 'bold' }}>{item.product}</TableCell>
                      <TableCell>Web and Logo Design</TableCell>
                      <TableCell align="right">{(item.unitPrice / 50).toFixed(1)}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{item.total.toFixed(2)} TL</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell rowSpan={4} colSpan={2} sx={{ border: 0 }} />
                    <TableCell colSpan={2}>{t('subtotal', 'Ara Toplam')}</TableCell>
                    <TableCell align="right">{invoice.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0).toFixed(2)} TL</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2}>{t('discount', 'İndirim')}</TableCell>
                    <TableCell align="right">0.00 TL</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2}>{t('tax', 'Vergi')}</TableCell>
                    <TableCell align="right">{invoice.vat.toFixed(2)} TL</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2}><Typography variant="h6">{t('total', 'Toplam')}</Typography></TableCell>
                    <TableCell align="right"><Typography variant="h6">{invoice.total.toFixed(2)} TL</Typography></TableCell>
                  </TableRow>
                </React.Fragment>
              </TableBody>
            </Table>
          </TableContainer>

          <Divider sx={{ my: 4 }} />

          {/* Note Section */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Note:</Typography>
            <Typography variant="body2">It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance projects. Thank You!</Typography>
          </Box>
        </Paper>
      )}
      {tabIndex === 1 && (
        <Paper elevation={0} variant="outlined">
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
                <TableRow>
                  <TableCell>{t('paymentId', 'Ödeme ID')}</TableCell>
                  <TableCell>{t('date', 'Tarih')}</TableCell>
                  <TableCell align="right">{t('amount', 'Tutar')}</TableCell>
                  <TableCell>{t('paymentMethod', 'Ödeme Yöntemi')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoice.paymentHistory.map((payment: any) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.id}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell align="right">{payment.amount.toFixed(2)} TL</TableCell>
                    <TableCell>{payment.method}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      {tabIndex === 2 && (
        <Paper elevation={0} variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ mt: 4, fontWeight: 'bold' }}>
            {t('salesInvoice.documents', 'Dökümanlar')}
          </Typography>
          <Box
            sx={{
              border: `2px dashed ${theme.palette.grey[400]}`,
              borderRadius: 1,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              mb: 3,
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <CloudUpload sx={{ fontSize: 48, color: theme.palette.grey[600] }} />
            <Typography>
              {t('drag_and_drop_or_click', 'Dosyaları buraya sürükleyin veya tıklayın')}
            </Typography>
          </Box>
          <List>
            {documents.map((doc) => (
              <ListItem
                key={doc.id}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteDocument(doc.id)}>
                    <Delete />
                  </IconButton>
                }
                sx={{
                  backgroundColor: theme.palette.grey[50],
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': {
                    backgroundColor: theme.palette.grey[100],
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar>
                    <Receipt />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={doc.name} secondary={doc.size} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onClose={handleCloseDetailDialog} fullWidth maxWidth="sm">
        <DialogTitle>{t('invoiceDetails', 'Fatura Detayları')}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography><strong>{t('invoiceNumber', 'Fatura No')}:</strong> {invoice.id}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography><strong>{t('supplier', 'Tedarikçi')}:</strong> {invoice.supplier.name}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography><strong>{t('invoiceDate', 'Fatura Tarihi')}:</strong> {invoice.invoiceDate}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography><strong>{t('dueDate', 'Vade Tarihi')}:</strong> {invoice.dueDate}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography><strong>{t('totalAmount', 'Toplam Tutar')}:</strong> {invoice.total.toFixed(2)} TL</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography><strong>{t('status', 'Durum')}:</strong> <Chip label={t(invoice.status.toLowerCase(), invoice.status)} color={invoice.status === 'Ödendi' ? 'success' : 'warning'} size="small" /></Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
          <Button onClick={handleCloseDetailDialog}>{t('close', 'Kapat')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PurchaseInvoiceDetailPage;
