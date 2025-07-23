import React, { useState, MouseEvent, useCallback, useRef } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, IconButton, InputAdornment, Menu, MenuItem, SvgIconProps,
    Typography, Paper, Grid, Card, CardMedia, Chip, Avatar, FormControl, InputLabel, Select
} from '@mui/material';
import { Add, Delete, CloudUpload, Close, Storefront, Language, Web, Description, Image, Business } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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

interface BrandImage {
    id: string;
    file: File;
    preview: string;
    isLogo: boolean;
}

interface AddBrandDialogProps {
    open: boolean;
    onClose: () => void;
    onAddBrand: (brand: { names: { lang: string; name: string }[], website: string, description: string, images: BrandImage[], country: string, foundedYear: string, category: string }) => void;
}

const AddBrandDialog: React.FC<AddBrandDialogProps> = ({ open, onClose, onAddBrand }) => {
    const quillRef = useRef<ReactQuill>(null);
    const [languages, setLanguages] = useState<LanguageEntry[]>([
        { id: 1, lang: 'tr', value: '' },
        { id: 2, lang: 'en', value: '' },
    ]);
    const [website, setWebsite] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState<BrandImage[]>([]);
    const [country, setCountry] = useState('');
    const [foundedYear, setFoundedYear] = useState('');
    const [category, setCategory] = useState('');

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            Array.from(acceptedFiles).forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const newImage: BrandImage = {
                        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                        file,
                        preview: e.target?.result as string,
                        isLogo: images.length === 0
                    };
                    setImages(prev => [...prev, newImage]);
                };
                reader.readAsDataURL(file);
            });
        }
    }, [images.length]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: true,
    });

    const handleRemoveImage = (id: string) => {
        setImages(prev => {
            const filtered = prev.filter(img => img.id !== id);
            // Eğer logo silindiyse, ilk resmi logo yap
            if (filtered.length > 0 && !filtered.some(img => img.isLogo)) {
                filtered[0].isLogo = true;
            }
            return filtered;
        });
    };

    const handleSetLogo = (id: string) => {
        setImages(prev => prev.map(img => ({ ...img, isLogo: img.id === id })));
    };
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [currentLanguageId, setCurrentLanguageId] = useState<null | number>(null);

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

    const handleAdd = () => {
        const brandNames = languages
            .filter(lang => lang.value.trim() !== '')
            .map(lang => ({ lang: lang.lang, name: lang.value.trim() }));
        
        if (brandNames.length > 0) {
            onAddBrand({ 
                names: brandNames, 
                website, 
                description, 
                images, 
                country, 
                foundedYear, 
                category 
            });
            onClose();
            // Reset form
            setLanguages([{ id: 1, lang: 'tr', value: '' }, { id: 2, lang: 'en', value: '' }]);
            setWebsite('');
            setDescription('');
            setImages([]);
            setCountry('');
            setFoundedYear('');
            setCategory('');
        }
    };

    const usedLangs = languages.map(l => l.lang);
    const brandCategories = ['Teknoloji', 'Moda', 'Gıda', 'Otomotiv', 'Sağlık', 'Eğitim', 'Spor', 'Ev & Yaşam', 'Kozmetik', 'Diğer'];
    const countries = ['Türkiye', 'ABD', 'Almanya', 'Fransa', 'İtalya', 'İspanya', 'İngiltere', 'Japonya', 'Çin', 'Güney Kore', 'Diğer'];

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                <Storefront />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Yeni Marka Ekle
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
                                <Business /> Temel Bilgiler
                            </Typography>
                            
                            {/* Marka Adları */}
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Marka Adları</Typography>
                            {languages.map(lang => {
                                const FlagComponent = flagComponents[lang.lang];
                                return (
                                    <Box key={lang.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <IconButton onClick={() => handleRemoveLanguage(lang.id)} color="error" sx={{ mr: 1 }}>
                                            <Delete />
                                        </IconButton>
                                        <TextField
                                            label={`Marka Adı (${lang.lang.toUpperCase()})`}
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

                            {/* Website */}
                            <TextField
                                label="Website"
                                fullWidth
                                variant="outlined"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                sx={{ mb: 2 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Web sx={{ color: '#667eea' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            {/* Ülke ve Kuruluş Yılı */}
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Ülke</InputLabel>
                                        <Select
                                            value={country}
                                            label="Ülke"
                                            onChange={(e) => setCountry(e.target.value)}
                                        >
                                            {countries.map(c => (
                                                <MenuItem key={c} value={c}>{c}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Kuruluş Yılı"
                                        fullWidth
                                        variant="outlined"
                                        type="number"
                                        value={foundedYear}
                                        onChange={(e) => setFoundedYear(e.target.value)}
                                    />
                                </Grid>
                            </Grid>

                            {/* Kategori */}
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Kategori</InputLabel>
                                <Select
                                    value={category}
                                    label="Kategori"
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    {brandCategories.map(cat => (
                                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Açıklama */}
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Description /> Marka Açıklaması
                                </Typography>
                                <ReactQuill ref={quillRef} theme="snow" value={description} onChange={setDescription} />
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Sağ Taraf - Resim Yükleme */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, mb: 2, bgcolor: '#f8f9fa' }}>
                            <Typography variant="h6" sx={{ mb: 2, color: '#667eea', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Image /> Marka Görselleri
                            </Typography>
                            
                            {/* Resim Yükleme Alanı */}
                            <Box sx={{ mb: 2 }}>
                                <Box
                                    {...getRootProps()}
                                    sx={{
                                        p: 3,
                                        textAlign: 'center',
                                        border: '2px dashed #667eea',
                                        bgcolor: '#f0f7ff',
                                        cursor: 'pointer',
                                        borderRadius: 2,
                                        '&:hover': {
                                            bgcolor: '#e3f2fd'
                                        }
                                    }}
                                >
                                    <input {...getInputProps()} />
                                    <CloudUpload sx={{ fontSize: 48, color: '#667eea', mb: 1 }} />
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#667eea' }}>
                                        Resim Yükle
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {isDragActive ? 'Resimleri buraya bırakın...' : 'Tıklayın veya sürükleyip bırakın'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                        Logo, ürün görselleri ve marka materyalleri
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Yüklenen Resimler */}
                            {images.length > 0 && (
                                <Box>
                                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Yüklenen Görseller</Typography>
                                    <Grid container spacing={1}>
                                        {images.map(image => (
                                            <Grid item xs={6} key={image.id}>
                                                <Card sx={{ position: 'relative' }}>
                                                    <CardMedia
                                                        component="img"
                                                        height="120"
                                                        image={image.preview}
                                                        alt="Marka görseli"
                                                        sx={{ objectFit: 'cover' }}
                                                    />
                                                    <Box sx={{
                                                        position: 'absolute',
                                                        top: 4,
                                                        right: 4,
                                                        display: 'flex',
                                                        gap: 0.5
                                                    }}>
                                                        {image.isLogo && (
                                                            <Chip
                                                                label="Logo"
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
                                                    {!image.isLogo && (
                                                        <Box sx={{
                                                            position: 'absolute',
                                                            bottom: 4,
                                                            left: 4
                                                        }}>
                                                            <Button
                                                                size="small"
                                                                variant="contained"
                                                                onClick={() => handleSetLogo(image.id)}
                                                                sx={{ fontSize: '0.7em', py: 0.5 }}
                                                            >
                                                                Logo Yap
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
                    Marka Ekle
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

export default AddBrandDialog;
