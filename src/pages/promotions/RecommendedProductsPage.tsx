import React, { useState } from 'react';
import {
    Box, Typography, Card, CardContent, Button, TextField, InputAdornment,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Chip, Tooltip, Menu, MenuItem, Paper, Avatar, Stack, Grid, Collapse
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    FilterList as FilterListIcon,
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Recommend as RecommendIcon,
    Store as StoreIcon,
    CheckCircle as ActiveIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Mock Data Types
interface RecommendedProduct {
    id: string;
    store: {
        name: string;
        logo: string;
    };
    product: {
        name: string;
        image: string;
        price: string;
    };
    strategy: string;
    startDate: string;
    endDate: string;
    status: 'Aktif' | 'Pasif' | 'Beklemede';
    impressions: number;
    clicks: number;
}

// Mock Data
const initialRecommendations: RecommendedProduct[] = [
    {
        id: '1',
        store: { name: 'X Butik', logo: 'X' },
        product: { name: 'Yazlık Salaş Gömlek', image: 'https://via.placeholder.com/40', price: '450 ₺' },
        strategy: 'Sepette Önerilen (Cross-sell)',
        startDate: '01.06.2025',
        endDate: '31.08.2025',
        status: 'Aktif',
        impressions: 4500,
        clicks: 320,
    },
    {
        id: '2',
        store: { name: 'Teknosa', logo: 'T' },
        product: { name: 'Kablosuz Kulaküstü Kulaklık', image: 'https://via.placeholder.com/40', price: '1250 ₺' },
        strategy: 'Ürün Detayında Önerilen (Up-sell)',
        startDate: '01.01.2025',
        endDate: '31.12.2025',
        status: 'Aktif',
        impressions: 12000,
        clicks: 890,
    },
    {
        id: '3',
        store: { name: 'Ses ve Müzik AŞ', logo: 'S' },
        product: { name: 'Akustik Gitar Teli', image: 'https://via.placeholder.com/40', price: '250 ₺' },
        strategy: 'Sepette Önerilen (Cross-sell)',
        startDate: '10.02.2025',
        endDate: '15.02.2025',
        status: 'Pasif',
        impressions: 1500,
        clicks: 45,
    },
    {
        id: '4',
        store: { name: 'Winfiniti (Genel)', logo: 'W' },
        product: { name: 'Platform Premium Üyelik', image: 'https://via.placeholder.com/40', price: '99 ₺ / Ay' },
        strategy: 'Anasayfa Önerilen',
        startDate: '01.03.2025',
        endDate: '31.12.2025',
        status: 'Aktif',
        impressions: 55000,
        clicks: 4200,
    },
    {
        id: '5',
        store: { name: 'Spor Dünyası', logo: 'S' },
        product: { name: 'Yoga Matı Profesyonel', image: 'https://via.placeholder.com/40', price: '600 ₺' },
        strategy: 'Kategori Sayfasında',
        startDate: '10.05.2025',
        endDate: '20.05.2025',
        status: 'Beklemede',
        impressions: 0,
        clicks: 0,
    }
];

const RecommendedProductsPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [storeFilter, setStoreFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedActionId, setSelectedActionId] = useState<string | null>(null);

    const [recommendations, setRecommendations] = useState<RecommendedProduct[]>(initialRecommendations);

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedActionId(id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedActionId(null);
    };

    const getStatusBgColor = (status: string) => {
        switch (status) {
            case 'Aktif': return '#eafaf1';
            case 'Pasif': return '#fdedec';
            case 'Beklemede': return '#fef5e7';
            default: return '#f5f5f5';
        }
    };

    const getStatusTextColor = (status: string) => {
        switch (status) {
            case 'Aktif': return '#2ecc71';
            case 'Pasif': return '#e74c3c';
            case 'Beklemede': return '#f39c12';
            default: return 'grey';
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStoreFilter('');
    };

    const handleDelete = () => {
        if (selectedActionId) {
            setRecommendations(prev => prev.filter(r => r.id !== selectedActionId));
        }
        handleMenuClose();
    };

    const filteredRecommendations = recommendations.filter(rec => {
        const matchesProduct = rec.product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStore = rec.store.name.toLowerCase().includes(storeFilter.toLowerCase());
        return matchesProduct && matchesStore;
    });

    const stats = [
        { label: 'Toplam Önerilen Ürün', value: recommendations.length, icon: <RecommendIcon />, color: '#00bcd4' },
        { label: 'Aktif Öneriler', value: recommendations.filter(r => r.status === 'Aktif').length, icon: <ActiveIcon />, color: '#4caf50' },
        { label: 'Öneri Yapan Mağazalar', value: new Set(recommendations.map(r => r.store.name)).size, icon: <StoreIcon />, color: '#9c27b0' },
    ];

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#f4f6f8', minHeight: 'calc(100vh - 64px)' }}>
            {/* Üst Kısım: Başlık ve Ekle Butonu */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#102a43' }}>
                        Pazaryeri Önerilen Ürünler
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#627d98', mt: 0.5 }}>
                        Platform geneli ve satıcı bazlı çapraz satış (cross-sell) ve üst satış (up-sell) önerilerini yönetin.
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<FilterListIcon />}
                        onClick={() => setShowFilters(!showFilters)}
                        color={showFilters ? 'primary' : 'inherit'}
                        sx={{ bgcolor: 'white' }}
                    >
                        Detaylı Filtrele
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/promotions/recommended/create')}
                        sx={{
                            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                            color: 'white',
                            px: 3,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                        }}
                    >
                        Yeni Öneri Ekle
                    </Button>
                </Box>
            </Box>

            {/* İstatistik Kartları */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={4} key={index}>
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

            {/* Arama ve Filtre Kartı */}
            <Collapse in={showFilters}>
                <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#f8f9fa' }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={5}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Ürün Adı ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                sx={{ bgcolor: 'white' }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: '#9fb3c8' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Mağaza Adı ara..."
                                value={storeFilter}
                                onChange={(e) => setStoreFilter(e.target.value)}
                                sx={{ bgcolor: 'white' }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <StoreIcon sx={{ color: '#9fb3c8' }} />
                                        </InputAdornment>
                                    ),
                                }}
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

            {/* Tablo Kartı */}
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                <TableContainer component={Paper} elevation={0}>
                    <Table sx={{ minWidth: 1000 }}>
                        <TableHead sx={{ bgcolor: '#f0f4f8' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, color: '#334e68' }}>Satıcı Mağaza</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#334e68' }}>Önerilen Ürün</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#334e68' }}>Öneri Stratejisi</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#334e68' }}>Tarihler</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#334e68' }}>Gösterim / Tıklama</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 600, color: '#334e68' }}>Durum</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600, color: '#334e68' }}>İşlemler</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRecommendations.length > 0 ? (
                                filteredRecommendations.map((rec) => (
                                    <TableRow key={rec.id} hover>
                                        <TableCell>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Avatar sx={{ bgcolor: rec.store.name.includes('Genel') ? 'primary.main' : 'secondary.main', width: 32, height: 32, fontSize: 14 }}>
                                                    {rec.store.logo}
                                                </Avatar>
                                                <Typography variant="body2" fontWeight="600" sx={{ color: '#102a43' }}>
                                                    {rec.store.name}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar variant="rounded" src={rec.product.image} sx={{ width: 40, height: 40, bgcolor: '#e0e0e0' }} />
                                                <Box>
                                                    <Typography variant="body2" fontWeight="600" sx={{ color: '#102a43' }}>
                                                        {rec.product.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {rec.product.price}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={rec.strategy} size="small" sx={{ bgcolor: '#e3f2fd', color: '#1976d2', fontWeight: 500 }} />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ color: '#486581' }}>
                                                {rec.startDate} -<br />{rec.endDate}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Box>
                                                    <Typography variant="body2" fontWeight="600">{rec.impressions.toLocaleString()}</Typography>
                                                    <Typography variant="caption" color="text.secondary">Göst.</Typography>
                                                </Box>
                                                <Typography variant="body2" color="divider">|</Typography>
                                                <Box>
                                                    <Typography variant="body2" fontWeight="600">{rec.clicks.toLocaleString()}</Typography>
                                                    <Typography variant="caption" color="text.secondary">Tık.</Typography>
                                                </Box>
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={rec.status}
                                                size="small"
                                                sx={{
                                                    fontWeight: 600,
                                                    px: 1,
                                                    bgcolor: getStatusBgColor(rec.status),
                                                    color: getStatusTextColor(rec.status),
                                                    border: `1px solid ${getStatusTextColor(rec.status)}30`
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" onClick={(e) => handleMenuOpen(e, rec.id)}>
                                                <MoreVertIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                                        <Typography variant="body1" sx={{ color: '#627d98', mb: 1 }}>
                                            Aradığınız kritere uygun önerilen ürün bulunamadı.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Aksiyon Menüsü */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                        sx: { width: 150, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: 2 }
                    }}
                >
                    <MenuItem onClick={handleMenuClose} sx={{ fontSize: '0.875rem', gap: 1 }}>
                        <EditIcon fontSize="small" sx={{ color: '#1976d2' }} /> Düzenle
                    </MenuItem>
                    <MenuItem onClick={handleDelete} sx={{ fontSize: '0.875rem', gap: 1, color: '#d32f2f' }}>
                        <DeleteIcon fontSize="small" /> Sil
                    </MenuItem>
                </Menu>
            </Card>
        </Box>
    );
};

export default RecommendedProductsPage;
