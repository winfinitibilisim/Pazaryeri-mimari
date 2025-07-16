import React, { useState, useEffect } from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Box, 
  useTheme,
  useMediaQuery,
  Divider,
  Badge,
  Tooltip,
  Typography,
  Collapse // Collapse bileşeni @mui/material kütüphanesinden import edildi
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  ReceiptLong as ReceiptLongIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  PeopleOutline as PeopleOutlineIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  FormatListBulleted as FormatListBulletedIcon,
  TrendingUp as TrendingUpIcon,
  Payment as PaymentIcon,
  CompareArrows as CompareArrowsIcon,
  CropFree as CropFreeIcon,
  Article as ArticleIcon,
  Psychology as PsychologyIcon,
  Apps as AppsIcon,
  Logout as LogoutIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  ExpandLess,
  ExpandMore,
  FiberManualRecord as FiberManualRecordIcon,
  WarningAmber as WarningAmberIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ListAlt as VariantsIcon,
  PlaylistAddCheck as ProductOptionsIcon,
  Category as CategoryIcon,
  Bookmark as BrandIcon,
  Tune as ProductFeaturesIcon,
  Class as ProductClassesIcon,
  MoveToInbox as MoveToInboxIcon,
  PendingActions as PendingActionsIcon,
  LocalShipping as LocalShippingIcon,
  AllInbox as AllInboxIcon,
} from '@mui/icons-material';

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

const productMenuGroup: MenuGroup = {
  title: 'Product',
  items: [
    { text: 'Ürünler', path: '/products', icon: <ShoppingCartIcon /> },
    { text: 'Kategori', path: '/products/categories', icon: <CategoryIcon /> },
    { text: 'Markalar', path: '/products/brands', icon: <BrandIcon /> },

  ]
};

const shippingMenuGroup: MenuGroup = {
  title: 'Kargo Yönetimi',
  items: [
    { text: 'Mal Kabul', path: '/shipping/goods-acceptance', icon: <MoveToInboxIcon /> },
    { text: 'Bekleyen Paketler', path: '/shipping/pending-packages', icon: <PendingActionsIcon /> },
    { text: 'Gönderilen Paketler', path: '/shipping/sent-packages', icon: <LocalShippingIcon /> },
    { text: 'Tüm Paketler', path: '/shipping/all-packages', icon: <AllInboxIcon /> },
  ]
};

const menuGroups: MenuGroup[] = [

  {
    title: 'Faturalar & Fişler',
    items: [
      { text: 'Satış Faturaları', icon: <ReceiptIcon />, path: '/sales-invoices' },
      { text: 'Taslak Faturalar', icon: <ArticleIcon />, path: '/draft-invoices' },
      { text: 'Alış Faturaları', icon: <ReceiptLongIcon />, path: '/purchase-invoices' },

    ],
  },
  {
    title: 'Personel',
    items: [
            { text: 'Çalışanlar', icon: <PeopleOutlineIcon />, path: '/employees' },
      { text: 'Gider Fişleri', icon: <ReceiptIcon />, path: '/expense-receipts' },

    ],
  },
  {
    title: 'Finans',
    items: [
      { text: 'Müşteri Alacakları', icon: <ReceiptLongIcon />, path: '/receivables/customer' },
      { text: 'Vadesi Geçen Alacaklar', icon: <WarningAmberIcon />, path: '/receivables/overdue' },
      { text: 'Alacak Raporları', icon: <AssessmentIcon />, path: '/receivables/reports' },
      { text: 'Gelen Ödemeler', icon: <ArrowDownwardIcon />, path: '/payments/incoming' },
      { text: 'Giden Ödemeler', icon: <ArrowUpwardIcon />, path: '/payments/outgoing' },
      { text: 'Cari Hareketler', icon: <CompareArrowsIcon />, path: '/current-account-transactions' },
      { text: 'Kasalar', icon: <AccountBalanceWalletIcon />, path: '/safes' },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ open, onToggle, activeMenu }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<{ [key: string]: boolean }>({});
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleMenuClick = (text: string) => {
    setOpenMenu(prev => ({ ...prev, [text]: !prev[text] }));
  };

  const isActive = (path?: string, subItems?: SubMenuItem[]) => {
    if (path && location.pathname === path) return true;
    if (subItems && subItems.length > 0) {
      return subItems.some((sub: SubMenuItem) => sub.path && location.pathname.startsWith(sub.path));
    }
    return false;
  };

    let displayedMenuGroups: MenuGroup[] = [];
  switch (activeMenu) {
    case 'products':
      displayedMenuGroups = [productMenuGroup];
      break;
    case 'shipping':
      displayedMenuGroups = [shippingMenuGroup];
      break;
    case 'sales':
      displayedMenuGroups = menuGroups.filter(group => group.title === 'Faturalar & Fişler' || group.title === 'Finans');
      break;
    default:
      displayedMenuGroups = menuGroups;
  }

  const drawerContent = (
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
        {activeMenu === 'products'
          ? (
            <React.Fragment>
              {open && (
                <Typography
                  variant="overline"
                  sx={{
                    pl: 2.5, pt: 2, pb: 1, display: 'block', fontWeight: 'bold',
                    color: 'text.secondary', fontSize: '0.65rem', lineHeight: '1.5',
                  }}
                >
                  {productMenuGroup.title}
                </Typography>
              )}
              {productMenuGroup.items.map((item) => (
                <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                  <Tooltip title={open ? '' : item.text} placement="right">
                    <ListItemButton
                      component={Link}
                      to={item.path || '#'}
                      selected={isActive(item.path)}
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
            </React.Fragment>
          )
          : (
            displayedMenuGroups.map((group, groupIndex) => (
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
                {group.items.map((item) => {
                  const hasSubItems = !!item.subItems?.length;
                  const isParentActive = isActive(item.path, item.subItems);

                  if (hasSubItems) {
                    return (
                      <React.Fragment key={item.text}>
                        <ListItemButton
                          onClick={() => handleMenuClick(item.text)}
                          selected={isParentActive}
                          sx={{ mb: 0.5, borderRadius: '8px' }}
                        >
                          <ListItemIcon>{item.icon}</ListItemIcon>
                          {open && <ListItemText primary={item.text} />}
                          {open && (openMenu[item.text] ? <ExpandLess /> : <ExpandMore />)}
                        </ListItemButton>
                        <Collapse in={openMenu[item.text]} timeout="auto" unmountOnExit>
                          <List component="div" disablePadding sx={{ pl: 4 }}>
                            {item.subItems!.map((subItem) => (
                              <ListItemButton
                                key={subItem.text}
                                component={Link}
                                to={subItem.path || '#'}
                                selected={activePath === subItem.path}
                                sx={{ mb: 0.5, borderRadius: '8px' }}
                              >
                                <ListItemIcon>{subItem.icon}</ListItemIcon>
                                {open && <ListItemText primary={subItem.text} />}
                              </ListItemButton>
                            ))}
                          </List>
                        </Collapse>
                      </React.Fragment>
                    );
                  }

                  return (
                    <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                      <Tooltip title={open ? '' : item.text} placement="right">
                        <ListItemButton
                          component={Link}
                          to={item.path || '#'}
                          selected={isParentActive}
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
                  );
                })}
                {groupIndex < displayedMenuGroups.length - 1 && open && <Divider sx={{ my: 1 }} />}
              </React.Fragment>
            ))
          )}
      </List>
    </Box>
  );

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
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;