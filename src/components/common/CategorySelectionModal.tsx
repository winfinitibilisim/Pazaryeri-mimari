import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  ListItemButton,
  Box,
  Grid,
  Typography,
  Divider,
  Chip,
  Paper,
  Collapse
} from '@mui/material';
import { 
  Folder as FolderIcon, 
  Close as CloseIcon, 
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Category as CategoryIcon
} from '@mui/icons-material';

interface CategorySelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (category: string) => void;
}

interface CategoryItem {
  id: string;
  name: string;
  children?: CategoryItem[];
}

interface MainCategory {
  id: string;
  name: string;
  icon: string;
  isMainCategory: true;
  children?: CategoryItem[];
}

const hierarchicalCategories: MainCategory[] = [
  {
    id: 'genel',
    name: 'Genel',
    icon: '⭐',
    isMainCategory: true,
    children: [
      { id: 'temel-bilgiler', name: 'Temel Bilgiler' },
      { id: 'aciklama', name: 'Açıklama' },
      { id: 'durum', name: 'Durum' },
      { id: 'kategori', name: 'Kategori' }
    ]
  },
  {
    id: 'fotograf',
    name: 'Fotoğraf',
    icon: '📷',
    isMainCategory: true,
    children: [
      { id: 'ana-fotograf', name: 'Ana Fotoğraf' },
      { id: 'galeri', name: 'Galeri' },
      { id: 'video', name: 'Video' },
      { id: '360-gorsel', name: '360° Görsel' }
    ]
  },
  {
    id: 'vergiler',
    name: 'Vergiler',
    icon: '📊',
    isMainCategory: true,
    children: [
      { id: 'kdv', name: 'KDV' },
      { id: 'otv', name: 'ÖTV' },
      { id: 'oiv', name: 'ÖİV' },
      { id: 'konaklama-vergisi', name: 'Konaklama Vergisi' }
    ]
  },
  {
    id: 'ek-tanimlamalar',
    name: 'Ek Tanımlamalar',
    icon: '🏷️',
    isMainCategory: true,
    children: [
      { id: 'etiketler', name: 'Etiketler' },
      { id: 'ozellikler', name: 'Özellikler' },
      { id: 'meta-bilgiler', name: 'Meta Bilgiler' },
      { id: 'seo', name: 'SEO' }
    ]
  },
  {
    id: 'videolar',
    name: 'Videolar',
    icon: '🎥',
    isMainCategory: true,
    children: [
      { id: 'tanitim-videosu', name: 'Tanıtım Videosu' },
      { id: 'kullanim-videosu', name: 'Kullanım Videosu' },
      { id: 'youtube-link', name: 'YouTube Link' },
      { id: 'vimeo-link', name: 'Vimeo Link' }
    ]
  },
  {
    id: 'ozellikler',
    name: 'Özellikler',
    icon: '⚙️',
    isMainCategory: true,
    children: [
      { id: 'teknik-ozellikler', name: 'Teknik Özellikler' },
      { id: 'boyutlar', name: 'Boyutlar' },
      { id: 'agirlik', name: 'Ağırlık' },
      { id: 'malzeme', name: 'Malzeme' }
    ]
  },
  {
    id: 'urun-secenekleri',
    name: 'Ürün Seçenekleri',
    icon: '🎯',
    isMainCategory: true,
    children: [
      { id: 'renk', name: 'Renk' },
      { id: 'beden', name: 'Beden' },
      { id: 'boyut', name: 'Boyut' },
      { id: 'model', name: 'Model' }
    ]
  },
  {
    id: 'varyantlar',
    name: 'Varyantlar',
    icon: '🔄',
    isMainCategory: true,
    children: [
      { id: 'renk-varyantlari', name: 'Renk Varyantları' },
      { id: 'beden-varyantlari', name: 'Beden Varyantları' },
      { id: 'ozel-varyantlar', name: 'Özel Varyantlar' },
      { id: 'kombinasyonlar', name: 'Kombinasyonlar' }
    ]
  },
  {
    id: 'toplam-fiyat',
    name: 'Toplam Fiyat',
    icon: '💰',
    isMainCategory: true,
    children: [
      { id: 'satis-fiyati', name: 'Satış Fiyatı' },
      { id: 'alis-fiyati', name: 'Alış Fiyatı' },
      { id: 'indirimli-fiyat', name: 'İndirimli Fiyat' },
      { id: 'kdv-dahil-fiyat', name: 'KDV Dahil Fiyat' }
    ]
  },
  {
    id: 'promosyonlar',
    name: 'Promosyonlar',
    icon: '🎁',
    isMainCategory: true,
    children: [
      { id: 'indirim-kampanyasi', name: 'İndirim Kampanyası' },
      { id: 'hediye-urun', name: 'Hediye Ürün' },
      { id: 'ucretsiz-kargo', name: 'Ücretsiz Kargo' },
      { id: 'ozel-teklifler', name: 'Özel Teklifler' }
    ]
  },
  {
    id: 'vitrine-ekle',
    name: 'Vitrine Ekle',
    icon: '🏪',
    isMainCategory: true,
    children: [
      { id: 'ana-sayfa', name: 'Ana Sayfa' },
      { id: 'kategori-vitrini', name: 'Kategori Vitrini' },
      { id: 'onerilen-urunler', name: 'Önerilen Ürünler' },
      { id: 'cok-satanlar', name: 'Çok Satanlar' }
    ]
  },
  {
    id: 'benzer-urunler',
    name: 'Benzer Ürünler',
    icon: '🔗',
    isMainCategory: true,
    children: [
      { id: 'ilgili-urunler', name: 'İlgili Ürünler' },
      { id: 'alternatif-urunler', name: 'Alternatif Ürünler' },
      { id: 'tamamlayici-urunler', name: 'Tamamlayıcı Ürünler' },
      { id: 'cross-selling', name: 'Cross Selling' }
    ]
  },
  {
    id: 'ek-fiyatlar',
    name: 'Ek Fiyatlar',
    icon: '💳',
    isMainCategory: true,
    children: [
      { id: 'kargo-ucreti', name: 'Kargo Ücreti' },
      { id: 'montaj-ucreti', name: 'Montaj Ücreti' },
      { id: 'sigorta-ucreti', name: 'Sigorta Ücreti' },
      { id: 'ek-hizmetler', name: 'Ek Hizmetler' }
    ]
  },
  {
    id: 'stok-bilgileri',
    name: 'Stok Bilgileri',
    icon: '📦',
    isMainCategory: true,
    children: [
      { id: 'mevcut-stok', name: 'Mevcut Stok' },
      { id: 'minimum-stok', name: 'Minimum Stok' },
      { id: 'stok-takibi', name: 'Stok Takibi' },
      { id: 'depo-bilgileri', name: 'Depo Bilgileri' }
    ]
  }
];

const CategorySelectionModal: React.FC<CategorySelectionModalProps> = ({ open, onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMainCategory, setSelectedMainCategory] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const handleToggleExpand = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleMainCategorySelect = (categoryId: string) => {
    setSelectedMainCategory(categoryId);
    if (!expandedCategories.includes(categoryId)) {
      setExpandedCategories(prev => [...prev, categoryId]);
    }
  };

  const handleSubCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const handleSelect = () => {
    if (selectedCategory) {
      onSelect(selectedCategory);
      onClose();
    }
  };

  const getFilteredCategories = (): MainCategory[] => {
    if (!searchTerm) return hierarchicalCategories;
    
    return hierarchicalCategories.map((mainCat: MainCategory): MainCategory => ({
      ...mainCat,
      children: mainCat.children?.filter((subCat: CategoryItem) => 
        subCat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (subCat.children && subCat.children.some((child: CategoryItem) => 
          child.name.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      ).map((subCat: CategoryItem): CategoryItem => ({
        ...subCat,
        children: subCat.children?.filter((child: CategoryItem) => 
          child.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }))
    })).filter((mainCat: MainCategory) => 
      mainCat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (mainCat.children && mainCat.children.length > 0)
    );
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
          Kategori Seçimi
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
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Kategori ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                sx={{ mb: 2 }}
              />
              
              <Typography variant="subtitle2" sx={{ mb: 1, color: '#666', fontWeight: 600 }}>
                Ana Kategoriler
              </Typography>
              
              <List dense>
                {getFilteredCategories().map((mainCategory) => (
                  <Box key={mainCategory.id}>
                    <ListItemButton
                      selected={selectedMainCategory === mainCategory.id}
                      onClick={() => handleMainCategorySelect(mainCategory.id)}
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
                          {mainCategory.icon}
                        </Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary={mainCategory.name}
                        primaryTypographyProps={{ 
                          fontSize: '0.9rem',
                          fontWeight: selectedMainCategory === mainCategory.id ? 600 : 400
                        }}
                      />
                      {mainCategory.children && (
                        expandedCategories.includes(mainCategory.id) ? 
                          <ExpandLessIcon fontSize="small" /> : 
                          <ExpandMoreIcon fontSize="small" />
                      )}
                    </ListItemButton>
                    
                    {mainCategory.children && (
                      <Collapse in={expandedCategories.includes(mainCategory.id)}>
                        <List dense sx={{ pl: 2 }}>
                          {mainCategory.children.map((subCategory: CategoryItem) => (
                            <Box key={subCategory.id}>
                              <ListItemButton
                                onClick={() => {
                                  if (subCategory.children) {
                                    handleToggleExpand(subCategory.id);
                                  } else {
                                    handleSubCategorySelect(subCategory.name);
                                  }
                                }}
                                sx={{
                                  borderRadius: 1,
                                  mb: 0.3,
                                  bgcolor: selectedCategory === subCategory.name ? '#e3f2fd' : 'transparent'
                                }}
                              >
                                <ListItemIcon sx={{ minWidth: 28 }}>
                                  <FolderIcon fontSize="small" color="action" />
                                </ListItemIcon>
                                <ListItemText 
                                  primary={subCategory.name}
                                  primaryTypographyProps={{ fontSize: '0.85rem' }}
                                />
                                {subCategory.children && (
                                  expandedCategories.includes(subCategory.id) ? 
                                    <ExpandLessIcon fontSize="small" /> : 
                                    <ExpandMoreIcon fontSize="small" />
                                )}
                              </ListItemButton>
                              
                              {subCategory.children && (
                                <Collapse in={expandedCategories.includes(subCategory.id)}>
                                  <List dense sx={{ pl: 2 }}>
                                    {subCategory.children.map((childCategory: CategoryItem) => (
                                      <ListItemButton
                                        key={childCategory.id}
                                        onClick={() => handleSubCategorySelect(childCategory.name)}
                                        sx={{
                                          borderRadius: 1,
                                          mb: 0.2,
                                          bgcolor: selectedCategory === childCategory.name ? '#e8f5e8' : 'transparent'
                                        }}
                                      >
                                        <ListItemIcon sx={{ minWidth: 24 }}>
                                          <Box sx={{ 
                                            width: 6, 
                                            height: 6, 
                                            borderRadius: '50%', 
                                            bgcolor: '#666' 
                                          }} />
                                        </ListItemIcon>
                                        <ListItemText 
                                          primary={childCategory.name}
                                          primaryTypographyProps={{ fontSize: '0.8rem' }}
                                        />
                                      </ListItemButton>
                                    ))}
                                  </List>
                                </Collapse>
                              )}
                            </Box>
                          ))}
                        </List>
                      </Collapse>
                    )}
                  </Box>
                ))}
              </List>
            </Box>
          </Grid>
          
          {/* Sağ İçerik Alanı */}
          <Grid item xs={12} md={8} sx={{ height: '100%', overflow: 'auto' }}>
            <Box sx={{ p: 3 }}>
              {selectedCategory ? (
                <Paper sx={{ p: 3, bgcolor: '#f0f7ff', border: '2px solid #667eea' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <CategoryIcon sx={{ color: '#667eea', fontSize: 32 }} />
                    <Box>
                      <Typography variant="h6" sx={{ color: '#667eea', fontWeight: 600 }}>
                        Seçilen Kategori
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Aşağıdaki kategori seçilmiştir
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Chip 
                    label={selectedCategory}
                    sx={{ 
                      bgcolor: '#667eea',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '1rem',
                      height: 40,
                      '& .MuiChip-label': {
                        px: 2
                      }
                    }}
                  />
                  
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'white', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Kategori Açıklaması:</strong> Bu kategori altında {selectedCategory.toLowerCase()} ile ilgili tüm ürünler listelenir. Ürün eklerken doğru kategoriyi seçtiğinizden emin olun.
                    </Typography>
                  </Box>
                </Paper>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: '100%',
                  textAlign: 'center'
                }}>
                  <CategoryIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Kategori Seçin
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
                    Sol taraftaki menüden ürününüz için uygun kategoriyi seçin. Ana kategorilere tıklayarak alt kategorileri görüntüleyebilirsiniz.
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, bgcolor: '#f8f9fa', borderTop: '1px solid #e0e0e0' }}>
        <Button onClick={onClose} color="error" variant="outlined">
          İptal
        </Button>
        <Button 
          onClick={handleSelect} 
          variant="contained" 
          disabled={!selectedCategory}
          sx={{
            bgcolor: '#667eea',
            '&:hover': {
              bgcolor: '#5a6fd8'
            }
          }}
        >
          Kategoriyi Seç
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategorySelectionModal;
