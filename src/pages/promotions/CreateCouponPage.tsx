import React, { useState } from 'react';
import {
    Box, Typography, Card, CardContent, Button, TextField, Grid,
    MenuItem, Switch, FormControlLabel, Divider, IconButton, Radio, Chip
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon, Close as CloseIcon, TouchApp as TouchAppIcon, Star as StarIcon, Person as PersonIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ProductCategorySelectionModal from '../../components/common/ProductCategorySelectionModal';
import ProductSelectionModal, { ProductItem } from '../../components/common/ProductSelectionModal';
import CustomerSelectionModal, { CustomerItem } from '../../components/common/CustomerSelectionModal';
import CustomerGroupSelectionModal, { CustomerGroupItem } from '../../components/common/CustomerGroupSelectionModal';
import VariantSelectionModal, { VariantItem } from '../../components/common/VariantSelectionModal';
import BrandSelectionModal, { BrandItem } from '../../components/common/BrandSelectionModal';

const CreateCouponPage: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        code: '',
        type: 'percentage',
        value: '',
        minCartAmount: '',
        startDate: '',
        endDate: '',
        usageLimitType: 'unlimited',
        usageLimit: '',
        isActive: true,
        description: '',
        targetAudience: 'store_followers'
    });

    // İndirim Koşulları State'leri
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<ProductItem[]>([]);
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
        console.log('Submitting coupon data:', formData, {
            categories: selectedCategories,
            products: selectedProducts,
            customers: selectedCustomers,
            customerGroups: selectedCustomerGroups,
            variants: selectedVariants,
            brands: selectedBrands
        });
        // API isteği simülasyonu
        navigate('/promotions/coupons');
    };

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#f4f6f8', minHeight: 'calc(100vh - 64px)' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate('/promotions/coupons')} sx={{ mr: 2, bgcolor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#102a43' }}>
                    Yeni Kupon Oluştur
                </Typography>
            </Box>

            {/* Form Card */}
            <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                    {/* Kupon Tipini Belirleyin */}
                    <Typography variant="h6" sx={{ color: '#334e68', mb: 1, fontWeight: 600 }}>
                        Kupon tipini belirleyin
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#627d98', mb: 3 }}>
                        Mağazanızı takip edecek kitleye ve mağazanızı takip eden kitleye özel kupon oluşturabilir veya sistemimizin akıllı algoritmayla belirlediği kitleye özel kupon oluşturarak satışlarınızı destekleyebilirsiniz!
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        {/* Option 1 */}
                        <Grid item xs={12} md={6}>
                            <Card
                                variant="outlined"
                                sx={{
                                    cursor: 'pointer',
                                    borderColor: formData.targetAudience === 'store_followers' ? '#ff9800' : '#e0e0e0',
                                    borderWidth: formData.targetAudience === 'store_followers' ? 2 : 1,
                                    bgcolor: formData.targetAudience === 'store_followers' ? '#fff3e0' : 'white',
                                    height: '100%'
                                }}
                                onClick={() => setFormData(prev => ({ ...prev, targetAudience: 'store_followers' }))}
                            >
                                <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2, '&:last-child': { pb: 2 } }}>
                                    <Box sx={{ mr: 2 }}>
                                        <Radio disableRipple checked={formData.targetAudience === 'store_followers'} sx={{ color: '#ff9800', '&.Mui-checked': { color: '#ff9800' } }} />
                                    </Box>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#333' }}>Mağazamı takip edecek kitleye özel</Typography>
                                        <Typography variant="body2" color="text.secondary">Mağazanızı takip eden müşteriler, seçtiğiniz ürünlerde geçerli kupon kazanır.</Typography>
                                    </Box>
                                    <TouchAppIcon sx={{ color: '#ff9800', fontSize: 36, ml: 2 }} />
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Option 2 */}
                        <Grid item xs={12} md={6}>
                            <Card
                                variant="outlined"
                                sx={{
                                    cursor: 'pointer',
                                    borderColor: formData.targetAudience === 'current_followers' ? '#ff9800' : '#e0e0e0',
                                    borderWidth: formData.targetAudience === 'current_followers' ? 2 : 1,
                                    bgcolor: formData.targetAudience === 'current_followers' ? '#fff3e0' : 'white',
                                    height: '100%'
                                }}
                                onClick={() => setFormData(prev => ({ ...prev, targetAudience: 'current_followers' }))}
                            >
                                <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2, '&:last-child': { pb: 2 } }}>
                                    <Box sx={{ mr: 2 }}>
                                        <Radio disableRipple checked={formData.targetAudience === 'current_followers'} sx={{ color: '#ff9800', '&.Mui-checked': { color: '#ff9800' } }} />
                                    </Box>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#333' }}>Takipçilerime özel</Typography>
                                        <Typography variant="body2" color="text.secondary">Mağazanızı takip etmekte olan müşteriler kupon kazanabilir.</Typography>
                                    </Box>
                                    <StarIcon sx={{ color: '#ff9800', fontSize: 36, ml: 2 }} />
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Option 3 */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ position: 'relative', height: '100%' }}>
                                <Chip
                                    label="Yeni"
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        top: -10,
                                        right: 15,
                                        bgcolor: '#ff5722',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        zIndex: 1,
                                        fontSize: '0.7rem',
                                        height: 20
                                    }}
                                />
                                <Card
                                    variant="outlined"
                                    sx={{
                                        cursor: 'pointer',
                                        borderColor: formData.targetAudience === 'target_audience' ? '#ff9800' : '#e0e0e0',
                                        borderWidth: formData.targetAudience === 'target_audience' ? 2 : 1,
                                        bgcolor: formData.targetAudience === 'target_audience' ? '#fff3e0' : 'white',
                                        height: '100%',
                                        overflow: 'visible'
                                    }}
                                    onClick={() => setFormData(prev => ({ ...prev, targetAudience: 'target_audience' }))}
                                >
                                    <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2, '&:last-child': { pb: 2 } }}>
                                        <Box sx={{ mr: 2 }}>
                                            <Radio disableRipple checked={formData.targetAudience === 'target_audience'} sx={{ color: '#ff9800', '&.Mui-checked': { color: '#ff9800' } }} />
                                        </Box>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#333' }}>Hedef kitleye özel</Typography>
                                            <Typography variant="body2" color="text.secondary">Akıllı algoritma ile belirlenen müşteriler kupon kazanır.</Typography>
                                        </Box>
                                        <PersonIcon sx={{ color: '#ff9800', fontSize: 36, ml: 2 }} />
                                    </CardContent>
                                </Card>
                            </Box>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    <Typography variant="h6" sx={{ color: '#334e68', mb: 3, fontWeight: 600 }}>
                        Genel Kupon Bilgileri
                    </Typography>

                    <Grid container spacing={3}>
                        {/* Kupon Başlığı */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Kupon Başlığı *"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Örn: Bahar Kampanyası"
                                variant="outlined"
                                helperText="Sadece sizin referansınız içindir."
                            />
                        </Grid>

                        {/* Kupon Kodu */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Kupon Kodu *"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                placeholder="Örn: BAHAR25"
                                variant="outlined"
                                helperText="Müşterilerin gireceği kod."
                                inputProps={{ style: { textTransform: 'uppercase' } }}
                            />
                        </Grid>

                        {/* İndirim Türü */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                fullWidth
                                label="İndirim Türü *"
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
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label={
                                    formData.type === 'percentage' ? 'İndirim Yüzdesi (%) *' :
                                        formData.type === 'fixed_amount' ? 'İndirim Tutarı (₺) *' : 'Kargo İndirimi'
                                }
                                name="value"
                                value={formData.value}
                                onChange={handleChange}
                                placeholder={formData.type === 'percentage' ? 'Örn: 20' : 'Örn: 50'}
                                variant="outlined"
                                disabled={formData.type === 'free_shipping'}
                                InputProps={{
                                    endAdornment: formData.type !== 'free_shipping' ? (
                                        <Typography sx={{ color: 'text.secondary', ml: 1 }}>
                                            {formData.type === 'percentage' ? '%' : '₺'}
                                        </Typography>
                                    ) : null,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Minimum Sepet Tutarı (₺)"
                                name="minCartAmount"
                                value={formData.minCartAmount}
                                onChange={handleChange}
                                placeholder="Örn: 500"
                                variant="outlined"
                                helperText="İsteğe bağlı. Sadece belirli bir tutar üzerindeki sepetlerde geçerli olur."
                                InputProps={{
                                    endAdornment: <Typography sx={{ color: 'text.secondary', ml: 1 }}>₺</Typography>,
                                }}
                            />
                        </Grid>

                        {/* Kullanım Sınırı */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Kullanım Sınırı"
                                    name="usageLimitType"
                                    value={formData.usageLimitType}
                                    onChange={handleChange}
                                    variant="outlined"
                                >
                                    <MenuItem value="unlimited">Sınırsız Kullanım</MenuItem>
                                    <MenuItem value="limited">Toplam Kullanım Sayısı İle Sınırla</MenuItem>
                                </TextField>
                                {formData.usageLimitType === 'limited' && (
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Limit Adedi *"
                                        name="usageLimit"
                                        value={formData.usageLimit}
                                        onChange={handleChange}
                                        placeholder="Örn: 100"
                                        variant="outlined"
                                    />
                                )}
                            </Box>
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
                                label={formData.isActive ? "Kupon Aktif" : "Kupon Pasif"}
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
                            {['Kategoriler (Hepsi)', 'Ürünler (Hepsi)', 'Müşteriler (Hepsi)', 'Müşteri Grupları (Hepsi)', 'Varyant Seçenekleri (Hepsi)', 'Markalar (Hepsi)'].map((condition, index) => {
                                const isCategoryBtn = condition === 'Kategoriler (Hepsi)';
                                const isProductBtn = condition === 'Ürünler (Hepsi)';
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
                    </Box>

                    <Divider sx={{ my: 4 }} />

                    {/* Açıklama */}
                    <Box sx={{ mb: 4 }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Kupon Açıklaması"
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
                            onClick={() => navigate('/promotions/coupons')}
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
                            Kuponu Kaydet
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* İndirim Koşulları Modalları */}
            <ProductCategorySelectionModal
                open={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                onSelect={(categories) => setSelectedCategories(categories)}
            />

            <ProductSelectionModal
                open={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                onSelect={(products) => setSelectedProducts(products)}
                initialSelected={selectedProducts}
            />

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

export default CreateCouponPage;
