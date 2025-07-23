import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Typography,
} from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';

interface NewProduct {
  name: string;
  unit: string;
  price: number;
  vatRate: number;
}

interface AddNewProductModalProps {
  open: boolean;
  onClose: () => void;
  onAddProduct: (product: NewProduct) => void;
}

const AddNewProductModal: React.FC<AddNewProductModalProps> = ({ open, onClose, onAddProduct }) => {
  const [product, setProduct] = useState<NewProduct>({ name: '', unit: 'Adet', price: 0, vatRate: 20 });
  const [activeCategory, setActiveCategory] = useState('Genel');

  const categories = [
    { name: 'Genel', color: '#ff4444', starred: true },
    { name: 'Fotoğraf', color: '#4285f4', starred: true },
    { name: 'Vergiler', color: '#4285f4', starred: true },
    { name: 'Ek Tanımlamalar', color: '#4285f4', starred: false },
    { name: 'Videolar', color: '#4285f4', starred: true },
    { name: 'Özellikler', color: '#4285f4', starred: true },
    { name: 'Ürün Seçenekleri', color: '#4285f4', starred: true },
    { name: 'Varyantlar', color: '#4285f4', starred: true },
    { name: 'Toplam Fiyat', color: '#ff4444', starred: false },
    { name: 'Promosyonlar', color: '#4285f4', starred: true },
    { name: 'Vitrine Ekle', color: '#4285f4', starred: true },
    { name: 'Benzer Ürünler', color: '#4285f4', starred: false },
    { name: 'Ek Fiyatlar', color: '#4285f4', starred: true },
    { name: 'Stok Bilgileri', color: '#4285f4', starred: false },
  ];

  const handleChange = (field: keyof NewProduct, value: string | number) => {
    setProduct(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (product.name.trim()) {
      onAddProduct(product);
      setProduct({ name: '', unit: 'Adet', price: 0, vatRate: 20 }); // Reset form
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Ürünler / Product-edit / Güncelle</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" size="small">Ürün Hareketleri</Button>
            <Button variant="outlined" size="small">İşlemler</Button>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        {/* Category Menu */}
        <Box sx={{ mb: 3, borderBottom: '1px solid #e0e0e0', pb: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {categories.map((category) => (
              <Chip
                key={category.name}
                label={category.name}
                icon={category.starred ? <Star fontSize="small" /> : <StarBorder fontSize="small" />}
                onClick={() => setActiveCategory(category.name)}
                variant={activeCategory === category.name ? 'filled' : 'outlined'}
                sx={{
                  backgroundColor: activeCategory === category.name ? category.color : 'transparent',
                  color: activeCategory === category.name ? 'white' : category.color,
                  borderColor: category.color,
                  '&:hover': {
                    backgroundColor: activeCategory === category.name ? category.color : `${category.color}20`,
                  },
                  '& .MuiChip-icon': {
                    color: activeCategory === category.name ? 'white' : category.color,
                  }
                }}
              />
            ))}
          </Box>
        </Box>
        {/* Content based on active category */}
        {activeCategory === 'Genel' && (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField 
              autoFocus 
              label="Ürün/Hizmet Adı" 
              fullWidth 
              variant="outlined" 
              value={product.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
                <InputLabel>Birim</InputLabel>
                <Select 
                  label="Birim" 
                  value={product.unit}
                  onChange={(e) => handleChange('unit', e.target.value)}
                >
                    <MenuItem value="Adet">Adet</MenuItem>
                    <MenuItem value="Kg">Kg</MenuItem>
                    <MenuItem value="Metre">Metre</MenuItem>
                    <MenuItem value="Saat">Saat</MenuItem>
                </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
             <TextField 
                label="Birim Fiyatı" 
                type="number" 
                fullWidth 
                variant="outlined" 
                value={product.price}
                onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
             />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
                <InputLabel>KDV Oranı (%)</InputLabel>
                <Select 
                  label="KDV Oranı (%)" 
                  value={String(product.vatRate)}
                  onChange={(e) => handleChange('vatRate', parseInt(e.target.value, 10))}
                >
                    <MenuItem value={0}>%0</MenuItem>
                    <MenuItem value={1}>%1</MenuItem>
                    <MenuItem value={10}>%10</MenuItem>
                    <MenuItem value={20}>%20</MenuItem>
                </Select>
            </FormControl>
          </Grid>
        </Grid>
        )}
        
        {/* Other categories - placeholder content */}
        {activeCategory !== 'Genel' && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              {activeCategory} kategorisi için içerik henüz hazırlanmamıştır.
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined">İptal</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddNewProductModal;
