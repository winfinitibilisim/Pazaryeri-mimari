import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography, 
  Chip, 
  IconButton,
  Grid,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useExpenseReceipts, ExpenseReceipt } from '../../hooks/useExpenseReceipts';
import { 
  Add as AddIcon, 
  FileDownload as FileDownloadIcon, 
  PictureAsPdf as PictureAsPdfIcon, 
  Search as SearchIcon, 
  FilterList as FilterListIcon, 
  Visibility as VisibilityIcon 
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface Column {
  id: 'receiptNumber' | 'date' | 'description' | 'amount' | 'status' | 'actions';
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: number) => string;
}

const ExpenseReceiptList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { receipts: expenseReceipts = [] } = useExpenseReceipts();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [accordionExpanded, setAccordionExpanded] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const columns: readonly Column[] = [
    { id: 'receiptNumber', label: 'Fiş No', minWidth: 120 },
    { id: 'date', label: 'Tarih', minWidth: 120 },
    { id: 'description', label: 'Açıklama', minWidth: 250 },
    {
      id: 'amount',
      label: 'Tutar',
      minWidth: 120,
      align: 'right',
      format: (value: number) => `${value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}`,
    },
    { id: 'status', label: 'Durum', minWidth: 120, align: 'center' },
    { id: 'actions', label: 'İşlemler', minWidth: 80, align: 'center' },
  ];

  const filteredReceipts = useMemo(() => {
    return expenseReceipts.filter((receipt: ExpenseReceipt) => {
      const matchSearchTerm = 
        receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.description.toLowerCase().includes(searchTerm.toLowerCase());

      const receiptDate = new Date(receipt.date);
      const matchStartDate = startDate ? receiptDate >= startDate : true;
      const matchEndDate = endDate ? receiptDate <= endDate : true;

      return matchSearchTerm && matchStartDate && matchEndDate;
    });
  }, [expenseReceipts, searchTerm, startDate, endDate]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setStartDate(null);
    setEndDate(null);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredReceipts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Gider Fişleri');
    XLSX.writeFile(workbook, 'gider_fisleri.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = columns.filter(col => col.id !== 'actions').map(col => col.label);
    const tableRows: (string | number)[][] = [];

    filteredReceipts.forEach(receipt => {
      const receiptData = columns
        .filter(col => col.id !== 'actions')
        .map(col => {
          if (col.id === 'amount') {
            return col.format ? col.format(receipt[col.id] as number) : receipt[col.id];
          }
          if (col.id === 'status') {
            return receipt[col.id] as string;
          }
          // Sadece basit değerleri döndür
          const value = receipt[col.id as keyof ExpenseReceipt];
          if (typeof value === 'string' || typeof value === 'number') {
            return value;
          }
          return String(value); // Karmaşık tipleri string'e çevir
        });
      tableRows.push(receiptData as (string | number)[]);
    });

    (doc as any).autoTable(tableColumn, tableRows);
    doc.save('gider_fisleri.pdf');
  };

  const getStatusChip = (status: 'paid' | 'pending' | 'cancelled') => {
    switch (status) {
      case 'paid':
        return <Chip label="Ödendi" color="success" size="small" />;
      case 'pending':
        return <Chip label="Beklemede" color="warning" size="small" />;
      case 'cancelled':
        return <Chip label="İptal Edildi" color="error" size="small" />;
      default:
        return <Chip label="Bilinmiyor" color="default" size="small" />;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => setAddDialogOpen(true)}
            sx={{
              backgroundColor: '#25638f',
              '&:hover': { backgroundColor: '#1e4a6f' },
              borderRadius: 2
            }}
          >
            Gider Fişi Ekle
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<FileDownloadIcon />} 
            onClick={exportToExcel}
            sx={{
              borderColor: '#25638f',
              color: '#25638f',
              '&:hover': {
                borderColor: '#1e4a6f',
                backgroundColor: 'rgba(37, 99, 143, 0.04)'
              }
            }}
          >
            Excel'e Aktar
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<PictureAsPdfIcon />} 
            onClick={exportToPDF}
            sx={{
              borderColor: '#25638f',
              color: '#25638f',
              '&:hover': {
                borderColor: '#1e4a6f',
                backgroundColor: 'rgba(37, 99, 143, 0.04)'
              }
            }}
          >
            PDF'e Aktar
          </Button>
        </Box>

        {/* Filters */}
        <Accordion 
          expanded={accordionExpanded} 
          onChange={() => setAccordionExpanded(!accordionExpanded)}
          sx={{ 
            mb: 3,
            borderRadius: 2,
            '&:before': { display: 'none' },
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}
        >
          <AccordionSummary 
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: '#f8fafc',
              '&:hover': { backgroundColor: '#f1f5f9' }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FilterListIcon sx={{ color: '#25638f' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Filtreler
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Fiş no veya açıklama ile ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#25638f' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#f8fafc',
                      '&:hover': { backgroundColor: '#f1f5f9' },
                      '&.Mui-focused': { backgroundColor: 'white' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <DatePicker
                  label="Başlangıç Tarihi"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <DatePicker
                  label="Bitiş Tarihi"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Button 
                  variant="outlined" 
                  onClick={handleClearFilters}
                  fullWidth
                  sx={{
                    height: '56px',
                    borderColor: '#e2e8f0',
                    color: '#64748b',
                    '&:hover': {
                      borderColor: '#cbd5e1',
                      backgroundColor: '#f8fafc'
                    }
                  }}
                >
                  Temizle
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Table */}
        <TableContainer component={Paper} sx={{ 
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: 'none',
          '& .MuiTableCell-root': {
            border: 'none !important',
            outline: 'none !important'
          },
          '& .MuiTableRow-root': {
            border: 'none !important',
            outline: 'none !important'
          },
          '& .MuiTableHead-root': {
            border: 'none !important',
            outline: 'none !important'
          },
          '& .MuiTableBody-root': {
            border: 'none !important',
            outline: 'none !important'
          },
          '& *': {
            border: 'none !important',
            outline: 'none !important'
          }
        }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ 
                      minWidth: column.minWidth,
                      fontWeight: 700,
                      color: '#2d3748',
                      fontSize: '0.95rem',
                      padding: '16px',
                      position: column.id === 'receiptNumber' || column.id === 'actions' ? 'sticky' : 'static',
                      left: column.id === 'receiptNumber' ? 0 : 'auto',
                      right: column.id === 'actions' ? 0 : 'auto',
                      backgroundColor: '#f5f5f5',
                      zIndex: column.id === 'receiptNumber' || column.id === 'actions' ? 1 : 'auto'
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReceipts.map((receipt: ExpenseReceipt) => (
                <TableRow 
                  key={receipt.id}
                  sx={{ 
                    '&:hover': { backgroundColor: '#f8fafc' },
                    '&:nth-of-type(even)': { backgroundColor: '#fafbfc' }
                  }}
                >
                  {columns.map((column) => {
                    const value = receipt[column.id as keyof ExpenseReceipt];
                    return (
                      <TableCell key={column.id} align={column.align}>
                    {column.id === 'status' ? (
                      getStatusChip(value as 'paid' | 'pending' | 'cancelled')
                    ) : column.id === 'actions' ? (
                      <IconButton 
                        size="small" 
                        onClick={() => navigate(`/expense-receipts/${receipt.id}`)}
                        sx={{ color: '#25638f' }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    ) : column.format && typeof value === 'number' ? (
                      column.format(value)
                    ) : typeof value === 'string' || typeof value === 'number' ? (
                      value
                    ) : (
                      String(value)
                    )}
                  </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add Dialog */}
        <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #25638f 0%, #1e4a6f 100%)',
            color: 'white',
            fontWeight: 700
          }}>
            Yeni Gider Fişi Ekle
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Fiş No" variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Tarih"
                  value={null}
                  onChange={() => {}}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Açıklama" multiline rows={3} variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="Tutar" 
                  type="number"
                  variant="outlined"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">₺</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Durum</InputLabel>
                  <Select label="Durum" defaultValue="pending">
                    <MenuItem value="pending">Beklemede</MenuItem>
                    <MenuItem value="paid">Ödendi</MenuItem>
                    <MenuItem value="cancelled">İptal Edildi</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setAddDialogOpen(false)}
              sx={{ color: '#64748b' }}
            >
              İptal
            </Button>
            <Button 
              variant="contained"
              sx={{
                backgroundColor: '#25638f',
                '&:hover': { backgroundColor: '#1e4a6f' }
              }}
            >
              Kaydet
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default ExpenseReceiptList;
