import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography // Eklendi
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string; // Opsiyonel yapıldı
  message?: string; // Opsiyonel yapıldı
  confirmText?: string;
  cancelText?: string;
  itemName?: string; // Yeni prop eklendi
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  itemName, // Kullanılıyor
}) => {
  const { t } = useTranslation();

  // Varsayılan başlık ve mesajlar çeviri dosyalarından alınacak
  const dialogTitle = title || t('confirmationDialog.defaultTitle', 'İşlemi Onayla');
  const dialogMessage = message || (itemName
    ? t('confirmationDialog.defaultMessageItem', { itemName: itemName, defaultValue: `"${itemName}" öğesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.` })
    : t('confirmationDialog.defaultMessage', 'Bu işlemi gerçekleştirmek istediğinizden emin misiniz? Bu işlem geri alınamaz.'));
  const finalConfirmText = confirmText || t('confirmationDialog.confirm', 'Onayla');
  const finalCancelText = cancelText || t('confirmationDialog.cancel', 'İptal');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      PaperProps={{ sx: { minWidth: '320px', maxWidth: '500px' } }} // Opsiyonel: Dialog genişliği
    >
      <DialogTitle id="confirmation-dialog-title">
        {/* Typography ile başlık */}
        <Typography variant="h6" component="div"> 
          {dialogTitle}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirmation-dialog-description">
          {dialogMessage}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'flex-end' }}> {/* Stil düzenlemesi */}
        <Button onClick={onClose} color="inherit" variant="outlined" sx={{ mr: 1 }}> {/* Stil düzenlemesi */}
          {finalCancelText}
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" autoFocus> {/* Stil düzenlemesi: error rengi */}
          {finalConfirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
