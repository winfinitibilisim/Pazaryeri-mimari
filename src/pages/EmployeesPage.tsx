import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Avatar, 
  Button, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  TextField, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  IconButton,
  InputAdornment
} from '@mui/material';
import { Add as AddIcon, Visibility as VisibilityIcon, FilterList as FilterListIcon, Search as SearchIcon } from '@mui/icons-material';
import AddEmployeeModal from '../components/modals/AddEmployeeModal';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Employee {
  id: number;
  name: string;
  title: string;
  department: string;
  email: string;
  avatarUrl?: string;
}

const mockEmployees: Employee[] = [
  { id: 1, name: 'Ali Veli', title: 'Yazılım Geliştirici', department: 'Teknoloji', email: 'ali.veli@example.com' },
  { id: 2, name: 'Ayşe Yılmaz', title: 'Proje Yöneticisi', department: 'Teknoloji', email: 'ayse.yilmaz@example.com' },
  { id: 3, name: 'Fatma Kaya', title: 'İK Uzmanı', department: 'İnsan Kaynakları', email: 'fatma.kaya@example.com' },
  { id: 4, name: 'Mehmet Demir', title: 'Pazarlama Uzmanı', department: 'Pazarlama', email: 'mehmet.demir@example.com' },
];

const EmployeesPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [isModalOpen, setModalOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const navigate = useNavigate();

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleViewDetails = (id: number) => {
    navigate(`/employees/${id}`);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setDepartmentFilter('all');
  };

  const uniqueDepartments = useMemo(() => 
    ['all', ...Array.from(new Set(mockEmployees.map(e => e.department)))]
  , []);

  const filteredEmployees = useMemo(() => {
    return mockEmployees.filter(employee => {
      const nameMatch = employee.name.toLowerCase().includes(searchQuery.toLowerCase());
      const departmentMatch = departmentFilter === 'all' || employee.department === departmentFilter;
      return nameMatch && departmentMatch;
    });
  }, [searchQuery, departmentFilter]);

  return (
    <Paper sx={{ p: 3, m: 2, borderRadius: 2, boxShadow: 3 }}>
      <AddEmployeeModal open={isModalOpen} onClose={handleCloseModal} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          {t('employees.title')}
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal}>
          {t('common.addNew')}
        </Button>
      </Box>

      <Accordion expanded={filtersOpen} onChange={() => setFiltersOpen(!filtersOpen)} sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<FilterListIcon />}>
          <Typography>{t('common.filters')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3} direction="column">
            <Grid item xs={12}>
              <TextField
                fullWidth
                placeholder={t('employees.searchPlaceholder')}
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
              <FormControl fullWidth>
                <InputLabel>{t('employees.departmentHeader')}</InputLabel>
                <Select
                  value={departmentFilter}
                  label={t('employees.departmentHeader')}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  {uniqueDepartments.map(dep => (
                    <MenuItem key={dep} value={dep}>
                      {dep === 'all' ? t('common.all') : dep}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={handleClearFilters}>
                {t('common.clearFilters')}
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>{t('employees.employeeName')}</TableCell>
              <TableCell>{t('employees.titleHeader')}</TableCell>
              <TableCell>{t('employees.departmentHeader')}</TableCell>
              <TableCell>{t('employees.emailHeader')}</TableCell>
              <TableCell align="right">{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Avatar src={employee.avatarUrl} />
                </TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.title}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleViewDetails(employee.id)} size="small">
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default EmployeesPage;
