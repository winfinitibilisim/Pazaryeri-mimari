import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  FilterList as FilterListIcon,
  GridOn as ExcelIcon,
  PictureAsPdf as PdfIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import tr from 'date-fns/locale/tr';

// Data types
interface OverdueReceivable {
  id: string;
  invoiceNumber: string;
  customerName: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  daysOverdue: number;
  status: 'overdue';
}

// Mock data
const mockOverdueReceivables: OverdueReceivable[] = [
  {
    id: '2',
    invoiceNumber: 'INV-2024-095',
    customerName: 'Güneş A.Ş.',
    invoiceDate: '2024-05-20',
    dueDate: '2024-06-20',
    amount: 8200.5,
    daysOverdue: 7,
    status: 'overdue',
  },
  {
    id: '5',
    invoiceNumber: 'INV-2024-088',
    customerName: 'Mega Market',
    invoiceDate: '2024-04-15',
    dueDate: '2024-05-15',
    amount: 15300.0,
    daysOverdue: 43,
    status: 'overdue',
  },
  {
    id: '6',
    invoiceNumber: 'INV-2024-091',
    customerName: 'İnşaat Projeleri Ltd.',
    invoiceDate: '2024-05-01',
    dueDate: '2024-06-01',
    amount: 45000.0,
    daysOverdue: 26,
    status: 'overdue',
  },
];

const OverdueReceivablesPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [selectedReceivable, setSelectedReceivable] = useState<OverdueReceivable | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);

  const handleOpenModal = (receivable: OverdueReceivable) => {
    setSelectedReceivable(receivable);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReceivable(null);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setDateRange({ start: null, end: null });
  };

  const filteredReceivables = useMemo(() => {
    return mockOverdueReceivables.filter((receivable) => {
      const searchMatch =
        !searchQuery ||
        receivable.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        receivable.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const dueDate = new Date(receivable.dueDate);
      const { start, end } = dateRange;
      let dateMatch = true;
      if (start && end) {
        dateMatch = dueDate >= start && dueDate <= end;
      } else if (start) {
        dateMatch = dueDate >= start;
      } else if (end) {
        dateMatch = dueDate <= end;
      }

      return searchMatch && dateMatch;
    });
  }, [searchQuery, dateRange]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
      <Paper sx={{ p: 3, m: 2, borderRadius: 2, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" gutterBottom component="div">
            {t('overdueReceivablesPage.title')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" startIcon={<ExcelIcon />}>
              {t('overdueReceivablesPage.exportExcel')}
            </Button>
            <Button variant="outlined" startIcon={<PdfIcon />}>
              {t('overdueReceivablesPage.exportPdf')}
            </Button>
          </Box>
        </Box>

        <Accordion expanded={filtersOpen} onChange={() => setFiltersOpen(!filtersOpen)} sx={{ mb: 2, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
          <AccordionSummary expandIcon={<FilterListIcon />} aria-controls="filters-content" id="filters-header">
            <Typography>{t('filters', 'Filtreler')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2} sx={{ flexDirection: 'column' }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder={t('overdueReceivablesPage.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  {t('overdueReceivablesPage.dueDateRange')}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label={t('overdueReceivablesPage.startDate')}
                      value={dateRange.start}
                      onChange={(newValue) => setDateRange({ ...dateRange, start: newValue })}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label={t('overdueReceivablesPage.endDate')}
                      value={dateRange.end}
                      onChange={(newValue) => setDateRange({ ...dateRange, end: newValue })}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={clearFilters}>
                  {t('overdueReceivablesPage.clearFilters')}
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
          <Table sx={{ minWidth: 650 }} aria-label="overdue receivables table">
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>{t('overdueReceivablesPage.invoiceNo')}</TableCell>
                <TableCell>{t('overdueReceivablesPage.customerName')}</TableCell>
                <TableCell>{t('overdueReceivablesPage.dueDate')}</TableCell>
                <TableCell>{t('overdueReceivablesPage.daysOverdue')}</TableCell>
                <TableCell>{t('overdueReceivablesPage.amount')}</TableCell>
                <TableCell>{t('overdueReceivablesPage.status')}</TableCell>
                <TableCell align="right">{t('overdueReceivablesPage.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReceivables.map((receivable) => (
                <TableRow key={receivable.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{receivable.invoiceNumber}</TableCell>
                  <TableCell>{receivable.customerName}</TableCell>
                  <TableCell>{receivable.dueDate}</TableCell>
                  <TableCell align="center">
                    <Chip label={`${receivable.daysOverdue} gün`} color="warning" size="small" />
                  </TableCell>
                  <TableCell>{`₺${receivable.amount.toFixed(2)}`}</TableCell>
                  <TableCell>
                    <Chip label={t(`customerReceivablesPage.${receivable.status}`)} color="error" size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={t('detailsTitle', 'Detayları Görüntüle')}>
                      <IconButton onClick={() => handleOpenModal(receivable)} size="small">
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {selectedReceivable && (
          <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
            <DialogTitle fontWeight="bold">{t('overdueReceivablesPage.detailsTitle')}</DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2} sx={{ pt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Typography><strong>{t('overdueReceivablesPage.customerName')}:</strong> {selectedReceivable.customerName}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography><strong>{t('overdueReceivablesPage.invoiceNo')}:</strong> {selectedReceivable.invoiceNumber}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography><strong>{t('customerReceivablesPage.invoiceDate')}:</strong> {selectedReceivable.invoiceDate}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography><strong>{t('overdueReceivablesPage.dueDate')}:</strong> {selectedReceivable.dueDate}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography><strong>{t('overdueReceivablesPage.amount')}:</strong> {selectedReceivable.amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography><strong>{t('overdueReceivablesPage.daysOverdue')}:</strong> {selectedReceivable.daysOverdue}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography component="div"><strong>{t('overdueReceivablesPage.status')}:</strong> <Chip label={t(`customerReceivablesPage.${selectedReceivable.status}`)} color="error" size="small" /></Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal}>{t('overdueReceivablesPage.close')}</Button>
            </DialogActions>
          </Dialog>
        )}
      </Paper>
    </LocalizationProvider>
  );
};

export default OverdueReceivablesPage;
