import React, { useState, useMemo } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Toolbar,
  IconButton,

  Checkbox,
  LinearProgress,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,

  Add as AddIcon,

  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
// Yardımcı fonksiyonları import et
import { sortData, paginateData } from '../../utils/dataUtils';

// Column definition type
export interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row?: any) => React.ReactNode;
}

interface DataTableProps {
  title?: string;
  columns: Column[];
  rows?: any[];
  data?: any[]; // Geriye dönük uyumluluk için
  onRowClick?: (row: any) => void;
  onAddClick?: () => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  showToolbar?: boolean;
  loading?: boolean;
  pagination?: boolean;
  rowsPerPageOptions?: number[];
  initialRowsPerPage?: number;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: any[]) => void;
  idField?: string;
}

type Order = 'asc' | 'desc';

const DataTable: React.FC<DataTableProps> = ({
  title,
  columns,
  rows,
  data, // Geriye dönük uyumluluk için
  onRowClick,
  onEdit,
  onDelete,
  loading = false,
  pagination = true,
  rowsPerPageOptions = [5, 10, 25],
  initialRowsPerPage = 10,
  selectable = false,
  onSelectionChange,
  idField = 'id',
  onAddClick,
  showToolbar = true,
}) => {
  const [page, setPage] = useState(0);
  // Geriye dönük uyumluluk için data veya rows kullan
  const tableData = useMemo(() => rows || data || [], [rows, data]);
  const [orderBy, setOrderBy] = useState<string>(columns[0].id);
  const [order, setOrder] = useState<Order>('asc');
  const [searchText, setSearchText] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  
  // Filtreleme, sıralama ve sayfalama işlemlerini yardımcı fonksiyonlarla yap
  const filteredData = useMemo(() => {
    // Tüm sütunlarda arama yap
    let filtered = tableData;
    if (searchText) {
      filtered = tableData.filter(row => 
        columns.some(column => {
          const value = row[column.id];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(searchText.toLowerCase());
          } else if (value !== null && value !== undefined) {
            return String(value).toLowerCase().includes(searchText.toLowerCase());
          }
          return false;
        })
      );
    }
    
    // Sıralama yap
    return sortData(filtered, orderBy as keyof typeof filtered[0], order);
  }, [tableData, searchText, orderBy, order, columns]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchText(value);
    setPage(0); // Arama yapıldığında ilk sayfaya dön
  };
  
  // Seçim işlemleri
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = filteredData.map(row => row);
      setSelectedRows(newSelected);
      if (onSelectionChange) {
        onSelectionChange(newSelected);
      }
      return;
    }
    setSelectedRows([]);
    if (onSelectionChange) {
      onSelectionChange([]);
    }
  };
  
  const handleRowSelect = (event: React.MouseEvent<unknown>, row: any) => {
    const selectedIndex = selectedRows.findIndex(item => item[idField] === row[idField]);
    let newSelected: any[] = [];
    
    if (selectedIndex === -1) {
      newSelected = [...selectedRows, row];
    } else {
      newSelected = selectedRows.filter(item => item[idField] !== row[idField]);
    }
    
    setSelectedRows(newSelected);
    if (onSelectionChange) {
      onSelectionChange(newSelected);
    }
  };
  
  const isSelected = (row: any) => selectedRows.findIndex(item => item[idField] === row[idField]) !== -1;

  const paginatedData = useMemo(() => {
    return paginateData(filteredData, page, rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {showToolbar && (
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            justifyContent: 'space-between',
            ...(selectedRows.length > 0 && {
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
            }),
          }}
        >
          {selectedRows.length > 0 ? (
            <Typography
              sx={{ flex: '1 1 100%' }}
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              {selectedRows.length} seçildi
            </Typography>
          ) : (
            <Typography
              sx={{ flex: '1 1 100%' }}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              {title}
            </Typography>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Ekle butonu kaldırıldı */}
          </Box>
        </Toolbar>
      )}
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedRows.length > 0 && selectedRows.length < filteredData.length}
                    checked={filteredData.length > 0 && selectedRows.length === filteredData.length}
                    onChange={handleSelectAllClick}
                    inputProps={{ 'aria-label': 'tüm satırları seç' }}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : 'asc'}
                    onClick={() => handleRequestSort(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              {(onEdit || onDelete) && <TableCell align="center">İşlemler</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (onEdit || onDelete ? 1 : 0) + (selectable ? 1 : 0)}>
                  <LinearProgress />
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0) + (selectable ? 1 : 0)}
                  align="center"
                >
                  Kayıt bulunamadı
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => {
                const isItemSelected = selectable && isSelected(row);
                
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row[idField] || Math.random()}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    selected={isItemSelected}
                    sx={{ cursor: (onRowClick || selectable) ? 'pointer' : 'default' }}
                  >
                    {selectable && (
                      <TableCell padding="checkbox" onClick={(event) => handleRowSelect(event, row)}>
                        <Checkbox checked={isItemSelected} />                        
                      </TableCell>
                    )}
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format ? column.format(value, row) : value}
                        </TableCell>
                      );
                    })}
                    {(onEdit || onDelete) && (
                      <TableCell sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                          {onEdit && (
                            <IconButton
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(row);
                              }}
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                          )}
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          {onDelete && (
                            <IconButton
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(row);
                              }}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Sayfa başına satır:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} / ${count !== -1 ? count : `${to}'den fazla`}`
          }
        />
      )}
    </Paper>
  );
};

export default DataTable; 