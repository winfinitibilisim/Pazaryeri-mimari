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
  Chip
} from '@mui/material';
import { Close as CloseIcon, LocationOn, People, Map } from '@mui/icons-material';
import { District } from '../../types/Country';
// Recharts yerine Material UI bileşenleri kullanacağız

interface DistrictDetailsDialogProps {
  open: boolean;
  district: District | null;
  cityName: string;
  countryName: string;
  onClose: () => void;
}

const DistrictDetailsDialog: React.FC<DistrictDetailsDialogProps> = ({ 
  open, 
  district, 
  cityName, 
  countryName, 
  onClose 
}) => {
  const { translations } = useLanguage();
  if (!district) return null;

  // Müşteri istatistikleri için veri hazırlama
  const customerData = [
    { name: translations.individualCustomers, value: Math.floor(district.customerCount * 0.65) },
    { name: translations.corporateCustomers, value: Math.floor(district.customerCount * 0.35) }
  ];

  // Pasta grafiği için renkler
  const COLORS = ['#0088FE', '#00C49F'];

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
          <LocationOn color="primary" />
          <Typography variant="h6" component="span">
            {district.name} {translations.districtDetails}
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
                    <Typography variant="body2" color="text.secondary">{translations.district}</Typography>
                    <Typography variant="body1" fontWeight="medium">{district.name}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">{translations.city}</Typography>
                    <Typography variant="body1" fontWeight="medium">{cityName}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">{translations.country}</Typography>
                    <Typography variant="body1" fontWeight="medium">{countryName}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">{translations.population}</Typography>
                    <Typography variant="body1" fontWeight="medium">{district.population.toLocaleString()}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">{translations.customerCount}</Typography>
                    <Typography variant="body1" fontWeight="medium" color="primary">{district.customerCount.toLocaleString()}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">{translations.customerDensity}</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      <Chip 
                        size="small" 
                        label={`${((district.customerCount / district.population) * 100).toFixed(2)}%`}
                        color={
                          (district.customerCount / district.population) > 0.05 
                            ? 'success' 
                            : (district.customerCount / district.population) > 0.02 
                              ? 'primary' 
                              : 'default'
                        }
                      />
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <People fontSize="small" /> {translations.customerDistribution}
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, maxHeight: 300, overflow: 'auto' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {customerData.map((customer, index) => {
                  // Toplam müşteri sayısını hesapla
                  const totalCustomers = customerData.reduce((sum, d) => sum + d.value, 0);
                  // Yüzde hesapla
                  const percentage = totalCustomers > 0 ? (customer.value / totalCustomers) * 100 : 0;
                  // Renk belirle
                  const color = COLORS[index % COLORS.length];
                  
                  return (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">{customer.name}</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {customer.value} {translations.customerLabel.toLowerCase()} ({percentage.toFixed(1)}%)
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
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <People fontSize="small" /> {translations.customerStats}
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ p: 2, bgcolor: 'rgba(0, 136, 254, 0.1)', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">{translations.individualCustomers}</Typography>
                    <Typography variant="h5" color="#0088FE" fontWeight="bold">
                      {Math.floor(district.customerCount * 0.65).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {translations.percentOfTotal}: 65%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ p: 2, bgcolor: 'rgba(0, 196, 159, 0.1)', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">{translations.corporateCustomers}</Typography>
                    <Typography variant="h5" color="#00C49F" fontWeight="bold">
                      {Math.floor(district.customerCount * 0.35).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {translations.percentOfTotal}: 35%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ p: 2, bgcolor: 'rgba(255, 187, 40, 0.1)', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">{translations.revenuePerCustomer}</Typography>
                    <Typography variant="h5" color="#FFBB28" fontWeight="bold">
                      {(district.customerCount > 0 ? 1250 + Math.floor(Math.random() * 750) : 0).toLocaleString()} ₺
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {translations.monthlyAverage}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
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

export default DistrictDetailsDialog;
