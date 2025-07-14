import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  Avatar,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Tooltip,
  Grid,
  CircularProgress,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Sms as SmsIcon,
  ShoppingCart as ShoppingCartIcon,
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  Close as CloseIcon,
  AccountBalance as AccountBalanceIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  AttachMoney as AttachMoneyIcon,
  FileDownload as FileDownloadIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  CreditCard as CreditCardIcon,
  MonetizationOn as MonetizationOnIcon,
  Store as StoreIcon,
  Language as LanguageIcon,
  Business as BusinessIcon,
  Login as LoginIcon,
  Sell as SellIcon,
} from '@mui/icons-material';
import RichTextEditor from '../common/RichTextEditor';
import { Customer } from '../../types/Customer';
import { Link } from 'react-router-dom';

// İsim baş harflerini alma fonksiyonu
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
};

// Ülke koduna göre bayrak URL'si döndüren fonksiyon
const getFlagUrl = (countryCode: string): string => {
  if (!countryCode) return '/flags/tr.svg';
  
  // Ülke kodunu küçük harfe çevir
  const code = countryCode.toLowerCase();
  
  // Özel durumlar için kontrol
  if (code === 'ru') {
    return '/flags/ru.svg';
  }
  
  // Kod-ülke adı eşleştirmeleri - ISO kodlarını kullan
  const codeToCountryName: Record<string, string> = {
    'tr': 'tr',     // Türkiye
    'us': 'us',     // Amerika Birleşik Devletleri
    'ru': 'ru',     // Rusya
    'gb': 'gb',     // Birleşik Krallık
    'uk': 'gb',     // Birleşik Krallık alternatif kod
    'de': 'de',     // Almanya
    'fr': 'fr',     // Fransa
    'it': 'it',     // İtalya
    'es': 'es',     // İspanya
    'cn': 'cn',     // Çin
    'jp': 'jp',     // Japonya
    'br': 'br',     // Brezilya
    'ca': 'ca',     // Kanada
    'au': 'au',     // Avustralya
    'in': 'in',     // Hindistan
    'nl': 'nl',     // Hollanda
    'be': 'be',     // Belçika
    'se': 'se',     // İsveç
    'no': 'no',     // Norveç
    'dk': 'dk',     // Danimarka
    'fi': 'fi',     // Finlandiya
    'pt': 'pt',
    'gr': 'gr',
    'pl': 'pl',
    'ch': 'ch',
    'at': 'at',
    'ie': 'ie',
    'nz': 'nz',
    'za': 'za',
    'mx': 'mx',
    'ar': 'ar',
    'cl': 'cl',
    'co': 'co',
    'pe': 'pe',
    've': 've',
    'sg': 'sg',
    'my': 'my',
    'th': 'th',
    'id': 'id',
    'ph': 'ph',
    'vn': 'vn',
    'ae': 'ae',
    'sa': 'sa',
    'il': 'il',
    'eg': 'eg'
  };
  
  // Ülke kodunu eşleştirme tablosundan al, yoksa doğrudan kodu kullan
  const flagCode = codeToCountryName[code] || code;
  
  // Bayrak URL'sini döndür
  return `/flags/${flagCode}.svg`;
};

// Ülke kodunu ülke adına çeviren fonksiyon
const getCountryName = (countryCode: string): string => {
  const countries: Record<string, string> = {
    'ad': 'Andorra',
    'ae': 'Birleşik Arap Emirlikleri',
    'af': 'Afganistan',
    'ag': 'Antigua ve Barbuda',
    'ai': 'Anguilla',
    'al': 'Arnavutluk',
    'am': 'Ermenistan',
    'ao': 'Angola',
    'aq': 'Antarktika',
    'ar': 'Arjantin',
    'as': 'Amerikan Samoası',
    'at': 'Avusturya',
    'au': 'Avustralya',
    'aw': 'Aruba',
    'ax': 'Åland Adaları',
    'az': 'Azerbaycan',
    'ba': 'Bosna Hersek',
    'bb': 'Barbados',
    'bd': 'Bangladeş',
    'be': 'Belçika',
    'bf': 'Burkina Faso',
    'bg': 'Bulgaristan',
    'bh': 'Bahreyn',
    'bi': 'Burundi',
    'bj': 'Benin',
    'bl': 'Saint Barthélemy',
    'bm': 'Bermuda',
    'bn': 'Brunei',
    'bo': 'Bolivya',
    'br': 'Brezilya',
    'bs': 'Bahamalar',
    'bt': 'Butan',
    'bw': 'Botsvana',
    'by': 'Belarus',
    'bz': 'Belize',
    'ca': 'Kanada',
    'cc': 'Cocos (Keeling) Adaları',
    'cd': 'Kongo Demokratik Cumhuriyeti',
    'cf': 'Orta Afrika Cumhuriyeti',
    'cg': 'Kongo',
    'ch': 'İsviçre',
    'ci': 'Fildişi Sahili',
    'ck': 'Cook Adaları',
    'cl': 'Şili',
    'cm': 'Kamerun',
    'cn': 'Çin',
    'co': 'Kolombiya',
    'cr': 'Kosta Rika',
    'cu': 'Küba',
    'cv': 'Cabo Verde',
    'cw': 'Curaçao',
    'cy': 'Kıbrıs',
    'cz': 'Çekya',
    'de': 'Almanya',
    'dj': 'Cibuti',
    'dk': 'Danimarka',
    'dm': 'Dominika',
    'do': 'Dominik Cumhuriyeti',
    'dz': 'Cezayir',
    'ec': 'Ekvador',
    'ee': 'Estonya',
    'eg': 'Mısır',
    'eh': 'Batı Sahra',
    'er': 'Eritre',
    'es': 'İspanya',
    'et': 'Etiyopya',
    'fi': 'Finlandiya',
    'fj': 'Fiji',
    'fk': 'Falkland Adaları',
    'fm': 'Mikronezya',
    'fo': 'Faroe Adaları',
    'fr': 'Fransa',
    'ga': 'Gabon',
    'gb': 'Birleşik Krallık',
    'gd': 'Grenada',
    'ge': 'Gürcistan',
    'gf': 'Fransız Guyanası',
    'gg': 'Guernsey',
    'gh': 'Gana',
    'gi': 'Cebelitarık',
    'gl': 'Grönland',
    'gm': 'Gambiya',
    'gn': 'Gine',
    'gp': 'Guadeloupe',
    'gq': 'Ekvator Ginesi',
    'gr': 'Yunanistan',
    'gs': 'Güney Georgia ve Güney Sandwich Adaları',
    'gt': 'Guatemala',
    'gu': 'Guam',
    'gw': 'Gine-Bissau',
    'gy': 'Guyana',
    'hk': 'Hong Kong',
    'hm': 'Heard Adası ve McDonald Adaları',
    'hn': 'Honduras',
    'hr': 'Hırvatistan',
    'ht': 'Haiti',
    'hu': 'Macaristan',
    'id': 'Endonezya',
    'ie': 'İrlanda',
    'il': 'İsrail',
    'im': 'Man Adası',
    'in': 'Hindistan',
    'io': 'Britanya Hint Okyanusu Toprakları',
    'iq': 'Irak',
    'ir': 'İran',
    'is': 'İzlanda',
    'it': 'İtalya',
    'je': 'Jersey',
    'jm': 'Jamaika',
    'jo': 'Ürdün',
    'jp': 'Japonya',
    'ke': 'Kenya',
    'kg': 'Kırgızistan',
    'kh': 'Kamboçya',
    'ki': 'Kiribati',
    'km': 'Komorlar',
    'kn': 'Saint Kitts ve Nevis',
    'kp': 'Kuzey Kore',
    'kr': 'Güney Kore',
    'kw': 'Kuveyt',
    'ky': 'Cayman Adaları',
    'kz': 'Kazakistan',
    'la': 'Laos',
    'lb': 'Lübnan',
    'lc': 'Saint Lucia',
    'li': 'Lihtenştayn',
    'lk': 'Sri Lanka',
    'lr': 'Liberya',
    'ls': 'Lesotho',
    'lt': 'Litvanya',
    'lu': 'Lüksemburg',
    'lv': 'Letonya',
    'ly': 'Libya',
    'ma': 'Fas',
    'mc': 'Monako',
    'md': 'Moldova',
    'me': 'Karadağ',
    'mf': 'Saint Martin',
    'mg': 'Madagaskar',
    'mh': 'Marshall Adaları',
    'mk': 'Kuzey Makedonya',
    'ml': 'Mali',
    'mm': 'Myanmar',
    'mn': 'Moğolistan',
    'mo': 'Makao',
    'mp': 'Kuzey Mariana Adaları',
    'mq': 'Martinik',
    'mr': 'Moritanya',
    'ms': 'Montserrat',
    'mt': 'Malta',
    'mu': 'Mauritius',
    'mv': 'Maldivler',
    'mw': 'Malavi',
    'mx': 'Meksika',
    'my': 'Malezya',
    'mz': 'Mozambik',
    'na': 'Namibya',
    'nc': 'Yeni Kaledonya',
    'ne': 'Nijer',
    'nf': 'Norfolk Adası',
    'ng': 'Nijerya',
    'ni': 'Nikaragua',
    'nl': 'Hollanda',
    'no': 'Norveç',
    'np': 'Nepal',
    'nr': 'Nauru',
    'nu': 'Niue',
    'nz': 'Yeni Zelanda',
    'om': 'Umman',
    'pa': 'Panama',
    'pe': 'Peru',
    'pf': 'Fransız Polinezyası',
    'pg': 'Papua Yeni Gine',
    'ph': 'Filipinler',
    'pk': 'Pakistan',
    'pl': 'Polonya',
    'pm': 'Saint Pierre ve Miquelon',
    'pn': 'Pitcairn Adaları',
    'pr': 'Porto Riko',
    'ps': 'Filistin',
    'pt': 'Portekiz',
    'pw': 'Palau',
    'py': 'Paraguay',
    'qa': 'Katar',
    're': 'Réunion',
    'ro': 'Romanya',
    'rs': 'Sırbistan',
    'ru': 'Rusya',
    'rw': 'Ruanda',
    'sa': 'Suudi Arabistan',
    'sb': 'Solomon Adaları',
    'sc': 'Seyşeller',
    'sd': 'Sudan',
    'se': 'İsveç',
    'sg': 'Singapur',
    'sh': 'Saint Helena',
    'si': 'Slovenya',
    'sj': 'Svalbard ve Jan Mayen',
    'sk': 'Slovakya',
    'sl': 'Sierra Leone',
    'sm': 'San Marino',
    'sn': 'Senegal',
    'so': 'Somali',
    'sr': 'Surinam',
    'ss': 'Güney Sudan',
    'st': 'São Tomé ve Príncipe',
    'sv': 'El Salvador',
    'sx': 'Sint Maarten',
    'sy': 'Suriye',
    'sz': 'Eswatini',
    'tc': 'Turks ve Caicos Adaları',
    'td': 'Çad',
    'tf': 'Fransız Güney ve Antarktika Toprakları',
    'tg': 'Togo',
    'th': 'Tayland',
    'tj': 'Tacikistan',
    'tk': 'Tokelau',
    'tl': 'Doğu Timor',
    'tm': 'Türkmenistan',
    'tn': 'Tunus',
    'to': 'Tonga',
    'tr': 'Türkiye',
    'tt': 'Trinidad ve Tobago',
    'tv': 'Tuvalu',
    'tw': 'Tayvan',
    'tz': 'Tanzanya',
    'ua': 'Ukrayna',
    'ug': 'Uganda',
    'um': 'ABD Küçük Dış Adaları',
    'us': 'Amerika Birleşik Devletleri',
    'uy': 'Uruguay',
    'uz': 'Özbekistan',
    'va': 'Vatikan',
    'vc': 'Saint Vincent ve Grenadinler',
    've': 'Venezuela',
    'vg': 'Britanya Virgin Adaları',
    'vi': 'ABD Virgin Adaları',
    'vn': 'Vietnam',
    'vu': 'Vanuatu',
    'wf': 'Wallis ve Futuna',
    'ws': 'Samoa',
    'ye': 'Yemen',
    'yt': 'Mayotte',
    'za': 'Güney Afrika',
    'zm': 'Zambiya',
    'zw': 'Zimbabve'
  };
  
  return countries[countryCode.toLowerCase()] || countryCode;
};

// Müşteri tipini alıcı tipine çeviren fonksiyon
const getCustomerTypeName = (type: string): string => {
  const types: Record<string, string> = {
    'retail': 'Perakende',
    'wholesale': 'Toptan',
    'distributor': 'Distribütör',
    'partner': 'Partner',
    // Daha fazla tip eklenebilir
  };
  
  return types[type.toLowerCase()] || type;
};

interface CustomerCardProps {
  customer: Customer;
  onClick?: () => void;
  onMenuOpen?: (event: React.MouseEvent<HTMLElement>, customer: Customer) => void;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onMenuOpen }) => {
  // Örnek sipariş verileri
  const exampleOrders = [
    { id: `ORD-${customer.id}-001`, date: '01.06.2025', products: 'Elektronik Ürünler (3)', amount: '1.250 ₺', status: 'Tamamlandı', statusColor: '#4caf50' },
    { id: `ORD-${customer.id}-002`, date: '15.05.2025', products: 'Ofis Malzemeleri (5)', amount: '850 ₺', status: 'Tamamlandı', statusColor: '#4caf50' },
    { id: `ORD-${customer.id}-003`, date: '28.04.2025', products: 'Mobilya (2)', amount: '1.750 ₺', status: 'Kargoda', statusColor: '#ff9800' },
    { id: `ORD-${customer.id}-004`, date: '10.04.2025', products: 'Tekstil Ürünleri (4)', amount: '500 ₺', status: 'Tamamlandı', statusColor: '#4caf50' },
    { id: `ORD-${customer.id}-005`, date: '05.04.2025', products: 'Mutfak Gereçleri (6)', amount: '1.120 ₺', status: 'Tamamlandı', statusColor: '#4caf50' },
    { id: `ORD-${customer.id}-006`, date: '20.03.2025', products: 'Spor Malzemeleri (2)', amount: '750 ₺', status: 'Tamamlandı', statusColor: '#4caf50' },
    { id: `ORD-${customer.id}-007`, date: '10.03.2025', products: 'Elektronik Aksesuarlar (8)', amount: '480 ₺', status: 'İptal Edildi', statusColor: '#f44336' },
    { id: `ORD-${customer.id}-008`, date: '25.02.2025', products: 'Kitaplar (4)', amount: '320 ₺', status: 'Tamamlandı', statusColor: '#4caf50' },
    { id: `ORD-${customer.id}-009`, date: '15.02.2025', products: 'Bahçe Mobilyası (3)', amount: '2.350 ₺', status: 'Hazırlanıyor', statusColor: '#2196f3' },
    { id: `ORD-${customer.id}-010`, date: '05.02.2025', products: 'Bilgisayar Parçaları (5)', amount: '3.750 ₺', status: 'Tamamlandı', statusColor: '#4caf50' },
    { id: `ORD-${customer.id}-011`, date: '20.01.2025', products: 'Oyuncaklar (7)', amount: '650 ₺', status: 'Tamamlandı', statusColor: '#4caf50' },
    { id: `ORD-${customer.id}-012`, date: '10.01.2025', products: 'Kırtasiye Ürünleri (10)', amount: '420 ₺', status: 'Tamamlandı', statusColor: '#4caf50' },
  ];
  
  // Cari hareket verileri kaldırıldı
  
  const [openSmsDialog, setOpenSmsDialog] = useState(false);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [openOrdersDialog, setOpenOrdersDialog] = useState(false);
  // Cari hareket dialogu kaldırıldı
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredOrders, setFilteredOrders] = useState<any[]>(exampleOrders);
  
  const [smsMessage, setSmsMessage] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  
  // Cari hareket dialog state'leri kaldırıldı
  
  // Tahsilat dialog state'leri
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentCurrency, setPaymentCurrency] = useState('TRY');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentNote, setPaymentNote] = useState('');
  
  // İşlem verileri kaldırıldı
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  // SMS Dialog açma/kapama
  const handleSmsDialogOpen = () => {
    setOpenSmsDialog(true);
  };

  const handleSmsDialogClose = () => {
    setOpenSmsDialog(false);
    setSmsMessage('');
  };

  // Email Dialog açma/kapama
  const handleEmailDialogOpen = () => {
    setOpenEmailDialog(true);
  };

  const handleEmailDialogClose = () => {
    setOpenEmailDialog(false);
    setEmailSubject('');
    setEmailBody('');
  };

  // Siparişler Dialog açma/kapama
  const handleOrdersDialogOpen = () => {
    setOpenOrdersDialog(true);
  };

  const handleOrdersDialogClose = () => {
    setOpenOrdersDialog(false);
    setShowAllOrders(false);
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    setStatusFilter('all');
    setFilteredOrders(exampleOrders);
  };

  // Cari hareket görüntüleme fonksiyonu - sadeleştirildi
  const handleAccountDialogOpen = () => {
    console.log('Cari hareket görüntüleme:', customer.id);
    // Burada sadece log yazılıyor, dialog açılmıyor
  };

  // Tahsilat Dialog açma/kapama
  const handlePaymentDialogOpen = () => {
    setOpenPaymentDialog(true);
  };

  const handlePaymentDialogClose = () => {
    setOpenPaymentDialog(false);
    setPaymentAmount('');
    setPaymentCurrency('TRY');
    setPaymentMethod('cash');
    setPaymentNote('');
  };
  
  // Menu açma/kapama
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Para birimi ve işlem tipi değiştirme fonksiyonları kaldırıldı
  
  // Ödeme yöntemi değiştirme
  const handlePaymentMethodChange = (event: SelectChangeEvent) => {
    setPaymentMethod(event.target.value);
  };
  
  // Ödeme para birimi değiştirme
  const handlePaymentCurrencyChange = (event: SelectChangeEvent) => {
    setPaymentCurrency(event.target.value);
  };
  
  // Tüm siparişleri görüntüleme fonksiyonu
  const handleViewAllOrders = () => {
    console.log('Sipariş listesi durumu değiştiriliyor:', customer.id);
    setShowAllOrders(!showAllOrders);
  };
  
  
  // Türkçe tarih formatını (DD.MM.YYYY) JavaScript Date nesnesine çeviren fonksiyon
  const convertToDate = (dateStr: string): Date => {
    if (!dateStr) return new Date();
    
    const parts = dateStr.split('.');
    if (parts.length !== 3) return new Date();
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // JavaScript'te aylar 0-11 arasında
    const year = parseInt(parts[2], 10);
    
    return new Date(year, month, day);
  };
  
  const formatCurrency = (amount: number, currency: string): string => {
    const currencySymbols: Record<string, string> = {
      'TRY': '₺',
      'USD': '$',
      'EUR': '€',
      'GBP': '£'
    };
    
    const formattedAmount = new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
    
    return `${formattedAmount} ${currencySymbols[currency] || currency}`;
  };
  
  
  // Kullanılmayan fonksiyonlar kaldırıldı
  
  // Ödeme ekleme fonksiyonu
  const handleAddPayment = () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      return;
    }
    
    const paymentAmount_num = parseFloat(paymentAmount);
    
    // Yeni ödeme işlemi oluşturma
    const newTransaction = {
      id: `TRX-${customer.id}-${Math.floor(Math.random() * 10000)}`,
      date: new Date().toLocaleDateString('tr-TR'),
      type: 'Tahsilat',
      description: `${paymentMethod === 'cash' ? 'Nakit' : 
                    paymentMethod === 'bank' ? 'Banka' : 
                    paymentMethod === 'credit_card' ? 'Kredi Kartı' : 'Çek'} Ödeme${paymentNote ? ': ' + paymentNote : ''}`,
      currency: paymentCurrency,
      amount: paymentAmount_num
    };
    
    // Dialog'u kapat
    handlePaymentDialogClose();
    
    console.log('Yeni ödeme eklendi:', newTransaction);
  };
  
  // Siparişleri filtreleme fonksiyonu
  useEffect(() => {
    const filterOrders = () => {
      let filtered = [...exampleOrders];
      
      if (searchTerm) {
        filtered = filtered.filter(order => 
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.products.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (statusFilter !== 'all') {
        filtered = filtered.filter(order => order.status === statusFilter);
        
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        filtered = filtered.filter(order => {
          const orderDate = convertToDate(order.date);
          return orderDate >= start && orderDate <= end;
        });
      }
      
      setFilteredOrders(filtered);
    };
    
    filterOrders();
  }, [searchTerm, startDate, endDate, customer.id]);
  
  // Excel raporu indirme fonksiyonu
  const handleExportToExcel = () => {
    try {
      // Excel uyumlu CSV formatında veri oluşturma
      // Tab karakteri kullanarak sütunları ayırma (Excel'de daha iyi çalışır)
      const headers = ['Sipariş No', 'Tarih', 'Ürünler', 'Tutar', 'Durum'];
      
      // Verileri belirli bir sırada oluşturma
      const rows = filteredOrders.map(order => {
        return {
          id: order.id,
          date: order.date,
          products: order.products,
          amount: order.amount,
          status: order.status
        };
      });
      
      // Toplam tutar hesaplama
      let totalAmount = 0;
      rows.forEach(row => {
        // Tutarı sayıya çevirme ("1.250 ₺" gibi formatlardan sayıyı çıkarma)
        const amountStr = row.amount.toString();
        const numericValue = parseFloat(amountStr.replace(/[^0-9,.]/g, '').replace(',', '.'));
        if (!isNaN(numericValue)) {
          totalAmount += numericValue;
        }
      });
      
      // Toplam tutarı formatlı gösterme
      const formattedTotal = totalAmount.toLocaleString('tr-TR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) + ' ₺';
      
      // Excel'in otomatik olarak tanıyacağı şekilde TSV (tab-separated values) formatında içerik oluşturma
      const tsvRows = [
        headers.join('\t'),
        ...rows.map(row => [
          row.id,
          row.date,
          row.products, // Tab ayracı kullandığımız için tırnak gerekmiyor
          row.amount,
          row.status
        ].join('\t'))
      ];
      
      // Toplam satırını ekleme
      tsvRows.push(['', '', 'TOPLAM', formattedTotal, ''].join('\t'));
      
      // Toplam sipariş sayısı satırını ekleme
      tsvRows.push(['', '', `TOPLAM SİPARİŞ SAYISI: ${rows.length} ADET`, '', ''].join('\t'));
      
      // Tüm satırları birleştirme
      const tsvContent = tsvRows.join('\r\n'); // Windows satır sonu karakteri Excel için daha uyumlu
      
      // TSV dosyasını indirme
      const blob = new Blob([tsvContent], { type: 'text/tab-separated-values;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${customer.name}_Siparişler_${new Date().toLocaleDateString()}.xls`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Excel raporu indirildi:', customer.name, 'Toplam:', formattedTotal);
    } catch (error) {
      console.error('Excel raporu oluşturulurken hata:', error);
    }
  };
  
  // SMS gönderme işlevi
  const handleSendSms = () => {
    console.log('SMS gönderiliyor:', { to: customer.phone, message: smsMessage });
    // Burada SMS gönderme API çağrısı yapılacak
    handleSmsDialogClose();
    // Başarılı gönderim bildirimi gösterilebilir
  };
  
  // E-posta gönderme işlevi
  const handleSendEmail = () => {
    console.log('E-posta gönderiliyor:', { 
      to: customer.email, 
      subject: emailSubject, 
      body: emailBody 
    });
    // Burada e-posta gönderme API çağrısı yapılacak
    handleEmailDialogClose();
    // Başarılı gönderim bildirimi gösterilebilir
  };
  
  return (
    <Card sx={{ 
      position: 'relative',
      overflow: 'visible',
      borderRadius: 2,
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '1px solid #f0f0f0',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        transform: 'translateY(-4px)'
      },
      // Aksan rengi alt çizgi
      borderBottom: '4px solid #ff5722'
    }}>
      {/* Kart Üst Kısım - Gradient Başlık */}
      <Box sx={{ 
        height: 90, 
        background: 'linear-gradient(135deg, #25638f 0%, #1e5172 100%)',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        display: 'flex',
        alignItems: 'center',
        px: 3,
        position: 'relative',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.1,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM-6 60c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
          backgroundSize: '24px 24px'
        }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Üç Nokta Menü Butonu */}
          <IconButton 
            size="small" 
            onClick={(e) => onMenuOpen && onMenuOpen(e, customer)}
            sx={{ 
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.15)',
              mr: 1,
              width: 36,
              height: 36,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.25)'
              }
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
          
          {/* Durum Etiketi */}
          <Box sx={{ 
            background: 'linear-gradient(90deg, #ff5722 0%, #ff7043 100%)',
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: 600,
            py: 0.5,
            px: 2,
            borderRadius: 20,
            boxShadow: '0 2px 8px rgba(255,87,34,0.3)',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }}>
            {customer.status}
          </Box>
        </Box>
      </Box>
      
      {/* Avatar */}
      <Box sx={{ 
        position: 'relative', 
        display: 'flex', 
        justifyContent: 'center',
        mt: -6,
        mb: 2,
        zIndex: 1
      }}>
        <Avatar 
          src={`https://randomuser.me/api/portraits/${customer.id.charCodeAt(0) % 2 === 0 ? 'men' : 'women'}/${customer.id.charCodeAt(0) % 10}.jpg`}
          sx={{ 
            width: 100,
            height: 100,
            border: '5px solid white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {getInitials(customer.name)}
        </Avatar>
      </Box>
      
      {/* Müşteri Bilgileri */}
      <Box sx={{ textAlign: 'center', px: 3, pb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
          {customer.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {customer.party || 'Firma bilgisi yok'}
        </Typography>
        
        {/* İletişim Butonları */}
        <Box sx={{ display: 'flex', justifyContent: 'space-around', p: 1 }}>
          {/* SMS Butonu */}
          <Box sx={{ textAlign: 'center' }}>
            <IconButton 
              onClick={handleSmsDialogOpen}
              size="small" 
              sx={{ 
                bgcolor: '#f5f5f5',
                '&:hover': { bgcolor: '#e0e0e0' }
              }}
            >
              <SmsIcon fontSize="small" color="primary" />
            </IconButton>
          </Box>
          
          {/* E-posta Butonu */}
          <Box sx={{ textAlign: 'center' }}>
            <IconButton 
              onClick={handleEmailDialogOpen}
              size="small" 
              sx={{ 
                bgcolor: '#f5f5f5',
                '&:hover': { bgcolor: '#e0e0e0' }
              }}
            >
              <EmailIcon fontSize="small" color="primary" />
            </IconButton>
          </Box>
          
          {/* Sepet Butonu */}
          <Box sx={{ textAlign: 'center' }}>
            <IconButton 
              onClick={handleOrdersDialogOpen}
              size="small" 
              sx={{ 
                bgcolor: '#f5f5f5',
                '&:hover': { bgcolor: '#e0e0e0' }
              }}
            >
              <ShoppingCartIcon fontSize="small" color="primary" />
            </IconButton>
          </Box>
          
          {/* Görüntüleme Butonu */}
          <Box sx={{ textAlign: 'center' }}>
            <IconButton 
              onClick={handleAccountDialogOpen}
              size="small" 
              sx={{ 
                bgcolor: '#f5f5f5',
                '&:hover': { bgcolor: '#e0e0e0' }
              }}
            >
              <VisibilityIcon fontSize="small" color="primary" />
            </IconButton>
          </Box>
        </Box>
      </Box>
      
      <Divider />
      
      {/* İletişim Bilgileri - Yeni Format */}
      <Box sx={{ p: 2 }}>
        {/* Müşteri Kodu */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 1.5 
        }}>
          <PersonIcon fontSize="small" sx={{ color: '#1e5172', mr: 1.5 }} />
          <Typography variant="body2" fontWeight="medium">
            {customer.id || 'TK-4734'}
          </Typography>
        </Box>
        
        {/* E-posta */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 1.5 
        }}>
          <EmailIcon fontSize="small" sx={{ color: '#1e5172', mr: 1.5 }} />
          <Typography variant="body2">
            {customer.email || 'E-posta bilgisi yok'}
          </Typography>
        </Box>
        
        {/* Ülke ve Şehir */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 1.5 
        }}>
          <Box 
            component="img"
            src={getFlagUrl(customer.country)}
            alt={getCountryName(customer.country || 'tr')}
            sx={{ 
              width: 30, 
              height: 30, 
              borderRadius: '50%', 
              mr: 1.5,
              objectFit: 'cover',
              border: '2px solid #eee',
              boxShadow: '0 3px 5px rgba(0,0,0,0.15)',
              display: 'inline-block',
              verticalAlign: 'middle'
            }}
            onError={(e) => {
              // Bayrak yüklenemezse hata durumunda
              const target = e.target as HTMLImageElement;
              console.log(`Bayrak yüklenemedi: ${target.src}`);
              target.onerror = null; // Sonsuz döngüyü önle
              target.src = '/flags/tr.svg'; // Varsayılan bayrak
            }}
          />
          <Typography variant="body2" fontWeight="medium">
            {getCountryName(customer.country || 'tr')} / {customer.city || 'İstanbul'}
          </Typography>
        </Box>
        
        {/* Müşteri Tipi */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 1.5 
        }}>
          <StoreIcon fontSize="small" sx={{ color: '#1e5172', mr: 1.5 }} />
          <Typography variant="body2">
            Alıcı /{customer.party || 'Perakende'}
          </Typography>
        </Box>
        
        {/* Toplam Sipariş */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center' 
        }}>
          <SellIcon fontSize="small" sx={{ color: '#1e5172', mr: 1.5 }} />
          <Typography variant="body2">
            Toplam Sipariş: {customer.totalOrders || customer.orders || customer.siparisler || '8'}
          </Typography>
        </Box>
      </Box>
      
      <Divider />
      
      {/* Alt Kısım - Detay Butonu */}
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'center',
        p: 2
      }}>
        <Button 
          variant="outlined" 
          component={Link}
          to={`/account-details/${customer.code}`}
          endIcon={<KeyboardArrowRightIcon />}
          sx={{ 
            borderRadius: 4,
            textTransform: 'none',
            px: 3
          }}
        >
          Müşteri Detayları
        </Button>
      </Box>
      
      {/* SMS Dialog */}
      <Dialog open={openSmsDialog} onClose={handleSmsDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#25638f', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SmsIcon />
            <Typography variant="h6">SMS Gönder</Typography>
          </Box>
          <IconButton onClick={handleSmsDialogClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Alıcı"
                value={customer.phone || 'Telefon bilgisi yok'}
                fullWidth
                disabled
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Mesaj"
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                margin="normal"
                placeholder="SMS mesajınızı buraya yazın..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button onClick={handleSmsDialogClose} variant="outlined">
            İptal
          </Button>
          <Button 
            onClick={handleSendSms} 
            variant="contained" 
            sx={{ bgcolor: '#25638f', '&:hover': { bgcolor: '#1e5070' } }}
          >
            Gönder
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* E-posta Dialog */}
      <Dialog open={openEmailDialog} onClose={handleEmailDialogClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#25638f', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailIcon />
            <Typography variant="h6">E-posta Gönder</Typography>
          </Box>
          <IconButton onClick={handleEmailDialogClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Alıcı"
                value={customer.email || 'musteri@example.com'}
                fullWidth
                disabled
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Konu"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                fullWidth
                variant="outlined"
                margin="normal"
                placeholder="E-posta konusu..."
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Mesaj
              </Typography>
              <RichTextEditor
                value={emailBody}
                onChange={setEmailBody}
                placeholder="Mesajınızı buraya yazın..."
                minRows={8}
                maxRows={12}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button onClick={handleEmailDialogClose} variant="outlined">
            İptal
          </Button>
          <Button 
            onClick={handleSendEmail} 
            variant="contained" 
            sx={{ bgcolor: '#25638f', '&:hover': { bgcolor: '#1e5070' } }}
          >
            Gönder
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cari Hareketler Dialog kaldırıldı */}
      
      {/* Tahsilat Dialog */}
      <Dialog
        open={openPaymentDialog}
        onClose={handlePaymentDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#4caf50', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PaymentIcon />
            <Typography variant="h6">Tahsilat / Ödeme İşlemi</Typography>
          </Box>
          <IconButton onClick={handlePaymentDialogClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>İşlem Tipi</InputLabel>
                <Select
                  value={paymentMethod}
                  label="İşlem Tipi"
                  onChange={handlePaymentMethodChange}
                >
                  <MenuItem value="cash">Nakit</MenuItem>
                  <MenuItem value="bank">Banka</MenuItem>
                  <MenuItem value="credit_card">Kredi Kartı</MenuItem>
                  <MenuItem value="check">Çek</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={8}>
              <TextField
                label="Tutar"
                type="number"
                fullWidth
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Para Birimi</InputLabel>
                <Select
                  value={paymentCurrency}
                  label="Para Birimi"
                  onChange={handlePaymentCurrencyChange}
                >
                  <MenuItem value="TRY">TL</MenuItem>
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="GBP">GBP</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Açıklama"
                fullWidth
                multiline
                rows={3}
                value={paymentNote}
                onChange={(e) => setPaymentNote(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button onClick={handlePaymentDialogClose} variant="outlined">
            İptal
          </Button>
          <Button 
            onClick={handleAddPayment} 
            variant="contained" 
            color="success"
            disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
          >
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Sipariş Listesi Dialog */}
      <Dialog open={openOrdersDialog} onClose={handleOrdersDialogClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#25638f', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShoppingCartIcon />
            <Typography variant="h6">Sipariş Listesi</Typography>
          </Box>
          <IconButton onClick={handleOrdersDialogClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1, color: '#25638f', fontWeight: 'bold' }}>
              Müşteri: {customer.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Chip 
                label={`Toplam Sipariş: ${customer.totalOrders || customer.orders || customer.siparisler || '8'}`} 
                color="primary" 
                sx={{ 
                  fontWeight: 'bold', 
                  mr: 2, 
                  bgcolor: '#25638f' 
                }} 
              />
              <Chip 
                label={`Toplam Tutar: ${customer.bakiye || customer.balance || '4.350'} ₺`} 
                color="secondary" 
                sx={{ 
                  fontWeight: 'bold', 
                  bgcolor: '#ff5722',
                  color: 'white'
                }} 
              />
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              {/* Toplam tutar bilgisi kaldırıldı */}
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Sipariş ara..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
            
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                label="Başlangıç Tarihi"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                label="Bitiş Tarihi"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button 
                fullWidth 
                variant="outlined" 
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                  setSearchTerm('');
                }}
                sx={{ height: '40px' }}
              >
                Temizle
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<FileDownloadIcon />}
                onClick={handleExportToExcel}
                disabled={filteredOrders.length === 0}
                sx={{ 
                  float: 'right',
                  mt: 1
                }}
              >
                Excel Raporu İndir
              </Button>
            </Grid>
          </Grid>

          <TableContainer component={Paper} sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', maxHeight: showAllOrders ? '600px' : '300px', overflow: 'auto' }}>
            <Table stickyHeader>
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Sipariş No</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Tarih</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Ürünler</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Tutar</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Durum</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Filtrelenmiş sipariş verileri */}
                {filteredOrders.length > 0 ? (
                  (showAllOrders ? filteredOrders : filteredOrders.slice(0, 4)).map((order, index) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.products}</TableCell>
                      <TableCell>{order.amount}</TableCell>
                      <TableCell>
                        <Chip label={order.status} size="small" sx={{ bgcolor: order.statusColor, color: 'white' }} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="text.secondary">
                        Arama kriterlerine uygun sipariş bulunamadı.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Son sipariş: {customer.lastOrder || '01.06.2025'}
            </Typography>
            <Button 
              variant="contained" 
              size="small"
              onClick={handleViewAllOrders}
              sx={{ 
                bgcolor: showAllOrders ? '#ff5722' : '#25638f', 
                '&:hover': { bgcolor: showAllOrders ? '#e64a19' : '#1e5070' },
                textTransform: 'none'
              }}
            >
              {showAllOrders ? 'Listeyi Daralt' : 'Tüm Siparişleri Görüntüle'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CustomerCard;
