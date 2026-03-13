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
    LocalOffer as LocalOfferIcon
} from '@mui/icons-material';

// --- Typings ---
type TagColorTheme = 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';

interface ProductTag {
    id: string;
    name: string;
    colorTheme: TagColorTheme;
    isActive: boolean;
}

// --- Mock Data ---
const initialTags: ProductTag[] = [
    { id: 't1', name: 'YENİ', colorTheme: 'success', isActive: true },
    { id: 't2', name: 'ÇOK SATAN', colorTheme: 'warning', isActive: true },
    { id: 't3', name: 'KARGO BEDAVA', colorTheme: 'info', isActive: true },
    { id: 't4', name: 'KAMPANYA', colorTheme: 'primary', isActive: true },
    { id: 't5', name: 'TÜKENDİ', colorTheme: 'default', isActive: true },
    { id: 't6', name: 'SADECE MAĞAZADA', colorTheme: 'secondary', isActive: false },
    { id: 't7', name: 'İNDİRİM (%50)', colorTheme: 'error', isActive: true },
];

const AvailableTagsPage: React.FC = () => {
    const [tags, setTags] = useState<ProductTag[]>(initialTags);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal States
    const [openModal, setOpenModal] = useState(false);
    const [editingTag, setEditingTag] = useState<ProductTag | null>(null);

    // Form States
    const [formData, setFormData] = useState<Partial<ProductTag>>({
        name: '',
        colorTheme: 'default',
        isActive: true
    });

    // Delete Confirmation State
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [tagToDelete, setTagToDelete] = useState<string | null>(null);

    // --- Handlers ---
    const handleOpenModal = (tag?: ProductTag) => {
        if (tag) {
            setEditingTag(tag);
            setFormData({ ...tag });
        } else {
            setEditingTag(null);
            setFormData({ name: '', colorTheme: 'default', isActive: true });
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setEditingTag(null);
    };

    const handleSaveTag = () => {
        if (!formData.name) return; // Basic validation

        if (editingTag) {
            setTags(prev => prev.map(t => t.id === editingTag.id ? { ...t, ...formData } as ProductTag : t));
        } else {
            const newTag: ProductTag = {
                id: Math.random().toString(36).substr(2, 9),
                name: formData.name || '',
                colorTheme: formData.colorTheme || 'default',
                isActive: formData.isActive ?? true,
            };
            setTags(prev => [...prev, newTag]);
        }
        handleCloseModal();
    };

    const confirmDelete = (id: string) => {
        setTagToDelete(id);
        setDeleteConfirmOpen(true);
    };

    const handleDelete = () => {
        if (tagToDelete) {
            setTags(prev => prev.filter(t => t.id !== tagToDelete));
            setDeleteConfirmOpen(false);
            setTagToDelete(null);
        }
    };

    const toggleStatus = (id: string) => {
        setTags(prev => prev.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t));
    };

    // --- Filtering ---
    const filteredTags = tags.filter(tag =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ width: '100%' }}>
            {/* Header & Actions */}
            <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <TextField
                    placeholder="Etiket Ara... (Örn: ÇOK SATAN)"
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
                    Yeni Etiket (Badge) Ekle
                </Button>
            </Paper>

            {/* Main Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Etiket / Rozet Adı</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Tema Rengi</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Görünüm (Önizleme)</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 600 }}>Durum</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>İşlemler</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredTags.length > 0 ? (
                            filteredTags.map((tag) => (
                                <TableRow key={tag.id} hover>
                                    <TableCell>
                                        <Typography variant="body1" fontWeight={500}>{tag.name}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                                            {tag.colorTheme}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            icon={<LocalOfferIcon fontSize="small" />}
                                            label={tag.name}
                                            color={tag.colorTheme}
                                            variant="filled"
                                            size="small"
                                            sx={{ fontWeight: 'bold', borderRadius: '4px' }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            checked={tag.isActive}
                                            onChange={() => toggleStatus(tag.id)}
                                            color="success"
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton color="primary" onClick={() => handleOpenModal(tag)} size="small">
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => confirmDelete(tag.id)} size="small">
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        Aranan kriterlere uygun etiket bulunamadı.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add/Edit Modal */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ pb: 1 }}>
                    {editingTag ? 'Etiketi Düzenle' : 'Yeni Ürün Etiketi Ekle'}
                </DialogTitle>
                <Typography variant="caption" sx={{ px: 3, display: 'block', color: 'text.secondary', mb: 1 }}>
                    Ürünlerin köselerinde yer alacak promosyon ve bilgilendirme rozetlerini (badge) ayarlayın.
                </Typography>
                <DialogContent dividers>
                    <Grid container spacing={3}>
                        {/* Tag Name */}
                        <Grid item xs={12}>
                            <TextField
                                label="Etiket Metni (örn: ÇOK SATAN, %50 İNDİRİM)"
                                fullWidth
                                value={formData.name || ''}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
                                variant="outlined"
                                helperText="Dikkat çekmesi için büyük harf tavsiye edilir."
                                required
                            />
                        </Grid>

                        {/* Color Theme */}
                        <Grid item xs={12} sm={8}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Tema Rengi (Arka Plan)</InputLabel>
                                <Select
                                    value={formData.colorTheme || 'default'}
                                    onChange={(e) => setFormData({ ...formData, colorTheme: e.target.value as TagColorTheme })}
                                    label="Tema Rengi (Arka Plan)"
                                >
                                    <MenuItem value="default">Gri (Default)</MenuItem>
                                    <MenuItem value="primary">Mavi (Primary)</MenuItem>
                                    <MenuItem value="secondary">Mor (Secondary)</MenuItem>
                                    <MenuItem value="success">Yeşil (Success)</MenuItem>
                                    <MenuItem value="warning">Turuncu (Warning)</MenuItem>
                                    <MenuItem value="error">Kırmızı (Error - İndirimler için)</MenuItem>
                                    <MenuItem value="info">Açık Mavi (Info)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Status */}
                        <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'center' }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isActive ?? true}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        color="success"
                                    />
                                }
                                label="Aktif Etiket"
                            />
                        </Grid>

                        {/* Live Preview Area */}
                        <Grid item xs={12}>
                            <Paper variant="outlined" sx={{ p: 3, bgcolor: '#fafafa', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Canlı Önizleme (Müşterilerin Göreceği)
                                </Typography>

                                {formData.name ? (
                                    <Chip
                                        icon={<LocalOfferIcon fontSize="small" />}
                                        label={formData.name}
                                        color={formData.colorTheme || 'default'}
                                        variant="filled"
                                        sx={{ fontWeight: 'bold', borderRadius: '4px', fontSize: '1rem', p: 1 }}
                                    />
                                ) : (
                                    <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                                        Metin girilmesini bekliyor...
                                    </Typography>
                                )}

                            </Paper>
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={handleCloseModal} color="inherit">
                        İptal
                    </Button>
                    <Button onClick={handleSaveTag} variant="contained" color="primary" disabled={!formData.name}>
                        {editingTag ? 'Güncelle' : 'Oluştur'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                <DialogTitle>Kayıt Silme Onayı</DialogTitle>
                <DialogContent>
                    <Typography>Bu etiketi sistemden tamamen silmek istediğinize emin misiniz? Bu etiket ürünlerin üzerinden kalkacaktır.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)} color="inherit">İptal</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">Sil</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AvailableTagsPage;
