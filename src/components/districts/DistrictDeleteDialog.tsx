import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
  Divider,
  Alert
} from '@mui/material';
import { Close as CloseIcon, DeleteOutline as DeleteIcon } from '@mui/icons-material';
import { District } from '../../types/Country';

interface DistrictDeleteDialogProps {
  open: boolean;
  district: District | null;
  cityName: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DistrictDeleteDialog: React.FC<DistrictDeleteDialogProps> = ({
  open,
  district,
  cityName,
  onClose,
  onConfirm
}) => {
  if (!district) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DeleteIcon color="error" />
          <Typography variant="h6" component="span">
            İlçe Sil
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ pt: 3 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Bu işlem geri alınamaz!
        </Alert>
        <Typography variant="body1">
          <strong>{district.name}</strong> ilçesini silmek istediğinizden emin misiniz?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Bu ilçe <strong>{cityName}</strong> şehrine bağlıdır ve {district.customerCount} müşteri kaydı bulunmaktadır.
          İlçeyi sildiğinizde müşteri ilişkileri de silinecektir.
        </Typography>
      </DialogContent>
      
      <Divider />
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined">
          İptal
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          Sil
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DistrictDeleteDialog;
