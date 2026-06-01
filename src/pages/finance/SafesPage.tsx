import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  Card,
  CardContent
} from '@mui/material';
import { 
  Add as AddIcon, 
  AccountBalance as AccountBalanceIcon, 
  FilterList as FilterListIcon, 
  Search as SearchIcon,
  Wallet as WalletIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useSafes } from '../../hooks/useSafes';
import { Safe } from '../../types/Safe';
import SafesList from './safes/SafesList';
import AddSafeModal from './safes/AddSafeModal';
import AddBankModal from './safes/AddBankModal';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import PageHeader from '../../components/layout/PageHeader';
import FilterPanel from '../../components/common/FilterPanel';

const statusOptions = ['active', 'inactive'];

const SafesPage: React.FC = () => {
  const { t } = useTranslation();
  const { safes, loading, error, addSafe, updateSafe, deleteSafe } = useSafes();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [safeToDelete, setSafeToDelete] = useState<Safe | null>(null);
  const [editingSafe, setEditingSafe] = useState<Safe | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [currencyFilters, setCurrencyFilters] = useState<string[]>([]);

  const uniqueCurrencies = useMemo(() => Array.from(new Set(safes.map(safe => safe.currency))), [safes]);

  const handleAddSafe = async (newSafeData: Partial<Safe>) => {
    await addSafe(newSafeData);
    setIsModalOpen(false);
  };

  const handleAddBank = async (newBankData: Partial<Safe>) => {
    await addSafe(newBankData);
    setIsBankModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const safe = safes.find(s => s.id === id);
    if (safe) {
      setSafeToDelete(safe);
      setDeleteConfirmOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (safeToDelete) {
      await deleteSafe(safeToDelete.id);
      setDeleteConfirmOpen(false);
      setSafeToDelete(null);
    }
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setSafeToDelete(null);
  };

  const handleUpdateSafe = async (updatedSafe: Partial<Safe>) => {
    if (!updatedSafe.id) return;
    await updateSafe(updatedSafe.id, updatedSafe);
    setEditingSafe(null);
    setIsModalOpen(false);
    setIsBankModalOpen(false);
  };

  const handleEdit = (safe: Safe) => {
    setEditingSafe(safe);
    if (safe.type === 'bank') {
      setIsBankModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (event: SelectChangeEvent<string[]>) => {
    const { target: { value } } = event;
    setter(typeof value === 'string' ? value.split(',') : value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilters([]);
    setCurrencyFilters([]);
  };

  const filteredSafes = useMemo(() => {
    return safes.filter(safe => {
      const searchMatch = searchTerm === '' ||
        safe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        safe.id.toLowerCase().includes(searchTerm.toLowerCase());

      const statusMatch = statusFilters.length === 0 ||
        statusFilters.some(filter => (filter === 'active' && safe.isActive) || (filter === 'inactive' && !safe.isActive));

      const currencyMatch = currencyFilters.length === 0 || currencyFilters.includes(safe.currency);

      return searchMatch && statusMatch && currencyMatch;
    });
  }, [safes, searchTerm, statusFilters, currencyFilters]);

  // Calculate statistics
  const totalBalance = useMemo(() => {
    return safes.reduce((sum, safe) => {
      if (safe.currency === 'TRY') {
        return sum + safe.balance;
      }
      // Simple conversion for demo (in real app, use actual exchange rates)
      const rate = safe.currency === 'USD' ? 30 : safe.currency === 'EUR' ? 33 : 1;
      return sum + (safe.balance * rate);
    }, 0);
  }, [safes]);

  const activeSafesCount = useMemo(() => safes.filter(safe => safe.isActive).length, [safes]);
  const bankAccountsCount = useMemo(() => safes.filter(safe => safe.type === 'bank').length, [safes]);

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <PageHeader
        title="Kasalar"
        actionButton={
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsModalOpen(true)}
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
              Yeni Kasa
            </Button>
            <Button
              variant="outlined"
              startIcon={<AccountBalanceIcon />}
              onClick={() => setIsBankModalOpen(true)}
              sx={{
                bgcolor: '#fff',
                color: '#3949ab',
                borderColor: '#fff',
                '&:hover': { bgcolor: '#f5f5f5', borderColor: '#f5f5f5' },
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: 'none'
              }}
            >
              Yeni Banka
            </Button>
          </Box>
        }
      />

      <Box sx={{ px: 4, pb: 4 }}>
        {/* Quick Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)'
            }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <WalletIcon sx={{ fontSize: 48, color: '#25638f', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#25638f', mb: 1 }}>
                  ₺{totalBalance.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Toplam Bakiye
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)'
            }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <TrendingUpIcon sx={{ fontSize: 48, color: '#28a745', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#28a745', mb: 1 }}>
                  {activeSafesCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Aktif Kasa
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)'
            }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <AccountBalanceIcon sx={{ fontSize: 48, color: '#fd7e14', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#fd7e14', mb: 1 }}>
                  {bankAccountsCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Banka Hesabı
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <FilterPanel
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          searchPlaceholder="Kasa adı veya kodu ile ara..."
          fields={[
            {
              id: 'status',
              label: 'Durum',
              type: 'select',
              options: statusOptions.map(s => ({ value: s, label: s === 'active' ? 'Aktif' : 'Pasif' }))
            },
            {
              id: 'currency',
              label: 'Para Birimi',
              type: 'select',
              options: uniqueCurrencies.map(c => ({ value: c, label: c }))
            }
          ]}
          onAdvancedSearch={(values: any) => {
            if (values.status) setStatusFilters([values.status]);
            if (values.currency) setCurrencyFilters([values.currency]);
          }}
        />

        {/* Main Content */}
        <Paper sx={{ 
          borderRadius: 3, 
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          overflow: 'hidden'
        }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress sx={{ color: '#25638f' }} />
            </Box>
          ) : error ? (
            <Typography color="error" align="center" sx={{ p: 4 }}>{error}</Typography>
          ) : (
            <SafesList safes={filteredSafes} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </Paper>
      </Box>

      <AddSafeModal
        open={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingSafe(null); }}
        onSave={editingSafe ? handleUpdateSafe : handleAddSafe}
        initialData={editingSafe}
      />
      <AddBankModal
        open={isBankModalOpen}
        onClose={() => { setIsBankModalOpen(false); setEditingSafe(null); }}
        onSave={editingSafe ? handleUpdateSafe : handleAddBank}
        initialData={editingSafe}
      />
      <ConfirmationDialog
        open={isDeleteConfirmOpen}
        onClose={handleCloseDeleteConfirm}
        onConfirm={handleConfirmDelete}
        itemName={safeToDelete?.name}
      />
    </Box>
  );
};

export default SafesPage;
