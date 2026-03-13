import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    List,
    ListItemText,
    ListItemIcon,
    IconButton,
    ListItemButton,
    Box,
    Grid,
    Typography,
    Paper,
    Avatar
} from '@mui/material';
import {
    Close as CloseIcon,
    BrandingWatermark as BrandingIcon,
    Search as SearchIcon,
    CheckCircle as CheckCircleIcon,
    RadioButtonUnchecked as RadioButtonUncheckedIcon
} from '@mui/icons-material';

interface BrandSelectionModalProps {
    open: boolean;
    onClose: () => void;
    onSelect: (brands: BrandItem[]) => void;
    initialSelected?: BrandItem[];
}

export interface BrandItem {
    id: string;
    name: string;
    productCount: number;
    logo?: string;
}

// Mock Brands Data
const mockBrands: BrandItem[] = [
    { id: '1', name: 'Nike', productCount: 345, logo: 'N' },
    { id: '2', name: 'Adidas', productCount: 280, logo: 'A' },
    { id: '3', name: 'Puma', productCount: 150, logo: 'P' },
    { id: '4', name: 'Apple', productCount: 120, logo: 'A' },
    { id: '5', name: 'Samsung', productCount: 185, logo: 'S' },
    { id: '6', name: 'Sony', productCount: 90, logo: 'S' },
    { id: '7', name: 'LC Waikiki', productCount: 1200, logo: 'L' },
    { id: '8', name: 'Koton', productCount: 850, logo: 'K' },
    { id: '9', name: 'Mavi', productCount: 540, logo: 'M' },
    { id: '10', name: 'Bosch', productCount: 220, logo: 'B' },
    { id: '11', name: 'Siemens', productCount: 160, logo: 'S' },
    { id: '12', name: 'Arçelik', productCount: 310, logo: 'A' },
];

const BrandSelectionModal: React.FC<BrandSelectionModalProps> = ({ open, onClose, onSelect, initialSelected = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBrands, setSelectedBrands] = useState<BrandItem[]>(initialSelected);

    const handleBrandSelect = (brand: BrandItem) => {
        setSelectedBrands(prev => {
            const isSelected = prev.find(p => p.id === brand.id);
            if (isSelected) {
                return prev.filter(p => p.id !== brand.id);
            } else {
                return [...prev, brand];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedBrands.length === filteredBrands.length) {
            setSelectedBrands([]);
        } else {
            setSelectedBrands(filteredBrands);
        }
    };

    const handleSave = () => {
        onSelect(selectedBrands);
        onClose();
    };

    const handleRemoveSelected = (brandId: string) => {
        setSelectedBrands(prev => prev.filter(p => p.id !== brandId));
    };

    const filteredBrands = mockBrands.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{
                background: 'linear-gradient(135deg, #006064 0%, #00838f 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                <BrandingIcon />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Marka Seçimi
                </Typography>
                <IconButton aria-label="close" onClick={onClose} sx={{ color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 0, height: '500px' }}>
                <Grid container sx={{ height: '100%' }}>
                    {/* Sol Sidebar - Marka Listesi */}
                    <Grid item xs={12} md={6} sx={{
                        borderRight: '1px solid #e0e0e0',
                        bgcolor: '#f8f9fa',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', bgcolor: 'white' }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Marka adı ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                size="small"
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                                }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Toplam {filteredBrands.length} marka bulundu
                                </Typography>
                                <Button size="small" onClick={handleSelectAll}>
                                    {selectedBrands.length === filteredBrands.length && filteredBrands.length > 0 ? 'Tüm Seçimleri Kaldır' : 'Tümünü Seç'}
                                </Button>
                            </Box>
                        </Box>

                        <List dense sx={{ flexGrow: 1, overflow: 'auto', p: 0 }}>
                            {filteredBrands.map((brand) => {
                                const isSelected = selectedBrands.some(p => p.id === brand.id);
                                return (
                                    <ListItemButton
                                        key={brand.id}
                                        onClick={() => handleBrandSelect(brand)}
                                        sx={{
                                            borderBottom: '1px solid #f0f0f0',
                                            bgcolor: isSelected ? '#e0f7fa' : 'transparent',
                                            '&:hover': {
                                                bgcolor: isSelected ? '#b2ebf2' : '#f5f5f5'
                                            }
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            {isSelected ? <CheckCircleIcon color="info" /> : <RadioButtonUncheckedIcon color="action" />}
                                        </ListItemIcon>
                                        <ListItemIcon sx={{ minWidth: 50 }}>
                                            <Avatar sx={{ bgcolor: '#00838f', width: 40, height: 40 }}>
                                                {brand.logo || brand.name.charAt(0)}
                                            </Avatar>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body1" sx={{ fontWeight: 500, color: '#006064' }}>
                                                    {brand.name}
                                                </Typography>
                                            }
                                        />
                                        <Box sx={{ textAlign: 'right' }}>
                                            <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                                                <b>{brand.productCount}</b> Ürün
                                            </Typography>
                                        </Box>
                                    </ListItemButton>
                                );
                            })}
                            {filteredBrands.length === 0 && (
                                <Box sx={{ p: 4, textAlign: 'center' }}>
                                    <Typography color="text.secondary">Arama kriterlerine uygun marka bulunamadı.</Typography>
                                </Box>
                            )}
                        </List>
                    </Grid>

                    {/* Sağ İçerik Alanı - Seçilenler */}
                    <Grid item xs={12} md={6} sx={{ height: '100%', overflow: 'auto', bgcolor: 'white' }}>
                        <Box sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <BrandingIcon sx={{ color: '#00838f', fontSize: 32 }} />
                                <Box>
                                    <Typography variant="h6" sx={{ color: '#00838f', fontWeight: 600 }}>
                                        Seçilen Markalar
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {selectedBrands.length} marka seçildi
                                    </Typography>
                                </Box>
                            </Box>

                            {selectedBrands.length > 0 ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {selectedBrands.map((brand) => (
                                        <Paper key={brand.id} sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #e0e0e0', boxShadow: 'none' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}>
                                                <Avatar sx={{ width: 32, height: 32, fontSize: '1rem', bgcolor: '#00bcd4' }}>
                                                    {brand.logo || brand.name.charAt(0)}
                                                </Avatar>
                                                <Box sx={{ overflow: 'hidden' }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                                        {brand.name}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    {brand.productCount} ürün
                                                </Typography>
                                                <IconButton size="small" color="error" onClick={() => handleRemoveSelected(brand.id)}>
                                                    <CloseIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Paper>
                                    ))}

                                    <Box sx={{ mt: 3, p: 2, bgcolor: '#e0f7fa', borderRadius: 1, border: '1px solid #b2ebf2' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Not:</strong> İndirim kampanyası sağ tarafta listelenen <b>{selectedBrands.length}</b> markanın tüm ürünlerinde geçerli olacaktır.
                                        </Typography>
                                    </Box>
                                </Box>
                            ) : (
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '250px',
                                    textAlign: 'center',
                                    border: '2px dashed #e0e0e0',
                                    borderRadius: 2
                                }}>
                                    <Typography variant="body1" color="text.secondary" gutterBottom>
                                        Henüz marka seçilmedi.
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200 }}>
                                        Sol taraftan kampanyanın geçerli olacağı markaları seçebilirsiniz (Örn: Sadece Nike ve Adidas ürünlerinde geçerli).
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
                    onClick={handleSave}
                    variant="contained"
                    disabled={selectedBrands.length === 0}
                    sx={{
                        bgcolor: '#00838f',
                        '&:hover': {
                            bgcolor: '#006064'
                        }
                    }}
                >
                    Markaları Seç ({selectedBrands.length})
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BrandSelectionModal;
