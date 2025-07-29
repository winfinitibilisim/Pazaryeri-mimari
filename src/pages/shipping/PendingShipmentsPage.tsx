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
  HourglassEmpty as HourglassEmptyIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  LocalShipping as LocalShippingIcon
} from '@mui/icons-material';

// Bekleyen sevkiyat verileri
const pendingShipments = [
  {
    id: 1,
    shipmentNo: 'SVK-2024-001',
    customerName: 'Ahmet Yılmaz',
    destination: 'İstanbul',
    packageCount: 5,
    weight: 25.5,
    createdDate: '2024-01-15',
    priority: 'Yüksek',
    status: 'Bekleyen'
  },
  {
    id: 2,
    shipmentNo: 'SVK-2024-002',
    customerName: 'Ayşe Kaya',
    destination: 'Ankara',
    packageCount: 3,
    weight: 18.2,
    createdDate: '2024-01-16',
    priority: 'Normal',
    status: 'Bekleyen'
  },
  {
    id: 3,
    shipmentNo: 'SVK-2024-003',
    customerName: 'Mehmet Demir',
    destination: 'İzmir',
    packageCount: 8,
    weight: 42.1,
    createdDate: '2024-01-17',
    priority: 'Düşük',
    status: 'Bekleyen'
  }
];

const PendingShipmentsPage: React.FC = () => {
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

  const filteredShipments = pendingShipments.filter(shipment =>
    shipment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.shipmentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Yüksek': return 'error';
      case 'Normal': return 'warning';
      case 'Düşük': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Paper 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, #25638f 0%, #1e4a6f 100%)',
          borderRadius: 3,
          p: 4,
          mb: 3,
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <HourglassEmptyIcon sx={{ fontSize: 40, mr: 2 }} />
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
              Bekleyen Sevkiyatlar
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Henüz gönderilmemiş sevkiyatları yönetin ve takip edin
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
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <HourglassEmptyIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {pendingShipments.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Bekleyen Sevkiyat
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
                    {pendingShipments.reduce((sum, item) => sum + item.packageCount, 0)}
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
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <Typography variant="h6">KG</Typography>
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {pendingShipments.reduce((sum, item) => sum + item.weight, 0).toFixed(1)}
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
                <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                  <Typography variant="h6">!</Typography>
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {pendingShipments.filter(s => s.priority === 'Yüksek').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Yüksek Öncelik
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
              placeholder="Sevkiyat no, müşteri adı veya varış yeri ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button variant="contained" color="primary">
                Yeni Sevkiyat
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
                <TableCell sx={{ fontWeight: 'bold' }}>Tarih</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Öncelik</TableCell>
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
                    <TableCell>{shipment.createdDate}</TableCell>
                    <TableCell>
                      <Chip 
                        label={shipment.priority}
                        color={getPriorityColor(shipment.priority) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={shipment.status}
                        color="warning"
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

export default PendingShipmentsPage;
