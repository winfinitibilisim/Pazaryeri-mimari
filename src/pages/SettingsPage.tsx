import React from 'react';
import { Box, Typography, Paper, Grid, List, ListItem, ListItemText, ListItemIcon, Divider, Switch } from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Security as SecurityIcon,
  ColorLens as ThemeIcon,
  Storage as DataIcon
} from '@mui/icons-material';

const SettingsPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h5" fontWeight="500" sx={{ mb: 3 }}>
        Ayarlar
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 0 }}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText primary="Bildirim Ayarları" secondary="E-posta ve uygulama içi bildirimlerini yönet" />
                <Switch defaultChecked />
              </ListItem>
              <Divider />

              <ListItem>
                <ListItemIcon>
                  <LanguageIcon />
                </ListItemIcon>
                <ListItemText primary="Dil Ayarları" secondary="Uygulama dilini değiştir" />
                <Typography variant="body2" color="text.secondary">Türkçe</Typography>
              </ListItem>
              <Divider />

              <ListItem>
                <ListItemIcon>
                  <SecurityIcon />
                </ListItemIcon>
                <ListItemText primary="Güvenlik Ayarları" secondary="Şifre ve güvenlik tercihlerini güncelle" />
              </ListItem>
              <Divider />

              <ListItem>
                <ListItemIcon>
                  <ThemeIcon />
                </ListItemIcon>
                <ListItemText primary="Tema Ayarları" secondary="Uygulama görünümünü özelleştir" />
                <Switch />
              </ListItem>
              <Divider />

              <ListItem>
                <ListItemIcon>
                  <DataIcon />
                </ListItemIcon>
                <ListItemText primary="Veri Yedekleme" secondary="Otomatik yedekleme seçenekleri" />
                <Switch defaultChecked />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sistem Bilgisi
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Uygulama Sürümü
              </Typography>
              <Typography variant="body1" gutterBottom>
                v1.0.0
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                Son Güncelleme
              </Typography>
              <Typography variant="body1">
                10 Mayıs 2023
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SettingsPage; 