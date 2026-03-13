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
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Rating
} from '@mui/material';
import {
    Storefront as ShowcaseIcon,
    CheckCircle as ActiveIcon,
    Cancel as InactiveIcon,
    FilterList as FilterIcon,
    Close as CloseIcon,
    Check as CheckIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Store as StoreIcon
} from '@mui/icons-material';
import DataTable, { Column } from '../../components/common/DataTable';

// Mock Data Types for Marketplace
interface ShowcaseProduct {
    id: string;
    store: {
        name: string;
        logo: string;
        rating: number;
        badge?: string; // e.g. "Süper Satıcı"
    };
    product: {
        name: string;
        image: string;
        sku: string;
    };
    category: string;
    position: number;
    startDate: string;
    endDate: string;
    status: 'Active' | 'Inactive';
}

const mockShowcaseData: ShowcaseProduct[] = [
    {
        id: '1',
        store: { name: 'Teknosa', logo: 'T', rating: 4.8, badge: 'Resmi Satıcı' },
        product: { name: 'Yeni Sezon Spor Ayakkabı', image: '👟', sku: 'SKU-890' },
        category: 'Günün Fırsatları',
        position: 1,
        startDate: '01.03.2024',
        endDate: '31.03.2024',
        status: 'Active',
    },
    {
        id: '2',
        store: { name: 'MediaMarkt', logo: 'M', rating: 4.5 },
        product: { name: 'Akıllı Saat Pro', image: '⌚', sku: 'SKU-443' },
        category: 'Haftanın Yıldız Teknolojileri',
        position: 2,
        startDate: '10.03.2024',
        endDate: '20.03.2024',
        status: 'Active',
    },
    {
        id: '3',
        store: { name: 'X Butik', logo: 'X', rating: 4.9, badge: 'Süper Satıcı' },
        product: { name: 'Makyaj Seti Premium', image: '💄', sku: 'SKU-112' },
        category: 'Trend Kozmetik',
        position: 1,
        startDate: '05.02.2024',
        endDate: '05.03.2024',
        status: 'Inactive',
    },
    {
        id: '4',
        store: { name: 'Oyuncu Dünyası', logo: 'O', rating: 4.2 },
        product: { name: 'Oyuncu Klavyesi RGB', image: '⌨️', sku: 'SKU-567' },
        category: 'Haftanın Yıldız Teknolojileri',
        position: 3,
        startDate: '15.03.2024',
        endDate: '15.04.2024',
        status: 'Active',
    },
    {
        id: '5',
        store: { name: 'Ses ve Müzik AŞ', logo: 'S', rating: 4.6 },
        product: { name: 'Kablosuz Kulaklık V2', image: '🎧', sku: 'SKU-889' },
        category: 'Haftanın Yıldız Teknolojileri',
        position: 4,
        startDate: '01.01.2024',
        endDate: '01.02.2024',
        status: 'Inactive',
    },
];

const mockStores = ['Teknosa', 'MediaMarkt', 'X Butik', 'Oyuncu Dünyası', 'Ses ve Müzik AŞ', 'Diğer Mağaza'];

const mockStoreProducts: Record<string, { name: string; sku: string; image: string }[]> = {
    'Teknosa': [
        { name: 'Yeni Sezon Spor Ayakkabı', sku: 'SKU-890', image: '👟' },
        { name: 'Oyun Konsolu 5', sku: 'SKU-001', image: '🎮' },
    ],
    'MediaMarkt': [
        { name: 'Akıllı Saat Pro', sku: 'SKU-443', image: '⌚' },
        { name: '4K Televizyon 55"', sku: 'SKU-002', image: '📺' },
    ],
    'X Butik': [
        { name: 'Makyaj Seti Premium', sku: 'SKU-112', image: '💄' },
        { name: 'Yazlık Çiçekli Elbise', sku: 'SKU-003', image: '👗' },
    ],
    'Oyuncu Dünyası': [
        { name: 'Oyuncu Klavyesi RGB', sku: 'SKU-567', image: '⌨️' },
        { name: 'Oyun Faresi 16K DPI', sku: 'SKU-004', image: '🖱️' },
    ],
    'Ses ve Müzik AŞ': [
        { name: 'Kablosuz Kulaklık V2', sku: 'SKU-889', image: '🎧' },
        { name: 'Bluetooth Hoparlör', sku: 'SKU-005', image: '🔊' },
    ],
    'Diğer Mağaza': [
        { name: 'Güneş Gözlüğü', sku: 'SKU-006', image: '🕶️' },
    ]
};

const mockCategories = ['Günün Fırsatları', 'Haftanın Yıldız Teknolojileri', 'Trend Kozmetik', 'Süper İndirimler'];

const ShowcasePage: React.FC = () => {
    const [currentTab, setCurrentTab] = useState('All');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        storeName: '',
        productName: '',
        category: '',
    });

    const [products, setProducts] = useState<ShowcaseProduct[]>(mockShowcaseData);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        storeName: 'Teknosa', // Default Store
        selectedSku: '',
        category: '',
        position: 1,
        startDate: '',
        endDate: '',
        status: 'Active' as 'Active' | 'Inactive'
    });

    const handleFilterChange = (field: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            storeName: '',
            productName: '',
            category: '',
        });
    };

    const handleStatusChange = (id: string, newStatus: 'Active' | 'Inactive') => {
        setProducts(prev => prev.map(item =>
            item.id === id ? { ...item, status: newStatus } : item
        ));
    };

    const handleDelete = (id: string) => {
        setProducts(prev => prev.filter(item => item.id !== id));
    };

    const handleAddProduct = () => {
        const id = Math.random().toString(36).substr(2, 9);
        const storeProds = mockStoreProducts[newProduct.storeName] || [];
        const selectedProdData = storeProds.find(p => p.sku === newProduct.selectedSku) || storeProds[0];

        const productToAdd: ShowcaseProduct = {
            id,
            store: {
                name: newProduct.storeName,
                logo: newProduct.storeName.charAt(0),
                rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5 and 5.0
            },
            product: {
                name: selectedProdData?.name || 'Bilinmeyen Ürün',
                image: selectedProdData?.image || '📦',
                sku: newProduct.selectedSku || `SKU-${id}`
            },
            category: newProduct.category || 'Belirtilmemiş',
            position: newProduct.position,
            startDate: newProduct.startDate || new Date().toLocaleDateString('tr-TR'),
            endDate: newProduct.endDate || 'Süresiz',
            status: newProduct.status,
        };
        setProducts(prev => [productToAdd, ...prev]);
        setIsAddModalOpen(false);
        setNewProduct({ storeName: 'Teknosa', selectedSku: '', category: '', position: 1, startDate: '', endDate: '', status: 'Active' });
    };

    const stats = [
        { label: 'Toplam Vitrin Ürünü', value: products.length, icon: <ShowcaseIcon />, color: '#3f51b5' },
        { label: 'Vitrindeki Mağazalar', value: new Set(products.map(p => p.store.name)).size, icon: <StoreIcon />, color: '#f57c00' },
        { label: 'Aktif Ürünler', value: products.filter(p => p.status === 'Active').length, icon: <ActiveIcon />, color: '#4caf50' },
        { label: 'Pasif Ürünler', value: products.filter(p => p.status === 'Inactive').length, icon: <InactiveIcon />, color: '#9e9e9e' },
    ];

    const filteredProducts = products.filter(item => {
        const matchesTab = currentTab === 'All' || item.status === currentTab;
        const matchesStore = item.store.name.toLowerCase().includes(filters.storeName.toLowerCase());
        const matchesProduct = item.product.name.toLowerCase().includes(filters.productName.toLowerCase());
        const matchesCategory = item.category.toLowerCase().includes(filters.category.toLowerCase());

        return matchesTab && matchesStore && matchesProduct && matchesCategory;
    });

    const columns: Column[] = [
        {
            id: 'store',
            label: 'Satıcı Mağaza',
            minWidth: 220,
            format: (_: any, row: ShowcaseProduct) => (
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32, fontSize: 14 }}>
                        {row.store.logo}
                    </Avatar>
                    <Box>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="body2" fontWeight="600">{row.store.name}</Typography>
                            {row.store.badge && (
                                <Chip label={row.store.badge} size="small" color="warning" sx={{ height: 16, fontSize: '0.65rem' }} />
                            )}
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Rating value={row.store.rating} precision={0.1} readOnly size="small" sx={{ fontSize: '0.875rem' }} />
                            <Typography variant="caption" color="text.secondary">({row.store.rating})</Typography>
                        </Stack>
                    </Box>
                </Stack>
            )
        },
        {
            id: 'product',
            label: 'Sahnelenen Ürün',
            minWidth: 220,
            format: (_: any, row: ShowcaseProduct) => (
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar variant="rounded" sx={{ bgcolor: '#f5f5f5', fontSize: 20 }}>{row.product.image}</Avatar>
                    <Box>
                        <Typography variant="body2" fontWeight="500">{row.product.name}</Typography>
                        <Typography variant="caption" color="text.secondary">SKU: {row.product.sku}</Typography>
                    </Box>
                </Stack>
            )
        },
        {
            id: 'category',
            label: 'Vitrin Alanı',
            minWidth: 150,
            format: (value: string) => (
                <Typography variant="body2" color="primary.main" fontWeight={500}>{value}</Typography>
            )
        },
        {
            id: 'position',
            label: 'Sıra',
            minWidth: 80,
            format: (value: number) => (
                <Chip label={`${value}. Sıra`} size="small" sx={{ fontWeight: 'bold' }} />
            )
        },
        {
            id: 'dates',
            label: 'Yayında Kalma Süresi',
            minWidth: 180,
            format: (_: any, row: ShowcaseProduct) => (
                <Box>
                    <Typography variant="body2">Bşl: {row.startDate}</Typography>
                    <Typography variant="caption" color="text.secondary">Bit: {row.endDate}</Typography>
                </Box>
            )
        },
        {
            id: 'status',
            label: 'Vitrin Durumu',
            minWidth: 120,
            format: (value: string) => {
                const isActive = value === 'Active';
                return (
                    <Chip
                        label={isActive ? 'Yayında' : 'Bekliyor / Bitti'}
                        size="small"
                        sx={{
                            bgcolor: isActive ? '#eafaf1' : '#fff3e0',
                            color: isActive ? '#2ecc71' : '#f57c00',
                            fontWeight: 600,
                            border: `1px solid ${isActive ? '#2ecc7120' : '#ffe0b2'}`
                        }}
                    />
                );
            }
        },
        {
            id: 'actions',
            label: 'İşlemler',
            minWidth: 120,
            align: 'right',
            format: (_: any, row: ShowcaseProduct) => (
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                    {row.status === 'Inactive' ? (
                        <Tooltip title="Yayına Al">
                            <IconButton size="small" color="success" onClick={() => handleStatusChange(row.id, 'Active')}>
                                <CheckIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Tooltip title="Yayından Kaldır">
                            <IconButton size="small" color="warning" onClick={() => handleStatusChange(row.id, 'Inactive')}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Tooltip title="Vitrenden Komple Çıkar">
                        <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}>
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
                        Pazaryeri Vitrin Yönetimi
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Mağazaların öne çıkan ürünlerini, günün fırsatlarını ve kampanya alanlarını yönetin.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        size="small"
                        disableElevation
                        onClick={() => setIsAddModalOpen(true)}
                        sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
                    >
                        Mağaza Ürünü Öne Çıkar
                    </Button>
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
                                placeholder="Örn: Teknosa"
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
                        <Grid item xs={12} sm={3}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Vitrin Alanı"
                                variant="outlined"
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                placeholder="Örn: Günün Fırsatları"
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
            <Grid container spacing={2} sx={{ mb: 4 }}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2, '&:last-child': { pb: 2 } }}>
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
                                    <Typography variant="h6" fontWeight="700" color="#2c3e50">
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
                        textColor="secondary"
                        indicatorColor="secondary"
                        sx={{ minHeight: 60 }}
                    >
                        <Tab label="Tüm Vitrin Ürünleri" value="All" sx={{ fontWeight: 600, textTransform: 'none', minHeight: 60 }} />
                        <Tab label="Şu An Yayında" value="Active" sx={{ fontWeight: 600, textTransform: 'none', minHeight: 60 }} />
                        <Tab label="Bekleyenler / Süresi Bitenler" value="Inactive" sx={{ fontWeight: 600, textTransform: 'none', minHeight: 60 }} />
                    </Tabs>
                </Box>

                <DataTable
                    columns={columns}
                    rows={filteredProducts}
                    showToolbar={false}
                    rowsPerPageOptions={[5, 10, 20]}
                />
            </Paper>

            {/* Vitrine Ekle Modalı */}
            <Dialog open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 600 }}>Mağaza Ürününü Vitrine Taşı</DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Satıcı Mağaza</InputLabel>
                                <Select
                                    label="Satıcı Mağaza"
                                    value={newProduct.storeName}
                                    onChange={(e) => setNewProduct({ ...newProduct, storeName: e.target.value, selectedSku: '' })}
                                >
                                    {mockStores.map(store => (
                                        <MenuItem key={store} value={store}>{store}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Mağazanın Ürünü</InputLabel>
                                <Select
                                    label="Mağazanın Ürünü"
                                    value={newProduct.selectedSku}
                                    onChange={(e) => setNewProduct({ ...newProduct, selectedSku: e.target.value })}
                                >
                                    {(mockStoreProducts[newProduct.storeName] || []).map(prod => (
                                        <MenuItem key={prod.sku} value={prod.sku}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <span>{prod.image}</span>
                                                <Typography variant="body2">{prod.name}</Typography>
                                            </Stack>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Seçilen SKU"
                                variant="outlined"
                                value={newProduct.selectedSku}
                                disabled
                                helperText="Ürün seçilince otomatik dolar"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Hangi Vitrin Alanı?</InputLabel>
                                <Select
                                    label="Hangi Vitrin Alanı?"
                                    value={newProduct.category}
                                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                >
                                    {mockCategories.map(cat => (
                                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Sıralamadaki Yeri"
                                variant="outlined"
                                value={newProduct.position}
                                onChange={(e) => setNewProduct({ ...newProduct, position: parseInt(e.target.value) || 1 })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Yayın Durumu</InputLabel>
                                <Select
                                    label="Yayın Durumu"
                                    value={newProduct.status}
                                    onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value as 'Active' | 'Inactive' })}
                                >
                                    <MenuItem value="Active">Hemen Yayına Al</MenuItem>
                                    <MenuItem value="Inactive">Beklemeye Al</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Kampanya Başlangıç"
                                variant="outlined"
                                placeholder="Örn: 01.04.2024"
                                value={newProduct.startDate}
                                onChange={(e) => setNewProduct({ ...newProduct, startDate: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Kampanya Bitiş"
                                variant="outlined"
                                placeholder="Örn: 30.04.2024"
                                value={newProduct.endDate}
                                onChange={(e) => setNewProduct({ ...newProduct, endDate: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setIsAddModalOpen(false)} color="inherit">
                        İptal
                    </Button>
                    <Button onClick={handleAddProduct} variant="contained" color="secondary" disableElevation>
                        Vitrine Ekle
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ShowcasePage;
