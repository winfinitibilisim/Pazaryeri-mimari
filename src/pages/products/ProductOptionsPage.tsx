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
    TextFields as TextFieldsIcon
} from '@mui/icons-material';

import { useProductOptions } from '../../contexts/ProductOptionContext';
import PageHeader from '../../components/layout/PageHeader';
import FilterPanel from '../../components/common/FilterPanel';

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
    isActive: boolean;
    isRequired?: boolean;
    hasSizeChart?: boolean;
}

const ProductOptionsPage: React.FC = () => {
    const { options, setOptions } = useProductOptions();
    const [searchTerm, setSearchTerm] = useState('');

    // Modal States
    const [openModal, setOpenModal] = useState(false);
    const [editingOption, setEditingOption] = useState<ProductOption | null>(null);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    // Form States
    const [formData, setFormData] = useState<Partial<ProductOption>>({
        name: '',
        displayType: 'dropdown',
        isActive: true,
        isRequired: false,
        hasSizeChart: false,
        values: []
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
            setFormData({ ...option });
        } else {
            setEditingOption(null);
            setFormData({ name: '', displayType: 'dropdown', isActive: true, isRequired: false, hasSizeChart: false, values: [] });
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
                isRequired: formData.isRequired || false,
                values: formData.values || []
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
            <PageHeader
                title="Ürün Seçenekleri"
                actionButton={
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenModal()}
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
                        Yeni Seçenek Ekle
                    </Button>
                }
            />
            <FilterPanel
                searchTerm={searchTerm}
                onSearchChange={(e) => setSearchTerm(e.target.value)}
                searchPlaceholder="Seçenek Ara..."
            />

            {/* Main Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Seçenek Adı</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Zorunlu</TableCell>
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
                                        <Typography variant="body2" color={option.isRequired ? 'error' : 'text.secondary'}>
                                            {option.isRequired ? 'Evet' : 'Hayır'}
                                        </Typography>
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
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Seçenek Adı (örn: Renk, Beden)"
                                fullWidth
                                value={formData.name || ''}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                variant="outlined"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ display: 'flex', gap: 2 }}>
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
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isRequired || false}
                                        onChange={(e) => setFormData({ ...formData, isRequired: e.target.checked })}
                                        color="primary"
                                    />
                                }
                                label="Zorunlu"
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
                <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
                    <Box sx={{ border: '1px solid #ff9800', borderRadius: 1, px: 2, py: 0.5, display: 'flex', alignItems: 'center' }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.hasSizeChart || false}
                                    onChange={(e) => setFormData({ ...formData, hasSizeChart: e.target.checked })}
                                    color="warning"
                                    size="small"
                                />
                            }
                            label={<Typography variant="caption" fontWeight="bold">Tablo ekle</Typography>}
                            sx={{ m: 0 }}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button onClick={handleCloseModal} sx={{ color: 'text.secondary' }}>İptal</Button>
                        <Button onClick={handleSaveOption} variant="contained" sx={{ bgcolor: '#2a6496', '&:hover': { bgcolor: '#1e4c70' } }}>
                            {editingOption ? 'Güncelle' : 'Kaydet'}
                        </Button>
                    </Box>
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

        </Box>
    );
};

export default ProductOptionsPage;
