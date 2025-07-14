import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Stack,
  TextField,
  InputAdornment,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TableFilter, { defaultFilterOptions, FilterOption } from '../common/TableFilter';

// Örnek veri tipi
interface LogEntry {
  id: string;
  action: string;
  actionType: string;
  date: string;
  description: string;
  ipAddress: string;
  browser: string;
  device: string;
}

// Örnek veri
const sampleData: LogEntry[] = [
  {
    id: '1',
    action: 'Giriş yapıldı',
    actionType: 'login',
    date: '2023-05-22 14:30',
    description: 'Kullanıcı başarıyla giriş yaptı',
    ipAddress: '192.168.1.1',
    browser: 'Chrome',
    device: 'Windows'
  },
  {
    id: '2',
    action: 'Ürün eklendi',
    actionType: 'product_added',
    date: '2023-05-22 15:45',
    description: 'Yeni ürün: Laptop',
    ipAddress: '192.168.1.1',
    browser: 'Chrome',
    device: 'Windows'
  },
  {
    id: '3',
    action: 'Kod: A-98',
    actionType: 'code_updated',
    date: '2023-05-23 09:15',
    description: 'Ürün kodu güncellendi: A-98',
    ipAddress: '192.168.1.5',
    browser: 'Firefox',
    device: 'MacOS'
  },
  {
    id: '4',
    action: 'Ürün silindi',
    actionType: 'product_deleted',
    date: '2023-05-23 11:30',
    description: 'Ürün silindi: Klavye',
    ipAddress: '192.168.1.5',
    browser: 'Firefox',
    device: 'MacOS'
  },
  {
    id: '5',
    action: 'Giriş yapıldı',
    actionType: 'login',
    date: '2023-05-24 08:45',
    description: 'Yönetici giriş yaptı',
    ipAddress: '192.168.1.10',
    browser: 'Safari',
    device: 'iOS'
  }
];

const FilteredTableExample: React.FC = () => {
  // Arama metni state'i
  const [searchTerm, setSearchTerm] = useState<string>('');
  // Seçili filtreler state'i
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  // Filtrelenmiş veri state'i
  const [filteredData, setFilteredData] = useState<LogEntry[]>(sampleData);

  // Arama ve filtreleme işlemi
  useEffect(() => {
    let result = sampleData;

    // Filtre uygula
    if (selectedFilters.length > 0) {
      result = result.filter(item => selectedFilters.includes(item.actionType));
    }

    // Arama uygula
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        item =>
          item.action.toLowerCase().includes(lowerCaseSearchTerm) ||
          item.description.toLowerCase().includes(lowerCaseSearchTerm) ||
          item.ipAddress.toLowerCase().includes(lowerCaseSearchTerm) ||
          item.browser.toLowerCase().includes(lowerCaseSearchTerm) ||
          item.device.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    setFilteredData(result);
  }, [searchTerm, selectedFilters]);

  // Filtre değişikliği
  const handleFilterChange = (filters: string[]) => {
    setSelectedFilters(filters);
  };

  // Arama değişikliği
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // İşlem türüne göre renk belirleme
  const getActionColor = (actionType: string): string => {
    const option = defaultFilterOptions.find(opt => opt.id === actionType);
    return option ? option.backgroundColor : '#757575';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 500 }}>
        Sistem Logları
      </Typography>

      {/* Arama ve Filtre Alanı */}
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2} 
        sx={{ mb: 3 }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
      >
        <TextField
          placeholder="Ara..."
          variant="outlined"
          fullWidth
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: { borderRadius: 2 }
          }}
          sx={{ flexGrow: 1 }}
        />
        
        <TableFilter 
          options={defaultFilterOptions}
          onFilterChange={handleFilterChange}
          initialFilters={[]}
        />
      </Stack>

      {/* Tablo */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>İşlem</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Tarih & Saat</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Açıklama</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>IP Adresi</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Tarayıcı</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Cihaz</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <TableRow key={row.id} sx={{ '&:hover': { backgroundColor: '#fafafa' } }}>
                  <TableCell>
                    <Chip
                      label={row.action}
                      sx={{
                        backgroundColor: getActionColor(row.actionType),
                        color: '#fff',
                        fontWeight: 500,
                        fontSize: '0.75rem'
                      }}
                    />
                  </TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.ipAddress}</TableCell>
                  <TableCell>{row.browser}</TableCell>
                  <TableCell>{row.device}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    Sonuç bulunamadı
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Toplam Kayıt Sayısı */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Toplam {filteredData.length} kayıt
        </Typography>
      </Box>
    </Box>
  );
};

export default FilteredTableExample;
