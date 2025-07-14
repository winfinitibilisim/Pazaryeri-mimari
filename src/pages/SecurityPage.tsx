import React from 'react';
import { Box, Typography, Paper, Grid, List, ListItem, ListItemText, ListItemIcon, Divider, Button, TextField } from '@mui/material';
import {
  VpnKey as PasswordIcon,
  PhoneAndroid as TwoFactorIcon,
  History as LoginHistoryIcon,
  Block as BlockedIcon,
  Save as SaveIcon
} from '@mui/icons-material';

const SecurityPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h5" fontWeight="500" sx={{ mb: 3 }}>
        Güvenlik
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Şifre Değiştir
            </Typography>
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                label="Mevcut Şifre"
                type="password"
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Yeni Şifre"
                type="password"
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Yeni Şifre (Tekrar)"
                type="password"
                fullWidth
                margin="normal"
                required
              />
              <Button 
                variant="contained" 
                startIcon={<SaveIcon />} 
                sx={{ mt: 2, bgcolor: '#2980b9' }}
              >
                Şifreyi Güncelle
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 0 }}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <TwoFactorIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="İki Faktörlü Doğrulama" 
                  secondary="Hesabınızı daha güvenli hale getirmek için iki faktörlü doğrulama etkinleştirin" 
                />
                <Button variant="outlined" size="small">
                  Etkinleştir
                </Button>
              </ListItem>
              <Divider />

              <ListItem>
                <ListItemIcon>
                  <LoginHistoryIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Giriş Geçmişi" 
                  secondary="Son oturum açma etkinliğinizi kontrol edin" 
                />
                <Button variant="outlined" size="small">
                  Görüntüle
                </Button>
              </ListItem>
              <Divider />

              <ListItem>
                <ListItemIcon>
                  <BlockedIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Engellenen IP'ler" 
                  secondary="Hesabınıza erişimi engellenen IP adresleri" 
                />
                <Button variant="outlined" size="small">
                  Yönet
                </Button>
              </ListItem>
              <Divider />

              <ListItem>
                <ListItemIcon>
                  <PasswordIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="API Anahtarları" 
                  secondary="API erişim anahtarlarını yönetin" 
                />
                <Button variant="outlined" size="small">
                  Yönet
                </Button>
              </ListItem>
            </List>
          </Paper>
          
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" color="error" gutterBottom>
              Tehlikeli Bölge
            </Typography>
            <Typography variant="body2" paragraph>
              Aşağıdaki işlemler geri alınamaz ve verilerinizin kalıcı olarak silinmesine neden olabilir.
            </Typography>
            <Button variant="outlined" color="error">
              Hesabı Devre Dışı Bırak
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SecurityPage; 