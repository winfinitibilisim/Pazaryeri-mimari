import React, { useState, useEffect } from 'react';
import RichTextEditor from '../components/common/RichTextEditor';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardHeader,
  Chip, 
  Container, 
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider, 
  FormControl, 
  FormControlLabel, 
  FormHelperText, 
  Grid, 
  IconButton, 
  InputAdornment, 
  InputLabel, 
  MenuItem, 
  OutlinedInput, 
  Paper, 
  Select, 
  Snackbar, 
  Stack, 
  Switch, 
  Tab, 
  Tabs, 
  TextField, 
  Tooltip, 
  Typography, 
  Alert,
  AlertTitle
} from '@mui/material';
import {
  Save as SaveIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
  Send as SendIcon,
  AutoAwesome as TemplateIcon,
  History as HistoryIcon,
  BarChart as StatisticsIcon,
  BugReport as TestIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Email as EmailIcon
} from '@mui/icons-material';

// Tab panel bileşeni
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`email-tabpanel-${index}`}
      aria-labelledby={`email-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `email-tab-${index}`,
    'aria-controls': `email-tabpanel-${index}`,
  };
}

const EmailSettingsPage = () => {
  // Tab state'i
  const [tabValue, setTabValue] = useState(0);

  // SMTP ayarları için state'ler
  const [smtpHost, setSmtpHost] = useState<string>('');
  const [smtpPort, setSmtpPort] = useState<string>('587');
  const [smtpUsername, setSmtpUsername] = useState<string>('');
  const [smtpPassword, setSmtpPassword] = useState<string>('');
  const [senderEmail, setSenderEmail] = useState<string>('');
  
  // E-posta detayları ve tekrar gönderme işlevselliği için state'ler
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [senderName, setSenderName] = useState<string>('');
  const [encryption, setEncryption] = useState<string>('tls');
  const [enabled, setEnabled] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  // Test e-posta ayarları
  const [testEmail, setTestEmail] = useState<string>('ahmetdurmaz34@gmail.com');
  const [testSubject, setTestSubject] = useState<string>('Test Email from Admin Panel');
  const [testMessage, setTestMessage] = useState<string>('<p>This is a test email sent from the admin panel.</p>');
  
  // Çoklu dil desteği için ayarlar
  const [selectedLanguage, setSelectedLanguage] = useState<string>('tr');
  const [languageTemplates, setLanguageTemplates] = useState<Record<string, {subject: string, message: string}>>({    
    tr: {
      subject: 'Admin Panelden Test E-postası',
      message: '<p>Bu, admin panelinden gönderilen bir test e-postasıdır.</p>'
    },
    en: {
      subject: 'Test Email from Admin Panel',
      message: '<p>This is a test email sent from the admin panel.</p>'
    },
    de: {
      subject: 'Test-E-Mail vom Admin-Panel',
      message: '<p>Dies ist eine Test-E-Mail, die vom Admin-Panel gesendet wurde.</p>'
    },
    fr: {
      subject: 'E-mail de test du panneau d\'administration',
      message: '<p>Ceci est un e-mail de test envoyé depuis le panneau d\'administration.</p>'
    },
    es: {
      subject: 'Correo electrónico de prueba del panel de administración',
      message: '<p>Este es un correo electrónico de prueba enviado desde el panel de administración.</p>'
    },
    ar: {
      subject: 'رسالة اختبار من لوحة الإدارة',
      message: '<p>هذه رسالة اختبار مرسلة من لوحة الإدارة.</p>'
    },
    ru: {
      subject: 'Тестовое письмо из панели администратора',
      message: '<p>Это тестовое письмо, отправленное из панели администратора.</p>'
    }
  });
  
  // Dil bayrakları ve adları
  const languages = [
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'ar', name: 'العربية', flag: '🇦🇪' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ];
  
  // Şablon çevirileri için tip tanımı
  type TemplateTranslation = {
    name: string;
    subject: string;
    content: string;
  };
  
  // Desteklenen dilleri içeren çeviriler tipi
  type TemplateTranslations = {
    tr: TemplateTranslation;
    en: TemplateTranslation;
    de: TemplateTranslation;
  };
  
  // E-posta şablonu tipi
  type Template = {
    id: number;
    name: string;
    subject: string;
    active: boolean;
    content: string;
    translations: TemplateTranslations;
  };
  
  // E-posta şablonları
  const [templates, setTemplates] = useState([
    { 
      id: 1, 
      name: 'Welcome Email', 
      subject: 'Welcome to Our Platform', 
      active: true,
      content: '<p>Welcome to our platform! We are excited to have you join us.</p><p>Here are some tips to get started:</p><ul><li>Complete your profile</li><li>Explore our features</li><li>Connect with others</li></ul><p>If you have any questions, feel free to contact our support team.</p>',
      translations: {
        tr: {
          name: 'Hoşgeldiniz E-postası',
          subject: 'Platformumuza Hoşgeldiniz',
          content: '<p>Platformumuza hoşgeldiniz! Aramıza katıldığınız için çok mutluyuz.</p><p>Başlangıç için bazı ipucuçları:</p><ul><li>Profilinizi tamamlayın</li><li>Özelliklerimizi keşfedin</li><li>Diğerleriyle bağlantı kurun</li></ul><p>Herhangi bir sorunuz varsa, destek ekibimizle iletişime geçmekten çekinmeyin.</p>'
        },
        en: {
          name: 'Welcome Email',
          subject: 'Welcome to Our Platform',
          content: '<p>Welcome to our platform! We are excited to have you join us.</p><p>Here are some tips to get started:</p><ul><li>Complete your profile</li><li>Explore our features</li><li>Connect with others</li></ul><p>If you have any questions, feel free to contact our support team.</p>'
        },
        de: {
          name: 'Willkommens-E-Mail',
          subject: 'Willkommen auf unserer Plattform',
          content: '<p>Willkommen auf unserer Plattform! Wir freuen uns, dass Sie bei uns sind.</p><p>Hier sind einige Tipps für den Einstieg:</p><ul><li>Vervollständigen Sie Ihr Profil</li><li>Erkunden Sie unsere Funktionen</li><li>Verbinden Sie sich mit anderen</li></ul><p>Wenn Sie Fragen haben, wenden Sie sich gerne an unser Support-Team.</p>'
        }
      }
    },
    { 
      id: 2, 
      name: 'Order Confirmation', 
      subject: 'Your Order Has Been Confirmed', 
      active: true,
      content: '<p>Thank you for your order!</p><p>Your order #12345 has been confirmed and is being processed. You will receive a shipping notification once your order has been shipped.</p><p>Order Summary:</p><ul><li>Product 1 - $19.99</li><li>Product 2 - $29.99</li></ul><p>Total: $49.98</p>',
      translations: {
        tr: {
          name: 'Sipariş Onayı',
          subject: 'Siparişiniz Onaylandı',
          content: '<p>Siparişiniz için teşekkür ederiz!</p><p>#12345 numaralı siparişiniz onaylandı ve işleme alındı. Siparişiniz gönderildiğinde bir kargo bildirimi alacaksınız.</p><p>Sipariş Özeti:</p><ul><li>Ürün 1 - 19,99 TL</li><li>Ürün 2 - 29,99 TL</li></ul><p>Toplam: 49,98 TL</p>'
        },
        en: {
          name: 'Order Confirmation',
          subject: 'Your Order Has Been Confirmed',
          content: '<p>Thank you for your order!</p><p>Your order #12345 has been confirmed and is being processed. You will receive a shipping notification once your order has been shipped.</p><p>Order Summary:</p><ul><li>Product 1 - $19.99</li><li>Product 2 - $29.99</li></ul><p>Total: $49.98</p>'
        },
        de: {
          name: 'Auftragsbestätigung',
          subject: 'Ihre Bestellung wurde bestätigt',
          content: '<p>Vielen Dank für Ihre Bestellung!</p><p>Ihre Bestellung #12345 wurde bestätigt und wird bearbeitet. Sie erhalten eine Versandbestätigung, sobald Ihre Bestellung versendet wurde.</p><p>Bestellungsübersicht:</p><ul><li>Produkt 1 - 19,99 €</li><li>Produkt 2 - 29,99 €</li></ul><p>Gesamt: 49,98 €</p>'
        }
      }
    },
    { 
      id: 3, 
      name: 'Password Reset', 
      subject: 'Password Reset Instructions', 
      active: true,
      content: '<p>We received a request to reset your password.</p><p>Click the link below to reset your password:</p><p><a href="#">Reset Password</a></p><p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>',
      translations: {
        tr: {
          name: 'Şifre Sıfırlama',
          subject: 'Şifre Sıfırlama Talimatları',
          content: '<p>Şifrenizi sıfırlama isteği aldık.</p><p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p><p><a href="#">Şifreyi Sıfırla</a></p><p>Eğer bir şifre sıfırlama talebinde bulunmadıysanız, lütfen bu e-postayı dikkate almayın veya endişeleriniz varsa destek ekibiyle iletişime geçin.</p>'
        },
        en: {
          name: 'Password Reset',
          subject: 'Password Reset Instructions',
          content: '<p>We received a request to reset your password.</p><p>Click the link below to reset your password:</p><p><a href="#">Reset Password</a></p><p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>'
        },
        de: {
          name: 'Passwort zurücksetzen',
          subject: 'Anleitung zum Zurücksetzen des Passworts',
          content: '<p>Wir haben eine Anfrage erhalten, Ihr Passwort zurückzusetzen.</p><p>Klicken Sie auf den Link unten, um Ihr Passwort zurückzusetzen:</p><p><a href="#">Passwort zurücksetzen</a></p><p>Wenn Sie kein Zurücksetzen des Passworts angefordert haben, ignorieren Sie bitte diese E-Mail oder wenden Sie sich an den Support, wenn Sie Bedenken haben.</p>'
        }
      }
    },
    { 
      id: 4, 
      name: 'Account Verification', 
      subject: 'Verify Your Account', 
      active: false,
      content: '<p>Thank you for creating an account!</p><p>Please verify your email address by clicking the link below:</p><p><a href="#">Verify Email</a></p><p>This verification link will expire in 24 hours.</p>',
      translations: {
        tr: {
          name: 'Hesap Doğrulama',
          subject: 'Hesabınızı Doğrulayın',
          content: '<p>Hesap oluşturduğunuz için teşekkür ederiz!</p><p>Lütfen aşağıdaki bağlantıya tıklayarak e-posta adresinizi doğrulayın:</p><p><a href="#">E-postayı Doğrula</a></p><p>Bu doğrulama bağlantısı 24 saat içinde sona erecektir.</p>'
        },
        en: {
          name: 'Account Verification',
          subject: 'Verify Your Account',
          content: '<p>Thank you for creating an account!</p><p>Please verify your email address by clicking the link below:</p><p><a href="#">Verify Email</a></p><p>This verification link will expire in 24 hours.</p>'
        },
        de: {
          name: 'Kontoverifizierung',
          subject: 'Bestätigen Sie Ihr Konto',
          content: '<p>Vielen Dank für die Erstellung eines Kontos!</p><p>Bitte bestätigen Sie Ihre E-Mail-Adresse, indem Sie auf den Link unten klicken:</p><p><a href="#">E-Mail bestätigen</a></p><p>Dieser Bestätigungslink läuft in 24 Stunden ab.</p>'
        }
      }
    },
    { 
      id: 5, 
      name: 'Abandoned Cart', 
      subject: 'You Left Items in Your Cart', 
      active: false,
      content: '<p>We noticed you left some items in your shopping cart.</p><p>Your cart is saved, and you can complete your purchase anytime:</p><ul><li>Product 1 - $19.99</li><li>Product 2 - $29.99</li></ul><p><a href="#">Complete Your Purchase</a></p><p>Need help? Contact our customer support team.</p>',
      translations: {
        tr: {
          name: 'Terkedilmiş Sepet',
          subject: 'Sepetinizde Ürünler Bıraktınız',
          content: '<p>Alışveriş sepetinizde bazı ürünler bıraktığınızı fark ettik.</p><p>Sepetiniz kaydedildi ve istediğiniz zaman satın alma işleminizi tamamlayabilirsiniz:</p><ul><li>Ürün 1 - 19,99 TL</li><li>Ürün 2 - 29,99 TL</li></ul><p><a href="#">Satın Alma İşleminizi Tamamlayın</a></p><p>Yardıma mı ihtiyacınız var? Müşteri destek ekibimizle iletişime geçin.</p>'
        },
        en: {
          name: 'Abandoned Cart',
          subject: 'You Left Items in Your Cart',
          content: '<p>We noticed you left some items in your shopping cart.</p><p>Your cart is saved, and you can complete your purchase anytime:</p><ul><li>Product 1 - $19.99</li><li>Product 2 - $29.99</li></ul><p><a href="#">Complete Your Purchase</a></p><p>Need help? Contact our customer support team.</p>'
        },
        de: {
          name: 'Verlassener Warenkorb',
          subject: 'Sie haben Artikel in Ihrem Warenkorb gelassen',
          content: '<p>Wir haben bemerkt, dass Sie einige Artikel in Ihrem Warenkorb gelassen haben.</p><p>Ihr Warenkorb ist gespeichert, und Sie können Ihren Kauf jederzeit abschließen:</p><ul><li>Produkt 1 - 19,99 €</li><li>Produkt 2 - 29,99 €</li></ul><p><a href="#">Schließen Sie Ihren Kauf ab</a></p><p>Brauchen Sie Hilfe? Kontaktieren Sie unser Kundenservice-Team.</p>'
        }
      }
    }
  ]);
  
  // Şablon düzenleme için state'ler
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [editingLanguage, setEditingLanguage] = useState<string>('en');
  const [templateName, setTemplateName] = useState<string>('');
  const [templateSubject, setTemplateSubject] = useState<string>('');
  const [templateContent, setTemplateContent] = useState<string>('');
  
  // Dialog state'leri
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [newTemplateDialogOpen, setNewTemplateDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [templateToDelete, setTemplateToDelete] = useState<number | null>(null);
  
  // Sayfa yüklenirken yerel depolamadan şablonları yükle
  useEffect(() => {
    try {
      const savedTemplates = localStorage.getItem('emailTemplates');
      if (savedTemplates) {
        setTemplates(JSON.parse(savedTemplates));
        console.log('Yerel depolamadan şablonlar yüklendi:', JSON.parse(savedTemplates));
      }
    } catch (error) {
      console.error('Yerel depolamadan şablonlar yüklenirken hata oluştu:', error);
    }
  }, []);
  
  // Bildirimler için state'ler
  const [testSnackbarOpen, setTestSnackbarOpen] = useState<boolean>(false);
  const [testSnackbarMessage, setTestSnackbarMessage] = useState<string>('');
  const [testSnackbarSeverity, setTestSnackbarSeverity] = useState<'success' | 'error'>('success');
  
  // Genel bildirimler için state'ler
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('success');
  
  // E-posta geçmişi
  const [emailHistory, setEmailHistory] = useState([
    { id: 1, recipient: 'user1@example.com', subject: 'Welcome to Our Platform', status: 'delivered', date: '2025-05-25 14:30' },
    { id: 2, recipient: 'user2@example.com', subject: 'Your Order Has Been Confirmed', status: 'delivered', date: '2025-05-25 15:45' },
    { id: 3, recipient: 'user3@example.com', subject: 'Password Reset Instructions', status: 'failed', date: '2025-05-25 16:20' },
    { id: 4, recipient: 'user4@example.com', subject: 'Verify Your Account', status: 'delivered', date: '2025-05-26 09:15' }
  ]);

  // Tab değişimi
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Dil değişimi
  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode);
    const template = languageTemplates[langCode];
    if (template) {
      setTestSubject(template.subject);
      setTestMessage(template.message);
    }
  };
  
  // RichTextEditor bileşeni kendi içinde format seçeneklerini barındırdığı için
  // burada modules ve formats tanımlamalarına gerek kalmadı

  // Ayarları kaydetme fonksiyonu
  const handleSaveSettings = () => {
    // Burada ayarları kaydetme işlemi yapılabilir
    // Örnek olarak başarılı olduğunu varsayalım
    setTimeout(() => {
      setSnackbarOpen(true);
      setSnackbarMessage('E-posta ayarları başarıyla kaydedildi');
      setSnackbarSeverity('success');
    }, 1000);
  };

  // Test e-postası gönderme
  const handleSendTestEmail = () => {
    if (!testEmail) {
      setTestSnackbarOpen(true);
      setTestSnackbarMessage('Lütfen bir test e-posta adresi girin');
      setTestSnackbarSeverity('error');
      return;
    }
    
    // SMTP ayarları kontrolünü kaldırdık, böylece buton her zaman aktif olacak
    
    // Burada gerçek bir e-posta gönderimi yapılabilir
    // Örnek olarak başarılı olduğunu varsayalım
    setTimeout(() => {
      setTestSnackbarOpen(true);
      setTestSnackbarMessage(`Test e-postası ${testEmail} adresine başarıyla gönderildi`);
      setTestSnackbarSeverity('success');
    }, 1500);
  };

  // E-postayı tekrar gönderme işlevi
  const handleResendEmail = (email: any) => {
    setResendingEmail(true);
    
    // Simüle edilmiş API çağrısı
    setTimeout(() => {
      // Başarılı olduğunu varsayalım
      setTestSnackbarOpen(true);
      setTestSnackbarMessage(`E-posta ${email.recipient} adresine başarıyla tekrar gönderildi`);
      setTestSnackbarSeverity('success');
      
      // E-posta geçmişini güncelle
      const updatedHistory = emailHistory.map(item => {
        if (item.id === email.id) {
          return {
            ...item,
            status: 'delivered',
            date: new Date().toLocaleString('tr-TR')
          };
        }
        return item;
      });
      
      setEmailHistory(updatedHistory);
      setResendingEmail(false);
    }, 1500);
  };
  
  // E-posta detayları dialogunu kapatma işlevi
  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
    setSelectedEmail(null);
  };
  
  // Şablon durumunu değiştirme
  const handleToggleTemplate = (id: number) => {
    const updatedTemplates = templates.map(template => 
      template.id === id ? { ...template, active: !template.active } : template
    );
    setTemplates(updatedTemplates);
  };

  // E-posta şablonları için işlevler
  const handleTemplateToggle = (id: number) => {
    setTemplates(templates.map(template => 
      template.id === id ? { ...template, active: !template.active } : template
    ));
  };
  
  // Şablon düzenleme işlevleri
  const handleEditTemplate = (template: Template) => {
    console.log('handleEditTemplate çağrıldı:', template);
    try {
      // Şablonu state'e kaydet
      setEditingTemplate(template);
      
      // Varsayılan olarak İngilizce ile başla
      setEditingLanguage('en');
      
      // İlk yükleme için varsayılan değerleri ayarla
      setTemplateName(template.name);
      setTemplateSubject(template.subject);
      setTemplateContent(template.content);
      
      // Eğer çeviriler varsa, seçilen dile göre içeriği güncelle
      if (template.translations && template.translations.en) {
        setTemplateName(template.translations.en.name);
        setTemplateSubject(template.translations.en.subject);
        setTemplateContent(template.translations.en.content);
      }
      
      // Dialog'u aç
      setEditDialogOpen(true);
    } catch (error) {
      console.error('handleEditTemplate hatası:', error);
      setSnackbarOpen(true);
      setSnackbarMessage('Şablon düzenleme sırasında bir hata oluştu');
      setSnackbarSeverity('error');
    }
  };
  
  const handleLanguageSwitch = (lang: string) => {
    setEditingLanguage(lang);
    if (editingTemplate) {
      // Seçilen dil için içeriği güncelle
      if (editingTemplate.translations) {
        if (lang === 'tr' && editingTemplate.translations.tr) {
          setTemplateName(editingTemplate.translations.tr.name);
          setTemplateSubject(editingTemplate.translations.tr.subject);
          setTemplateContent(editingTemplate.translations.tr.content);
        } else if (lang === 'en' && editingTemplate.translations.en) {
          setTemplateName(editingTemplate.translations.en.name);
          setTemplateSubject(editingTemplate.translations.en.subject);
          setTemplateContent(editingTemplate.translations.en.content);
        } else if (lang === 'de' && editingTemplate.translations.de) {
          setTemplateName(editingTemplate.translations.de.name);
          setTemplateSubject(editingTemplate.translations.de.subject);
          setTemplateContent(editingTemplate.translations.de.content);
        } else {
          // Seçilen dil için çeviri yoksa, varsayılan değerleri kullan
          setTemplateName(editingTemplate.name);
          setTemplateSubject(editingTemplate.subject);
          setTemplateContent(editingTemplate.content);
        }
      } else {
        // Çeviriler yoksa, varsayılan değerleri kullan
        setTemplateName(editingTemplate.name);
        setTemplateSubject(editingTemplate.subject);
        setTemplateContent(editingTemplate.content);
      }
    }
  };
  
  const handleSaveTemplate = () => {
    if (!editingTemplate) return;
    
    try {
      // Düzenlenen şablonu güncelle
      const updatedTemplate: Template = { ...editingTemplate };
      
      // Eğer çeviriler yoksa, boş çeviriler oluştur
      if (!updatedTemplate.translations) {
        updatedTemplate.translations = {
          tr: { name: '', subject: '', content: '' },
          en: { name: '', subject: '', content: '' },
          de: { name: '', subject: '', content: '' }
        };
      }
      
      // Seçili dil için çevirileri güncelle
      if (editingLanguage === 'tr') {
        updatedTemplate.translations.tr = {
          name: templateName,
          subject: templateSubject,
          content: templateContent
        };
      } else if (editingLanguage === 'en') {
        updatedTemplate.translations.en = {
          name: templateName,
          subject: templateSubject,
          content: templateContent
        };
        
        // İngilizce varsayılan dil olduğu için ana alanları da güncelle
        updatedTemplate.name = templateName;
        updatedTemplate.subject = templateSubject;
        updatedTemplate.content = templateContent;
      } else if (editingLanguage === 'de') {
        updatedTemplate.translations.de = {
          name: templateName,
          subject: templateSubject,
          content: templateContent
        };
      }
      
      // Şablonlar listesini güncelle
      const updatedTemplates = templates.map(t => t.id === updatedTemplate.id ? updatedTemplate : t);
      setTemplates(updatedTemplates);
      
      // Yerel depolamaya kaydet (gerçek uygulamada API'ye gönderilir)
      localStorage.setItem('emailTemplates', JSON.stringify(updatedTemplates));
      
      // Dialog'u kapat
      setEditDialogOpen(false);
      setEditingTemplate(null);
      
      // Bildirim göster
      setSnackbarOpen(true);
      setSnackbarMessage('Şablon başarıyla güncellendi');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Şablon güncelleme hatası:', error);
      setSnackbarOpen(true);
      setSnackbarMessage('Şablon güncellenirken bir hata oluştu');
      setSnackbarSeverity('error');
    }
  };
  
  // Yeni şablon ekleme işlevleri
  const handleAddNewTemplate = () => {
    console.log('Yeni Şablon Ekle butonuna tıklandı');
    try {
      // Yeni şablon için varsayılan değerleri ayarla
      setEditingTemplate(null);
      setEditingLanguage('tr'); // Türkçe ile başla
      
      // Varsayılan şablon bilgileri
      const currentDate = new Date().toLocaleDateString('tr-TR');
      setTemplateName(`Yeni Şablon - ${currentDate}`);
      setTemplateSubject('Yeni Bilgilendirme E-postası');
      setTemplateContent(`
        <h2>Merhaba Değerli Müşterimiz,</h2>
        <p>Bu bir bilgilendirme e-postasıdır.</p>
        <p>Aşağıdaki bilgileri inceleyebilirsiniz:</p>
        <ul>
          <li>Önemli duyurular</li>
          <li>Kampanyalar ve fırsatlar</li>
          <li>Yeni ürünler ve hizmetler</li>
        </ul>
        <p>Herhangi bir sorunuz varsa, lütfen bizimle iletişime geçin.</p>
        <p><strong>Saygılarımızla,</strong><br>Şirket Adı</p>
      `);
      
      // Dialog'u aç
      console.log('Yeni şablon diyaloğu açılıyor...');
      setNewTemplateDialogOpen(true);
      
      // Konsola durum bilgisi yazdır
      setTimeout(() => {
        console.log('Dialog açık mı?', newTemplateDialogOpen);
      }, 100);
    } catch (error) {
      console.error('Yeni şablon ekleme hatası:', error);
      setSnackbarOpen(true);
      setSnackbarMessage('Yeni şablon eklenirken bir hata oluştu');
      setSnackbarSeverity('error');
    }
  };
  
  const handleCreateTemplate = () => {
    console.log('handleCreateTemplate çağrıldı');
    try {
      // Boş alan kontrolü
      if (!templateName || !templateSubject || !templateContent) {
        setSnackbarOpen(true);
        setSnackbarMessage('Şablon adı, konu ve içerik alanları boş bırakılamaz');
        setSnackbarSeverity('error');
        return;
      }
      
      // Yeni bir ID oluştur (mevcut en yüksek ID + 1)
      const newId = templates.length > 0 ? Math.max(...templates.map(t => t.id)) + 1 : 1;
      console.log('Yeni şablon ID:', newId);
      
      // Tüm diller için çevirileri hazırla
      const translations: {
        tr: TemplateTranslation;
        en: TemplateTranslation;
        de: TemplateTranslation;
      } = {
        tr: {
          name: templateName,
          subject: templateSubject,
          content: templateContent
        },
        en: {
          name: templateName,
          subject: templateSubject,
          content: templateContent
        },
        de: {
          name: templateName,
          subject: templateSubject,
          content: templateContent
        }
      };
      
      // Yeni şablon oluştur
      const newTemplate = {
        id: newId,
        name: templateName,
        subject: templateSubject,
        content: templateContent,
        active: true,
        translations: translations
      };
      
      console.log('Yeni oluşturulan şablon:', newTemplate);
      
      // Şablonlar listesine ekle
      setTemplates([...templates, newTemplate]);
      
      // Yerel depolamaya kaydet (gerçek uygulamada API'ye gönderilir)
      localStorage.setItem('emailTemplates', JSON.stringify([...templates, newTemplate]));
      
      // Dialog'u kapat
      setNewTemplateDialogOpen(false);
      
      // Form alanlarını temizle
      setTemplateName('');
      setTemplateSubject('');
      setTemplateContent('');
      
      // Bildirim göster
      setSnackbarOpen(true);
      setSnackbarMessage('Yeni şablon başarıyla eklendi');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Yeni şablon ekleme hatası:', error);
      setSnackbarOpen(true);
      setSnackbarMessage('Yeni şablon eklenirken bir hata oluştu');
      setSnackbarSeverity('error');
    }
  };

  // Şablon silme işlevi - Onay diyaloğunu açar
  const handleDeleteTemplate = (id: number) => {
    console.log('handleDeleteTemplate çağrıldı, ID:', id);
    setTemplateToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Şablon silme işlemini gerçekleştiren fonksiyon
  const confirmDeleteTemplate = () => {
    if (templateToDelete === null) return;
    
    try {
      // Şablonu listeden kaldır
      const updatedTemplates = templates.filter(t => t.id !== templateToDelete);
      console.log('Güncellenmiş şablonlar:', updatedTemplates);
      
      // State'i güncelle
      setTemplates(updatedTemplates);
      
      // Yerel depolamaya kaydet (gerçek uygulamada API'ye gönderilir)
      localStorage.setItem('emailTemplates', JSON.stringify(updatedTemplates));
      
      // Diyaloğu kapat
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
      
      // Bildirim göster
      setSnackbarOpen(true);
      setSnackbarMessage('Şablon başarıyla silindi');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Template silme hatası:', error);
      setSnackbarOpen(true);
      setSnackbarMessage('Şablon silinirken bir hata oluştu');
      setSnackbarSeverity('error');
      
      // Hata durumunda da diyaloğu kapat
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
    }
  };

  // SMTP bağlantısını test etme
  const handleTestConnection = () => {
    if (!smtpHost || !smtpPort || !smtpUsername || !smtpPassword) {
      setSnackbarOpen(true);
      setSnackbarMessage('Lütfen tüm SMTP ayarlarını doldurun');
      setSnackbarSeverity('error');
      return;
    }
    
    // Burada gerçek bir SMTP bağlantı testi yapılabilir
    // Örnek olarak başarılı olduğunu varsayalım
    setTimeout(() => {
      setSnackbarOpen(true);
      setSnackbarMessage('SMTP bağlantısı başarılı');
      setSnackbarSeverity('success');
    }, 1500);
  };

  return (
    <Container>
      <Typography variant="h5" fontWeight="500" sx={{ mb: 3 }}>
        <EmailIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#2196f3' }} />
        E-posta Ayarları
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="email settings tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab 
            label="SMTP Ayarları" 
            icon={<SettingsIcon />} 
            iconPosition="start" 
            {...a11yProps(0)} 
          />
          <Tab 
            label="Test E-posta" 
            icon={<SendIcon />} 
            iconPosition="start" 
            {...a11yProps(1)} 
          />
          <Tab 
            label="Şablonlar" 
            icon={<TemplateIcon />} 
            iconPosition="start" 
            {...a11yProps(2)} 
          />
          <Tab 
            label="E-posta Geçmişi" 
            icon={<HistoryIcon />} 
            iconPosition="start" 
            {...a11yProps(3)} 
          />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                SMTP Sunucu Yapılandırması
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
                    label="E-posta Servisini Etkinleştir"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    <InfoIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5, color: 'info.main' }} />
                    E-posta servisini etkinleştirerek, sistem üzerinden otomatik e-posta gönderimini başlatabilirsiniz. Bu özellik, müşteri bildirimleri, sipariş onayları ve diğer otomatik bildirimler için gereklidir.
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="SMTP Sunucu"
                    fullWidth
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    placeholder="smtp.example.com"
                    required
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    <InfoIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5, color: 'info.main' }} />
                    E-posta servis sağlayıcınızın SMTP sunucu adresi. Örneğin: Gmail için smtp.gmail.com, Outlook için smtp.office365.com
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="SMTP Port"
                    fullWidth
                    type="number"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    required
                    helperText="Genellikle 587 (TLS) veya 465 (SSL)"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    <InfoIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5, color: 'info.main' }} />
                    SMTP sunucunun kullandığı port numarası. Şifreleme türüne göre değişiklikler gösterir. TLS için 587, SSL için 465, şifreleme olmadan 25 portu kullanılır.
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="SMTP Kullanıcı Adı"
                    fullWidth
                    value={smtpUsername}
                    onChange={(e) => setSmtpUsername(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    required
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    <InfoIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5, color: 'info.main' }} />
                    E-posta servis sağlayıcınıza giriş yapmak için kullandığınız kullanıcı adı. Genellikle e-posta adresinizdir (örn: info@sirketiniz.com).
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="SMTP Şifre"
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    value={smtpPassword}
                    onChange={(e) => setSmtpPassword(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    <InfoIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5, color: 'info.main' }} />
                    E-posta hesabınızın şifresi. Bazı servis sağlayıcılar (Google, Microsoft) uygulama şifreleri kullanmanızı gerektirebilir. Bu durumda hesap ayarlarınızdan uygulama şifresi oluşturmanız gerekir.
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Gönderen E-posta"
                    fullWidth
                    type="email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    placeholder="noreply@yourcompany.com"
                    required
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    <InfoIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5, color: 'info.main' }} />
                    Gönderilen e-postalarda "Kimden" kısmında görünecek e-posta adresi. Bu adres, SMTP kullanıcı adınızla aynı olabilir veya farklı olabilir (servis sağlayıcınızın izin verdiği durumlarda).
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Gönderen Adı"
                    fullWidth
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    placeholder="Your Company Name"
                    helperText="E-postalarda görünecek gönderen adı"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    <InfoIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5, color: 'info.main' }} />
                    Gönderilen e-postalarda "Kimden" kısmında görünecek isim. Örneğin: "Şirket Adınız" veya "Müşteri Hizmetleri". Bu, alıcıların e-postanızı tanımasına yardımcı olur.
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="encryption-label">Şifreleme</InputLabel>
                    <Select
                      labelId="encryption-label"
                      value={encryption}
                      label="Şifreleme"
                      onChange={(e) => setEncryption(e.target.value)}
                    >
                      <MenuItem value="none">Yok</MenuItem>
                      <MenuItem value="ssl">SSL</MenuItem>
                      <MenuItem value="tls">TLS</MenuItem>
                    </Select>
                    <FormHelperText>Sunucunuzun desteklediği şifreleme türünü seçin</FormHelperText>
                  </FormControl>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    <InfoIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5, color: 'info.main' }} />
                    E-posta iletişiminde kullanılacak şifreleme türü. TLS (Transport Layer Security) modern ve güvenli bir seçenektir. SSL (Secure Sockets Layer) daha eski bir protokoldür. Şifreleme olmadan e-posta göndermek güvenli değildir ve birçok servis sağlayıcı tarafından engellenir.
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      startIcon={<SaveIcon />}
                      onClick={handleSaveSettings}
                    >
                      Ayarları Kaydet
                    </Button>
                    
                    <Button 
                      variant="outlined" 
                      color="secondary" 
                      startIcon={<SendIcon />}
                      onClick={handleTestConnection}
                    >
                      Bağlantıyı Test Et
                    </Button>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    <InfoIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5, color: 'info.main' }} />
                    "Ayarları Kaydet" butonu ile yapılandırmanızı kaydedebilirsiniz. "Bağlantıyı Test Et" butonu ile SMTP sunucusuna bağlantı kurarak ayarlarınızın doğru çalıştığını kontrol edebilirsiniz. Bağlantı testi başarılı olursa, e-posta gönderimi için hazırsınız demektir.
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardHeader title="E-posta Servis Bilgileri" />
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Durum
                </Typography>
                <Typography variant="body1" gutterBottom color={enabled ? "success.main" : "error.main"}>
                  {enabled ? "Aktif" : "Pasif"}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                  SMTP Sunucu
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {smtpHost || "-"}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                  Gönderen
                </Typography>
                <Typography variant="body1">
                  {senderName ? `${senderName} <${senderEmail}>` : senderEmail || "-"}
                </Typography>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader title="E-posta Kullanım Bilgileri" />
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Bugün Gönderilen
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {emailHistory.filter(email => email.date.includes(new Date().toISOString().split('T')[0])).length} E-posta
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                  Bu Ay Gönderilen
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {emailHistory.length} E-posta
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                  Başarı Oranı
                </Typography>
                <Typography variant="body1">
                  {Math.round((emailHistory.filter(email => email.status === 'delivered').length / emailHistory.length) * 100)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Test E-postası Gönder
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Alıcı E-posta Adresi"
                    fullWidth
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    placeholder="recipient@example.com"
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Konu"
                    fullWidth
                    value={testSubject}
                    onChange={(e) => setTestSubject(e.target.value)}
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom sx={{ mb: 1 }}>
                    Mesaj İçeriği
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <RichTextEditor
                      value={testMessage}
                      onChange={setTestMessage}
                      minRows={8}
                      maxRows={12}
                      placeholder="E-posta içeriğini buraya yazın..."
                    />
                  </Box>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<SendIcon />}
                    onClick={handleSendTestEmail}
                    sx={{ mt: 2 }}
                  >
                    Test E-postası Gönder
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title="Test E-postası Bilgileri" />
              <CardContent>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Test e-postası, SMTP ayarlarınızın doğru çalıştığını doğrulamak için kullanılır.
                </Alert>
                
                <Typography variant="body2" sx={{ mt: 2 }}>
                  <InfoIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5, color: 'info.main' }} />
                  Test e-postası gönderebilmek için önce SMTP ayarlarınızı yapılandırmanız ve kaydetmeniz gerekmektedir. Test e-postaları, e-posta servisinizin düzgün çalıştığını doğrulamak ve alıcıların e-postalarınızı nasıl göreceğini kontrol etmek için önemlidir.
                </Typography>
                
                <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Gönderen:
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {senderName ? `${senderName} <${senderEmail}>` : senderEmail || "Tanımlanmamış"}
                  </Typography>
                  
                  <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                    Alıcı:
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {testEmail || "Tanımlanmamış"}
                  </Typography>
                  
                  <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                    Konu:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" gutterBottom>
                      {testSubject}
                    </Typography>
                    <Chip 
                      size="small" 
                      label={`${languages.find(l => l.code === selectedLanguage)?.flag} ${languages.find(l => l.code === selectedLanguage)?.name}`}
                      sx={{ ml: 1, height: '20px' }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                E-posta Şablonları
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={2}>
                {templates.map((template) => (
                  <Grid item xs={12} key={template.id}>
                    <Paper sx={{ p: 0, overflow: 'hidden' }}>
                      <Box sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle1">
                            {template.name}
                          </Typography>
                          {template.translations && (
                            (selectedLanguage === 'tr' && template.translations.tr) ||
                            (selectedLanguage === 'en' && template.translations.en) ||
                            (selectedLanguage === 'de' && template.translations.de)
                          ) && (
                            <Chip 
                              size="small" 
                              label={`${languages.find(l => l.code === selectedLanguage)?.flag}`}
                              sx={{ ml: 1, height: '20px' }}
                            />
                          )}
                        </Box>
                        <Typography variant="body2">
                          {template.translations ? (
                            selectedLanguage === 'tr' ? template.translations.tr?.subject :
                            selectedLanguage === 'en' ? template.translations.en?.subject :
                            selectedLanguage === 'de' ? template.translations.de?.subject :
                            template.subject
                          ) : template.subject}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, pt: 0 }}>
                        {template.active ? (
                          <Chip size="small" label="Aktif" color="success" sx={{ mr: 1 }} />
                        ) : (
                          <Chip size="small" label="Devre Dışı" color="default" sx={{ mr: 1 }} />
                        )}
                        <Button 
                          size="small" 
                          variant="outlined" 
                          color="primary"
                          onClick={() => handleTemplateToggle(template.id)}
                        >
                          {template.active ? 'Devre Dışı Bırak' : 'Aktif Et'}
                        </Button>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          color="primary" 
                          sx={{ ml: 1 }}
                          onClick={(e) => {
                            e.stopPropagation(); // Olay yayılımını durdur
                            console.log('Düzenle butonuna tıklandı', template);
                            handleEditTemplate({...template}); // Kopya gönder
                          }}
                          startIcon={<EditIcon />}
                        >
                          Düzenle
                        </Button>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          color="error" 
                          sx={{ ml: 1 }}
                          onClick={(e) => {
                            e.stopPropagation(); // Olay yayılımını durdur
                            console.log('Sil butonuna tıklandı', template.id);
                            handleDeleteTemplate(template.id);
                          }}
                          startIcon={<DeleteIcon />}
                        >
                          Sil
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
                
                <Grid item xs={12}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                    sx={{ 
                      mt: 2, 
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      boxShadow: 3,
                      '&:hover': {
                        boxShadow: 6,
                        backgroundColor: 'primary.dark'
                      }
                    }}
                    onClick={handleAddNewTemplate}
                    startIcon={<AddIcon sx={{ fontSize: 24 }} />}
                  >
                    Yeni Şablon Ekle
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title="Şablon Bilgileri" />
              <CardContent>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>E-posta şablonları nedir?</strong> E-posta şablonları, otomatik e-postalar için içerik ve format tanımlar. Şablonlar sayesinde her seferinde yeni bir e-posta oluşturmak yerine, önceden hazırlanmış içerikleri kullanabilirsiniz.
                  </Typography>
                </Alert>
                
                <Typography variant="body2" sx={{ mt: 2 }}>
                  <InfoIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5, color: 'info.main' }} />
                  <strong>Şablonların faydaları:</strong> Şablonlar, müşteri iletişiminde tutarlılık sağlar ve e-posta oluşturma sürecini hızlandırır. Ayrıca, marka kimliğinizi korumanıza, profesyonel görünüm sağlamanıza ve müşteri deneyimini iyileştirmenize yardımcı olur.
                </Typography>
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Aktif Şablonlar:
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {templates.filter(t => t.active).length} / {templates.length}
                  </Typography>
                  
                  <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                    Kullanılabilir Değişkenler:
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <InfoIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5, color: 'info.main' }} />
                    Değişkenler, e-posta şablonlarında dinamik içerik oluşturmanızı sağlar. Örneğin, {'{{'} name {'}}'}  değişkeni her alıcının kendi adıyla değiştirilir.
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    <Chip label="{'{{'} name {'}}'}" size="small" title="Alıcının adı" />
                    <Chip label="{'{{'} email {'}}'}" size="small" title="Alıcının e-posta adresi" />
                    <Chip label="{'{{'} order_id {'}}'}" size="small" title="Sipariş numarası" />
                    <Chip label="{'{{'} date {'}}'}" size="small" title="Güncel tarih" />
                    <Chip label="{'{{'} company {'}}'}" size="small" title="Şirket adı" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                E-posta Gönderim Geçmişi
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>E-posta geçmişi nedir?</strong> Bu bölümde, sistemden gönderilen tüm e-postaların kaydını görebilirsiniz. Başarılı ve başarısız gönderimler, alıcılar, konular ve gönderim tarihleri burada listelenir. Bu bilgiler, sorun giderme ve iletişim takibi için önemlidir.
                </Typography>
              </Alert>
              
              <Box sx={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                      <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Alıcı</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Konu</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Durum</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Tarih</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emailHistory.map((email) => (
                      <tr key={email.id}>
                        <td style={{ padding: '12px 16px', borderBottom: '1px solid #eee' }}>{email.id}</td>
                        <td style={{ padding: '12px 16px', borderBottom: '1px solid #eee' }}>{email.recipient}</td>
                        <td style={{ padding: '12px 16px', borderBottom: '1px solid #eee' }}>{email.subject}</td>
                        <td style={{ padding: '12px 16px', borderBottom: '1px solid #eee' }}>
                          <Chip 
                            icon={email.status === 'delivered' ? <CheckCircleIcon fontSize="small" /> : <ErrorIcon fontSize="small" />}
                            label={email.status === 'delivered' ? 'Gönderildi' : 'Başarısız'} 
                            color={email.status === 'delivered' ? 'success' : 'error'}
                            size="small"
                          />
                        </td>
                        <td style={{ padding: '12px 16px', borderBottom: '1px solid #eee' }}>{email.date}</td>
                        <td style={{ padding: '12px 16px', borderBottom: '1px solid #eee' }}>
                          <Button 
                            size="small" 
                            variant="text" 
                            onClick={() => {
                              setSelectedEmail(email);
                              setDetailsDialogOpen(true);
                            }}
                          >
                            Detaylar
                          </Button>
                          <Button 
                            size="small" 
                            variant="text" 
                            color="primary" 
                            onClick={() => handleResendEmail(email)}
                            disabled={resendingEmail}
                          >
                            Tekrar Gönder
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
              
              {emailHistory.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Henüz e-posta gönderim kaydı bulunmamaktadır.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Şablon Düzenleme Dialog'u */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        sx={{ zIndex: 1500 }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #eee', pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EditIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" component="span">
              E-posta Şablonu Düzenle
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={() => setEditDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
            Şablon bilgilerini düzenleyebilir ve farklı dillerdeki çevirileri güncelleyebilirsiniz.
          </Typography>
          
          <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ width: '100%', mb: 1 }}>
              Şablon Dili Seçin:
            </Typography>
            {languages.map((lang) => (
              <Chip
                key={lang.code}
                label={`${lang.flag} ${lang.name}`}
                onClick={() => handleLanguageSwitch(lang.code)}
                variant={editingLanguage === lang.code ? "filled" : "outlined"}
                color={editingLanguage === lang.code ? "primary" : "default"}
                sx={{ m: 0.5 }}
              />
            ))}
          </Box>
          
          <TextField
            fullWidth
            label="Şablon Adı"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            margin="normal"
            variant="outlined"
            required
            helperText="Bu isim sadece yönetim panelinde görüntülenecektir"
          />
          
          <TextField
            fullWidth
            label="E-posta Konusu"
            value={templateSubject}
            onChange={(e) => setTemplateSubject(e.target.value)}
            margin="normal"
            variant="outlined"
            required
            helperText="Bu konu, gönderilen e-postaların konu satırında görünecektir"
          />
          
          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, display: 'flex', alignItems: 'center' }}>
            <EditIcon sx={{ mr: 1, fontSize: '1rem', color: 'primary.main' }} />
            E-posta İçeriği
          </Typography>
          
          <Paper elevation={0} sx={{ border: '1px solid #ddd', borderRadius: 1 }}>
            <RichTextEditor 
               
              value={templateContent} 
              onChange={setTemplateContent}
              minRows={10} maxRows={15} placeholder="İçeriği buraya yazın..."
            />
          </Paper>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0, borderTop: '1px solid #eee', mt: 2 }}>
          <Button 
            onClick={() => setEditDialogOpen(false)}
            variant="outlined"
            startIcon={<CloseIcon />}
          >
            Vazgeç
          </Button>
          <Button 
            onClick={handleSaveTemplate} 
            variant="contained" 
            color="primary"
            startIcon={<SaveIcon />}
            sx={{ ml: 2 }}
          >
            Değişiklikleri Kaydet
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Yeni Şablon Ekleme Dialog'u */}
      <Dialog 
        open={newTemplateDialogOpen} 
        onClose={() => setNewTemplateDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        sx={{ zIndex: 1500 }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #eee', pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SaveIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" component="span">
              Yeni E-posta Şablonu Oluştur
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={() => setNewTemplateDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
            Aşağıdaki bilgileri doldurarak yeni bir e-posta şablonu oluşturabilirsiniz.
            Şablonunuz tüm dillerde kullanılabilir olacaktır.
          </Typography>
          
          <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ width: '100%', mb: 1 }}>
              Şablon Dili Seçin:
            </Typography>
            {languages.map((lang) => (
              <Chip
                key={lang.code}
                label={`${lang.flag} ${lang.name}`}
                onClick={() => handleLanguageSwitch(lang.code)}
                variant={editingLanguage === lang.code ? "filled" : "outlined"}
                color={editingLanguage === lang.code ? "primary" : "default"}
                sx={{ m: 0.5 }}
              />
            ))}
          </Box>
          
          <TextField
            fullWidth
            label="Şablon Adı"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            margin="normal"
            variant="outlined"
            required
            helperText="Bu isim sadece yönetim panelinde görüntülenecektir"
          />
          
          <TextField
            fullWidth
            label="E-posta Konusu"
            value={templateSubject}
            onChange={(e) => setTemplateSubject(e.target.value)}
            margin="normal"
            variant="outlined"
            required
            helperText="Bu konu, gönderilen e-postaların konu satırında görünecektir"
          />
          
          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, display: 'flex', alignItems: 'center' }}>
            <SaveIcon sx={{ mr: 1, fontSize: '1rem', color: 'primary.main' }} />
            E-posta İçeriği
          </Typography>
          
          <Paper elevation={0} sx={{ border: '1px solid #ddd', borderRadius: 1 }}>
            <RichTextEditor 
               
              value={templateContent} 
              onChange={setTemplateContent}
              minRows={10} maxRows={15} placeholder="İçeriği buraya yazın..."
            />
          </Paper>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0, borderTop: '1px solid #eee', mt: 2 }}>
          <Button 
            onClick={() => setNewTemplateDialogOpen(false)}
            variant="outlined"
            startIcon={<CloseIcon />}
          >
            Vazgeç
          </Button>
          <Button 
            onClick={handleCreateTemplate} 
            variant="contained" 
            color="primary"
            startIcon={<SaveIcon />}
            sx={{ ml: 2 }}
          >
            Şablonu Kaydet
          </Button>
        </DialogActions>
      </Dialog>

      {/* Şablon Silme Onay Diyaloğu */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        sx={{ zIndex: 1600 }}
      >
        <DialogTitle id="delete-dialog-title" sx={{ borderBottom: '1px solid #eee', pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DeleteIcon sx={{ mr: 1, color: 'error.main' }} />
            <Typography variant="h6" component="span">
              Şablonu Sil
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2, minWidth: '400px' }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <AlertTitle>Dikkat!</AlertTitle>
            Bu işlem geri alınamaz. Şablon kalıcı olarak silinecektir.
          </Alert>
          <Typography variant="body1" id="delete-dialog-description">
            Seçilen e-posta şablonunu silmek istediğinizden emin misiniz?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Bu şablonu kullanan otomatik e-postalar artık gönderilemeyecektir.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0, borderTop: '1px solid #eee' }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            startIcon={<CloseIcon />}
          >
            Vazgeç
          </Button>
          <Button 
            onClick={confirmDeleteTemplate}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            sx={{ ml: 2 }}
          >
            Evet, Şablonu Sil
          </Button>
        </DialogActions>
      </Dialog>

      {/* E-posta Detayları Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={handleCloseDetailsDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          E-posta Detayları
          <IconButton
            aria-label="close"
            onClick={handleCloseDetailsDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedEmail && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">Genel Bilgiler</Typography>
                <Divider sx={{ my: 1 }} />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">E-posta ID</Typography>
                <Typography variant="body1">{selectedEmail.id}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Gönderim Tarihi</Typography>
                <Typography variant="body1">{selectedEmail.date}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Durum</Typography>
                <Chip 
                  icon={selectedEmail.status === 'delivered' ? <CheckCircleIcon fontSize="small" /> : <ErrorIcon fontSize="small" />}
                  label={selectedEmail.status === 'delivered' ? 'Gönderildi' : 'Başarısız'} 
                  color={selectedEmail.status === 'delivered' ? 'success' : 'error'}
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>Alıcı Bilgileri</Typography>
                <Divider sx={{ my: 1 }} />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Alıcı E-posta</Typography>
                <Typography variant="body1">{selectedEmail.recipient}</Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>E-posta İçeriği</Typography>
                <Divider sx={{ my: 1 }} />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Konu</Typography>
                <Typography variant="body1">{selectedEmail.subject}</Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Mesaj</Typography>
                <Paper 
                  variant="outlined" 
                  sx={{ p: 2, mt: 1, minHeight: '200px', bgcolor: '#f9f9f9' }}
                >
                  <div dangerouslySetInnerHTML={{ __html: selectedEmail.content || '<p>E-posta içeriği bulunamadı.</p>' }} />
                </Paper>
              </Grid>
              
              {selectedEmail.status !== 'delivered' && (
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Alert severity="warning">
                    <AlertTitle>Gönderim Başarısız</AlertTitle>
                    Bu e-posta gönderilirken bir hata oluştu. Aşağıdaki "Tekrar Gönder" butonunu kullanarak yeniden göndermeyi deneyebilirsiniz.
                  </Alert>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsDialog}>Kapat</Button>
          {selectedEmail && selectedEmail.status !== 'delivered' && (
            <Button 
              variant="contained" 
              startIcon={<SendIcon />} 
              onClick={() => {
                handleResendEmail(selectedEmail);
                handleCloseDetailsDialog();
              }}
              disabled={resendingEmail}
            >
              Tekrar Gönder
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EmailSettingsPage;
