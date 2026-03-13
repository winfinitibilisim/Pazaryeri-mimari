import React, { useState } from 'react';
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
  SelectChangeEvent,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';

import ExportButton from '../components/common/ExportButton';
import QuickAddProductModal from '../components/common/QuickAddProductModal';
import AccordionFilter from '../components/common/AccordionFilter';
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
}

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const [quickAddModalOpen, setQuickAddModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [advancedFilters, setAdvancedFilters] = useState<Record<string, any>>({});

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
      date: '2023-05-15'
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
      date: '2023-05-10'
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
      date: '2023-05-05'
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
      date: '2023-04-28'
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
      date: '2023-04-20'
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
      date: '2023-05-20'
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
      date: '2023-05-18'
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

    // Tüm filtreleri birleştir
    return matchesSearch && matchesColor && matchesCategory && matchesAdvancedFilters;
  });

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
      {/* Temel Butonlar ve Arama Çubuğu */}
      <Paper sx={{ mb: 3, p: 2, borderRadius: 2, width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: { xs: 2, md: 1 } }}>
          {/* Arama Çubuğu */}
          <TextField
            placeholder="Ürün adı, SKU veya kategori ara..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{
              flex: { xs: 1, md: 1 },
              width: { xs: '100%', md: 'auto' },
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          {/* Butonlar */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: { xs: 'flex-end', md: 'flex-end' }, width: { xs: '100%', md: 'auto' } }}>
            <IconButton
              onClick={() => setFilterOpen(!filterOpen)}
              size="small"
              sx={{ border: '1px solid #e0e0e0', p: 1 }}
            >
              <FilterIcon fontSize="small" />
            </IconButton>

            <ExportButton onClick={handleExport} />

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setQuickAddModalOpen(true)}
              sx={{ ml: 1 }}
            >
              Hızlı Ekle
            </Button>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddNew}
              sx={{
                bgcolor: '#2a6496',
                '&:hover': { bgcolor: '#1e4c70' },
                borderRadius: 2,
                textTransform: 'none',
                ml: { md: 1 }
              }}
            >
              {t('productsPage.addProduct')}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Merkezi Filtre Bileşeni */}
      {filterOpen && (
        <AccordionFilter
          title="Ürün Filtreleri"
          fields={productFilterConfig}
          onSearch={handleAdvancedFilterChange}
          initialValues={advancedFilters}
          searchPlaceholder={t('productsPage.search')}
        />
      )}

      {/* Ürün Tablosu */}
      <Paper sx={{ mb: 3, p: 0, borderRadius: 2, overflow: 'hidden', width: '100%', maxWidth: '100%' }}>
        <TableContainer sx={{ width: '100%' }}>
          <Table sx={{ width: '100%', tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell width="25%">{t('productsPage.table.product')}</TableCell>
                <TableCell width="10%">{t('productsPage.table.sku')}</TableCell>
                <TableCell width="8%">{t('productsPage.table.stock')}</TableCell>
                <TableCell width="10%" align="right">Alış Fiyatı</TableCell>
                <TableCell width="10%" align="right">Satış Fiyatı</TableCell>
                <TableCell width="8%" align="center">Para Birimi</TableCell>
                <TableCell width="8%" align="center">{t('productsPage.table.quantity')}</TableCell>
                <TableCell width="10%" align="center">{t('productsPage.table.status')}</TableCell>
                <TableCell width="11%" align="center">{t('productsPage.table.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <DragDropContext onDragEnd={handleDragEnd}>
              {/* Kategoriye göre gruplandırılmış ürünleri göster */}
              {Object.entries(filteredGroupedByCategory)
                .filter(([_, products]) => products.some(p => paginatedProducts.includes(p)))
                .map(([category, products]) => (
                  <Droppable droppableId={category} key={category}>
                    {(provided) => (
                      <TableBody
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {/* Kategori başlığı */}
                        <TableRow>
                          <TableCell colSpan={7} sx={{ backgroundColor: '#f9f9f9', py: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {category} ({products.length})
                            </Typography>
                          </TableCell>
                        </TableRow>
                        {/* Kategori ürünleri */}
                        {products
                          .filter(product => paginatedProducts.includes(product))
                          .map((product, index) => (
                            <Draggable key={product.id} draggableId={product.id} index={index}>
                              {(provided, snapshot) => (
                                <TableRow
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  hover
                                  sx={{
                                    backgroundColor: snapshot.isDragging ? 'rgba(63, 81, 181, 0.08)' : 'inherit',
                                    ...provided.draggableProps.style,
                                  }}
                                >
                                  <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <Avatar
                                        src={product.imageUrl}
                                        variant="rounded"
                                        sx={{
                                          mr: 2,
                                          width: 100,
                                          height: 100,
                                          bgcolor: '#f0f0f0',
                                          border: '1px solid #e0e0e0',
                                          borderRadius: 1
                                        }}
                                      />
                                      <Box>
                                        <Typography
                                          variant="body2"
                                          fontWeight={500}
                                          sx={{
                                            fontSize: '0.875rem',
                                            lineHeight: 1.4,
                                            color: '#333',
                                            letterSpacing: '0.01em',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            maxWidth: '100%'
                                          }}
                                        >
                                          {product.name}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                          <Avatar
                                            sx={{
                                              width: 20,
                                              height: 20,
                                              mr: 0.5,
                                              bgcolor:
                                                product.category === 'Electronics' ? '#e8e6ff' :
                                                  product.category === 'Giyim' ? '#e6f7ff' :
                                                    product.category === 'Accessories' ? '#ffebe6' :
                                                      product.category === 'Shoes' ? '#e6ffe8' :
                                                        product.category === 'Office' ? '#fff9e6' :
                                                          product.category === 'Home Decor' ? '#e6f9ff' : '#f0f0f0'
                                            }}
                                          >
                                            {product.category === 'Electronics' ? (
                                              <Box component="span" sx={{ color: '#5045e4', fontSize: 12 }}>💻</Box>
                                            ) : product.category === 'Giyim' ? (
                                              <Box component="span" sx={{ color: '#4091db', fontSize: 12 }}>👕</Box>
                                            ) : product.category === 'Accessories' ? (
                                              <Box component="span" sx={{ color: '#e44545', fontSize: 12 }}>🎧</Box>
                                            ) : product.category === 'Shoes' ? (
                                              <Box component="span" sx={{ color: '#45e454', fontSize: 12 }}>👟</Box>
                                            ) : product.category === 'Office' ? (
                                              <Box component="span" sx={{ color: '#e4a045', fontSize: 12 }}>💼</Box>
                                            ) : product.category === 'Home Decor' ? (
                                              <Box component="span" sx={{ color: '#45c4e4', fontSize: 12 }}>🏠</Box>
                                            ) : (
                                              <Box component="span" sx={{ color: '#808080', fontSize: 12 }}>📦</Box>
                                            )}
                                          </Avatar>
                                          <Typography variant="caption" color="text.secondary">{product.category}</Typography>
                                        </Box>
                                      </Box>
                                    </Box>
                                  </TableCell>
                                  <TableCell>{product.sku}</TableCell>
                                  <TableCell>{product.stock}</TableCell>
                                  <TableCell align="right">
                                    <Typography variant="body2" color="text.secondary">
                                      {product.purchasePrice.toFixed(2)} {getCurrencySymbol(product.currency)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="right">
                                    <Typography variant="body2" fontWeight={500}>
                                      {product.salePrice.toFixed(2)} {getCurrencySymbol(product.currency)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="center">
                                    <Chip
                                      label={product.currency}
                                      size="small"
                                      variant="outlined"
                                      sx={{
                                        fontSize: '0.75rem',
                                        height: '24px',
                                        borderColor: '#e0e0e0',
                                        color: '#666'
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">{product.qty}</TableCell>
                                  <TableCell align="center">
                                    <Chip
                                      label={product.status}
                                      size="small"
                                      sx={{
                                        color: product.status === 'Aktif' ? '#1976d2' : '#7f8c8d',
                                        backgroundColor: product.status === 'Aktif' ? 'rgba(25, 118, 210, 0.1)' : 'rgba(127, 140, 141, 0.1)',
                                        borderRadius: '4px',
                                        fontWeight: 500,
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                      <IconButton
                                        size="small"
                                        sx={{ mr: 1 }}
                                        color="info"
                                        onClick={() => handleViewProduct(product)}
                                      >
                                        <VisibilityIcon fontSize="small" />
                                      </IconButton>
                                      <IconButton size="small" sx={{ mr: 1 }} color="primary">
                                        <EditIcon fontSize="small" />
                                      </IconButton>
                                      <IconButton size="small" color="error">
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Box>
                                  </TableCell>
                                </TableRow>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </TableBody>
                    )}
                  </Droppable>
                ))}
            </DragDropContext>
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
    </Box>
  );
};

export default ProductsPage;
