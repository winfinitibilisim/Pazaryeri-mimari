import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Divider,
} from '@mui/material';
import {
  Search,
  FilterList,
  ExpandMore,
  LocalShipping,
  Inventory,
  Scale,
  Numbers,
  FileDownload,
  Print,
  QrCode,
  Close,
  CheckCircle,
  Schedule,
  Person,
  Business,
  LocationOn,
  Phone,
  Email,
  Visibility,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface PackageData {
  id: number;
  fisNo: number;
  seferNo: number | string;
  sevkDurumu: string;
  kapNo: number;
  barkod: string;
  urunAdi: string;
  adet: number;
  kilo: number;
  hacim: number;
  fiyat: string;
  tarih: string;
  gonderenAdi: string;
  teslimAlanSube: string;
}

const allPackagesData: PackageData[] = [
  // Fiş No 27 - Gönderildi
  { id: 1, fisNo: 27, seferNo: 28, sevkDurumu: 'Gönderildi', kapNo: 163, barkod: '334HN33464H533', urunAdi: 'Elektronik Ürün', adet: 3, kilo: 12, hacim: 1, fiyat: '$12.50', tarih: '12/04/2025 8:45', gonderenAdi: 'ABC Elektronik Ltd.', teslimAlanSube: 'Ankara Merkez Şube' },
  // Fiş No 27 - Teslim Edildi
  { id: 2, fisNo: 27, seferNo: 28, sevkDurumu: 'Teslim Edildi', kapNo: 164, barkod: '334HN33464H533', urunAdi: 'Tekstil Ürünü', adet: 5, kilo: 15, hacim: 2, fiyat: '$25.00', tarih: '12/04/2025 7:15', gonderenAdi: 'XYZ Tekstil A.Ş.', teslimAlanSube: 'İstanbul Anadolu Şube' },
  // Fiş No 27 - Bekleyen (8 adet)
  { id: 3, fisNo: 27, seferNo: '-', sevkDurumu: 'Bekleyen', kapNo: 153, barkod: '813348314730303', urunAdi: 'Gıda Ürünü', adet: 8, kilo: 16, hacim: 0, fiyat: '$15.00', tarih: '12/04/2025 9:33', gonderenAdi: 'Gıda Market A.Ş.', teslimAlanSube: 'Bursa Merkez Şube' },
  { id: 4, fisNo: 27, seferNo: '-', sevkDurumu: 'Bekleyen', kapNo: 154, barkod: '813348314730304', urunAdi: 'Kozmetik Ürün', adet: 9, kilo: 18, hacim: 1, fiyat: '$20.00', tarih: '12/04/2025 10:34', gonderenAdi: 'Güzellik Dünyası Ltd.', teslimAlanSube: 'Antalya Şube' },
  { id: 5, fisNo: 27, seferNo: '-', sevkDurumu: 'Bekleyen', kapNo: 155, barkod: '813348314731305', urunAdi: 'Ev Eşyası', adet: 10, kilo: 20, hacim: 2, fiyat: '$25.00', tarih: '12/04/2025 11:35', gonderenAdi: 'Ev Dekorasyon A.Ş.', teslimAlanSube: 'İzmir Konak Şube' },
  { id: 6, fisNo: 27, seferNo: '-', sevkDurumu: 'Bekleyen', kapNo: 156, barkod: '813348314731306', urunAdi: 'Kırtasiye', adet: 11, kilo: 22, hacim: 0, fiyat: '$30.00', tarih: '12/04/2025 12:36', gonderenAdi: 'Ofis Malzemeleri Ltd.', teslimAlanSube: 'Adana Şube' },
  { id: 7, fisNo: 27, seferNo: '-', sevkDurumu: 'Bekleyen', kapNo: 157, barkod: '813348314731307', urunAdi: 'Oyuncak', adet: 12, kilo: 24, hacim: 1, fiyat: '$35.00', tarih: '12/04/2025 13:37', gonderenAdi: 'Çocuk Dünyası A.Ş.', teslimAlanSube: 'Gaziantep Şube' },
  { id: 8, fisNo: 27, seferNo: '-', sevkDurumu: 'Bekleyen', kapNo: 158, barkod: '813348314731308', urunAdi: 'Spor Malzemesi', adet: 13, kilo: 26, hacim: 2, fiyat: '$40.00', tarih: '12/04/2025 14:38', gonderenAdi: 'Spor Ekipmanları Ltd.', teslimAlanSube: 'Konya Şube' },
  { id: 9, fisNo: 27, seferNo: '-', sevkDurumu: 'Bekleyen', kapNo: 159, barkod: '813348314731309', urunAdi: 'Kitap', adet: 14, kilo: 28, hacim: 0, fiyat: '$45.00', tarih: '12/04/2025 15:39', gonderenAdi: 'Kitap Evi Yayınları', teslimAlanSube: 'Kayseri Şube' },
  { id: 10, fisNo: 27, seferNo: '-', sevkDurumu: 'Bekleyen', kapNo: 160, barkod: '813348314731310', urunAdi: 'Müzik Aleti', adet: 15, kilo: 30, hacim: 1, fiyat: '$50.00', tarih: '12/04/2025 16:40', gonderenAdi: 'Müzik Dünyası A.Ş.', teslimAlanSube: 'Samsun Şube' },
  
  // Fiş No 26 - Bekleyen (5 adet)
  { id: 11, fisNo: 26, seferNo: '-', sevkDurumu: 'Bekleyen', kapNo: 153, barkod: '813348314730303', urunAdi: 'Baharat', adet: 8, kilo: 16, hacim: 0, fiyat: '$15.00', tarih: '12/04/2025 9:33', gonderenAdi: 'Baharat Ticaret Ltd.', teslimAlanSube: 'Trabzon Şube' },
  { id: 12, fisNo: 26, seferNo: '-', sevkDurumu: 'Bekleyen', kapNo: 154, barkod: '813348314730304', urunAdi: 'Çay', adet: 9, kilo: 18, hacim: 1, fiyat: '$20.00', tarih: '12/04/2025 10:34', gonderenAdi: 'Rize Çay A.Ş.', teslimAlanSube: 'Erzurum Şube' },
  { id: 13, fisNo: 26, seferNo: '-', sevkDurumu: 'Bekleyen', kapNo: 155, barkod: '813348314731305', urunAdi: 'Kahve', adet: 10, kilo: 20, hacim: 2, fiyat: '$25.00', tarih: '12/04/2025 11:35', gonderenAdi: 'Kahve Dünyası Ltd.', teslimAlanSube: 'Malatya Şube' },
  { id: 14, fisNo: 26, seferNo: '-', sevkDurumu: 'Bekleyen', kapNo: 156, barkod: '813348314731306', urunAdi: 'Şeker', adet: 11, kilo: 22, hacim: 0, fiyat: '$30.00', tarih: '12/04/2025 12:36', gonderenAdi: 'Pancar Şeker A.Ş.', teslimAlanSube: 'Elazığ Şube' },
  { id: 15, fisNo: 26, seferNo: '-', sevkDurumu: 'Bekleyen', kapNo: 157, barkod: '813348314731307', urunAdi: 'Un', adet: 12, kilo: 24, hacim: 1, fiyat: '$35.00', tarih: '12/04/2025 13:37', gonderenAdi: 'Buğday Un A.Ş.', teslimAlanSube: 'Diyarbakır Şube' },
  
  // Fiş No 25 - Bekleyen (3 adet)
  { id: 16, fisNo: 25, seferNo: '-', sevkDurumu: 'Bekleyen', kapNo: 158, barkod: '813348314731308', urunAdi: 'Deterjan', adet: 13, kilo: 26, hacim: 2, fiyat: '$40.00', tarih: '12/04/2025 14:38', gonderenAdi: 'Temizlik Ürünleri A.Ş.', teslimAlanSube: 'Van Şube' },
  { id: 17, fisNo: 25, seferNo: '-', sevkDurumu: 'Bekleyen', kapNo: 159, barkod: '813348314731309', urunAdi: 'Sabun', adet: 14, kilo: 28, hacim: 0, fiyat: '$45.00', tarih: '12/04/2025 15:39', gonderenAdi: 'Hijyen Kozmetik Ltd.', teslimAlanSube: 'Bitlis Şube' },
  { id: 18, fisNo: 25, seferNo: '-', sevkDurumu: 'Bekleyen', kapNo: 160, barkod: '813348314731310', urunAdi: 'Şampüan', adet: 15, kilo: 30, hacim: 1, fiyat: '$50.00', tarih: '12/04/2025 16:40', gonderenAdi: 'Saç Bakım Ürünleri A.Ş.', teslimAlanSube: 'Muş Şube' },
];

const AllPackagesPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tümü');
  const [fisNoFilter, setFisNoFilter] = useState('Tümü');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(null);

  // Filtreleme fonksiyonu
  const filteredPackages = allPackagesData.filter(pkg => {
    const matchesSearch = searchText === '' || 
      pkg.barkod.toLowerCase().includes(searchText.toLowerCase()) ||
      pkg.sevkDurumu.toLowerCase().includes(searchText.toLowerCase()) ||
      pkg.fisNo.toString().includes(searchText);
    
    const matchesStatus = statusFilter === 'Tümü' || pkg.sevkDurumu === statusFilter;
    const matchesFisNo = fisNoFilter === 'Tümü' || pkg.fisNo.toString() === fisNoFilter;
    
    return matchesSearch && matchesStatus && matchesFisNo;
  });

  // İstatistikler
  const totalPackages = filteredPackages.length;
  const totalWeight = filteredPackages.reduce((sum, pkg) => sum + pkg.kilo, 0);
  const totalItems = filteredPackages.reduce((sum, pkg) => sum + pkg.adet, 0);
  const pendingPackages = filteredPackages.filter(pkg => pkg.sevkDurumu === 'Bekleyen').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Gönderildi':
        return { backgroundColor: '#e8f5e8', color: '#2e7d32' };
      case 'Teslim Edildi':
        return { backgroundColor: '#e3f2fd', color: '#1976d2' };
      case 'Bekleyen':
        return { backgroundColor: '#ffebee', color: '#d32f2f' };
      default:
        return { backgroundColor: '#f5f5f5', color: '#666' };
    }
  };

  const handleExport = () => {
    const currentDate = new Date().toLocaleDateString('tr-TR');
    const currentTime = new Date().toLocaleTimeString('tr-TR');
    
    // Toplamları hesapla
    const totalFiyat = filteredPackages.reduce((sum, pkg) => {
      const fiyat = parseFloat(pkg.fiyat.replace('$', '')) || 0;
      return sum + fiyat;
    }, 0);
    
    const csvContent = [
      // Rapor Başlığı
      ['TÜM PAKETLER RAPORU'],
      [''],
      ['Rapor Tarihi:', `${currentDate} ${currentTime}`],
      [''],
      
      // Tablo Başlıkları
      ['Fiş No', 'Sefer No', 'Sevk Durumu', 'Kap No', 'Barkod', 'Ürün Adı', 'Adet', 'Kilo', 'Hacim', 'Fiyat', 'Tarih', 'Gönderen', 'Teslim Alan Şube'],
      
      // Paket verileri
      ...filteredPackages.map(pkg => [
        pkg.fisNo.toString(),
        pkg.seferNo.toString(),
        pkg.sevkDurumu,
        pkg.kapNo.toString(),
        pkg.barkod,
        pkg.urunAdi,
        pkg.adet.toString(),
        pkg.kilo.toString(),
        pkg.hacim.toString(),
        pkg.fiyat,
        pkg.tarih,
        pkg.gonderenAdi,
        pkg.teslimAlanSube
      ]),
      
      // Boş satır
      [''],
      
      // Toplamlar
      ['TOPLAMLAR'],
      ['Toplam Paket:', totalPackages.toString()],
      ['Toplam Kilo:', `${totalWeight} kg`],
      ['Toplam Adet:', totalItems.toString()],
      ['Toplam Fiyat:', `$${totalFiyat.toFixed(2)}`],
      [''],
      
      // Duruma göre dağılım
      ['DURUM DAĞILIMI'],
      ['Bekleyen Paket:', pendingPackages.toString()],
      ['Gönderilen Paket:', filteredPackages.filter(pkg => pkg.sevkDurumu === 'Gönderildi').length.toString()],
      ['Teslim Edilen Paket:', filteredPackages.filter(pkg => pkg.sevkDurumu === 'Teslim Edildi').length.toString()],
      [''],
      
      // Fiş No bazında toplamlar
      ['FİŞ NO BAZINDA TOPLAMLAR'],
      ['Fiş No', 'Paket Sayısı', 'Toplam Kilo', 'Toplam Adet', 'Toplam Fiyat'],
      
      // Fiş 27 toplamı
      [
        '27',
        filteredPackages.filter(pkg => pkg.fisNo === 27).length.toString(),
        filteredPackages.filter(pkg => pkg.fisNo === 27).reduce((sum, pkg) => sum + pkg.kilo, 0).toString() + ' kg',
        filteredPackages.filter(pkg => pkg.fisNo === 27).reduce((sum, pkg) => sum + pkg.adet, 0).toString(),
        '$' + filteredPackages.filter(pkg => pkg.fisNo === 27).reduce((sum, pkg) => {
          const fiyat = parseFloat(pkg.fiyat.replace('$', '')) || 0;
          return sum + fiyat;
        }, 0).toFixed(2)
      ],
      
      // Fiş 26 toplamı
      [
        '26',
        filteredPackages.filter(pkg => pkg.fisNo === 26).length.toString(),
        filteredPackages.filter(pkg => pkg.fisNo === 26).reduce((sum, pkg) => sum + pkg.kilo, 0).toString() + ' kg',
        filteredPackages.filter(pkg => pkg.fisNo === 26).reduce((sum, pkg) => sum + pkg.adet, 0).toString(),
        '$' + filteredPackages.filter(pkg => pkg.fisNo === 26).reduce((sum, pkg) => {
          const fiyat = parseFloat(pkg.fiyat.replace('$', '')) || 0;
          return sum + fiyat;
        }, 0).toFixed(2)
      ],
      
      // Fiş 25 toplamı
      [
        '25',
        filteredPackages.filter(pkg => pkg.fisNo === 25).length.toString(),
        filteredPackages.filter(pkg => pkg.fisNo === 25).reduce((sum, pkg) => sum + pkg.kilo, 0).toString() + ' kg',
        filteredPackages.filter(pkg => pkg.fisNo === 25).reduce((sum, pkg) => sum + pkg.adet, 0).toString(),
        '$' + filteredPackages.filter(pkg => pkg.fisNo === 25).reduce((sum, pkg) => {
          const fiyat = parseFloat(pkg.fiyat.replace('$', '')) || 0;
          return sum + fiyat;
        }, 0).toFixed(2)
      ],
      
      [''],
      
      // Rapor bilgileri
      ['RAPOR BİLGİLERİ'],
      ['Rapor Oluşturma Tarihi:', `${currentDate} ${currentTime}`],
      ['Toplam Kayıt Sayısı:', filteredPackages.length.toString()],
      ['Uygulanan Filtreler:'],
      ['- Durum Filtresi:', statusFilter === 'Tümü' ? 'Tüm Durumlar' : statusFilter],
      ['- Fiş No Filtresi:', fisNoFilter === 'Tümü' ? 'Tüm Fişler' : `Fiş No: ${fisNoFilter}`],
      ['- Arama Kriteri:', searchText || 'Yok']
    ].map(row => row.join('\t')).join('\r\n');
    
    try {
      const blob = new Blob([csvContent], { type: 'text/tab-separated-values;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Tum_Paketler_Detayli_${currentDate.replace(/\//g, '_')}.xls`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Excel raporu oluşturulurken hata:', error);
      alert('Excel raporu oluşturulurken bir hata oluştu.');
    }
  };

  // Dialog handler fonksiyonları
  const handleTrackingOpen = (pkg: PackageData) => {
    setSelectedPackage(pkg);
    setTrackingDialogOpen(true);
  };

  const handleTrackingClose = () => {
    setTrackingDialogOpen(false);
    setSelectedPackage(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Başlık */}
      <Typography variant="h4" gutterBottom sx={{ color: '#495057', fontWeight: 600, mb: 3 }}>
        Tüm Paketler
      </Typography>

      {/* İstatistik Kartları */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                <LocalShipping />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>{totalPackages}</Typography>
                <Typography variant="body2">Toplam Paket</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                <Scale />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>{totalWeight}</Typography>
                <Typography variant="body2">Toplam Kilo</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                <Numbers />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>{totalItems}</Typography>
                <Typography variant="body2">Toplam Adet</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                <Inventory />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>{pendingPackages}</Typography>
                <Typography variant="body2">Bekleyen</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtreler */}
      <Paper sx={{ mb: 3 }}>
        <Accordion expanded={filtersOpen} onChange={() => setFiltersOpen(!filtersOpen)}>
          <AccordionSummary expandIcon={<ExpandMore />} sx={{ bgcolor: '#f5f5f5' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterList sx={{ color: '#6c757d' }} />
              <Typography variant="h6" sx={{ color: '#495057', fontWeight: 600 }}>Filtreler</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Arama"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Sevk Durumu</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Sevk Durumu"
                  >
                    <MenuItem value="Tümü">Tümü</MenuItem>
                    <MenuItem value="Bekleyen">Bekleyen</MenuItem>
                    <MenuItem value="Gönderildi">Gönderildi</MenuItem>
                    <MenuItem value="Teslim Edildi">Teslim Edildi</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Fiş No</InputLabel>
                  <Select
                    value={fisNoFilter}
                    onChange={(e) => setFisNoFilter(e.target.value)}
                    label="Fiş No"
                  >
                    <MenuItem value="Tümü">Tümü</MenuItem>
                    <MenuItem value="27">27</MenuItem>
                    <MenuItem value="26">26</MenuItem>
                    <MenuItem value="25">25</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleExport}
                  startIcon={<FileDownload />}
                  sx={{ height: '56px' }}
                >
                  Excel'e Aktar
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Paper>

      {/* Tablo */}
      <Paper>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 600, textAlign: 'center' }}>Fiş No</TableCell>
                <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 600, textAlign: 'center' }}>Sefer No</TableCell>
                <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 600, textAlign: 'center' }}>Sevk Durumu</TableCell>
                <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 600, textAlign: 'center' }}>Kap No</TableCell>
                <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 600, textAlign: 'center' }}>Barkod</TableCell>
                <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 600, textAlign: 'center' }}>Ürün Adı</TableCell>
                <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 600, textAlign: 'center' }}>Adet</TableCell>
                <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 600, textAlign: 'center' }}>Kilo</TableCell>
                <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 600, textAlign: 'center' }}>Hacim</TableCell>
                <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 600, textAlign: 'center' }}>Fiyat</TableCell>
                <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 600, textAlign: 'center' }}>Tarih</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPackages.map((pkg) => (
                <TableRow key={pkg.id} hover>
                  <TableCell sx={{ textAlign: 'center', fontWeight: 600, color: '#1976d2' }}>
                    {pkg.fisNo}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Chip 
                      label={pkg.seferNo} 
                      size="small"
                      sx={{ backgroundColor: '#e8f5e8', color: '#2e7d32', fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Chip 
                      label={pkg.sevkDurumu} 
                      size="small"
                      onClick={() => handleTrackingOpen(pkg)}
                      sx={{
                        ...getStatusColor(pkg.sevkDurumu),
                        cursor: 'pointer',
                        '&:hover': {
                          opacity: 0.8,
                          transform: 'scale(1.05)'
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', fontWeight: 600 }}>
                    {pkg.kapNo}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                    {pkg.barkod}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', fontWeight: 600, color: '#2e7d32' }}>
                    {pkg.urunAdi}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', fontWeight: 600 }}>
                    {pkg.adet}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', fontWeight: 600 }}>
                    {pkg.kilo}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    {pkg.hacim}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', color: '#2e7d32', fontWeight: 600 }}>
                    {pkg.fiyat}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                        {pkg.tarih}
                      </Typography>
                      <IconButton 
                        size="small"
                        sx={{
                          backgroundColor: '#f8f9fa',
                          color: '#495057',
                          '&:hover': {
                            backgroundColor: '#e9ecef',
                            color: '#343a40'
                          },
                          border: '1px solid #dee2e6',
                          width: 28,
                          height: 28
                        }}
                      >
                        <QrCode sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Sonuç Bilgisi */}
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Toplam {filteredPackages.length} paket gösteriliyor
        </Typography>
      </Box>

      {/* Paket Takip Dialog'u */}
      <Dialog
        open={trackingDialogOpen}
        onClose={handleTrackingClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            background: 'linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%)'
          }
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalShipping sx={{ fontSize: 24 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Paket Takip Sistemi
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Fiş No: {selectedPackage?.fisNo} | Kap No: {selectedPackage?.kapNo}
          </Typography>
          <IconButton
            onClick={handleTrackingClose}
            sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {selectedPackage && (
            <Grid container spacing={3}>
              {/* Paket Bilgileri */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', boxShadow: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: '#495057', fontWeight: 600 }}>
                      PAKET BİLGİLERİ
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#6c757d' }}>Fiş No:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedPackage.fisNo}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#6c757d' }}>Sefer No:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedPackage.seferNo}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#6c757d' }}>Kap No:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedPackage.kapNo}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#6c757d' }}>Barkod:</Typography>
                      <IconButton
                        size="small"
                        sx={{
                          backgroundColor: '#f8f9fa',
                          color: '#495057',
                          border: '1px solid #dee2e6',
                          width: 28,
                          height: 28
                        }}
                      >
                        <QrCode sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#6c757d' }}>Ürün:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedPackage.urunAdi}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#6c757d' }}>Adet:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedPackage.adet}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#6c757d' }}>Kilo:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedPackage.kilo} kg</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#6c757d' }}>Hacim:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedPackage.hacim}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: '#6c757d' }}>Fiyat:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#28a745' }}>{selectedPackage.fiyat}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Durum Bilgileri */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', boxShadow: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: '#495057', fontWeight: 600 }}>
                      DURUM BİLGİSİ
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#6c757d' }}>Durum:</Typography>
                      <Chip
                        label={selectedPackage.sevkDurumu}
                        size="small"
                        sx={getStatusColor(selectedPackage.sevkDurumu)}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#6c757d' }}>Tarih:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedPackage.tarih}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: '#6c757d' }}>Fiyat:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#28a745' }}>{selectedPackage.fiyat}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Paket Yolculuğu */}
              <Grid item xs={12}>
                <Card sx={{ boxShadow: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, color: '#495057', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocalShipping sx={{ color: '#667eea' }} />
                      Paket Yolculuğu
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      {/* Çıkış Noktası */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                        <Box sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          backgroundColor: '#28a745',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <CheckCircle sx={{ color: 'white', fontSize: 20 }} />
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#495057' }}>
                            Çıkış Noktası
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#6c757d' }}>
                            Yiğit Kemal - Satıcı Şube
                          </Typography>
                          <Typography variant="caption" sx={{ display: 'block', color: '#28a745' }}>
                            {selectedPackage.tarih}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Bağlantı Çizgisi */}
                      <Box sx={{
                        height: 2,
                        backgroundColor: selectedPackage.sevkDurumu !== 'Bekleyen' ? '#28a745' : '#dee2e6',
                        flex: 1,
                        mx: 2
                      }} />

                      {/* Kargo Merkezi */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                        <Box sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          backgroundColor: selectedPackage.sevkDurumu === 'Teslim Edildi' ? '#28a745' : 
                                         selectedPackage.sevkDurumu === 'Gönderildi' ? '#1976d2' : '#dee2e6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {selectedPackage.sevkDurumu === 'Teslim Edildi' ? (
                            <CheckCircle sx={{ color: 'white', fontSize: 20 }} />
                          ) : selectedPackage.sevkDurumu === 'Gönderildi' ? (
                            <LocalShipping sx={{ color: 'white', fontSize: 20 }} />
                          ) : (
                            <Schedule sx={{ color: '#6c757d', fontSize: 20 }} />
                          )}
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#495057' }}>
                            Kargo Merkezi
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#6c757d' }}>
                            {selectedPackage.teslimAlanSube}
                          </Typography>
                          <Typography variant="caption" sx={{ 
                            display: 'block', 
                            color: selectedPackage.sevkDurumu !== 'Bekleyen' ? '#28a745' : '#6c757d'
                          }}>
                            {selectedPackage.sevkDurumu !== 'Bekleyen' ? selectedPackage.tarih : 'Bekleniyor'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Gönderen Bilgileri */}
              <Grid item xs={12} md={6}>
                <Card sx={{ boxShadow: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: '#495057', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person sx={{ color: '#667eea' }} />
                      Gönderen Bilgileri
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#6c757d' }}>Ad Soyad:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Yiğit Kemal</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#6c757d' }}>Şube:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedPackage.gonderenAdi}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#6c757d' }}>Telefon:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Phone sx={{ fontSize: 14 }} />
                        +90 532 123 45 67
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#6c757d' }}>E-posta:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Email sx={{ fontSize: 14 }} />
                        yigit@satici.com
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: '#6c757d' }}>Adres:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationOn sx={{ fontSize: 14 }} />
                        Satıcı Şube Adresi
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Teslim Alan Bilgileri */}
              <Grid item xs={12} md={6}>
                <Card sx={{ boxShadow: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: '#495057', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Business sx={{ color: '#667eea' }} />
                      Teslim Alan Bilgileri
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#6c757d' }}>Ad Soyad:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Ahmet Durmaz</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#6c757d' }}>Şube:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedPackage.teslimAlanSube}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#6c757d' }}>Telefon:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Phone sx={{ fontSize: 14 }} />
                        +90 555 987 65 43
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#6c757d' }}>E-posta:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Email sx={{ fontSize: 14 }} />
                        ahmet@teslimat.com
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: '#6c757d' }}>Adres:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationOn sx={{ fontSize: 14 }} />
                        {selectedPackage.teslimAlanSube} Adresi
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, bgcolor: '#f8f9fa' }}>
          <Button
            onClick={handleTrackingClose}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
              }
            }}
          >
            Kapat
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AllPackagesPage;
