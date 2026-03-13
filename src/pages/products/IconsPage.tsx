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
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import NatureIcon from '@mui/icons-material/Nature';
import ShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedIcon from '@mui/icons-material/Verified';
import SecurityIcon from '@mui/icons-material/Security';
import FavoriteIcon from '@mui/icons-material/Favorite';
import TrophyIcon from '@mui/icons-material/EmojiEvents';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import BoltIcon from '@mui/icons-material/Bolt';
import RecyclingIcon from '@mui/icons-material/Recycling';
import GlobalIcon from '@mui/icons-material/Public';
import StarIcon from '@mui/icons-material/Star';
import HelpIcon from '@mui/icons-material/HelpOutline';

// --- Icon Mapping System ---
type IconTypeKey = 'nature' | 'shipping' | 'verified' | 'security' | 'favorite' | 'trophy' | 'thumbup' | 'bolt' | 'recycling' | 'global' | 'star';

const IconMap: Record<IconTypeKey, React.ReactElement> = {
    'nature': <NatureIcon />,
    'shipping': <ShippingIcon />,
    'verified': <VerifiedIcon />,
    'security': <SecurityIcon />,
    'favorite': <FavoriteIcon />,
    'trophy': <TrophyIcon />,
    'thumbup': <ThumbUpIcon />,
    'bolt': <BoltIcon />,
    'recycling': <RecyclingIcon />,
    'global': <GlobalIcon />,
    'star': <StarIcon />,
};

const IconNamesMap: Record<IconTypeKey, string> = {
    'nature': 'Yaprak (Doğa / Organik)',
    'shipping': 'Kamyon (Kargo / Teslimat)',
    'verified': 'Rozet (Onaylı / Orijinal)',
    'security': 'Kalkan (Güvenli / Garantili)',
    'favorite': 'Kalp (Favori / Sevilen)',
    'trophy': 'Kupa (Ödüllü / Lider)',
    'thumbup': 'Beğeni (Tavsiye Edilen)',
    'bolt': 'Şimşek (Hızlı / Anında)',
    'recycling': 'Geri Dönüşüm',
    'global': 'Dünya (Uluslararası)',
    'star': 'Yıldız (Popüler / Yüksek Puanlı)'
};

// --- Typings ---
interface ProductIconDef {
    id: string;
    name: string;
    description: string;
    iconType: IconTypeKey;
    isActive: boolean;
}

// --- Mock Data ---
const initialIcons: ProductIconDef[] = [
    { id: 'i1', name: 'Organik Ürün', description: 'Doğal yollarla üretilmiş katkısız ürün.', iconType: 'nature', isActive: true },
    { id: 'i2', name: 'Hızlı Teslimat', description: '24 Saat içinde kargoya verilir.', iconType: 'bolt', isActive: true },
    { id: 'i3', name: 'Yerli Üretim', description: 'Türkiye de üretilmiştir.', iconType: 'verified', isActive: true },
    { id: 'i4', name: '2 Yıl Garanti', description: 'Resmi distribütör garantili.', iconType: 'security', isActive: true },
    { id: 'i5', name: 'Geri Dönüştürülebilir', description: 'Doğa dostu malzemeden üretilmiştir.', iconType: 'recycling', isActive: true },
];

const IconsPage: React.FC = () => {
    const [icons, setIcons] = useState<ProductIconDef[]>(initialIcons);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal States
    const [openModal, setOpenModal] = useState(false);
    const [editingIcon, setEditingIcon] = useState<ProductIconDef | null>(null);

    // Form States
    const [formData, setFormData] = useState<Partial<ProductIconDef>>({
        name: '',
        description: '',
        iconType: 'nature',
        isActive: true
    });

    // Delete Confirmation State
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [iconToDelete, setIconToDelete] = useState<string | null>(null);

    // --- Handlers ---
    const handleOpenModal = (icon?: ProductIconDef) => {
        if (icon) {
            setEditingIcon(icon);
            setFormData({ ...icon });
        } else {
            setEditingIcon(null);
            setFormData({ name: '', description: '', iconType: 'nature', isActive: true });
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setEditingIcon(null);
    };

    const handleSaveIcon = () => {
        if (!formData.name || !formData.iconType) return;

        if (editingIcon) {
            setIcons(prev => prev.map(i => i.id === editingIcon.id ? { ...i, ...formData } as ProductIconDef : i));
        } else {
            const newIcon: ProductIconDef = {
                id: Math.random().toString(36).substr(2, 9),
                name: formData.name || '',
                description: formData.description || '',
                iconType: formData.iconType || 'nature',
                isActive: formData.isActive ?? true,
            };
            setIcons(prev => [...prev, newIcon]);
        }
        handleCloseModal();
    };

    const confirmDelete = (id: string) => {
        setIconToDelete(id);
        setDeleteConfirmOpen(true);
    };

    const handleDelete = () => {
        if (iconToDelete) {
            setIcons(prev => prev.filter(i => i.id !== iconToDelete));
            setDeleteConfirmOpen(false);
            setIconToDelete(null);
        }
    };

    const toggleStatus = (id: string) => {
        setIcons(prev => prev.map(i => i.id === id ? { ...i, isActive: !i.isActive } : i));
    };

    // --- Helpers ---
    const renderIconGraphic = (type: IconTypeKey) => {
        return IconMap[type] || <HelpIcon />;
    };

    // --- Filtering ---
    const filteredIcons = icons.filter(icon =>
        icon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ width: '100%' }}>
            {/* Header & Actions */}
            <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <TextField
                    placeholder="İkonalarda Ara... (Örn: Organik)"
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
                    Yeni Özellik İkonu Ekle
                </Button>
            </Paper>

            {/* Main Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600, width: 80, textAlign: 'center' }}>Grafik</TableCell>
                            <TableCell sx={{ fontWeight: 600, width: 250 }}>İkon Başlığı</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Tüketici Açıklaması (İpucu)</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 600 }}>Durum</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>İşlemler</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredIcons.length > 0 ? (
                            filteredIcons.map((icon) => (
                                <TableRow key={icon.id} hover>
                                    <TableCell align="center">
                                        <Box sx={{
                                            display: 'inline-flex',
                                            p: 1.5,
                                            borderRadius: '50%',
                                            bgcolor: '#f0f4f8',
                                            color: '#2a6496'
                                        }}>
                                            {renderIconGraphic(icon.iconType)}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body1" fontWeight={500} color="primary.main">{icon.name}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {icon.description || '-'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            checked={icon.isActive}
                                            onChange={() => toggleStatus(icon.id)}
                                            color="success"
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton color="primary" onClick={() => handleOpenModal(icon)} size="small">
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => confirmDelete(icon.id)} size="small">
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        Aranan kriterlere uygun özellik ikonu bulunamadı.
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
                    {editingIcon ? 'Özellik İkonunu Düzenle' : 'Yeni Özellik İkonu'}
                </DialogTitle>
                <Typography variant="caption" sx={{ px: 3, display: 'block', color: 'text.secondary', mb: 1 }}>
                    Ürün sayfasında alt alta özellik bildiren güven ikonlarını buradan listeleyebilirsiniz.
                </Typography>
                <DialogContent dividers>
                    <Grid container spacing={3}>
                        {/* Visual Icon Selection */}
                        <Grid item xs={12}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>İkon Seçimi (Görsel Sembol)</InputLabel>
                                <Select
                                    value={formData.iconType || 'nature'}
                                    onChange={(e) => setFormData({ ...formData, iconType: e.target.value as IconTypeKey })}
                                    label="İkon Seçimi (Görsel Sembol)"
                                    renderValue={(selected) => {
                                        const type = selected as IconTypeKey;
                                        return (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {renderIconGraphic(type)}
                                                {IconNamesMap[type]}
                                            </Box>
                                        );
                                    }}
                                >
                                    {(Object.keys(IconMap) as IconTypeKey[]).map(key => (
                                        <MenuItem key={key} value={key}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Box sx={{ color: 'text.secondary', display: 'flex' }}>
                                                    {renderIconGraphic(key)}
                                                </Box>
                                                {IconNamesMap[key]}
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Icon Name */}
                        <Grid item xs={12} sm={8}>
                            <TextField
                                label="Başlık (örn: Yüzde 100 Doğal)"
                                fullWidth
                                value={formData.name || ''}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                variant="outlined"
                                required
                            />
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
                                label="Aktif"
                            />
                        </Grid>

                        {/* Description */}
                        <Grid item xs={12}>
                            <TextField
                                label="Detaylı Açıklama (Tüketici İpucu - Opsiyonel)"
                                fullWidth
                                multiline
                                rows={2}
                                value={formData.description || ''}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                variant="outlined"
                                helperText="Fare ile ikonun üzerine gelindiğinde görünecek metindir."
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={handleCloseModal} color="inherit">
                        İptal
                    </Button>
                    <Button onClick={handleSaveIcon} variant="contained" color="primary" disabled={!formData.name || !formData.iconType}>
                        {editingIcon ? 'Güncelle' : 'Oluştur'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                <DialogTitle>İkon Silme Onayı</DialogTitle>
                <DialogContent>
                    <Typography>Bu özelliği sistemden silmek istediğinize emin misiniz? Silinirse, buna sahip ürünlerin sayfasından görsel kaldırılacaktır.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)} color="inherit">İptal</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">Sil</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default IconsPage;
