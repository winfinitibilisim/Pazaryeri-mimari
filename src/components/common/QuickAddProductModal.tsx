import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Chip,
  Collapse,
  InputLabel,
  SelectChangeEvent
} from '@mui/material';
import { 
  Close as CloseIcon, 
  Refresh as RefreshIcon, 
  TouchApp as TouchAppIcon,
  Category as CategoryIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';

interface QuickAddProductModalProps {
  open: boolean;
  onClose: () => void;
}

// Ürün ekleme kategorileri
const productCategories = [
  {
    id: 'genel',
    name: 'Genel',
    icon: '⭐',
    fields: ['name', 'description', 'status', 'category']
  },
  {
    id: 'toplam-fiyat',
    name: 'Toplam Fiyat',
    icon: '💰',
    fields: ['salePrice', 'purchasePrice', 'discountPrice', 'vatIncluded']
  },
  {
    id: 'stok-bilgileri',
    name: 'Stok Bilgileri',
    icon: '📦',
    fields: ['currentStock', 'minStock', 'stockTracking', 'warehouseInfo']
  },
  {
    id: 'fotograf',
    name: 'Fotoğraf',
    icon: '📷',
    fields: ['mainPhoto', 'gallery', 'video', '360View']
  },
  {
    id: 'vergiler',
    name: 'Vergiler',
    icon: '📊',
    fields: ['vat', 'otv', 'oiv', 'accommodationTax']
  },
  {
    id: 'ek-tanimlamalar',
    name: 'Ek Tanımlamalar',
    icon: '🏷️',
    fields: ['tags', 'features', 'metaInfo', 'seo']
  },
  {
    id: 'videolar',
    name: 'Videolar',
    icon: '🎥',
    fields: ['promoVideo', 'usageVideo', 'youtubeLink', 'vimeoLink']
  },
  {
    id: 'ozellikler',
    name: 'Özellikler',
    icon: '⚙️',
    fields: ['techSpecs', 'dimensions', 'weight', 'material']
  },
  {
    id: 'urun-secenekleri',
    name: 'Ürün Seçenekleri',
    icon: '🎯',
    fields: ['color', 'size', 'dimensions', 'model']
  },
  {
    id: 'varyantlar',
    name: 'Varyantlar',
    icon: '🔄',
    fields: ['colorVariants', 'sizeVariants', 'customVariants', 'combinations']
  },
  {
    id: 'promosyonlar',
    name: 'Promosyonlar',
    icon: '🎁',
    fields: ['discountCampaign', 'giftProduct', 'freeShipping', 'specialOffers']
  },
  {
    id: 'vitrine-ekle',
    name: 'Vitrine Ekle',
    icon: '🏪',
    fields: ['homepage', 'categoryShowcase', 'recommended', 'bestsellers']
  },
  {
    id: 'benzer-urunler',
    name: 'Benzer Ürünler',
    icon: '🔗',
    fields: ['relatedProducts', 'alternatives', 'complementary', 'crossSelling']
  },
  {
    id: 'ek-fiyatlar',
    name: 'Ek Fiyatlar',
    icon: '💳',
    fields: ['shippingFee', 'installationFee', 'insuranceFee', 'extraServices']
  },
  {
    id: 'tedarikci-bilgileri',
    name: 'Tedarikçi Bilgileri',
    icon: '🏢',
    fields: ['supplier', 'supplyTime', 'refProduct', 'hsCode', 'customsInfo']
  }
];

const QuickAddProductModal: React.FC<QuickAddProductModalProps> = ({ open, onClose }) => {
  const { t } = useLanguage();
  
  // Dil seçenekleri
  const languages = [
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ];
  const [selectedCategory, setSelectedCategory] = useState<string>('genel');
  const [selectedCategoryData, setSelectedCategoryData] = useState<any>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['genel']);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<string>('tr');
  const [productNames, setProductNames] = useState<{[key: string]: string}>({
    tr: '',
    en: '',
    ar: '',
    ru: ''
  });
  const [productDescriptions, setProductDescriptions] = useState<{[key: string]: string}>({
    tr: '',
    en: '',
    ar: '',
    ru: ''
  });
  
  // Ürün detay bilgileri
  const [stockCode, setStockCode] = useState<string>('');
  const [barcode, setBarcode] = useState<string>('');
  const [modelNo, setModelNo] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [mainPhoto, setMainPhoto] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [metaInfo, setMetaInfo] = useState<{[key: string]: string}>({
    tr: '',
    en: '',
    ar: '',
    ru: ''
  });
  
  // Fiyat bilgileri
  const [selectedCurrency, setSelectedCurrency] = useState<string>('TRY');
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number>(0);
  const [discountPrice, setDiscountPrice] = useState<number>(0);
  const [discountType, setDiscountType] = useState<'amount' | 'percentage'>('amount');
  
  // Para birimi sembollerini döndüren fonksiyon
  const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = {
      'TRY': '₺',
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'CNY': '¥',
      'RUB': '₽',
      'SAR': 'ر.س',
      'AED': 'د.إ'
    };
    return symbols[currency] || currency;
  };
  
  // Kar marjı hesaplama fonksiyonu
  const calculateProfit = () => {
    const profit = salePrice - purchasePrice;
    const profitPercentage = purchasePrice > 0 ? (profit / purchasePrice) * 100 : 0;
    return {
      profit: profit.toFixed(2),
      percentage: profitPercentage.toFixed(1)
    };
  };
  const [seo, setSeo] = useState<{[key: string]: string}>({
    tr: '',
    en: '',
    ar: '',
    ru: ''
  });
  const [techSpecs, setTechSpecs] = useState<{[key: string]: string}>({
    tr: '',
    en: '',
    ar: '',
    ru: ''
  });
  const [dimensions, setDimensions] = useState<{[key: string]: string}>({
    tr: '',
    en: '',
    ar: '',
    ru: ''
  });
  const [weight, setWeight] = useState<{[key: string]: string}>({
    tr: '',
    en: '',
    ar: '',
    ru: ''
  });
  const [material, setMaterial] = useState<{[key: string]: string}>({
    tr: '',
    en: '',
    ar: '',
    ru: ''
  });
  const [color, setColor] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [model, setModel] = useState<string | null>(null);
  const [colorVariants, setColorVariants] = useState<string[]>([]);
  const [sizeVariants, setSizeVariants] = useState<string[]>([]);
  const [customVariants, setCustomVariants] = useState<string[]>([]);
  const [combinations, setCombinations] = useState<string[]>([]);
  const [vatIncluded, setVatIncluded] = useState<boolean | null>(null);
  const [discountCampaign, setDiscountCampaign] = useState<string | null>(null);
  const [giftProduct, setGiftProduct] = useState<string | null>(null);
  const [freeShipping, setFreeShipping] = useState<boolean | null>(null);
  const [specialOffers, setSpecialOffers] = useState<string[]>([]);
  const [homepage, setHomepage] = useState<boolean | null>(null);
  const [categoryShowcase, setCategoryShowcase] = useState<boolean | null>(null);
  const [recommended, setRecommended] = useState<boolean | null>(null);
  const [bestsellers, setBestsellers] = useState<boolean | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<string[]>([]);
  const [alternatives, setAlternatives] = useState<string[]>([]);
  const [complementary, setComplementary] = useState<string[]>([]);
  const [crossSelling, setCrossSelling] = useState<string[]>([]);
  const [shippingFee, setShippingFee] = useState<number | null>(null);
  const [installationFee, setInstallationFee] = useState<number | null>(null);
  const [insuranceFee, setInsuranceFee] = useState<number | null>(null);
  const [extraServices, setExtraServices] = useState<string[]>([]);
  const [currentStock, setCurrentStock] = useState<number | null>(null);
  const [minStock, setMinStock] = useState<number | null>(null);
  const [stockTracking, setStockTracking] = useState<boolean | null>(null);
  const [warehouseInfo, setWarehouseInfo] = useState<{[key: string]: string}>({
    tr: '',
    en: '',
    ar: '',
    ru: ''
  });
  
  // Depo Stokları
  const [warehouseStocks, setWarehouseStocks] = useState<{id: string, name: string, location: string, quantity: number}[]>([
    { id: '1', name: 'Merkez Depo', location: 'İstanbul', quantity: 0 },
    { id: '2', name: 'Ankara Depo', location: 'Ankara', quantity: 0 }
  ]);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(5);
  
  // Vergi Sınıfları
  const [selectedTaxClass, setSelectedTaxClass] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('TR');
  
  // Ek Tanımlamalar
  const [productTags, setProductTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>('');
  const [productFeatures, setProductFeatures] = useState<{key: string, value: string}[]>([]);
  const [seoTitle, setSeoTitle] = useState<string>('');
  const [seoDescription, setSeoDescription] = useState<string>('');
  const [seoKeywords, setSeoKeywords] = useState<string>('');
  
  // Tedarikçi Bilgileri
  const [supplier, setSupplier] = useState<string>('');
  const [supplyTime, setSupplyTime] = useState<number>(0);
  const [refProduct, setRefProduct] = useState<string>('');
  const [hsCode, setHsCode] = useState<string>('');
  const [customsInfo, setCustomsInfo] = useState<string>('');
  const [fuelInfo, setFuelInfo] = useState<string>('');
  const [openInfo, setOpenInfo] = useState<string>('');
  const [readyInfo, setReadyInfo] = useState<string>('');
  const [supplierPrice, setSupplierPrice] = useState<number>(0);
  
  // Video Bilgileri
  const [promoVideo, setPromoVideo] = useState<string>('');
  const [usageVideo, setUsageVideo] = useState<string>('');
  const [youtubeLink, setYoutubeLink] = useState<string>('');
  const [vimeoLink, setVimeoLink] = useState<string>('');
  const [videoThumbnail, setVideoThumbnail] = useState<string>('');
  const [videoDescription, setVideoDescription] = useState<string>('');
  const [videoDuration, setVideoDuration] = useState<string>('');  
  
  // Özellikler
  const [productProperties, setProductProperties] = useState<{name: string, value: string, unit?: string}[]>([]);
  const [newPropertyName, setNewPropertyName] = useState<string>('');
  const [newPropertyValue, setNewPropertyValue] = useState<string>('');
  const [newPropertyUnit, setNewPropertyUnit] = useState<string>('');
  const [propertyCategories] = useState<string[]>(['Teknik', 'Fiziksel', 'Performans', 'Malzeme', 'Garanti', 'Diğer']);
  const [selectedPropertyCategory, setSelectedPropertyCategory] = useState<string>('Teknik');
  
  // Vitrin Bilgileri
  const [isShowcaseProduct, setIsShowcaseProduct] = useState<boolean>(false);
  const [showcaseCategory, setShowcaseCategory] = useState<string>('');
  const [showcasePosition, setShowcasePosition] = useState<number>(1);
  const [showcasePriority, setShowcasePriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [showcaseStartDate, setShowcaseStartDate] = useState<string>('');
  const [showcaseEndDate, setShowcaseEndDate] = useState<string>('');
  const [showcaseDescription, setShowcaseDescription] = useState<string>('');
  const [showcaseKeywords, setShowcaseKeywords] = useState<string[]>([]);
  const [newShowcaseKeyword, setNewShowcaseKeyword] = useState<string>('');
  const [showcaseDiscount, setShowcaseDiscount] = useState<number>(0);
  const [isShowcaseActive, setIsShowcaseActive] = useState<boolean>(true);
  
  // Benzer Ürünler
  const [similarProducts, setSimilarProducts] = useState<{id: string, name: string, price: number, image?: string, similarity: number}[]>([]);
  const [searchSimilarProduct, setSearchSimilarProduct] = useState<string>('');
  const [similarityThreshold, setSimilarityThreshold] = useState<number>(70);
  const [autoSimilarProducts, setAutoSimilarProducts] = useState<boolean>(true);
  const [similarProductCategories, setSimilarProductCategories] = useState<string[]>([]);
  const [maxSimilarProducts, setMaxSimilarProducts] = useState<number>(6);
  const [similarProductSortBy, setSimilarProductSortBy] = useState<'similarity' | 'price' | 'popularity' | 'newest'>('similarity');
  
  // Ülkelere göre vergi sınıfları
  const taxClassesByCountry = {
    'TR': [
      { id: 'kdv-0', name: 'KDV %0', rate: 0, description: 'KDV muaf ürünler' },
      { id: 'kdv-1', name: 'KDV %1', rate: 1, description: 'Temel gıda maddeleri' },
      { id: 'kdv-8', name: 'KDV %8', rate: 8, description: 'Kitap, gazete, dergi' },
      { id: 'kdv-18', name: 'KDV %18', rate: 18, description: 'Genel mal ve hizmetler' },
      { id: 'kdv-20', name: 'KDV %20', rate: 20, description: 'Lüks tüketim malları' }
    ],
    'US': [
      { id: 'sales-tax-0', name: 'Tax Exempt', rate: 0, description: 'Tax-free products' },
      { id: 'sales-tax-5', name: 'Sales Tax 5%', rate: 5, description: 'Basic goods' },
      { id: 'sales-tax-8', name: 'Sales Tax 8%', rate: 8, description: 'Standard products' },
      { id: 'sales-tax-10', name: 'Sales Tax 10%', rate: 10, description: 'Luxury items' }
    ],
    'DE': [
      { id: 'vat-0', name: 'VAT 0%', rate: 0, description: 'VAT exempt' },
      { id: 'vat-7', name: 'VAT 7%', rate: 7, description: 'Reduced VAT rate' },
      { id: 'vat-19', name: 'VAT 19%', rate: 19, description: 'Standard VAT rate' }
    ],
    'GB': [
      { id: 'vat-0', name: 'VAT 0%', rate: 0, description: 'Zero-rated goods' },
      { id: 'vat-5', name: 'VAT 5%', rate: 5, description: 'Reduced rate' },
      { id: 'vat-20', name: 'VAT 20%', rate: 20, description: 'Standard rate' }
    ],
    'FR': [
      { id: 'tva-0', name: 'TVA 0%', rate: 0, description: 'Exonéré de TVA' },
      { id: 'tva-5.5', name: 'TVA 5,5%', rate: 5.5, description: 'Taux réduit' },
      { id: 'tva-10', name: 'TVA 10%', rate: 10, description: 'Taux intermédiaire' },
      { id: 'tva-20', name: 'TVA 20%', rate: 20, description: 'Taux normal' }
    ]
  };

  // Depo stok yönetimi fonksiyonları
  const handleWarehouseStockChange = (warehouseId: string, quantity: number) => {
    setWarehouseStocks(prev => 
      prev.map(warehouse => 
        warehouse.id === warehouseId 
          ? { ...warehouse, quantity: Math.max(0, quantity) }
          : warehouse
      )
    );
  };
  
  const addNewWarehouse = () => {
    const newId = (warehouseStocks.length + 1).toString();
    setWarehouseStocks(prev => [
      ...prev,
      { id: newId, name: '', location: '', quantity: 0 }
    ]);
  };
  
  const removeWarehouse = (warehouseId: string) => {
    setWarehouseStocks(prev => prev.filter(warehouse => warehouse.id !== warehouseId));
  };
  
  const updateWarehouseInfo = (warehouseId: string, field: 'name' | 'location', value: string) => {
    setWarehouseStocks(prev => 
      prev.map(warehouse => 
        warehouse.id === warehouseId 
          ? { ...warehouse, [field]: value }
          : warehouse
      )
    );
  };
  
  // Ek tanımlamalar fonksiyonları
  const addTag = () => {
    if (newTag.trim() && !productTags.includes(newTag.trim())) {
      setProductTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setProductTags(prev => prev.filter(tag => tag !== tagToRemove));
  };
  
  const addFeature = () => {
    setProductFeatures(prev => [...prev, { key: '', value: '' }]);
  };
  
  const updateFeature = (index: number, field: 'key' | 'value', value: string) => {
    setProductFeatures(prev => 
      prev.map((feature, i) => 
        i === index ? { ...feature, [field]: value } : feature
      )
    );
  };
  
  const removeFeature = (index: number) => {
    setProductFeatures(prev => prev.filter((_, i) => i !== index));
  };
  
  // Video yönetimi fonksiyonları
  const extractVideoId = (url: string, platform: 'youtube' | 'vimeo') => {
    if (platform === 'youtube') {
      const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      return match ? match[1] : null;
    } else if (platform === 'vimeo') {
      const match = url.match(/vimeo\.com\/(\d+)/);
      return match ? match[1] : null;
    }
    return null;
  };
  
  const getVideoThumbnail = (url: string, platform: 'youtube' | 'vimeo') => {
    const videoId = extractVideoId(url, platform);
    if (!videoId) return '';
    
    if (platform === 'youtube') {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    } else if (platform === 'vimeo') {
      return `https://vumbnail.com/${videoId}.jpg`;
    }
    return '';
  };
  
  const validateVideoUrl = (url: string) => {
    const youtubeRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    const vimeoRegex = /^(https?\:\/\/)?(www\.)?vimeo\.com\/.+/;
    return youtubeRegex.test(url) || vimeoRegex.test(url);
  };
  
  // Özellik yönetimi fonksiyonları
  const addProperty = () => {
    if (newPropertyName.trim() && newPropertyValue.trim()) {
      const newProperty = {
        name: newPropertyName.trim(),
        value: newPropertyValue.trim(),
        unit: newPropertyUnit.trim() || undefined
      };
      setProductProperties(prev => [...prev, newProperty]);
      setNewPropertyName('');
      setNewPropertyValue('');
      setNewPropertyUnit('');
    }
  };
  
  const removeProperty = (index: number) => {
    setProductProperties(prev => prev.filter((_, i) => i !== index));
  };
  
  const getPropertyTemplates = (category: string) => {
    const templates: { [key: string]: { name: string; suggestions: string[] }[] } = {
      'Teknik': [
        { name: 'RAM', suggestions: ['4GB', '8GB', '16GB', '32GB', '64GB'] },
        { name: 'İşlemci', suggestions: ['Intel i3', 'Intel i5', 'Intel i7', 'AMD Ryzen 5', 'AMD Ryzen 7'] },
        { name: 'Depolama', suggestions: ['128GB SSD', '256GB SSD', '512GB SSD', '1TB SSD', '1TB HDD'] },
        { name: 'Ekran Kartı', suggestions: ['Intel UHD', 'NVIDIA GTX', 'NVIDIA RTX', 'AMD Radeon'] }
      ],
      'Fiziksel': [
        { name: 'Renk', suggestions: ['Siyah', 'Beyaz', 'Gri', 'Mavi', 'Kırmızı'] },
        { name: 'Ağırlık', suggestions: ['500g', '1kg', '1.5kg', '2kg'] },
        { name: 'Boyut', suggestions: ['Küçük', 'Orta', 'Büyük'] },
        { name: 'Malzeme', suggestions: ['Plastik', 'Metal', 'Cam', 'Ahşap'] }
      ],
      'Performans': [
        { name: 'Hız', suggestions: ['Düşük', 'Orta', 'Yüksek', 'Çok Yüksek'] },
        { name: 'Güç', suggestions: ['10W', '25W', '50W', '100W'] },
        { name: 'Verimlilik', suggestions: ['A+++', 'A++', 'A+', 'A'] }
      ],
      'Garanti': [
        { name: 'Garanti Süresi', suggestions: ['1 Yıl', '2 Yıl', '3 Yıl', '5 Yıl'] },
        { name: 'Servis', suggestions: ['Yetkili Servis', 'Garanti Kapsamında', 'Ücretsiz'] }
      ]
    };
    return templates[category] || [];
  };
  
  // Vitrin yönetimi fonksiyonları
  const addShowcaseKeyword = () => {
    if (newShowcaseKeyword.trim() && !showcaseKeywords.includes(newShowcaseKeyword.trim())) {
      setShowcaseKeywords(prev => [...prev, newShowcaseKeyword.trim()]);
      setNewShowcaseKeyword('');
    }
  };
  
  const removeShowcaseKeyword = (index: number) => {
    setShowcaseKeywords(prev => prev.filter((_, i) => i !== index));
  };
  
  const getShowcaseCategories = () => {
    return [
      'Ana Sayfa Slider',
      'Öne Çıkan Ürünler',
      'Yeni Ürünler',
      'Kampanyalar',
      'İndirimli Ürünler',
      'En Çok Satanlar',
      'Tavsiye Edilenler',
      'Kategori Vitrini',
      'Marka Vitrini',
      'Sezonluk Ürünler'
    ];
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'high': return '#f44336';
      case 'urgent': return '#9c27b0';
      default: return '#ff9800';
    }
  };
  
  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'low': return 'Düşük';
      case 'medium': return 'Orta';
      case 'high': return 'Yüksek';
      case 'urgent': return 'Acil';
      default: return 'Orta';
    }
  };
  
  // Benzer ürünler yönetimi fonksiyonları
  const addSimilarProduct = (product: {id: string, name: string, price: number, image?: string, similarity: number}) => {
    if (!similarProducts.find(p => p.id === product.id)) {
      setSimilarProducts(prev => [...prev, product].slice(0, maxSimilarProducts));
    }
  };
  
  const removeSimilarProduct = (productId: string) => {
    setSimilarProducts(prev => prev.filter(p => p.id !== productId));
  };
  
  const generateMockSimilarProducts = () => {
    const mockProducts = [
      { id: '1', name: 'Laptop Dell XPS 13', price: 25000, similarity: 95, image: '/images/laptop1.jpg' },
      { id: '2', name: 'MacBook Air M2', price: 30000, similarity: 90, image: '/images/laptop2.jpg' },
      { id: '3', name: 'HP Pavilion 15', price: 18000, similarity: 85, image: '/images/laptop3.jpg' },
      { id: '4', name: 'Lenovo ThinkPad X1', price: 28000, similarity: 88, image: '/images/laptop4.jpg' },
      { id: '5', name: 'ASUS ZenBook 14', price: 22000, similarity: 82, image: '/images/laptop5.jpg' },
      { id: '6', name: 'Acer Swift 3', price: 16000, similarity: 78, image: '/images/laptop6.jpg' },
      { id: '7', name: 'MSI Modern 14', price: 20000, similarity: 75, image: '/images/laptop7.jpg' },
      { id: '8', name: 'Samsung Galaxy Book', price: 24000, similarity: 80, image: '/images/laptop8.jpg' }
    ];
    
    const filteredProducts = mockProducts
      .filter(p => p.similarity >= similarityThreshold)
      .sort((a, b) => {
        switch (similarProductSortBy) {
          case 'similarity': return b.similarity - a.similarity;
          case 'price': return a.price - b.price;
          case 'popularity': return Math.random() - 0.5;
          case 'newest': return Math.random() - 0.5;
          default: return b.similarity - a.similarity;
        }
      })
      .slice(0, maxSimilarProducts);
    
    setSimilarProducts(filteredProducts);
  };
  
  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 90) return '#4caf50';
    if (similarity >= 80) return '#8bc34a';
    if (similarity >= 70) return '#ff9800';
    if (similarity >= 60) return '#ff5722';
    return '#f44336';
  };
  
  const getSimilarityLabel = (similarity: number) => {
    if (similarity >= 90) return 'Çok Yüksek';
    if (similarity >= 80) return 'Yüksek';
    if (similarity >= 70) return 'Orta';
    if (similarity >= 60) return 'Düşük';
    return 'Çok Düşük';
  };
  
  const getSortLabel = (sortBy: string) => {
    switch (sortBy) {
      case 'similarity': return 'Benzerlik Oranı';
      case 'price': return 'Fiyat';
      case 'popularity': return 'Popülerlik';
      case 'newest': return 'En Yeni';
      default: return 'Benzerlik Oranı';
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? 'genel' : categoryId);
    if (!expandedCategories.includes(categoryId)) {
      setExpandedCategories(prev => [...prev, categoryId]);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setGalleryImages(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleLanguageChange = (langCode: string) => {
    setCurrentLanguage(langCode);
  };

  const handleProductNameChange = (value: string) => {
    setProductNames(prev => ({
      ...prev,
      [currentLanguage]: value
    }));
  };

  const handleProductDescriptionChange = (value: string) => {
    setProductDescriptions(prev => ({
      ...prev,
      [currentLanguage]: value
    }));
  };

  const renderCategoryContent = (categoryId: string) => {
    switch (categoryId) {
      case 'genel':
        return (
          <Box>
            {/* Ürün Adı - Bayrak ile Dil Seçimi */}
            <Box sx={{ position: 'relative' }}>
              <TextField
                required
                fullWidth
                label="Ürün Adı"
                margin="normal"
                variant="outlined"
                value={productNames[currentLanguage] || ''}
                onChange={(e) => handleProductNameChange(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => {
                          const currentIndex = languages.findIndex(l => l.code === currentLanguage);
                          const nextIndex = (currentIndex + 1) % languages.length;
                          handleLanguageChange(languages[nextIndex].code);
                        }}
                        sx={{
                          p: 0.5,
                          '&:hover': {
                            bgcolor: 'rgba(102, 126, 234, 0.1)'
                          }
                        }}
                      >
                        <Typography sx={{ fontSize: '1.3em' }}>
                          {languages.find(l => l.code === currentLanguage)?.flag}
                        </Typography>
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              {/* Diğer dillerdeki değerleri göster */}
              {Object.entries(productNames).filter(([code]) => code !== currentLanguage && productNames[code]).length > 0 && (
                <Box sx={{ mt: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Diğer dillerdeki değerler:
                  </Typography>
                  {Object.entries(productNames)
                    .filter(([code, value]) => code !== currentLanguage && value)
                    .map(([code, value]) => (
                      <Box key={code} sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Typography sx={{ fontSize: '0.9em' }}>
                          {languages.find(l => l.code === code)?.flag}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {languages.find(l => l.code === code)?.name}: {value}
                        </Typography>
                      </Box>
                    ))
                  }
                </Box>
              )}
            </Box>

            {/* Açıklama - Bayrak ile Dil Seçimi */}
            <Box sx={{ position: 'relative' }}>
              <TextField
                fullWidth
                label="Açıklama"
                margin="normal"
                multiline
                rows={3}
                variant="outlined"
                value={productDescriptions[currentLanguage] || ''}
                onChange={(e) => handleProductDescriptionChange(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          const currentIndex = languages.findIndex(l => l.code === currentLanguage);
                          const nextIndex = (currentIndex + 1) % languages.length;
                          handleLanguageChange(languages[nextIndex].code);
                        }}
                        sx={{
                          p: 0.5,
                          '&:hover': {
                            bgcolor: 'rgba(102, 126, 234, 0.1)'
                          }
                        }}
                      >
                        <Typography sx={{ fontSize: '1.3em' }}>
                          {languages.find(l => l.code === currentLanguage)?.flag}
                        </Typography>
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              {/* Diğer dillerdeki açıklamaları göster */}
              {Object.entries(productDescriptions).filter(([code]) => code !== currentLanguage && productDescriptions[code]).length > 0 && (
                <Box sx={{ mt: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Diğer dillerdeki açıklamalar:
                  </Typography>
                  {Object.entries(productDescriptions)
                    .filter(([code, value]) => code !== currentLanguage && value)
                    .map(([code, value]) => (
                      <Box key={code} sx={{ mt: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography sx={{ fontSize: '0.9em' }}>
                            {languages.find(l => l.code === code)?.flag}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            {languages.find(l => l.code === code)?.name}:
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 2, display: 'block' }}>
                          {value}
                        </Typography>
                      </Box>
                    ))
                  }
                </Box>
              )}
            </Box>

            {/* Stok Kodu, Barkod ve Model No */}
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Stok Kodu *"
                  variant="outlined"
                  value={stockCode}
                  onChange={(e) => setStockCode(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => {
                            // Otomatik stok kodu üretme
                            const randomCode = Math.random().toString(36).substr(2, 9).toUpperCase();
                            setStockCode(randomCode);
                          }}
                          sx={{
                            p: 0.5,
                            '&:hover': {
                              bgcolor: 'rgba(102, 126, 234, 0.1)'
                            }
                          }}
                        >
                          <RefreshIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Barkod"
                  variant="outlined"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => {
                            // Otomatik barkod üretme
                            const randomBarcode = Math.floor(Math.random() * 9000000000000) + 1000000000000;
                            setBarcode(randomBarcode.toString());
                          }}
                          sx={{
                            p: 0.5,
                            '&:hover': {
                              bgcolor: 'rgba(102, 126, 234, 0.1)'
                            }
                          }}
                        >
                          <RefreshIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Model No"
                  variant="outlined"
                  value={modelNo}
                  onChange={(e) => setModelNo(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => {
                            // Otomatik model no üretme
                            const randomModel = 'MDL-' + Math.random().toString(36).substr(2, 6).toUpperCase();
                            setModelNo(randomModel);
                          }}
                          sx={{
                            p: 0.5,
                            '&:hover': {
                              bgcolor: 'rgba(102, 126, 234, 0.1)'
                            }
                          }}
                        >
                          <RefreshIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            {/* Kategori ve Marka Seçimi */}
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              {/* Kategori Seçimi */}
              <Box sx={{ flex: 1 }}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Kategori</InputLabel>
                  <Select
                    value={selectedCategory || ''}
                    label="Kategori"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => {
                            // Yeni kategori ekleme modalı açılabilir
                            console.log('Yeni kategori ekle');
                          }}
                          sx={{
                            p: 0.5,
                            mr: 3,
                            '&:hover': {
                              bgcolor: 'rgba(102, 126, 234, 0.1)'
                            }
                          }}
                        >
                          <AddIcon sx={{ fontSize: '1.2em', color: '#667eea' }} />
                        </IconButton>
                      </InputAdornment>
                    }
                  >
                    {/* Ana Kategoriler */}
                    <MenuItem value="elektronik">📱 Elektronik</MenuItem>
                    <MenuItem value="bilgisayar">💻 Bilgisayar & Tablet</MenuItem>
                    <MenuItem value="telefon">📱 Telefon & Aksesuar</MenuItem>
                    <MenuItem value="tv-ses">📺 TV & Ses Sistemleri</MenuItem>
                    <MenuItem value="beyaz-esya">🏠 Beyaz Eşya</MenuItem>
                    <MenuItem value="kucuk-ev-aletleri">☕ Küçük Ev Aletleri</MenuItem>
                    
                    {/* Giyim & Moda */}
                    <MenuItem value="erkek-giyim">👔 Erkek Giyim</MenuItem>
                    <MenuItem value="kadin-giyim">👗 Kadın Giyim</MenuItem>
                    <MenuItem value="cocuk-giyim">👶 Çocuk Giyim</MenuItem>
                    <MenuItem value="ayakkabi">👟 Ayakkabı</MenuItem>
                    <MenuItem value="canta">👜 Çanta</MenuItem>
                    <MenuItem value="aksesuar">💍 Aksesuar</MenuItem>
                    <MenuItem value="saat">⏰ Saat</MenuItem>
                    
                    {/* Ev & Yaşam */}
                    <MenuItem value="mobilya">🪑 Mobilya</MenuItem>
                    <MenuItem value="dekorasyon">🎨 Dekorasyon</MenuItem>
                    <MenuItem value="mutfak">🍽️ Mutfak</MenuItem>
                    <MenuItem value="banyo">🚿 Banyo</MenuItem>
                    <MenuItem value="yatak-odasi">🛏️ Yatak Odası</MenuItem>
                    <MenuItem value="salon">🛋️ Salon</MenuItem>
                    <MenuItem value="bahce">🌿 Bahçe</MenuItem>
                    <MenuItem value="temizlik">🧹 Temizlik</MenuItem>
                    
                    {/* Spor & Outdoor */}
                    <MenuItem value="spor-giyim">🏃 Spor Giyim</MenuItem>
                    <MenuItem value="fitness">🏋️ Fitness</MenuItem>
                    <MenuItem value="futbol">⚽ Futbol</MenuItem>
                    <MenuItem value="basketbol">🏀 Basketbol</MenuItem>
                    <MenuItem value="tenis">🎾 Tenis</MenuItem>
                    <MenuItem value="yuzme">🏊 Su Sporları</MenuItem>
                    <MenuItem value="outdoor">🏕️ Outdoor</MenuItem>
                    <MenuItem value="bisiklet">🚴 Bisiklet</MenuItem>
                    
                    {/* Sağlık & Güzellik */}
                    <MenuItem value="kozmetik">💄 Kozmetik</MenuItem>
                    <MenuItem value="parfum">🌸 Parfüm</MenuItem>
                    <MenuItem value="cilt-bakimi">🧔 Cilt Bakımı</MenuItem>
                    <MenuItem value="sac-bakimi">💇 Saç Bakımı</MenuItem>
                    <MenuItem value="saglik">💊 Sağlık</MenuItem>
                    <MenuItem value="vitamin">📊 Vitamin & Takviye</MenuItem>
                    
                    {/* Kitap & Hobi */}
                    <MenuItem value="kitap">📚 Kitap</MenuItem>
                    <MenuItem value="dergi">📰 Dergi</MenuItem>
                    <MenuItem value="muzik">🎵 Müzik</MenuItem>
                    <MenuItem value="film">🎥 Film</MenuItem>
                    <MenuItem value="oyun">🎮 Oyun</MenuItem>
                    <MenuItem value="hobi">🎨 Hobi</MenuItem>
                    
                    {/* Çocuk & Bebek */}
                    <MenuItem value="oyuncak">🧸 Oyuncak</MenuItem>
                    <MenuItem value="bebek-bakim">👶 Bebek Bakım</MenuItem>
                    <MenuItem value="cocuk-odasi">🏠 Çocuk Odası</MenuItem>
                    <MenuItem value="egitici-oyuncak">🧩 Eğitici Oyuncak</MenuItem>
                    <MenuItem value="bebek-arabasi">🚼 Bebek Arabası</MenuItem>
                    
                    {/* Otomotiv */}
                    <MenuItem value="otomotiv">🚗 Otomotiv</MenuItem>
                    <MenuItem value="oto-aksesuar">🔧 Oto Aksesuar</MenuItem>
                    <MenuItem value="lastik">🛣️ Lastik</MenuItem>
                    <MenuItem value="motor">🏍️ Motor</MenuItem>
                    <MenuItem value="bisiklet-motor">🚵 Bisiklet & Motor</MenuItem>
                    
                    {/* Yiyecek & İçecek */}
                    <MenuItem value="gida">🍽️ Gıda</MenuItem>
                    <MenuItem value="icecek">🥤 İçecek</MenuItem>
                    <MenuItem value="atistirmalik">🍪 Atıştırmalık</MenuItem>
                    <MenuItem value="organik">🌱 Organik</MenuItem>
                    <MenuItem value="dondurulmus">❄️ Dondurulmuş</MenuItem>
                    
                    {/* Pet Shop */}
                    <MenuItem value="kedi">🐱 Kedi</MenuItem>
                    <MenuItem value="kopek">🐶 Köpek</MenuItem>
                    <MenuItem value="kus">🐦 Kuş</MenuItem>
                    <MenuItem value="balik">🐠 Balık</MenuItem>
                    <MenuItem value="pet-aksesuar">🦴 Pet Aksesuar</MenuItem>
                    
                    {/* Diğer */}
                    <MenuItem value="ofis">💼 Ofis & Kırtasiye</MenuItem>
                    <MenuItem value="hediyelik">🎁 Hediyelik</MenuItem>
                    <MenuItem value="antika">🏺 Antika & Koleksiyon</MenuItem>
                    <MenuItem value="el-yapimi">🧩 El Yapımı</MenuItem>
                    <MenuItem value="diger">📦 Diğer</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Marka Seçimi */}
              <Box sx={{ flex: 1 }}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Marka</InputLabel>
                  <Select
                    value={selectedBrand || ''}
                    label="Marka"
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => {
                            // Yeni marka ekleme modalı açılabilir
                            console.log('Yeni marka ekle');
                          }}
                          sx={{
                            p: 0.5,
                            mr: 3,
                            '&:hover': {
                              bgcolor: 'rgba(102, 126, 234, 0.1)'
                            }
                          }}
                        >
                          <AddIcon sx={{ fontSize: '1.2em', color: '#667eea' }} />
                        </IconButton>
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="apple">🍎 Apple</MenuItem>
                    <MenuItem value="samsung">📱 Samsung</MenuItem>
                    <MenuItem value="nike">👟 Nike</MenuItem>
                    <MenuItem value="adidas">👕 Adidas</MenuItem>
                    <MenuItem value="hp">💻 HP</MenuItem>
                    <MenuItem value="dell">🖥️ Dell</MenuItem>
                    <MenuItem value="sony">🎮 Sony</MenuItem>
                    <MenuItem value="lg">📺 LG</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <FormControl fullWidth margin="normal">
              <Select defaultValue="Aktif" displayEmpty>
                <MenuItem value="Aktif">Aktif</MenuItem>
                <MenuItem value="Pasif">Pasif</MenuItem>
                <MenuItem value="Arşiv">Arşiv</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );
      case 'fotograf':
        return (
          <Box>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="main-photo-upload"
              type="file"
              onChange={handleImageUpload}
            />
            <label htmlFor="main-photo-upload">
              <Button 
                variant="outlined" 
                fullWidth 
                component="span"
                sx={{ 
                  mb: 2, 
                  height: 100,
                  border: selectedImage ? '2px solid #4caf50' : '2px dashed #ccc',
                  backgroundImage: selectedImage ? `url(${selectedImage})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  color: selectedImage ? 'white' : 'inherit',
                  textShadow: selectedImage ? '1px 1px 2px rgba(0,0,0,0.7)' : 'none'
                }}
              >
                {selectedImage ? 'Fotoğraf Değiştir' : 'Ana Fotoğraf Yükle'}
              </Button>
            </label>
            
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="gallery-upload"
              type="file"
              multiple
              onChange={handleGalleryUpload}
            />
            <label htmlFor="gallery-upload">
              <Button 
                variant="outlined" 
                fullWidth 
                component="span"
                sx={{ mb: 2, height: 60 }}
              >
                Galeri Fotoğrafları ({galleryImages.length} adet)
              </Button>
            </label>
            
            {galleryImages.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {galleryImages.map((img, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 60,
                      height: 60,
                      backgroundImage: `url(${img})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      border: '1px solid #ccc',
                      borderRadius: 1,
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setGalleryImages(prev => prev.filter((_, i) => i !== index));
                    }}
                  />
                ))}
              </Box>
            )}
            
            <TextField
              fullWidth
              label="Video URL"
              margin="normal"
              placeholder="YouTube veya Vimeo linki"
            />
          </Box>
        );
      case 'toplam-fiyat':
        return (
          <Box>
            {/* Para Birimi Seçimi */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Para Birimi</InputLabel>
              <Select 
                value={selectedCurrency} 
                onChange={(e: SelectChangeEvent) => setSelectedCurrency(e.target.value)} 
                label="Para Birimi"
              >
                <MenuItem value="TRY">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>₺</Typography>
                    <Typography>Türk Lirası (TRY)</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="USD">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>$</Typography>
                    <Typography>Amerikan Doları (USD)</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="EUR">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>€</Typography>
                    <Typography>Euro (EUR)</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="GBP">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>£</Typography>
                    <Typography>İngiliz Sterlini (GBP)</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="JPY">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>¥</Typography>
                    <Typography>Japon Yeni (JPY)</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="CNY">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>¥</Typography>
                    <Typography>Çin Yuanı (CNY)</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="RUB">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>₽</Typography>
                    <Typography>Rus Rublesi (RUB)</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="SAR">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>ر.س</Typography>
                    <Typography>Suudi Riyali (SAR)</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="AED">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>د.إ</Typography>
                    <Typography>BAE Dirhemi (AED)</Typography>
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            {/* Alış Fiyatı */}
            <TextField
              fullWidth
              label="Alış Fiyatı"
              type="number"
              margin="normal"
              value={purchasePrice || ''}
              onChange={(e) => setPurchasePrice(Number(e.target.value) || 0)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography color="text.secondary">{getCurrencySymbol(selectedCurrency)}</Typography>
                  </InputAdornment>
                ),
              }}
              helperText="Ürünün tedarikçiden alındığı fiyat"
            />

            {/* Satış Fiyatı */}
            <TextField
              fullWidth
              label="Satış Fiyatı"
              type="number"
              margin="normal"
              value={salePrice || ''}
              onChange={(e) => setSalePrice(Number(e.target.value) || 0)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography color="text.secondary">{getCurrencySymbol(selectedCurrency)}</Typography>
                  </InputAdornment>
                ),
              }}
              helperText="Müşteriye satılacak fiyat"
            />

            {/* Kar Marjı Hesaplama */}
            <Paper sx={{ p: 2, mt: 2, bgcolor: '#f8f9fa', border: '1px solid #e9ecef' }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: '#495057' }}>
                Kar Marjı Hesaplama
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Kar Tutarı:</Typography>
                <Typography 
                  variant="body2" 
                  fontWeight={500}
                  sx={{ 
                    color: calculateProfit().profit.startsWith('-') ? '#d32f2f' : '#2e7d32'
                  }}
                >
                  {calculateProfit().profit} {getCurrencySymbol(selectedCurrency)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Kar Oranı:</Typography>
                <Typography 
                  variant="body2" 
                  fontWeight={500}
                  sx={{ 
                    color: calculateProfit().percentage.startsWith('-') ? '#d32f2f' : '#2e7d32'
                  }}
                >
                  %{calculateProfit().percentage}
                </Typography>
              </Box>
              {purchasePrice > 0 && salePrice > 0 && (
                <Box sx={{ mt: 1, p: 1, bgcolor: calculateProfit().profit.startsWith('-') ? '#ffebee' : '#e8f5e8', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {calculateProfit().profit.startsWith('-') 
                      ? '⚠️ Zarar durumu: Satış fiyatı alış fiyatından düşük!' 
                      : '✅ Kar durumu: Satış fiyatı alış fiyatından yüksek.'}
                  </Typography>
                </Box>
              )}
            </Paper>

            {/* İndirim Alanı */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                İndirim (Opsiyonel)
              </Typography>
              
              {/* İndirim Tipi Seçimi */}
              <RadioGroup
                row
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as 'amount' | 'percentage')}
                sx={{ mb: 1 }}
              >
                <FormControlLabel 
                  value="amount" 
                  control={<Radio size="small" />} 
                  label="Rakam" 
                  sx={{ mr: 3 }}
                />
                <FormControlLabel 
                  value="percentage" 
                  control={<Radio size="small" />} 
                  label="Yüzde (%)" 
                />
              </RadioGroup>
              
              {/* İndirim Değeri */}
              <TextField
                fullWidth
                label={discountType === 'amount' ? 'İndirim Tutarı' : 'İndirim Yüzdesi'}
                type="number"
                value={discountPrice || ''}
                onChange={(e) => setDiscountPrice(Number(e.target.value) || 0)}
                placeholder={discountType === 'amount' ? 'İndirim tutarını girin' : 'İndirim yüzdesini girin'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography color="text.secondary">
                        {discountType === 'amount' ? getCurrencySymbol(selectedCurrency) : '%'}
                      </Typography>
                    </InputAdornment>
                  ),
                }}
                helperText={discountType === 'amount' ? 'Kampanya veya indirim tutarı' : 'İndirim yüzdesi (0-100 arası)'}
              />
              
              {/* İndirim Hesaplama ve Kar Marjı Önizlemesi */}
              {discountPrice > 0 && salePrice > 0 && (
                <Box sx={{ mt: 1, p: 1.5, bgcolor: '#e3f2fd', borderRadius: 1, border: '1px solid #bbdefb' }}>
                  {(() => {
                    const discountedPrice = discountType === 'amount' 
                      ? salePrice - discountPrice
                      : salePrice * (1 - discountPrice / 100);
                    
                    const discountedProfit = discountedPrice - purchasePrice;
                    const discountedProfitPercentage = purchasePrice > 0 ? (discountedProfit / purchasePrice) * 100 : 0;
                    
                    return (
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                          📊 İndirim Hesaplama Özeti
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            <strong>İndirimli Fiyat:</strong> {getCurrencySymbol(selectedCurrency)}{discountedPrice.toFixed(2)}
                            {discountType === 'percentage' && ` (${discountPrice}% indirim)`}
                          </Typography>
                          
                          <Typography variant="caption" color="text.secondary">
                            <strong>Alış Fiyatı:</strong> {getCurrencySymbol(selectedCurrency)}{purchasePrice.toFixed(2)}
                          </Typography>
                          
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: discountedProfit >= 0 ? '#2e7d32' : '#d32f2f',
                              fontWeight: 600 
                            }}
                          >
                            <strong>İndirimli Kar:</strong> {getCurrencySymbol(selectedCurrency)}{discountedProfit.toFixed(2)} 
                            ({discountedProfitPercentage >= 0 ? '+' : ''}{discountedProfitPercentage.toFixed(1)}%)
                          </Typography>
                          
                          {discountedProfit < 0 && (
                            <Typography variant="caption" sx={{ color: '#d32f2f', fontWeight: 600 }}>
                              ⚠️ Dikkat: İndirimli fiyat zarar durumunda!
                            </Typography>
                          )}
                          
                          {discountedProfit >= 0 && discountedProfitPercentage < 10 && (
                            <Typography variant="caption" sx={{ color: '#ed6c02', fontWeight: 600 }}>
                              ⚡ Uyarı: Kar marjı %10'un altında
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    );
                  })()
                  }
                </Box>
              )}
            </Box>
          </Box>
        );
      case 'stok-bilgileri':
        return (
          <Box>
            <TextField
              fullWidth
              label="Stok Kodu"
              margin="normal"
              value={stockCode}
              onChange={(e) => setStockCode(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" color="primary">
                      <RefreshIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Barkod"
              margin="normal"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
            />
            
            {/* Düşük Stok Eşiği */}
            <TextField
              fullWidth
              label="Düşük Stok Eşiği"
              type="number"
              margin="normal"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(Number(e.target.value) || 0)}
              InputProps={{
                inputProps: { min: 0 }
              }}
              helperText="Bu değerin altındaki stoklar uyarı verecek"
            />

            {/* Depo Stokları */}
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    bgcolor: '#1976d2', 
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Typography sx={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
                      🏢
                    </Typography>
                  </Box>
                  Depo Stokları
                </Typography>
              </Box>
              
              {/* Depo Listesi */}
              <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
                {/* Başlık */}
                <Box sx={{ 
                  bgcolor: '#f5f5f5', 
                  p: 1.5, 
                  display: 'grid', 
                  gridTemplateColumns: '2fr 2fr 1fr 60px',
                  gap: 2,
                  alignItems: 'center',
                  borderBottom: '1px solid #e0e0e0'
                }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Depo Adı</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Konum</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Miktar</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}></Typography>
                </Box>
                
                {/* Depo Satırları */}
                {warehouseStocks.map((warehouse, index) => (
                  <Box key={warehouse.id} sx={{ 
                    p: 1.5, 
                    display: 'grid', 
                    gridTemplateColumns: '2fr 2fr 1fr 60px',
                    gap: 2,
                    alignItems: 'center',
                    borderBottom: index < warehouseStocks.length - 1 ? '1px solid #f0f0f0' : 'none',
                    '&:hover': { bgcolor: '#fafafa' }
                  }}>
                    <TextField
                      size="small"
                      placeholder="Depo adı girin"
                      value={warehouse.name}
                      onChange={(e) => updateWarehouseInfo(warehouse.id, 'name', e.target.value)}
                      variant="outlined"
                    />
                    <TextField
                      size="small"
                      placeholder="Konum girin"
                      value={warehouse.location}
                      onChange={(e) => updateWarehouseInfo(warehouse.id, 'location', e.target.value)}
                      variant="outlined"
                    />
                    <TextField
                      size="small"
                      type="number"
                      value={warehouse.quantity}
                      onChange={(e) => handleWarehouseStockChange(warehouse.id, Number(e.target.value) || 0)}
                      variant="outlined"
                      InputProps={{
                        inputProps: { min: 0 },
                        sx: {
                          color: warehouse.quantity <= lowStockThreshold ? '#d32f2f' : 'inherit',
                          fontWeight: warehouse.quantity <= lowStockThreshold ? 600 : 'normal'
                        }
                      }}
                    />
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => removeWarehouse(warehouse.id)}
                      disabled={warehouseStocks.length <= 1}
                      sx={{ 
                        opacity: warehouseStocks.length <= 1 ? 0.3 : 1,
                        '&:hover': {
                          bgcolor: warehouseStocks.length > 1 ? 'rgba(211, 47, 47, 0.1)' : 'transparent'
                        }
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
                
                {/* Depo Ekle Butonu */}
                <Box sx={{ p: 1.5, borderTop: '1px solid #f0f0f0', bgcolor: '#fafafa' }}>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={addNewWarehouse}
                    variant="outlined"
                    size="small"
                    sx={{ 
                      borderStyle: 'dashed',
                      color: '#666',
                      borderColor: '#ccc',
                      '&:hover': {
                        borderColor: '#1976d2',
                        color: '#1976d2',
                        bgcolor: 'rgba(25, 118, 210, 0.04)'
                      }
                    }}
                  >
                    Depo Ekle
                  </Button>
                </Box>
              </Box>
              
              {/* Toplam Stok Özeti */}
              {warehouseStocks.length > 0 && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 1, border: '1px solid #e9ecef' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    📊 Stok Özeti
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      <strong>Toplam Stok:</strong> {warehouseStocks.reduce((total, w) => total + w.quantity, 0)} adet
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      <strong>Aktif Depo Sayısı:</strong> {warehouseStocks.filter(w => w.name && w.location).length} depo
                    </Typography>
                    {warehouseStocks.some(w => w.quantity <= lowStockThreshold) && (
                      <Typography variant="caption" sx={{ color: '#d32f2f', fontWeight: 600 }}>
                        ⚠️ {warehouseStocks.filter(w => w.quantity <= lowStockThreshold).length} depoda düşük stok!
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        );
      case 'vergiler':
        return (
          <Box>
            {/* Ülke Seçimi */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Ülke Seçin</InputLabel>
              <Select
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setSelectedTaxClass(''); // Ülke değiştiğinde vergi sınıfını sıfırla
                }}
                label="Ülke Seçin"
              >
                <MenuItem value="TR">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>🇹🇷</Typography>
                    <Typography>Türkiye</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="US">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>🇺🇸</Typography>
                    <Typography>Amerika Birleşik Devletleri</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="DE">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>🇩🇪</Typography>
                    <Typography>Almanya</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="GB">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>🇬🇧</Typography>
                    <Typography>İngiltere</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="FR">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>🇫🇷</Typography>
                    <Typography>Fransa</Typography>
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            {/* Vergi Sınıfları */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                📊 Vergi Sınıfları
              </Typography>
              
              <RadioGroup
                value={selectedTaxClass}
                onChange={(e) => setSelectedTaxClass(e.target.value)}
              >
                {taxClassesByCountry[selectedCountry as keyof typeof taxClassesByCountry]?.map((taxClass) => (
                  <Paper key={taxClass.id} sx={{ 
                    p: 2, 
                    mb: 1, 
                    border: selectedTaxClass === taxClass.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                    bgcolor: selectedTaxClass === taxClass.id ? '#f3f8ff' : 'white',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: selectedTaxClass === taxClass.id ? '#f3f8ff' : '#f5f5f5'
                    }
                  }}>
                    <FormControlLabel
                      value={taxClass.id}
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {taxClass.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {taxClass.description}
                          </Typography>
                          <Typography variant="caption" sx={{ 
                            color: '#1976d2', 
                            fontWeight: 600,
                            bgcolor: '#e3f2fd',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            display: 'inline-block',
                            mt: 0.5
                          }}>
                            Oran: %{taxClass.rate}
                          </Typography>
                        </Box>
                      }
                      sx={{ 
                        width: '100%',
                        m: 0,
                        '& .MuiFormControlLabel-label': {
                          width: '100%'
                        }
                      }}
                    />
                  </Paper>
                ))}
              </RadioGroup>
              
              {/* Seçilen Vergi Sınıfı Özeti */}
              {selectedTaxClass && (
                <Box sx={{ mt: 3, p: 2, bgcolor: '#e8f5e9', borderRadius: 1, border: '1px solid #4caf50' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#2e7d32' }}>
                    ✅ Seçilen Vergi Sınıfı
                  </Typography>
                  {(() => {
                    const selected = taxClassesByCountry[selectedCountry as keyof typeof taxClassesByCountry]?.find(t => t.id === selectedTaxClass);
                    return selected ? (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Vergi Sınıfı:</strong> {selected.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Oran:</strong> %{selected.rate}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Açıklama:</strong> {selected.description}
                        </Typography>
                      </Box>
                    ) : null;
                  })()
                  }
                </Box>
              )}
            </Box>
          </Box>
        );
      case 'ek-tanimlamalar':
        return (
          <Box>
            {/* Ürün Etiketleri */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                🏷️ Ürün Etiketleri
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  size="small"
                  label="Yeni etiket ekle"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  sx={{ flexGrow: 1 }}
                />
                <Button 
                  variant="contained" 
                  onClick={addTag}
                  disabled={!newTag.trim()}
                  sx={{ minWidth: 'auto', px: 2 }}
                >
                  <AddIcon />
                </Button>
              </Box>
              
              {/* Etiket Listesi */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {productTags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => removeTag(tag)}
                    color="primary"
                    variant="outlined"
                    sx={{
                      '& .MuiChip-deleteIcon': {
                        color: '#d32f2f',
                        '&:hover': {
                          color: '#b71c1c'
                        }
                      }
                    }}
                  />
                ))}
                {productTags.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    Henüz etiket eklenmemiş. Yukarıdaki alandan etiket ekleyebilirsiniz.
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Ürün Özellikleri */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                ⚙️ Ürün Özellikleri
              </Typography>
              
              {productFeatures.map((feature, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
                  <TextField
                    size="small"
                    label="Özellik Adı"
                    value={feature.key}
                    onChange={(e) => updateFeature(index, 'key', e.target.value)}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    size="small"
                    label="Değer"
                    value={feature.value}
                    onChange={(e) => updateFeature(index, 'value', e.target.value)}
                    sx={{ flex: 1 }}
                  />
                  <IconButton 
                    color="error" 
                    onClick={() => removeFeature(index)}
                    size="small"
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              ))}
              
              <Button
                startIcon={<AddIcon />}
                onClick={addFeature}
                variant="outlined"
                size="small"
                sx={{ 
                  borderStyle: 'dashed',
                  color: '#666',
                  borderColor: '#ccc',
                  '&:hover': {
                    borderColor: '#1976d2',
                    color: '#1976d2',
                    bgcolor: 'rgba(25, 118, 210, 0.04)'
                  }
                }}
              >
                Özellik Ekle
              </Button>
            </Box>

            {/* SEO Bilgileri */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                🔍 SEO Bilgileri
              </Typography>
              
              <TextField
                fullWidth
                label="SEO Başlığı"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                margin="normal"
                helperText={`${seoTitle.length}/60 karakter (Optimal: 50-60)`}
                InputProps={{
                  sx: {
                    color: seoTitle.length > 60 ? '#d32f2f' : 'inherit'
                  }
                }}
              />
              
              <TextField
                fullWidth
                label="SEO Açıklaması"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                margin="normal"
                multiline
                rows={3}
                helperText={`${seoDescription.length}/160 karakter (Optimal: 150-160)`}
                InputProps={{
                  sx: {
                    color: seoDescription.length > 160 ? '#d32f2f' : 'inherit'
                  }
                }}
              />
              
              <TextField
                fullWidth
                label="Anahtar Kelimeler"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                margin="normal"
                helperText="Anahtar kelimeleri virgülle ayırın (Maksimum 10 kelime)"
                InputProps={{
                  sx: {
                    color: seoKeywords.split(',').length > 10 ? '#d32f2f' : 'inherit'
                  }
                }}
              />
              
              {/* SEO Önizlemesi */}
              {(seoTitle || seoDescription) && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 1, border: '1px solid #e9ecef' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    🔍 SEO Önizlemesi
                  </Typography>
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: 'white', 
                    borderRadius: 1, 
                    border: '1px solid #ddd',
                    fontFamily: 'Arial, sans-serif'
                  }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: '#1a0dab', 
                        fontSize: '18px',
                        fontWeight: 400,
                        mb: 0.5,
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      {seoTitle || 'Ürün Başlığı'}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#006621',
                        fontSize: '14px',
                        display: 'block',
                        mb: 0.5
                      }}
                    >
                      https://example.com/urun-adi
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#545454',
                        fontSize: '13px',
                        lineHeight: 1.4
                      }}
                    >
                      {seoDescription || 'Ürün açıklaması burada görünecek...'}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        );
      case 'tedarikci-bilgileri':
        return (
          <Box>
            {/* Tedarikçi Bilgileri */}
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              🏢 Tedarikçi Bilgileri
            </Typography>
            
            <Grid container spacing={2}>
              {/* Supplier */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Supplier (Tedarikçi)"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  margin="normal"
                  placeholder="Tedarikçi adını girin"
                />
              </Grid>
              
              {/* Temin Süresi */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Temin Süresi (Gün)"
                  type="number"
                  value={supplyTime || ''}
                  onChange={(e) => setSupplyTime(Number(e.target.value) || 0)}
                  margin="normal"
                  InputProps={{
                    inputProps: { min: 0 },
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="caption" color="text.secondary">
                          gün
                        </Typography>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              
              {/* Ref Ürünü */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ref Ürünü"
                  value={refProduct}
                  onChange={(e) => setRefProduct(e.target.value)}
                  margin="normal"
                  placeholder="Referans ürün kodu"
                />
              </Grid>
              
              {/* HS Kodu */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="HS Kodu"
                  value={hsCode}
                  onChange={(e) => setHsCode(e.target.value)}
                  margin="normal"
                  placeholder="Harmonize sistem kodu"
                  helperText="Gümrük tarife pozisyon kodu"
                />
              </Grid>
              
              {/* Gümrük */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Gümrük"
                  value={customsInfo}
                  onChange={(e) => setCustomsInfo(e.target.value)}
                  margin="normal"
                  placeholder="Gümrük bilgileri"
                />
              </Grid>
              
              {/* Yakıtlık */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Yakıtlık"
                  value={fuelInfo}
                  onChange={(e) => setFuelInfo(e.target.value)}
                  margin="normal"
                  placeholder="Yakıt bilgileri"
                />
              </Grid>
              
              {/* Açık */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Açık"
                  value={openInfo}
                  onChange={(e) => setOpenInfo(e.target.value)}
                  margin="normal"
                  placeholder="Açık alan bilgisi"
                />
              </Grid>
              
              {/* Hazırım */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Hazırım"
                  value={readyInfo}
                  onChange={(e) => setReadyInfo(e.target.value)}
                  margin="normal"
                  placeholder="Hazırlık durumu"
                />
              </Grid>
              
              {/* Fiyat */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tedarikçi Fiyatı"
                  type="number"
                  value={supplierPrice || ''}
                  onChange={(e) => setSupplierPrice(Number(e.target.value) || 0)}
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography color="text.secondary">{getCurrencySymbol(selectedCurrency)}</Typography>
                      </InputAdornment>
                    ),
                    inputProps: { min: 0, step: 0.01 }
                  }}
                  helperText="Tedarikçiden alınan fiyat"
                />
              </Grid>
            </Grid>
            
            {/* Tedarikçi Özeti */}
            {(supplier || supplyTime > 0 || supplierPrice > 0) && (
              <Box sx={{ mt: 3, p: 2, bgcolor: '#f0f7ff', borderRadius: 1, border: '1px solid #bbdefb' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#1976d2' }}>
                  📊 Tedarikçi Özeti
                </Typography>
                <Grid container spacing={2}>
                  {supplier && (
                    <Grid item xs={12} sm={4}>
                      <Typography variant="caption" color="text.secondary">
                        <strong>Tedarikçi:</strong> {supplier}
                      </Typography>
                    </Grid>
                  )}
                  {supplyTime > 0 && (
                    <Grid item xs={12} sm={4}>
                      <Typography variant="caption" color="text.secondary">
                        <strong>Temin Süresi:</strong> {supplyTime} gün
                      </Typography>
                    </Grid>
                  )}
                  {supplierPrice > 0 && (
                    <Grid item xs={12} sm={4}>
                      <Typography variant="caption" color="text.secondary">
                        <strong>Tedarikçi Fiyatı:</strong> {getCurrencySymbol(selectedCurrency)}{supplierPrice.toFixed(2)}
                      </Typography>
                    </Grid>
                  )}
                  {hsCode && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        <strong>HS Kodu:</strong> {hsCode}
                      </Typography>
                    </Grid>
                  )}
                  {refProduct && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        <strong>Ref Ürün:</strong> {refProduct}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}
          </Box>
        );
      case 'videolar':
        return (
          <Box>
            {/* Video Başlığı */}
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              🎥 Video Yönetimi
            </Typography>
            
            {/* Promosyon Videosu */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                🎆 Promosyon Videosu
              </Typography>
              <TextField
                fullWidth
                label="Promosyon Video Dosyası"
                value={promoVideo}
                onChange={(e) => setPromoVideo(e.target.value)}
                margin="normal"
                placeholder="Video dosya yolu veya URL'si"
                helperText="Ürünün tanıtım videosu için dosya yolu"
              />
            </Box>
            
            {/* Kullanım Videosu */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                🛠️ Kullanım Videosu
              </Typography>
              <TextField
                fullWidth
                label="Kullanım Video Dosyası"
                value={usageVideo}
                onChange={(e) => setUsageVideo(e.target.value)}
                margin="normal"
                placeholder="Video dosya yolu veya URL'si"
                helperText="Ürünün nasıl kullanılacağını gösteren video"
              />
            </Box>
            
            {/* YouTube Linki */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                🔴 YouTube Videosu
              </Typography>
              <TextField
                fullWidth
                label="YouTube Video Linki"
                value={youtubeLink}
                onChange={(e) => {
                  setYoutubeLink(e.target.value);
                  if (e.target.value && validateVideoUrl(e.target.value)) {
                    const thumbnail = getVideoThumbnail(e.target.value, 'youtube');
                    if (thumbnail) setVideoThumbnail(thumbnail);
                  }
                }}
                margin="normal"
                placeholder="https://www.youtube.com/watch?v=..."
                helperText="YouTube'dan video linki ekleyin"
                error={youtubeLink !== '' && !validateVideoUrl(youtubeLink)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography sx={{ color: '#FF0000', fontSize: '1.2em' }}>
                        ▶️
                      </Typography>
                    </InputAdornment>
                  )
                }}
              />
              {youtubeLink && validateVideoUrl(youtubeLink) && (
                <Box sx={{ mt: 1, p: 1, bgcolor: '#f0f7ff', borderRadius: 1 }}>
                  <Typography variant="caption" color="success.main">
                    ✅ Geçerli YouTube linki
                  </Typography>
                </Box>
              )}
            </Box>
            
            {/* Vimeo Linki */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                🔵 Vimeo Videosu
              </Typography>
              <TextField
                fullWidth
                label="Vimeo Video Linki"
                value={vimeoLink}
                onChange={(e) => {
                  setVimeoLink(e.target.value);
                  if (e.target.value && validateVideoUrl(e.target.value)) {
                    const thumbnail = getVideoThumbnail(e.target.value, 'vimeo');
                    if (thumbnail) setVideoThumbnail(thumbnail);
                  }
                }}
                margin="normal"
                placeholder="https://vimeo.com/..."
                helperText="Vimeo'dan video linki ekleyin"
                error={vimeoLink !== '' && !validateVideoUrl(vimeoLink)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography sx={{ color: '#1AB7EA', fontSize: '1.2em' }}>
                        ▶️
                      </Typography>
                    </InputAdornment>
                  )
                }}
              />
              {vimeoLink && validateVideoUrl(vimeoLink) && (
                <Box sx={{ mt: 1, p: 1, bgcolor: '#f0f7ff', borderRadius: 1 }}>
                  <Typography variant="caption" color="success.main">
                    ✅ Geçerli Vimeo linki
                  </Typography>
                </Box>
              )}
            </Box>
            
            {/* Video Detayları */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                📝 Video Detayları
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Video Süresi"
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(e.target.value)}
                    margin="normal"
                    placeholder="Örn: 2:30 veya 150 saniye"
                    helperText="Video süresini girin"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Video Thumbnail URL"
                    value={videoThumbnail}
                    onChange={(e) => setVideoThumbnail(e.target.value)}
                    margin="normal"
                    placeholder="Video küçük resmi URL'si"
                    helperText="Video önizleme resmi"
                  />
                </Grid>
              </Grid>
              
              <TextField
                fullWidth
                label="Video Açıklaması"
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                margin="normal"
                multiline
                rows={3}
                placeholder="Video hakkında açıklama yazın..."
                helperText="Video içeriği hakkında bilgi"
              />
            </Box>
            
            {/* Video Önizlemesi */}
            {(youtubeLink || vimeoLink || videoThumbnail) && (
              <Box sx={{ mt: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 1, border: '1px solid #e9ecef' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
                  📺 Video Önizlemesi
                </Typography>
                
                <Grid container spacing={2}>
                  {/* YouTube Önizleme */}
                  {youtubeLink && validateVideoUrl(youtubeLink) && (
                    <Grid item xs={12} md={6}>
                      <Box sx={{ 
                        border: '1px solid #ddd', 
                        borderRadius: 1, 
                        overflow: 'hidden',
                        bgcolor: 'white'
                      }}>
                        <Box sx={{ 
                          height: 120, 
                          bgcolor: '#000', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          position: 'relative'
                        }}>
                          {getVideoThumbnail(youtubeLink, 'youtube') ? (
                            <img 
                              src={getVideoThumbnail(youtubeLink, 'youtube')} 
                              alt="YouTube Thumbnail"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <Typography sx={{ color: 'white', fontSize: '2em' }}>
                              📺
                            </Typography>
                          )}
                          <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'rgba(255, 0, 0, 0.8)',
                            borderRadius: '50%',
                            width: 40,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Typography sx={{ color: 'white', fontSize: '1.2em' }}>
                              ▶️
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ p: 1 }}>
                          <Typography variant="caption" sx={{ color: '#FF0000', fontWeight: 600 }}>
                            🔴 YouTube Video
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                  
                  {/* Vimeo Önizleme */}
                  {vimeoLink && validateVideoUrl(vimeoLink) && (
                    <Grid item xs={12} md={6}>
                      <Box sx={{ 
                        border: '1px solid #ddd', 
                        borderRadius: 1, 
                        overflow: 'hidden',
                        bgcolor: 'white'
                      }}>
                        <Box sx={{ 
                          height: 120, 
                          bgcolor: '#1AB7EA', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          position: 'relative'
                        }}>
                          <Typography sx={{ color: 'white', fontSize: '2em' }}>
                            📺
                          </Typography>
                          <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'rgba(26, 183, 234, 0.8)',
                            borderRadius: '50%',
                            width: 40,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Typography sx={{ color: 'white', fontSize: '1.2em' }}>
                              ▶️
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ p: 1 }}>
                          <Typography variant="caption" sx={{ color: '#1AB7EA', fontWeight: 600 }}>
                            🔵 Vimeo Video
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                </Grid>
                
                {/* Video Bilgileri Özeti */}
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                  <Typography variant="caption" color="text.secondary">
                    <strong>Video Sayısı:</strong> {[youtubeLink, vimeoLink, promoVideo, usageVideo].filter(v => v).length} adet
                  </Typography>
                  {videoDuration && (
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                      <strong>Süre:</strong> {videoDuration}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        );
      case 'ozellikler':
        return (
          <Box>
            {/* Özellikler Başlığı */}
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              ⚙️ Ürün Özellikleri
            </Typography>
            
            {/* Kategori Seçimi */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                📁 Özellik Kategorisi
              </Typography>
              <FormControl fullWidth margin="normal">
                <Select
                  value={selectedPropertyCategory}
                  onChange={(e) => setSelectedPropertyCategory(e.target.value)}
                  displayEmpty
                >
                  {propertyCategories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category === 'Teknik' && '💻'} 
                      {category === 'Fiziksel' && '📏'} 
                      {category === 'Performans' && '⚡'} 
                      {category === 'Malzeme' && '🧩'} 
                      {category === 'Garanti' && '🛡️'} 
                      {category === 'Diğer' && '📄'} 
                      {' '}{category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            {/* Özellik Ekleme Formu */}
            <Box sx={{ mb: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 1, border: '1px solid #e9ecef' }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                ➕ Yeni Özellik Ekle
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Özellik Adı"
                    value={newPropertyName}
                    onChange={(e) => setNewPropertyName(e.target.value)}
                    placeholder="Örn: RAM, Renk, Ağırlık"
                    helperText="Özellik adını girin"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Özellik Değeri"
                    value={newPropertyValue}
                    onChange={(e) => setNewPropertyValue(e.target.value)}
                    placeholder="Örn: 16GB, Siyah, 1.5kg"
                    helperText="Özellik değerini girin"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Birim (Opsiyonel)"
                    value={newPropertyUnit}
                    onChange={(e) => setNewPropertyUnit(e.target.value)}
                    placeholder="Örn: GB, kg, cm"
                    helperText="Birim belirtin"
                  />
                </Grid>
                <Grid item xs={12} md={1}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={addProperty}
                    disabled={!newPropertyName.trim() || !newPropertyValue.trim()}
                    sx={{ height: '56px', minWidth: '56px' }}
                  >
                    ➕
                  </Button>
                </Grid>
              </Grid>
            </Box>
            
            {/* Özellik Şablonları */}
            {getPropertyTemplates(selectedPropertyCategory).length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  📝 {selectedPropertyCategory} Özellik Şablonları
                </Typography>
                <Grid container spacing={1}>
                  {getPropertyTemplates(selectedPropertyCategory).map((template, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                          {template.name}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {template.suggestions.map((suggestion, idx) => (
                            <Chip
                              key={idx}
                              label={suggestion}
                              size="small"
                              clickable
                              onClick={() => {
                                setNewPropertyName(template.name);
                                setNewPropertyValue(suggestion);
                              }}
                              sx={{ 
                                fontSize: '0.75rem',
                                '&:hover': { bgcolor: 'primary.light', color: 'white' }
                              }}
                            />
                          ))}
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            
            {/* Mevcut Özellikler Listesi */}
            {productProperties.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  📋 Mevcut Özellikler ({productProperties.length})
                </Typography>
                <Grid container spacing={2}>
                  {productProperties.map((property, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper sx={{ 
                        p: 2, 
                        border: '1px solid #e0e0e0', 
                        borderRadius: 1,
                        position: 'relative',
                        '&:hover': { boxShadow: 2 }
                      }}>
                        <IconButton
                          size="small"
                          onClick={() => removeProperty(index)}
                          sx={{ 
                            position: 'absolute', 
                            top: 4, 
                            right: 4,
                            color: 'error.main'
                          }}
                        >
                          ❌
                        </IconButton>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                          {property.name}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 0.5 }}>
                          {property.value}
                          {property.unit && (
                            <Typography component="span" variant="caption" sx={{ ml: 0.5, color: 'text.secondary' }}>
                              {property.unit}
                            </Typography>
                          )}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            
            {/* Özellikler Özeti */}
            {productProperties.length > 0 && (
              <Box sx={{ mt: 3, p: 2, bgcolor: '#f0f7ff', borderRadius: 1, border: '1px solid #bbdefb' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, color: '#1976d2' }}>
                  📈 Özellikler Özeti
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" color="text.secondary">
                      <strong>Toplam Özellik:</strong> {productProperties.length} adet
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" color="text.secondary">
                      <strong>Kategori:</strong> {selectedPropertyCategory}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" color="text.secondary">
                      <strong>Son Eklenen:</strong> {productProperties.length > 0 ? productProperties[productProperties.length - 1].name : 'Yok'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        );
      case 'vitrine-ekle':
        return (
          <Box>
            {/* Vitrin Başlığı */}
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              🎆 Vitrin Yönetimi
            </Typography>
            
            {/* Vitrin Aktiflik Durumu */}
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Radio
                    checked={isShowcaseProduct}
                    onChange={(e) => setIsShowcaseProduct(e.target.checked)}
                    sx={{ 
                      color: isShowcaseProduct ? '#4caf50' : '#bdbdbd',
                      '&.Mui-checked': { color: '#4caf50' }
                    }}
                  />
                }
                label={
                  <Typography sx={{ 
                    fontWeight: 600, 
                    color: isShowcaseProduct ? '#4caf50' : '#757575',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    {isShowcaseProduct ? '✅' : '❌'} Bu ürünü vitrine ekle
                  </Typography>
                }
              />
            </Box>
            
            {/* Vitrin Ayarları - Sadece aktifse göster */}
            <Collapse in={isShowcaseProduct}>
              <Box>
                {/* Vitrin Kategorisi */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    📁 Vitrin Kategorisi
                  </Typography>
                  <FormControl fullWidth margin="normal">
                    <Select
                      value={showcaseCategory}
                      onChange={(e) => setShowcaseCategory(e.target.value)}
                      displayEmpty
                      placeholder="Vitrin kategorisi seçin"
                    >
                      <MenuItem value="" disabled>
                        Vitrin kategorisi seçin
                      </MenuItem>
                      {getShowcaseCategories().map((category) => (
                        <MenuItem key={category} value={category}>
                          {category === 'Ana Sayfa Slider' && '🎆'}
                          {category === 'Öne Çıkan Ürünler' && '⭐'}
                          {category === 'Yeni Ürünler' && '🆕'}
                          {category === 'Kampanyalar' && '🎉'}
                          {category === 'İndirimli Ürünler' && '💰'}
                          {category === 'En Çok Satanlar' && '🔥'}
                          {category === 'Tavsiye Edilenler' && '👍'}
                          {category === 'Kategori Vitrini' && '📂'}
                          {category === 'Marka Vitrini' && '🏷️'}
                          {category === 'Sezonluk Ürünler' && '🌿'}
                          {' '}{category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                
                {/* Vitrin Pozisyonu ve Öncelik */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                      📍 Vitrin Pozisyonu
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      label="Sıra Numarası"
                      value={showcasePosition}
                      onChange={(e) => setShowcasePosition(Number(e.target.value))}
                      margin="normal"
                      inputProps={{ min: 1, max: 100 }}
                      helperText="Vitrin içinde gösterilme sırası (1-100)"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                      ⚡ Öncelik Seviyesi
                    </Typography>
                    <FormControl fullWidth margin="normal">
                      <Select
                        value={showcasePriority}
                        onChange={(e) => setShowcasePriority(e.target.value as 'low' | 'medium' | 'high' | 'urgent')}
                      >
                        <MenuItem value="low">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 12, height: 12, bgcolor: '#4caf50', borderRadius: '50%' }} />
                            Düşük
                          </Box>
                        </MenuItem>
                        <MenuItem value="medium">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 12, height: 12, bgcolor: '#ff9800', borderRadius: '50%' }} />
                            Orta
                          </Box>
                        </MenuItem>
                        <MenuItem value="high">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 12, height: 12, bgcolor: '#f44336', borderRadius: '50%' }} />
                            Yüksek
                          </Box>
                        </MenuItem>
                        <MenuItem value="urgent">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 12, height: 12, bgcolor: '#9c27b0', borderRadius: '50%' }} />
                            Acil
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                
                {/* Vitrin Tarihleri */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    📅 Vitrin Tarihleri
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Başlangıç Tarihi"
                        value={showcaseStartDate}
                        onChange={(e) => setShowcaseStartDate(e.target.value)}
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        helperText="Vitrin gösteriminin başlayacağı tarih"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Bitiş Tarihi"
                        value={showcaseEndDate}
                        onChange={(e) => setShowcaseEndDate(e.target.value)}
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        helperText="Vitrin gösteriminin biteceği tarih (opsiyonel)"
                      />
                    </Grid>
                  </Grid>
                </Box>
                
                {/* Vitrin İndirimi */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    💰 Vitrin İndirimi
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    label="İndirim Oranı (%)"
                    value={showcaseDiscount}
                    onChange={(e) => setShowcaseDiscount(Number(e.target.value))}
                    margin="normal"
                    inputProps={{ min: 0, max: 100 }}
                    helperText="Vitrin için özel indirim oranı (0-100%)"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>
                    }}
                  />
                  {showcaseDiscount > 0 && (
                    <Box sx={{ mt: 1, p: 1, bgcolor: '#e8f5e8', borderRadius: 1 }}>
                      <Typography variant="caption" color="success.main">
                        ✅ %{showcaseDiscount} vitrin indirimi uygulanacak
                      </Typography>
                    </Box>
                  )}
                </Box>
                
                {/* Vitrin Açıklaması */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    📝 Vitrin Açıklaması
                  </Typography>
                  <TextField
                    fullWidth
                    label="Vitrin Açıklaması"
                    value={showcaseDescription}
                    onChange={(e) => setShowcaseDescription(e.target.value)}
                    margin="normal"
                    multiline
                    rows={3}
                    placeholder="Bu ürünün vitrin içinde nasıl gösterileceğini açıklayın..."
                    helperText="Vitrin içinde gösterilecek özel açıklama"
                  />
                </Box>
                
                {/* Vitrin Anahtar Kelimeleri */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    🏷️ Vitrin Anahtar Kelimeleri
                  </Typography>
                  
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={10}>
                      <TextField
                        fullWidth
                        label="Anahtar Kelime"
                        value={newShowcaseKeyword}
                        onChange={(e) => setNewShowcaseKeyword(e.target.value)}
                        placeholder="Örn: trend, popüler, yeni"
                        helperText="Vitrin arama için anahtar kelimeler"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addShowcaseKeyword();
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={addShowcaseKeyword}
                        disabled={!newShowcaseKeyword.trim()}
                        sx={{ height: '56px' }}
                      >
                        ➕
                      </Button>
                    </Grid>
                  </Grid>
                  
                  {showcaseKeywords.length > 0 && (
                    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {showcaseKeywords.map((keyword, index) => (
                        <Chip
                          key={index}
                          label={keyword}
                          onDelete={() => removeShowcaseKeyword(index)}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      ))}
                    </Box>
                  )}
                </Box>
                
                {/* Vitrin Önizlemesi */}
                <Box sx={{ mt: 3, p: 2, bgcolor: '#f0f7ff', borderRadius: 1, border: '1px solid #bbdefb' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, color: '#1976d2' }}>
                    📺 Vitrin Önizlemesi
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        <strong>Kategori:</strong> {showcaseCategory || 'Seçilmedi'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        <strong>Pozisyon:</strong> {showcasePosition}. sıra
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <strong>Öncelik:</strong>
                        <Box sx={{ 
                          width: 8, 
                          height: 8, 
                          bgcolor: getPriorityColor(showcasePriority), 
                          borderRadius: '50%' 
                        }} />
                        {getPriorityLabel(showcasePriority)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        <strong>İndirim:</strong> {showcaseDiscount > 0 ? `%${showcaseDiscount}` : 'Yok'}
                      </Typography>
                    </Grid>
                    {showcaseStartDate && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary">
                          <strong>Başlangıç:</strong> {new Date(showcaseStartDate).toLocaleDateString('tr-TR')}
                        </Typography>
                      </Grid>
                    )}
                    {showcaseEndDate && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary">
                          <strong>Bitiş:</strong> {new Date(showcaseEndDate).toLocaleDateString('tr-TR')}
                        </Typography>
                      </Grid>
                    )}
                    {showcaseKeywords.length > 0 && (
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          <strong>Anahtar Kelimeler:</strong> {showcaseKeywords.join(', ')}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </Box>
            </Collapse>
            
            {/* Vitrin Durumu */}
            <Box sx={{ mt: 3, p: 2, bgcolor: isShowcaseProduct ? '#e8f5e8' : '#fff3e0', borderRadius: 1, border: `1px solid ${isShowcaseProduct ? '#4caf50' : '#ff9800'}` }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: isShowcaseProduct ? '#2e7d32' : '#f57c00' }}>
                {isShowcaseProduct ? '✅ Vitrin Durumu: Aktif' : '⚠️ Vitrin Durumu: Pasif'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {isShowcaseProduct 
                  ? 'Bu ürün vitrin ayarlarına göre gösterilecek' 
                  : 'Bu ürün vitrinlerde gösterilmeyecek'
                }
              </Typography>
            </Box>
          </Box>
        );
      case 'benzer-urunler':
        return (
          <Box>
            {/* Benzer Ürünler Başlığı */}
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              🔍 Benzer Ürünler Yönetimi
            </Typography>
            
            {/* Otomatik Benzer Ürün Bulma */}
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Radio
                    checked={autoSimilarProducts}
                    onChange={(e) => setAutoSimilarProducts(e.target.checked)}
                    sx={{ 
                      color: autoSimilarProducts ? '#4caf50' : '#bdbdbd',
                      '&.Mui-checked': { color: '#4caf50' }
                    }}
                  />
                }
                label={
                  <Typography sx={{ 
                    fontWeight: 600, 
                    color: autoSimilarProducts ? '#4caf50' : '#757575',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    {autoSimilarProducts ? '✅' : '❌'} Otomatik benzer ürün önerisi
                  </Typography>
                }
              />
              <Typography variant="caption" color="text.secondary" sx={{ ml: 4, display: 'block' }}>
                Sistem otomatik olarak benzer ürünleri bulup önerecek
              </Typography>
            </Box>
            
            {/* Benzerlik Ayarları */}
            <Box sx={{ mb: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 1, border: '1px solid #e9ecef' }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                ⚙️ Benzerlik Ayarları
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Benzerlik Eşiği (%{similarityThreshold})
                  </Typography>
                  <Box sx={{ px: 1 }}>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={similarityThreshold}
                      onChange={(e) => setSimilarityThreshold(Number(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Minimum benzerlik oranı
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Maksimum Ürün Sayısı"
                    value={maxSimilarProducts}
                    onChange={(e) => setMaxSimilarProducts(Number(e.target.value))}
                    inputProps={{ min: 1, max: 20 }}
                    helperText="Gösterilecek maksimum ürün sayısı"
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Sıralama</InputLabel>
                    <Select
                      value={similarProductSortBy}
                      onChange={(e) => setSimilarProductSortBy(e.target.value as 'similarity' | 'price' | 'popularity' | 'newest')}
                      label="Sıralama"
                    >
                      <MenuItem value="similarity">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          🎯 Benzerlik Oranı
                        </Box>
                      </MenuItem>
                      <MenuItem value="price">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          💰 Fiyat
                        </Box>
                      </MenuItem>
                      <MenuItem value="popularity">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          🔥 Popülerlik
                        </Box>
                      </MenuItem>
                      <MenuItem value="newest">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          🆕 En Yeni
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={generateMockSimilarProducts}
                  startIcon={<RefreshIcon />}
                  size="small"
                >
                  Benzer Ürünleri Bul
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setSimilarProducts([])}
                  color="error"
                  size="small"
                >
                  Temizle
                </Button>
              </Box>
            </Box>
            
            {/* Manuel Ürün Arama */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                🔎 Manuel Ürün Arama
              </Typography>
              <TextField
                fullWidth
                label="Ürün Ara"
                value={searchSimilarProduct}
                onChange={(e) => setSearchSimilarProduct(e.target.value)}
                placeholder="Ürün adı, kodu veya kategorisi ile ara..."
                helperText="Benzer ürün eklemek için arama yapın"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      🔍
                    </InputAdornment>
                  )
                }}
              />
            </Box>
            
            {/* Benzer Ürünler Listesi */}
            {similarProducts.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  📋 Benzer Ürünler ({similarProducts.length}/{maxSimilarProducts})
                </Typography>
                
                <Grid container spacing={2}>
                  {similarProducts.map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                      <Paper sx={{ 
                        p: 2, 
                        border: '1px solid #e0e0e0', 
                        borderRadius: 1,
                        position: 'relative',
                        '&:hover': { boxShadow: 3, transform: 'translateY(-2px)' },
                        transition: 'all 0.3s ease'
                      }}>
                        {/* Silme Butonu */}
                        <IconButton
                          size="small"
                          onClick={() => removeSimilarProduct(product.id)}
                          sx={{ 
                            position: 'absolute', 
                            top: 8, 
                            right: 8,
                            color: 'error.main',
                            bgcolor: 'rgba(255,255,255,0.8)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                          }}
                        >
                          ❌
                        </IconButton>
                        
                        {/* Ürün Görseli */}
                        <Box sx={{ 
                          height: 120, 
                          bgcolor: '#f5f5f5', 
                          borderRadius: 1, 
                          mb: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden'
                        }}>
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name}
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover' 
                              }}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                if (nextElement) {
                                  nextElement.style.display = 'flex';
                                }
                              }}
                            />
                          ) : null}
                          <Box sx={{ 
                            display: product.image ? 'none' : 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            color: '#bdbdbd',
                            fontSize: '2em'
                          }}>
                            📷
                          </Box>
                        </Box>
                        
                        {/* Ürün Bilgileri */}
                        <Typography variant="body2" sx={{ 
                          fontWeight: 600, 
                          color: 'primary.main',
                          mb: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {product.name}
                        </Typography>
                        
                        <Typography variant="h6" sx={{ 
                          color: '#2e7d32',
                          fontWeight: 700,
                          mb: 1
                        }}>
                          {getCurrencySymbol(selectedCurrency)}{product.price.toLocaleString()}
                        </Typography>
                        
                        {/* Benzerlik Oranı */}
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          p: 1,
                          bgcolor: 'rgba(0,0,0,0.05)',
                          borderRadius: 1
                        }}>
                          <Box sx={{
                            width: 12,
                            height: 12,
                            bgcolor: getSimilarityColor(product.similarity),
                            borderRadius: '50%'
                          }} />
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            %{product.similarity} {getSimilarityLabel(product.similarity)}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            
            {/* Benzer Ürünler Özeti */}
            <Box sx={{ mt: 3, p: 2, bgcolor: '#f0f7ff', borderRadius: 1, border: '1px solid #bbdefb' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, color: '#1976d2' }}>
                📈 Benzer Ürünler Özeti
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <Typography variant="caption" color="text.secondary">
                    <strong>Toplam Ürün:</strong> {similarProducts.length} adet
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="caption" color="text.secondary">
                    <strong>Benzerlik Eşiği:</strong> %{similarityThreshold}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="caption" color="text.secondary">
                    <strong>Sıralama:</strong> {getSortLabel(similarProductSortBy)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="caption" color="text.secondary">
                    <strong>Otomatik:</strong> {autoSimilarProducts ? 'Aktif' : 'Pasif'}
                  </Typography>
                </Grid>
                
                {similarProducts.length > 0 && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        <strong>Ortalama Benzerlik:</strong> %{Math.round(similarProducts.reduce((acc, p) => acc + p.similarity, 0) / similarProducts.length)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        <strong>Ortalama Fiyat:</strong> {getCurrencySymbol(selectedCurrency)}{Math.round(similarProducts.reduce((acc, p) => acc + p.price, 0) / similarProducts.length).toLocaleString()}
                      </Typography>
                    </Grid>
                  </>
                )}
              </Grid>
              
              {similarProducts.length === 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Henüz benzer ürün eklenmedi. "Benzer Ürünleri Bul" butonuna tıklayarak başlayın.
                </Typography>
              )}
            </Box>
          </Box>
        );
      default:
        return (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Bu kategori henüz yapım aşamasında
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Yakında bu kategori için form alanları eklenecek.
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <CategoryIcon />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Yeni Ürün Ekle
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, height: '600px' }}>
        <Grid container sx={{ height: '100%' }}>
          {/* Sol Sidebar - Kategori Menüsü */}
          <Grid item xs={12} md={4} sx={{ 
            borderRight: '1px solid #e0e0e0',
            bgcolor: '#f8f9fa',
            height: '100%',
            overflow: 'auto'
          }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, color: '#666', fontWeight: 600 }}>
                Ürün Bilgileri
              </Typography>
              
              <List dense>
                {productCategories.map((category) => (
                  <ListItemButton
                    key={category.id}
                    selected={selectedCategory === category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      '&.Mui-selected': {
                        bgcolor: '#667eea',
                        color: 'white',
                        '&:hover': {
                          bgcolor: '#5a6fd8'
                        }
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Typography sx={{ fontSize: '1.2em' }}>
                        {category.icon}
                      </Typography>
                    </ListItemIcon>
                    <ListItemText 
                      primary={category.name}
                      primaryTypographyProps={{ 
                        fontSize: '0.9rem',
                        fontWeight: selectedCategory === category.id ? 600 : 400
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          </Grid>
          
          {/* Sağ İçerik Alanı */}
          <Grid item xs={12} md={8} sx={{ height: '100%', overflow: 'auto' }}>
            <Box sx={{ p: 3 }}>
              <Paper sx={{ p: 3, bgcolor: '#f0f7ff', border: '2px solid #667eea', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography sx={{ fontSize: '1.5em' }}>
                    {productCategories.find(cat => cat.id === selectedCategory)?.icon}
                  </Typography>
                  <Box>
                    <Typography variant="h6" sx={{ color: '#667eea', fontWeight: 600 }}>
                      {productCategories.find(cat => cat.id === selectedCategory)?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Bu kategorideki bilgileri doldurun
                    </Typography>
                  </Box>
                </Box>
              </Paper>
              
              {renderCategoryContent(selectedCategory || 'genel')}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, bgcolor: '#f8f9fa', borderTop: '1px solid #e0e0e0' }}>
        <Button onClick={onClose} color="error" variant="outlined">
          İptal
        </Button>
        <Button 
          variant="contained" 
          sx={{
            bgcolor: '#667eea',
            '&:hover': {
              bgcolor: '#5a6fd8'
            }
          }}
        >
          Ürünü Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuickAddProductModal;
