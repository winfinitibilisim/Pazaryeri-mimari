import React from 'react';
import {
  Box,
  Typography,
  Menu,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';

interface NotificationData {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

interface NotificationMenuProps {
  anchorEl: null | HTMLElement;
  open: boolean;
  onClose: () => void;
}

const NotificationMenu: React.FC<NotificationMenuProps> = ({ anchorEl, open, onClose }) => {
  const navigate = useNavigate();
  
  // Sample notification data matching the screenshot
  const notifications: NotificationData[] = [
    { id: 1, title: 'Dosya İndirme', description: 'Tek Satır Exel', timestamp: '28/01/2025:19:31', read: false },
    { id: 2, title: 'Dosya İndirme', description: 'Tek Satır Exel', timestamp: '28/01/2025:19:31', read: false },
    { id: 3, title: 'Dosya İndirme', description: 'Tek Satır Exel', timestamp: '19/01/2025:17:24', read: false },
    { id: 4, title: 'Dosya İndirme', description: 'Tek Satır Exel', timestamp: '19/01/2025:17:24', read: false },
    { id: 5, title: 'Dosya İndirme', description: 'Tek Satır Exel', timestamp: '19/01/2025:17:24', read: false },
    { id: 6, title: 'Dosya İndirme', description: 'Tek Satır Exel', timestamp: '19/01/2025:17:23', read: false },
    { id: 7, title: 'Dosya İndirme', description: 'Tek Satır Exel', timestamp: '19/01/2025:17:23', read: false },
    { id: 8, title: 'Dosya İndirme', description: 'Tek Satır Exel', timestamp: '19/01/2025:17:23', read: false },
    { id: 9, title: 'Dosya İndirme', description: 'Tek Satır Exel', timestamp: '19/01/2025:17:23', read: false },
    { id: 10, title: 'Dosya İndirme', description: 'Tek Satır Exel', timestamp: '19/01/2025:17:23', read: false },
  ];

  const handleShowAll = () => {
    onClose();
    navigate('/notifications');
  };

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
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 320,
          maxHeight: '80vh',
          borderRadius: 1,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          p: 0,
        }
      }}
    >
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: 'white',
        p: 2,
        borderBottom: '1px solid #eee'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Bildirimler
        </Typography>
        <Typography variant="subtitle1">
          Dosyalar
        </Typography>
      </Box>

      {/* Notification List */}
      <List sx={{ p: 0, maxHeight: 500, overflow: 'auto' }}>
        {notifications.map((notification) => (
          <React.Fragment key={notification.id}>
            <ListItem 
              button
              onClick={onClose}
              sx={{ 
                py: 1.5,
                px: 2,
                '&:hover': { bgcolor: '#f5f5f5' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Box 
                  sx={{ 
                    color: '#707070',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <NotificationsIcon sx={{ fontSize: 24 }} />
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {notification.title}:
                    </Typography>
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      {notification.description}
                    </Typography>
                  </Box>
                }
                secondary={notification.timestamp}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>

      {/* Footer */}
      <Box sx={{ p: 1.5, textAlign: 'center' }}>
        <Button 
          fullWidth
          onClick={handleShowAll}
          sx={{ 
            color: 'text.primary',
            textTransform: 'none',
            fontWeight: 'medium'
          }}
        >
          Tümünü Göster
        </Button>
      </Box>
    </Menu>
  );
};

export default NotificationMenu; 