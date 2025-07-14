import React, { useState, MouseEvent } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, IconButton, InputAdornment, Menu, MenuItem, SvgIconProps
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
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
        const categoryNames = languages
            .filter(lang => lang.value.trim() !== '')
            .map(lang => ({ lang: lang.lang, name: lang.value.trim() }));
        
        if (categoryNames.length > 0) {
            onAddCategory(categoryNames);
            onClose();
        }
    };

    const usedLangs = languages.map(l => l.lang);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{parentCategoryName ? `${parentCategoryName} -> Alt Kategori Ekle` : 'Yeni Kategori Ekle'}</DialogTitle>
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
                                    label="Ad *"
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

export default AddCategoryDialog;
