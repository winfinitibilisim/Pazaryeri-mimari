import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Stack, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

// Mock Data
const kpis = { totalSales: '1.245.000 TL', activeSellers: '428', avgCart: '450 TL' };

const sellerData = [
  { name: 'Mağaza A', satis: 120000, siparis: 400 },
  { name: 'Mağaza B', satis: 95000, siparis: 300 },
  { name: 'Mağaza C', satis: 80000, siparis: 250 },
  { name: 'Mağaza D', satis: 65000, siparis: 190 },
  { name: 'Mağaza E', satis: 55000, siparis: 150 },
];

const dailyTrend = [
  { day: '01 Mar', satis: 40000 },
  { day: '05 Mar', satis: 42000 },
  { day: '10 Mar', satis: 38000 },
  { day: '15 Mar', satis: 45000 },
  { day: '20 Mar', satis: 48000 },
  { day: '25 Mar', satis: 60000 },
];

const SellerPerformanceReportPage: React.FC = () => {
  const [period, setPeriod] = useState('Bu Ay');

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="600">Satıcı Performans Raporları</Typography>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Dönem</InputLabel>
          <Select label="Dönem" value={period} onChange={(e) => setPeriod(e.target.value)}>
            <MenuItem value="Bu Ay">Bu Ay</MenuItem>
            <MenuItem value="Geçen Ay">Geçen Ay</MenuItem>
            <MenuItem value="Bu Yıl">Bu Yıl</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderLeft: '4px solid #FF9800' }}>
            <Typography variant="body2" color="text.secondary">Toplam Satış Hacmi</Typography>
            <Typography variant="h4" fontWeight="600" sx={{ mt: 1 }}>{kpis.totalSales}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderLeft: '4px solid #4CAF50' }}>
            <Typography variant="body2" color="text.secondary">Aktif Mağaza Sayısı</Typography>
            <Typography variant="h4" fontWeight="600" sx={{ mt: 1 }}>{kpis.activeSellers}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderLeft: '4px solid #2196F3' }}>
            <Typography variant="body2" color="text.secondary">Ortalama Sepet Tutarı</Typography>
            <Typography variant="h4" fontWeight="600" sx={{ mt: 1 }}>{kpis.avgCart}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>En İyi Mağazalar (Satış)</Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={sellerData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="satis" fill="#FF9800" name="Satış (TL)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Günlük Satış Trendi</Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={dailyTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="satis" stroke="#2196F3" strokeWidth={3} name="Satış (TL)" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SellerPerformanceReportPage;
