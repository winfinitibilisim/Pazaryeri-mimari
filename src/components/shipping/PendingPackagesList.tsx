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
      // Tablo verilerini hazırla
      const tableData = [
        // Başlık satırı
        ['Paket', 'Sefer No', 'Sevk Durumu', 'Kap No', 'Barkod', 'Adet', 'Kilo', 'Hacim', 'Fiyat', 'Tarih'],
        // 8 kap için veri satırları (3/10'dan 10/10'a kadar)
        ...Array.from({length: 8}, (_, i) => {
          const kapNo = i + 3;
          return [
            `${kapNo}/10`,
            '28',
            'Bekleyen',
            `${150 + kapNo}`,
            `${8133483147305 + kapNo}B${kapNo}`,
            `${5 + kapNo}`,
            `${10 + kapNo * 2}`,
            `${kapNo % 3}`,
            `$${(kapNo * 5).toFixed(2)}`,
            `12/04/2025 ${6 + kapNo}:${30 + kapNo}`
          ];
        }),
        // Boş satır
        [],
        // Özet bilgileri
        ['ÖZET BİLGİLERİ'],
        ['Toplam Paket:', '8'],
        ['Toplam Kilo:', '114'],
        ['Toplam Adet:', '48'],
        ['Bekleyen:', '8'],
        [],
        ['Fiş No:', selectedGroup?.packages[0]?.plugNo || '27'],
        ['Alıcı:', selectedGroup?.packages[0]?.alici || 'TR-01 Ahmet Durmaz'],
        ['Rapor Tarihi:', new Date().toLocaleDateString('tr-TR')]
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
      link.setAttribute('download', `Paket_Detaylari_${selectedGroup?.packages[0]?.plugNo || 'Rapor'}_${new Date().toLocaleDateString('tr-TR').replace(/\./g, '_')}.xls`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Excel raporu başarıyla indirildi!');
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
          maxWidth="xl"
          PaperProps={{
            sx: {
              borderRadius: 4,
              boxShadow: '0 25px 80px rgba(0,0,0,0.15)',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              overflow: 'hidden'
            }
          }}
        >
          {/* Header with Gradient */}
          <DialogTitle sx={{
            background: 'linear-gradient(135deg, #495057 0%, #343a40 100%)',
            color: 'white',
            fontWeight: 700,
            p: 3,
            position: 'relative'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)', 
                  width: 48, 
                  height: 48 
                }}>
                  <Assessment sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    Fiş No: {selectedGroup.packages[0]?.plugNo}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {selectedGroup.packages[0]?.alici} - Toplam {selectedGroup.packages.length} Paket
                  </Typography>
                </Box>
              </Box>
              <IconButton 
                onClick={handleCloseDetails}
                sx={{ 
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
                }}
              >
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ p: 0 }}>
            {/* Summary Cards Section */}
            <Box sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
              <Grid container spacing={3}>
                {/* Total Packages Card */}
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ 
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                  }}>
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Inventory sx={{ fontSize: 40, mb: 1, opacity: 0.9 }} />
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                        8
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Toplam Paket
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Total Weight Card */}
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ 
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    boxShadow: '0 8px 25px rgba(245, 87, 108, 0.3)'
                  }}>
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Scale sx={{ fontSize: 40, mb: 1, opacity: 0.9 }} />
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                        184
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Toplam Kilo
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Total Items Card */}
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ 
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    color: 'white',
                    boxShadow: '0 8px 25px rgba(79, 172, 254, 0.3)'
                  }}>
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Category sx={{ fontSize: 40, mb: 1, opacity: 0.9 }} />
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                        92
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Toplam Adet
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Status Card */}
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ 
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                    color: 'white',
                    boxShadow: '0 8px 25px rgba(67, 233, 123, 0.3)'
                  }}>
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <CheckCircle sx={{ fontSize: 40, mb: 1, opacity: 0.9 }} />
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                        8
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Bekliyor
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>

            {/* Detailed Information Section */}
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 700, 
                mb: 2, 
                color: '#2c3e50',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Info sx={{ color: '#495057' }} />
                Detaylı Paket Bilgileri
              </Typography>
              
              <TableContainer sx={{ 
                borderRadius: 3,
                border: '1px solid #e0e0e0',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
              }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow sx={{
                      backgroundColor: '#f5f5f5',
                      '& .MuiTableCell-head': {
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        color: '#495057',
                        borderBottom: '2px solid #dee2e6',
                        textAlign: 'center',
                        py: 2
                      }
                    }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <Category sx={{ fontSize: 18 }} />
                          Paket
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <Business sx={{ fontSize: 18 }} />
                          Sefer No
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <LocalShipping sx={{ fontSize: 18 }} />
                          Sevk Durumu
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <Inventory sx={{ fontSize: 18 }} />
                          Kap No
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <QrCode sx={{ fontSize: 18 }} />
                          Barkod
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <Numbers sx={{ fontSize: 18 }} />
                          Adet
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <Scale sx={{ fontSize: 18 }} />
                          Kilo
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <Assessment sx={{ fontSize: 18 }} />
                          Hacim
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <AttachMoney sx={{ fontSize: 18 }} />
                          Fiyat
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <Schedule sx={{ fontSize: 18 }} />
                          Tarih
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Çıkan paketler (2/10, 1/10) - Gönderildi/Teslim Edildi - Sadece çıkan popup'ta göster */}
                    {!showDepodaOnly && (
                    <>
                    <TableRow sx={{
                      '&:hover': {
                        backgroundColor: '#f0f7ff',
                        transition: 'all 0.2s ease'
                      },
                      '& .MuiTableCell-body': {
                        textAlign: 'center',
                        borderBottom: '1px solid #e0e0e0',
                        py: 2
                      }
                    }}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                          2/10
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label="28" 
                          size="small"
                          sx={{
                            backgroundColor: '#e8f5e8',
                            color: '#2e7d32',
                            fontWeight: 600
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label="Gönderildi" 
                          size="small"
                          sx={{
                            backgroundColor: '#e8f5e8',
                            color: '#2e7d32',
                            fontWeight: 600
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          155
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                          8133483147305B1
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                          10
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <Scale sx={{ color: '#6c757d', fontSize: 16 }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            20
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          0
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ 
                          fontWeight: 700, 
                          color: '#2e7d32',
                          fontSize: '0.95rem'
                        }}>
                          $0.00
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <AccessTime sx={{ color: '#6c757d', fontSize: 16 }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            12/04/2025 6:36
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow sx={{
                      backgroundColor: '#fafafa',
                      '&:hover': {
                        backgroundColor: '#f0f7ff',
                        transition: 'all 0.2s ease'
                      },
                      '& .MuiTableCell-body': {
                        textAlign: 'center',
                        borderBottom: '1px solid #e0e0e0',
                        py: 2
                      }
                    }}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                          1/10
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label="28" 
                          size="small"
                          sx={{
                            backgroundColor: '#e8f5e8',
                            color: '#2e7d32',
                            fontWeight: 600
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label="Teslim Edildi" 
                          size="small"
                          sx={{
                            backgroundColor: '#e3f2fd',
                            color: '#1976d2',
                            fontWeight: 600
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          164
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                          3340033464B533
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                          5
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <Scale sx={{ color: '#6c757d', fontSize: 16 }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            15
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          2
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ 
                          fontWeight: 700, 
                          color: '#2e7d32',
                          fontSize: '0.95rem'
                        }}>
                          $25.00
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <AccessTime sx={{ color: '#6c757d', fontSize: 16 }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            12/04/2025 7:15
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                    </>
                    )}
                    
                    {/* Depoda paketler (3/10'dan 10/10'a kadar) - Bekleyen durumda - Sadece depoda popup'ta göster */}
                    {showDepodaOnly && [3, 4, 5, 6, 7, 8, 9, 10].map((kapNo, index) => (
                      <TableRow 
                        key={kapNo}
                        sx={{
                          backgroundColor: index % 2 === 1 ? '#fafafa' : 'transparent',
                          '&:hover': {
                            backgroundColor: '#f0f7ff',
                            transition: 'all 0.2s ease'
                          },
                          '& .MuiTableCell-body': {
                            textAlign: 'center',
                            borderBottom: '1px solid #e0e0e0',
                            py: 2
                          }
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                            {kapNo}/10
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label="28" 
                            size="small"
                            sx={{
                              backgroundColor: '#e8f5e8',
                              color: '#2e7d32',
                              fontWeight: 600
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label="Bekleyen" 
                            size="small"
                            sx={{
                              backgroundColor: '#ffebee',
                              color: '#d32f2f',
                              fontWeight: 600
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {150 + kapNo}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                            {`${8133483147305 + kapNo}B${kapNo}`}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                            {5 + kapNo}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            <Scale sx={{ color: '#6c757d', fontSize: 16 }} />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {10 + kapNo * 2}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {kapNo % 3}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ 
                            fontWeight: 700, 
                            color: '#2e7d32',
                            fontSize: '0.95rem'
                          }}>
                            ${(kapNo * 5).toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            <AccessTime sx={{ color: '#6c757d', fontSize: 16 }} />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              12/04/2025 {6 + kapNo}:{30 + kapNo}
                            </Typography>
                          </Box>
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
