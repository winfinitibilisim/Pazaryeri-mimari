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
import PageHeader from '../components/layout/PageHeader';
import FilterPanel from '../components/common/FilterPanel';
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

      <Box sx={{ width: '100%', mb: 4 }}>
        <PageHeader
          title={t('employees.title', 'Çalışanlar')}
          actionButton={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenModal}
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
              {t('common.addNew', 'Yeni Ekle')}
            </Button>
          }
        />
      </Box>

      <FilterPanel
        searchTerm={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        searchPlaceholder={t('employees.searchPlaceholder', 'Çalışan ara...')}
        fields={[
          {
            id: 'department',
            label: t('employees.departmentHeader', 'Departman'),
            type: 'select',
            options: uniqueDepartments.map(dept => ({
              value: dept,
              label: dept === 'all' ? t('common.all', 'Tümü') : dept
            }))
          }
        ]}
        onAdvancedSearch={(values: any) => {
          if (values.department !== undefined) setDepartmentFilter(values.department);
        }}
      />

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
