import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScreenInches } from '../hooks/useScreenInches';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  InputAdornment,
  Select, 
  MenuItem, 
  SelectChangeEvent, 
  FormControl, 
  InputLabel, 
  Collapse, 
  Paper, 
  IconButton, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Avatar, 
  Menu, 
  Divider, 
  ListItemIcon, 
  ListItemText, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Chip, 
  TablePagination, 
  FormControlLabel, 
  Switch, 
  Stack, 
  Tooltip,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Add as AddIcon,
  PersonAdd as PersonAddIcon,
  Login as LoginIcon,
  ShoppingCart as ShoppingCartIcon,
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExpandLess as ExpandLessIcon,
  Close as CloseIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Sms as SmsIcon,
  LocalShipping as ShippingIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  AccountBalance as AccountBalanceIcon,
  Menu as MenuIcon,
  FileDownload as ExportIcon,
  Print as PrintIcon,

  ShoppingCart as SalesIcon,
  Description as KargolarIcon,
  Person as PersonIcon,
  Person,
  Public as PublicIcon,
  Sell as SellIcon,
  FormatBold as FormatBoldIcon,
  FormatItalic as FormatItalicIcon,
  FormatUnderlined as FormatUnderlinedIcon,
  FormatListBulleted as FormatListBulletedIcon,
  FormatListNumbered as FormatListNumberedIcon,
  FormatAlignLeft as FormatAlignLeftIcon,
  FormatAlignCenter as FormatAlignCenterIcon,
  FormatAlignRight as FormatAlignRightIcon,
  LocationOn as LocationOnIcon,
  DateRange as DateRangeIcon,
} from '@mui/icons-material';

// Özel bileşenleri import et
import CustomerCard from '../components/customers/CustomerCard';
import CustomerSmsDialog from '../components/customers/CustomerSmsDialog';
import CustomerEmailDialog from '../components/customers/CustomerEmailDialog';
import MailDialog from '../components/mail/MailDialog';
import CustomerDeleteDialog from '../components/customers/CustomerDeleteDialog';
import CustomerImportDialog from '../components/customers/CustomerImportDialog';
import CustomPagination from '../components/common/CustomPagination';
import DataTable, { Column } from '../components/common/DataTable';
import { useLanguage } from '../contexts/LanguageContext';
import { Customer } from '../types/Customer';
import ExportButton from '../components/common/ExportButton';
import PrintButton from '../components/common/PrintButton';
import colors from '../theme/colors';
import * as XLSX from 'xlsx';
import { notifySuccess, notifyError, notifyWarning } from '../utils/notification';
import { useNotifications } from '../contexts/NotificationContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import HookForm from '../components/form/HookForm';
import { FormField, ValidationPatterns } from '../types/FormField';



// Filtre alanları için arayüz
interface FilterField {
  id: string;
  label: string;
  type: string;
  options?: Array<{value: string, label: string}>;
  children?: Array<{value: string, label: string, parent: string, children?: Array<{value: string, label: string, parent: string}>}>;
}

// Konum veri tipi
interface LocationData {
  country: string;
  city: string;
  district: string;
}



// Renk oluşturma fonksiyonu
function stringToColor(string: string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

// İsim baş harfleri fonksiyonu
function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

// Finansal durum tipi
type FinancialStatus = 'all' | 'balance' | 'debtor' | 'creditor';

// Parti tipi
type PartyType = 'all' | 'buyer' | 'seller';

// CustomerFormContent bileşeni
interface CustomerFormContentProps {
  editingCustomer: any;
  onSubmit: (data: any) => void;
  onClose: () => void;
}

const CustomerFormContent: React.FC<CustomerFormContentProps> = ({ editingCustomer, onSubmit, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('info');
  const [selectedCountryCode, setSelectedCountryCode] = useState('tr');
  const [countryMenuAnchor, setCountryMenuAnchor] = useState<null | HTMLElement>(null);
  
  // Form state
  const [customerType, setCustomerType] = useState('individual');
  const [formCountry, setFormCountry] = useState('turkey');
  const [selectedCity, setSelectedCity] = useState('istanbul');
  const [selectedDistrict, setSelectedDistrict] = useState('kadikoy');
  const [customerStatus, setCustomerStatus] = useState('active');
  const [currency, setCurrency] = useState('try');
  const [customerGroup, setCustomerGroup] = useState('turkey');
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedBankCountry, setSelectedBankCountry] = useState('TR');
  const [selectedBranchCode, setSelectedBranchCode] = useState('');
  
  const countries = [
    { code: 'tr', name: 'Türkiye', flag: '🇹🇷', dialCode: '+90' },
    { code: 'us', name: 'Amerika', flag: '🇺🇸', dialCode: '+1' },
    { code: 'de', name: 'Almanya', flag: '🇩🇪', dialCode: '+49' },
    { code: 'fr', name: 'Fransa', flag: '🇫🇷', dialCode: '+33' },
    { code: 'gb', name: 'İngiltere', flag: '🇬🇧', dialCode: '+44' },
    { code: 'it', name: 'İtalya', flag: '🇮🇹', dialCode: '+39' },
    { code: 'es', name: 'İspanya', flag: '🇪🇸', dialCode: '+34' },
    { code: 'nl', name: 'Hollanda', flag: '🇳🇱', dialCode: '+31' },
    { code: 'be', name: 'Belçika', flag: '🇧🇪', dialCode: '+32' },
    { code: 'ch', name: 'İsviçre', flag: '🇨🇭', dialCode: '+41' },
    { code: 'at', name: 'Avusturya', flag: '🇦🇹', dialCode: '+43' },
    { code: 'se', name: 'İsveç', flag: '🇸🇪', dialCode: '+46' },
    { code: 'no', name: 'Norveç', flag: '🇳🇴', dialCode: '+47' },
    { code: 'dk', name: 'Danimarka', flag: '🇩🇰', dialCode: '+45' },
    { code: 'fi', name: 'Finlandiya', flag: '🇫🇮', dialCode: '+358' },
    { code: 'ru', name: 'Rusya', flag: '🇷🇺', dialCode: '+7' },
    { code: 'cn', name: 'Çin', flag: '🇨🇳', dialCode: '+86' },
    { code: 'jp', name: 'Japonya', flag: '🇯🇵', dialCode: '+81' },
    { code: 'kr', name: 'Güney Kore', flag: '🇰🇷', dialCode: '+82' },
    { code: 'ae', name: 'BAE', flag: '🇦🇪', dialCode: '+971' },
    { code: 'sa', name: 'Suudi Arabistan', flag: '🇸🇦', dialCode: '+966' }
  ];
  
  const selectedCountry = countries.find(c => c.code === selectedCountryCode) || countries[0];
  
  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountryCode(countryCode);
    setCountryMenuAnchor(null);
  };
  
  const categories = [
    { id: 'info', label: 'Müşteri Bilgileri', icon: '👤', active: true },
    { id: 'address', label: 'Adresler', icon: '📍', active: false },
    { id: 'risk', label: 'Risk Tanımları', icon: '⚠️', active: false },
    { id: 'discount', label: '% İndirim Tanımları', icon: '💰', active: false },
    { id: 'warehouse', label: 'Depolar/Şubeler', icon: '🏪', active: false },
    { id: 'notes', label: 'Notlar', icon: '📝', active: false },
    { id: 'documents', label: 'Belgeler', icon: '📄', active: false },
    { id: 'banks', label: 'Bankalar', icon: '🏦', active: false },
    { id: 'mail', label: 'Mail', icon: '📧', active: false },
    { id: 'sms', label: 'SMS', icon: '📱', active: false }
  ];

  const renderCategoryContent = () => {
    switch (selectedCategory) {
      case 'info':
        return (
          <Card sx={{ border: '1px solid #e9ecef', borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar sx={{ width: 100, height: 100, mb: 2, bgcolor: '#e9ecef', color: '#6c757d', fontSize: '2rem' }}>👤</Avatar>
                    <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />} size="small">
                      Yükle
                      <input type="file" hidden accept="image/*" />
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} md={9}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Müşteri Tipi *</InputLabel>
                        <Select 
                          value={customerType} 
                          onChange={(e) => setCustomerType(e.target.value)}
                        >
                          <MenuItem value="individual">Gerçek Kişi</MenuItem>
                          <MenuItem value="corporate">Tüzel Kişi</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Ad *" size="small" required />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Soyad *" size="small" required />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField 
                        fullWidth 
                        label="Müşteri Kodu" 
                        size="small" 
                        defaultValue="M554967"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton size="small" sx={{ bgcolor: '#1976d2', color: 'white', width: 24, height: 24 }}>
                                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>G</span>
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField 
                        fullWidth 
                        label="E-mail *" 
                        type="email" 
                        size="small" 
                        required 
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton size="small" sx={{ bgcolor: '#1976d2', color: 'white', width: 24, height: 24 }}>
                                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>C</span>
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField 
                        fullWidth 
                        label="Telefon" 
                        size="small"
                        placeholder="5xx xxx xx xx"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 1 }}>
                                <Box 
                                  onClick={(e) => setCountryMenuAnchor(e.currentTarget)}
                                  sx={{ 
                                    width: 20, 
                                    height: 14, 
                                    background: '#e30a17',
                                    borderRadius: 0.5,
                                    border: '1px solid #ccc',
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    '&:hover': {
                                      opacity: 0.8
                                    }
                                  }}
                                >
                                  <Box sx={{ fontSize: '10px' }}>{selectedCountry.flag}</Box>
                                </Box>
                                <Typography variant="caption" sx={{ fontWeight: 500 }}>{selectedCountry.dialCode}</Typography>
                              </Box>
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField 
                        fullWidth 
                        label="Cep Telefonu" 
                        size="small"
                        placeholder="5xx xxx xx xx"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 1 }}>
                                <Box 
                                  onClick={(e) => setCountryMenuAnchor(e.currentTarget)}
                                  sx={{ 
                                    width: 20, 
                                    height: 14, 
                                    background: '#e30a17',
                                    borderRadius: 0.5,
                                    border: '1px solid #ccc',
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    '&:hover': {
                                      opacity: 0.8
                                    }
                                  }}
                                >
                                  <Box sx={{ fontSize: '10px' }}>{selectedCountry.flag}</Box>
                                </Box>
                                <Typography variant="caption" sx={{ fontWeight: 500 }}>{selectedCountry.dialCode}</Typography>
                              </Box>
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Ülke</InputLabel>
                        <Select 
                          value={formCountry} 
                          onChange={(e) => setFormCountry(e.target.value)}
                        >
                          <MenuItem value="turkey">Türkiye</MenuItem>
                          <MenuItem value="germany">Almanya</MenuItem>
                          <MenuItem value="usa">ABD</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Şehir</InputLabel>
                        <Select 
                          value={selectedCity} 
                          onChange={(e) => setSelectedCity(e.target.value)}
                        >
                          <MenuItem value="istanbul">İstanbul</MenuItem>
                          <MenuItem value="ankara">Ankara</MenuItem>
                          <MenuItem value="izmir">İzmir</MenuItem>
                          <MenuItem value="bursa">Bursa</MenuItem>
                          <MenuItem value="antalya">Antalya</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel>İlçe</InputLabel>
                        <Select 
                          value={selectedDistrict} 
                          onChange={(e) => setSelectedDistrict(e.target.value)}
                        >
                          <MenuItem value="kadikoy">Kadıköy</MenuItem>
                          <MenuItem value="besiktas">Beşiktaş</MenuItem>
                          <MenuItem value="sisli">Şişli</MenuItem>
                          <MenuItem value="uskudar">Üsküdar</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Durum</InputLabel>
                        <Select 
                          value={customerStatus} 
                          onChange={(e) => setCustomerStatus(e.target.value)}
                        >
                          <MenuItem value="active">Aktif</MenuItem>
                          <MenuItem value="passive">Pasif</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Para Birimi *</InputLabel>
                        <Select 
                          value={currency} 
                          onChange={(e) => setCurrency(e.target.value)}
                        >
                          <MenuItem value="try">TRY</MenuItem>
                          <MenuItem value="usd">USD</MenuItem>
                          <MenuItem value="eur">EUR</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Müşteri Grubu *</InputLabel>
                        <Select 
                          value={customerGroup} 
                          onChange={(e) => setCustomerGroup(e.target.value)}
                        >
                          <MenuItem value="turkey">TÜRKİYE</MenuItem>
                          <MenuItem value="export">İHRACAT</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField 
                        fullWidth 
                        label="Açıklama" 
                        multiline 
                        rows={3} 
                        size="small" 
                        placeholder="Müşteri hakkında açıklama..."
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );
      case 'address':
        return (
          <Box>
            {/* Yeni Adres Ekle Formu */}
            <Card sx={{ border: '1px solid #e9ecef', borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Yeni Adres Ekle</Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Tipi</InputLabel>
                      <Select defaultValue="teslimat">
                        <MenuItem value="teslimat">Teslimat Adresi</MenuItem>
                        <MenuItem value="fatura">Fatura Adresi</MenuItem>
                        <MenuItem value="iade">İade Adresi</MenuItem>
                        <MenuItem value="depo">Depo Adresi</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Adı" size="small" placeholder="Adres adı giriniz" />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Box sx={{ 
                        width: 20, 
                        height: 20, 
                        bgcolor: '#f0f0f0', 
                        borderRadius: 1, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                      }}>
                        📁
                      </Box>
                      <Typography variant="body2" sx={{ color: '#666' }}>Varsayılan Adres</Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField 
                      fullWidth 
                      label="Adres" 
                      multiline 
                      rows={3} 
                      size="small" 
                      placeholder="Detaylı adres bilgisi giriniz"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Switch size="small" />}
                      label="Adres Yurtdışında"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Ülke</InputLabel>
                      <Select defaultValue="turkey">
                        <MenuItem value="turkey">Türkiye</MenuItem>
                        <MenuItem value="usa">Amerika</MenuItem>
                        <MenuItem value="germany">Almanya</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel>İl</InputLabel>
                      <Select defaultValue="">
                        <MenuItem value="">İl seçiniz</MenuItem>
                        <MenuItem value="istanbul">İstanbul</MenuItem>
                        <MenuItem value="ankara">Ankara</MenuItem>
                        <MenuItem value="izmir">İzmir</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel>İlçe</InputLabel>
                      <Select defaultValue="">
                        <MenuItem value="">İlçe seçiniz</MenuItem>
                        <MenuItem value="kadikoy">Kadıköy</MenuItem>
                        <MenuItem value="besiktas">Beşiktaş</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                    <Button variant="outlined" color="error" size="small">
                      Vazgeç
                    </Button>
                    <Button variant="contained" color="success" size="small">
                      Kaydet
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            
            {/* Kayıtlı Adresler Listesi */}
            <Card sx={{ border: '1px solid #e9ecef', borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Kayıtlı Adresler</Typography>
                
                {/* Adres Listesi Başlıkları */}
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr 2fr 1fr 80px', 
                  gap: 2, 
                  p: 2, 
                  bgcolor: '#f8f9fa', 
                  borderRadius: 1, 
                  mb: 2,
                  fontWeight: 600,
                  fontSize: '14px'
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Tipi</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Adı</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Adres</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>İl/İlçe</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>İşlem</Typography>
                </Box>
                
                {/* Örnek Adres */}
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr 2fr 1fr 80px', 
                  gap: 2, 
                  p: 2, 
                  borderBottom: '1px solid #eee',
                  alignItems: 'center'
                }}>
                  <Typography variant="body2">Teslimat</Typography>
                  <Typography variant="body2">Ahmet Durmaz</Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Dünya ticaret merkezi business part florya
                  </Typography>
                  <Typography variant="body2">İstanbul/İstanbul</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" sx={{ color: '#1976d2' }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" sx={{ color: '#d32f2f' }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                
                {/* Toplam Kayıt */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mt: 2, 
                  pt: 2, 
                  borderTop: '1px solid #eee' 
                }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Toplam Kayıt: 1
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="outlined" size="small">
                      İptal
                    </Button>
                    <Button variant="contained" size="small">
                      Kaydet
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        );
      case 'risk':
        return (
          <Box>
            {/* Yeni İndirim Ekle Formu */}
            <Card sx={{ border: '1px solid #e9ecef', borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <TextField 
                      fullWidth 
                      label="İndirim Adı" 
                      size="small" 
                      placeholder="İndirim adı giriniz"
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField 
                      fullWidth 
                      label="İndirim Değeri" 
                      size="small" 
                      type="number"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField 
                      fullWidth 
                      label="Alt Limit" 
                      size="small" 
                      type="number"
                      placeholder="0.00"
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Kategoriler</InputLabel>
                      <Select defaultValue="all">
                        <MenuItem value="all">Tüm Kategoriler</MenuItem>
                        <MenuItem value="electronics">Elektronik</MenuItem>
                        <MenuItem value="clothing">Giyim</MenuItem>
                        <MenuItem value="books">Kitap</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={1.5}>
                    <TextField 
                      fullWidth 
                      label="Başlangıç Tarihi" 
                      size="small" 
                      type="date"
                      defaultValue="2025-01-01"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton size="small">
                              📅
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={1.5}>
                    <TextField 
                      fullWidth 
                      label="Bitiş Tarihi" 
                      size="small" 
                      type="date"
                      defaultValue="2025-12-31"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton size="small">
                              📅
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
                    <Button variant="outlined" color="error" size="small">
                      Temizle
                    </Button>
                    <Button variant="contained" color="success" size="small">
                      Kaydet
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            
            {/* Eklenmiş İndirimler Listesi */}
            <Card sx={{ border: '1px solid #e9ecef', borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Eklenmiş İndirimler</Typography>
                
                {/* Liste Başlıkları */}
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 80px', 
                  gap: 2, 
                  p: 2, 
                  bgcolor: '#f8f9fa', 
                  borderRadius: 1, 
                  mb: 2,
                  fontWeight: 600,
                  fontSize: '14px'
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>İndirim Adı</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>İndirim Değeri</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Alt Limit</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Başlangıç Tarihi</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Bitiş Tarihi</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>İşlem</Typography>
                </Box>
                
                {/* Örnek İndirim */}
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 80px', 
                  gap: 2, 
                  p: 2, 
                  borderBottom: '1px solid #eee',
                  alignItems: 'center'
                }}>
                  <Typography variant="body2">albice</Typography>
                  <Typography variant="body2">10%</Typography>
                  <Typography variant="body2">₺1.000,00</Typography>
                  <Typography variant="body2">23.06.2025</Typography>
                  <Typography variant="body2">24.06.2025</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" sx={{ color: '#d32f2f' }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                
                {/* Alt Butonlar */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  gap: 2, 
                  mt: 3, 
                  pt: 2, 
                  borderTop: '1px solid #eee' 
                }}>
                  <Button variant="outlined" size="small">
                    İptal
                  </Button>
                  <Button variant="contained" size="small">
                    Kaydet
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        );
      case 'discount':
        return (
          <Card sx={{ border: '1px solid #e9ecef', borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>💰 İndirim Tanımları</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Genel İndirim %" size="small" type="number" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Özel İndirim %" size="small" type="number" />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );
      case 'notes':
        return (
          <Box>
            {/* Yeni Not Ekle Formu */}
            <Card sx={{ border: '1px solid #e9ecef', borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Notlar</Typography>
                
                <TextField 
                  fullWidth 
                  label="Notlar *" 
                  multiline 
                  rows={6} 
                  size="small" 
                  placeholder="Müşteri hakkında önemli notlarınızı buraya yazabilirsiniz..."
                  sx={{ mb: 3 }}
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button variant="outlined" color="error" size="small">
                    Vazgeç
                  </Button>
                  <Button variant="contained" color="primary" size="small">
                    Kaydet
                  </Button>
                </Box>
              </CardContent>
            </Card>
            
            {/* Mevcut Notlar Listesi */}
            <Card sx={{ border: '1px solid #e9ecef', borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ p: 3 }}>
                {/* Örnek Not */}
                <Box sx={{ 
                  border: '1px solid #e9ecef', 
                  borderRadius: 2, 
                  p: 2, 
                  mb: 2,
                  bgcolor: '#fafafa'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#e0e0e0', color: '#666' }}>
                      <PersonIcon fontSize="small" />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                        Ahmet Durmaz
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        23/06/2025 16:12
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small" sx={{ color: '#1976d2' }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#d32f2f' }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.6 }}>
                    riskli birisi
                  </Typography>
                </Box>
                
                {/* Boş Durum Mesajı (Eğer başka not yoksa) */}
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 4, 
                  color: '#999',
                  display: 'none' // Örnek not olduğu için gizli
                }}>
                  <Typography variant="body2">
                    Henüz not eklenmemiş.
                  </Typography>
                </Box>
                
                {/* Alt Butonlar */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  gap: 2, 
                  mt: 3, 
                  pt: 2, 
                  borderTop: '1px solid #eee' 
                }}>
                  <Button variant="outlined" size="small">
                    İptal
                  </Button>
                  <Button variant="contained" size="small">
                    Kaydet
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        );
      case 'documents':
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Yüklenmeesi Gereken Belgeler</Typography>
            
            <Grid container spacing={3}>
              {/* Onaylı Fiyat Teklifi */}
              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  border: '1px solid #e9ecef', 
                  borderRadius: 3, 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  height: '200px',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      Onaylı Fiyat Teklifi
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mb: 3, flex: 1 }}>
                      Firmanıza ait Onaylı Fiyat Teklifi yükleyiniz
                    </Typography>
                    <Button 
                      variant="contained" 
                      component="label"
                      startIcon={<CloudUploadIcon />}
                      sx={{ 
                        bgcolor: '#6c757d',
                        '&:hover': { bgcolor: '#5a6268' },
                        borderRadius: 2
                      }}
                      fullWidth
                    >
                      Dosya Seçiniz
                      <input type="file" hidden accept=".pdf,.doc,.docx,.jpg,.png" />
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Onaylı Sözleşme */}
              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  border: '1px solid #e9ecef', 
                  borderRadius: 3, 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  height: '200px',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      Onaylı Sözleşme
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mb: 3, flex: 1 }}>
                      Firmanıza ait Onaylı Sözleşme yükleyiniz
                    </Typography>
                    <Button 
                      variant="contained" 
                      component="label"
                      startIcon={<CloudUploadIcon />}
                      sx={{ 
                        bgcolor: '#6c757d',
                        '&:hover': { bgcolor: '#5a6268' },
                        borderRadius: 2
                      }}
                      fullWidth
                    >
                      Dosya Seçiniz
                      <input type="file" hidden accept=".pdf,.doc,.docx,.jpg,.png" />
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Vergi Levhası */}
              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  border: '1px solid #e9ecef', 
                  borderRadius: 3, 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  height: '200px',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      Vergi Levhası
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mb: 3, flex: 1 }}>
                      Firmanıza ait Vergi Levhası yükleyiniz
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        variant="outlined" 
                        size="small"
                        startIcon={<VisibilityIcon />}
                        sx={{ 
                          color: '#1976d2',
                          borderColor: '#1976d2',
                          flex: 1
                        }}
                      >
                        Görüntüle
                      </Button>
                      <Button 
                        variant="contained" 
                        size="small"
                        sx={{ 
                          bgcolor: '#dc3545',
                          '&:hover': { bgcolor: '#c82333' },
                          flex: 1
                        }}
                      >
                        Sil
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Kimlik */}
              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  border: '1px solid #e9ecef', 
                  borderRadius: 3, 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  height: '200px',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      Kimlik
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mb: 3, flex: 1 }}>
                      Firmanıza ait Kimlik yükleyiniz
                    </Typography>
                    <Button 
                      variant="contained" 
                      component="label"
                      startIcon={<CloudUploadIcon />}
                      sx={{ 
                        bgcolor: '#6c757d',
                        '&:hover': { bgcolor: '#5a6268' },
                        borderRadius: 2
                      }}
                      fullWidth
                    >
                      Dosya Seçiniz
                      <input type="file" hidden accept=".pdf,.doc,.docx,.jpg,.png" />
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Fiyat Teklifi */}
              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  border: '1px solid #e9ecef', 
                  borderRadius: 3, 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  height: '200px',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      Fiyat Teklifi
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mb: 3, flex: 1 }}>
                      Firmanıza ait Fiyat Teklifi yükleyiniz
                    </Typography>
                    <Button 
                      variant="contained" 
                      component="label"
                      startIcon={<CloudUploadIcon />}
                      sx={{ 
                        bgcolor: '#6c757d',
                        '&:hover': { bgcolor: '#5a6268' },
                        borderRadius: 2
                      }}
                      fullWidth
                    >
                      Dosya Seçiniz
                      <input type="file" hidden accept=".pdf,.doc,.docx,.jpg,.png" />
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            {/* Alt Butonlar */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: 2, 
              mt: 4 
            }}>
              <Button variant="outlined" size="small">
                İptal
              </Button>
              <Button variant="contained" size="small">
                Kaydet
              </Button>
            </Box>
          </Box>
        );
      case 'banks':
        return (
          <Box>
            {/* Yeni Banka Ekle Formu */}
            <Card sx={{ border: '1px solid #e9ecef', borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  {/* İlk Satır */}
                  <Grid item xs={12} md={6}>
                    <TextField 
                      fullWidth 
                      label="Hesap Sahibi" 
                      size="small" 
                      placeholder="Hesap sahibinin adını giriniz"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField 
                      fullWidth 
                      label="Hesap Numarası" 
                      size="small" 
                      placeholder="Hesap numarasını giriniz"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography variant="body2" sx={{ color: '#666' }}>#</Typography>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  {/* İkinci Satır */}
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Banka Adı</InputLabel>
                      <Select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        label="Banka Adı"
                      >
                        <MenuItem value="ziraat">Ziraat Bankası</MenuItem>
                        <MenuItem value="garanti">Garanti BBVA</MenuItem>
                        <MenuItem value="isbank">İş Bankası</MenuItem>
                        <MenuItem value="akbank">Akbank</MenuItem>
                        <MenuItem value="vakifbank">VakıfBank</MenuItem>
                        <MenuItem value="halkbank">Halkbank</MenuItem>
                        <MenuItem value="yapikredi">Yapı Kredi</MenuItem>
                        <MenuItem value="denizbank">DenizBank</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Ülke Kodu</InputLabel>
                      <Select
                        value={selectedBankCountry}
                        onChange={(e) => setSelectedBankCountry(e.target.value)}
                        label="Ülke Kodu"
                      >
                        <MenuItem value="TR">TR, Türkiye</MenuItem>
                        <MenuItem value="US">US, United States</MenuItem>
                        <MenuItem value="DE">DE, Germany</MenuItem>
                        <MenuItem value="FR">FR, France</MenuItem>
                        <MenuItem value="GB">GB, United Kingdom</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField 
                      fullWidth 
                      label="IBAN Numarası" 
                      size="small" 
                      placeholder="IBAN numarasını giriniz"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccountBalanceIcon sx={{ color: '#666', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  {/* Üçüncü Satır */}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Şube Kodu</InputLabel>
                      <Select
                        value={selectedBranchCode}
                        onChange={(e) => setSelectedBranchCode(e.target.value)}
                        label="Şube Kodu"
                      >
                        <MenuItem value="001">001 - Merkez Şubesi</MenuItem>
                        <MenuItem value="002">002 - Kadıköy Şubesi</MenuItem>
                        <MenuItem value="003">003 - Beşiktaş Şubesi</MenuItem>
                        <MenuItem value="004">004 - Şişli Şubesi</MenuItem>
                        <MenuItem value="005">005 - Bakırköy Şubesi</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  {/* Butonlar */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                      <Button variant="outlined" color="error" size="small">
                        Temizle
                      </Button>
                      <Button variant="contained" color="primary" size="small">
                        Kaydet
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            
            {/* Eklenmiş Bankalar Listesi */}
            <Card sx={{ border: '1px solid #e9ecef', borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Eklenmiş Bankalar</Typography>
                
                {/* Tablo Başlıkları */}
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: '2fr 2fr 2fr 2fr 1fr', 
                  gap: 2, 
                  p: 2, 
                  bgcolor: '#f8f9fa', 
                  borderRadius: 2, 
                  mb: 2,
                  fontWeight: 600
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Banka Adı</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Şubesi</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Hesap Numarası</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>IBAN</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'center' }}>İşlem</Typography>
                </Box>
                
                {/* Boş Durum Mesajı */}
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 6, 
                  color: '#999',
                  border: '1px dashed #ddd',
                  borderRadius: 2
                }}>
                  <AccountBalanceIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                  <Typography variant="body2">
                    Kayıt Bulunamadı.
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#bbb' }}>
                    Henüz banka hesabı eklenmemiş.
                  </Typography>
                </Box>
                
                {/* Alt Butonlar */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  gap: 2, 
                  mt: 3, 
                  pt: 2, 
                  borderTop: '1px solid #eee' 
                }}>
                  <Button variant="outlined" size="small">
                    İptal
                  </Button>
                  <Button variant="contained" size="small">
                    Kaydet
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        );
      case 'mail':
        return (
          <Box>
            <Card sx={{ border: '1px solid #e9ecef', borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ p: 3 }}>
                {/* Mail Geçmişi Tablosu */}
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: '80px 150px 200px 150px 120px 120px 100px', 
                  gap: 2, 
                  p: 2, 
                  bgcolor: '#f8f9fa', 
                  borderRadius: 2, 
                  mb: 2,
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>ID</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Tarih</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Konu</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Alıcı</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Gönderen</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Durum</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'center' }}>İşlemler</Typography>
                </Box>
                
                {/* Örnek Mail Kayıtları */}
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: '80px 150px 200px 150px 120px 120px 100px', 
                  gap: 2, 
                  p: 2, 
                  borderBottom: '1px solid #eee',
                  alignItems: 'center',
                  fontSize: '0.875rem'
                }}>
                  <Typography variant="body2">1</Typography>
                  <Typography variant="body2">23/06/2025 14:30</Typography>
                  <Typography variant="body2" sx={{ 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap' 
                  }}>
                    Hoş Geldiniz - Üyelik Onayı
                  </Typography>
                  <Typography variant="body2">ahmet@example.com</Typography>
                  <Typography variant="body2">sistem@firma.com</Typography>
                  <Chip 
                    label="Gönderildi" 
                    size="small" 
                    sx={{ 
                      bgcolor: '#d1ecf1', 
                      color: '#0c5460',
                      fontSize: '0.75rem',
                      height: '24px'
                    }} 
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <IconButton size="small" sx={{ color: '#1976d2' }}>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" sx={{ color: '#d32f2f' }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                
                {/* İkinci Örnek Kayıt */}
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: '80px 150px 200px 150px 120px 120px 100px', 
                  gap: 2, 
                  p: 2, 
                  borderBottom: '1px solid #eee',
                  alignItems: 'center',
                  fontSize: '0.875rem'
                }}>
                  <Typography variant="body2">2</Typography>
                  <Typography variant="body2">22/06/2025 09:15</Typography>
                  <Typography variant="body2" sx={{ 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap' 
                  }}>
                    Sipariş Onay Bildirimi
                  </Typography>
                  <Typography variant="body2">mehmet@test.com</Typography>
                  <Typography variant="body2">siparis@firma.com</Typography>
                  <Chip 
                    label="Başarısız" 
                    size="small" 
                    sx={{ 
                      bgcolor: '#f8d7da', 
                      color: '#721c24',
                      fontSize: '0.75rem',
                      height: '24px'
                    }} 
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <IconButton size="small" sx={{ color: '#1976d2' }}>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" sx={{ color: '#d32f2f' }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                
                {/* Boş Durum (Eğer başka kayıt yoksa) */}
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 6, 
                  color: '#999',
                  display: 'none' // Örnek kayıtlar olduğu için gizli
                }}>
                  <EmailIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                  <Typography variant="body2">
                    Henüz mail gönderilmemiş.
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#bbb' }}>
                    Müşteriye mail gönderdikten sonra burada görüntülenecek.
                  </Typography>
                </Box>
                
                {/* Alt Butonlar */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  gap: 2, 
                  mt: 3, 
                  pt: 2, 
                  borderTop: '1px solid #eee' 
                }}>
                  <Button variant="outlined" size="small">
                    İptal
                  </Button>
                  <Button variant="contained" size="small">
                    Kaydet
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        );
      case 'sms':
        return (
          <Box>
            <Card sx={{ border: '1px solid #e9ecef', borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ p: 3 }}>
                {/* SMS Geçmişi Tablosu */}
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: '80px 150px 120px 120px 120px 120px 120px 100px', 
                  gap: 2, 
                  p: 2, 
                  bgcolor: '#f8f9fa', 
                  borderRadius: 2, 
                  mb: 2,
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>ID</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Oluşturulma Tarihi</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>SMS</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>senderName</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Başlık</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Başarılı</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>İçerik</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'center' }}>İşlemler</Typography>
                </Box>
                
                {/* Örnek SMS Kayıtları */}
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: '80px 150px 120px 120px 120px 120px 120px 100px', 
                  gap: 2, 
                  p: 2, 
                  borderBottom: '1px solid #eee',
                  alignItems: 'center',
                  fontSize: '0.875rem'
                }}>
                  <Typography variant="body2">1</Typography>
                  <Typography variant="body2">23/06/2025 16:53</Typography>
                  <Typography variant="body2">Happ-Sms</Typography>
                  <Typography variant="body2">Yigit Kemal</Typography>
                  <Typography variant="body2">Test Header</Typography>
                  <Chip 
                    label="Success" 
                    size="small" 
                    sx={{ 
                      bgcolor: '#d4edda', 
                      color: '#155724',
                      fontSize: '0.75rem',
                      height: '24px'
                    }} 
                  />
                  <Typography variant="body2">This is a test sms</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <IconButton size="small" sx={{ color: '#1976d2' }}>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                
                {/* Boş Durum (Eğer başka kayıt yoksa) */}
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 6, 
                  color: '#999',
                  display: 'none' // Örnek kayıt olduğu için gizli
                }}>
                  <SmsIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                  <Typography variant="body2">
                    Henüz SMS gönderilmemiş.
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#bbb' }}>
                    Müşteriye SMS gönderdikten sonra burada görüntülenecek.
                  </Typography>
                </Box>
                
                {/* Alt Butonlar */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  gap: 2, 
                  mt: 3, 
                  pt: 2, 
                  borderTop: '1px solid #eee' 
                }}>
                  <Button variant="outlined" size="small">
                    İptal
                  </Button>
                  <Button variant="contained" size="small">
                    Kaydet
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        );
      default:
        return (
          <Card sx={{ border: '1px solid #e9ecef', borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>🚧 Geliştiriliyor</Typography>
              <Typography variant="body2" color="text.secondary">
                Bu kategori henüz geliştirilme aşamasındadır.
              </Typography>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100% - 64px)', flexDirection: { xs: 'column', md: 'row' } }}>
      {/* Sol Sidebar */}
      <Box sx={{ 
        width: { xs: '100%', md: '280px' }, 
        minHeight: { xs: 'auto', md: '100%' },
        bgcolor: '#f8f9fa', 
        borderRight: { xs: 'none', md: '1px solid #e9ecef' },
        borderBottom: { xs: '1px solid #e9ecef', md: 'none' },
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
        
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto', 
          p: 1,
          display: { xs: 'flex', md: 'block' },
          flexDirection: { xs: 'row', md: 'column' },
          gap: { xs: 1, md: 0 },
          overflowX: { xs: 'auto', md: 'visible' },
          overflowY: { xs: 'visible', md: 'auto' },
          '&::-webkit-scrollbar': {
            height: { xs: '4px', md: '8px' },
            width: { xs: '4px', md: '8px' }
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px'
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#c1c1c1',
            borderRadius: '4px',
            '&:hover': {
              background: '#a8a8a8'
            }
          }
        }}>
          {categories.map((category) => (
            <Box
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              sx={{
                p: { xs: 1, md: 1.5 },
                mb: { xs: 0, md: 0.5 },
                mr: { xs: 0.5, md: 0 },
                borderRadius: 2,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                minWidth: { xs: '140px', md: 'auto' },
                whiteSpace: { xs: 'nowrap', md: 'normal' },
                bgcolor: selectedCategory === category.id ? '#667eea' : 'transparent',
                color: selectedCategory === category.id ? 'white' : '#495057',
                fontWeight: selectedCategory === category.id ? 600 : 400,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: selectedCategory === category.id ? '#667eea' : '#e9ecef',
                  transform: { xs: 'translateY(-2px)', md: 'translateX(4px)' }
                }
              }}
            >
              <Box sx={{ fontSize: { xs: '16px', md: '18px' } }}>{category.icon}</Box>
              <Typography variant="body2" sx={{ fontWeight: 'inherit', fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                {category.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
      
      {/* Sağ İçerik Alanı */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #e9ecef', bgcolor: 'white' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#495057', mb: 1 }}>
            {categories.find(c => c.id === selectedCategory)?.icon} {categories.find(c => c.id === selectedCategory)?.label}
          </Typography>
          <Typography variant="body2" sx={{ color: '#6c757d' }}>
            Bu kategoride müşteriye ait bilgileri yönetebilirsiniz.
          </Typography>
        </Box>
        
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          {renderCategoryContent()}
        </Box>
        
        {/* Alt Butonlar */}
        <Box sx={{ p: 3, borderTop: '1px solid #e9ecef', bgcolor: '#f8f9fa', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" onClick={onClose}>
            İptal
          </Button>
          <Button 
            variant="contained" 
            onClick={() => onSubmit({})}
            sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            {editingCustomer ? 'Güncelle' : 'Müşteri Ekle'}
          </Button>
        </Box>
      </Box>
      
      {/* Ülke Seçici Menü */}
      <Menu
        anchorEl={countryMenuAnchor}
        open={Boolean(countryMenuAnchor)}
        onClose={() => setCountryMenuAnchor(null)}
        PaperProps={{
          sx: {
            maxHeight: 300,
            width: 250,
            mt: 1
          }
        }}
      >
        {countries.map((country) => (
          <MenuItem
            key={country.code}
            onClick={() => handleCountrySelect(country.code)}
            selected={country.code === selectedCountryCode}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              py: 1
            }}
          >
            <Box sx={{ fontSize: '16px' }}>{country.flag}</Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2">{country.name}</Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {country.dialCode}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

const CustomersPage: React.FC = () => {
  // Şu an seçili ülkenin şehirlerini döndüren yardımcı fonksiyon
  function getCitiesForSelectedCountry() {
    if (selectedLocation.country === 'all') {
      return [{ value: 'all', label: 'Tüm Şehirler' }];
    }
    const country = locationData.find((c: { value: string }) => c.value === selectedLocation.country);
    if (!country) return [{ value: 'all', label: 'Tüm Şehirler' }];
    return [
      { value: 'all', label: 'Tüm Şehirler' },
      ...country.cities.map((city: { value: string; label: string }) => ({ value: city.value, label: city.label }))
    ];
  }

  const inches = useScreenInches();
  // Dil desteği için LanguageContext'ten çevirileri al
  const { translations } = useLanguage();
  
  // Bildirim sistemi için NotificationContext'i kullan
  const notifications = useNotifications();
  
  // State tanımlamaları
  const [filterOpen, setFilterOpen] = useState(false);
  const [tabValue, setTabValue] = useState<number>(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [activeCustomerId, setActiveCustomerId] = useState<string | null>(null);
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const [actionAnchorEl, setActionAnchorEl] = useState<null | HTMLElement>(null);
  
  // Filtre state'leri
  const [activeTab, setActiveTab] = useState<string>('all');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<LocationData>({ country: 'all', city: 'all', district: 'all' });
  const [selectedParty, setSelectedParty] = useState<PartyType>('all');
  const [selectedFinancialStatus, setSelectedFinancialStatus] = useState<FinancialStatus>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  // Hiyerarşik konum verileri
  const locationData = [
    { 
      value: 'Turkey', 
      label: 'Türkiye',
      cities: [
        { 
          value: 'Istanbul', 
          label: 'İstanbul',
          districts: [
            { value: 'Kadikoy', label: 'Kadıköy' },
            { value: 'Besiktas', label: 'Beşiktaş' },
            { value: 'Sisli', label: 'Şişli' },
          ] 
        },
        { 
          value: 'Ankara', 
          label: 'Ankara',
          districts: [
            { value: 'Cankaya', label: 'Çankaya' },
            { value: 'Kecioren', label: 'Keçiören' },
          ] 
        },
        { 
          value: 'Izmir', 
          label: 'İzmir',
          districts: [
            { value: 'Karsiyaka', label: 'Karşıyaka' },
            { value: 'Konak', label: 'Konak' },
          ] 
        },
      ]
    },
    { 
      value: 'Russia', 
      label: 'Rusya',
      cities: [
        { 
          value: 'Moscow', 
          label: 'Moskova',
          districts: [
            { value: 'Kremlin', label: 'Kremlin' },
            { value: 'Arbat', label: 'Arbat' },
          ] 
        },
        { 
          value: 'Saint Petersburg', 
          label: 'St. Petersburg',
          districts: [
            { value: 'Nevsky', label: 'Nevsky' },
            { value: 'Vasilievsky', label: 'Vasilievsky' },
          ] 
        },
      ]
    },
    { 
      value: 'USA', 
      label: 'ABD',
      cities: [
        { 
          value: 'New York', 
          label: 'New York',
          districts: [
            { value: 'Manhattan', label: 'Manhattan' },
            { value: 'Brooklyn', label: 'Brooklyn' },
          ] 
        },
        { 
          value: 'Los Angeles', 
          label: 'Los Angeles',
          districts: [
            { value: 'Hollywood', label: 'Hollywood' },
            { value: 'Beverly Hills', label: 'Beverly Hills' },
          ] 
        },
      ]
    },
  ];
  
  // Şehir ve ilçe seçenekleri
  const cityOptions = selectedLocation.country !== 'all' 
    ? [{ value: 'all', label: 'Tüm Şehirler' }, ...locationData.find(country => country.value === selectedLocation.country)?.cities.map(city => ({ value: city.value, label: city.label })) || []]
    : [{ value: 'all', label: 'Tüm Şehirler' }];
    
  const districtOptions = selectedLocation.country !== 'all' && selectedLocation.city !== 'all' 
    ? [{ value: 'all', label: 'Tüm İlçeler' }, ...locationData.find(country => country.value === selectedLocation.country)?.cities.find(city => city.value === selectedLocation.city)?.districts.map(district => ({ value: district.value, label: district.label })) || []]
    : [{ value: 'all', label: 'Tüm İlçeler' }];
  
  // Menü işlemleri için fonksiyonlar
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, customer: Customer) => {
    setActiveCustomerId(customer.id);
    setMenuAnchorEl(event.currentTarget);
    setAnchorEl(event.currentTarget);
    setSelectedCustomer(customer);
  };
  
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setAnchorEl(null);
  };
  
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 'YGTXML',
      code: 'TK-3434',
      name: 'Winfiniti AŞ',
      email: 'info@winfiniti.com.tr',
      phone: '+905555555555',
      workPhone: '+902122222222',
      country: 'tr',
      city: 'İstanbul',
      lastOrder: '25.06.2025 15:14',
      totalOrders: 2,
      status: 'Aktif',
      bakiye: 5000.00,
      sepet: 0,
      lastLogin: '25/06/2025:18:00'
    },
    {
      id: 'CSTMR4',
      code: 'TK-5566',
      name: 'Teknoloji Market',
      email: 'destek@teknomarket.com',
      phone: '+905551112233',
      country: 'tr',
      city: 'Ankara',
      lastOrder: '24.06.2025 11:00',
      totalOrders: 1,
      status: 'Aktif',
      bakiye: 12500.00,
      sepet: 0.00,
      lastLogin: '24/06/2025:12:00'
    },
    {
      id: 'CSTMR5',
      code: 'TK-7890',
      name: 'Global Lojistik',
      email: 'info@globallojistik.com',
      phone: '+905334445566',
      country: 'tr',
      city: 'İzmir',
      lastOrder: '23.06.2025 09:30',
      totalOrders: 1,
      status: 'Pasif',
      bakiye: -7500.00,
      sepet: 0,
      lastLogin: '23/06/2025:10:00'
    },
    {
      id: 'CSTMR6',
      code: 'TK-1212',
      name: 'Ayşe Kaya',
      email: 'ayse.kaya@email.com',
      phone: '+905448887766',
      country: 'tr',
      city: 'Bursa',
      lastOrder: '22.06.2025 14:00',
      totalOrders: 2,
      status: 'Aktif',
      bakiye: 0,
      sepet: 0,
      lastLogin: '22/06/2025:15:00'
    },
  ]);
  
  // Tablo sütunları
  const columns: Column[] = [
    { 
      id: 'name', 
      label: 'Müşteri', 
      minWidth: 170,
      format: (value: string, row: Customer) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            sx={{ 
              bgcolor: stringToColor(value),
              width: 35,
              height: 35,
              mr: 2,
              fontSize: '0.9rem'
            }}
          >
            {value.split(' ').map(n => n[0]).join('').toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="600">{value}</Typography>
            <Typography variant="caption" color="text.secondary">{row.email}</Typography>
          </Box>
        </Box>
      ),
    },
    { id: 'phone', label: 'Telefon', minWidth: 100 },
    {
      id: 'bakiye',
      label: 'Bakiye',
      minWidth: 100,
      align: 'right',
      format: (value: number) => (
        <Typography sx={{ color: value > 0 ? 'success.main' : value < 0 ? 'error.main' : 'text.primary' }}>
          {`₺${value.toFixed(2)}`}
        </Typography>
      ),
    },
    {
      id: 'status',
      label: 'Durum',
      minWidth: 100,
      align: 'center',
      format: (value: string) => (
        <Chip
          label={value}
          color={value === 'Aktif' ? 'success' : 'error'}
          size="small"
          variant="filled"
        />
      ),
    },
    { 
      id: 'actions', 
      label: 'İşlemler', 
      minWidth: 100, 
      align: 'right',
      format: (value: any, row: Customer) => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Tooltip title="Hesap Detayları">
            <IconButton component={Link} to={`/account-details/${row.code}`} size="small">
              <PersonIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Daha Fazla">
            <IconButton onClick={(e) => handleMenuOpen(e, row)} size="small">
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  // Not: Bu değişkenler yukarıda tanımlandığı için burada tekrar tanımlanmıyor
  
  // Customers state'ini useEffect ile filteredCustomers'a aktar
  useEffect(() => {
    setFilteredCustomers(customers);
  }, [customers]);
  
  // Müşteri durumu filtreleme fonksiyonu
  const handleStatusFilter = (status: string) => {
    setActiveTab(status);
    applyFilters(status);
  };
  
  // Tab değişimi için fonksiyon
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    applyFilters(tab);
  };
  
  // Arama değişikliği için fonksiyon
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  // Ülke değişikliği için fonksiyon
  const handleCountryChange = (event: SelectChangeEvent) => {
    setSelectedLocation({
      country: event.target.value as string,
      city: 'all',
      district: 'all'
    });
  };
  
  // Şehir değişikliği için fonksiyon
  const handleCityChange = (event: SelectChangeEvent) => {
    setSelectedLocation({
      ...selectedLocation,
      city: event.target.value as string,
      district: 'all'
    });
  };
  
  // İlçe değişikliği için fonksiyon
  const handleDistrictChange = (event: SelectChangeEvent) => {
    setSelectedLocation({
      ...selectedLocation,
      district: event.target.value as string
    });
  };
  
  // Taraf değişikliği için fonksiyon
  const handlePartyChange = (event: SelectChangeEvent) => {
    setSelectedParty(event.target.value as PartyType);
  };
  
  // Filtre panelini açıp kapatma fonksiyonu
  const handleFilterToggle = () => {
    setFilterOpen(!filterOpen);
  };
  
  // Finansal durum değişikliği için fonksiyon
  const handleFinancialStatusChange = (event: SelectChangeEvent) => {
    setSelectedFinancialStatus(event.target.value as FinancialStatus);
  };
  
  // Tarih filtreleri için state değişkenleri
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  
  // Sayfalama için fonksiyonlar
  const handleChangePage = (event: React.ChangeEvent<unknown> | null, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: SelectChangeEvent<string>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // SMS gönderme dialog'u için state ve fonksiyonlar
  const [smsDialogOpen, setSmsDialogOpen] = useState(false);
  const [smsCustomer, setSmsCustomer] = useState<Customer | null>(null);
  const [smsMessage, setSmsMessage] = useState('');
  
  const handleSmsOpen = (customer: Customer) => {
    setSmsCustomer(customer);
    setSmsMessage(`Sayın ${customer.name}, siparişiniz için teşekkür ederiz! ${customer.id} numaralı siparişiniz işleme alınmıştır.`);
    setSmsDialogOpen(true);
  };
  
  const handleSmsClose = () => {
    setSmsDialogOpen(false);
  };
  
  const handleSmsSend = (data: any) => {
    // Burada SMS gönderme işlemi yapılabilir
    try {
      // API çağrısı burada yapılacak
      // Örnek: await sendSms(smsCustomer.phone, data.message);
      
      // Başarılı bildirim göster
      notifications.showSuccess(`SMS başarıyla gönderildi: ${smsCustomer?.name}`);
      setSmsDialogOpen(false);
    } catch (error) {
      // Hata durumunda bildirim göster
      notifications.showError('SMS gönderilirken bir hata oluştu!');
      console.error('SMS gönderme hatası:', error);
    }
  };
  
  // E-posta gönderme dialog'u için state ve fonksiyonlar
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailCustomer, setEmailCustomer] = useState<Customer | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  
  // Mail Dialog için state
  const [mailDialogOpen, setMailDialogOpen] = useState(false);
  
  // Import dialog'u için state ve fonksiyonlar
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  
  const handleImportOpen = () => {
    setImportDialogOpen(true);
  };
  
  const handleImportClose = () => {
    setImportDialogOpen(false);
  };
  
  // Müşteri ekleme/düzenleme Dialog state'leri
  const [customerFormOpen, setCustomerFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  
  // Yeni müşteri ve hızlı ekleme dialog'ları için state'ler
  const [newCustomerDialogOpen, setNewCustomerDialogOpen] = useState(false);

  
  // Yeni müşteri dialog'unu açma fonksiyonu
  const handleNewCustomerOpen = () => {
    setNewCustomerDialogOpen(true);
  };
  
  // Yeni müşteri dialog'unu kapatma fonksiyonu
  const handleNewCustomerClose = () => {
    setNewCustomerDialogOpen(false);
  };

  
  // Müşteri ekleme/düzenleme Dialog fonksiyonları
  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setCustomerFormOpen(true);
  };
  
  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setCustomerFormOpen(true);
    handleMenuClose();
  };
  
  const handleCustomerFormOpen = () => {
    setEditingCustomer(null);
    setCustomerFormOpen(true);
  };
  
  const handleCustomerFormClose = () => {
    setCustomerFormOpen(false);
  };
  
  const handleCustomerFormSubmit = (data: any) => {
    if (editingCustomer) {
      // Müşteri düzenleme
      const updatedCustomers = customers.map(c => 
        c.id === editingCustomer.id ? { ...c, ...data } : c
      );
      setCustomers(updatedCustomers);
      notifications.showSuccess(`Müşteri başarıyla güncellendi: ${data.name}`);
    } else {
      // Yeni müşteri ekleme
      const newCustomer: Customer = {
        id: `CUS${Math.floor(Math.random() * 10000)}`,
        ...data,
        lastOrder: new Date().toISOString().split('T')[0],
        totalOrders: 0
      };
      setCustomers([...customers, newCustomer]);
      notifications.showSuccess(`Yeni müşteri başarıyla eklendi: ${data.name}`);
    }
    setCustomerFormOpen(false);
  };
  
  const handleImportCustomers = (importedCustomers: Customer[]) => {
    // Mevcut müşteri listesine yeni müşterileri ekle
    setCustomers([...customers, ...importedCustomers]);
  };
  
  // Müşteri verilerini düzenle (Excel ve PDF için ortak)
  const prepareCustomerData = () => {
    return customers.map(customer => ({
      "Müşteri ID": customer.id,
      "Ad Soyad": customer.name,
      "E-posta": customer.email,
      "Telefon": customer.phone,
      "Ülke": customer.country,
      "Şehir": customer.city || "-",
      "Durum": customer.status,
      "Son Sipariş": customer.lastOrder,
      "Toplam Sipariş": customer.totalOrders || 0,
      "Bakiye": customer.balance || customer.bakiye || 0,
      "Son Giriş": customer.lastLogin || "-"
    }));
  };
  
  // Excel'e veri dışa aktarma fonksiyonu
  const exportToExcel = () => {
    try {
      // Müşteri verilerini düzenle
      const exportData = prepareCustomerData();
      
      // Excel dosyası oluştur
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      
      // Sütun genişliklerini ayarla
      const wscols = [
        { wch: 12 }, // Müşteri ID
        { wch: 25 }, // Ad Soyad
        { wch: 30 }, // E-posta
        { wch: 15 }, // Telefon
        { wch: 12 }, // Ülke
        { wch: 15 }, // Şehir
        { wch: 10 }, // Durum
        { wch: 15 }, // Son Sipariş
        { wch: 15 }, // Toplam Sipariş
        { wch: 10 }, // Bakiye
        { wch: 15 }  // Son Giriş
      ];
      worksheet['!cols'] = wscols;
      
      // Çalışma kitabı oluştur
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Müşteriler");
      
      // Dosyayı indir
      XLSX.writeFile(workbook, "musteri_listesi.xlsx");
      
      // Başarı bildirimi göster - NotificationContext kullanarak
      notifications.showSuccess("Müşteri listesi başarıyla Excel'e aktarıldı!", 'save');
    } catch (error) {
      console.error("Excel'e aktarma hatası:", error);
      notifications.showError("Excel'e aktarma sırasında bir hata oluştu!");
    }
  };
  
  // Sayfada görünmeyen bir iframe kullanarak yazdırma
  const printCustomerData = () => {
    try {
      // Müşteri verilerini düzenle
      const exportData = prepareCustomerData();
      
      if (exportData.length === 0) {
        notifications.show("Yazdırılacak müşteri verisi bulunamadı!", { severity: 'warning' });
        return;
      }
      
      // Tablo başlıkları ve verileri hazırla
      const headers = Object.keys(exportData[0]);
      const data = exportData.map(item => Object.values(item));
      
      // HTML içeriği oluştur
      const today = new Date().toLocaleDateString('tr-TR');
      
      let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Müşteri Listesi</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; font-size: 24px; margin-bottom: 10px; }
            .date { color: #666; text-align: right; font-size: 12px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background-color: #25638f; color: white; font-weight: bold; text-align: left; padding: 8px; }
            td { border: 1px solid #ddd; padding: 8px; }
            tr:nth-child(even) { background-color: #f2f2f2; }
            .footer { text-align: center; font-size: 10px; color: #666; margin-top: 30px; }
            @media print {
              body { margin: 0; padding: 15px; }
            }
          </style>
        </head>
        <body>
          <h1>Müşteri Listesi</h1>
          <div class="date">Oluşturulma Tarihi: ${today}</div>
          
          <table>
            <thead>
              <tr>
      `;
      
      // Tablo başlıklarını ekle
      headers.forEach(header => {
        htmlContent += `<th>${header}</th>`;
      });
      
      htmlContent += `
              </tr>
            </thead>
            <tbody>
      `;
      
      // Tablo verilerini ekle
      data.forEach(row => {
        htmlContent += '<tr>';
        row.forEach(cell => {
          htmlContent += `<td>${cell}</td>`;
        });
        htmlContent += '</tr>';
      });
      
      htmlContent += `
            </tbody>
          </table>
          
          <div class="footer">Müşteri Listesi - ${today}</div>
        </body>
        </html>
      `;
      
      // Varsa eski iframe'i kaldır
      const oldIframe = document.getElementById('print-iframe');
      if (oldIframe) {
        document.body.removeChild(oldIframe);
      }
      
      // Yeni bir iframe oluştur
      const iframe = document.createElement('iframe');
      iframe.id = 'print-iframe';
      iframe.style.position = 'absolute';
      iframe.style.top = '-9999px';
      iframe.style.left = '-9999px';
      iframe.style.width = '0';
      iframe.style.height = '0';
      document.body.appendChild(iframe);
      
      // iframe içeriğini ayarla
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();
        
        // iframe yüklendiğinde yazdır
        iframe.onload = () => {
          try {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
            
            // Başarı bildirimi göster - NotificationContext kullanarak
            notifications.showSuccess("Müşteri listesi yazdırılıyor...");
          } catch (e) {
            console.error("Yazdırma sırasında hata:", e);
            notifications.showError("Yazdırma sırasında bir hata oluştu!");
          }
        };
      } else {
        notifications.showError("Yazdırma belgesi oluşturulamadı!");
      }
    } catch (error) {
      console.error("Yazdırma hatası:", error);
      notifications.showError("Yazdırma sırasında bir hata oluştu!");
    }
  };
  
  const handleEmailOpen = (customer: Customer) => {
    setEmailCustomer(customer);
    setEmailSubject(`Sipariş Onayı - ${customer.id}`);
    setEmailBody(`Sayın ${customer.name}, bu e-posta ${customer.id} numaralı son siparişinizi onaylamaktadır. Sipariş detaylarını buradan görüntüleyebilirsiniz: [Sipariş Detayları Linki]`);
    setEmailDialogOpen(true);
  };
  
  const handleEmailClose = () => {
    setEmailDialogOpen(false);
  };
  
  const handleEmailSend = (data: any) => {
    try {
      // Burada gerçek e-posta gönderme API çağrısı yapılacak
      // Örnek: await sendEmail(emailCustomer.email, data.subject, data.body);
      
      // Başarılı bildirim göster
      notifications.showSuccess(`E-posta başarıyla gönderildi: ${emailCustomer?.name}`);
      setEmailDialogOpen(false);
    } catch (error) {
      // Hata durumunda bildirim göster
      notifications.showError('E-posta gönderilirken bir hata oluştu!');
      console.error('E-posta gönderme hatası:', error);
    }
  };
  
  // Silme Dialog state'leri
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteCustomer, setDeleteCustomer] = useState<Customer | null>(null);
  
  // Müşteri form alanları
  const customerFormFields: FormField[] = [
    {
      name: 'name',
      label: 'Ad Soyad',
      type: 'text',
      required: true,
      placeholder: 'Müşteri adı ve soyadı'
    },
    {
      name: 'email',
      label: 'E-posta',
      type: 'email',
      required: true,
      placeholder: 'ornek@email.com'
    },
    {
      name: 'phone',
      label: 'Telefon',
      type: 'tel',
      required: true,
      placeholder: '5XX XXX XX XX',
      validation: ValidationPatterns.PHONE
    },
    {
      name: 'country',
      label: 'Ülke',
      type: 'select',
      required: true,
      options: [
        { value: 'turkey', label: 'Türkiye' },
        { value: 'germany', label: 'Almanya' },
        { value: 'usa', label: 'ABD' },
        { value: 'uk', label: 'İngiltere' }
      ]
    },
    {
      name: 'city',
      label: 'Şehir',
      type: 'text',
      placeholder: 'Şehir'
    },
    {
      name: 'status',
      label: 'Durum',
      type: 'select',
      required: true,
      options: [
        { value: 'active', label: 'Aktif' },
        { value: 'passive', label: 'Pasif' }
      ]
    },
    {
      name: 'party',
      label: 'Taraf',
      type: 'select',
      options: [
        { value: 'buyer', label: 'Alıcı' },
        { value: 'seller', label: 'Satıcı' },
        { value: 'both', label: 'Her İkisi' }
      ]
    }
  ];
  
  // Tüm filtreleri uygulama fonksiyonu
  const applyFilters = (statusTab: string = activeTab) => {
    let filtered = [...customers];
    
    // Durum filtresi (AKTİF/PASİF/TÜMÜ)
    if (statusTab === 'active') {
      filtered = filtered.filter(customer => customer.status === 'Aktif');
    } else if (statusTab === 'passive') {
      filtered = filtered.filter(customer => customer.status === 'Pasif');
    }
    
    // Arama filtresi
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(customer => 
        customer.name.toLowerCase().includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower) ||
        customer.phone.toLowerCase().includes(searchLower) ||
        customer.id.toLowerCase().includes(searchLower)
      );
    }
    
    // Konum filtresi
    if (selectedLocation.country !== 'all') {
      filtered = filtered.filter(customer => customer.country === selectedLocation.country);
    }
    
    // Parti filtresi
    if (selectedParty !== 'all') {
      filtered = filtered.filter(customer => 
        selectedParty === 'seller' ? customer.id.startsWith('S') : !customer.id.startsWith('S')
      );
    }
    
    // Finansal durum filtresi
    if (selectedFinancialStatus !== 'all') {
      if (selectedFinancialStatus === 'balance') {
        filtered = filtered.filter(customer => customer.bakiye === 0 || customer.balance === 0);
      } else if (selectedFinancialStatus === 'debtor') {
        filtered = filtered.filter(customer => (customer.bakiye || 0) < 0 || (customer.balance || 0) < 0);
      } else if (selectedFinancialStatus === 'creditor') {
        filtered = filtered.filter(customer => (customer.bakiye || 0) > 0 || (customer.balance || 0) > 0);
      }
    }
    
    // Tarih filtreleri - ID numarasına göre filtreleme yapıyoruz
    // Not: Gerçek bir tarih alanı olmadığı için bu örnek amaçlıdır
    if (startDate || endDate) {
      // Tarih filtresi yerine ID numarasına göre filtreleme yapıyoruz
      // Bu sadece örnek amaçlıdır, gerçek uygulamada tarih alanı kullanılmalıdır
      filtered = filtered.filter(customer => {
        const customerId = parseInt(customer.id.replace(/\D/g, '') || '0');
        const startValue = startDate ? 100 : 0;
        const endValue = endDate ? 500 : 999999;
        return customerId >= startValue && customerId <= endValue;
      });
    }
    
    setFilteredCustomers(filtered);
  };
  
  // Arama, tab ve diğer filtreler için useEffect
  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedLocation, selectedParty, selectedFinancialStatus, startDate, endDate]);
  


  return (
    <Box sx={{ p: 3 }}>
      {/* Ana Header - Resimde gösterilen tasarım */}
      <Paper 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 4,
          overflow: 'hidden',
          mb: 4,
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
        }}
      >
        <Box sx={{ 
          p: { xs: 3, md: 5 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 140
        }}>
          <Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '2.5rem' },
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                mb: 1
              }}
            >
              Müşteri Yönetimi
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                opacity: 0.9,
                fontSize: { xs: '1rem', md: '1.1rem' },
                fontWeight: 400
              }}
            >
              Müşterilerinizi yönetin, yeni müşteriler ekleyin ve raporlarınızı görüntüleyin
            </Typography>
          </Box>
          
          <Avatar 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)',
              width: { xs: 60, md: 80 },
              height: { xs: 60, md: 80 },
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.3)'
            }}
          >
            <PersonIcon sx={{ fontSize: { xs: 30, md: 40 }, color: 'white' }} />
          </Avatar>
        </Box>
      </Paper>
      
      {/* Renkli Kart Menüleri */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            onClick={handleCustomerFormOpen}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)'
              }
            }}
          >
            <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <PersonAddIcon sx={{ fontSize: 32, color: 'white' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: 'white' }}>
                  Yeni Müşteri
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, color: 'white' }}>
                  Müşteri ekle
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            onClick={handleImportOpen}
            sx={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              borderRadius: 3,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 40px rgba(79, 172, 254, 0.4)'
              }
            }}
          >
            <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <CloudUploadIcon sx={{ fontSize: 32, color: 'white' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: 'white' }}>
                  İçe Aktar
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, color: 'white' }}>
                  Excel'den aktar
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            onClick={() => setMailDialogOpen(true)}
            sx={{
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              color: 'white',
              borderRadius: 3,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 40px rgba(250, 112, 154, 0.4)'
              }
            }}
          >
            <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <EmailIcon sx={{ fontSize: 32, color: 'white' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: 'white' }}>
                  Mail Gönder
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, color: 'white' }}>
                  Toplu mail
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Arama ve Export Butonları */}
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        bgcolor: '#f9f9f9',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <TextField
          placeholder="Filtre ara..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ 
            width: '60%',
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
              bgcolor: '#fff'
            }
          }}
        />
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            size="small"
            startIcon={<ExportIcon />}
            onClick={exportToExcel}
            sx={{ color: '#1e5172', borderColor: '#1e5172' }}
          >
            Excel'e Aktar
          </Button>
          
          <Button 
            variant="outlined" 
            size="small"
            startIcon={<PrintIcon />}
            onClick={printCustomerData}
            sx={{ color: '#d32f2f', borderColor: '#d32f2f' }}
          >
            PDF'e Aktar
          </Button>
        </Box>
      </Box>
      
      {/* Durum Tab Butonları */}
      <Box sx={{ display: 'flex', mt: 2, mb: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          bgcolor: '#f5f5f5',
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid #e0e0e0',
        }}>
          <Button 
            variant="text" 
            sx={{ 
              bgcolor: activeTab === 'all' ? 'primary.main' : 'transparent',
              color: activeTab === 'all' ? 'white' : '#757575',
              fontWeight: 500,
              px: 2,
              py: 0.8,
              minWidth: 80,
              borderRadius: 0,
              '&:hover': {
                bgcolor: activeTab === 'all' ? 'primary.dark' : 'rgba(0,0,0,0.04)'
              }
            }}
            onClick={() => handleTabChange('all')}
          >
            TÜMÜ
          </Button>
          <Button 
            variant="text" 
            sx={{ 
              bgcolor: activeTab === 'active' ? '#4caf50' : 'transparent',
              color: activeTab === 'active' ? 'white' : '#757575',
              fontWeight: 500,
              px: 2,
              py: 0.8,
              minWidth: 80,
              borderRadius: 0,
              '&:hover': {
                bgcolor: activeTab === 'active' ? '#388e3c' : 'rgba(0,0,0,0.04)'
              }
            }}
            onClick={() => handleTabChange('active')}
          >
            AKTİF
          </Button>
          <Button 
            variant="text" 
            sx={{ 
              bgcolor: activeTab === 'passive' ? '#f44336' : 'transparent',
              color: activeTab === 'passive' ? 'white' : '#757575',
              fontWeight: 500,
              px: 2,
              py: 0.8,
              minWidth: 80,
              borderRadius: 0,
              '&:hover': {
                bgcolor: activeTab === 'passive' ? '#d32f2f' : 'rgba(0,0,0,0.04)'
              }
            }}
            onClick={() => handleTabChange('passive')}
          >
            PASİF
          </Button>
        </Box>
        
        <Button
          variant="outlined"
          size="small"
          startIcon={<FilterListIcon />}
          onClick={handleFilterToggle}
          sx={{ 
            ml: 'auto', 
            borderColor: filterOpen ? 'primary.main' : 'divider',
            color: filterOpen ? 'primary.main' : 'text.secondary',
            bgcolor: filterOpen ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
            '&:hover': {
              bgcolor: 'rgba(25, 118, 210, 0.08)'
            }
          }}
        >
          Gelişmiş Filtre
        </Button>
      </Box>
      
      {/* Gelişmiş Filtre Paneli */}
      <Collapse in={filterOpen}>
        <Paper sx={{ 
          mb: 3, 
          borderRadius: 2, 
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #e0e0e0'
        }}>
          {/* Filtre Başlığı */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            p: 2,
            bgcolor: 'primary.main',
            background: 'linear-gradient(45deg, #25638f 30%, #3a7ca5 90%)',
            color: 'white'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
              Gelişmiş Filtreler
            </Typography>
            <IconButton 
              onClick={handleFilterToggle} 
              size="small"
              sx={{ 
                color: 'white',
                '&:hover': { 
                  bgcolor: 'rgba(255,255,255,0.2)' 
                }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Konum Filtreleri */}
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  bgcolor: 'background.paper', 
                  p: 2.5, 
                  borderRadius: 2,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(37, 99, 143, 0.1)',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }
                }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      mb: 2.5, 
                      color: '#25638f', 
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      borderBottom: '2px solid rgba(37, 99, 143, 0.1)',
                      pb: 1.5
                    }}
                  >
                    <LocationOnIcon sx={{ mr: 1.5, fontSize: '1.2rem', color: '#25638f' }} />
                    Konum Bilgileri
                  </Typography>
                  <FormControl fullWidth size="small" sx={{ mb: 2.5 }}>
                    <InputLabel id="country-label">Ülke</InputLabel>
                    <Select
                      labelId="country-label"
                      value={selectedLocation.country}
                      label="Ülke"
                      onChange={handleCountryChange}
                      sx={{ 
                        borderRadius: 1.5,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: selectedLocation.country !== 'all' ? '#25638f' : undefined,
                          borderWidth: selectedLocation.country !== 'all' ? 1.5 : 1
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#25638f',
                          borderWidth: 1.5
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#25638f'
                        }
                      }}
                    >
                      <MenuItem value="all">Tüm Ülkeler</MenuItem>
                      {locationData.map((country) => (
                        <MenuItem key={country.value} value={country.value}>{country.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl fullWidth size="small" sx={{ mb: 2.5 }}>
                    <InputLabel id="city-label">Şehir</InputLabel>
                    <Select
                      labelId="city-label"
                      value={selectedLocation.city}
                      label="Şehir"
                      onChange={handleCityChange}
                      disabled={selectedLocation.country === 'all'}
                      sx={{ 
                        borderRadius: 1.5,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: selectedLocation.city !== 'all' ? '#25638f' : undefined,
                          borderWidth: selectedLocation.city !== 'all' ? 1.5 : 1
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#25638f',
                          borderWidth: 1.5
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#25638f'
                        }
                      }}
                    >
                      <MenuItem value="all">Tüm Şehirler</MenuItem>
                      {selectedLocation.country !== 'all' && 
                        locationData
                          .find(country => country.value === selectedLocation.country)?.cities
                          .map((city) => (
                            <MenuItem key={city.value} value={city.value}>{city.label}</MenuItem>
                          ))
                      }
                    </Select>
                  </FormControl>
                  
                  <FormControl fullWidth size="small">
                    <InputLabel id="district-label">Bölge</InputLabel>
                    <Select
                      labelId="district-label"
                      value={selectedLocation.district}
                      label="Bölge"
                      onChange={handleDistrictChange}
                      disabled={selectedLocation.city === 'all'}
                      sx={{ 
                        borderRadius: 1.5,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: selectedLocation.district !== 'all' ? '#25638f' : undefined,
                          borderWidth: selectedLocation.district !== 'all' ? 1.5 : 1
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#25638f',
                          borderWidth: 1.5
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#25638f'
                        }
                      }}
                    >
                      <MenuItem value="all">Tüm Bölgeler</MenuItem>
                      {selectedLocation.city !== 'all' && 
                      locationData
                        .find(country => country.value === selectedLocation.country)?.cities
                        .find(city => city.value === selectedLocation.city)?.districts
                        .map((district) => (
                          <MenuItem key={district.value} value={district.value}>{district.label}</MenuItem>
                        ))
                    }
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            
            {/* Taraf ve Finansal Durum Filtreleri */}
            <Grid item xs={12} md={4}>
              <Box sx={{ 
                bgcolor: 'background.paper', 
                p: 2.5, 
                borderRadius: 2,
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                border: '1px solid rgba(255, 87, 34, 0.1)',
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }
              }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    mb: 2.5, 
                    color: '#ff5722', 
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '2px solid rgba(255, 87, 34, 0.1)',
                    pb: 1.5
                  }}
                >
                  <PersonIcon sx={{ mr: 1.5, fontSize: '1.2rem', color: '#ff5722' }} />
                  Müşteri Bilgileri
                </Typography>
                <FormControl fullWidth size="small" sx={{ mb: 2.5 }}>
                  <InputLabel id="party-label">Taraf</InputLabel>
                  <Select
                    labelId="party-label"
                    value={selectedParty}
                    label="Taraf"
                    onChange={handlePartyChange}
                    sx={{ 
                      borderRadius: 1.5,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: selectedParty !== 'all' ? '#ff5722' : undefined,
                        borderWidth: selectedParty !== 'all' ? 1.5 : 1
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ff5722',
                        borderWidth: 1.5
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ff5722'
                      }
                    }}
                  >
                    <MenuItem value="all">Tümü</MenuItem>
                    <MenuItem value="buyer">Alıcı</MenuItem>
                    <MenuItem value="seller">Satıcı</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                  <InputLabel id="financial-label">Finansal Durum</InputLabel>
                  <Select
                    labelId="financial-label"
                    value={selectedFinancialStatus}
                    label="Finansal Durum"
                    onChange={handleFinancialStatusChange}
                    sx={{ 
                      borderRadius: 1.5,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: selectedFinancialStatus === 'balance' ? '#757575' :
                                     selectedFinancialStatus === 'debtor' ? '#f44336' :
                                     selectedFinancialStatus === 'creditor' ? '#4caf50' : undefined,
                        borderWidth: selectedFinancialStatus !== 'all' ? 1.5 : 1
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: selectedFinancialStatus === 'balance' ? '#757575' :
                                     selectedFinancialStatus === 'debtor' ? '#f44336' :
                                     selectedFinancialStatus === 'creditor' ? '#4caf50' : '#757575',
                        borderWidth: 1.5
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: selectedFinancialStatus === 'balance' ? '#757575' :
                                    selectedFinancialStatus === 'debtor' ? '#f44336' :
                                    selectedFinancialStatus === 'creditor' ? '#4caf50' : '#757575'
                      }
                    }}
                  >
                    <MenuItem value="all">Tümü</MenuItem>
                    <MenuItem value="balance">Bakiyesi Sıfır Olanlar</MenuItem>
                    <MenuItem value="debtor">Borçlular</MenuItem>
                    <MenuItem value="creditor">Alacaklılar</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            
            {/* Tarih Filtreleri */}
            <Grid item xs={12} md={4}>
              <Box sx={{ 
                bgcolor: 'background.paper', 
                p: 2.5, 
                borderRadius: 2,
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                border: '1px solid rgba(76, 175, 80, 0.1)',
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }
              }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    mb: 2.5, 
                    color: '#4caf50', 
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '2px solid rgba(76, 175, 80, 0.1)',
                    pb: 1.5
                  }}
                >
                  <DateRangeIcon sx={{ mr: 1.5, fontSize: '1.2rem', color: '#4caf50' }} />
                  Tarih Filtreleri
                </Typography>
                
                <TextField
                  label="Başlangıç Tarihi"
                  type="date"
                  size="small"
                  fullWidth
                  sx={{ mb: 2.5 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                
                <TextField
                  label="Bitiş Tarihi"
                  type="date"
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Box>
            </Grid>
          </Grid>
            
          {/* Filtre Butonları */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            mt: 3,
            pb: 1,
            px: 2
          }}>
            <Button 
              variant="outlined" 
              sx={{ 
                mr: 2, 
                borderColor: '#757575', 
                color: '#757575',
                borderRadius: 2,
                px: 3,
                '&:hover': { 
                  borderColor: '#424242', 
                  color: '#424242',
                  backgroundColor: 'rgba(0,0,0,0.04)'
                }
              }}
              onClick={handleFilterToggle}
            >
              İptal
            </Button>
            <Button 
              variant="contained" 
              startIcon={<FilterListIcon />}
              sx={{ 
                bgcolor: 'primary.main', 
                color: 'white',
                fontWeight: 500,
                px: 3,
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(37, 99, 143, 0.2)',
                '&:hover': { 
                  bgcolor: 'primary.dark',
                  boxShadow: '0 4px 12px rgba(37, 99, 143, 0.3)'
                }
              }}
              onClick={() => {
                applyFilters();
                setFilterOpen(false);
              }}
            >
              Filtrele
            </Button>
          </Box>
        </Box>
      </Paper>
    </Collapse>
            
      {/* Müşteri Kartları - Responsive Grid */}
      {(() => {
        let columns = 1;
        if (inches > 8 && inches <= 10) columns = 2;
        else if (inches > 10 && inches <= 13) columns = 3;
        else if (inches > 13 && inches <= 27) columns = 4;
        else if (inches > 27 && inches <= 40) columns = Math.floor(inches * 1.5); // auto-fit, approx
        // fallback for extra large screens
        if (columns > 8) columns = 8;
        return (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              gap: 3,
            }}
          >
            {filteredCustomers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((customer) => (
                <Box key={customer.id} sx={{ minWidth: 0 }}>
                  <CustomerCard
                    customer={customer}
                    onMenuOpen={handleMenuOpen}
                  />
                </Box>
              ))}
          </Box>
        );
      })()}

      {/* Gelişmiş Filtre Paneli */}
      <Collapse in={filterOpen}>
        <Paper sx={{ 
          mb: 3, 
          borderRadius: 2, 
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #e0e0e0'
        }}>
          {/* Filtre Başlığı */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            p: 2,
            bgcolor: 'primary.main',
            background: 'linear-gradient(45deg, #25638f 30%, #3a7ca5 90%)',
            color: 'white'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
              Gelişmiş Filtreler
            </Typography>
            <IconButton 
              onClick={handleFilterToggle} 
              size="small"
              sx={{ 
                color: 'white',
                '&:hover': { 
                  bgcolor: 'rgba(255,255,255,0.2)' 
                }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Konum Filtreleri */}
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  bgcolor: 'background.paper', 
                  p: 2.5, 
                  borderRadius: 2,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(37, 99, 143, 0.1)',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }
                }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      mb: 2.5, 
                      color: '#25638f', 
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      borderBottom: '2px solid rgba(37, 99, 143, 0.1)',
                      pb: 1.5
                    }}
                  >
                    <LocationOnIcon sx={{ mr: 1.5, fontSize: '1.2rem', color: '#25638f' }} />
                    Konum Bilgileri
                  </Typography>
                  <FormControl fullWidth size="small" sx={{ mb: 2.5 }}>
                    <InputLabel id="country-label">Ülke</InputLabel>
                    <Select
                      labelId="country-label"
                      value={selectedLocation.country}
                      label="Ülke"
                      onChange={handleCountryChange}
                      sx={{ 
                        borderRadius: 1.5,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: selectedLocation.country !== 'all' ? '#25638f' : undefined,
                          borderWidth: selectedLocation.country !== 'all' ? 1.5 : 1
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#25638f',
                          borderWidth: 1.5
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#25638f'
                        }
                      }}
                    >
                      <MenuItem value="all">Tüm Ülkeler</MenuItem>
                      {locationData.map((country) => (
                        <MenuItem key={country.value} value={country.value}>{country.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl fullWidth size="small" sx={{ mb: 2.5 }}>
                    <InputLabel id="city-label">Şehir</InputLabel>
                    <Select
                      labelId="city-label"
                      value={selectedLocation.city}
                      label="Şehir"
                      onChange={handleCityChange}
                      disabled={selectedLocation.country === 'all'}
                      sx={{ 
                        borderRadius: 1.5,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: selectedLocation.city !== 'all' ? '#25638f' : undefined,
                          borderWidth: selectedLocation.city !== 'all' ? 1.5 : 1
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#25638f',
                          borderWidth: 1.5
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#25638f'
                        }
                      }}
                    >
                      <MenuItem value="all">Tüm Şehirler</MenuItem>
                      {getCitiesForSelectedCountry().map((city: { value: string; label: string }) => (
                        <MenuItem key={city.value} value={city.value}>{city.label}</MenuItem>
                      ))} 
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              {/* Diğer Filtreler ... */}
              {/* ... */}

            </Grid>

            {/* Filtrele Butonu */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<FilterListIcon />}
                onClick={() => {
                  applyFilters();
                  setFilterOpen(false);
                }}
                sx={{ borderRadius: 2, px: 4, fontWeight: 600 }}
              >
                Filtrele
              </Button>
            </Box>
          </Box>
        </Paper>
      </Collapse>

      {/* Sayfalama alt kısımda */}
      <Box sx={{ mt: 3, width: '100%', overflowX: 'auto' }}>
        <CustomPagination
          page={page}
          rowsPerPage={rowsPerPage}
          totalItems={filteredCustomers.length}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
      
      {/* Müşteri işlemleri menüsü */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {/* SMS ve E-posta seçenekleri kaldırıldı - Kart üzerindeki butonlar kullanılacak */}
        <MenuItem 
          onClick={() => { 
            if (selectedCustomer) {
              handleEditCustomer(selectedCustomer);
            }
          }}
        >
          <EditIcon fontSize="small" sx={{ mr: 2, color: '#25638f' }} />
          Düzenle
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <KargolarIcon fontSize="small" sx={{ mr: 2, color: '#25638f' }} />
          Kargolar
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <CloudUploadIcon fontSize="small" sx={{ mr: 2, color: '#25638f' }} />
          Yükle
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => { 
            if (selectedCustomer) {
              setDeleteCustomer(selectedCustomer);
              setDeleteDialogOpen(true);
            }
            handleMenuClose(); 
          }} 
          sx={{ color: '#ff1744' }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 2 }} />
          Sil
        </MenuItem>
      </Menu>
      
      {/* SMS Gönderme Dialog'u */}
      <CustomerSmsDialog
        open={smsDialogOpen}
        customer={smsCustomer}
        onClose={handleSmsClose}
        onSend={handleSmsSend}
      />
      
      {/* E-posta Gönderme Dialog'u */}
      <CustomerEmailDialog
        open={emailDialogOpen}
        customer={emailCustomer}
        onClose={handleEmailClose}
        onSend={handleEmailSend}
      />
      
      {/* Mail Yönetim Dialog'u */}
      <MailDialog
        open={mailDialogOpen}
        onClose={() => setMailDialogOpen(false)}
      />
      
      {/* Silme Onay Dialog'u */}
      <CustomerDeleteDialog
        open={deleteDialogOpen}
        customer={deleteCustomer}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => {
          if (deleteCustomer) {
            // Gerçek uygulamada API çağrısı yapılır
            // Örnek: await deleteCustomer(deleteCustomer.id);
            
            // Müşteri listesinden sil
            const updatedCustomers = customers.filter(c => c.id !== deleteCustomer.id);
            setCustomers(updatedCustomers);
            
            notifications.showSuccess(`Müşteri başarıyla silindi: ${deleteCustomer.name}`);
            setDeleteDialogOpen(false);
          }
        }}
      />
      
      {/* Müşteri Import Dialog'u */}
      <CustomerImportDialog
        open={importDialogOpen}
        onClose={handleImportClose}
        onImport={handleImportCustomers}
      />
      
      {/* Yeni Müşteri Ekle Popup'u */}
      <Dialog
        open={customerFormOpen}
        onClose={handleCustomerFormClose}
        maxWidth="lg"
        fullWidth
        fullScreen={window.innerWidth < 768}
        sx={{
          '& .MuiDialog-paper': {
            height: { xs: '100vh', md: '85vh' },
            maxHeight: { xs: '100vh', md: '900px' },
            borderRadius: { xs: 0, md: 3 },
            margin: { xs: 0, md: 2 }
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white', 
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person sx={{ fontSize: 28 }} />
            {editingCustomer ? 'Müşteri Düzenle' : 'Yeni Müşteri Ekle'}
          </Box>
          <IconButton 
            onClick={handleCustomerFormClose}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <CustomerFormContent 
          editingCustomer={editingCustomer}
          onSubmit={handleCustomerFormSubmit}
          onClose={handleCustomerFormClose}
        />
      </Dialog>
    </Box>
  );
};

export default CustomersPage;
