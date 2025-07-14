import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Badge,
  Tabs,
  Tab,
  Button,
  Card,
  CardContent
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import AlertNotification from '../components/common/AlertNotification';

interface NotificationData {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

const NotificationsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [notifications, setNotifications] = useState<NotificationData[]>([
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
    { id: 11, title: 'Yeni Sipariş', description: 'Sipariş #1234', timestamp: '18/01/2025:14:15', read: true },
    { id: 12, title: 'Yeni Müşteri', description: 'John Doe', timestamp: '18/01/2025:10:30', read: true },
    { id: 13, title: 'Sipariş İptal', description: 'Sipariş #1122', timestamp: '17/01/2025:09:45', read: true },
    { id: 14, title: 'Stok Uyarısı', description: 'Ürün #A5521', timestamp: '16/01/2025:16:20', read: true },
    { id: 15, title: 'Sistem Güncellemesi', description: 'v2.4.1', timestamp: '15/01/2025:07:00', read: true },
  ]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleDelete = (id: number) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== id)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };

  const filteredNotifications = tabValue === 0 
    ? notifications 
    : tabValue === 1 
      ? notifications.filter(notification => !notification.read)
      : notifications.filter(notification => notification.read);

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <Box sx={{ p: 3 }}>
      {/* Merkezi Bildirim Sistemi Örneği */}
      <Card elevation={1} sx={{ mb: 4 }}>
        <CardContent>
          <AlertNotification />
        </CardContent>
      </Card>
      
      {/* Bildirim Listesi */}
      <Card elevation={1}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Badge badgeContent={unreadCount} color="error" sx={{ mr: 2 }}>
                <NotificationsIcon fontSize="large" color="primary" />
              </Badge>
              <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
                Bildirimler
              </Typography>
            </Box>
            <Box>
              <Button 
                startIcon={<CheckCircleIcon />} 
                variant="outlined" 
                sx={{ mr: 1 }}
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                Tümünü Okundu İşaretle
              </Button>
              <Button 
                startIcon={<RefreshIcon />} 
                variant="contained"
              >
                Yenile
              </Button>
            </Box>
          </Box>

          <Paper elevation={0} sx={{ mb: 3 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Tümü" />
              <Tab label={`Okunmamış (${unreadCount})`} />
              <Tab label="Okunmuş" />
            </Tabs>
          </Paper>

          <Box sx={{ 
            backgroundColor: '#f8f9fa', 
            borderRadius: 1,
            border: '1px solid #e0e0e0',
            maxHeight: 600,
            overflow: 'auto'
          }}>
            <List sx={{ p: 0 }}>
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <React.Fragment key={notification.id}>
                    <ListItem 
                      sx={{ 
                        backgroundColor: notification.read ? 'white' : '#f0f7ff',
                        py: 1.5,
                        px: 2,
                        '&:hover': { bgcolor: '#f5f5f5' }
                      }}
                      secondaryAction={
                        <Box>
                          {!notification.read && (
                            <IconButton 
                              edge="end" 
                              aria-label="mark as read"
                              onClick={() => handleMarkAsRead(notification.id)}
                              sx={{ mr: 1 }}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          )}
                          <IconButton 
                            edge="end" 
                            aria-label="delete"
                            onClick={() => handleDelete(notification.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemIcon>
                        <Box 
                          sx={{ 
                            color: notification.read ? '#9e9e9e' : '#1976d2',
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            backgroundColor: notification.read ? '#f5f5f5' : '#e3f2fd'
                          }}
                        >
                          <NotificationsIcon />
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body1" sx={{ 
                              fontWeight: notification.read ? 'normal' : 'bold' 
                            }}>
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
                ))
              ) : (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    Bildirim bulunamadı
                  </Typography>
                </Box>
              )}
            </List>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default NotificationsPage; 