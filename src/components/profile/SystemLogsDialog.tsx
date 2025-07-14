/**
 * Sistem Logları Diyalog Bileşeni
 * 
 * Bu bileşen, kullanıcının sistem loglarını görüntülemesini sağlar. Loglar, kullanıcının
 * yaptığı işlemleri, giriş bilgilerini ve veri değişikliklerini içerir.
 * 
 * Özellikler:
 * - Temiz ve modern bir arayüz
 * - Üst kısımda arama kutusu ve filtre/dışa aktar butonları
 * - Sekme butonları (TÜM İŞLEMLER, SİSTEM GİRİŞLERİ, VERİ DEĞİŞİKLİKLERİ)
 * - Tablo formatında düzenli görünüm (İşlem, Tarih & Saat, Açıklama, IP Adresi, Tarayıcı, Cihaz)
 * - Alt kısımda toplam kayıt sayısı bilgisi
 */

import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  Divider,

} from '@mui/material';
import {
  Close as CloseIcon,
  History as HistoryIcon,
  Search as SearchIcon,

  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Login as LoginIcon,
  Laptop as DeviceIcon,
  Public as IpIcon,
  FilterList as FilterIcon,

} from '@mui/icons-material';
import ExportButton from '../common/ExportButton';

/**
 * SystemLogsDialog bileşeninin props arayüzü
 */
interface SystemLogsDialogProps {
  /** Diyaloğun açık olup olmadığını belirten değer */
  open: boolean;
  /** Diyaloğu kapatma işleyicisi */
  onClose: () => void;
}

/**
 * Log türleri tanımı
 * - login: Giriş işlemleri
 * - create: Oluşturma işlemleri
 * - update: Güncelleme işlemleri
 * - delete: Silme işlemleri
 */
type LogType = 'login' | 'create' | 'update' | 'delete';

/**
 * Tab türleri tanımı
 */
type TabType = 'all' | 'login' | 'data';

/**
 * Log kaydı arayüzü
 * Sistem loglarının veri yapısını tanımlar
 */
interface LogEntry {
  /** Benzersiz log kimliği */
  id: number;
  /** Log türü */
  type: LogType;
  /** Gerçekleştirilen işlem */
  action: string;
  /** İşlem zamanı */
  timestamp: string;
  /** İşlem detayları */
  details: string;
  /** IP adresi */
  ipAddress: string;
  /** Tarayıcı bilgisi */
  browser: string;
  /** Cihaz bilgisi */
  device: string;
  /** Kullanıcı bilgisi */
  user: string;
  /** İşlem kategorisi (sekme filtreleme için) */
  category: TabType;
  // İşlem detayları için ek veriler
  targetId?: string;
  targetName?: string;
  targetCode?: string;
  targetType?: string;
  changedFields?: Array<{field: string, oldValue: string, newValue: string}>;
}

/**
 * Örnek log verileri oluşturan fonksiyon
 * @returns Örnek log kayıtları dizisi
 */
const generateSampleLogs = (): LogEntry[] => {
  const logs: LogEntry[] = [];
  
  // İşlem türlerine göre eylem metinleri
  const actions = {
    login: ['Giriş yapıldı', 'Oturum başarılı'],
    create: ['Müşteri eklendi', 'Ürün eklendi', 'Sipariş oluşturuldu'],
    update: ['Profil güncellendi', 'Ürün güncellendi', 'Fiyat değiştirildi'],
    delete: ['Sipariş silindi', 'Müşteri silindi', 'Ürün kaldırıldı']
  };
  
  // Örnek cihaz ve tarayıcı bilgileri
  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
  const devices = ['MacBook Pro', 'Windows PC', 'iPhone 13', 'Samsung Galaxy S22'];
  const ips = ['192.168.1.1', '172.16.254.1', '10.0.0.1', '85.34.78.112'];
  
  // Hedef veri türleri
  const targetTypes = {
    login: 'User',
    create: ['Müşteri', 'Ürün', 'Sipariş'],
    update: ['Profil', 'Ürün', 'Fiyat'],
    delete: ['Sipariş', 'Müşteri', 'Ürün']
  };
  
  // 50 adet örnek log oluştur
  for (let i = 1; i <= 50; i++) {
    // Log türünü belirle
    const type = i % 10 === 0 ? 'delete' : i % 5 === 0 ? 'update' : i % 3 === 0 ? 'create' : 'login';
    const actionArray = actions[type as keyof typeof actions];
    const action = actionArray[Math.floor(Math.random() * actionArray.length)];
    
    // Tarih oluştur (son 30 gün içinde rastgele)
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    date.setHours(hours, minutes);
    
    // Tarih formatını ayarla
    const timestamp = `${date.toLocaleDateString('tr-TR')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    // Kategori belirle
    let category: TabType = 'all';
    if (type === 'login') {
      category = 'login';
    } else {
      category = 'data';
    }
    
    // Diğer rastgele verileri oluştur
    const browser = browsers[Math.floor(Math.random() * browsers.length)];
    const device = devices[Math.floor(Math.random() * devices.length)];
    const ipAddress = ips[Math.floor(Math.random() * ips.length)];
    const user = `user${Math.floor(Math.random() * 10) + 1}@example.com`;
    
    // Log detaylarını oluştur
    let details = '';
    let targetId = `ID-${Math.floor(Math.random() * 10000)}`;
    let targetName = '';
    let targetCode = '';
    let targetType = '';
    let changedFields: Array<{field: string, oldValue: string, newValue: string}> = [];
    
    if (type === 'login') {
      details = 'Kullanıcı başarıyla giriş yaptı';
      targetType = 'User';
      targetName = user;
    } else if (type === 'create') {
      const targetTypeArray = targetTypes.create as string[];
      targetType = targetTypeArray[Math.floor(Math.random() * targetTypeArray.length)];
      details = `Yeni ${targetType.toLowerCase()} başarıyla eklendi`;
      targetName = `${targetType}-${Math.floor(Math.random() * 1000)}`;
      targetCode = `CODE-${Math.floor(Math.random() * 1000)}`;
      
      changedFields = [
        { field: 'ad', oldValue: '', newValue: targetName },
        { field: 'kod', oldValue: '', newValue: targetCode },
        { field: 'durum', oldValue: '', newValue: 'Aktif' }
      ];
    } else if (type === 'update') {
      const targetTypeArray = targetTypes.update as string[];
      targetType = targetTypeArray[Math.floor(Math.random() * targetTypeArray.length)];
      details = targetType === 'Ürün' ? 'partiNoKırmızı/32' : `${targetType} güncellendi`;
      targetName = `${targetType}-${Math.floor(Math.random() * 1000)}`;
      targetCode = `CODE-${Math.floor(Math.random() * 1000)}`;
      
      changedFields = [
        { field: 'fiyat', oldValue: '₺120.00', newValue: '₺150.00' },
        { field: 'stok', oldValue: '45', newValue: '60' },
        { field: 'renk', oldValue: 'Mavi', newValue: 'Kırmızı' }
      ];
    } else if (type === 'delete') {
      const targetTypeArray = targetTypes.delete as string[];
      targetType = targetTypeArray[Math.floor(Math.random() * targetTypeArray.length)];
      details = `${targetType} başarıyla silindi`;
      targetName = `${targetType}-${Math.floor(Math.random() * 1000)}`;
      targetCode = `CODE-${Math.floor(Math.random() * 1000)}`;
    }
    
    // Log kaydını oluştur ve diziye ekle
    logs.push({
      id: i,
      type: type as LogType,
      action,
      timestamp,
      details,
      ipAddress,
      browser,
      device,
      user,
      category,
      targetId,
      targetName,
      targetCode,
      targetType,
      changedFields: changedFields.length > 0 ? changedFields : undefined
    });
  }
  
  // Tarihe göre sırala (en yeni en üstte)
  return logs.sort((a, b) => {
    const dateA = new Date(a.timestamp.split(' ')[0].split('.').reverse().join('-') + ' ' + a.timestamp.split(' ')[1]);
    const dateB = new Date(b.timestamp.split(' ')[0].split('.').reverse().join('-') + ' ' + b.timestamp.split(' ')[1]);
    return dateB.getTime() - dateA.getTime();
  });
};

/**
 * Sistem Logları Diyalog Bileşeni
 */
const SystemLogsDialog: React.FC<SystemLogsDialogProps> = ({ open, onClose }) => {

  
  // Örnek log verileri
  const logs = useMemo(() => generateSampleLogs(), []);
  
  // Durum değişkenleri
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<LogType[]>(['login', 'create', 'update', 'delete']);
  
  // Sekme değişimini işle
  const handleTabChange = (_event: React.SyntheticEvent, newValue: TabType) => {
    setActiveTab(newValue);
  };
  
  // Arama işlemini işle
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  // Filtre menüsünü aç/kapat
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchor(event.currentTarget);
  };
  
  const handleFilterClose = () => {
    setFilterAnchor(null);
  };
  
  // Log türü filtreleme
  const handleTypeFilterChange = (type: LogType) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };
  
  // Log detaylarını görüntüle
  const handleOpenDetails = (log: LogEntry) => {
    setSelectedLog(log);
    setDetailsOpen(true);
  };
  
  const handleCloseDetails = () => {
    setDetailsOpen(false);
  };
  
  // Filtre ve arama kriterlerine göre logları filtrele
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Sekme filtresine göre filtrele
      if (activeTab !== 'all' && log.category !== activeTab) {
        return false;
      }
      
      // Log türü filtresine göre filtrele
      if (!selectedTypes.includes(log.type)) {
        return false;
      }
      
      // Arama terimine göre filtrele
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          log.action.toLowerCase().includes(searchLower) ||
          log.details.toLowerCase().includes(searchLower) ||
          log.timestamp.toLowerCase().includes(searchLower) ||
          log.ipAddress.toLowerCase().includes(searchLower) ||
          log.browser.toLowerCase().includes(searchLower) ||
          log.device.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  }, [logs, activeTab, selectedTypes, searchTerm]);
  
  /**
   * Log türüne göre ikon döndür
   * @param type Log türü
   * @returns Log türüne uygun ikon bileşeni
   */
  const getLogTypeIcon = (type: LogType) => {
    switch (type) {
      case 'login':
        return <LoginIcon fontSize="small" />;
      case 'create':
        return <AddIcon fontSize="small" />;
      case 'update':
        return <EditIcon fontSize="small" />;
      case 'delete':
        return <DeleteIcon fontSize="small" />;
      default:
        return <HistoryIcon fontSize="small" />;
    }
  };
  
  /**
   * Log türüne göre renk döndür
   * @param type Log türü
   * @returns Log türüne uygun renk değeri
   */
  const getLogTypeColor = (type: LogType): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (type) {
      case 'login':
        return 'info';
      case 'create':
        return 'success';
      case 'update':
        return 'warning';
      case 'delete':
        return 'error';
      default:
        return 'default';
    }
  };
  
  /**
   * Log türüne göre etiket metni döndür
   * @param type Log türü
   * @returns Log türüne uygun etiket metni
   */
  const getLogTypeLabel = (type: LogType): string => {
    switch (type) {
      case 'login':
        return 'Giriş yapıldı';
      case 'create':
        return 'Ürün eklendi';
      case 'update':
        return 'Kod: A-98';
      case 'delete':
        return 'Ürün silindi';
      default:
        return 'İşlem';
    }
  };
  
  /**
   * İşlem detayları popup'ı
   * @returns İşlem detayları diyalog bileşeni
   */
  const renderDetailsDialog = () => {
    if (!selectedLog) return null;
    
    return (
      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              icon={getLogTypeIcon(selectedLog.type)}
              label={getLogTypeLabel(selectedLog.type)}
              size="small"
              color={getLogTypeColor(selectedLog.type)}
              variant="outlined"
              sx={{ fontSize: '0.75rem', height: '24px' }}
            />
            <Typography variant="h6" sx={{ fontSize: '1rem' }}>
              İşlem Detayları
            </Typography>
          </Box>
          <IconButton onClick={handleCloseDetails} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* İşlem Bilgileri */}
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
                İşlem Bilgileri
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    İşlem Türü
                  </Typography>
                  <Typography variant="body2">
                    {selectedLog.action}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Tarih & Saat
                  </Typography>
                  <Typography variant="body2">
                    {selectedLog.timestamp}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Kullanıcı
                  </Typography>
                  <Typography variant="body2">
                    {selectedLog.user}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    IP Adresi
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <IpIcon fontSize="small" sx={{ color: 'text.secondary', fontSize: '1rem' }} />
                    <Typography variant="body2">
                      {selectedLog.ipAddress}
                    </Typography>
                  </Box>
                </Box>
                
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Tarayıcı
                  </Typography>
                  <Typography variant="body2">
                    {selectedLog.browser}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Cihaz
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <DeviceIcon fontSize="small" sx={{ color: 'text.secondary', fontSize: '1rem' }} />
                    <Typography variant="body2">
                      {selectedLog.device}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
            
            {/* Hedef Bilgileri */}
            {selectedLog.targetType && (
              <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
                  Hedef Bilgileri
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Hedef Türü
                    </Typography>
                    <Typography variant="body2">
                      {selectedLog.targetType}
                    </Typography>
                  </Box>
                  
                  {selectedLog.targetId && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Hedef ID
                      </Typography>
                      <Typography variant="body2">
                        {selectedLog.targetId}
                      </Typography>
                    </Box>
                  )}
                  
                  {selectedLog.targetName && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Hedef Adı
                      </Typography>
                      <Typography variant="body2">
                        {selectedLog.targetName}
                      </Typography>
                    </Box>
                  )}
                  
                  {selectedLog.targetCode && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Hedef Kodu
                      </Typography>
                      <Typography variant="body2">
                        {selectedLog.targetCode}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            )}
            
            {/* Değişiklik Detayları */}
            {selectedLog.changedFields && selectedLog.changedFields.length > 0 && (
              <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
                  Değişiklik Detayları
                </Typography>
                
                <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #eee' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#f9f9f9' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Alan</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Eski Değer</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Yeni Değer</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedLog.changedFields.map((field, index) => (
                        <TableRow key={index}>
                          <TableCell>{field.field}</TableCell>
                          <TableCell>
                            {field.oldValue ? field.oldValue : <Typography variant="caption" color="text.secondary">Boş</Typography>}
                          </TableCell>
                          <TableCell>{field.newValue}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button onClick={handleCloseDetails} variant="outlined" size="small">
            Kapat
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  // Ana bileşen render
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee', p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HistoryIcon color="primary" />
          <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>
            Sistem Logları
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        {/* Üst araç çubuğu */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
          <TextField
            placeholder="Logları ara..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ width: '300px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<FilterIcon />}
              onClick={handleFilterClick}
              sx={{ textTransform: 'none' }}
            >
              Filtrele
            </Button>
            
            <Menu
              anchorEl={filterAnchor}
              open={Boolean(filterAnchor)}
              onClose={handleFilterClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <Typography variant="subtitle2" sx={{ px: 2, py: 1, fontWeight: 600 }}>
                İşlem Türü
              </Typography>
              <Divider />
              <MenuItem>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    icon={<LoginIcon fontSize="small" />}
                    label="Giriş yapıldı"
                    size="small"
                    color={selectedTypes.includes('login') ? 'info' : 'default'}
                    variant={selectedTypes.includes('login') ? 'filled' : 'outlined'}
                    onClick={() => handleTypeFilterChange('login')}
                    sx={{ fontSize: '0.75rem', height: '24px' }}
                  />
                </Box>
              </MenuItem>
              <MenuItem>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    icon={<AddIcon fontSize="small" />}
                    label="Ürün eklendi"
                    size="small"
                    color={selectedTypes.includes('create') ? 'success' : 'default'}
                    variant={selectedTypes.includes('create') ? 'filled' : 'outlined'}
                    onClick={() => handleTypeFilterChange('create')}
                    sx={{ fontSize: '0.75rem', height: '24px' }}
                  />
                </Box>
              </MenuItem>
              <MenuItem>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    icon={<EditIcon fontSize="small" />}
                    label="Kod: A-98"
                    size="small"
                    color={selectedTypes.includes('update') ? 'warning' : 'default'}
                    variant={selectedTypes.includes('update') ? 'filled' : 'outlined'}
                    onClick={() => handleTypeFilterChange('update')}
                    sx={{ fontSize: '0.75rem', height: '24px' }}
                  />
                </Box>
              </MenuItem>
              <MenuItem>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    icon={<DeleteIcon fontSize="small" />}
                    label="Ürün silindi"
                    size="small"
                    color={selectedTypes.includes('delete') ? 'error' : 'default'}
                    variant={selectedTypes.includes('delete') ? 'filled' : 'outlined'}
                    onClick={() => handleTypeFilterChange('delete')}
                    sx={{ fontSize: '0.75rem', height: '24px' }}
                  />
                </Box>
              </MenuItem>
            </Menu>
            
            <ExportButton
              size="small"
              label="Dışa Aktar"
            />
          </Box>
        </Box>
        
        {/* Sekmeler */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
              },
            }}
          >
            <Tab value="all" label="TÜM İŞLEMLER" />
            <Tab value="login" label="SİSTEM GİRİŞLERİ" />
            <Tab value="data" label="VERİ DEĞİŞİKLİKLERİ" />
          </Tabs>
        </Box>
        
        {/* Log tablosu */}
        <TableContainer sx={{ maxHeight: 'calc(90vh - 250px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f9f9f9' }}>
                <TableCell sx={{ width: '15%', fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>İşlem</TableCell>
                <TableCell sx={{ width: '15%', fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Tarih & Saat</TableCell>
                <TableCell sx={{ width: '20%', fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Açıklama</TableCell>
                <TableCell sx={{ width: '15%', fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>IP Adresi</TableCell>
                <TableCell sx={{ width: '15%', fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Tarayıcı</TableCell>
                <TableCell sx={{ width: '20%', fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Cihaz</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <TableRow key={log.id} hover sx={{ '&:hover': { bgcolor: '#f9f9f9' }, borderBottom: '1px solid #eee' }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Chip
                          icon={getLogTypeIcon(log.type)}
                          label={getLogTypeLabel(log.type)}
                          size="small"
                          color={getLogTypeColor(log.type)}
                          variant="outlined"
                          sx={{ fontSize: '0.75rem', height: '24px' }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{log.timestamp}</TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        color="primary"
                        onClick={() => handleOpenDetails(log)}
                        sx={{ 
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                      >
                        {log.details}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                          {log.ipAddress}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{log.browser}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                          {log.device}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" sx={{ py: 2 }}>
                      Kayıt bulunamadı.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', borderTop: '1px solid #eee' }}>
          <Typography variant="caption" color="text.secondary">
            Toplam {filteredLogs.length} kayıt görüntüleniyor
          </Typography>
        </Box>
      </DialogContent>
      
      {/* İşlem detayları dialog'u */}
      {renderDetailsDialog()}
    </Dialog>
  );
};

export default SystemLogsDialog;
