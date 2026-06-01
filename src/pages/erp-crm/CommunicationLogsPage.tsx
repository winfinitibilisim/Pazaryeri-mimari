import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const NAVY = '#1A237E';
const RED = '#F44336';
const GREEN = '#4CAF50';

const logs = [
  { id: '10005', type: 'SMS', target: '+905551234567', module: 'Netgsm', event: 'Sipariş Kargoya Verildi', status: 'İletildi', date: '25.03.2026 14:12' },
  { id: '10006', type: 'Email', target: 'ahmet@example.com', module: 'SMTP Core', event: 'E-Fatura Gönderimi', status: 'İletildi', date: '25.03.2026 14:15' },
  { id: '10007', type: 'SMS', target: '+905320000000', module: 'Netgsm', event: 'Satıcı Hoşgeldin', status: 'Hata (Bakiye Yetersiz)', date: '25.03.2026 15:00' },
  { id: '10008', type: 'Webhook', target: 'Logo Tiger ERP', module: 'ERP Core', event: 'Satış Faturası Aktarımı', status: 'İletildi', date: '25.03.2026 16:30' },
];

const CommunicationLogsPage: React.FC = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="600" color={NAVY}>
          İletişim & Pazarlama Çıktıları (Logs)
        </Typography>
      </Box>

      <Paper sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><b>Tarih / Saat</b></TableCell>
                <TableCell><b>Kanal / Tip</b></TableCell>
                <TableCell><b>Hedef</b></TableCell>
                <TableCell><b>Tetikleyen Olay</b></TableCell>
                <TableCell><b>Servis Sağlayıcı</b></TableCell>
                <TableCell align="center"><b>Durum</b></TableCell>
                <TableCell align="center"><b>İşlem</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>
                    <Chip size="small" label={row.type} sx={{ bgcolor: '#eee' }} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: '500' }}>{row.target}</TableCell>
                  <TableCell>{row.event}</TableCell>
                  <TableCell>{row.module}</TableCell>
                  <TableCell align="center">
                    <Chip 
                      size="small" 
                      label={row.status} 
                      sx={{ 
                        bgcolor: row.status === 'İletildi' ? `${GREEN}20` : `${RED}20`,
                        color: row.status === 'İletildi' ? GREEN : RED,
                        fontWeight: 'bold'
                      }} 
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary">
                      <SearchIcon fontSize="small" />
                    </IconButton>
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

export default CommunicationLogsPage;
