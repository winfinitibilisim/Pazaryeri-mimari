import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography 
} from '@mui/material';

interface HelpDialogProps {
  open: boolean;
  onClose: () => void;
}

const HelpDialog: React.FC<HelpDialogProps> = ({
  open,
  onClose
}) => {
  const { t } = useLanguage();

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 2
        }
      }}
    >
      <DialogTitle>{t('help.title')}</DialogTitle>
      <DialogContent>
        <Typography>{t('help.content')}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t('general.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HelpDialog; 