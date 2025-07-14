import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Description as FileIcon,
  GetApp as DownloadIcon
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { Customer } from '../../types/Customer';

interface CustomerImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (customers: Customer[]) => void;
}

const CustomerImportDialog: React.FC<CustomerImportDialogProps> = ({
  open,
  onClose,
  onImport
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      parseExcelFile(file);
    }
  };

  const parseExcelFile = (file: File) => {
    setLoading(true);
    setError(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // İlk 5 satırı önizleme olarak göster
        setPreviewData(jsonData.slice(0, 5));
        setLoading(false);
      } catch (err) {
        setError('Excel dosyası okunurken bir hata oluştu. Lütfen dosya formatını kontrol edin.');
        setLoading(false);
      }
    };
    
    reader.onerror = () => {
      setError('Dosya okuma hatası.');
      setLoading(false);
    };
    
    reader.readAsBinaryString(file);
  };

  const handleImport = () => {
    if (!selectedFile) return;
    
    setLoading(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Veriyi Customer tipine dönüştür
        const customers = jsonData.map((row: any, index: number) => {
          const newId = `IMPORT${index}`;
          return {
            id: newId,
            code: newId,
            name: row.name || row.Name || row.NAME || row["Müşteri Adı"] || '',
            email: row.email || row.Email || row.EMAIL || row["E-posta Adresi"] || '',
            phone: row.phone || row.Phone || row.PHONE || row["Telefon"] || '',
            country: row.country || row.Country || row.COUNTRY || row["Ülke"] || 'Turkey',
            city: row.city || row.City || row.CITY || row["Şehir"] || '',
            status: row.status || row.Status || row.STATUS || row["Durum"] || 'Aktif',
            lastOrder: row.lastOrder || row.LastOrder || row.LAST_ORDER || '-',
            balance: parseFloat(row.balance || row.Balance || row.BALANCE || row["Bakiye"] || '0') || 0,
            party: row.party || row.Party || row.PARTY || row["Müşteri Tipi"] || ''
          };
        });
        
        onImport(customers);
        setSuccess(true);
        setLoading(false);
        
        // Başarılı mesajını 2 saniye sonra kapat
        setTimeout(() => {
          setSuccess(false);
          onClose();
          setSelectedFile(null);
          setPreviewData(null);
        }, 2000);
        
      } catch (err) {
        setError('Veri işlenirken bir hata oluştu.');
        setLoading(false);
      }
    };
    
    reader.onerror = () => {
      setError('Dosya okuma hatası.');
      setLoading(false);
    };
    
    reader.readAsBinaryString(selectedFile);
  };

  const handleClickChooseFile = () => {
    fileInputRef.current?.click();
  };

  const downloadTemplate = (format: 'excel' | 'csv') => {
    // Örnek şablon verileri
    const templateData = [
      { 
        "Müşteri Adı": 'Örnek Müşteri',
        "E-posta Adresi": 'ornek@email.com',
        "Telefon": '+905551234567',
        "Ülke": 'Turkey',
        "Şehir": 'Istanbul',
        "Durum": 'Aktif',
        "Bakiye": '0',
        "Müşteri Tipi": 'buyer'
      }
    ];

    if (format === 'excel') {
      const worksheet = XLSX.utils.json_to_sheet(templateData);
      
      // Sütun genişliklerini ayarla
      const wscols = [
        { wch: 20 }, // Müşteri Adı
        { wch: 25 }, // E-posta Adresi
        { wch: 15 }, // Telefon
        { wch: 10 }, // Ülke
        { wch: 15 }, // Şehir
        { wch: 10 }, // Durum
        { wch: 10 }, // Bakiye
        { wch: 15 }  // Müşteri Tipi
      ];
      worksheet['!cols'] = wscols;
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Müşteriler');
      XLSX.writeFile(workbook, 'musteri_import_sablonu.xlsx');
    } else {
      const worksheet = XLSX.utils.json_to_sheet(templateData);
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'musteri_import_sablonu.csv';
      link.click();
    }
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { width: '100%', maxWidth: 700 } }}
      >
        <DialogTitle sx={{ bgcolor: '#25638f', color: 'white', fontWeight: 500 }}>
          <Typography variant="h6" component="div">
            Müşteri Verilerini İçe Aktar
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h5" component="div" sx={{ mb: 1 }}>
              Import Files
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: '250px',
                  height: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                {/* Mavi dosya arkaplanı */}
                <Box
                  sx={{
                    width: '100px',
                    height: '120px',
                    bgcolor: '#1976d2',
                    borderRadius: '5px',
                    position: 'absolute',
                    top: '10px',
                    left: '40px',
                    transform: 'rotate(-15deg)',
                    zIndex: 1,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  <Box sx={{ p: 1, color: 'white' }}>
                    <Box sx={{ width: '50px', height: '4px', bgcolor: 'white', mb: 1 }} />
                    <Box sx={{ width: '70px', height: '4px', bgcolor: 'white', mb: 1 }} />
                  </Box>
                </Box>
                
                {/* Mavi dosya arkaplanı 2 */}
                <Box
                  sx={{
                    width: '100px',
                    height: '120px',
                    bgcolor: '#1976d2',
                    borderRadius: '5px',
                    position: 'absolute',
                    top: '5px',
                    left: '80px',
                    zIndex: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  <Box sx={{ p: 1, color: 'white' }}>
                    <Box sx={{ width: '50px', height: '4px', bgcolor: 'white', mb: 1 }} />
                    <Box sx={{ width: '70px', height: '4px', bgcolor: 'white', mb: 1 }} />
                  </Box>
                </Box>
                
                {/* Yeşil çizgili dosya */}
                <Box
                  sx={{
                    width: '100px',
                    height: '120px',
                    bgcolor: 'white',
                    borderRadius: '5px',
                    position: 'absolute',
                    top: '20px',
                    left: '110px',
                    transform: 'rotate(15deg)',
                    zIndex: 3,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  <Box sx={{ p: 1 }}>
                    <Box sx={{ width: '70px', height: '4px', bgcolor: '#e0e0e0', mb: 1 }} />
                    <Box sx={{ width: '50px', height: '4px', bgcolor: '#e0e0e0', mb: 1 }} />
                    <Box sx={{ width: '70px', height: '4px', bgcolor: '#4caf50', mb: 1 }} />
                    <Box sx={{ width: '50px', height: '4px', bgcolor: '#e0e0e0', mb: 1 }} />
                  </Box>
                </Box>
                
                {/* Ön dosya (profil) */}
                <Box
                  sx={{
                    width: '120px',
                    height: '140px',
                    bgcolor: 'white',
                    borderRadius: '5px',
                    position: 'absolute',
                    top: '50px',
                    left: '70px',
                    zIndex: 4,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Box 
                    sx={{ 
                      width: '60px', 
                      height: '60px', 
                      borderRadius: '50%', 
                      bgcolor: '#e0e0e0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Box sx={{ width: '40px', height: '20px', borderRadius: '40px 40px 0 0', bgcolor: '#bdbdbd' }} />
                  </Box>
                  <Box sx={{ width: '80px', height: '4px', bgcolor: '#e0e0e0', mt: 2 }} />
                  <Box sx={{ width: '60px', height: '4px', bgcolor: '#e0e0e0', mt: 1 }} />
                  <Box sx={{ width: '70px', height: '4px', bgcolor: '#e0e0e0', mt: 1 }} />
                </Box>
              </Box>
            </Box>
            
            <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
              import and manage a table
            </Typography>
            
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleClickChooseFile}
              sx={{ 
                bgcolor: '#1976d2', 
                '&:hover': { bgcolor: '#1565c0' },
                mb: 2
              }}
            >
              Choose File
            </Button>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" component="div" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <DownloadIcon sx={{ mr: 1 }} />
                Download Template
              </Typography>
              
              <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  Download template as
                </Typography>
                
                <Box>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<FileIcon />}
                    onClick={() => downloadTemplate('excel')}
                    sx={{ mr: 1 }}
                  >
                    .xlsx Download as Microsoft Excel
                  </Button>
                  
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<FileIcon />}
                    onClick={() => downloadTemplate('csv')}
                  >
                    .csv Download as comma separated values
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
          
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <CircularProgress />
            </Box>
          )}
          
          {error && (
            <Alert severity="error" sx={{ my: 2 }}>
              {error}
            </Alert>
          )}
          
          {selectedFile && !loading && !error && (
            <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Seçilen Dosya: {selectedFile.name}
              </Typography>
              
              {previewData && previewData.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Önizleme (İlk 5 kayıt):
                  </Typography>
                  
                  <Box sx={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #eee', p: 1 }}>
                    <pre>{JSON.stringify(previewData, null, 2)}</pre>
                  </Box>
                </Box>
              )}
            </Paper>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={onClose} variant="outlined" color="inherit">
            İptal
          </Button>
          <Button 
            onClick={handleImport} 
            variant="contained" 
            disabled={!selectedFile || loading}
            sx={{ bgcolor: '#25638f', '&:hover': { bgcolor: '#1e5075' } }}
          >
            {loading ? 'İçe Aktarılıyor...' : 'İçe Aktar'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Müşteri verileri başarıyla içe aktarıldı!
        </Alert>
      </Snackbar>
    </>
  );
};

export default CustomerImportDialog;
