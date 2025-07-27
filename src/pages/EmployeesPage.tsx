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
    <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <AddEmployeeModal open={isModalOpen} onClose={handleCloseModal} />

      {/* Header Section */}
      <Box sx={{ 
        mb: 4, 
        background: 'linear-gradient(135deg, #25638f 0%, #1e4a6f 100%)',
        borderRadius: 3,
        p: 4,
        color: 'white',
        boxShadow: '0 10px 30px rgba(37, 99, 143, 0.3)'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
              {t('employees.title', 'Çalışanlar')}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Ekip üyelerinizi yönetin ve takip edin
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={handleOpenModal}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              fontWeight: 'bold',
              px: 3,
              py: 1.5,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            {t('common.addNew', 'Yeni Ekle')}
          </Button>
        </Box>
      </Box>

      {/* Filters Section */}
      <Paper sx={{ 
        mb: 3, 
        borderRadius: 3, 
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(0, 0, 0, 0.05)'
      }}>
        <Accordion 
          expanded={filtersOpen} 
          onChange={() => setFiltersOpen(!filtersOpen)}
          sx={{ 
            boxShadow: 'none',
            '&:before': { display: 'none' },
            '& .MuiAccordionSummary-root': {
              backgroundColor: '#fafbfc',
              borderBottom: filtersOpen ? '1px solid rgba(0, 0, 0, 0.08)' : 'none',
              minHeight: 64,
              '&:hover': {
                backgroundColor: '#f1f3f4'
              }
            }
          }}
        >
          <AccordionSummary 
            expandIcon={<FilterListIcon sx={{ color: '#25638f' }} />}
            sx={{ '& .MuiAccordionSummary-content': { alignItems: 'center' } }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FilterListIcon sx={{ color: '#25638f' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748' }}>
                {t('common.filters', 'Filtreler')}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 3, backgroundColor: 'white' }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder={t('employees.searchPlaceholder', 'Çalışan ara...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#f8fafc',
                      '&:hover': {
                        backgroundColor: '#f1f5f9'
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white'
                      }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#25638f' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>{t('employees.departmentHeader', 'Departman')}</InputLabel>
                  <Select
                    value={departmentFilter}
                    label={t('employees.departmentHeader', 'Departman')}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: '#f8fafc',
                      '&:hover': {
                        backgroundColor: '#f1f5f9'
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white'
                      }
                    }}
                  >
                    {uniqueDepartments.map(dep => (
                      <MenuItem key={dep} value={dep}>
                        {dep === 'all' ? t('common.all', 'Tümü') : dep}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'center' }}>
                <Button 
                  variant="outlined" 
                  onClick={handleClearFilters}
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    borderColor: '#e2e8f0',
                    color: '#64748b',
                    '&:hover': {
                      borderColor: '#cbd5e1',
                      backgroundColor: '#f8fafc'
                    }
                  }}
                >
                  {t('common.clearFilters', 'Temizle')}
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Paper>

      {/* Employees Table */}
      <Paper sx={{ 
        borderRadius: 3, 
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(0, 0, 0, 0.05)'
      }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="employees table">
            <TableHead>
              <TableRow sx={{ 
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                '& .MuiTableCell-head': {
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  color: '#334155',
                  borderBottom: '2px solid #e2e8f0',
                  py: 2
                }
              }}>
                <TableCell sx={{ pl: 3 }}></TableCell>
                <TableCell>{t('employees.employeeName', 'Çalışan Adı')}</TableCell>
                <TableCell>{t('employees.titleHeader', 'Pozisyon')}</TableCell>
                <TableCell>{t('employees.departmentHeader', 'Departman')}</TableCell>
                <TableCell>{t('employees.emailHeader', 'E-posta')}</TableCell>
                <TableCell align="right" sx={{ pr: 3 }}>{t('common.actions', 'İşlemler')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.map((employee, index) => (
                <TableRow 
                  key={employee.id} 
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: '#f8fafc',
                      transform: 'scale(1.001)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                    },
                    '&:last-child td': { borderBottom: 0 },
                    backgroundColor: index % 2 === 0 ? 'white' : '#fafbfc',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleViewDetails(employee.id)}
                >
                  <TableCell sx={{ pl: 3 }}>
                    <Avatar 
                      src={employee.avatarUrl} 
                      sx={{ 
                        width: 48, 
                        height: 48,
                        background: 'linear-gradient(135deg, #25638f 0%, #1e4a6f 100%)',
                        fontSize: '1.2rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b', mb: 0.5 }}>
                        {employee.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ 
                      color: '#64748b',
                      backgroundColor: '#f1f5f9',
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      display: 'inline-block',
                      fontSize: '0.8rem',
                      fontWeight: 500
                    }}>
                      {employee.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      backgroundColor: 'rgba(37, 99, 143, 0.1)',
                      color: '#25638f',
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}>
                      {employee.department}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      {employee.email}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ pr: 3 }}>
                    <IconButton 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(employee.id);
                      }} 
                      size="small"
                      sx={{
                        backgroundColor: '#25638f',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#1e4a6f',
                          transform: 'scale(1.1)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default EmployeesPage;
