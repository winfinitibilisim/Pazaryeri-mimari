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
  CheckCircle as CheckCircleIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  LocalShipping as LocalShippingIcon,
  Star as StarIcon
} from '@mui/icons-material';

// Teslim edilen sevkiyat verileri
const deliveredShipments = [
  {
    id: 1,
    shipmentNo: 'SVK-2024-007',
    customerName: 'Hasan Çelik',
    destination: 'Konya',
    packageCount: 3,
    weight: 18.5,
    sentDate: '2024-01-05',
    deliveredDate: '2024-01-08',
    trackingNo: 'TRK789123456',
    carrier: 'PTT Kargo',
    rating: 5,
    status: 'Teslim Edildi'
  },
  {
    id: 2,
    shipmentNo: 'SVK-2024-008',
    customerName: 'Elif Şahin',
    destination: 'Trabzon',
    packageCount: 7,
    weight: 41.2,
    sentDate: '2024-01-03',
    deliveredDate: '2024-01-07',
    trackingNo: 'TRK321654987',
    carrier: 'Yurtiçi Kargo',
    rating: 4,
    status: 'Teslim Edildi'
  },
  {
    id: 3,
    shipmentNo: 'SVK-2024-009',
    customerName: 'Murat Kaya',
    destination: 'Samsun',
    packageCount: 2,
    weight: 12.8,
    sentDate: '2024-01-01',
    deliveredDate: '2024-01-04',
    trackingNo: 'TRK654987321',
    carrier: 'Aras Kargo',
    rating: 5,
    status: 'Teslim Edildi'
  }
];

const DeliveredShipmentsPage: React.FC = () => {
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

  const filteredShipments = deliveredShipments.filter(shipment =>
    shipment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.shipmentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.trackingNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderRating = (rating: number) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {[...Array(5)].map((_, index) => (
          <StarIcon
            key={index}
            sx={{
              fontSize: 16,
              color: index < rating ? '#ffc107' : '#e0e0e0'
            }}
          />
        ))}
        <Typography variant="caption" sx={{ ml: 1 }}>
          ({rating}/5)
        </Typography>
      </Box>
    );
  };

  const calculateDeliveryTime = (sentDate: string, deliveredDate: string) => {
    const sent = new Date(sentDate);
    const delivered = new Date(deliveredDate);
    const diffTime = Math.abs(delivered.getTime() - sent.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Paper 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
          borderRadius: 3,
          p: 4,
          mb: 3,
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 40, mr: 2 }} />
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
              Teslim Edilen Sevkiyatlar
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Başarıyla teslim edilmiş sevkiyatları görüntüleyin ve analiz edin
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
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <CheckCircleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {deliveredShipments.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Teslim Edilen
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
                    {deliveredShipments.reduce((sum, item) => sum + item.packageCount, 0)}
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
                  <Typography variant="h6">⏱</Typography>
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {Math.round(deliveredShipments.reduce((sum, item) => 
                      sum + calculateDeliveryTime(item.sentDate, item.deliveredDate), 0
                    ) / deliveredShipments.length)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ort. Teslimat (Gün)
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
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <StarIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {(deliveredShipments.reduce((sum, item) => sum + item.rating, 0) / deliveredShipments.length).toFixed(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ort. Puan
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
                Rapor Al
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
                <TableCell sx={{ fontWeight: 'bold' }}>Gönderim</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Teslimat</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Süre (Gün)</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Kargo Firması</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Puan</TableCell>
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
                      {shipment.deliveredDate}
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={calculateDeliveryTime(shipment.sentDate, shipment.deliveredDate)}
                        color="info"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{shipment.carrier}</TableCell>
                    <TableCell>
                      {renderRating(shipment.rating)}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={shipment.status}
                        color="primary"
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

export default DeliveredShipmentsPage;
