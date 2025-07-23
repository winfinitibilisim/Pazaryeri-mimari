import React, { useState, MouseEvent } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, IconButton, InputAdornment, Menu, MenuItem, SvgIconProps,
    Typography, Paper, Avatar, Grid, Card, CardContent, CardMedia, Chip, FormControl, InputLabel, Select
} from '@mui/material';
import { Add, Delete, PhotoCamera, Category, Close, CloudUpload, Image } from '@mui/icons-material';
import TurkeyFlag from './icons/TurkeyFlag';
import UKFlag from './icons/UKFlag';
import GermanFlag from './icons/GermanFlag';
import SpanishFlag from './icons/SpanishFlag';

type SupportedLangs = 'tr' | 'en' | 'de' | 'es';

const flagComponents: Record<SupportedLangs, React.FC<SvgIconProps>> = {
    tr: TurkeyFlag,
    en: UKFlag,
    de: GermanFlag,
    es: SpanishFlag,
};

const allLangs = Object.keys(flagComponents) as SupportedLangs[];

interface LanguageEntry {
    id: number;
    lang: SupportedLangs;
    value: string;
}

interface CategoryImage {
    id: string;
    file: File;
    preview: string;
    isMain: boolean;
}

interface AddCategoryDialogProps {
    open: boolean;
    onClose: () => void;
    onAddCategory: (names: { lang: string; name: string }[]) => void;
    parentCategoryName?: string | null;
}

const AddCategoryDialog: React.FC<AddCategoryDialogProps> = ({ open, onClose, onAddCategory, parentCategoryName }) => {
    const [languages, setLanguages] = useState<LanguageEntry[]>([
        { id: 1, lang: 'tr', value: '' },
        { id: 2, lang: 'en', value: '' },
    ]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [currentLanguageId, setCurrentLanguageId] = useState<null | number>(null);
    const [images, setImages] = useState<CategoryImage[]>([]);
    const [description, setDescription] = useState<string>('');
    const [categoryIcon, setCategoryIcon] = useState<string>('📁');
    const [sortOrder, setSortOrder] = useState<number>(0);
    const [isActive, setIsActive] = useState<boolean>(true);

    const handleValueChange = (id: number, newValue: string) => {
        setLanguages(prev => prev.map(lang => lang.id === id ? { ...lang, value: newValue } : lang));
    };

    const handleAddLanguage = () => {
        const usedLangs = languages.map(l => l.lang);
        const nextLang = allLangs.find(l => !usedLangs.includes(l));
        if (nextLang) {
            setLanguages(prev => [...prev, { id: Date.now(), lang: nextLang, value: '' }]);
        }
    };

    const handleRemoveLanguage = (id: number) => {
        setLanguages(prev => prev.length > 1 ? prev.filter(lang => lang.id !== id) : prev);
    };

    const handleOpenLangMenu = (event: MouseEvent<HTMLElement>, id: number) => {
        setAnchorEl(event.currentTarget);
        setCurrentLanguageId(id);
    };

    const handleCloseLangMenu = () => {
        setAnchorEl(null);
        setCurrentLanguageId(null);
    };

    const handleLangChange = (newLang: SupportedLangs) => {
        if (currentLanguageId !== null) {
            setLanguages(prev => prev.map(lang => lang.id === currentLanguageId ? { ...lang, lang: newLang } : lang));
        }
        handleCloseLangMenu();
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const newImage: CategoryImage = {
                        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                        file,
                        preview: e.target?.result as string,
                        isMain: images.length === 0
                    };
                    setImages(prev => [...prev, newImage]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleRemoveImage = (id: string) => {
        setImages(prev => {
            const filtered = prev.filter(img => img.id !== id);
            // Eğer ana resim silindiyse, ilk resmi ana yap
            if (filtered.length > 0 && !filtered.some(img => img.isMain)) {
                filtered[0].isMain = true;
            }
            return filtered;
        });
    };

    const handleSetMainImage = (id: string) => {
        setImages(prev => prev.map(img => ({ ...img, isMain: img.id === id })));
    };

    const handleAdd = () => {
        const categoryNames = languages
            .filter(lang => lang.value.trim() !== '')
            .map(lang => ({ lang: lang.lang, name: lang.value.trim() }));
        
        if (categoryNames.length > 0) {
            const categoryData = {
                names: categoryNames,
                description,
                icon: categoryIcon,
                images,
                sortOrder,
                isActive
            };
            onAddCategory(categoryData as any);
            onClose();
            // Reset form
            setLanguages([{ id: 1, lang: 'tr', value: '' }, { id: 2, lang: 'en', value: '' }]);
            setImages([]);
            setDescription('');
            setCategoryIcon('📁');
            setSortOrder(0);
            setIsActive(true);
        }
    };

    const usedLangs = languages.map(l => l.lang);
    const categoryIcons = ['📁', '📱', '👕', '🏠', '⚽', '📚', '🧸', '💄', '🚗', '🍽️', '🎮', '🎨', '💼', '🎁'];

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                <Category />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {parentCategoryName ? `${parentCategoryName} -> Alt Kategori Ekle` : 'Yeni Kategori Ekle'}
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ color: 'white' }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            
            <DialogContent dividers sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    {/* Sol Taraf - Temel Bilgiler */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, mb: 2, bgcolor: '#f8f9fa' }}>
                            <Typography variant="h6" sx={{ mb: 2, color: '#667eea', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Category /> Temel Bilgiler
                            </Typography>
                            
                            {/* Kategori İkonu */}
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Kategori İkonu</Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {categoryIcons.map(icon => (
                                        <IconButton
                                            key={icon}
                                            onClick={() => setCategoryIcon(icon)}
                                            sx={{
                                                border: categoryIcon === icon ? '2px solid #667eea' : '1px solid #ddd',
                                                bgcolor: categoryIcon === icon ? '#f0f7ff' : 'white',
                                                fontSize: '1.5em'
                                            }}
                                        >
                                            {icon}
                                        </IconButton>
                                    ))}
                                </Box>
                            </Box>

                            {/* Dil Seçenekleri */}
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Kategori Adları</Typography>
                            {languages.map(lang => {
                                const FlagComponent = flagComponents[lang.lang];
                                return (
                                    <Box key={lang.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <IconButton onClick={() => handleRemoveLanguage(lang.id)} color="error" sx={{ mr: 1 }}>
                                            <Delete />
                                        </IconButton>
                                        <TextField
                                            label={`Kategori Adı (${lang.lang.toUpperCase()})`}
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={lang.value}
                                            onChange={(e) => handleValueChange(lang.id, e.target.value)}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={(e) => handleOpenLangMenu(e, lang.id)} size="small">
                                                            <FlagComponent sx={{ width: 20, height: 20 }} />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Box>
                                );
                            })}
                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
                                <Button
                                    startIcon={<Add />}
                                    onClick={handleAddLanguage}
                                    disabled={languages.length >= allLangs.length}
                                    variant="outlined"
                                    size="small"
                                >
                                    Dil Ekle
                                </Button>
                            </Box>

                            {/* Açıklama */}
                            <TextField
                                label="Kategori Açıklaması"
                                fullWidth
                                multiline
                                rows={3}
                                variant="outlined"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                sx={{ mt: 2 }}
                            />
                        </Paper>
                    </Grid>

                    {/* Sağ Taraf - Resim Yükleme */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, mb: 2, bgcolor: '#f8f9fa' }}>
                            <Typography variant="h6" sx={{ mb: 2, color: '#667eea', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Image /> Kategori Resimleri
                            </Typography>
                            
                            {/* Resim Yükleme Alanı */}
                            <Box sx={{ mb: 2 }}>
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="category-image-upload"
                                    multiple
                                    type="file"
                                    onChange={handleImageUpload}
                                />
                                <label htmlFor="category-image-upload">
                                    <Paper
                                        sx={{
                                            p: 3,
                                            textAlign: 'center',
                                            border: '2px dashed #667eea',
                                            bgcolor: '#f0f7ff',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                bgcolor: '#e3f2fd'
                                            }
                                        }}
                                    >
                                        <CloudUpload sx={{ fontSize: 48, color: '#667eea', mb: 1 }} />
                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#667eea' }}>
                                            Resim Yükle
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Tıklayın veya sürükleyip bırakın
                                        </Typography>
                                    </Paper>
                                </label>
                            </Box>

                            {/* Yüklenen Resimler */}
                            {images.length > 0 && (
                                <Box>
                                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Yüklenen Resimler</Typography>
                                    <Grid container spacing={1}>
                                        {images.map(image => (
                                            <Grid item xs={6} key={image.id}>
                                                <Card sx={{ position: 'relative' }}>
                                                    <CardMedia
                                                        component="img"
                                                        height="100"
                                                        image={image.preview}
                                                        alt="Kategori resmi"
                                                        sx={{ objectFit: 'cover' }}
                                                    />
                                                    <Box sx={{
                                                        position: 'absolute',
                                                        top: 4,
                                                        right: 4,
                                                        display: 'flex',
                                                        gap: 0.5
                                                    }}>
                                                        {image.isMain && (
                                                            <Chip
                                                                label="Ana"
                                                                size="small"
                                                                color="primary"
                                                                sx={{ fontSize: '0.7em' }}
                                                            />
                                                        )}
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleRemoveImage(image.id)}
                                                            sx={{
                                                                bgcolor: 'rgba(255,255,255,0.8)',
                                                                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                                                            }}
                                                        >
                                                            <Close sx={{ fontSize: 16 }} />
                                                        </IconButton>
                                                    </Box>
                                                    {!image.isMain && (
                                                        <Box sx={{
                                                            position: 'absolute',
                                                            bottom: 4,
                                                            left: 4
                                                        }}>
                                                            <Button
                                                                size="small"
                                                                variant="contained"
                                                                onClick={() => handleSetMainImage(image.id)}
                                                                sx={{ fontSize: '0.7em', py: 0.5 }}
                                                            >
                                                                Ana Yap
                                                            </Button>
                                                        </Box>
                                                    )}
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </DialogContent>
            
            <DialogActions sx={{ p: 2, bgcolor: '#f8f9fa', borderTop: '1px solid #e0e0e0' }}>
                <Button onClick={onClose} color="error" variant="outlined">
                    Vazgeç
                </Button>
                <Button 
                    onClick={handleAdd} 
                    variant="contained" 
                    sx={{
                        bgcolor: '#667eea',
                        '&:hover': {
                            bgcolor: '#5a6fd8'
                        }
                    }}
                    startIcon={<Add />}
                >
                    Kategori Ekle
                </Button>
            </DialogActions>
            
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseLangMenu}
            >
                {allLangs.filter(l => !usedLangs.includes(l)).map(langCode => {
                     const FlagComponent = flagComponents[langCode];
                     return (
                        <MenuItem key={langCode} onClick={() => handleLangChange(langCode)}>
                            <FlagComponent sx={{ width: 20, height: 20, mr: 1 }} /> {langCode.toUpperCase()}
                        </MenuItem>
                     );
                })}
            </Menu>
        </Dialog>
    );
};

export default AddCategoryDialog;
