import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
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
import { City } from '../../types/Country';

interface CityDeleteDialogProps {
  open: boolean;
  city: City | null;
  onClose: () => void;
  onConfirm: () => void;
}

const CityDeleteDialog: React.FC<CityDeleteDialogProps> = ({
  open,
  city,
  onClose,
  onConfirm
}) => {
  const { translations } = useLanguage();
  if (!city) return null;

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
            {translations.deleteCity}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ pt: 3 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          {translations.thisActionCannotBeUndone}
        </Alert>
        <Typography variant="body1">
          {`${translations.areYouSureDelete || "Silmek istediğinize emin misiniz?"} `} <strong>{city.name}</strong> {translations.city.toLowerCase()}?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {translations.cityDeleteWarning || `Bu şehre bağlı ${city.districts.length} ilçe ve ${city.customerCount} müşteri kaydı bulunmaktadır. Şehri sildiğinizde bu ilçeler ve müşteri ilişkileri de silinecektir.`}
        </Typography>
      </DialogContent>
      
      <Divider />
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined">
          {translations.close}
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          {translations.delete}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CityDeleteDialog;
