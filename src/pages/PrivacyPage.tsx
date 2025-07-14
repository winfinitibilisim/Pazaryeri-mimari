import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  Security as SecurityIcon,
  Lock as LockIcon,
  Info as InfoIcon,
  Visibility as VisibilityIcon,
  DataUsage as DataUsageIcon,
  Cookie as CookieIcon,
  ContactMail as ContactMailIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link 
          underline="hover" 
          color="inherit" 
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Ana Sayfa
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <LockIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Gizlilik Politikası
        </Typography>
      </Breadcrumbs>

      {/* Başlık */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <LockIcon sx={{ fontSize: 40, color: '#9c27b0', mr: 2 }} />
        <Typography variant="h4" component="h1" fontWeight="bold">
          Gizlilik Politikası
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="body1" paragraph>
          Bu gizlilik politikası, uygulamalarımızı kullanırken kişisel verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklamaktadır. 
          Gizliliğinize saygı duyuyor ve kişisel verilerinizin korunmasını sağlamak için gerekli tüm önlemleri alıyoruz.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <DataUsageIcon sx={{ mr: 1, color: '#2196f3' }} />
            Topladığımız Veriler
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <InfoIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Hesap Bilgileri" 
                secondary="Ad, soyad, e-posta adresi, telefon numarası gibi hesap oluşturma sırasında sağladığınız bilgiler."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <VisibilityIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Kullanım Verileri" 
                secondary="Uygulama içindeki etkinlikleriniz, ziyaret ettiğiniz sayfalar ve etkileşimde bulunduğunuz özellikler."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CookieIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Çerezler ve Takip Teknolojileri" 
                secondary="Deneyiminizi kişiselleştirmek ve hizmetlerimizi iyileştirmek için çerezler ve benzer teknolojiler kullanıyoruz."
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <SecurityIcon sx={{ mr: 1, color: '#4caf50' }} />
            Veri Güvenliği
          </Typography>
          <Typography variant="body1" paragraph>
            Kişisel verilerinizin güvenliğini sağlamak için endüstri standardı güvenlik önlemleri uyguluyoruz. 
            Verileriniz şifreleme teknolojileri ile korunmakta ve yalnızca yetkili personel tarafından erişilebilmektedir.
          </Typography>
          <Typography variant="body1" paragraph>
            Düzenli güvenlik denetimleri yaparak sistemlerimizin güvenliğini sürekli olarak değerlendiriyor ve iyileştiriyoruz.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <ContactMailIcon sx={{ mr: 1, color: '#ff9800' }} />
            İletişim
          </Typography>
          <Typography variant="body1">
            Gizlilik politikamız hakkında sorularınız veya endişeleriniz varsa, lütfen aşağıdaki iletişim bilgilerini kullanarak bizimle iletişime geçin:
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="E-posta" 
                secondary="privacy@example.com"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Telefon" 
                secondary="+90 (212) 555 1234"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Adres" 
                secondary="Örnek Mahallesi, Örnek Caddesi No:123, İstanbul, Türkiye"
              />
            </ListItem>
          </List>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Typography variant="caption" color="text.secondary">
            Son Güncelleme: 27 Mayıs 2025
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default PrivacyPage;
