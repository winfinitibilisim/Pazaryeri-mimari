import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Divider,
  FormControlLabel,
  Switch,
  Grid,
  Paper,
  Alert,
  Snackbar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import EmailIcon from '@mui/icons-material/Email';
import RichTextEditor from '../common/RichTextEditor';

interface MailSettingsProps {
  open: boolean;
  onClose: () => void;
}

const MailSettings: React.FC<MailSettingsProps> = ({ open, onClose }) => {
  // Form state
  const [smtpServer, setSmtpServer] = useState('smtp.example.com');
  const [smtpPort, setSmtpPort] = useState('587');
  const [username, setUsername] = useState('user@example.com');
  const [password, setPassword] = useState('');
  const [fromName, setFromName] = useState('Admin Panel');
  const [fromEmail, setFromEmail] = useState('admin@example.com');
  const [useSSL, setUseSSL] = useState(true);
  
  // Test email state
  const [testEmailTo, setTestEmailTo] = useState('');
  const [testEmailSubject, setTestEmailSubject] = useState('Test Email from Admin Panel');
  const [testEmailContent, setTestEmailContent] = useState('<p>Bu bir test e-postasıdır.</p>');
  
  // Notification state
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Handle form submission
  const handleSaveSettings = () => {
    // Burada normalde API'ye kaydetme işlemi yapılır
    setNotification({
      open: true,
      message: 'E-posta ayarları başarıyla kaydedildi.',
      severity: 'success'
    });
  };

  // Handle test email sending
  const handleSendTestEmail = () => {
    if (!testEmailTo || !testEmailSubject || !testEmailContent) {
      setNotification({
        open: true,
        message: 'Lütfen tüm test e-posta alanlarını doldurun.',
        severity: 'warning'
      });
      return;
    }

    // Burada normalde test e-postası gönderme API'si çağrılır
    setNotification({
      open: true,
      message: 'Test e-postası başarıyla gönderildi.',
      severity: 'success'
    });
  };

  // Handle notification close
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: { 
          borderRadius: 2,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ bgcolor: '#f9f9f9', borderBottom: '1px solid #e0e0e0', p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SettingsIcon sx={{ color: '#25638f' }} />
            E-posta Ayarları
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2, height: '100%' }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500, color: '#25638f' }}>
                SMTP Sunucu Ayarları
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="SMTP Sunucu"
                  variant="outlined"
                  size="small"
                  value={smtpServer}
                  onChange={(e) => setSmtpServer(e.target.value)}
                  sx={{ mb: 2 }}
                  InputProps={{
                    sx: { borderRadius: 1 }
                  }}
                />
                
                <TextField
                  fullWidth
                  label="SMTP Port"
                  variant="outlined"
                  size="small"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(e.target.value)}
                  sx={{ mb: 2 }}
                  InputProps={{
                    sx: { borderRadius: 1 }
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Kullanıcı Adı"
                  variant="outlined"
                  size="small"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  sx={{ mb: 2 }}
                  InputProps={{
                    sx: { borderRadius: 1 }
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Şifre"
                  type="password"
                  variant="outlined"
                  size="small"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ mb: 2 }}
                  InputProps={{
                    sx: { borderRadius: 1 }
                  }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={useSSL}
                      onChange={(e) => setUseSSL(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="SSL/TLS Kullan"
                />
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2, height: '100%' }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500, color: '#25638f' }}>
                Gönderici Bilgileri
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Gönderici Adı"
                  variant="outlined"
                  size="small"
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  sx={{ mb: 2 }}
                  InputProps={{
                    sx: { borderRadius: 1 }
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Gönderici E-posta"
                  variant="outlined"
                  size="small"
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  sx={{ mb: 2 }}
                  InputProps={{
                    sx: { borderRadius: 1 }
                  }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveSettings}
                  sx={{
                    bgcolor: '#25638f',
                    '&:hover': { bgcolor: '#1e5172' },
                    borderRadius: 28,
                    textTransform: 'none',
                    px: 3
                  }}
                >
                  Ayarları Kaydet
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500, color: '#25638f' }}>
                Test E-postası Gönder
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Alıcı E-posta"
                  variant="outlined"
                  size="small"
                  value={testEmailTo}
                  onChange={(e) => setTestEmailTo(e.target.value)}
                  sx={{ mb: 2 }}
                  placeholder="ornek@mail.com"
                  InputProps={{
                    sx: { borderRadius: 1 }
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Konu"
                  variant="outlined"
                  size="small"
                  value={testEmailSubject}
                  onChange={(e) => setTestEmailSubject(e.target.value)}
                  sx={{ mb: 2 }}
                  InputProps={{
                    sx: { borderRadius: 1 }
                  }}
                />
                
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500, color: '#25638f', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SendIcon fontSize="small" />
                  E-posta İçeriği
                </Typography>
                
                <Paper elevation={0} sx={{ p: 0, border: '1px solid #e0e0e0', borderRadius: 2, mb: 2, overflow: 'hidden' }}>
                  <RichTextEditor 
                    value={testEmailContent}
                    onChange={setTestEmailContent}
                    minRows={8}
                    maxRows={15}
                    placeholder="Test e-posta içeriğini buraya yazın..."
                  />
                </Paper>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<SendIcon />}
                  onClick={handleSendTestEmail}
                  sx={{
                    bgcolor: '#25638f',
                    '&:hover': { bgcolor: '#1e5172' },
                    borderRadius: 28,
                    textTransform: 'none',
                    px: 3
                  }}
                >
                  Test E-postası Gönder
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default MailSettings;
