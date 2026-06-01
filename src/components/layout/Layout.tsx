import React, { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import Header from './Header';
import MainCategoriesBar from './MainCategoriesBar';
import SubNavigation from './SubNavigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState('default');

  return (
    <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          height: '100vh',
          overflow: 'auto',
          backgroundColor: '#f4f6f8',
        }}
      >
        <Toolbar /> {/* Spacing for fixed header */}
        <MainCategoriesBar setActiveMenu={setActiveMenu} />
        <SubNavigation activeMenu={activeMenu} />
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 