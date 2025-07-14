import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box, 
  Grid, 
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer
} from '@mui/material';
import { useLanguage } from '../../contexts/LanguageContext';
import { Warehouse } from './WarehouseList';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PrintButton from '../common/PrintButton';
import ExportButton from '../common/ExportButton';

interface WarehouseReportDialogProps {
  open: boolean;
  onClose: () => void;
  warehouse: Warehouse | null;
}

const WarehouseReportDialog: React.FC<WarehouseReportDialogProps> = ({
  open,
  onClose,
  warehouse
}) => {
  const { translations } = useLanguage();

  if (!warehouse) return null;

  // Örnek rapor verileri
  const inventoryItems = [
    { code: 'PRD-1001', name: 'Widget A', category: 'Elektronik', quantity: 150, price: 250, totalValue: 37500 },
    { code: 'PRD-1042', name: 'Widget B', category: 'Elektronik', quantity: 85, price: 320, totalValue: 27200 },
    { code: 'PRD-2105', name: 'Aksesuar C', category: 'Giyim', quantity: 120, price: 150, totalValue: 18000 },
    { code: 'PRD-3210', name: 'Mobilya D', category: 'Ev Eşyası', quantity: 45, price: 1200, totalValue: 54000 },
    { code: 'PRD-4002', name: 'Elektronik E', category: 'Elektronik', quantity: 65, price: 450, totalValue: 29250 }
  ];

  // Toplam değeri hesapla
  const totalInventoryValue = inventoryItems.reduce((sum, item) => sum + item.totalValue, 0);

  // Doluluk oranını hesapla
  const fillRate = Math.round((warehouse.usedCapacity / warehouse.capacity) * 100);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      aria-labelledby="warehouse-report-dialog"
    >
      <DialogTitle id="warehouse-report-dialog">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AssessmentIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">
              {translations.warehouseDetailedReport || 'Depo Detaylı Raporu'}
            </Typography>
          </Box>
          <Box>
            <ExportButton 
              label={translations.exportGeneric || "Dışa Aktar"}
            />
            <PrintButton 
              label={translations.print || "Yazdır"} 
            />
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent id="warehouse-report">
        {warehouse && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h5" gutterBottom color="primary">
              {warehouse.name} - {translations.detailedReport || 'Detaylı Analiz Raporu'}
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {translations.warehouseDetails || 'Depo Bilgileri'}
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {translations.warehouseName || 'Depo Adı'}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {warehouse.name}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {translations.location || 'Konum'}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {warehouse.location}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {translations.warehouseManager || 'Depo Sorumlusu'}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {warehouse.manager}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {translations.capacity || 'Kapasite'}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {warehouse.capacity.toLocaleString()} m²
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {translations.usedCapacity || 'Kullanılan Kapasite'}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {warehouse.usedCapacity.toLocaleString()} m² ({fillRate}%)
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {translations.inventoryCount || 'Envanter Özeti'}
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {translations.productCount || 'Toplam Ürün Sayısı'}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {warehouse.productCount.toLocaleString()} adet
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {translations.totalInventoryValue || 'Toplam Envanter Değeri'}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {totalInventoryValue.toLocaleString()} ₺
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {translations.averageProductValue || 'Ortalama Ürün Değeri'}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {(totalInventoryValue / warehouse.productCount).toFixed(2)} ₺
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {translations.lastInventory || 'Son Envanter Tarihi'}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {warehouse.lastInventory}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {translations.inventory || 'Envanter Detayı'}
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>{translations.productCode || 'Ürün Kodu'}</strong></TableCell>
                          <TableCell><strong>{translations.inventoryProductName || 'Ürün Adı'}</strong></TableCell>
                          <TableCell><strong>{translations.productCategory || 'Ürün Kategorisi'}</strong></TableCell>
                          <TableCell align="right"><strong>{translations.quantity || 'Miktar'}</strong></TableCell>
                          <TableCell align="right"><strong>{translations.inventoryUnitPrice || 'Birim Fiyat'}</strong></TableCell>
                          <TableCell align="right"><strong>{translations.totalValue || 'Toplam Değer'}</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {inventoryItems.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.code}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right">{item.price} ₺</TableCell>
                            <TableCell align="right">{item.totalValue.toLocaleString()} ₺</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={4} />
                          <TableCell align="right">
                            <Typography variant="subtitle1"><strong>{translations.total || 'Toplam'}</strong></Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="subtitle1"><strong>{totalInventoryValue.toLocaleString()} ₺</strong></Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {translations.close || 'Kapat'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WarehouseReportDialog;
