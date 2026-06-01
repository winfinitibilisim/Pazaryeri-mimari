import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Select, MenuItem, InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, LinearProgress, Chip } from '@mui/material';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const NAVY = '#1A237E';
const ORANGE = '#FF9800';
const RED = '#F44336';
const COLORS = [NAVY, ORANGE, RED];

// Mock Data
const salesTrend = [
  { time: 'Pzt', satis: 12000 }, { time: 'Sal', satis: 19000 }, { time: 'Çar', satis: 15000 },
  { time: 'Per', satis: 22000 }, { time: 'Cum', satis: 28000 }, { time: 'Cmt', satis: 35000 }, { time: 'Paz', satis: 40000 },
];

const returnRates = [
  { name: 'Kusurlu Ürün', value: 45 },
  { name: 'Yanlış Beden/Renk', value: 30 },
  { name: 'Vazgeçtim', value: 25 },
];

const productSales = [
  { name: 'Xprinter XP-490B Barkod Yazıcı', satis: 1500, stok: 250, musteriPuani: 4.8 },
  { name: 'Curcumin P53 Zerdeçal Ekstrakt', satis: 1200, stok: 80, musteriPuani: 4.5 },
  { name: 'Immu-Nat Immu Bowel', satis: 900, stok: 0, musteriPuani: 3.9 },
  { name: 'Ekranlı Mini Kablosuz Barkod', satis: 600, stok: 150, musteriPuani: 4.2 },
];

const detailedReturns = [
  { id: 'RET-001', product: 'Curcumin P53 Zerdeçal Ekstrakt', reason: 'Kusurlu Ürün (Kapak Kırık)', date: '22 Mar 2026', status: 'Onaylandı' },
  { id: 'RET-002', product: 'Xprinter XP-490B Barkod Yazıcı', reason: 'Vazgeçtim', date: '21 Mar 2026', status: 'İnceleniyor' },
  { id: 'RET-003', product: 'Ekranlı Mini Kablosuz Barkod', reason: 'Yanlış Ürün Gönderimi', date: '20 Mar 2026', status: 'Reddedildi' },
  { id: 'RET-004', product: 'Immu-Nat Immu Bowel', reason: 'Kusurlu Ürün (Tarihi Geçmiş)', date: '19 Mar 2026', status: 'Onaylandı' },
  { id: 'RET-005', product: 'Xprinter XP-490B Barkod Yazıcı', reason: 'Beklentimi Karşılamadı', date: '18 Mar 2026', status: 'Onaylandı' },
];

const SellerReportPage: React.FC = () => {
  const [period, setPeriod] = useState('Bu Hafta');
  const [storeName, setStoreName] = useState('Tümü');

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="600" color={NAVY}>Satıcı Mağaza Raporları</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 200, backgroundColor: '#fff' }}>
            <InputLabel>Mağaza Adı (Filtre)</InputLabel>
            <Select label="Mağaza Adı (Filtre)" value={storeName} onChange={(e) => setStoreName(e.target.value)}>
              <MenuItem value="Tümü">Tüm Mağazalar</MenuItem>
              <MenuItem value="TechStore">TechStore Teknoloji</MenuItem>
              <MenuItem value="ModaTrend">ModaTrend Giyim</MenuItem>
              <MenuItem value="KozmetikPlus">Kozmetik Plus</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150, backgroundColor: '#fff' }}>
            <InputLabel>Dönem</InputLabel>
            <Select label="Dönem" value={period} onChange={(e) => setPeriod(e.target.value)}>
              <MenuItem value="Bugün">Günlük</MenuItem>
              <MenuItem value="Bu Hafta">Haftalık</MenuItem>
              <MenuItem value="Bu Ay">Aylık</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* 5. Mağaza müşteri memnuniyeti puanları */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderLeft: `5px solid ${NAVY}`, height: '100%' }}>
            <Typography variant="subtitle2" fontWeight="bold" color={NAVY}>5. Mağaza Müşteri Memnuniyeti Puanları</Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ mt: 1, color: NAVY }}>4.6 / 5.0</Typography>
            <LinearProgress variant="determinate" value={92} sx={{ mt: 2, height: 8, borderRadius: 4, '& .MuiLinearProgress-bar': { backgroundColor: NAVY } }} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderLeft: `5px solid ${ORANGE}`, height: '100%' }}>
            <Typography variant="body2" color="text.secondary">Toplam Satış Hacmi</Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ mt: 1, color: ORANGE }}>171.000 ₺</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderLeft: `5px solid ${RED}`, height: '100%' }}>
            <Typography variant="body2" color="text.secondary">Genel İade Oranı</Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ mt: 1, color: RED }}>%4.2</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* 1. Satış performansı & 4. İade oranları */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" color={NAVY} sx={{ mb: 3 }}>1. Satış Performansı (Günlük, Haftalık, Aylık)</Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={salesTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="satis" stroke={ORANGE} strokeWidth={3} name="Satış (₺)" dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" color={NAVY} sx={{ mb: 3 }}>4. İade Oranları ve İade Nedenleri</Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={returnRates} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={5}>
                    {returnRates.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

      {/* 4. Detaylı İade Tablosu */}
      <Paper sx={{ p: 0, borderRadius: 2, overflow: 'hidden', mb: 4 }}>
        <Box sx={{ p: 2, backgroundColor: '#ffebee', borderBottom: `1px solid ${RED}40` }}>
          <Typography variant="subtitle1" fontWeight="bold" color={RED}>Detaylı İade Raporu (Hangi Ürünler İade Olmuş?)</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>İade ID</b></TableCell>
                <TableCell><b>Ürün Adı</b></TableCell>
                <TableCell><b>İade Nedeni (Detay)</b></TableCell>
                <TableCell><b>Tarih</b></TableCell>
                <TableCell align="center"><b>Durum</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {detailedReturns.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell sx={{ fontWeight: '500' }}>{row.product}</TableCell>
                  <TableCell>{row.reason}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={row.status} 
                      size="small" 
                      sx={{ 
                        backgroundColor: row.status === 'Onaylandı' ? NAVY : row.status === 'Reddedildi' ? RED : ORANGE, 
                        color: '#fff', fontSize: '0.75rem' 
                      }} 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* 2 & 3. Ürün bazlı satış ve stok durumu */}
      <Paper sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderBottom: '1px solid #eee' }}>
          <Typography variant="subtitle1" fontWeight="bold" color={NAVY}>2. Ürün Bazlı Satış Raporu & 3. Stok Durumu (En Çok Satan Ürünler)</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Ürün Adı</b></TableCell>
                <TableCell align="center"><b>Satış Adedi</b></TableCell>
                <TableCell align="center"><b>Stok Durumu</b></TableCell>
                <TableCell align="center"><b>Müşteri Puanı</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productSales.map((row, idx) => (
                <TableRow key={idx} hover>
                  <TableCell>{row.name}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>{row.satis}</TableCell>
                  <TableCell align="center">
                    {row.stok > 100 ? (
                      <Typography color={NAVY} fontWeight="bold">Stok Yeterli ({row.stok})</Typography>
                    ) : row.stok > 0 ? (
                      <Typography color={ORANGE} fontWeight="bold">Kritik ({row.stok})</Typography>
                    ) : (
                      <Typography color={RED} fontWeight="bold">Tükendi</Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">{row.musteriPuani} / 5</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

    </Box>
  );
};

export default SellerReportPage;
