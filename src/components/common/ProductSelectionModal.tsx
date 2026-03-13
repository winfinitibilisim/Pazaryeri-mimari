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
    Chip,
    Paper,
    Avatar
} from '@mui/material';
import {
    Close as CloseIcon,
    Inventory as InventoryIcon,
    Search as SearchIcon,
    CheckCircle as CheckCircleIcon,
    RadioButtonUnchecked as RadioButtonUncheckedIcon
} from '@mui/icons-material';

interface ProductSelectionModalProps {
    open: boolean;
    onClose: () => void;
    onSelect: (products: ProductItem[]) => void;
    initialSelected?: ProductItem[];
}

export interface ProductVariant {
    id: string;
    name: string;
    sku: string;
    price: number;
    stock: number;
}

export interface ProductOption {
    name: string; // e.g., 'Beden', 'Renk'
    variants: ProductVariant[];
}

export interface ProductItem {
    id: string;
    name: string;
    sku: string;
    price: number;
    stock: number;
    category: string;
    image: string;
    options?: ProductOption[];
}

// Mock Products Data
const mockProducts: ProductItem[] = [
    {
        id: '1', name: 'Premium Oxford Gömlek', sku: 'PRM-OX-01', price: 1299.90, stock: 150, category: 'Erkek Giyim', image: '👕',
        options: [
            {
                name: 'Beden',
                variants: [
                    { id: '1-S', name: 'S', sku: 'PRM-OX-01-S', price: 1299.90, stock: 40 },
                    { id: '1-M', name: 'M', sku: 'PRM-OX-01-M', price: 1299.90, stock: 60 },
                    { id: '1-L', name: 'L', sku: 'PRM-OX-01-L', price: 1299.90, stock: 50 },
                ]
            }
        ]
    },
    {
        id: '2', name: 'Slim Fit Chino Pantolon', sku: 'SLM-CH-02', price: 899.90, stock: 85, category: 'Erkek Giyim', image: '👖',
        options: [
            {
                name: 'Renk',
                variants: [
                    { id: '2-BEJ', name: 'Bej', sku: 'SLM-CH-02-BEJ', price: 899.90, stock: 45 },
                    { id: '2-LAC', name: 'Lacivert', sku: 'SLM-CH-02-LAC', price: 899.90, stock: 40 },
                ]
            }
        ]
    },
    { id: '3', name: 'Deri Klasik Ceket', sku: 'DER-KL-03', price: 3499.00, stock: 20, category: 'Dış Giyim', image: '🧥' },
    {
        id: '4', name: 'Yazlık Desenli Elbise', sku: 'YAZ-EL-04', price: 1599.00, stock: 60, category: 'Kadın Giyim', image: '👗',
        options: [
            {
                name: 'Beden',
                variants: [
                    { id: '4-36', name: '36', sku: 'YAZ-EL-04-36', price: 1599.00, stock: 15 },
                    { id: '4-38', name: '38', sku: 'YAZ-EL-04-38', price: 1599.00, stock: 25 },
                    { id: '4-40', name: '40', sku: 'YAZ-EL-04-40', price: 1599.00, stock: 20 },
                ]
            }
        ]
    },
    { id: '5', name: 'Basic V Yaka Tişört', sku: 'BSC-VY-05', price: 299.90, stock: 300, category: 'Üst Giyim', image: '👚' },
    { id: '6', name: 'Spor Koşu Ayakkabısı', sku: 'SPR-AY-06', price: 2199.00, stock: 45, category: 'Ayakkabı', image: '👟' },
    { id: '7', name: 'Akıllı Saat Pro', sku: 'AKL-ST-07', price: 4599.00, stock: 110, category: 'Elektronik', image: '⌚' },
    { id: '8', name: 'Kablosuz Kulaklık', sku: 'KBL-KL-08', price: 1899.00, stock: 200, category: 'Elektronik', image: '🎧' },
    { id: '9', name: 'Ergonomik Oyun Koltuğu', sku: 'ERG-OK-09', price: 5999.00, stock: 15, category: 'Mobilya', image: '💺' },
    { id: '10', name: 'Bebek Puset Seti', sku: 'BBK-PS-10', price: 8999.00, stock: 10, category: 'Anne & Çocuk', image: '👶' },
];

const ProductSelectionModal: React.FC<ProductSelectionModalProps> = ({ open, onClose, onSelect, initialSelected = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProducts, setSelectedProducts] = useState<ProductItem[]>(initialSelected);
    const [expandedProducts, setExpandedProducts] = useState<Record<string, boolean>>({});

    // Reset selection when modal opens if needed, or keep it persistent. Let's keep persistent for now.

    const handleProductSelect = (product: ProductItem | ProductVariant, parentProduct?: ProductItem) => {
        if (parentProduct) {
            // It's a variant selection
            const variantProduct: ProductItem = {
                ...parentProduct,
                id: (product as ProductVariant).id,
                name: `${parentProduct.name} - ${(product as ProductVariant).name}`,
                price: (product as ProductVariant).price,
                stock: (product as ProductVariant).stock,
                sku: (product as ProductVariant).sku,
                options: undefined // Don't carry over options to the cloned variant
            };

            setSelectedProducts(prev => {
                const isSelected = prev.find(p => p.id === variantProduct.id);
                if (isSelected) {
                    return prev.filter(p => p.id !== variantProduct.id);
                } else {
                    return [...prev, variantProduct];
                }
            });
            return;
        }

        setSelectedProducts(prev => {
            const isSelected = prev.find(p => p.id === product.id);
            if (isSelected) {
                return prev.filter(p => p.id !== product.id);
            } else {
                return [...prev, product as ProductItem];
            }
        });
    };

    const toggleExpand = (productId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedProducts(prev => ({
            ...prev,
            [productId]: !prev[productId]
        }));
    };

    const handleSelectAll = () => {
        if (selectedProducts.length === filteredProducts.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(filteredProducts);
        }
    };

    const handleSave = () => {
        onSelect(selectedProducts);
        onClose();
    };

    const handleRemoveSelected = (productId: string) => {
        setSelectedProducts(prev => prev.filter(p => p.id !== productId));
    };

    const filteredProducts = mockProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle sx={{
                background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                <InventoryIcon />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Ürün Seçimi
                </Typography>
                <IconButton aria-label="close" onClick={onClose} sx={{ color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 0, height: '600px' }}>
                <Grid container sx={{ height: '100%' }}>
                    {/* Sol Sidebar - Ürün Listesi */}
                    <Grid item xs={12} md={7} sx={{
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
                                placeholder="Ürün adı, SKU veya kategori ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                size="small"
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                                }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Toplam {filteredProducts.length} ürün bulundu
                                </Typography>
                                <Button size="small" onClick={handleSelectAll}>
                                    {selectedProducts.length === filteredProducts.length && filteredProducts.length > 0 ? 'Tüm Seçimleri Kaldır' : 'Tümünü Seç'}
                                </Button>
                            </Box>
                        </Box>

                        <List dense sx={{ flexGrow: 1, overflow: 'auto', p: 0 }}>
                            {filteredProducts.map((product) => {
                                const isSelected = selectedProducts.some(p => p.id === product.id);
                                const hasOptions = product.options && product.options.length > 0;
                                const isExpanded = expandedProducts[product.id];

                                return (
                                    <React.Fragment key={product.id}>
                                        <ListItemButton
                                            onClick={() => hasOptions ? toggleExpand(product.id, {} as any) : handleProductSelect(product)}
                                            sx={{
                                                borderBottom: isExpanded ? 'none' : '1px solid #f0f0f0',
                                                bgcolor: isSelected && !hasOptions ? '#e8f5e9' : 'transparent',
                                                '&:hover': {
                                                    bgcolor: isSelected && !hasOptions ? '#c8e6c9' : '#f5f5f5'
                                                }
                                            }}
                                        >
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                {!hasOptions ? (
                                                    isSelected ? <CheckCircleIcon color="success" /> : <RadioButtonUncheckedIcon color="action" />
                                                ) : (
                                                    <Box sx={{ width: 24, textAlign: 'center', cursor: 'pointer' }} onClick={(e) => toggleExpand(product.id, e)}>
                                                        {isExpanded ? '▼' : '▶'}
                                                    </Box>
                                                )}
                                            </ListItemIcon>
                                            <ListItemIcon sx={{ minWidth: 50 }}>
                                                <Avatar sx={{ bgcolor: '#fff', border: '1px solid #eee', width: 40, height: 40, fontSize: '1.2rem' }}>
                                                    {product.image}
                                                </Avatar>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                        {product.name}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Typography variant="body2" color="text.secondary" component="span">
                                                        SKU: {product.sku} | Kategori: {product.category} | Stok: <b>{product.stock}</b>
                                                        {hasOptions && <Chip size="small" label={`${product.options![0].variants.length} Seçenek`} sx={{ ml: 1, height: 20 }} />}
                                                    </Typography>
                                                }
                                            />
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                                                {product.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                            </Typography>
                                        </ListItemButton>

                                        {hasOptions && isExpanded && (
                                            <List component="div" disablePadding sx={{ bgcolor: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                                                {product.options!.map(option => (
                                                    <React.Fragment key={option.name}>
                                                        <ListItemText
                                                            primary={`Seçenek: ${option.name}`}
                                                            sx={{ pl: 10, py: 1, m: 0, bgcolor: '#f0f0f0' }}
                                                            primaryTypographyProps={{ variant: 'caption', fontWeight: 'bold' }}
                                                        />
                                                        {option.variants.map(variant => {
                                                            const isVariantSelected = selectedProducts.some(p => p.id === variant.id);
                                                            return (
                                                                <ListItemButton
                                                                    key={variant.id}
                                                                    sx={{ pl: 10, py: 0.5, bgcolor: isVariantSelected ? '#e8f5e9' : 'transparent' }}
                                                                    onClick={() => handleProductSelect(variant, product)}
                                                                >
                                                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                                                        {isVariantSelected ? <CheckCircleIcon color="success" fontSize="small" /> : <RadioButtonUncheckedIcon color="action" fontSize="small" />}
                                                                    </ListItemIcon>
                                                                    <ListItemText
                                                                        primary={variant.name}
                                                                        secondary={`SKU: ${variant.sku} | Stok: ${variant.stock}`}
                                                                        primaryTypographyProps={{ variant: 'body2' }}
                                                                        secondaryTypographyProps={{ variant: 'caption' }}
                                                                    />
                                                                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#2e7d32' }}>
                                                                        {variant.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                                                    </Typography>
                                                                </ListItemButton>
                                                            );
                                                        })}
                                                    </React.Fragment>
                                                ))}
                                            </List>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                            {filteredProducts.length === 0 && (
                                <Box sx={{ p: 4, textAlign: 'center' }}>
                                    <Typography color="text.secondary">Arama kriterlerine uygun ürün bulunamadı.</Typography>
                                </Box>
                            )}
                        </List>
                    </Grid>

                    {/* Sağ İçerik Alanı - Seçilenler */}
                    <Grid item xs={12} md={5} sx={{ height: '100%', overflow: 'auto', bgcolor: 'white' }}>
                        <Box sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <InventoryIcon sx={{ color: '#2e7d32', fontSize: 32 }} />
                                <Box>
                                    <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 600 }}>
                                        Seçilen Ürünler
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {selectedProducts.length} ürün seçildi
                                    </Typography>
                                </Box>
                            </Box>

                            {selectedProducts.length > 0 ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {selectedProducts.map((product) => (
                                        <Paper key={product.id} sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #e0e0e0', boxShadow: 'none' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}>
                                                <Avatar sx={{ width: 32, height: 32, fontSize: '1rem', bgcolor: '#f5f5f5' }}>{product.image}</Avatar>
                                                <Box sx={{ overflow: 'hidden' }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                                        {product.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {product.sku}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <IconButton size="small" color="error" onClick={() => handleRemoveSelected(product.id)}>
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                        </Paper>
                                    ))}

                                    <Box sx={{ mt: 3, p: 2, bgcolor: '#f1f8e9', borderRadius: 1, border: '1px solid #c5e1a5' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Not:</strong> İndirim kampanyası sağ tarafta listelenen <b>{selectedProducts.length}</b> üründe geçerli olacaktır.
                                        </Typography>
                                    </Box>
                                </Box>
                            ) : (
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '300px',
                                    textAlign: 'center',
                                    border: '2px dashed #e0e0e0',
                                    borderRadius: 2
                                }}>
                                    <Typography variant="body1" color="text.secondary" gutterBottom>
                                        Henüz ürün seçilmedi.
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 250 }}>
                                        Sol taraftaki listeden kampanyaya dahil etmek istediğiniz ürünleri seçebilirsiniz.
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
                    disabled={selectedProducts.length === 0}
                    sx={{
                        bgcolor: '#2e7d32',
                        '&:hover': {
                            bgcolor: '#1b5e20'
                        }
                    }}
                >
                    Ürünleri Seç ({selectedProducts.length})
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProductSelectionModal;
