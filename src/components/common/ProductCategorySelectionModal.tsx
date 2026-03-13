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
    Collapse
} from '@mui/material';
import {
    Folder as FolderIcon,
    Close as CloseIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    Category as CategoryIcon
} from '@mui/icons-material';
import { useCategories } from '../../contexts/CategoryContext';

interface ProductCategorySelectionModalProps {
    open: boolean;
    onClose: () => void;
    onSelect: (categories: string[]) => void;
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

// Ürün Kategorileri Modalı
const ProductCategorySelectionModal: React.FC<ProductCategorySelectionModalProps> = ({ open, onClose, onSelect }) => {
    const { categories } = useCategories();

    // Context'ten gelen Category tipini Modal'ın beklediği MainCategory tipine dönüştür
    const dynamicProductCategories: MainCategory[] = categories.map(cat => {
        // Alt kategorileri dönüştüren yardımcı fonksiyon
        const mapChildren = (children?: any[]): CategoryItem[] | undefined => {
            if (!children || children.length === 0) return undefined;
            return children.map(c => ({
                id: c.id,
                name: c.name,
                children: mapChildren(c.children)
            }));
        };

        return {
            id: cat.id,
            name: cat.name,
            icon: '📁', // İkon sistemi globalde olmadığı için varsayılan bir ikon
            isMainCategory: true,
            children: mapChildren(cat.children)
        };
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
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
        setSelectedCategories(prev =>
            prev.includes(categoryName)
                ? prev.filter(c => c !== categoryName)
                : [...prev, categoryName]
        );
    };

    const handleSelect = () => {
        if (selectedCategories.length > 0) {
            onSelect(selectedCategories);
            onClose();
        }
    };

    const getFilteredCategories = (): MainCategory[] => {
        if (!searchTerm) return dynamicProductCategories;

        return dynamicProductCategories.map((mainCat: MainCategory): MainCategory => ({
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
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                <CategoryIcon />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Ürün Kategorisi Seçimi
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
                                placeholder="Ürün kategorisi ara..."
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
                                                    bgcolor: '#1976d2',
                                                    color: 'white',
                                                    '&:hover': {
                                                        bgcolor: '#1565c0'
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
                                                                    bgcolor: selectedCategories.includes(subCategory.name) ? '#e3f2fd' : 'transparent'
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
                                                                                    bgcolor: selectedCategories.includes(childCategory.name) ? '#e8f5e8' : 'transparent'
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
                            {selectedCategories.length > 0 ? (
                                <Paper sx={{ p: 3, bgcolor: '#f0f7ff', border: '2px solid #1976d2' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                        <CategoryIcon sx={{ color: '#1976d2', fontSize: 32 }} />
                                        <Box>
                                            <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
                                                Seçilen Ürün Kategorileri
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Aşağıdaki kategoriler indirim koşulu olarak seçilecektir
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {selectedCategories.map((cat, idx) => (
                                            <Chip
                                                key={idx}
                                                label={cat}
                                                onDelete={() => handleSubCategorySelect(cat)}
                                                sx={{
                                                    bgcolor: '#1976d2',
                                                    color: 'white',
                                                    fontWeight: 600,
                                                    fontSize: '0.9rem',
                                                    '& .MuiChip-deleteIcon': {
                                                        color: 'white',
                                                        '&:hover': {
                                                            color: '#e0e0e0'
                                                        }
                                                    }
                                                }}
                                            />
                                        ))}
                                    </Box>

                                    <Box sx={{ mt: 3, p: 2, bgcolor: 'white', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Not:</strong> İndirim kampanyası seçilen <b>{selectedCategories.length}</b> kategorideki tüm ürünleri kapsayacaktır. Sepet tutarı ve diğer koşulların da eşleştiğinden emin olun.
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
                                        Ürün Kategorisi Seçin
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
                                        Sol taraftaki menüden indirim uygulanacak ürün kategorisini seçin.
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
                    disabled={selectedCategories.length === 0}
                    sx={{
                        bgcolor: '#1976d2',
                        '&:hover': {
                            bgcolor: '#1565c0'
                        }
                    }}
                >
                    Kategoriyi Seç
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProductCategorySelectionModal;
