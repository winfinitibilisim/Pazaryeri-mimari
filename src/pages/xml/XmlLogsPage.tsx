import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton } from '@mui/material';
import { Refresh as RefreshIcon, ErrorOutline as ErrorIcon } from '@mui/icons-material';

const NAVY = '#1A237E';
const RED = '#F44336';
const GREEN = '#4CAF50';

const logData = [
  { id: 1042, type: 'İçe Aktarım (Import)', source: 'TechStore Feed', date: '24.03.2026 14:00', status: 'Başarılı', processed: 1450, errors: 0 },
  { id: 1041, type: 'Dışa Aktarım (Export)', source: 'Google Merchant', date: '24.03.2026 12:30', status: 'Başarılı', processed: 3200, errors: 0 },
  { id: 1040, type: 'İçe Aktarım (Import)', source: 'ModaTrend V2', date: '24.03.2026 10:15', status: 'Hatalı', processed: 850, errors: 42 },
  { id: 1039, type: 'Dışa Aktarım (Export)', source: 'Facebook Catalog', date: '24.03.2026 09:00', status: 'Kısmen Başarılı', processed: 3100, errors: 100 },
];

const XmlLogsPage: React.FC = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="600" color={NAVY}>
          XML Senkronizasyon Geçmişi & Loglar
        </Typography>
        <IconButton color="primary">
          <RefreshIcon />
        </IconButton>
      </Box>

      <Paper sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><b>İşlem ID</b></TableCell>
                <TableCell><b>Tarih / Saat</b></TableCell>
                <TableCell><b>İşlem Tipi</b></TableCell>
                <TableCell><b>Kaynak / Şablon</b></TableCell>
                <TableCell align="center"><b>İşlenen Kayıt</b></TableCell>
                <TableCell align="center"><b>Hata Sayısı</b></TableCell>
                <TableCell align="center"><b>Durum</b></TableCell>
                <TableCell align="center"><b>İşlem</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>#{row.id}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.source}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: '500' }}>{row.processed}</TableCell>
                  <TableCell align="center">
                    <Typography color={row.errors > 0 ? RED : 'text.secondary'} fontWeight={row.errors > 0 ? 'bold' : 'normal'}>
                      {row.errors}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={row.status} 
                      size="small" 
                      sx={{ 
                        bgcolor: row.status === 'Başarılı' ? `${GREEN}20` : row.status === 'Hatalı' ? `${RED}20` : '#FF980020',
                        color: row.status === 'Başarılı' ? GREEN : row.status === 'Hatalı' ? RED : '#FF9800',
                        fontWeight: 'bold'
                      }} 
                    />
                  </TableCell>
                  <TableCell align="center">
                    {row.errors > 0 && (
                      <IconButton size="small" color="error" title="Hata Detayını Gör">
                        <ErrorIcon fontSize="small" />
                      </IconButton>
                    )}
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

export default XmlLogsPage;
