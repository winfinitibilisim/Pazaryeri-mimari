import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

// Mock Data
const kpis = { totalGmv: '5.240.000 TL', platformRev: '450.000 TL', returnRate: '%3.5' };

const monthlyGmv = [
  { month: 'Ekim', gmv: 600000, revenue: 50000 },
  { month: 'Kasım', gmv: 900000, revenue: 80000 },
  { month: 'Aralık', gmv: 1200000, revenue: 110000 },
  { month: 'Ocak', gmv: 850000, revenue: 75000 },
  { month: 'Şubat', gmv: 950000, revenue: 85000 },
  { month: 'Mart', gmv: 1100000, revenue: 100000 },
];

const revenueBreakdown = [
  { name: 'Mağaza Komisyonları', value: 350000 },
  { name: 'Öne Çıkarma Ücretleri', value: 75000 },
  { name: 'Abonelik / Ek Hizmet', value: 25000 },
];

const COLORS = ['#2196F3', '#FF9800', '#4CAF50'];

const MarketplaceReportPage: React.FC = () => {
  const [period, setPeriod] = useState('Son 6 Ay');

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="600">Genel Operasyon Raporları (Marketplace)</Typography>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Dönem</InputLabel>
          <Select label="Dönem" value={period} onChange={(e) => setPeriod(e.target.value)}>
            <MenuItem value="Bu Ay">Bu Ay</MenuItem>
            <MenuItem value="Son 6 Ay">Son 6 Ay</MenuItem>
            <MenuItem value="Bu Yıl">Bu Yıl</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderLeft: '4px solid #E91E63' }}>
            <Typography variant="body2" color="text.secondary">Toplam GMV (Brüt Hacim)</Typography>
            <Typography variant="h4" fontWeight="600" sx={{ mt: 1 }}>{kpis.totalGmv}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderLeft: '4px solid #00BCD4' }}>
            <Typography variant="body2" color="text.secondary">Platform Net Geliri</Typography>
            <Typography variant="h4" fontWeight="600" sx={{ mt: 1 }}>{kpis.platformRev}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderLeft: '4px solid #F44336' }}>
            <Typography variant="body2" color="text.secondary">İade Oranı (Tutar Bazlı)</Typography>
            <Typography variant="h4" fontWeight="600" sx={{ mt: 1 }}>{kpis.returnRate}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Aylık GMV ve Platform Geliri Trendi</Typography>
            <Box sx={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <AreaChart data={monthlyGmv} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E91E63" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#E91E63" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00BCD4" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00BCD4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="gmv" stroke="#E91E63" fillOpacity={1} fill="url(#colorGmv)" name="GMV (TL)" />
                  <Area type="monotone" dataKey="revenue" stroke="#00BCD4" fillOpacity={1} fill="url(#colorRev)" name="Gelir (TL)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Gelir Dağılımı</Typography>
            <Box sx={{ width: '100%', height: 350, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={revenueBreakdown}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label
                  >
                    {revenueBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ bottom: 0 }} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MarketplaceReportPage;
