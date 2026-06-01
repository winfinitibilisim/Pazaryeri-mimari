import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
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
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import tr from 'date-fns/locale/tr';
import AddReceivableDialog, { NewReceivable } from '../../components/receivables/AddReceivableDialog';
import PageHeader from '../../components/layout/PageHeader';
import FilterPanel from '../../components/common/FilterPanel';

// Veri tipleri
export type StatusType = 'paid' | 'not_due' | 'overdue';

interface CustomerReceivable {
  id: string;
  invoiceNumber: string;
  customerName: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  currency: string;
  description: string;
  status: StatusType;
}

// Örnek veriler
const mockReceivables: CustomerReceivable[] = [
  {
    id: '1',
    invoiceNumber: 'FAT-2024-001',
    customerName: 'Ahmet Yılmaz',
    invoiceDate: '2024-06-10',
    dueDate: '2024-07-10',
    amount: 12500.0,
    currency: 'TRY',
    description: 'Yazılım Geliştirme Hizmeti',
    status: 'not_due',
  },
  {
    id: '2',
    invoiceNumber: 'FAT-2024-002',
    customerName: 'Ayşe Kaya',
    invoiceDate: '2024-05-20',
    dueDate: '2024-06-20',
    amount: 8200.5,
    currency: 'USD',
    description: 'Danışmanlık Hizmeti',
    status: 'overdue',
  },
  {
    id: '3',
    invoiceNumber: 'FAT-2024-003',
    customerName: 'Mehmet Demir',
    invoiceDate: '2024-06-01',
    dueDate: '2024-07-01',
    amount: 25000.0,
    currency: 'EUR',
    description: 'Tasarım Projesi',
    status: 'paid',
  },
  {
    id: '4',
    invoiceNumber: 'FAT-2024-004',
    customerName: 'Zeynep Çelik',
    invoiceDate: '2024-06-15',
    dueDate: '2024-07-15',
    amount: 7300.0,
    currency: 'TRY',
    description: 'Aylık Bakım Anlaşması',
    status: 'not_due',
  },
];

const getStatusChipColor = (status: StatusType) => {
  switch (status) {
    case 'paid':
      return 'success';
    case 'not_due':
      return 'info';
    case 'overdue':
      return 'error';
    default:
      return 'default';
  }
};

const statusOptions: StatusType[] = ['paid', 'not_due', 'overdue'];

const CustomerReceivablesPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string[]>(['overdue']);
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [receivables, setReceivables] = useState<CustomerReceivable[]>(mockReceivables);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleStatusChange = (event: SelectChangeEvent<string[]>) => {
    const { target: { value } } = event;
    setStatusFilter(typeof value === 'string' ? value.split(',') : value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter([]);
    setDateRange({ start: null, end: null });
  };

  const filteredReceivables = useMemo(() => {
    return receivables.filter((receivable) => {
      const searchMatch =
        receivable.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        receivable.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const statusMatch = statusFilter.length === 0 || statusFilter.includes(receivable.status);

      const dateMatch =
        (!dateRange.start || new Date(receivable.invoiceDate) >= dateRange.start) &&
        (!dateRange.end || new Date(receivable.invoiceDate) <= dateRange.end);

      return searchMatch && statusMatch && dateMatch;
    });
  }, [receivables, searchQuery, statusFilter, dateRange]);

  const handleSave = (data: NewReceivable) => {
    const newItem: CustomerReceivable = {
      id: `${receivables.length + 1}`,
      invoiceNumber: data.invoiceNumber,
      customerName: data.customerName,
      invoiceDate: data.invoiceDate ? data.invoiceDate.toISOString().split('T')[0] : '',
      dueDate: data.dueDate ? data.dueDate.toISOString().split('T')[0] : '',
      amount: data.amount,
      currency: 'TRY',
      description: '', // Default description
      status: 'not_due', // Default status
    };
    setReceivables([newItem, ...receivables]);
    setAddDialogOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
      <Paper sx={{ p: 3, m: 2, borderRadius: 2, boxShadow: 3 }}>
        <PageHeader
          title={t('customerReceivablesPage.title')}
          actionButton={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddDialogOpen(true)}
              sx={{
                bgcolor: '#fff',
                color: '#3949ab',
                '&:hover': { bgcolor: '#f5f5f5' },
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: 'none'
              }}
            >
              {t('customerReceivablesPage.addReceivable')}
            </Button>
          }
        />

        <FilterPanel
          searchTerm={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          searchPlaceholder={t('customerReceivablesPage.searchPlaceholder')}
          fields={[
            {
              id: 'status',
              label: t('customerReceivablesPage.status'),
              type: 'select',
              options: statusOptions.map((status) => ({
                value: status,
                label: t(`customerReceivablesPage.${status}`)
              }))
            },
            {
              id: 'startDate',
              label: t('customerReceivablesPage.startDate'),
              type: 'date'
            },
            {
              id: 'endDate',
              label: t('customerReceivablesPage.endDate'),
              type: 'date'
            }
          ]}
          onAdvancedSearch={(values: any) => {
            if (values.status) setStatusFilter([values.status]);
            if (values.startDate) setDateRange((prev) => ({ ...prev, start: values.startDate }));
            if (values.endDate) setDateRange((prev) => ({ ...prev, end: values.endDate }));
          }}
        />

        <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
          <Table sx={{ minWidth: 650 }} aria-label="customer receivables table">
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>{t('customerReceivablesPage.invoiceNo')}</TableCell>
                <TableCell>{t('customerReceivablesPage.customerName')}</TableCell>
                <TableCell>{t('customerReceivablesPage.invoiceDate')}</TableCell>
                <TableCell>{t('customerReceivablesPage.dueDate')}</TableCell>
                <TableCell>{t('customerReceivablesPage.amount')}</TableCell>
                <TableCell>{t('customerReceivablesPage.status')}</TableCell>
                <TableCell align="right">{t('customerReceivablesPage.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReceivables.map((receivable) => (
                <TableRow key={receivable.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{receivable.invoiceNumber}</TableCell>
                  <TableCell>{receivable.customerName}</TableCell>
                  <TableCell>{receivable.invoiceDate}</TableCell>
                  <TableCell>{receivable.dueDate}</TableCell>
                  <TableCell>{`₺${receivable.amount.toFixed(2)}`}</TableCell>
                  <TableCell>
                    <Chip label={t(`customerReceivablesPage.${receivable.status}`)} color={getStatusChipColor(receivable.status)} size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Görüntüle">
                      <IconButton size="small">
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Düzenle">
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Sil">
                      <IconButton size="small">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <AddReceivableDialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} onSave={handleSave} />
      </Paper>
    </LocalizationProvider>
  );
};

export default CustomerReceivablesPage;
