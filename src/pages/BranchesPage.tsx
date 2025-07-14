/**
 * Şubeler Sayfası
 * 
 * Bu sayfa, şirketin şubelerini listeleme, ekleme, düzenleme ve silme işlemlerini sağlar.
 * Şube bilgileri arasında genel bilgiler, iletişim bilgileri, vergi bilgileri, banka bilgileri ve konum bilgileri bulunur.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  TextField, 
  InputAdornment, 
  IconButton, 
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Alert,
  Snackbar,
  Grid
} from '@mui/material';
import { 
  Add as AddIcon, 
  Search as SearchIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Business as BusinessIcon, 
  Phone as PhoneIcon, 
  LocationOn as LocationOnIcon,
  AccountBalance as AccountBalanceIcon,
  Public as PublicIcon,
  Person as PersonIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import DataTable from '../components/common/DataTable';
import HookForm from '../components/form/HookForm';
import { FormField } from '../types/FormField';
import AccordionFilter from '../components/common/AccordionFilter';
import { branchFilterConfig } from '../utils/filterConfigs';
import { Column } from '../components/common/DataTable';

// Yardımcı fonksiyonları import et
import { filterData, sortData, formatDate } from '../utils/dataUtils';

/**
 * Şube veri tipi
 */
interface Branch {
  /** Benzersiz kimlik */
  id: number;
  /** Şube adı */
  name: string;
  /** Adres */
  address: string;
  /** Açıklama (opsiyonel) */
  description?: string;
  /** Posta kodu (opsiyonel) */
  postalCode?: string;
  /** Telefon numarası */
  phone: string;
  /** Vergi numarası (opsiyonel) */
  taxId?: string;
  /** Vergi dairesi (opsiyonel) */
  taxOffice?: string;
  /** Banka adı (opsiyonel) */
  bankName?: string;
  /** Banka hesap numarası (opsiyonel) */
  bankAccount?: string;
  /** IBAN (opsiyonel) */
  iban?: string;
  /** Ülke (opsiyonel) */
  country?: string;
  /** Şehir (opsiyonel) */
  city?: string;
  /** İlçe (opsiyonel) */
  district?: string;
  /** Oluşturulma tarihi */
  createdAt?: string;
  /** Son güncelleme tarihi */
  updatedAt?: string;
}

/**
 * Şubeler Sayfası Bileşeni
 */
const BranchesPage: React.FC = () => {
  // Örnek şube verileri
  const [branches, setBranches] = useState<Branch[]>([
    { 
      id: 1, 
      name: 'Ankara Şubesi', 
      address: 'Dünya Ticaret Merkezi EOS Business Park Ankara', 
      phone: '+905546924291',
      postalCode: '06000',
      taxId: '1234567890',
      taxOffice: 'Ankara Vergi Dairesi',
      bankName: 'Ziraat Bankası',
      bankAccount: '12345678',
      iban: 'TR123456789012345678901234',
      country: 'Türkiye',
      city: 'Ankara',
      district: 'Çankaya',
      createdAt: new Date(2023, 1, 15).toISOString(),
      updatedAt: new Date(2023, 4, 20).toISOString()
    },
    { 
      id: 2, 
      name: 'İstanbul Şubesi', 
      address: 'Dünya Ticaret Merkezi EOS Business Park İstanbul Florya', 
      phone: '+905546924299',
      postalCode: '34000',
      taxId: '0987654321',
      taxOffice: 'İstanbul Vergi Dairesi',
      bankName: 'İş Bankası',
      bankAccount: '87654321',
      iban: 'TR098765432109876543210987',
      country: 'Türkiye',
      city: 'İstanbul',
      district: 'Bakırköy',
      createdAt: new Date(2023, 2, 10).toISOString(),
      updatedAt: new Date(2023, 5, 5).toISOString()
    },
  ]);
  
  // Durum değişkenleri
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [searchText, setSearchText] = useState('');
  const [orderBy, setOrderBy] = useState<keyof Branch>('name');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Merkezi yapıdan şube filtre yapılandırmasını kullanıyoruz

  /**
   * Filtrelenmiş ve sıralanmış şube listesi
   */
  const filteredBranches = useMemo(() => {
    // Önce arama metnine göre filtrele
    let filtered = filterData(branches, searchText, ['name', 'address', 'phone', 'city']);
    
    // Sonra filtre değerlerine göre filtrele
    if (Object.keys(filters).length > 0) {
      filtered = filtered.filter(branch => {
        return Object.entries(filters).every(([key, value]) => {
          if (!value) return true;
          
          // Tarih filtreleme için özel işlem
          if (key === 'createdAt' && value) {
            const branchDate = new Date(branch[key as keyof Branch] as string);
            const filterDate = new Date(value as string);
            return branchDate.toDateString() === filterDate.toDateString();
          }
          
          // Diğer filtreler için
          return String(branch[key as keyof Branch]).toLowerCase().includes(String(value).toLowerCase());
        });
      });
    }
    
    // Sonra sırala
    return sortData(filtered, orderBy, orderDirection);
  }, [branches, searchText, orderBy, orderDirection, filters]);

  /**
   * Tablo sütunları
   */
  const columns: Column[] = [
    { id: 'id', label: 'ID', minWidth: 50, align: 'center' },
    { id: 'name', label: 'Şube Adı', minWidth: 150 },
    { id: 'address', label: 'Adres', minWidth: 200 },
    { id: 'phone', label: 'Telefon', minWidth: 150 },
    { id: 'city', label: 'Şehir', minWidth: 100 },
    { id: 'district', label: 'İlçe', minWidth: 100 },
    { 
      id: 'updatedAt', 
      label: 'Son Güncelleme', 
      minWidth: 120,
      format: (value) => value ? formatDate(value, 'short') : '-'
    },
  ];

  // Form alanlarını tanımla
  const formFields: FormField[] = [
    { 
      section: 'Genel Bilgiler',
      name: 'name', 
      label: 'Şube Adı', 
      type: 'text', 
      required: true,
      placeholder: 'Şube adını girin',
      helperText: 'Bu alan zorunludur.',
      icon: <BusinessIcon />
    },
    { 
      section: 'Genel Bilgiler',
      name: 'address', 
      label: 'Adres', 
      type: 'textarea', 
      required: true,
      placeholder: 'Şube adresini girin',
      helperText: 'Bu alan zorunludur.',
      icon: <LocationOnIcon />,
      fullWidth: true
    },
    { 
      section: 'Genel Bilgiler',
      name: 'description', 
      label: 'Açıklama', 
      type: 'textarea', 
      required: false,
      placeholder: 'Şube hakkında açıklama girin',
      icon: <PersonIcon />,
      fullWidth: true
    },
    { 
      section: 'İletişim Bilgileri',
      name: 'phone', 
      label: 'Telefon', 
      type: 'tel', 
      required: true,
      placeholder: 'Telefon numarası girin',
      helperText: 'Başında ülke kodu olmadan girin',
      icon: <PhoneIcon />,
      useCountryCode: true // Ülke kodu seçiciyi etkinleştir
    },
    { 
      section: 'İletişim Bilgileri',
      name: 'fax', 
      label: 'Faks', 
      type: 'tel', 
      required: false,
      placeholder: 'Faks numarası girin',
      helperText: 'Başında ülke kodu olmadan girin',
      icon: <PhoneIcon />,
      useCountryCode: true // Ülke kodu seçiciyi etkinleştir
    },
    { 
      section: 'İletişim Bilgileri',
      name: 'postalCode', 
      label: 'Posta Kodu', 
      type: 'text', 
      required: false,
      placeholder: 'Posta kodu girin',
      icon: <LocationOnIcon />
    },
    { 
      section: 'Vergi Bilgileri',
      name: 'taxId', 
      label: 'Vergi No', 
      type: 'text', 
      required: false,
      placeholder: 'Vergi numarası girin',
      icon: <PersonIcon />
    },
    { 
      section: 'Vergi Bilgileri',
      name: 'taxOffice', 
      label: 'Vergi Dairesi', 
      type: 'text', 
      required: false,
      placeholder: 'Vergi dairesi adını girin',
      icon: <BusinessIcon />
    },
    { 
      section: 'Banka Bilgileri',
      name: 'bankName', 
      label: 'Banka Adı', 
      type: 'text', 
      required: false,
      placeholder: 'Banka adını girin',
      icon: <AccountBalanceIcon />
    },
    { 
      section: 'Banka Bilgileri',
      name: 'bankAccount', 
      label: 'Hesap No', 
      type: 'text', 
      required: false,
      placeholder: 'Hesap numarası girin',
      icon: <AccountBalanceIcon />
    },
    { 
      section: 'Banka Bilgileri',
      name: 'iban', 
      label: 'IBAN', 
      type: 'text', 
      required: false,
      placeholder: 'IBAN girin',
      icon: <AccountBalanceIcon />
    },
    { 
      section: 'Konum',
      name: 'country', 
      label: 'Ülke', 
      type: 'select',
      fullWidth: false,
      icon: <PublicIcon />,
      required: true,
      placeholder: 'Ülke seçiniz',
      options: [
        { value: 'Türkiye', label: 'Türkiye' },
        { value: 'Almanya', label: 'Almanya' },
        { value: 'İngiltere', label: 'İngiltere' },
        { value: 'Fransa', label: 'Fransa' },
        { value: 'İtalya', label: 'İtalya' },
        { value: 'İspanya', label: 'İspanya' },
        { value: 'Hollanda', label: 'Hollanda' },
        { value: 'Belçika', label: 'Belçika' },
      ]
    },
    { 
      section: 'Konum',
      name: 'city', 
      label: 'Şehir', 
      type: 'select',
      fullWidth: false,
      required: true,
      placeholder: 'Şehir seçiniz',
      options: [
        { value: 'İstanbul', label: 'İstanbul' },
        { value: 'Ankara', label: 'Ankara' },
        { value: 'İzmir', label: 'İzmir' },
        { value: 'Bursa', label: 'Bursa' },
        { value: 'Antalya', label: 'Antalya' },
        { value: 'Adana', label: 'Adana' },
        { value: 'Konya', label: 'Konya' },
        { value: 'Kayseri', label: 'Kayseri' },
      ]
    },
    { 
      section: 'Konum',
      name: 'district', 
      label: 'İlçe', 
      type: 'select',
      fullWidth: false,
      required: true,
      placeholder: 'İlçe seçiniz',
      options: [
        { value: 'Çankaya', label: 'Çankaya' },
        { value: 'Keçiören', label: 'Keçiören' },
        { value: 'Bakırköy', label: 'Bakırköy' },
        { value: 'Beşiktaş', label: 'Beşiktaş' },
        { value: 'Kadıköy', label: 'Kadıköy' },
        { value: 'Şişli', label: 'Şişli' },
        { value: 'Ataşehir', label: 'Ataşehir' },
        { value: 'Maltepe', label: 'Maltepe' },
      ]
    },
    { 
      section: 'Konum',
      name: 'contactPerson', 
      label: 'İletişim Kişisi', 
      type: 'text',
      fullWidth: true,
      icon: <PersonIcon />,
      placeholder: 'Ad Soyad',
      helperText: 'Şube sorumlusunun adı ve soyadı'
    },
  ];

  /**
   * Yeni şube ekleme işlemini başlat
   */
  const handleAddClick = () => {
    setEditingBranch(null);
    setOpenDialog(true);
  };

  /**
   * Şube düzenleme işlemini başlat
   * @param branch Düzenlenecek şube
   */
  const handleEditClick = (branch: Branch) => {
    setEditingBranch(branch);
    setOpenDialog(true);
  };

  /**
   * Şube silme işlemini gerçekleştir
   * @param branch Silinecek şube
   */
  const handleDeleteClick = (branch: Branch) => {
    if (window.confirm(`"${branch.name}" şubesini silmek istediğinizden emin misiniz?`)) {
      setBranches(branches.filter(b => b.id !== branch.id));
      showSnackbar(`"${branch.name}" şubesi başarıyla silindi`, 'success');
    }
  };

  /**
   * Diyaloğu kapat
   */
  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditingBranch(null);
  };

  /**
   * Form gönderimini işle
   * @param data Form verileri
   */
  const handleFormSubmit = (data: any) => {
    const now = new Date().toISOString();
    
    if (editingBranch) {
      // Şube güncelleme
      setBranches(branches.map(branch => 
        branch.id === editingBranch.id ? { 
          ...branch, 
          ...data, 
          updatedAt: now 
        } : branch
      ));
      showSnackbar(`"${data.name}" şubesi başarıyla güncellendi`, 'success');
    } else {
      // Yeni şube ekleme
      const newBranch: Branch = {
        id: Math.max(0, ...branches.map(b => b.id)) + 1,
        ...data,
        createdAt: now,
        updatedAt: now
      };
      setBranches([...branches, newBranch]);
      showSnackbar(`"${data.name}" şubesi başarıyla eklendi`, 'success');
    }
    setOpenDialog(false);
  };

  /**
   * Sıralama işlemini işle
   * @param field Sıralanacak alan
   */
  const handleSort = (field: keyof Branch) => {
    const isAsc = orderBy === field && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(field);
  };

  /**
   * Arama işlemini işle
   * @param event Arama kutusu değişim olayı
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };
  
  /**
   * Filtre değişikliklerini işle
   * @param newFilters Yeni filtre değerleri
   */
  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
  };
  
  /**
   * Bildirim göster
   * @param message Bildirim mesajı
   * @param severity Bildirim türü
   */
  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };
  
  /**
   * Bildirimi kapat
   */
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Sayfa başlığı ve navigasyon */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
          General-settings / Şubeler
        </Typography>
      </Box>
      
      {/* Ana içerik */}
      <Paper 
        elevation={2} 
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          mb: 4
        }}
      >
        {/* Üst araç çubuğu */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          p: 2,
          borderBottom: '1px solid #eee'
        }}>
          <Typography variant="h6">Şube Listesi</Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddClick}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
              }}
            >
              Yeni Şube Ekle
            </Button>
          </Box>
        </Box>
        
        {/* Global Filtre Bileşeni - Merkezi yapıdan */}
        <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
          <AccordionFilter
            title="Şube Filtreleri"
            fields={branchFilterConfig}
            onSearch={handleFilterChange}
            initialValues={{}}
            searchPlaceholder="Filtrele..."
          />
        </Box>
        
        {/* Veri tablosu */}
        <DataTable 
          columns={columns}
          rows={filteredBranches}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          pagination={true}
          rowsPerPageOptions={[5, 10, 25]}
          initialRowsPerPage={10}
        />
      </Paper>
      
      {/* Düzenleme/ekleme formu */}
      <HookForm
        open={openDialog}
        fields={formFields}
        defaultValues={editingBranch || {}}
        onSubmit={handleFormSubmit}
        onClose={handleDialogClose}
        title={editingBranch ? `${editingBranch.name} - Düzenle` : 'Yeni Şube Ekle'}
        submitButtonText={editingBranch ? 'Güncelle' : 'Ekle'}
        showResetButton={true}
      />
      
      {/* Bildirim */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={5000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BranchesPage;
