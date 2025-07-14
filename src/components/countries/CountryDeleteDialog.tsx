import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import { Close as CloseIcon, Warning as WarningIcon } from '@mui/icons-material';
import { Country } from '../../types/Country';

interface CountryDeleteDialogProps {
  open: boolean;
  country: Country | null;
  onClose: () => void;
  onConfirm: () => void;
}

const CountryDeleteDialog: React.FC<CountryDeleteDialogProps> = ({
  open,
  country,
  onClose,
  onConfirm
}) => {
  const { translations } = useLanguage();
  if (!country) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon sx={{ color: '#f44336' }} />
          <Typography variant="h6">{translations.attention || "Dikkat!"}</Typography>
        </Box>
        <IconButton aria-label="close" onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Typography variant="body1" sx={{ mb: 2 }}>
            {`${translations.areYouSureDelete || "Silmek istediğinize emin misiniz?"} `}<strong>{country.name}</strong> {translations.country.toLowerCase()}? {translations.thisActionCannotBeUndone || "Bu işlem geri alınamaz."}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {translations.countryDeleteWarning || "Bu ülkeye ait tüm şehirler, ilçeler ve müşteri verileri de silinecektir."}
          </Typography>
          {country.customerCount > 0 && (
            <Box sx={{ mt: 2, p: 2, bgcolor: '#fff3e0', borderRadius: 1 }}>
              <Typography variant="body2" color="warning.dark">
                <strong>{translations.warning || "Uyarı"}:</strong> {translations.countryCustomerWarning || "Bu ülkeye ait"} <strong>{country.customerCount.toLocaleString()}</strong> {translations.customerCount.toLowerCase()} {translations.exists || "bulunmaktadır"}.
              </Typography>
            </Box>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {translations.close}
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" autoFocus>
          {translations.delete}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CountryDeleteDialog;
