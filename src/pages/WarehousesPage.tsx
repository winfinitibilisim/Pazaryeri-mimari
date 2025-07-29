import React, { useState, useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Box, 
  Typography, 
  Paper, 
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar
} from '@mui/material';

// Material UI ikonları
import WarningIcon from '@mui/icons-material/Warning';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import StoreIcon from '@mui/icons-material/Store';
import BusinessIcon from '@mui/icons-material/Business';
import InventoryIcon from '@mui/icons-material/Inventory';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

// Özel bileşenler
import AddButton from '../components/common/AddButton';
import ExportButton from '../components/common/ExportButton';
import PrintButton from '../components/common/PrintButton';

// Warehouse bileşenleri
import WarehouseStats, { WarehouseStats as WarehouseStatsType } from '../components/warehouses/WarehouseStats';
import WarehouseList, { Warehouse } from '../components/warehouses/WarehouseList';
import WarehouseForm from '../components/warehouses/WarehouseForm';
import WarehouseDetails from '../components/warehouses/WarehouseDetails';
import WarehouseReportDialog from '../components/warehouses/WarehouseReportDialog';
import WarehouseInventoryDialog from '../components/warehouses/WarehouseInventoryDialog';

// Örnek depo verileri
const initialWarehouses: Warehouse[] = [
  { 
    id: 1, 
    name: 'Ana Depo', 
    location: 'İstanbul', 
    manager: 'Ahmet Yılmaz', 
    capacity: 1000, 
    usedCapacity: 750, 
    status: 'Aktif', 
    productCount: 250, 
    lastInventory: '2023-05-15', 
    fillRate: 75,
    floors: 3,
    shelfSections: 'A1-A20, B1-B25, C1-C15',
    description: 'Ana merkez deposu. Tüm ürün kategorileri için kullanılır.'
  },
  { 
    id: 2, 
    name: 'Şube Depo 1', 
    location: 'Ankara', 
    manager: 'Mehmet Kaya', 
    capacity: 500, 
    usedCapacity: 200, 
    status: 'Aktif', 
    productCount: 120, 
    lastInventory: '2023-06-10', 
    fillRate: 40,
    floors: 2,
    shelfSections: 'A1-A15, B1-B10',
    description: 'Ankara bölgesi için şube deposu.'
  },
  { 
    id: 3, 
    name: 'Şube Depo 2', 
    location: 'İzmir', 
    manager: 'Zeynep Demir', 
    capacity: 800, 
    usedCapacity: 100, 
    status: 'Pasif', 
    productCount: 80, 
    lastInventory: '2023-04-22', 
    fillRate: 12.5,
    floors: 2,
    shelfSections: 'A1-A12, B1-B18',
    description: 'İzmir bölgesi deposu. Şu anda bakım aşamasında.'
  },
  { 
    id: 4, 
    name: 'Sevkiyat Merkezi', 
    location: 'Bursa', 
    manager: 'Ali Çelik', 
    capacity: 1200, 
    usedCapacity: 1000, 
    status: 'Aktif', 
    productCount: 350, 
    lastInventory: '2023-06-01', 
    fillRate: 83.3 
  },
  { 
    id: 5, 
    name: 'Yedek Depo', 
    location: 'Antalya', 
    manager: 'Ayşe Kara', 
    capacity: 300, 
    usedCapacity: 50, 
    status: 'Pasif', 
    productCount: 30, 
    lastInventory: '2023-03-15', 
    fillRate: 16.7 
  }
];

const WarehousesPage: React.FC = () => {
  const { translations } = useLanguage();
  const notifications = useNotifications();
  
  // Depo verileri ve durumları
  const [warehouses, setWarehouses] = useState<Warehouse[]>(initialWarehouses);
  const [filteredWarehouses, setFilteredWarehouses] = useState<Warehouse[]>(initialWarehouses);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  
  // Sayfalama durumu
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filtre durumları
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [capacityFilter, setCapacityFilter] = useState('');
  
  // Dialog durumları
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isInventoryDialogOpen, setIsInventoryDialogOpen] = useState(false);
  const [isIssueDialogOpen, setIsIssueDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [warehouseToDelete, setWarehouseToDelete] = useState<number | null>(null);
  
  // Filtreleme fonksiyonu
  useEffect(() => {
    let filtered = warehouses;

    if (searchTerm) {
      filtered = filtered.filter(warehouse =>
        warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        warehouse.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        warehouse.manager.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(warehouse => warehouse.status === statusFilter);
    }

    if (locationFilter) {
      filtered = filtered.filter(warehouse => warehouse.location === locationFilter);
    }

    if (capacityFilter) {
      if (capacityFilter === 'small') {
        filtered = filtered.filter(warehouse => warehouse.capacity < 500);
      } else if (capacityFilter === 'medium') {
        filtered = filtered.filter(warehouse => warehouse.capacity >= 500 && warehouse.capacity < 1000);
      } else if (capacityFilter === 'large') {
        filtered = filtered.filter(warehouse => warehouse.capacity >= 1000);
      }
    }

    setFilteredWarehouses(filtered);
    setPage(0); // Reset page when filters change
  }, [warehouses, searchTerm, statusFilter, locationFilter, capacityFilter]);

  // Filtreleri temizle
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setLocationFilter('');
    setCapacityFilter('');
  };

  // Depo istatistiklerini hesapla
  const calculateStats = (): WarehouseStatsType => {
    const totalWarehouses = warehouses.length;
    const activeWarehouses = warehouses.filter(w => w.status === 'Aktif').length;
    const inactiveWarehouses = totalWarehouses - activeWarehouses;
    const totalCapacity = warehouses.reduce((sum, w) => sum + w.capacity, 0);
    const totalUsedCapacity = warehouses.reduce((sum, w) => sum + w.usedCapacity, 0);
    const totalProducts = warehouses.reduce((sum, w) => sum + w.productCount, 0);
    const capacityUtilization = totalCapacity > 0 ? (totalUsedCapacity / totalCapacity) * 100 : 0;

    const lowStockWarehouses = warehouses.filter(w => (w.usedCapacity / w.capacity) < 0.2).length;
    
    return {
      totalWarehouses,
      activeWarehouses,
      inactiveWarehouses,
      totalCapacity,
      totalUsedCapacity,
      totalProducts,
      capacityUtilization,
      lowStockWarehouses
    };
  };
  
  // Sayfa değişimi
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  // Sayfa başına satır sayısı değişimi
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Depo ekleme işlemi
  const handleAddWarehouse = (formData: Record<string, any>) => {
    const newWarehouse: Warehouse = {
      id: Math.max(...warehouses.map(w => w.id), 0) + 1,
      name: formData.name,
      location: formData.location,
      manager: formData.manager,
      capacity: Number(formData.capacity),
      usedCapacity: 0,
      status: formData.status,
      productCount: 0,
      lastInventory: new Date().toISOString().split('T')[0],
      fillRate: 0
    };
    
    setWarehouses([...warehouses, newWarehouse]);
    setIsAddDialogOpen(false);
    
    notifications.showSuccess(`${newWarehouse.name} ${translations.warehouseAddedSuccess}`);
  };
  
  // Depo düzenleme işlemi
  const handleEdit = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsEditDialogOpen(true);
  };
  
  // Depo düzenleme kaydetme
  const handleEditSave = (formData: Record<string, any>) => {
    if (!selectedWarehouse) return;
    
    const updatedWarehouse: Warehouse = {
      ...selectedWarehouse,
      name: formData.name,
      location: formData.location,
      manager: formData.manager,
      capacity: Number(formData.capacity),
      status: formData.status,
      fillRate: (selectedWarehouse.usedCapacity / Number(formData.capacity)) * 100
    };
    
    const updatedWarehouses = warehouses.map(warehouse => 
      warehouse.id === selectedWarehouse.id ? updatedWarehouse : warehouse
    );
    
    setWarehouses(updatedWarehouses);
    setIsEditDialogOpen(false);
    
    notifications.showSuccess(`${updatedWarehouse.name} ${translations.warehouseUpdatedSuccess}`);
  };
  
  // Depo silme dialog'unu aç
  const handleDeleteClick = (id: number) => {
    setWarehouseToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  // Silme işlemini onayla
  const confirmDelete = () => {
    if (warehouseToDelete === null) return;
    
    const warehouseToRemove = warehouses.find(w => w.id === warehouseToDelete);
    const updatedWarehouses = warehouses.filter(w => w.id !== warehouseToDelete);
    
    setWarehouses(updatedWarehouses);
    setDeleteDialogOpen(false);
    setWarehouseToDelete(null);
    
    if (warehouseToRemove) {
      notifications.showSuccess(`${warehouseToRemove.name} ${translations.warehouseDeletedSuccess}`);
    }
  };
  
  // Silme işlemini iptal et
  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setWarehouseToDelete(null);
  };
  
  // Depo durumunu değiştir
  const handleStatusChange = (warehouse: Warehouse, newStatus: string) => {
    const updatedWarehouses = warehouses.map(w => {
      if (w.id === warehouse.id) {
        return { ...w, status: newStatus };
      }
      return w;
    });
    
    setWarehouses(updatedWarehouses);
    
    if (newStatus === 'Aktif') {
      notifications.showSuccess(`${warehouse.name} ${translations.warehouseActivatedSuccess}`);
    } else {
      notifications.showSuccess(`${warehouse.name} ${translations.warehouseDeactivatedSuccess}`);
    }
  };
  
  // Depo detaylarını görüntüleme
  const handleViewDetails = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsDetailsDialogOpen(true);
  };
  
  // Depo raporu oluştur
  const handleReportOpen = () => {
    setIsReportDialogOpen(true);
  };
  
  // Envanter yönetimi
  const handleInventoryOpen = () => {
    setIsInventoryDialogOpen(true);
  };
  
  // Sorun bildirimi
  const handleIssueOpen = () => {
    setIsIssueDialogOpen(true);
  };
  
  // Sorun bildirimi gönder
  const handleIssueSubmit = (description: string) => {
    setIsIssueDialogOpen(false);
    notifications.showSuccess(translations.issueReportSuccess);
  };
  
  // Unique values for filter options
  const uniqueLocations = Array.from(new Set(warehouses.map(w => w.location)));

  return (
    <Box sx={{ p: 3 }}>
      {/* Modern Header */}
      <Paper 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 3,
          p: 4,
          mb: 3,
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <StoreIcon sx={{ fontSize: 40, mr: 2 }} />
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
              Depo Yönetimi
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Depo bilgilerini yönetin, envanter takibi yapın ve raporlar oluşturun
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<BusinessIcon />}
            onClick={() => setIsAddDialogOpen(true)}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
              }
            }}
          >
            Yeni Depo
          </Button>
          
          <ExportButton
            label="Excel'e Aktar"
            onClick={() => {}}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
              }
            }}
          />
          
          <PrintButton
            label="Yazdır"
            onClick={() => {}}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
              }
            }}
          />
        </Box>
      </Paper>

      {/* İstatistik Kartları */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {calculateStats().totalWarehouses}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Toplam Depo
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <StoreIcon sx={{ fontSize: 30 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {calculateStats().activeWarehouses}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Aktif Depo
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <BusinessIcon sx={{ fontSize: 30 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {calculateStats().totalProducts.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Toplam Ürün
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <InventoryIcon sx={{ fontSize: 30 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {calculateStats().capacityUtilization.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Kapasite Kullanımı
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <TrendingUpIcon sx={{ fontSize: 30 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtre Paneli */}
      <Accordion sx={{ mb: 3, boxShadow: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ 
            backgroundColor: '#f5f5f5',
            '&:hover': { backgroundColor: '#eeeeee' }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FilterListIcon sx={{ mr: 1, color: '#495057' }} />
            <Typography variant="h6" sx={{ color: '#495057', fontWeight: 600 }}>
              Filtreler
            </Typography>
            {(searchTerm || statusFilter || locationFilter || capacityFilter) && (
              <Chip 
                label={`${filteredWarehouses.length} sonuç`} 
                size="small" 
                color="primary" 
                sx={{ ml: 2 }} 
              />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Arama"
                placeholder="Depo adı, konum veya yönetici"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Durum</InputLabel>
                <Select
                  value={statusFilter}
                  label="Durum"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">Tümü</MenuItem>
                  <MenuItem value="Aktif">Aktif</MenuItem>
                  <MenuItem value="Pasif">Pasif</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Konum</InputLabel>
                <Select
                  value={locationFilter}
                  label="Konum"
                  onChange={(e) => setLocationFilter(e.target.value)}
                >
                  <MenuItem value="">Tümü</MenuItem>
                  {uniqueLocations.map(location => (
                    <MenuItem key={location} value={location}>{location}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Kapasite</InputLabel>
                <Select
                  value={capacityFilter}
                  label="Kapasite"
                  onChange={(e) => setCapacityFilter(e.target.value)}
                >
                  <MenuItem value="">Tümü</MenuItem>
                  <MenuItem value="small">Küçük (&lt;500)</MenuItem>
                  <MenuItem value="medium">Orta (500-1000)</MenuItem>
                  <MenuItem value="large">Büyük (&gt;1000)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={clearFilters}
                sx={{ height: '56px' }}
              >
                Filtreleri Temizle
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      
      {/* Depo listesi */}
      <WarehouseList
        warehouses={filteredWarehouses}
        page={page}
        rowsPerPage={rowsPerPage}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onViewDetails={handleViewDetails}
        onStatusChange={handleStatusChange}
      />
      
      {/* Depo ekleme dialog'u */}
      <Dialog 
        open={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{translations.addWarehouse || 'Depo Ekle'}</DialogTitle>
        <DialogContent>
          <WarehouseForm 
            onSubmit={handleAddWarehouse}
            formId="warehouse-add-form"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)} color="inherit">
            {translations.close || 'Kapat'}
          </Button>
          <Button 
            type="submit" 
            form="warehouse-add-form" 
            color="primary" 
            variant="contained"
          >
            {translations.saveChanges || 'Kaydet'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Depo düzenleme dialog'u */}
      <Dialog 
        open={isEditDialogOpen} 
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{translations.editWarehouse || 'Depo Düzenle'}</DialogTitle>
        <DialogContent>
          {selectedWarehouse && (
            <WarehouseForm 
              initialData={selectedWarehouse} 
              onSubmit={handleEditSave}
              isEdit
              formId="warehouse-edit-form"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)} color="inherit">
            {translations.close || 'Kapat'}
          </Button>
          <Button 
            type="submit" 
            form="warehouse-edit-form" 
            color="primary" 
            variant="contained"
          >
            {translations.saveChanges || 'Kaydet'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Depo detayları dialog'u */}
      {selectedWarehouse && (
        <WarehouseDetails
          open={isDetailsDialogOpen}
          onClose={() => setIsDetailsDialogOpen(false)}
          warehouse={selectedWarehouse}
          onReportOpen={handleReportOpen}
          onInventoryOpen={handleInventoryOpen}
          onIssueOpen={handleIssueOpen}
        />
      )}
      
      {/* Depo raporu dialog'u */}
      <WarehouseReportDialog
        open={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
        warehouse={selectedWarehouse}
      />
      
      {/* Envanter yönetimi dialog'u */}
      <WarehouseInventoryDialog
        open={isInventoryDialogOpen}
        onClose={() => setIsInventoryDialogOpen(false)}
        warehouse={selectedWarehouse}
      />
      
      {/* Sorun bildirimi dialog'u */}
      <Dialog
        open={isIssueDialogOpen}
        onClose={() => setIsIssueDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <WarningIcon sx={{ mr: 1, color: 'warning.main' }} />
            {translations.reportIssue}
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {translations.issueReportDescription}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="issue-description"
            label={translations.issueDescription}
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsIssueDialogOpen(false)} color="inherit">
            {translations.close}
          </Button>
          <Button onClick={() => handleIssueSubmit('Sorun açıklaması')} color="primary" variant="contained">
            {translations.send}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Silme onay dialog'u */}
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <WarningIcon sx={{ mr: 1, color: 'warning.main' }} />
            {translations.warning}
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {translations.areYouSureDelete} {translations.thisActionCannotBeUndone}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="inherit">
            {translations.close}
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained" autoFocus>
            {translations.delete}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WarehousesPage;