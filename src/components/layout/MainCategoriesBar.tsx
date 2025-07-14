import React from 'react';
import { Box, Paper, Grid, Button, Typography, Container, useTheme } from '@mui/material';
import {
  Inventory as ProductsIcon,
  ShoppingCart as SalesIcon,
  LocalOffer as PromotionsIcon,
  BarChart as ReportsIcon,
  Code as XmlIcon,
  Business as ErpIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface MainCategoriesBarProps {
  setActiveMenu: (menu: string) => void;
}

const mainCategories = [
  {
    title: 'Ürünler',
    icon: <ProductsIcon sx={{ fontSize: 40, color: '#F57C00' }} />,
    path: '/products',
    menuKey: 'products'
  },
  {
    title: 'Satışlar',
    icon: <SalesIcon sx={{ fontSize: 40, color: '#3F51B5' }} />,
    path: '/sales-invoices',
    menuKey: 'sales'
  },
  {
    title: 'Promosyonlar',
    icon: <PromotionsIcon sx={{ fontSize: 40, color: '#FFC107' }} />,
    path: '/promotions',
    menuKey: 'default'
  },
  {
    title: 'Raporlar',
    icon: <ReportsIcon sx={{ fontSize: 40, color: '#E91E63' }} />,
    path: '/reports',
    menuKey: 'default'
  },
  {
    title: 'Süper Xml',
    icon: <XmlIcon sx={{ fontSize: 40, color: '#FF5722' }} />,
    path: '/xml-import',
    menuKey: 'default'
  },
  {
    title: 'ERP / CRM',
    icon: <ErpIcon sx={{ fontSize: 40, color: '#795548' }} />,
    path: '/erp-crm',
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
                    minHeight: 120,
                    p: 2,
                    borderRadius: 2,
                    borderColor: '#e0e0e0',
                    boxShadow: location.pathname === category.path ? 2 : 0,
                    backgroundColor: location.pathname === category.path ? 'rgba(33, 150, 243, 0.08)' : '#fff',
                    textTransform: 'none',
                  }}
                >
                  {category.icon}
                  <Typography variant="subtitle1" sx={{ mt: 1, color: 'text.primary', fontWeight: 500 }}>
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
