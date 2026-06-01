import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Typography,
  Avatar,
  Chip,
  IconButton,
  InputAdornment,
  Checkbox,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
  LinearProgress,
  TextField,
  Popover,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  RadioGroup,
  FormControlLabel,
  Radio,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  ContentCopy as ContentCopyIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Inventory as InventoryIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon
} from '@mui/icons-material';

import ExportButton from '../components/common/ExportButton';
import QuickAddProductModal from '../components/common/QuickAddProductModal';
import FilterPanel from '../components/common/FilterPanel';
import PageHeader from '../components/layout/PageHeader';
import { productFilterConfig } from '../utils/filterConfigs';
import ProductDetailModal from '../components/common/ProductDetailModal';
// Dil desteği için LanguageContext'i içe aktarıyoruz
import { useLanguage } from '../contexts/LanguageContext';
import * as XLSX from 'xlsx';
import { notifySuccess, notifyError } from '../utils/notification';

// TableFilterBar bileşeni kaldırıldı



// Kullanılmayan interface
// interface DetailedFilterField extends FilterField {}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number; // Satış fiyatı (geriye uyumluluk için)
  purchasePrice: number; // Alış fiyatı
  salePrice: number; // Satış fiyatı
  currency: 'TRY' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CNY' | 'RUB' | 'SAR' | 'AED'; // Para birimi
  stock: number;
  status: 'Aktif' | 'Pasif';
  sku: string;
  qty: number;
  imageUrl: string;
  color: string;
  date: string;
  order?: number; // Sıralama için eklenen alan
  store?: string; // Mağaza/Satıcı bilgisi
  buyboxRank?: number | null;
  buyboxCompetitors?: { seller: string; price: number; rank: number }[];
  infoLevel?: 'Güçlü' | 'Orta' | 'Zayıf';
}

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const [quickAddModalOpen, setQuickAddModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [advancedFilters, setAdvancedFilters] = useState<Record<string, any>>({});
  
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuProduct, setMenuProduct] = useState<Product | null>(null);

  const [buyboxAnchorEl, setBuyboxAnchorEl] = useState<null | HTMLElement>(null);
  const [buyboxProduct, setBuyboxProduct] = useState<Product | null>(null);

  const [infoAnchorEl, setInfoAnchorEl] = useState<null | HTMLElement>(null);
  const [infoProduct, setInfoProduct] = useState<Product | null>(null);

  const [bulkPriceModalOpen, setBulkPriceModalOpen] = useState(false);
  const [bulkPriceOperation, setBulkPriceOperation] = useState<'increase' | 'decrease' | 'set'>('increase');
  const [bulkPriceType, setBulkPriceType] = useState<'percentage' | 'amount'>('percentage');
  const [bulkPriceValue, setBulkPriceValue] = useState<string>('');

  const handleBuyboxOpen = (event: React.MouseEvent<HTMLElement>, product: Product) => {
    setBuyboxAnchorEl(event.currentTarget);
    setBuyboxProduct(product);
  };
  const handleBuyboxClose = () => {
    setBuyboxAnchorEl(null);
    setBuyboxProduct(null);
  };

  const handleInfoOpen = (event: React.MouseEvent<HTMLElement>, product: Product) => {
    setInfoAnchorEl(event.currentTarget);
    setInfoProduct(product);
  };
  const handleInfoClose = () => {
    setInfoAnchorEl(null);
    setInfoProduct(null);
  };

  // Sürükleyerek kaydırma için state ve ref
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const { t } = useLanguage();

  // Para birimi sembollerini döndüren yardımcı fonksiyon
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


  const hierarchicalCategories = [
    {
      id: 'giyim',
      name: 'Giyim',
      isMainCategory: true,
      children: [
        {
          id: 'bayan',
          name: 'Bayan',
          children: [
            { id: 'mayo-bikini', name: 'Mayo ve Bikini' },
            { id: 'etek-ceket', name: 'Etekler ve Ceketler' },
          ]
        },
        {
          id: 'elbiseler',
          name: 'Elbiseler',
          children: [
            { id: 'gundelik', name: 'Gündelik Elbiseler' },
            { id: 'butik', name: 'Butik Elbiseleri' },
          ]
        },
        { id: 'ic-giyim', name: 'İç Giyim' },
        { id: 'spor-giyim', name: 'Spor Giyim' },
        { id: 'cocuk-giyim', name: 'Çocuk giyim' },
        {
          id: 'erkek',
          name: 'Erkek',
          children: [
            { id: 'kot-pantolon', name: 'Kot Pantolonlar' },
            { id: 'gomlek', name: 'Gömlekler' },
          ]
        }
      ]
    },
    {
      id: 'ayakkabi',
      name: 'Ayakkabı',
      isMainCategory: true,
      children: [
        { id: 'terlik', name: 'Terlik' },
        { id: 'yuksek-topuklu', name: 'Yüksek Topuklu' },
        { id: 'erkek-spor', name: 'Erkek Spor Ayakkabı' },
        { id: 'kadin-spor', name: 'Kadın Spor Ayakkabı' },
      ]
    },
    {
      id: 'aksesuar',
      name: 'Aksesuarlar',
      isMainCategory: true
    }
  ];

  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Kırmızı Tişört',
      category: 'Giyim',
      price: 149.99, // Geriye uyumluluk için
      purchasePrice: 89.99,
      salePrice: 149.99,
      currency: 'TRY',
      stock: 25,
      status: 'Aktif',
      sku: 'TS-RED-M',
      qty: 125,
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop&auto=format&q=80',
      color: 'Kırmızı',
      date: '2023-05-15',
      store: 'Moda Dünyası',
      buyboxRank: null,
      infoLevel: 'Orta'
    },
    {
      id: '2',
      name: 'Mavi Kot Pantolon',
      category: 'Giyim',
      price: 299.99,
      purchasePrice: 179.99,
      salePrice: 299.99,
      currency: 'TRY',
      stock: 18,
      status: 'Aktif',
      sku: 'JP-BLU-32',
      qty: 84,
      imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop&auto=format&q=80',
      color: 'Mavi',
      date: '2023-05-10',
      store: 'Denim Center',
      buyboxRank: null,
      infoLevel: 'Güçlü'
    },
    {
      id: '3',
      name: 'Siyah Ceket',
      category: 'Dış Giyim',
      price: 449.00,
      purchasePrice: 269.00,
      salePrice: 449.00,
      currency: 'TRY',
      stock: 12,
      status: 'Aktif',
      sku: 'JK-BLK-L',
      qty: 36,
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop&auto=format&q=80',
      color: 'Siyah',
      date: '2023-05-05',
      store: 'Moda Dünyası',
      buyboxRank: 6,
      buyboxCompetitors: [
        { seller: 'AHEL SAĞLIK', price: 1340.00, rank: 1 },
        { seller: 'Natureller', price: 1350.00, rank: 2 },
        { seller: 'YESİL PAZAR', price: 1530.00, rank: 3 },
        { seller: 'Yeşilyurt Doğal Ürünler', price: 1540.00, rank: 4 },
        { seller: 'Winfiniti A.Ş', price: 1750.00, rank: 6 }
      ],
      infoLevel: 'Güçlü'
    },
    {
      id: '4',
      name: 'Beyaz Gömlek',
      category: 'Giyim',
      price: 189.00,
      purchasePrice: 119.00,
      salePrice: 189.00,
      currency: 'TRY',
      stock: 0,
      status: 'Pasif',
      sku: 'SH-WHT-M',
      qty: 0,
      imageUrl: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=300&h=300&fit=crop&auto=format&q=80',
      color: 'Beyaz',
      date: '2023-04-28',
      store: 'Klasik Giyim'
    },
    {
      id: '5',
      name: 'Yeşil Kazak',
      category: 'Triko',
      price: 219.00,
      purchasePrice: 139.00,
      salePrice: 219.00,
      currency: 'TRY',
      stock: 8,
      status: 'Aktif',
      sku: 'SW-GRN-XL',
      qty: 42,
      imageUrl: 'https://images.unsplash.com/photo-1577789140096-85a8fb016270?w=300&h=300&fit=crop&auto=format&q=80',
      color: 'Yeşil',
      date: '2023-04-20',
      store: 'Triko Evi'
    },
    {
      id: '6',
      name: 'Premium Laptop',
      category: 'Elektronik',
      price: 1299.99,
      purchasePrice: 999.99,
      salePrice: 1299.99,
      currency: 'USD',
      stock: 5,
      status: 'Aktif',
      sku: 'LP-PREM-15',
      qty: 15,
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop&auto=format&q=80',
      color: 'Gri',
      date: '2023-05-20',
      store: 'Tech Store'
    },
    {
      id: '7',
      name: 'Wireless Headphones',
      category: 'Elektronik',
      price: 199.99,
      purchasePrice: 129.99,
      salePrice: 199.99,
      currency: 'EUR',
      stock: 15,
      status: 'Aktif',
      sku: 'HP-WRL-BLK',
      qty: 45,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&auto=format&q=80',
      color: 'Siyah',
      date: '2023-05-18',
      store: 'Tech Store'
    }
  ]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleExport = () => {
    try {
      const exportData = products.map(product => ({
        "Ürün ID": product.id,
        "Ürün Adı": product.name,
        "Kategori": product.category,
        "Mağaza": product.store || '-',
        "Fiyat": product.price,
        "Stok": product.stock,
        "Durum": product.status,
        "SKU": product.sku,
        "Miktar": product.qty,
        "Renk": product.color,
        "Tarih": product.date
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);

      const wscols = [
        { wch: 12 },
        { wch: 30 },
        { wch: 15 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 15 },
        { wch: 10 },
        { wch: 15 },
        { wch: 15 }
      ];
      worksheet['!cols'] = wscols;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Ürünler");

      XLSX.writeFile(workbook, "urun_listesi.xlsx");

      notifySuccess("Ürün listesi başarıyla Excel'e aktarıldı!", { autoHideDuration: 4000 });
    } catch (error) {
      console.error("Excel'e aktarma hatası:", error);
      notifyError("Excel'e aktarma sırasında bir hata oluştu!", { autoHideDuration: 4000 });
    }
  };

  const handlePrint = () => {
    console.log('Printing data...');
  };

  const handleAddNew = () => {
    navigate('/products/create');
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedProductIds(paginatedProducts.map(p => p.id));
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleSelectOne = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (event.target.checked) {
      setSelectedProductIds(prev => [...prev, id]);
    } else {
      setSelectedProductIds(prev => prev.filter(selectedId => selectedId !== id));
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, product: Product) => {
    setAnchorEl(event.currentTarget);
    setMenuProduct(product);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuProduct(null);
  };

  const handleDeleteSelected = () => {
    setProducts(prev => prev.filter(p => !selectedProductIds.includes(p.id)));
    setSelectedProductIds([]);
    notifySuccess("Seçili ürünler silindi.");
  };

  const handleStatusChangeSelected = (status: 'Aktif' | 'Pasif') => {
    setProducts(prev => prev.map(p => selectedProductIds.includes(p.id) ? { ...p, status } : p));
    setSelectedProductIds([]);
    notifySuccess(`Seçili ürünler ${status} yapıldı.`);
  };

  const handleBulkPriceUpdate = () => {
    const value = parseFloat(bulkPriceValue);
    if (isNaN(value) || value < 0) {
      notifyError("Geçerli bir değer giriniz.");
      return;
    }

    setProducts(prev => prev.map(p => {
      if (selectedProductIds.includes(p.id)) {
        let newPrice = p.salePrice;
        if (bulkPriceOperation === 'set') {
          newPrice = value;
        } else if (bulkPriceOperation === 'increase') {
          if (bulkPriceType === 'percentage') {
            newPrice = newPrice * (1 + value / 100);
          } else {
            newPrice = newPrice + value;
          }
        } else if (bulkPriceOperation === 'decrease') {
          if (bulkPriceType === 'percentage') {
            newPrice = newPrice * (1 - value / 100);
          } else {
            newPrice = Math.max(0, newPrice - value);
          }
        }
        return { ...p, salePrice: newPrice, price: newPrice };
      }
      return p;
    }));
    
    setBulkPriceModalOpen(false);
    setBulkPriceValue('');
    notifySuccess(`${selectedProductIds.length} ürünün fiyatı güncellendi.`);
  };

  const handleAdvancedFilterChange = (newFilters: Record<string, any>) => {
    setAdvancedFilters(newFilters);
    setPage(0);

    if (newFilters.category) {
      setSelectedCategory(newFilters.category);
    }

    if (newFilters.color) {
      setSelectedColor(newFilters.color);
    } else {
      setSelectedColor('all');
    }
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedProduct(null);
  };



  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };



  const handleFilter = (filters: Record<string, any>) => {
    console.log('Filtering with:', filters);
  };

  const groupedByCategory = products.reduce<Record<string, Product[]>>((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  // Sürükle-bırak scroll işlemleri
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tableContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - tableContainerRef.current.offsetLeft);
    setScrollLeft(tableContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !tableContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - tableContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Sürükleme hızını ayarlamak için çarpan
    tableContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Sürükle-bırak işleyicisi
  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    // Eğer hedef yoksa veya başlangıç ve hedef aynıysa işlem yapma
    if (!destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)) {
      return;
    }

    // Aynı kategori içinde sıralama değişikliği
    if (destination.droppableId === source.droppableId) {
      const category = source.droppableId;
      const categoryProducts = [...groupedByCategory[category]];
      const [movedProduct] = categoryProducts.splice(source.index, 1);
      categoryProducts.splice(destination.index, 0, movedProduct);

      // Sıralama bilgisini güncelle
      const updatedCategoryProducts = categoryProducts.map((product, index) => ({
        ...product,
        order: index
      }));

      // Tüm ürünleri güncelle
      const updatedProducts = products.map(product => {
        if (product.category === category) {
          const updatedProduct = updatedCategoryProducts.find(p => p.id === product.id);
          return updatedProduct || product;
        }
        return product;
      });

      setProducts(updatedProducts);
    }
  };

  // Filtrelenmiş ürünleri hesapla
  const filteredProducts = products.filter(product => {
    // Arama filtresi
    const matchesSearch = searchTerm === '' ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());

    // Renk filtreleme
    const matchesColor = selectedColor === 'all' || product.color === selectedColor;

    // Kategori filtreleme
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

    // Gelişmiş filtreler (merkezi yapıdan gelen)
    const matchesAdvancedFilters = Object.entries(advancedFilters).every(([key, value]) => {
      if (!value) return true;

      // Fiyat filtresi için özel işlem
      if (key === 'price' && value) {
        return product.price <= parseFloat(value as string);
      }

      // Stok durumu filtresi için özel işlem
      if (key === 'stock' && value) {
        switch (value) {
          case 'inStock': return product.stock > 0;
          case 'lowStock': return product.stock > 0 && product.stock <= 10;
          case 'outOfStock': return product.stock === 0;
          default: return true;
        }
      }

      // Tarih filtresi için özel işlem
      if (key === 'createdAt' && value) {
        const productDate = new Date(product.date);
        const filterDate = new Date(value as string);
        return productDate.toDateString() === filterDate.toDateString();
      }

      // Diğer filtreler için
      return String(product[key as keyof Product]).toLowerCase().includes(String(value).toLowerCase());
    });

    // Tab filter
    let matchesTab = true;
    if (activeTab === 'onSale') matchesTab = product.status === 'Aktif' && product.stock > 0;
    else if (activeTab === 'soldOut') matchesTab = product.stock === 0;
    else if (activeTab === 'closed') matchesTab = product.status === 'Pasif';
    else if (activeTab === 'locked') matchesTab = false;

    // Tüm filtreleri birleştir
    return matchesSearch && matchesColor && matchesCategory && matchesAdvancedFilters && matchesTab;
  });

  const counts = {
    all: products.length,
    onSale: products.filter(p => p.status === 'Aktif' && p.stock > 0).length,
    soldOut: products.filter(p => p.stock === 0).length,
    closed: products.filter(p => p.status === 'Pasif').length,
    locked: 0,
  };

  const TabLabel = ({ label, count }: { label: string, count: number }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {label}
      {count > 0 && (
        <Box sx={{ 
          bgcolor: activeTab === label.toLowerCase() ? '#fff6f0' : '#f5f5f5', 
          color: activeTab === label.toLowerCase() ? '#ff6b00' : 'text.secondary',
          px: 1, 
          py: 0.2, 
          borderRadius: 4, 
          fontSize: '0.75rem',
          fontWeight: 600
        }}>
          {count}
        </Box>
      )}
    </Box>
  );

  // Filtrelenmiş ürünleri kategoriye göre grupla
  const filteredGroupedByCategory = filteredProducts.reduce<Record<string, Product[]>>((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  // Her kategori için ürünleri sıralama bilgisine göre sırala
  Object.keys(filteredGroupedByCategory).forEach(category => {
    filteredGroupedByCategory[category].sort((a, b) => (a.order || 0) - (b.order || 0));
  });

  // Tüm sıralanmış ürünleri düz bir diziye dönüştür
  const sortedFilteredProducts = Object.values(filteredGroupedByCategory).flat();

  // Sayfalanmış ürünleri hesapla
  const paginatedProducts = sortedFilteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      <PageHeader
        title="Ürünler"
        actionButton={
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddNew}
              sx={{
                bgcolor: '#fff',
                color: '#3949ab',
                '&:hover': { bgcolor: '#f5f5f5' },
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: 'none'
              }}
            >
              Ürün Ekle
            </Button>
            <ExportButton
              onClick={handleExport}
              label="Excel"
              endIcon={<KeyboardArrowDownIcon />}
              sx={{
                bgcolor: '#fff',
                color: '#3949ab',
                '&:hover': { bgcolor: '#f5f5f5' },
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: 'none'
              }}
            />
          </Box>
        }
      />
      <FilterPanel
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Ara..."
        fields={productFilterConfig}
        onAdvancedSearch={handleAdvancedFilterChange}
        initialValues={advancedFilters}
      />

      {/* Durum Sekmeleri */}
      <Box sx={{ borderBottom: 1, borderColor: '#eee', mb: 2, bgcolor: '#fff', borderRadius: 2, px: 2, pt: 1 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => { setActiveTab(newValue); setPage(0); }}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              color: 'text.secondary',
              minHeight: 48,
              mr: 2,
              '&.Mui-selected': {
                color: '#ff6b00',
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#ff6b00',
              height: 3,
              borderRadius: '3px 3px 0 0'
            }
          }}
        >
          <Tab value="all" label={<TabLabel label="Tümü" count={counts.all} />} />
          <Tab value="onSale" label={<TabLabel label="Satışta" count={counts.onSale} />} />
          <Tab value="soldOut" label={<TabLabel label="Tükendi" count={counts.soldOut} />} />
          <Tab value="closed" label={<TabLabel label="Satışa kapalı" count={counts.closed} />} />
          <Tab value="locked" label={<TabLabel label="Kilitli" count={counts.locked} />} />
        </Tabs>
      </Box>

      {/* Toplu İşlem Çubuğu */}
      {selectedProductIds.length > 0 && (
        <Paper sx={{ mb: 2, p: 1.5, display: 'flex', alignItems: 'center', bgcolor: 'primary.light', color: 'primary.contrastText', borderRadius: 2 }}>
          <Typography variant="body1" sx={{ flexGrow: 1, fontWeight: 500 }}>
            {selectedProductIds.length} ürün seçildi
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" variant="contained" color="info" onClick={() => setBulkPriceModalOpen(true)} startIcon={<EditIcon />}>Fiyat Güncelle</Button>
            <Button size="small" variant="contained" color="success" onClick={() => handleStatusChangeSelected('Aktif')} startIcon={<CheckCircleIcon />}>Aktif Yap</Button>
            <Button size="small" variant="contained" color="warning" onClick={() => handleStatusChangeSelected('Pasif')} startIcon={<CancelIcon />}>Pasif Yap</Button>
            <Button size="small" variant="contained" color="error" onClick={handleDeleteSelected} startIcon={<DeleteIcon />}>Sil</Button>
          </Box>
        </Paper>
      )}

      {/* Ürün Tablosu */}
      <Paper sx={{ mb: 3, p: 0, borderRadius: 2, overflow: 'hidden', width: '100%', maxWidth: '100%' }}>
        <TableContainer 
          ref={tableContainerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          sx={{ 
            width: '100%', 
            overflowX: 'auto',
            overflowY: 'hidden',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: isDragging ? 'none' : 'auto', // Seçimi engelle
            touchAction: 'pan-x'
          }}
        >
          <Table sx={{ minWidth: 1500 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#fcfcfc', borderBottom: '2px solid #eee' }}>
                <TableCell padding="checkbox" sx={{ width: 50, borderRight: '1px solid #eee' }}>
                  <Checkbox 
                    color="primary"
                    indeterminate={selectedProductIds.length > 0 && selectedProductIds.length < paginatedProducts.length}
                    checked={paginatedProducts.length > 0 && selectedProductIds.length === paginatedProducts.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell sx={{ minWidth: 250, borderRight: '1px solid #eee' }}><Typography variant="subtitle2" fontWeight={600} color="text.secondary">Ürün bilgisi</Typography></TableCell>
                <TableCell sx={{ minWidth: 100, borderRight: '1px solid #eee' }} align="center"><Typography variant="subtitle2" fontWeight={600} color="text.secondary">Buybox sırası</Typography></TableCell>
                <TableCell sx={{ minWidth: 200, borderRight: '1px solid #eee' }}><Typography variant="subtitle2" fontWeight={600} color="text.secondary">Komisyon ve Vade (KDV Hariç)</Typography></TableCell>
                <TableCell sx={{ minWidth: 130, borderRight: '1px solid #eee' }}><Typography variant="subtitle2" fontWeight={600} color="text.secondary">Fiyat</Typography></TableCell>
                <TableCell sx={{ minWidth: 140, borderRight: '1px solid #eee' }}><Typography variant="subtitle2" fontWeight={600} color="text.secondary">Rekabetçi fiyatlar</Typography></TableCell>
                <TableCell sx={{ minWidth: 150, borderRight: '1px solid #eee' }}><Typography variant="subtitle2" fontWeight={600} color="text.secondary">Son 10 gün en düşük fiyat</Typography></TableCell>
                <TableCell sx={{ minWidth: 150, borderRight: '1px solid #eee' }} align="center"><Typography variant="subtitle2" fontWeight={600} color="text.secondary">Ürün bilgi seviyesi</Typography></TableCell>
                <TableCell sx={{ minWidth: 120, borderRight: '1px solid #eee' }}><Typography variant="subtitle2" fontWeight={600} color="text.secondary">Stok miktarı</Typography></TableCell>
                <TableCell sx={{ minWidth: 120, borderRight: '1px solid #eee' }}><Typography variant="subtitle2" fontWeight={600} color="text.secondary">Kargoya veriliş süresi</Typography></TableCell>
                <TableCell sx={{ minWidth: 150, borderRight: '1px solid #eee' }}><Typography variant="subtitle2" fontWeight={600} color="text.secondary">Satıcı stok kodu</Typography></TableCell>
                <TableCell sx={{ minWidth: 80 }} align="center"><Typography variant="subtitle2" fontWeight={600} color="text.secondary">İşlemler</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(filteredGroupedByCategory)
                .filter(([_, products]) => products.some(p => paginatedProducts.includes(p)))
                .map(([category, products]) => (
                  <React.Fragment key={category}>
                    {/* Kategori başlığı */}
                    <TableRow>
                      <TableCell colSpan={12} sx={{ backgroundColor: '#f9f9f9', py: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {category} ({products.length})
                        </Typography>
                      </TableCell>
                    </TableRow>
                    {/* Kategori ürünleri */}
                    {products
                      .filter(product => paginatedProducts.includes(product))
                      .map((product, index) => (
                        <TableRow
                          key={product.id}
                          hover
                        >
                          <TableCell padding="checkbox" sx={{ borderRight: '1px solid #eee' }}>
                            <Checkbox
                              checked={selectedProductIds.includes(product.id)}
                              onChange={(e) => handleSelectOne(e, product.id)}
                            />
                          </TableCell>
                          <TableCell sx={{ borderRight: '1px solid #eee' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar
                                src={product.imageUrl}
                                variant="square"
                                sx={{
                                  mr: 2,
                                  width: 50,
                                  height: 60,
                                  bgcolor: '#fff',
                                  border: '1px solid #e0e0e0',
                                  borderRadius: 1,
                                  objectFit: 'contain'
                                }}
                              />
                              <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '250px' }}>
                                <Typography
                                  variant="body2"
                                  fontWeight={500}
                                  sx={{
                                    fontSize: '0.85rem',
                                    lineHeight: 1.3,
                                    color: '#2c3e50',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical'
                                  }}
                                >
                                  {product.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'flex', gap: 1 }}>
                                  <span>SKU: <b style={{ color: '#8e8e8e', fontWeight: 400 }}>{product.sku}</b></span>
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="center" sx={{ borderRight: '1px solid #eee', bgcolor: '#fafafa' }}>
                            {product.buyboxRank ? (
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>{product.buyboxRank}</Typography>
                            ) : (
                              <Chip label="-" size="small" sx={{ bgcolor: '#f1f2f6', color: '#576574', fontWeight: 600, height: 24 }} />
                            )}
                          </TableCell>
                          <TableCell sx={{ borderRight: '1px solid #eee' }}>
                            <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#555' }}>Komisyon: %17 - 24 iş günü</Typography>
                            <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#777', mt: 0.5 }}>Tutar: {(product.salePrice * 0.17).toFixed(2)} TL</Typography>
                          </TableCell>
                          <TableCell sx={{ borderRight: '1px solid #eee', bgcolor: '#f0fdf4' }}>
                              <TextField 
                                size="small" 
                                defaultValue={product.salePrice.toFixed(2)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start" sx={{ '& p': { fontSize: '0.9rem' } }}>₺</InputAdornment>
                                }}
                                sx={{ width: '100px', '& input': { p: 0.5, fontSize: '0.85rem' }, bgcolor: '#fff', borderRadius: 1 }}
                              />
                          </TableCell>
                          <TableCell sx={{ borderRight: '1px solid #eee' }}>
                            {product.buyboxCompetitors && product.buyboxCompetitors.length > 0 ? (
                              <Box 
                                onClick={(e) => handleBuyboxOpen(e, product)}
                                sx={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', '&:hover': { bgcolor: '#f9f9f9' }, p: 0.5, borderRadius: 1 }}
                              >
                                <Typography variant="caption" color="text.secondary">Buybox kazanan</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Typography variant="body2" fontWeight={600} color="text.primary">
                                    {product.buyboxCompetitors[0].price.toFixed(2)} TL
                                  </Typography>
                                  <KeyboardArrowDownIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                </Box>
                              </Box>
                            ) : (
                              <Typography variant="body2" color="text.secondary">-</Typography>
                            )}
                          </TableCell>
                          <TableCell sx={{ borderRight: '1px solid #eee' }}>
                              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.85rem' }}>{product.salePrice.toFixed(2)} ₺</Typography>
                          </TableCell>
                          <TableCell align="center" sx={{ borderRight: '1px solid #eee' }}>
                            <Box 
                              onClick={(e) => handleInfoOpen(e, product)}
                              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, cursor: 'pointer', '&:hover': { bgcolor: '#f9f9f9' }, p: 0.5, borderRadius: 1 }}
                            >
                              <Typography 
                                variant="body2" 
                                fontWeight={600} 
                                color={product.infoLevel === 'Güçlü' ? 'success.main' : product.infoLevel === 'Orta' ? 'warning.main' : 'error.main'}
                              >
                                {product.infoLevel || (product.stock > 100 ? 'Güçlü' : product.stock > 20 ? 'Orta' : 'Zayıf')}
                              </Typography>
                              {(product.infoLevel && product.infoLevel !== 'Güçlü') ? (
                                <KeyboardArrowDownIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                              ) : null}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ borderRight: '1px solid #eee' }}>
                              <TextField 
                                size="small" 
                                defaultValue={product.stock}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><InventoryIcon sx={{ fontSize: 16, color: '#999' }} /></InputAdornment>
                                }}
                                sx={{ width: '80px', '& input': { p: 0.5, fontSize: '0.85rem' }, bgcolor: '#fff', borderRadius: 1 }}
                              />
                          </TableCell>
                          <TableCell sx={{ borderRight: '1px solid #eee' }}>
                              <Typography variant="body2" sx={{ color: '#555' }}>1</Typography>
                          </TableCell>
                          <TableCell sx={{ borderRight: '1px solid #eee' }}>
                              <Typography variant="body2" sx={{ color: '#555' }}>{product.sku}</Typography>
                          </TableCell>
                          <TableCell align="center" sx={{ bgcolor: '#fafafa' }}>
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, product)}
                              sx={{ bgcolor: '#eee' }}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </React.Fragment>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={t('productsPage.rowsPerPage')}
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${t('productsPage.of')} ${count}`}
        />
      </Paper>

      {/* Dropdown Menu for rows */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 2,
          sx: { minWidth: 150, borderRadius: 2, mt: 0.5 }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => { handleViewProduct(menuProduct!); handleMenuClose(); }}>
          <ListItemIcon><VisibilityIcon fontSize="small" color="info" /></ListItemIcon>
          Görüntüle
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><EditIcon fontSize="small" color="primary" /></ListItemIcon>
          Düzenle
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><ContentCopyIcon fontSize="small" color="secondary" /></ListItemIcon>
          Kopyala
        </MenuItem>
        <MenuItem onClick={() => {
          if (menuProduct) {
            setProducts(prev => prev.filter(p => p.id !== menuProduct.id));
            notifySuccess("Ürün silindi.");
          }
          handleMenuClose();
        }}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          Sil
        </MenuItem>
      </Menu>

      {/* Ürün Detay Modalı */}
      <ProductDetailModal
        open={detailModalOpen}
        onClose={handleCloseDetailModal}
        product={selectedProduct}
      />

      {/* Hızlı Ürün Ekleme Modalı */}
      <QuickAddProductModal
        open={quickAddModalOpen}
        onClose={() => setQuickAddModalOpen(false)}
      />

      {/* Popovers */}
      <Popover
        open={Boolean(buyboxAnchorEl)}
        anchorEl={buyboxAnchorEl}
        onClose={handleBuyboxClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: { p: 2, minWidth: 250, mt: 1, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }
        }}
      >
        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>BUYBOX FİYATLARI</Typography>
        {buyboxProduct?.buyboxCompetitors?.map((comp, i) => (
          <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="body2" fontWeight={700} color={i === 0 ? 'success.main' : 'warning.main'}>{comp.rank}</Typography>
              <Typography variant="body2" color={'text.primary'}>{comp.seller}</Typography>
            </Box>
            <Typography variant="body2" fontWeight={600} color={i === 0 ? 'text.primary' : 'text.secondary'}>{comp.price.toFixed(2)} TL</Typography>
          </Box>
        ))}
      </Popover>

      <Popover
        open={Boolean(infoAnchorEl)}
        anchorEl={infoAnchorEl}
        onClose={handleInfoClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          sx: { p: 2, minWidth: 320, maxWidth: 350, mt: 1, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }
        }}
      >
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', lineHeight: 1.5 }}>
          Ürün bilgilerinizin <b>iyileştirmeye</b> ihtiyacı var. Satışlarınızı artırmak için <b>ürün adı, görsel, açıklama ve özellikleri</b> eksiksiz doldurun.
        </Typography>
        <Button variant="outlined" color="warning" fullWidth startIcon={<EditIcon />} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
          Ürün bilgilerini güncelle
        </Button>
      </Popover>

      {/* Toplu Fiyat Güncelleme Modalı */}
      <Dialog open={bulkPriceModalOpen} onClose={() => setBulkPriceModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, fontSize: '1.2rem', pb: 1 }}>Toplu Fiyat Güncelle</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel>İşlem Türü</InputLabel>
              <Select
                value={bulkPriceOperation}
                label="İşlem Türü"
                onChange={(e) => setBulkPriceOperation(e.target.value as any)}
              >
                <MenuItem value="increase">Fiyatı Artır</MenuItem>
                <MenuItem value="decrease">Fiyatı Düşür</MenuItem>
                <MenuItem value="set">Sabit Fiyat Yap</MenuItem>
              </Select>
            </FormControl>

            {bulkPriceOperation !== 'set' && (
              <FormControl component="fieldset">
                <Typography variant="body2" color="text.secondary" gutterBottom>Değer Türü</Typography>
                <RadioGroup
                  row
                  value={bulkPriceType}
                  onChange={(e) => setBulkPriceType(e.target.value as any)}
                >
                  <FormControlLabel value="percentage" control={<Radio size="small" />} label="Yüzde (%)" />
                  <FormControlLabel value="amount" control={<Radio size="small" />} label="Tutar (₺)" />
                </RadioGroup>
              </FormControl>
            )}

            <TextField
              fullWidth
              size="small"
              label={bulkPriceOperation === 'set' ? 'Yeni Fiyat (₺)' : `Değer (${bulkPriceType === 'percentage' ? '%' : '₺'})`}
              type="number"
              value={bulkPriceValue}
              onChange={(e) => setBulkPriceValue(e.target.value)}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setBulkPriceModalOpen(false)} color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>İptal</Button>
          <Button onClick={handleBulkPriceUpdate} variant="contained" color="primary" sx={{ px: 3, textTransform: 'none', fontWeight: 600 }}>Güncelle</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductsPage;
