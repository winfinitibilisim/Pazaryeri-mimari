import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../../contexts/CategoryContext';
import { useProductOptions, ProductOption } from '../../contexts/ProductOptionContext';
import { useProductClasses } from '../../contexts/ProductClassContext';
import { useProductFeatures, ProductFeature } from '../../contexts/ProductFeatureContext';
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
    Badge,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Collapse,
    Tooltip,
    Popover
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
    InsertPhoto as InsertPhotoIcon,
    Add as AddIcon,
    AutoAwesome as AutoAwesomeIcon,
    Code as HtmlIcon,
    ExpandMore as ExpandMoreIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon
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
    partyLot?: string;
    selected?: boolean;
}

const quillModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image', 'video'], // Video support
        ['clean']
    ]
};

const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
];

const CreateProductPage: React.FC = () => {
    const navigate = useNavigate();
    const { options } = useProductOptions();
    const { classes: productClassesList } = useProductClasses();
    const [activeTab, setActiveTab] = useState(0);

    // Basic Details
    const [productName, setProductName] = useState('');
    const [sku, setSku] = useState('');
    const [barcode, setBarcode] = useState('');
    const [descriptions, setDescriptions] = useState<{ id: string, content: string }[]>([{ id: `desc-${Date.now()}`, content: '' }]);

    // Pricing & Stock
    const [purchasePrice, setPurchasePrice] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [currency, setCurrency] = useState('TRY');
    const [stock, setStock] = useState('');
    const [taxRate, setTaxRate] = useState('20');
    const [otvRate, setOtvRate] = useState('0');

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
    const [packageFrontImage, setPackageFrontImage] = useState<string | null>(null);
    const [packageBackImage, setPackageBackImage] = useState<string | null>(null);

    // Variants State
    const [variants, setVariants] = useState<VariantRow[]>([]);
    const [isLegalInfoModalOpen, setIsLegalInfoModalOpen] = useState(false);
    
    // Size Chart Modal State
    const [isSizeChartModalOpen, setIsSizeChartModalOpen] = useState(false);
    const [sizeChartData, setSizeChartData] = useState<any[]>([{ id: `sc-${Date.now()}`, name: '', us: '', uk: '', eu: '', waist: '', hip: '', neck: '', chest: '' }]);
    const [sizeChartImage, setSizeChartImage] = useState<string | null>(null);

    const [bulkPrice, setBulkPrice] = useState('');
    const [bulkStock, setBulkStock] = useState('');

    const { categories: categoryRoots } = useCategories();
    const brands = ['winfini', 'Nike', 'Apple', 'Samsung', 'Adidas', 'Sony'];

    // Seçili kategoriye göre kullanılabilir seçenekleri state'te güncelleriz
    const [availableSizes, setAvailableSizes] = useState<string[]>([]);
    const [availableColors, setAvailableColors] = useState<string[]>([]);
    const [matchedOptions, setMatchedOptions] = useState<ProductOption[]>([]);
    const { features: allFeatures } = useProductFeatures();
    const [matchedFeatures, setMatchedFeatures] = useState<ProductFeature[]>([]);
    const [selectedDynamicFeatures, setSelectedDynamicFeatures] = useState<Record<string, string | string[]>>({});

    React.useEffect(() => {
        if (category) {
            // Sınıfı belirle
            let currentClassObj = productClassesList.find(c => c.name === productClass);
            if (!currentClassObj) {
                const matchingClasses = productClassesList.filter(c => c.categories.some(cat => cat.name === category));
                if (matchingClasses.length > 0) {
                    currentClassObj = matchingClasses[0];
                    setProductClass(currentClassObj.name);
                } else {
                    setProductClass('');
                }
            }

            let matched: ProductOption[] = [];
            let matchedFeats: ProductFeature[] = [];

            if (currentClassObj) {
                // Sadece Sınıfta tanımlı olan zorunlu seçenekleri listele
                matched = options.filter(opt => currentClassObj!.options.some(co => co.id === opt.id));
                matchedFeats = allFeatures.filter(feat => currentClassObj!.features.some(cf => cf.id === feat.id));
            }

            // Ve kullanıcının istediği gibi "renk" seçeneğini her zaman dahil edelim
            const renkOption = options.find(o => o.name.toLowerCase().includes('renk'));
            if (renkOption && !matched.some(m => m.id === renkOption.id)) {
                matched.push(renkOption);
            }

            // Özellikler için de kategori eşleşmesini sınıflar üzerinden birleştir
            const catClasses = productClassesList.filter(c => c.categories.some(cat => category.toLowerCase().includes(cat.name.toLowerCase()) || cat.name.toLowerCase().includes(category.toLowerCase())));
            catClasses.forEach(c => {
                const cFeats = allFeatures.filter(feat => c.features.some(cf => cf.id === feat.id));
                cFeats.forEach(feat => {
                    if (!matchedFeats.some(mf => mf.id === feat.id)) {
                        matchedFeats.push(feat);
                    }
                });
            });
            
            setMatchedOptions(matched);
            setMatchedFeatures(matchedFeats);
            setSelectedDynamicFeatures({});

            const colorOption = matched.find(o => o.name.toLowerCase().includes('renk'));
            const sizeOption = matched.find(o => o.name.toLowerCase().includes('beden'));

            const newSizes = sizeOption ? sizeOption.values.map(v => v.name) : [];
            const newColors = colorOption ? colorOption.values.map(v => v.name) : [];

            setAvailableSizes(newSizes);
            setAvailableColors(newColors);

            // Eğer kategori değiştiyse ve eski seçili değerler yeni available listede yoksa temizle
            setSelectedSizes(prev => prev.filter(p => newSizes.includes(p)));
            setSelectedColors(prev => prev.filter(p => newColors.includes(p)));
        } else {
            setMatchedOptions([]);
            setMatchedFeatures([]);
            setAvailableSizes([]);
            setAvailableColors([]);
        }
    }, [category, productClass, productClassesList, options, allFeatures]);

    // Accordion State
    const [categoryExpanded, setCategoryExpanded] = useState<string | false>(false);
    const handleCategoryAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setCategoryExpanded(isExpanded ? panel : false);
    };
    const [categoryAnchorEl, setCategoryAnchorEl] = useState<null | HTMLElement>(null);

    React.useEffect(() => {
        let newVariants: VariantRow[] = [];

        const hasOptions = availableColors.length > 0 || availableSizes.length > 0 || availableNumbers.length > 0 || availableRams.length > 0 || availableScreenSize.length > 0;
        const hasSelection = selectedColors.length > 0 || selectedSizes.length > 0 || selectedNumbers.length > 0 || selectedRam.length > 0 || selectedScreenSize.length > 0;

        if (hasOptions && !hasSelection && matchedOptions.length > 0) {
            setVariants([]);
            return;
        }

        const colors = selectedColors.length > 0 ? selectedColors : [undefined];
        const sizes = selectedSizes.length > 0 ? selectedSizes : [undefined];
        const numbers = selectedNumbers.length > 0 ? selectedNumbers : [undefined];
        const rams = selectedRam.length > 0 ? selectedRam : [undefined];
        const screenSizes = selectedScreenSize.length > 0 ? selectedScreenSize : [undefined];

        // DYNAMIC VARIANT GENERATION BASED ON SELECTED OPTIONS
        const activeOptions = matchedOptions.filter(opt => {
            if (opt.name.toLowerCase().includes('renk') && selectedColors.length > 0) return true;
            if (opt.name.toLowerCase().includes('beden') && selectedSizes.length > 0) return true;
            if ((opt.name.toLowerCase().includes('numara') || opt.name.toLowerCase().includes('ayakkabı')) && selectedNumbers.length > 0) return true;
            if (opt.name.toLowerCase().includes('ram') && selectedRam.length > 0) return true;
            if (opt.name.toLowerCase().includes('ekran') && selectedScreenSize.length > 0) return true;
            return false;
        });

        if (activeOptions.length === 0 && matchedOptions.length > 0) {
            setVariants([]);
            return;
        }

        // Generate combinations
        colors.forEach(c => {
            sizes.forEach(s => {
                numbers.forEach(n => {
                    rams.forEach(r => {
                        screenSizes.forEach(ss => {
                            // Only include if the option is part of the class, or if it was explicitly selected
                            const includeColor = c !== undefined;
                            const includeSize = s !== undefined;
                            const includeNum = n !== undefined;
                            const includeRam = r !== undefined;
                            const includeScreen = ss !== undefined;

                            if (!includeColor && !includeSize && !includeNum && !includeRam && !includeScreen) return;

                            const parts = [];
                            if (includeColor) parts.push(c);
                            if (includeSize) parts.push(s);
                            if (includeNum) parts.push(`No${n}`);
                            if (includeRam) parts.push(r);
                            if (includeScreen) parts.push(ss);

                            newVariants.push({
                                id: parts.join('-') || 'TekVaryant',
                                color: c,
                                size: s || n, // Combine size and number for simplicity in UI if only one is used
                                ram: r,
                                screenSize: ss,
                                barcode: '', sku: '', price: '', stock: '', images: [], selected: false
                            });
                        });
                    });
                });
            });
        });

        setVariants(prev => newVariants.map(nv => {
            const existing = prev.find(p => p.id === nv.id);
            return existing ? { ...existing, selected: false } : nv;
        }));
    }, [selectedColors, selectedSizes, selectedNumbers, selectedRam, selectedScreenSize, matchedOptions]);

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



    const availableClasses = category 
        ? productClassesList.filter(c => c.categories.some(cat => cat.name === category)).map(c => c.name) 
        : productClassesList.map(c => c.name);

    const availableTags = ['YENİ', 'Çok Satan', 'Tükendi', 'Fırsat', 'Ücretsiz Kargo'];
    const availableIcons = ['2 Yıl Garanti', 'Hızlı Kargo', 'Yerli Üretim', 'Organik', 'Vegan'];

    const availableNumbers = options.find(o => o.name.toLowerCase().includes('numara') || o.name.toLowerCase().includes('ayakkabı'))?.values.map(v => v.name) || ['36', '37', '38', '39', '40', '41', '42', '43', '44'];

    const availableRams = options.find(o => o.name.toLowerCase().includes('ram'))?.values.map(v => v.name) || ['4 GB', '8 GB', '16 GB', '32 GB'];
    const availableScreenSize = options.find(o => o.name.toLowerCase().includes('ekran'))?.values.map(v => v.name) || ['13 inç', '14 inç', '15.6 inç', '17 inç'];

    const tabs = [
        { label: 'Temel ürün bilgileri' }, // 0
        { label: 'Ürün özellikleri' },     // 1
        { label: 'Ürün açıklaması' },      // 2
        { label: '4 Ürün Denetim Bilgileri' } // 3
    ];

    const handleSave = () => {
        // In a real app, you would collect this state, validate, and call an API
        console.log('Saving product:', {
            productName, sku, barcode, descriptions, purchasePrice, salePrice, stock, category, brand, productClass, selectedProductOption, selectedProductFeature,
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
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <FormControl fullWidth variant="outlined" size="small">
                                            <InputLabel>KDV *</InputLabel>
                                            <Select value={taxRate} label="KDV *" onChange={(e) => setTaxRate(e.target.value)}>
                                                <MenuItem value="1">%1</MenuItem>
                                                <MenuItem value="10">%10</MenuItem>
                                                <MenuItem value="20">%20</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <FormControl fullWidth variant="outlined" size="small">
                                            <InputLabel>ÖTV</InputLabel>
                                            <Select value={otvRate} label="ÖTV" onChange={(e) => setOtvRate(e.target.value)}>
                                                <MenuItem value="0">%0</MenuItem>
                                                <MenuItem value="10">%10</MenuItem>
                                                <MenuItem value="20">%20</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>
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
                                    <FormControl fullWidth size="small">
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                            <InputLabel shrink sx={{ position: 'relative', transform: 'none' }}>Kategori *</InputLabel>
                                            <Typography variant="caption" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
                                                <InfoIcon fontSize="small" /> Seçilen kategori
                                            </Typography>
                                        </Box>
                                        <Box 
                                            onClick={(e) => setCategoryAnchorEl(e.currentTarget)}
                                            sx={{ 
                                                border: '1px solid #c4cdd5', 
                                                borderRadius: 1, 
                                                p: '8.5px 14px', 
                                                cursor: 'pointer',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                bgcolor: 'white',
                                                minHeight: '40px',
                                                '&:hover': { borderColor: 'primary.main' }
                                            }}
                                        >
                                            <Typography variant="body2" color={category ? 'text.primary' : 'text.secondary'}>
                                                {category || 'Lütfen Kategori Seçiniz'}
                                            </Typography>
                                            {category ? (
                                                <IconButton size="small" sx={{ p: 0, '&:hover': { color: 'error.main' } }} onClick={(e) => { e.stopPropagation(); setCategory(''); setProductClass(''); }}>
                                                    <CloseIcon fontSize="small" />
                                                </IconButton>
                                            ) : (
                                                <KeyboardArrowDownIcon fontSize="small" color="action" />
                                            )}
                                        </Box>
                                        <Popover
                                            open={Boolean(categoryAnchorEl)}
                                            anchorEl={categoryAnchorEl}
                                            onClose={() => setCategoryAnchorEl(null)}
                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                                            sx={{ '& .MuiPopover-paper': { width: categoryAnchorEl?.clientWidth, mt: 0.5, border: '1px solid #1976d2', boxShadow: 3, borderRadius: 1 } }}
                                        >
                                            <Box sx={{ p: 0, maxHeight: 400, overflow: 'auto', minWidth: 300 }}>
                                                {categoryRoots.map((catObj) => {
                                                    const catLabel = catObj.name;
                                                    const isExpanded = categoryExpanded === catLabel;
                                                    const hasChildren = catObj.children && catObj.children.length > 0;
                                                    return (
                                                        <Accordion 
                                                            key={catObj.id}
                                                            expanded={isExpanded} 
                                                            onChange={hasChildren ? handleCategoryAccordionChange(catLabel) : undefined}
                                                            disableGutters
                                                            elevation={0}
                                                            sx={{
                                                                '&:before': { display: 'none' },
                                                                borderBottom: '1px solid #f0f0f0',
                                                                '&:last-child': { borderBottom: 0 }
                                                            }}
                                                        >
                                                            <AccordionSummary
                                                                expandIcon={hasChildren ? (isExpanded ? null : <KeyboardArrowRightIcon fontSize="small"/>) : null}
                                                                sx={{ minHeight: 40, '& .MuiAccordionSummary-content': { my: 1 } }}
                                                                onClick={() => {
                                                                    if (!hasChildren) {
                                                                        setCategory(catLabel);
                                                                        setProductClass(catObj.productClass || '');
                                                                        setCategoryAnchorEl(null);
                                                                    }
                                                                }}
                                                            >
                                                                <Typography variant="body2" fontWeight={isExpanded ? 'bold' : 'normal'}>
                                                                    {isExpanded && hasChildren ? <KeyboardArrowDownIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }}/> : null}
                                                                    {catLabel}
                                                                </Typography>
                                                            </AccordionSummary>
                                                            {hasChildren && (
                                                                <AccordionDetails sx={{ p: 0 }}>
                                                                    <List disablePadding>
                                                                        {catObj.children!.map((subCat) => (
                                                                            <ListItemButton 
                                                                                key={subCat.id} 
                                                                                sx={{ pl: 4, py: 0.5, bgcolor: category === subCat.name ? '#f0f7ff' : 'transparent' }}
                                                                                onClick={() => { setCategory(subCat.name); setProductClass(subCat.productClass || catObj.productClass || ''); setCategoryAnchorEl(null); }}
                                                                            >
                                                                                <ListItemText 
                                                                                    primary={subCat.name} 
                                                                                    primaryTypographyProps={{ variant: 'body2', color: category === subCat.name ? 'primary' : 'text.primary', fontWeight: category === subCat.name ? 'bold' : 'normal' }} 
                                                                                />
                                                                            </ListItemButton>
                                                                        ))}
                                                                    </List>
                                                                </AccordionDetails>
                                                            )}
                                                        </Accordion>
                                                    );
                                                })}
                                            </Box>
                                        </Popover>
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

                                {/* Satır 5 & 6: Dinamik Seçenekler (Varyantlar) */}
                                {matchedOptions.map((opt) => (
                                    <Grid item xs={12} md={6} key={opt.id}>
                                        <Autocomplete
                                            multiple
                                            size="small"
                                            options={opt.values.map(v => v.name)}
                                            value={
                                                opt.name.toLowerCase().includes('renk') ? selectedColors :
                                                opt.name.toLowerCase().includes('beden') ? selectedSizes :
                                                (opt.name.toLowerCase().includes('numara') || opt.name.toLowerCase().includes('ayakkabı')) ? selectedNumbers :
                                                opt.name.toLowerCase().includes('ram') ? selectedRam :
                                                opt.name.toLowerCase().includes('ekran') ? selectedScreenSize :
                                                []
                                            }
                                            onChange={(_, newValue) => {
                                                const uniqueVals = newValue.filter((v, i, a) => a.indexOf(v) === i);
                                                if (opt.name.toLowerCase().includes('renk')) setSelectedColors(uniqueVals);
                                                else if (opt.name.toLowerCase().includes('beden')) setSelectedSizes(uniqueVals);
                                                else if (opt.name.toLowerCase().includes('numara') || opt.name.toLowerCase().includes('ayakkabı')) setSelectedNumbers(uniqueVals);
                                                else if (opt.name.toLowerCase().includes('ram')) setSelectedRam(uniqueVals);
                                                else if (opt.name.toLowerCase().includes('ekran')) setSelectedScreenSize(uniqueVals);
                                            }}
                                            renderInput={(params) => <TextField {...params} variant="outlined" label={`${opt.name} *`} placeholder={`${opt.name} Seçin`} />}
                                            renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" color="primary" sx={{ bgcolor: '#eef2ff' }} />)}
                                        />
                                    </Grid>
                                ))}
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
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                                            {matchedOptions.some(opt => opt.hasSizeChart) && (
                                                <Button variant="contained" size="small" onClick={() => setIsSizeChartModalOpen(true)} sx={{ bgcolor: '#ff9800', '&:hover': { bgcolor: '#f57c00' }, textTransform: 'none', borderRadius: 2 }}>
                                                    Beden Tablosu Ekle
                                                </Button>
                                            )}
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
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                <strong>Parti/Lot</strong>
                                                                <Tooltip title="Ürünün parti, lot veya Son Kullanma Tarihi (SKT) bilgisini buraya girebilirsiniz." placement="top">
                                                                    <InfoIcon sx={{ fontSize: 16, color: '#9e9e9e', cursor: 'pointer' }} />
                                                                </Tooltip>
                                                            </Box>
                                                        </TableCell>
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
                                                                    <TextField size="small" placeholder="Parti/Lot girin" value={v.partyLot || ''} onChange={(e) => handleVariantChange(v.id, 'partyLot', e.target.value)} sx={{ minWidth: 120, bgcolor: '#ffffff', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' } }} />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <TextField size="small" placeholder="Barkod girin" value={v.barcode} onChange={(e) => handleVariantChange(v.id, 'barcode', e.target.value)} sx={{ minWidth: 120, bgcolor: '#ffffff', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' } }} />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <TextField size="small" placeholder="Stok kodu girin" value={v.sku} onChange={(e) => handleVariantChange(v.id, 'sku', e.target.value)} sx={{ minWidth: 120, bgcolor: '#ffffff', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' } }} />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <TextField size="small" placeholder="0" value={v.price} onChange={(e) => handleVariantChange(v.id, 'price', e.target.value)} sx={{ minWidth: 100, bgcolor: '#ffffff', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' } }} />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <TextField size="small" placeholder="0" value={v.stock} onChange={(e) => handleVariantChange(v.id, 'stock', e.target.value)} sx={{ minWidth: 100, bgcolor: '#ffffff', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' } }} />
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
                ); case 3: // Ürün Denetim Bilgileri

                return (
                    <Paper sx={{ p: 4, borderRadius: 2, minHeight: '60vh' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                Ürün Denetim Bilgileri
                            </Typography>
                            <Button 
                                variant="text" 
                                size="small" 
                                color="primary" 
                                onClick={() => setIsLegalInfoModalOpen(true)}
                                sx={{ textTransform: 'none', fontWeight: 'bold' }}
                            >
                                Yasal Bilgi
                            </Button>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                            Yönetmelik gereği güvenlik uyarıları ve bilgilendirmelerin satış sayfasında yer alması zorunludur.
                        </Typography>
                        <Divider sx={{ mb: 4 }} />

                        <Box sx={{ mb: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">Üretici Bilgileri</Typography>
                                <Tooltip title="Türkiye'de yerleşik bulunan üretici bilgisi için sırasıyla üretici ticari unvanı, adresi ve e-posta/KEP adresini ekleyiniz. Türkiye'de yerleşik bir üretici bilgisi olmaması durumunda lütfen İthalatçı / Yetkili Temsilci / İfa Hizmet Sağlayıcı Bilgisi bölümünü doldurunuz." placement="top" arrow componentsProps={{ tooltip: { sx: { bgcolor: '#4285F4', color: 'white', fontSize: '13px', px: 2, py: 1.5, borderRadius: 1, maxWidth: 300 } }, arrow: { sx: { color: '#4285F4' } } }}>
                                    <InfoIcon sx={{ fontSize: 16, color: '#9e9e9e', cursor: 'pointer' }} />
                                </Tooltip>
                            </Box>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth size="small" placeholder="Üretici Adı" InputProps={{ endAdornment: <InputAdornment position="end"><Tooltip title="Türkiye'de yerleşik bulunan üretici bilgisi için sırasıyla üretici ticari unvanı, adresi ve e-posta/KEP adresini ekleyiniz. Türkiye'de yerleşik bir üretici bilgisi olmaması durumunda lütfen İthalatçı / Yetkili Temsilci / İfa Hizmet Sağlayıcı Bilgisi bölümünü doldurunuz." placement="top" arrow componentsProps={{ tooltip: { sx: { bgcolor: '#4285F4', color: 'white', fontSize: '13px', px: 2, py: 1.5, borderRadius: 1, maxWidth: 300 } }, arrow: { sx: { color: '#4285F4' } } }}><InfoIcon sx={{ fontSize: 20, color: '#546e7a', cursor: 'pointer' }} /></Tooltip></InputAdornment> }} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth size="small" placeholder="Üretici Mail Adresi" />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth size="small" placeholder="Üretici Adres Bilgisi" />
                                </Grid>
                            </Grid>
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" sx={{ mb: 2 }}>İthalatçı Bilgileri</Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth size="small" placeholder="Birincil İthalatçı Adı" InputProps={{ endAdornment: <InputAdornment position="end"><Tooltip title="Türkiye'de yerleşik bulunan ithalatçı, yetkili temsilci veya ifa hizmet sağlayıcısı için ticari unvanı, adresi ve e-posta/KEP adresini ekleyiniz. Eğer ürünlerinizin Türkiye'de yerleşik bir üreticisi varsa, lütfen Üretici Bilgisi alanını doldurunuz." placement="top" arrow componentsProps={{ tooltip: { sx: { bgcolor: '#4285F4', color: 'white', fontSize: '13px', px: 2, py: 1.5, borderRadius: 1, maxWidth: 350 } }, arrow: { sx: { color: '#4285F4' } } }}><InfoIcon sx={{ fontSize: 20, color: '#546e7a', cursor: 'pointer' }} /></Tooltip></InputAdornment> }} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth size="small" placeholder="Birincil İthalatçı Mail Adresi" />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth size="small" placeholder="Birincil İthalatçı Adres Bilgisi" />
                                </Grid>
                            </Grid>
                            <Button variant="text" color="warning" startIcon={<AddIcon />} sx={{ mt: 2, fontWeight: 'bold', textTransform: 'none' }}>
                                İthalatçı ekle
                            </Button>
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ mb: 1, display: 'block' }}>CE Uygunluk Sembolü</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <FormControl fullWidth size="small">
                                            <Select defaultValue="Ürün görselinde bulunuyor">
                                                <MenuItem value="Ürün görselinde bulunuyor">Ürün görselinde bulunuyor</MenuItem>
                                                <MenuItem value="Bulunmuyor">Bulunmuyor</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <Tooltip title="Listelemiş olduğunuz ürün kategorisinde yer alan ürünlerde CE Uygunluk Sembolü bulunması gerekmektedir. Lütfen ürününüzün CE Uygunluk Sembolü içerdiğini gösteren paket görselini eklediğinizi onaylayın." placement="top" arrow componentsProps={{ tooltip: { sx: { bgcolor: '#4285F4', color: 'white', fontSize: '13px', px: 2, py: 1.5, borderRadius: 1, maxWidth: 300 } }, arrow: { sx: { color: '#4285F4' } } }}>
                                            <InfoIcon sx={{ fontSize: 24, color: '#546e7a', cursor: 'pointer' }} />
                                        </Tooltip>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={8}>
                                    <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ mb: 1, display: 'block' }}>Kullanım Talimatı/Uyarıları</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <TextField fullWidth size="small" placeholder="Kullanım Talimatı/Uyarıları" />
                                        <Tooltip title="Lütfen ürünlerinize ait kullanım talimatı/ uyarıları bilgilerini ekleyiniz. Bu bilgileri ürünlerinize ilişkin kullanım açıklamaları, tüketici uyarıları veya yönetmelik kapsamında tüketicilerin ürünü kullanırken bilmesi gereken açıklama ve uyarılar olabilir." placement="top-end" arrow componentsProps={{ tooltip: { sx: { bgcolor: '#4285F4', color: 'white', fontSize: '13px', px: 2, py: 1.5, borderRadius: 1, maxWidth: 350 } }, arrow: { sx: { color: '#4285F4' } } }}>
                                            <InfoIcon sx={{ fontSize: 24, color: '#546e7a', cursor: 'pointer' }} />
                                        </Tooltip>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>

                        <Box>
                            <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ mb: 2, display: 'block' }}>Görsel Ürün Denetim Bilgileri</Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Box component="label" sx={{ width: 100, height: 140, border: '1px dashed #ff9800', borderRadius: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', '&:hover': { bgcolor: '#fff3e0' }, p: 1, overflow: 'hidden' }}>
                                    <input type="file" hidden accept="image/*" onChange={(e) => { if (e.target.files && e.target.files[0]) setPackageFrontImage(URL.createObjectURL(e.target.files[0])); }} />
                                    {packageFrontImage ? (
                                        <Box component="img" src={packageFrontImage} sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    ) : (
                                        <>
                                            <AddIcon sx={{ color: '#ff9800', mb: 1 }} />
                                            <Typography variant="caption" color="#ff9800" fontWeight="bold" align="center" lineHeight={1.2}>Paket Görseli</Typography>
                                            <Typography variant="caption" color="#ff9800" fontWeight="bold" align="center" lineHeight={1.2}>(ön) Ekle</Typography>
                                        </>
                                    )}
                                </Box>
                                <Box component="label" sx={{ width: 100, height: 140, border: '1px dashed #ff9800', borderRadius: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', '&:hover': { bgcolor: '#fff3e0' }, p: 1, overflow: 'hidden' }}>
                                    <input type="file" hidden accept="image/*" onChange={(e) => { if (e.target.files && e.target.files[0]) setPackageBackImage(URL.createObjectURL(e.target.files[0])); }} />
                                    {packageBackImage ? (
                                        <Box component="img" src={packageBackImage} sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    ) : (
                                        <>
                                            <AddIcon sx={{ color: '#ff9800', mb: 1 }} />
                                            <Typography variant="caption" color="#ff9800" fontWeight="bold" align="center" lineHeight={1.2}>Paket Görseli</Typography>
                                            <Typography variant="caption" color="#ff9800" fontWeight="bold" align="center" lineHeight={1.2}>(arka) Ekle</Typography>
                                        </>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                ); case 5: // Ürün Görselleri

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
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="subtitle1" fontWeight="bold">Ürün Açıklaması <Typography component="span" color="error">*</Typography></Typography>
                                <Button 
                                    variant="contained" 
                                    color="secondary" 
                                    startIcon={<AddIcon />}
                                    onClick={() => setDescriptions(prev => [...prev, { id: `desc-${Date.now()}`, content: '' }])}
                                >
                                    Yeni Açıklama Bloğu Ekle
                                </Button>
                            </Box>
                            {descriptions.map((desc, index) => (
                                <Box key={desc.id} sx={{ mb: 4, bgcolor: 'white', border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f5f5f5', p: 1, borderBottom: '1px solid #e0e0e0' }}>
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ ml: 1 }}>Açıklama Bloku {index + 1}</Typography>
                                        {descriptions.length > 1 && (
                                            <Button 
                                                size="small" 
                                                color="error" 
                                                onClick={() => setDescriptions(prev => prev.filter(d => d.id !== desc.id))}
                                            >
                                                Sil
                                            </Button>
                                        )}
                                    </Box>
                                    <Box sx={{
                                        border: '1px solid #c4cdd5',
                                        borderRadius: 1,
                                        overflow: 'hidden',
                                        bgcolor: '#f4f6f8'
                                    }}>
                                        {/* Custom Quill Toolbar Area */}
                                        <Box sx={{ 
                                            p: 1.5, 
                                            borderBottom: '1px solid #c4cdd5',
                                            bgcolor: '#f4f6f8',
                                            '.ql-picker-label': { outline: 'none' }
                                        }}>
                                            <Box id={`toolbar-${desc.id}`}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
                                                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'center' }}>
                                                        <button className="ql-bold" />
                                                        <button className="ql-italic" />
                                                        <button className="ql-underline" />
                                                        <span className="ql-formats" style={{ marginRight: '8px' }}>
                                                            <select className="ql-align" />
                                                        </span>
                                                        <span className="ql-formats" style={{ marginRight: '8px' }}>
                                                            <select className="ql-size">
                                                                <option value="small"></option>
                                                                <option selected></option>
                                                                <option value="large"></option>
                                                                <option value="huge"></option>
                                                            </select>
                                                        </span>
                                                        <span className="ql-formats" style={{ marginRight: '8px' }}>
                                                            <button className="ql-list" value="ordered" />
                                                            <button className="ql-list" value="bullet" />
                                                        </span>
                                                        <span className="ql-formats" style={{ marginRight: '8px' }}>
                                                            <select className="ql-color" />
                                                        </span>
                                                        <button className="ql-link" />
                                                        <button className="ql-image" />
                                                    </Box>
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        sx={{ bgcolor: '#2d3748', color: 'white', '&:hover': { bgcolor: '#1a202c' }, textTransform: 'none', borderRadius: 1, px: 2, ml: 2, height: '32px' }}
                                                        startIcon={<HtmlIcon fontSize="small"/>}
                                                    >
                                                        Html Göster
                                                    </Button>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <button className="ql-undo" style={{ marginRight: '8px', marginLeft: '4px' }}>
                                                        <svg viewBox="0 0 18 18"> <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10"></polygon> <path className="ql-stroke" d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"></path> </svg>
                                                    </button>
                                                    <button className="ql-redo" style={{ marginRight: '8px' }}>
                                                        <svg viewBox="0 0 18 18"> <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10"></polygon> <path className="ql-stroke" d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"></path> </svg>
                                                    </button>
                                                    <button className="ql-clean" style={{ marginRight: '16px' }} />
                                                    
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        sx={{ bgcolor: '#ff2d85', color: 'white', '&:hover': { bgcolor: '#e01b6a' }, textTransform: 'none', fontWeight: 'bold', borderRadius: 1, px: 2, height: '32px' }}
                                                        startIcon={<AutoAwesomeIcon sx={{ fontSize: '18px !important' }}/>}
                                                    >
                                                        Yapay Zeka ile hızlı açıklama oluştur
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Box sx={{
                                            bgcolor: 'white',
                                            '& .ql-toolbar': { border: 'none', display: 'none' }, 
                                            '& .ql-container': {
                                                border: 'none',
                                                minHeight: '250px',
                                                fontSize: '1rem'
                                            },
                                        }}>

                                            <ReactQuill
                                                theme="snow"
                                                value={desc.content}
                                                onChange={(content) => {
                                                    setDescriptions(prev => prev.map(d => d.id === desc.id ? { ...d, content } : d));
                                                }}
                                                placeholder="Ürününüzün detaylı açıklamasını buraya yazın..."
                                                modules={{
                                                    toolbar: {
                                                        container: `#toolbar-${desc.id}`
                                                    },
                                                    history: {
                                                        delay: 500,
                                                        maxStack: 100,
                                                        userOnly: true
                                                    }
                                                }}
                                                formats={[
                                                    'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
                                                    'list', 'bullet', 'indent', 'link', 'image', 'video', 'align', 'size', 'color'
                                                ]}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
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
                            {(!productClass && matchedFeatures.length === 0) ? (
                                <Box sx={{ textAlign: 'center', py: 5, bgcolor: '#f5f5f5', borderRadius: 2, border: '1px dashed #bdbdbd' }}>
                                    <InfoIcon sx={{ fontSize: 48, color: '#9e9e9e', mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary">Özellikleri Görmek İçin Kategori veya Sınıf Seçin</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Lütfen 'Temel Bilgiler' sekmesinden bir kategori / ürün sınıfı seçiniz.</Typography>
                                    <Button variant="outlined" color="primary" sx={{ mt: 3 }} onClick={() => setActiveTab(0)}>
                                        Geri Dön
                                    </Button>
                                </Box>
                            ) : (
                                <Box>
                                    <Box sx={{ border: '1px solid #e0e0e0', borderTop: '2px solid #3f51b5', borderRadius: 1, p: 3 }}>
                                        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>{productClass ? `${productClass} Özel Teknik Detayları:` : 'Kategoriye Özel Teknik Detaylar:'}</Typography>
                                        <Grid container spacing={3}>
                                            {matchedFeatures.length > 0 ? matchedFeatures.map((feat) => (
                                                <Grid item xs={12} sm={6} key={feat.id}>
                                                    {feat.displayType === 'text' ? (
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            label={`${feat.name} *`}
                                                            variant="outlined"
                                                            value={(selectedDynamicFeatures[feat.id] as string) || ''}
                                                            onChange={(e) => setSelectedDynamicFeatures(prev => ({ ...prev, [feat.id]: e.target.value }))}
                                                        />
                                                    ) : (
                                                        <Autocomplete
                                                            multiple={feat.displayType === 'multiple'}
                                                            size="small"
                                                            options={feat.displayType === 'multiple' ? ['Tümünü Seç', ...feat.values.map(v => v.name)] : feat.values.map(v => v.name)}
                                                            value={
                                                                feat.displayType === 'multiple'
                                                                    ? ((selectedDynamicFeatures[feat.id] as string[]) || [])
                                                                    : ((selectedDynamicFeatures[feat.id] as string) || null)
                                                            }
                                                            onChange={(_, newValue) => {
                                                                if (feat.displayType === 'multiple') {
                                                                    const arr = newValue as string[];
                                                                    if (arr.includes('Tümünü Seç')) {
                                                                        setSelectedDynamicFeatures(prev => ({ ...prev, [feat.id]: feat.values.map(v => v.name) }));
                                                                    } else {
                                                                        setSelectedDynamicFeatures(prev => ({ ...prev, [feat.id]: arr }));
                                                                    }
                                                                } else {
                                                                    setSelectedDynamicFeatures(prev => ({ ...prev, [feat.id]: newValue as string }));
                                                                }
                                                            }}
                                                            renderInput={(params) => <TextField {...params} variant="outlined" label={`${feat.name} *`} placeholder={`${feat.name} Seçin`} />}
                                                            renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />)}
                                                        />
                                                    )}
                                                </Grid>
                                            )) : (
                                                <Grid item xs={12}>
                                                    <Typography color="text.secondary">Bu sınıfa ait özel bir özellik henüz tanımlanmamış. Ürün Sınıfları menüsünden ekleyebilirsiniz.</Typography>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </Box>
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
                                    {matchedOptions.some(o => o.name.toLowerCase().includes('renk') || o.name.toLowerCase().includes('beden')) && (
                                        <Box sx={{ border: '1px solid #e0e0e0', borderTop: '2px solid #ff9800', borderRadius: 1, p: 3, mb: 3 }}>
                                            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>Renk ve Beden Seçenekleri:</Typography>
                                            <Grid container spacing={3}>
                                                {matchedOptions.some(o => o.name.toLowerCase().includes('renk')) && (
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
                                                )}
                                                {matchedOptions.some(o => o.name.toLowerCase().includes('beden')) && (
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
                                                )}
                                            </Grid>
                                        </Box>
                                    )}

                                    {matchedOptions.some(o => o.name.toLowerCase().includes('numara') || o.name.toLowerCase().includes('ayakkabı')) && (
                                        <Box sx={{ border: '1px solid #e0e0e0', borderTop: '2px solid #ff9800', borderRadius: 1, p: 3, mb: 3 }}>
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

                                    {matchedOptions.some(o => o.name.toLowerCase().includes('ram') || o.name.toLowerCase().includes('ekran')) && (
                                        <Box sx={{ border: '1px solid #e0e0e0', borderTop: '2px solid #ff9800', borderRadius: 1, p: 3, mb: 3 }}>
                                            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>RAM Kapasitesi ve Ekran Boyutu Seçenekleri:</Typography>
                                            <Grid container spacing={3}>
                                                {matchedOptions.some(o => o.name.toLowerCase().includes('ram')) && (
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
                                                )}
                                                {matchedOptions.some(o => o.name.toLowerCase().includes('ekran')) && (
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
                                                )}
                                            </Grid>
                                        </Box>
                                    )}

                                    {matchedOptions.length === 0 && (
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
    const getDescLen = () => descriptions.reduce((sum, d) => sum + d.content.replace(/<[^>]*>?/gm, '').length, 0);
    const descProgress = Math.min((getDescLen() / 50) * 100, 100);
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
                                    <LinearProgress variant="determinate" value={descProgress} sx={{ height: 8, borderRadius: 4, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: '#ff6a00' } }} />
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

            {/* Yasal Bilgi Modalı */}
            <Dialog open={isLegalInfoModalOpen} onClose={() => setIsLegalInfoModalOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InfoIcon color="primary" />
                    Yasal Bilgi
                </DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Yönetmelik gereği güvenlik uyarıları ve bilgilendirmelerin satış sayfasında yer alması zorunludur. Lütfen ilgili alanları eksiksiz ve doğru bir şekilde doldurduğunuzdan emin olun. 
                        Eksik veya hatalı bilgi girilmesi halinde tüm yasal sorumluluk satıcıya aittir.
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        - <strong>Üretici Bilgileri:</strong> Ürünü üreten firmanın resmi adı, iletişim kurulabilecek bir e-posta adresi veya KEP adresi ve açık adresidir.
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        - <strong>İthalatçı Bilgileri:</strong> Eğer ürün ithal edilmişse, Türkiye'de yerleşik ithalatçı firmanın bilgileri girilmelidir. 
                        Birden fazla ithalatçı olması durumunda "İthalatçı ekle" butonunu kullanabilirsiniz.
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        - <strong>CE Uygunluk Sembolü ve Uyarılar:</strong> Ürün grubuna göre alınması gereken güvenlik ve uygunluk işaretleri ürün ambalajında bulunmalıdır. 
                        Varsa ürünün kullanım talimatları ve güvenlik uyarıları "Kullanım Talimatı / Uyarıları" alanından veya paket görseli yüklenerek alıcılara sunulmalıdır.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsLegalInfoModalOpen(false)} variant="contained" color="primary" sx={{ textTransform: 'none', fontWeight: 'bold' }}>
                        Anladım
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Beden Tablosu Modalı */}
            <Dialog open={isSizeChartModalOpen} onClose={() => setIsSizeChartModalOpen(false)} maxWidth="lg" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    Beden Tablosu Ekle
                </DialogTitle>
                <DialogContent dividers sx={{ bgcolor: '#fbfbfb' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <InfoIcon fontSize="small" />
                        <Typography variant="body2">Ölçü değerlerinin tamamı santimetre (cm) cinsinden olmalıdır.</Typography>
                    </Box>

                    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
                        <Table size="small">
                            <TableHead sx={{ bgcolor: '#f5f7fa' }}>
                                <TableRow>
                                    <TableCell><strong>Kalıp İsmi</strong></TableCell>
                                    <TableCell><strong>US Beden</strong></TableCell>
                                    <TableCell><strong>UK Beden</strong></TableCell>
                                    <TableCell><strong>EU-TR Beden</strong></TableCell>
                                    <TableCell><strong>Bel (cm)</strong></TableCell>
                                    <TableCell><strong>Basen-Kalça (cm)</strong></TableCell>
                                    <TableCell><strong>Boyun</strong></TableCell>
                                    <TableCell><strong>Göğüs Genişliği (cm)</strong></TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sizeChartData.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell><TextField size="small" value={row.name} onChange={(e) => setSizeChartData(prev => prev.map(r => r.id === row.id ? { ...r, name: e.target.value } : r))} sx={{ bgcolor: '#fff' }} /></TableCell>
                                        <TableCell><TextField size="small" value={row.us} onChange={(e) => setSizeChartData(prev => prev.map(r => r.id === row.id ? { ...r, us: e.target.value } : r))} sx={{ bgcolor: '#fff' }} /></TableCell>
                                        <TableCell><TextField size="small" value={row.uk} onChange={(e) => setSizeChartData(prev => prev.map(r => r.id === row.id ? { ...r, uk: e.target.value } : r))} sx={{ bgcolor: '#fff' }} /></TableCell>
                                        <TableCell><TextField size="small" value={row.eu} onChange={(e) => setSizeChartData(prev => prev.map(r => r.id === row.id ? { ...r, eu: e.target.value } : r))} sx={{ bgcolor: '#fff' }} /></TableCell>
                                        <TableCell><TextField size="small" value={row.waist} onChange={(e) => setSizeChartData(prev => prev.map(r => r.id === row.id ? { ...r, waist: e.target.value } : r))} sx={{ bgcolor: '#fff' }} /></TableCell>
                                        <TableCell><TextField size="small" value={row.hip} onChange={(e) => setSizeChartData(prev => prev.map(r => r.id === row.id ? { ...r, hip: e.target.value } : r))} sx={{ bgcolor: '#fff' }} /></TableCell>
                                        <TableCell><TextField size="small" value={row.neck} onChange={(e) => setSizeChartData(prev => prev.map(r => r.id === row.id ? { ...r, neck: e.target.value } : r))} sx={{ bgcolor: '#fff' }} /></TableCell>
                                        <TableCell><TextField size="small" value={row.chest} onChange={(e) => setSizeChartData(prev => prev.map(r => r.id === row.id ? { ...r, chest: e.target.value } : r))} sx={{ bgcolor: '#fff' }} /></TableCell>
                                        <TableCell>
                                            <Button size="small" color="error" onClick={() => setSizeChartData(prev => prev.filter(r => r.id !== row.id))} sx={{ minWidth: 0, p: 1 }}>X</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <Button 
                            variant="outlined" 
                            color="warning" 
                            startIcon={<AddIcon />} 
                            onClick={() => setSizeChartData(prev => [...prev, { id: `sc-${Date.now()}`, name: '', us: '', uk: '', eu: '', waist: '', hip: '', neck: '', chest: '' }])}
                            sx={{ borderRadius: 6, textTransform: 'none', px: 3, fontWeight: 'bold' }}
                        >
                            Beden Ekle
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, justifyContent: 'space-between', alignItems: 'center', bgcolor: '#fff', borderTop: '1px solid #eee' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button variant="outlined" component="label" sx={{ textTransform: 'none', borderRadius: 2, borderColor: '#e0e0e0', color: '#757575', display: 'flex', gap: 1 }}>
                            <InsertPhotoIcon fontSize="small" />
                            {sizeChartImage ? 'Görseli Değiştir' : 'Tablo Görseli Ekle'}
                            <input type="file" hidden accept="image/*" onChange={(e) => { if (e.target.files && e.target.files[0]) { setSizeChartImage(URL.createObjectURL(e.target.files[0])); } }} />
                        </Button>
                        {sizeChartImage && (
                            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                                <img src={sizeChartImage} alt="Tablo Görseli" style={{ maxHeight: 36, borderRadius: 4, border: '1px solid #ccc' }} />
                                <IconButton size="small" color="error" onClick={() => setSizeChartImage(null)} sx={{ ml: 1 }}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        )}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button onClick={() => setIsSizeChartModalOpen(false)} variant="outlined" color="warning" sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2, px: 4 }}>
                            İptal
                        </Button>
                        <Button onClick={() => setIsSizeChartModalOpen(false)} variant="contained" sx={{ bgcolor: '#e0e0e0', color: '#757575', textTransform: 'none', fontWeight: 'bold', borderRadius: 2, px: 4, '&:hover': { bgcolor: '#d5d5d5' } }}>
                            Beden Tablosu Tanımla
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default CreateProductPage;
