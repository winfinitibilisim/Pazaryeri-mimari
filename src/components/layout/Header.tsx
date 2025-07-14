import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box, 
  Badge, 
  Avatar, 
  Tooltip
} from '@mui/material';
import { 
  Notifications as NotificationsIcon,
  Apps as AppsIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import NotificationMenu from './NotificationMenu';
import { useNavigate } from 'react-router-dom';
import PasswordChangeDialog from '../profile/PasswordChangeDialog';
import SystemLogsDialog from '../profile/SystemLogsDialog';
import { useLanguage } from '../../contexts/LanguageContext';
import ProfileMenu from './ProfileMenu';
import AppsMenu from './AppsMenu';
import LanguageDialog from './LanguageDialog';
import DeletedItemsDialog from './DeletedItemsDialog';
import HelpDialog from './HelpDialog';
import SettingsMenu from './SettingsMenu';

interface HeaderProps {
  open: boolean;
  onToggle: () => void;
}

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

const Header: React.FC<HeaderProps> = ({ open, onToggle }) => {
  const navigate = useNavigate();
  const [notificationsAnchor, setNotificationsAnchor] = useState<null | HTMLElement>(null);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const [appsAnchor, setAppsAnchor] = useState<null | HTMLElement>(null);
  const [settingsAnchor, setSettingsAnchor] = useState<null | HTMLElement>(null);
  const [activeMenuItems, setActiveMenuItems] = useState<{[key: string]: boolean}>({});
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [systemLogsDialogOpen, setSystemLogsDialogOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('tr');
  const [searchLanguage, setSearchLanguage] = useState('');
  const [deletedItemsDialogOpen, setDeletedItemsDialogOpen] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  
  const languages: LanguageOption[] = [
    { code: 'tr', name: 'Türkçe / Turkish', flag: '🇹🇷' },
    { code: 'en', name: 'İngilizce / English', flag: '🇬🇧' }
  ];

  const filteredLanguages = languages.filter(lang => 
    lang.name.toLowerCase().includes(searchLanguage.toLowerCase())
  );
  
  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(event.currentTarget);
  };
  
  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchor(event.currentTarget);
  };
  
  const handleAppsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAppsAnchor(event.currentTarget);
  };

  // Click handler for Settings menu (not used)
  // const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
  //   setSettingsAnchor(event.currentTarget);
  // };
  
  const handleClose = () => {
    setNotificationsAnchor(null);
    setProfileAnchor(null);
    setAppsAnchor(null);
    setSettingsAnchor(null);
  };

  const handleMenuItemClick = (id: string) => {
    if (id === 'language') {
      setLanguageDialogOpen(true);
      setProfileAnchor(null);
      return;
    }
    if (id === 'change-password') {
      setPasswordDialogOpen(true);
      setProfileAnchor(null);
      return;
    }
    if (id === 'system-logs') {
      setSystemLogsDialogOpen(true);
      setProfileAnchor(null);
      return;
    }
    if (id === 'deleted-items') {
      setDeletedItemsDialogOpen(true);
      setProfileAnchor(null);
      return;
    }
    if (id === 'help') {
      setHelpDialogOpen(true);
      setProfileAnchor(null);
      return;
    }
    // Redirect to SMS settings page
    if (id === 'sms-settings') {
      navigate('/sms-settings');
      setSettingsAnchor(null);
      return;
    }
    
    // Redirect to Email settings page
    if (id === 'email-settings') {
      navigate('/email-settings');
      setSettingsAnchor(null);
      return;
    }
    setActiveMenuItems(prev => ({...prev, [id]: true}));
    setTimeout(() => {
      setActiveMenuItems(prev => ({...prev, [id]: false}));
    }, 150);
  };

  const handleLanguageDialogClose = () => {
    setLanguageDialogOpen(false);
    setSearchLanguage('');
  };

  // Use LanguageContext for language change
  const { t, setLanguage, language } = useLanguage();
  
  const handleLanguageSelect = (code: string) => {
    setSelectedLanguage(code);
    // Notify central language management
    setLanguage(code);
  };

  const handleLanguageConfirm = () => {
    console.log('Language changed:', selectedLanguage);
    handleLanguageDialogClose();
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
      setLanguage(savedLanguage);
    }
  }, [setLanguage]);

  const getMenuItemStyle = (id: string) => {
    return {
      py: 1.5,
      px: 2,
      transition: 'background-color 0.2s',
      '&:hover': {
        backgroundColor: '#f5f5f5',
      }
    };
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleRestore = (id: number) => {
    console.log(`Data restored: ${id}`);
  };

  const handleLogout = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('Logged out');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: 1,
        backgroundColor: '#2980b9',
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="toggle menu"
              onClick={onToggle}
              edge="start"
              sx={{
                marginRight: 2,
                zIndex: 1300,
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                padding: '8px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill="currentColor" />
              </svg>
            </IconButton>
            <Box 
              onClick={handleLogoClick}
              sx={{ 
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                ml: 1,
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 }
              }}
            >
              <img 
                src={`${process.env.PUBLIC_URL}/images/logo-white.png`} 
                alt="Winfiniti Logo" 
                style={{ height: '50px', width: 'auto' }} 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = `${process.env.PUBLIC_URL}/logo192.png`;
                }}
              />
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title={t('general.notifications')}>
              <IconButton
                size="large"
                aria-label="new notifications"
                color="inherit"
                onClick={handleNotificationsClick}
              >
                <Badge badgeContent={4} color="error" sx={{ '& .MuiBadge-badge': { backgroundColor: '#e74c3c' } }}>
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <NotificationMenu 
              anchorEl={notificationsAnchor} 
              open={Boolean(notificationsAnchor)} 
              onClose={handleClose} 
            />
            
            <Tooltip title={t('general.profile')}>
              <IconButton
                size="large"
                edge="end"
                aria-label="user account"
                color="inherit"
                onClick={handleProfileClick}
                sx={{ ml: 1 }}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: '#fff',
                    border: '2px solid #ffffff',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                >
                  <Typography sx={{ color: '#2980b9', fontWeight: 'bold' }}>A</Typography>
                </Avatar>
              </IconButton>
            </Tooltip>
            
            <ProfileMenu 
              profileAnchor={profileAnchor}
              handleClose={handleClose}
              handleMenuItemClick={handleMenuItemClick}
              getMenuItemStyle={getMenuItemStyle} // Not used but kept because it's defined in the interface
              activeMenuItems={activeMenuItems} // Kullanılmıyor ama interface'de tanımlı olduğu için bırakıldı
              handleLogout={handleLogout}
            />

            <PasswordChangeDialog 
              open={passwordDialogOpen} 
              onClose={() => setPasswordDialogOpen(false)} 
            />

            <SystemLogsDialog 
              open={systemLogsDialogOpen} 
              onClose={() => setSystemLogsDialogOpen(false)} 
            />

            <LanguageDialog
              open={languageDialogOpen}
              onClose={handleLanguageDialogClose}
              languages={languages}
              selectedLanguage={selectedLanguage}
              searchLanguage={searchLanguage}
              setSearchLanguage={setSearchLanguage}
              handleLanguageSelect={handleLanguageSelect}
              handleLanguageConfirm={handleLanguageConfirm}
              filteredLanguages={filteredLanguages}
            />

            <Tooltip title={t('general.modules')}>
              <IconButton 
                color="inherit"
                sx={{ ml: 1 }}
                onClick={handleAppsClick}
              >
                <AppsIcon />
              </IconButton>
            </Tooltip>
            
            <AppsMenu
              appsAnchor={appsAnchor}
              handleClose={handleClose}
              activeMenuItems={activeMenuItems} // Kullanılmıyor ama interface'de tanımlı olduğu için bırakıldı
              handleMenuItemClick={handleMenuItemClick}
            />

            <SettingsMenu
              anchorEl={settingsAnchor}
              handleClose={handleClose}
              handleMenuItemClick={handleMenuItemClick}
            />

            <DeletedItemsDialog
              open={deletedItemsDialogOpen}
              onClose={() => setDeletedItemsDialogOpen(false)}
              handleRestore={handleRestore}
            />

            <HelpDialog
              open={helpDialogOpen}
              onClose={() => setHelpDialogOpen(false)}
            />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 