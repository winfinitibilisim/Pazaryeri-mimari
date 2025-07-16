import React, { useState, MouseEvent, useCallback, useRef } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, IconButton, InputAdornment, Menu, MenuItem, SvgIconProps
} from '@mui/material';
import { Add, Delete, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Typography } from '@mui/material';
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

interface AddBrandDialogProps {
    open: boolean;
    onClose: () => void;
    onAddBrand: (brand: { names: { lang: string; name: string }[], website: string, description: string, image: File | null }) => void;
}

const AddBrandDialog: React.FC<AddBrandDialogProps> = ({ open, onClose, onAddBrand }) => {
    const quillRef = useRef<ReactQuill>(null);
    const [languages, setLanguages] = useState<LanguageEntry[]>([
        { id: 1, lang: 'tr', value: '' },
        { id: 2, lang: 'en', value: '' },
    ]);
    const [website, setWebsite] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            setImage(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: false,
    });
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
            onAddBrand({ names: brandNames, website, description, image });
            onClose();
        }
    };

    const usedLangs = languages.map(l => l.lang);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Yeni Marka Ekle</DialogTitle>
            <DialogContent dividers>
                <Box component="form" noValidate autoComplete="off">
                    {languages.map(lang => {
                        const FlagComponent = flagComponents[lang.lang];
                        return (
                            <Box key={lang.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <IconButton onClick={() => handleRemoveLanguage(lang.id)} color="error" sx={{ mr: 1 }}>
                                    <Delete />
                                </IconButton>
                                <TextField
                                    label="Marka Adı *"
                                    fullWidth
                                    variant="outlined"
                                    value={lang.value}
                                    onChange={(e) => handleValueChange(lang.id, e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={(e) => handleOpenLangMenu(e, lang.id)} size="small">
                                                    <FlagComponent sx={{ width: 24, height: 24 }} />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                        );
                    })}
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
                        <IconButton color="primary" onClick={handleAddLanguage} disabled={languages.length >= allLangs.length}>
                            <Add />
                        </IconButton>
                    </Box>
                    <TextField
                        label="Website"
                        fullWidth
                        variant="outlined"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        sx={{ my: 2 }}
                    />
                    <Box sx={{ my: 2 }}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>Açıklama</Typography>
                        <ReactQuill ref={quillRef} theme="snow" value={description} onChange={setDescription} />
                    </Box>
                    <Box sx={{ my: 2 }}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>Marka Logosu</Typography>
                        <Box
                            {...getRootProps()}
                            sx={{
                                border: '2px dashed grey',
                                padding: 2,
                                textAlign: 'center',
                                cursor: 'pointer',
                                backgroundColor: isDragActive ? 'action.hover' : 'transparent',
                            }}
                        >
                            <input {...getInputProps()} />
                            <CloudUploadIcon sx={{ fontSize: 40 }} />
                            <Typography>{isDragActive ? 'Resmi buraya bırakın...' : 'Resmi sürükleyip bırakın veya seçmek için tıklayın'}</Typography>
                        </Box>
                        {image && (
                            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                                <img src={URL.createObjectURL(image)} alt={image.name} style={{ width: '100px', height: 'auto', marginRight: '16px' }} />
                                <Typography>{image.name}</Typography>
                                <IconButton onClick={() => setImage(null)} color="error" sx={{ ml: 'auto' }}>
                                    <Delete />
                                </IconButton>
                            </Box>
                        )}
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: '16px 24px' }}>
                <Button onClick={onClose} color="error" variant="outlined">Vazgeç</Button>
                <Button onClick={handleAdd} variant="contained" color="primary">Ekle</Button>
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
