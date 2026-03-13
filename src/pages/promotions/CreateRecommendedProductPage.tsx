import React, { useState } from 'react';
import {
    Box, Typography, Card, CardContent, Button, TextField,
    Grid, Divider, Stack, InputAdornment, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Radio, Paper, Avatar, Chip, MenuItem
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Store as StoreIcon,
    Inventory as ProductIcon,
    Save as SaveIcon,
    Search as SearchIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// -- Mock Veriler: Mağazalar --
const mockStores = [
    { id: 'st1', name: 'Winfiniti (Genel)', isGlobal: true },
    { id: 'st2', name: 'X Butik', isGlobal: false },
    { id: 'st3', name: 'Teknosa', isGlobal: false },
    { id: 'st4', name: 'Ses ve Müzik AŞ', isGlobal: false },
    { id: 'st5', name: 'Spor Dünyası', isGlobal: false },
];

// -- Mock Veriler: Ürünler --
const mockProducts = [
    { id: 'p1', name: 'Yazlık Salaş Gömlek', price: '450 ₺', store: 'X Butik' },
    { id: 'p2', name: 'Kablosuz Kulaküstü Kulaklık', price: '1250 ₺', store: 'Teknosa' },
    { id: 'p3', name: 'Akustik Gitar Teli', price: '250 ₺', store: 'Ses ve Müzik AŞ' },
    { id: 'p4', name: 'Yoga Matı Profesyonel', price: '600 ₺', store: 'Spor Dünyası' },
    { id: 'p5', name: 'Platform Premium Üyelik', price: '99 ₺ / Ay', store: 'Winfiniti (Genel)' },
];

// -- Form Veri Arayüzü --
interface RecommendedFormState {
    name: string;
    description: string;
    storeId: string;
    storeName: string;
    productId: string;
    productName: string;
    productPrice: string;
    strategy: string;
    startDate: string;
    endDate: string;
    status: string;
}

const CreateRecommendedProductPage: React.FC = () => {
    const navigate = useNavigate();

    // -- Form State --
    const [formData, setFormData] = useState<RecommendedFormState>({
        name: '',
        description: '',
        storeId: '',
        storeName: '',
        productId: '',
        productName: '',
        productPrice: '',
        strategy: 'Sepette Önerilen (Cross-sell)',
        startDate: '',
        endDate: '',
        status: 'Aktif'
    });

    // -- Modal States --
    const [storeModalOpen, setStoreModalOpen] = useState(false);
    const [productModalOpen, setProductModalOpen] = useState(false);

    // Geçici Seçim State'leri (Modal İçin)
    const [tempStoreId, setTempStoreId] = useState('');
    const [tempProductId, setTempProductId] = useState('');

    // Arama State'leri
    const [storeSearch, setStoreSearch] = useState('');
    const [productSearch, setProductSearch] = useState('');

    // -- Handlers --
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // Gerçekte API'ye post edilir
        console.log('Saved Recommendation:', formData);
        navigate('/promotions/recommended');
    };

    // -- Store Selection Logic --
    const openStoreModal = () => {
        setTempStoreId(formData.storeId);
        setStoreSearch('');
        setStoreModalOpen(true);
    };

    const confirmStoreSelection = () => {
        const selected = mockStores.find(s => s.id === tempStoreId);
        if (selected) {
            setFormData(prev => ({
                ...prev,
                storeId: selected.id,
                storeName: selected.name,
                // Eğer farklı bir mağaza seçilirse ürün temizlenir
                productId: prev.storeId === selected.id ? prev.productId : '',
                productName: prev.storeId === selected.id ? prev.productName : '',
                productPrice: prev.storeId === selected.id ? prev.productPrice : '',
            }));
        }
        setStoreModalOpen(false);
    };

    // -- Product Selection Logic --
    const openProductModal = () => {
        if (!formData.storeId) {
            alert("Lütfen önce bir satıcı mağaza seçin!");
            return;
        }
        setTempProductId(formData.productId);
        setProductSearch('');
        setProductModalOpen(true);
    };

    const confirmProductSelection = () => {
        const selected = mockProducts.find(p => p.id === tempProductId);
        if (selected) {
            setFormData(prev => ({
                ...prev,
                productId: selected.id,
                productName: selected.name,
                productPrice: selected.price
            }));
        }
        setProductModalOpen(false);
    };

    // -- Filtreleme --
    const filteredStores = mockStores.filter(store => store.name.toLowerCase().includes(storeSearch.toLowerCase()));

    // Ürünleri sadece seçili mağazaya göre (Winfiniti değilse) filtrele, Winfiniti ise tümünü görebilir mantığı
    const filteredProducts = mockProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(productSearch.toLowerCase());
        const selectedStore = mockStores.find(s => s.id === formData.storeId);
        const matchesStore = selectedStore?.isGlobal ? true : product.store === formData.storeName;
        return matchesSearch && matchesStore;
    });

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#f4f6f8', minHeight: 'calc(100vh - 64px)' }}>
            {/* Üst Kısım: Başlık ve Geri Butonu */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate('/promotions/recommended')} sx={{ mr: 2, bgcolor: 'white', boxShadow: 1 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#102a43' }}>
                        Yeni Önerilen Ürün Oluştur
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={4}>
                {/* Sol Sütun: Form Alanı */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', mb: 3 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#334e68', mb: 3 }}>
                                Genel Detaylar
                            </Typography>

                            <Stack spacing={3}>
                                <TextField
                                    fullWidth
                                    label="Dahili Ad (Görünmez, sadece referans için)"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Örn: 2025 Özel Teknosa Yaz Kampanyası Çapraz Satışı"
                                    variant="outlined"
                                />

                                <TextField
                                    fullWidth
                                    select
                                    label="Öneri Stratejisi"
                                    name="strategy"
                                    value={formData.strategy}
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value="Sepette Önerilen (Cross-sell)">Sepette Çapraz Satış (Cross-sell)</MenuItem>
                                    <MenuItem value="Ürün Detayında Önerilen (Up-sell)">Ürün Detayında Üst Satış (Up-sell)</MenuItem>
                                    <MenuItem value="Anasayfa Önerilen">Anasayfa Karusel Önerisi</MenuItem>
                                    <MenuItem value="Arama Sonuçlarında Öne Çıkan">Arama Sonuçlarında Öne Çıkan</MenuItem>
                                </TextField>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            type="date"
                                            label="Başlangıç Tarihi"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleInputChange}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            type="date"
                                            label="Bitiş Tarihi"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleInputChange}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                </Grid>

                                <TextField
                                    fullWidth
                                    select
                                    label="Durumu"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value="Aktif">Aktif</MenuItem>
                                    <MenuItem value="Pasif">Pasif</MenuItem>
                                    <MenuItem value="Beklemede">Planlanmış (Beklemede)</MenuItem>
                                </TextField>

                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Açıklama / Notlar"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Sadece admin panebinde görünür."
                                />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Sağ Sütun: Ürün ve Mağaza Atama */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', mb: 3 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#334e68', mb: 3 }}>
                                Satıcı ve Ürün Ataması
                            </Typography>

                            <Stack spacing={4}>
                                {/* Mağaza Seçimi */}
                                <Box>
                                    <Typography variant="subtitle2" sx={{ color: '#486581', mb: 1, fontWeight: 600 }}>1. Satıcı Mağaza</Typography>
                                    {!formData.storeId ? (
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            startIcon={<StoreIcon />}
                                            onClick={openStoreModal}
                                            sx={{ height: 60, borderStyle: 'dashed', color: '#627d98', borderColor: '#cbd5e1' }}
                                        >
                                            Mağaza Seçiniz
                                        </Button>
                                    ) : (
                                        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', border: '1px solid #e2e8f0', borderRadius: 2 }}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: 14 }}>
                                                        {formData.storeName.charAt(0)}
                                                    </Avatar>
                                                    <Typography variant="body2" fontWeight="600" sx={{ color: '#102a43' }}>
                                                        {formData.storeName}
                                                    </Typography>
                                                </Stack>
                                                <Button size="small" onClick={openStoreModal} sx={{ minWidth: 'auto', p: 1 }}>Değiştir</Button>
                                            </Stack>
                                        </Paper>
                                    )}
                                </Box>

                                <Divider />

                                {/* Ürün Seçimi */}
                                <Box>
                                    <Typography variant="subtitle2" sx={{ color: '#486581', mb: 1, fontWeight: 600 }}>2. Önerilecek Ürün</Typography>
                                    {!formData.productId ? (
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            startIcon={<ProductIcon />}
                                            onClick={openProductModal}
                                            disabled={!formData.storeId}
                                            sx={{ height: 60, borderStyle: 'dashed', color: '#627d98', borderColor: '#cbd5e1' }}
                                        >
                                            Ürün Seçiniz
                                        </Button>
                                    ) : (
                                        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', border: '1px solid #e2e8f0', borderRadius: 2 }}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Box>
                                                    <Typography variant="body2" fontWeight="600" sx={{ color: '#102a43' }}>
                                                        {formData.productName}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                        Fiyat: {formData.productPrice}
                                                    </Typography>
                                                </Box>
                                                <Button size="small" onClick={openProductModal} sx={{ minWidth: 'auto', p: 1 }}>Değiştir</Button>
                                            </Stack>
                                        </Paper>
                                    )}
                                </Box>

                            </Stack>
                        </CardContent>
                    </Card>

                    {/* Kaydet Butonu */}
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        disabled={!formData.storeId || !formData.productId}
                        sx={{
                            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                            color: 'white',
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 600,
                            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                        }}
                    >
                        Öneriyi Kaydet & Yayınla
                    </Button>
                </Grid>
            </Grid>

            {/* --- MAĞAZA SEÇİM MODALI --- */}
            <Dialog open={storeModalOpen} onClose={() => setStoreModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ pb: 1, fontWeight: 600 }}>Satıcı Mağaza Seç</DialogTitle>
                <IconButton
                    aria-label="close" onClick={() => setStoreModalOpen(false)}
                    sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                ><CloseIcon /></IconButton>
                <DialogContent dividers>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Mağaza adı ile ara..."
                        value={storeSearch}
                        onChange={(e) => setStoreSearch(e.target.value)}
                        sx={{ mb: 3 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary' }} /></InputAdornment>
                            ),
                        }}
                    />
                    <TableContainer>
                        <Table size="small">
                            <TableBody>
                                {filteredStores.map(store => (
                                    <TableRow key={store.id} hover onClick={() => setTempStoreId(store.id)} sx={{ cursor: 'pointer' }}>
                                        <TableCell padding="checkbox">
                                            <Radio checked={tempStoreId === store.id} />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={tempStoreId === store.id ? 600 : 400}>{store.name}</Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            {store.isGlobal && <Chip size="small" label="Global Platform" color="primary" variant="outlined" />}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredStores.length === 0 && (
                                    <TableRow><TableCell colSpan={3} align="center"><Typography color="text.secondary">Mağaza bulunamadı.</Typography></TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setStoreModalOpen(false)} color="inherit">İptal</Button>
                    <Button onClick={confirmStoreSelection} variant="contained" disabled={!tempStoreId}>Seçimi Onayla</Button>
                </DialogActions>
            </Dialog>

            {/* --- ÜRÜN SEÇİM MODALI --- */}
            <Dialog open={productModalOpen} onClose={() => setProductModalOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ pb: 1, fontWeight: 600 }}>Listelenecek Ürünü Seç</DialogTitle>
                <IconButton
                    aria-label="close" onClick={() => setProductModalOpen(false)}
                    sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                ><CloseIcon /></IconButton>
                <DialogContent dividers>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Ürün adı ile ara..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        sx={{ mb: 3 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary' }} /></InputAdornment>
                            ),
                        }}
                    />
                    <TableContainer>
                        <Table size="small">
                            <TableHead sx={{ bgcolor: '#f0f4f8' }}>
                                <TableRow>
                                    <TableCell padding="checkbox"></TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Ürün Adı</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Satıcı Mağaza</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600 }}>Fiyat</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredProducts.map(product => (
                                    <TableRow key={product.id} hover onClick={() => setTempProductId(product.id)} sx={{ cursor: 'pointer' }}>
                                        <TableCell padding="checkbox">
                                            <Radio checked={tempProductId === product.id} />
                                        </TableCell>
                                        <TableCell><Typography variant="body2" fontWeight={tempProductId === product.id ? 600 : 400}>{product.name}</Typography></TableCell>
                                        <TableCell><Typography variant="body2" color="text.secondary">{product.store}</Typography></TableCell>
                                        <TableCell align="right"><Typography variant="body2" fontWeight="600">{product.price}</Typography></TableCell>
                                    </TableRow>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3 }}><Typography color="text.secondary">Bu satıcıya ait ürün bulunamadı.</Typography></TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setProductModalOpen(false)} color="inherit">İptal</Button>
                    <Button onClick={confirmProductSelection} variant="contained" disabled={!tempProductId}>Ürünü Seç</Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default CreateRecommendedProductPage;
