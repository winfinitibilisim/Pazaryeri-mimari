import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Autocomplete, Box, Button, Typography, TextField, Grid, Select, MenuItem, InputLabel, FormControl, Tabs, Tab, Avatar, IconButton, InputAdornment, Divider, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, List, ListItem, ListItemText, Menu, Card, CardHeader, CardContent, CardActions, Switch, Checkbox, FormControlLabel, Modal } from '@mui/material';
import {
  Person, GpsFixed, LocationOn, Flag, Discount, AccountBalanceWallet, Description as DescriptionIcon,
  Notifications, Settings, Mail, Sms, CloudUpload as CloudUploadIcon, ArrowBack as ArrowBackIcon,
  Edit, MoreVert, Print, GetApp, Delete as DeleteIcon, Close as CloseIcon, Save as SaveIcon, AccountBalance, Visibility,
  Note, Refresh as RefreshIcon, AttachMoney, History as HistoryIcon, ShieldOutlined, BarChart, BusinessCenter,
  NotInterested, Storefront, TransferWithinAStation, PointOfSale, Bookmark, ShoppingCart, Send, Download, ArrowDropDown, Search as SearchIcon
} from '@mui/icons-material';

const summaryData = [
  { title: 'Bakiye', value: '₺12.500,00', icon: <AttachMoney color="success" />, color: 'success.main' },
  { title: 'Gecikmiş Bakiye', value: '₺0,00', icon: <HistoryIcon color="warning" />, color: 'warning.main' },
  { title: 'Bekleyen Sipariş', value: '1', icon: <DescriptionIcon color="info" />, color: 'info.main' },
  { title: 'Risk', value: '₺0,00', icon: <ShieldOutlined color="error" />, color: 'error.main' },
  { title: 'Ort. Vade Günü', value: '0', icon: <BarChart color="primary" />, color: 'primary.main' },
];

const transactionHistory = [
  { date: '23.06.2025', type: 'Nakit', transactionType: 'Tahsilat', amount: '₺1.500,00', balance: '₺11.000,00', currency: 'TRY' },
  { date: '22.06.2025', type: 'Kredi Kartı', transactionType: 'Ödeme', amount: '$50,00', balance: '₺12.500,00', currency: 'USD' },
  { date: '21.06.2025', type: 'Havale/EFT', transactionType: 'Tahsilat', amount: '€100,00', balance: '₺12.650,00', currency: 'EUR' },
  { date: '20.06.2025', type: 'Nakit', transactionType: 'Ödeme', amount: '₺500,00', balance: '₺12.550,00', currency: 'TRY' },
];

const transactions = [
  { date: '01.08.2024 03:00', type: 'Çıkış', description: 'Satış Faturası', amount: '₺15.000,00', balance: '₺15.000,00', balanceStatus: 'Borcu Var', voucherNo: 'FAT-2024-101', currency: 'TRY' },
  { date: '15.08.2024 03:00', type: 'Giriş', description: 'Tahsilat Makbuzu', amount: '$500,00', balance: '₺5.000,00', balanceStatus: 'Borcu Var', voucherNo: 'MAK-2024-055', currency: 'USD' },
  { date: '05.07.2024 03:00', type: 'Çıkış', description: 'Satış Faturası', amount: '€750,00', balance: '₺12.500,00', balanceStatus: 'Borcu Var', voucherNo: 'FAT-2024-125', currency: 'EUR' },
  { date: '04.07.2024 03:00', type: 'Giriş', description: 'Tahsilat Makbuzu', amount: '₺2.000,00', balance: '₺10.500,00', balanceStatus: 'Borcu Var', voucherNo: 'MAK-2024-056', currency: 'TRY' },
];

const quickActions = ['Ödeme Ekle', 'Tahsilat Ekle', 'Fatura Oluştur', 'Tahsilat Talep Et', 'Hesaplar Arası Virman'];

interface SavedAddress {
  id: number;
  type: string;
  name: string;
  address: string;
  location: string;
}

const smsLogs = [
  { id: 1, date: '23/06/2025:16:53', sms: 'Happ-Sms', senderName: 'Yiğit Kemal', header: 'Test Header', status: 'Success', content: 'This is a test sms' },
];

const mailLogs = [
  { id: 1, date: '23/06/2025:16:53', email: 'sczdemir06@gmail.com', senderName: 'Yiğit Kemal', header: 'Test Header', status: 'Success', content: 'This is a test email' },
];

const addedDiscounts = [
  { id: 1, name: 'elbise', value: '10%', limit: '₺1.000,00', startDate: '23.06.2025', endDate: '24.06.2025' },
];

const passwordChangeHistory = [
  { date: '23/06/2025:20:10', ipAddress: '88.247.123.123', location: 'TR - Türkiye' },
  { date: '22/06/2025:15:30', ipAddress: '88.247.123.123', location: 'TR - Türkiye' },
];

const customerNotes = [
  { id: 1, author: 'Ahmet Durmaz', date: '23/06/2025:19:12', content: 'riskli birisi' },
];

const addedRisks = [
  { id: 1, type: 'çek', limit: '$100,00', permission: 'izin-ver', alertValue: '$50,00' },
];

const savedAddresses: SavedAddress[] = [
  { id: 1, type: 'Teslimat', name: 'Ahmet Durmaz', address: 'Dünya ticaret merkezi business part flurya', location: 'İstanbul/İstanbul' },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>{children}</Box>
      )}
    </div>
  );
}

const AddCustomerPage = () => {
  const cities = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya'];
  const districts = ['Kadıköy', 'Beşiktaş', 'Üsküdar', 'Fatih', 'Beyoğlu'];
  const [tabValue, setTabValue] = useState(1);
  const [subTabValue, setSubTabValue] = useState(0);
  const [customerType, setCustomerType] = useState('gercek_kisi');
  const [transactionTab, setTransactionTab] = useState(1);
  const [riskTabValue, setRiskTabValue] = useState(1);
  const [mailModalOpen, setMailModalOpen] = useState(false);
  const [selectedMail, setSelectedMail] = useState<any>(null);
  const [smsModalOpen, setSmsModalOpen] = useState(false);
  const [selectedSms, setSelectedSms] = useState<any>(null);
  const [note, setNote] = useState('');
  const [currency, setCurrency] = useState('all');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [ekstreAnchorEl, setEkstreAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const ekstreOpen = Boolean(ekstreAnchorEl);

  const filteredTransactions = transactions.filter(t =>
    currency === 'all' || t.currency.toLowerCase() === currency.toLowerCase()
  );

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEkstreClick = (event: React.MouseEvent<HTMLElement>) => {
    setEkstreAnchorEl(event.currentTarget);
  };
  const handleEkstreClose = () => {
    setEkstreAnchorEl(null);
  };

  const handleTransactionTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTransactionTab(newValue);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSubTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSubTabValue(newValue);
  };

  const handleRiskTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setRiskTabValue(newValue);
  };

  const handleOpenMailModal = (mail: any) => {
    setSelectedMail(mail);
    setMailModalOpen(true);
  };

  const handleCloseMailModal = () => {
    setMailModalOpen(false);
    setSelectedMail(null);
  };

  const handleOpenSmsModal = (sms: any) => {
    setSelectedSms(sms);
    setSmsModalOpen(true);
  };

  const handleCloseSmsModal = () => {
    setSmsModalOpen(false);
    setSelectedSms(null);
  };

  const DocumentUploadCard = ({ title, description, uploaded }: { title: string, description: string, uploaded: boolean }) => (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
        <Box>
          <Typography variant="h6" component="div">{title}</Typography>
          <Typography variant="body2" color="text.secondary">{description}</Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          {uploaded ? (
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Button fullWidth variant="outlined" startIcon={<Visibility />}>Görüntüle</Button>
              </Grid>
              <Grid item xs={6}>
                <Button fullWidth variant="outlined" color="error" startIcon={<DeleteIcon />}>Sil</Button>
              </Grid>
            </Grid>
          ) : (
            <Button fullWidth variant="contained" component="label" startIcon={<CloudUploadIcon />} sx={{ bgcolor: 'grey.200', color: 'black', '&:hover': { bgcolor: 'grey.300' } }}>
              Dosya Seçiniz
              <input type="file" hidden />
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  const categories = [
    { id: 0, label: 'Müşteri Bilgileri', icon: <Person fontSize="small" /> },
    { id: 1, label: 'Adresler', icon: <LocationOn fontSize="small" /> },
    { id: 2, label: 'Risk Tanımları', icon: <NotInterested fontSize="small" /> },
    { id: 3, label: '% İndirim Tanımları', icon: <Discount fontSize="small" /> },
    { id: 4, label: 'Depolar/Şubeler', icon: <Storefront fontSize="small" /> },
    { id: 5, label: 'Notlar', icon: <Note fontSize="small" /> },
    { id: 6, label: 'Belgeler', icon: <DescriptionIcon fontSize="small" /> },
    { id: 7, label: 'Bankalar', icon: <AccountBalanceWallet fontSize="small" /> },
    { id: 8, label: 'Mail', icon: <Mail fontSize="small" /> },
    { id: 9, label: 'SMS', icon: <Sms fontSize="small" /> },
  ];

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', bgcolor: '#f4f6f8' }}>
      <Box sx={{ mb: 2 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => window.history.back()}>
          Müşteri Listesine Geri Dön
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flex: 1, bgcolor: 'white', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden', flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Sol Sidebar */}
        <Box sx={{
          width: { xs: '100%', md: '280px' },
          bgcolor: '#f8f9fa',
          borderRight: '1px solid #e9ecef',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #e9ecef' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Kategori ara..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#6c757d' }} />
                  </InputAdornment>
                )
              }}
            />
          </Box>
          <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
            {categories.map((category) => (
              <Box
                key={category.id}
                onClick={() => setTabValue(category.id)}
                sx={{
                  p: 1.5,
                  mb: 0.5,
                  borderRadius: 2,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  bgcolor: tabValue === category.id ? '#667eea' : 'transparent',
                  color: tabValue === category.id ? 'white' : '#495057',
                  fontWeight: tabValue === category.id ? 600 : 400,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: tabValue === category.id ? '#667eea' : '#e9ecef',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'inherit' }}>{category.icon}</Box>
                <Typography variant="body2" sx={{ fontWeight: 'inherit', color: 'inherit' }}>
                  {category.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Sağ İçerik Alanı */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box sx={{ p: 3, borderBottom: '1px solid #e9ecef', bgcolor: 'white' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#495057', display: 'flex', alignItems: 'center', gap: 1 }}>
              {categories.find(c => c.id === tabValue)?.icon} {categories.find(c => c.id === tabValue)?.label}
            </Typography>
            <Typography variant="body2" sx={{ color: '#6c757d', mt: 0.5 }}>
              Bu kategoride müşteriye ait bilgileri yönetebilirsiniz.
            </Typography>
          </Box>

          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#fafafa' }}>
                <Tabs
                  value={subTabValue}
                  onChange={handleSubTabChange}
                  sx={{
                    minHeight: '48px',
                    '.MuiTab-root': { textTransform: 'none', color: '#666', fontWeight: 400, minHeight: '48px' },
                    '.Mui-selected': {
                      color: '#ef4444 !important',
                    },
                    '.MuiTabs-indicator': {
                      backgroundColor: '#ef4444'
                    }
                  }}
                >
                  <Tab label="Transferler" icon={<TransferWithinAStation fontSize="small" />} iconPosition="start" />
                  <Tab label="Gerçekleşmemiş Satışlar" icon={<PointOfSale fontSize="small" />} iconPosition="start" />
                  <Tab label="Şifre" icon={<Settings fontSize="small" />} iconPosition="start" />
                </Tabs>
              </Box>
              <TabPanel value={subTabValue} index={0}>
                <Box sx={{ p: 3 }}>
                  <Paper variant="outlined" sx={{ p: 3, overflow: 'visible' }}>
                    <Typography variant="h6">Müşteri Bilgileri</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Müşteriye ait temel bilgileri buradan yönetebilirsiniz.</Typography>
                    <Grid container spacing={3} sx={{ mt: 2 }}>
                      <Grid item xs={12} md={2} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
                        <Avatar sx={{ width: 100, height: 100, mb: 2, bgcolor: '#e0e0e0' }}>XX</Avatar>
                        <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
                          Yükle
                          <input type="file" hidden />
                        </Button>
                      </Grid>
                      <Grid item xs={12} md={10}>
                        <Grid container spacing={2} rowSpacing={3}>
                          <Grid item xs={12}>
                            <InputLabel shrink sx={{ fontSize: '0.875rem', fontWeight: 500, mb: 1 }}>Müşteri Tipi *</InputLabel>
                            <FormControl fullWidth>
                              <Select value={customerType} onChange={(e) => setCustomerType(e.target.value)} size="small">
                                <MenuItem value="gercek_kisi">Gerçek Kişi</MenuItem>
                                <MenuItem value="sirket">Şirket</MenuItem>
                                <MenuItem value="her_ikisi">Her İkisi</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>

                          {customerType === 'gercek_kisi' && (
                            <>
                              <Grid item xs={12} md={6}>
                                <InputLabel shrink sx={{ fontSize: '0.875rem', fontWeight: 500, mb: 1 }}>Ad *</InputLabel>
                                <TextField fullWidth size="small" />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <InputLabel shrink sx={{ fontSize: '0.875rem', fontWeight: 500, mb: 1 }}>Soyad *</InputLabel>
                                <TextField fullWidth size="small" />
                              </Grid>
                            </>
                          )}
                          {(customerType === 'sirket' || customerType === 'her_ikisi') && (
                            <>
                              <Grid item xs={12}>
                                <InputLabel shrink sx={{ fontSize: '0.875rem', fontWeight: 500, mb: 1 }}>Firma Unvanı *</InputLabel>
                                <TextField fullWidth size="small" />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <InputLabel shrink sx={{ fontSize: '0.875rem', fontWeight: 500, mb: 1 }}>Yetkili Adı</InputLabel>
                                <TextField fullWidth size="small" />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <InputLabel shrink sx={{ fontSize: '0.875rem', fontWeight: 500, mb: 1 }}>Yetkili Soyadı</InputLabel>
                                <TextField fullWidth size="small" />
                              </Grid>
                            </>
                          )}

                          <Grid item xs={12} md={6}>
                            <InputLabel shrink sx={{ fontSize: '0.875rem', fontWeight: 500, mb: 1 }}>Müşteri Kodu</InputLabel>
                            <TextField fullWidth size="small" defaultValue="M554967" InputProps={{ readOnly: true, endAdornment: <InputAdornment position="end"><IconButton size="small" sx={{ mr: '-8px', bgcolor: '#3b82f6', color: 'white', borderRadius: '4px', '&:hover': { bgcolor: '#2563eb' } }}><RefreshIcon fontSize="small" /></IconButton></InputAdornment> }} />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <InputLabel shrink sx={{ fontSize: '0.875rem', fontWeight: 500, mb: 1 }}>Email *</InputLabel>
                            <TextField fullWidth size="small" type="email" InputProps={{ endAdornment: <InputAdornment position="end"><IconButton size="small" sx={{ mr: '-8px', bgcolor: '#3b82f6', color: 'white', borderRadius: '4px', '&:hover': { bgcolor: '#2563eb' } }}><RefreshIcon fontSize="small" /></IconButton></InputAdornment> }} />
                          </Grid>
                        </Grid>
                        <Divider sx={{ my: 3 }} />
                        <Grid container spacing={2} rowSpacing={3}>
                          <Grid item xs={12} md={6}>
                            <InputLabel shrink sx={{ fontSize: '0.875rem', fontWeight: 500, mb: 1 }}>İş Telefonu</InputLabel>
                            <PhoneInput
                              country={'tr'}
                              inputStyle={{ width: '100%' }}
                              enableSearch={true}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <InputLabel shrink sx={{ fontSize: '0.875rem', fontWeight: 500, mb: 1 }}>Cep Telefonu</InputLabel>
                            <PhoneInput
                              country={'tr'}
                              inputStyle={{ width: '100%' }}
                              enableSearch={true}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <InputLabel shrink sx={{ fontSize: '0.875rem', fontWeight: 500, mb: 1 }}>Ülke *</InputLabel>
                            <FormControl fullWidth>
                              <Select defaultValue="turkiye" size="small">
                                <MenuItem value="turkiye">Türkiye</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <InputLabel shrink sx={{ fontSize: '0.875rem', fontWeight: 500, mb: 1 }}>Şehir *</InputLabel>
                            <Autocomplete
                              options={cities}
                              renderInput={(params) => <TextField {...params} size="small" placeholder="İl seçiniz..." />}
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <InputLabel shrink sx={{ fontSize: '0.875rem', fontWeight: 500, mb: 1 }}>İlçe</InputLabel>
                            <Autocomplete
                              options={districts}
                              renderInput={(params) => <TextField {...params} size="small" placeholder="İlçe seçiniz..." />}
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <InputLabel shrink sx={{ fontSize: '0.875rem', fontWeight: 500, mb: 1 }}>Durum</InputLabel>
                            <FormControl fullWidth>
                              <Select defaultValue="aktif" size="small">
                                <MenuItem value="aktif">Aktif</MenuItem>
                                <MenuItem value="pasif">Pasif</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <InputLabel shrink sx={{ fontSize: '0.875rem', fontWeight: 500, mb: 1 }}>Para Birimi *</InputLabel>
                            <FormControl fullWidth>
                              <Select defaultValue="try" size="small">
                                <MenuItem value="try">TRY</MenuItem>
                                <MenuItem value="usd">USD</MenuItem>
                                <MenuItem value="eur">EUR</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <InputLabel shrink sx={{ fontSize: '0.875rem', fontWeight: 500, mb: 1 }}>Müşteri Grubu *</InputLabel>
                            <FormControl fullWidth>
                              <Select defaultValue="turkiye" size="small">
                                <MenuItem value="turkiye">TÜRKİYE</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12}>
                            <InputLabel shrink sx={{ fontSize: '0.875rem', fontWeight: 500, mb: 1 }}>Açıklama</InputLabel>
                            <TextField fullWidth multiline rows={4} size="small" />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
              </TabPanel>
              <TabPanel value={subTabValue} index={1}>
                <Box sx={{ p: 3 }}>
                  <Typography>Gerçekleşmemiş Satışlar</Typography>
                </Box>
              </TabPanel>
              <TabPanel value={subTabValue} index={2}>
                <Box sx={{ p: 3 }}>
                  <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardHeader title="Şifre Değiştir" />
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField fullWidth type="password" label="Yeni Şifre" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField fullWidth type="password" label="Yeni Şifre Tekrar" />
                        </Grid>
                      </Grid>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                      <Button variant="contained">Kaydet</Button>
                    </CardActions>
                  </Card>
                  <Card variant="outlined">
                    <CardHeader title="Şifre Değiştirme Geçmişi" />
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Tarih</TableCell>
                            <TableCell>IP Adresi</TableCell>
                            <TableCell>Konum</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {passwordChangeHistory.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell>{row.date}</TableCell>
                              <TableCell>{row.ipAddress}</TableCell>
                              <TableCell>{row.location}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Card>
                </Box>
              </TabPanel>
            </TabPanel>



            <TabPanel value={tabValue} index={1}>
              <Box>
                <Card variant="outlined">
                  <CardHeader title="Yeni Adres Ekle" sx={{ bgcolor: 'grey.100' }} />
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Tipi</InputLabel>
                          <Select label="Tipi" defaultValue="teslimat">
                            <MenuItem value="teslimat">Teslimat Adresi</MenuItem>
                            <MenuItem value="fatura">Fatura Adresi</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Adı" />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel control={<Switch />} label="Varsayılan Adres" />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField fullWidth multiline rows={3} label="Adres" />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel control={<Checkbox />} label="Adres Yurtdışında" />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                          <InputLabel>Ülke</InputLabel>
                          <Select label="Ülke" defaultValue="TR">
                            <MenuItem value="TR">Türkiye</MenuItem>
                            <MenuItem value="US">USA</MenuItem>
                            <MenuItem value="DE">Germany</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField fullWidth label="İl" />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField fullWidth label="İlçe" />
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end', p: 2, borderTop: '1px solid #eee' }}>
                    <Button variant="contained" color="error" startIcon={<CloseIcon />}>Vazgeç</Button>
                    <Button variant="contained" color="success" startIcon={<SaveIcon />}>Kaydet</Button>
                  </CardActions>
                </Card>

                <Card variant="outlined" sx={{ mt: 3 }}>
                  <CardHeader title="Kayıtlı Adresler" sx={{ bgcolor: 'grey.100' }} />
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Tipi</TableCell>
                          <TableCell>Adı</TableCell>
                          <TableCell>Adres</TableCell>
                          <TableCell>İl/İlçe</TableCell>
                          <TableCell align="right">İşlem</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {savedAddresses.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>{row.type}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.address}</TableCell>
                            <TableCell>{row.location}</TableCell>
                            <TableCell align="right">
                              <IconButton size="small"><Edit fontSize="small" /></IconButton>
                              <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box sx={{ p: 2, textAlign: 'right', borderTop: '1px solid #eee' }}>
                    <Typography variant="caption">Toplam Kayıt: 1</Typography>
                  </Box>
                </Card>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Box>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#fafafa' }}>
                  <Tabs
                    value={riskTabValue}
                    onChange={handleRiskTabChange}
                    sx={{
                      minHeight: '48px',
                      '.MuiTab-root': { textTransform: 'none', color: '#666', fontWeight: 400, minHeight: '48px' },
                      '.Mui-selected': { color: '#ef4444 !important' },
                      '.MuiTabs-indicator': { backgroundColor: '#ef4444' }
                    }}
                  >
                    <Tab label="Risk Tanımları" />
                    <Tab label="İndirim Tanımları" />
                  </Tabs>
                </Box>
                <TabPanel value={riskTabValue} index={0}>
                  <Box sx={{ p: 3 }}>
                    <Card variant="outlined">
                      <CardContent>
                        <Grid container spacing={2} alignItems="flex-end">
                          <Grid item xs={12} sm={2.4}>
                            <FormControl fullWidth size="small">
                              <InputLabel>Tip</InputLabel>
                              <Select label="Tip" defaultValue="cek">
                                <MenuItem value="cek">Çek</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={2.4}>
                            <TextField fullWidth label="Evrak Risk Toplamı" size="small" defaultValue="0.00" />
                          </Grid>
                          <Grid item xs={12} sm={2.4}>
                            <FormControl fullWidth size="small">
                              <InputLabel>Satış İzni</InputLabel>
                              <Select label="Satış İzni" defaultValue="izin-ver">
                                <MenuItem value="izin-ver">İzin Ver</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={2.4}>
                            <TextField fullWidth label="Uyan Değeri" size="small" defaultValue="0.00" />
                          </Grid>
                          <Grid item xs={12} sm={2.4}>
                            <FormControl fullWidth size="small">
                              <InputLabel>Para Birimi</InputLabel>
                              <Select label="Para Birimi" defaultValue="try">
                                <MenuItem value="try">Türk Lirası</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'flex-end', p: 2, borderTop: '1px solid #eee' }}>
                        <Button variant="contained" color="error">Temizle</Button>
                        <Button variant="contained" color="success">Kaydet</Button>
                      </CardActions>
                    </Card>

                    <Card variant="outlined" sx={{ mt: 3 }}>
                      <CardHeader title="Eklenmiş Risk Tanımları" sx={{ bgcolor: 'grey.100' }} />
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Tip</TableCell>
                              <TableCell>Limit Tutarı</TableCell>
                              <TableCell>Satış İzni</TableCell>
                              <TableCell>Uyan Değeri</TableCell>
                              <TableCell align="right">İşlem</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {addedRisks.map((row) => (
                              <TableRow key={row.id}>
                                <TableCell>{row.type}</TableCell>
                                <TableCell>{row.limit}</TableCell>
                                <TableCell>{row.permission}</TableCell>
                                <TableCell>{row.alertValue}</TableCell>
                                <TableCell align="right">
                                  <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Card>
                  </Box>
                </TabPanel>
                <TabPanel value={riskTabValue} index={1}>
                  <Box sx={{ p: 3 }}>
                    <Card variant="outlined">
                      <CardContent>
                        <Grid container spacing={2} alignItems="flex-end">
                          <Grid item xs={12} sm={2.4}>
                            <TextField fullWidth label="İndirim Adı" size="small" />
                          </Grid>
                          <Grid item xs={12} sm={2.4}>
                            <TextField fullWidth label="İndirim Değeri" size="small" InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }} />
                          </Grid>
                          <Grid item xs={12} sm={2.4}>
                            <TextField fullWidth label="Alt Limit" size="small" />
                          </Grid>
                          <Grid item xs={12} sm={2.4}>
                            <FormControl fullWidth size="small">
                              <InputLabel>Kategoriler</InputLabel>
                              <Select label="Kategoriler" defaultValue="all">
                                <MenuItem value="all">Tüm Kategoriler</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={1.2}>
                            <TextField fullWidth label="Başlangıç Tarihi" size="small" type="date" InputLabelProps={{ shrink: true }} />
                          </Grid>
                          <Grid item xs={12} sm={1.2}>
                            <TextField fullWidth label="Bitiş Tarihi" size="small" type="date" InputLabelProps={{ shrink: true }} />
                          </Grid>
                        </Grid>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'flex-end', p: 2, borderTop: '1px solid #eee' }}>
                        <Button variant="contained" color="error">Temizle</Button>
                        <Button variant="contained" color="success">Kaydet</Button>
                      </CardActions>
                    </Card>

                    <Card variant="outlined" sx={{ mt: 3 }}>
                      <CardHeader title="Eklenmiş İndirimler" sx={{ bgcolor: 'grey.100' }} />
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>İndirim Adı</TableCell>
                              <TableCell>İndirim Değeri</TableCell>
                              <TableCell>Alt Limit</TableCell>
                              <TableCell>Başlangıç Tarihi</TableCell>
                              <TableCell>Bitiş Tarihi</TableCell>
                              <TableCell align="right">İşlem</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {addedDiscounts.map((row) => (
                              <TableRow key={row.id}>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.value}</TableCell>
                                <TableCell>{row.limit}</TableCell>
                                <TableCell>{row.startDate}</TableCell>
                                <TableCell>{row.endDate}</TableCell>
                                <TableCell align="right">
                                  <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Card>
                  </Box>
                </TabPanel>
              </Box>
            </TabPanel>
            <TabPanel value={tabValue} index={3}><Box sx={{ p: 3 }}>İndirim Tanımları</Box></TabPanel>
            <TabPanel value={tabValue} index={4}><Box sx={{ p: 3 }}>Depolar/Şubeler</Box></TabPanel>
            <TabPanel value={tabValue} index={5}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Notlar</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Notlar *"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                  <Button variant="contained" color="error" sx={{ mr: 1 }}>Vazgeç</Button>
                  <Button variant="contained" color="primary">Kaydet</Button>
                </Box>

                {customerNotes.map((noteItem) => (
                  <Card key={noteItem.id} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2 }}><Person /></Avatar>
                          <Box>
                            <Typography variant="subtitle1">{noteItem.author}</Typography>
                            <Typography variant="body2" color="text.secondary">{noteItem.date}</Typography>
                          </Box>
                        </Box>
                        <Box>
                          <IconButton size="small" color="primary"><Edit /></IconButton>
                          <IconButton size="small" color="error"><DeleteIcon /></IconButton>
                        </Box>
                      </Box>
                      <Typography sx={{ mt: 2 }}>{noteItem.content}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </TabPanel>
            <TabPanel value={tabValue} index={6}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>Yüklenmesi Gereken Belgeler</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <DocumentUploadCard title="Onaylı Fiyat Teklifi" description="Firmanıza ait Onaylı Fiyat Teklifi 'yükleyiniz" uploaded={false} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <DocumentUploadCard title="Onaylı Sözleşme" description="Firmanıza ait Onaylı Sözleşme 'yükleyiniz" uploaded={false} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <DocumentUploadCard title="Vergi Levhası" description="Firmanıza ait Vergi Levhası 'yükleyiniz" uploaded={true} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <DocumentUploadCard title="Kimlik" description="Firmanıza ait Kimlik 'yükleyiniz" uploaded={false} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <DocumentUploadCard title="Fiyat Teklifi" description="Firmanıza ait Fiyat Teklifi 'yükleyiniz" uploaded={false} />
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
            <TabPanel value={tabValue} index={7}>
              <Box sx={{ p: 3 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Hesap Sahibi" />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Hesap Numarası" InputProps={{ endAdornment: <InputAdornment position="end">#</InputAdornment> }} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Banka Adı</InputLabel>
                          <Select label="Banka Adı">
                            <MenuItem value=""><em>Seçiniz</em></MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                          <InputLabel>Ülke Kodu</InputLabel>
                          <Select label="Ülke Kodu" defaultValue="TR">
                            <MenuItem value="TR">TR, Türkiye</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField fullWidth label="IBAN Numarası" InputProps={{ endAdornment: <InputAdornment position="end"><AccountBalance /></InputAdornment> }} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Şube Kodu</InputLabel>
                          <Select label="Şube Kodu">
                            <MenuItem value=""><em>Seçiniz</em></MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end', p: 2, borderTop: '1px solid #eee' }}>
                    <Button variant="contained" color="error">Temizle</Button>
                    <Button variant="contained" color="success">Kaydet</Button>
                  </CardActions>
                </Card>

                <Card variant="outlined" sx={{ mt: 3 }}>
                  <CardHeader title="Eklenmiş Bankalar" sx={{ bgcolor: 'grey.100' }} />
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Banka Adı</TableCell>
                          <TableCell>Şubesi</TableCell>
                          <TableCell>Hesap Numarası</TableCell>
                          <TableCell>IBAN</TableCell>
                          <TableCell align="right">İşlem</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            Kayıt Bulunamadı
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
              </Box>
            </TabPanel>
            <TabPanel value={tabValue} index={8}>
              <Box sx={{ p: 3 }}>
                <Card variant="outlined">
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Oluşturulma Tarihi</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>senderName</TableCell>
                          <TableCell>header</TableCell>
                          <TableCell>Başarılı</TableCell>
                          <TableCell>İçerik</TableCell>
                          <TableCell>İşlemler</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {mailLogs.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>{row.id}</TableCell>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.email}</TableCell>
                            <TableCell>{row.senderName}</TableCell>
                            <TableCell>{row.header}</TableCell>
                            <TableCell>{row.status}</TableCell>
                            <TableCell>{row.content}</TableCell>
                            <TableCell>
                              <IconButton color="primary" onClick={() => handleOpenMailModal(row)}>
                                <Mail />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
              </Box>
            </TabPanel>
            <TabPanel value={tabValue} index={9}>
              <Box sx={{ p: 3 }}>
                <Card variant="outlined">
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Oluşturulma Tarihi</TableCell>
                          <TableCell>SMS</TableCell>
                          <TableCell>senderName</TableCell>
                          <TableCell>Başlık</TableCell>
                          <TableCell>Başarılı</TableCell>
                          <TableCell>İçerik</TableCell>
                          <TableCell>İşlemler</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {smsLogs.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>{row.id}</TableCell>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.sms}</TableCell>
                            <TableCell>{row.senderName}</TableCell>
                            <TableCell>{row.header}</TableCell>
                            <TableCell>{row.status}</TableCell>
                            <TableCell>{row.content}</TableCell>
                            <TableCell>
                              <IconButton color="primary" onClick={() => handleOpenSmsModal(row)}>
                                <Sms />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
              </Box>
            </TabPanel>

            <Modal
              open={smsModalOpen}
              onClose={handleCloseSmsModal}
              aria-labelledby="sms-detail-modal-title"
              aria-describedby="sms-detail-modal-description"
            >
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 600,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
              }}>
                <Typography id="sms-detail-modal-title" variant="h6" component="h2">
                  SMS Detayı
                </Typography>
                {selectedSms && (
                  <Box id="sms-detail-modal-description" sx={{ mt: 2 }}>
                    <Typography><strong>From:</strong> {selectedSms.senderName}</Typography>
                    <Typography><strong>To:</strong> {selectedSms.sms}</Typography>
                    <Typography><strong>Header:</strong> {selectedSms.header}</Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography>{selectedSms.content}</Typography>
                  </Box>
                )}
                <Button onClick={handleCloseSmsModal} sx={{ mt: 2 }}>Kapat</Button>
              </Box>
            </Modal>

            <Modal
              open={mailModalOpen}
              onClose={handleCloseMailModal}
              aria-labelledby="mail-detail-modal-title"
              aria-describedby="mail-detail-modal-description"
            >
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 600,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
              }}>
                <Typography id="mail-detail-modal-title" variant="h6" component="h2">
                  Mail Detayı
                </Typography>
                {selectedMail && (
                  <Box id="mail-detail-modal-description" sx={{ mt: 2 }}>
                    <Typography><strong>From:</strong> {selectedMail.senderName}</Typography>
                    <Typography><strong>To:</strong> {selectedMail.email}</Typography>
                    <Typography><strong>Header:</strong> {selectedMail.header}</Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography>{selectedMail.content}</Typography>
                  </Box>
                )}
                <Button onClick={handleCloseMailModal} sx={{ mt: 2 }}>Kapat</Button>
              </Box>
            </Modal>
          </Box>

          <Box sx={{ p: 3, borderTop: '1px solid #e9ecef', bgcolor: '#f8f9fa', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" startIcon={<CloseIcon />}>İptal</Button>
            <Button variant="contained" startIcon={<SaveIcon />} sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>Müşteri Ekle</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddCustomerPage;
