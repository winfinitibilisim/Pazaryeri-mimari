import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Select, MenuItem, InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, LinearProgress } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const NAVY = '#1A237E';
const ORANGE = '#FF9800';
const RED = '#F44336';

// Colors Array for PieChart
const orderColors = [NAVY, ORANGE, RED];

const orderStatus = [
  { name: 'Tamamlanan', value: 850 },
  { name: 'Bekleyen', value: 120 },
  { name: 'İptal Edilen', value: 30 },
];

const shippingTimes = [
  { region: 'Marmara', sure: 1.2 },
  { region: 'Ege', sure: 1.8 },
  { region: 'İç Anadolu', sure: 2.1 },
  { region: 'Akdeniz', sure: 2.5 },
];

const customerService = [
  { req: 'Sipariş İade Süreci', count: 150, resolved: 140 },
  { req: 'Kargo Beklentisi', count: 80, resolved: 70 },
  { req: 'Ödeme Şikayeti', count: 40, resolved: 35 },
];

const OperationalReportPage: React.FC = () => {
  const [period, setPeriod] = useState('Bu Haftanın Verileri');

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="600" color={NAVY}>Operasyonel Raporlar</Typography>
        <FormControl size="small" sx={{ minWidth: 200, backgroundColor: '#fff' }}>
          <InputLabel>Zaman Dilimi</InputLabel>
          <Select label="Zaman Dilimi" value={period} onChange={(e) => setPeriod(e.target.value)}>
            <MenuItem value="Bugünün Verileri">Bugünün Verileri</MenuItem>
            <MenuItem value="Bu Haftanın Verileri">Bu Haftanın Verileri</MenuItem>
            <MenuItem value="Bu Ayın Verileri">Bu Ayın Verileri</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderLeft: `5px solid ${ORANGE}`, height: '100%' }}>
            <Typography variant="body2" color="text.secondary">Sistem Kullanım Yoğunluğu</Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ mt: 1, color: ORANGE }}>Trafik: 2.450</Typography>
            <Typography variant="caption" color="text.secondary">Aktif Ziyaretçi</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderLeft: `5px solid ${NAVY}`, height: '100%' }}>
            <Typography variant="body2" color="text.secondary">İade Süreçleri ve Çözüm Süreleri</Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ mt: 1, color: NAVY }}>24 Saat</Typography>
            <Typography variant="caption" color="text.secondary">Ortalama yanıt aralığı</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderLeft: `5px solid ${RED}`, height: '100%' }}>
            <Typography variant="body2" color="text.secondary">İptal Edilen Sipariş Sayısı</Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ mt: 1, color: RED }}>30 Adet</Typography>
            <Typography variant="caption" color="text.secondary">%3.5 İptal Oranı</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Order Status Pie */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" color={NAVY} sx={{ mb: 2 }}>Sipariş Durumu</Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>(Tamamlanan, Bekleyen, İptal Edilen)</Typography>
            <Box sx={{ width: '100%', height: 250 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={orderStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" paddingAngle={5}>
                    {orderStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={orderColors[index % orderColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Shipping Times Bar Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" color={NAVY} sx={{ mb: 2 }}>Kargo ve Teslimat Süreleri</Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={shippingTimes} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="sure" fill={ORANGE} name="Ort. Teslimat (Gün)" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Customer Service Table */}
      <Paper sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderBottom: '1px solid #eee' }}>
          <Typography variant="subtitle1" fontWeight="bold" color={NAVY}>Müşteri Hizmetleri Talepleri</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Talep Kategorisi</b></TableCell>
                <TableCell align="center"><b>Gelen Talep</b></TableCell>
                <TableCell align="center"><b>Çözülen Talep</b></TableCell>
                <TableCell align="left"><b>Çözüm Oranı</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customerService.map((row, idx) => {
                const ratio = Math.round((row.resolved / row.count) * 100);
                return (
                  <TableRow key={idx} hover>
                    <TableCell>{row.req}</TableCell>
                    <TableCell align="center">{row.count}</TableCell>
                    <TableCell align="center">{row.resolved}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress variant="determinate" value={ratio} sx={{ height: 8, borderRadius: 4, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: ratio > 90 ? NAVY : ORANGE } }} />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography variant="body2" color="text.secondary" fontWeight="bold">{`${ratio}%`}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default OperationalReportPage;
