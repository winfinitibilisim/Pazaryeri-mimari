import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  ButtonBase
} from '@mui/material';
import {
  Language as LanguageIcon,
  Search as SearchIcon
} from '@mui/icons-material';

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
  nativeName?: string; // Dilin kendi dilindeki adı
}

interface LanguageSelectorProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (languageCode: string) => void;
  currentLanguage: string;
}

/**
 * Dil seçimi için kullanılan dialog bileşeni
 */
const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  open,
  onClose,
  onConfirm,
  currentLanguage
}) => {
  const { translations } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  const [searchLanguage, setSearchLanguage] = useState('');
  
  // Supported languages list
  const languages: LanguageOption[] = [
    { code: 'tr', name: 'Türkçe', nativeName: 'Türkçe', flag: '🇹🇷' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' }
  ];

  // Filter languages based on search input
  const filteredLanguages = languages.filter(lang => 
    lang.name.toLowerCase().includes(searchLanguage.toLowerCase()) ||
    (lang.nativeName && lang.nativeName.toLowerCase().includes(searchLanguage.toLowerCase()))
  );

  const handleLanguageSelect = (code: string) => {
    setSelectedLanguage(code);
  };

  const handleConfirm = () => {
    onConfirm(selectedLanguage);
    setSearchLanguage('');
  };

  const handleClose = () => {
    onClose();
    setSearchLanguage('');
    setSelectedLanguage(currentLanguage); // Return to previously selected language when canceled
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      PaperProps={{
        sx: { 
          width: '100%', 
          maxWidth: 350,
          borderRadius: 2,
          p: 1
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        p: 2
      }}>
        <LanguageIcon sx={{ fontSize: 40, color: '#555', mb: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
          {translations.languageSelection}
        </Typography>
      </Box>
      
      <DialogContent sx={{ p: 1 }}>
        <TextField
          placeholder={translations.searchLanguage}
          fullWidth
          value={searchLanguage}
          onChange={(e) => setSearchLanguage(e.target.value)}
          variant="outlined"
          sx={{ 
            mb: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: '#f0f4f8',
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        
        <Box sx={{ 
          mt: 2, 
          maxHeight: 300, 
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#ccc',
            borderRadius: '3px',
          }
        }}>
          {filteredLanguages.map((lang) => (
            <ButtonBase
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                textAlign: 'left',
                p: 1.5,
                borderRadius: 1,
                backgroundColor: selectedLanguage === lang.code ? '#f0f4f8' : 'transparent',
                '&:hover': { backgroundColor: '#f5f5f5' },
                '&:active': { backgroundColor: 'rgba(255, 23, 68, 0.15)' },
                mb: 0.5
              }}
            >
              <Box 
                component="span"
                sx={{ 
                  display: 'inline-block', 
                  width: 30, 
                  height: 20, 
                  textAlign: 'center',
                  mr: 2,
                  fontSize: '1.2rem'
                }}
              >
                {lang.code === 'tr' && (
                  <Box 
                    component="img"
                    src="https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg"
                    alt="Turkey flag"
                    sx={{ width: 30, height: 20, objectFit: 'cover' }}
                  />
                )}
                {lang.code === 'ar' && (
                  <Box 
                    component="img"
                    src="https://upload.wikimedia.org/wikipedia/commons/0/0d/Flag_of_Saudi_Arabia.svg"
                    alt="Saudi Arabia flag"
                    sx={{ width: 30, height: 20, objectFit: 'cover' }}
                  />
                )}
                {!['tr', 'ar'].includes(lang.code) && lang.flag}
              </Box>
              <Typography>{lang.name}</Typography>
            </ButtonBase>
          ))}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ justifyContent: 'space-between', px: 2, py: 1.5 }}>
        <Button 
          onClick={handleClose}
          variant="text"
          sx={{ 
            color: '#1976d2',
            fontWeight: 500,
            '&:active': { color: '#ff1744' }
          }}
        >
          {translations.close}
        </Button>
        <Button 
          onClick={handleConfirm}
          variant="text"
          sx={{ 
            color: '#1976d2',
            fontWeight: 500,
            '&:active': { color: '#ff1744' }
          }}
        >
          {translations.confirm}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LanguageSelector; 