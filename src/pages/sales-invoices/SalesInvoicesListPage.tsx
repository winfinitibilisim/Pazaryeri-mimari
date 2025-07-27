import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip, 
  IconButton, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Add, Visibility, FilterList, Search, Close, CalendarToday, AccessTime, FileDownload } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import tr from 'date-fns/locale/tr';
import { useNavigate } from 'react-router-dom';

// Örnek Fatura Verileri
const invoices = [
  {
    id: '1',
    invoiceNumber: 'SATIS-2024-001',
    supplier: 'Ahmet Yılmaz',
    date: '15.06.2024',
    vat: '450.00 TL',
    total: '2950.00 TL',
    status: 'Ödendi',
  },
  {
    id: '2',
    invoiceNumber: 'SATIS-2024-002',
    supplier: 'Teknoloji A.Ş.',
    date: '20.05.2024',
    vat: '1260.50 TL',
    total: '8260.50 TL',
    status: 'Ödenmedi',
  },
  {
    id: '3',
    invoiceNumber: 'SATIS-2024-003',
    supplier: 'Ayşe Kaya',
    date: '18.05.2024',
    vat: '890.25 TL',
    total: '5840.25 TL',
    status: 'Kısmi Ödendi',
  },
  {
    id: '4',
    invoiceNumber: 'SATIS-2024-004',
    supplier: 'Mehmet Demir A.Ş.',
    date: '12.05.2024',
    vat: '720.00 TL',
    total: '4720.00 TL',
    status: 'Ödendi',
  },
  {
    id: '5',
    invoiceNumber: 'SATIS-2024-005',
    supplier: 'Fatma Özkan Ltd.',
    date: '08.05.2024',
    vat: '1580.75 TL',
    total: '10380.75 TL',
    status: 'Beklemede',
  },
];

// Durum etiketleri için renk belirleme
function getStatusChipColor(status: string) {
  switch (status) {
    case 'Ödendi':
      return { backgroundColor: '#d4edda', color: '#155724' };
    case 'Ödenmedi':
      return { backgroundColor: '#f8d7da', color: '#721c24' };
    case 'Kısmi Ödendi':
      return { backgroundColor: '#fff3cd', color: '#856404' };
    case 'Beklemede':
      return { backgroundColor: '#cce7ff', color: '#004085' };
    default:
      return { backgroundColor: '#e2e3e5', color: '#383d41' };
  }
}

const SalesInvoicesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [createInvoiceDialogOpen, setCreateInvoiceDialogOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '',
    customerName: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    invoiceTime: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    dueDate: new Date().toISOString().split('T')[0]
  });
  const [dueDateOption, setDueDateOption] = useState('Aynı gün');

  // Excel export function
  const exportToExcel = () => {
    // Filtered data
    const filteredInvoices = invoices.filter(invoice => 
      (searchTerm === '' || 
       invoice.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
       invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === '' || invoice.status === statusFilter)
    );

    // Create detailed CSV content with additional columns
    const headers = [
      'Sıra No',
      'Fatura Numarası', 
      'Müşteri Adı', 
      'Fatura Tarihi', 
      'KDV Tutarı', 
      'Toplam Tutar', 
      'Durum',
      'Rapor Tarihi',
      'Rapor Saati',
      'Toplam Kayıt Sayısı'
    ];
    
    const currentDate = new Date();
    const reportDate = currentDate.toLocaleDateString('tr-TR');
    const reportTime = currentDate.toLocaleTimeString('tr-TR');
    const totalRecords = filteredInvoices.length;
    
    const csvContent = [
      // Header row
      headers.join(','),
      // Data rows
      ...filteredInvoices.map((invoice, index) => [
        index + 1, // Sıra No
        `"${invoice.invoiceNumber}"`,
        `"${invoice.supplier}"`,
        `"${invoice.date}"`,
        `"${invoice.vat}"`,
        `"${invoice.total}"`,
        `"${invoice.status}"`,
        index === 0 ? `"${reportDate}"` : '""', // Sadece ilk satırda göster
        index === 0 ? `"${reportTime}"` : '""', // Sadece ilk satırda göster
        index === 0 ? totalRecords : '""' // Sadece ilk satırda göster
      ].join(',')),
      // Summary row
      '',
      '"=== ÖZET BİLGİLER ==="',
      '',
      `"Toplam Fatura Sayısı: ${totalRecords}"`,
      `"Rapor Tarihi: ${reportDate}"`,
      `"Rapor Saati: ${reportTime}"`,
      `"Durum Dağılımı:"`,
      ...getStatusSummary(filteredInvoices)
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `satis-faturalari-detay-raporu-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Success message
    console.log(`Excel raporu başarıyla indirildi: ${totalRecords} kayıt`);
  };
  
  // Status summary helper function
  const getStatusSummary = (invoices: any[]) => {
    const statusCounts = invoices.reduce((acc, invoice) => {
      acc[invoice.status] = (acc[invoice.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(statusCounts).map(([status, count]) => 
      `"${status}: ${count} adet"`
    );
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Başlık ve Butonlar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
          Satış Faturaları
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button 
            variant="outlined"
            startIcon={<FileDownload />} 
            onClick={exportToExcel}
            sx={{ 
              borderRadius: '20px', 
              px: 3,
              borderColor: '#25638f',
              color: '#25638f',
              '&:hover': {
                borderColor: '#1e4f73',
                backgroundColor: 'rgba(37, 99, 143, 0.1)'
              }
            }}
          >
            Excel İndir
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<Add />} 
            onClick={() => setCreateInvoiceDialogOpen(true)}
            sx={{ 
              borderRadius: '20px', 
              px: 3,
              backgroundColor: '#25638f',
              '&:hover': {
                backgroundColor: '#1e4f73'
              }
            }}
          >
            Yeni Satış Faturası
          </Button>
        </Box>
      </Box>

      {/* Filtreler */}
      <Accordion sx={{ mb: 3, borderRadius: '12px', '&:before': { display: 'none' } }}>
        <AccordionSummary 
          expandIcon={<FilterList />}
          sx={{ 
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            '&.Mui-expanded': {
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0
            }
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#495057' }}>
            🔍 Gelişmiş Arama ve Filtreler
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ backgroundColor: '#ffffff', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Müşteri veya Fatura No Ara"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Ödeme Durumu</InputLabel>
                <Select
                  value={statusFilter}
                  label="Ödeme Durumu"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{
                    borderRadius: '12px'
                  }}
                >
                  <MenuItem value="">Tümü</MenuItem>
                  <MenuItem value="Ödendi">✅ Ödendi</MenuItem>
                  <MenuItem value="Ödenmedi">❌ Ödenmedi</MenuItem>
                  <MenuItem value="Kısmi Ödendi">⚠️ Kısmi Ödendi</MenuItem>
                  <MenuItem value="Beklemede">⏳ Beklemede</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
                <DatePicker
                  label="Tarih Filtresi"
                  value={dateFilter}
                  onChange={(newValue) => setDateFilter(newValue)}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      fullWidth 
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px'
                        }
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Fatura Tablosu */}
      <Paper sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#25638f' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>Fatura No</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>Müşteri</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>Tarih</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>KDV</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>Toplam</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>Durum</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '16px', textAlign: 'center' }}>İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices
                .filter(invoice => 
                  (searchTerm === '' || 
                   invoice.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())) &&
                  (statusFilter === '' || invoice.status === statusFilter)
                )
                .map((invoice) => (
                  <TableRow 
                    key={invoice.id} 
                    sx={{ 
                      '&:nth-of-type(odd)': { backgroundColor: '#f8f9fa' },
                      '&:hover': { backgroundColor: '#e3f2fd', cursor: 'pointer' },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <TableCell sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell sx={{ color: '#495057' }}>
                      {invoice.supplier}
                    </TableCell>
                    <TableCell sx={{ color: '#6c757d' }}>
                      {invoice.date}
                    </TableCell>
                    <TableCell sx={{ color: '#28a745', fontWeight: 'bold' }}>
                      {invoice.vat}
                    </TableCell>
                    <TableCell sx={{ color: '#007bff', fontWeight: 'bold', fontSize: '16px' }}>
                      {invoice.total}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={invoice.status} 
                        sx={{
                          ...getStatusChipColor(invoice.status),
                          fontWeight: 'bold',
                          borderRadius: '16px'
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <IconButton 
                        onClick={() => navigate(`/sales-invoices/view/${invoice.id}`)} 
                        size="small"
                        sx={{
                          backgroundColor: '#e3f2fd',
                          color: '#1976d2',
                          '&:hover': {
                            backgroundColor: '#bbdefb',
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create Invoice Dialog */}
      <Dialog 
        open={createInvoiceDialogOpen} 
        onClose={() => setCreateInvoiceDialogOpen(false)}
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 2
        }}>
          <Box component="span" sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
            Yeni Fatura Oluştur
          </Box>
          <Button
            onClick={() => setCreateInvoiceDialogOpen(false)}
            sx={{ 
              minWidth: 'auto',
              p: 0.5,
              color: '#666',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.1)' }
            }}
          >
            <Close />
          </Button>
        </DialogTitle>
        
        <Typography variant="body2" sx={{ px: 3, pb: 2, color: '#666' }}>
          Fatura bilgilerini girin.
        </Typography>
        
        <DialogContent sx={{ px: 3, py: 0 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Fatura Numarası"
                placeholder="Fatura Numarası"
                value={invoiceData.invoiceNumber}
                onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
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
                label="Müşteri Adı"
                placeholder="Müşteri Adı"
                value={invoiceData.customerName}
                onChange={(e) => setInvoiceData({ ...invoiceData, customerName: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px'
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Fatura Tarihi"
                type="date"
                value={invoiceData.invoiceDate}
                onChange={(e) => setInvoiceData({ ...invoiceData, invoiceDate: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday sx={{ color: '#666' }} />
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px'
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Fatura Saati"
                type="time"
                value={invoiceData.invoiceTime}
                onChange={(e) => setInvoiceData({ ...invoiceData, invoiceTime: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTime sx={{ color: '#666' }} />
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px'
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                Vade Tarihi
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                {['Aynı gün', '7 Gün', '30 Gün', '60 Gün', '90 Gün'].map((option) => (
                  <Button
                    key={option}
                    variant={dueDateOption === option ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => {
                      setDueDateOption(option);
                      const today = new Date();
                      let newDate = new Date(today);
                      
                      switch(option) {
                        case '7 Gün':
                          newDate.setDate(today.getDate() + 7);
                          break;
                        case '30 Gün':
                          newDate.setDate(today.getDate() + 30);
                          break;
                        case '60 Gün':
                          newDate.setDate(today.getDate() + 60);
                          break;
                        case '90 Gün':
                          newDate.setDate(today.getDate() + 90);
                          break;
                        default:
                          newDate = today;
                      }
                      
                      setInvoiceData({ 
                        ...invoiceData, 
                        dueDate: newDate.toISOString().split('T')[0] 
                      });
                    }}
                    sx={{ 
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontSize: '12px',
                      px: 2,
                      py: 0.5,
                      ...(dueDateOption === option && {
                        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
                      })
                    }}
                  >
                    {option}
                  </Button>
                ))}
              </Box>
              
              <TextField
                fullWidth
                type="date"
                value={invoiceData.dueDate}
                onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday sx={{ color: '#666' }} />
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px'
                  }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={() => setCreateInvoiceDialogOpen(false)}
            variant="outlined"
            sx={{ 
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 'bold',
              borderColor: '#e0e0e0',
              color: '#666',
              px: 3
            }}
          >
            İptal
          </Button>
          <Button
            onClick={() => {
              // Fatura oluşturma sayfasına yönlendir ve verileri state olarak gönder
              navigate('/sales-invoices/create', { 
                state: { 
                  initialData: invoiceData 
                } 
              });
              setCreateInvoiceDialogOpen(false);
            }}
            variant="contained"
            disabled={!invoiceData.invoiceNumber || !invoiceData.customerName}
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
            Devam Et
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SalesInvoicesListPage;
