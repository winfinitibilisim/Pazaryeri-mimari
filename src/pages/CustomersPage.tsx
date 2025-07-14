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
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Menu as MenuIcon,
  FileDownload as ExportIcon,
  Print as PrintIcon,
  FlashOn as QuickAddIcon,
  ShoppingCart as SalesIcon,
  Description as KargolarIcon,
  Person as PersonIcon,
  ShoppingBag as ShoppingBagIcon,
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
  const [quickAddDialogOpen, setQuickAddDialogOpen] = useState(false);
  
  // Yeni müşteri dialog'unu açma fonksiyonu
  const handleNewCustomerOpen = () => {
    setNewCustomerDialogOpen(true);
  };
  
  // Yeni müşteri dialog'unu kapatma fonksiyonu
  const handleNewCustomerClose = () => {
    setNewCustomerDialogOpen(false);
  };
  
  // Hızlı ekleme dialog'unu açma fonksiyonu
  const handleQuickAddOpen = () => {
    setQuickAddDialogOpen(true);
  };
  
  // Hızlı ekleme dialog'unu kapatma fonksiyonu
  const handleQuickAddClose = () => {
    setQuickAddDialogOpen(false);
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
      {/* Mavi Başlık */}
      <Box sx={{ 
        bgcolor: '#1e5172',
        color: 'white',
        p: 2,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        mb: 0
      }}>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Müşteriler
        </Typography>
      </Box>
      
      {/* Sekme Menüsü */}
      <Box sx={{ 
        display: 'flex',
        borderBottom: '1px solid #e0e0e0',
        bgcolor: '#fff'
      }}>
        <Box sx={{ 
          py: 1.5,
          px: 2,
          borderBottom: '2px solid #1e5172',
          color: '#1e5172',
          fontWeight: 'bold'
        }}>
          <Typography variant="subtitle2">Müşteri Listesi</Typography>
        </Box>
        
        <Link to="/add-customer" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Box sx={{ 
            py: 1.5,
            px: 2,
            color: '#555',
            '&:hover': { bgcolor: '#f5f5f5' },
            cursor: 'pointer'
          }}>
            <Typography variant="subtitle2">Yeni Müşteri Ekle</Typography>
          </Box>
        </Link>
        
        <Box sx={{ 
          py: 1.5,
          px: 2,
          display: 'flex',
          alignItems: 'center',
          color: '#555',
          '&:hover': { bgcolor: '#f5f5f5' },
          cursor: 'pointer'
        }} onClick={handleQuickAddOpen}>
          <Box component="span" sx={{ mr: 0.5 }}>⚡</Box>
          <Typography variant="subtitle2">Hızlı Müşteri Ekle</Typography>
        </Box>
        
        <Box sx={{ 
          py: 1.5,
          px: 2,
          display: 'flex',
          alignItems: 'center',
          color: '#555',
          '&:hover': { bgcolor: '#f5f5f5' },
          cursor: 'pointer'
        }} onClick={handleImportOpen}>
          <Box component="span" sx={{ mr: 0.5 }}>📥</Box>
          <Typography variant="subtitle2">İçe Aktar</Typography>
        </Box>
        
        <Box sx={{ 
          py: 1.5,
          px: 2,
          display: 'flex',
          alignItems: 'center',
          color: '#555',
          '&:hover': { bgcolor: '#f5f5f5' },
          cursor: 'pointer'
        }} onClick={() => setMailDialogOpen(true)}>
          <Box component="span" sx={{ mr: 0.5 }}>📧</Box>
          <Typography variant="subtitle2">Mail</Typography>
        </Box>
      </Box>
      
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
          <UploadIcon fontSize="small" sx={{ mr: 2, color: '#25638f' }} />
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
      
      {/* Müşteri Ekleme/Düzenleme Dialog'u */}
      <Dialog
        open={customerFormOpen}
        onClose={handleCustomerFormClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#25638f', color: 'white', fontWeight: 500 }}>
          {editingCustomer ? 'Müşteri Düzenle' : 'Yeni Müşteri Ekle'}
        </DialogTitle>
        <Box sx={{ p: 0 }}>
          <HookForm
            open={true}
            onClose={handleCustomerFormClose}
            onSubmit={handleCustomerFormSubmit}
            title=""
            submitButtonText={editingCustomer ? 'Güncelle' : 'Ekle'}
            fields={customerFormFields}
            defaultValues={editingCustomer || {}}
          />
        </Box>
      </Dialog>
    </Box>
  );
};

export default CustomersPage;
