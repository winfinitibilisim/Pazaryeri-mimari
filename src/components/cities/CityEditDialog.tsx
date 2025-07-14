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
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { Close as CloseIcon, Edit as EditIcon } from '@mui/icons-material';
import { City, Country } from '../../types/Country';

interface CityEditDialogProps {
  open: boolean;
  city: City | null;
  countries: Country[];
  countryId: number;
  onClose: () => void;
  onSave: (updatedCity: City, countryId: number) => void;
}

const CityEditDialog: React.FC<CityEditDialogProps> = ({
  open,
  city,
  countries,
  countryId,
  onClose,
  onSave
}) => {
  const { translations } = useLanguage();
  const [name, setName] = useState('');
  const [population, setPopulation] = useState('');
  const [selectedCountryId, setSelectedCountryId] = useState(countryId);
  const [errors, setErrors] = useState<{ name?: string; population?: string }>({});

  useEffect(() => {
    if (city) {
      setName(city.name);
      setPopulation(city.population.toString());
      setSelectedCountryId(countryId);
      setErrors({});
    }
  }, [city, countryId]);

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
      newErrors.population = translations.validPopulationValue;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (!validateForm() || !city) return;

    const updatedCity: City = {
      ...city,
      name,
      population: Number(population)
    };

    onSave(updatedCity, selectedCountryId);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
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
          <EditIcon color="primary" />
          <Typography variant="h6" component="span">
            {translations.editCity}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
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
                value={selectedCountryId}
                onChange={(e) => setSelectedCountryId(Number(e.target.value))}
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
        <Button onClick={onClose} variant="outlined">
          {translations.close}
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
          disabled={!name.trim() || !population.trim()}
        >
          {translations.saveChanges}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CityEditDialog;
