import React, { useState } from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Box, 
  useTheme,
  Divider,
  Tooltip,
  Typography,

} from '@mui/material';
import {
  HourglassEmpty as HourglassEmptyIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  LocalShipping as LocalShippingIcon,
  PriceCheck as PriceCheckIcon,
  Inventory as InventoryIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const DRAWER_WIDTH = 240;

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  activeMenu: string;
}

interface SubMenuItem {
  text: string;
  path: string;
  icon: React.ReactElement;
}

interface MenuItem {
  text: string;
  icon: React.ReactElement;
  path?: string;
  badge?: number;
  subItems?: SubMenuItem[];
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    title: 'Sevkiyatlar',
    items: [
      { text: 'Bekleyen', path: '/shipping/pending', icon: <HourglassEmptyIcon /> },
      { text: 'Gönderilen', path: '/shipping/sent', icon: <SendIcon /> },
      { text: 'Teslim Edilen', path: '/shipping/delivered', icon: <CheckCircleIcon /> },
    ],
  },
  {
    title: 'Kargo',
    items: [
      { text: 'Kargo Listesi', path: '/shipping-list', icon: <LocalShippingIcon /> },
      { text: 'Kargo Fiyatları', path: '/shipping-prices', icon: <PriceCheckIcon /> },
      { text: 'Mal Kabul', path: '/shipping/goods-acceptance', icon: <InventoryIcon /> },
      { text: 'Bekleyen Paketler', path: '/shipping/pending-packages', icon: <HourglassEmptyIcon /> },
      { text: 'Tüm Paketler', path: '/shipping/all-packages', icon: <AssignmentIcon /> },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ open, onToggle, activeMenu }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<Record<string, boolean>>({});

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleMenuClick = (text: string) => {
    setOpenMenu(prev => ({ ...prev, [text]: !prev[text] }));
  };

  const isActive = (path?: string, subItems?: SubMenuItem[]) => {
    if (path && location.pathname === path) {
      return true;
    }
    if (subItems) {
      return subItems.some(subItem => location.pathname === subItem.path);
    }
    return false;
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? DRAWER_WIDTH : theme.spacing(7),
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? DRAWER_WIDTH : theme.spacing(7),
          boxSizing: 'border-box',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e0e0e0',
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: open ? theme.transitions.duration.enteringScreen : theme.transitions.duration.leavingScreen,
          }),
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box
          onClick={handleLogoClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '64px',
            cursor: 'pointer',
          }}
        >
          {open && (
            <img
              src={`${process.env.PUBLIC_URL}/images/logo.png`}
              alt="Winfiniti Logo"
              style={{ height: '50px', width: 'auto' }}
            />
          )}
        </Box>
        <Divider />
        <List sx={{ width: '100%', p: 1, flexGrow: 1 }}>
          {menuGroups.map((group, groupIndex) => (
            <React.Fragment key={group.title}>
              {open && (
                <Typography
                  variant="overline"
                  sx={{
                    pl: 2.5, pt: 2, pb: 1, display: 'block', fontWeight: 'bold',
                    color: 'text.secondary', fontSize: '0.65rem', lineHeight: '1.5',
                  }}
                >
                  {group.title}
                </Typography>
              )}
              {group.items.map((item) => (
                <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                  <Tooltip title={open ? '' : item.text} placement="right">
                    <ListItemButton
                      component={Link}
                      to={item.path || '#'}
                      selected={location.pathname === item.path}
                      sx={{
                        mb: 0.5, borderRadius: '8px',
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(25, 118, 210, 0.12)',
                          '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.16)' },
                          '.MuiListItemIcon-root, .MuiListItemText-primary': {
                            color: 'primary.main', fontWeight: 'bold',
                          },
                        },
                      }}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      {open && <ListItemText primary={item.text} />}
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              ))}
              {groupIndex < menuGroups.length - 1 && open && <Divider sx={{ my: 1 }} />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
