import React from 'react';
import {
  Collapse,
  Paper,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Button,
  SelectChangeEvent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import trLocale from 'date-fns/locale/tr';
import { useTranslation } from 'react-i18next';

export interface PurchaseInvoiceFilter {
  invoiceNumber: string;
  supplierName: string;
  startDate: Date | null;
  endDate: Date | null;
  minAmount: number | string;
  maxAmount: number | string;
  status: string;
}

interface PurchaseInvoiceFilterPanelProps {
  open: boolean;
  filters: PurchaseInvoiceFilter;
  onFilterChange: (event: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onDateChange: (date: Date | null, fieldName: keyof Pick<PurchaseInvoiceFilter, 'startDate' | 'endDate'>) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

const PurchaseInvoiceFilterPanel: React.FC<PurchaseInvoiceFilterPanelProps> = ({
  open,
  filters,
  onFilterChange,
  onDateChange,
  onApplyFilters,
  onClearFilters,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <Paper sx={{ p: 2, mb: 2, mt: 1, borderRadius: 1, boxShadow: 1 }}>
        <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 500 }}>
          {t('filters')}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label={t('invoiceNumber')}
              name="invoiceNumber"
              value={filters.invoiceNumber}
              onChange={onFilterChange}
              size="small"
              variant="outlined"
              sx={{ mb: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label={t('supplierName')}
              name="supplierName"
              value={filters.supplierName}
              onChange={onFilterChange}
              size="small"
              variant="outlined"
              sx={{ mb: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={trLocale}>
              <DatePicker
                label={t('startDate')}
                value={filters.startDate}
                onChange={(date) => onDateChange(date as Date | null, 'startDate')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    sx={{ mb: 1 }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={trLocale}>
              <DatePicker
                label={t('endDate')}
                value={filters.endDate}
                onChange={(date) => onDateChange(date as Date | null, 'endDate')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    sx={{ mb: 1 }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small" variant="outlined" sx={{ mb: 1 }}>
              <InputLabel id="status-select-label">{t('status')}</InputLabel>
              <Select
                labelId="status-select-label"
                name="status"
                value={filters.status}
                onChange={onFilterChange}
                label={t('status')}
              >
                <MenuItem value="">{t('all')}</MenuItem>
                <MenuItem value="pending">{t('pending')}</MenuItem>
                <MenuItem value="paid">{t('paid')}</MenuItem>
                <MenuItem value="cancelled">{t('cancelled')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label={t('minAmount')}
              name="minAmount"
              type="number"
              value={filters.minAmount}
              onChange={onFilterChange}
              size="small"
              variant="outlined"
              InputProps={{
                startAdornment: <Box component="span" sx={{ mr: 0.5 }}>₺</Box>,
              }}
              sx={{ mb: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label={t('maxAmount')}
              name="maxAmount"
              type="number"
              value={filters.maxAmount}
              onChange={onFilterChange}
              size="small"
              variant="outlined"
              InputProps={{
                startAdornment: <Box component="span" sx={{ mr: 0.5 }}>₺</Box>,
              }}
              sx={{ mb: 1 }}
            />
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <Button 
              variant="outlined" 
              onClick={onClearFilters}
              sx={{ 
                textTransform: 'none',
                borderColor: theme.palette.grey[300],
                color: theme.palette.text.secondary,
                '&:hover': {
                  borderColor: theme.palette.grey[400],
                  backgroundColor: theme.palette.grey[50],
                }
              }}
            >
              {t('clear')}
            </Button>
            <Button 
              variant="contained" 
              onClick={onApplyFilters}
              sx={{ 
                textTransform: 'none',
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                }
              }}
            >
              {t('apply')}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Collapse>
  );
};

export default PurchaseInvoiceFilterPanel;
