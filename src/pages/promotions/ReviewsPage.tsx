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
    Collapse,
    TextField,
    Rating,
    Tooltip
} from '@mui/material';
import {
    Comment as CommentIcon,
    CheckCircle as ApprovedIcon,
    Pending as PendingIcon,
    Cancel as RejectedIcon,
    FilterList as FilterIcon,
    Close as CloseIcon,
    Check as CheckIcon,
    Delete as DeleteIcon,
    Store as StoreIcon
} from '@mui/icons-material';
import DataTable, { Column } from '../../components/common/DataTable';

// Mock Data Types
interface Review {
    id: string;
    store: {
        name: string;
        logo: string;
    };
    customer: {
        name: string;
        email: string;
    };
    product: {
        name: string;
        image: string;
    };
    rating: number;
    comment: string;
    date: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}

const mockReviews: Review[] = [
    {
        id: '1',
        store: { name: 'Ses ve Müzik AŞ', logo: 'S' },
        customer: { name: 'Ahmet Yılmaz', email: 'ahmet@example.com' },
        product: { name: 'Kablosuz Kulaklık V2', image: '🎧' },
        rating: 5,
        comment: 'Harika bir ürün, ses kalitesi mükemmel. Kesinlikle tavsiye ederim.',
        date: '10.03.2024 14:30',
        status: 'Approved',
    },
    {
        id: '2',
        store: { name: 'MediaMarkt', logo: 'M' },
        customer: { name: 'Ayşe Demir', email: 'ayse@example.com' },
        product: { name: 'Akıllı Saat Pro', image: '⌚' },
        rating: 3,
        comment: 'Ürün güzel ama şarjı beklediğimden çabuk bitiyor. Mağazanın paketlemesi iyiydi.',
        date: '09.03.2024 09:15',
        status: 'Pending',
    },
    {
        id: '3',
        store: { name: 'Oyuncu Dünyası', logo: 'O' },
        customer: { name: 'Mehmet Kaya', email: 'mehmet@example.com' },
        product: { name: 'Oyuncu Klavyesi RGB', image: '⌨️' },
        rating: 1,
        comment: 'Kargolama çok kötüydü, ürün ezilmiş geldi. Mağazaya ulaşamadım, iade edeceğim.',
        date: '08.03.2024 16:45',
        status: 'Rejected',
    },
    {
        id: '4',
        store: { name: 'Teknosa', logo: 'T' },
        customer: { name: 'Zeynep Çelik', email: 'zeynep@example.com' },
        product: { name: 'Yeni Sezon Spor Ayakkabı', image: '👟' },
        rating: 4,
        comment: 'Rahat bir ürün, tam kalıp. Rengi resimdeki gibi canlı. Hızlı teslimat için teşekkürler.',
        date: '07.03.2024 11:20',
        status: 'Approved',
    },
    {
        id: '5',
        store: { name: 'X Butik', logo: 'X' },
        customer: { name: 'Caner Erkin', email: 'caner@example.com' },
        product: { name: 'Yazlık Çiçekli Elbise', image: '👗' },
        rating: 5,
        comment: 'Kumaşı harika, çok beğendim. Satıcıya hediyesi için teşekkür ederim.',
        date: '06.03.2024 20:10',
        status: 'Pending',
    },
];

const ReviewsPage: React.FC = () => {
    const [currentTab, setCurrentTab] = useState('All');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        storeName: '',
        customerName: '',
        productName: '',
    });

    const [reviews, setReviews] = useState<Review[]>(mockReviews);

    const handleFilterChange = (field: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            storeName: '',
            customerName: '',
            productName: '',
        });
    };

    const handleStatusChange = (id: string, newStatus: 'Approved' | 'Rejected') => {
        setReviews(prev => prev.map(review =>
            review.id === id ? { ...review, status: newStatus } : review
        ));
    };

    const handleDelete = (id: string) => {
        setReviews(prev => prev.filter(review => review.id !== id));
    };

    const stats = [
        { label: 'Toplam Değerlendirme', value: reviews.length, icon: <CommentIcon />, color: '#3f51b5' },
        { label: 'Değerlendirilen Mağazalar', value: new Set(reviews.map(r => r.store.name)).size, icon: <StoreIcon />, color: '#9c27b0' },
        { label: 'Onay Bekleyen', value: reviews.filter(r => r.status === 'Pending').length, icon: <PendingIcon />, color: '#ff9800' },
        { label: 'Onaylanan', value: reviews.filter(r => r.status === 'Approved').length, icon: <ApprovedIcon />, color: '#4caf50' },
    ];

    const filteredReviews = reviews.filter(review => {
        const matchesTab = currentTab === 'All' || review.status === currentTab;
        const matchesStore = review.store.name.toLowerCase().includes(filters.storeName.toLowerCase());
        const matchesCustomer = review.customer.name.toLowerCase().includes(filters.customerName.toLowerCase());
        const matchesProduct = review.product.name.toLowerCase().includes(filters.productName.toLowerCase());

        return matchesTab && matchesStore && matchesCustomer && matchesProduct;
    });

    const columns: Column[] = [
        {
            id: 'store',
            label: 'Satıcı Mağaza',
            minWidth: 150,
            format: (_: any, row: Review) => (
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32, fontSize: 14 }}>
                        {row.store.logo}
                    </Avatar>
                    <Typography variant="body2" fontWeight="600">{row.store.name}</Typography>
                </Stack>
            )
        },
        {
            id: 'product',
            label: 'Ürün',
            minWidth: 180,
            format: (_: any, row: Review) => (
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar variant="rounded" sx={{ bgcolor: '#f5f5f5', fontSize: 20 }}>{row.product.image}</Avatar>
                    <Typography variant="body2" fontWeight="500">{row.product.name}</Typography>
                </Stack>
            )
        },
        {
            id: 'customer',
            label: 'Müşteri',
            minWidth: 130,
            format: (_: any, row: Review) => (
                <Box>
                    <Typography variant="body2">{row.customer.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{row.customer.email}</Typography>
                </Box>
            )
        },
        {
            id: 'rating',
            label: 'Puan',
            minWidth: 120,
            format: (value: number) => (
                <Rating value={value} readOnly size="small" />
            )
        },
        {
            id: 'comment',
            label: 'Yorum',
            minWidth: 250,
            format: (value: string) => (
                <Tooltip title={value} placement="bottom-start">
                    <Typography
                        variant="body2"
                        sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            cursor: 'help'
                        }}
                    >
                        {value}
                    </Typography>
                </Tooltip>
            )
        },
        {
            id: 'date',
            label: 'Tarih',
            minWidth: 130,
            format: (value: string) => (
                <Typography variant="body2">{value}</Typography>
            )
        },
        {
            id: 'status',
            label: 'Durum',
            minWidth: 110,
            format: (value: string) => {
                const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
                    'Pending': { label: 'Bekliyor', color: '#f39c12', bg: '#fef5e7' },
                    'Approved': { label: 'Onaylandı', color: '#2ecc71', bg: '#eafaf1' },
                    'Rejected': { label: 'Reddedildi', color: '#e74c3c', bg: '#fdedec' },
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
            minWidth: 110,
            align: 'right',
            format: (_: any, row: Review) => (
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                    {row.status === 'Pending' && (
                        <>
                            <Tooltip title="Onayla">
                                <IconButton size="small" color="success" onClick={() => handleStatusChange(row.id, 'Approved')}>
                                    <CheckIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Reddet">
                                <IconButton size="small" color="error" onClick={() => handleStatusChange(row.id, 'Rejected')}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                    <Tooltip title="Sil">
                        <IconButton size="small" color="default" sx={{ color: 'text.secondary' }} onClick={() => handleDelete(row.id)}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            )
        }
    ];

    return (
        <Box sx={{ p: 0 }}>
            {/* Header & Actions */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h5" fontWeight="600" color="#1a1a1a">
                        Pazaryeri Değerlendirmeleri
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Müşterilerin ürünlere ve satıcılara yaptığı değerlendirmeleri yönetin.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<FilterIcon />}
                        size="small"
                        onClick={() => setShowFilters(!showFilters)}
                        color={showFilters ? 'primary' : 'inherit'}
                    >
                        Detaylı Filtrele
                    </Button>
                </Stack>
            </Stack>

            {/* Filters Section */}
            <Collapse in={showFilters}>
                <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#f8f9fa' }}>
                    <Grid container spacing={2} alignItems="flex-end">
                        <Grid item xs={12} sm={3}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Mağaza Adı"
                                variant="outlined"
                                value={filters.storeName}
                                onChange={(e) => handleFilterChange('storeName', e.target.value)}
                                placeholder="Örn: X Butik"
                                sx={{ bgcolor: 'white' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Müşteri Adı"
                                variant="outlined"
                                value={filters.customerName}
                                onChange={(e) => handleFilterChange('customerName', e.target.value)}
                                placeholder="İsim soyisim arayın..."
                                sx={{ bgcolor: 'white' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Marka / Ürün Adı"
                                variant="outlined"
                                value={filters.productName}
                                onChange={(e) => handleFilterChange('productName', e.target.value)}
                                placeholder="Ürün ismi arayın..."
                                sx={{ bgcolor: 'white' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <Button
                                fullWidth
                                variant="outlined"
                                color="error"
                                onClick={clearFilters}
                                startIcon={<CloseIcon />}
                                sx={{ height: 40 }}
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
                        <Tab label="Tüm Değerlendirmeler" value="All" sx={{ fontWeight: 600, textTransform: 'none', minHeight: 60 }} />
                        <Tab label="Bekleyenler" value="Pending" sx={{ fontWeight: 600, textTransform: 'none', minHeight: 60 }} />
                        <Tab label="Onaylananlar" value="Approved" sx={{ fontWeight: 600, textTransform: 'none', minHeight: 60 }} />
                        <Tab label="Reddedilenler" value="Rejected" sx={{ fontWeight: 600, textTransform: 'none', minHeight: 60 }} />
                    </Tabs>
                </Box>

                <DataTable
                    columns={columns}
                    rows={filteredReviews}
                    showToolbar={false}
                    rowsPerPageOptions={[5, 10, 20]}
                />
            </Paper>
        </Box>
    );
};

export default ReviewsPage;
