import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Chip
} from '@mui/material';
import {
  Close as CloseIcon,
  LocationCity as LocationCityIcon,
  PeopleAlt as PeopleAltIcon,
  Public as PublicIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { Country, City, District } from '../../types/Country';
import { getContinentLabel } from '../../data/countriesData';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`country-tabpanel-${index}`}
      aria-labelledby={`country-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface CountryDetailsDialogProps {
  open: boolean;
  country: Country | null;
  onClose: () => void;
  onAddCity?: (countryId: number) => void;
  onAddDistrict?: (countryId: number) => void;
}

const CountryDetailsDialog: React.FC<CountryDetailsDialogProps> = ({
  open,
  country,
  onClose,
  onAddCity,
  onAddDistrict
}) => {
  const { translations } = useLanguage();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Nüfus ve müşteri sayısını formatla
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  if (!country) {
    return null;
  }

  // Toplam ilçe sayısını hesapla
  const totalDistricts = country.cities.reduce((total, city) => total + city.districts.length, 0);

  // Toplam müşteri sayısını şehirlere göre hesapla
  const cityCustomerData = country.cities.map(city => ({
    name: city.name,
    customerCount: city.customerCount,
    percentage: Math.round((city.customerCount / country.customerCount) * 100)
  }));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="country-details-dialog-title"
    >
      <DialogTitle id="country-details-dialog-title" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f5f5f5' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PublicIcon sx={{ color: '#25638f' }} />
          <Typography variant="h6">{country.name} {translations.countryDetails}</Typography>
          <Chip 
            label={country.isActive ? translations.active : translations.inactive} 
            size="small" 
            color={country.isActive ? 'success' : 'error'} 
            sx={{ ml: 2 }} 
          />
        </Box>
        <IconButton aria-label="close" onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="country details tabs">
          <Tab label={translations.generalInfo} id="country-tab-0" aria-controls="country-tabpanel-0" />
          <Tab label={translations.cities} id="country-tab-1" aria-controls="country-tabpanel-1" />
          <Tab label={translations.districts} id="country-tab-2" aria-controls="country-tabpanel-2" />
          <Tab label={translations.customerStats} id="country-tab-3" aria-controls="country-tabpanel-3" />
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f9f9f9' }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', color: '#25638f' }}>
                {translations.country} {translations.generalInfo}
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">{translations.countryCode}</Typography>
                  <Typography variant="body1">{country.code}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">{translations.capital}</Typography>
                  <Typography variant="body1">{country.capital}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">{translations.continent}</Typography>
                  <Typography variant="body1">{getContinentLabel(country.continent)}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">{translations.population}</Typography>
                  <Typography variant="body1">{formatNumber(country.population)}</Typography>
                </Box>
              </Box>
            </Paper>

            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f9f9f9' }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', color: '#25638f' }}>
                {translations.summaryStats}
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
                  <LocationCityIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                  <Typography variant="h6">{country.cities.length}</Typography>
                  <Typography variant="body2" color="text.secondary">{translations.city}</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, bgcolor: '#e8f5e9', borderRadius: 1 }}>
                  <LocationCityIcon sx={{ fontSize: 40, color: '#388e3c', mb: 1 }} />
                  <Typography variant="h6">{totalDistricts}</Typography>
                  <Typography variant="body2" color="text.secondary">{translations.district}</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, bgcolor: '#fff3e0', borderRadius: 1 }}>
                  <PeopleAltIcon sx={{ fontSize: 40, color: '#f57c00', mb: 1 }} />
                  <Typography variant="h6">{formatNumber(country.customerCount)}</Typography>
                  <Typography variant="body2" color="text.secondary">{translations.customerLabel}</Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => {
                if (onAddCity) {
                  onAddCity(country.id);
                } else {
                  alert(`${translations.featureNotAvailable}: ${translations.addCity}`);
                }
              }}
              sx={{ 
                backgroundColor: '#25638f',
                '&:hover': {
                  backgroundColor: '#1e5070',
                }
              }}
            >
              {translations.addCity}
            </Button>
          </Box>
          <TableContainer component={Paper} elevation={0} sx={{ bgcolor: '#f9f9f9' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{translations.city}</TableCell>
                  <TableCell align="right">{translations.population}</TableCell>
                  <TableCell align="right">{translations.districtCount}</TableCell>
                  <TableCell align="right">{translations.customerCount}</TableCell>
                  <TableCell align="right">{translations.customerDistribution}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {country.cities.map((city) => (
                  <TableRow key={city.id}>
                    <TableCell component="th" scope="row">
                      {city.name}
                    </TableCell>
                    <TableCell align="right">{formatNumber(city.population)}</TableCell>
                    <TableCell align="right">{city.districts.length}</TableCell>
                    <TableCell align="right">{formatNumber(city.customerCount)}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`%${Math.round((city.customerCount / country.customerCount) * 100)}`}
                        size="small"
                        sx={{
                          bgcolor: city.customerCount > 1000 ? '#4caf50' : city.customerCount > 500 ? '#ff9800' : '#f44336',
                          color: 'white'
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => {
                if (onAddDistrict) {
                  onAddDistrict(country.id);
                } else {
                  alert(`${country.name} için yeni ilçe ekleme özelliği henüz aktif edilmemiş.`);
                }
              }}
              sx={{ 
                backgroundColor: '#25638f',
                '&:hover': {
                  backgroundColor: '#1e5070',
                }
              }}
            >
              {translations.addDistrict}
            </Button>
          </Box>
          {country.cities.map((city) => (
            <Box key={city.id} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold', color: '#25638f' }}>
                {city.name} {translations.districts}
              </Typography>
              <TableContainer component={Paper} elevation={0} sx={{ bgcolor: '#f9f9f9' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{translations.district}</TableCell>
                      <TableCell align="right">{translations.population}</TableCell>
                      <TableCell align="right">{translations.customerCount}</TableCell>
                      <TableCell align="right">{translations.customerDistribution}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {city.districts.map((district) => (
                      <TableRow key={district.id}>
                        <TableCell component="th" scope="row">
                          {district.name}
                        </TableCell>
                        <TableCell align="right">{formatNumber(district.population)}</TableCell>
                        <TableCell align="right">{formatNumber(district.customerCount)}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`%${Math.round((district.customerCount / city.customerCount) * 100)}`}
                            size="small"
                            sx={{
                              bgcolor: district.customerCount > 400 ? '#4caf50' : district.customerCount > 200 ? '#ff9800' : '#f44336',
                              color: 'white'
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ))}
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f9f9f9' }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', color: '#25638f' }}>
                {translations.customerDistribution}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {cityCustomerData.map((cityData) => (
                  <Box key={cityData.name}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{cityData.name}</Typography>
                      <Typography variant="body2">{formatNumber(cityData.customerCount)} (%{cityData.percentage})</Typography>
                    </Box>
                    <Box sx={{ width: '100%', bgcolor: '#e0e0e0', borderRadius: 1, height: 10 }}>
                      <Box
                        sx={{
                          width: `${cityData.percentage}%`,
                          bgcolor: cityData.percentage > 30 ? '#4caf50' : cityData.percentage > 15 ? '#ff9800' : '#f44336',
                          height: '100%',
                          borderRadius: 1
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>

            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f9f9f9' }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', color: '#25638f' }}>
                {translations.topCustomerDistricts}
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{translations.district}</TableCell>
                      <TableCell>{translations.city}</TableCell>
                      <TableCell align="right">{translations.customerCount}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {country.cities
                      .flatMap(city => city.districts.map(district => ({
                        district,
                        cityName: city.name
                      })))
                      .sort((a, b) => b.district.customerCount - a.district.customerCount)
                      .slice(0, 5)
                      .map(({ district, cityName }) => (
                        <TableRow key={district.id}>
                          <TableCell>{district.name}</TableCell>
                          <TableCell>{cityName}</TableCell>
                          <TableCell align="right">{formatNumber(district.customerCount)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </TabPanel>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined" color="primary">
          {translations.close}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CountryDetailsDialog;
