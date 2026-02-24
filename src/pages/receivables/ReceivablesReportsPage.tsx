import React from 'react';

import {
  Box,
  Typography,
  Paper,
  Grid,
  useTheme,
  Card,
  CardContent,
} from '@mui/material';
import {
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  MonetizationOn as MonetizationOnIcon,
  Warning as WarningIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Örnek Veriler
const summaryData = {
  totalReceivable: 158750.50,
  overdueReceivable: 68500.50,
  avgCollectionDays: 42,
};

const statusData = [
  { name: 'Ödendi', value: 75000 },
  { name: 'Vadesi Geçmemiş', value: 15250 },
  { name: 'Vadesi Geçmiş', value: 68500.50 },
];

const agingData = [
  { name: '0-30 Gün', value: 8200.50 },
  { name: '31-60 Gün', value: 15300 },
  { name: '61-90 Gün', value: 0 },
  { name: '90+ Gün', value: 45000 },
];

const COLORS = ['#4CAF50', '#2196F3', '#F44336'];

const ReceivablesReportsPage: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Alacak Raporları
      </Typography>

      {/* Özet Kartları */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ display: 'flex', alignItems: 'center', p: 2, backgroundColor: theme.palette.primary.light + '30' }}>
            <MonetizationOnIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
            <Box>
              <Typography variant="h6">Toplam Alacak</Typography>
              <Typography variant="h5" component="p">{`₺${summaryData.totalReceivable.toFixed(2)}`}</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ display: 'flex', alignItems: 'center', p: 2, backgroundColor: theme.palette.error.light + '30' }}>
            <WarningIcon sx={{ fontSize: 40, color: theme.palette.error.main, mr: 2 }} />
            <Box>
              <Typography variant="h6">Vadesi Geçmiş Alacak</Typography>
              <Typography variant="h5" component="p">{`₺${summaryData.overdueReceivable.toFixed(2)}`}</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ display: 'flex', alignItems: 'center', p: 2, backgroundColor: theme.palette.info.light + '30' }}>
            <AccessTimeIcon sx={{ fontSize: 40, color: theme.palette.info.main, mr: 2 }} />
            <Box>
              <Typography variant="h6">Ort. Tahsilat Süresi</Typography>
              <Typography variant="h5" component="p">{`${summaryData.avgCollectionDays} gün`}</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Grafikler */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              <PieChartIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Alacakların Duruma Göre Dağılımı
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `₺${Number(value).toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              <BarChartIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Alacak Yaşlandırma Raporu (Vadesi Geçmiş)
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={agingData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: any) => `₺${Number(value).toFixed(2)}`} />
                <Legend />
                <Bar dataKey="value" fill={theme.palette.warning.main} name="Tutar" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReceivablesReportsPage;
