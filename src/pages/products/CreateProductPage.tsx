import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../../contexts/CategoryContext';
import { initialOptions, ProductOption } from './ProductOptionsPage';
import {
    Box,
    Typography,
    Paper,
    Button,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    InputAdornment,
    Divider,
    Chip,
    OutlinedInput,
    Autocomplete,
    IconButton,
    LinearProgress,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    Tabs,
    Tab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Badge
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    CloudUpload as CloudUploadIcon,
    Info as InfoIcon,
    Star as StarIcon,
    MonetizationOn as PriceIcon,
    Inventory2 as StockIcon,
    CameraAlt as PhotoIcon,
    Assessment as TaxIcon,
    Label as TagIcon,
    Videocam as VideoIcon,
    Settings as FeaturesIcon,
    Tune as OptionsIcon,
    Sync as VariantsIcon,
    CardGiftcard as PromotionsIcon,
    Storefront as ShowcaseIcon,
    Link as SimilarProductsIcon,
    CreditCard as ExtraPriceIcon,
    Business as SupplierIcon,
    Close as CloseIcon,
    Delete as DeleteIcon,
    StarOutline as StarOutlineIcon,
    CheckCircle as CheckCircleIcon,
    Search as SearchIcon,
    SwapVert as SwapVertIcon,
    CloudUploadOutlined as CloudUploadOutlinedIcon,
    CropFree as CropFreeIcon,
    Layers as LayersIcon,
    InsertPhoto as InsertPhotoIcon
} from '@mui/icons-material';

interface VariantRow {
    id: string;
    color?: string;
    size?: string;
    ram?: string;
    screenSize?: string;
    barcode: string;
    sku: string;
    price: string;
    stock: string;
    images: string[];
    selected?: boolean;
}

const CreateProductPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);

    // Basic Details
    const [productName, setProductName] = useState('');
    const [sku, setSku] = useState('');
    const [barcode, setBarcode] = useState('');
    const [description, setDescription] = useState('');

    // Pricing & Stock
    const [purchasePrice, setPurchasePrice] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [currency, setCurrency] = useState('TRY');
    const [stock, setStock] = useState('');
    const [taxRate, setTaxRate] = useState('18');

    // Classification
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('Nike');
    const [productClass, setProductClass] = useState('');
    const [selectedProductOption, setSelectedProductOption] = useState('');
    const [selectedProductFeature, setSelectedProductFeature] = useState('');

    // Dependent Option Values
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);

    // Dependent Feature Values
    const [selectedProcessor, setSelectedProcessor] = useState<string[]>([]);
    const [selectedRam, setSelectedRam] = useState<string[]>([]);
    const [selectedOs, setSelectedOs] = useState<string[]>([]);

    const [selectedEmmc, setSelectedEmmc] = useState<string[]>([]);
    const [selectedGpuMemoryType, setSelectedGpuMemoryType] = useState<string[]>([]);
    const [selectedScreenPanel, setSelectedScreenPanel] = useState<string[]>([]);
    const [selectedProcessorGen, setSelectedProcessorGen] = useState<string[]>([]);
    const [selectedMaxSpeed, setSelectedMaxSpeed] = useState<string[]>([]);
    const [selectedMemorySpeed, setSelectedMemorySpeed] = useState<string[]>([]);
    const [selectedBluetooth, setSelectedBluetooth] = useState<string[]>([]);
    const [selectedWeight, setSelectedWeight] = useState<string[]>([]);
    const [selectedTouch, setSelectedTouch] = useState<string[]>([]);
    const [selectedScreenSize, setSelectedScreenSize] = useState<string[]>([]);
    const [selectedGpu, setSelectedGpu] = useState<string[]>([]);
    const [selectedGpuMemory, setSelectedGpuMemory] = useState<string[]>([]);

    const [selectedFabric, setSelectedFabric] = useState<string[]>([]);
    const [selectedCollar, setSelectedCollar] = useState<string[]>([]);

    const [selectedMaterial, setSelectedMaterial] = useState<string[]>([]);
    const [selectedHeel, setSelectedHeel] = useState<string[]>([]);

    // Attributes
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedIcons, setSelectedIcons] = useState<string[]>([]);

    // Toggles
    const [isActive, setIsActive] = useState(true);
    const [isFeatured, setIsFeatured] = useState(false);

    // Images
    const [images, setImages] = useState<string[]>([]);
    const [isDragActive, setIsDragActive] = useState(false);
    const [mainImageIndex, setMainImageIndex] = useState<number>(0);

    // Variants State
    const [variants, setVariants] = useState<VariantRow[]>([]);
    const [bulkPrice, setBulkPrice] = useState('');
    const [bulkStock, setBulkStock] = useState('');

    React.useEffect(() => {
        let newVariants: VariantRow[] = [];

        if (productClass === 'Tişört Şablonu') {
            const hasOptions = availableColors.length > 0 || availableSizes.length > 0;
            const hasSelection = selectedColors.length > 0 || selectedSizes.length > 0;

            if (hasOptions && !hasSelection) {
                setVariants([]);
                return;
            }

            const colors = selectedColors.length > 0 ? selectedColors : [undefined];
            const sizes = selectedSizes.length > 0 ? selectedSizes : [undefined];

            colors.forEach(c => {
                sizes.forEach(s => {
                    newVariants.push({
                        id: `${c || 'TekRenk'}-${s || 'TekBeden'}`,
                        color: c,
                        size: s,
                        barcode: '', sku: '', price: '', stock: '', images: [], selected: false
                    });
                });
            });
        } else if (productClass === 'Bilgisayar Şablonu') {
            const hasOptions = availableRams.length > 0 || availableScreenSize.length > 0;
            const hasSelection = selectedRam.length > 0 || selectedScreenSize.length > 0;

            if (hasOptions && !hasSelection) {
                setVariants([]);
                return;
            }

            const rams = selectedRam.length > 0 ? selectedRam : [undefined];
            const screenSizes = selectedScreenSize.length > 0 ? selectedScreenSize : [undefined];

            rams.forEach(r => {
                screenSizes.forEach(s => {
                    newVariants.push({
                        id: `RAM${r || 'Tek'}-EKRAN${s || 'Tek'}`,
                        ram: r,
                        screenSize: s,
                        barcode: '', sku: '', price: '', stock: '', images: [], selected: false
                    });
                });
            });
        } else if (productClass === 'Ayakkabı Şablonu') {
            const hasOptions = availableNumbers.length > 0;
            const hasSelection = selectedNumbers.length > 0;

            if (hasOptions && !hasSelection) {
                setVariants([]);
                return;
            }

            const numbers = selectedNumbers.length > 0 ? selectedNumbers : [undefined];

            numbers.forEach(n => {
                newVariants.push({
                    id: `No${n || 'Tek'}`,
                    size: n,
                    barcode: '', sku: '', price: '', stock: '', images: [], selected: false
                });
            });
        }

        setVariants(prev => newVariants.map(nv => {
            const existing = prev.find(p => p.id === nv.id);
            return existing ? { ...existing, selected: false } : nv;
        }));
    }, [selectedColors, selectedSizes, selectedNumbers, selectedRam, selectedScreenSize, productClass]);

    const handleVariantChange = (id: string, field: keyof VariantRow, value: any) => {
        setVariants(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
    };

    const handleSelectAllVariants = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVariants(prev => prev.map(v => ({ ...v, selected: event.target.checked })));
    };

    const applyBulkActions = () => {
        setVariants(prev => prev.map(v => {
            if (v.selected) {
                return {
                    ...v,
                    price: bulkPrice ? bulkPrice : v.price,
                    stock: bulkStock ? bulkStock : v.stock
                };
            }
            return v;
        }));
        setBulkPrice('');
        setBulkStock('');
    };

    const assignBarcodes = () => {
        setVariants(prev => prev.map(v => {
            // Generate a random 13-digit EAN-like barcode
            const randomBarcode = Math.floor(Math.random() * 10000000000000).toString().padStart(13, '0');
            return {
                ...v,
                barcode: randomBarcode
            };
        }));
    };

    const assignSkus = () => {
        setVariants(prev => prev.map((v, index) => {
            const generatedSku = `SKU-${Date.now().toString().slice(-6)}-${index + 1}`;
            return {
                ...v,
                sku: generatedSku
            };
        }));
    };

    const removeBarcodes = () => {
        setVariants(prev => prev.map(v => ({
            ...v,
            barcode: ''
        })));
    };

    const handleDeleteVariant = (id: string) => {
        setVariants(prev => prev.filter(v => v.id !== id));
    };

    // Variant Media Modal State
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
    const [currentVariantIdForMedia, setCurrentVariantIdForMedia] = useState<string | null>(null);
    const [mediaModalTab, setMediaModalTab] = useState(0);
    const [mediaSubTab, setMediaSubTab] = useState(0);
    const [selectedMediaInModal, setSelectedMediaInModal] = useState<string[]>([]);
    const modalFileInputRef = React.useRef<HTMLInputElement>(null);

    const handleModalFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const filesArray = Array.from(event.target.files);
            const newImageUrls = filesArray.map(file => URL.createObjectURL(file));
            setSelectedMediaInModal(prev => {
                const combined = [...prev, ...newImageUrls];
                return combined.slice(0, 10); // En fazla 10 görsel
            });
        }
    };

    // Dummy gallery images for the modal
    const dummyGalleryImages = Array.from({ length: 12 }).map((_, i) => `https://mui.com/static/images/avatar/${(i % 5) + 1}.jpg`);

    const handleOpenMediaModal = (variantId: string) => {
        setCurrentVariantIdForMedia(variantId);
        const variant = variants.find(v => v.id === variantId);
        setSelectedMediaInModal(variant ? variant.images || [] : []);
        setMediaSubTab(0);
        setIsMediaModalOpen(true);
    };

    const handleCloseMediaModal = () => {
        setIsMediaModalOpen(false);
        setCurrentVariantIdForMedia(null);
        setSelectedMediaInModal([]);
    };

    const handleSaveVariantMedia = () => {
        if (currentVariantIdForMedia) {
            handleVariantChange(currentVariantIdForMedia, 'images', selectedMediaInModal);
        }
        handleCloseMediaModal();
    };

    const toggleMediaSelect = (img: string) => {
        if (selectedMediaInModal.includes(img)) {
            setSelectedMediaInModal(prev => prev.filter(i => i !== img));
        } else {
            if (selectedMediaInModal.length < 10) {
                setSelectedMediaInModal(prev => [...prev, img]);
            }
        }
    };

    const { getFlatCategoryNames, getCategoryToClassesMap } = useCategories();
    const categories = getFlatCategoryNames();
    const brands = ['winfini', 'Nike', 'Apple', 'Samsung', 'Adidas', 'Sony'];
    const products = ['Elbise', 'Tişört', 'Ayakkabı', 'Telefon', 'Bilgisayar'];

    // Seçili kategoriye göre kullanılabilir seçenekleri state'te güncelleriz
    const [availableSizes, setAvailableSizes] = useState<string[]>([]);
    const [availableColors, setAvailableColors] = useState<string[]>([]);

    React.useEffect(() => {
        if (category) {
            // ProductOptionsPage içerisindeki yapılandırılmış gerçek veri setini kullanıyoruz
            const matchedOptions = initialOptions.filter(opt =>
                opt.categories.some(c => category.toLowerCase().includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(category.toLowerCase()))
            );

            const colorOption = matchedOptions.find(o => o.name.toLowerCase().includes('renk'));
            const sizeOption = matchedOptions.find(o => o.name.toLowerCase().includes('beden') || o.name.toLowerCase().includes('numara'));

            const newSizes = sizeOption ? sizeOption.values.map(v => v.name) : [];
            const newColors = colorOption ? colorOption.values.map(v => v.name) : [];

            setAvailableSizes(newSizes);
            setAvailableColors(newColors);

            // Eğer kategori değiştiyse ve eski seçili değerler yeni available listede yoksa temizle
            setSelectedSizes(prev => prev.filter(p => newSizes.includes(p)));
            setSelectedColors(prev => prev.filter(p => newColors.includes(p)));
        } else {
            setAvailableSizes([]);
            setAvailableColors([]);
        }
    }, [category]);

    const classes = ['Tişört Şablonu', 'Bilgisayar Şablonu', 'Ayakkabı Şablonu', 'Genel Şablon'];

    const categoryToClassesMap = getCategoryToClassesMap();

    // Calculate available classes based on selected category, fallback to all if no category selected
    const availableClasses = category ? (categoryToClassesMap[category] || []) : classes;

    const availableTags = ['YENİ', 'Çok Satan', 'Tükendi', 'Fırsat', 'Ücretsiz Kargo'];
    const availableIcons = ['2 Yıl Garanti', 'Hızlı Kargo', 'Yerli Üretim', 'Organik', 'Vegan'];

    const availableNumbers = ['36', '37', '38', '39', '40', '41', '42', '43', '44'];

    const availableProcessors = ['Intel Core i5', 'Intel Core i7', 'AMD Ryzen 5', 'AMD Ryzen 7', 'Apple M1', 'Apple M2'];
    const availableRams = ['8 GB', '16 GB', '32 GB', '64 GB'];
    const availableOs = ['Windows 11', 'FreeDOS', 'macOS'];

    const availableEmmc = ['Yok', '32 GB', '64 GB', '128 GB', '256 GB', '512 GB', '1 TB'];
    const availableGpuMemoryType = ['Yok', 'DDR3', 'DDR4', 'GDDR5', 'GDDR6', 'GDDR7'];
    const availableScreenPanel = ['IPS', 'OLED', 'AMOLED', 'TN', 'VA'];
    const availableProcessorGen = ['10. Nesil', '11. Nesil', '12. Nesil', '13. Nesil', '14. Nesil', 'Apple M1', 'Apple M2', 'Apple M3'];
    const availableMaxSpeed = ['2.0 GHz', '2.5 GHz', '3.0 GHz', '3.5 GHz', '4.0 GHz', '4.5+ GHz'];
    const availableMemorySpeed = ['2133 MHz', '2400 MHz', '2666 MHz', '3200 MHz', '4800 MHz', '5600+ MHz'];
    const availableBluetooth = ['Yok', 'Var (4.2)', 'Var (5.0)', 'Var (5.1)', 'Var (5.2)', 'Var (5.3)'];
    const availableWeight = ['1 kg altı', '1 - 1.5 kg', '1.5 - 2 kg', '2 - 2.5 kg', '2.5 kg ve üzeri'];
    const availableTouch = ['Var', 'Yok'];
    const availableScreenSize = ['13 inç', '13.3 inç', '14 inç', '15.6 inç', '16.1 inç', '16.3 inç', '17.3 inç'];
    const availableGpu = ['Dahili', 'NVIDIA GeForce RTX 3050', 'NVIDIA GeForce RTX 4060', 'AMD Radeon RX 6600', 'Apple M3 GPU'];
    const availableGpuMemory = ['Paylaşımlı', '2 GB', '4 GB', '6 GB', '8 GB', '12 GB', '16 GB'];

    const availableFabrics = ['%100 Pamuk', 'Polyester', 'Keten', 'Elastan'];
    const availableCollars = ['Bisiklet Yaka', 'V Yaka', 'Polo Yaka', 'Hakim Yaka'];

    const availableMaterials = ['Hakiki Deri', 'Suni Deri', 'Süet', 'Tekstil', 'Poliüretan'];
    const availableHeels = ['Düz', 'Kısa Topuklu', 'Yüksek Topuklu', 'Dolgu Topuk'];

    const tabs = [
        { label: 'Temel ürün bilgileri' }, // 0
        { label: 'Ürün özellikleri' },     // 1
        { label: 'Ürün açıklaması' },      // 2
        { label: 'Ürün Görselleri' },      // 3
        { label: 'Ürün Seçenekleri' },     // 4
        { label: 'Promosyonlar' },         // 5
        { label: 'Vitrine Ekle' },         // 6
        { label: 'Benzer Ürünler' },       // 7
        { label: 'Tedarikçi Bilgileri' }   // 8
    ];

    const handleSave = () => {
        // In a real app, you would collect this state, validate, and call an API
        console.log('Saving product:', {
            productName, sku, barcode, description, purchasePrice, salePrice, stock, category, brand, productClass, selectedProductOption, selectedProductFeature,
            selectedProcessor, selectedRam, selectedOs, selectedFabric, selectedCollar, selectedMaterial, selectedHeel
        });
        // Redirect back to products list after save
        navigate('/products');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files).map(file => URL.createObjectURL(file));
            setImages(prevImages => prevImages.concat(filesArray));
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const filesArray = Array.from(e.dataTransfer.files).map(file => URL.createObjectURL(file));
            setImages(prevImages => prevImages.concat(filesArray));
            e.dataTransfer.clearData();
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    };

    const removeImage = (indexToRemove: number) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
        if (mainImageIndex === indexToRemove) {
            setMainImageIndex(0);
        } else if (mainImageIndex > indexToRemove) {
            setMainImageIndex(mainImageIndex - 1);
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 0: // Temel Ürün Bilgileri (Hepsiburada Style)

                return (
                    <>
                        <Box sx={{ mb: 6 }}>
                            <Grid container spacing={4}>
                                {/* Satır 1 */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Ürün adı"
                                        fullWidth
                                        required
                                        size="small"
                                        variant="outlined"
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                        placeholder="Örn: elbise"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth variant="outlined" size="small">
                                        <InputLabel>KDV *</InputLabel>
                                        <Select value={taxRate} label="KDV *" onChange={(e) => setTaxRate(e.target.value)}>
                                            <MenuItem value="1">%1</MenuItem>
                                            <MenuItem value="10">%10</MenuItem>
                                            <MenuItem value="20">%20</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Satır 2 */}
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth variant="outlined" size="small">
                                        <InputLabel>Marka *</InputLabel>
                                        <Select value={brand} label="Marka *" onChange={(e) => setBrand(e.target.value)}>
                                            <MenuItem value=""><em>Seçiniz</em></MenuItem>
                                            {brands.map(b => <MenuItem key={b} value={b}>{b}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth variant="outlined" size="small">
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                            <InputLabel shrink sx={{ position: 'relative', transform: 'none' }}>Kategori *</InputLabel>
                                            <Typography variant="caption" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
                                                <InfoIcon fontSize="small" /> Seçilen kategori
                                            </Typography>
                                        </Box>
                                        <Select value={category} displayEmpty onChange={(e) => {
                                            const selectedCat = e.target.value;
                                            setCategory(selectedCat);
                                            const available = selectedCat ? (categoryToClassesMap[selectedCat] || []) : [];
                                            setProductClass(available.length > 0 ? available[0] : '');
                                        }}>
                                            <MenuItem value="" disabled><em>Kategori Seçin</em></MenuItem>
                                            {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Satır 3 */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="KG"
                                        type="number"
                                        fullWidth
                                        size="small"
                                        variant="outlined"
                                        defaultValue="1"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton size="small" color="primary"><InfoIcon fontSize="small" /></IconButton>
                                                    <Typography variant="caption" color="primary" sx={{ cursor: 'pointer' }}>Nedir?</Typography>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField label="Desi" type="number" fullWidth size="small" variant="outlined" defaultValue="1" />
                                </Grid>

                                {/* Satır 4 */}
                                <Grid item xs={12} md={6}>
                                    <Autocomplete
                                        multiple
                                        size="small"
                                        options={availableTags}
                                        value={selectedTags}
                                        onChange={(_, newValue) => setSelectedTags(newValue)}
                                        renderInput={(params) => <TextField {...params} variant="outlined" label="Kullanılabilir Etiketler (Badges)" placeholder="Etiket Seç" />}
                                        renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} color="primary" size="small" />)}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box>
                                        <Autocomplete
                                            options={availableIcons}
                                            size="small"
                                            value={selectedIcons[0] || null}
                                            onChange={(_, newValue) => setSelectedIcons(newValue ? [newValue] : [])}
                                            renderInput={(params) => <TextField {...params} variant="outlined" label="Ürün Özellik İkonları" placeholder="İkon Seç" />}
                                        />
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>Detay sayfasında ürün özelliklerini grafiksel ikonlarla vurgulayın.</Typography>
                                    </Box>
                                </Grid>

                                {/* Satır 5 & 6: Kırmızı Alan (Tam Genişlik) */}
                                <Grid item xs={12}>
                                    <Autocomplete
                                        multiple
                                        size="small"
                                        options={availableSizes}
                                        value={selectedSizes}
                                        disabled={availableSizes.length === 0}
                                        onChange={(_, newValue) => setSelectedSizes(newValue.filter((v, i, a) => a.indexOf(v) === i))}
                                        renderInput={(params) => <TextField {...params} variant="outlined" label="Beden *" placeholder={availableSizes.length > 0 ? "Beden Seçin" : "Bu kategoride beden seçeneği yok"} />}
                                        renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" color="primary" sx={{ bgcolor: '#eef2ff' }} />)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Autocomplete
                                        multiple
                                        size="small"
                                        options={availableColors}
                                        value={selectedColors}
                                        disabled={availableColors.length === 0}
                                        onChange={(_, newValue) => setSelectedColors(newValue.filter((v, i, a) => a.indexOf(v) === i))}
                                        renderInput={(params) => <TextField {...params} variant="outlined" label="Renk *" placeholder={availableColors.length > 0 ? "Renk Seçin" : "Bu kategoride renk seçeneği yok"} />}
                                        renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" color="primary" sx={{ bgcolor: '#eef2ff' }} />)}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        <Box sx={{ width: '100%' }}>
                            {/* Varyant (Ürün Bilgileri) Tablosu */}
                            <Paper sx={{ mt: 5, borderRadius: 2, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
                                <Box sx={{ bgcolor: '#9e9e9e', color: 'white', px: 2, py: 1.5 }}>
                                    <Typography variant="subtitle2" fontWeight="bold">Ürün Bilgileri</Typography>
                                </Box>
                                <Box sx={{ p: 3 }}>
                                    {variants.length === 0 && (availableColors.length > 0 || availableSizes.length > 0) ? (
                                        <Box sx={{
                                            bgcolor: '#e3f2fd',
                                            color: '#0d47a1',
                                            p: 2,
                                            borderRadius: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            mb: 3
                                        }}>
                                            <InfoIcon />
                                            <Typography variant="body2" fontWeight="500">
                                                Bu alanda ürün bilgilerinizi girebilmeniz için öncelikle ürün kategorisini ve var ise seçtiğiniz kategoriye bağlı gruplama seçeneğini belirlemeniz gerekiyor.
                                            </Typography>
                                        </Box>
                                    ) : null}

                                    <Box sx={{ opacity: variants.length === 0 && (availableColors.length > 0 || availableSizes.length > 0) ? 0.4 : 1, pointerEvents: variants.length === 0 && (availableColors.length > 0 || availableSizes.length > 0) ? 'none' : 'auto' }}>
                                        {/* Toplu İşlem Barı */}
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, border: '1px solid #e0e0e0', borderRadius: 1, px: 2, py: 1 }}>
                                                <Typography variant="body2" color="text.secondary">Barkodu olmayan ürünleriniz mi var?</Typography>
                                                <Button variant="outlined" color="primary" size="small" onClick={assignBarcodes} sx={{ borderRadius: 6, textTransform: 'none' }}>
                                                    Barkod ata
                                                </Button>
                                                <Button variant="outlined" color="primary" size="small" onClick={assignSkus} sx={{ borderRadius: 6, textTransform: 'none' }}>
                                                    Stok kodu ata
                                                </Button>
                                                <Button variant="text" color="inherit" size="small" onClick={removeBarcodes} startIcon={<InfoIcon fontSize="small" />} sx={{ textTransform: 'none', color: '#9e9e9e' }}>
                                                    Barkod kaldır
                                                </Button>
                                            </Box>
                                            <Box sx={{ flexGrow: 1 }} />
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <TextField size="small" placeholder="Fiyat tutarını girin" value={bulkPrice} onChange={(e) => setBulkPrice(e.target.value)} sx={{ width: 150, bgcolor: '#f5f5f5', '& fieldset': { border: 'none' } }} />
                                                <TextField size="small" placeholder="Stok miktarını girin" value={bulkStock} onChange={(e) => setBulkStock(e.target.value)} sx={{ width: 150, bgcolor: '#f5f5f5', '& fieldset': { border: 'none' } }} />
                                                <Button variant="outlined" color="inherit" onClick={applyBulkActions} sx={{ borderRadius: 4, textTransform: 'none', color: '#757575', borderColor: '#e0e0e0' }}>
                                                    Seçilenlere uygula ({variants.filter(v => v.selected).length})
                                                </Button>
                                                <Button variant="text" color="inherit" sx={{ textTransform: 'none', color: '#9e9e9e' }}>
                                                    Seçilenleri sil
                                                </Button>
                                            </Box>
                                        </Box>

                                        {/* Tablo */}
                                        <TableContainer sx={{ border: '1px solid #eee', borderRadius: 2 }}>
                                            <Table size="small">
                                                <TableHead sx={{ bgcolor: '#f9f9f9' }}>
                                                    <TableRow>
                                                        <TableCell padding="checkbox">
                                                            <Checkbox onChange={handleSelectAllVariants} checked={variants.length > 0 && variants.every(v => v.selected)} indeterminate={variants.some(v => v.selected) && !variants.every(v => v.selected)} />
                                                        </TableCell>
                                                        <TableCell><strong>Ürün görseli *</strong></TableCell>
                                                        {selectedColors.length > 0 && <TableCell><strong>Renk</strong></TableCell>}
                                                        {selectedSizes.length > 0 && <TableCell><strong>Beden</strong></TableCell>}
                                                        {selectedNumbers.length > 0 && <TableCell><strong>Numara</strong></TableCell>}
                                                        {selectedRam.length > 0 && <TableCell><strong>RAM Kapasitesi</strong></TableCell>}
                                                        {selectedScreenSize.length > 0 && <TableCell><strong>Ekran Boyutu</strong></TableCell>}
                                                        <TableCell><strong>Barkod(EAN) *</strong></TableCell>
                                                        <TableCell><strong>Satıcı stok kodu *</strong></TableCell>
                                                        <TableCell><strong>Fiyat</strong></TableCell>
                                                        <TableCell><strong>Stok</strong></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {variants.map((v, idx) => {
                                                        // Hepsiburada style: merge color column cells visually if same color
                                                        const isFirstOfColor = idx === 0 || variants[idx - 1].color !== v.color;
                                                        const colorRowSpan = variants.filter(varRow => varRow.color === v.color).length;
                                                        return (
                                                            <TableRow key={v.id} hover>
                                                                <TableCell padding="checkbox">
                                                                    <Checkbox checked={!!v.selected} onChange={(e) => handleVariantChange(v.id, 'selected', e.target.checked)} />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                                        {v.images && v.images.length > 0 && (
                                                                            <Box sx={{ width: 44, height: 44, border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}>
                                                                                <img src={v.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                            </Box>
                                                                        )}
                                                                        {v.images && v.images.length > 1 && (
                                                                            <Box sx={{ width: 44, height: 44, border: '1px solid #e0e0e0', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
                                                                                <Typography variant="body2" color="text.secondary" fontWeight="bold">+ {v.images.length - 1}</Typography>
                                                                            </Box>
                                                                        )}
                                                                        <Box onClick={() => handleOpenMediaModal(v.id)} sx={{ width: 44, height: 44, border: '1px dashed #bdbdbd', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', bgcolor: '#fafafa', '&:hover': { bgcolor: '#f0f0f0' } }}>
                                                                            <Typography variant="h5" color="text.secondary">+</Typography>
                                                                        </Box>
                                                                    </Box>
                                                                </TableCell>

                                                                {selectedColors.length > 0 && isFirstOfColor && (
                                                                    <TableCell rowSpan={colorRowSpan} sx={{ borderRight: '1px solid #eee', verticalAlign: 'top', pt: 3 }}>
                                                                        <Typography variant="body2">{v.color}</Typography>
                                                                    </TableCell>
                                                                )}

                                                                {selectedSizes.length > 0 && (
                                                                    <TableCell sx={{ borderRight: '1px solid #eee' }}>
                                                                        <Typography variant="body2">{v.size}</Typography>
                                                                    </TableCell>
                                                                )}

                                                                {selectedNumbers.length > 0 && (
                                                                    <TableCell sx={{ borderRight: '1px solid #eee' }}>
                                                                        <Typography variant="body2">{v.size}</Typography>
                                                                    </TableCell>
                                                                )}

                                                                {selectedRam.length > 0 && (
                                                                    <TableCell sx={{ borderRight: '1px solid #eee' }}>
                                                                        <Typography variant="body2">{v.ram}</Typography>
                                                                    </TableCell>
                                                                )}

                                                                {selectedScreenSize.length > 0 && (
                                                                    <TableCell sx={{ borderRight: '1px solid #eee' }}>
                                                                        <Typography variant="body2">{v.screenSize}</Typography>
                                                                    </TableCell>
                                                                )}

                                                                <TableCell>
                                                                    <TextField size="small" placeholder="Barkod girin" value={v.barcode} onChange={(e) => handleVariantChange(v.id, 'barcode', e.target.value)} sx={{ minWidth: 120, bgcolor: '#f5f5f5', '& fieldset': { border: 'none' } }} />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <TextField size="small" placeholder="Stok kodu girin" value={v.sku} onChange={(e) => handleVariantChange(v.id, 'sku', e.target.value)} sx={{ minWidth: 120, bgcolor: '#f5f5f5', '& fieldset': { border: 'none' } }} />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <TextField size="small" placeholder="0" value={v.price} onChange={(e) => handleVariantChange(v.id, 'price', e.target.value)} sx={{ minWidth: 100, bgcolor: '#f5f5f5', '& fieldset': { border: 'none' } }} />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <TextField size="small" placeholder="0" value={v.stock} onChange={(e) => handleVariantChange(v.id, 'stock', e.target.value)} sx={{ minWidth: 100, bgcolor: '#f5f5f5', '& fieldset': { border: 'none' } }} />
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Box>
                                </Box>
                            </Paper>
                        </Box>
                    </>
                ); case 3: // Ürün Görselleri

                return (
                    <Paper sx={{ p: 4, borderRadius: 2, minHeight: '60vh' }}>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PhotoIcon color="primary" sx={{ fontSize: 28 }} /> Ürün Görselleri Yönetimi
                        </Typography>
                        <Divider sx={{ mb: 4 }} />

                        <Box
                            component="label"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px dashed',
                                borderColor: isDragActive ? 'primary.main' : '#ccc',
                                borderRadius: 3,
                                p: 6,
                                bgcolor: isDragActive ? '#f0f7ff' : '#fafbfc',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                mb: 5,
                                '&:hover': { bgcolor: isDragActive ? '#f0f7ff' : '#f4f6f8', borderColor: isDragActive ? 'primary.main' : '#999' }
                            }}
                        >
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                            <CloudUploadIcon sx={{ fontSize: 64, color: isDragActive ? 'primary.main' : '#9e9e9e', mb: 2 }} />
                            <Typography variant="h6" color={isDragActive ? "primary" : "text.primary"} gutterBottom>Görselleri Sürükleyin ve Bırakın</Typography>
                            <Typography variant="body2" color="text.secondary">veya bilgisayarınızdan seçmek için tıklayın (PNG, JPG, JPEG - Maks. 5MB)</Typography>
                        </Box>

                        {images.length > 0 ? (
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>Yüklenen Görseller ({images.length})</Typography>
                                <Grid container spacing={3}>
                                    {images.map((imgUrl, index) => (
                                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                            <Paper elevation={0} sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', border: mainImageIndex === index ? '2px solid #1976d2' : '1px solid #e0e0e0', transition: '0.2s', '&:hover': { boxShadow: 3 } }}>
                                                <Box sx={{ position: 'relative', pt: '100%', bgcolor: '#f5f5f5' }}>
                                                    <img
                                                        src={imgUrl}
                                                        alt={`urun-${index}`}
                                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }}
                                                    />
                                                    {mainImageIndex === index && (
                                                        <Chip label="Ana Görsel" color="primary" size="small" icon={<CheckCircleIcon sx={{ fontSize: 16 }} />} sx={{ position: 'absolute', top: 8, left: 8, fontWeight: 'bold' }} />
                                                    )}
                                                    <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0.5 }}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeImage(index); }}
                                                            sx={{ bgcolor: 'rgba(255, 255, 255, 0.9)', boxShadow: 1, '&:hover': { bgcolor: 'error.main', color: 'white' } }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                </Box>
                                                <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'center', bgcolor: mainImageIndex === index ? '#f0f7ff' : 'transparent' }}>
                                                    <Button
                                                        size="small"
                                                        variant={mainImageIndex === index ? "contained" : "outlined"}
                                                        color={mainImageIndex === index ? "primary" : "inherit"}
                                                        startIcon={mainImageIndex === index ? <StarIcon /> : <StarOutlineIcon />}
                                                        onClick={(e) => { e.preventDefault(); setMainImageIndex(index); }}
                                                        sx={{ width: '100%', textTransform: 'none' }}
                                                    >
                                                        {mainImageIndex === index ? 'Ana Görsel' : 'Ana Görsel Yap'}
                                                    </Button>
                                                </Box>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 4, bgcolor: '#f9f9f9', borderRadius: 2, border: '1px dashed #e0e0e0' }}>
                                <PhotoIcon sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
                                <Typography color="text.secondary">Henüz görsel eklenmedi.</Typography>
                            </Box>
                        )}
                    </Paper>
                ); case 2: // Ürün Açıklaması

                return (
                    <Paper sx={{ p: 4, borderRadius: 2, minHeight: '60vh' }}>
                        <Box>
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <InfoIcon color="primary" sx={{ fontSize: 28 }} /> Ürün Açıklaması
                            </Typography>
                            <Divider sx={{ mb: 4 }} />
                            <Box sx={{
                                bgcolor: 'white',
                                border: '1px solid #e0e0e0',
                                borderRadius: 1,
                                overflow: 'hidden',
                                '& .ql-toolbar': {
                                    border: 'none',
                                    borderBottom: '1px solid #e0e0e0',
                                    bgcolor: '#fafafa',
                                    p: 2
                                },
                                '& .ql-container': {
                                    border: 'none',
                                    minHeight: '400px',
                                    fontSize: '1rem'
                                },
                                '& .ql-editor': {
                                    minHeight: '400px',
                                    p: 3
                                }
                            }}>
                                <ReactQuill
                                    theme="snow"
                                    value={description}
                                    onChange={setDescription}
                                    placeholder="Ürününüzün detaylı ve ilgi çekici açıklamasını buraya yazabilirsiniz... (HTML desteklidir)"
                                />
                            </Box>
                        </Box>
                    </Paper>
                ); case 1: // Özellikler (Adım 2)

                return (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FeaturesIcon color="primary" /> Ürün Özellikleri
                        </Typography>
                        <Box sx={{ mb: 3, p: 2, bgcolor: '#e8eaf6', borderRadius: 2, display: 'flex', gap: 1.5, alignItems: 'flex-start', borderLeft: '4px solid #3f51b5' }}>
                            <InfoIcon color="primary" sx={{ mt: 0.5 }} />
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold" color="primary.dark">Ürün Özellikleri</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Ürün özelliklerini eksiksiz ve doğru bir şekilde doldurmanız ürünlerinizin bulunabilirliğini artıracaktır. Seçilen kategoriye özel bilgiler bu alandan girilir.
                                </Typography>
                            </Box>
                        </Box>
                        <Paper sx={{ p: 4, borderRadius: 2 }}>
                            {!productClass ? (
                                <Box sx={{ textAlign: 'center', py: 5, bgcolor: '#f5f5f5', borderRadius: 2, border: '1px dashed #bdbdbd' }}>
                                    <InfoIcon sx={{ fontSize: 48, color: '#9e9e9e', mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary">Özellikleri Görmek İçin Şablon Seçin</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Lütfen 'Temel Bilgiler' sekmesinden bir ürün sınıfı seçiniz.</Typography>
                                    <Button variant="outlined" color="primary" sx={{ mt: 3 }} onClick={() => setActiveTab(0)}>
                                        Geri Dön
                                    </Button>
                                </Box>
                            ) : (
                                <Box>
                                    {productClass === 'Tişört Şablonu' && (
                                        <Box>
                                            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>Tişört Özellikleri:</Typography>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} sm={6} md={6}>
                                                    <Autocomplete
                                                        multiple
                                                        options={['Tümünü Seç', ...availableFabrics]}
                                                        value={selectedFabric}
                                                        onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedFabric(availableFabrics) : setSelectedFabric(newValue)}
                                                        renderInput={(params) => <TextField {...params} variant="outlined" size="small" label="Kumaş Tipi*" placeholder="Seçin" sx={{ bgcolor: '#f5f5f5', '& fieldset': { border: 'none' } }} />}
                                                        renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={6}>
                                                    <Autocomplete
                                                        multiple
                                                        options={['Tümünü Seç', ...availableCollars]}
                                                        value={selectedCollar}
                                                        onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedCollar(availableCollars) : setSelectedCollar(newValue)}
                                                        renderInput={(params) => <TextField {...params} variant="outlined" size="small" label="Yaka Tipi*" placeholder="Seçin" sx={{ bgcolor: '#f5f5f5', '& fieldset': { border: 'none' } }} />}
                                                        renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    )}

                                    {productClass === 'Bilgisayar Şablonu' && (
                                        <Box>
                                            <Grid container spacing={4}>
                                                <Grid item xs={12} sm={6}>
                                                    <Autocomplete
                                                        multiple
                                                        options={['Tümünü Seç', ...availableProcessors]}
                                                        value={selectedProcessor}
                                                        onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedProcessor(availableProcessors) : setSelectedProcessor(newValue)}
                                                        renderInput={(params) => <TextField {...params} variant="outlined" size="small" label="İşlemci Tipi*" placeholder="Seçin" sx={{ bgcolor: '#f5f5f5', '& fieldset': { border: 'none' } }} />}
                                                        renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)}
                                                    />
                                                </Grid>


                                                <Grid item xs={12} sm={6}>
                                                    <Autocomplete
                                                        multiple
                                                        options={['Tümünü Seç', ...availableEmmc]}
                                                        value={selectedEmmc}
                                                        onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedEmmc(availableEmmc) : setSelectedEmmc(newValue)}
                                                        renderInput={(params) => <TextField {...params} variant="outlined" size="small" label="eMMC Kapasitesi*" placeholder="Seçin" sx={{ bgcolor: '#f5f5f5', '& fieldset': { border: 'none' } }} />}
                                                        renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Autocomplete
                                                        multiple
                                                        options={['Tümünü Seç', ...availableGpuMemoryType]}
                                                        value={selectedGpuMemoryType}
                                                        onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedGpuMemoryType(availableGpuMemoryType) : setSelectedGpuMemoryType(newValue)}
                                                        renderInput={(params) => <TextField {...params} variant="outlined" size="small" label="Ekran Kartı Bellek Tipi*" placeholder="Seçin" sx={{ bgcolor: '#f5f5f5', '& fieldset': { border: 'none' } }} />}
                                                        renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <Autocomplete
                                                        multiple
                                                        options={['Tümünü Seç', ...availableScreenPanel]}
                                                        value={selectedScreenPanel}
                                                        onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedScreenPanel(availableScreenPanel) : setSelectedScreenPanel(newValue)}
                                                        renderInput={(params) => <TextField {...params} variant="outlined" size="small" label="Ekran Panel Tipi*" placeholder="Seçin" sx={{ bgcolor: '#f5f5f5', '& fieldset': { border: 'none' } }} />}
                                                        renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Autocomplete
                                                        multiple
                                                        options={['Tümünü Seç', ...availableProcessorGen]}
                                                        value={selectedProcessorGen}
                                                        onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedProcessorGen(availableProcessorGen) : setSelectedProcessorGen(newValue)}
                                                        renderInput={(params) => <TextField {...params} variant="outlined" size="small" label="İşlemci Nesli*" placeholder="Seçin" sx={{ bgcolor: '#f5f5f5', '& fieldset': { border: 'none' } }} />}
                                                        renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <Autocomplete
                                                        multiple
                                                        options={['Tümünü Seç', ...availableMaxSpeed]}
                                                        value={selectedMaxSpeed}
                                                        onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedMaxSpeed(availableMaxSpeed) : setSelectedMaxSpeed(newValue)}
                                                        renderInput={(params) => <TextField {...params} variant="outlined" size="small" label="Maksimum İşlemci Hızı*" placeholder="Seçin" sx={{ bgcolor: '#f5f5f5', '& fieldset': { border: 'none' } }} />}
                                                        renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Autocomplete
                                                        multiple
                                                        options={['Tümünü Seç', ...availableMemorySpeed]}
                                                        value={selectedMemorySpeed}
                                                        onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedMemorySpeed(availableMemorySpeed) : setSelectedMemorySpeed(newValue)}
                                                        renderInput={(params) => <TextField {...params} variant="outlined" size="small" label="Bellek Hızı*" placeholder="Seçin" sx={{ bgcolor: '#f5f5f5', '& fieldset': { border: 'none' } }} />}
                                                        renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <Autocomplete
                                                        multiple
                                                        options={['Tümünü Seç', ...availableBluetooth]}
                                                        value={selectedBluetooth}
                                                        onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedBluetooth(availableBluetooth) : setSelectedBluetooth(newValue)}
                                                        renderInput={(params) => <TextField {...params} variant="outlined" size="small" label="Bluetooth Özelliği*" placeholder="Seçin" sx={{ bgcolor: '#f5f5f5', '& fieldset': { border: 'none' } }} />}
                                                        renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Autocomplete
                                                        multiple
                                                        options={['Tümünü Seç', ...availableWeight]}
                                                        value={selectedWeight}
                                                        onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedWeight(availableWeight) : setSelectedWeight(newValue)}
                                                        renderInput={(params) => <TextField {...params} variant="outlined" size="small" label="Cihaz Ağırlığı*" placeholder="Seçin" sx={{ bgcolor: '#f5f5f5', '& fieldset': { border: 'none' } }} />}
                                                        renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <Autocomplete
                                                        multiple
                                                        options={['Tümünü Seç', ...availableTouch]}
                                                        value={selectedTouch}
                                                        onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedTouch(availableTouch) : setSelectedTouch(newValue)}
                                                        renderInput={(params) => <TextField {...params} variant="outlined" size="small" label="Dokunmatik Ekran*" placeholder="Seçin" sx={{ bgcolor: '#f5f5f5', '& fieldset': { border: 'none' } }} />}
                                                        renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)}
                                                    />
                                                </Grid>


                                                <Grid item xs={12} sm={6}>
                                                    <Autocomplete
                                                        multiple
                                                        options={['Tümünü Seç', ...availableGpu]}
                                                        value={selectedGpu}
                                                        onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedGpu(availableGpu) : setSelectedGpu(newValue)}
                                                        renderInput={(params) => <TextField {...params} variant="outlined" size="small" label="Ekran Kartı*" placeholder="Seçin" sx={{ bgcolor: '#f5f5f5', '& fieldset': { border: 'none' } }} />}
                                                        renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Autocomplete
                                                        multiple
                                                        options={['Tümünü Seç', ...availableGpuMemory]}
                                                        value={selectedGpuMemory}
                                                        onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedGpuMemory(availableGpuMemory) : setSelectedGpuMemory(newValue)}
                                                        renderInput={(params) => <TextField {...params} variant="outlined" size="small" label="Ekran Kartı Hafızası*" placeholder="Seçin" sx={{ bgcolor: '#f5f5f5', '& fieldset': { border: 'none' } }} />}
                                                        renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    )}


                                    {productClass === 'Ayakkabı Şablonu' && (
                                        <Box sx={{ border: '1px solid #e0e0e0', borderTop: '2px solid #f44336', borderRadius: 1, p: 3 }}>
                                            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>Ayakkabı Özellikleri:</Typography>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} sm={6}>
                                                    <Autocomplete
                                                        multiple
                                                        options={['Tümünü Seç', ...availableMaterials]}
                                                        value={selectedMaterial}
                                                        onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedMaterial(availableMaterials) : setSelectedMaterial(newValue)}
                                                        renderInput={(params) => <TextField {...params} variant="outlined" label="Dış Materyal" placeholder="Materyal Seçin" />}
                                                        renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Autocomplete
                                                        multiple
                                                        options={['Tümünü Seç', ...availableHeels]}
                                                        value={selectedHeel}
                                                        onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedHeel(availableHeels) : setSelectedHeel(newValue)}
                                                        renderInput={(params) => <TextField {...params} variant="outlined" label="Topuk Boyu" placeholder="Topuk Boyu Seçin" />}
                                                        renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </Paper>
                    </Box>
                ); case 4: // Ürün Seçenekleri

                return (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <OptionsIcon color="primary" /> Ürün Seçenekleri
                        </Typography>
                        <Paper sx={{ p: 3, borderRadius: 2 }}>
                            {!productClass ? (
                                <Box sx={{ textAlign: 'center', py: 5, bgcolor: '#f5f5f5', borderRadius: 2, border: '1px dashed #bdbdbd' }}>
                                    <InfoIcon sx={{ fontSize: 48, color: '#9e9e9e', mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary">Seçenekleri Görmek İçin Şablon Seçin</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Lütfen 'Genel' sekmesinden bir kategori seçiniz.</Typography>
                                    <Button variant="outlined" color="primary" sx={{ mt: 3 }} onClick={() => setActiveTab(0)}>
                                        Genel Sekmesine Dön
                                    </Button>
                                </Box>
                            ) : (
                                <Box>
                                    {productClass === 'Tişört Şablonu' && (
                                        <Box sx={{ border: '1px solid #e0e0e0', borderTop: '2px solid #ff9800', borderRadius: 1, p: 3 }}>
                                            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>Renk ve Beden Seçenekleri:</Typography>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} sm={6}>
                                                    <Autocomplete
                                                        multiple
                                                        options={['Tümünü Seç', ...availableColors]}
                                                        value={selectedColors}
                                                        onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedColors(availableColors) : setSelectedColors(newValue)}
                                                        renderInput={(params) => <TextField {...params} variant="outlined" label="Renk Seçimleri" placeholder="Renk Seçin" />}
                                                        renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" color="primary" />)}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Autocomplete
                                                        multiple
                                                        options={['Tümünü Seç', ...availableSizes]}
                                                        value={selectedSizes}
                                                        onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedSizes(availableSizes) : setSelectedSizes(newValue)}
                                                        renderInput={(params) => <TextField {...params} variant="outlined" label="Beden Seçimleri" placeholder="Beden Seçin" />}
                                                        renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" color="secondary" />)}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    )}

                                    {productClass === 'Ayakkabı Şablonu' && (
                                        <Box sx={{ border: '1px solid #e0e0e0', borderTop: '2px solid #ff9800', borderRadius: 1, p: 3 }}>
                                            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>Numara Seçenekleri:</Typography>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} sm={6}>
                                                    <Autocomplete
                                                        multiple
                                                        options={['Tümünü Seç', ...availableNumbers]}
                                                        value={selectedNumbers}
                                                        onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedNumbers(availableNumbers) : setSelectedNumbers(newValue)}
                                                        renderInput={(params) => <TextField {...params} variant="outlined" label="Numara Seçimleri" placeholder="Numara Seçin" />}
                                                        renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" color="primary" />)}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    )}

                                    {productClass === 'Bilgisayar Şablonu' && (
                                        <Box sx={{ border: '1px solid #e0e0e0', borderTop: '2px solid #ff9800', borderRadius: 1, p: 3 }}>
                                            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>RAM Kapasitesi ve Ekran Boyutu Seçenekleri:</Typography>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} sm={6}>
                                                    <Autocomplete
                                                        multiple
                                                        options={['Tümünü Seç', ...availableRams]}
                                                        value={selectedRam}
                                                        onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedRam(availableRams) : setSelectedRam(newValue)}
                                                        renderInput={(params) => <TextField {...params} variant="outlined" label="RAM Seçimleri" placeholder="RAM Seçin" />}
                                                        renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" color="primary" />)}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Autocomplete
                                                        multiple
                                                        options={['Tümünü Seç', ...availableScreenSize]}
                                                        value={selectedScreenSize}
                                                        onChange={(_, newValue) => newValue.includes('Tümünü Seç') ? setSelectedScreenSize(availableScreenSize) : setSelectedScreenSize(newValue)}
                                                        renderInput={(params) => <TextField {...params} variant="outlined" label="Ekran Boyutu Seçimleri" placeholder="Ekran Boyutu Seçin" />}
                                                        renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" color="secondary" />)}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    )}

                                    {productClass !== 'Tişört Şablonu' && productClass !== 'Ayakkabı Şablonu' && productClass !== 'Bilgisayar Şablonu' && (
                                        <Box sx={{ textAlign: 'center', py: 4 }}>
                                            <Typography color="text.secondary">Bu ürün sınıfı için eklenebilir ek bir varyant seçeneği (renk, beden, numara vb.) bulunmamaktadır.</Typography>
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </Paper>
                    </Box>
                );
            default:
                return (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h5" color="text.secondary" gutterBottom>
                            {tabs[activeTab].label} Konfigürasyonu
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Bu bölüm henüz doldurulmamıştır.
                        </Typography>
                    </Box>
                );
        }
    };

    // Calculate overall progress
    const nameProgress = productName.length > 0 ? 100 : 0;
    const imageProgress = Math.min((images.length / 5) * 100, 100);
    const featureProgress = productClass ? 100 : 0;
    const descProgress = Math.min((description.length / 50) * 100, 100);
    const totalProgress = Math.round((nameProgress + imageProgress + featureProgress + descProgress) / 4);

    return (
        <Box sx={{ width: '100%', pb: 5 }}>
            {/* Header & Sticky Action Bar */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
                position: 'sticky',
                top: 0,
                backgroundColor: '#f5f7f9', // assuming body background
                zIndex: 10,
                py: 2,
                borderBottom: '1px solid #e0e0e0',
                px: 3
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={() => navigate('/products')} sx={{ bgcolor: 'white', boxShadow: 1, '&:hover': { bgcolor: '#f5f5f5' } }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Box>
                        <Typography variant="body2" color="text.secondary">Ürün ekle</Typography>
                        <Typography variant="h5" fontWeight="bold" color="text.primary">
                            Tek Ürün Ekle
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Button variant="text" color="inherit" startIcon={<InfoIcon />}>
                        Tek ürün nasıl eklenir?
                    </Button>
                </Box>
            </Box>

            <Box sx={{ px: 3 }}>
                {/* Progress/Gamification Header */}
                <Paper sx={{ p: 4, mb: 4, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4, border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {/* Hepsiburada Style Half-Circle Progress */}
                        <Box sx={{ position: 'relative', width: 140, height: 70, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden' }}>
                            <Box sx={{
                                width: 140, height: 140, borderRadius: '50%',
                                border: '16px solid #e0e0e0', // Arka plan (gri) halka
                                position: 'absolute', top: 0, boxSizing: 'border-box'
                            }} />
                            <Box sx={{
                                width: 140, height: 140, borderRadius: '50%',
                                border: '16px solid #ff6a00', // Aktif (turuncu) halka
                                borderBottomColor: 'transparent',
                                borderRightColor: 'transparent',
                                borderTopColor: 'transparent', // CSS Trick for semi-circle filling
                                transform: `rotate(${-45 + (180 * (totalProgress / 100))}deg)`,
                                position: 'absolute', top: 0,
                                transition: '1s ease-out', boxSizing: 'border-box',
                                clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' // Sadece üst yarıyı göster
                            }} />
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, mb: -1 }}>
                                <Typography variant="h4" fontWeight="800" color="text.primary" sx={{ lineHeight: 1 }}>{`%${Math.min(totalProgress, 100)}`}</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '120px', mt: 1 }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight="bold">%0</Typography>
                                    <Typography variant="caption" sx={{ color: totalProgress < 50 ? '#f44336' : totalProgress < 80 ? '#ff9800' : '#4caf50', bgcolor: totalProgress < 50 ? '#ffebee' : totalProgress < 80 ? '#fff3e0' : '#e8f5e9', px: 1, borderRadius: 2, fontWeight: 'bold' }}>{totalProgress < 50 ? 'Düşük' : totalProgress < 80 ? 'Orta' : 'Yüksek'}</Typography>
                                    <Typography variant="caption" color="text.secondary" fontWeight="bold">%100</Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Box sx={{ ml: 4 }}>
                            <Typography variant="h5" fontWeight="bold" color="text.primary">
                                Ürün bilgilerini detaylı doldurun, satışlarınızı artırın!
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 3, flex: 1, minWidth: 450, justifyContent: 'flex-end' }}>
                        <Grid container spacing={3} sx={{ maxWidth: 500 }}>
                            <Grid item xs={6}>
                                <Box sx={{ mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <InfoIcon sx={{ fontSize: 16, color: '#9e9e9e' }} />
                                        <Typography variant="body2" fontWeight="500" color="text.secondary">Ürün adını detaylı doldur</Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={productName.length > 0 ? 100 : 0} sx={{ height: 8, borderRadius: 4, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: productName.length > 0 ? '#ff6a00' : '#fb8c00' } }} />
                                </Box>
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <InfoIcon sx={{ fontSize: 16, color: '#9e9e9e' }} />
                                        <Typography variant="body2" fontWeight="500" color="text.secondary">Ürün özelliklerini doldur</Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={productClass ? 100 : 0} sx={{ height: 8, borderRadius: 4, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: productClass ? '#4caf50' : '#4caf50' } }} />
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box sx={{ mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <InfoIcon sx={{ fontSize: 16, color: '#9e9e9e' }} />
                                        <Typography variant="body2" fontWeight="500" color="text.secondary">Her ürüne 5 görsel ekle</Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={Math.min((images.length / 5) * 100, 100)} sx={{ height: 8, borderRadius: 4, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: '#9e9e9e' } }} />
                                </Box>
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <InfoIcon sx={{ fontSize: 16, color: '#9e9e9e' }} />
                                        <Typography variant="body2" fontWeight="500" color="text.secondary">Ürün açıklamalarını detaylı doldur</Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={Math.min((description.length / 50) * 100, 100)} sx={{ height: 8, borderRadius: 4, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: '#ff6a00' } }} />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>

                <Tabs
                    value={activeTab}
                    onChange={(e, val) => setActiveTab(val)}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    TabIndicatorProps={{ style: { display: 'none' } }}
                    sx={{
                        maxWidth: '100%',
                        mb: 4,
                        border: '1px solid #e0e0e0', // Adding a subtle border around the tabs bar to structure it
                        borderRadius: 2,
                        bgcolor: 'white',
                        p: 0.5,
                        minHeight: 'auto',
                        '& .MuiTabs-flexContainer': {
                            gap: 1.5,
                        },
                        '& .MuiTabs-scrollButtons': {
                            width: 32,
                            borderRadius: 1,
                            backgroundColor: '#f5f5f5',
                            mx: 0.5,
                            '&.Mui-disabled': { opacity: 0.3 }
                        }
                    }}
                >
                    {tabs.map((tab, index) => (
                        <Tab
                            key={index}
                            disableRipple
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Box sx={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: activeTab === index ? '#8c9eff' : '#757575',
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                        backgroundColor: activeTab === index ? 'transparent' : '#e0e0e0',
                                        border: activeTab === index ? '2px solid #8c9eff' : 'none',
                                        flexShrink: 0
                                    }}>
                                        {index + 1}
                                    </Box>
                                    <Typography sx={{
                                        fontWeight: activeTab === index ? 'bold' : 'normal',
                                        color: activeTab === index ? '#212121' : '#9e9e9e',
                                        textTransform: 'none'
                                    }}>
                                        {tab.label}
                                    </Typography>
                                </Box>
                            }
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                px: 2,
                                py: 1,
                                minHeight: '44px',
                                borderRadius: 8,
                                backgroundColor: 'transparent',
                                border: 'none',
                                '&:hover': {
                                    backgroundColor: activeTab === index ? 'transparent' : 'rgba(0, 0, 0, 0.02)',
                                }
                            }}
                        />
                    ))}
                </Tabs>

                {/* Main Form Content */}
                <Box sx={{ minHeight: 600 }}>
                    {renderTabContent()}
                </Box>

                {/* Bottom Actions Bar */}
                <Paper sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 280, // Assuming sidebar width, will adjust if needed
                    right: 0,
                    p: 2,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 2,
                    borderTop: '1px solid #e0e0e0',
                    zIndex: 100,
                    borderRadius: 0,
                    boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
                }}>
                    <Button variant="outlined" color="inherit" onClick={() => navigate('/products')} sx={{ px: 4, color: '#616161', borderColor: '#bdbdbd' }}>
                        Vazgeç
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            if (activeTab < tabs.length - 1) setActiveTab(activeTab + 1);
                            else handleSave();
                        }}
                        sx={{ bgcolor: '#ffb74d', color: '#fff', '&:hover': { bgcolor: '#ffa726' }, px: 4, fontWeight: 'bold' }}
                    >
                        {activeTab === 0 ? 'Ürün özellikleri ile devam et' : activeTab === tabs.length - 1 ? 'Ürünü Kaydet' : 'Sonraki Adım'}
                    </Button>
                </Paper>
            </Box>

            {/* Variant Media Modal */}
            <Dialog open={isMediaModalOpen} onClose={handleCloseMediaModal} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                    <Typography variant="h6" fontWeight="bold">Ürün görseli/videosu seçin</Typography>
                    <IconButton onClick={handleCloseMediaModal} size="small" sx={{ bgcolor: '#f5f5f5' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ px: 3, pb: 3, pt: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                        <Button
                            variant={mediaModalTab === 0 ? "outlined" : "text"}
                            onClick={() => setMediaModalTab(0)}
                            sx={{ color: mediaModalTab === 0 ? '#212121' : '#9e9e9e', borderColor: mediaModalTab === 0 ? '#e0e0e0' : 'transparent', textTransform: 'none', fontWeight: 'bold', px: 3, borderRadius: 2 }}
                        >
                            Ürün görselleri
                        </Button>
                        <Button
                            variant={mediaModalTab === 1 ? "outlined" : "text"}
                            onClick={() => setMediaModalTab(1)}
                            sx={{ color: mediaModalTab === 1 ? '#212121' : '#9e9e9e', borderColor: mediaModalTab === 1 ? '#e0e0e0' : 'transparent', textTransform: 'none', fontWeight: 'bold', px: 3, borderRadius: 2, display: 'flex', gap: 1 }}
                        >
                            Ürün videosu <Badge badgeContent="Yeni" sx={{ '& .MuiBadge-badge': { bgcolor: '#ff6a00', color: '#fff', fontSize: '0.6rem', height: 16, minWidth: 20, right: -15, top: 4 } }} />
                        </Button>
                    </Box>

                    {/* Sub Navigation (Görsel Galeri vb.) */}
                    <Box sx={{ borderBottom: '1px solid #e0e0e0', mb: 2, display: 'flex', gap: 4, pt: 1 }}>
                        {['Görsel Galeri', 'Bilgisayardan Yükle'].map((tabLabel, idx) => (
                            <Typography
                                key={idx}
                                variant="body2"
                                fontWeight={mediaSubTab === idx ? "bold" : "normal"}
                                onClick={() => setMediaSubTab(idx)}
                                sx={{
                                    color: mediaSubTab === idx ? '#ff6a00' : '#9e9e9e',
                                    cursor: 'pointer',
                                    borderBottom: mediaSubTab === idx ? '2px solid #ff6a00' : 'none',
                                    pb: 1,
                                    mb: '-1px'
                                }}
                            >
                                {tabLabel}
                            </Typography>
                        ))}
                    </Box>

                    {mediaSubTab === 0 && (
                        <Box>
                            {/* Search and Sort box */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, border: '1px solid #e0e0e0', borderRadius: 1, p: 0.5 }}>
                                <TextField
                                    placeholder="Görsellerde ara..."
                                    size="small"
                                    variant="standard"
                                    InputProps={{
                                        disableUnderline: true,
                                        startAdornment: <InputAdornment position="start" sx={{ pl: 1 }}><SearchIcon fontSize="small" color="disabled" /></InputAdornment>,
                                    }}
                                    sx={{ flexGrow: 1 }}
                                />
                                <Button variant="outlined" startIcon={<SwapVertIcon />} color="inherit" size="small" sx={{ textTransform: 'none', borderRadius: 1, borderColor: '#e0e0e0', color: '#616161', py: 0.5, px: 2, border: 'none', borderLeft: '1px solid #e0e0e0' }}>
                                    Sıralama
                                </Button>
                            </Box>

                            <Typography variant="body2" sx={{ mb: 3 }}>
                                <strong>115</strong> görsel bulunuyor. Ürününüzde <strong>{selectedMediaInModal.length}</strong> adet görsel bulunmaktadır. Maksimum <strong>10</strong> adet görsel seçebilirsiniz.
                            </Typography>

                            <Grid container spacing={2}>
                                {dummyGalleryImages.map((img, idx) => {
                                    const isSelected = selectedMediaInModal.includes(img);
                                    return (
                                        <Grid item xs={6} sm={4} md={3} lg={2.4} key={idx}>
                                            <Box
                                                onClick={() => toggleMediaSelect(img)}
                                                sx={{
                                                    position: 'relative',
                                                    paddingTop: '100%',
                                                    borderRadius: 2,
                                                    overflow: 'hidden',
                                                    border: isSelected ? '2px solid #ff6a00' : '1px solid #e0e0e0',
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        opacity: 0.9
                                                    }
                                                }}
                                            >
                                                <img src={img} alt={`Gallery ${idx}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <Box sx={{ position: 'absolute', top: 8, left: 8, bgcolor: isSelected ? 'transparent' : 'white', borderRadius: 1, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', border: isSelected ? 'none' : '2px solid #e0e0e0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                                    {isSelected && <Box sx={{ width: '100%', height: '100%', bgcolor: '#ff6a00', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircleIcon sx={{ color: 'white', fontSize: 16 }} /></Box>}
                                                </Box>
                                            </Box>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Box>
                    )}

                    {mediaSubTab === 1 && (
                        <Box>
                            <Typography variant="body2" sx={{ mb: 3 }}>
                                Maksimum <strong>10</strong> görsel yükleyebilirsiniz.
                            </Typography>

                            <Box
                                onClick={() => modalFileInputRef.current?.click()}
                                sx={{ border: '2px dashed #e0e0e0', borderRadius: 2, p: 6, textAlign: 'center', bgcolor: '#fafafa', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, cursor: 'pointer', '&:hover': { bgcolor: '#fff5f0', borderColor: '#ffb74d' } }}
                            >
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    ref={modalFileInputRef}
                                    onChange={handleModalFileSelect}
                                />
                                <CloudUploadOutlinedIcon sx={{ fontSize: 48, color: '#ffb74d' }} />
                                <Typography variant="body2" color="text.secondary">
                                    Görsellerinizi bu alana sürükleyip bırakın
                                </Typography>
                                <Typography variant="body2" color="text.disabled" sx={{ my: 1 }}>
                                    ya da
                                </Typography>
                                <Button variant="text" sx={{ color: '#ff6a00', bgcolor: '#fff5f0', textTransform: 'none', fontWeight: 'bold', px: 3, py: 1, borderRadius: 2 }}>
                                    Bilgisayarınızdan seçin
                                </Button>
                            </Box>

                            <Grid container spacing={2} sx={{ mt: 3 }}>
                                <Grid item xs={12} md={4}>
                                    <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', height: '100%', borderRadius: 2, borderColor: '#e0e0e0' }}>
                                        <CropFreeIcon sx={{ fontSize: 32, color: '#4caf50', mb: 1 }} />
                                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, color: '#212121' }}>Görsel boyutu</Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.5 }}>
                                            Görsel, <strong>minimum 500x500</strong> piksel olmalı ve yakınlaştırma fonksiyonunun çalışabilmesi için <strong>maksimum 2500x2500</strong> piksel olmalıdır.
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', height: '100%', borderRadius: 2, borderColor: '#e0e0e0' }}>
                                        <LayersIcon sx={{ fontSize: 32, color: '#4dd0e1', mb: 1 }} />
                                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, color: '#212121' }}>Görsel içeriği</Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.5 }}>
                                            Görselde sadece satılmak istenen ürünün fotoğrafı olmalıdır. Ek logo, yazı, resim yer almamalı ve görselde kullanılan <strong>arka plan beyaz</strong> olmalıdır.
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', height: '100%', borderRadius: 2, borderColor: '#e0e0e0' }}>
                                        <InsertPhotoIcon sx={{ fontSize: 32, color: '#4dd0e1', mb: 1 }} />
                                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, color: '#212121' }}>Görsel formatı</Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.5 }}>
                                            Yüksek çözünürlükte .PNG, .JPEG, .JPG formatında olmalıdır.
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Box>
                    )}


                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={handleCloseMediaModal} color="inherit" sx={{ textTransform: 'none', fontWeight: 'bold' }}>Vazgeç</Button>
                    <Button onClick={handleSaveVariantMedia} variant="contained" sx={{ bgcolor: '#ff6a00', '&:hover': { bgcolor: '#e65100' }, textTransform: 'none', fontWeight: 'bold', px: 3 }}>
                        Seçilenleri yükle
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CreateProductPage;
