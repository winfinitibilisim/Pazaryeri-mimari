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
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { Close as CloseIcon, AddCircle as AddIcon } from '@mui/icons-material';
import { City, Country } from '../../types/Country';

interface CityAddDialogProps {
  open: boolean;
  countries: Country[];
  selectedCountryId: number;
  onClose: () => void;
  onAdd: (newCity: Omit<City, 'id'>, countryId: number) => void;
}

const CityAddDialog: React.FC<CityAddDialogProps> = ({
  open,
  countries,
  selectedCountryId,
  onClose,
  onAdd
}) => {
  const { translations } = useLanguage();
  const [name, setName] = useState('');
  const [population, setPopulation] = useState('');
  const [countryId, setCountryId] = useState(selectedCountryId);
  const [errors, setErrors] = useState<{ name?: string; population?: string }>({});

  const resetForm = () => {
    setName('');
    setPopulation('');
    setCountryId(selectedCountryId);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: { name?: string; population?: string } = {};
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = `${translations.city} ${translations.cannotBeEmpty}`;
      isValid = false;
    }

    if (!population.trim()) {
      newErrors.population = `${translations.population} ${translations.cannotBeEmpty}`;
      isValid = false;
    } else if (isNaN(Number(population)) || Number(population) <= 0) {
      newErrors.population = `${translations.validPopulationValue || "Geçerli bir nüfus değeri giriniz"}`;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAdd = () => {
    if (!validateForm()) return;

    const newCity: Omit<City, 'id'> = {
      name,
      population: Number(population),
      districts: [],
      customerCount: 0
    };

    onAdd(newCity, countryId);
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AddIcon color="primary" />
          <Typography variant="h6" component="span">
            {translations.addCity}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="country-select-label">{translations.country}</InputLabel>
              <Select
                labelId="country-select-label"
                value={countryId}
                onChange={(e) => setCountryId(Number(e.target.value))}
                label={translations.country}
              >
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={translations.city}
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              autoFocus
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={translations.population}
              variant="outlined"
              type="number"
              value={population}
              onChange={(e) => setPopulation(e.target.value)}
              error={!!errors.population}
              helperText={errors.population}
              InputProps={{
                inputProps: { min: 1 }
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <Divider />
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} variant="outlined">
          {translations.close}
        </Button>
        <Button 
          onClick={handleAdd} 
          variant="contained" 
          color="primary"
          disabled={!name.trim() || !population.trim()}
        >
          {translations.add}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CityAddDialog;
