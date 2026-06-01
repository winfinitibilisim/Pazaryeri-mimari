import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Select, MenuItem, InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Avatar, LinearProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';

const NAVY = '#1A237E';
const ORANGE = '#FF9800';
const RED = '#F44336';

// MOCK DATA

// 1. Temsilci bazlı satış raporu (Chart)
const repSales = [
  { name: 'Ahmet Y.', satis: 450000 },
  { name: 'Ayşe K.', satis: 320000 },
  { name: 'Veli G.', satis: 150000 },
  { name: 'Fatma Ş.', satis: 600000 },
];

// 2. Komisyon kazanç raporu (Chart)
const komisyonTrend = [
  { month: 'Oca', kazanc: 45000 },
  { month: 'Şub', kazanc: 52000 },
  { month: 'Mar', kazanc: 48000 },
  { month: 'Nis', kazanc: 76000 },
];

// 5. Aktif/pasif temsilci listesi
const repList = [
  { id: 1, name: 'Ahmet Yılmaz', stat: 'Aktif' },
  { id: 2, name: 'Ayşe Karaca', stat: 'Aktif' },
  { id: 3, name: 'Veli Gündüz', stat: 'Pasif' },
  { id: 4, name: 'Fatma Şahin', stat: 'Aktif' },
];

// 3. Tavsiye edilen mağaza/ürün performansı
const recPerformances = [
  { rep: 'Ahmet Yılmaz', store: 'Kozmetik Dünyası', product: 'Nemlendirici Krem', perform: '%85 Dönüşüm', color: NAVY },
  { rep: 'Ayşe Karaca', store: 'Elektronik Sepeti', product: 'Kablosuz Kulaklık', perform: '%62 Dönüşüm', color: ORANGE },
  { rep: 'Veli Gündüz', store: 'Spor Ekipmanları', product: 'Direnç Bandı', perform: '%15 Dönüşüm', color: RED },
];

// 4. Temsilci müşteri geri bildirimleri
const feedbackList = [
  { rep: 'Ahmet Yılmaz', rating: 4.8, comment: 'Çok hızlı destek verdi, önerdiği ürün birebir ihtiyacıma uygundu.' },
  { rep: 'Fatma Şahin', rating: 5.0, comment: 'Sürecin başından sonuna kadar çok ilgiliydi.' },
  { rep: 'Veli Gündüz', rating: 2.5, comment: 'Önerdiği mağazanın iade süreci çok sorunluydu.' },
  { rep: 'Ayşe Karaca', rating: 4.5, comment: 'Gayet kibar ve bilgili bir temsilci.' },
];


const RepresentativeReportPage: React.FC = () => {
  const [period, setPeriod] = useState('Bu Ay');
  const [repName, setRepName] = useState('Tümü');

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="600" color={NAVY}>Bağımsız Temsilci Raporları</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 200, backgroundColor: '#fff' }}>
            <InputLabel>Temsilci Adı (Filtre)</InputLabel>
            <Select label="Temsilci Adı (Filtre)" value={repName} onChange={(e) => setRepName(e.target.value)}>
              <MenuItem value="Tümü">Tüm Temsilciler</MenuItem>
              <MenuItem value="Ahmet Y.">Ahmet Yılmaz</MenuItem>
              <MenuItem value="Ayşe K.">Ayşe Karaca</MenuItem>
              <MenuItem value="Veli G.">Veli Gündüz</MenuItem>
              <MenuItem value="Fatma Ş.">Fatma Şahin</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150, backgroundColor: '#fff' }}>
            <InputLabel>Dönem</InputLabel>
            <Select label="Dönem" value={period} onChange={(e) => setPeriod(e.target.value)}>
              <MenuItem value="Bu Ay">Bu Ay</MenuItem>
              <MenuItem value="Önceki Ay">Önceki Ay</MenuItem>
              <MenuItem value="Bu Yıl">Bu Yıl</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* KPI Cards mapping indirectly to 1, 2, 4 totals */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderLeft: `5px solid ${NAVY}`, height: '100%' }}>
            <Typography variant="body2" color="text.secondary">1. Toplam Temsilci Satış Hacmi</Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ mt: 1, color: NAVY }}>1.520.000 ₺</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderLeft: `5px solid ${ORANGE}`, height: '100%' }}>
            <Typography variant="body2" color="text.secondary">2. Toplam Dağıtılan Komisyon</Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ mt: 1, color: ORANGE }}>76.000 ₺</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderLeft: `5px solid ${RED}`, height: '100%' }}>
            <Typography variant="body2" color="text.secondary">4. Ortalama Temsilci Puanı (Memnuniyet)</Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ mt: 1, color: RED }}>4.2 / 5.0</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* CHARTS for 1 & 2 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" color={NAVY} sx={{ mb: 3 }}>1. Temsilci Bazlı Satış Raporu</Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={repSales} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Legend />
                  <Bar dataKey="satis" fill={NAVY} name="Satış Hacmi (₺)" radius={[4, 4, 0, 0]} barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" color={NAVY} sx={{ mb: 3 }}>2. Komisyon Kazanç Raporu</Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={komisyonTrend} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="kazanc" stroke={ORANGE} strokeWidth={3} name="Dağıtılan Komisyon (₺)" dot={{r: 5}} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* TABLES for 3, 4, 5 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 0, borderRadius: 2, overflow: 'hidden', height: '100%' }}>
            <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderBottom: '1px solid #eee' }}>
              <Typography variant="subtitle1" fontWeight="bold" color={NAVY}>3. Tavsiye Edilen Mağaza/Ürün Performansı</Typography>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><b>Temsilci</b></TableCell>
                    <TableCell><b>Mağaza / Ürün</b></TableCell>
                    <TableCell align="center"><b>Dönüşüm Perf.</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recPerformances.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.rep}</TableCell>
                      <TableCell>{row.store} - {row.product}</TableCell>
                      <TableCell align="center">
                        <Typography fontWeight="bold" sx={{ color: row.color }}>{row.perform}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 0, borderRadius: 2, overflow: 'hidden', height: '100%' }}>
            <Box sx={{ p: 2, backgroundColor: '#ffebee', borderBottom: `1px solid ${RED}40` }}>
              <Typography variant="subtitle1" fontWeight="bold" color={RED}>5. Aktif/Pasif Temsilci Listesi</Typography>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><b>Temsilci Adı</b></TableCell>
                    <TableCell align="center"><b>Hesap Durumu</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {repList.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ width: 28, height: 28, mr: 1, fontSize: '0.8rem', bgcolor: row.stat === 'Aktif' ? NAVY : RED }}>
                            {row.name.charAt(0)}
                          </Avatar>
                          {row.name}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={row.stat} 
                          size="small" 
                          sx={{ 
                            backgroundColor: row.stat === 'Aktif' ? NAVY : RED, 
                            color: '#fff', 
                            fontWeight: 'bold',
                            fontSize: '0.7rem'
                          }} 
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* 4. Müşteri Geri Bildirimleri Table */}
      <Paper sx={{ p: 0, borderRadius: 2, overflow: 'hidden', mb: 4 }}>
        <Box sx={{ p: 2, backgroundColor: '#fff3e0', borderBottom: `1px solid ${ORANGE}40` }}>
          <Typography variant="subtitle1" fontWeight="bold" color={ORANGE}>4. Temsilci Müşteri Geri Bildirimleri</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Temsilci</b></TableCell>
                <TableCell><b>Puan</b></TableCell>
                <TableCell><b>Geri Bildirim Yorumu</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feedbackList.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ fontWeight: '500' }}>{row.rep}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography fontWeight="bold" sx={{ mr: 1, color: row.rating >= 4 ? NAVY : RED }}>{row.rating}</Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={row.rating * 20} 
                        sx={{ width: 60, height: 6, borderRadius: 3, '& .MuiLinearProgress-bar': { backgroundColor: row.rating >= 4 ? NAVY : RED } }} 
                      />
                    </Box>
                  </TableCell>
                  <TableCell>"{row.comment}"</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default RepresentativeReportPage;
