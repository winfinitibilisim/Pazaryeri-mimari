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
  Inventory as InventoryIcon,
  Assignment as AssignmentIcon,
  Category as CategoryIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  Description as DescriptionIcon,
  Work as WorkIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Assessment as AssessmentIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  SwapHoriz as SwapHorizIcon,
  AccountBalance as AccountBalanceIcon,
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
  ShoppingCart as ShoppingCartIcon,
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

// Kargo menüleri (KALDIRILDI)

// Sevkiyat menüleri (KALDIRILDI)

// Paket Sevkiyatı menüleri (KALDIRILDI)

// Ürün menüleri
const productMenuGroups: MenuGroup[] = [
  {
    title: 'PRODUCT',
    items: [
      { text: 'Ürünler', path: '/products', icon: <InventoryIcon /> },
      { text: 'Kategori', path: '/categories', icon: <CategoryIcon /> },
      { text: 'Markalar', path: '/brands', icon: <CategoryIcon /> },
    ],
  },
];

// Muhasebe menüleri
const accountingMenuGroups: MenuGroup[] = [
  {
    title: 'FATURALAR & FİŞLER',
    items: [
      { text: 'Siparişler', path: '/orders', icon: <ShoppingCartIcon /> },
      { text: 'Müşteriler', path: '/customers', icon: <PeopleIcon /> },
      { text: 'Satış Faturaları', path: '/sales-invoices', icon: <ReceiptIcon /> },
      { text: 'Taslak Faturalar', path: '/draft-invoices', icon: <DescriptionIcon /> },
      { text: 'Alış Faturaları', path: '/purchase-invoices', icon: <ReceiptIcon /> },
    ],
  },
  {
    title: 'PERSONEL',
    items: [
      { text: 'Çalışanlar', path: '/employees', icon: <WorkIcon /> },
      { text: 'Gider Fişleri', path: '/expense-receipts', icon: <ReceiptIcon /> },
    ],
  },
  {
    title: 'FİNANS',
    items: [
      { text: 'Müşteri Alacakları', path: '/receivables/customer', icon: <TrendingUpIcon /> },
      { text: 'Vadesi Geçen Alacaklar', path: '/receivables/overdue', icon: <WarningIcon /> },
      { text: 'Alacak Raporları', path: '/receivables/reports', icon: <AssessmentIcon /> },
      { text: 'Gelen Ödemeler', path: '/payments/incoming', icon: <ArrowDownwardIcon /> },
      { text: 'Giden Ödemeler', path: '/payments/outgoing', icon: <ArrowUpwardIcon /> },
      { text: 'Cari Hareketler', path: '/current-account-transactions', icon: <SwapHorizIcon /> },
      { text: 'Kasalar', path: '/safes', icon: <AccountBalanceIcon /> },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ open, onToggle, activeMenu }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<Record<string, boolean>>({});

  // Hangi menü grubunu göstereceğimizi belirle
  const getMenuGroups = () => {
    const currentPath = location.pathname;

    // Ürün sayfalarında ürün menülerini göster
    if (activeMenu === 'products' || currentPath.startsWith('/products') || currentPath.startsWith('/categories') || currentPath.startsWith('/brands')) {
      return productMenuGroups;
    }

    // Muhasebe sayfalarında muhasebe menülerini göster
    if (activeMenu === 'sales' || currentPath.startsWith('/orders') || currentPath.startsWith('/promotions') ||
      currentPath.startsWith('/customers') || currentPath.startsWith('/sales-invoices') ||
      currentPath.startsWith('/draft-invoices') || currentPath.startsWith('/purchase-invoices') ||
      currentPath.startsWith('/employees') || currentPath.startsWith('/expense-receipts') ||
      currentPath.startsWith('/receivables') || currentPath.startsWith('/payments') ||
      currentPath.startsWith('/current-account-transactions') || currentPath.startsWith('/safes')) {
      return accountingMenuGroups;
    }

    // Varsayılan olarak ürün menülerini göster
    return productMenuGroups;
  };

  const menuGroups = getMenuGroups();

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
