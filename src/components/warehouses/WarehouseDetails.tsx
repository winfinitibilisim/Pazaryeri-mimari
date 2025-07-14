import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Grid, 
  Typography, 
  Box, 
  Paper, 
  Divider, 
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  LinearProgress,
  Tooltip,
  Chip
} from '@mui/material';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { Warehouse } from './WarehouseList';
import StoreIcon from '@mui/icons-material/Store';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssessmentIcon from '@mui/icons-material/Assessment';
import WarningIcon from '@mui/icons-material/Warning';
import PrintButton from '../common/PrintButton';
import ExportButton from '../common/ExportButton';

interface WarehouseDetailsProps {
  open: boolean;
  onClose: () => void;
  warehouse: Warehouse | null;
  onReportOpen: () => void;
  onInventoryOpen: () => void;
  onIssueOpen: () => void;
}

const WarehouseDetails: React.FC<WarehouseDetailsProps> = ({
  open,
  onClose,
  warehouse,
  onReportOpen,
  onInventoryOpen,
  onIssueOpen
}) => {
  const { translations } = useLanguage();
  const notifications = useNotifications();

  if (!warehouse) return null;

  // Doluluk oranını hesapla
  const fillRate = Math.round((warehouse.usedCapacity / warehouse.capacity) * 100);

  // Kritik stok ürünleri (örnek veri)
  const criticalStockProducts = [
    { code: 'PRD-1001', name: 'Widget A', category: 'Elektronik', stock: 15, criticalLevel: 20, lastOrderDate: '2025-05-10' },
    { code: 'PRD-1042', name: 'Widget B', category: 'Elektronik', stock: 8, criticalLevel: 25, lastOrderDate: '2025-05-15' },
    { code: 'PRD-2105', name: 'Aksesuar C', category: 'Giyim', stock: 12, criticalLevel: 30, lastOrderDate: '2025-05-20' }
  ];

  // Son işlemler (örnek veri)
  const recentOperations = [
    { date: '28.05.2025', description: '150 adet ürün girişi yapıldı' },
    { date: '27.05.2025', description: '75 adet ürün çıkışı yapıldı' },
    { date: '26.05.2025', description: 'Envanter sayımı tamamlandı' },
    { date: '25.05.2025', description: '200 adet ürün transferi yapıldı' }
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      aria-labelledby="warehouse-details-dialog"
    >
      <DialogTitle id="warehouse-details-dialog">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StoreIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">{warehouse.name} - {translations.warehouseDetails || 'Depo Detayları'}</Typography>
          </Box>
          <Box>
            <PrintButton 
              content="warehouse-details" 
              label={translations.print || "Yazdır"} 
              onClick={() => {
                try {
                  // Yazdırılacak içeriği al
                  const printContent = document.getElementById('warehouse-details');
                  if (!printContent) {
                    notifications.showError('Yazdırılacak içerik bulunamadı!');
                    return;
                  }
                  
                  // Yazdırma penceresi aç
                  const printWindow = window.open('', '_blank', 'height=600,width=800');
                  if (!printWindow) {
                    notifications.showError('Yazdırma penceresi açılamadı! Lütfen popup engelleyiciyi kontrol edin.');
                    return;
                  }
                  
                  // Yazdırma belgesini oluştur
                  printWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <title>${warehouse?.name || ''} - ${translations.warehouseDetails || 'Depo Detayları'}</title>
                      <meta charset="utf-8">
                      <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        h1 { color: #2a6496; text-align: center; margin-bottom: 20px; }
                        .warehouse-info { margin-bottom: 20px; }
                        .warehouse-info h2 { color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
                        .info-row { display: flex; margin-bottom: 10px; }
                        .info-label { font-weight: bold; width: 150px; }
                        .info-value { flex: 1; }
                        .print-date { text-align: right; font-size: 12px; color: #666; margin-bottom: 10px; }
                        .company-info { text-align: center; margin-bottom: 20px; font-size: 14px; }
                        @media print {
                          .no-print { display: none; }
                          body { margin: 0; padding: 15px; }
                        }
                      </style>
                    </head>
                    <body>
                      <div class="print-date">${new Date().toLocaleString('tr-TR')}</div>
                      <h1>${warehouse?.name || ''} - ${translations.warehouseDetails || 'Depo Detayları'}</h1>
                      <div class="company-info">
                        <p>Winfinit Bilişim Teknolojileri</p>
                      </div>
                      <div class="warehouse-info">
                        <h2>Genel Bilgiler</h2>
                        <div class="info-row">
                          <div class="info-label">${translations.warehouseId || 'Depo ID'}:</div>
                          <div class="info-value">${warehouse?.id || ''}</div>
                        </div>
                        <div class="info-row">
                          <div class="info-label">${translations.warehouseName || 'Depo Adı'}:</div>
                          <div class="info-value">${warehouse?.name || ''}</div>
                        </div>
                        <div class="info-row">
                          <div class="info-label">${translations.location || 'Konum'}:</div>
                          <div class="info-value">${warehouse?.location || ''}</div>
                        </div>
                        <div class="info-row">
                          <div class="info-label">${translations.warehouseManager || 'Depo Sorumlusu'}:</div>
                          <div class="info-value">${warehouse?.manager || ''}</div>
                        </div>
                        <div class="info-row">
                          <div class="info-label">${translations.status || 'Durum'}:</div>
                          <div class="info-value">${warehouse?.status || ''}</div>
                        </div>
                      </div>
                      
                      <div class="warehouse-info">
                        <h2>Kapasite Bilgileri</h2>
                        <div class="info-row">
                          <div class="info-label">${translations.capacity || 'Toplam Kapasite'}:</div>
                          <div class="info-value">${warehouse?.capacity || 0}</div>
                        </div>
                        <div class="info-row">
                          <div class="info-label">${translations.usedCapacity || 'Kullanılan Kapasite'}:</div>
                          <div class="info-value">${warehouse?.usedCapacity || 0}</div>
                        </div>
                        <div class="info-row">
                          <div class="info-label">${translations.fillRate || 'Doluluk Oranı'}:</div>
                          <div class="info-value">${warehouse?.fillRate || 0}%</div>
                        </div>
                        <div class="info-row">
                          <div class="info-label">${translations.productCount || 'Ürün Sayısı'}:</div>
                          <div class="info-value">${warehouse?.productCount || 0}</div>
                        </div>
                        <div class="info-row">
                          <div class="info-label">${translations.lastInventory || 'Son Envanter'}:</div>
                          <div class="info-value">${warehouse?.lastInventory || ''}</div>
                        </div>
                      </div>
                      
                      <div class="no-print" style="margin-top: 20px; text-align: center;">
                        <button onclick="window.print();" style="padding: 10px 20px; background: #2a6496; color: white; border: none; border-radius: 4px; cursor: pointer;">
                          ${translations.print || 'Yazdır'}
                        </button>
                      </div>
                    </body>
                    </html>
                  `);
                  
                  // Belgeyi kapat ve yazdır
                  printWindow.document.close();
                  printWindow.focus();
                  
                  // Yazdırma işlemi tamamlandığında bildirim ver
                  printWindow.onafterprint = () => {
                    console.log('Depo detayları yazdırma işlemi tamamlandı');
                    notifications.showSuccess('Depo detayları başarıyla yazdırıldı!', 'generic');
                  };
                } catch (error) {
                  console.error('Yazdırma hatası:', error);
                  notifications.showError('Yazdırma sırasında bir hata oluştu!');
                }
              }}
            />
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent id="warehouse-details">
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                {translations.warehouseDetails || 'Depo Bilgileri'}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {translations.warehouseName || 'Depo Adı'}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {warehouse.name}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {translations.location || 'Konum'}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {warehouse.location}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {translations.warehouseManager || 'Depo Sorumlusu'}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {warehouse.manager}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {translations.status || 'Durum'}
                </Typography>
                <Typography 
                  variant="body1" 
                  gutterBottom
                  sx={{ 
                    color: warehouse.status === 'Aktif' ? 'success.main' : 'error.main',
                    fontWeight: 'bold'
                  }}
                >
                  {warehouse.status}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {translations.lastInventory || 'Son Envanter'}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {warehouse.lastInventory}
                </Typography>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {translations.capacityUsage || 'Kapasite Kullanımı'}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {translations.capacity || 'Toplam Kapasite'}
                    </Typography>
                    <Typography variant="h4" gutterBottom>
                      {warehouse.capacity.toLocaleString()} m²
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {translations.usedCapacity || 'Kullanılan Kapasite'}
                    </Typography>
                    <Typography variant="h4" gutterBottom>
                      {warehouse.usedCapacity.toLocaleString()} m²
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2, mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {translations.fillRate || 'Doluluk Oranı'}: {fillRate}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={fillRate} 
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 5,
                      backgroundColor: 
                        fillRate > 90 ? '#f44336' :
                        fillRate > 70 ? '#ff9800' : 
                        '#4caf50'
                    }
                  }}
                />
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>{translations.productCount || 'Ürün Sayısı'}:</strong> {warehouse.productCount.toLocaleString()} adet
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>{translations.criticalStockProducts || 'Kritik Stok Seviyesindeki Ürünler'}:</strong> {criticalStockProducts.length} adet
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {translations.criticalStockProducts || 'Kritik Stok Seviyesindeki Ürünler'}
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Ürün Kodu</strong></TableCell>
                      <TableCell><strong>Ürün Adı</strong></TableCell>
                      <TableCell><strong>Kategori</strong></TableCell>
                      <TableCell align="right"><strong>Mevcut Stok</strong></TableCell>
                      <TableCell align="right"><strong>Kritik Seviye</strong></TableCell>
                      <TableCell align="right"><strong>Son Sipariş Tarihi</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {criticalStockProducts.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>{product.code}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell align="right">{product.stock}</TableCell>
                        <TableCell align="right">{product.criticalLevel}</TableCell>
                        <TableCell align="right">{product.lastOrderDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {translations.recentOperations || 'Son İşlemler'}
              </Typography>
              <Box sx={{ mb: 2 }}>
                {recentOperations.map((operation, index) => (
                  <Typography key={index} variant="body2" color="text.secondary" gutterBottom>
                    • {operation.date} - {operation.description}
                  </Typography>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {translations.close || 'Kapat'}
        </Button>
        <Button 
          color="primary" 
          startIcon={<AssessmentIcon />}
          onClick={onReportOpen}
        >
          {translations.detailedReport || 'Detaylı Rapor'}
        </Button>
        <Button 
          color="primary" 
          startIcon={<InventoryIcon />}
          onClick={onInventoryOpen}
        >
          {translations.inventoryManagement || 'Envanter Yönetimi'}
        </Button>
        <Button 
          color="warning" 
          startIcon={<WarningIcon />}
          onClick={onIssueOpen}
        >
          {translations.issueReport || 'Arıza Bildir'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WarehouseDetails;
