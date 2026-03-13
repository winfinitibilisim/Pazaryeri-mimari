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
    ViewList as ViewListIcon,
    RadioButtonChecked as RadioButtonCheckedIcon,
    TextFields as TextFieldsIcon,
    Checklist as ChecklistIcon
} from '@mui/icons-material';

// Typings
type FeatureDisplayType = 'single' | 'multiple' | 'text';

interface FeatureValue {
    id: string;
    name: string;
}

interface ProductFeature {
    id: string;
    name: string;
    displayType: FeatureDisplayType;
    values: FeatureValue[];
    isActive: boolean;
}

// Mock Data
const initialFeatures: ProductFeature[] = [
    {
        id: 'f2',
        name: 'Enerji Sınıfı',
        displayType: 'single',
        isActive: true,
        values: [
            { id: 'v5', name: 'A+++' },
            { id: 'v6', name: 'A++' },
            { id: 'v7', name: 'A+' },
            { id: 'v8', name: 'A' },
            { id: 'v9', name: 'B' }
        ]
    },
    {
        id: 'f4',
        name: 'Kumaş Tipi',
        displayType: 'multiple',
        isActive: false,
        values: [
            { id: 'v14', name: 'Pamuk' },
            { id: 'v15', name: 'Polyester' },
            { id: 'v16', name: 'Elastan' },
            { id: 'v17', name: 'Viskon' }
        ]
    },
    {
        id: 'f5',
        name: 'Garanti Süresi',
        displayType: 'text',
        isActive: true,
        values: [
            { id: 'v18', name: '1 Yıl' },
            { id: 'v19', name: '2 Yıl' },
            { id: 'v20', name: '3 Yıl' }
        ]
    }
];

const FeaturesPage: React.FC = () => {
    const [features, setFeatures] = useState<ProductFeature[]>(initialFeatures);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal States
    const [openModal, setOpenModal] = useState(false);
    const [editingFeature, setEditingFeature] = useState<ProductFeature | null>(null);

    // Form States
    const [formData, setFormData] = useState<Partial<ProductFeature>>({
        name: '',
        displayType: 'single',
        isActive: true,
        values: []
    });
    const [newValueInput, setNewValueInput] = useState('');

    // Delete Confirmation State
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [featureToDelete, setFeatureToDelete] = useState<string | null>(null);

    // Handlers
    const handleOpenModal = (feature?: ProductFeature) => {
        if (feature) {
            setEditingFeature(feature);
            setFormData({ ...feature });
        } else {
            setEditingFeature(null);
            setFormData({ name: '', displayType: 'single', isActive: true, values: [] });
        }
        setNewValueInput('');
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setEditingFeature(null);
    };

    const handleSaveFeature = () => {
        if (!formData.name) return; // Basic validation

        if (editingFeature) {
            setFeatures(prev => prev.map(f => f.id === editingFeature.id ? { ...f, ...formData } as ProductFeature : f));
        } else {
            const newFeature: ProductFeature = {
                id: Math.random().toString(36).substr(2, 9),
                name: formData.name || '',
                displayType: formData.displayType || 'single',
                isActive: formData.isActive || false,
                values: formData.values || []
            };
            setFeatures(prev => [...prev, newFeature]);
        }
        handleCloseModal();
    };

    const confirmDelete = (id: string) => {
        setFeatureToDelete(id);
        setDeleteConfirmOpen(true);
    };

    const handleDelete = () => {
        if (featureToDelete) {
            setFeatures(prev => prev.filter(f => f.id !== featureToDelete));
            setDeleteConfirmOpen(false);
            setFeatureToDelete(null);
        }
    };

    const toggleStatus = (id: string) => {
        setFeatures(prev => prev.map(f => f.id === id ? { ...f, isActive: !f.isActive } : f));
    };

    // Feature Value Management (Inside Modal)
    const addValue = () => {
        if (!newValueInput.trim()) return;

        const newVal: FeatureValue = {
            id: Math.random().toString(36).substr(2, 9),
            name: newValueInput.trim(),
        };

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
    const getDisplayTypeIcon = (type: FeatureDisplayType) => {
        switch (type) {
            case 'single': return <RadioButtonCheckedIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />;
            case 'multiple': return <ChecklistIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />;
            case 'text': return <TextFieldsIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />;
            default: return null;
        }
    };

    const getDisplayTypeName = (type: FeatureDisplayType) => {
        switch (type) {
            case 'single': return 'Tekli Seçim';
            case 'multiple': return 'Çoklu Seçim';
            case 'text': return 'Serbest Metin';
            default: return type;
        }
    };

    // Filtering
    const filteredFeatures = features.filter(feat =>
        feat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ width: '100%' }}>
            {/* Header & Actions */}
            <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <TextField
                    placeholder="Özellik Ara... (Örn: RAM)"
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
                    Yeni Özellik Ekle
                </Button>
            </Paper>

            {/* Main Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Özellik Adı</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Seçim Tipi</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Değerler</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 600 }}>Durum</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>İşlemler</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredFeatures.length > 0 ? (
                            filteredFeatures.map((feature) => (
                                <TableRow key={feature.id} hover>
                                    <TableCell>
                                        <Typography variant="body1" fontWeight={500}>{feature.name}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {getDisplayTypeIcon(feature.displayType)}
                                            <Typography variant="body2">{getDisplayTypeName(feature.displayType)}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: '400px' }}>
                                            {feature.values.slice(0, 5).map(val => (
                                                <Chip
                                                    key={val.id}
                                                    label={val.name}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ borderColor: '#e0e0e0' }}
                                                />
                                            ))}
                                            {feature.values.length > 5 && (
                                                <Chip label={`+${feature.values.length - 5}`} size="small" variant="filled" color="default" />
                                            )}
                                            {feature.values.length === 0 && (
                                                <Typography variant="caption" color="text.secondary">Serbest / Değer yok</Typography>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            checked={feature.isActive}
                                            onChange={() => toggleStatus(feature.id)}
                                            color="success"
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton color="primary" onClick={() => handleOpenModal(feature)} size="small">
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => confirmDelete(feature.id)} size="small">
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        Aranan kriterlere uygun özellik bulunamadı.
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
                    {editingFeature ? 'Özelliği Düzenle' : 'Yeni Özellik Ekle'}
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={8}>
                            <TextField
                                label="Özellik Adı (örn: RAM, Kumaş Tipi)"
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
                                <InputLabel>Seçim Tipi</InputLabel>
                                <Select
                                    value={formData.displayType || 'single'}
                                    onChange={(e) => setFormData({ ...formData, displayType: e.target.value as FeatureDisplayType })}
                                    label="Seçim Tipi"
                                >
                                    <MenuItem value="single">Tekli Seçim (Sadece bir değer seçilebilir)</MenuItem>
                                    <MenuItem value="multiple">Çoklu Seçim (Birden fazla değer seçilebilir)</MenuItem>
                                    <MenuItem value="text">Serbest Metin Kutusuna Yazma</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Ön Tanımlı Değer Ekleme Alanı */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ mb: 1, mt: 2, fontWeight: 600 }}>
                                Ön Tanımlı Değerler
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block', mb: 2, color: 'text.secondary' }}>
                                Müşterilerin filtreleme yapabilmesi için özelliği standardize eden liste değerleri ekleyin.
                            </Typography>
                            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fafafa' }}>
                                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                    <TextField
                                        label="Değer (örn: 8 GB, Pamuk)"
                                        size="small"
                                        value={newValueInput}
                                        onChange={(e) => setNewValueInput(e.target.value)}
                                        onKeyPress={(e) => { if (e.key === 'Enter') addValue(); }}
                                        sx={{ flexGrow: 1 }}
                                    />
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
                                                sx={{ backgroundColor: '#e0e0e0' }}
                                            />
                                        ))
                                    ) : (
                                        <Typography variant="caption" color="text.secondary">
                                            Henüz değer eklenmedi.
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
                    <Button onClick={handleSaveFeature} variant="contained" color="primary" disabled={!formData.name}>
                        {editingFeature ? 'Güncelle' : 'Kaydet'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                <DialogTitle>Kayıt Silme Onayı</DialogTitle>
                <DialogContent>
                    <Typography>Bu özelliği ve ona bağlı olan tüm atamaları silmek istediğinize emin misiniz?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)} color="inherit">İptal</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">Sil</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default FeaturesPage;
