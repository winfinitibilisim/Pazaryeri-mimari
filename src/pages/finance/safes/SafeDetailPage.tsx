import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSafes } from '../../../hooks/useSafes';
import { Safe } from '../../../types/Safe';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  AccountBalance as AccountBalanceIcon,
  Wallet as WalletIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assessment as AssessmentIcon,
  ArrowBack as ArrowBackIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import ExportButton from '../../../components/common/ExportButton';
import PrintButton from '../../../components/common/PrintButton';

interface Transaction {
  id: number;
  date: string;
  type: 'Giriş' | 'Çıkış';
  description: string;
  amount: number;
  balance: number;
  status: string;
}

const mockTransactions: Transaction[] = [
  { id: 1, date: '2023-10-27', type: 'Giriş', description: 'Satış Faturası #123', amount: 1500, balance: 6500, status: 'Tamamlandı' },
  { id: 2, date: '2023-10-26', type: 'Çıkış', description: 'Ofis Malzemeleri', amount: -200, balance: 5000, status: 'Tamamlandı' },
  { id: 3, date: '2023-10-25', type: 'Giriş', description: 'Hizmet Bedeli', amount: 500, balance: 5200, status: 'Beklemede' },
];

const formatCurrency = (amount: number, currency: string = 'TRY') => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency }).format(amount);
};

const SafeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSafeById } = useSafes();

  const [safe, setSafe] = useState<Safe | null>(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchSafe = async () => {
      if (id) {
        const fetchedSafe = await getSafeById(id);
        setSafe(fetchedSafe || null);
      }
    };
    fetchSafe();
  }, [id, getSafeById]);

  const totalCredit = useMemo(() => {
    return mockTransactions
      .filter(t => t.type === 'Giriş')
      .reduce((sum, t) => sum + t.amount, 0);
  }, []);

  const totalDebit = useMemo(() => {
    return mockTransactions
      .filter(t => t.type === 'Çıkış')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }, []);

  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter(transaction =>
      transaction.description.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText]);

  const handleExportToExcel = () => {
    try {
      // Excel başlıkları
      const headers = [
        'Tarih',
        'İşlem Tipi',
        'Açıklama',
        'Tutar',
        'Bakiye',
        'Durum'
      ];

      // Veri satırları
      const data = filteredTransactions.map(transaction => [
        new Date(transaction.date).toLocaleDateString('tr-TR'),
        transaction.type,
        transaction.description,
        formatCurrency(transaction.amount),
        formatCurrency(transaction.balance),
        transaction.status
      ]);

      // Özet bilgileri
      const summaryData = [
        [''],
        ['ÖZET BİLGİLERİ'],
        ['Kasa Adı:', safe?.name || ''],
        ['Kasa Tipi:', safe?.type === 'bank' ? 'Banka Hesabı' : 'Nakit Kasa'],
        ['Para Birimi:', safe?.currency || 'TRY'],
        ['Mevcut Bakiye:', formatCurrency(safe?.balance || 0)],
        ['Toplam Giriş:', formatCurrency(totalCredit)],
        ['Toplam Çıkış:', formatCurrency(totalDebit)],
        ['Toplam İşlem Sayısı:', filteredTransactions.length.toString()],
        ['Rapor Tarihi:', new Date().toLocaleDateString('tr-TR')]
      ];

      // Tüm verileri birleştir
      const allData = [
        headers,
        ...data,
        ...summaryData
      ];

      // TSV formatında veri oluştur
      const tsvContent = allData.map(row => row.join('\t')).join('\r\n');
      
      // Dosya indirme
      const blob = new Blob([tsvContent], { type: 'text/tab-separated-values;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${safe?.name || 'Kasa'}_Detay_Raporu_${new Date().toISOString().split('T')[0]}.xls`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Excel export hatası:', error);
    }
  };

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Kasa Detay Raporu - ${safe?.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .info { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .summary { margin-top: 30px; }
            .summary-item { margin: 5px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Kasa Detay Raporu</h1>
            <h2>${safe?.name}</h2>
          </div>
          
          <div class="info">
            <div><strong>Kasa Tipi:</strong> ${safe?.type === 'bank' ? 'Banka Hesabı' : 'Nakit Kasa'}</div>
            <div><strong>Para Birimi:</strong> ${safe?.currency}</div>
            <div><strong>Mevcut Bakiye:</strong> ${formatCurrency(safe?.balance || 0)}</div>
            <div><strong>Rapor Tarihi:</strong> ${new Date().toLocaleDateString('tr-TR')}</div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Tarih</th>
                <th>İşlem Tipi</th>
                <th>Açıklama</th>
                <th>Tutar</th>
                <th>Bakiye</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTransactions.map(transaction => `
                <tr>
                  <td>${new Date(transaction.date).toLocaleDateString('tr-TR')}</td>
                  <td>${transaction.type}</td>
                  <td>${transaction.description}</td>
                  <td>${formatCurrency(transaction.amount)}</td>
                  <td>${formatCurrency(transaction.balance)}</td>
                  <td>${transaction.status}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="summary">
            <h3>Özet Bilgileri</h3>
            <div class="summary-item"><strong>Toplam Giriş:</strong> ${formatCurrency(totalCredit)}</div>
            <div class="summary-item"><strong>Toplam Çıkış:</strong> ${formatCurrency(totalDebit)}</div>
            <div class="summary-item"><strong>Toplam İşlem Sayısı:</strong> ${filteredTransactions.length}</div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  if (!safe) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography>Yükleniyor...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{
        background: 'linear-gradient(135deg, #25638f 0%, #1e4a6f 100%)',
        color: 'white',
        p: 4,
        mb: 3
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <IconButton 
              onClick={() => navigate('/finance/safes')}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white'
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box sx={{
              p: 2,
              borderRadius: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.2)'
            }}>
              {safe.type === 'bank' ? <AccountBalanceIcon sx={{ fontSize: 40 }} /> : <WalletIcon sx={{ fontSize: 40 }} />}
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {safe.name}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {safe.type === 'bank' ? 'Banka Hesabı' : 'Nakit Kasa'} • {safe.currency}
              </Typography>
            </Box>
          </Box>
          
          {/* Export ve Print Butonları */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <ExportButton
              label="Excel'e Aktar"
              onClick={handleExportToExcel}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)'
                }
              }}
            />
            <PrintButton
              label="Raporla"
              onClick={handlePrint}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)'
                }
              }}
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ px: 4, pb: 4 }}>
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <WalletIcon sx={{ fontSize: 48, color: '#25638f', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#25638f', mb: 1 }}>
                  {formatCurrency(safe.balance, safe.currency)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Mevcut Bakiye
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <TrendingUpIcon sx={{ fontSize: 48, color: '#059669', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#059669', mb: 1 }}>
                  {formatCurrency(totalCredit)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Toplam Giriş
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <TrendingDownIcon sx={{ fontSize: 48, color: '#dc2626', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#dc2626', mb: 1 }}>
                  {formatCurrency(totalDebit)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Toplam Çıkış
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <AssessmentIcon sx={{ fontSize: 48, color: '#fd7e14', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#fd7e14', mb: 1 }}>
                  {filteredTransactions.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Toplam İşlem
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="İşlem açıklaması ile ara..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#25638f' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'white'
              }
            }}
          />
        </Box>

        {/* Transactions Table */}
        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                  <TableCell>Tarih</TableCell>
                  <TableCell>Tip</TableCell>
                  <TableCell>Açıklama</TableCell>
                  <TableCell align="right">Tutar</TableCell>
                  <TableCell align="right">Bakiye</TableCell>
                  <TableCell align="center">Durum</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransactions.map((transaction, index) => (
                  <TableRow key={transaction.id} sx={{
                    backgroundColor: index % 2 === 0 ? 'white' : '#f8fafc',
                    '&:hover': { backgroundColor: '#e2e8f0' }
                  }}>
                    <TableCell>{new Date(transaction.date).toLocaleDateString('tr-TR')}</TableCell>
                    <TableCell>
                      <Chip
                        label={transaction.type}
                        color={transaction.type === 'Giriş' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell align="right">
                      <Typography color={transaction.amount > 0 ? 'success.main' : 'error.main'}>
                        {formatCurrency(transaction.amount)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{formatCurrency(transaction.balance)}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={transaction.status}
                        color={transaction.status === 'Tamamlandı' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default SafeDetailPage;
