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
    ContentCopy as ContentCopyIcon,
    Loyalty as LoyaltyIcon,
    Store as StoreIcon,
    CheckCircle as ActiveIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Mock Data Types
interface Discount {
    id: string;
    store: {
        name: string;
        logo: string;
    };
    name: string;
    code: string;
    type: string;
    value: string;
    startDate: string;
    endDate: string;
    status: 'Aktif' | 'Pasif' | 'Planlandı';
    usageCount: number;
}

// Mock Data
const initialDiscounts: Discount[] = [
    {
        id: '1',
        store: { name: 'X Butik', logo: 'X' },
        name: 'Yaz Fırsatı %20 İndirim',
        code: 'YAZ20',
        type: 'Yüzde (%)',
        value: '%20',
        startDate: '01.06.2025',
        endDate: '31.08.2025',
        status: 'Aktif',
        usageCount: 145,
    },
    {
        id: '2',
        store: { name: 'Winfiniti (Genel)', logo: 'W' },
        name: 'İlk Alışverişe Özel 50 TL',
        code: 'ILK50',
        type: 'Tutar (₺)',
        value: '50 ₺',
        startDate: '01.01.2025',
        endDate: '31.12.2025',
        status: 'Aktif',
        usageCount: 89,
    },
    {
        id: '3',
        store: { name: 'Ses ve Müzik AŞ', logo: 'S' },
        name: 'Sevgililer Günü Özel',
        code: 'ASK14',
        type: 'Yüzde (%)',
        value: '%15',
        startDate: '10.02.2025',
        endDate: '15.02.2025',
        status: 'Pasif',
        usageCount: 312,
    },
    {
        id: '4',
        store: { name: 'Teknosa', logo: 'T' },
        name: 'Kış Sonu Temizliği',
        code: 'KIS30',
        type: 'Yüzde (%)',
        value: '%30',
        startDate: '01.03.2025',
        endDate: '15.03.2025',
        status: 'Planlandı',
        usageCount: 0,
    },
    {
        id: '5',
        store: { name: 'Kiğılı', logo: 'K' },
        name: 'Gömlek Alana Kravat Bedava',
        code: 'GOMLEK_KRAVAT',
        type: 'A Ürünü + B Ürünü',
        value: 'Bedava',
        startDate: '10.05.2025',
        endDate: '20.05.2025',
        status: 'Aktif',
        usageCount: 42,
    },
    {
        id: '6',
        store: { name: 'LC Waikiki', logo: 'L' },
        name: '3 Al 2 Öde Tişört Kampanyası',
        code: '-',
        type: 'X Al Y Öde',
        value: '1 Ürün Bedava',
        startDate: '01.07.2025',
        endDate: '31.07.2025',
        status: 'Planlandı',
        usageCount: 0,
    }
];

const DiscountsPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [storeFilter, setStoreFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedActionId, setSelectedActionId] = useState<string | null>(null);

    const [discounts, setDiscounts] = useState<Discount[]>(initialDiscounts);

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedActionId(id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedActionId(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Aktif': return 'success';
            case 'Pasif': return 'error';
            case 'Planlandı': return 'warning';
            default: return 'default';
        }
    };

    const getStatusBgColor = (status: string) => {
        switch (status) {
            case 'Aktif': return '#eafaf1';
            case 'Pasif': return '#fdedec';
            case 'Planlandı': return '#fef5e7';
            default: return '#f5f5f5';
        }
    };

    const getStatusTextColor = (status: string) => {
        switch (status) {
            case 'Aktif': return '#2ecc71';
            case 'Pasif': return '#e74c3c';
            case 'Planlandı': return '#f39c12';
            default: return 'grey';
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStoreFilter('');
    };

    const handleDelete = () => {
        if (selectedActionId) {
            setDiscounts(prev => prev.filter(d => d.id !== selectedActionId));
        }
        handleMenuClose();
    };

    const filteredDiscounts = discounts.filter(discount => {
        const matchesSearch = discount.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            discount.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStore = discount.store.name.toLowerCase().includes(storeFilter.toLowerCase());
        return matchesSearch && matchesStore;
    });

    const stats = [
        { label: 'Toplam İndirim Kampanyası', value: discounts.length, icon: <LoyaltyIcon />, color: '#e91e63' },
        { label: 'Aktif Kampanyalar', value: discounts.filter(d => d.status === 'Aktif').length, icon: <ActiveIcon />, color: '#4caf50' },
        { label: 'İndirim Yapan Mağazalar', value: new Set(discounts.map(d => d.store.name)).size, icon: <StoreIcon />, color: '#9c27b0' },
    ];

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#f4f6f8', minHeight: 'calc(100vh - 64px)' }}>
            {/* Üst Kısım: Başlık ve Ekle Butonu */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#102a43' }}>
                        Pazaryeri İndirim Yönetimi
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#627d98', mt: 0.5 }}>
                        Platform geneli ve satıcı bazlı tüm indirim kampanyalarını buradan yönetebilirsiniz.
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
                        onClick={() => navigate('/promotions/discounts/create')}
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
                        Yeni Kampanya Ekle
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
                                placeholder="Kampanya adı veya kodu ile ara..."
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
                                <TableCell sx={{ fontWeight: 600, color: '#334e68' }}>Kampanya Adı</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#334e68' }}>Kampanya Kodu</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#334e68' }}>Türü / Değeri</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#334e68' }}>Geçerlilik Tarihi</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#334e68' }}>Kullanım</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 600, color: '#334e68' }}>Durum</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600, color: '#334e68' }}>İşlemler</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredDiscounts.length > 0 ? (
                                filteredDiscounts.map((discount) => (
                                    <TableRow key={discount.id} hover>
                                        <TableCell>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Avatar sx={{ bgcolor: discount.store.name.includes('Genel') ? 'primary.main' : 'secondary.main', width: 32, height: 32, fontSize: 14 }}>
                                                    {discount.store.logo}
                                                </Avatar>
                                                <Typography variant="body2" fontWeight="600" sx={{ color: '#102a43' }}>
                                                    {discount.store.name}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 500, color: '#102a43' }}>{discount.name}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600, color: discount.code === '-' ? 'text.secondary' : '#e91e63', bgcolor: discount.code === '-' ? 'transparent' : '#fce4ec', px: discount.code === '-' ? 0 : 1, py: 0.5, borderRadius: 1, border: discount.code === '-' ? 'none' : '1px dashed #f48fb1' }}>
                                                    {discount.code}
                                                </Typography>
                                                {discount.code !== '-' && (
                                                    <Tooltip title="Kodu Kopyala">
                                                        <IconButton size="small" onClick={() => navigator.clipboard.writeText(discount.code)}>
                                                            <ContentCopyIcon sx={{ fontSize: 16, color: '#829ab1' }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ color: '#486581' }}>
                                            <Typography variant="body2" fontWeight="600">{discount.value}</Typography>
                                            <Typography variant="caption" color="text.secondary">{discount.type}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ color: '#486581' }}>
                                                {discount.startDate} -<br />{discount.endDate}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ color: '#486581' }}>
                                            <Typography variant="body2" fontWeight="500">{discount.usageCount}</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={discount.status}
                                                size="small"
                                                sx={{
                                                    fontWeight: 600,
                                                    px: 1,
                                                    bgcolor: getStatusBgColor(discount.status),
                                                    color: getStatusTextColor(discount.status),
                                                    border: `1px solid ${getStatusTextColor(discount.status)}30`
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" onClick={(e) => handleMenuOpen(e, discount.id)}>
                                                <MoreVertIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                                        <Typography variant="body1" sx={{ color: '#627d98', mb: 1 }}>
                                            Aradığınız kritere uygun kampanya bulunamadı.
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
                    <MenuItem onClick={handleMenuClose} sx={{ fontSize: '0.875rem', gap: 1 }}>
                        <ContentCopyIcon fontSize="small" sx={{ color: '#ff9800' }} /> Kopyala
                    </MenuItem>
                    <MenuItem onClick={handleDelete} sx={{ fontSize: '0.875rem', gap: 1, color: '#d32f2f' }}>
                        <DeleteIcon fontSize="small" /> Sil
                    </MenuItem>
                </Menu>
            </Card>
        </Box>
    );
};

export default DiscountsPage;
