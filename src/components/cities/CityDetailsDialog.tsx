import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Divider,
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { Close as CloseIcon, LocationCity, People, Map } from '@mui/icons-material';
import { City } from '../../types/Country';
// Recharts yerine Material UI bileşenleri kullanacağız

interface CityDetailsDialogProps {
  open: boolean;
  city: City | null;
  countryName: string;
  onClose: () => void;
}

const CityDetailsDialog: React.FC<CityDetailsDialogProps> = ({ open, city, countryName, onClose }) => {
  const { translations } = useLanguage();
  if (!city) return null;

  // Müşteri istatistikleri için veri hazırlama
  const districtCustomerData = city.districts.map(district => ({
    name: district.name,
    value: district.customerCount,
  }));

  // Pasta grafiği için renkler
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#A4DE6C', '#D0ED57', '#FFC658'];

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
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
          <LocationCity color="primary" />
          <Typography variant="h6" component="span">
            {city.name} {translations.cityDetails}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Map fontSize="small" /> {translations.generalInfo}
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">{translations.city}</Typography>
                    <Typography variant="body1" fontWeight="medium">{city.name}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">{translations.country}</Typography>
                    <Typography variant="body1" fontWeight="medium">{countryName}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">{translations.population}</Typography>
                    <Typography variant="body1" fontWeight="medium">{city.population.toLocaleString()}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">{translations.districtCount}</Typography>
                    <Typography variant="body1" fontWeight="medium">{city.districts.length}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">{translations.customerCount}</Typography>
                    <Typography variant="body1" fontWeight="medium" color="primary">{city.customerCount.toLocaleString()}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Box>

            <Typography variant="subtitle1" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 3 }}>
              <People fontSize="small" /> {translations.customerDistribution}
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, maxHeight: 300, overflow: 'auto' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {districtCustomerData.map((district, index) => {
                  // Toplam müşteri sayısını hesapla
                  const totalCustomers = districtCustomerData.reduce((sum, d) => sum + d.value, 0);
                  // Yüzde hesapla
                  const percentage = totalCustomers > 0 ? (district.value / totalCustomers) * 100 : 0;
                  // Renk belirle
                  const color = COLORS[index % COLORS.length];
                  
                  return (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">{district.name}</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {district.value} {translations.customerLabel.toLowerCase()} ({percentage.toFixed(1)}%)
                        </Typography>
                      </Box>
                      <Box sx={{ width: '100%', bgcolor: 'grey.100', borderRadius: 1, height: 10 }}>
                        <Box
                          sx={{
                            width: `${percentage}%`,
                            bgcolor: color,
                            height: '100%',
                            borderRadius: 1,
                          }}
                        />
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationCity fontSize="small" /> {translations.districts}
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{translations.district}</TableCell>
                    <TableCell align="right">{translations.population}</TableCell>
                    <TableCell align="right">{translations.customerCount}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {city.districts.map((district) => (
                    <TableRow key={district.id}>
                      <TableCell component="th" scope="row">
                        {district.name}
                      </TableCell>
                      <TableCell align="right">{district.population.toLocaleString()}</TableCell>
                      <TableCell align="right">
                        <Chip
                          size="small"
                          label={district.customerCount.toLocaleString()}
                          color={district.customerCount > 500 ? 'success' : district.customerCount > 200 ? 'primary' : 'default'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </DialogContent>
      
      <Divider />
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined">
          {translations.close}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CityDetailsDialog;
