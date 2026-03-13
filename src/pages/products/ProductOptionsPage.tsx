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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Switch,
    Grid
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    ColorLens as ColorLensIcon,
    ViewList as ViewListIcon,
    RadioButtonChecked as RadioButtonCheckedIcon,
    TextFields as TextFieldsIcon,
    Category as CategoryIcon
} from '@mui/icons-material';
import { useCategories } from '../../contexts/CategoryContext';
import ProductCategorySelectionModal from '../../components/common/ProductCategorySelectionModal';

// --- Typings ---
export interface ReferenceItem {
    id: string;
    name: string;
}
export type DisplayType = 'color' | 'dropdown' | 'radio' | 'text';

export interface OptionValue {
    id: string;
    name: string;
    colorCode?: string; // Sadece color tipi için geçerli
}

export interface ProductOption {
    id: string;
    name: string;
    displayType: DisplayType;
    values: OptionValue[];
    categories: ReferenceItem[];
    isActive: boolean;
}

// Mock Data
export const initialOptions: ProductOption[] = [
    {
        id: '1',
        name: 'Renk',
        displayType: 'color',
        isActive: true,
        categories: [{ id: 'giyim', name: 'Giyim' }],
        values: [
            { id: 'v1', name: 'Kırmızı', colorCode: '#FF0000' },
            { id: 'v2', name: 'Mavi', colorCode: '#0000FF' },
            { id: 'v3', name: 'Siyah', colorCode: '#000000' },
            { id: 'v4', name: 'Beyaz', colorCode: '#FFFFFF' }
        ]
    },
    {
        id: '2',
        name: 'Beden',
        displayType: 'dropdown',
        isActive: true,
        categories: [{ id: 'giyim', name: 'Giyim' }],
        values: [
            { id: 'v5', name: 'S' },
            { id: 'v6', name: 'M' },
            { id: 'v7', name: 'L' },
            { id: 'v8', name: 'XL' },
            { id: 'v9', name: 'XXL' }
        ]
    },
    {
        id: '3',
        name: 'Ayakkabı Numarası',
        displayType: 'radio',
        isActive: true,
        categories: [{ id: 'ayakkabi', name: 'Ayakkabı' }],
        values: [
            { id: 'v10', name: '36' },
            { id: 'v11', name: '37' },
            { id: 'v12', name: '38' },
            { id: 'v13', name: '39' },
            { id: 'v14', name: '40' },
            { id: 'v15', name: '41' },
            { id: 'v16', name: '42' },
            { id: 'v17', name: '43' },
            { id: 'v18', name: '44' }
        ]
    },
    {
        id: '4',
        name: 'RAM Kapasitesi',
        displayType: 'radio',
        isActive: true,
        categories: [{ id: 'bilgisayar', name: 'Bilgisayar' }],
        values: [
            { id: 'v1', name: '4 GB' },
            { id: 'v2', name: '8 GB' },
            { id: 'v3', name: '16 GB' },
            { id: 'v4', name: '32 GB' }
        ]
    },
    {
        id: '5',
        name: 'Ekran Boyutu',
        displayType: 'radio',
        isActive: true,
        categories: [{ id: 'bilgisayar', name: 'Bilgisayar' }],
        values: [
            { id: 'v10', name: '13 inç' },
            { id: 'v11', name: '14 inç' },
            { id: 'v12', name: '15.6 inç' },
            { id: 'v13', name: '17 inç' }
        ]
    },
    {
        id: '6',
        name: 'Malzeme',
        displayType: 'text',
        isActive: false,
        categories: [],
        values: [
            { id: 'v19', name: 'Pamuk' },
            { id: 'v20', name: 'Polyester' },
            { id: 'v21', name: 'Deri' },
            { id: 'v22', name: 'Keten' }
        ]
    }
];

const ProductOptionsPage: React.FC = () => {
    const [options, setOptions] = useState<ProductOption[]>(initialOptions);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal States
    const [openModal, setOpenModal] = useState(false);
    const [editingOption, setEditingOption] = useState<ProductOption | null>(null);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    // Context Data
    const { getFlatCategoryNames } = useCategories();

    // Form States
    const [formData, setFormData] = useState<Partial<ProductOption>>({
        name: '',
        displayType: 'dropdown',
        isActive: true,
        values: [],
        categories: []
    });
    const [newValueInput, setNewValueInput] = useState('');
    const [newColorCodeInput, setNewColorCodeInput] = useState('#000000');

    // Delete Confirmation State
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [optionToDelete, setOptionToDelete] = useState<string | null>(null);

    // Handlers
    const handleOpenModal = (option?: ProductOption) => {
        if (option) {
            setEditingOption(option);
            setFormData({ ...option, categories: option.categories || [] });
        } else {
            setEditingOption(null);
            setFormData({ name: '', displayType: 'dropdown', isActive: true, values: [], categories: [] });
        }
        setNewValueInput('');
        setNewColorCodeInput('#000000');
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setEditingOption(null);
    };

    const handleSaveOption = () => {
        if (!formData.name) return; // Basic validation

        if (editingOption) {
            setOptions(prev => prev.map(o => o.id === editingOption.id ? { ...o, ...formData } as ProductOption : o));
        } else {
            const newOption: ProductOption = {
                id: Math.random().toString(36).substr(2, 9),
                name: formData.name || '',
                displayType: formData.displayType || 'dropdown',
                isActive: formData.isActive || false,
                values: formData.values || [],
                categories: formData.categories || []
            };
            setOptions(prev => [...prev, newOption]);
        }
        handleCloseModal();
    };

    const confirmDelete = (id: string) => {
        setOptionToDelete(id);
        setDeleteConfirmOpen(true);
    };

    const handleDelete = () => {
        if (optionToDelete) {
            setOptions(prev => prev.filter(o => o.id !== optionToDelete));
            setDeleteConfirmOpen(false);
            setOptionToDelete(null);
        }
    };

    const toggleStatus = (id: string) => {
        setOptions(prev => prev.map(o => o.id === id ? { ...o, isActive: !o.isActive } : o));
    };

    // Option Value Management (Inside Modal)
    const addValue = () => {
        if (!newValueInput.trim()) return;

        const newVal: OptionValue = {
            id: Math.random().toString(36).substr(2, 9),
            name: newValueInput.trim(),
        };

        if (formData.displayType === 'color') {
            newVal.colorCode = newColorCodeInput;
        }

        setFormData(prev => ({
            ...prev,
            values: [...(prev.values || []), newVal]
        }));

        setNewValueInput('');
    };

    const removeValue = (valId: string) => {
        setFormData(prev => ({
            ...prev,
            values: prev.values?.filter(v => v.id !== valId) || []
        }));
    };

    // Helpers
    const getDisplayTypeIcon = (type: DisplayType) => {
        switch (type) {
            case 'color': return <ColorLensIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />;
            case 'dropdown': return <ViewListIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />;
            case 'radio': return <RadioButtonCheckedIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />;
            case 'text': return <TextFieldsIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />;
            default: return null;
        }
    };

    const getDisplayTypeName = (type: DisplayType) => {
        switch (type) {
            case 'color': return 'Renk Paleti';
            case 'dropdown': return 'Açılır Liste';
            case 'radio': return 'Radyo Buton';
            case 'text': return 'Metin Kutu';
            default: return type;
        }
    };

    // Filtering
    const filteredOptions = options.filter(opt =>
        opt.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ width: '100%' }}>
            {/* Header & Actions */}
            <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <TextField
                    placeholder="Seçenek Ara..."
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
                    Yeni Seçenek Ekle
                </Button>
            </Paper>

            {/* Main Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Seçenek Adı</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Bağlı Kategoriler</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Görünüm Tipi</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Değerler</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 600 }}>Durum</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>İşlemler</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <TableRow key={option.id} hover>
                                    <TableCell>
                                        <Typography variant="body1" fontWeight={500}>{option.name}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: '200px' }}>
                                            {option.categories && option.categories.length > 0 ? (
                                                option.categories.map((cat, idx) => (
                                                    <Chip key={idx} label={cat.name} size="small" color="primary" variant="outlined" />
                                                ))
                                            ) : (
                                                <Typography variant="caption" color="text.secondary">Tümü</Typography>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {getDisplayTypeIcon(option.displayType)}
                                            <Typography variant="body2">{getDisplayTypeName(option.displayType)}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: '400px' }}>
                                            {option.values.slice(0, 5).map(val => (
                                                <Chip
                                                    key={val.id}
                                                    label={val.name}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{
                                                        backgroundColor: option.displayType === 'color' && val.colorCode ? val.colorCode : 'transparent',
                                                        color: option.displayType === 'color' && val.colorCode ? '#fff' : 'inherit',
                                                        textShadow: option.displayType === 'color' && val.colorCode ? '0px 0px 2px rgba(0,0,0,0.8)' : 'none',
                                                        borderColor: option.displayType === 'color' ? 'transparent' : '#e0e0e0'
                                                    }}
                                                />
                                            ))}
                                            {option.values.length > 5 && (
                                                <Chip label={`+${option.values.length - 5}`} size="small" variant="filled" color="default" />
                                            )}
                                            {option.values.length === 0 && (
                                                <Typography variant="caption" color="text.secondary">Değer yok</Typography>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            checked={option.isActive}
                                            onChange={() => toggleStatus(option.id)}
                                            color="success"
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton color="primary" onClick={() => handleOpenModal(option)} size="small">
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => confirmDelete(option.id)} size="small">
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        Aranan kriterlere uygun seçenek bulunamadı.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add/Edit Modal */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingOption ? 'Seçeneği Düzenle' : 'Yeni Seçenek Ekle'}
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={8}>
                            <TextField
                                label="Seçenek Adı (örn: Renk, Beden)"
                                fullWidth
                                value={formData.name || ''}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                variant="outlined"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isActive || false}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        color="success"
                                    />
                                }
                                label="Aktif"
                                sx={{ mt: 1 }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Görünüm Tipi</InputLabel>
                                <Select
                                    value={formData.displayType || 'dropdown'}
                                    onChange={(e) => setFormData({ ...formData, displayType: e.target.value as DisplayType })}
                                    label="Görünüm Tipi"
                                >
                                    <MenuItem value="dropdown">Açılır Liste (Select Box)</MenuItem>
                                    <MenuItem value="radio">Radyo Buton (Radio Button)</MenuItem>
                                    <MenuItem value="color">Renk Paleti (Color Swatch)</MenuItem>
                                    <MenuItem value="text">Sadece Metin (Text Tag)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Bağlı Kategoriler Alanı */}
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, mt: 2 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    Bağlı Kategoriler
                                </Typography>
                                <Button
                                    size="small"
                                    startIcon={<CategoryIcon />}
                                    variant="outlined"
                                    onClick={() => setIsCategoryModalOpen(true)}
                                >
                                    Kategorileri Düzenle
                                </Button>
                            </Box>
                            <Paper variant="outlined" sx={{ p: 2, minHeight: '60px', bgcolor: '#fafafa', display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {formData.categories && formData.categories.length > 0 ? (
                                    formData.categories.map(cat => (
                                        <Chip
                                            key={cat.id}
                                            label={cat.name}
                                            onDelete={() => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    categories: prev.categories?.filter(c => c.id !== cat.id) || []
                                                }));
                                            }}
                                            color="primary"
                                            variant="outlined"
                                        />
                                    ))
                                ) : (
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                        Bu seçenek henüz hiçbir kategoriye bağlanmamış. Tüm kategorilerde geçerli veya pasif durumda olabilir.
                                    </Typography>
                                )}
                            </Paper>
                        </Grid>

                        {/* Değer Ekleme Alanı */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ mb: 1, mt: 2, fontWeight: 600 }}>
                                Seçenek Değerleri
                            </Typography>
                            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fafafa' }}>
                                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                    <TextField
                                        label="Değer Adı (örn: Kırmızı, XL)"
                                        size="small"
                                        value={newValueInput}
                                        onChange={(e) => setNewValueInput(e.target.value)}
                                        onKeyPress={(e) => { if (e.key === 'Enter') addValue(); }}
                                        sx={{ flexGrow: 1 }}
                                    />
                                    {formData.displayType === 'color' && (
                                        <TextField
                                            type="color"
                                            label="Renk"
                                            size="small"
                                            value={newColorCodeInput}
                                            onChange={(e) => setNewColorCodeInput(e.target.value)}
                                            sx={{ width: '80px', p: 0 }}
                                        />
                                    )}
                                    <Button variant="contained" color="secondary" onClick={addValue}>
                                        Ekle
                                    </Button>
                                </Box>

                                {/* Eklenen Değerler Listesi */}
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {formData.values && formData.values.length > 0 ? (
                                        formData.values.map(val => (
                                            <Chip
                                                key={val.id}
                                                label={val.name}
                                                onDelete={() => removeValue(val.id)}
                                                sx={{
                                                    backgroundColor: formData.displayType === 'color' && val.colorCode ? val.colorCode : '#e0e0e0',
                                                    color: formData.displayType === 'color' && val.colorCode ? '#fff' : 'inherit',
                                                    textShadow: formData.displayType === 'color' && val.colorCode ? '0px 0px 2px rgba(0,0,0,0.8)' : 'none',
                                                }}
                                            />
                                        ))
                                    ) : (
                                        <Typography variant="caption" color="text.secondary">
                                            Henüz değer eklenmedi. Müşterilerin seçebilmesi için değer ekleyin.
                                        </Typography>
                                    )}
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={handleCloseModal} color="inherit">
                        İptal
                    </Button>
                    <Button onClick={handleSaveOption} variant="contained" color="primary" disabled={!formData.name}>
                        {editingOption ? 'Güncelle' : 'Kaydet'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                <DialogTitle>Kayıt Silme Onayı</DialogTitle>
                <DialogContent>
                    <Typography>Bu ürün seçeneğini ve ona bağlı olan tüm varyasyonları silmek istediğinize emin misiniz?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)} color="inherit">İptal</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">Sil</Button>
                </DialogActions>
            </Dialog>

            <ProductCategorySelectionModal
                open={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                onSelect={(selectedNames: string[]) => {
                    const newCategories: ReferenceItem[] = selectedNames.map((name: string) => ({
                        id: name.toLowerCase().replace(/\s+/g, '-'),
                        name: name
                    }));
                    setFormData({ ...formData, categories: newCategories });
                }}
            />
        </Box>
    );
};

export default ProductOptionsPage;
