import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import { Customer } from '../../types/Customer';

interface CustomerDeleteDialogProps {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
  onConfirm: () => void;
}

const CustomerDeleteDialog: React.FC<CustomerDeleteDialogProps> = ({
  open,
  customer,
  onClose,
  onConfirm
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ color: '#f44336', fontWeight: 500 }}>
        Müşteri Silme Onayı
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Bu müşteriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          İptal
        </Button>
        <Button onClick={onConfirm} variant="contained" sx={{ bgcolor: '#f44336', '&:hover': { bgcolor: '#d32f2f' } }}>
          Sil
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerDeleteDialog;
