import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  TextField,
  InputAdornment,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Card,
  CardContent,
  Divider,
  Avatar,
  Tooltip,
} from '@mui/material';
import { 
  Add, 
  FilterList, 
  Search, 
  Visibility, 
  FileDownload, 
  Print,
  LocalShipping,
  Inventory,
  Person,
  LocationOn,
  ExpandMore,
  AccessTime,
  Scale,
  Category,
  Close,
  Business,
  AttachMoney,
  TrendingUp,
  Assessment,
  Info,
  CheckCircle,
  Schedule,
  QrCode,
  Numbers
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';

interface IPackage {
  id: number;
  plugNo: number;
  alici: string;
  satici: string;
  paket: number;
  tip: string;
  adet: number;
  kilo: number;
  hacim: number;
  fiyat: string;
  subeAdi: string;
  varisYeri: string;
  created: string;
  status: 'Bekliyor' | 'Gönderildi';
}

interface IPackageGroup {
  id: number;
  summary: {
    bekliyor: number;
    gonderildi: number;
  };
  packages: IPackage[];
}

const packageGroups: IPackageGroup[] = [
  {
    id: 1,
    summary: { bekliyor: 93, gonderildi: 8 },
    packages: [
      {
        id: 1,
        plugNo: 27,
        alici: 'Ahmet Durmaz TR-01',
        satici: 'Yiğit Kemal',
        paket: 10,
        tip: 'Tır',
        adet: 10,
        kilo: 20,
        hacim: 0,
        fiyat: '$0.00',
        subeAdi: 'İstanbul Şubesi',
        varisYeri: 'Turkey',
        created: '12/04/2025 6:36',
        status: 'Bekliyor',
      },
    ],
  },
  {
    id: 2,
    summary: { bekliyor: 16, gonderildi: 5 },
    packages: [
      {
        id: 2,
        plugNo: 26,
        alici: 'Mirza SS-407',
        satici: 'Winfiniti Bilişim Promosyon Giyim ve Turizm A.Ş',
        paket: 21,
        tip: 'Tır',
        adet: 0,
        kilo: 0,
        hacim: 0,
        fiyat: '$0.00',
        subeAdi: 'İstanbul Şubesi',
        varisYeri: 'Kyrgyzstan',
        created: '8/03/2025 9:31',
        status: 'Bekliyor',
      },
    ],
  },
  {
    id: 3,
    summary: { bekliyor: 21, gonderildi: 0 },
    packages: [
      {
        id: 3,
        plugNo: 25,
        alici: 'GÜLNUR GÜLAĞZI',
        satici: 'Yiğit Kemal',
        paket: 21,
        tip: 'Tır',
        adet: 0,
        kilo: 0,
        hacim: 0,
        fiyat: '$0.00',
        subeAdi: 'İstanbul Şubesi',
        varisYeri: 'Libya',
        created: '8/03/2025 8:56',
        status: 'Bekliyor',
      },
    ],
  },
];

const PendingPackagesList: React.FC = () => {
  const navigate = useNavigate();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [status, setStatus] = useState('Tümü');
  const [creationDate, setCreationDate] = useState<Date | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<IPackageGroup | null>(null);
  const [plugNoFilter, setPlugNoFilter] = useState('');
  const [showDepodaOnly, setShowDepodaOnly] = useState(false);

  const handleExportToExcel = () => {
    try {
      const currentDate = new Date().toLocaleDateString('tr-TR');
      const currentTime = new Date().toLocaleTimeString('tr-TR');
      
      // Detay tablosundaki veriler (resimde gösterildiği gibi 10 satır)
      const detailData = [
        ['27', '28', 'Gönderildi', '155', '813348314730301', 'Elektronik Ürün', '10', '20', '0', '$0.00', '12/04/2025 6:36'],
        ['27', '28', 'Teslim Edildi', '164', '334HN3364H533', 'Tekstil Ürünü', '5', '15', '2', '$25.00', '12/04/2025 7:15'],
        ['27', '28', 'Bekleyen', '153', '813348314730303', 'Gıda Ürünü', '8', '16', '0', '$15.00', '12/04/2025 9:33'],
        ['27', '28', 'Bekleyen', '154', '813348314730304', 'Kozmetik Ürün', '9', '18', '1', '$20.00', '12/04/2025 10:34'],
        ['27', '28', 'Bekleyen', '156', '813348314731305', 'Ev Eşyası', '10', '20', '2', '$25.00', '12/04/2025 11:35'],
        ['27', '28', 'Bekleyen', '156', '813348314731306', 'Kırtasiye', '11', '22', '0', '$30.00', '12/04/2025 12:36'],
        ['27', '28', 'Bekleyen', '157', '813348314731307', 'Oyuncak', '12', '24', '1', '$35.00', '12/04/2025 13:37'],
        ['27', '28', 'Bekleyen', '158', '813348314731308', 'Spor Malzemesi', '13', '26', '2', '$40.00', '12/04/2025 14:38'],
        ['27', '28', 'Bekleyen', '159', '813348314731309', 'Kitap', '14', '28', '0', '$45.00', '12/04/2025 15:39'],
        ['27', '28', 'Bekleyen', '160', '813348314731310', 'Müzik Aleti', '15', '30', '1', '$50.00', '12/04/2025 16:40']
      ];
      
      // Toplamları hesapla
      const toplamAdet = detailData.reduce((sum, row) => sum + parseInt(row[6]), 0);
      const toplamKilo = detailData.reduce((sum, row) => sum + parseInt(row[7]), 0);
      const toplamHacim = detailData.reduce((sum, row) => sum + parseInt(row[8]), 0);
      const toplamFiyat = detailData.reduce((sum, row) => {
        const fiyat = parseFloat(row[9].replace('$', ''));
        return sum + fiyat;
      }, 0);
      
      // Excel tablosu
      const tableData = [
        // Başlık
        ['PAKET GRUP DETAYLARI - FİŞ NO: 27'],
        ['Rapor Tarihi:', `${currentDate} ${currentTime}`],
        ['Alıcı:', 'Ahmet Durmaz TR-01'],
        [],
        
        // Tablo başlıkları
        ['Fiş No', 'Sefer No', 'Sevk Durumu', 'Kap No', 'Barkod', 'Ürün Adı', 'Adet', 'Kilo', 'Hacim', 'Fiyat', 'Tarih'],
        
        // Detay verileri
        ...detailData,
        
        // Boş satır
        [],
        
        // Toplamlar
        ['TOPLAMLAR'],
        ['Toplam Paket Sayısı:', detailData.length.toString()],
        ['Toplam Adet:', toplamAdet.toString()],
        ['Toplam Kilo:', `${toplamKilo} kg`],
        ['Toplam Hacim:', `${toplamHacim} m³`],
        ['Toplam Fiyat:', `$${toplamFiyat.toFixed(2)}`],
        [],
        
        // Sevk durumu özeti
        ['SEVK DURUMU ÖZETİ'],
        ['Gönderildi:', detailData.filter(row => row[2] === 'Gönderildi').length.toString()],
        ['Teslim Edildi:', detailData.filter(row => row[2] === 'Teslim Edildi').length.toString()],
        ['Bekleyen:', detailData.filter(row => row[2] === 'Bekleyen').length.toString()]
      ];

      // CSV formatında veri oluştur
      const csvContent = tableData.map(row => 
        row.map(cell => 
          typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
        ).join('\t')
      ).join('\r\n');

      // Dosyayı indir
      const blob = new Blob([csvContent], { type: 'text/tab-separated-values;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `Paket_Detay_Listesi_Fis27_${new Date().toLocaleDateString('tr-TR').replace(/\./g, '_')}.xls`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Detay listesi Excel raporu başarıyla indirildi!');
    } catch (error) {
      console.error('Excel raporu oluşturulurken hata:', error);
    }
  };

  const handlePrint = () => {
    console.log('Yazdırılıyor...');
  };

  const handleClearFilters = () => {
    setSearchText('');
    setStatus('Tümü');
    setPlugNoFilter('');
    setCreationDate(null);
  };

  const handleOpenDetails = (group: IPackageGroup) => {
    setSelectedGroup(group);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedGroup(null);
    setShowDepodaOnly(false);
  };

  const handleOpenDepodaDetails = (group: IPackageGroup) => {
    setSelectedGroup(group);
    setShowDepodaOnly(true);
    setDetailsOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Bekliyor':
        return '#ff9800';
      case 'Gönderildi':
        return '#4caf50';
      default:
        return '#757575';
    }
  };

  return (
    <Box sx={{ 
      p: 3, 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <Paper sx={{ 
        p: 3, 
        mb: 3,
        borderRadius: 3,
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        backgroundColor: '#FFFFFF',
        border: '1px solid #e0e0e0'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LocalShipping sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1, color: '#2c3e50' }}>
                Depo Listesi
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#6c757d' }}>
                Kargo ve paket takip sistemi
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="outlined" 
              startIcon={<FileDownload />} 
              onClick={handleExportToExcel}
              sx={{
                borderColor: '#6c757d',
                color: '#6c757d',
                '&:hover': { 
                  borderColor: '#495057',
                  backgroundColor: '#f8f9fa'
                }
              }}
            >
              Export
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<Print />} 
              onClick={handlePrint}
              sx={{
                borderColor: '#6c757d',
                color: '#6c757d',
                '&:hover': { 
                  borderColor: '#495057',
                  backgroundColor: '#f8f9fa'
                }
              }}
            >
              Print
            </Button>
            <Button 
              variant="contained" 
              startIcon={<Add />} 
              onClick={() => navigate('/shipping/pending-packages/create')}
              sx={{
                backgroundColor: '#495057',
                color: 'white',
                '&:hover': { backgroundColor: '#343a40' }
              }}
            >
              Yeni Paket Ekle
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Filters Section */}
      <Paper sx={{ 
        mb: 3,
        borderRadius: 3,
        boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        overflow: 'hidden'
      }}>
        <Accordion expanded={filtersOpen} onChange={() => setFiltersOpen(!filtersOpen)}>
          <AccordionSummary 
            expandIcon={<ExpandMore />}
            sx={{
              backgroundColor: '#f8f9fa',
              color: '#2c3e50',
              borderBottom: '1px solid #e0e0e0',
              '& .MuiAccordionSummary-expandIconWrapper': {
                color: '#2c3e50'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterList />
              <Typography sx={{ fontWeight: 600 }}>Filtrele ve Ara</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Plug No ile Ara"
                  value={plugNoFilter}
                  onChange={(e) => setPlugNoFilter(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: '#6c757d' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': { borderColor: '#6c757d' },
                      '&.Mui-focused fieldset': { borderColor: '#495057' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Alıcı Adı ile Ara"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: '#6c757d' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': { borderColor: '#6c757d' },
                      '&.Mui-focused fieldset': { borderColor: '#495057' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Durum</InputLabel>
                  <Select
                    value={status}
                    label="Durum"
                    onChange={(e) => setStatus(e.target.value)}
                    sx={{
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#6c757d' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#495057' }
                    }}
                  >
                    <MenuItem value="Tümü">Tümü</MenuItem>
                    <MenuItem value="Bekliyor">Bekliyor</MenuItem>
                    <MenuItem value="Gönderildi">Gönderildi</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Oluşturma Tarihi"
                  value={creationDate}
                  onChange={(newValue: Date | null) => setCreationDate(newValue)}
                  renderInput={(params: any) => 
                    <TextField 
                      {...params} 
                      size="small" 
                      fullWidth 
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': { borderColor: '#6c757d' },
                          '&.Mui-focused fieldset': { borderColor: '#495057' }
                        }
                      }}
                    />
                  }
                />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button 
                  onClick={handleClearFilters}
                  sx={{
                    color: '#6c757d',
                    borderColor: '#6c757d',
                    '&:hover': {
                      borderColor: '#495057',
                      backgroundColor: '#f8f9fa'
                    }
                  }}
                  variant="outlined"
                >
                  Filtreleri Temizle
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Paper>

      {/* İstatistik Kartları */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            color: 'white',
            borderRadius: 3,
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
          }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3 }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                <LocalShipping sx={{ fontSize: 28 }} />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {packageGroups.reduce((total, group) => {
                    if (group.id === 1) return total + 8; // Fiş 27 için 8 bekleyen
                    if (group.id === 2) return total + 5; // Fiş 26 için 5 bekleyen
                    if (group.id === 3) return total + 3; // Fiş 25 için 3 bekleyen
                    return total;
                  }, 0)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Toplam Paket</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
            color: 'white',
            borderRadius: 3,
            boxShadow: '0 8px 25px rgba(240, 147, 251, 0.3)'
          }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3 }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                <Scale sx={{ fontSize: 28 }} />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {packageGroups.reduce((total, group) => {
                    return total + group.packages.reduce((sum, pkg) => sum + pkg.kilo, 0);
                  }, 0)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Toplam Kilo</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
            color: 'white',
            borderRadius: 3,
            boxShadow: '0 8px 25px rgba(79, 172, 254, 0.3)'
          }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3 }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                <Numbers sx={{ fontSize: 28 }} />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {packageGroups.reduce((total, group) => {
                    return total + group.packages.reduce((sum, pkg) => sum + pkg.adet, 0);
                  }, 0)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Toplam Adet</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', 
            color: 'white',
            borderRadius: 3,
            boxShadow: '0 8px 25px rgba(250, 112, 154, 0.3)'
          }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3 }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                <Inventory sx={{ fontSize: 28 }} />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {packageGroups.reduce((total, group) => {
                    return total + group.summary.bekliyor;
                  }, 0)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Bekleyen</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Package Groups */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {packageGroups.map((group) => (
          <Card key={group.id} sx={{ 
            borderRadius: 3,
            boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            overflow: 'hidden',
            border: '1px solid #e0e0e0'
          }}>
            {/* Group Header */}
            <CardContent sx={{
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              borderBottom: '1px solid rgba(0,0,0,0.1)',
              p: 2
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ 
                    backgroundColor: '#6c757d',
                    width: 48,
                    height: 48
                  }}>
                    <Inventory />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                      Depoda: <Typography 
                        component="span" 
                        sx={{ 
                          color: '#1976d2', 
                          fontWeight: 700,
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline'
                          }
                        }}
                        onClick={() => handleOpenDepodaDetails(group)}
                      >
                        {group.id === 1 ? 8 : Math.floor(group.packages.reduce((sum, pkg) => sum + (typeof pkg.paket === 'number' ? pkg.paket : 0), 0) * 0.7)}
                      </Typography> | Çıkan: <Typography 
                        component="span" 
                        sx={{ 
                          color: '#1976d2', 
                          fontWeight: 700,
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline'
                          }
                        }}
                        onClick={() => handleOpenDetails(group)}
                      >
                        {group.id === 1 ? 2 : Math.ceil(group.packages.reduce((sum, pkg) => sum + (typeof pkg.paket === 'number' ? pkg.paket : 0), 0) * 0.3)}
                      </Typography>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Toplam {group.packages.reduce((sum, pkg) => sum + pkg.paket, 0)} paket
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton 
                    size="small"
                    sx={{
                      backgroundColor: '#f8f9fa',
                      color: '#6c757d',
                      '&:hover': { backgroundColor: '#e9ecef' }
                    }}
                  >
                    <Visibility />
                  </IconButton>

                  <Button 
                    size="small" 
                    variant="contained"
                    onClick={() => handleOpenDetails(group)}
                    sx={{
                      backgroundColor: '#495057',
                      '&:hover': {
                        backgroundColor: '#343a40',
                        transform: 'translateY(-1px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Detay
                  </Button>
                </Box>
              </Box>
            </CardContent>

            {/* Package Table */}
            <TableContainer sx={{ 
              overflowX: 'auto',
              '&::-webkit-scrollbar': {
                height: 8,
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#f1f1f1',
                borderRadius: 4,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#c1c1c1',
                borderRadius: 4,
                '&:hover': {
                  backgroundColor: '#a8a8a8',
                },
              },
            }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ 
                    backgroundColor: '#f5f5f5',
                    '& .MuiTableCell-head': {
                      color: '#2c3e50',
                      fontWeight: 700,
                      fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.9rem' },
                      border: 'none',
                      backgroundColor: '#f5f5f5',
                      padding: { xs: '8px 4px', sm: '12px 8px', md: '16px 16px' },
                      whiteSpace: 'nowrap',
                      textAlign: 'center'
                    }
                  }}>
                    <TableCell sx={{ minWidth: 80 }}>
                      <Tooltip title="Fiş Numarası" arrow>
                        <span>Fiş No</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ minWidth: 120 }}>
                      <Tooltip title="Alıcı Bilgisi" arrow>
                        <span>Alıcı</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ minWidth: 80 }}>
                      <Tooltip title="Alıcı Kodu" arrow>
                        <span>Kodu</span>
                      </Tooltip>
                    </TableCell>

                    <TableCell sx={{ minWidth: 60 }}>
                      <Tooltip title="Araç Tipi" arrow>
                        <span>Tip</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ minWidth: 70 }}>
                      <Tooltip title="Toplam Adet" arrow>
                        <span>Adet</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ minWidth: 70 }}>
                      <Tooltip title="Ağırlık (Kg)" arrow>
                        <span>Kilo</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ minWidth: 70 }}>
                      <Tooltip title="Hacim (m³)" arrow>
                        <span>Hacim</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ minWidth: 80 }}>
                      <Tooltip title="Toplam Fiyat" arrow>
                        <span>Fiyat</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ minWidth: 100 }}>
                      <Tooltip title="Oluşturulma Tarihi" arrow>
                        <span>Tarih</span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {group.packages.map((pkg) => (
                    <TableRow 
                      key={pkg.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: '#f8f9fa',
                          transform: 'scale(1.01)',
                          transition: 'all 0.2s ease'
                        },
                        '& .MuiTableCell-body': {
                          border: 'none',
                          padding: { xs: '8px 4px', sm: '12px 8px', md: '16px 16px' },
                          fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                          whiteSpace: 'nowrap',
                          textAlign: 'center'
                        }
                      }}
                    >
                      <TableCell>
                        <Chip 
                          label={pkg.plugNo} 
                          size="small"
                          sx={{
                            backgroundColor: '#6c757d',
                            color: 'white',
                            fontWeight: 600
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Person sx={{ color: '#6c757d', fontSize: 18 }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {pkg.alici.split(' ').slice(0, -1).join(' ')}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={pkg.alici.split(' ').slice(-1)[0]} 
                          size="small"
                          sx={{
                            backgroundColor: '#fff3e0',
                            color: '#ef6c00',
                            fontWeight: 600,
                            border: '1px solid #ffcc02'
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Chip 
                          label={pkg.tip} 
                          size="small"
                          sx={{
                            backgroundColor: '#e3f2fd',
                            color: '#1976d2',
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {pkg.adet}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Scale sx={{ color: '#6c757d', fontSize: 18 }} />
                          <Typography variant="body2">
                            {pkg.kilo}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {pkg.hacim}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                          {pkg.fiyat}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTime sx={{ color: '#6c757d', fontSize: 18 }} />
                          <Typography variant="body2">
                            {pkg.created}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        ))}
      </Box>

      {/* Professional Detail Dialog */}
      {selectedGroup && (
        <Dialog 
          open={detailsOpen} 
          onClose={handleCloseDetails} 
          fullWidth 
          maxWidth="lg"
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              background: '#ffffff',
              overflow: 'hidden'
            }
          }}
        >
          {/* Header - Resimde Gösterildiği Gibi */}
          <DialogTitle sx={{
            background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
            color: 'white',
            p: 2,
            position: 'relative'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.15)', 
                  width: 32, 
                  height: 32 
                }}>
                  <Assessment sx={{ fontSize: 18 }} />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0, fontSize: '1rem' }}>
                    Paket Grup Detayları
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
                    Ahmet Durmaz TR-01
                  </Typography>
                </Box>
              </Box>
              
              {/* Gönderen ve Teslim Alan Şube Bilgileri */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'flex-end',
                gap: 0.5,
                mr: 5
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ 
                    opacity: 0.8, 
                    fontSize: '0.75rem',
                    fontWeight: 500
                  }}>
                    Gönderen:
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>
                    Yiğit Kemal
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ 
                    opacity: 0.8, 
                    fontSize: '0.75rem',
                    fontWeight: 500
                  }}>
                    Teslim Alan Şube:
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>
                    İstanbul Şubesi
                  </Typography>
                </Box>
              </Box>
              <IconButton 
                onClick={handleCloseDetails}
                sx={{ 
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
                  width: 28,
                  height: 28
                }}
              >
                <Close sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ p: 0 }}>
            {/* İstatistik Kartları - Yeni Tasarım */}
            <Box sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
              <Grid container spacing={2}>
                {/* Toplam Paket - Mavi */}
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ 
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)',
                    minHeight: 90
                  }}>
                    <CardContent sx={{ textAlign: 'left', py: 2, px: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Inventory sx={{ fontSize: 24, opacity: 0.9 }} />
                        <Box>
                          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0, fontSize: '1.5rem' }}>
                            18
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
                            Toplam Paket
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Toplam Kilo - Pembe */}
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ 
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(245, 87, 108, 0.2)',
                    minHeight: 90
                  }}>
                    <CardContent sx={{ textAlign: 'left', py: 2, px: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Scale sx={{ fontSize: 24, opacity: 0.9 }} />
                        <Box>
                          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0, fontSize: '1.5rem' }}>
                            403
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
                            Toplam Kilo
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Toplam Adet - Turkuaz */}
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ 
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(79, 172, 254, 0.2)',
                    minHeight: 90
                  }}>
                    <CardContent sx={{ textAlign: 'left', py: 2, px: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Category sx={{ fontSize: 24, opacity: 0.9 }} />
                        <Box>
                          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0, fontSize: '1.5rem' }}>
                            199
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
                            Toplam Adet
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Bekleyen - Turuncu */}
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ 
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #ff9a56 0%, #ff6b6b 100%)',
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(255, 154, 86, 0.2)',
                    minHeight: 90
                  }}>
                    <CardContent sx={{ textAlign: 'left', py: 2, px: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CheckCircle sx={{ fontSize: 24, opacity: 0.9 }} />
                        <Box>
                          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0, fontSize: '1.5rem' }}>
                            16
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
                            Bekleyen
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>

            {/* Filtreler Bölümü - Accordion */}
            <Box sx={{ px: 3, py: 2, backgroundColor: '#ffffff' }}>
              <Accordion 
                sx={{ 
                  backgroundColor: '#f8f9fa',
                  boxShadow: 'none',
                  border: '1px solid #e9ecef',
                  '&:before': {
                    display: 'none',
                  },
                  '& .MuiAccordionSummary-root': {
                    minHeight: 48,
                    '&.Mui-expanded': {
                      minHeight: 48,
                    },
                  },
                  '& .MuiAccordionSummary-content': {
                    '&.Mui-expanded': {
                      margin: '12px 0',
                    },
                  }
                }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandMore />}
                  sx={{
                    backgroundColor: '#f8f9fa',
                    '&:hover': {
                      backgroundColor: '#e9ecef'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FilterList sx={{ fontSize: 18, color: '#495057' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#495057' }}>
                      Filtreler
                    </Typography>
                  </Box>
                </AccordionSummary>
                
                <AccordionDetails sx={{ backgroundColor: '#ffffff', p: 3 }}>
                  {/* Filtre Alanları */}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={2.4}>
                      <TextField
                        size="small"
                        label="Fiş No"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Category sx={{ fontSize: 16, color: '#6c757d' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            fontSize: '0.8rem',
                            backgroundColor: '#ffffff'
                          },
                          '& .MuiInputLabel-root': {
                            fontSize: '0.8rem'
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={2.4}>
                      <TextField
                        size="small"
                        label="Barkod"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <QrCode sx={{ fontSize: 16, color: '#6c757d' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            fontSize: '0.8rem',
                            backgroundColor: '#ffffff'
                          },
                          '& .MuiInputLabel-root': {
                            fontSize: '0.8rem'
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={2.4}>
                      <TextField
                        size="small"
                        label="Ürün Adı"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Inventory sx={{ fontSize: 16, color: '#6c757d' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            fontSize: '0.8rem',
                            backgroundColor: '#ffffff'
                          },
                          '& .MuiInputLabel-root': {
                            fontSize: '0.8rem'
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={2.4}>
                      <TextField
                        size="small"
                        label="Kap No"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Numbers sx={{ fontSize: 16, color: '#6c757d' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            fontSize: '0.8rem',
                            backgroundColor: '#ffffff'
                          },
                          '& .MuiInputLabel-root': {
                            fontSize: '0.8rem'
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={2.4}>
                      <FormControl size="small" fullWidth>
                        <InputLabel sx={{ fontSize: '0.8rem' }}>Sevk Durumu</InputLabel>
                        <Select
                          label="Sevk Durumu"
                          sx={{
                            fontSize: '0.8rem',
                            backgroundColor: '#ffffff'
                          }}
                          startAdornment={
                            <InputAdornment position="start">
                              <LocalShipping sx={{ fontSize: 16, color: '#6c757d', ml: 1 }} />
                            </InputAdornment>
                          }
                        >
                          <MenuItem value="" sx={{ fontSize: '0.8rem' }}>
                            <em>Tümü</em>
                          </MenuItem>
                          <MenuItem value="Gönderildi" sx={{ fontSize: '0.8rem' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#2e7d32' }} />
                              Gönderildi
                            </Box>
                          </MenuItem>
                          <MenuItem value="Teslim Edildi" sx={{ fontSize: '0.8rem' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#1976d2' }} />
                              Teslim Edildi
                            </Box>
                          </MenuItem>
                          <MenuItem value="Bekleyen" sx={{ fontSize: '0.8rem' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#d32f2f' }} />
                              Bekleyen
                            </Box>
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  
                  {/* Filtre Butonları */}
                  <Box sx={{ display: 'flex', gap: 1, mt: 3, justifyContent: 'flex-end' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Search />}
                      sx={{
                        fontSize: '0.75rem',
                        borderColor: '#6c757d',
                        color: '#6c757d',
                        '&:hover': {
                          backgroundColor: '#6c757d',
                          color: 'white'
                        }
                      }}
                    >
                      Ara
                    </Button>
                    <Button
                      size="small"
                      variant="text"
                      sx={{
                        fontSize: '0.75rem',
                        color: '#6c757d',
                        '&:hover': {
                          backgroundColor: '#f8f9fa'
                        }
                      }}
                    >
                      Temizle
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>

            {/* Detaylı Paket Bilgileri */}
            <Box sx={{ px: 3, pb: 3 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                mb: 2, 
                color: '#495057',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: '1rem'
              }}>
                <Info sx={{ color: '#495057', fontSize: 18 }} />
                Detaylı Paket Bilgileri
              </Typography>
              
              <TableContainer sx={{ 
                borderRadius: 1,
                border: '1px solid #dee2e6',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow sx={{
                      backgroundColor: '#f8f9fa',
                      '& .MuiTableCell-head': {
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        color: '#495057',
                        borderBottom: '1px solid #dee2e6',
                        textAlign: 'center',
                        py: 1.5
                      }
                    }}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                          Fiş No
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                          Sefer No
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                          Sevk Durumu
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                          Kap No
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                          Barkod
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                          Ürün Adı
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                          Adet
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                          Kilo
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                          Hacim
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                          Fiyat
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                          Tarih
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Resimde Gösterildiği Gibi Tam Veri */}
                    {[
                      { fisNo: '27', seferNo: '28', sevkDurumu: 'Gönderildi', kapNo: '155', barkod: '813348314730301', urunAdi: 'Elektronik Ürün', adet: '10', kilo: '20', hacim: '0', fiyat: '$0.00', tarih: '12/04/2025 6:36' },
                      { fisNo: '27', seferNo: '28', sevkDurumu: 'Teslim Edildi', kapNo: '164', barkod: '334083346405533', urunAdi: 'Tekstil Ürünü', adet: '5', kilo: '15', hacim: '2', fiyat: '$25.00', tarih: '12/04/2025 7:15' },
                      { fisNo: '27', seferNo: '28', sevkDurumu: 'Bekleyen', kapNo: '153', barkod: '813348314730503', urunAdi: 'Gıda Ürünü', adet: '8', kilo: '16', hacim: '0', fiyat: '$15.00', tarih: '12/04/2025 9:33' },
                      { fisNo: '27', seferNo: '28', sevkDurumu: 'Bekleyen', kapNo: '154', barkod: '813348314730504', urunAdi: 'Kozmetik Ürün', adet: '9', kilo: '18', hacim: '1', fiyat: '$20.00', tarih: '12/04/2025 10:34' },
                      { fisNo: '27', seferNo: '28', sevkDurumu: 'Bekleyen', kapNo: '155', barkod: '813348314731305', urunAdi: 'Ev Eşyası', adet: '10', kilo: '20', hacim: '2', fiyat: '$25.00', tarih: '12/04/2025 11:35' },
                      { fisNo: '27', seferNo: '28', sevkDurumu: 'Bekleyen', kapNo: '156', barkod: '813348314731306', urunAdi: 'Kırtasiye', adet: '11', kilo: '22', hacim: '0', fiyat: '$30.00', tarih: '12/04/2025 12:36' },
                      { fisNo: '27', seferNo: '28', sevkDurumu: 'Bekleyen', kapNo: '157', barkod: '813348314731307', urunAdi: 'Oyuncak', adet: '12', kilo: '24', hacim: '1', fiyat: '$35.00', tarih: '12/04/2025 13:37' },
                      { fisNo: '27', seferNo: '28', sevkDurumu: 'Bekleyen', kapNo: '158', barkod: '813348314731308', urunAdi: 'Spor Malzemesi', adet: '13', kilo: '26', hacim: '2', fiyat: '$40.00', tarih: '12/04/2025 14:38' },
                      { fisNo: '27', seferNo: '28', sevkDurumu: 'Bekleyen', kapNo: '159', barkod: '813348314731309', urunAdi: 'Kitap', adet: '14', kilo: '28', hacim: '0', fiyat: '$45.00', tarih: '12/04/2025 15:39' },
                      { fisNo: '27', seferNo: '28', sevkDurumu: 'Bekleyen', kapNo: '160', barkod: '813348314731310', urunAdi: 'Müzik Aleti', adet: '15', kilo: '30', hacim: '1', fiyat: '$50.00', tarih: '12/04/2025 16:40' }
                    ].map((item, index) => (
                      <TableRow 
                        key={index}
                        sx={{
                          '&:hover': {
                            backgroundColor: '#f8f9fa',
                            transition: 'all 0.2s ease'
                          },
                          '& .MuiTableCell-body': {
                            textAlign: 'center',
                            borderBottom: '1px solid #dee2e6',
                            py: 1,
                            fontSize: '0.75rem'
                          }
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" sx={{ 
                            fontWeight: 600, 
                            color: '#1976d2',
                            fontSize: '0.75rem'
                          }}>
                            {item.fisNo}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ 
                            fontWeight: 600, 
                            color: '#2e7d32',
                            fontSize: '0.75rem'
                          }}>
                            {item.seferNo}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={item.sevkDurumu}
                            size="small"
                            sx={{
                              backgroundColor: 
                                item.sevkDurumu === 'Gönderildi' ? '#e8f5e8' :
                                item.sevkDurumu === 'Teslim Edildi' ? '#e3f2fd' :
                                '#ffebee',
                              color: 
                                item.sevkDurumu === 'Gönderildi' ? '#2e7d32' :
                                item.sevkDurumu === 'Teslim Edildi' ? '#1976d2' :
                                '#d32f2f',
                              fontWeight: 500,
                              fontSize: '0.65rem',
                              height: 20
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                            {item.kapNo}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ 
                            fontWeight: 500, 
                            fontSize: '0.75rem',
                            fontFamily: 'monospace'
                          }}>
                            {item.barkod}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ 
                            fontWeight: 500, 
                            color: '#2e7d32',
                            fontSize: '0.75rem'
                          }}>
                            {item.urunAdi}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                            {item.adet}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                            {item.kilo}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                            {item.hacim}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ 
                            fontWeight: 600, 
                            color: '#2e7d32',
                            fontSize: '0.75rem'
                          }}>
                            {item.fiyat}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                            {item.tarih}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </DialogContent>

          {/* Action Buttons */}
          <DialogActions sx={{ 
            p: 3, 
            backgroundColor: '#f8f9fa',
            borderTop: '1px solid #e0e0e0',
            gap: 2
          }}>
            <Button 
              startIcon={<FileDownload />}
              variant="outlined"
              onClick={handleExportToExcel}
              sx={{
                borderColor: '#495057',
                color: '#495057',
                '&:hover': {
                  backgroundColor: '#495057',
                  color: 'white'
                }
              }}
            >
              Excel'e Aktar
            </Button>
            <Button 
              startIcon={<Print />}
              variant="outlined"
              sx={{
                borderColor: '#495057',
                color: '#495057',
                '&:hover': {
                  backgroundColor: '#495057',
                  color: 'white'
                }
              }}
            >
              Yazdır
            </Button>
            <Button 
              onClick={handleCloseDetails}
              variant="contained"
              startIcon={<Close />}
              sx={{
                backgroundColor: '#495057',
                '&:hover': {
                  backgroundColor: '#343a40',
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Kapat
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default PendingPackagesList;
