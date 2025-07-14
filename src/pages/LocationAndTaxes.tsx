import React, { useState, useMemo } from 'react';
import { 
  Grid, 
  Typography, 
  Box, 
  Paper, 
  Button,
  Card,
  CardContent,
  IconButton,
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Language as LanguageIcon,
  Receipt as TaxIcon,
  Bookmark as TaxClassesIcon,
  List as ExpenseItemsIcon,
  ViewList as StockInfoIcon,
  OpenInNew as OpenInNewIcon,
  AdminPanelSettings as RoleIcon
} from '@mui/icons-material';

const LocationAndTaxes: React.FC = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState('location-taxes');

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
  };

  // Menü öğeleri - Sistem Gereksinimleri kategorisi
  const locationTaxesItems = [
    { 
      id: 'country-region', 
      icon: <LocationIcon sx={{ color: '#2196f3', fontSize: 24 }} />, 
      name: 'Ülke&Bölge',
      path: '/country-region'
    },
    { 
      id: 'currency', 
      icon: <MoneyIcon sx={{ color: '#2196f3', fontSize: 24 }} />, 
      name: 'Para Birimi',
      path: '/currency'
    },
    { 
      id: 'language', 
      icon: <LanguageIcon sx={{ color: '#f44336', fontSize: 24 }} />, 
      name: 'Dil Seçimi',
      path: '/language'
    },
    { 
      id: 'taxes', 
      icon: <MoneyIcon sx={{ color: '#2196f3', fontSize: 24 }} />, 
      name: 'Vergiler',
      path: '/taxes'
    },
    { 
      id: 'withholding-tax', 
      icon: <TaxIcon sx={{ color: '#ff9800', fontSize: 24 }} />, 
      name: 'Stopaj Vergisi',
      path: '/withholding-tax'
    },
    { 
      id: 'deduction-tax', 
      icon: <TaxIcon sx={{ color: '#ff9800', fontSize: 24 }} />, 
      name: 'Tevkifat Vergisi',
      path: '/deduction-tax'
    },
    { 
      id: 'tax-classes', 
      icon: <TaxClassesIcon sx={{ color: '#795548', fontSize: 24 }} />, 
      name: 'Vergi Sınıfları',
      path: '/tax-classes'
    },
    { 
      id: 'expense-items', 
      icon: <ExpenseItemsIcon sx={{ color: '#ff9800', fontSize: 24 }} />, 
      name: 'Harcama Kalemleri',
      path: '/expense-items'
    },
    { 
      id: 'stock-information', 
      icon: <StockInfoIcon sx={{ color: '#ff9800', fontSize: 24 }} />, 
      name: 'Stok Bilgileri',
      path: '/stock-information'
    }
  ];

  // Menü öğeleri - Sistem Yönetimi kategorisi
  const systemManagementItems = [
    { 
      id: 'stock-info', 
      icon: <StockInfoIcon sx={{ color: '#4caf50', fontSize: 24 }} />, 
      name: 'Stok Bilgileri',
      path: '/stock-info'
    },
    {
      id: 'role-management',
      icon: <RoleIcon sx={{ color: '#673ab7', fontSize: 24 }} />,
      name: 'Rol Yönetimi',
      path: '/role-management'
    },
  ];

  // Kategori değiştiğinde gösterilecek menü öğelerini belirle
  const displayedMenuItems = useMemo(() => {
    switch(category) {
      case 'location-taxes':
        return locationTaxesItems;
      case 'products':
        return systemManagementItems;
      case 'customers':
        return [];
      case 'orders':
        return [];
      default:
        return locationTaxesItems;
    }
  }, [category, locationTaxesItems, systemManagementItems]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Select Box */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <FormControl sx={{ minWidth: 250, maxWidth: 400 }}>
          <Select
            value={category}
            onChange={handleCategoryChange}
            displayEmpty
            sx={{ 
              borderRadius: 1,
              height: 48,
              border: '1px solid #3f51b5',
              color: '#3f51b5',
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '& .MuiSelect-select': { paddingLeft: 2, paddingRight: 2 },
              '& .MuiSvgIcon-root': { color: '#3f51b5' }
            }}
            renderValue={() => (
              <Typography sx={{ fontWeight: 500, textAlign: 'center' }}>
                Sistem Gereksinimleri
              </Typography>
            )}
          >
            <MenuItem value="location-taxes">Sistem Gereksinimleri</MenuItem>
            <MenuItem value="products">Sistem Yönetimi</MenuItem>
            <MenuItem value="customers">Müşteriler</MenuItem>
            <MenuItem value="orders">Siparişler</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {/* Menü Kartları */}
      <Box sx={{ 
        border: '1px solid #e0e0e0', 
        borderRadius: 2,
        p: 3,
        backgroundColor: '#fff'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => navigate('/dashboard')}
            sx={{ 
              borderRadius: 20,
              ml: 'auto',
              display: 'none' // Görüntüde geri butonu olmadığı için gizliyoruz
            }}
          >
            Ana Sayfaya Dön
          </Button>
        </Box>
        
        <Grid container spacing={2}>
          {displayedMenuItems.map((item: any) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card 
                variant="outlined" 
                sx={{ 
                  borderRadius: 1, 
                  border: '1px solid #e0e0e0',
                  '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } 
                }}
              >
                <CardContent sx={{ 
                  p: 2, 
                  '&:last-child': { pb: 2 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {item.icon}
                    <Typography sx={{ ml: 1.5, fontSize: '0.9rem' }}>{item.name}</Typography>
                  </Box>
                  <IconButton 
                    size="small" 
                    onClick={() => navigate(item.path)}
                    sx={{ color: '#3f51b5' }}
                  >
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default LocationAndTaxes;
