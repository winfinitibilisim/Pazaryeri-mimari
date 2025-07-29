import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Avatar
} from '@mui/material';
import {
  Send as SendIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  LocalShipping as LocalShippingIcon
} from '@mui/icons-material';

// Gönderilen sevkiyat verileri
const sentShipments = [
  {
    id: 1,
    shipmentNo: 'SVK-2024-004',
    customerName: 'Fatma Özkan',
    destination: 'Bursa',
    packageCount: 4,
    weight: 22.3,
    sentDate: '2024-01-10',
    trackingNo: 'TRK123456789',
    carrier: 'Yurtiçi Kargo',
    status: 'Gönderildi'
  },
  {
    id: 2,
    shipmentNo: 'SVK-2024-005',
    customerName: 'Ali Vural',
    destination: 'Antalya',
    packageCount: 2,
    weight: 15.7,
    sentDate: '2024-01-12',
    trackingNo: 'TRK987654321',
    carrier: 'Aras Kargo',
    status: 'Gönderildi'
  },
  {
    id: 3,
    shipmentNo: 'SVK-2024-006',
    customerName: 'Zeynep Aydın',
    destination: 'Adana',
    packageCount: 6,
    weight: 35.2,
    sentDate: '2024-01-14',
    trackingNo: 'TRK456789123',
    carrier: 'MNG Kargo',
    status: 'Gönderildi'
  }
];

const SentShipmentsPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredShipments = sentShipments.filter(shipment =>
    shipment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.shipmentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.trackingNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Paper 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
          borderRadius: 3,
          p: 4,
          mb: 3,
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <SendIcon sx={{ fontSize: 40, mr: 2 }} />
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
              Gönderilen Sevkiyatlar
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Gönderilmiş sevkiyatları takip edin ve yönetin
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* İstatistik Kartları */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <SendIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {sentShipments.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Gönderilen Sevkiyat
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <LocalShippingIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {sentShipments.reduce((sum, item) => sum + item.packageCount, 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Toplam Paket
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <Typography variant="h6">KG</Typography>
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {sentShipments.reduce((sum, item) => sum + item.weight, 0).toFixed(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Toplam Ağırlık
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <Typography variant="h6">3</Typography>
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {new Set(sentShipments.map(s => s.carrier)).size}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Kargo Firması
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Arama ve Filtreler */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Sevkiyat no, müşteri adı, takip no veya varış yeri ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button variant="outlined">
                Takip Et
              </Button>
              <Button variant="outlined">
                Excel'e Aktar
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Tablo */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Sevkiyat No</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Müşteri</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Varış Yeri</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Paket Sayısı</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Ağırlık (kg)</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Gönderim Tarihi</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Takip No</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Kargo Firması</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Durum</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredShipments
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((shipment) => (
                  <TableRow 
                    key={shipment.id}
                    sx={{ 
                      '&:hover': { backgroundColor: '#f9f9f9' },
                      '&:nth-of-type(even)': { backgroundColor: '#fafafa' }
                    }}
                  >
                    <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {shipment.shipmentNo}
                    </TableCell>
                    <TableCell>{shipment.customerName}</TableCell>
                    <TableCell>{shipment.destination}</TableCell>
                    <TableCell align="center">{shipment.packageCount}</TableCell>
                    <TableCell align="center">{shipment.weight}</TableCell>
                    <TableCell>{shipment.sentDate}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'success.main' }}>
                      {shipment.trackingNo}
                    </TableCell>
                    <TableCell>{shipment.carrier}</TableCell>
                    <TableCell>
                      <Chip 
                        label={shipment.status}
                        color="success"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary">
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="secondary">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredShipments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Sayfa başına satır:"
        />
      </Paper>
    </Box>
  );
};

export default SentShipmentsPage;
