import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  TextField,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';

interface QuickAddProductModalProps {
  open: boolean;
  onClose: () => void;
}

const QuickAddProductModal: React.FC<QuickAddProductModalProps> = ({ open, onClose }) => {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {t('quickAddProduct.title')}
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
      <DialogContent dividers>
        <Box component="form" noValidate autoComplete="off" sx={{ mt: 1 }}>
          <TextField
            required
            fullWidth
            label={t('quickAddProduct.name')}
            margin="normal"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" variant="contained">
          {t('quickAddProduct.cancel')}
        </Button>
        <Button onClick={onClose} variant="contained">
          {t('quickAddProduct.add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuickAddProductModal;
