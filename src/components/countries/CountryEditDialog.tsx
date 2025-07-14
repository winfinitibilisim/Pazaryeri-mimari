import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Divider
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Country } from '../../types/Country';
import { continentOptions } from '../../data/countriesData';

interface CountryEditDialogProps {
  open: boolean;
  country: Country | null;
  onClose: () => void;
  onSave: (updatedCountry: Country) => void;
}

const CountryEditDialog: React.FC<CountryEditDialogProps> = ({
  open,
  country,
  onClose,
  onSave
}) => {
  const { translations } = useLanguage();
  const [editedCountry, setEditedCountry] = useState<Partial<Country>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (country) {
      setEditedCountry({
        ...country
      });
      setErrors({});
    }
  }, [country, open]);

  const handleChange = (field: keyof Country, value: any) => {
    setEditedCountry(prev => ({
      ...prev,
      [field]: value
    }));

    // Hata kontrolü
    if (field === 'name' && (!value || value.trim() === '')) {
      setErrors(prev => ({ ...prev, name: `${translations.country} ${translations.cannotBeEmpty}` }));
    } else if (field === 'name') {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.name;
        return newErrors;
      });
    }

    if (field === 'code' && (!value || value.trim() === '')) {
      setErrors(prev => ({ ...prev, code: `${translations.countryCode} ${translations.cannotBeEmpty}` }));
    } else if (field === 'code') {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.code;
        return newErrors;
      });
    }
  };

  const handleSave = () => {
    // Tüm gerekli alanların dolu olduğunu kontrol et
    const newErrors: Record<string, string> = {};
    if (!editedCountry.name || editedCountry.name.trim() === '') {
      newErrors.name = `${translations.country} ${translations.cannotBeEmpty}`;
    }
    if (!editedCountry.code || editedCountry.code.trim() === '') {
      newErrors.code = `${translations.countryCode} ${translations.cannotBeEmpty}`;
    }
    if (!editedCountry.capital || editedCountry.capital.trim() === '') {
      newErrors.capital = `${translations.capital} ${translations.cannotBeEmpty}`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (country && editedCountry) {
      onSave({
        ...country,
        ...editedCountry as Country
      });
    }
  };

  if (!country) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="country-edit-dialog-title"
    >
      <DialogTitle id="country-edit-dialog-title" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">{translations.editCountry}</Typography>
        <IconButton aria-label="close" onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            fullWidth
            label={translations.country}
            variant="outlined"
            value={editedCountry.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label={translations.countryCode}
              variant="outlined"
              value={editedCountry.code || ''}
              onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
              error={!!errors.code}
              helperText={errors.code}
              inputProps={{ maxLength: 2 }}
            />
            <TextField
              fullWidth
              label={translations.capital}
              variant="outlined"
              value={editedCountry.capital || ''}
              onChange={(e) => handleChange('capital', e.target.value)}
              error={!!errors.capital}
              helperText={errors.capital}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="continent-select-label">{translations.continent}</InputLabel>
              <Select
                labelId="continent-select-label"
                value={editedCountry.continent || ''}
                label={translations.continent}
                onChange={(e) => handleChange('continent', e.target.value)}
              >
                {continentOptions.filter(option => option.value !== 'all').map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label={translations.population}
              variant="outlined"
              type="number"
              value={editedCountry.population || ''}
              onChange={(e) => handleChange('population', parseInt(e.target.value, 10) || 0)}
            />
          </Box>
          <TextField
            fullWidth
            label={translations.customerCount}
            variant="outlined"
            type="number"
            value={editedCountry.customerCount || ''}
            onChange={(e) => handleChange('customerCount', parseInt(e.target.value, 10) || 0)}
          />
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle2" color="text.secondary">
            {translations.countryEditNote || "Not: Şehir ve ilçe bilgileri bu ekrandan düzenlenemez. Detaylar sayfasından şehir ve ilçe yönetimini yapabilirsiniz."}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {translations.close}
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          {translations.saveChanges}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CountryEditDialog;
