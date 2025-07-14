import React from 'react';
import { 
  Menu, 
  Grid, 
  Typography, 
  ButtonBase,
  Button
} from '@mui/material';
import { 
  Settings as SettingsIcon,
  AccountTree as AccountTreeIcon,
  PersonAdd as PersonAddIcon,
  Store as StoreIcon,
  Sms as SmsIcon,
  Email as EmailIcon,
  Public as PublicIcon,
  LocalShipping as LocalShippingIcon,
  Lock as LockIconIcon
} from '@mui/icons-material';

// Global buton renk kodları
const ADD_BUTTON_COLOR = '#2a6496';
const EXPORT_BUTTON_COLOR = '#d32f2f';
const PRINT_BUTTON_COLOR = '#d32f2f';

interface SettingsMenuProps {
  anchorEl: null | HTMLElement;
  handleClose: () => void;
  handleMenuItemClick: (id: string) => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({
  anchorEl,
  handleClose,
  handleMenuItemClick
}) => {
  const menuItems = [
    { id: 'general-settings', icon: <SettingsIcon sx={{ color: '#f44336', fontSize: 36 }} />, label: 'General Settings' },
    { id: 'branches', icon: <AccountTreeIcon sx={{ color: '#fff', fontSize: 24 }} />, label: 'Şubeler', isGlobalButton: true },
    { id: 'add-user', icon: <PersonAddIcon sx={{ color: '#000', fontSize: 36 }} />, label: 'Kullanıcı Ekle' },
    { id: 'warehouses', icon: <StoreIcon sx={{ color: '#000', fontSize: 36 }} />, label: 'Depolar' },
    { id: 'sms-settings', icon: <SmsIcon sx={{ color: '#ff9800', fontSize: 36 }} />, label: 'Sms Setting' },
    { id: 'email-settings', icon: <EmailIcon sx={{ color: '#2196f3', fontSize: 36 }} />, label: 'Email Settings' },
    { id: 'country-region', icon: <PublicIcon sx={{ color: '#000', fontSize: 36 }} />, label: 'Ülke&Bölge' },
    { id: 'shipping-areas', icon: <LocalShippingIcon sx={{ color: '#000', fontSize: 36 }} />, label: 'Gönderim Alanları' },
    { id: 'privacy', icon: <LockIconIcon sx={{ color: '#9c27b0', fontSize: 36 }} />, label: 'Gizlilik' }
  ];

  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      sx={{
        mt: 1,
        '& .MuiPaper-root': {
          width: 360,
          maxHeight: '80vh',
          overflowY: 'auto',
          borderRadius: 4,
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          overflow: 'visible',
          p: 2,
          backgroundColor: '#f8f9fa'
        },
      }}
      PaperProps={{
        elevation: 1,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
        },
      }}
    >
      <Typography variant="h6" sx={{ width: '100%', textAlign: 'center', my: 1 }}>Sistem Gereksinimleri</Typography>
      <Grid container spacing={1.5} sx={{ maxHeight: '80vh', overflowY: 'auto' }}>
        {menuItems.map((item) => (
          <Grid item xs={4} key={item.id}>
            {item.isGlobalButton ? (
              <Button
                variant="contained"
                startIcon={item.icon}
                onClick={() => handleMenuItemClick(item.id)}
                sx={{
                  backgroundColor: ADD_BUTTON_COLOR,
                  color: '#ffffff',
                  borderRadius: '30px',
                  padding: '10px 20px',
                  textTransform: 'none',
                  fontWeight: 500,
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
                  '&:hover': {
                    backgroundColor: '#1e4c70',
                    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
                  },
                  width: '100%',
                  height: '48px'
                }}
              >
                {item.label}
              </Button>
            ) : (
              <ButtonBase
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                  borderRadius: 1,
                  p: 1,
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' }
                }}
                onClick={() => handleMenuItemClick(item.id)}
              >
                {item.icon}
                <Typography variant="body2">{item.label}</Typography>
              </ButtonBase>
            )}
          </Grid>
        ))}
      </Grid>
    </Menu>
  );
};

export default SettingsMenu; 