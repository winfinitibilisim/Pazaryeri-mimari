import React, { useState } from 'react';
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
  TableContainer,
  IconButton,
  TextField,
  Tooltip
} from '@mui/material';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { Warehouse } from './WarehouseList';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PrintButton from '../common/PrintButton';
import ExportButton from '../common/ExportButton';

interface WarehouseInventoryDialogProps {
  open: boolean;
  onClose: () => void;
  warehouse: Warehouse | null;
}

interface InventoryItem {
  code: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  totalValue: number;
  isEditing?: boolean;
  tempQuantity?: number;
}

const WarehouseInventoryDialog: React.FC<WarehouseInventoryDialogProps> = ({
  open,
  onClose,
  warehouse
}) => {
  const { translations } = useLanguage();
  const notifications = useNotifications();

  // Örnek envanter verileri
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    { code: 'PRD-1001', name: 'Widget A', category: 'Elektronik', quantity: 150, price: 250, totalValue: 37500 },
    { code: 'PRD-1042', name: 'Widget B', category: 'Elektronik', quantity: 85, price: 320, totalValue: 27200 },
    { code: 'PRD-2105', name: 'Aksesuar C', category: 'Giyim', quantity: 120, price: 150, totalValue: 18000 },
    { code: 'PRD-3210', name: 'Mobilya D', category: 'Ev Eşyası', quantity: 45, price: 1200, totalValue: 54000 },
    { code: 'PRD-4002', name: 'Elektronik E', category: 'Elektronik', quantity: 65, price: 450, totalValue: 29250 }
  ]);

  if (!warehouse) return null;

  // Toplam değeri hesapla
  const totalInventoryValue = inventoryItems.reduce((sum, item) => sum + item.totalValue, 0);
  
  // Ürün miktarını değiştir
  const handleQuantityChange = (index: number, newQuantity: number) => {
    const updatedItems = [...inventoryItems];
    updatedItems[index].tempQuantity = newQuantity;
    setInventoryItems(updatedItems);
  };
  
  // Düzenleme modunu aç
  const handleEditStart = (index: number) => {
    const updatedItems = [...inventoryItems];
    updatedItems[index].isEditing = true;
    updatedItems[index].tempQuantity = updatedItems[index].quantity;
    setInventoryItems(updatedItems);
  };
  
  // Düzenlemeyi iptal et
  const handleEditCancel = (index: number) => {
    const updatedItems = [...inventoryItems];
    updatedItems[index].isEditing = false;
    updatedItems[index].tempQuantity = undefined;
    setInventoryItems(updatedItems);
  };
  
  // Düzenlemeyi kaydet
  const handleEditSave = (index: number) => {
    const updatedItems = [...inventoryItems];
    if (updatedItems[index].tempQuantity !== undefined) {
      // tempQuantity undefined olmadığından emin olduktan sonra atama yapıyoruz
      // number tipine dönüştürerek tip hatasını önlüyoruz
      const newQuantity: number = Number(updatedItems[index].tempQuantity);
      updatedItems[index].quantity = newQuantity;
      updatedItems[index].totalValue = newQuantity * updatedItems[index].price;
    }
    updatedItems[index].isEditing = false;
    updatedItems[index].tempQuantity = undefined;
    setInventoryItems(updatedItems);
  };
  
  // Ürün girişi yap
  const handleProductEntry = (index: number, amount: number) => {
    const updatedItems = [...inventoryItems];
    updatedItems[index].quantity += amount;
    updatedItems[index].totalValue = updatedItems[index].quantity * updatedItems[index].price;
    setInventoryItems(updatedItems);
  };
  
  // Ürün çıkışı yap
  const handleProductExit = (index: number, amount: number) => {
    const updatedItems = [...inventoryItems];
    if (updatedItems[index].quantity >= amount) {
      updatedItems[index].quantity -= amount;
      updatedItems[index].totalValue = updatedItems[index].quantity * updatedItems[index].price;
      setInventoryItems(updatedItems);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      aria-labelledby="warehouse-inventory-dialog"
    >
      <DialogTitle id="warehouse-inventory-dialog">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <InventoryIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">
              {warehouse.name} - {translations.inventoryManagement || 'Envanter Yönetimi'}
            </Typography>
          </Box>
          <Box>
            <ExportButton 
              label={translations.exportGeneric || "Dışa Aktar"}
              onClick={() => {
                try {
                  if (!inventoryItems || inventoryItems.length === 0) {
                    notifications.showError('Dışa aktarılacak envanter verisi bulunamadı!');
                    return;
                  }
                  
                  // Sabit başlıklar
                  const headers = [
                    'Ürün Kodu', 'Ürün Adı', 'Kategori', 'Miktar', 'Birim Fiyat (TL)', 'Toplam Değer (TL)'
                  ];
                  
                  // CSV için veri hazırla
                  const csvData: string[] = [];
                  
                  // Başlık satırını ekle
                  csvData.push(headers.join(';'));
                  
                  // Veri satırlarını ekle
                  inventoryItems.forEach(item => {
                    const rowData = [
                      item.code,
                      item.name,
                      item.category,
                      String(item.quantity),
                      String(item.price),
                      String(item.totalValue)
                    ];
                    
                    // Özel karakterleri işle
                    const sanitizedRowData = rowData.map(cell => {
                      if (cell && cell.includes(';')) {
                        return `"${cell}"`;
                      }
                      return cell || '';
                    });
                    
                    csvData.push(sanitizedRowData.join(';'));
                  });
                  
                  // CSV dosyasını oluştur ve indir
                  if (csvData.length > 1) { // Başlık + en az 1 veri satırı
                    // Excel uyumlu UTF-8 BOM ekle
                    const BOM = '\uFEFF';
                    const csvContent = BOM + csvData.join('\r\n');
                    
                    // Blob oluştur
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    
                    // İndirme bağlantısı oluştur
                    const link = document.createElement('a');
                    link.setAttribute('href', url);
                    link.setAttribute('download', `${warehouse?.name || 'Depo'}_Envanter_${new Date().toLocaleDateString('tr-TR').replace(/\./g, '-')}.csv`);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    // URL'i serbest bırak
                    setTimeout(() => {
                      URL.revokeObjectURL(url);
                    }, 100);
                    
                    notifications.showSuccess('Envanter listesi başarıyla dışa aktarıldı!', 'generic');
                  } else {
                    notifications.showError('Dışa aktarılacak veri bulunamadı!');
                  }
                } catch (error) {
                  console.error('Excel dışa aktarma hatası:', error);
                  notifications.showError('Excel raporu oluşturulurken bir hata oluştu!');
                }
              }}
            />
            <PrintButton 
              label={translations.print || "Yazdır"} 
              onClick={() => {
                try {
                  if (!inventoryItems || inventoryItems.length === 0) {
                    notifications.showError('Yazdırılacak envanter verisi bulunamadı!');
                    return;
                  }
                  
                  // Yazdırma penceresi aç
                  const printWindow = window.open('', '_blank', 'height=600,width=800');
                  if (!printWindow) {
                    notifications.showError('Yazdırma penceresi açılamadı! Lütfen popup engelleyiciyi kontrol edin.');
                    return;
                  }
                  
                  // Tablo HTML'ini oluştur
                  let tableHTML = `
                    <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
                      <thead>
                        <tr style="background-color: #f2f2f2;">
                          <th>Ürün Kodu</th>
                          <th>Ürün Adı</th>
                          <th>Kategori</th>
                          <th>Miktar</th>
                          <th>Birim Fiyat (TL)</th>
                          <th>Toplam Değer (TL)</th>
                        </tr>
                      </thead>
                      <tbody>
                  `;
                  
                  // Envanter verilerini tabloya ekle
                  inventoryItems.forEach(item => {
                    tableHTML += `
                      <tr>
                        <td>${item.code}</td>
                        <td>${item.name}</td>
                        <td>${item.category}</td>
                        <td>${item.quantity}</td>
                        <td>${item.price}</td>
                        <td>${item.totalValue}</td>
                      </tr>
                    `;
                  });
                  
                  // Toplam değeri ekle
                  const totalValue = inventoryItems.reduce((sum, item) => sum + item.totalValue, 0);
                  
                  tableHTML += `
                      </tbody>
                      <tfoot>
                        <tr style="background-color: #f9f9f9; font-weight: bold;">
                          <td colspan="5" style="text-align: right;">Toplam Değer:</td>
                          <td>${totalValue} TL</td>
                        </tr>
                      </tfoot>
                    </table>
                  `;
                  
                  // Yazdırma belgesini oluştur
                  printWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <title>${warehouse?.name || 'Depo'} - Envanter Raporu</title>
                      <meta charset="utf-8">
                      <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        h1 { color: #2a6496; text-align: center; margin-bottom: 20px; }
                        table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; font-weight: bold; }
                        tr:nth-child(even) { background-color: #f9f9f9; }
                        tfoot td { font-weight: bold; }
                        .print-date { text-align: right; font-size: 12px; color: #666; margin-bottom: 10px; }
                        .company-info { text-align: center; margin-bottom: 20px; font-size: 14px; }
                        .summary { margin-top: 20px; border: 1px solid #ddd; padding: 10px; background-color: #f9f9f9; }
                        @media print {
                          .no-print { display: none; }
                          body { margin: 0; padding: 15px; }
                        }
                      </style>
                    </head>
                    <body>
                      <div class="print-date">${new Date().toLocaleString('tr-TR')}</div>
                      <h1>${warehouse?.name || 'Depo'} - Envanter Raporu</h1>
                      <div class="company-info">
                        <p>Winfinit Bilişim Teknolojileri</p>
                      </div>
                      <div>${tableHTML}</div>
                      <div class="summary">
                        <p><strong>Toplam Ürün Sayısı:</strong> ${inventoryItems.length}</p>
                        <p><strong>Toplam Envanter Değeri:</strong> ${totalValue} TL</p>
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
                    notifications.showSuccess('Envanter listesi başarıyla yazdırıldı!', 'generic');
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
      <DialogContent id="warehouse-inventory">
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  {translations.inventory || 'Envanter Detayı'}
                </Typography>
                <Typography variant="subtitle1">
                  {translations.totalInventoryValue || 'Toplam Değer'}: <strong>{totalInventoryValue.toLocaleString()} ₺</strong>
                </Typography>
              </Box>
              
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
                      <TableCell align="center"><strong>{translations.actionButtons || 'İşlemler'}</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inventoryItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.code}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell align="right">
                          {item.isEditing ? (
                            <TextField
                              type="number"
                              size="small"
                              value={item.tempQuantity}
                              onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 0)}
                              inputProps={{ min: 0 }}
                              sx={{ width: 80 }}
                            />
                          ) : (
                            item.quantity
                          )}
                        </TableCell>
                        <TableCell align="right">{item.price} ₺</TableCell>
                        <TableCell align="right">{item.totalValue.toLocaleString()} ₺</TableCell>
                        <TableCell align="center">
                          {item.isEditing ? (
                            <>
                              <Tooltip title={translations.saveChanges || "Değişiklikleri Kaydet"}>
                                <IconButton 
                                  size="small" 
                                  color="primary" 
                                  onClick={() => handleEditSave(index)}
                                >
                                  <SaveIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={translations.close || "Kapat"}>
                                <IconButton 
                                  size="small" 
                                  color="error" 
                                  onClick={() => handleEditCancel(index)}
                                >
                                  <CancelIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          ) : (
                            <>
                              <Tooltip title={translations.productEntry || "Ürün Girişi"}>
                                <IconButton 
                                  size="small" 
                                  color="success" 
                                  onClick={() => handleProductEntry(index, 5)}
                                >
                                  <AddIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={translations.productExit || "Ürün Çıkışı"}>
                                <IconButton 
                                  size="small" 
                                  color="error" 
                                  onClick={() => handleProductExit(index, 5)}
                                >
                                  <RemoveIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={translations.edit || "Düzenle"}>
                                <IconButton 
                                  size="small" 
                                  color="primary" 
                                  onClick={() => handleEditStart(index)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {translations.close || 'Kapat'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WarehouseInventoryDialog;
