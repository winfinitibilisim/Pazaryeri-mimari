import React, { useState } from 'react';
import {
    Box, Typography, Card, CardContent, Button, TextField, InputAdornment,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Chip, Paper, Avatar, Stack, Grid, Collapse, Tooltip
} from '@mui/material';
import {
    Search as SearchIcon,
    FilterList as FilterListIcon,
    Store as StoreIcon,
    Favorite as FavoriteIcon,
    TrendingUp as TrendingUpIcon,
    Star as StarIcon,
    Close as CloseIcon,
    ShoppingCart as CartIcon
} from '@mui/icons-material';

// --- Mock Data ---
interface WishlistItem {
    id: string;
    store: {
        name: string;
        logo: string;
        isGlobal: boolean;
    };
    product: {
        name: string;
        image: string;
        price: string;
    };
    category: string;
    favoritesCount: number;
    conversionRate: number; // Yüzde kaçı satın almış
    rating: number;
    stockStatus: 'Stokta Var' | 'Az Kaldı' | 'Tükendi';
}

const initialWishlists: WishlistItem[] = [
    {
        id: '1',
        store: { name: 'X Butik', logo: 'X', isGlobal: false },
        product: { name: 'Yazlık Salaş Gömlek', image: 'https://via.placeholder.com/40', price: '450 ₺' },
        category: 'Giyim',
        favoritesCount: 12450,
        conversionRate: 15.2,
        rating: 4.8,
        stockStatus: 'Stokta Var',
    },
    {
        id: '2',
        store: { name: 'Teknosa', logo: 'T', isGlobal: false },
        product: { name: 'Kablosuz Kulaküstü Kulaklık', image: 'https://via.placeholder.com/40', price: '1250 ₺' },
        category: 'Elektronik',
        favoritesCount: 8900,
        conversionRate: 8.5,
        rating: 4.5,
        stockStatus: 'Az Kaldı',
    },
    {
        id: '3',
        store: { name: 'Winfiniti (Genel)', logo: 'W', isGlobal: true },
        product: { name: 'Platform Premium Üyelik (Yıllık)', image: 'https://via.placeholder.com/40', price: '990 ₺' },
        category: 'Hizmet',
        favoritesCount: 25000,
        conversionRate: 22.4,
        rating: 4.9,
        stockStatus: 'Stokta Var',
    },
    {
        id: '4',
        store: { name: 'Ses ve Müzik AŞ', logo: 'S', isGlobal: false },
        product: { name: 'Akustik Gitar Teli Seti', image: 'https://via.placeholder.com/40', price: '250 ₺' },
        category: 'Müzik Aletleri',
        favoritesCount: 3200,
        conversionRate: 45.0,
        rating: 4.7,
        stockStatus: 'Stokta Var',
    },
    {
        id: '5',
        store: { name: 'Spor Dünyası', logo: 'S', isGlobal: false },
        product: { name: 'Yoga Matı Profesyonel', image: 'https://via.placeholder.com/40', price: '600 ₺' },
        category: 'Spor & Outdoor',
        favoritesCount: 1540,
        conversionRate: 12.1,
        rating: 4.2,
        stockStatus: 'Tükendi',
    }
];

const WishlistPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [storeFilter, setStoreFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [items] = useState<WishlistItem[]>(initialWishlists);

    const clearFilters = () => {
        setSearchTerm('');
        setStoreFilter('');
    };

    const getStockColor = (status: string) => {
        switch (status) {
            case 'Stokta Var': return 'success';
            case 'Az Kaldı': return 'warning';
            case 'Tükendi': return 'error';
            default: return 'default';
        }
    };

    const filteredItems = items.filter(item => {
        const matchesProduct = item.product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStore = item.store.name.toLowerCase().includes(storeFilter.toLowerCase());
        return matchesProduct && matchesStore;
    });

    const totalFavorites = items.reduce((sum, item) => sum + item.favoritesCount, 0);
    // Find the store with the most favorites
    const topStore = [...items].sort((a, b) => b.favoritesCount - a.favoritesCount)[0];

    const stats = [
        { label: 'İstek Listesindeki Toplam Ürün', value: items.length.toString(), icon: <FavoriteIcon />, color: '#e91e63' },
        { label: 'Toplam Favoriye Alınma', value: totalFavorites.toLocaleString(), icon: <TrendingUpIcon />, color: '#ff9800' },
        { label: 'En Çok İstek Alan Mağaza', value: topStore.store.name, subValue: `${topStore.favoritesCount.toLocaleString()} İstek`, icon: <StoreIcon />, color: '#9c27b0' },
    ];

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#f4f6f8', minHeight: 'calc(100vh - 64px)' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#102a43' }}>
                        Pazaryeri İstek Listesi
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#627d98', mt: 0.5 }}>
                        Platform genelinde müşterilerin favoriye aldığı ürünleri ve dönüşüm oranlarını analiz edin.
                    </Typography>
                </Box>
                <Box>
                    <Button
                        variant="outlined"
                        startIcon={<FilterListIcon />}
                        onClick={() => setShowFilters(!showFilters)}
                        color={showFilters ? 'primary' : 'inherit'}
                        sx={{ bgcolor: 'white' }}
                    >
                        Detaylı Filtrele
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
                                    {stat.subValue && (
                                        <Typography variant="caption" sx={{ color: '#627d98', fontWeight: 600 }}>
                                            ({stat.subValue})
                                        </Typography>
                                    )}
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
                                <TableCell sx={{ fontWeight: 600, color: '#334e68' }}>Ürün Bilgileri</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#334e68' }}>Kategori</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 600, color: '#334e68' }}>Favori Sayısı</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 600, color: '#334e68' }}>Dönüşüm Oranı</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 600, color: '#334e68' }}>Stok Durumu</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item) => (
                                    <TableRow key={item.id} hover>
                                        <TableCell>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Avatar sx={{ bgcolor: item.store.isGlobal ? 'primary.main' : 'secondary.main', width: 32, height: 32, fontSize: 14 }}>
                                                    {item.store.logo}
                                                </Avatar>
                                                <Typography variant="body2" fontWeight="600" sx={{ color: '#102a43' }}>
                                                    {item.store.name}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar variant="rounded" src={item.product.image} sx={{ width: 40, height: 40, bgcolor: '#e0e0e0' }} />
                                                <Box>
                                                    <Typography variant="body2" fontWeight="600" sx={{ color: '#102a43' }}>
                                                        {item.product.name}
                                                    </Typography>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Typography variant="caption" sx={{ color: '#2ecc71', fontWeight: 600 }}>
                                                            {item.product.price}
                                                        </Typography>
                                                        <Typography variant="caption" color="divider">|</Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', color: '#f39c12' }}>
                                                            <StarIcon sx={{ fontSize: 14, mr: 0.3 }} />
                                                            <Typography variant="caption" fontWeight="600">{item.rating}</Typography>
                                                        </Box>
                                                    </Stack>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {item.category}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e91e63' }}>
                                                <FavoriteIcon sx={{ fontSize: 18, mr: 0.5 }} />
                                                <Typography variant="body2" fontWeight="700">
                                                    {item.favoritesCount.toLocaleString()}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Favoriye ekleyenlerin ürünü satın alma oranı">
                                                <Chip
                                                    icon={<CartIcon style={{ fontSize: 16 }} />}
                                                    label={`%${item.conversionRate}`}
                                                    size="small"
                                                    color={item.conversionRate > 20 ? 'success' : item.conversionRate > 10 ? 'primary' : 'default'}
                                                    variant="outlined"
                                                    sx={{ fontWeight: 600 }}
                                                />
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={item.stockStatus}
                                                size="small"
                                                color={getStockColor(item.stockStatus)}
                                                sx={{ fontWeight: 600 }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                        <Typography variant="body1" sx={{ color: '#627d98', mb: 1 }}>
                                            Aradığınız kritere uygun istek listesi verisi bulunamadı.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Box>
    );
};

export default WishlistPage;
