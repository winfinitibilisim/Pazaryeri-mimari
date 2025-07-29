import React from 'react';
import { Box, Paper, Grid, Button, Typography, Container, useTheme } from '@mui/material';
import {
  LocalShipping as KargoListesiIcon,
  AccountBalanceWallet as MuhasebeIcon,
  Inventory as UrunlerIcon,
  People as MusterilerIcon,
  Assessment as SevkiyatlarIcon,
  PriceCheck as KargoFiyatlariIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface MainCategoriesBarProps {
  setActiveMenu: (menu: string) => void;
}

const mainCategories = [
  {
    title: 'Kargo Listesi',
    icon: <KargoListesiIcon sx={{ fontSize: 56, color: '#FFC107' }} />,
    path: '/shipping/goods-acceptance',
    menuKey: 'shipping'
  },
  {
    title: 'Muhasebe',
    icon: <MuhasebeIcon sx={{ fontSize: 56, color: '#3F51B5' }} />,
    path: '/customers',
    menuKey: 'sales'
  },
  {
    title: 'Ürünler',
    icon: <UrunlerIcon sx={{ fontSize: 56, color: '#F57C00' }} />,
    path: '/products',
    menuKey: 'products'
  },

  {
    title: 'Sevkiyatlar',
    icon: <SevkiyatlarIcon sx={{ fontSize: 56, color: '#E91E63' }} />,
    path: '/shipping/pending-shipments',
    menuKey: 'shipments'
  },
  {
    title: 'Kargo Fiyatları',
    icon: <KargoFiyatlariIcon sx={{ fontSize: 56, color: '#FF5722' }} />,
    path: '/shipping-prices',
    menuKey: 'default'
  }
];

const MainCategoriesBar: React.FC<MainCategoriesBarProps> = ({ setActiveMenu }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{
      backgroundColor: '#fff',
      py: 2,
      borderBottom: '1px solid #eaeaea',
      boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
      position: 'sticky',
      top: 0,
      zIndex: theme.zIndex.appBar + 1,
    }}>
      <Container maxWidth="lg">
        <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid #eee' }}>
          <Grid container spacing={3} justifyContent="center">
            {mainCategories.map((category, index) => (
              <Grid item xs={6} sm={4} md={2.4} key={index}>
                <Button
                  variant={location.pathname === category.path ? 'contained' : 'outlined'}
                  onClick={() => {
                    navigate(category.path);
                    setActiveMenu(category.menuKey);
                  }}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    minHeight: 160,
                    p: 2,
                    borderRadius: 2,
                    borderColor: '#e0e0e0',
                    boxShadow: location.pathname === category.path ? 2 : 0,
                    backgroundColor: location.pathname === category.path ? 'rgba(33, 150, 243, 0.08)' : '#fff',
                    textTransform: 'none',
                  }}
                >
                  {category.icon}
                                    <Typography variant="subtitle1" sx={{ mt: 2, color: 'text.primary', fontWeight: 'medium', fontSize: '1.05rem' }}>
                    {category.title}
                  </Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default MainCategoriesBar;
