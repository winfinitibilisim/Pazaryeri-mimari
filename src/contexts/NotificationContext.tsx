import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Alert, Snackbar, SnackbarProps, Box, Typography, IconButton } from '@mui/material';
import { setNotificationFunction } from '../utils/notification';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';

// Bildirim türleri
export type NotificationSeverity = 'info' | 'success' | 'warning' | 'error';

// Bildirim işlem türleri
export type NotificationActionType = 'save' | 'update' | 'delete' | 'create' | 'generic';

// Bildirim seçenekleri
export interface NotificationOptions {
  severity?: NotificationSeverity;
  autoHideDuration?: number;
  anchorOrigin?: SnackbarProps['anchorOrigin'];
  actionType?: NotificationActionType;
  title?: string;
}

// Bildirim bağlamı için arayüz
interface NotificationContextType {
  show: (message: string, options?: NotificationOptions) => void;
  showSuccess: (message: string, actionType?: NotificationActionType, options?: NotificationOptions) => void;
  showError: (message: string, options?: NotificationOptions) => void;
  showSaveSuccess: (message: string, options?: NotificationOptions) => void;
  showUpdateSuccess: (message: string, options?: NotificationOptions) => void;
  showDeleteSuccess: (message: string, options?: NotificationOptions) => void;
  showCreateSuccess: (message: string, options?: NotificationOptions) => void;
  hide: () => void;
}

// Varsayılan değerler
const defaultOptions: NotificationOptions = {
  severity: 'info',
  autoHideDuration: 5000, // 5 saniye
  anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
  actionType: 'generic'
};

// İşlem türüne göre varsayılan başlıklar
const getDefaultTitle = (actionType: NotificationActionType, severity: NotificationSeverity): string => {
  if (severity === 'error') return 'Hata';
  
  switch (actionType) {
    case 'save': return 'Kaydedildi';
    case 'update': return 'Güncellendi';
    case 'delete': return 'Silindi';
    case 'create': return 'Oluşturuldu';
    default: return severity === 'success' ? 'Başarılı' : 'Bilgi';
  }
};

// Bildirim bağlamını oluştur
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Bildirim sağlayıcı bileşeni
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [options, setOptions] = useState<NotificationOptions>(defaultOptions);

  // Bildirimi göster
  const show = (message: string, customOptions?: NotificationOptions) => {
    const mergedOptions = { ...defaultOptions, ...customOptions };
    const title = mergedOptions.title || getDefaultTitle(mergedOptions.actionType!, mergedOptions.severity!);
    
    setMessage(message);
    setOptions({ ...mergedOptions, title });
    setOpen(true);
  };
  
  // İşlem türüne göre bildirim gösterme yardımcı fonksiyonları
  const showSuccess = (message: string, actionType: NotificationActionType = 'generic', customOptions?: NotificationOptions) => {
    show(message, { ...customOptions, severity: 'success', actionType });
  };
  
  const showError = (message: string, customOptions?: NotificationOptions) => {
    show(message, { ...customOptions, severity: 'error', actionType: 'generic' });
  };
  
  // Özel işlem bildirimleri
  const showSaveSuccess = (message: string, customOptions?: NotificationOptions) => {
    showSuccess(message, 'save', customOptions);
  };
  
  const showUpdateSuccess = (message: string, customOptions?: NotificationOptions) => {
    showSuccess(message, 'update', customOptions);
  };
  
  const showDeleteSuccess = (message: string, customOptions?: NotificationOptions) => {
    showSuccess(message, 'delete', customOptions);
  };
  
  const showCreateSuccess = (message: string, customOptions?: NotificationOptions) => {
    showSuccess(message, 'create', customOptions);
  };

  // Bildirimi gizle
  const hide = () => {
    setOpen(false);
  };
  
  // Global bildirim fonksiyonunu ayarla
  useEffect(() => {
    setNotificationFunction(show);
    return () => setNotificationFunction(() => {});
  }, []);

  return (
    <NotificationContext.Provider value={{ 
      show, 
      hide, 
      showSuccess, 
      showError, 
      showSaveSuccess, 
      showUpdateSuccess, 
      showDeleteSuccess, 
      showCreateSuccess 
    }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={options.autoHideDuration}
        onClose={hide}
        anchorOrigin={options.anchorOrigin}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }
        }}
      >
        <Alert
          onClose={hide}
          sx={{ 
            width: '100%', 
            minWidth: { xs: '90%', sm: '320px' },
            maxWidth: { xs: '95%', sm: '400px' },
            display: 'flex',
            alignItems: 'center',
            borderRadius: 1,
            boxShadow: 'none',
            py: 1.5,
            px: 2,
            '& .MuiAlert-icon': {
              fontSize: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              mr: 1.5,
              opacity: 1
            },
            ...(options.severity === 'success' && {
              backgroundColor: '#4caf50',
              color: '#fff',
              '& .MuiAlert-icon': {
                color: '#fff'
              }
            }),
            ...(options.severity === 'error' && {
              backgroundColor: '#f44336',
              color: '#fff',
              '& .MuiAlert-icon': {
                color: '#fff'
              }
            }),
            ...(options.severity === 'warning' && {
              backgroundColor: '#ff9800',
              color: '#fff',
              '& .MuiAlert-icon': {
                color: '#fff'
              }
            }),
            ...(options.severity === 'info' && {
              backgroundColor: '#2196f3',
              color: '#fff',
              '& .MuiAlert-icon': {
                color: '#fff'
              }
            })
          }}
          variant="filled"
          elevation={0}
          icon={options.severity === 'success' ? <CheckCircleIcon fontSize="inherit" /> : 
                options.severity === 'error' ? <ErrorIcon fontSize="inherit" /> : 
                options.severity === 'warning' ? <WarningIcon fontSize="inherit" /> : 
                <InfoIcon fontSize="inherit" />}
          action={
            <IconButton
              size="small"
              aria-label="close"
              onClick={hide}
              sx={{
                p: 0.5,
                mr: 0.5,
                color: '#fff',
                opacity: 0.8,
                '&:hover': { opacity: 1 }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600, 
                fontSize: '0.95rem',
                mb: 0.25,
                letterSpacing: '0.01em',
                color: '#fff'
              }}
            >
              {options.title}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: '0.875rem',
                lineHeight: 1.5,
                color: 'rgba(255, 255, 255, 0.9)'
              }}
            >
              {message}
            </Typography>
          </Box>
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

// Bildirim hook'u
export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
