import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  TextField, 
  Button, 
  Switch, 
  FormControlLabel, 
  Divider,
  Card,
  CardContent,
  CardHeader,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Save as SaveIcon,
  Sms as SmsIcon,
  Send as SendIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { notifySuccess, notifyError } from '../utils/notification';

const SmsSettingsPage: React.FC = () => {
  // SMS ayarları için state'ler
  const [apiKey, setApiKey] = useState<string>('');
  const [secretKey, setSecretKey] = useState<string>('');
  const [senderName, setSenderName] = useState<string>('');
  const [endpoint, setEndpoint] = useState<string>('https://api.example.com/sms');
  const [enabled, setEnabled] = useState<boolean>(false);
  const [testNumber, setTestNumber] = useState<string>('');
  const [testMessage, setTestMessage] = useState<string>('Bu bir test SMS mesajıdır.');
  const [showSecretKey, setShowSecretKey] = useState<boolean>(false);

  // Ayarları kaydetme fonksiyonu
  const handleSaveSettings = () => {
    try {
      // Burada gerçek bir API çağrısı yapılabilir
      // Şimdilik sadece başarılı olduğunu varsayalım
      
      // Başarılı bildirim göster
      notifySuccess('SMS ayarları başarıyla kaydedildi!', { autoHideDuration: 3000 });
    } catch (error) {
      // Hata bildirimi göster
      notifyError('SMS ayarları kaydedilirken bir hata oluştu!', { autoHideDuration: 3000 });
    }
  };

  // Test SMS gönderme fonksiyonu
  const handleSendTestSms = () => {
    if (!testNumber) {
      notifyError('Lütfen bir telefon numarası girin!', { autoHideDuration: 3000 });
      return;
    }

    try {
      // Burada gerçek bir SMS gönderme API çağrısı yapılabilir
      // Şimdilik sadece başarılı olduğunu varsayalım
      
      // Başarılı bildirim göster
      notifySuccess(`Test SMS'i ${testNumber} numarasına başarıyla gönderildi!`, { autoHideDuration: 3000 });
    } catch (error) {
      // Hata bildirimi göster
      notifyError('Test SMS gönderilirken bir hata oluştu!', { autoHideDuration: 3000 });
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="500" sx={{ mb: 3 }}>
        <SmsIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#ff9800' }} />
        SMS Ayarları
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              SMS Servis Yapılandırması
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={enabled} 
                      onChange={(e) => setEnabled(e.target.checked)} 
                      color="primary"
                    />
                  }
                  label="SMS Servisini Etkinleştir"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="API Anahtarı"
                  fullWidth
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  margin="normal"
                  variant="outlined"
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Gizli Anahtar"
                  fullWidth
                  type={showSecretKey ? 'text' : 'password'}
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  margin="normal"
                  variant="outlined"
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowSecretKey(!showSecretKey)}
                          edge="end"
                        >
                          {showSecretKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Gönderen Adı"
                  fullWidth
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  margin="normal"
                  variant="outlined"
                  helperText="SMS'lerde görünecek gönderen adı"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="API Endpoint"
                  fullWidth
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<SaveIcon />}
                  onClick={handleSaveSettings}
                  sx={{ mt: 2 }}
                >
                  Ayarları Kaydet
                </Button>
              </Grid>
            </Grid>
          </Paper>
          
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Test SMS Gönder
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Telefon Numarası"
                  fullWidth
                  value={testNumber}
                  onChange={(e) => setTestNumber(e.target.value)}
                  margin="normal"
                  variant="outlined"
                  placeholder="+90 5XX XXX XX XX"
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Test Mesajı"
                  fullWidth
                  multiline
                  rows={3}
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  startIcon={<SendIcon />}
                  onClick={handleSendTestSms}
                  sx={{ mt: 1 }}
                >
                  Test SMS Gönder
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardHeader title="SMS Bilgileri" />
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Durum
              </Typography>
              <Typography variant="body1" gutterBottom color={enabled ? "success.main" : "error.main"}>
                {enabled ? "Aktif" : "Pasif"}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                Gönderen Adı
              </Typography>
              <Typography variant="body1" gutterBottom>
                {senderName || "-"}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                API Sağlayıcı
              </Typography>
              <Typography variant="body1">
                {endpoint.includes('example.com') ? "Tanımlanmamış" : endpoint.split('/')[2]}
              </Typography>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader title="SMS Kullanım Bilgileri" />
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Aylık Kota
              </Typography>
              <Typography variant="body1" gutterBottom>
                1000 SMS
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                Kullanılan
              </Typography>
              <Typography variant="body1" gutterBottom>
                0 SMS
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                Kalan
              </Typography>
              <Typography variant="body1">
                1000 SMS
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SmsSettingsPage;
