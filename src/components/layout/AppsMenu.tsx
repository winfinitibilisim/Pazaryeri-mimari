import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Menu, 
  Grid, 
  Typography, 
  Box,
  Paper,
  ButtonBase
} from '@mui/material';
import { 
  Settings as SettingsIcon,
  AccountTree as AccountTreeIcon,
  PersonAdd as PersonAddIcon,
  Store as StoreIcon,
  Sms as SmsIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  LocalShipping as ShippingIcon,
  Lock as LockIcon,
  // Kullanılmayan ikonlar kaldırıldı
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface AppsMenuProps {
  appsAnchor: null | HTMLElement;
  handleClose: () => void;
  // Kullanılmayan prop
  activeMenuItems: {[key: string]: boolean};
  handleMenuItemClick: (id: string) => void;

}

const AppsMenu: React.FC<AppsMenuProps> = ({ 
  appsAnchor, 
  handleClose, 
  // Kullanılmayan prop
  activeMenuItems, 
  handleMenuItemClick
}) => {
    const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Menü öğesine tıklandığında çalışacak fonksiyon
  const handleItemClick = (id: string) => {
    handleMenuItemClick(id);
    navigate(`/${id}`);
    handleClose();
  };
  
  // Gizlilik butonu için özel işlev
  const handlePrivacyClick = () => {
    handleMenuItemClick('privacy');
    navigate('/privacy');
    handleClose();
  };

  // Ayarlar menüsü öğeleri
  const settingsItems = [
    { 
      id: 'general-settings', 
      icon: <SettingsIcon sx={{ color: '#ff9800', fontSize: 40 }} />, 
      name: t('sidebar.generalSettings') 
    },
    { 
      id: 'branches', 
      icon: <AccountTreeIcon sx={{ color: '#333', fontSize: 40 }} />, 
      name: t('sidebar.branches') 
    },
    { 
      id: 'user-management', 
      icon: <PersonAddIcon sx={{ color: '#333', fontSize: 40 }} />, 
      name: t('sidebar.userManagement') 
    },
    { 
      id: 'warehouses', 
      icon: <StoreIcon sx={{ color: '#333', fontSize: 40 }} />, 
      name: t('sidebar.warehouses') 
    },
    { 
      id: 'sms-settings', 
      icon: <SmsIcon sx={{ color: '#ff9800', fontSize: 40 }} />, 
      name: t('sidebar.smsSettings') 
    },
    { 
      id: 'email-settings', 
      icon: <EmailIcon sx={{ color: '#2196f3', fontSize: 40 }} />, 
      name: t('sidebar.emailSettings') 
    },
    { 
      id: 'countries', 
      icon: <LocationIcon sx={{ color: '#2196f3', fontSize: 40 }} />, 
      name: t('sidebar.countries') 
    },
    { 
      id: 'shipping-areas', 
      icon: <ShippingIcon sx={{ color: '#333', fontSize: 40 }} />, 
      name: t('sidebar.shippingAreas') 
    },
    { 
      id: 'privacy', 
      icon: <LockIcon sx={{ color: '#9c27b0', fontSize: 40 }} />, 
      name: t('sidebar.privacy'),
      onClick: handlePrivacyClick
    }
  ];

  // Finans menüsü öğeleri - şu an kullanılmıyor, ileride eklenebilir
  /*
  const financeItems = [
    { 
      id: 'taxes', 
      icon: <TaxesIcon sx={{ color: '#3f51b5', fontSize: 40 }} />, 
      name: 'Vergiler' 
    },
    { 
      id: 'withholding-tax', 
      icon: <WithholdingTaxIcon sx={{ color: '#009688', fontSize: 40 }} />, 
      name: 'Stopaj Vergisi' 
    },
    { 
      id: 'deduction-tax', 
      icon: <DeductionTaxIcon sx={{ color: '#e91e63', fontSize: 40 }} />, 
      name: 'Tevkifat Vergisi' 
    },
    { 
      id: 'vat', 
      icon: <TaxesIcon sx={{ color: '#ff5722', fontSize: 40 }} />, 
      name: 'KDV' 
    }
  ];
  */

  // Render a submenu when user clicks on a menu item with subitems
  const handleSubMenuClick = (item: any) => {
    if (item.subItems && item.subItems.length > 0) {
      // Show submenu options
      const subMenuDialog = document.createElement('div');
      subMenuDialog.style.position = 'fixed';
      subMenuDialog.style.top = '0';
      subMenuDialog.style.left = '0';
      subMenuDialog.style.width = '100%';
      subMenuDialog.style.height = '100%';
      subMenuDialog.style.backgroundColor = 'rgba(0,0,0,0.5)';
      subMenuDialog.style.zIndex = '9999';
      subMenuDialog.style.display = 'flex';
      subMenuDialog.style.justifyContent = 'center';
      subMenuDialog.style.alignItems = 'center';
      
      const subMenuContent = document.createElement('div');
      subMenuContent.style.backgroundColor = 'white';
      subMenuContent.style.borderRadius = '8px';
      subMenuContent.style.padding = '16px';
      subMenuContent.style.minWidth = '250px';
      
      const subMenuTitle = document.createElement('h3');
      subMenuTitle.textContent = item.name;
      subMenuTitle.style.marginBottom = '16px';
      subMenuTitle.style.textAlign = 'center';
      subMenuContent.appendChild(subMenuTitle);
      
      item.subItems.forEach((subItem: any) => {
        const subItemButton = document.createElement('button');
        subItemButton.textContent = subItem.name;
        subItemButton.style.display = 'block';
        subItemButton.style.width = '100%';
        subItemButton.style.padding = '8px 16px';
        subItemButton.style.margin = '8px 0';
        subItemButton.style.textAlign = 'left';
        subItemButton.style.backgroundColor = '#f5f5f5';
        subItemButton.style.border = 'none';
        subItemButton.style.borderRadius = '4px';
        subItemButton.style.cursor = 'pointer';
        subItemButton.onclick = () => {
          navigate(subItem.path);
          document.body.removeChild(subMenuDialog);
          handleClose();
        };
        subItemButton.onmouseover = () => {
          subItemButton.style.backgroundColor = '#e0e0e0';
        };
        subItemButton.onmouseout = () => {
          subItemButton.style.backgroundColor = '#f5f5f5';
        };
        subMenuContent.appendChild(subItemButton);
      });
      
      const closeButton = document.createElement('button');
      closeButton.textContent = 'Kapat';
      closeButton.style.display = 'block';
      closeButton.style.width = '100%';
      closeButton.style.padding = '8px 16px';
      closeButton.style.marginTop = '16px';
      closeButton.style.backgroundColor = '#f44336';
      closeButton.style.color = 'white';
      closeButton.style.border = 'none';
      closeButton.style.borderRadius = '4px';
      closeButton.style.cursor = 'pointer';
      closeButton.onclick = () => {
        document.body.removeChild(subMenuDialog);
      };
      subMenuContent.appendChild(closeButton);
      
      subMenuDialog.appendChild(subMenuContent);
      document.body.appendChild(subMenuDialog);
      
      // Close submenu when clicking outside
      subMenuDialog.onclick = (e) => {
        if (e.target === subMenuDialog) {
          document.body.removeChild(subMenuDialog);
        }
      };
    } else {
      // Regular menu item without subitems
      item.onClick ? item.onClick() : handleItemClick(item.id);
    }
  };

  const renderMenuItem = (item: any) => (
    <Grid item xs={4} key={item.id}>
      <Paper 
        elevation={0}
        sx={{ 
          backgroundColor: 'rgba(0,0,0,0.02)', 
          borderRadius: 2,
          height: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <ButtonBase
          onClick={() => handleSubMenuClick(item)}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 2,
            px: 1,
            width: '100%',
            height: '100%',
            borderRadius: 2,
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.05)',
            },
          }}
        >
          {item.icon}
          <Typography 
            variant="body2" 
            sx={{ 
              mt: 1, 
              textAlign: 'center', 
              fontSize: '0.8rem',
              fontWeight: 500,
              color: '#333'
            }}
          >
            {item.name}
          </Typography>
        </ButtonBase>
      </Paper>
    </Grid>
  );

  return (
    <Menu
      anchorEl={appsAnchor}
      id="apps-menu"
      open={Boolean(appsAnchor)}
      onClose={handleClose}
      PaperProps={{
        elevation: 3,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
          mt: 1.5,
          width: 400,
          maxWidth: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          borderRadius: 3,
          p: 2,
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 16,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Box sx={{ pb: 2 }}>
        <Typography 
          variant="h6" 
          align="center" 
          fontWeight="500" 
          sx={{ mb: 2 }}
        >
          Sistem Gereksinimleri
        </Typography>
        
        <Grid container spacing={2}>
          {settingsItems.map(renderMenuItem)}
        </Grid>
        
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mt: 4, 
            mb: 2 
          }}
        >
          <ButtonBase
            sx={{
              py: 2,
              px: 4,
              borderRadius: 50,
              border: '1px solid #3f51b5',
              color: '#3f51b5',
              fontWeight: 'medium',
              '&:hover': {
                backgroundColor: 'rgba(63, 81, 181, 0.08)',
              },
            }}
            onClick={() => {
              // LocationAndTaxes sayfasına yönlendirme
              navigate('/location-and-taxes');
              handleClose();
            }}
          >
            <Typography variant="button" sx={{ fontWeight: 'medium' }}>
              Diğer menülere göz atınız
            </Typography>
          </ButtonBase>
        </Box>
      </Box>
    </Menu>
  );
};

export default AppsMenu; 