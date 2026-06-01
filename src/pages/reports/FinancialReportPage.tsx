import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Select, MenuItem, InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

const NAVY = '#1A237E';
const ORANGE = '#FF9800';
const RED = '#F44336';

const financialFlow = [
  { month: 'Eki', gelir: 500000, gider: 350000 },
  { month: 'Kas', gelir: 650000, gider: 450000 },
  { month: 'Ara', gelir: 800000, gider: 600000 },
  { month: 'Oca', gelir: 700000, gider: 480000 },
  { month: 'Şub', gelir: 850000, gider: 550000 },
  { month: 'Mar', gelir: 1100000, gider: 650000 },
];

const commissionData = [
  { name: 'Mağaza Komisyonları', value: 80000 },
  { name: 'Temsilci Komisyonları', value: 25000 },
  { name: 'Platform Kesintileri', value: 15000 },
];
const commColors = [NAVY, ORANGE, RED];

const transactions = [
  { id: 'TXN-001', date: '21 Mar 2026', type: 'Komisyon Ödemesi', stat: 'Tamamlandı', amount: -15000 },
  { id: 'TXN-002', date: '20 Mar 2026', type: 'Satış Geliri', stat: 'Tamamlandı', amount: 85000 },
  { id: 'TXN-003', date: '19 Mar 2026', type: 'Vergi Kesintisi', stat: 'Bekliyor', amount: -6500 },
  { id: 'TXN-004', date: '18 Mar 2026', type: 'İade Maliyeti', stat: 'Tamamlandı', amount: -1200 },
];

const FinancialReportPage: React.FC = () => {
  const [period, setPeriod] = useState('Son 6 Ay');

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="600" color={NAVY}>Finansal Raporlar</Typography>
        <FormControl size="small" sx={{ minWidth: 150, backgroundColor: '#fff' }}>
          <InputLabel>Dönem</InputLabel>
          <Select label="Dönem" value={period} onChange={(e) => setPeriod(e.target.value)}>
            <MenuItem value="Bu Ay">Bu Ay</MenuItem>
            <MenuItem value="Son 6 Ay">Son 6 Ay</MenuItem>
            <MenuItem value="Bu Yıl">Bu Yıl</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderLeft: `5px solid ${NAVY}`, height: '100%' }}>
            <Typography variant="body2" color="text.secondary">Toplam Gelir ve Gider Raporu (Net Bakiye)</Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ mt: 1, color: NAVY }}>4.600.000 ₺</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderLeft: `5px solid ${RED}`, height: '100%' }}>
            <Typography variant="body2" color="text.secondary">Vergi ve Kesinti Raporları</Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ mt: 1, color: RED }}>840.000 ₺</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderLeft: `5px solid ${ORANGE}`, height: '100%' }}>
            <Typography variant="body2" color="text.secondary">İade Maliyetleri</Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ mt: 1, color: ORANGE }}>200.000 ₺</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" color={NAVY} sx={{ mb: 3 }}>Toplam Gelir ve Gider Raporu</Typography>
            <Box sx={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <LineChart data={financialFlow} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="gelir" stroke={NAVY} strokeWidth={3} name="Toplam Gelir (₺)" dot={{r: 6}} />
                  <Line type="monotone" dataKey="gider" stroke={RED} strokeWidth={3} name="Toplam Gider (₺)" dot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" color={NAVY} sx={{ mb: 3 }}>Komisyon Dağılımı</Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={commissionData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={5}>
                    {commissionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={commColors[index % commColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Table */}
      <Paper sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderBottom: '1px solid #eee' }}>
          <Typography variant="subtitle1" fontWeight="bold" color={NAVY}>Ödeme Geçmişi ve Bakiye Raporu</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>İşlem ID</b></TableCell>
                <TableCell><b>Tarih</b></TableCell>
                <TableCell><b>İşlem Türü</b></TableCell>
                <TableCell align="center"><b>Durum</b></TableCell>
                <TableCell align="right"><b>Tutar (₺)</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={row.stat} 
                      size="small" 
                      sx={{ 
                        backgroundColor: row.stat === 'Tamamlandı' ? NAVY : ORANGE, 
                        color: '#fff', 
                        fontWeight: 'bold' 
                      }} 
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', color: row.amount > 0 ? NAVY : RED }}>
                    {row.amount > 0 ? '+' : ''}{row.amount.toLocaleString('tr-TR')}
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

export default FinancialReportPage;
