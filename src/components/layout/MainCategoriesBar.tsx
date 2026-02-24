import React from 'react';
import { Box, Paper, Grid, Button, Typography, Container, useTheme } from '@mui/material';
import {
  ShoppingBag as UrunlerIcon,
  Group as SatislarIcon,
  MonetizationOn as PromosyonlarIcon,
  TrendingUp as RaporlarIcon,
  ImportExport as SuperXmlIcon,
  Mail as ErpCrmIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface MainCategoriesBarProps {
  setActiveMenu: (menu: string) => void;
}

const mainCategories = [
  {
    title: 'Ürünler',
    icon: <UrunlerIcon sx={{ fontSize: 56, color: '#F57C00' }} />,
    path: '/products',
    menuKey: 'products'
  },
  {
    title: 'Satışlar',
    icon: <SatislarIcon sx={{ fontSize: 56, color: '#2196F3' }} />,
    path: '/orders', // Assuming 'orders' maps to Satışlar logic
    menuKey: 'sales'
  },
  {
    title: 'Promosyonlar',
    icon: <PromosyonlarIcon sx={{ fontSize: 56, color: '#FFC107' }} />,
    path: '/promotions', // Needs a route or placeholder
    menuKey: 'promotions'
  },
  {
    title: 'Raporlar',
    icon: <RaporlarIcon sx={{ fontSize: 56, color: '#E91E63' }} />,
    path: '/reports',
    menuKey: 'reports'
  },
  {
    title: 'Süper Xml Aktar',
    icon: <SuperXmlIcon sx={{ fontSize: 56, color: '#4CAF50' }} />,
    path: '/xml-export', // Needs a route or placeholder
    menuKey: 'xml'
  },
  {
    title: 'ERP / CRM',
    icon: <ErpCrmIcon sx={{ fontSize: 56, color: '#FF5722' }} />,
    path: '/erp-crm', // Needs a route or placeholder
    menuKey: 'erp'
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
              <Grid item xs={6} sm={4} md={2} key={index}>
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
                  <Typography variant="subtitle1" sx={{ mt: 2, color: 'text.primary', fontWeight: 'medium', fontSize: '1.05rem', textAlign: 'center' }}>
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
