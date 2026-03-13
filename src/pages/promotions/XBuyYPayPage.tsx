import React, { useState } from 'react';
import {
    Box, Typography, Card, CardContent, Button, TextField, Grid,
    MenuItem, Switch, FormControlLabel, Divider, IconButton, Paper, Avatar
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon, Close as CloseIcon, CardGiftcard as CardGiftcardIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ProductSelectionModal, { ProductItem } from '../../components/common/ProductSelectionModal';
import CustomerSelectionModal, { CustomerItem } from '../../components/common/CustomerSelectionModal';
import CustomerGroupSelectionModal, { CustomerGroupItem } from '../../components/common/CustomerGroupSelectionModal';
import VariantSelectionModal, { VariantItem } from '../../components/common/VariantSelectionModal';
import BrandSelectionModal, { BrandItem } from '../../components/common/BrandSelectionModal';

const XBuyYPayPage: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        startDate: '',
        endDate: '',
        isActive: true,
        description: '',
        buyQuantity: 3, // X
        payQuantity: 2, // Y
    });

    // İlgili Ürünler State'leri
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<ProductItem[]>([]);

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
        console.log('Submitting X Buy Y Pay discount data:', formData, {
            products: selectedProducts,
            customers: selectedCustomers,
            customerGroups: selectedCustomerGroups,
            variants: selectedVariants,
            brands: selectedBrands
        });
        // TODO: Send data to API
        navigate('/promotions/discounts');
    };

    const renderSelectedProducts = (products: ProductItem[]) => {
        if (products.length === 0) {
            return (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 1 }}>
                    Henüz ürün seçilmedi. Tüm ürünlerde geçerli olacaktır (Varsayılan).
                </Typography>
            );
        }

        return (
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {products.map(product => (
                    <Paper key={product.id} sx={{ p: 1.5, display: 'flex', alignItems: 'center', bgcolor: '#fff3e0', border: '1px solid #ffe0b2' }}>
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
                    X Ürün Al Y Öde (Bedava) Kampanyası Oluştur
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
                                placeholder="Örn: 3 Al 2 Öde Tişört Kampanyası"
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
                                placeholder="Örn: XAL_YODE (İsteğe bağlı)"
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
                        Kampanya Koşul ve Kuralları (X Al Y Öde Mantığı)
                    </Typography>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={5}>
                            <Box sx={{ p: 3, bgcolor: '#fff8e1', borderRadius: 2, border: '1px solid #ffecb3', height: '100%' }}>
                                <Typography variant="subtitle1" fontWeight="bold" color="warning.main" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CardGiftcardIcon />
                                    Adet Ayarları
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Müşterinin sepetine eklemesi gereken toplam adet (X) ve ücretini ödeyeceği adet (Y) sayısını belirleyin. En düşük fiyatlı olan(lar) bedava sayılacaktır.
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Sepetteki Toplam Adet (X)"
                                            name="buyQuantity"
                                            value={formData.buyQuantity}
                                            onChange={handleChange}
                                            variant="outlined"
                                            InputProps={{ inputProps: { min: 2 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Ödenecek Adet (Y)"
                                            name="payQuantity"
                                            value={formData.payQuantity}
                                            onChange={handleChange}
                                            variant="outlined"
                                            InputProps={{ inputProps: { min: 1, max: formData.buyQuantity - 1 > 0 ? formData.buyQuantity - 1 : 1 } }}
                                            helperText={`${formData.buyQuantity - formData.payQuantity > 0 ? formData.buyQuantity - formData.payQuantity : 0} ürün bedava`}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={7}>
                            <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e1e8f0', height: '100%' }}>
                                <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
                                    Geçerli Olacağı Ürünler
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Kampanyanın hangi ürünler veya kategoriler arasında geçerli olacağını seçin. Seçim yapmazsanız sepetteki herhangi X üründe geçerli olur.
                                </Typography>

                                <Button
                                    variant="outlined"
                                    onClick={() => setIsProductModalOpen(true)}
                                    sx={{ mb: 2 }}
                                >
                                    Ürünleri Seç ({selectedProducts.length})
                                </Button>

                                {renderSelectedProducts(selectedProducts)}
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

            {/* Ürün Seçim Modalı */}
            <ProductSelectionModal
                open={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                onSelect={(products) => setSelectedProducts(products)}
                initialSelected={selectedProducts}
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

export default XBuyYPayPage;
