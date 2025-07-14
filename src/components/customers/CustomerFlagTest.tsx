import React from 'react';
import { Box, Typography, Paper, Grid, Avatar, Card, CardContent, Divider } from '@mui/material';
import { sampleCustomers } from '../../data/sampleCustomers';

// Ülke koduna göre bayrak URL'si döndüren fonksiyon
const getFlagUrl = (countryCode: string): string => {
  // Ülke kodunu küçük harfe çevir
  const code = countryCode?.toLowerCase() || 'tr';
  return `/flags/${code}.svg`;
};

// Ülke kodunu ülke adına çeviren fonksiyon
const getCountryName = (countryCode: string): string => {
  const countryNames: Record<string, string> = {
    'tr': 'Türkiye',
    'us': 'Amerika Birleşik Devletleri',
    'ru': 'Rusya',
    'de': 'Almanya',
    'gb': 'Birleşik Krallık',
    'fr': 'Fransa',
    'it': 'İtalya',
    'es': 'İspanya',
    'jp': 'Japonya',
    'cn': 'Çin'
  };
  
  return countryNames[countryCode.toLowerCase()] || countryCode;
};

const CustomerFlagTest: React.FC = () => {
  // Müşterileri ülke kodlarına göre gruplandır
  const customersByCountry = sampleCustomers.reduce((acc, customer) => {
    const countryCode = customer.country.toLowerCase();
    if (!acc[countryCode]) {
      acc[countryCode] = [];
    }
    acc[countryCode].push(customer);
    return acc;
  }, {} as Record<string, typeof sampleCustomers>);

  // Ülke kodları
  const countryCodes = Object.keys(customersByCountry);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Ülke Bayrakları Testi
      </Typography>
      
      {/* Her ülke için ayrı bir kart */}
      <Grid container spacing={4}>
        {countryCodes.map((countryCode) => (
          <Grid item xs={12} key={countryCode}>
            <Card 
              elevation={3} 
              sx={{ 
                borderRadius: 2,
                overflow: 'visible',
                position: 'relative',
                mb: 5
              }}
            >
              {/* Ülke bayrağı ve adı - büyük görünüm */}
              <Box 
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 3,
                  backgroundColor: 'primary.light',
                  color: 'white',
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8
                }}
              >
                <Box 
                  component="img"
                  src={getFlagUrl(countryCode)}
                  alt={getCountryName(countryCode)}
                  sx={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%', 
                    mr: 2,
                    objectFit: 'cover',
                    border: '2px solid white',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    console.log(`Bayrak yüklenemedi: ${target.src}`);
                    target.onerror = null;
                    target.src = '/flags/tr.svg';
                  }}
                />
                <Typography variant="h5">
                  {getCountryName(countryCode)}
                </Typography>
              </Box>
              
              <Divider />
              
              {/* Bu ülkedeki müşteriler */}
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {getCountryName(countryCode)} Müşterileri
                </Typography>
                
                <Grid container spacing={2}>
                  {customersByCountry[countryCode].map((customer) => (
                    <Grid item xs={12} sm={6} md={4} key={customer.id}>
                      <Paper 
                        elevation={2} 
                        sx={{ 
                          p: 2, 
                          display: 'flex', 
                          flexDirection: 'column', 
                          height: '100%',
                          borderRadius: 2
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar 
                            sx={{ 
                              width: 40, 
                              height: 40, 
                              mr: 2, 
                              bgcolor: 'secondary.main' 
                            }}
                          >
                            {customer.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1">{customer.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {customer.email}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" sx={{ mb: 0.5 }}>
                            <strong>Şehir:</strong> {customer.city}, {customer.district}
                          </Typography>
                          
                          <Typography variant="body2" sx={{ mb: 0.5 }}>
                            <strong>Telefon:</strong> {customer.phone}
                          </Typography>
                          
                          <Typography variant="body2">
                            <strong>Toplam Sipariş:</strong> {customer.totalOrders}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Debug bilgileri */}
      <Box sx={{ mt: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>Debug Bilgileri</Typography>
        <Typography variant="body2">Türkiye Bayrağı: <code>/flags/tr.svg</code></Typography>
        <Typography variant="body2">Rusya Bayrağı: <code>/flags/ru.svg</code></Typography>
        <Typography variant="body2">Amerika Bayrağı: <code>/flags/us.svg</code></Typography>
      </Box>
    </Box>
  );
};

export default CustomerFlagTest;
