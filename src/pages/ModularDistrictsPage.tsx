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
  LocationOn as LocationOnIcon
} from '@mui/icons-material';
import { District, Country, City } from '../types/Country';
import { countriesData, findCountryById, findCityById } from '../data/countriesData';
import DistrictTable from '../components/districts/DistrictTable';
import DistrictDetailsDialog from '../components/districts/DistrictDetailsDialog';
import DistrictEditDialog from '../components/districts/DistrictEditDialog';
import DistrictDeleteDialog from '../components/districts/DistrictDeleteDialog';
import DistrictAddDialog from '../components/districts/DistrictAddDialog';
import { useNotifications } from '../contexts/NotificationContext';

const ModularDistrictsPage: React.FC = () => {
  // Bildirim sistemi için NotificationContext'i kullan
  const notifications = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  
  // URL'den countryId ve cityId parametrelerini al
  const queryParams = new URLSearchParams(location.search);
  const countryIdParam = queryParams.get('countryId');
  const cityIdParam = queryParams.get('cityId');
  
  // State for countries, cities and districts
  const [countries, setCountries] = useState<Country[]>(countriesData);
  const [selectedCountry, setSelectedCountry] = useState<number>(countryIdParam ? parseInt(countryIdParam, 10) : 0); // 0 means all countries
  const [selectedCity, setSelectedCity] = useState<number>(cityIdParam ? parseInt(cityIdParam, 10) : 0); // 0 means all cities
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [filteredDistricts, setFilteredDistricts] = useState<District[]>([]);
  
  // Search and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Dialog states
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  
  // Load all cities from selected country
  useEffect(() => {
    if (selectedCountry === 0) {
      // All cities from all countries
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
    } else {
      // Cities from selected country
      const country = countries.find(c => c.id === selectedCountry);
      if (country) {
        setCities(country.cities.map(city => ({
          ...city,
          countryId: country.id
        })));
      } else {
        setCities([]);
      }
    }
    // Reset city selection when country changes
    setSelectedCity(0);
  }, [selectedCountry, countries]);
  
  // Load all districts from all cities
  useEffect(() => {
    const allDistricts: District[] = [];
    
    if (selectedCity === 0) {
      // All districts from filtered cities
      cities.forEach(city => {
        city.districts.forEach(district => {
          allDistricts.push({
            ...district,
            cityId: city.id,
            countryId: city.countryId
          });
        });
      });
    } else {
      // Districts from selected city
      const city = cities.find(c => c.id === selectedCity);
      if (city) {
        city.districts.forEach(district => {
          allDistricts.push({
            ...district,
            cityId: city.id,
            countryId: city.countryId
          });
        });
      }
    }
    
    setDistricts(allDistricts);
    setFilteredDistricts(allDistricts);
  }, [cities, selectedCity]);
  
  // Filter districts when search query changes
  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = districts.filter(district => 
        district.name.toLowerCase().includes(query)
      );
      setFilteredDistricts(filtered);
    } else {
      setFilteredDistricts(districts);
    }
    setPage(0); // Reset to first page when filters change
  }, [districts, searchQuery]);
  
  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  // Handle country filter change
  const handleCountryChange = (event: SelectChangeEvent<number>) => {
    setSelectedCountry(Number(event.target.value));
  };
  
  // Handle city filter change
  const handleCityChange = (event: SelectChangeEvent<number>) => {
    setSelectedCity(Number(event.target.value));
  };
  
  // Handle pagination change
  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage - 1);
  };
  
  // Dialog handlers
  const handleDetailsClick = (district: District) => {
    setSelectedDistrict(district);
    setDetailsDialogOpen(true);
  };
  
  const handleEditClick = (district: District) => {
    setSelectedDistrict(district);
    setEditDialogOpen(true);
  };
  
  const handleDeleteClick = (district: District) => {
    setSelectedDistrict(district);
    setDeleteDialogOpen(true);
  };
  
  const handleAddClick = () => {
    setAddDialogOpen(true);
  };
  
  // District operations
  const handleAddDistrict = (newDistrict: Omit<District, 'id'>, countryId: number, cityId: number) => {
    // Find the country and city to add the district to
    const updatedCountries = [...countries];
    const countryIndex = updatedCountries.findIndex(c => c.id === countryId);
    
    if (countryIndex !== -1) {
      const cityIndex = updatedCountries[countryIndex].cities.findIndex(c => c.id === cityId);
      
      if (cityIndex !== -1) {
        // Generate a new ID for the district
        const maxDistrictId = Math.max(
          ...updatedCountries[countryIndex].cities[cityIndex].districts.map(district => district.id),
          0
        );
        
        const districtWithId: District = {
          ...newDistrict,
          id: maxDistrictId + 1,
          cityId,
          countryId
        };
        
        // Add the district to the city
        updatedCountries[countryIndex].cities[cityIndex].districts.push(districtWithId);
        setCountries(updatedCountries);
        
        // Show success notification
        notifications.showSuccess(`${newDistrict.name} ilçesi başarıyla eklendi.`);
      }
    }
    
    setAddDialogOpen(false);
  };
  
  const handleEditDistrict = (updatedDistrict: District, countryId: number, cityId: number) => {
    if (!selectedDistrict) return;
    
    const updatedCountries = [...countries];
    
    // If the city or country has changed, remove from old location and add to new one
    if (selectedDistrict.countryId !== countryId || selectedDistrict.cityId !== cityId) {
      // Find old country and city to remove district
      const oldCountryIndex = updatedCountries.findIndex(c => c.id === selectedDistrict.countryId);
      if (oldCountryIndex !== -1) {
        const oldCityIndex = updatedCountries[oldCountryIndex].cities.findIndex(c => c.id === selectedDistrict.cityId);
        if (oldCityIndex !== -1) {
          // Remove district from old city
          updatedCountries[oldCountryIndex].cities[oldCityIndex].districts = 
            updatedCountries[oldCountryIndex].cities[oldCityIndex].districts.filter(
              d => d.id !== selectedDistrict.id
            );
        }
      }
      
      // Find new country and city to add district
      const newCountryIndex = updatedCountries.findIndex(c => c.id === countryId);
      if (newCountryIndex !== -1) {
        const newCityIndex = updatedCountries[newCountryIndex].cities.findIndex(c => c.id === cityId);
        if (newCityIndex !== -1) {
          // Add district to new city
          updatedCountries[newCountryIndex].cities[newCityIndex].districts.push({
            ...updatedDistrict,
            id: selectedDistrict.id, // Keep the same ID
            cityId,
            countryId
          });
        }
      }
    } else {
      // Just update the district in the same city
      const countryIndex = updatedCountries.findIndex(c => c.id === countryId);
      if (countryIndex !== -1) {
        const cityIndex = updatedCountries[countryIndex].cities.findIndex(c => c.id === cityId);
        if (cityIndex !== -1) {
          const districtIndex = updatedCountries[countryIndex].cities[cityIndex].districts.findIndex(
            d => d.id === updatedDistrict.id
          );
          if (districtIndex !== -1) {
            updatedCountries[countryIndex].cities[cityIndex].districts[districtIndex] = {
              ...updatedDistrict,
              cityId,
              countryId
            };
          }
        }
      }
    }
    
    setCountries(updatedCountries);
    
    // Show success notification
    notifications.showSuccess(`${updatedDistrict.name} ilçesi başarıyla güncellendi.`);
    
    setEditDialogOpen(false);
  };
  
  const handleDeleteDistrict = () => {
    if (!selectedDistrict) return;
    
    const updatedCountries = [...countries];
    const countryIndex = updatedCountries.findIndex(c => c.id === selectedDistrict.countryId);
    
    if (countryIndex !== -1) {
      const cityIndex = updatedCountries[countryIndex].cities.findIndex(c => c.id === selectedDistrict.cityId);
      
      if (cityIndex !== -1) {
        // Remove the district from the city
        updatedCountries[countryIndex].cities[cityIndex].districts = 
          updatedCountries[countryIndex].cities[cityIndex].districts.filter(
            district => district.id !== selectedDistrict.id
          );
        
        setCountries(updatedCountries);
        
        // Show success notification
        notifications.showSuccess(`${selectedDistrict.name} ilçesi başarıyla silindi.`);
      }
    }
    
    setDeleteDialogOpen(false);
  };
  
  // Get country and city names for a district
  const getCountryName = (countryId: number): string => {
    const country = countries.find(c => c.id === countryId);
    return country ? country.name : '';
  };
  
  const getCityName = (cityId: number, countryId: number): string => {
    const country = countries.find(c => c.id === countryId);
    if (country) {
      const city = country.cities.find(c => c.id === cityId);
      return city ? city.name : '';
    }
    return '';
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          <LocationOnIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          İlçeler Yönetimi
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
          YENİ İLÇE EKLE
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              variant="outlined"
              label="İlçe Ara"
              placeholder="İlçe ara..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="country-filter-label">Ülke Filtresi</InputLabel>
              <Select
                labelId="country-filter-label"
                value={selectedCountry}
                onChange={handleCountryChange}
                label="Ülke Filtresi"
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
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth variant="outlined" disabled={selectedCountry === 0}>
              <InputLabel id="city-filter-label">Şehir Filtresi</InputLabel>
              <Select
                labelId="city-filter-label"
                value={selectedCity}
                onChange={handleCityChange}
                label="Şehir Filtresi"
              >
                <MenuItem value={0}>Tüm Şehirler</MenuItem>
                {cities.map((city) => (
                  <MenuItem key={city.id} value={city.id}>
                    {city.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
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
              YENİ İLÇE EKLE
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            İlçeler
            <Chip
              label={filteredDistricts.length}
              color="primary"
              size="small"
              sx={{ ml: 1, fontWeight: 'bold' }}
            />
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <DistrictTable
          districts={filteredDistricts}
          cityName={selectedCity === 0 ? '' : getCityName(selectedCity, selectedCountry)}
          countryName={selectedCountry === 0 ? '' : getCountryName(selectedCountry)}
          page={page}
          rowsPerPage={rowsPerPage}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
          onDetailsClick={handleDetailsClick}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={Math.ceil(filteredDistricts.length / rowsPerPage)}
            page={page + 1}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      </Paper>

      {/* Dialogs */}
      {selectedDistrict && (
        <>
          <DistrictDetailsDialog
            open={detailsDialogOpen}
            district={selectedDistrict}
            cityName={getCityName(selectedDistrict.cityId || 0, selectedDistrict.countryId || 0)}
            countryName={getCountryName(selectedDistrict.countryId || 0)}
            onClose={() => setDetailsDialogOpen(false)}
          />
          
          <DistrictEditDialog
            open={editDialogOpen}
            district={selectedDistrict}
            countries={countries}
            selectedCountryId={selectedDistrict.countryId || 0}
            selectedCityId={selectedDistrict.cityId || 0}
            onClose={() => setEditDialogOpen(false)}
            onSave={handleEditDistrict}
          />
          
          <DistrictDeleteDialog
            open={deleteDialogOpen}
            district={selectedDistrict}
            cityName={getCityName(selectedDistrict.cityId || 0, selectedDistrict.countryId || 0)}
            onClose={() => setDeleteDialogOpen(false)}
            onConfirm={handleDeleteDistrict}
          />
        </>
      )}
      
      <DistrictAddDialog
        open={addDialogOpen}
        countries={countries}
        selectedCountryId={selectedCountry === 0 ? (countries[0]?.id || 1) : selectedCountry}
        selectedCityId={selectedCity === 0 ? (cities[0]?.id || 1) : selectedCity}
        onClose={() => setAddDialogOpen(false)}
        onAdd={handleAddDistrict}
      />
    </Box>
  );
};

export default ModularDistrictsPage;
