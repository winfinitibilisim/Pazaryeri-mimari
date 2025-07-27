import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  InputAdornment
} from '@mui/material';
import { Edit, Delete, Print, Send, CloudUpload, GetApp, DeleteOutline, Close, Payment, Email, AttachFile } from '@mui/icons-material';

// Mock data
const mockInvoiceData = {
  invoiceNumber: 'INV-2024-001',
  issueDate: '2024-06-15',
  dueDate: '2024-07-15',
  totalAmount: 3600.00,
  company: {
    name: 'WINFINITI',
    address: 'Office 149, 450 South Brand Brooklyn',
    city: 'San Diego County, CA 91905, USA',
    phone: '+1 (123) 456 7891, +44 (876) 543 2198'
  },
  customer: {
    name: 'Ahmet Yılmaz',
    company: 'Hal-Robbins PLC',
    address: '7777 Mendez Plains',
    phone: '(616) 865-4180',
    email: 'don85@johnson.com'
  },
  paymentInfo: {
    bankName: 'American Bank',
    country: 'United States',
    iban: 'ETD954782138714685',
    swift: 'RHB1905'
  },
  items: [
    {
      id: 1,
      name: 'Web Tasarım Hizmeti',
      description: 'Web and Logo Design',
      hours: 40.0,
      quantity: 1,
      total: 2000.00
    },
    {
      id: 2,
      name: 'Logo Tasarımı',
      description: 'Web and Logo Design',
      hours: 20.0,
      quantity: 1,
      total: 1000.00
    }
  ],
  summary: {
    subtotal: 3000.00,
    discount: 0.00,
    tax: 600.00,
    total: 3600.00
  },
  note: 'It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance projects. Thank You!'
};

interface Document {
  id: number;
  name: string;
  uploadDate: string;
  size?: string;
}

interface PaymentRecord {
  id: number;
  date: string;
  amount: number;
  method: string;
  note: string;
}

const ViewSalesInvoicePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [documents, setDocuments] = useState<Document[]>([
    { id: 1, name: 'fatura_detay.pdf', uploadDate: '16.06.2024', size: '2.5 MB' },
    { id: 2, name: 'sozlesme.docx', uploadDate: '17.06.2024', size: '1.2 MB' }
  ]);
  const [payments, setPayments] = useState<PaymentRecord[]>([
    { id: 1, date: '15.06.2024', amount: 3600.00, method: 'Banka Transferi', note: 'Fatura bedelinin tamamı ödendi.' }
  ]);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({
    amount: '',
    method: '',
    note: ''
  });
  const [sendInvoiceDialogOpen, setSendInvoiceDialogOpen] = useState(false);
  const [emailData, setEmailData] = useState({
    to: mockInvoiceData.customer.email || '',
    subject: `Fatura #${mockInvoiceData.invoiceNumber} - ${mockInvoiceData.company.name}`,
    message: `Merhaba ${mockInvoiceData.customer.name},\n\nEkte ${mockInvoiceData.invoiceNumber} numaralı faturanızı bulabilirsiniz.\n\nToplam tutar: ${mockInvoiceData.totalAmount.toFixed(2)} TL\nVade tarihi: ${mockInvoiceData.dueDate}\n\nTeşekkür ederiz.\n\n${mockInvoiceData.company.name}`,
    attachPdf: true,
    sendCopy: false
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const newDocument: Document = {
        id: documents.length + 1,
        name: file.name,
        uploadDate: new Date().toLocaleDateString('tr-TR'),
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB'
      };
      setDocuments([...documents, newDocument]);
      
      // Dosya input'unu temizle
      event.target.value = '';
      
      // Başarı mesajı (isteğe bağlı)
      console.log('Dosya başarıyla yüklendi:', file.name);
    }
  };

  const handleDocumentDelete = (documentId: number) => {
    setDocuments(documents.filter(doc => doc.id !== documentId));
    console.log('Dosya silindi:', documentId);
  };

  const handleDocumentDownload = (document: Document) => {
    // Gerçek uygulamada dosya indirme işlemi burada yapılır
    console.log('Dosya indiriliyor:', document.name);
    // Örnek: window.open(document.downloadUrl, '_blank');
  };

  const handleOpenPaymentDialog = () => {
    setPaymentDialogOpen(true);
  };

  const handleClosePaymentDialog = () => {
    setPaymentDialogOpen(false);
    setNewPayment({ amount: '', method: '', note: '' });
  };

  const handlePaymentSubmit = () => {
    if (newPayment.amount && newPayment.method) {
      const payment: PaymentRecord = {
        id: payments.length + 1,
        date: new Date().toLocaleDateString('tr-TR'),
        amount: parseFloat(newPayment.amount),
        method: newPayment.method,
        note: newPayment.note || 'Ödeme kaydı eklendi.'
      };
      setPayments([...payments, payment]);
      handleClosePaymentDialog();
      console.log('Yeni ödeme eklendi:', payment);
    }
  };

  const paymentMethods = [
    'Banka Transferi',
    'Kredi Kartı',
    'Nakit',
    'Çek',
    'Havale',
    'EFT',
    'Kripto Para'
  ];

  const handleOpenSendInvoiceDialog = () => {
    setSendInvoiceDialogOpen(true);
  };

  const handleCloseSendInvoiceDialog = () => {
    setSendInvoiceDialogOpen(false);
  };

  const handleSendInvoice = () => {
    // Gerçek uygulamada email gönderme API'si çağrılır
    console.log('Fatura gönderiliyor:', {
      to: emailData.to,
      subject: emailData.subject,
      message: emailData.message,
      attachPdf: emailData.attachPdf,
      sendCopy: emailData.sendCopy,
      invoiceNumber: mockInvoiceData.invoiceNumber
    });
    
    // Başarı mesajı göster (gerçek uygulamada toast/snackbar kullanılabilir)
    alert(`Fatura başarıyla ${emailData.to} adresine gönderildi!`);
    
    handleCloseSendInvoiceDialog();
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: 'white', 
        p: 3, 
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
          Satış Faturası Detayı
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<Edit />}
            sx={{ 
              bgcolor: '#ff9800', 
              '&:hover': { bgcolor: '#f57c00' },
              borderRadius: '6px',
              textTransform: 'none'
            }}
          >
            Düzenle
          </Button>
          <Button
            variant="contained"
            startIcon={<Delete />}
            sx={{ 
              bgcolor: '#f44336', 
              '&:hover': { bgcolor: '#d32f2f' },
              borderRadius: '6px',
              textTransform: 'none'
            }}
          >
            Sil
          </Button>
          <Button
            variant="contained"
            startIcon={<Print />}
            sx={{ 
              bgcolor: '#2196f3', 
              '&:hover': { bgcolor: '#1976d2' },
              borderRadius: '6px',
              textTransform: 'none'
            }}
          >
            Yazdır
          </Button>
          <Button
            variant="contained"
            startIcon={<Send />}
            onClick={handleOpenSendInvoiceDialog}
            sx={{ 
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              '&:hover': { 
                background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)'
              },
              borderRadius: '6px',
              textTransform: 'none',
              fontWeight: 'bold',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            Fatura Gönder
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e0e0' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{ 
            px: 3,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: '14px'
            },
            '& .Mui-selected': {
              color: '#1976d2 !important'
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#1976d2'
            }
          }}
        >
          <Tab label="FATURA BİLGİLERİ" />
          <Tab label="ÖDEME GEÇMİŞİ" />
          <Tab label="DÖKÜMANLAR" />
        </Tabs>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 4, borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          {/* Tab Content */}
          {tabValue === 0 && (
            <>
              {/* Company and Invoice Info */}
          <Grid container spacing={4} sx={{ mb: 4 }}>
            {/* Left - Company Info */}
            <Grid item xs={12} md={6}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>
                {mockInvoiceData.company.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {mockInvoiceData.company.address}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {mockInvoiceData.company.city}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {mockInvoiceData.company.phone}
              </Typography>
            </Grid>

            {/* Right - Invoice Info */}
            <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                Fatura #{mockInvoiceData.invoiceNumber}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" component="span">
                    Düzenleme Tarihi: 
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }} component="span">
                    {mockInvoiceData.issueDate}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" component="span">
                    Vade Tarihi: 
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }} component="span">
                    {mockInvoiceData.dueDate}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Customer and Payment Info */}
          <Grid container spacing={4} sx={{ mb: 4 }}>
            {/* Left - Customer Info */}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Fatura Edilen:
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                {mockInvoiceData.customer.name}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {mockInvoiceData.customer.company}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {mockInvoiceData.customer.address}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {mockInvoiceData.customer.phone}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {mockInvoiceData.customer.email}
              </Typography>
            </Grid>

            {/* Right - Payment Info */}
            <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Ödenecek Toplam:
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                {mockInvoiceData.totalAmount.toFixed(2)} TL
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" component="span">
                    Banka Adı: 
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }} component="span">
                    {mockInvoiceData.paymentInfo.bankName}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" component="span">
                    Ülke: 
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }} component="span">
                    {mockInvoiceData.paymentInfo.country}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" component="span">
                    IBAN: 
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }} component="span">
                    {mockInvoiceData.paymentInfo.iban}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" component="span">
                    SWIFT Kodu: 
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }} component="span">
                    {mockInvoiceData.paymentInfo.swift}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Items Table */}
          <TableContainer sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Ürün</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Açıklama</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 2, textAlign: 'center' }}>Saat</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 2, textAlign: 'center' }}>Miktar</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 2, textAlign: 'right' }}>Toplam</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockInvoiceData.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell sx={{ py: 2 }}>{item.name}</TableCell>
                    <TableCell sx={{ py: 2 }}>{item.description}</TableCell>
                    <TableCell sx={{ py: 2, textAlign: 'center' }}>{item.hours}</TableCell>
                    <TableCell sx={{ py: 2, textAlign: 'center' }}>{item.quantity}</TableCell>
                    <TableCell sx={{ py: 2, textAlign: 'right', fontWeight: 'bold' }}>
                      {item.total.toFixed(2)} TL
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Summary */}
          <Grid container>
            <Grid item xs={12} md={6}>
              {/* Note */}
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                Note:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {mockInvoiceData.note}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Box sx={{ minWidth: 200 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Ara Toplam</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {mockInvoiceData.summary.subtotal.toFixed(2)} TL
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">İndirim</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {mockInvoiceData.summary.discount.toFixed(2)} TL
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2">Vergi</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {mockInvoiceData.summary.tax.toFixed(2)} TL
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Toplam</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {mockInvoiceData.summary.total.toFixed(2)} TL
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Footer */}
          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e0e0e0', textAlign: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
              Winfiniti
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">📧</Typography>
              <Typography variant="body2" color="text.secondary">🌐</Typography>
              <Typography variant="body2" color="text.secondary">📱</Typography>
            </Box>
          </Box>
            </>
          )}

          {/* Payment History Tab */}
          {tabValue === 1 && (
            <Box>
              {/* Header with Add Payment Button */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<Payment />}
                  onClick={handleOpenPaymentDialog}
                  sx={{ 
                    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                    '&:hover': { 
                      background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(25, 118, 210, 0.4)'
                    },
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    px: 3,
                    py: 1.5,
                    boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '& .MuiButton-startIcon': {
                      marginRight: '8px',
                      fontSize: '18px'
                    }
                  }}
                >
                  Yeni Ödeme Ekle
                </Button>
              </Box>

              {/* Payment History Table */}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Tarih</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Tutar</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Ödeme Yöntemi</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Not</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell sx={{ py: 2 }}>{payment.date}</TableCell>
                        <TableCell sx={{ py: 2, fontWeight: 'bold', color: '#1976d2' }}>
                          {payment.amount.toFixed(2)} TL
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>{payment.method}</TableCell>
                        <TableCell sx={{ py: 2 }}>{payment.note}</TableCell>
                      </TableRow>
                    ))}
                    {payments.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} sx={{ py: 4, textAlign: 'center' }}>
                          <Typography variant="body2" color="text.secondary">
                            Henüz ödeme kaydı bulunmuyor.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Documents Tab */}
          {tabValue === 2 && (
            <Box>
              {/* Header with Upload Button */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <input
                  type="file"
                  id="file-upload"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                  multiple={false}
                />
                <label htmlFor="file-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<CloudUpload />}
                    sx={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': { 
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
                      },
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      px: 3,
                      py: 1.5,
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      '& .MuiButton-startIcon': {
                        marginRight: '8px',
                        fontSize: '20px'
                      }
                    }}
                  >
                    Yeni Döküman Ekle
                  </Button>
                </label>
              </Box>

              {/* Documents Table */}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Dosya Adı</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Yükleme Tarihi</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', py: 2, textAlign: 'center' }}>İşlemler</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {documents.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell sx={{ py: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {document.name}
                            </Typography>
                            {document.size && (
                              <Typography variant="caption" color="text.secondary">
                                ({document.size})
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>{document.uploadDate}</TableCell>
                        <TableCell sx={{ py: 2, textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                            <Button
                              size="small"
                              startIcon={<GetApp />}
                              onClick={() => handleDocumentDownload(document)}
                              sx={{ 
                                minWidth: 'auto',
                                color: '#1976d2',
                                '&:hover': { bgcolor: '#e3f2fd' },
                                borderRadius: '8px',
                                px: 1
                              }}
                              title="Dosyayı İndir"
                            />
                            <Button
                              size="small"
                              startIcon={<DeleteOutline />}
                              onClick={() => handleDocumentDelete(document.id)}
                              sx={{ 
                                minWidth: 'auto',
                                color: '#f44336',
                                '&:hover': { bgcolor: '#ffebee' },
                                borderRadius: '8px',
                                px: 1
                              }}
                              title="Dosyayı Sil"
                            />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                    {documents.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} sx={{ py: 4, textAlign: 'center' }}>
                          <Typography variant="body2" color="text.secondary">
                            Henüz döküman yüklenmemiş.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Paper>

        {/* Payment Dialog */}
        <Dialog 
          open={paymentDialogOpen} 
          onClose={handleClosePaymentDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }
          }}
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: '16px 16px 0 0'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Payment />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Yeni Ödeme Ekle
              </Typography>
            </Box>
            <Button
              onClick={handleClosePaymentDialog}
              sx={{ 
                color: 'white',
                minWidth: 'auto',
                p: 0.5,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <Close />
            </Button>
          </DialogTitle>
          
          <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ödeme Tutarı"
                  type="number"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">TL</InputAdornment>,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px'
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Ödeme Yöntemi</InputLabel>
                  <Select
                    value={newPayment.method}
                    label="Ödeme Yöntemi"
                    onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
                    sx={{
                      borderRadius: '12px'
                    }}
                  >
                    {paymentMethods.map((method) => (
                      <MenuItem key={method} value={method}>
                        {method}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Not (İsteğe bağlı)"
                  multiline
                  rows={3}
                  value={newPayment.note}
                  onChange={(e) => setNewPayment({ ...newPayment, note: e.target.value })}
                  placeholder="Ödeme ile ilgili açıklama yazabilirsiniz..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px'
                    }
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={handleClosePaymentDialog}
              variant="outlined"
              sx={{ 
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 'bold',
                borderColor: '#e0e0e0',
                color: '#666'
              }}
            >
              İptal
            </Button>
            <Button
              onClick={handlePaymentSubmit}
              variant="contained"
              disabled={!newPayment.amount || !newPayment.method}
              sx={{ 
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                '&:hover': { 
                  background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)'
                },
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 'bold',
                px: 3
              }}
            >
              Ödeme Ekle
            </Button>
          </DialogActions>
        </Dialog>

        {/* Send Invoice Dialog */}
        <Dialog 
          open={sendInvoiceDialogOpen} 
          onClose={handleCloseSendInvoiceDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }
          }}
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: '16px 16px 0 0'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Email />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Fatura Gönder
              </Typography>
            </Box>
            <Button
              onClick={handleCloseSendInvoiceDialog}
              sx={{ 
                color: 'white',
                minWidth: 'auto',
                p: 0.5,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <Close />
            </Button>
          </DialogTitle>
          
          <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Alıcı Email"
                  type="email"
                  value={emailData.to}
                  onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px'
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Konu"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px'
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mesaj"
                  multiline
                  rows={6}
                  value={emailData.message}
                  onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px'
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    p: 2,
                    bgcolor: '#f5f5f5',
                    borderRadius: '12px'
                  }}>
                    <AttachFile sx={{ color: '#1976d2' }} />
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      Fatura PDF'i otomatik olarak eklenecek
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant={emailData.attachPdf ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setEmailData({ ...emailData, attachPdf: !emailData.attachPdf })}
                      sx={{ 
                        borderRadius: '8px',
                        textTransform: 'none',
                        ...(emailData.attachPdf && {
                          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
                        })
                      }}
                    >
                      PDF Ekle
                    </Button>
                    
                    <Button
                      variant={emailData.sendCopy ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setEmailData({ ...emailData, sendCopy: !emailData.sendCopy })}
                      sx={{ 
                        borderRadius: '8px',
                        textTransform: 'none',
                        ...(emailData.sendCopy && {
                          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
                        })
                      }}
                    >
                      Bana Kopya Gönder
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={handleCloseSendInvoiceDialog}
              variant="outlined"
              sx={{ 
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 'bold',
                borderColor: '#e0e0e0',
                color: '#666'
              }}
            >
              İptal
            </Button>
            <Button
              onClick={handleSendInvoice}
              variant="contained"
              disabled={!emailData.to || !emailData.subject}
              startIcon={<Send />}
              sx={{ 
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                '&:hover': { 
                  background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)'
                },
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 'bold',
                px: 3
              }}
            >
              Faturayı Gönder
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ViewSalesInvoicePage;
