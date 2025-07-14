/**
 * ProfileMenu Component
 * 
 * Displays the user profile menu. This menu allows the user to access profile settings,
 * system logs, password change, and logout operations.
 */

import React from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  Avatar,
  Button
} from '@mui/material';
import {
  Logout as LogoutIcon,
  History as HistoryIcon,
  DeleteOutline as DeleteIcon,
  VpnKey as VpnKeyIcon,
  Language as LanguageIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

/**
 * Props interface for ProfileMenu component
 */
interface ProfileMenuProps {
  /** HTML element where the menu will be positioned */
  profileAnchor: null | HTMLElement;
  
  /** Handler for closing the menu */
  handleClose: () => void;
  
  /** Handler that will run when a menu item is clicked */
  handleMenuItemClick: (id: string) => void;
  
  /** Function that returns the style of a menu item */
  getMenuItemStyle: (id: string) => object;
  
  /** Object holding the state of active menu items */
  activeMenuItems: {[key: string]: boolean};
  
  /** Logout handler */
  handleLogout: () => void;
}

/**
 * Profile Menu Component
 */
const ProfileMenu: React.FC<ProfileMenuProps> = ({ 
  profileAnchor, 
  handleClose, 
  handleMenuItemClick, 
  handleLogout
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <Menu
      anchorEl={profileAnchor}
      id="profile-menu"
      open={Boolean(profileAnchor)}
      onClose={handleClose}
      PaperProps={{
        elevation: 2,
        sx: {
          borderRadius: 2,
          p: 0,
          minWidth: 300,
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.12))',
          mt: 1.5,
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
      {/* Profile Information */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        py: 2,
        px: 2,
      }}>
        <Avatar sx={{ width: 48, height: 48, mb: 1.5, bgcolor: '#2980b9' }}>A</Avatar>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Ahmet Durmaz</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>ahmetdurmazz@gmail.com</Typography>
        <Button 
          variant="outlined" 
          fullWidth 
          sx={{ 
            borderRadius: '20px', 
            textTransform: 'none', 
            borderColor: 'grey.400',
            color: 'text.primary'
          }}
          onClick={() => navigate('/profile')}
        >
          {t('profile.manageAccount')}
        </Button>
      </Box>
      <Divider />

      {/* Menu Items */}
      <Box sx={{ p: 1 }}>
        <MenuItem onClick={() => handleMenuItemClick('language')}>
          <ListItemIcon>
            <LanguageIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('profile.language')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('change-password')}>
          <ListItemIcon>
            <VpnKeyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('profile.changePassword')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('system-logs')}>
          <ListItemIcon>
            <HistoryIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('profile.systemLogs')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('deleted-items')}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('profile.deletedItems')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('help')}>
          <ListItemIcon>
            <HelpIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('profile.help')}</ListItemText>
        </MenuItem>
      </Box>
      <Divider />

      {/* Logout */}
      <Box sx={{ p: 1 }}>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('profile.logout')}</ListItemText>
        </MenuItem>
      </Box>
      <Divider />

      {/* Footer */}
      <Box sx={{ 
        p: 1.5, 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Typography variant="caption" color="text.secondary">{t('profile.privacyPolicy')}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mx: 0.5 }}>•</Typography>
        <Typography variant="caption" color="text.secondary">{t('profile.termsOfService')}</Typography>
      </Box>
    </Menu>
  );
};

export default ProfileMenu;