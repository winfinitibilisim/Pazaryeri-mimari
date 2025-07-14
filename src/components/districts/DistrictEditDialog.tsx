import React, { useState, useEffect } from 'react';
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
import { District, Country, City } from '../../types/Country';

interface DistrictEditDialogProps {
  open: boolean;
  district: District | null;
  countries: Country[];
  selectedCountryId: number;
  selectedCityId: number;
  onClose: () => void;
  onSave: (updatedDistrict: District, countryId: number, cityId: number) => void;
}

const DistrictEditDialog: React.FC<DistrictEditDialogProps> = ({
  open,
  district,
  countries,
  selectedCountryId,
  selectedCityId,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [population, setPopulation] = useState('');
  const [countryId, setCountryId] = useState(selectedCountryId);
  const [cityId, setCityId] = useState(selectedCityId);
  const [cities, setCities] = useState<City[]>([]);
  const [errors, setErrors] = useState<{ name?: string; population?: string }>({});

  // Ülke değiştiğinde şehirleri güncelle
  useEffect(() => {
    if (countryId) {
      const selectedCountry = countries.find(country => country.id === countryId);
      if (selectedCountry) {
        setCities(selectedCountry.cities);
        // Eğer seçili şehir, yeni ülkenin şehirlerinden biri değilse, ilk şehri seç
        if (!selectedCountry.cities.some(city => city.id === cityId)) {
          setCityId(selectedCountry.cities[0]?.id || 0);
        }
      } else {
        setCities([]);
      }
    } else {
      setCities([]);
    }
  }, [countryId, countries, cityId]);

  // District değiştiğinde form alanlarını güncelle
  useEffect(() => {
    if (district) {
      setName(district.name);
      setPopulation(district.population.toString());
      setErrors({});
    }
  }, [district]);

  const validateForm = () => {
    const newErrors: { name?: string; population?: string } = {};
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'İlçe adı gereklidir';
      isValid = false;
    }

    if (!population.trim()) {
      newErrors.population = 'Nüfus bilgisi gereklidir';
      isValid = false;
    } else if (isNaN(Number(population)) || Number(population) <= 0) {
      newErrors.population = 'Geçerli bir nüfus değeri giriniz';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (!validateForm() || !district) return;

    const updatedDistrict: District = {
      ...district,
      name,
      population: Number(population)
    };

    onSave(updatedDistrict, countryId, cityId);
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
            İlçe Düzenle
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
              <InputLabel id="country-select-label">Ülke</InputLabel>
              <Select
                labelId="country-select-label"
                value={countryId}
                onChange={(e) => setCountryId(Number(e.target.value))}
                label="Ülke"
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
            <FormControl fullWidth variant="outlined" disabled={cities.length === 0}>
              <InputLabel id="city-select-label">Şehir</InputLabel>
              <Select
                labelId="city-select-label"
                value={cityId}
                onChange={(e) => setCityId(Number(e.target.value))}
                label="Şehir"
              >
                {cities.map((city) => (
                  <MenuItem key={city.id} value={city.id}>
                    {city.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="İlçe Adı"
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
              label="Nüfus"
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
          İptal
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
          disabled={!name.trim() || !population.trim() || cities.length === 0}
        >
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DistrictEditDialog;
