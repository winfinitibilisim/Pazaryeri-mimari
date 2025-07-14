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
  Chip,
  Button,
  IconButton,
  Tooltip,
  Pagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import RefreshIcon from '@mui/icons-material/Refresh';
import TableFilter, { FilterOption } from './TableFilter';
import AddButton from './AddButton';
import EditButton from './EditButton';
import ExportButton from './ExportButton';
import PrintButton from './PrintButton';

// Tablo sütun tipi
export interface TableColumn<T> {
  id: string;
  label: string;
  render: (row: T) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
}

// Tablo için işlem tipi
export interface TableAction<T> {
  icon?: React.ReactNode;
  tooltip?: string;
  onClick: (row: T) => void;
  show?: (row: T) => boolean;
}

// Tablo props tipi
interface FilterableTableProps<T> {
  title?: string;
  data: T[];
  columns: TableColumn<T>[];
  filterOptions?: FilterOption[];
  filterField?: keyof T;
  searchFields?: (keyof T)[];
  rowsPerPage?: number;
  onExport?: () => void;
  onRefresh?: () => void;
  onPrint?: () => void;
  filterTitle?: string;
  showPagination?: boolean;
  emptyMessage?: string;
  showAddButton?: boolean;
  addButtonLabel?: string;
  onAdd?: () => void;
  actions?: TableAction<T>[];
  onEdit?: (row: T) => void;
  showEditButton?: boolean;
  showPrintButton?: boolean;
}

function FilterableTable<T extends Record<string, any>>({
  title,
  data,
  columns,
  filterOptions = [],
  filterField,
  searchFields = [],
  rowsPerPage = 10,
  onExport,
  onRefresh,
  onPrint,
  filterTitle = 'İşlem Türü',
  showPagination = true,
  emptyMessage = 'Sonuç bulunamadı',
  showAddButton = false,
  addButtonLabel,
  onAdd,
  actions = [],
  onEdit,
  showEditButton = false,
  showPrintButton = false
}: FilterableTableProps<T>) {
  // Arama metni state'i
  const [searchTerm, setSearchTerm] = useState<string>('');
  // Seçili filtreler state'i
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  // Filtrelenmiş veri state'i
  const [filteredData, setFilteredData] = useState<T[]>(data);
  // Sayfalama state'i
  const [page, setPage] = useState(1);
  
  // Toplam sayfa sayısı
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  
  // Görüntülenecek veri
  const displayData = showPagination 
    ? filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage)
    : filteredData;

  // Veri değiştiğinde filtrelenmiş veriyi güncelle
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  // Arama ve filtreleme işlemi
  useEffect(() => {
    let result = [...data];

    // Filtre uygula
    if (selectedFilters.length > 0 && filterField) {
      result = result.filter(item => selectedFilters.includes(String(item[filterField])));
    }

    // Arama uygula
    if (searchTerm && searchFields.length > 0) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      result = result.filter(item => {
        return searchFields.some(field => {
          const value = item[field];
          return value && String(value).toLowerCase().includes(lowerCaseSearchTerm);
        });
      });
    }

    setFilteredData(result);
    setPage(1); // Filtreleme yapıldığında ilk sayfaya dön
  }, [searchTerm, selectedFilters, data, filterField, searchFields]);

  // Filtre değişikliği
  const handleFilterChange = (filters: string[]) => {
    setSelectedFilters(filters);
  };

  // Arama değişikliği
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Sayfa değişikliği
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Box>
      {title && (
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
          {title}
        </Typography>
      )}

      {/* Arama, Filtre ve Butonlar */}
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2} 
        sx={{ mb: 3 }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="space-between"
      >
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          sx={{ flexGrow: 1 }}
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
            sx={{ flexGrow: 1, maxWidth: { sm: 300 } }}
          />
          
          {filterOptions.length > 0 && (
            <TableFilter 
              title={filterTitle}
              options={filterOptions}
              onFilterChange={handleFilterChange}
              initialFilters={[]}
            />
          )}
        </Stack>
        
        <Stack direction="row" spacing={1}>
          {showAddButton && onAdd && (
            <AddButton
              label={addButtonLabel}
              onClick={onAdd}
            />
          )}
          
          {onRefresh && (
            <Tooltip title="Yenile">
              <IconButton onClick={onRefresh} size="small" sx={{ border: '1px solid #e0e0e0' }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          )}
          
          {onPrint && showPrintButton && (
            <PrintButton
              onClick={onPrint}
              size="small"
            />
          )}
          
          {onExport && (
            <ExportButton
              onClick={onExport}
              size="small"
            />
          )}
        </Stack>
      </Stack>

      {/* Tablo */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              {columns.map((column) => (
                <TableCell 
                  key={column.id} 
                  align={column.align || 'left'} 
                  sx={{ fontWeight: 600, fontSize: '0.875rem' }}
                >
                  {column.label}
                </TableCell>
              ))}
              {/* İşlem sütunu başlığı */}
              {(actions.length > 0 || (showEditButton && onEdit)) && (
                <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  İşlemler
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayData.length > 0 ? (
              displayData.map((row, index) => (
                <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#fafafa' } }}>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align || 'left'}>
                      {column.render(row)}
                    </TableCell>
                  ))}
                  {/* İşlem butonları */}
                  {(actions.length > 0 || (showEditButton && onEdit)) && (
                    <TableCell align="right" sx={{ width: actions.length > 1 ? 120 : 60 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        {showEditButton && onEdit && (
                          <EditButton onClick={() => onEdit(row)} />
                        )}
                        {actions.map((action, actionIndex) => (
                          action.show ? (action.show(row) ? (
                            <Tooltip key={actionIndex} title={action.tooltip || ''}>
                              <IconButton 
                                size="small" 
                                onClick={() => action.onClick(row)}
                                sx={{ color: '#2a6496' }}
                              >
                                {action.icon}
                              </IconButton>
                            </Tooltip>
                          ) : null) : (
                            <Tooltip key={actionIndex} title={action.tooltip || ''}>
                              <IconButton 
                                size="small" 
                                onClick={() => action.onClick(row)}
                                sx={{ color: '#2a6496' }}
                              >
                                {action.icon}
                              </IconButton>
                            </Tooltip>
                          )
                        ))}
                      </Stack>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={(actions.length > 0 || (showEditButton && onEdit)) ? columns.length + 1 : columns.length} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Alt Bilgi - Sayfalama ve Toplam Kayıt */}
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2} 
        sx={{ mt: 2 }}
        alignItems={{ sm: 'center' }}
        justifyContent="space-between"
      >
        <Typography variant="body2" color="text.secondary">
          Toplam {filteredData.length} kayıt
        </Typography>
        
        {showPagination && totalPages > 1 && (
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange} 
            color="primary" 
            size="small"
            shape="rounded"
          />
        )}
      </Stack>
    </Box>
  );
}

export default FilterableTable;
