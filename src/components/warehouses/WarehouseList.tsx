import React from 'react';
import { 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination,
  Typography,
  IconButton,
  FormControlLabel,
  LinearProgress,
  styled,
  Radio
} from '@mui/material';
import { orange, red } from '@mui/material/colors';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotifications } from '../../contexts/NotificationContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StoreIcon from '@mui/icons-material/Store';
import ExportButton from '../common/ExportButton';
import PrintButton from '../common/PrintButton';

// Excel uyumlu CSV dosyası oluşturma yardımcı fonksiyonu
const exportToCSV = (data: any[], filename: string) => {
  console.log('ExportToCSV fonksiyonuna gelen veri:', data);
  
  // Veri kontrolü - boş veri durumunda hata mesajı göster
  if (!data || data.length === 0) {
    console.error('Dışa aktarılacak veri bulunamadı!');
    return false;
  }

  try {
    // Başlıkları al
    const headers = Object.keys(data[0]);
    console.log('CSV Başlıkları:', headers);
    
    // Excel uyumlu CSV içeriğini oluştur (UTF-8 BOM ile)
    // BOM karakteri Excel'in UTF-8 kodlamasını doğru algılamasını sağlar
    const BOM = '\uFEFF';
    
    // Başlık satırı ve veri satırlarını oluştur
    let csvRows = [];
    
    // Başlık satırını ekle
    csvRows.push(headers.join(';'));
    
    // Veri satırlarını ekle
    for (const row of data) {
      const values = headers.map(header => {
        const cell = row[header] === undefined || row[header] === null ? '' : String(row[header]);
        // Noktalı virgül içeren hücreler için tırnak işareti kullan
        return cell.includes(';') ? `"${cell}"` : cell;
      });
      csvRows.push(values.join(';'));
    }
    
    // Tüm satırları birleştir
    const csvContent = BOM + csvRows.join('\r\n');
    console.log('CSV içeriği oluşturuldu, boyut:', csvContent.length);
    
    // Blob oluştur ve indirme bağlantısı oluştur
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // İndirme bağlantısı oluştur
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // URL'i serbest bırak
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
    
    console.log('Excel raporu başarıyla oluşturuldu:', filename);
    return true;
  } catch (error) {
    console.error('Excel raporu oluşturulurken hata oluştu:', error);
    return false;
  }
}

// Özel turuncu radio butonu
const OrangeRadio = styled(Radio)(({ theme }) => ({
  color: red[400],  // Pasif durumda kırmızı
  '&.Mui-checked': {
    color: orange[500],  // Aktif durumda turuncu
  },
}));

// Depo tipi tanımı
export interface Warehouse {
  id: number;
  name: string;
  location: string;
  manager: string;
  capacity: number;
  usedCapacity: number;
  status: string;
  productCount: number;
  lastInventory: string;
  fillRate: number;
  floors?: number;
  shelfSections?: string;
  description?: string;
}

interface WarehouseListProps {
  warehouses: Warehouse[];
  page: number;
  rowsPerPage: number;
  onChangePage: (event: unknown, newPage: number) => void;
  onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: (warehouse: Warehouse) => void;
  onDelete: (id: number) => void;
  onViewDetails: (warehouse: Warehouse) => void;
  onStatusChange: (warehouse: Warehouse, newStatus: string) => void;
}

const WarehouseList: React.FC<WarehouseListProps> = ({
  warehouses,
  page,
  rowsPerPage,
  onChangePage,
  onChangeRowsPerPage,
  onEdit,
  onDelete,
  onViewDetails,
  onStatusChange
}) => {
  const { translations } = useLanguage();
  const notifications = useNotifications();
  
  // Sayfalanmış depolar
  const paginatedWarehouses = warehouses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Tablo başlıkları
  const tableHeaders = [
    { id: 'name', label: translations.warehouseName || 'Depo Adı' },
    { id: 'location', label: translations.location || 'Konum' },
    { id: 'manager', label: translations.warehouseManager || 'Depo Sorumlusu' },
    { id: 'capacity', label: translations.capacityUsage || 'Kapasite Kullanımı' },
    { id: 'productCount', label: translations.productCount || 'Ürün Sayısı' },
    { id: 'status', label: translations.status || 'Durum' },
    { id: 'actions', label: translations.actionButtons || 'İşlemler' }
  ];

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: { xs: 1, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <ExportButton 
          label={translations.exportWarehouseList || "Depo Listesini Dışa Aktar"} 
          onClick={() => {
            try {
              // Basit veri dışa aktarma yaklaşımı
              // Depo verilerini doğrudan kullan
              if (!warehouses || warehouses.length === 0) {
                notifications.showError('Dışa aktarılacak depo bulunamadı!');
                return;
              }
              
              // Sabit başlıklar
              const headers = [
                'ID', 'Depo Adı', 'Konum', 'Sorumlu', 'Kapasite',
                'Kullanılan Kapasite', 'Doluluk Oranı', 'Ürün Sayısı', 'Durum', 'Son Envanter'
              ];
              
              // CSV için veri hazırla
              const csvData: string[] = [];
              
              // Başlık satırını ekle
              csvData.push(headers.join(';'));
              
              // Veri satırlarını ekle
              warehouses.forEach(warehouse => {
                const rowData = [
                  String(warehouse.id),
                  warehouse.name,
                  warehouse.location,
                  warehouse.manager,
                  String(warehouse.capacity),
                  String(warehouse.usedCapacity),
                  `${warehouse.fillRate}%`,
                  String(warehouse.productCount),
                  warehouse.status,
                  warehouse.lastInventory
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
                link.setAttribute('download', `Depo_Listesi_${new Date().toLocaleDateString('tr-TR').replace(/\./g, '-')}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // URL'i serbest bırak
                setTimeout(() => {
                  URL.revokeObjectURL(url);
                }, 100);
                
                notifications.showSuccess('Depo listesi başarıyla dışa aktarıldı!', 'generic');
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
          label={translations.printWarehouseList || "Depo Listesini Yazdır"} 
          onClick={() => {
            try {
              if (!warehouses || warehouses.length === 0) {
                notifications.showError('Yazdırılacak depo bulunamadı!');
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
                      <th>ID</th>
                      <th>${translations.warehouseName || 'Depo Adı'}</th>
                      <th>${translations.location || 'Konum'}</th>
                      <th>${translations.warehouseManager || 'Depo Sorumlusu'}</th>
                      <th>${translations.capacity || 'Kapasite'}</th>
                      <th>${translations.usedCapacity || 'Kullanılan Kapasite'}</th>
                      <th>${translations.fillRate || 'Doluluk Oranı'}</th>
                      <th>${translations.productCount || 'Ürün Sayısı'}</th>
                      <th>${translations.status || 'Durum'}</th>
                      <th>${translations.lastInventory || 'Son Envanter'}</th>
                    </tr>
                  </thead>
                  <tbody>
              `;
              
              // Depo verilerini tabloya ekle
              warehouses.forEach(warehouse => {
                tableHTML += `
                  <tr>
                    <td>${warehouse.id}</td>
                    <td>${warehouse.name}</td>
                    <td>${warehouse.location}</td>
                    <td>${warehouse.manager}</td>
                    <td>${warehouse.capacity}</td>
                    <td>${warehouse.usedCapacity}</td>
                    <td>${warehouse.fillRate}%</td>
                    <td>${warehouse.productCount}</td>
                    <td>${warehouse.status}</td>
                    <td>${warehouse.lastInventory}</td>
                  </tr>
                `;
              });
              
              tableHTML += `
                  </tbody>
                </table>
              `;
              
              // Yazdırma belgesini oluştur
              printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                  <title>${translations.warehouseManagement || 'Depo Yönetimi'}</title>
                  <meta charset="utf-8">
                  <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1 { color: #2a6496; text-align: center; margin-bottom: 20px; }
                    table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; font-weight: bold; }
                    tr:nth-child(even) { background-color: #f9f9f9; }
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
                  <h1>${translations.warehouseManagement || 'Depo Yönetimi'}</h1>
                  <div class="company-info">
                    <p>Winfinit Bilişim Teknolojileri</p>
                  </div>
                  <div>${tableHTML}</div>
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
                notifications.showSuccess('Depo listesi başarıyla yazdırıldı!', 'generic');
              };
            } catch (error) {
              console.error('Yazdırma hatası:', error);
              notifications.showError('Yazdırma sırasında bir hata oluştu!');
            }
          }}
        />
      </Box>
      <TableContainer sx={{ maxHeight: { xs: 350, sm: 400, md: 440 }, overflowX: 'auto' }}>
        <Table stickyHeader aria-label="depo tablosu" size="small" id="warehouse-table">
          <TableHead>
            <TableRow>
              {tableHeaders.map((header) => {
                const isHiddenOnMobile = ['location'].includes(header.id);
                
                return (
                  <TableCell 
                    key={header.id}
                    align={header.id === 'actions' ? 'center' : header.id === 'capacity' || header.id === 'productCount' ? 'right' : 'left'}
                    sx={{ 
                      fontWeight: 'bold',
                      display: {
                        xs: isHiddenOnMobile ? 'none' : 'table-cell',
                        sm: 'table-cell'
                      },
                      padding: { xs: '8px 6px', sm: '16px 8px', md: '16px' }
                    }}
                  >
                    {header.label}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedWarehouses.map((warehouse) => (
              <TableRow key={warehouse.id} hover>
                <TableCell sx={{ padding: { xs: '8px 6px', sm: '16px 8px', md: '16px' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <StoreIcon sx={{ mr: 1, color: 'primary.main' }} />
                    {warehouse.name}
                  </Box>
                </TableCell>
                <TableCell sx={{ 
                  display: { xs: 'none', sm: 'table-cell' },
                  padding: { xs: '8px 6px', sm: '16px 8px', md: '16px' }
                }}>
                  {warehouse.location}
                </TableCell>
                <TableCell sx={{ padding: { xs: '8px 6px', sm: '16px 8px', md: '16px' } }}>
                  {warehouse.manager}
                </TableCell>
                <TableCell sx={{ padding: { xs: '8px 6px', sm: '16px 8px', md: '16px' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={(warehouse.usedCapacity / warehouse.capacity) * 100} 
                        sx={{
                          height: 8,
                          borderRadius: 5,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 5,
                            backgroundColor: 
                              (warehouse.usedCapacity / warehouse.capacity) > 0.9 ? '#f44336' :
                              (warehouse.usedCapacity / warehouse.capacity) > 0.7 ? '#ff9800' : 
                              '#4caf50'
                          }
                        }}
                      />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                      <Typography variant="body2" color="text.secondary">
                        {((warehouse.usedCapacity / warehouse.capacity) * 100).toFixed(0)}%
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ padding: { xs: '8px 6px', sm: '16px 8px', md: '16px' } }}>
                  {warehouse.productCount.toLocaleString()}
                </TableCell>
                <TableCell align="center" sx={{ padding: { xs: '8px 6px', sm: '16px 8px', md: '16px' } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <FormControlLabel
                      control={
                        <OrangeRadio 
                          checked={warehouse.status === 'Aktif'}
                          onClick={() => {
                            // Durumu değiştir (Aktif -> Pasif, Pasif -> Aktif)
                            const newStatus = warehouse.status === 'Aktif' ? 'Pasif' : 'Aktif';
                            onStatusChange(warehouse, newStatus);
                          }}
                        />
                      }
                      label={warehouse.status}
                      sx={{ m: 0 }}
                    />
                  </Box>
                </TableCell>
                <TableCell align="center" sx={{ padding: { xs: '8px 6px', sm: '16px 8px', md: '16px' } }}>
                  <IconButton 
                    size="small" 
                    color="primary" 
                    onClick={() => onViewDetails(warehouse)}
                    sx={{ mx: 0.5 }}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="secondary" 
                    onClick={() => onEdit(warehouse)}
                    sx={{ mx: 0.5 }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="error" 
                    onClick={() => onDelete(warehouse.id)}
                    sx={{ mx: 0.5 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={warehouses.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
        labelRowsPerPage={translations.rowsPerPage || "Sayfa başına satır:"}
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} / ${count !== -1 ? count : `${to} ${translations.from || 'toplam'}`}`
        }
      />
    </Paper>
  );
};

export default WarehouseList;
