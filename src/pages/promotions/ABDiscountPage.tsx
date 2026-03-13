import React, { useState } from 'react';
import {
    Box, Typography, Card, CardContent, Button, TextField, Grid,
    MenuItem, Switch, FormControlLabel, Divider, IconButton, Paper, Avatar
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon, Close as CloseIcon, Inventory as InventoryIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ProductSelectionModal, { ProductItem } from '../../components/common/ProductSelectionModal';
import CustomerSelectionModal, { CustomerItem } from '../../components/common/CustomerSelectionModal';
import CustomerGroupSelectionModal, { CustomerGroupItem } from '../../components/common/CustomerGroupSelectionModal';
import VariantSelectionModal, { VariantItem } from '../../components/common/VariantSelectionModal';
import BrandSelectionModal, { BrandItem } from '../../components/common/BrandSelectionModal';

const ABDiscountPage: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        startDate: '',
        endDate: '',
        isActive: true,
        description: '',
        productAQuantity: 1,
        discountType: 'percentage',
        discountValue: '',
    });

    // A Ürünü (Tetikleyici Ürün) State'leri
    const [isProductAModalOpen, setIsProductAModalOpen] = useState(false);
    const [selectedProductA, setSelectedProductA] = useState<ProductItem[]>([]);

    // B Ürünü (İndirimli Ürün) State'leri
    const [isProductBModalOpen, setIsProductBModalOpen] = useState(false);
    const [selectedProductB, setSelectedProductB] = useState<ProductItem[]>([]);

    // İndirim Koşulları State'leri
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const [selectedCustomers, setSelectedCustomers] = useState<CustomerItem[]>([]);
    const [isCustomerGroupModalOpen, setIsCustomerGroupModalOpen] = useState(false);
    const [selectedCustomerGroups, setSelectedCustomerGroups] = useState<CustomerGroupItem[]>([]);
    const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
    const [selectedVariants, setSelectedVariants] = useState<VariantItem[]>([]);
    const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
    const [selectedBrands, setSelectedBrands] = useState<BrandItem[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = () => {
        console.log('Submitting A+B discount data:', formData, {
            productA: selectedProductA,
            productB: selectedProductB,
            customers: selectedCustomers,
            customerGroups: selectedCustomerGroups,
            variants: selectedVariants,
            brands: selectedBrands
        });
        // TODO: Send data to API
        navigate('/promotions/discounts'); // Or custom list page
    };

    const renderSelectedProducts = (products: ProductItem[], type: 'A' | 'B') => {
        if (products.length === 0) {
            return (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 1 }}>
                    Henüz ürün seçilmedi.
                </Typography>
            );
        }

        return (
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {products.map(product => (
                    <Paper key={product.id} sx={{ p: 1.5, display: 'flex', alignItems: 'center', bgcolor: type === 'A' ? '#eef2f6' : '#e8f5e9', border: `1px solid ${type === 'A' ? '#c3d4e6' : '#c8e6c9'}` }}>
                        <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: 'white' }}>{product.image}</Avatar>
                        <Box>
                            <Typography variant="body2" fontWeight="bold">{product.name}</Typography>
                            <Typography variant="caption" color="text.secondary">SKU: {product.sku}</Typography>
                        </Box>
                    </Paper>
                ))}
            </Box>
        );
    };

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#f4f6f8', minHeight: 'calc(100vh - 64px)' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate('/promotions/discounts')} sx={{ mr: 2, bgcolor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#102a43' }}>
                    A Ürünü + B Ürünü Kampanyası Oluştur
                </Typography>
            </Box>

            {/* Form Card */}
            <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                    <Typography variant="h6" sx={{ color: '#334e68', mb: 3, fontWeight: 600 }}>
                        Genel Kampanya Bilgileri
                    </Typography>

                    <Grid container spacing={3}>
                        {/* Kampanya Adı */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Kampanya Adı *"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Örn: 1 Gömlek Alana 1 Kravat Bedava"
                                variant="outlined"
                            />
                        </Grid>

                        {/* İndirim Kodu */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Kampanya Kodu"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                placeholder="Örn: GOMLEK_KRAVAT (İsteğe bağlı)"
                                variant="outlined"
                                helperText="Otomatik uygulanmasını istiyorsanız boş bırakın."
                            />
                        </Grid>

                        {/* Başlangıç Tarihi */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Başlangıç Tarihi *"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                variant="outlined"
                            />
                        </Grid>

                        {/* Bitiş Tarihi */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Bitiş Tarihi *"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                variant="outlined"
                            />
                        </Grid>

                        {/* Durum (Aktif/Pasif) */}
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isActive}
                                        onChange={handleChange}
                                        name="isActive"
                                        color="primary"
                                    />
                                }
                                label={formData.isActive ? "Kampanya Aktif" : "Kampanya Pasif"}
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    <Typography variant="h6" sx={{ color: '#334e68', mb: 3, fontWeight: 600 }}>
                        Kampanya Koşul ve Kuralları (A + B Mantığı)
                    </Typography>

                    <Grid container spacing={4}>
                        {/* A Ürünü Alanı */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e1e8f0', height: '100%' }}>
                                <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <InventoryIcon />
                                    "A Ürünü" (Şart)
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Müşterinin sepetine eklemesi gereken zorunlu ürünleri seçin.
                                </Typography>

                                <Button
                                    variant="outlined"
                                    onClick={() => setIsProductAModalOpen(true)}
                                    fullWidth
                                    sx={{ mb: 3 }}
                                >
                                    A Ürünlerini Seç ({selectedProductA.length})
                                </Button>

                                <TextField
                                    fullWidth
                                    type="number"
                                    label="A Ürününden Kaç Adet Alınmalı?"
                                    name="productAQuantity"
                                    value={formData.productAQuantity}
                                    onChange={handleChange}
                                    variant="outlined"
                                    InputProps={{ inputProps: { min: 1 } }}
                                    sx={{ mb: 2 }}
                                />

                                {renderSelectedProducts(selectedProductA, 'A')}
                            </Box>
                        </Grid>

                        {/* B Ürünü Alanı */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 3, bgcolor: '#f0fdf4', borderRadius: 2, border: '1px solid #bbf7d0', height: '100%' }}>
                                <Typography variant="subtitle1" fontWeight="bold" color="success.main" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <InventoryIcon />
                                    "B Ürünü" (Ödül)
                                </Typography>
                                <Typography variant="body2" color="success.dark" sx={{ mb: 3 }}>
                                    Şart sağlandığında indirimli veya bedava verilecek ürünü seçin.
                                </Typography>

                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => setIsProductBModalOpen(true)}
                                    fullWidth
                                    sx={{ mb: 3 }}
                                >
                                    B Ürünlerini Seç ({selectedProductB.length})
                                </Button>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            select
                                            fullWidth
                                            label="Uygulanacak İndirim Türü"
                                            name="discountType"
                                            value={formData.discountType}
                                            onChange={handleChange}
                                            variant="outlined"
                                        >
                                            <MenuItem value="percentage">Yüzde İndirimi (%)</MenuItem>
                                            <MenuItem value="fixed_amount">Sabit Tutar İndirimi (₺)</MenuItem>
                                            <MenuItem value="free">Bedava (%100 İndirim)</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label={formData.discountType === 'percentage' ? 'İndirim Yüzdesi (%)' : 'İndirim Tutarı (₺)'}
                                            name="discountValue"
                                            value={formData.discountValue}
                                            onChange={handleChange}
                                            variant="outlined"
                                            disabled={formData.discountType === 'free'}
                                        />
                                    </Grid>
                                </Grid>

                                {renderSelectedProducts(selectedProductB, 'B')}
                            </Box>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    {/* İndirim Koşulları */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="subtitle1" sx={{ color: '#334e68', mb: 1, fontWeight: 600 }}>
                            İndirim Koşulları:
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#102a43', mb: 2, fontWeight: 500 }}>
                            Not: Tüm koşullar yerine geldiğinde indirim uygulanır.
                        </Typography>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                            {['Müşteriler (Hepsi)', 'Müşteri Grupları (Hepsi)', 'Varyant Seçenekleri (Hepsi)', 'Markalar (Hepsi)'].map((condition, index) => {
                                const isCustomerBtn = condition === 'Müşteriler (Hepsi)';
                                const isCustomerGroupBtn = condition === 'Müşteri Grupları (Hepsi)';
                                const isVariantBtn = condition === 'Varyant Seçenekleri (Hepsi)';
                                const isBrandBtn = condition === 'Markalar (Hepsi)';

                                let btnText = condition;
                                if (isCustomerBtn) {
                                    btnText = `Müşteriler (${selectedCustomers.length > 0 ? selectedCustomers.length + ' Seçildi' : 'Hepsi'})`;
                                } else if (isCustomerGroupBtn) {
                                    btnText = `Müşteri Grupları (${selectedCustomerGroups.length > 0 ? selectedCustomerGroups.length + ' Seçildi' : 'Hepsi'})`;
                                } else if (isVariantBtn) {
                                    btnText = `Varyant Seçenekleri (${selectedVariants.length > 0 ? selectedVariants.length + ' Seçildi' : 'Hepsi'})`;
                                } else if (isBrandBtn) {
                                    btnText = `Markalar (${selectedBrands.length > 0 ? selectedBrands.length + ' Seçildi' : 'Hepsi'})`;
                                }

                                return (
                                    <Button
                                        key={index}
                                        variant="contained"
                                        disableElevation
                                        onClick={() => {
                                            if (isCustomerBtn) setIsCustomerModalOpen(true);
                                            if (isCustomerGroupBtn) setIsCustomerGroupModalOpen(true);
                                            if (isVariantBtn) setIsVariantModalOpen(true);
                                            if (isBrandBtn) setIsBrandModalOpen(true);
                                        }}
                                        sx={{
                                            bgcolor: '#f0f0f0',
                                            color: '#595959',
                                            '&:hover': {
                                                bgcolor: '#e8e8e8',
                                            },
                                            textTransform: 'none',
                                            borderRadius: 1,
                                            border: (isCustomerBtn && selectedCustomers.length > 0) || (isCustomerGroupBtn && selectedCustomerGroups.length > 0) || (isVariantBtn && selectedVariants.length > 0) || (isBrandBtn && selectedBrands.length > 0) ? '1px solid #1890ff' : 'none',
                                        }}
                                    >
                                        {btnText}
                                    </Button>
                                );
                            })}
                        </Box>
                    </Box>

                    <Divider sx={{ my: 4 }} />

                    {/* Açıklama */}
                    <Box sx={{ mb: 4 }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Kampanya İçin Ek Açıklama"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Müşterilere veya personelinize notlar..."
                            variant="outlined"
                        />
                    </Box>

                    {/* Aksiyon Butonları */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<CloseIcon />}
                            onClick={() => navigate('/promotions/discounts')}
                            sx={{ color: '#627d98', borderColor: '#d9e2ec' }}
                        >
                            İptal Et
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSubmit}
                            sx={{
                                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                                color: 'white',
                                px: 4,
                            }}
                        >
                            Kampanyayı Kaydet
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* A Ürünü Seçim Modalı */}
            <ProductSelectionModal
                open={isProductAModalOpen}
                onClose={() => setIsProductAModalOpen(false)}
                onSelect={(products) => setSelectedProductA(products)}
                initialSelected={selectedProductA}
            />

            {/* B Ürünü Seçim Modalı */}
            <ProductSelectionModal
                open={isProductBModalOpen}
                onClose={() => setIsProductBModalOpen(false)}
                onSelect={(products) => setSelectedProductB(products)}
                initialSelected={selectedProductB}
            />

            {/* İndirim Koşulları Modalları */}
            <CustomerSelectionModal
                open={isCustomerModalOpen}
                onClose={() => setIsCustomerModalOpen(false)}
                onSelect={(customers) => setSelectedCustomers(customers)}
                initialSelected={selectedCustomers}
            />

            <CustomerGroupSelectionModal
                open={isCustomerGroupModalOpen}
                onClose={() => setIsCustomerGroupModalOpen(false)}
                onSelect={(groups) => setSelectedCustomerGroups(groups)}
                initialSelected={selectedCustomerGroups}
            />

            <VariantSelectionModal
                open={isVariantModalOpen}
                onClose={() => setIsVariantModalOpen(false)}
                onSelect={(variants) => setSelectedVariants(variants)}
                initialSelected={selectedVariants}
            />

            <BrandSelectionModal
                open={isBrandModalOpen}
                onClose={() => setIsBrandModalOpen(false)}
                onSelect={(brands) => setSelectedBrands(brands)}
                initialSelected={selectedBrands}
            />
        </Box>
    );
};

export default ABDiscountPage;
