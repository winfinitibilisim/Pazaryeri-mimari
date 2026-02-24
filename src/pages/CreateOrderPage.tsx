import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    TextField,
    MenuItem,
    Button,
    Stack,
    Divider,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    Select,
    InputAdornment,
    IconButton
} from '@mui/material';
import {
    Save as SaveIcon,
    ArrowBack as ArrowBackIcon,
    Person as PersonIcon,
    ShoppingCart as ProductIcon,
    Receipt as OrderIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface ProductRow {
    id: number;
    name: string;
    quantity: number;
    price: number;
}

const CreateOrderPage: React.FC = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<ProductRow[]>([
        { id: Date.now(), name: '', quantity: 1, price: 0 }
    ]);

    const handleAddProduct = () => {
        setProducts([
            ...products,
            { id: Date.now(), name: '', quantity: 1, price: 0 }
        ]);
    };

    const handleRemoveProduct = (id: number) => {
        if (products.length > 1) {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    const handleProductChange = (id: number, field: keyof ProductRow, value: string | number) => {
        setProducts(products.map(p => {
            if (p.id === id) {
                return { ...p, [field]: value };
            }
            return p;
        }));
    };

    // Calculate totals
    const subtotal = products.reduce((sum, p) => sum + (p.quantity * p.price), 0);
    const tax = subtotal * 0.20; // 20% KDV
    const total = subtotal + tax;

    return (
        <Box>
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/orders')}
                    color="inherit"
                >
                    Geri Dön
                </Button>
                <Typography variant="h5" fontWeight="600">
                    Yeni Sipariş Oluştur
                </Typography>
            </Stack>

            <Grid container spacing={3}>
                {/* Customer Information */}
                <Grid item xs={12} md={8}>
                    <Card elevation={0} sx={{ border: '1px solid #e0e0e0', mb: 3 }}>
                        <CardContent>
                            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                                <PersonIcon color="primary" />
                                <Typography variant="h6" fontWeight="600">
                                    Müşteri Bilgileri
                                </Typography>
                            </Stack>
                            <Divider sx={{ mb: 3 }} />

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Ad Soyad" fullWidth required />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="E-posta" fullWidth type="email" required />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Telefon" fullWidth />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="TC Kimlik No" fullWidth />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="İl" select fullWidth>
                                        <MenuItem value="istanbul">İstanbul</MenuItem>
                                        <MenuItem value="ankara">Ankara</MenuItem>
                                        <MenuItem value="izmir">İzmir</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="İlçe" select fullWidth>
                                        <MenuItem value="kadikoy">Kadıköy</MenuItem>
                                        <MenuItem value="besiktas">Beşiktaş</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField label="Açık Adres" fullWidth multiline rows={3} />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Product Information */}
                    <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                        <CardContent>
                            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                                <ProductIcon color="primary" />
                                <Typography variant="h6" fontWeight="600">
                                    Ürün Bilgileri
                                </Typography>
                            </Stack>
                            <Divider sx={{ mb: 3 }} />

                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField label="Ürün Ara / Barkod Okut" fullWidth placeholder="Ürün adı veya barkod giriniz..." />
                                </Grid>

                                {/* Product Lines */}
                                {products.map((product, index) => (
                                    <Grid item xs={12} key={product.id}>
                                        <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 2, position: 'relative' }}>
                                            <Stack direction="row" spacing={2} alignItems="flex-start">
                                                <Grid container spacing={2} alignItems="center">
                                                    <Grid item xs={12} sm={5}>
                                                        <TextField
                                                            label="Ürün Adı"
                                                            fullWidth
                                                            value={product.name}
                                                            onChange={(e) => handleProductChange(product.id, 'name', e.target.value)}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6} sm={2}>
                                                        <TextField
                                                            label="Adet"
                                                            type="number"
                                                            fullWidth
                                                            value={product.quantity}
                                                            onChange={(e) => handleProductChange(product.id, 'quantity', parseInt(e.target.value) || 0)}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6} sm={2}>
                                                        <TextField
                                                            label="Birim Fiyat"
                                                            type="number"
                                                            fullWidth
                                                            value={product.price}
                                                            onChange={(e) => handleProductChange(product.id, 'price', parseFloat(e.target.value) || 0)}
                                                            InputProps={{
                                                                startAdornment: <InputAdornment position="start">₺</InputAdornment>,
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6} sm={2}>
                                                        <TextField
                                                            label="Toplam"
                                                            type="number"
                                                            fullWidth
                                                            disabled
                                                            value={product.quantity * product.price}
                                                            InputProps={{
                                                                startAdornment: <InputAdornment position="start">₺</InputAdornment>,
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6} sm={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => handleRemoveProduct(product.id)}
                                                            disabled={products.length === 1}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                            </Stack>
                                        </Box>
                                    </Grid>
                                ))}

                                <Grid item xs={12}>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<ProductIcon />}
                                        onClick={handleAddProduct}
                                    >
                                        + Başka Ürün Ekle
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Order Details & Summary */}
                <Grid item xs={12} md={4}>
                    <Card elevation={0} sx={{ border: '1px solid #e0e0e0', mb: 3 }}>
                        <CardContent>
                            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                                <OrderIcon color="primary" />
                                <Typography variant="h6" fontWeight="600">
                                    Sipariş Detayları
                                </Typography>
                            </Stack>
                            <Divider sx={{ mb: 3 }} />

                            <Stack spacing={3}>
                                <FormControl fullWidth>
                                    <InputLabel>Sipariş Durumu</InputLabel>
                                    <Select label="Sipariş Durumu" defaultValue="new">
                                        <MenuItem value="new">Yeni</MenuItem>
                                        <MenuItem value="preparing">Hazırlanıyor</MenuItem>
                                        <MenuItem value="shipped">Kargoda</MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth>
                                    <InputLabel>Ödeme Yöntemi</InputLabel>
                                    <Select label="Ödeme Yöntemi" defaultValue="credit_card">
                                        <MenuItem value="credit_card">Kredi Kartı</MenuItem>
                                        <MenuItem value="bank_transfer">Havale / EFT</MenuItem>
                                        <MenuItem value="cod">Kapıda Ödeme</MenuItem>
                                    </Select>
                                </FormControl>

                                <TextField
                                    label="Kargo Firması"
                                    select
                                    fullWidth
                                >
                                    <MenuItem value="yurtici">Yurtiçi Kargo</MenuItem>
                                    <MenuItem value="aras">Aras Kargo</MenuItem>
                                    <MenuItem value="mng">MNG Kargo</MenuItem>
                                </TextField>

                                <TextField
                                    label="Sipariş Notu"
                                    multiline
                                    rows={4}
                                    fullWidth
                                    placeholder="Müşteri veya yönetici notu..."
                                />
                            </Stack>
                        </CardContent>
                    </Card>

                    <Card elevation={0} sx={{ border: '1px solid #e0e0e0', bgcolor: '#f8f9fa' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom fontWeight="600">Özet</Typography>
                            <Stack spacing={1} mb={2}>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography color="text.secondary">Ara Toplam</Typography>
                                    <Typography fontWeight="500">{subtotal.toFixed(2)} ₺</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography color="text.secondary">KDV (%20)</Typography>
                                    <Typography fontWeight="500">{tax.toFixed(2)} ₺</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography color="text.secondary">Kargo</Typography>
                                    <Typography fontWeight="500">0,00 ₺</Typography>
                                </Stack>
                                <Divider />
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="h6" color="primary.main">Toplam</Typography>
                                    <Typography variant="h6" color="primary.main">{total.toFixed(2)} ₺</Typography>
                                </Stack>
                            </Stack>

                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                startIcon={<SaveIcon />}
                                disableElevation
                                onClick={() => navigate('/orders')}
                            >
                                Siparişi Kaydet
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CreateOrderPage;
