import React, { useState } from 'react';
import {
    Box, Typography, Card, CardContent, Button, TextField, Grid,
    MenuItem, Switch, FormControlLabel, Divider, IconButton
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon, Close as CloseIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ProductCategorySelectionModal from '../../components/common/ProductCategorySelectionModal';
import ProductSelectionModal, { ProductItem } from '../../components/common/ProductSelectionModal';
import CustomerSelectionModal, { CustomerItem } from '../../components/common/CustomerSelectionModal';
import CustomerGroupSelectionModal, { CustomerGroupItem } from '../../components/common/CustomerGroupSelectionModal';
import VariantSelectionModal, { VariantItem } from '../../components/common/VariantSelectionModal';
import BrandSelectionModal, { BrandItem } from '../../components/common/BrandSelectionModal';

const CreateDiscountPage: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        type: 'percentage',
        value: '',
        minOrderAmount: '',
        startDate: '',
        endDate: '',
        isActive: true,
        description: ''
    });

    // Kategori Seçimi State'leri
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    // Ürün Seçimi State'leri
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<ProductItem[]>([]);

    // Müşteri Seçimi State'leri
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const [selectedCustomers, setSelectedCustomers] = useState<CustomerItem[]>([]);

    // Müşteri Grubu Seçimi State'leri
    const [isCustomerGroupModalOpen, setIsCustomerGroupModalOpen] = useState(false);
    const [selectedCustomerGroups, setSelectedCustomerGroups] = useState<CustomerGroupItem[]>([]);

    // Varyant Seçimi State'leri
    const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
    const [selectedVariants, setSelectedVariants] = useState<VariantItem[]>([]);

    // Marka Seçimi State'leri
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
        console.log('Submitting discount data:', formData);
        // TODO: Send data to API
        navigate('/promotions/discounts');
    };

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#f4f6f8', minHeight: 'calc(100vh - 64px)' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate('/promotions/discounts')} sx={{ mr: 2, bgcolor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#102a43' }}>
                    Yeni İndirim Ekle
                </Typography>
            </Box>

            {/* Form Card */}
            <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                    <Typography variant="h6" sx={{ color: '#334e68', mb: 3, fontWeight: 600 }}>
                        Kampanya Detayları
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
                                placeholder="Örn: Yaza Merhaba İndirimi"
                                variant="outlined"
                            />
                        </Grid>

                        {/* İndirim Kodu */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="İndirim Kodu *"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                placeholder="Örn: YAZ20 (Müşterilerin gireceği kod)"
                                variant="outlined"
                                helperText="Eğer sistemin otomatik atamasını isterseniz boş bırakabilirsiniz (Geliştirilecek)."
                            />
                        </Grid>

                        {/* İndirim Türü */}
                        <Grid item xs={12} md={4}>
                            <TextField
                                select
                                fullWidth
                                label="İndirim Türü"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                variant="outlined"
                            >
                                <MenuItem value="percentage">Yüzde İndirimi (%)</MenuItem>
                                <MenuItem value="fixed_amount">Sabit Tutar İndirimi (₺)</MenuItem>
                                <MenuItem value="free_shipping">Ücretsiz Kargo</MenuItem>
                            </TextField>
                        </Grid>

                        {/* İndirim Değeri */}
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label={formData.type === 'percentage' ? 'İndirim Yüzdesi (%) *' : 'İndirim Tutarı (₺) *'}
                                name="value"
                                value={formData.value}
                                onChange={handleChange}
                                placeholder={formData.type === 'percentage' ? 'Örn: 20' : 'Örn: 50'}
                                variant="outlined"
                                disabled={formData.type === 'free_shipping'}
                            />
                        </Grid>

                        {/* Minimum Sepet Tutarı */}
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Minimum Sepet Tutarı (₺)"
                                name="minOrderAmount"
                                value={formData.minOrderAmount}
                                onChange={handleChange}
                                placeholder="Örn: 500"
                                variant="outlined"
                                helperText="Kampanyanın geçerli olması için gereken min. tutar."
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

                        {/* Açıklama */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Kampanya Açıklaması"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Müşterilere veya personelinize notlar..."
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

                    {/* İndirim Koşulları */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="subtitle1" sx={{ color: '#334e68', mb: 1, fontWeight: 600 }}>
                            İndirim Koşulları:
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#102a43', mb: 2, fontWeight: 500 }}>
                            Not: Tüm koşullar yerine geldiğinde indirim uygulanır.
                        </Typography>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                            {['Kategoriler', 'Ürünler', 'Müşteriler (Hepsi)', 'Müşteri Grupları (Hepsi)', 'Varyant Seçenekleri (Hepsi)', 'Markalar (Hepsi)'].map((condition, index) => {
                                const isCategoryBtn = condition === 'Kategoriler';
                                const isProductBtn = condition === 'Ürünler';
                                const isCustomerBtn = condition === 'Müşteriler (Hepsi)';
                                const isCustomerGroupBtn = condition === 'Müşteri Grupları (Hepsi)';
                                const isVariantBtn = condition === 'Varyant Seçenekleri (Hepsi)';
                                const isBrandBtn = condition === 'Markalar (Hepsi)';

                                let btnText = condition;
                                if (isCategoryBtn) {
                                    btnText = `Kategoriler (${selectedCategories.length > 0 ? selectedCategories.length + ' Seçildi' : 'Hepsi'})`;
                                } else if (isProductBtn) {
                                    btnText = `Ürünler (${selectedProducts.length > 0 ? selectedProducts.length + ' Seçildi' : 'Hepsi'})`;
                                } else if (isCustomerBtn) {
                                    btnText = `Müşteriler (${selectedCustomers.length > 0 ? selectedCustomers.length + ' Seçildi' : 'Hepsi'})`;
                                } else if (isCustomerGroupBtn) {
                                    btnText = `Müşteri Grupları (${selectedCustomerGroups.length > 0 ? selectedCustomerGroups.length + ' Seçildi' : 'Hepsi'})`;
                                } else if (isVariantBtn) {
                                    btnText = `Varyant Seçenekleri (${selectedVariants.length > 0 ? selectedVariants.length + ' Seçildi' : 'Hepsi'})`;
                                } else if (isBrandBtn) {
                                    btnText = `Markalar (${selectedBrands.length > 0 ? selectedBrands.length + ' Seçildi' : 'Hepsi'})`;
                                } else if (!condition.includes('Hepsi')) {
                                    btnText = condition + ' (Hepsi)'; // Add Hepsi back for those missing parentheticals that are unhandled
                                }

                                return (
                                    <Button
                                        key={index}
                                        variant="contained"
                                        disableElevation
                                        onClick={() => {
                                            if (isCategoryBtn) setIsCategoryModalOpen(true);
                                            if (isProductBtn) setIsProductModalOpen(true);
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
                                            border: (isCategoryBtn && selectedCategories.length > 0) || (isProductBtn && selectedProducts.length > 0) || (isCustomerBtn && selectedCustomers.length > 0) || (isCustomerGroupBtn && selectedCustomerGroups.length > 0) || (isVariantBtn && selectedVariants.length > 0) || (isBrandBtn && selectedBrands.length > 0) ? '1px solid #1890ff' : 'none',
                                        }}
                                    >
                                        {btnText}
                                    </Button>
                                );
                            })}
                        </Box>

                        <Box sx={{ bgcolor: '#fffbe6', p: 2, borderRadius: 1, border: '1px solid #ffe58f', display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#d48806' }}>
                                <Box component="span" sx={{ fontWeight: 'bold', mr: 0.5 }}>!</Box>
                                Belirtilen miktar ve üzerinde ise ürünün/varyantın birim fiyatı belirtilen fiyat olacaktır.
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 4 }} />

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

            {/* Kategori Seçim Modalı */}
            <ProductCategorySelectionModal
                open={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                onSelect={(categories) => {
                    setSelectedCategories(categories);
                }}
            />

            {/* Ürün Seçim Modalı */}
            <ProductSelectionModal
                open={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                onSelect={(products) => setSelectedProducts(products)}
                initialSelected={selectedProducts}
            />

            {/* Müşteri Seçim Modalı */}
            <CustomerSelectionModal
                open={isCustomerModalOpen}
                onClose={() => setIsCustomerModalOpen(false)}
                onSelect={(customers) => setSelectedCustomers(customers)}
                initialSelected={selectedCustomers}
            />

            {/* Müşteri Grubu Seçim Modalı */}
            <CustomerGroupSelectionModal
                open={isCustomerGroupModalOpen}
                onClose={() => setIsCustomerGroupModalOpen(false)}
                onSelect={(groups) => setSelectedCustomerGroups(groups)}
                initialSelected={selectedCustomerGroups}
            />

            {/* Varyant Seçim Modalı */}
            <VariantSelectionModal
                open={isVariantModalOpen}
                onClose={() => setIsVariantModalOpen(false)}
                onSelect={(variants) => setSelectedVariants(variants)}
                initialSelected={selectedVariants}
            />

            {/* Marka Seçim Modalı */}
            <BrandSelectionModal
                open={isBrandModalOpen}
                onClose={() => setIsBrandModalOpen(false)}
                onSelect={(brands) => setSelectedBrands(brands)}
                initialSelected={selectedBrands}
            />
        </Box>
    );
};

export default CreateDiscountPage;
