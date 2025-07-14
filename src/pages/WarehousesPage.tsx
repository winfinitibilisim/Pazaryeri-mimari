import React, { useState } from 'react';
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
  TextField
} from '@mui/material';

// Material UI ikonları
import WarningIcon from '@mui/icons-material/Warning';

// Özel bileşenler
import AddButton from '../components/common/AddButton';

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
    fillRate: 75 
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
    fillRate: 40 
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
    fillRate: 12.5 
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
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  
  // Sayfalama durumu
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  // Dialog durumları
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isInventoryDialogOpen, setIsInventoryDialogOpen] = useState(false);
  const [isIssueDialogOpen, setIsIssueDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [warehouseToDelete, setWarehouseToDelete] = useState<number | null>(null);
  
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
      totalCapacity,
      totalUsedCapacity,
      totalProducts,
      activeWarehouses,
      inactiveWarehouses,
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
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {translations.warehouseManagement}
        </Typography>
        <Box>
          <AddButton 
            onClick={() => setIsAddDialogOpen(true)}
            label={translations.addWarehouse}
          />
        </Box>
      </Box>
      
      {/* Depo istatistikleri */}
      <WarehouseStats stats={calculateStats()} />
      
      {/* Depo listesi */}
      <Paper sx={{ width: '100%', mb: 3, overflow: 'hidden' }}>
        <WarehouseList
          warehouses={warehouses}
          page={page}
          rowsPerPage={rowsPerPage}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onViewDetails={handleViewDetails}
          onStatusChange={handleStatusChange}
        />
      </Paper>
      
      {/* Depo ekleme dialog'u */}
      <Dialog 
        open={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{translations.addWarehouse}</DialogTitle>
        <DialogContent>
          <WarehouseForm 
            open={isAddDialogOpen}
            onClose={() => setIsAddDialogOpen(false)}
            onSubmit={handleAddWarehouse} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Depo düzenleme dialog'u */}
      <Dialog 
        open={isEditDialogOpen} 
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{translations.editWarehouse}</DialogTitle>
        <DialogContent>
          {selectedWarehouse && (
            <WarehouseForm 
              open={isEditDialogOpen}
              onClose={() => setIsEditDialogOpen(false)}
              initialData={selectedWarehouse} 
              onSubmit={handleEditSave}
              isEdit
            />
          )}
        </DialogContent>
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