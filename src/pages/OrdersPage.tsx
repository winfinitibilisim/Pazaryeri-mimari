import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Stack,
  Avatar,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Collapse,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag as OrderIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as DeliveredIcon,
  Cancel as CancelIcon,
  Visibility as ViewIcon,
  FileDownload as ExportIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Store as StoreIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import DataTable, { Column } from '../components/common/DataTable';


// Mock Data Types
interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    avatar?: string;
  };
  product: {
    name: string;
    image: string;
    count: number;
  };
  date: string;
  storeName: string;
  storeCode: string; // Added storeCode
  relativeTime: string;
  amount: number;
  status: 'New' | 'Preparing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: string;
}

// Mock Data
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customer: { name: 'Ahmet Yılmaz', email: 'ahmet@example.com' },
    product: { name: 'Kablosuz Kulaklık', image: '🎧', count: 1 },
    date: '04.01.2024 12:30',
    storeName: 'Winfiniti',
    storeCode: 'MST-001',
    relativeTime: '24 saat',
    amount: 1250.00,
    status: 'New',
    paymentMethod: 'Kredi Kartı',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customer: { name: 'Ayşe Demir', email: 'ayse@example.com' },
    product: { name: 'Akıllı Saat', image: '⌚', count: 1 },
    date: '07.01.2024 12:30',
    storeName: 'LC Waikiki',
    storeCode: 'LCW-342',
    relativeTime: '2 saat',
    amount: 3500.00,
    status: 'Preparing',
    paymentMethod: 'Havale',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customer: { name: 'Mehmet Kaya', email: 'mehmet@example.com' },
    product: { name: 'Laptop Standı', image: '💻', count: 2 },
    date: '08.01.2024 14:15',
    storeName: 'DeFacto',
    storeCode: 'DEF-11',
    relativeTime: '5 saat',
    amount: 850.50,
    status: 'Shipped',
    paymentMethod: 'Kredi Kartı',
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    customer: { name: 'Zeynep Çelik', email: 'zeynep@example.com' },
    product: { name: 'Spor Ayakkabı', image: '👟', count: 1 },
    date: '08.01.2024 09:00',
    storeName: 'Mavi',
    storeCode: 'MAV-099',
    relativeTime: 'Tamamlandı',
    amount: 2100.00,
    status: 'Delivered',
    paymentMethod: 'Kapıda Ödeme',
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-005',
    customer: { name: 'Caner Erkin', email: 'caner@example.com' },
    product: { name: 'Oyun Klavyesi', image: '⌨️', count: 1 },
    date: '07.01.2024 16:45',
    storeName: 'Winfiniti',
    storeCode: 'MST-001',
    relativeTime: 'İptal',
    amount: 1800.00,
    status: 'Cancelled',
    paymentMethod: 'Kredi Kartı',
  },
  {
    id: '6',
    orderNumber: 'ORD-2024-006',
    customer: { name: 'Fatma Şahin', email: 'fatma@example.com' },
    product: { name: 'Makyaj Seti', image: '💄', count: 3 },
    date: '07.01.2024 11:20',
    storeName: 'Gratis',
    storeCode: 'GRT-55',
    relativeTime: '1 gün',
    amount: 4500.00,
    status: 'New',
    paymentMethod: 'Kredi Kartı',
  },
];

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('All');

  // Filter State
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    orderNumber: '',
    customerName: '',
    storeCode: '',
    productName: '',
    storeName: ''
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      orderNumber: '',
      customerName: '',
      storeCode: '',
      productName: '',
      storeName: ''
    });
  };

  // Stats Data
  const stats = [
    { label: 'Toplam Sipariş', value: '1,250', icon: <OrderIcon />, color: '#3f51b5' },
    { label: 'Kargolanacak', value: '45', icon: <ShippingIcon />, color: '#ff9800' },
    { label: 'Teslim Edilen', value: '890', icon: <DeliveredIcon />, color: '#4caf50' },
    { label: 'İptal/İade', value: '12', icon: <CancelIcon />, color: '#f44336' },
  ];

  // Filter Logic
  const filteredOrders = mockOrders.filter(order => {
    // Tab Filter
    const matchesTab = currentTab === 'All' || order.status === currentTab;

    // Advanced Filters
    const matchesOrderNo = order.orderNumber.toLowerCase().includes(filters.orderNumber.toLowerCase());
    const matchesCustomer = order.customer.name.toLowerCase().includes(filters.customerName.toLowerCase());
    const matchesStoreCode = order.storeCode.toLowerCase().includes(filters.storeCode.toLowerCase());
    const matchesProduct = order.product.name.toLowerCase().includes(filters.productName.toLowerCase());
    const matchesStoreName = order.storeName.toLowerCase().includes(filters.storeName.toLowerCase());

    return matchesTab && matchesOrderNo && matchesCustomer && matchesStoreCode && matchesProduct && matchesStoreName;
  });

  // Column Definitions
  const columns: Column[] = [
    {
      id: 'orderNumber',
      label: 'Sipariş No',
      minWidth: 120,
      format: (value: string) => <Typography variant="body2" fontWeight="bold">#{value}</Typography>
    },
    {
      id: 'product',
      label: 'Ürün',
      minWidth: 200,
      format: (value: any) => (
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar variant="rounded" sx={{ bgcolor: '#f5f5f5', fontSize: 20 }}>{value.image}</Avatar>
          <Box>
            <Typography variant="body2" fontWeight="500">{value.name}</Typography>
            <Typography variant="caption" color="text.secondary">Adet: {value.count}</Typography>
          </Box>
        </Stack>
      )
    },
    {
      id: 'customer',
      label: 'Müşteri',
      minWidth: 150,
      format: (value: any) => (
        <Box>
          <Typography variant="body2">{value.name}</Typography>
          <Typography variant="caption" color="text.secondary">{value.email}</Typography>
        </Box>
      )
    },
    {
      id: 'storeName',
      label: 'Mağaza',
      minWidth: 120,
      format: (value: string, row: any) => (
        <Box>
          <Typography variant="body2" fontWeight="600" color="primary">
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {row.storeCode}
          </Typography>
        </Box>
      )
    },
    {
      id: 'date',
      label: 'Sipariş Tarihi ↓',
      minWidth: 150,
      format: (value: string, row: any) => (
        <Box>
          <Typography variant="body2" fontWeight="500">
            {value}
          </Typography>
          <Typography variant="caption" sx={{ color: '#ff1744', fontWeight: 'bold' }}>
            {row.relativeTime}
          </Typography>
        </Box>
      )
    },
    {
      id: 'amount',
      label: 'Tutar',
      minWidth: 100,
      align: 'right',
      format: (value: number) => (
        <Typography variant="body2" fontWeight="600" color="success.main">
          {value.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
        </Typography>
      )
    },
    {
      id: 'status',
      label: 'Durum',
      minWidth: 120,
      format: (value: string) => {
        const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
          'New': { label: 'Yeni', color: '#3498db', bg: '#e8f4fd' },
          'Preparing': { label: 'Hazırlanıyor', color: '#f39c12', bg: '#fef5e7' },
          'Shipped': { label: 'Kargoda', color: '#9b59b6', bg: '#f4ecf7' },
          'Delivered': { label: 'Teslim Edildi', color: '#2ecc71', bg: '#eafaf1' },
          'Cancelled': { label: 'İptal', color: '#e74c3c', bg: '#fdedec' },
        };
        const config = statusConfig[value] || { label: value, color: 'grey', bg: '#f5f5f5' };
        return (
          <Chip
            label={config.label}
            size="small"
            sx={{
              bgcolor: config.bg,
              color: config.color,
              fontWeight: 600,
              border: `1px solid ${config.color}20`
            }}
          />
        );
      }
    },
    {
      id: 'actions',
      label: 'İşlemler',
      minWidth: 80,
      align: 'right',
      format: (_: any, row: any) => (
        <IconButton size="small" color="primary" onClick={() => navigate(`/orders/${row.id}`)}>
          <ViewIcon fontSize="small" />
        </IconButton>
      )
    }
  ];

  return (
    <Box sx={{ p: 0 }}>
      {/* Header & Actions */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h5" fontWeight="600" color="#1a1a1a">
          Sipariş Yönetimi
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="small"
            disableElevation
            onClick={() => navigate('/orders/create')}
            sx={{ bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' } }}
          >
            Sipariş Ekle
          </Button>
          <Button variant="outlined" startIcon={<ExportIcon />} size="small">
            Dışa Aktar
          </Button>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            size="small"
            onClick={() => setShowFilters(!showFilters)}
            color={showFilters ? 'primary' : 'inherit'}
          >
            Filtrele
          </Button>
        </Stack>
      </Stack>

      {/* Filters Section */}
      <Collapse in={showFilters}>
        <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#f8f9fa' }}>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Sipariş No"
                variant="outlined"
                value={filters.orderNumber}
                onChange={(e) => handleFilterChange('orderNumber', e.target.value)}
                placeholder="ORD-..."
                sx={{ bgcolor: 'white' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Müşteri Adı"
                variant="outlined"
                value={filters.customerName}
                onChange={(e) => handleFilterChange('customerName', e.target.value)}
                placeholder="İsim soyisim"
                sx={{ bgcolor: 'white' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Mağaza Kodu"
                variant="outlined"
                value={filters.storeCode}
                onChange={(e) => handleFilterChange('storeCode', e.target.value)}
                placeholder="MST-001"
                sx={{ bgcolor: 'white' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Ürün Adı"
                variant="outlined"
                value={filters.productName}
                onChange={(e) => handleFilterChange('productName', e.target.value)}
                placeholder="Ürün ismi"
                sx={{ bgcolor: 'white' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Mağaza Adı"
                variant="outlined"
                value={filters.storeName}
                onChange={(e) => handleFilterChange('storeName', e.target.value)}
                placeholder="Mağaza adı"
                sx={{ bgcolor: 'white' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                onClick={clearFilters}
                startIcon={<CloseIcon />}
              >
                Temizle
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Collapse>

      {/* İstatistik Kartları */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3, '&:last-child': { pb: 3 } }}>
                <Box sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: `${stat.color}15`,
                  color: stat.color,
                  mr: 2,
                  display: 'flex'
                }}>
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="500">
                    {stat.label}
                  </Typography>
                  <Typography variant="h5" fontWeight="700" color="#2c3e50">
                    {stat.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tablo Alanı */}
      <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tabs
            value={currentTab}
            onChange={(_, val) => setCurrentTab(val)}
            textColor="primary"
            indicatorColor="primary"
            sx={{ minHeight: 60 }}
          >
            <Tab label="Tüm Siparişler" value="All" sx={{ fontWeight: 600, textTransform: 'none', minHeight: 60 }} />
            <Tab label="Yeni" value="New" sx={{ fontWeight: 600, textTransform: 'none', minHeight: 60 }} />
            <Tab label="Hazırlanıyor" value="Preparing" sx={{ fontWeight: 600, textTransform: 'none', minHeight: 60 }} />
            <Tab label="Kargoda" value="Shipped" sx={{ fontWeight: 600, textTransform: 'none', minHeight: 60 }} />
            <Tab label="Teslim Edildi" value="Delivered" sx={{ fontWeight: 600, textTransform: 'none', minHeight: 60 }} />
            <Tab label="İptal/İade" value="Cancelled" sx={{ fontWeight: 600, textTransform: 'none', minHeight: 60 }} />
          </Tabs>
        </Box>

        <DataTable
          columns={columns}
          rows={filteredOrders}
          showToolbar={false}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </Paper>

    </Box>
  );
};


export default OrdersPage; 