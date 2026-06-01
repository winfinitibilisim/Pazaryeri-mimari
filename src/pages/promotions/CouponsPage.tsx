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
    LocalOffer as LocalOfferIcon,
    Store as StoreIcon,
    CheckCircle as ActiveIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import FilterPanel from '../../components/common/FilterPanel';

// Mock Data Types
interface Coupon {
    id: string;
    store: {
        name: string;
        logo: string;
    };
    title: string;
    code: string;
    type: string;
    value: string;
    minCartAmount: string;
    startDate: string;
    endDate: string;
    status: 'Aktif' | 'Pasif' | 'Planlandı';
    usageLimit: number;
    usageCount: number;
}

// Mock Data
const initialCoupons: Coupon[] = [
    {
        id: '1',
        store: { name: 'Winfiniti (Genel)', logo: 'W' },
        title: 'Hoşgeldin İndirimi',
        code: 'MERHABA10',
        type: 'Yüzde (%)',
        value: '%10',
        minCartAmount: '500 ₺',
        startDate: '01.01.2025',
        endDate: '31.12.2025',
        status: 'Aktif',
        usageLimit: 1000,
        usageCount: 234,
    },
    {
        id: '2',
        store: { name: 'X Butik', logo: 'X' },
        title: 'Bahar Kampanyası',
        code: 'BAHAR25',
        type: 'Tutar (₺)',
        value: '100 ₺',
        minCartAmount: '1000 ₺',
        startDate: '01.04.2025',
        endDate: '30.05.2025',
        status: 'Pasif',
        usageLimit: 500,
        usageCount: 500,
    },
    {
        id: '3',
        store: { name: 'Teknosa', logo: 'T' },
        title: 'Büyük Cuma İndirimi',
        code: 'CUMA50',
        type: 'Yüzde (%)',
        value: '%50',
        minCartAmount: '0 ₺',
        startDate: '25.11.2025',
        endDate: '28.11.2025',
        status: 'Planlandı',
        usageLimit: 200,
        usageCount: 0,
    },
    {
        id: '4',
        store: { name: 'Ses ve Müzik AŞ', logo: 'S' },
        title: 'Müzik Severlere Özel',
        code: 'SES15',
        type: 'Yüzde (%)',
        value: '%15',
        minCartAmount: '1500 ₺',
        startDate: '10.03.2024',
        endDate: '20.03.2024',
        status: 'Aktif',
        usageLimit: 50,
        usageCount: 12,
    },
    {
        id: '5',
        store: { name: 'Oyuncu Dünyası', logo: 'O' },
        title: 'Ekipman İndirimi',
        code: 'GAMER200',
        type: 'Tutar (₺)',
        value: '200 ₺',
        minCartAmount: '2000 ₺',
        startDate: '01.03.2024',
        endDate: '15.03.2024',
        status: 'Aktif',
        usageLimit: 100,
        usageCount: 85,
    }
];

const CouponsPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [storeFilter, setStoreFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedActionId, setSelectedActionId] = useState<string | null>(null);

    const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);

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
            setCoupons(prev => prev.filter(c => c.id !== selectedActionId));
        }
        handleMenuClose();
    };

    const filteredCoupons = coupons.filter(coupon => {
        const matchesSearch = coupon.title.toLowerCase().includes(searchTerm.toLowerCase()) || coupon.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStore = coupon.store.name.toLowerCase().includes(storeFilter.toLowerCase());
        return matchesSearch && matchesStore;
    });

    const stats = [
        { label: 'Toplam Kupon', value: coupons.length, icon: <LocalOfferIcon />, color: '#3f51b5' },
        { label: 'Aktif Kuponlar', value: coupons.filter(c => c.status === 'Aktif').length, icon: <ActiveIcon />, color: '#4caf50' },
        { label: 'Kupon Sunan Mağazalar', value: new Set(coupons.map(c => c.store.name)).size, icon: <StoreIcon />, color: '#9c27b0' },
    ];

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#f4f6f8', minHeight: 'calc(100vh - 64px)' }}>
            {/* Üst Kısım: Başlık ve Ekle Butonu */}
            <Box sx={{ width: '100%' }}>
            <PageHeader
                title="Pazaryeri Kupon Yönetimi"
                actionButton={
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/promotions/coupons/create')}
                        sx={{
                            bgcolor: '#fff',
                            color: '#3949ab',
                            '&:hover': { bgcolor: '#f5f5f5' },
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            boxShadow: 'none'
                        }}
                    >
                        Yeni Kupon Ekle
                    </Button>
                }
            />
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
            <FilterPanel
                searchTerm={searchTerm}
                onSearchChange={(e) => setSearchTerm(e.target.value)}
                searchPlaceholder="Kupon başlığı veya kodu ara..."
                fields={[
                    {
                        id: 'store',
                        label: 'Mağaza Adı',
                        type: 'text'
                    }
                ]}
                onAdvancedSearch={(values: any) => {
                    if (values.store !== undefined) setStoreFilter(values.store);
                }}
            />

            {/* Tablo Kartı */}
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                <TableContainer component={Paper} elevation={0}>
                    <Table sx={{ minWidth: 1000 }}>
                        <TableHead sx={{ bgcolor: '#f0f4f8' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, color: '#334e68' }}>Satıcı Mağaza</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#334e68' }}>Kupon Başlığı</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#334e68' }}>Kupon Kodu</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#334e68' }}>Türü / Değeri</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#334e68' }}>Min. Sepet</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#334e68' }}>Geçerlilik Tarihi</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#334e68' }}>Kullanım</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 600, color: '#334e68' }}>Durum</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600, color: '#334e68' }}>İşlemler</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredCoupons.length > 0 ? (
                                filteredCoupons.map((coupon) => (
                                    <TableRow key={coupon.id} hover>
                                        <TableCell>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Avatar sx={{ bgcolor: coupon.store.name.includes('Genel') ? 'primary.main' : 'secondary.main', width: 32, height: 32, fontSize: 14 }}>
                                                    {coupon.store.logo}
                                                </Avatar>
                                                <Typography variant="body2" fontWeight="600" sx={{ color: '#102a43' }}>
                                                    {coupon.store.name}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 500, color: '#102a43' }}>{coupon.title}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#1976d2', bgcolor: '#e3f2fd', px: 1, py: 0.5, borderRadius: 1, border: '1px dashed #90caf9' }}>
                                                    {coupon.code}
                                                </Typography>
                                                <Tooltip title="Kodu Kopyala">
                                                    <IconButton size="small" onClick={() => navigator.clipboard.writeText(coupon.code)}>
                                                        <ContentCopyIcon sx={{ fontSize: 16, color: '#829ab1' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ color: '#486581' }}>
                                            <Typography variant="body2" fontWeight="600">{coupon.value}</Typography>
                                            <Typography variant="caption" color="text.secondary">{coupon.type}</Typography>
                                        </TableCell>
                                        <TableCell sx={{ color: '#486581' }}>{coupon.minCartAmount}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ color: '#486581' }}>
                                                {coupon.startDate} -<br />{coupon.endDate}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ color: '#486581' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="body2" fontWeight="500">{coupon.usageCount}</Typography>
                                                <Typography variant="caption" color="text.secondary">/ {coupon.usageLimit}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={coupon.status}
                                                size="small"
                                                sx={{
                                                    fontWeight: 600,
                                                    px: 1,
                                                    bgcolor: getStatusBgColor(coupon.status),
                                                    color: getStatusTextColor(coupon.status),
                                                    border: `1px solid ${getStatusTextColor(coupon.status)}30`
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" onClick={(e) => handleMenuOpen(e, coupon.id)}>
                                                <MoreVertIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                                        <Typography variant="body1" sx={{ color: '#627d98', mb: 1 }}>
                                            Aradığınız kritere uygun kupon bulunamadı.
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

export default CouponsPage;
