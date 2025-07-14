import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  InputAdornment,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Divider,
  Chip,
  SelectChangeEvent
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  LocationCity as LocationCityIcon
} from '@mui/icons-material';
import { City, Country } from '../types/Country';
import { countriesData } from '../data/countriesData';
import CityTable from '../components/cities/CityTable';
import CityDetailsDialog from '../components/cities/CityDetailsDialog';
import CityEditDialog from '../components/cities/CityEditDialog';
import CityDeleteDialog from '../components/cities/CityDeleteDialog';
import CityAddDialog from '../components/cities/CityAddDialog';
import { useNotifications } from '../contexts/NotificationContext';

const ModularCitiesPage: React.FC = () => {
  // Bildirim sistemi için NotificationContext'i kullan
  const notifications = useNotifications();
  const location = useLocation();
  
  // URL'den countryId parametresini al
  const queryParams = new URLSearchParams(location.search);
  const countryIdParam = queryParams.get('countryId');
  
  // State for countries and cities
  const [countries, setCountries] = useState<Country[]>(countriesData);
  const [selectedCountry, setSelectedCountry] = useState<number>(countryIdParam ? parseInt(countryIdParam, 10) : 0); // 0 means all countries
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  
  // Search and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  
  // Dialog states
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  
  // Load all cities from all countries on initial render
  useEffect(() => {
    const allCities: City[] = [];
    countries.forEach(country => {
      country.cities.forEach(city => {
        allCities.push({
          ...city,
          countryId: country.id // Add country reference to each city
        });
      });
    });
    setCities(allCities);
    setFilteredCities(allCities);
  }, [countries]);
  
  // Filter cities when search query or selected country changes
  useEffect(() => {
    let result = cities;
    
    // Filter by country if selected
    if (selectedCountry !== 0) {
      result = result.filter(city => city.countryId === selectedCountry);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(city => 
        city.name.toLowerCase().includes(query)
      );
    }
    
    setFilteredCities(result);
    setPage(0); // Reset to first page when filters change
  }, [cities, searchQuery, selectedCountry]);
  
  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  // Handle country filter change
  const handleCountryChange = (event: SelectChangeEvent<number>) => {
    setSelectedCountry(Number(event.target.value));
  };
  
  // Handle pagination change
  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage - 1);
  };
  
  // Dialog handlers
  const handleDetailsClick = (city: City) => {
    setSelectedCity(city);
    setDetailsDialogOpen(true);
  };
  
  const handleEditClick = (city: City) => {
    setSelectedCity(city);
    setEditDialogOpen(true);
  };
  
  const handleDeleteClick = (city: City) => {
    setSelectedCity(city);
    setDeleteDialogOpen(true);
  };
  
  const handleAddClick = () => {
    setAddDialogOpen(true);
  };
  
  // City operations
  const handleAddCity = (newCity: Omit<City, 'id'>, countryId: number) => {
    // Find the country to add the city to
    const updatedCountries = [...countries];
    const countryIndex = updatedCountries.findIndex(c => c.id === countryId);
    
    if (countryIndex !== -1) {
      // Generate a new ID for the city
      const maxCityId = Math.max(...updatedCountries[countryIndex].cities.map(city => city.id), 0);
      const cityWithId: City = {
        ...newCity,
        id: maxCityId + 1,
        countryId // Add country reference
      };
      
      // Add the city to the country
      updatedCountries[countryIndex].cities.push(cityWithId);
      setCountries(updatedCountries);
      
      // Update the cities list
      setCities(prevCities => [...prevCities, cityWithId]);
      
      // Show success notification
      notifications.showSuccess(`${newCity.name} şehri başarıyla eklendi.`);
    }
    
    setAddDialogOpen(false);
  };
  
  const handleEditCity = (updatedCity: City, countryId: number) => {
    if (!selectedCity) return;
    
    const updatedCountries = [...countries];
    
    // If the country has changed, remove from old country and add to new one
    if (selectedCity.countryId !== countryId) {
      // Find old country and remove city
      const oldCountryIndex = updatedCountries.findIndex(c => c.id === selectedCity.countryId);
      if (oldCountryIndex !== -1) {
        updatedCountries[oldCountryIndex].cities = updatedCountries[oldCountryIndex].cities.filter(
          c => c.id !== selectedCity.id
        );
      }
      
      // Find new country and add city
      const newCountryIndex = updatedCountries.findIndex(c => c.id === countryId);
      if (newCountryIndex !== -1) {
        updatedCountries[newCountryIndex].cities.push({
          ...updatedCity,
          countryId // Update country reference
        });
      }
    } else {
      // Just update the city in the same country
      const countryIndex = updatedCountries.findIndex(c => c.id === countryId);
      if (countryIndex !== -1) {
        const cityIndex = updatedCountries[countryIndex].cities.findIndex(c => c.id === updatedCity.id);
        if (cityIndex !== -1) {
          updatedCountries[countryIndex].cities[cityIndex] = {
            ...updatedCity,
            countryId // Ensure country reference is maintained
          };
        }
      }
    }
    
    setCountries(updatedCountries);
    
    // Update the cities list
    setCities(prevCities => 
      prevCities.map(city => 
        city.id === updatedCity.id ? { ...updatedCity, countryId } : city
      )
    );
    
    // Show success notification
    notifications.showSuccess(`${updatedCity.name} şehri başarıyla güncellendi.`);
    
    setEditDialogOpen(false);
  };
  
  const handleDeleteCity = () => {
    if (!selectedCity) return;
    
    const updatedCountries = [...countries];
    const countryIndex = updatedCountries.findIndex(c => c.id === selectedCity.countryId);
    
    if (countryIndex !== -1) {
      // Remove the city from the country
      updatedCountries[countryIndex].cities = updatedCountries[countryIndex].cities.filter(
        city => city.id !== selectedCity.id
      );
      setCountries(updatedCountries);
      
      // Update the cities list
      setCities(prevCities => prevCities.filter(city => city.id !== selectedCity.id));
      
      // Show success notification
      notifications.showSuccess(`${selectedCity.name} şehri başarıyla silindi.`);
    }
    
    setDeleteDialogOpen(false);
  };
  
  // Get country name for a city
  const getCountryName = (countryId: number): string => {
    const country = countries.find(c => c.id === countryId);
    return country ? country.name : '';
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          <LocationCityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Şehirler Yönetimi
        </Typography>
        
        <Button
          variant="contained"
          color="error"
          size="large"
          startIcon={<AddIcon fontSize="large" />}
          onClick={handleAddClick}
          sx={{ 
            fontWeight: 'bold', 
            px: 4, 
            py: 1.5, 
            fontSize: '1.1rem',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
            '&:hover': {
              boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          YENİ ŞEHİR EKLE
        </Button>
      </Box>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={5}>
            <TextField
              fullWidth
              label="Şehir Ara"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={5}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="country-select-label">Ülke</InputLabel>
              <Select
                labelId="country-select-label"
                value={selectedCountry}
                onChange={handleCountryChange}
                label="Ülke"
              >
                <MenuItem value={0}>Tüm Ülkeler</MenuItem>
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={2} sx={{ textAlign: 'right' }}>
            <Button
              variant="contained"
              color="error"
              startIcon={<AddIcon />}
              onClick={handleAddClick}
              fullWidth
              sx={{
                height: '56px',
                fontWeight: 'bold',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                '&:hover': {
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              YENİ ŞEHİR EKLE
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Şehirler
            <Chip
              label={filteredCities.length}
              color="primary"
              size="small"
              sx={{ ml: 1, fontWeight: 'bold' }}
            />
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <CityTable
          cities={filteredCities}
          countryName={selectedCountry === 0 ? '' : getCountryName(selectedCountry)}
          page={page}
          rowsPerPage={rowsPerPage}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
          onDetailsClick={handleDetailsClick}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={Math.ceil(filteredCities.length / rowsPerPage)}
            page={page + 1}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      </Paper>

      {/* Dialogs */}
      {selectedCity && (
        <>
          <CityDetailsDialog
            open={detailsDialogOpen}
            city={selectedCity}
            countryName={getCountryName(selectedCity.countryId || 0)}
            onClose={() => setDetailsDialogOpen(false)}
          />
          
          <CityEditDialog
            open={editDialogOpen}
            city={selectedCity}
            countries={countries}
            countryId={selectedCity.countryId || 0}
            onClose={() => setEditDialogOpen(false)}
            onSave={handleEditCity}
          />
          
          <CityDeleteDialog
            open={deleteDialogOpen}
            city={selectedCity}
            onClose={() => setDeleteDialogOpen(false)}
            onConfirm={handleDeleteCity}
          />
        </>
      )}
      
      <CityAddDialog
        open={addDialogOpen}
        countries={countries}
        selectedCountryId={selectedCountry === 0 ? (countries[0]?.id || 1) : selectedCountry}
        onClose={() => setAddDialogOpen(false)}
        onAdd={handleAddCity}
      />
    </Box>
  );
};

export default ModularCitiesPage;
