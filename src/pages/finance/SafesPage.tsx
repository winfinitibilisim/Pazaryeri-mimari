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
} from '@mui/material';
import { Add as AddIcon, AccountBalance as AccountBalanceIcon, FilterList as FilterListIcon, Search as SearchIcon } from '@mui/icons-material';
import { useSafes } from '../../hooks/useSafes';
import { Safe } from '../../types/Safe';
import SafesList from './safes/SafesList';
import AddSafeModal from './safes/AddSafeModal';
import AddBankModal from './safes/AddBankModal';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';

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

  return (
    <Paper sx={{ p: 3, m: 2, borderRadius: 2, boxShadow: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" gutterBottom>{t('safes.title')}</Typography>
        <ButtonGroup variant="contained">
          <Button startIcon={<AddIcon />} onClick={() => setIsModalOpen(true)}>{t('safes.addNewSafe')}</Button>
          <Button startIcon={<AccountBalanceIcon />} onClick={() => setIsBankModalOpen(true)}>{t('safes.addNewBank')}</Button>
        </ButtonGroup>
      </Box>

      <Accordion expanded={filtersOpen} onChange={() => setFiltersOpen(!filtersOpen)} sx={{ mb: 2, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
        <AccordionSummary expandIcon={<FilterListIcon />} aria-controls="filters-content" id="filters-header">
          <Typography>{t('common.filters')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2} sx={{ flexDirection: 'column' }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder={t('safes.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>{t('common.status')}</InputLabel>
                <Select
                  multiple
                  value={statusFilters}
                  onChange={handleFilterChange(setStatusFilters)}
                  input={<OutlinedInput label={t('common.status')} />}
                  renderValue={(selected) => selected.map(s => t(`common.${s}`)).join(', ')}
                >
                  {statusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      <ListItemText primary={t(`common.${status}`)} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>{t('safes.currency')}</InputLabel>
                <Select
                  multiple
                  value={currencyFilters}
                  onChange={handleFilterChange(setCurrencyFilters)}
                  input={<OutlinedInput label={t('safes.currency')} />}
                  renderValue={(selected) => selected.join(', ')}
                >
                  {uniqueCurrencies.map((currency) => (
                    <MenuItem key={currency} value={currency}>
                      <ListItemText primary={currency} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={clearFilters}>{t('common.clearFilters')}</Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
      ) : error ? (
        <Typography color="error" align="center">{error}</Typography>
      ) : (
        <SafesList safes={filteredSafes} onEdit={handleEdit} onDelete={handleDelete} />
      )}

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
    </Paper>
  );
};

export default SafesPage;
