/**
 * MessageDialog Bileşeni
 * 
 * Bu bileşen, uygulama genelinde tutarlı bir mesaj dialog deneyimi sağlar.
 * Bilgi, uyarı, hata ve başarı mesajları için kullanılabilir.
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Box,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Mesaj türleri
export type MessageType = 'info' | 'warning' | 'error' | 'success';

// MessageDialog props arayüzü
export interface MessageDialogProps {
  /** Dialog açık/kapalı durumu */
  open: boolean;
  /** Dialog kapatma işleyicisi */
  onClose: () => void;
  /** Başlık */
  title: string;
  /** Ana mesaj içeriği */
  message: string;
  /** İkincil mesaj (opsiyonel) */
  secondaryMessage?: string;
  /** Mesaj türü */
  type?: MessageType;
  /** Onay butonu metni */
  confirmButtonText?: string;
  /** İptal butonu metni */
  cancelButtonText?: string;
  /** Onay butonu tıklama işleyicisi */
  onConfirm?: () => void;
  /** İptal butonu tıklama işleyicisi */
  onCancel?: () => void;
  /** Sadece onay butonu göster */
  showConfirmOnly?: boolean;
  /** Dialog maksimum genişliği */
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * MessageDialog Bileşeni
 */
const MessageDialog: React.FC<MessageDialogProps> = ({
  open,
  onClose,
  title,
  message,
  secondaryMessage,
  type = 'info',
  confirmButtonText = 'Tamam',
  cancelButtonText = 'İptal',
  onConfirm,
  onCancel,
  showConfirmOnly = false,
  maxWidth = 'sm'
}) => {
  // Mesaj türüne göre renk belirleme
  const getAlertColor = () => {
    switch (type) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      case 'info':
      default:
        return 'info';
    }
  };

  // Onay işlemi
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  // İptal işlemi
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      aria-labelledby="message-dialog-title"
      aria-describedby="message-dialog-description"
    >
      <DialogTitle id="message-dialog-title" sx={{ pr: 6 }}>
        {title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Alert severity={getAlertColor()} sx={{ mb: 2 }}>
          <Typography variant="body1" gutterBottom component="div">
            {title}
          </Typography>
          {message}
        </Alert>
        
        <Typography variant="body1" id="message-dialog-description">
          {message}
        </Typography>
        
        {secondaryMessage && (
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            {secondaryMessage}
          </Typography>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 2, bgcolor: '#f9f9f9' }}>
        {!showConfirmOnly && (
          <Button onClick={handleCancel} color="inherit" variant="outlined">
            {cancelButtonText}
          </Button>
        )}
        <Button 
          onClick={handleConfirm} 
          color="error" 
          variant="contained"
          autoFocus
          sx={{ bgcolor: '#d32f2f', '&:hover': { bgcolor: '#b71c1c' } }}
        >
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MessageDialog;
