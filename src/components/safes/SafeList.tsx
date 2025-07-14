import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSafes, Safe } from 'hooks/useSafes';
import { 
  Box, 
  Button, 
  Card, 
  CardHeader, 
  Collapse, 
  Grid, 
  IconButton, 
  InputAdornment, 
  Link, 
  MenuItem, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TablePagination, 
  TableRow, 
  TextField, 
  Toolbar, 
  Tooltip, 
  Typography 
} from '@mui/material';
import { 
  FaEye, 
  FaPen, 
  FaTrash, 
  FaFilter, 
  FaSearch, 
  FaPlus, 
  FaFileExcel, 
  FaFilePdf 
} from 'react-icons/fa';
import { styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Home, NavigateNext } from '@mui/icons-material';

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.action.hover,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.focus,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const SafeList: React.FC = () => {
  const { t } = useTranslation();
  const { safes, loading, error } = useSafes();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currencyFilter, setCurrencyFilter] = useState('all');

  const handleFilterToggle = () => {
    setFilterOpen(!filterOpen);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = useCallback(() => {
    return safes.filter((safe: Safe) => {
      const matchesSearch = safe.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' && safe.isActive) || (statusFilter === 'inactive' && !safe.isActive);
      const matchesCurrency = currencyFilter === 'all' || safe.currency === currencyFilter;
      return matchesSearch && matchesStatus && matchesCurrency;
    });
  }, [safes, searchTerm, statusFilter, currencyFilter]);

  const filteredSafes = handleFilterChange();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) return <p>{t('loading')}</p>;
  if (error) return <p>{t('errorLoadingData')}</p>;

  const currencies: string[] = ['all', ...Array.from(new Set(safes.map((s: Safe) => s.currency)))];

  return (
    <Box sx={{ p: 3 }}>
       <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link color="inherit" href="/" sx={{ display: 'flex', alignItems: 'center' }}>
          <Home sx={{ mr: 0.5 }} fontSize="inherit" />
          {t('dashboard')}
        </Link>
        <Typography color="text.primary">{t('safesAndBanks')}</Typography>
      </Breadcrumbs>

      <Card component={Paper} elevation={3}>
        <CardHeader
          title={t('safesAndBanks')}
          action={
            <Box>
              <Button variant="contained" color="primary" startIcon={<FaPlus />} sx={{ mr: 1 }}>
                {t('addSafe')}
              </Button>
              <Button variant="outlined" color="secondary" startIcon={<FaFileExcel />} sx={{ mr: 1 }}>
                {t('export_to_excel')}
              </Button>
              <Button variant="outlined" color="error" startIcon={<FaFilePdf />}>
                {t('export_to_pdf')}
              </Button>
            </Box>
          }
        />
        <Toolbar>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder={t('enterSearchTerm')}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaSearch />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<FaFilter />}
                onClick={handleFilterToggle}
              >
                {t('filters')}
              </Button>
            </Grid>
          </Grid>
        </Toolbar>

        <Collapse in={filterOpen} timeout="auto" unmountOnExit>
          <Box sx={{ p: 2, borderTop: '1px solid #ddd' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  label={t('status')}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">{t('all')}</MenuItem>
                  <MenuItem value="active">{t('active')}</MenuItem>
                  <MenuItem value="inactive">{t('inactive')}</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  label={t('currency')}
                  value={currencyFilter}
                  onChange={(e) => setCurrencyFilter(e.target.value)}
                >
                  {currencies.map(c => <MenuItem key={c} value={c}>{c === 'all' ? t('all') : c}</MenuItem>)}
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </Collapse>

        <TableContainer>
          <Table>
            <StyledTableHead>
              <TableRow>
                <TableCell>{t('safeName')}</TableCell>
                <TableCell>{t('safeType')}</TableCell>
                <TableCell>{t('currency')}</TableCell>
                <TableCell align="right">{t('balance')}</TableCell>
                <TableCell>{t('accountName')}</TableCell>
                <TableCell>{t('ibanNumber')}</TableCell>
                <TableCell>{t('status')}</TableCell>
                <TableCell align="center">{t('actions')}</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {filteredSafes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((safe: Safe) => (
                <StyledTableRow key={safe.id}>
                  <TableCell>{safe.name}</TableCell>
                  <TableCell>{t(`safeTypes.${safe.type}`)}</TableCell>
                  <TableCell>{safe.currency}</TableCell>
                  <TableCell align="right">{safe.balance.toLocaleString()}</TableCell>
                  <TableCell>{safe.accountName || t('notSpecified')}</TableCell>
                  <TableCell>{safe.iban || t('notSpecified')}</TableCell>
                  <TableCell>
                     <Box
                          sx={{
                            backgroundColor: safe.isActive ? 'success.light' : 'error.light',
                            color: safe.isActive ? 'success.dark' : 'error.dark',
                            borderRadius: '12px',
                            padding: '4px 8px',
                            display: 'inline-block',
                            fontWeight: 'bold',
                            fontSize: '0.8rem'
                          }}
                        >
                          {safe.isActive ? t('active') : t('inactive')}
                        </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title={t('view')}>
                      <IconButton size="small" color="info"><FaEye /></IconButton>
                    </Tooltip>
                    <Tooltip title={t('edit')}>
                      <IconButton size="small" color="primary"><FaPen /></IconButton>
                    </Tooltip>
                    <Tooltip title={t('delete')}>
                      <IconButton size="small" color="error"><FaTrash /></IconButton>
                    </Tooltip>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredSafes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={t('rowsPerPage')}
        />
      </Card>
    </Box>
  );
};

export default SafeList;
