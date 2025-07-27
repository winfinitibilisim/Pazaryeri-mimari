import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tabs,
  Tab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Person as PersonIcon,
  AccountBalance as AccountBalanceIcon,
  History as HistoryIcon,
  Receipt as ReceiptIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import tr from 'date-fns/locale/tr';

// Types
interface Transaction {
  id: number;
  description: string;
  date: string;
  amount: number;
  currency: 'TRY' | 'USD' | 'EUR';
  status: 'Ödendi' | 'Beklemede' | 'İptal Edildi';
}

interface HistoryLog {
  id: number;
  description: string;
  date: string;
}

// Mock data
const mockTransactions: Transaction[] = [
  { id: 1, description: 'Maaş Ödemesi - Haziran', date: '01.06.2025', amount: 5000, currency: 'TRY', status: 'Ödendi' },
  { id: 2, description: 'Avans', date: '15.06.2025', amount: 1000, currency: 'TRY', status: 'Beklemede' },
  { id: 3, description: 'Prim Ödemesi', date: '20.06.2025', amount: 2500, currency: 'TRY', status: 'Ödendi' },
  { id: 4, description: 'Yol Masrafı', date: '25.06.2025', amount: 300, currency: 'USD', status: 'İptal Edildi' }
];

const mockHistory: HistoryLog[] = [
  { id: 1, description: '20.000,00 TL tutarında maaş tanımlaması yapıldı', date: '03.07.2025 22:48' },
  { id: 2, description: 'İptal Edildi', date: '29.06.2025 08:21' },
  { id: 3, description: 'Oluşturuldu', date: '28.06.2025 15:04' }
];

const getStatusChipProps = (status: Transaction['status']) => {
  switch (status) {
    case 'Ödendi':
      return { label: 'Ödendi', color: 'success' as const };
    case 'Beklemede':
      return { label: 'Beklemede', color: 'warning' as const };
    case 'İptal Edildi':
      return { label: 'İptal Edildi', color: 'error' as const };
    default:
      return { label: 'Bilinmiyor', color: 'default' as const };
  }
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const EmployeeDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [salaryDialogOpen, setSalaryDialogOpen] = useState(false);
  const [advanceDialogOpen, setAdvanceDialogOpen] = useState(false);
  const [definitionDialogOpen, setDefinitionDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [transactionDetailOpen, setTransactionDetailOpen] = useState(false);

  // Dialog handlers
  const handleSalaryDialogOpen = () => setSalaryDialogOpen(true);
  const handleSalaryDialogClose = () => setSalaryDialogOpen(false);
  const handleAdvanceDialogOpen = () => setAdvanceDialogOpen(true);
  const handleAdvanceDialogClose = () => setAdvanceDialogOpen(false);
  const handleDefinitionDialogOpen = () => setDefinitionDialogOpen(true);
  const handleDefinitionDialogClose = () => setDefinitionDialogOpen(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTransactionDetail = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setTransactionDetailOpen(true);
  };

  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter(transaction =>
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.date.includes(searchQuery)
    );
  }, [searchQuery]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
      <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        {/* Modern Header with Gradient */}
        <Box sx={{
          background: 'linear-gradient(135deg, #25638f 0%, #1e4a6f 100%)',
          color: 'white',
          p: 4,
          mb: 3
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                fontSize: '2rem',
                fontWeight: 700
              }}>
                AY
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  Ahmet Yılmaz
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 0.5 }}>
                  Yazılım Geliştirici
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  Teknoloji Departmanı • ID: EMP-2024-001
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleDefinitionDialogOpen}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)'
                  }
                }}
              >
                Ek Tanımlar
              </Button>
              <Button
                variant="contained"
                onClick={handleSalaryDialogOpen}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)'
                  }
                }}
              >
                Maaş Tanımı
              </Button>
              <Button
                variant="contained"
                onClick={handleAdvanceDialogOpen}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)'
                  }
                }}
              >
                Avans Ekle
              </Button>
            </Box>
          </Box>
        </Box>

        <Box sx={{ px: 4, pb: 4 }}>
          {/* Quick Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <Card sx={{ 
                borderRadius: 3, 
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.05)'
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <AccountBalanceIcon sx={{ fontSize: 40, color: '#25638f', mb: 2 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#25638f', mb: 1 }}>
                    ₺15,500
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Toplam Bakiye
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ 
                borderRadius: 3, 
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.05)'
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <ReceiptIcon sx={{ fontSize: 40, color: '#28a745', mb: 2 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#28a745', mb: 1 }}>
                    {mockTransactions.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Toplam İşlem
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ 
                borderRadius: 3, 
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.05)'
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <PersonIcon sx={{ fontSize: 40, color: '#fd7e14', mb: 2 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#fd7e14', mb: 1 }}>
                    ₺8,500
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Aylık Maaş
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ 
                borderRadius: 3, 
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.05)'
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <HistoryIcon sx={{ fontSize: 40, color: '#6f42c1', mb: 2 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#6f42c1', mb: 1 }}>
                    2
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Bekleyen İşlem
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Main Content with Tabs */}
          <Paper sx={{ 
            borderRadius: 3, 
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            overflow: 'hidden'
          }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                sx={{
                  '& .MuiTab-root': {
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    minHeight: 64,
                    '&.Mui-selected': {
                      color: '#25638f'
                    }
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#25638f',
                    height: 3
                  }
                }}
              >
                <Tab label="Hesap Hareketleri" icon={<AccountBalanceIcon />} iconPosition="start" />
                <Tab label="İşlem Geçmişi" icon={<HistoryIcon />} iconPosition="start" />
                <Tab label="Belgeler" icon={<ReceiptIcon />} iconPosition="start" />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              {/* Search Bar */}
              <Box sx={{ p: 3, pb: 0 }}>
                <TextField
                  fullWidth
                  placeholder="İşlem açıklaması veya tarih ile ara..."
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
              </Box>

              {/* Transactions Table */}
              <TableContainer sx={{ p: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 700, color: '#2d3748' }}>Açıklama</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#2d3748' }}>Tarih</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#2d3748' }} align="right">Tutar</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#2d3748' }}>Durum</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#2d3748' }} align="center">İşlemler</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow 
                        key={transaction.id}
                        sx={{ 
                          '&:hover': { backgroundColor: '#f8fafc' },
                          '&:nth-of-type(even)': { backgroundColor: '#fafbfc' }
                        }}
                      >
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          {transaction.amount.toLocaleString('tr-TR', { 
                            style: 'currency', 
                            currency: transaction.currency 
                          })}
                        </TableCell>
                        <TableCell>
                          <Chip {...getStatusChipProps(transaction.status)} size="small" />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton 
                            size="small" 
                            onClick={() => handleTransactionDetail(transaction)}
                            sx={{ color: '#25638f' }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box sx={{ p: 3 }}>
                <List>
                  {mockHistory.map((log) => (
                    <ListItem key={log.id} divider>
                      <ListItemIcon>
                        <HistoryIcon sx={{ color: '#25638f' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={log.description}
                        secondary={log.date}
                        primaryTypographyProps={{ fontWeight: 500 }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <ReceiptIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Henüz belge yüklenmemiş
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Bu çalışana ait belgeler burada görüntülenecek
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  sx={{
                    backgroundColor: '#25638f',
                    '&:hover': { backgroundColor: '#1e4a6f' },
                    borderRadius: 2
                  }}
                >
                  Belge Yükle
                </Button>
              </Box>
            </TabPanel>
          </Paper>
        </Box>

        {/* Dialogs */}
        <Dialog open={salaryDialogOpen} onClose={handleSalaryDialogClose} maxWidth="sm" fullWidth>
          <DialogTitle>Maaş Tanımı</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Maaş Tutarı"
              type="number"
              fullWidth
              variant="outlined"
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Para Birimi</InputLabel>
              <Select defaultValue="TRY">
                <MenuItem value="TRY">TRY</MenuItem>
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSalaryDialogClose}>İptal</Button>
            <Button onClick={handleSalaryDialogClose} variant="contained">Kaydet</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={advanceDialogOpen} onClose={handleAdvanceDialogClose} maxWidth="sm" fullWidth>
          <DialogTitle>Avans Ekle</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Avans Tutarı"
              type="number"
              fullWidth
              variant="outlined"
            />
            <TextField
              margin="dense"
              label="Açıklama"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAdvanceDialogClose}>İptal</Button>
            <Button onClick={handleAdvanceDialogClose} variant="contained">Kaydet</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={definitionDialogOpen} onClose={handleDefinitionDialogClose} maxWidth="sm" fullWidth>
          <DialogTitle>Ek Tanımlar</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Tanım Adı"
              fullWidth
              variant="outlined"
            />
            <TextField
              margin="dense"
              label="Değer"
              fullWidth
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDefinitionDialogClose}>İptal</Button>
            <Button onClick={handleDefinitionDialogClose} variant="contained">Kaydet</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={transactionDetailOpen} onClose={() => setTransactionDetailOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>İşlem Detayları</DialogTitle>
          {selectedTransaction && (
            <DialogContent>
              <Typography variant="h6" gutterBottom>{selectedTransaction.description}</Typography>
              <Typography variant="body1" gutterBottom>
                Tarih: {selectedTransaction.date}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Tutar: {selectedTransaction.amount.toLocaleString('tr-TR', { 
                  style: 'currency', 
                  currency: selectedTransaction.currency 
                })}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Durum: {selectedTransaction.status}
              </Typography>
            </DialogContent>
          )}
          <DialogActions>
            <Button onClick={() => setTransactionDetailOpen(false)}>Kapat</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default EmployeeDetailPage;
