import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useReactToPrint } from 'react-to-print';

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import * as XLSX from 'xlsx';
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
  Tooltip,
  IconButton,
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
  TextFieldProps,
  useTheme,
  useMediaQuery,
  Collapse,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Stack
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import {
  Payment as PaymentIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  Print as PrintIcon,
  FileDownload as FileDownloadIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  ReceiptLong as ReceiptIcon,
  History as HistoryIcon,
  Description as DescriptionIcon,
  CloudUpload as CloudUploadIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon
} from '@mui/icons-material';
import ExportButton from '../../components/common/ExportButton';
import PrintButton from '../../components/common/PrintButton';
import { useParams, useNavigate } from 'react-router-dom';

// Mock data for a single sales invoice
const salesInvoice = {
  id: 'INV-2024-001',
  customer: 'Ahmet Yılmaz',
  invoiceDate: '2024-06-15',
  dueDate: '2024-07-15',
  status: 'Ödendi',
  subTotal: 3000.00,
  vat: 600.00,
  total: 3600.00,
  items: [
    { id: 1, product: 'Web Tasarım Hizmeti', quantity: 1, unitPrice: 2000.00, total: 2000.00 },
    { id: 2, product: 'Logo Tasarımı', quantity: 1, unitPrice: 1000.00, total: 1000.00 },
  ],
  paymentHistory: [
    { id: 'PAY-001', date: '2024-06-20', amount: 3600.00, method: 'Havale/EFT' },
  ],
};

const mockDocuments = [
  { id: 1, name: 'flight-ticket.pdf', size: '120.56 KB' },
  { id: 2, name: 'hotel-receipt.jpg', size: '770.52 KB' },
];

// Helper to parse DD.MM.YYYY dates
// Component for printing
const SalesInvoicePrint = React.forwardRef<HTMLDivElement, { invoice: typeof salesInvoice, t: any }>(({ invoice, t }, ref) => {
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
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{invoice.customer}</Typography>
          <Typography variant="body2">Hall-Robbins PLC</Typography>
          <Typography variant="body2">7777 Mendez Plains</Typography>
          <Typography variant="body2">(616) 865-4180</Typography>
          <Typography variant="body2">don85@johnson.com</Typography>
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



const SalesInvoiceDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  // In a real app, you would fetch the invoice data based on the id
  // For now, we'll use the mock data.
  const invoice = salesInvoice;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tabIndex, setTabIndex] = useState(0); // Default to 'Fatura Bilgileri'

  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });


  const [documents, setDocuments] = useState(mockDocuments);
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
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('delete', 'Sil')}>
                <IconButton sx={{ color: 'white', backgroundColor: theme.palette.error.main, '&:hover': { backgroundColor: theme.palette.error.dark } }}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('salesInvoice.print', 'Yazdır')}>
                <IconButton onClick={handlePrint} sx={{ color: 'white', backgroundColor: theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.primary.dark } }}>
                  <PrintIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('salesInvoice.sendInvoice', 'Fatura Gönder')}>
                <IconButton onClick={handleOpenSendModal} sx={{ color: 'white', backgroundColor: theme.palette.secondary.main, '&:hover': { backgroundColor: theme.palette.secondary.dark } }}>
                  <SendIcon />
                </IconButton>
              </Tooltip>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                sx={{ mr: 1, backgroundColor: 'orange', '&:hover': { backgroundColor: '#e65100' } }}
                startIcon={<EditIcon />}
                onClick={handleEdit}
              >
                {t('edit', 'Düzenle')}
              </Button>
              <Button variant="contained" color="error" sx={{ mr: 1 }} startIcon={<DeleteIcon />}>
                {t('delete', 'Sil')}
              </Button>
              <PrintButton label={t('salesInvoice.print', 'Yazdır')} onClick={handlePrint} />
              <Button variant="contained" color="secondary" startIcon={<SendIcon />} onClick={handleOpenSendModal}>
                {t('salesInvoice.sendInvoice', 'Fatura Gönder')}
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      <div style={{ display: 'none' }}>
        <SalesInvoicePrint ref={componentRef} invoice={invoice} t={t} />
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
            <CloseIcon />
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
            <Chip icon={<AttachFileIcon />} label={t('salesInvoice.invoiceAttached', 'Fatura Eklendi')} color="primary" variant="outlined" />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: '16px 24px' }}>
          <Button onClick={handleCloseSendModal}>{t('salesInvoice.cancel', 'İptal')}</Button>
          <Button onClick={handleSendInvoice} variant="contained" startIcon={<SendIcon />}>
            {t('salesInvoice.send', 'Gönder')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* TABS */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
          <Tab icon={<ReceiptIcon />} iconPosition="start" label={t('salesInvoice.invoiceInfo', 'Fatura Bilgileri')} />
          <Tab icon={<HistoryIcon />} iconPosition="start" label={t('salesInvoice.paymentHistory', 'Ödeme Geçmişi')} />
          <Tab icon={<DescriptionIcon />} iconPosition="start" label={t('salesInvoice.documents', 'Dökümanlar')} />
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
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{invoice.customer}</Typography>
              <Typography variant="body2">Hall-Robbins PLC</Typography>
              <Typography variant="body2">7777 Mendez Plains</Typography>
              <Typography variant="body2">(616) 865-4180</Typography>
              <Typography variant="body2">don85@johnson.com</Typography>
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
                {invoice.paymentHistory.map((payment) => (
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
            <CloudUploadIcon sx={{ fontSize: 48, color: theme.palette.grey[600] }} />
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
                    <DeleteIcon />
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
                    <DescriptionIcon />
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
              <Typography><strong>{t('customer', 'Müşteri')}:</strong> {invoice.customer}</Typography>
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

export default SalesInvoiceDetailPage;
