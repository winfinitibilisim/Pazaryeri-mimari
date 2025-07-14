import React, { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import MainCategoriesBar from './MainCategoriesBar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('default');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Header open={sidebarOpen} onToggle={toggleSidebar} />
      <Sidebar open={sidebarOpen} onToggle={toggleSidebar} activeMenu={activeMenu} />
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
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 