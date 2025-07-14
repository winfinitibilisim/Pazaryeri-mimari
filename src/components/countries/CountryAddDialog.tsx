import React, { useState } from 'react';
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
  Typography
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Country } from '../../types/Country';
import { continentOptions } from '../../data/countriesData';

interface CountryAddDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (newCountry: Omit<Country, 'id'>) => void;
  nextId: number;
}

const CountryAddDialog: React.FC<CountryAddDialogProps> = ({
  open,
  onClose,
  onAdd,
  nextId
}) => {
  const { translations } = useLanguage();
  const [newCountry, setNewCountry] = useState<Partial<Country>>({
    name: '',
    code: '',
    capital: '',
    continent: 'europe',
    population: 0,
    customerCount: 0,
    isActive: true,
    isDefault: false,
    cities: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof Country, value: any) => {
    setNewCountry(prev => ({
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

  const handleAdd = () => {
    // Tüm gerekli alanların dolu olduğunu kontrol et
    const newErrors: Record<string, string> = {};
    if (!newCountry.name || newCountry.name.trim() === '') {
      newErrors.name = `${translations.country} ${translations.cannotBeEmpty}`;
    }
    if (!newCountry.code || newCountry.code.trim() === '') {
      newErrors.code = `${translations.countryCode} ${translations.cannotBeEmpty}`;
    }
    if (!newCountry.capital || newCountry.capital.trim() === '') {
      newErrors.capital = `${translations.capital} ${translations.cannotBeEmpty}`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAdd(newCountry as Omit<Country, 'id'>);
    
    // Dialog'u kapatmadan önce formu temizle
    setNewCountry({
      name: '',
      code: '',
      capital: '',
      continent: 'europe',
      population: 0,
      customerCount: 0,
      isActive: true,
      isDefault: false,
      cities: []
    });
    setErrors({});
  };

  const handleClose = () => {
    // Dialog'u kapatırken formu temizle
    setNewCountry({
      name: '',
      code: '',
      capital: '',
      continent: 'europe',
      population: 0,
      customerCount: 0,
      isActive: true,
      isDefault: false,
      cities: []
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="country-add-dialog-title"
    >
      <DialogTitle id="country-add-dialog-title" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h6" component="div">{translations.addCountry}</Typography>
        <IconButton aria-label="close" onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            fullWidth
            label={translations.country}
            variant="outlined"
            value={newCountry.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label={translations.countryCode}
              variant="outlined"
              value={newCountry.code || ''}
              onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
              error={!!errors.code}
              helperText={errors.code}
              inputProps={{ maxLength: 2 }}
            />
            <TextField
              fullWidth
              label={translations.capital}
              variant="outlined"
              value={newCountry.capital || ''}
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
                value={newCountry.continent || 'europe'}
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
              value={newCountry.population || ''}
              onChange={(e) => handleChange('population', parseInt(e.target.value, 10) || 0)}
            />
          </Box>
          <TextField
            fullWidth
            label={translations.customerCount}
            variant="outlined"
            type="number"
            value={newCountry.customerCount || 0}
            onChange={(e) => handleChange('customerCount', parseInt(e.target.value, 10) || 0)}
          />
          <Typography variant="subtitle2" color="text.secondary">
            {translations.countryAddNote || "Not: Ülke eklendikten sonra şehir ve ilçe eklemek için detaylar sayfasını kullanabilirsiniz."}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          {translations.close}
        </Button>
        <Button onClick={handleAdd} color="primary" variant="contained">
          {translations.add}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CountryAddDialog;
