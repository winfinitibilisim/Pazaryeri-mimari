import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  IconButton,
} from '@mui/material';
import { Edit, Delete, Print, Send, Add, CloudUpload, GetApp, DeleteForever } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import AddPaymentModal from './AddPaymentModal';
import AddDocumentModal from './AddDocumentModal';
import SendInvoiceModal from './SendInvoiceModal';

// Örnek Veri
const invoiceData = {
  id: 'INV-2024-001',
  issueDate: '15.06.2024',
  dueDate: '15.07.2024',
  company: {
    name: 'WINFINITI',
    address: 'Office 101, Silicon Valley, CA 94000, USA',
    phone: '+1 (123) 456 7890, +44 (876) 543 2198',
  },
  billedTo: {
    name: 'Ahmet Yılmaz',
    company: 'Yılmaz Tech Ltd.',
    address: '777 Mendocino Avenue, Santa Rosa, CA 95404',
    email: 'contact@yilmaztech.com',
  },
  paymentDetails: {
    total: '3600.00 TL',
    bank: 'United States Bank',
    iban: 'ET09476213874685',
    swift: 'BRH91905',
  },
  items: [
    { id: 1, product: 'Web Tasarım Hizmeti', description: 'Web and Logo Design', hours: 40.0, quantity: 1, total: '2900.00 TL' },
    { id: 2, product: 'Logo Tasarımı', description: 'Web and Logo Design', hours: 20.0, quantity: 1, total: '1000.00 TL' },
  ],
  summary: {
    subtotal: '3900.00 TL',
    discount: '0.00 TL',
    tax: '600.00 TL',
    total: '3600.00 TL',
  },
  note: 'It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance projects. Thank You!',
};

const SalesInvoiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = React.useState(0);
  const [isPaymentModalOpen, setPaymentModalOpen] = React.useState(false);
  const [isDocumentModalOpen, setDocumentModalOpen] = React.useState(false);
  const [isSendModalOpen, setSendModalOpen] = React.useState(false);

  const handleOpenPaymentModal = () => setPaymentModalOpen(true);
  const handleClosePaymentModal = () => setPaymentModalOpen(false);

  const handleOpenDocumentModal = () => setDocumentModalOpen(true);
  const handleCloseDocumentModal = () => setDocumentModalOpen(false);

  const handleOpenSendModal = () => setSendModalOpen(true);
  const handleCloseSendModal = () => setSendModalOpen(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Paper sx={{ p: 3, m: 2, borderRadius: 2, boxShadow: 3 }}>
      {/* Başlık ve Butonlar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h1">
          Fatura #{id}
        </Typography>
        <Box>
          <Button variant="contained" startIcon={<Edit />} sx={{ mr: 1 }} onClick={() => navigate('/sales-invoices/new/edit')}>
            Düzenle
          </Button>
          <Button variant="outlined" color="error" startIcon={<Delete />} sx={{ mr: 1 }} onClick={() => { if(window.confirm('Bu faturayı silmek istediğinizden emin misiniz?')) { console.log('Fatura silindi.'); navigate('/sales-invoices'); } }}>
            Sil
          </Button>
          <Button variant="outlined" startIcon={<Print />} sx={{ mr: 1 }}>
            Yazdır
          </Button>
          <Button variant="outlined" startIcon={<Send />} onClick={handleOpenSendModal}>
            Fatura Gönder
          </Button>
        </Box>
      </Box>
      <Divider sx={{ mb: 2 }} />

      {/* Tablar */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="Fatura Bilgileri" />
          <Tab label="Ödeme Geçmişi" />
          <Tab label="Dökümanlar" />
        </Tabs>
      </Box>

      {/* Fatura İçeriği */}
      {tabIndex === 0 && (
        <Grid container spacing={3}>
          {/* Sol Taraf: Şirket ve Müşteri Bilgileri */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6">{invoiceData.company.name}</Typography>
            <Typography variant="body2" color="text.secondary">{invoiceData.company.address}</Typography>
            <Typography variant="body2" color="text.secondary">{invoiceData.company.phone}</Typography>
            <Box sx={{ my: 3 }}>
              <Typography variant="subtitle2" gutterBottom>Fatura Edilen:</Typography>
              <Typography variant="body1" fontWeight="bold">{invoiceData.billedTo.name}</Typography>
              <Typography variant="body2" color="text.secondary">{invoiceData.billedTo.company}</Typography>
              <Typography variant="body2" color="text.secondary">{invoiceData.billedTo.address}</Typography>
              <Typography variant="body2" color="text.secondary">{invoiceData.billedTo.email}</Typography>
            </Box>
          </Grid>

          {/* Sağ Taraf: Fatura Detayları */}
          <Grid item xs={12} md={6} sx={{ textAlign: { md: 'right' } }}>
            <Typography variant="subtitle2">Düzenleme Tarihi: {invoiceData.issueDate}</Typography>
            <Typography variant="subtitle2">Vade Tarihi: {invoiceData.dueDate}</Typography>
            <Box sx={{ my: 3 }}>
              <Typography variant="subtitle2" gutterBottom>Ödeme Detayları:</Typography>
              <Typography variant="body1">Toplam: <Box component="span" fontWeight="bold">{invoiceData.paymentDetails.total}</Box></Typography>
              <Typography variant="body2" color="text.secondary">Banka Adı: {invoiceData.paymentDetails.bank}</Typography>
              <Typography variant="body2" color="text.secondary">IBAN: {invoiceData.paymentDetails.iban}</Typography>
              <Typography variant="body2" color="text.secondary">SWIFT Kodu: {invoiceData.paymentDetails.swift}</Typography>
            </Box>
          </Grid>

          {/* Ürün/Hizmet Tablosu */}
          <Grid item xs={12}>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell>Ürün</TableCell>
                    <TableCell>Açıklama</TableCell>
                    <TableCell>Saat</TableCell>
                    <TableCell>Miktar</TableCell>
                    <TableCell align="right">Toplam</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoiceData.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.product}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.hours.toFixed(1)}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell align="right">{item.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Notlar ve Toplam */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>Not:</Typography>
            <Typography variant="body2" color="text.secondary">{invoiceData.note}</Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: { md: 'right' } }}>
             <Typography variant="body2">Ara Toplam: {invoiceData.summary.subtotal}</Typography>
             <Typography variant="body2">İndirim: {invoiceData.summary.discount}</Typography>
             <Typography variant="body2">Vergi: {invoiceData.summary.tax}</Typography>
             <Typography variant="h6" sx={{ mt: 1 }}>Toplam: {invoiceData.summary.total}</Typography>
          </Grid>
        </Grid>
      )}

      {/* Ödeme Geçmişi İçeriği */}
      {tabIndex === 1 && (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button variant="contained" onClick={handleOpenPaymentModal}>+ Yeni Ödeme Ekle</Button>
            </Box>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell>Tarih</TableCell>
                    <TableCell>Tutar</TableCell>
                    <TableCell>Ödeme Yöntemi</TableCell>
                    <TableCell>Not</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>15.06.2024</TableCell>
                    <TableCell>3600.00 TL</TableCell>
                    <TableCell>Banka Transferi</TableCell>
                    <TableCell>Fatura bedelinin tamamı ödendi.</TableCell>
                  </TableRow>
                  {/* Diğer ödeme satırları buraya eklenebilir */}
                </TableBody>
              </Table>
            </TableContainer>
        </Box>
      )}

      <AddPaymentModal open={isPaymentModalOpen} onClose={handleClosePaymentModal} />

      {/* Dökümanlar İçeriği */}
      {tabIndex === 2 && (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button variant="contained" startIcon={<CloudUpload />} onClick={handleOpenDocumentModal}>Yeni Döküman Ekle</Button>
            </Box>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell>Dosya Adı</TableCell>
                    <TableCell>Yükleme Tarihi</TableCell>
                    <TableCell align="right">İşlemler</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>fatura_detay.pdf</TableCell>
                    <TableCell>16.06.2024</TableCell>
                    <TableCell align="right">
                        <IconButton size="small" sx={{ mr: 1 }}><GetApp /></IconButton>
                        <IconButton size="small" color="error"><DeleteForever /></IconButton>
                    </TableCell>
                  </TableRow>
                   <TableRow>
                    <TableCell>sozlesme.docx</TableCell>
                    <TableCell>17.06.2024</TableCell>
                    <TableCell align="right">
                        <IconButton size="small" sx={{ mr: 1 }}><GetApp /></IconButton>
                        <IconButton size="small" color="error"><DeleteForever /></IconButton>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
        </Box>
      )}

      <AddDocumentModal open={isDocumentModalOpen} onClose={handleCloseDocumentModal} />

      <SendInvoiceModal 
        open={isSendModalOpen} 
        onClose={handleCloseSendModal} 
        invoiceId={id || ''} 
        customerEmail={invoiceData.billedTo.email}
      />

    </Paper>
  );
};

export default SalesInvoiceDetailPage;
