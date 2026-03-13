import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Chip,
    TextField,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControlLabel,
    Switch,
    Grid,
    Autocomplete,
    Tooltip
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Category as CategoryIcon,
    Tune as TuneIcon,
    LocalOffer as TagIcon
} from '@mui/icons-material';
import { useCategories } from '../../contexts/CategoryContext';
import ProductCategorySelectionModal from '../../components/common/ProductCategorySelectionModal';

// --- Typings ---
interface ReferenceItem {
    id: string;
    name: string;
}

interface ProductClass {
    id: string;
    name: string;
    options: ReferenceItem[];  // Varyantlar (Renk, Beden vb.)
    features: ReferenceItem[]; // Özellikler (RAM, Kumaş Tipi vb.)
    categories: ReferenceItem[]; // Hangi kategorilerde bu şablon çıkacak?
    isActive: boolean;
}

// --- Mock Referenced Data (Önceki sayfalardan geliyor gibi düşünün) ---
const availableOptions: ReferenceItem[] = [
    { id: 'opt1', name: 'Renk' },
    { id: 'opt2', name: 'Beden' },
    { id: 'opt3', name: 'Ayakkabı Numarası' },
    { id: 'opt4', name: 'Malzeme' }
];

const availableFeatures: ReferenceItem[] = [
    { id: 'feat1', name: 'RAM Kapasitesi' },
    { id: 'feat2', name: 'Dahili Hafıza' },
    { id: 'feat3', name: 'Ekran Boyutu' },
    { id: 'feat4', name: 'Enerji Sınıfı' },
    { id: 'feat5', name: 'Kumaş Tipi' },
    { id: 'feat6', name: 'Garanti Süresi' }
];

// --- Mock Data ---
const initialClasses: ProductClass[] = [
    {
        id: 'pc1',
        name: 'Giyim - Üst Giyim (Tişört, Gömlek)',
        isActive: true,
        options: [
            { id: 'opt1', name: 'Renk' },
            { id: 'opt2', name: 'Beden' }
        ],
        features: [
            { id: 'feat5', name: 'Kumaş Tipi' }
        ],
        categories: [
            { id: 'giyim', name: 'Giyim' }
        ]
    },
    {
        id: 'pc2',
        name: 'Elektronik - Bilgisayar',
        isActive: true,
        options: [
            { id: 'opt1', name: 'Renk' }
        ],
        features: [
            { id: 'feat1', name: 'RAM Kapasitesi' },
            { id: 'feat2', name: 'Dahili Hafıza' },
            { id: 'feat3', name: 'Ekran Boyutu' },
            { id: 'feat6', name: 'Garanti Süresi' }
        ],
        categories: [
            { id: 'elektronik-bilgisayar', name: 'Elektronik - Bilgisayar' }
        ]
    },
    {
        id: 'pc3',
        name: 'Ayakkabı',
        isActive: true,
        options: [
            { id: 'opt1', name: 'Renk' },
            { id: 'opt3', name: 'Ayakkabı Numarası' },
            { id: 'opt4', name: 'Malzeme' }
        ],
        features: [
            { id: 'feat6', name: 'Garanti Süresi' }
        ],
        categories: [
            { id: 'ayakkabi', name: 'Ayakkabı' }
        ]
    }
];

const ProductClassesPage: React.FC = () => {
    const [classes, setClasses] = useState<ProductClass[]>(initialClasses);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal States
    const [openModal, setOpenModal] = useState(false);
    const [editingClass, setEditingClass] = useState<ProductClass | null>(null);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    // Form States
    const [formData, setFormData] = useState<Partial<ProductClass>>({
        name: '',
        isActive: true,
        options: [],
        features: [],
        categories: []
    });

    // Extract categories from context into ReferenceItem form
    const { getFlatCategories } = useCategories();
    // Extraction kept for ID to Name matching from the component, removing group logic that's no longer used for Autocomplete
    const { getFlatCategoryNames } = useCategories();
    const allGlobalCategoris = getFlatCategoryNames();
    const availableCategoriesMap = new Map(allGlobalCategoris.map(cat => [cat.toLowerCase().replace(/\s+/g, '-'), cat]));

    // Delete Confirmation State
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [classToDelete, setClassToDelete] = useState<string | null>(null);

    // --- Handlers ---
    const handleOpenModal = (prodClass?: ProductClass) => {
        if (prodClass) {
            setEditingClass(prodClass);
            setFormData({ ...prodClass, categories: prodClass.categories || [] });
        } else {
            setEditingClass(null);
            setFormData({ name: '', isActive: true, options: [], features: [], categories: [] });
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setEditingClass(null);
    };

    const handleSaveClass = () => {
        if (!formData.name) return; // Basic validation

        if (editingClass) {
            setClasses(prev => prev.map(c => c.id === editingClass.id ? { ...c, ...formData } as ProductClass : c));
        } else {
            const newClass: ProductClass = {
                id: Math.random().toString(36).substr(2, 9),
                name: formData.name || '',
                isActive: formData.isActive ?? true,
                options: formData.options || [],
                features: formData.features || [],
                categories: formData.categories || []
            };
            setClasses(prev => [...prev, newClass]);
        }
        handleCloseModal();
    };

    const confirmDelete = (id: string) => {
        setClassToDelete(id);
        setDeleteConfirmOpen(true);
    };

    const handleDelete = () => {
        if (classToDelete) {
            setClasses(prev => prev.filter(c => c.id !== classToDelete));
            setDeleteConfirmOpen(false);
            setClassToDelete(null);
        }
    };

    const toggleStatus = (id: string) => {
        setClasses(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
    };

    // --- Filtering ---
    const filteredClasses = classes.filter(cls =>
        cls.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ width: '100%' }}>
            {/* Header & Actions */}
            <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <TextField
                    placeholder="Ürün Sınıfı Ara... (Örn: Giyim)"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ minWidth: { xs: '100%', sm: '300px' } }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenModal()}
                    sx={{ bgcolor: '#2a6496', '&:hover': { bgcolor: '#1e4c70' } }}
                >
                    Yeni Ürün Sınıfı
                </Button>
            </Paper>

            {/* Main Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Sınıf / Şablon Adı</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Bağlı Kategoriler</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Zorunlu Seçenekler (Varyant)</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>İstenen Özellikler (Teknik)</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 600 }}>Durum</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>İşlemler</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredClasses.length > 0 ? (
                            filteredClasses.map((cls) => (
                                <TableRow key={cls.id} hover>
                                    <TableCell>
                                        <Typography variant="body1" fontWeight={500} color="primary.main">
                                            {cls.name}
                                        </Typography>
                                    </TableCell>

                                    {/* Kategoriler */}
                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
                                            <TagIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                                            {cls.categories && cls.categories.length > 0 ? (
                                                <>
                                                    {cls.categories.slice(0, 2).map(cat => (
                                                        <Chip key={cat.id} label={cat.name} size="small" sx={{ bgcolor: '#edf2f7', color: '#2d3748' }} />
                                                    ))}
                                                    {cls.categories.length > 2 && (
                                                        <Tooltip title={cls.categories.slice(2).map(c => c.name).join(', ')}>
                                                            <Chip label={`+${cls.categories.length - 2}`} size="small" />
                                                        </Tooltip>
                                                    )}
                                                </>
                                            ) : (
                                                <Typography variant="caption" color="text.secondary">- Yok -</Typography>
                                            )}
                                        </Box>
                                    </TableCell>

                                    {/* Seçenekler (Varyantlar) */}
                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
                                            <CategoryIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                                            {cls.options.length > 0 ? (
                                                cls.options.map(opt => (
                                                    <Chip key={opt.id} label={opt.name} size="small" sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }} />
                                                ))
                                            ) : (
                                                <Typography variant="caption" color="text.secondary">- Yok -</Typography>
                                            )}
                                        </Box>
                                    </TableCell>

                                    {/* Özellikler */}
                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
                                            <TuneIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                                            {cls.features.length > 0 ? (
                                                <>
                                                    {cls.features.slice(0, 3).map(feat => (
                                                        <Chip key={feat.id} label={feat.name} size="small" variant="outlined" />
                                                    ))}
                                                    {cls.features.length > 3 && (
                                                        <Tooltip title={cls.features.slice(3).map(f => f.name).join(', ')}>
                                                            <Chip label={`+${cls.features.length - 3}`} size="small" />
                                                        </Tooltip>
                                                    )}
                                                </>
                                            ) : (
                                                <Typography variant="caption" color="text.secondary">- Yok -</Typography>
                                            )}
                                        </Box>
                                    </TableCell>

                                    <TableCell align="center">
                                        <Switch
                                            checked={cls.isActive}
                                            onChange={() => toggleStatus(cls.id)}
                                            color="success"
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton color="primary" onClick={() => handleOpenModal(cls)} size="small">
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => confirmDelete(cls.id)} size="small">
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        Aranan kriterlere uygun ürün sınıfı bulunamadı.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add/Edit Modal */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
                <DialogTitle sx={{ pb: 1 }}>
                    {editingClass ? 'Ürün Sınıfını Düzenle' : 'Yeni Ürün Sınıfı Ekle (Şablon)'}
                </DialogTitle>
                <Typography variant="caption" sx={{ px: 3, display: 'block', color: 'text.secondary', mb: 1 }}>
                    Satıcıların ürün eklerken zorunlu girmesi gereken varyantları ve özellikleri buradan sınıfa bağlayın.
                </Typography>
                <DialogContent dividers>
                    <Grid container spacing={3}>
                        {/* Class Name & Status */}
                        <Grid item xs={12} sm={9}>
                            <TextField
                                label="Sınıf Adı (örn: Erkek Ayakkabı, Ev Elektroniği)"
                                fullWidth
                                value={formData.name || ''}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                variant="outlined"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} sx={{ display: 'flex', alignItems: 'center' }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isActive ?? true}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        color="success"
                                    />
                                }
                                label="Şablon Aktif"
                            />
                        </Grid>

                        {/* Options Selection */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                                <CategoryIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                                Üründe Olacak Seçenekler (Varyantlar)
                            </Typography>
                            <Autocomplete
                                multiple
                                id="options-tags"
                                options={availableOptions}
                                getOptionLabel={(option) => option.name}
                                value={formData.options || []}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                onChange={(_, newValue) => {
                                    setFormData({ ...formData, options: newValue as ReferenceItem[] });
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} variant="outlined" placeholder="Seçenek Ara... (Örn: Renk)" />
                                )}
                            />
                            <Typography variant="caption" color="text.secondary">
                                Bu sınıfı kullanan ürünler için hangi varyasyonların (Örn: Renk, Beden) mecburi seçileceğini belirler.
                            </Typography>
                        </Grid>

                        {/* Features Selection */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                                <TuneIcon fontSize="small" sx={{ mr: 1, color: 'secondary.main' }} />
                                Üründe İstenecek Özellikler (Teknik Detaylar)
                            </Typography>
                            <Autocomplete
                                multiple
                                id="features-tags"
                                options={availableFeatures}
                                getOptionLabel={(option) => option.name}
                                value={formData.features || []}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                onChange={(_, newValue) => {
                                    setFormData({ ...formData, features: newValue as ReferenceItem[] });
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} variant="outlined" placeholder="Özellik Ara... (Örn: RAM)" />
                                )}
                            />
                            <Typography variant="caption" color="text.secondary">
                                Satıcının ürünü tanımlarken (filtreleme için) hangi teknik detayları doldurması gerektiğini belirler.
                            </Typography>
                        </Grid>

                        {/* Category Selection */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                                <TagIcon fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
                                Bağlı Kategoriler
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => setIsCategoryModalOpen(true)}
                                    sx={{
                                        justifyContent: 'flex-start',
                                        color: 'text.primary',
                                        borderColor: '#e0e0e0',
                                        bgcolor: '#f5f5f5',
                                        '&:hover': {
                                            bgcolor: '#eeeeee',
                                            borderColor: '#d5d5d5',
                                        },
                                        textTransform: 'none',
                                        py: 1
                                    }}
                                >
                                    Kategoriler (Hepsi)
                                </Button>

                                {formData.categories && formData.categories.length > 0 && (
                                    <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                            Seçilen Kategoriler:
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {formData.categories.map((cat, idx) => (
                                                <Chip
                                                    key={idx}
                                                    label={cat.name}
                                                    onDelete={() => {
                                                        setFormData({
                                                            ...formData,
                                                            categories: formData.categories?.filter(c => c.id !== cat.id)
                                                        });
                                                    }}
                                                    sx={{
                                                        bgcolor: '#1976d2',
                                                        color: 'white',
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
                                    </Paper>
                                )}
                            </Box>

                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                Bu şablonun, kategoriler sayfasında ve ürün eklerken hangi kategorilere liste halinde geleceğini belirler.
                            </Typography>
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={handleCloseModal} color="inherit">
                        İptal
                    </Button>
                    <Button onClick={handleSaveClass} variant="contained" color="primary" disabled={!formData.name}>
                        {editingClass ? 'Güncelle' : 'Kaydet'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Kategori Seçim Modalı */}
            <ProductCategorySelectionModal
                open={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                onSelect={(selectedNames) => {
                    // Modal kategori isimlerini string dizisi olarak döndürüyor, ReferenceItem'a çevirelim
                    const newCategories: ReferenceItem[] = selectedNames.map(name => ({
                        id: name.toLowerCase().replace(/\s+/g, '-'),
                        name: name
                    }));
                    setFormData({ ...formData, categories: newCategories });
                }}
            />

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                <DialogTitle>Sınıf Silme Onayı</DialogTitle>
                <DialogContent>
                    <Typography>Bu ürün şablonunu silmek istediğinize emin misiniz? Bu sınıfa bağlı ürünler varsa satış ekranları etkilenebilir.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)} color="inherit">İptal</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">Sil</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProductClassesPage;
