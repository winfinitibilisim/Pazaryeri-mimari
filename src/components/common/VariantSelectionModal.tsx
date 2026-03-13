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
    Chip
} from '@mui/material';
import {
    Close as CloseIcon,
    Style as StyleIcon,
    Search as SearchIcon,
    CheckCircle as CheckCircleIcon,
    RadioButtonUnchecked as RadioButtonUncheckedIcon
} from '@mui/icons-material';

interface VariantSelectionModalProps {
    open: boolean;
    onClose: () => void;
    onSelect: (variants: VariantItem[]) => void;
    initialSelected?: VariantItem[];
}

export interface VariantItem {
    id: string;
    type: string; // Renk, Beden, Malzeme vb.
    value: string; // Kırmızı, XL, Pamuklu vb.
}

// Mock Variant Data
const mockVariants: VariantItem[] = [
    { id: '1', type: 'Renk', value: 'Kırmızı' },
    { id: '2', type: 'Renk', value: 'Mavi' },
    { id: '3', type: 'Renk', value: 'Siyah' },
    { id: '4', type: 'Renk', value: 'Beyaz' },
    { id: '5', type: 'Beden', value: 'S' },
    { id: '6', type: 'Beden', value: 'M' },
    { id: '7', type: 'Beden', value: 'L' },
    { id: '8', type: 'Beden', value: 'XL' },
    { id: '9', type: 'Beden', value: 'XXL' },
    { id: '10', type: 'Malzeme', value: 'Pamuklu' },
    { id: '11', type: 'Malzeme', value: 'Keten' },
    { id: '12', type: 'Ayakkabı Numarası', value: '42' },
    { id: '13', type: 'Ayakkabı Numarası', value: '43' },
    { id: '14', type: 'Hafıza', value: '128GB' },
    { id: '15', type: 'Hafıza', value: '256GB' },
];

const VariantSelectionModal: React.FC<VariantSelectionModalProps> = ({ open, onClose, onSelect, initialSelected = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedVariants, setSelectedVariants] = useState<VariantItem[]>(initialSelected);

    const handleVariantSelect = (variant: VariantItem) => {
        setSelectedVariants(prev => {
            const isSelected = prev.find(p => p.id === variant.id);
            if (isSelected) {
                return prev.filter(p => p.id !== variant.id);
            } else {
                return [...prev, variant];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedVariants.length === filteredVariants.length) {
            setSelectedVariants([]);
        } else {
            // Sadece arama sonucundaki benzersiz olanları ekle
            const newSelections = [...selectedVariants];
            filteredVariants.forEach(fv => {
                if (!newSelections.find(s => s.id === fv.id)) {
                    newSelections.push(fv);
                }
            });
            if (selectedVariants.length === filteredVariants.length) {
                // Toggle off behavior if all in filter are selected
                setSelectedVariants([]);
            } else {
                setSelectedVariants(newSelections);
            }
        }
    };

    const handleSave = () => {
        onSelect(selectedVariants);
        onClose();
    };

    const handleRemoveSelected = (variantId: string) => {
        setSelectedVariants(prev => prev.filter(p => p.id !== variantId));
    };

    const filteredVariants = mockVariants.filter(variant =>
        variant.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        variant.value.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Varyantları tiplerine göre gruplama (örn: tüm Renkler bir arada)
    const groupedVariants = filteredVariants.reduce((acc, variant) => {
        if (!acc[variant.type]) {
            acc[variant.type] = [];
        }
        acc[variant.type].push(variant);
        return acc;
    }, {} as Record<string, VariantItem[]>);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{
                background: 'linear-gradient(135deg, #e65100 0%, #ef6c00 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                <StyleIcon />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Varyant Seçeneği Seçimi
                </Typography>
                <IconButton aria-label="close" onClick={onClose} sx={{ color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 0, height: '500px' }}>
                <Grid container sx={{ height: '100%' }}>
                    {/* Sol Sidebar - Varyant Listesi */}
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
                                placeholder="Varyant tipi veya değeri ara (örn: Kırmızı)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                size="small"
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                                }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    {filteredVariants.length} seçenek bulundu
                                </Typography>
                                <Button size="small" onClick={handleSelectAll}>
                                    Tümünü Seç/Bırak
                                </Button>
                            </Box>
                        </Box>

                        <List dense sx={{ flexGrow: 1, overflow: 'auto', p: 0 }}>
                            {Object.entries(groupedVariants).map(([type, variants]) => (
                                <React.Fragment key={type}>
                                    <Box sx={{ bgcolor: '#eee', px: 2, py: 1, borderBottom: '1px solid #e0e0e0', borderTop: '1px solid #e0e0e0' }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#555' }}>
                                            {type}
                                        </Typography>
                                    </Box>
                                    {variants.map((variant) => {
                                        const isSelected = selectedVariants.some(p => p.id === variant.id);
                                        return (
                                            <ListItemButton
                                                key={variant.id}
                                                onClick={() => handleVariantSelect(variant)}
                                                sx={{
                                                    borderBottom: '1px solid #f0f0f0',
                                                    bgcolor: isSelected ? '#fff3e0' : 'transparent',
                                                    '&:hover': {
                                                        bgcolor: isSelected ? '#ffe0b2' : '#f5f5f5'
                                                    }
                                                }}
                                            >
                                                <ListItemIcon sx={{ minWidth: 40 }}>
                                                    {isSelected ? <CheckCircleIcon color="warning" /> : <RadioButtonUncheckedIcon color="action" />}
                                                </ListItemIcon>

                                                <ListItemText
                                                    primary={
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                                {variant.value}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                            </ListItemButton>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                            {filteredVariants.length === 0 && (
                                <Box sx={{ p: 4, textAlign: 'center' }}>
                                    <Typography color="text.secondary">Arama kriterlerine uygun varyant bulunamadı.</Typography>
                                </Box>
                            )}
                        </List>
                    </Grid>

                    {/* Sağ İçerik Alanı - Seçilenler */}
                    <Grid item xs={12} md={6} sx={{ height: '100%', overflow: 'auto', bgcolor: 'white' }}>
                        <Box sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <StyleIcon sx={{ color: '#e65100', fontSize: 32 }} />
                                <Box>
                                    <Typography variant="h6" sx={{ color: '#e65100', fontWeight: 600 }}>
                                        Seçilen Seçenekler
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {selectedVariants.length} varyant seçildi
                                    </Typography>
                                </Box>
                            </Box>

                            {selectedVariants.length > 0 ? (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {selectedVariants.map((variant) => (
                                        <Chip
                                            key={variant.id}
                                            label={`${variant.type}: ${variant.value}`}
                                            onDelete={() => handleRemoveSelected(variant.id)}
                                            sx={{
                                                bgcolor: '#fff3e0',
                                                color: '#e65100',
                                                border: '1px solid #ffcc80',
                                                fontWeight: 500,
                                                '& .MuiChip-deleteIcon': {
                                                    color: '#ff9800',
                                                    '&:hover': {
                                                        color: '#e65100'
                                                    }
                                                }
                                            }}
                                        />
                                    ))}

                                    <Box sx={{ mt: 3, p: 2, bgcolor: '#fff8e1', borderRadius: 1, border: '1px solid #ffecb3', width: '100%' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Not:</strong> İndirim kampanyası yalnızca seçilen varyant değerlerine sahip ürünlerde geçerli olacaktır (Örn: Sadece {selectedVariants.map(v => v.value).join(', ')} seçeneklerinde).
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
                                        Henüz varyant seçilmedi.
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200 }}>
                                        Sol taraftan kampanyanın geçerli olacağı renk, beden gibi seçenekleri dahil edebilirsiniz.
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
                    disabled={selectedVariants.length === 0}
                    sx={{
                        bgcolor: '#e65100',
                        '&:hover': {
                            bgcolor: '#ef6c00'
                        }
                    }}
                >
                    Varyant Seçeneklerini Koru ({selectedVariants.length})
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default VariantSelectionModal;
