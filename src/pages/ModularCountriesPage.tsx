import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Container,
  Typography, 
  Box, 
  Paper, 
  Button, 
  TextField, 
  InputAdornment,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TablePagination
} from '@mui/material';
import { 
  Add as AddIcon, 
  Search as SearchIcon, 
  Public as PublicIcon
} from '@mui/icons-material';
import { useNotifications } from '../contexts/NotificationContext';
import { Country, City, District } from '../types/Country';
import { countriesData, continentOptions } from '../data/countriesData';

// Import custom components
import CountryTable from '../components/countries/CountryTable';
import CountryDetailsDialog from '../components/countries/CountryDetailsDialog';
import CountryEditDialog from '../components/countries/CountryEditDialog';
import CountryDeleteDialog from '../components/countries/CountryDeleteDialog';
import CountryAddDialog from '../components/countries/CountryAddDialog';
import CityAddDialog from '../components/cities/CityAddDialog';
import DistrictAddDialog from '../components/districts/DistrictAddDialog';

// Countries Page Component
const ModularCountriesPage: React.FC = () => {
  // Dil çevirilerini al
  const { translations } = useLanguage();
  // State variables
  const [countries, setCountries] = useState<Country[]>(countriesData);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedContinent, setSelectedContinent] = useState<string>('all');
  
  // Dialog states
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addCityDialogOpen, setAddCityDialogOpen] = useState(false);
  const [addDistrictDialogOpen, setAddDistrictDialogOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<number>(0); // 0 means no city selected
  
  // Notification system
  const notifications = useNotifications();

  // Filtered countries
  const filteredCountries = countries.filter(country => {
    const matchesSearch = country.name.toLowerCase().includes(searchText.toLowerCase()) ||
      country.code.toLowerCase().includes(searchText.toLowerCase()) ||
      country.capital.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesContinent = selectedContinent === 'all' || country.continent === selectedContinent;
    
    return matchesSearch && matchesContinent;
  });

  // Yeni ülke ekle
  const handleAddCountry = () => {
    setAddDialogOpen(true);
  };

  // Complete adding new country
  const handleAddConfirm = (newCountry: Omit<Country, 'id'>) => {
    // New country ID
    const newId = Math.max(...countries.map(c => c.id)) + 1;
    
    // New country object
    const countryToAdd: Country = {
      id: newId,
      ...newCountry
    };
    
    // Add to countries list
    setCountries([...countries, countryToAdd]);
    
    // Bildirim göster
    notifications.show(`${countryToAdd.name} ${translations.country.toLowerCase()} ${translations.successfullyAdded}`, {
      severity: 'success',
      autoHideDuration: 3000
    });
    
    // Dialog'u kapat
    setAddDialogOpen(false);
  };

  // View country details
  const handleDetailsClick = (country: Country) => {
    setSelectedCountry(country);
    setDetailsDialogOpen(true);
  };

  // Open edit dialog
  const handleEditClick = (country: Country) => {
    setSelectedCountry(country);
    setEditDialogOpen(true);
  };
  
  // Confirm edit operation
  const handleEditConfirm = (updatedCountry: Country) => {
    // Update countries list
    setCountries(prevCountries =>
      prevCountries.map(c =>
        c.id === updatedCountry.id ? updatedCountry : c
      )
    );
    
    // Bildirim göster
    notifications.show(`${updatedCountry.name} ${translations.country.toLowerCase()} ${translations.successfullyUpdated}`, {
      severity: 'success',
      autoHideDuration: 3000
    });
    
    // Dialog'u kapat
    setEditDialogOpen(false);
    setSelectedCountry(null);
  };
  
  // Open delete dialog
  const handleDeleteClick = (country: Country) => {
    setSelectedCountry(country);
    setDeleteDialogOpen(true);
  };
  
  // Confirm delete operation
  const handleDeleteConfirm = () => {
    if (selectedCountry) {
      // Remove country from list
      setCountries(prevCountries => prevCountries.filter(c => c.id !== selectedCountry.id));
      
      // Bildirim göster
      notifications.show(`${selectedCountry.name} ${translations.country.toLowerCase()} ${translations.delete}`, {
        severity: 'success',
        autoHideDuration: 3000
      });
      
      // Close dialog
      setDeleteDialogOpen(false);
      setSelectedCountry(null);
    }
  };

  // Change active status
  const handleActiveChange = (countryId: number) => {
    setCountries(prevCountries => {
      const updatedCountries = prevCountries.map(country => {
        if (country.id === countryId) {
          const newStatus = !country.isActive;
          return { ...country, isActive: newStatus };
        }
        return country;
      });
      
      // Find updated country to show notification
      const updatedCountry = updatedCountries.find(c => c.id === countryId);
      if (updatedCountry) {
        const statusText = updatedCountry.isActive ? translations.active : translations.inactive;
        notifications.show(`${updatedCountry.name} ${translations.country.toLowerCase()} ${statusText} ${translations.successfullyUpdated}`, {
          severity: 'success',
          autoHideDuration: 3000
        });
      }
      
      return updatedCountries;
    });
  };

  // Change default country
  const handleDefaultChange = (countryId: number) => {
    setCountries(prevCountries => 
      prevCountries.map(country => 
        ({ ...country, isDefault: country.id === countryId })
      )
    );
    
    const country = countries.find(c => c.id === countryId);
    if (country) {
      notifications.show(`${country.name} ${translations.defaultCountry.toLowerCase()} ${translations.setAsDefault}`, {
        severity: 'success',
        autoHideDuration: 3000
      });
    }
  };

  // Handle search operation
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    setPage(0);
  };

  // Change continent filter
  const handleContinentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedContinent(event.target.value);
    setPage(0);
  };

  // Page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Change rows per page
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={0} sx={{ p: { xs: 2, md: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PublicIcon sx={{ mr: 2 }} />
            {translations.countries}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={handleAddCountry}
            sx={{ 
              backgroundColor: '#25638f',
              '&:hover': {
                backgroundColor: '#1e5070',
              }
            }}
          >
            {translations.addCountry}
          </Button>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3, gap: 2 }}>
          <TextField
            placeholder={`${translations.search} ${translations.countries}...`}
            variant="outlined"
            size="small"
            value={searchText}
            onChange={handleSearch}
            sx={{ minWidth: { xs: '100%', sm: 300 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#25638f' }} />
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl component="fieldset">
            <RadioGroup
              row
              aria-label="continent"
              name="continent"
              value={selectedContinent}
              onChange={handleContinentChange}
            >
              {continentOptions.filter(option => 
                ['all', 'europe', 'asia', 'north-america'].includes(option.value)
              ).map(option => (
                <FormControlLabel 
                  key={option.value}
                  value={option.value} 
                  control={
                    <Radio 
                      sx={{
                        color: '#25638f',
                        '&.Mui-checked': {
                          color: '#25638f',
                        },
                      }}
                    />
                  } 
                  label={option.label} 
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Box>
        
        <CountryTable 
          countries={filteredCountries}
          page={page}
          rowsPerPage={rowsPerPage}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
          onDetailsClick={handleDetailsClick}
          onActiveChange={handleActiveChange}
          onDefaultChange={handleDefaultChange}
        />
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCountries.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={`${translations.pageItemsCount}:`}
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
        />
      </Paper>
      
      {/* Country Details Dialog */}
      <CountryDetailsDialog
        open={detailsDialogOpen}
        country={selectedCountry}
        onClose={() => setDetailsDialogOpen(false)}
        onAddCity={(countryId) => {
          setDetailsDialogOpen(false);
          setSelectedCountry(countries.find(c => c.id === countryId) || null);
          setAddCityDialogOpen(true);
        }}
        onAddDistrict={(countryId) => {
          setDetailsDialogOpen(false);
          setSelectedCountry(countries.find(c => c.id === countryId) || null);
          setAddDistrictDialogOpen(true);
        }}
      />
      
      {/* Country Edit Dialog */}
      <CountryEditDialog
        open={editDialogOpen}
        country={selectedCountry}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleEditConfirm}
      />
      
      {/* Country Delete Dialog */}
      <CountryDeleteDialog
        open={deleteDialogOpen}
        country={selectedCountry}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
      
      {/* Yeni Ülke Ekleme Dialog'u */}
      <CountryAddDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdd={handleAddConfirm}
        nextId={Math.max(...countries.map(c => c.id)) + 1}
      />
      
      {/* Yeni Şehir Ekleme Dialog'u */}
      {selectedCountry && (
        <CityAddDialog
          open={addCityDialogOpen}
          onClose={() => setAddCityDialogOpen(false)}
          onAdd={(newCity: Omit<City, 'id'>, countryId: number) => {
            // Yeni şehir ekleme işlemi
            const updatedCountries = [...countries];
            const countryIndex = updatedCountries.findIndex(c => c.id === countryId);
            
            if (countryIndex !== -1) {
              // Yeni şehir ID'si
              const maxCityId = Math.max(...updatedCountries[countryIndex].cities.map(city => city.id), 0);
              
              // Yeni şehri ekle
              updatedCountries[countryIndex].cities.push({
                ...newCity,
                id: maxCityId + 1,
                districts: []
              });
              
              setCountries(updatedCountries);
              
              // Bildirim göster
              notifications.show(`${newCity.name} şehri başarıyla eklendi`, {
                severity: 'success',
                autoHideDuration: 3000
              });
            }
            
            setAddCityDialogOpen(false);
          }}
          countries={countries}
          selectedCountryId={selectedCountry.id}
        />
      )}
      
      {/* Yeni İlçe Ekleme Dialog'u */}
      {selectedCountry && (
        <DistrictAddDialog
          open={addDistrictDialogOpen}
          onClose={() => setAddDistrictDialogOpen(false)}
          onAdd={(newDistrict: Omit<District, 'id'>, countryId: number, cityId: number) => {
            // Yeni ilçe ekleme işlemi
            const updatedCountries = [...countries];
            const countryIndex = updatedCountries.findIndex(c => c.id === countryId);
            
            if (countryIndex !== -1) {
              // Şehri bul
              const cityIndex = updatedCountries[countryIndex].cities.findIndex(c => c.id === cityId);
              
              if (cityIndex !== -1) {
                // Yeni ilçe ID'si
                const maxDistrictId = Math.max(...updatedCountries[countryIndex].cities[cityIndex].districts.map(d => d.id), 0);
                
                // Yeni ilçeyi ekle
                updatedCountries[countryIndex].cities[cityIndex].districts.push({
                  ...newDistrict,
                  id: maxDistrictId + 1
                });
                
                setCountries(updatedCountries);
                
                // Bildirim göster
                notifications.show(`${newDistrict.name} ilçesi başarıyla eklendi`, {
                  severity: 'success',
                  autoHideDuration: 3000
                });
              }
            }
            
            setAddDistrictDialogOpen(false);
          }}
          countries={countries}
          selectedCountryId={selectedCountry.id}
          selectedCityId={selectedCityId}
        />
      )}
    </Container>
  );
};

export default ModularCountriesPage;
