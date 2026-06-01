import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis, BarChart, Bar, Legend, LineChart, Line } from 'recharts';

const NAVY = '#1A237E';
const ORANGE = '#FF9800';
const RED = '#F44336';

const salesTrend = [
  { name: 'Pzt', satis: 4000 }, { name: 'Sal', satis: 3000 }, { name: 'Çar', satis: 5000 },
  { name: 'Per', satis: 4500 }, { name: 'Cum', satis: 6000 }, { name: 'Cmt', satis: 8000 },
  { name: 'Paz', satis: 9500 },
];

const returnRatesData = [
  { month: 'Oca', iadeTutar: 12000, satis: 100000 },
  { month: 'Şub', iadeTutar: 8000, satis: 120000 },
  { month: 'Mar', iadeTutar: 15000, satis: 110000 },
  { month: 'Nis', iadeTutar: 5000, satis: 150000 },
  { month: 'May', iadeTutar: 9000, satis: 140000 },
];

const repComparison = [
  { name: 'Ahmet Y.', satis: 450, musteri: 120 },
  { name: 'Ayşe K.', satis: 320, musteri: 95 },
  { name: 'Veli G.', satis: 50, musteri: 15 },
  { name: 'Fatma Ş.', satis: 410, musteri: 110 },
];

// Scatter acts like a heatmap proxy
const heatmapData = [
  { category: 'Elektronik', time: 'Sabah', z: 300 },
  { category: 'Elektronik', time: 'Öğle', z: 500 },
  { category: 'Elektronik', time: 'Akşam', z: 800 },
  { category: 'Giyim', time: 'Sabah', z: 150 },
  { category: 'Giyim', time: 'Öğle', z: 600 },
  { category: 'Giyim', time: 'Akşam', z: 1200 },
  { category: 'Kozmetik', time: 'Sabah', z: 100 },
  { category: 'Kozmetik', time: 'Öğle', z: 250 },
  { category: 'Kozmetik', time: 'Akşam', z: 400 },
];

const flowData = [
  { phase: 'Gelir', miktar: 120000 },
  { phase: 'Komisyon', miktar: 90000 },
  { phase: 'Vergi', miktar: 60000 },
  { phase: 'Net Kâr', miktar: 40000 },
];

const VisualizedReportPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h5" fontWeight="600" color={NAVY} sx={{ mb: 4 }}>Görselleştirilmiş Raporlar</Typography>

      <Grid container spacing={4}>
        {/* Sales Trend (AreaChart) */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" color={NAVY} sx={{ mb: 3 }}>Grafiklerle Satış Trendleri</Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={salesTrend}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={NAVY} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={NAVY} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="satis" stroke={NAVY} fillOpacity={1} fill="url(#colorSales)" name="Satış Tutarı" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Heatmap Simulation (ScatterChart) */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" color={NAVY} sx={{ mb: 3 }}>Isı Haritası ile Ürün Popülerliği</Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid />
                  <XAxis type="category" dataKey="time" name="Zaman Dilimi" />
                  <YAxis type="category" dataKey="category" name="Kategori" />
                  <ZAxis type="number" dataKey="z" range={[100, 2000]} name="Aksyion/Popülerlik" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Popülerlik" data={heatmapData} fill={RED} />
                </ScatterChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Rep Comparison (BarChart) */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" color={NAVY} sx={{ mb: 3 }}>Temsilci Performans Karşılaştırmaları</Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={repComparison}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Legend />
                  <Bar dataKey="satis" fill={NAVY} name="Satış (₺)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="musteri" fill={ORANGE} name="Kazanılan Müşteri" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Return Rates over time (LineChart) */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" color={NAVY} sx={{ mb: 3 }}>İade Oranlarının Zaman İçindeki Değişimi</Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={returnRatesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="iadeTutar" stroke={RED} strokeWidth={3} name="İade Olasılığı (Tutar)" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Financial Flow Diagram Simulation (Area Chart interpreted as Flow) */}
        <Grid item xs={12} md={12}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" color={NAVY} sx={{ mb: 3 }}>Finansal Akış Diyagramları</Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={flowData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorFlow" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor={NAVY} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={ORANGE} stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="phase" type="category" />
                  <Tooltip />
                  <Area dataKey="miktar" stroke={NAVY} fill="url(#colorFlow)" name="Hacim (₺)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VisualizedReportPage;
