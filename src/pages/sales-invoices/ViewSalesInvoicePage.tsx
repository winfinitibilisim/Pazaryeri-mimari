import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { ArrowBack, Edit, Print, Delete } from '@mui/icons-material';

// Mock data - gerçek uygulamada API'den gelecek
const mockInvoiceData = {
  '1': {
    invoiceNumber: 'SATIS-2024-001',
    customer: {
      name: 'Ahmet Yılmaz',
      address: '777 Menopomo Avenue, Santa Rosa, CA 95404',
      email: 'ahmet@example.com'
    },
    invoiceDate: '15.06.2024',
    dueDate: '15.07.2024',
    status: 'Ödendi',
    paymentMethod: 'Banka Kartı',
    subtotal: 2500.00,
    vat: 450.00,
    total: 2950.00,
    currency: 'TL',
    items: [
      {
        id: 1,
        description: 'Web Tasarım Hizmeti',
        quantity: 1,
        unitPrice: 2500.00,
        total: 2500.00
      }
    ],
    company: {
      name: 'WINFINITI',
      address: 'Office 101, Silicon Valley, CA 94000, USA',
      phone: '+1 (876) 543 2198',
      bankInfo: {
        name: 'United States Bank',
        iban: 'ET09476218074685',
        swift: 'RHBH1905'
      }
    }
  },
  '2': {
    invoiceNumber: 'SATIS-2024-002',
    customer: {
      name: 'Teknoloji A.Ş.',
      address: 'İstanbul Teknoloji Merkezi, Maslak',
      email: 'info@teknoloji.com'
    },
    invoiceDate: '20.05.2024',
    dueDate: '20.06.2024',
    status: 'Beklemede',
    paymentMethod: 'Havale',
    subtotal: 7000.00,
    vat: 1260.50,
    total: 8260.50,
    currency: 'TL',
    items: [
      {
        id: 1,
        description: 'Yazılım Geliştirme',
        quantity: 2,
        unitPrice: 3500.00,
        total: 7000.00
      }
    ],
    company: {
      name: 'WINFINITI',
      address: 'Office 101, Silicon Valley, CA 94000, USA',
      phone: '+1 (876) 543 2198',
      bankInfo: {
        name: 'United States Bank',
        iban: 'ET09476218074685',
        swift: 'RHBH1905'
      }
    }
  }
};

const ViewSalesInvoicePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const invoice = id ? mockInvoiceData[id as keyof typeof mockInvoiceData] : null;

  if (!invoice) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Fatura bulunamadı
        </Typography>
        <Button 
          onClick={() => navigate('/sales-invoices')}
          sx={{ mt: 2 }}
        >
          Geri Dön
        </Button>
      </Box>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ödendi': return 'success';
      case 'Beklemede': return 'warning';
      case 'İptal': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={() => navigate('/sales-invoices')}
          sx={{ mr: 2 }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Fatura #{invoice.invoiceNumber}
        </Typography>
        
        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => navigate(`/sales-invoices/edit/${id}`)}
            sx={{ borderRadius: '12px' }}
          >
            Düzenle
          </Button>
          <Button
            variant="outlined"
            startIcon={<Print />}
            sx={{ borderRadius: '12px' }}
          >
            Yazdır
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            sx={{ borderRadius: '12px' }}
          >
            Sil
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Sol Kolon - Fatura Bilgileri */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: '16px', mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              FATURA BİLGİLERİ
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Fatura Numarası
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {invoice.invoiceNumber}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Durum
                </Typography>
                <Chip 
                  label={invoice.status}
                  color={getStatusColor(invoice.status) as any}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Fatura Tarihi
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {invoice.invoiceDate}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Vade Tarihi
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {invoice.dueDate}
                </Typography>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />
            
            {/* Müşteri Bilgileri */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              MÜŞTERİ BİLGİLERİ
            </Typography>
            
            <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
              {invoice.customer.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {invoice.customer.address}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {invoice.customer.email}
            </Typography>
          </Paper>

          {/* Fatura Kalemleri */}
          <Paper sx={{ p: 3, borderRadius: '16px' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              FATURA KALEMLERİ
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Açıklama</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Miktar</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Birim Fiyat</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Toplam</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoice.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="right">{item.unitPrice.toFixed(2)} {invoice.currency}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {item.total.toFixed(2)} {invoice.currency}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Sağ Kolon - Ödeme Geçmişi ve Özet */}
        <Grid item xs={12} md={4}>
          {/* Ödeme Geçmişi */}
          <Paper sx={{ p: 3, borderRadius: '16px', mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              ÖDEME GEÇMİŞİ
            </Typography>
            
            <Box sx={{ 
              p: 2, 
              backgroundColor: '#f5f5f5', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <Typography variant="body2" color="text.secondary">
                Henüz ödeme yapılmamış
              </Typography>
            </Box>
          </Paper>

          {/* Dökümanlar */}
          <Paper sx={{ p: 3, borderRadius: '16px', mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              DÖKÜMANLAR
            </Typography>
            
            <Button
              variant="outlined"
              fullWidth
              sx={{ borderRadius: '8px', mb: 1 }}
            >
              PDF İndir
            </Button>
            <Button
              variant="outlined"
              fullWidth
              sx={{ borderRadius: '8px' }}
            >
              Excel İndir
            </Button>
          </Paper>

          {/* Fatura Özeti */}
          <Paper sx={{ p: 3, borderRadius: '16px' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              FATURA ÖZETİ
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Ara Toplam:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {invoice.subtotal.toFixed(2)} {invoice.currency}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">KDV:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {invoice.vat.toFixed(2)} {invoice.currency}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Toplam:
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {invoice.total.toFixed(2)} {invoice.currency}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewSalesInvoicePage;
