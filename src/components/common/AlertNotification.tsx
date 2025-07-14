import React, { useState, useCallback, memo } from 'react';
import { 
  Button, 
  FormControlLabel, 
  FormControl, 
  FormLabel, 
  RadioGroup, 
  Radio, 
  Stack,
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Divider,
  Paper
} from '@mui/material';
import { 
  useNotifications, 
  NotificationSeverity 
} from '../../contexts/NotificationContext';

/**
 * Bildirim örnek bileşeni
 * Bu bileşen, farklı türlerde bildirimler göstermek için kullanılabilir
 * @returns {JSX.Element} AlertNotification bileşeni
 */
const AlertNotification: React.FC = () => {
  const notifications = useNotifications();
  const [severity, setSeverity] = useState<NotificationSeverity>('info');

  // Test mesajları - Başarılı durumlar
  const successMessages = {
    save: 'Veriler başarıyla kaydedildi.',
    update: 'Kullanıcı bilgileri başarıyla güncellendi.',
    delete: 'Kayıt başarıyla silindi.',
    create: 'Yeni kayıt oluşturulurken bir hata oluştu.',
    generic: 'İşlem başarıyla tamamlandı.'
  } as const;

  type ActionKey = keyof typeof successMessages;
  const [actionType, setActionType] = useState<ActionKey>('generic');
  
  // Test mesajları - Başarısız durumlar
  const errorMessages = {
    save: 'Veriler kaydedilirken bir hata oluştu!',
    update: 'Kullanıcı bilgileri güncellenirken bir hata oluştu!',
    delete: 'Kayıt silinirken bir hata oluştu!',
    create: 'Yeni kayıt oluşturulurken bir hata oluştu!',
    generic: 'İşlem sırasında bir hata oluştu! Lütfen tekrar deneyin.',
    connection: 'Sunucu bağlantısı sağlanamadı. Lütfen internet bağlantınızı kontrol edin.'
  } as const; // Tip güvenliği için const assertion

  // Standart bildirim gösterme fonksiyonu
  const showStandardNotification = useCallback(() => {
    try {
      const message = severity === 'error' ? errorMessages[actionType] : successMessages[actionType];
      
      notifications.show(message, {
        severity,
        actionType,
        autoHideDuration: 4000,
      });
    } catch (error) {
      console.error('Bildirim gösterilirken hata oluştu:', error);
      notifications.showError('Bildirim gösterilirken bir hata oluştu.');
    }
  }, [notifications, severity, actionType, successMessages, errorMessages]);

  // Özel bildirim fonksiyonlarını test etme
  const showSpecialNotification = useCallback((type: string) => {
    try {
      switch(type) {
        case 'success':
          notifications.showSuccess(successMessages.generic);
          break;
        case 'error':
          notifications.showError(errorMessages.generic);
          break;
        case 'save':
          notifications.showSaveSuccess(successMessages.save);
          break;
        case 'save-error':
          notifications.showError(errorMessages.save);
          break;
        case 'update':
          notifications.showUpdateSuccess(successMessages.update);
          break;
        case 'update-error':
          notifications.showError(errorMessages.update);
          break;
        case 'delete':
          notifications.showDeleteSuccess(successMessages.delete);
          break;
        case 'delete-error':
          notifications.showError(errorMessages.delete);
          break;
        case 'create':
          notifications.showCreateSuccess(successMessages.create);
          break;
        case 'create-error':
          notifications.showError(errorMessages.create);
          break;
        case 'connection-error':
          notifications.showError(errorMessages.connection);
          break;
        default:
          notifications.show('Test bildirim');
      }
    } catch (error) {
      console.error('Özel bildirim gösterilirken hata oluştu:', error);
      notifications.showError('Bildirim gösterilirken bir hata oluştu.');
    }
  }, [notifications, successMessages, errorMessages]);

  return (
    <Card variant="outlined" sx={{ maxWidth: 800, mx: 'auto' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Bildirim Sistemi Testi
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Bu bileşen, uygulamanın herhangi bir yerinde kullanılabilecek merkezi bildirim sistemini test etmek için kullanılır.
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Standart Bildirim
            </Typography>
            
            <Stack spacing={2}>
              <FormControl component="fieldset">
                <FormLabel id="alert-notification-severity">Bildirim Türü</FormLabel>
                <RadioGroup
                  row
                  value={severity}
                  onChange={(event) => setSeverity(event.target.value as NotificationSeverity)}
                  aria-labelledby="alert-notification-severity"
                  name="severity"
                >
                  <FormControlLabel value="info" control={<Radio />} label="Bilgi" />
                  <FormControlLabel value="success" control={<Radio />} label="Başarılı" />
                  <FormControlLabel value="warning" control={<Radio />} label="Uyarı" />
                  <FormControlLabel value="error" control={<Radio />} label="Hata" />
                </RadioGroup>
              </FormControl>
              
              <FormControl component="fieldset">
                <FormLabel id="alert-notification-action-type">İşlem Türü</FormLabel>
                <RadioGroup
                  row
                  value={actionType}
                  onChange={(event) => setActionType(event.target.value as ActionKey)}
                  aria-labelledby="alert-notification-action-type"
                  name="actionType"
                >
                  <FormControlLabel value="generic" control={<Radio />} label="Genel" />
                  <FormControlLabel value="save" control={<Radio />} label="Kaydetme" />
                  <FormControlLabel value="update" control={<Radio />} label="Güncelleme" />
                  <FormControlLabel value="delete" control={<Radio />} label="Silme" />
                  <FormControlLabel value="create" control={<Radio />} label="Oluşturma" />
                </RadioGroup>
              </FormControl>
              
              <Box>
                <Button
                  variant="contained"
                  onClick={showStandardNotification}
                  sx={{ mr: 1 }}
                >
                  Standart Bildirim Göster
                </Button>
              </Box>
            </Stack>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Özel Bildirim Fonksiyonları
            </Typography>
            
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary">
                Aşağıdaki butonlar, yeni eklenen özel bildirim fonksiyonlarını test eder.
              </Typography>
              
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                Başarılı İşlem Bildirimleri
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Button 
                  variant="outlined" 
                  color="success" 
                  onClick={() => showSpecialNotification('success')}
                  aria-label="Başarılı bildirim göster"
                >
                  Genel Başarı
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="success"
                  onClick={() => showSpecialNotification('save')}
                  aria-label="Kaydetme bildirimi göster"
                >
                  Kaydetme Başarılı
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="success"
                  onClick={() => showSpecialNotification('update')}
                  aria-label="Güncelleme bildirimi göster"
                >
                  Güncelleme Başarılı
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="success"
                  onClick={() => showSpecialNotification('delete')}
                  aria-label="Silme bildirimi göster"
                >
                  Silme Başarılı
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="success"
                  onClick={() => showSpecialNotification('create')}
                  aria-label="Oluşturma bildirimi göster"
                >
                  Oluşturma Başarılı
                </Button>
              </Box>
              
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                Başarısız İşlem Bildirimleri
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={() => showSpecialNotification('error')}
                  aria-label="Genel hata bildirimi göster"
                >
                  Genel Hata
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="error"
                  onClick={() => showSpecialNotification('save-error')}
                  aria-label="Kaydetme hatası bildirimi göster"
                >
                  Kaydetme Hatası
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="error"
                  onClick={() => showSpecialNotification('update-error')}
                  aria-label="Güncelleme hatası bildirimi göster"
                >
                  Güncelleme Hatası
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="error"
                  onClick={() => showSpecialNotification('delete-error')}
                  aria-label="Silme hatası bildirimi göster"
                >
                  Silme Hatası
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="error"
                  onClick={() => showSpecialNotification('create-error')}
                  aria-label="Oluşturma hatası bildirimi göster"
                >
                  Oluşturma Hatası
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="error"
                  onClick={() => showSpecialNotification('connection-error')}
                  aria-label="Bağlantı hatası bildirimi göster"
                >
                  Bağlantı Hatası
                </Button>
              </Box>
            </Stack>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Kullanım Örneği:
          </Typography>
          <Paper elevation={0} sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, overflow: 'auto' }}>
            <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.85rem' }}>
              <code>
{`import { useNotifications } from '../../context/NotificationContext';

const YourComponent = () => {
  const notifications = useNotifications();
  
  // Standart kullanım
  notifications.show('Mesajınız', { severity: 'success' });
  
  // Özel fonksiyonlar
  notifications.showSuccess('Başarılı mesaj');
  notifications.showError('Hata mesajı');
  notifications.showSaveSuccess('Kaydedildi mesajı');
  notifications.showUpdateSuccess('Güncellendi mesajı');
  notifications.showDeleteSuccess('Silindi mesajı');
  notifications.showCreateSuccess('Oluşturuldu mesajı');
  
  return (
    <div>Your component content</div>
  );
};`}
              </code>
            </pre>
          </Paper>
        </Box>
      </CardContent>
    </Card>
  );
};

// Gereksiz yeniden render'ları önlemek için memo ile optimize edilmiş bileşen
export default memo(AlertNotification);
