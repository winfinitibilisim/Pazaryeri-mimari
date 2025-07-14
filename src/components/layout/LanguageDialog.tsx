import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';


import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  List, 
  ListItem, 
  TextField, 
  InputAdornment,
  Typography
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

interface LanguageDialogProps {
  open: boolean;
  onClose: () => void;
  languages: LanguageOption[];
  selectedLanguage: string;
  searchLanguage: string;
  setSearchLanguage: (search: string) => void;
  handleLanguageSelect: (code: string) => void;
  handleLanguageConfirm: () => void;
  filteredLanguages: LanguageOption[];
}

const LanguageDialog: React.FC<LanguageDialogProps> = ({
  open,
  onClose,
  languages,
  selectedLanguage,
  searchLanguage,
  setSearchLanguage,
  handleLanguageSelect,
  handleLanguageConfirm,
  filteredLanguages,
}) => {
  const { t } = useLanguage();
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography component="div" variant="h6" fontWeight="600">
          {t('general.languageSelection')}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pb: 0 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={t('general.search') || 'Search...'}
          value={searchLanguage}
          onChange={(e) => setSearchLanguage(e.target.value)}
          margin="dense"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="disabled" fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        <List sx={{ maxHeight: 300, overflow: 'auto', pt: 0 }}>
          {filteredLanguages.map((lang) => (
            <ListItem
              key={lang.code}
              button
              onClick={() => handleLanguageSelect(lang.code)}
              selected={selectedLanguage === lang.code}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  }
                }
              }}
            >
              <Typography variant="body1" sx={{ mr: 1 }}>
                {lang.flag}
              </Typography>
              <Typography variant="body2">
                {lang.name}
              </Typography>
            </ListItem>
          ))}
          {filteredLanguages.length === 0 && (
            <ListItem>
              <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                {t('general.noLanguagesFound')}
              </Typography>
            </ListItem>
          )}
        </List>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>{t('general.cancel')}</Button>
        <Button onClick={handleLanguageConfirm} variant="contained">
          {t('general.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LanguageDialog; 